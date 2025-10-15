#!/usr/bin/env bash

set -euo pipefail

# Minimal dev setup for OfficeOps Platform (Linux/macOS)
# - Ensures Node 18+ and npm are available
# - Copies .env.example to .env if missing
# - Installs dependencies (npm ci preferred)
# - Optionally builds the app

BUILD=true
for arg in "$@"; do
  case "$arg" in
    --no-build) BUILD=false ;;
    --help|-h)
      echo "Usage: $0 [--no-build]"
      echo "\nPerforms a minimal developer setup: copies .env, installs deps, builds."
      exit 0
      ;;
  esac
done

echo "== OfficeOps Platform: Minimal Dev Setup =="

# Check Node and npm
if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is not installed. Please install Node 18+." >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed. Please install npm." >&2
  exit 1
fi

# Verify Node major version
NODE_MAJOR=$(node -v | sed 's/^v//' | cut -d '.' -f 1)
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Error: Node.js v18+ required. Found $(node -v)." >&2
  exit 1
fi

# Ensure .env exists
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
  else
    echo "Warning: .env.example not found. Create .env manually as needed." >&2
  fi
fi

# Install dependencies
if [ -f package-lock.json ]; then
  echo "Installing dependencies with npm ci"
  npm ci
else
  echo "Installing dependencies with npm install"
  npm install
fi

# Optional build
if [ "$BUILD" = true ]; then
  echo "Building application"
  npm run build
fi

echo "\nDone. Common next steps:"
echo "- Start dev server: npm run dev"
echo "- Preview build:    npm run preview"
echo "- Open locally:     http://localhost:4028/ (dev), http://localhost:4031/ (preview)"