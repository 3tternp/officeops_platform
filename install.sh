#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./install.sh [dev|preview|build]
# Defaults to dev mode.

MODE="${1:-dev}"
PORT="${PORT:-4028}"

info() { echo -e "\033[36m[INFO]\033[0m $*"; }
ok()   { echo -e "\033[32m✔\033[0m $*"; }
err()  { echo -e "\033[31m✖\033[0m $*"; }

need_cmd() { command -v "$1" >/dev/null 2>&1 || { err "$1 not found. Please install it."; exit 1; }; }

# Ensure prerequisites
info "Ensuring prerequisites..."
need_cmd node
need_cmd npm

VERSION=$(node -v | sed 's/^v//')
MAJOR=$(echo "$VERSION" | cut -d. -f1)
if [ "$MAJOR" -lt 18 ]; then err "Node.js $VERSION detected; require >= 18"; exit 1; fi
ok "Node.js $VERSION detected"

# Prepare environment file
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
  ok "Created .env from .env.example"
fi

# Install dependencies
if [ -f package-lock.json ]; then
  info "Installing dependencies (npm ci)..."
  npm ci
else
  info "Installing dependencies (npm install)..."
  npm install
fi

case "$MODE" in
  dev)
    info "Starting Vite dev server on port $PORT..."
    npm run dev -- --host 0.0.0.0 --port "$PORT"
    ;;
  preview)
    info "Building production bundle..."
    npm run build
    info "Starting preview server on port $PORT..."
    npm run preview -- --host 0.0.0.0 --port "$PORT"
    ;;
  build)
    info "Building production bundle..."
    npm run build
    ok "Build complete. See dist/"
    ;;
  *)
    err "Unknown mode: $MODE (use dev|preview|build)"; exit 1;;
esac