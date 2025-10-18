Param(
  [ValidateSet("dev","preview","build")]
  [string]$Mode = "dev",
  [int]$Port = 4028
)

function Write-Info($Message) { Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Ok($Message) { Write-Host "✔ $Message" -ForegroundColor Green }
function Write-Err($Message) { Write-Host "✖ $Message" -ForegroundColor Red }

function Test-Command($cmd) {
  $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

function Ensure-Node {
  if (-not (Test-Command 'node')) { Write-Err "Node.js not found. Please install Node.js 18+ from https://nodejs.org"; exit 1 }
  if (-not (Test-Command 'npm')) { Write-Err "npm not found. Ensure your Node.js installation includes npm"; exit 1 }
  $versionStr = (& node -v) -replace '^v',''
  $major = [int]($versionStr.Split('.')[0])
  if ($major -lt 18) { Write-Err "Node.js $versionStr detected; require >= 18"; exit 1 }
  Write-Ok "Node.js $versionStr detected"
}

# Go to script directory
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Info "Ensuring prerequisites..."
Ensure-Node

# Prepare environment file
if (-not (Test-Path ".env")) {
  if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
    Write-Ok "Created .env from .env.example"
  } else {
    Write-Info "No .env.example found; skipping env creation"
  }
}

# Install dependencies
if (Test-Path "package-lock.json") {
  Write-Info "Installing dependencies (npm ci)..."
  npm ci
} else {
  Write-Info "Installing dependencies (npm install)..."
  npm install
}

switch ($Mode) {
  "dev" {
    Write-Info "Starting Vite dev server on port $Port..."
    npm run dev -- --host 0.0.0.0 --port $Port
  }
  "preview" {
    Write-Info "Building production bundle..."
    npm run build
    Write-Info "Starting preview server on port $Port..."
    npm run preview -- --host 0.0.0.0 --port $Port
  }
  "build" {
    Write-Info "Building production bundle..."
    npm run build
    Write-Ok "Build complete. See dist/"
  }
}