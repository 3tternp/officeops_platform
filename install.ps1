# ===================================
# OfficeOps Platform Auto Installer
# Version: 2.3.0
# Platform: Windows
# ===================================

#Requires -RunAsAdministrator

param(
    [switch]$Development,
    [switch]$NoDocker,
    [switch]$NoDatabase,
    [switch]$SSL,
    [switch]$Help,
    [string]$InstallPath = "C:\OfficeOps"
)

# Configuration
$APP_NAME = "OfficeOps Platform"
$APP_VERSION = "2.3.0"
$FRONTEND_PORT = 4028
$BACKEND_PORT = 3001
$DB_NAME = "officeops"
$DB_USER = "officeops_user"

# Installation options
$INSTALL_DOCKER = -not $NoDocker
$INSTALL_DATABASE = -not $NoDatabase
$INSTALL_SSL = $SSL
$DEVELOPMENT_MODE = $Development

# Color functions for output
function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success($Message) {
    Write-ColorOutput Green "✅ $Message"
}

function Write-Error-Custom($Message) {
    Write-ColorOutput Red "❌ ERROR: $Message"
}

function Write-Warning-Custom($Message) {
    Write-ColorOutput Yellow "⚠️  $Message"
}

function Write-Info($Message) {
    Write-ColorOutput Cyan "ℹ️  $Message"
}

function Write-Log($Message) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-ColorOutput Blue "[$timestamp] $Message"
}

# Print banner
function Show-Banner {
    Clear-Host
    Write-ColorOutput Magenta @"
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              OfficeOps Platform Auto Installer                   ║
║                        Version 2.3.0                            ║
║                                                                  ║
║  🚀 Production-Ready Enterprise Management Platform              ║
║  ✅ Complete Risk Assessment System                              ║
║  ✅ Full Asset Management CRUD                                   ║
║  ✅ User & Profile Management                                    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
"@
    Write-Output ""
}

# Show help
function Show-Help {
    Write-ColorOutput White "Usage: .\install.ps1 [OPTIONS]"
    Write-Output ""
    Write-ColorOutput White "Options:"
    Write-ColorOutput Green "  -Development        Install in development mode"
    Write-ColorOutput Green "  -NoDocker          Skip Docker Desktop installation"
    Write-ColorOutput Green "  -NoDatabase        Skip PostgreSQL installation"
    Write-ColorOutput Green "  -SSL               Enable SSL configuration"
    Write-ColorOutput Green "  -InstallPath       Custom installation path (default: C:\OfficeOps)"
    Write-ColorOutput Green "  -Help              Show this help message"
    Write-Output ""
    Write-ColorOutput White "Examples:"
    Write-ColorOutput Gray "  .\install.ps1                     # Standard installation"
    Write-ColorOutput Gray "  .\install.ps1 -Development        # Development mode"
    Write-ColorOutput Gray "  .\install.ps1 -NoDocker          # Skip Docker installation"
    Write-Output ""
}

# Check if running as administrator
function Test-AdminRights {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check system requirements
function Test-SystemRequirements {
    Write-Log "🔍 Checking system requirements..."
    
    $errors = @()
    
    # Check Windows version
    $osVersion = [System.Environment]::OSVersion.Version
    if ($osVersion.Major -lt 10) {
        $errors += "Windows 10 or later is required"
    }
    
    # Check PowerShell version
    if ($PSVersionTable.PSVersion.Major -lt 5) {
        $errors += "PowerShell 5.0 or later is required"
    }
    
    # Check available disk space (at least 2GB)
    $drive = (Get-Item $InstallPath).PSDrive.Name + ":"
    $freeSpace = (Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='$drive'").FreeSpace
    if ($freeSpace -lt 2GB) {
        $errors += "At least 2GB of free disk space is required"
    }
    
    if ($errors.Count -gt 0) {
        Write-Error-Custom "System requirements not met:"
        foreach ($error in $errors) {
            Write-Output "  - $error"
        }
        exit 1
    }
    
    Write-Success "System requirements check passed"
}

# Install Chocolatey package manager
function Install-Chocolatey {
    Write-Log "🍫 Installing Chocolatey package manager..."
    
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        Write-Success "Chocolatey is already installed"
        return
    }
    
    try {
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        
        # Refresh environment variables
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
        
        Write-Success "Chocolatey installed successfully"
    }
    catch {
        Write-Error-Custom "Failed to install Chocolatey: $($_.Exception.Message)"
        exit 1
    }
}

# Install Git
function Install-Git {
    Write-Log "📦 Installing Git..."
    
    if (Get-Command git -ErrorAction SilentlyContinue) {
        Write-Success "Git is already installed"
        return
    }
    
    try {
        choco install git -y
        # Refresh environment variables
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
        Write-Success "Git installed successfully"
    }
    catch {
        Write-Error-Custom "Failed to install Git: $($_.Exception.Message)"
        exit 1
    }
}

# Install Node.js
function Install-NodeJS {
    Write-Log "🟢 Installing Node.js..."
    
    # Check if Node.js is already installed with correct version
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeVersion = node --version
        $majorVersion = [int]($nodeVersion.Substring(1).Split('.')[0])
        if ($majorVersion -ge 18) {
            Write-Success "Node.js $nodeVersion is already installed"
            return
        }
    }
    
    try {
        choco install nodejs --version=18.19.0 -y
        # Refresh environment variables
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
        
        # Verify installation
        $nodeVersion = node --version
        $npmVersion = npm --version
        Write-Success "Node.js $nodeVersion and npm $npmVersion installed successfully"
    }
    catch {
        Write-Error-Custom "Failed to install Node.js: $($_.Exception.Message)"
        exit 1
    }
}

# Install Docker Desktop
function Install-Docker {
    if (-not $INSTALL_DOCKER) {
        Write-Log "⏭️  Skipping Docker Desktop installation"
        return
    }
    
    Write-Log "🐳 Installing Docker Desktop..."
    
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-Success "Docker is already installed"
        return
    }
    
    try {
        choco install docker-desktop -y
        Write-Success "Docker Desktop installed successfully"
        Write-Warning-Custom "Please restart your computer and start Docker Desktop manually after installation"
    }
    catch {
        Write-Error-Custom "Failed to install Docker Desktop: $($_.Exception.Message)"
        Write-Info "You can download Docker Desktop manually from https://docs.docker.com/desktop/install/windows/"
    }
}

# Install PostgreSQL
function Install-PostgreSQL {
    if (-not $INSTALL_DATABASE) {
        Write-Log "⏭️  Skipping PostgreSQL installation"
        return
    }
    
    Write-Log "🗄️  Installing PostgreSQL..."
    
    try {
        choco install postgresql --version=15.5.0 -y --params '/Password:postgres123'
        
        # Start PostgreSQL service
        Start-Service postgresql*
        Set-Service postgresql* -StartupType Automatic
        
        Write-Success "PostgreSQL installed successfully"
    }
    catch {
        Write-Error-Custom "Failed to install PostgreSQL: $($_.Exception.Message)"
        Write-Info "You can download PostgreSQL manually from https://www.postgresql.org/download/windows/"
    }
}

# Create application directory and setup
function Setup-Application {
    Write-Log "📥 Setting up OfficeOps Platform..."
    
    # Create installation directory
    if (-not (Test-Path $InstallPath)) {
        New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    }
    
    # Copy files or clone repository
    if (Test-Path ".git") {
        Write-Log "Copying current repository to $InstallPath"
        Copy-Item -Path "." -Destination $InstallPath -Recurse -Force -Exclude @('.git', 'node_modules', 'dist', '.env')
    } else {
        Write-Log "Cloning OfficeOps Platform repository..."
        git clone https://github.com/yourusername/officeops-platform.git $InstallPath
    }
    
    # Navigate to installation directory
    Set-Location $InstallPath
    
    # Install npm dependencies
    Write-Log "Installing Node.js dependencies..."
    if ($DEVELOPMENT_MODE) {
        npm install
    } else {
        npm ci --only=production
    }
    
    Write-Success "Application setup completed"
}

# Configure environment variables
function Set-Environment {
    Write-Log "⚙️  Configuring environment..."
    
    $envFile = Join-Path $InstallPath ".env"
    
    if (-not (Test-Path $envFile)) {
        Write-Log "Creating environment configuration..."
        Copy-Item (Join-Path $InstallPath ".env.example") $envFile
        
        # Generate random secrets
        $jwtSecret = [System.Web.Security.Membership]::GeneratePassword(64, 16)
        $sessionSecret = [System.Web.Security.Membership]::GeneratePassword(64, 16)
        $dbPassword = [System.Web.Security.Membership]::GeneratePassword(32, 8)
        
        # Get local IP address
        $localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias (Get-NetAdapter | Where-Object Status -eq "Up" | Select-Object -First 1).Name).IPAddress
        
        # Update configuration file
        $envContent = Get-Content $envFile
        $envContent = $envContent -replace "NODE_ENV=development", "NODE_ENV=production"
        $envContent = $envContent -replace "APP_URL=http://localhost:4028", "APP_URL=http://$localIP`:$FRONTEND_PORT"
        $envContent = $envContent -replace "JWT_SECRET=.*", "JWT_SECRET=$jwtSecret"
        $envContent = $envContent -replace "SESSION_SECRET=.*", "SESSION_SECRET=$sessionSecret"
        $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$dbPassword"
        
        if ($DEVELOPMENT_MODE) {
            $envContent = $envContent -replace "NODE_ENV=production", "NODE_ENV=development"
            $envContent = $envContent -replace "DEBUG=false", "DEBUG=true"
        }
        
        Set-Content -Path $envFile -Value $envContent
        
        Write-Success "Environment configuration created"
    } else {
        Write-Success "Environment configuration already exists"
    }
}

# Setup database
function Setup-Database {
    if (-not $INSTALL_DATABASE) {
        Write-Log "⏭️  Skipping database setup"
        return
    }
    
    Write-Log "🗄️  Setting up database..."
    
    try {
        # Read database password from .env file
        $envContent = Get-Content (Join-Path $InstallPath ".env")
        $dbPasswordLine = $envContent | Where-Object { $_ -match "^DB_PASSWORD=" }
        $dbPassword = $dbPasswordLine.Split('=')[1]
        
        # Create database and user using psql
        $psqlPath = (Get-Command psql -ErrorAction SilentlyContinue).Source
        if (-not $psqlPath) {
            $psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
        }
        
        $env:PGPASSWORD = "postgres123"
        & $psqlPath -U postgres -c "CREATE DATABASE $DB_NAME;" 2>$null
        & $psqlPath -U postgres -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$dbPassword';" 2>$null
        & $psqlPath -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>$null
        
        Write-Success "Database setup completed"
    }
    catch {
        Write-Warning-Custom "Database setup encountered issues, but continuing with installation"
    }
}

# Build application
function Build-Application {
    Write-Log "🔨 Building application..."
    
    Set-Location $InstallPath
    
    try {
        npm run build
        Write-Success "Application built successfully"
    }
    catch {
        Write-Error-Custom "Failed to build application: $($_.Exception.Message)"
        exit 1
    }
}

# Create Windows service
function New-WindowsService {
    Write-Log "🔧 Creating Windows service..."
    
    try {
        # Install node-windows for service creation
        npm install -g node-windows
        
        # Create service script
        $serviceScript = @"
var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'OfficeOps Platform',
  description: 'OfficeOps Platform Enterprise Management System',
  script: '$InstallPath\\server.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ],
  env: {
    name: 'NODE_ENV',
    value: 'production'
  }
});

// Listen for the "install" event, which indicates the process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
"@
        
        $serviceScript | Out-File -FilePath (Join-Path $InstallPath "install-service.js") -Encoding UTF8
        
        # Install the service (if server.js exists)
        if (Test-Path (Join-Path $InstallPath "server.js")) {
            node (Join-Path $InstallPath "install-service.js")
            Write-Success "Windows service created successfully"
        } else {
            Write-Info "No backend server found, skipping service creation"
        }
    }
    catch {
        Write-Warning-Custom "Failed to create Windows service: $($_.Exception.Message)"
    }
}

# Setup Windows Firewall
function Set-Firewall {
    Write-Log "🔥 Configuring Windows Firewall..."
    
    try {
        # Allow application through firewall
        New-NetFirewallRule -DisplayName "OfficeOps Platform Frontend" -Direction Inbound -Protocol TCP -LocalPort $FRONTEND_PORT -Action Allow -ErrorAction SilentlyContinue
        New-NetFirewallRule -DisplayName "OfficeOps Platform Backend" -Direction Inbound -Protocol TCP -LocalPort $BACKEND_PORT -Action Allow -ErrorAction SilentlyContinue
        
        if ($INSTALL_SSL) {
            New-NetFirewallRule -DisplayName "OfficeOps Platform HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow -ErrorAction SilentlyContinue
        }
        
        Write-Success "Windows Firewall configured"
    }
    catch {
        Write-Warning-Custom "Failed to configure Windows Firewall: $($_.Exception.Message)"
    }
}

# Start services
function Start-Services {
    Write-Log "🚀 Starting services..."
    
    Set-Location $InstallPath
    
    if ($DEVELOPMENT_MODE) {
        Write-Log "Starting in development mode with Docker Compose..."
        if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
            docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --profile dev
        } else {
            Write-Info "Docker Compose not available, starting with npm..."
            Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
        }
    } else {
        # Start the Windows service if it exists
        $service = Get-Service -Name "OfficeOps Platform" -ErrorAction SilentlyContinue
        if ($service) {
            Start-Service -Name "OfficeOps Platform"
            Write-Success "OfficeOps Platform service started"
        } else {
            # Start manually with npm
            Write-Log "Starting application manually..."
            Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow
        }
    }
    
    Write-Success "Services started successfully"
}

# Verify installation
function Test-Installation {
    Write-Log "🔍 Verifying installation..."
    
    $errors = 0
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias (Get-NetAdapter | Where-Object Status -eq "Up" | Select-Object -First 1).Name).IPAddress
    
    # Wait for services to start
    Start-Sleep -Seconds 10
    
    # Check if application is responding
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$FRONTEND_PORT" -TimeoutSec 30 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Success "Application is responding on port $FRONTEND_PORT"
        }
    }
    catch {
        Write-Error-Custom "Application is not responding on port $FRONTEND_PORT"
        $errors++
    }
    
    # Check database connection (if installed)
    if ($INSTALL_DATABASE) {
        try {
            $env:PGPASSWORD = "postgres123"
            $psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
            & $psqlPath -U postgres -d $DB_NAME -c "SELECT 1;" 2>$null
            Write-Success "Database connection verified"
        }
        catch {
            Write-Error-Custom "Database connection failed"
            $errors++
        }
    }
    
    if ($errors -eq 0) {
        Write-Success "Installation verification completed successfully"
        return $true
    } else {
        Write-Error-Custom "Installation verification failed with $errors errors"
        return $false
    }
}

# Show completion message
function Show-Completion {
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias (Get-NetAdapter | Where-Object Status -eq "Up" | Select-Object -First 1).Name).IPAddress
    
    Write-Output ""
    Write-Success "🎉 OfficeOps Platform installation completed successfully!"
    Write-Output ""
    Write-ColorOutput White "📋 Installation Summary:"
    Write-Output "  • Application Directory: $InstallPath"
    Write-Output "  • Frontend Port: $FRONTEND_PORT"
    Write-Output "  • Backend Port: $BACKEND_PORT"
    
    Write-Output ""
    Write-ColorOutput White "🌐 Access URLs:"
    Write-ColorOutput Green "  • Application: http://$localIP`:$FRONTEND_PORT"
    Write-ColorOutput Green "  • Local Access: http://localhost:$FRONTEND_PORT"
    
    Write-Output ""
    Write-ColorOutput White "👤 Demo Accounts:"
    Write-ColorOutput Green "  • Admin: admin@demo.com / admin123"
    Write-ColorOutput Green "  • ISO: iso@demo.com / iso123"
    Write-ColorOutput Green "  • Manager: manager@demo.com / mgr123"
    Write-ColorOutput Green "  • Employee: employee@demo.com / emp123"
    
    Write-Output ""
    Write-ColorOutput White "🔧 Service Management:"
    if ($DEVELOPMENT_MODE) {
        Write-ColorOutput Cyan "  • View Logs: docker-compose logs -f"
        Write-ColorOutput Cyan "  • Stop Services: docker-compose down"
        Write-ColorOutput Cyan "  • Start Services: docker-compose up -d"
    } else {
        Write-ColorOutput Cyan "  • Service Status: Get-Service 'OfficeOps Platform'"
        Write-ColorOutput Cyan "  • Start Service: Start-Service 'OfficeOps Platform'"
        Write-ColorOutput Cyan "  • Stop Service: Stop-Service 'OfficeOps Platform'"
    }
    
    Write-Output ""
    Write-ColorOutput White "📚 Documentation:"
    Write-ColorOutput Cyan "  • README: $InstallPath\README.md"
    Write-ColorOutput Cyan "  • Configuration: $InstallPath\.env"
    Write-Output ""
    Write-ColorOutput Green "🚀 Your OfficeOps Platform is ready to use!"
    Write-Output ""
}

# Main installation function
function Start-Installation {
    # Show banner
    Show-Banner
    
    # Show help if requested
    if ($Help) {
        Show-Help
        return
    }
    
    # Check if running as administrator
    if (-not (Test-AdminRights)) {
        Write-Error-Custom "This script must be run as Administrator"
        Write-Info "Right-click on PowerShell and select 'Run as Administrator'"
        exit 1
    }
    
    Write-Log "🚀 Starting OfficeOps Platform installation..."
    
    # Add System.Web assembly for password generation
    Add-Type -AssemblyName System.Web
    
    try {
        Test-SystemRequirements
        Install-Chocolatey
        Install-Git
        Install-NodeJS
        Install-Docker
        Install-PostgreSQL
        Setup-Application
        Set-Environment
        Setup-Database
        Build-Application
        
        if (-not $DEVELOPMENT_MODE) {
            New-WindowsService
        }
        
        Set-Firewall
        Start-Services
        
        if (Test-Installation) {
            Show-Completion
        } else {
            Write-Error-Custom "Installation completed with errors. Please check the logs above."
            exit 1
        }
    }
    catch {
        Write-Error-Custom "Installation failed: $($_.Exception.Message)"
        Write-Info "For support, please check the troubleshooting section in the README.md"
        exit 1
    }
}

# Run the installation
Start-Installation
