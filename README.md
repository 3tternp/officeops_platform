# OfficeOps Platform

> Modern operations control for secure, compliant, and productive teams.

![Version](https://img.shields.io/badge/version-3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-19.2-blue.svg)
![Node](https://img.shields.io/badge/node-22.x-43853d.svg)
![Features](https://img.shields.io/badge/features-enterprise_ready-green.svg)
[![Netlify Status](https://api.netlify.com/api/v1/badges/7e3010cf-8613-4481-b143-2df4e9f6c307/deploy-status)](https://app.netlify.com/sites/officeops-platform/deploys)
[![CI](https://github.com/3tternp/officeops_platform/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/3tternp/officeops_platform/actions/workflows/ci-cd.yml)

**OfficeOps** centralizes user, risk, access, learning, asset, and document programs into one React/Vite workspace. Clean UI, strong RBAC, and seeded demo data make it perfect for quick evaluations and training.

## ✨ Fast Links

- [Overview](#overview)
- [Security Defaults](#-security-defaults)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Docker](#docker-deployment) · [Netlify](#netlify-deployment) · [CI/CD](#cicd)

## 🌟 Overview

OfficeOps is built for enterprise teams that need **security-first workflows** without sacrificing speed. Modules cover user/department management, access approvals, document distribution, risk assessment, learning management, and analytics—all backed by maker-checker guardrails.

### Key Highlights

- **🏢 Enterprise-Ready**: Multi-department architecture with role isolation and approvals
- **🔐 Security-First**: RBAC, rate limits, hashed credentials, and sanitized document rendering
- **📈 GRC Coverage**: Access reviews, risk registers, treatment plans, and policy acknowledgments
- **🧠 Guided UX**: Wizards, checklists, and AI-powered learning content for faster onboarding
- **🎯 Demo-Friendly**: Curated seed data plus scripts for Linux/macOS/Windows and Docker
- **🚀 Performance**: Vite + React 19 + Tailwind with modern bundling defaults

## 🔒 Security Defaults

- **Seeded safely**: Demo credentials are hashed (no plaintext secrets) and audit logs are enabled for login flows.
- **Per-user salts**: All demo/admin credentials ship with salted hashes and optionally use a `VITE_AUTH_PEPPER`; legacy hashes auto-upgrade after a successful login.
- **Document hygiene**: Uploaded document previews are sanitized to neutralize embedded scripts and malicious markup.
- **Defence-in-depth**: Input validation, file-type enforcement, rate limiting, and MFA-ready login paths are built in.
- **RBAC everywhere**: Maker-checker patterns for risk, access, and learning modules prevent unauthorized edits.
- **Environment parity**: Node.js 22 baseline across Netlify, Docker, and local scripts to avoid engine drift.

## 🚀 What's New in 3.0

- **Technological Stack Upgrade**: Updated to latest stable versions of React 19, Vite 7, and Tailwind CSS 4.
- **UI/UX Standardization**: Implemented rigid modal architecture with sticky headers, improved backdrops, and consistent styling across all modules (Ticketing, LMS, Risk Assessment, etc.).
- **Ticketing System**: Create, assign, approve, and resolve tickets end-to-end with new modal experience.
- **LMS Enhancements**: Unified error handling and modal interactions in course creation wizards.
- **Personal Triage**: My Tickets page and dashboard card for assigned work.
- **Navigation Refresh**: Improved sidebar hierarchy and breadcrumbs.
- **Governance Polish**: Consistent settings, profile, department, and user management flows.
- **Security Hardening**: Hashed demo credentials, sanitized document previews, and RBAC-aligned makers/checkers.


## ✨ Features

### 👥 User Management
- **Multi-role support**: Admin, ISO, Manager, Employee, and Auditor roles
- **Department-based organization**: Hierarchical user management
- **Profile management**: Full profile editing with avatar upload functionality
- **Password management**: Secure password change with validation requirements
- **Real-time role switching**: Debug functionality for testing different user roles
- **Activity tracking**: Comprehensive audit logging

### 🛡️ Access Management
- **Request-based access**: Structured access request workflow
- **Approval workflows**: Multi-level approval processes
- **Time-boxed access**: Temporary access with automatic expiration
- **Compliance reporting**: Detailed access audit trails
- **Resource categorization**: Organized system resource management

### 📦 Asset Management
- **Complete CRUD operations**: Create, read, update, and delete assets
- **Asset lifecycle tracking**: From procurement to disposal with full edit capabilities
- **Assignment management**: Track asset assignments to users with return functionality
- **Smart deletion**: Protected deletion with confirmation requirements
- **Dynamic specifications**: Add/remove custom specifications on the fly
- **Status-based permissions**: Prevent deletion of assigned assets
- **Real-time updates**: Changes reflect immediately across the system
- **QR code support**: Quick asset identification and management

### 📄 Document Management
- **Version control**: Track document versions and changes
- **Access permissions**: Role-based document access
- **Digital signatures**: Secure document acknowledgments
- **Policy distribution**: Automated policy distribution and tracking
- **Search capabilities**: Advanced document search and filtering

### 🎟️ Ticketing System
- End-to-end workflow: create, assign, approve, resolve
- My Tickets page with status filters and quick actions
- Dashboard card surfaces assigned tickets for rapid triage
- Role-aware views and actions aligned with existing RBAC

### ⚠️ Risk Assessment
- **Governed intake and ownership**: Risks are created through a guided 4-step wizard with ISO-aligned validation and explicit owner assignment.
- **Complete lifecycle management**: Create, read, update, and delete assessments with edit modals that preserve historical context.
- **Impact and treatment rigor**: Pre/post treatment scoring, residual risk tracking, and mitigation planning with action progress.
- **Asset-aware identification**: Risks can be tied directly to assets, access flows, and documents to improve traceability.
- **Review and expiry discipline**: Automated review scheduling, reminders, and evidence capture for each cycle.
- **Register operations**: Sortable/filterable register with bulk actions, CSV export/import, and template guidance.
- **Analytics and reporting**: Heat maps, dashboards, and a maintained [Risk Posture Report](docs/risk-assessment-report.md) for executives.

### 🎓 Learning Management
- **Course creation**: Interactive learning content
- **Progress tracking**: Individual and team progress monitoring
- **Certification management**: Digital certificate issuance
- **Compliance training**: Mandatory training assignment
- **Assessment tools**: Quiz and evaluation capabilities

### 📊 Analytics & Reporting
- **Interactive dashboards**: Role-specific dashboard views with real-time data
- **Custom reports**: Flexible reporting engine
- **Data visualization**: Charts and graphs for insights
- **Export capabilities**: PDF and Excel export options
- **Real-time metrics**: Live performance indicators
- **Asset statistics**: Comprehensive asset tracking and analytics

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - Modern UI library with hooks and concurrent features
- **Vite 7.2** - Fast build tool and development server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Beautiful icons and illustrations
- **React Router DOM 7.9** - Client-side routing
- **Recharts 3.4** - Responsive chart library
- **React Hook Form 7.66** - Performant forms with validation
- **Date-fns 4.1** - Modern date utility library

### Backend (Planned)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### Development & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server and reverse proxy
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your development machine:

- **Node.js** (v22.0.0 or higher)
- **npm** (v10.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Docker** (v20.0.0 or higher) - for containerized deployment
- **Docker Compose** (v2.0.0 or higher) - for multi-container setup
- **PostgreSQL** (v13.0 or higher) - if running database locally
- **Git** (v2.30.0 or higher) - for version control

### System Requirements

- **RAM**: Minimum 4GB, Recommended 8GB+
- **Disk Space**: At least 2GB free space
- **Operating System**: Windows 10+, macOS 10.15+, or Linux Ubuntu 18.04+

## 🚀 Quick Start

Get the platform running in less than 5 minutes:

```bash
# Clone the repository
git clone https://github.com/3tternp/officeops_platform.git
cd officeops_platform

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run dev

# Access the application
# Open http://localhost:4028 in your browser
```

## CI/CD

- GitHub Actions runs the "OfficeOps Platform CI/CD" workflow on `push` to `main`/`develop` and `pull_request` to `main`.
- Jobs include test/build (`npm ci`, `npm run build`), security scans (`npm audit`, Trivy), Docker build/push for `main`, and Lighthouse perf checks on PRs.
- The workflow uploads build artifacts from `dist/` and can deploy to Netlify when `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets are configured.
- Netlify auto-deploys from Git; deploy status is shown via the badge above.

Secrets to enable Netlify deploy in CI:
- `NETLIFY_AUTH_TOKEN`: Personal access token from Netlify.
- `NETLIFY_SITE_ID`: Site ID for `officeops-platform.netlify.app`.

Workflow file: `.github/workflows/ci-cd.yml`.

## 📦 Installation

### 🚀 Quick Start (Recommended)

#### One-Line Installation

**Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/3tternp/officeops_platform/main/install.sh | sudo bash
```

**Windows PowerShell (Run as Administrator):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
iwr -useb https://raw.githubusercontent.com/3tternp/officeops_platform/main/install.ps1 | iex
```

#### Local Installer Usage

**Linux/Unix:**
```bash
./install.sh dev
./install.sh dev --docker-db
./install.sh dev-netlify
```

**Windows:**
```powershell
.\install.ps1 -Mode dev
.\install.ps1 -Mode dev -DockerDb
.\install.ps1 -Mode dev-netlify
```

### 🔧 Manual Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/3tternp/officeops_platform.git
cd officeops_platform
```

#### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

#### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

### 4. Database Setup (Optional)

For front-end demo, no database is required. To run PostgreSQL locally via Docker:

```bash
docker compose up -d db
```



### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:4028`.

## ⚙️ Configuration

### Environment Variables

Key configuration options in `.env`:

```env
# Application
NODE_ENV=development
APP_NAME="OfficeOps Platform"
FRONTEND_PORT=4028

# Database (for production)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=officeops
DB_USER=postgres
DB_PASSWORD=your_password

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
VITE_AUTH_PEPPER=optional_client_side_pepper

# Features
VITE_ENABLE_MOCK_DATA=true
DEBUG=false
```

Email function (Netlify):

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_user
SMTP_PASS=your_password
SMTP_FROM=noreply@example.com
ALLOWED_EMAIL_DOMAINS=example.com,another.org
```

### Customization

The platform is highly customizable:

- **Themes**: Modify Tailwind configuration in `tailwind.config.js`
- **Components**: All UI components are in `src/components/`
- **Routes**: Configure routing in `src/Routes.jsx`
- **Data Models**: Mock data structure in `src/services/DataService.jsx`

## 🔄 Application Workflows

Use the **[Application Workflows](docs/application-workflow.md)** guide to understand the end-to-end flows for access approvals, asset lifecycle steps, and LMS module gating (including ISO/admin roles and automatic reviews/expiry). For a visual handoff, use the **[Figma Workflow Blueprint](docs/figma-workflow-blueprint.md)** to build or verify the diagram before implementation.
Use the **[Application Workflows](docs/application-workflow.md)** guide to understand the end-to-end flows for access approvals, asset lifecycle steps, and LMS module gating (including ISO/admin roles and automatic reviews/expiry).

## 🖼️ Screenshots

- Place images and GIFs under `docs/assets/`.
- Recommended examples:
  - `docs/assets/overview.png` – Main dashboard overview
  - `docs/assets/lms-actions.png` – LMS course details showing gated actions
  - `docs/assets/access-approval-iso.png` – Access approval modal with ISO routing
  - `docs/assets/demo.gif` – Short demo of key workflows
- Embed example:
  - `![Overview](docs/assets/overview.png)`
  - `![LMS Actions](docs/assets/lms-actions.png)`
  - `![Access Approval ISO](docs/assets/access-approval-iso.png)`
  - `![Demo](docs/assets/demo.gif)`

## 📖 Usage

### Login & Authentication

1. Navigate to `http://localhost:4028`
2. Use one of the demo accounts (see [Demo Accounts](#demo-accounts))
3. Explore different features based on your role permissions

### Navigation

- **Dashboard**: Overview of key metrics and activities
- **User Management**: Add, edit, and manage user accounts
- **Access Management**: Handle access requests and permissions
- **Asset Management**: Track and manage organizational assets
- **Document Management**: Organize and control documents
- **Risk Assessment**: Identify and manage organizational risks
- **Learning Management**: Create and track training programs

### Key Workflows

1. **Profile Management**:
   - Click profile picture in header → "Profile Settings"
   - Upload new profile picture (JPG, PNG, GIF up to 5MB)
   - Edit personal information (name, email, phone, job title)
   - Change password with security validation
   - Changes save immediately and sync across the system

2. **Asset Management (Admin)**:
   - Navigate to Asset Management from sidebar
   - **Add Assets**: Click "Add Asset" → Fill details → Save
   - **Edit Assets**: Click blue edit icon → Modify fields → Update
   - **Delete Assets**: Click red delete icon → Type Asset ID → Confirm
   - **Assign Assets**: Select available asset → Assign to user
   - **Track Assets**: View real-time status and assignment history

3. **Access Request Process**:
   - Navigate to Access Management
   - Create new access request
   - Specify resource and justification
   - Route through approval workflow

4. **Role Testing (Debug Mode)**:
   - Use role switcher in header (development only)
   - Switch between Admin, ISO, Manager, Employee roles
   - Test different permission levels and features

## 🔑 RBAC Permissions

- Roles: `admin`, `iso`, `manager`, `employee`, `risk_officer`
- Admin has full permissions across modules.
- ISO focuses on security/compliance with access approvals and LMS management.
- Manager and Employee have limited, role-appropriate permissions.

LMS actions:
- Edit Course requires `LMS_CREATE_COURSE` or `LMS_MANAGE_ALL`.
- Assign Course requires `LMS_ASSIGN_COURSE` or `LMS_MANAGE_ALL`.
- Create Assignment requires `LMS_ASSIGN_COURSE` or `LMS_MANAGE_ALL`.

Access Management:
- Access requests routed to `Information Technology` are approved by `ISO`.
- Approver label displays `ISO` for IT routing in approval modals.

These rules are enforced via `src/utils/permissions.js` and applied across components.

## 👤 Demo Accounts

The platform includes several pre-configured demo accounts for comprehensive testing:

| Role | Email | Password | Access Level | Key Features |
|------|-------|----------|--------------|-------------|
| **Administrator** | `admin@demo.com` | `admin123` | Full system access | Asset CRUD, User Management, All Features |
| **ISO Officer** | `iso@demo.com` | `iso123` | Security and compliance | Access Approval, Risk Management |
| **Manager** | `manager@demo.com` | `mgr123` | Department management | Team Management, Asset Requests |
| **Employee** | `employee@demo.com` | `emp123` | Basic user access | Profile Management, Asset Requests |

### Demo Features

- **Complete Functionality**: All features are fully working
- **Real-time Updates**: Changes persist during session
- **Profile Pictures**: Upload and manage profile photos
- **Asset Management**: Full CRUD operations for admins
- **Role-based Permissions**: Different access levels per role
- **Mock Data**: Pre-populated with realistic sample data
- **No Database Required**: Uses localStorage for demo mode
- **Debug Tools**: Role switcher for easy testing (development mode)
- **Instant Testing**: No setup required, ready to use

## 🚀 Recent Updates & Feature Status

### ✅ **Fully Implemented Features**

#### 👤 **Profile Management System**
- **Profile Picture Upload**: Support for JPG, PNG, GIF files up to 5MB
- **Real-time Updates**: Changes sync immediately across header and profile views
- **Complete Profile Editing**: Name, email, department, job title, phone number
- **Secure Password Management**: Change passwords with validation and strength requirements
- **Form Validation**: Real-time feedback and error handling
- **Role Display**: Dynamic role badges and status indicators

#### 📦 **Asset Management System**
- **Complete CRUD Operations**: Create, Read, Update, Delete functionality
- **Smart Edit Modal**: Comprehensive asset editing with dynamic specifications
- **Protected Deletion**: Confirmation-based deletion with Asset ID verification
- **Assignment Protection**: Prevents deletion of assigned assets
- **Real-time Updates**: Changes reflect immediately without page refresh
- **Custom Specifications**: Add/remove asset specifications dynamically
- **Status Management**: Comprehensive status and condition tracking
- **Admin-only Controls**: Edit and delete buttons restricted to administrators

#### ⚠️ **Risk Assessment System**
- **Complete CRUD Operations**: Guided 4-step creation wizard plus edit modals for continuous risk lifecycle management.
- **ISO/Owner Accountability**: Every risk tracks a named owner and ISO reviewer to align with governance checkpoints.
- **Risk Register Management**: Sortable/filterable register with bulk actions, CSV export, and ingestion via templates.
- **Treatment Planning**: Action plans with status, owners, and evidence fields to reduce pre-treatment scores.
- **Risk Scoring**: Automatic pre/post treatment calculations with residual risk visibility.
- **Visual Analytics**: Heat maps, dashboards, and drill-downs by likelihood, impact, and control effectiveness.
- **Asset Integration**: Risks can be created from assets or access flows to strengthen traceability.
- **Review Management**: Automated scheduling, reminders, and attestation evidence capture for audits.
- **Executive Reporting**: See the consolidated [Risk Posture Report](docs/risk-assessment-report.md) for open/closed trends and recommendations.

#### 🔄 **System Integration**
- **Role-based Access Control**: Different UI elements based on user permissions
- **Debug Mode**: Role switcher for testing different user levels (development)
- **Data Persistence**: Changes saved to localStorage for demo functionality
- **Responsive Design**: All modals and forms work across device sizes
- **Error Handling**: Comprehensive error management and user feedback

### 📋 **Implementation Status**

| Module | Create | Read | Update | Delete | Status |
|--------|--------|------|--------|--------|---------|
| **User Management** | ✅ | ✅ | ✅ | ✅ | Complete |
| **Profile Settings** | ✅ | ✅ | ✅ | ✅ | **NEW** |
| **Asset Management** | ✅ | ✅ | ✅ | ✅ | **FIXED** |
| **Access Management** | ✅ | ✅ | ✅ | ❌ | Partial |
| **Document Management** | ✅ | ✅ | ❌ | ❌ | Partial |
| **Risk Assessment** | ✅ | ✅ | ❌ | ❌ | Partial |
| **Learning Management** | ✅ | ✅ | ❌ | ❌ | Partial |
| **Ticketing System** | ✅ | ✅ | ✅ | ✅ | Complete |

### 📊 Risk Posture Snapshot

- **Open risks:** 6 (2 critical, 3 high, 1 medium)
- **In progress:** 4 (mitigations underway with evidence capture)
- **Closed/accepted:** 5 (residual risk documented with sign-off)
- **Read the full summary:** [Risk Posture Report](docs/risk-assessment-report.md)

### 🎯 **Testing Scenarios**

#### **Profile Management Testing**
```bash
# Login as any user
1. Click profile picture in header
2. Select "Profile Settings"
3. Upload a new profile picture
4. Edit personal information
5. Change password with validation
6. Verify changes appear in header immediately
```

#### **Asset Management Testing (Admin Only)**
```bash
# Login as admin@demo.com / admin123
1. Navigate to Asset Management
2. Add new asset with specifications
3. Edit existing asset (blue icon)
4. Try to delete assigned asset (should prevent)
5. Delete available asset (red icon, confirm with Asset ID)
6. Verify real-time updates in asset catalog
```

#### **Risk Assessment Testing (Maker-Checker Roles)**

**Admin / ISO (creator & checker)**
```bash
# Login as admin@demo.com / admin123 or iso@demo.com / iso123
1. Navigate to Risk Assessment
2. Create a new risk assessment using the 4-step wizard (maker)
3. Edit existing risks or treatment plans (checker) and save updates
4. Download CSV template and test bulk upload/import
5. Filter and sort risks in the register table
6. View interactive heat map visualization and analytics
```

**CRO viewer (risk_officer)**
```bash
# Login as a CRO viewer account
1. Navigate to Risk Assessment
2. Verify the register is view-only (no create/edit/delete actions)
3. Open risk details, analytics, and heat map for oversight
```

**Unauthorized roles (e.g., employee/manager)**
```bash
1. Navigate to Risk Assessment
2. Confirm the restricted access notice instructs users to switch to Admin/ISO for register changes
```

#### **System Health Checks**
```bash
# Run comprehensive health check (Linux/macOS)
./health-check.sh

# Run health check (Windows)
.\health-check.ps1

# Detailed health check with more information
.\health-check.ps1 -Detailed

# Health check with custom installation path
.\health-check.ps1 -InstallPath "D:\OfficeOps"
```

### 🔧 **Technical Implementation**
- **React 18.2** with modern hooks and state management
- **Tailwind CSS 3.4** for consistent styling
- **Component-based Architecture** with reusable UI elements
- **TypeScript-ready** data models and interfaces
- **Responsive Design** with mobile-first approach
- **Error Boundaries** and comprehensive error handling
- **Performance Optimized** with efficient re-rendering

## 📚 API Documentation

### Demo Mode APIs

The platform includes simulated API endpoints:

```javascript
// User Management
dataService.getUsers()
dataService.addUser(userData)
dataService.updateUser(userId, updates)
dataService.deleteUser(userId)

// Access Requests
dataService.getAccessRequests()
dataService.createAccessRequest(requestData)
dataService.approveAccessRequest(requestId, approvalData)

// Asset Management
dataService.getAssets()
dataService.addAsset(assetData)
dataService.assignAsset(assetId, userId)
```

### Data Models

Key data structures used throughout the platform:

```typescript
// User Model
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'iso' | 'manager' | 'employee';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  createdDate: string;
}

// Access Request Model
interface AccessRequest {
  id: string;
  requesterId: string;
  resourceId: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
}
```

## 🐳 Docker Deployment

### Quick Start with Docker

```bash
# Production deployment
docker-compose up -d

# Development with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --profile dev

# Include development tools (Adminer, MailHog)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --profile dev --profile tools
```

### Development Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Environment

```bash
# Build and start production containers
docker-compose -f docker-compose.yml up -d

# Scale frontend instances
docker-compose up -d --scale frontend=3

# Update specific service
docker-compose up -d --build frontend
```

### Container Architecture

- **Frontend**: React app served by Nginx
- **Backend**: Node.js/Express API server
- **Database**: PostgreSQL for data persistence
- **Cache**: Redis for sessions and caching
- **Proxy**: Nginx as reverse proxy and load balancer

## ☁️ Netlify Deployment

- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing and headers configured via `netlify.toml`

Automatic deploys (recommended):
- Log in to Netlify and create a new site from Git.
- Connect GitHub repo `3tternp/officeops_platform` and select branch `master`.
- Confirm build settings: base `.`; build `npm run build`; publish `dist`.
- Deploys trigger automatically on pushes to `master`.

CLI deploy (alternative):
- `npm run build`
- `npm run netlify:login`  # one-time
- `npm run netlify:init`   # link local repo to Netlify site
- `npm run deploy:netlify` # deploy production build from `dist`

Notes:
- Node version 22 is enforced via `.nvmrc` and `netlify.toml`; if you see Netlify errors about unsupported engines, confirm the site is using Node 22.
- SPA redirects are already configured to avoid 404 on refresh.
- If using external APIs, ensure required `VITE_*` env vars are defined in Netlify.

## 🚀 Local Installation

### Prerequisites
- Node.js 22+
- npm 10+

### Steps
- Clone the repository: `git clone https://github.com/yourusername/officeops-platform.git`
- Change into the folder: `cd officeops-platform`
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Open the app: `http://localhost:4028` (or the port shown in terminal)

### Scripted setup

- Linux/macOS: `./install.sh dev` (set `PACKAGE_MANAGER=pnpm` or `yarn` to use an alternative manager)
- Windows (PowerShell): `./install.ps1 -Mode dev -PackageManager npm`

### Production Preview (locally)
- Build: `npm run build`
- Preview: `npm run preview -- --port 4031`
- Open: `http://localhost:4031`

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- **Code Style**: Follow existing code conventions
- **Testing**: Add tests for new features
- **Documentation**: Update docs for any changes
- **Commits**: Use conventional commit messages

### Areas for Contribution

- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📖 Documentation updates
- 🎨 UI/UX improvements
- 🔧 Performance optimizations
- 🧪 Test coverage expansion

## 🔧 Troubleshooting

### Common Issues

**Issue: Application won't start**
```bash
# Clear cache and reinstall
npm run clean
npm install
npm run dev
```

**Issue: Profile pictures not uploading**
- Ensure image is under 5MB
- Use supported formats: JPG, PNG, GIF
- Check browser console for errors

**Issue: Asset edit/delete not working**
- Login as admin user (admin@demo.com)
- Ensure asset is in correct status for deletion
- Refresh page if buttons don't appear

**Issue: Database connection errors**
```bash
# Check Docker services
docker-compose ps

# Restart database
docker-compose restart database
```

**Issue: Permission denied errors**
```bash
# Fix file permissions (Linux/Mac)
chmod -R 755 .
```

### Debug Mode

Enable debug mode for detailed logging:

```env
DEBUG=true
LOG_LEVEL=debug
```

### Performance Issues

- Clear browser cache and localStorage
- Check network connectivity
- Monitor system resources
- Review browser console for errors

## 📞 Support

### Documentation

- **Setup Guide**: See `SETUP.md` for detailed installation instructions
- **Architecture**: Review `docs/architecture.md` for system design
- **API Reference**: Check `docs/api.md` for endpoint documentation

### Community

- **Issues**: Report bugs and request features on GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions
- **Stack Overflow**: Tag questions with `officeops-platform`

### Commercial Support

For enterprise support, custom development, or consulting services, please contact:
- **Email**: support@officeops.com
- **Website**: https://officeops.com
- **Response Time**: Within 24 hours for urgent issues

### Current Development Status
- **Version**: 3.0 (Latest)
- **Last Updated**: January 2025
- **Status**: Active Development
- **Demo URL**: http://localhost:4028
- **Latest Feature**: Ticketing system with implementation status and attachments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- React: MIT License
- Tailwind CSS: MIT License
- Lucide Icons: ISC License
- Other dependencies: See `package.json` for details

## 🏆 Contributors

Thanks to all the contributors who have helped make OfficeOps Platform better:

- **Risk Assessment System** - Complete CRUD implementation with EditRiskModal and multi-step wizards
- **Profile Management System** - Complete implementation with avatar upload and password management
- **Asset Management CRUD** - Full create, read, update, delete functionality with smart validation
- **UI/UX Enhancements** - Modern responsive design with comprehensive user experience
- **Docker & DevOps** - Enhanced containerization with development and production configurations
- **Debug Tools** - Role switching functionality for easy testing and development

## 🎉 Changelog

### Version 3.0 (Latest)
- ✅ NEW: Ticketing system with create, assign, approve, resolve workflow
- ✅ NEW: Implementation Status tracking updated on assign/resolve actions
- ✅ NEW: Optional image attachments in tickets with preview and list thumbnail
- ✅ ENHANCED: Navigation and dashboard with Personal Tickets card
- ✅ IMPROVED: UI/UX across forms, tables, and modals; accessibility and responsiveness
- ✅ UPDATED: Installers import PostgreSQL schema/seeds; README/INSTALL for SQL init

### Version 2.3.0
- ✅ **NEW**: Complete Risk Assessment CRUD operations with EditRiskModal
- ✅ **NEW**: Multi-step risk assessment creation and editing wizards
- ✅ **NEW**: Risk register management with advanced filtering and sorting
- ✅ **NEW**: Treatment planning with progress tracking and status management
- ✅ **NEW**: Risk analytics dashboard with interactive heat maps
- ✅ **NEW**: CSV template support for bulk risk register operations
- ✅ **ENHANCED**: Asset integration with risk assessment workflows
- ✅ **IMPROVED**: Risk scoring algorithms with pre/post treatment calculations
- ✅ **UPDATED**: Docker configuration with development environment support
- ✅ **UPDATED**: Environment variables cleanup and optimization

### Version 2.2.0
- ✅ **NEW**: Complete Profile Settings with avatar upload and password management
- ✅ **FIXED**: Asset Management edit and delete functionality
- ✅ **ENHANCED**: Real-time updates across all components
- ✅ **IMPROVED**: User experience with better validation and feedback
- ✅ **ADDED**: Debug mode with role switching for testing

### Version 2.1.0
- ✅ Initial platform release with basic CRUD operations
- ✅ User Management and Authentication system
- ✅ Dashboard with analytics and reporting
- ✅ Asset catalog and assignment functionality

---

**Built with ❤️ by the OfficeOps Development Team**

🌟 **Star this repo if you find it helpful!** 🌟

[Live Demo](http://localhost:4028) • [Documentation](./docs) • [Issues](../../issues) • [Contributing](./CONTRIBUTING.md)

**Ready to explore? Start with `npm run dev` and visit http://localhost:4028**

</div>
