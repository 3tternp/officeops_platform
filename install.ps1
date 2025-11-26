Param(
  [ValidateSet("dev","preview","build","dev-netlify")]
  [string]$Mode = "dev",
  [int]$Port = 4028,
  [int]$NetlifyPort = 8888,
  [switch]$DockerDb,
  [ValidateSet("npm","pnpm","yarn","auto")]
  [string]$PackageManager = "npm"
)

function Write-Info($Message) { Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Ok($Message) { Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Err($Message) { Write-Host "[ERROR] $Message" -ForegroundColor Red }

function Test-Command($cmd) {
  $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

function Ensure-Node {
  if (-not (Test-Command 'node')) { Write-Err "Node.js not found. Please install Node.js 22+ from https://nodejs.org"; exit 1 }
  $versionStr = (& node -v) -replace '^v',''
  $major = [int]($versionStr.Split('.')[0])
  if ($major -lt 22) { Write-Err "Node.js $versionStr detected; require >= 22"; exit 1 }
  Write-Ok "Node.js $versionStr detected"
}

function Resolve-PackageManager {
  param([string]$Preference)
  if ($Preference -eq 'auto') {
    if (Test-Command 'pnpm') { return 'pnpm' }
    if (Test-Command 'yarn') { return 'yarn' }
    return 'npm'
  }
  return $Preference
}

function Ensure-PackageManager {
  param([string]$Pm)
  if (-not (Test-Command $Pm)) { Write-Err "$Pm not found. Please install it or choose a different package manager."; exit 1 }
}

function Install-Deps {
  param([string]$Pm)
  switch ($Pm) {
    'npm' {
      if (Test-Path "package-lock.json") {
        Write-Info "Installing dependencies (npm ci)..."
        npm ci
        if ($LASTEXITCODE -ne 0) {
          Write-Info "npm ci failed; falling back to npm install"
          npm install
        }
      } else {
        Write-Info "Installing dependencies (npm install)..."
        npm install
      }
    }
    'pnpm' {
      Write-Info "Installing dependencies (pnpm)..."
      if (Test-Path "pnpm-lock.yaml") { pnpm install --frozen-lockfile } else { pnpm install }
    }
    'yarn' {
      Write-Info "Installing dependencies (yarn)..."
      if (Test-Path "yarn.lock") { yarn install --frozen-lockfile } else { yarn install }
    }
  }
}

function Run-Script {
  param(
    [string]$Pm,
    [string]$Script,
    [string[]]$Args
  )
  switch ($Pm) {
    'npm'  { npm run $Script -- @Args }
    'pnpm' { pnpm run $Script -- @Args }
    'yarn' { yarn $Script -- @Args }
  }
}

function Start-DockerDb {
  if (-not (Test-Command 'docker')) { Write-Err "Docker not found. Install Docker Desktop"; exit 1 }
  try {
    Write-Info "Starting Docker PostgreSQL service (db)..."
    docker compose up -d db | Out-Null
  } catch {
    if (Test-Command 'docker-compose') {
      docker-compose up -d db | Out-Null
    } else {
      Write-Err "docker compose not available"; exit 1
    }
  }
  Write-Ok "Docker db service running"
}

# Go to script directory
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Info "Ensuring prerequisites..."
Ensure-Node
$pm = Resolve-PackageManager -Preference $PackageManager
Ensure-PackageManager -Pm $pm

if ($DockerDb) { Start-DockerDb }

# Prepare environment file
if (-not (Test-Path ".env")) {
  if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
    Write-Ok "Created .env from .env.example"
  } else {
    Write-Info "No .env.example found; skipping env creation"
  }
}

# Warn if SMTP envs are missing for dev-netlify
if ($Mode -eq "dev-netlify") {
  $smtpVars = @("SMTP_HOST","SMTP_PORT","SMTP_SECURE","SMTP_USER","SMTP_PASS","SMTP_FROM")
  $missing = $false
  foreach ($v in $smtpVars) {
    $val = [System.Environment]::GetEnvironmentVariable($v, "Process")
    if ([string]::IsNullOrEmpty($val)) { $missing = $true }
  }
  if ($missing) {
    Write-Info "SMTP env vars not fully set; send-email function may fail. Configure in .env or system environment."
  } else {
    Write-Ok "SMTP env vars present"
  }
}

Install-Deps -Pm $pm

switch ($Mode) {
  "dev" {
    Write-Info "Starting Vite dev server on port $Port..."
    Run-Script -Pm $pm -Script "dev" -Args @("--host","0.0.0.0","--port",$Port)
  }
  "dev-netlify" {
    Write-Info "Starting Netlify dev (functions + proxy) on port $NetlifyPort and Vite on $Port..."
    npx netlify dev --functions netlify/functions -c "$pm run dev -- --host 0.0.0.0 --port $Port" --port $NetlifyPort
  }
  "preview" {
    Write-Info "Building production bundle..."
    Run-Script -Pm $pm -Script "build"
    Write-Info "Starting preview server on port $Port..."
    Run-Script -Pm $pm -Script "preview" -Args @("--host","0.0.0.0","--port",$Port)
  }
  "build" {
    Write-Info "Building production bundle..."
    Run-Script -Pm $pm -Script "build"
    Write-Ok "Build complete. See dist/"
  }
}

