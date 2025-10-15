# OfficeOps Platform Installation Guide

[![Version](https://img.shields.io/badge/version-2.3.0-blue.svg)](README.md)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-green.svg)](#supported-platforms)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Quick Installation](#quick-installation)
- [Automated Installation](#automated-installation)
  - [Linux/Unix Installation](#linuxunix-installation)
  - [Windows Installation](#windows-installation)
- [Manual Installation](#manual-installation)
- [Docker Installation](#docker-installation)
- [Configuration](#configuration)
- [Post-Installation](#post-installation)
- [Health Checks](#health-checks)
- [Troubleshooting](#troubleshooting)
- [Uninstallation](#uninstallation)

## 🌟 Overview

This guide provides comprehensive instructions for installing the OfficeOps Platform on various systems. The platform offers multiple installation methods to suit different environments and use cases.

### Installation Methods Available

| Method | Best For | Time Required | Difficulty |
|--------|----------|---------------|------------|
| **Automated Scripts** | Production & Development | 5-10 minutes | Easy |
| **Docker Compose** | Development & Testing | 3-5 minutes | Easy |
| **Manual Installation** | Custom Setups | 15-30 minutes | Moderate |

## 💻 System Requirements

### Minimum Requirements

| Component | Linux/macOS | Windows |
|-----------|-------------|---------|
| **Operating System** | Ubuntu 18.04+, CentOS 7+, macOS 10.15+ | Windows 10 (build 1903+) or Windows Server 2019+ |
| **RAM** | 4 GB | 4 GB |
| **CPU** | 2 cores | 2 cores |
| **Disk Space** | 5 GB free | 5 GB free |
| **Network** | Internet connection required | Internet connection required |

### Recommended Requirements

| Component | Linux/macOS | Windows |
|-----------|-------------|---------|
| **Operating System** | Ubuntu 20.04+, CentOS 8+, macOS 12+ | Windows 11 or Windows Server 2022+ |
| **RAM** | 8 GB+ | 8 GB+ |
| **CPU** | 4+ cores | 4+ cores |
| **Disk Space** | 10 GB+ free (SSD recommended) | 10 GB+ free (SSD recommended) |

### Software Prerequisites

The installation scripts will automatically install these, but you can install them manually:

- **Node.js** 18.0+ and npm
- **Git** (latest version)
- **Docker** and Docker Compose (optional, for containerized deployment)
- **PostgreSQL** 13+ (optional, for database features)

## ⚡ Quick Installation

### One-Line Installation (Linux/macOS)

```bash
curl -fsSL https://raw.githubusercontent.com/3tternp/officeops_platform/main/install.sh | sudo bash
```

### One-Line Installation (Windows PowerShell)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
iwr -useb https://raw.githubusercontent.com/3tternp/officeops_platform/main/install.ps1 | iex
```

## 🤖 Automated Installation

### Linux/Unix Installation

#### Standard Installation

```bash
# Download the installer
wget https://raw.githubusercontent.com/3tternp/officeops_platform/main/install.sh
chmod +x install.sh

# Run installation (as root/sudo)
sudo ./install.sh
```

#### Development Installation

```bash
# Install in development mode with hot reload
sudo ./install.sh --dev
```

#### Custom Installation Options

```bash
# Available options
./install.sh --help

# Examples:
sudo ./install.sh --dev              # Development mode
sudo ./install.sh --no-docker        # Skip Docker installation
sudo ./install.sh --no-nginx         # Skip Nginx installation
sudo ./install.sh --no-db            # Skip database installation
sudo ./install.sh --ssl              # Enable SSL configuration
```

#### Installation Process

The Linux installer will:

1. **System Detection** - Automatically detect your Linux distribution
2. **Prerequisites Check** - Verify system requirements
3. **Dependencies Installation** - Install Node.js, Git, Docker, PostgreSQL, Nginx
4. **Application Setup** - Download and configure OfficeOps Platform
5. **Service Creation** - Create and start systemd services
6. **Security Configuration** - Configure firewall rules
7. **Health Verification** - Verify installation success

### Windows Installation

#### Standard Installation

```powershell
# Download the installer
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/3tternp/officeops_platform/main/install.ps1" -OutFile "install.ps1"

# Run installation (as Administrator)
.\install.ps1
```

### Quick Dev Setup (recommended for contributors)

```bash
# Linux/macOS
./scripts/setup-dev.sh

# Windows PowerShell
./scripts/setup-dev.ps1
```

This minimal setup will copy `.env.example` to `.env` if missing, install dependencies, and build the app. Then start with `npm run dev`.

#### Development Installation

```powershell
# Install in development mode
.\install.ps1 -Development
```

#### Custom Installation Options

```powershell
# Available options
.\install.ps1 -Help

# Examples:
.\install.ps1 -Development                    # Development mode
.\install.ps1 -NoDocker                      # Skip Docker Desktop
.\install.ps1 -NoDatabase                    # Skip PostgreSQL
.\install.ps1 -SSL                           # Enable SSL
.\install.ps1 -InstallPath "D:\OfficeOps"    # Custom installation path
```

#### Installation Process

The Windows installer will:

1. **Administrator Check** - Verify running as Administrator
2. **System Requirements** - Check Windows version and resources
3. **Chocolatey Setup** - Install package manager
4. **Dependencies Installation** - Install Node.js, Git, Docker Desktop, PostgreSQL
5. **Application Setup** - Download and configure OfficeOps Platform
6. **Windows Service** - Create and start Windows service
7. **Firewall Configuration** - Configure Windows Firewall
8. **Health Verification** - Verify installation success

## 🔧 Manual Installation

### Step 1: Install Prerequisites

#### Linux/macOS

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y curl wget git build-essential

# CentOS/RHEL/Fedora
sudo yum update -y
sudo yum groupinstall -y "Development Tools"
sudo yum install -y curl wget git

# macOS (requires Homebrew)
brew install node git
```

#### Windows

```powershell
# Install Chocolatey first
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install prerequisites
choco install nodejs git -y
```

### Step 2: Install Node.js

```bash
# Install Node.js 18.x (Linux)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/officeops-platform.git
cd officeops-platform

# Install dependencies
npm ci --production
```

### Step 4: Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env  # Linux/macOS
notepad .env  # Windows
```

### Step 5: Build and Start

```bash
# Build the application
npm run build

# Start the application
npm start
```

## 🐳 Docker Installation

### Prerequisites

- Docker Engine 20.0+
- Docker Compose 2.0+

### Quick Start with Docker

```bash
# Clone repository
git clone https://github.com/yourusername/officeops-platform.git
cd officeops-platform

# Copy environment file
cp .env.example .env

# Start with Docker Compose
docker-compose up -d
```

### Development with Docker

```bash
# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --profile dev

# Include development tools (Adminer, MailHog)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --profile dev --profile tools
```

### Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Scale frontend instances
docker-compose up -d --scale frontend=3
```

### Local Automation (Scripts)

Use the provided helper scripts to bring up the local environment with one command.

Linux/macOS (bash):

```bash
# Frontend + Postgres (default)
./scripts/local-up.sh

# Include development overrides (hot-reload dev server)
./scripts/local-up.sh --dev

# Include optional services
./scripts/local-up.sh --tools          # PgAdmin, Adminer, MailHog
./scripts/local-up.sh --api            # Backend API (requires backend code)
./scripts/local-up.sh --rebuild        # Force rebuild images
```

Windows (PowerShell):

```powershell
# Frontend + Postgres (default)
.\\scripts\\local-up.ps1

# Include development overrides (hot-reload dev server)
.\\scripts\\local-up.ps1 -Dev

# Include optional services
.\\scripts\\local-up.ps1 -Tools         # PgAdmin, Adminer, MailHog
.\\scripts\\local-up.ps1 -Api           # Backend API (requires backend code)
.\\scripts\\local-up.ps1 -Rebuild       # Force rebuild images
```

After startup, access:

- Frontend: `http://localhost:${FRONTEND_PORT}` (default `4028`)
- Backend (if enabled): `http://localhost:${BACKEND_PORT}` (default `3001`)
- PgAdmin (tools): `http://localhost:${PGADMIN_PORT}` (default `5050`)
- Adminer (tools): `http://localhost:${ADMINER_PORT}` (default `8080`)
- MailHog (tools): `http://localhost:${MAILHOG_WEB_PORT}` (default `8025`)

## ⚙️ Configuration

### Environment Variables

Key configuration settings in `.env`:

```env
# Application Settings
NODE_ENV=production
APP_NAME="OfficeOps Platform"
APP_VERSION=2.3.0
FRONTEND_PORT=4028
BACKEND_PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=officeops
DB_USER=officeops_user
DB_PASSWORD=your_secure_password

# Security Settings
JWT_SECRET=your_jwt_secret_minimum_32_characters
SESSION_SECRET=your_session_secret
CORS_ORIGIN=http://localhost:4028

# Optional Features
ENABLE_ANALYTICS=false
DEBUG=false
ENABLE_MOCK_DATA=true
```

### Custom Configuration

#### Port Configuration

```env
# Change default ports
FRONTEND_PORT=8080
BACKEND_PORT=8081
```

#### SSL Configuration

```env
# Enable SSL (requires certificates)
SSL_ENABLED=true
SSL_CERT_PATH=/path/to/certificate.crt
SSL_KEY_PATH=/path/to/private.key
```

#### Database Configuration

```env
# External database
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

## 🎯 Post-Installation

### Access the Application

After installation, access the platform at:

- **Local Access**: http://localhost:4028
- **Network Access**: http://YOUR_SERVER_IP:4028

### Default Demo Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Administrator** | admin@demo.com | admin123 | Full system access |
| **ISO Officer** | iso@demo.com | iso123 | Security and compliance |
| **Manager** | manager@demo.com | mgr123 | Department management |
| **Employee** | employee@demo.com | emp123 | Basic user access |

### Initial Setup Steps

1. **Login** with admin credentials
2. **Change Default Passwords** in user management
3. **Configure Company Settings** in admin panel
4. **Set up Departments** and organizational structure
5. **Import User Data** if migrating from existing system
6. **Configure Backup** settings for data protection

### Service Management

#### Linux (systemd)

```bash
# Check service status
sudo systemctl status officeops-frontend

# Start/stop/restart services
sudo systemctl start officeops-frontend
sudo systemctl stop officeops-frontend
sudo systemctl restart officeops-frontend

# Enable/disable auto-start
sudo systemctl enable officeops-frontend
sudo systemctl disable officeops-frontend

# View logs
sudo journalctl -u officeops-frontend -f
```

#### Windows (Services)

```powershell
# Check service status
Get-Service "OfficeOps Platform"

# Start/stop service
Start-Service "OfficeOps Platform"
Stop-Service "OfficeOps Platform"
Restart-Service "OfficeOps Platform"

# Set startup type
Set-Service "OfficeOps Platform" -StartupType Automatic
```

## 🏥 Health Checks

### Automated Health Checks

Run the health check scripts to verify system status:

#### Linux/macOS

```bash
# Run health check
./health-check.sh

# Exit codes:
# 0 = All checks passed
# 1 = Critical failures found
# 2 = Warnings found
```

#### Windows

```powershell
# Run health check
.\health-check.ps1

# Detailed health check
.\health-check.ps1 -Detailed
```

### Manual Health Checks

#### Application Accessibility

```bash
# Test frontend
curl -I http://localhost:4028

# Test backend (if applicable)
curl -I http://localhost:3001/health
```

#### Database Connectivity

```bash
# Test PostgreSQL connection
psql -h localhost -U officeops_user -d officeops -c "SELECT 1;"
```

#### Service Status

```bash
# Check if application is running
ps aux | grep node
netstat -tlnp | grep :4028
```

## 🔧 Troubleshooting

### Common Issues

#### Issue: Port Already in Use

```bash
# Find process using port 4028
sudo lsof -i :4028  # Linux/macOS
netstat -ano | findstr :4028  # Windows

# Kill the process
kill -9 PID  # Linux/macOS
taskkill /PID PID /F  # Windows
```

#### Issue: Permission Denied

```bash
# Fix file permissions (Linux/macOS)
sudo chown -R $(whoami):$(whoami) /opt/officeops
chmod -R 755 /opt/officeops

# Run as administrator (Windows)
# Right-click PowerShell -> "Run as Administrator"
```

#### Issue: Database Connection Failed

```bash
# Check PostgreSQL service
sudo systemctl status postgresql  # Linux
Get-Service postgresql*  # Windows

# Reset database password
sudo -u postgres psql -c "ALTER USER officeops_user PASSWORD 'new_password';"
```

#### Issue: Application Won't Start

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check logs for errors
npm run start --verbose
```

### Performance Issues

#### High Memory Usage

```bash
# Check memory usage
free -h  # Linux
Get-Process node | Select-Object ProcessName, WorkingSet  # Windows

# Restart services
sudo systemctl restart officeops-frontend
```

#### Slow Response Times

```bash
# Check system load
uptime  # Linux/macOS
Get-Counter "\Processor(_Total)\% Processor Time"  # Windows

# Monitor network connectivity
ping localhost
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:4028
```

### Log Files

#### Linux Log Locations

```bash
# Application logs
sudo journalctl -u officeops-frontend -f

# System logs
/var/log/syslog
/var/log/nginx/error.log
/var/log/postgresql/postgresql-*.log
```

#### Windows Log Locations

```powershell
# Application logs
Get-EventLog -LogName Application -Source "OfficeOps*"

# Service logs
Get-WinEvent -LogName System | Where-Object {$_.ProviderName -like "*OfficeOps*"}
```

### Getting Help

1. **Check Documentation**: Review this guide and README.md
2. **Run Health Check**: Use automated health check scripts
3. **Search Issues**: Check GitHub issues for similar problems
4. **Community Support**: Post in GitHub Discussions
5. **Enterprise Support**: Contact support@officeops.com

## 🗑️ Uninstallation

### Automated Uninstallation

#### Linux/macOS

```bash
# Stop services
sudo systemctl stop officeops-frontend officeops-backend
sudo systemctl disable officeops-frontend officeops-backend

# Remove service files
sudo rm /etc/systemd/system/officeops-*.service
sudo systemctl daemon-reload

# Remove application files
sudo rm -rf /opt/officeops

# Remove database (optional)
sudo -u postgres dropdb officeops
sudo -u postgres dropuser officeops_user

# Remove nginx configuration
sudo rm /etc/nginx/sites-available/officeops
sudo rm /etc/nginx/sites-enabled/officeops
sudo systemctl reload nginx
```

#### Windows

```powershell
# Stop and remove service
Stop-Service "OfficeOps Platform"
$service = Get-WmiObject -Class Win32_Service -Filter "Name='OfficeOps Platform'"
if ($service) { $service.Delete() }

# Remove application files
Remove-Item -Path "C:\OfficeOps" -Recurse -Force

# Remove firewall rules
Remove-NetFirewallRule -DisplayName "OfficeOps*"

# Uninstall dependencies (optional)
choco uninstall nodejs postgresql docker-desktop -y
```

### Manual Cleanup

```bash
# Remove user data (optional)
rm -rf ~/.officeops

# Remove logs
sudo rm -rf /var/log/officeops*

# Remove temporary files
sudo rm -rf /tmp/officeops*
```

## 📞 Support

### Documentation

- **Installation Guide**: This document
- **User Guide**: [README.md](README.md)
- **API Documentation**: Available after installation at `/api-docs`

### Community Support

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Community Q&A and discussions
- **Stack Overflow**: Tag questions with `officeops-platform`

### Enterprise Support

For production deployments, custom installations, or enterprise support:

- **Email**: support@officeops.com
- **Response Time**: 24 hours for urgent issues
- **Services Available**: Custom installation, training, maintenance contracts

---

## 📄 License

This installation guide is part of the OfficeOps Platform project, licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

<div align="center">

**🚀 Ready to get started?**

Choose your preferred installation method above and get your OfficeOps Platform running in minutes!

[⬆️ Back to Top](#officeops-platform-installation-guide)

</div>
