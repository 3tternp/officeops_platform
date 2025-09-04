import React from "react";
import { HashRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

// Import all pages
import AccessManagement from './pages/access-management';
import LearningManagement from './pages/learning-management';
import Dashboard from './pages/dashboard';
import DocumentManagement from './pages/document-management';
import AssetManagement from './pages/asset-management';
import RiskAssessment from './pages/risk-assessment';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import PasswordReset from './pages/password-reset';

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && !['admin', 'iso'].includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const Routes = () => {
  try {
    return (
      <HashRouter>
        <RouterRoutes>
        {/* Public Routes */}
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
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
        </RouterRoutes>
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
