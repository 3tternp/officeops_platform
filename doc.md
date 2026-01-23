# OfficeOps Platform Documentation

## Architecture Overview

The OfficeOps Platform is a modern, single-page application (SPA) built for enterprise operations management. It utilizes a client-side architecture with a planned transition to a full-stack implementation.

### Architectural Diagram

```mermaid
graph TD
    Client[Client Browser]
    
    subgraph Frontend [React / Vite SPA]
        Router[React Router]
        Auth[Auth Context]
        
        subgraph Modules
            UserMgmt[User Management]
            AssetMgmt[Asset Management]
            DocMgmt[Document Management]
            RiskMgmt[Risk Assessment]
            LMS[Learning Management]
            Ticketing[Ticketing System]
        end
        
        subgraph Services
            DataService[Data Service (Mock/Local)]
            AuthService[Auth Service]
            FileService[File Service]
        end
        
        Router --> Auth
        Auth --> Modules
        Modules --> Services
    end
    
    subgraph Storage
        LocalStorage[(LocalStorage / IndexedDB)]
        Assets[Static Assets]
    end
    
    Services --> LocalStorage
    Frontend --> Assets
```

### Component Structure

The application follows a modular directory structure:

- **`src/components/`**: Reusable UI components (Buttons, Modals, Inputs)
- **`src/contexts/`**: Global state management (User, Theme)
- **`src/pages/`**: Feature-specific page components
- **`src/services/`**: Data abstraction layer
- **`src/utils/`**: Helper functions and constants

### Key Technologies

1.  **Frontend Framework**: React 19.2
2.  **Build Tool**: Vite 7.2
3.  **Styling**: Tailwind CSS 4.1
4.  **Routing**: React Router DOM 7.9
5.  **State Management**: React Context + Hooks
6.  **Data Persistence**: LocalStorage (Demo Mode)

### Data Flow

1.  **User Interaction**: User interacts with UI components.
2.  **State Update**: Components trigger service methods.
3.  **Data Persistence**: Services update LocalStorage/State.
4.  **Re-render**: React Context propagates changes to subscribers.

### Security Model

- **RBAC**: Role-Based Access Control enforced at Route and Component level.
- **Sanitization**: DOMPurify for user-generated content.
- **Authentication**: JWT-like token simulation and session management.

## Module Details

### 1. User Management
Handles user lifecycle, roles, and departments.
- **Key Files**: `src/pages/user-management/*`
- **Features**: CRUD, Profile Upload, Password Reset.

### 2. Asset Management
Tracks physical and digital assets.
- **Key Files**: `src/pages/asset-management/*`
- **Features**: Check-in/Check-out, Lifecycle Tracking, QR Codes.

### 3. Risk Assessment
ISO-compliant risk registry.
- **Key Files**: `src/pages/risk-assessment/*`
- **Features**: 4-step Risk Wizard, Heatmaps, Mitigation Plans.

### 4. Learning Management (LMS)
Training and certification platform.
- **Key Files**: `src/pages/learning-management/*`
- **Features**: Course Creation Wizard, SCORM Support, Quizzes.

### 5. Ticketing
Internal helpdesk system.
- **Key Files**: `src/pages/ticketing/*`
- **Features**: Issue Tracking, Approval Workflows.

### 6. Document Management
Secure file storage and versioning.
- **Key Files**: `src/pages/document-management/*`
- **Features**: Version Control, Access Lists, Previews.

## Deployment

The application is container-ready and supports static hosting.

- **Docker**: `Dockerfile` and `docker-compose.yml` included.
- **Netlify**: Configured via `netlify.toml`.
- **CI/CD**: GitHub Actions workflow for automated testing and building.
