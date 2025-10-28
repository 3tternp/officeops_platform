import React, { Suspense } from "react";
import { HashRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";
import { LoadingSpinner } from './components/ui/LoadingStates';

// Lazily import pages for route-based code splitting
const AccessManagement = React.lazy(() => import('./pages/access-management'));
const LearningManagement = React.lazy(() => import('./pages/learning-management'));
const Dashboard = React.lazy(() => import('./pages/dashboard'));
const DocumentManagement = React.lazy(() => import('./pages/document-management'));
const AssetManagement = React.lazy(() => import('./pages/asset-management'));
const RiskAssessment = React.lazy(() => import('./pages/risk-assessment'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Login = React.lazy(() => import('./pages/Login'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
// Temporarily using direct import instead of lazy
import UserManagementDirect from './pages/UserManagement';
const UserManagement = UserManagementDirect;
const DepartmentManagement = React.lazy(() => import('./pages/DepartmentManagement'));
const PasswordReset = React.lazy(() => import('./pages/password-reset'));
const Ticketing = React.lazy(() => import('./pages/ticketing'));
const InitialSetup = React.lazy(() => import('./pages/InitialSetup'));

// Simple 404 component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Go to Dashboard</a>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useUser();

  // Read setup status and mock/demo flag
  const adminSetupComplete = localStorage.getItem('officeops_admin_setup_complete') === 'true';
  const enableMock = (
    (import.meta.env?.VITE_ENABLE_MOCK_DATA === 'true') ||
    localStorage.getItem('ENABLE_MOCK_DATA') === 'true'
  );

  if (!isAuthenticated) {
    if (!enableMock && !adminSetupComplete) {
      return <Navigate to="/setup" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Enforce exact role matching when a requiredRole is specified
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const Routes = () => {
  try {
    return (
      <HashRouter>
        <Suspense fallback={(
          <div className="min-h-screen flex items-center justify-center bg-white">
            <LoadingSpinner size="lg" text="Loading page..." />
          </div>
        )}>
          <RouterRoutes>
        {/* Public Routes */}
        <Route path="/setup" element={<InitialSetup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset" element={
          <ProtectedRoute>
            <PasswordReset />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/access-management" element={
          <ProtectedRoute>
            <AccessManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/learning-management" element={
          <ProtectedRoute>
            <LearningManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/document-management" element={
          <ProtectedRoute>
            <DocumentManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/asset-management" element={
          <ProtectedRoute>
            <AssetManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/risk-assessment" element={
          <ProtectedRoute>
            <RiskAssessment />
          </ProtectedRoute>
        } />
        
        <Route path="/ticketing" element={
          <ProtectedRoute>
            <Ticketing />
          </ProtectedRoute>
        } />
        
        {/* Admin-only Routes */}
        <Route path="/user-management" element={
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/department-management" element={
          <ProtectedRoute requiredRole="admin">
            <DepartmentManagement />
          </ProtectedRoute>
        } />
        
        {/* User Profile and Settings */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute requiredRole="admin">
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </HashRouter>
    );
  } catch (error) {
    console.error('🚨 Routes component error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Routes Error</h2>
            <p className="text-sm text-red-600 mb-4">{error?.message || 'Failed to load application routes'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Routes;
