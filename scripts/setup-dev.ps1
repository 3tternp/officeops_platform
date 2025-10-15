# Minimal dev setup for OfficeOps Platform (Windows)
# - Ensures Node 18+ and npm are available
# - Copies .env.example to .env if missing
# - Installs dependencies (npm ci preferred)
# - Optionally builds the app

[CmdletBinding()]
param(
    [switch]$NoBuild,
    [switch]$Help
)

function Show-Help {
    Write-Host "Usage: .\scripts\setup-dev.ps1 [-NoBuild]" -ForegroundColor White
    Write-Host "" 
    Write-Host "Performs a minimal developer setup: copies .env, installs deps, builds." -ForegroundColor Gray
}

if ($Help) { Show-Help; exit 0 }

Write-Host "== OfficeOps Platform: Minimal Dev Setup ==" -ForegroundColor Cyan

# Check Node and npm
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed. Please install Node 18+." -ForegroundColor Red
    exit 1
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

# Verify Node major version
$nodeVersion = node --version
$majorVersion = [int]($nodeVersion.Substring(1).Split('.')[0])
if ($majorVersion -lt 18) {
    Write-Host "Error: Node.js v18+ required. Found $nodeVersion" -ForegroundColor Red
    exit 1
}

# Ensure .env exists
if (-not (Test-Path -Path ".env")) {
    if (Test-Path -Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Created .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host "Warning: .env.example not found. Create .env manually as needed." -ForegroundColor Yellow
    }
}

# Install dependencies
if (Test-Path -Path "package-lock.json") {
    Write-Host "Installing dependencies with npm ci" -ForegroundColor Green
    npm ci
} else {
    Write-Host "Installing dependencies with npm install" -ForegroundColor Green
    npm install
}

# Optional build
if (-not $NoBuild) {
    Write-Host "Building application" -ForegroundColor Green
    npm run build
}

Write-Host "`nDone. Common next steps:" -ForegroundColor White
Write-Host "- Start dev server: npm run dev" -ForegroundColor Gray
Write-Host "- Preview build:    npm run preview" -ForegroundColor Gray
Write-Host "- Open locally:     http://localhost:4028/ (dev), http://localhost:4031/ (preview)" -ForegroundColor Gray