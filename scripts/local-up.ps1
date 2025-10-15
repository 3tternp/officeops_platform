Param(
    [switch]$Dev,
    [switch]$Api,
    [switch]$Tools,
    [switch]$Rebuild,
    [switch]$Help
)

if ($Help) {
    Write-Host "Usage: .\scripts\local-up.ps1 [-Dev] [-Api] [-Tools] [-Rebuild]" -ForegroundColor Yellow
    exit 0
}

# Ensure Docker is available
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed or not in PATH. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

# Determine compose command
$composeCmd = "docker compose"
try {
    & docker compose version | Out-Null
} catch {
    if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        $composeCmd = "docker-compose"
    } else {
        Write-Host "Docker Compose is not available. Install Docker Compose v2 or v1." -ForegroundColor Red
        exit 1
    }
}

# Ensure .env exists
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Created .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host ".env.example not found. Please create .env manually." -ForegroundColor Red
        exit 1
    }
}

# Build compose args
$files = @("-f", "docker-compose.yml")
$profiles = @()

if ($Dev) {
    $files += @("-f", "docker-compose.dev.yml")
    $profiles += @("--profile", "dev")
}

if ($Tools) { $profiles += @("--profile", "tools") }
if ($Api)   { $profiles += @("--profile", "api") }

$buildArgs = @()
if ($Rebuild) { $buildArgs += "--build" }

Write-Host "Starting local environment (Dev=$Dev Api=$Api Tools=$Tools) ..." -ForegroundColor Cyan
$cmd = @($composeCmd) + $files + @("up", "-d") + $profiles + $buildArgs
Write-Host ("`n> " + ($cmd -join " ")) -ForegroundColor Gray
& $composeCmd $files up -d $profiles $buildArgs

# Read values from .env
function Get-EnvValue($key) {
    $line = Get-Content .env | Where-Object { $_ -match "^$key=" } | Select-Object -First 1
    if ($line) { return $line.Split('=')[1] } else { return $null }
}

$FRONTEND_PORT = Get-EnvValue "FRONTEND_PORT"; if (-not $FRONTEND_PORT) { $FRONTEND_PORT = 4028 }
$BACKEND_PORT  = Get-EnvValue "BACKEND_PORT";  if (-not $BACKEND_PORT)  { $BACKEND_PORT  = 3001 }
$PGADMIN_PORT  = Get-EnvValue "PGADMIN_PORT";  if (-not $PGADMIN_PORT)  { $PGADMIN_PORT  = 5050 }
$ADMINER_PORT  = Get-EnvValue "ADMINER_PORT";  if (-not $ADMINER_PORT)  { $ADMINER_PORT  = 8080 }
$MAILHOG_WEB_PORT = Get-EnvValue "MAILHOG_WEB_PORT"; if (-not $MAILHOG_WEB_PORT) { $MAILHOG_WEB_PORT = 8025 }

Write-Host "`nLocal environment is up:" -ForegroundColor Green
Write-Host ("- Frontend:  http://localhost:" + $FRONTEND_PORT)
if ($Api) { Write-Host ("- Backend:   http://localhost:" + $BACKEND_PORT) }
if ($Tools) {
    Write-Host ("- PgAdmin:   http://localhost:" + $PGADMIN_PORT)
    Write-Host ("- Adminer:   http://localhost:" + $ADMINER_PORT)
    Write-Host ("- MailHog:   http://localhost:" + $MAILHOG_WEB_PORT)
}

Write-Host "`nTips:" -ForegroundColor Yellow
Write-Host "- Stop:    $composeCmd $($files -join ' ') down"
Write-Host "- Logs:    $composeCmd $($files -join ' ') logs -f"
Write-Host "- Rebuild: .\\scripts\\local-up.ps1 -Rebuild [-Dev|-Api|-Tools]"