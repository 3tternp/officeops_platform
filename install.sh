#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-dev}"
PORT="${PORT:-4028}"
NETLIFY_PORT="${NETLIFY_PORT:-8888}"
WITH_DOCKER_DB=0
PACKAGE_MANAGER="${PACKAGE_MANAGER:-npm}"
for arg in "$@"; do
  if [ "$arg" = "--docker-db" ]; then WITH_DOCKER_DB=1; fi
done

info() { echo -e "\033[36m[INFO]\033[0m $*"; }
ok()   { echo -e "\033[32m✔\033[0m $*"; }
err()  { echo -e "\033[31m✖\033[0m $*"; }

need_cmd() { command -v "$1" >/dev/null 2>&1 || { err "$1 not found. Please install it."; exit 1; }; }

run_script() {
  local script="$1"; shift
  case "$PACKAGE_MANAGER" in
    npm) npm run "$script" -- "$@" ;;
    pnpm) pnpm run "$script" -- "$@" ;;
    yarn) yarn "$script" -- "$@" ;;
    *) err "Unsupported package manager: $PACKAGE_MANAGER"; exit 1 ;;
  esac
}

install_deps() {
  case "$PACKAGE_MANAGER" in
    npm)
      if [ -f package-lock.json ]; then
        info "Installing dependencies (npm ci)..."
        npm ci || { info "npm ci failed; falling back to npm install"; npm install; }
      else
        info "Installing dependencies (npm install)..."
        npm install
      fi
      ;;
    pnpm)
      need_cmd pnpm
      if [ -f pnpm-lock.yaml ]; then
        info "Installing dependencies (pnpm install --frozen-lockfile)..."
        pnpm install --frozen-lockfile
      else
        info "Installing dependencies (pnpm install)..."
        pnpm install
      fi
      ;;
    yarn)
      need_cmd yarn
      if [ -f yarn.lock ]; then
        info "Installing dependencies (yarn install --frozen-lockfile)..."
        yarn install --frozen-lockfile
      else
        info "Installing dependencies (yarn install)..."
        yarn install
      fi
      ;;
    *)
      err "Unsupported package manager: $PACKAGE_MANAGER"; exit 1
      ;;
  esac
}

# Ensure prerequisites
info "Ensuring prerequisites..."
need_cmd node
need_cmd "$PACKAGE_MANAGER"

# optional: warn if SMTP envs missing when functions used
if [ "$MODE" = "dev-netlify" ]; then
  missing=0
  for var in SMTP_HOST SMTP_PORT SMTP_SECURE SMTP_USER SMTP_PASS SMTP_FROM; do
    if [ -z "${!var:-}" ]; then
      missing=1
    fi
  done
  if [ "$missing" -eq 1 ]; then
    info "SMTP env vars not fully set; send-email function may fail. Configure in .env or shell."
  else
    ok "SMTP env vars present"
  fi
fi

VERSION=$(node -v | sed 's/^v//')
MAJOR=$(echo "$VERSION" | cut -d. -f1)
if [ "$MAJOR" -lt 22 ]; then err "Node.js $VERSION detected; require >= 22"; exit 1; fi
ok "Node.js $VERSION detected"

# Prepare environment file
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
  ok "Created .env from .env.example"
fi

install_deps

if [ "$WITH_DOCKER_DB" = "1" ]; then
  info "Starting Docker PostgreSQL service (db)..."
  if command -v docker >/dev/null 2>&1; then
    if docker compose version >/dev/null 2>&1; then
      docker compose up -d db
    elif command -v docker-compose >/dev/null 2>&1; then
      docker-compose up -d db
    else
      err "docker compose not found"; exit 1
    fi
  else
    err "Docker not found"; exit 1
  fi
  ok "Docker db service running"
fi

case "$MODE" in
  dev)
    info "Starting Vite dev server on port $PORT..."
    run_script dev --host 0.0.0.0 --port "$PORT"
    ;;
  dev-netlify)
    info "Starting Netlify dev (functions + proxy) on port $NETLIFY_PORT and Vite on $PORT..."
    npx netlify dev --functions netlify/functions -c "$PACKAGE_MANAGER run dev -- --host 0.0.0.0 --port $PORT" --port "$NETLIFY_PORT"
    ;;
  preview)
    info "Building production bundle..."
    run_script build
    info "Starting preview server on port $PORT..."
    run_script preview --host 0.0.0.0 --port "$PORT"
    ;;
  build)
    info "Building production bundle..."
    run_script build
    ok "Build complete. See dist/"
    ;;
  *)
    err "Unknown mode: $MODE (use dev|preview|build|dev-netlify)"; exit 1;;
  esac
