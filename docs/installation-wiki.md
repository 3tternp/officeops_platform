# OfficeOps Platform — Installation Wiki

This guide is designed for GitHub Wiki or repository docs. It covers installing and running the OfficeOps Platform locally and deploying to common cloud providers.

## Prerequisites
- Node.js `18+` and npm `9+` (`node -v`, `npm -v`)
- Git (`git --version`)
- Optional: Docker Desktop (for Docker-based setup)
- Optional: Netlify CLI (`npm i -g netlify-cli`) for manual CLI deploys

## Quick Start
```bash
# Clone
git clone https://github.com/3tternp/officeops_platform.git
cd officeops_platform

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start development server
npm run dev
# Open http://localhost:4028
```

## Environment Configuration
Create `.env` from `.env.example` and adjust values as needed.

Common keys:
```env
# Application
NODE_ENV=development
APP_NAME="OfficeOps Platform"
FRONTEND_PORT=4028

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Features
VITE_ENABLE_MOCK_DATA=false
DEBUG=false
```
- The app reads `FRONTEND_PORT`; default dev port is `4028`.
- `VITE_ENABLE_MOCK_DATA=false` shows the Initial Setup wizard and does not seed demo users. Set to `true` to seed demo data and bypass setup (or use `localStorage.setItem('ENABLE_MOCK_DATA','true')` during dev).
- For production builds, `NODE_ENV=production` is recommended.

## Local Installation

### Windows (PowerShell)
```powershell
# From repo root
npm install
Copy-Item .env.example .env
npm run dev
# Open http://localhost:4028
```
Streamlined setup (optional):
```powershell
.\scripts\setup-dev.ps1        # Copies .env and installs deps
npm run dev                     # Start dev server
```

### macOS/Linux (bash)
```bash
npm install
cp .env.example .env
npm run dev
# Open http://localhost:4028
```
Streamlined setup (optional):
```bash
./scripts/setup-dev.sh          # Copies .env, installs deps, builds
npm run dev                     # Start dev server
```

### Build and Preview (production)
```bash
npm run build
npm run preview -- --port 4031
# Open http://localhost:4031
```

## Docker-Based Setup
Use Docker Compose to run the frontend (and optional tools) locally.

macOS/Linux:
```bash
./scripts/local-up.sh --dev          # Dev profile (hot reload)
./scripts/local-up.sh                # Default (frontend + Postgres)
```
Windows (PowerShell):
```powershell
.\scripts\local-up.ps1 -Dev         # Dev profile
.\scripts\local-up.ps1              # Default
```
After startup, access:
- Frontend: `http://localhost:${FRONTEND_PORT}` (default `4028`)

To stop:
```bash
docker compose down
```

## Cloud Deployment

### Netlify (recommended)
Netlify configuration is included in `netlify.toml`.
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects: `/* -> /index.html (200)`
- Node version: `18`

Deploy from Git (auto-deploys on push):
1. Log in to Netlify and create a new site from Git.
2. Connect repo `3tternp/officeops_platform`, branch `master`.
3. Confirm build settings: base `.`; build `npm run build`; publish `dist`.
4. Push to `master` to trigger deploy.

Deploy via CLI (alternative):
```bash
npm run build
npm run netlify:login    # one-time authentication
npm run netlify:init     # link repo to Netlify site
npm run deploy:netlify   # deploy production from dist
```
CI/CD via GitHub Actions:
- Set repo secrets `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`.
- Workflow `.github/workflows/ci-cd.yml` will build and deploy.

### Vercel (alternative static hosting)
```bash
# Install CLI
yarn global add vercel  # or npm i -g vercel
vercel login
vercel link             # select this repo
vercel build
vercel deploy --prod
```
Use Vercel project settings to set `Framework: Other`, output `dist`, and configure SPA rewrite to `index.html`.

### AWS S3 + CloudFront (static hosting)
1. `npm run build` (outputs to `dist`).
2. Create an S3 bucket and enable static website hosting.
3. Upload `dist/` to the bucket.
4. Set index and error documents to `index.html` (SPA routing).
5. Put CloudFront in front of S3 and invalidate cache on new deploys.

### Azure Static Web Apps or Azure Storage Static Website
1. `npm run build`.
2. Choose Azure Static Web Apps (GitHub Action) or Azure Storage static website.
3. For Storage: upload `dist/` and set index/error to `index.html`.

## Troubleshooting
- Node version: ensure `node -v` is `>= 18`. Use `nvm`/`nvs` to switch.
- Port in use: change `FRONTEND_PORT` in `.env` or stop the conflicting process.
- Build warnings (large chunks): consider dynamic `import()`; adjust `vite.config.mjs` `manualChunks`.
- Clean install: delete `node_modules` and `package-lock.json`, then run `npm ci` or `npm install`.
- Netlify auth: ensure you’ve run `npm run netlify:login` or set CI secrets for automated deploys.

## Useful Commands
- `npm run dev` — start development server on `http://localhost:4028`
- `npm run build` — produce production bundle in `dist/`
- `npm run preview` — serve the built bundle locally
- `npm run reinstall` — clean and reinstall dependencies
- `netlify deploy --prod --dir=dist` — deploy built files via Netlify CLI

## References
- `README.md` — overview, Netlify notes, CI/CD
- `INSTALL.md` — extended local and Docker installation details
- `netlify.toml` — production build and headers
- `vite.config.mjs` — build/preview and chunking
- `scripts/` — helpers for setup and local Docker