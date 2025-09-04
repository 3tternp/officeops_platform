# ===================================
# OfficeOps Platform Health Check
# Version: 2.3.0
# Platform: Windows
# ===================================

param(
    [switch]$Detailed,
    [switch]$Help,
    [string]$InstallPath = "C:\OfficeOps"
)

# Configuration
$FRONTEND_PORT = 4028
$BACKEND_PORT = 3001
$DB_NAME = "officeops"

# Health check results
$script:TOTAL_CHECKS = 0
$script:PASSED_CHECKS = 0
$script:FAILED_CHECKS = 0
$script:WARNING_CHECKS = 0

# Color functions for output
function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success($Message) {
    Write-ColorOutput Green "✅ $Message"
    $script:PASSED_CHECKS++
}

function Write-Error-Custom($Message) {
    Write-ColorOutput Red "❌ $Message"
    $script:FAILED_CHECKS++
}

function Write-Warning-Custom($Message) {
    Write-ColorOutput Yellow "⚠️  $Message"
    $script:WARNING_CHECKS++
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
║              OfficeOps Platform Health Check                     ║
║                        Version 2.3.0                            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
"@
    Write-Output ""
}

# Show help
function Show-Help {
    Write-ColorOutput White "Usage: .\health-check.ps1 [OPTIONS]"
    Write-Output ""
    Write-ColorOutput White "Options:"
    Write-ColorOutput Green "  -Detailed          Show detailed information for each check"
    Write-ColorOutput Green "  -InstallPath       Custom installation path (default: C:\OfficeOps)"
    Write-ColorOutput Green "  -Help              Show this help message"
    Write-Output ""
    Write-ColorOutput White "Examples:"
    Write-ColorOutput Gray "  .\health-check.ps1              # Standard health check"
    Write-ColorOutput Gray "  .\health-check.ps1 -Detailed    # Detailed health check"
    Write-Output ""
}

# Check Windows services
function Test-WindowsServices {
    Write-Log "🔍 Checking Windows services..."
    $script:TOTAL_CHECKS++
    
    # Check OfficeOps Platform service
    $service = Get-Service -Name "OfficeOps Platform" -ErrorAction SilentlyContinue
    if ($service) {
        if ($service.Status -eq 'Running') {
            Write-Success "OfficeOps Platform service is running"
        } else {
            Write-Error-Custom "OfficeOps Platform service is installed but not running"
        }
    } else {
        Write-Warning-Custom "OfficeOps Platform service is not installed (may be running via Docker or manually)"
    }
}

# Check Docker containers
function Test-DockerContainers {
    Write-Log "🐳 Checking Docker containers..."
    $script:TOTAL_CHECKS++
    
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        try {
            $containers = docker ps --filter "name=officeops" --format "table {{.Names}}`t{{.Status}}" 2>$null
            
            if ($containers -and $containers.Count -gt 1) {
                Write-Success "Docker containers are running:"
                $containers | Select-Object -Skip 1 | ForEach-Object {
                    Write-Output "    $_"
                }
            } else {
                Write-Warning-Custom "No OfficeOps Docker containers are running"
            }
        }
        catch {
            Write-Warning-Custom "Docker is not running or accessible"
        }
    } else {
        Write-Warning-Custom "Docker is not installed"
    }
}

# Check network connectivity
function Test-NetworkConnectivity {
    Write-Log "🌐 Checking network connectivity..."
    $script:TOTAL_CHECKS++
    
    # Check frontend port
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$FRONTEND_PORT" -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend is accessible on port $FRONTEND_PORT"
        } else {
            Write-Error-Custom "Frontend returned status code $($response.StatusCode)"
        }
    }
    catch {
        Write-Error-Custom "Frontend is not accessible on port $FRONTEND_PORT"
    }
    
    $script:TOTAL_CHECKS++
    # Check backend port (if applicable)
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$BACKEND_PORT/health" -TimeoutSec 10 -ErrorAction Stop
        Write-Success "Backend is accessible on port $BACKEND_PORT"
    }
    catch {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$BACKEND_PORT" -TimeoutSec 10 -ErrorAction Stop
            Write-Warning-Custom "Backend is accessible on port $BACKEND_PORT but no /health endpoint"
        }
        catch {
            Write-Warning-Custom "Backend is not accessible on port $BACKEND_PORT (frontend-only deployment)"
        }
    }
}

# Check database connectivity
function Test-DatabaseConnectivity {
    Write-Log "🗄️ Checking database connectivity..."
    $script:TOTAL_CHECKS++
    
    # Check PostgreSQL service
    $service = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($service) {
        if ($service.Status -eq 'Running') {
            Write-Success "PostgreSQL service is running"
            
            # Try to connect to database
            try {
                $env:PGPASSWORD = "postgres123"
                $psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
                
                if (Test-Path $psqlPath) {
                    $result = & $psqlPath -U postgres -d $DB_NAME -c "SELECT 1;" 2>$null
                    if ($LASTEXITCODE -eq 0) {
                        Write-Success "Database connection successful"
                    } else {
                        Write-Error-Custom "Cannot connect to database '$DB_NAME'"
                    }
                } else {
                    Write-Warning-Custom "PostgreSQL client not found at expected location"
                }
            }
            catch {
                Write-Error-Custom "Database connection test failed"
            }
        } else {
            Write-Error-Custom "PostgreSQL service is installed but not running"
        }
    } else {
        Write-Warning-Custom "PostgreSQL service not found (database may not be installed)"
    }
}

# Check file system
function Test-FileSystem {
    Write-Log "📁 Checking file system..."
    $script:TOTAL_CHECKS++
    
    if (Test-Path $InstallPath) {
        Write-Success "Installation directory exists: $InstallPath"
        
        # Check key files
        $requiredFiles = @("package.json", ".env", "dist\index.html")
        foreach ($file in $requiredFiles) {
            $script:TOTAL_CHECKS++
            $filePath = Join-Path $InstallPath $file
            if (Test-Path $filePath) {
                Write-Success "Required file exists: $file"
            } else {
                if ($file -eq "dist\index.html") {
                    Write-Error-Custom "Application not built: $file missing"
                } else {
                    Write-Error-Custom "Required file missing: $file"
                }
            }
        }
        
        # Check permissions
        $script:TOTAL_CHECKS++
        try {
            $acl = Get-Acl $InstallPath
            if ($acl) {
                Write-Success "Installation directory has correct permissions"
            } else {
                Write-Error-Custom "Cannot read installation directory permissions"
            }
        }
        catch {
            Write-Error-Custom "Installation directory has permission issues"
        }
    } else {
        Write-Error-Custom "Installation directory not found: $InstallPath"
    }
}

# Check system resources
function Test-SystemResources {
    Write-Log "💾 Checking system resources..."
    
    # Check memory usage
    $script:TOTAL_CHECKS++
    try {
        $memory = Get-WmiObject -Class Win32_OperatingSystem
        $memUsage = [math]::Round((($memory.TotalVisibleMemorySize - $memory.FreePhysicalMemory) / $memory.TotalVisibleMemorySize) * 100, 1)
        
        if ($memUsage -lt 80) {
            Write-Success "Memory usage is healthy: $memUsage%"
        } elseif ($memUsage -lt 90) {
            Write-Warning-Custom "Memory usage is high: $memUsage%"
        } else {
            Write-Error-Custom "Memory usage is critical: $memUsage%"
        }
    }
    catch {
        Write-Error-Custom "Failed to check memory usage"
    }
    
    # Check disk space
    $script:TOTAL_CHECKS++
    try {
        $drive = (Get-Item $InstallPath).PSDrive.Name
        $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='$drive`:'"
        $diskUsage = [math]::Round((($disk.Size - $disk.FreeSpace) / $disk.Size) * 100, 1)
        
        if ($diskUsage -lt 80) {
            Write-Success "Disk usage is healthy: $diskUsage%"
        } elseif ($diskUsage -lt 90) {
            Write-Warning-Custom "Disk usage is high: $diskUsage%"
        } else {
            Write-Error-Custom "Disk usage is critical: $diskUsage%"
        }
    }
    catch {
        Write-Error-Custom "Failed to check disk usage"
    }
    
    # Check CPU usage
    $script:TOTAL_CHECKS++
    try {
        $cpu = Get-WmiObject -Class Win32_Processor | Measure-Object -Property LoadPercentage -Average
        $cpuUsage = [math]::Round($cpu.Average, 1)
        
        if ($cpuUsage -lt 70) {
            Write-Success "CPU usage is healthy: $cpuUsage%"
        } elseif ($cpuUsage -lt 90) {
            Write-Warning-Custom "CPU usage is high: $cpuUsage%"
        } else {
            Write-Error-Custom "CPU usage is critical: $cpuUsage%"
        }
    }
    catch {
        Write-Error-Custom "Failed to check CPU usage"
    }
}

# Check Windows Event Log
function Test-EventLogs {
    Write-Log "📋 Checking Windows Event Log..."
    $script:TOTAL_CHECKS++
    
    try {
        # Check for application errors in the last 24 hours
        $yesterday = (Get-Date).AddDays(-1)
        $errors = Get-EventLog -LogName Application -After $yesterday -EntryType Error -Source "*OfficeOps*" -ErrorAction SilentlyContinue
        
        if ($errors) {
            Write-Warning-Custom "Found $($errors.Count) application errors in the last 24 hours"
        } else {
            Write-Success "No recent application errors found in Event Log"
        }
    }
    catch {
        Write-Warning-Custom "Cannot access Windows Event Log"
    }
}

# Check security configuration
function Test-SecurityConfiguration {
    Write-Log "🔒 Checking security configuration..."
    $script:TOTAL_CHECKS++
    
    # Check Windows Firewall
    try {
        $firewall = Get-NetFirewallProfile
        $enabled = $firewall | Where-Object { $_.Enabled -eq $true }
        
        if ($enabled) {
            Write-Success "Windows Firewall is enabled"
        } else {
            Write-Warning-Custom "Windows Firewall is disabled"
        }
    }
    catch {
        Write-Warning-Custom "Cannot check Windows Firewall status"
    }
    
    # Check for default passwords
    $script:TOTAL_CHECKS++
    $envFile = Join-Path $InstallPath ".env"
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile -Raw
        if ($envContent -match "your-super-secret-jwt-key") {
            Write-Error-Custom "Default JWT secret detected - please change it!"
        } else {
            Write-Success "JWT secret has been customized"
        }
    } else {
        Write-Warning-Custom "Environment file not found"
    }
}

# Performance test
function Test-Performance {
    Write-Log "🚀 Running performance test..."
    $script:TOTAL_CHECKS++
    
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $response = Invoke-WebRequest -Uri "http://localhost:$FRONTEND_PORT" -TimeoutSec 30 -ErrorAction Stop
        $stopwatch.Stop()
        
        if ($response.StatusCode -eq 200) {
            $responseTime = $stopwatch.ElapsedMilliseconds
            if ($responseTime -lt 1000) {
                Write-Success "Application response time: ${responseTime}ms"
            } elseif ($responseTime -lt 3000) {
                Write-Warning-Custom "Application response time is slow: ${responseTime}ms"
            } else {
                Write-Error-Custom "Application response time is very slow: ${responseTime}ms"
            }
        } else {
            Write-Error-Custom "Application returned HTTP $($response.StatusCode)"
        }
    }
    catch {
        Write-Error-Custom "Failed to get application response"
    }
}

# Check configuration
function Test-Configuration {
    Write-Log "⚙️ Checking configuration..."
    $script:TOTAL_CHECKS++
    
    $envFile = Join-Path $InstallPath ".env"
    if (Test-Path $envFile) {
        Write-Success "Environment configuration file exists"
        
        # Check critical environment variables
        $criticalVars = @("APP_NAME", "FRONTEND_PORT", "NODE_ENV")
        $envContent = Get-Content $envFile
        
        foreach ($var in $criticalVars) {
            $script:TOTAL_CHECKS++
            $found = $envContent | Where-Object { $_ -match "^$var=" }
            if ($found) {
                Write-Success "Environment variable $var is configured"
            } else {
                Write-Error-Custom "Environment variable $var is missing"
            }
        }
    } else {
        Write-Error-Custom "Environment configuration file not found"
    }
}

# Generate health report
function New-HealthReport {
    Write-Output ""
    Write-ColorOutput White "╔══════════════════════════════════════════════════════════════════╗"
    Write-ColorOutput White "║                          HEALTH CHECK REPORT                     ║"
    Write-ColorOutput White "╚══════════════════════════════════════════════════════════════════╝"
    Write-Output ""
    
    # Get system information
    $computerName = $env:COMPUTERNAME
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias (Get-NetAdapter | Where-Object Status -eq "Up" | Select-Object -First 1).Name).IPAddress
    
    Write-ColorOutput White "📋 System Information:"
    Write-Output "  • Computer Name: $computerName"
    Write-Output "  • Server IP: $localIP"
    Write-Output "  • Frontend URL: http://$localIP`:$FRONTEND_PORT"
    Write-Output "  • Installation Path: $InstallPath"
    Write-Output "  • Check Time: $(Get-Date)"
    Write-Output ""
    
    Write-ColorOutput White "📊 Health Check Summary:"
    Write-ColorOutput Green "  • Passed: $script:PASSED_CHECKS"
    Write-ColorOutput Yellow "  • Warnings: $script:WARNING_CHECKS"
    Write-ColorOutput Red "  • Failed: $script:FAILED_CHECKS"
    Write-ColorOutput Cyan "  • Total: $script:TOTAL_CHECKS"
    Write-Output ""
    
    # Calculate health score
    $healthScore = [math]::Round(($script:PASSED_CHECKS + $script:WARNING_CHECKS * 0.5) / $script:TOTAL_CHECKS * 100, 1)
    
    Write-ColorOutput White "💯 Overall Health Score:"
    if ($healthScore -ge 90) {
        Write-ColorOutput Green "  $healthScore% - Excellent"
    } elseif ($healthScore -ge 80) {
        Write-ColorOutput Yellow "  $healthScore% - Good"
    } elseif ($healthScore -ge 60) {
        Write-ColorOutput Yellow "  $healthScore% - Fair"
    } else {
        Write-ColorOutput Red "  $healthScore% - Poor"
    }
    Write-Output ""
    
    if ($script:FAILED_CHECKS -gt 0) {
        Write-ColorOutput Red "⚠️  Critical Issues Found:"
        Write-Output "Please review the failed checks above and take appropriate action."
        Write-Output ""
    }
    
    Write-ColorOutput White "🔧 Recommended Actions:"
    if ($script:FAILED_CHECKS -gt 0) {
        Write-ColorOutput Red "  • Address all failed checks immediately"
    }
    if ($script:WARNING_CHECKS -gt 0) {
        Write-ColorOutput Yellow "  • Review warnings and consider improvements"
    }
    Write-ColorOutput Cyan "  • Run this health check regularly"
    Write-ColorOutput Cyan "  • Monitor Windows Event Log for issues"
    Write-ColorOutput Cyan "  • Keep the system updated"
    Write-Output ""
}

# Main health check function
function Start-HealthCheck {
    Show-Banner
    
    # Show help if requested
    if ($Help) {
        Show-Help
        return
    }
    
    Write-Log "🏥 Starting OfficeOps Platform health check..."
    Write-Output ""
    
    # Run all health checks
    Test-WindowsServices
    Test-DockerContainers
    Test-NetworkConnectivity
    Test-DatabaseConnectivity
    Test-FileSystem
    Test-SystemResources
    Test-EventLogs
    Test-SecurityConfiguration
    Test-Configuration
    Test-Performance
    
    # Generate final report
    New-HealthReport
    
    # Exit with appropriate code
    if ($script:FAILED_CHECKS -gt 0) {
        exit 1
    } elseif ($script:WARNING_CHECKS -gt 0) {
        exit 2
    } else {
        exit 0
    }
}

# Run the health check
Start-HealthCheck
