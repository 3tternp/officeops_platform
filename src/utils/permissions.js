// Role-Based Access Control (RBAC) Utility
// Defines permissions for different user roles across the platform

export const PERMISSIONS = {
  // Document Management Permissions
  DOCUMENT_CREATE: 'document_create',
  DOCUMENT_UPLOAD: 'document_upload',
  DOCUMENT_VIEW: 'document_view',
  DOCUMENT_ACKNOWLEDGE: 'document_acknowledge',
  DOCUMENT_MANAGE: 'document_manage',
  DOCUMENT_DELETE: 'document_delete',
  DOCUMENT_BULK_ACTIONS: 'document_bulk_actions',

  // Learning Management Permissions
  LMS_CREATE_COURSE: 'lms_create_course',
  LMS_UPLOAD_COURSE: 'lms_upload_course',
  LMS_VIEW_COURSE: 'lms_view_course',
  LMS_ASSIGN_COURSE: 'lms_assign_course',
  LMS_TAKE_QUIZ: 'lms_take_quiz',
  LMS_VIEW_PROGRESS: 'lms_view_progress',
  LMS_MANAGE_ALL: 'lms_manage_all',

  // Risk Assessment Permissions
  RISK_VIEW: 'risk_view',
  RISK_CREATE: 'risk_create',
  RISK_MANAGE: 'risk_manage',
  RISK_DELETE: 'risk_delete',

  // Access Management Permissions
  ACCESS_REQUEST: 'access_request',
  ACCESS_APPROVE: 'access_approve',
  ACCESS_VIEW_ALL: 'access_view_all',
  ACCESS_VIEW_OWN: 'access_view_own',

  // User Management Permissions
  USER_CREATE: 'user_create',
  USER_MANAGE: 'user_manage',
  USER_DELETE: 'user_delete',
  USER_VIEW: 'user_view',

  // Asset Management Permissions
  ASSET_REQUEST: 'asset_request',
  ASSET_APPROVE: 'asset_approve',
  ASSET_MANAGE: 'asset_manage',
  ASSET_VIEW: 'asset_view',
  ASSET_CREATE: 'asset_create', // Only admins can create/add new assets
  ASSET_ASSIGN: 'asset_assign', // Assign assets to users
  ASSET_EDIT: 'asset_edit',     // Edit asset details

  // Ticketing Permissions
  TICKET_CREATE: 'ticket_create',
  TICKET_APPROVE: 'ticket_approve',
  TICKET_ASSIGN: 'ticket_assign',
  TICKET_RESOLVE: 'ticket_resolve',
  TICKET_VIEW_ALL: 'ticket_view_all',
  TICKET_VIEW_OWN: 'ticket_view_own',

  // System Permissions
  SYSTEM_SETTINGS: 'system_settings',
  AUDIT_ACCESS: 'audit_access',
  DATA_EXPORT: 'data_export'
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  admin: [
    // All permissions
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_UPLOAD,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_ACKNOWLEDGE,
    PERMISSIONS.DOCUMENT_MANAGE,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.DOCUMENT_BULK_ACTIONS,
    PERMISSIONS.LMS_CREATE_COURSE,
    PERMISSIONS.LMS_UPLOAD_COURSE,
    PERMISSIONS.LMS_VIEW_COURSE,
    PERMISSIONS.LMS_ASSIGN_COURSE,
    PERMISSIONS.LMS_TAKE_QUIZ,
    PERMISSIONS.LMS_VIEW_PROGRESS,
    PERMISSIONS.LMS_MANAGE_ALL,
    PERMISSIONS.RISK_VIEW,
    PERMISSIONS.RISK_CREATE,
    PERMISSIONS.RISK_MANAGE,
    PERMISSIONS.RISK_DELETE,
    PERMISSIONS.ACCESS_REQUEST,
    PERMISSIONS.ACCESS_APPROVE,
    PERMISSIONS.ACCESS_VIEW_ALL,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.ASSET_REQUEST,
    PERMISSIONS.ASSET_APPROVE,
    PERMISSIONS.ASSET_MANAGE,
    PERMISSIONS.ASSET_VIEW,
    PERMISSIONS.ASSET_CREATE, // Only admins can add/create new assets
    PERMISSIONS.ASSET_ASSIGN, // Assign assets to users
    PERMISSIONS.ASSET_EDIT,   // Edit asset details
    PERMISSIONS.TICKET_CREATE,
    PERMISSIONS.TICKET_APPROVE,
    PERMISSIONS.TICKET_ASSIGN,
    PERMISSIONS.TICKET_RESOLVE,
    PERMISSIONS.TICKET_VIEW_ALL,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.AUDIT_ACCESS,
    PERMISSIONS.DATA_EXPORT
  ],
  
  iso: [
    // ISO permissions
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_UPLOAD,
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_ACKNOWLEDGE,
    PERMISSIONS.DOCUMENT_MANAGE,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.DOCUMENT_BULK_ACTIONS,
    PERMISSIONS.LMS_CREATE_COURSE,
    PERMISSIONS.LMS_UPLOAD_COURSE,
    PERMISSIONS.LMS_VIEW_COURSE,
    PERMISSIONS.LMS_ASSIGN_COURSE,
    PERMISSIONS.LMS_VIEW_PROGRESS,
    PERMISSIONS.RISK_VIEW,
    PERMISSIONS.RISK_CREATE,
    PERMISSIONS.RISK_MANAGE,
    PERMISSIONS.ACCESS_REQUEST,
    PERMISSIONS.ACCESS_APPROVE,
    PERMISSIONS.ACCESS_VIEW_ALL,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.ASSET_REQUEST,
    PERMISSIONS.ASSET_VIEW,
    // Ticketing
    PERMISSIONS.TICKET_CREATE,
    PERMISSIONS.TICKET_APPROVE,
    PERMISSIONS.TICKET_ASSIGN,
    PERMISSIONS.TICKET_RESOLVE,
    PERMISSIONS.TICKET_VIEW_ALL,
    PERMISSIONS.AUDIT_ACCESS
  ],
  
  manager: [
    // Manager permissions - NO CREATION RIGHTS, limited asset approval only
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_ACKNOWLEDGE,
    PERMISSIONS.LMS_VIEW_COURSE,
    PERMISSIONS.LMS_TAKE_QUIZ,
    PERMISSIONS.LMS_VIEW_PROGRESS,
    PERMISSIONS.ACCESS_REQUEST,
    PERMISSIONS.ACCESS_VIEW_OWN,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.ASSET_REQUEST,
    PERMISSIONS.ASSET_APPROVE, // Limited to assets under $5K
    PERMISSIONS.ASSET_VIEW,
    // Ticketing
    PERMISSIONS.TICKET_CREATE,
    PERMISSIONS.TICKET_APPROVE,
    PERMISSIONS.TICKET_ASSIGN,
    PERMISSIONS.TICKET_VIEW_ALL
    // NOTE: Manager CANNOT create documents, courses, or assets
  ],
  
  employee: [
    // Employee permissions - Default restricted access
    PERMISSIONS.DOCUMENT_VIEW,
    PERMISSIONS.DOCUMENT_ACKNOWLEDGE,
    PERMISSIONS.LMS_VIEW_COURSE,
    PERMISSIONS.LMS_TAKE_QUIZ,
    PERMISSIONS.LMS_VIEW_PROGRESS,
    PERMISSIONS.ACCESS_REQUEST,
    PERMISSIONS.ACCESS_VIEW_OWN,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.ASSET_REQUEST,
    PERMISSIONS.ASSET_VIEW,
    // Ticketing
    PERMISSIONS.TICKET_CREATE,
    PERMISSIONS.TICKET_VIEW_OWN
  ],
  
  risk_officer: [
    // Risk Officer permissions - risk management focus with read-only access to other modules
    PERMISSIONS.DOCUMENT_VIEW, // Read-only access to documents
    PERMISSIONS.LMS_VIEW_COURSE, // Read-only access to learning content
    PERMISSIONS.RISK_VIEW,
    PERMISSIONS.RISK_CREATE,
    PERMISSIONS.RISK_MANAGE,
    PERMISSIONS.RISK_DELETE, // Full risk management capabilities
    PERMISSIONS.ACCESS_REQUEST,
    PERMISSIONS.ACCESS_VIEW_OWN,
    PERMISSIONS.ASSET_REQUEST,
    PERMISSIONS.ASSET_VIEW,
    // Ticketing
    PERMISSIONS.TICKET_VIEW_ALL,
    PERMISSIONS.TICKET_RESOLVE,
    PERMISSIONS.USER_VIEW
  ]
};

// Helper function to check if user has permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

// Helper function to check multiple permissions (user needs ALL permissions)
export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
};

// Helper function to check if user has any of the given permissions
export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
};

// Get all permissions for a role
export const getRolePermissions = (userRole) => {
  return ROLE_PERMISSIONS[userRole] || [];
};

// Check if user can access a specific module
export const canAccessModule = (userRole, module) => {
  switch (module) {
    case 'documents':
      return hasPermission(userRole, PERMISSIONS.DOCUMENT_VIEW);
    case 'learning':
      return hasPermission(userRole, PERMISSIONS.LMS_VIEW_COURSE);
    case 'risks':
      return hasPermission(userRole, PERMISSIONS.RISK_VIEW);
    case 'access':
      return hasAnyPermission(userRole, [
        PERMISSIONS.ACCESS_VIEW_ALL,
        PERMISSIONS.ACCESS_VIEW_OWN
      ]);
    case 'users':
      return hasPermission(userRole, PERMISSIONS.USER_VIEW);
    case 'assets':
      return hasPermission(userRole, PERMISSIONS.ASSET_VIEW);
    case 'ticketing':
      return hasAnyPermission(userRole, [
        PERMISSIONS.TICKET_VIEW_ALL,
        PERMISSIONS.TICKET_VIEW_OWN
      ]);
    default:
      return false;
  }
};

// Asset approval limits and workflow functions
export const ASSET_APPROVAL_LIMITS = {
  manager: 5000, // Managers can approve assets under $5,000
  iso: Infinity, // ISO can approve any amount
  admin: Infinity // Admin can approve any amount
};

// Check if user can approve an asset based on amount
export const canApproveAsset = (userRole, assetAmount) => {
  if (!hasPermission(userRole, PERMISSIONS.ASSET_APPROVE)) {
    return false;
  }
  
  const approvalLimit = ASSET_APPROVAL_LIMITS[userRole] || 0;
  return assetAmount <= approvalLimit;
};

// Get next approver for assets over manager limit
export const getNextApprover = (assetAmount, currentUserRole) => {
  if (assetAmount >= 5000 && currentUserRole === 'manager') {
    return {
      nextApproverRole: 'admin', // CTO/CEO or designated person
      reason: 'Asset amount exceeds manager approval limit ($5,000)',
      requiresEscalation: true
    };
  }
  
  return {
    nextApproverRole: null,
    reason: 'Within approval limits',
    requiresEscalation: false
  };
};

// Notification targets for asset approval workflow
export const getAssetApprovalNotificationTargets = (assetAmount, approvalStatus) => {
  const notifications = [];
  
  if (approvalStatus === 'approved' && assetAmount < 5000) {
    // Notify IT department for procurement process
    notifications.push({
      target: 'it_department',
      message: 'Asset approved by manager. Please proceed with procurement process.',
      priority: 'normal'
    });
  }
  
  if (assetAmount >= 5000) {
    // Notify designated senior approver (CTO/CEO)
    notifications.push({
      target: 'senior_management',
      message: 'High-value asset request requires senior approval.',
      priority: 'high'
    });
  }
  
  return notifications;
};

export default {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getRolePermissions,
  canAccessModule
};
