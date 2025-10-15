#!/usr/bin/env bash

set -euo pipefail

# OfficeOps local deployment helper (Linux/macOS)
# Usage:
#   ./scripts/local-up.sh [--dev] [--api] [--tools] [--rebuild]

DEV=false
API=false
TOOLS=false
REBUILD=false

for arg in "$@"; do
  case "$arg" in
    --dev) DEV=true ;;
    --api) API=true ;;
    --tools) TOOLS=true ;;
    --rebuild) REBUILD=true ;;
    --help|-h)
      echo "Usage: $0 [--dev] [--api] [--tools] [--rebuild]"
      exit 0
      ;;
  esac
done

# Ensure Docker is available
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed or not in PATH. Please install Docker." >&2
  exit 1
fi

# Determine compose command
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE="docker-compose"
else
  echo "Docker Compose is not available. Please install Docker Compose v2 or v1." >&2
  exit 1
fi

# Ensure .env exists
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
  else
    echo ".env.example not found. Please create .env manually." >&2
    exit 1
  fi
fi

# Build compose args
FILES=( -f docker-compose.yml )
PROFILES=()

if [ "$DEV" = true ]; then
  FILES+=( -f docker-compose.dev.yml )
  PROFILES+=( --profile dev )
fi

if [ "$TOOLS" = true ]; then
  PROFILES+=( --profile tools )
fi

if [ "$API" = true ]; then
  PROFILES+=( --profile api )
fi

BUILD_ARGS=()
if [ "$REBUILD" = true ]; then
  BUILD_ARGS+=( --build )
fi

echo "Starting local environment (DEV=$DEV API=$API TOOLS=$TOOLS) ..."
set -x
$COMPOSE "${FILES[@]}" up -d "${PROFILES[@]}" "${BUILD_ARGS[@]}"
set +x

# Load ports from .env for summary
. ./.env || true

FRONTEND_PORT="${FRONTEND_PORT:-4028}"
BACKEND_PORT="${BACKEND_PORT:-3001}"
PGADMIN_PORT="${PGADMIN_PORT:-5050}"
ADMINER_PORT="${ADMINER_PORT:-8080}"
MAILHOG_WEB_PORT="${MAILHOG_WEB_PORT:-8025}"

echo ""
echo "Local environment is up:"
echo "- Frontend:  http://localhost:${FRONTEND_PORT}"
if [ "$API" = true ]; then
  echo "- Backend:   http://localhost:${BACKEND_PORT}"
fi
if [ "$TOOLS" = true ]; then
  echo "- PgAdmin:   http://localhost:${PGADMIN_PORT}"
  echo "- Adminer:   http://localhost:${ADMINER_PORT}"
  echo "- MailHog:   http://localhost:${MAILHOG_WEB_PORT}"
fi
echo ""
echo "Tips:"
echo "- Stop:    $COMPOSE ${FILES[*]} down"
echo "- Logs:    $COMPOSE ${FILES[*]} logs -f"
echo "- Rebuild: ./scripts/local-up.sh --rebuild [--dev|--api|--tools]"