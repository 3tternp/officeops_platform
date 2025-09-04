# OfficeOps Platform

> A comprehensive enterprise office operations management platform built with React and modern web technologies.

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Demo Accounts](#demo-accounts)
- [API Documentation](#api-documentation)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Support](#support)
- [License](#license)

## 🌟 Overview

OfficeOps Platform is a modern, full-featured enterprise management system designed to streamline office operations, enhance security compliance, and improve organizational efficiency. Built with React 18 and featuring a clean, intuitive interface, it provides comprehensive solutions for user management, asset tracking, document control, risk assessment, and learning management.

### Key Highlights

- **🏢 Enterprise-Ready**: Scalable architecture supporting multi-department organizations
- **🔐 Security-First**: Role-based access control (RBAC) with comprehensive permission management
- **📱 Responsive Design**: Modern UI that works seamlessly across all devices
- **🚀 High Performance**: Optimized for speed with efficient data management
- **🔧 Configurable**: Highly customizable to meet specific organizational needs

## ✨ Features

### 👥 User Management
- **Multi-role support**: Admin, ISO, Manager, Employee, and Auditor roles
- **Department-based organization**: Hierarchical user management
- **Profile management**: User profiles with avatar support
- **Password policies**: Configurable security requirements
- **Activity tracking**: Comprehensive audit logging

### 🛡️ Access Management
- **Request-based access**: Structured access request workflow
- **Approval workflows**: Multi-level approval processes
- **Time-boxed access**: Temporary access with automatic expiration
- **Compliance reporting**: Detailed access audit trails
- **Resource categorization**: Organized system resource management

### 📦 Asset Management
- **Asset lifecycle tracking**: From procurement to disposal
- **Assignment management**: Track asset assignments to users
- **Maintenance scheduling**: Proactive asset maintenance
- **Cost tracking**: Asset valuation and depreciation
- **QR code support**: Quick asset identification and management

### 📄 Document Management
- **Version control**: Track document versions and changes
- **Access permissions**: Role-based document access
- **Digital signatures**: Secure document acknowledgments
- **Policy distribution**: Automated policy distribution and tracking
- **Search capabilities**: Advanced document search and filtering

### ⚠️ Risk Assessment
- **Risk identification**: Comprehensive risk cataloging
- **Impact analysis**: Quantitative risk assessment
- **Mitigation planning**: Risk response strategies
- **Review scheduling**: Automated risk review reminders
- **Reporting dashboards**: Visual risk analytics

### 🎓 Learning Management
- **Course creation**: Interactive learning content
- **Progress tracking**: Individual and team progress monitoring
- **Certification management**: Digital certificate issuance
- **Compliance training**: Mandatory training assignment
- **Assessment tools**: Quiz and evaluation capabilities

### 📊 Analytics & Reporting
- **Interactive dashboards**: Role-specific dashboard views
- **Custom reports**: Flexible reporting engine
- **Data visualization**: Charts and graphs for insights
- **Export capabilities**: PDF and Excel export options
- **Real-time metrics**: Live performance indicators

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Modern UI library with hooks and concurrent features
- **Vite 5.4** - Fast build tool and development server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Beautiful icons and illustrations
- **React Router DOM 7.8** - Client-side routing
- **Recharts 2.15** - Responsive chart library
- **React Hook Form 7.55** - Performant forms with validation
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

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
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
git clone https://github.com/yourusername/officeops-platform.git
cd officeops-platform

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm run dev

# Access the application
# Open http://localhost:3000 in your browser
```

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/officeops-platform.git
cd officeops-platform
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

### 4. Database Setup (Optional for Demo Mode)

The platform includes a demo mode with local storage. For production use:

```bash
# Start PostgreSQL and Redis services
docker-compose up -d database redis

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## ⚙️ Configuration

### Environment Variables

Key configuration options in `.env`:

```env
# Application
NODE_ENV=development
APP_NAME="OfficeOps Platform"
FRONTEND_PORT=3000

# Database (for production)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=officeops
DB_USER=postgres
DB_PASSWORD=your_password

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Features
ENABLE_MOCK_DATA=true
DEBUG=false
```

### Customization

The platform is highly customizable:

- **Themes**: Modify Tailwind configuration in `tailwind.config.js`
- **Components**: All UI components are in `src/components/`
- **Routes**: Configure routing in `src/Routes.jsx`
- **Data Models**: Mock data structure in `src/services/DataService.jsx`

## 📖 Usage

### Login & Authentication

1. Navigate to `http://localhost:3000`
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

1. **Adding a New Employee**:
   - Go to Dashboard → Quick Actions → Employee Onboarding
   - Click "Add Employee" button
   - Fill in user details and assign role/department
   - Save to create the account

2. **Access Request Process**:
   - Navigate to Access Management
   - Create new access request
   - Specify resource and justification
   - Route through approval workflow

3. **Asset Assignment**:
   - Go to Asset Management
   - Select available asset
   - Assign to employee
   - Track assignment history

## 👤 Demo Accounts

The platform includes several pre-configured demo accounts for testing:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Administrator | `admin@demo.com` | `admin123` | Full system access |
| ISO Officer | `iso@demo.com` | `iso123` | Security and compliance |
| Manager | `manager@demo.com` | `mgr123` | Department management |
| Employee | `employee@demo.com` | `emp123` | Basic user access |

### Demo Features

- **Mock Data**: Pre-populated with sample data
- **No Database Required**: Uses localStorage for demo mode
- **Reset Functionality**: Reset to default state anytime
- **Role Switching**: Test different permission levels

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- React: MIT License
- Tailwind CSS: MIT License
- Lucide Icons: ISC License
- Other dependencies: See `package.json` for details

---

<div align="center">

**Built with ❤️ by the OfficeOps Team**

[Website](https://officeops.com) • [Documentation](./docs) • [API Reference](./docs/api.md) • [Contributing](./CONTRIBUTING.md)

</div>
