// Enhanced Access Management Entities
// Supporting Proxy Access Requests, Enhanced Resource Ownership, ISO Review Workflow, and Access Review Notifications

export const AccessRequestStatus = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ISO_REVIEW: 'iso_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  REVOKED: 'revoked'
};

export const NotificationStatus = {
  SENT: 'sent',
  ACKNOWLEDGED: 'acknowledged',
  COMPLETED: 'completed',
  ESCALATED: 'escalated',
  OVERDUE: 'overdue'
};

export const ApprovalStage = {
  MANAGER: 'manager',
  ISO_OFFICER: 'iso_officer',
  ASSET_OWNER: 'asset_owner',
  SYSTEM_OWNER: 'system_owner',
  FINAL_APPROVAL: 'final_approval'
};

// Enhanced AccessRequest Entity
export const createAccessRequest = ({
  id,
  requestor_id,
  requestor_name,
  requestor_email,
  requestor_department,
  resource_id,
  resource_name,
  access_type,
  justification,
  business_justification,
  duration_hours,
  accurate_duration_reason,
  priority = 'medium',
  status = AccessRequestStatus.PENDING,
  
  // Proxy Request Fields (Maker-Checker)
  is_proxy_request = false,
  on_behalf_of_user_id = null,
  on_behalf_of_user_name = null,
  on_behalf_of_user_email = null,
  proxy_justification = null,
  proxy_manager_id = null,
  proxy_manager_name = null,
  
  // ISO Review Requirements
  iso_review_required = false,
  iso_review_reason = null,
  
  // Approval Chain
  approval_chain = [],
  current_approval_stage = null,
  
  // Timestamps
  created_at = new Date().toISOString(),
  updated_at = new Date().toISOString(),
  requested_start_date = null,
  requested_end_date = null,
  approved_at = null,
  approved_by = null,
  
  // Additional metadata
  risk_level = 'medium',
  compliance_notes = null,
  emergency_request = false
}) => ({
  id,
  requestor_id,
  requestor_name,
  requestor_email,
  requestor_department,
  resource_id,
  resource_name,
  access_type,
  justification,
  business_justification,
  duration_hours,
  accurate_duration_reason,
  priority,
  status,
  is_proxy_request,
  on_behalf_of_user_id,
  on_behalf_of_user_name,
  on_behalf_of_user_email,
  proxy_justification,
  proxy_manager_id,
  proxy_manager_name,
  iso_review_required,
  iso_review_reason,
  approval_chain,
  current_approval_stage,
  created_at,
  updated_at,
  requested_start_date,
  requested_end_date,
  approved_at,
  approved_by,
  risk_level,
  compliance_notes,
  emergency_request
});

// Enhanced Resource Entity with Mandatory Ownership
export const createResource = ({
  id,
  name,
  description,
  category,
  classification = 'internal', // public, internal, confidential, restricted
  
  // Mandatory Ownership Fields
  asset_owner_id,
  asset_owner_name,
  asset_owner_email,
  asset_owner_department,
  
  system_owner_id,
  system_owner_name,
  system_owner_email,
  system_owner_department,
  
  // Optional Data Custodian
  data_custodian_id = null,
  data_custodian_name = null,
  data_custodian_email = null,
  data_custodian_department = null,
  
  // Review Configuration
  review_cycle_days = 90, // Default quarterly review
  last_review_date = null,
  next_review_date = null,
  
  // Risk and Compliance
  risk_rating = 'medium',
  compliance_requirements = [],
  data_types = [], // PII, Financial, Health, etc.
  
  // Technical Details
  environment = 'production', // development, staging, production
  access_methods = [], // web, api, database, file_share
  location = 'on_premise', // on_premise, cloud, hybrid
  
  // Metadata
  created_at = new Date().toISOString(),
  updated_at = new Date().toISOString(),
  is_active = true
}) => ({
  id,
  name,
  description,
  category,
  classification,
  asset_owner_id,
  asset_owner_name,
  asset_owner_email,
  asset_owner_department,
  system_owner_id,
  system_owner_name,
  system_owner_email,
  system_owner_department,
  data_custodian_id,
  data_custodian_name,
  data_custodian_email,
  data_custodian_department,
  review_cycle_days,
  last_review_date,
  next_review_date,
  risk_rating,
  compliance_requirements,
  data_types,
  environment,
  access_methods,
  location,
  created_at,
  updated_at,
  is_active
});

// Access Review Notification Entity
export const createAccessReviewNotification = ({
  id,
  resource_id,
  resource_name,
  responsible_user_id,
  responsible_user_name,
  responsible_user_email,
  responsible_user_role, // asset_owner, system_owner, data_custodian, manager
  
  notification_type = 'periodic_review', // periodic_review, escalation, reminder
  status = NotificationStatus.SENT,
  
  // Review Details
  review_due_date,
  review_scope, // all_users, department, specific_users
  users_to_review = [],
  
  // Notification Timeline
  sent_at = new Date().toISOString(),
  acknowledged_at = null,
  completed_at = null,
  
  // Escalation
  escalation_level = 0,
  escalated_to_user_id = null,
  escalated_to_user_name = null,
  escalation_reason = null,
  
  // Content
  subject,
  message,
  action_required = true,
  priority = 'medium',
  
  // Metadata
  created_at = new Date().toISOString(),
  updated_at = new Date().toISOString()
}) => ({
  id,
  resource_id,
  resource_name,
  responsible_user_id,
  responsible_user_name,
  responsible_user_email,
  responsible_user_role,
  notification_type,
  status,
  review_due_date,
  review_scope,
  users_to_review,
  sent_at,
  acknowledged_at,
  completed_at,
  escalation_level,
  escalated_to_user_id,
  escalated_to_user_name,
  escalation_reason,
  subject,
  message,
  action_required,
  priority,
  created_at,
  updated_at
});

// Approval Chain Entry
export const createApprovalEntry = ({
  stage,
  approver_id,
  approver_name,
  approver_role,
  status = 'pending', // pending, approved, rejected, skipped
  comments = null,
  approved_at = null,
  order = 1
}) => ({
  stage,
  approver_id,
  approver_name,
  approver_role,
  status,
  comments,
  approved_at,
  order
});

// Utility functions for determining approval requirements
export const determineApprovalChain = (request, resource) => {
  const chain = [];
  let order = 1;

  // 1. Manager approval (always required for proxy requests)
  if (request.is_proxy_request) {
    chain.push(createApprovalEntry({
      stage: ApprovalStage.MANAGER,
      approver_id: request.proxy_manager_id,
      approver_name: request.proxy_manager_name,
      approver_role: 'manager',
      order: order++
    }));
  }

  // 2. ISO Officer review (mandatory for all requests)
  chain.push(createApprovalEntry({
    stage: ApprovalStage.ISO_OFFICER,
    approver_id: null, // Will be assigned to any ISO officer
    approver_name: 'ISO Officer',
    approver_role: 'iso',
    order: order++
  }));

  // 3. Asset Owner approval (always required)
  chain.push(createApprovalEntry({
    stage: ApprovalStage.ASSET_OWNER,
    approver_id: resource.asset_owner_id,
    approver_name: resource.asset_owner_name,
    approver_role: 'asset_owner',
    order: order++
  }));

  // 4. System Owner approval (required for technical access)
  if (request.access_type !== 'read_only' || resource.environment === 'production') {
    chain.push(createApprovalEntry({
      stage: ApprovalStage.SYSTEM_OWNER,
      approver_id: resource.system_owner_id,
      approver_name: resource.system_owner_name,
      approver_role: 'system_owner',
      order: order++
    }));
  }

  // 5. Final IT administrator provisioning (ensures maker/checker)
  chain.push(createApprovalEntry({
    stage: ApprovalStage.FINAL_APPROVAL,
    approver_id: resource.system_owner_id || null,
    approver_name: resource.system_owner_name || 'IT Administrator',
    approver_role: 'admin',
    order: order++
  }));

  return chain;
};

// Utility to calculate next review date
export const calculateNextReviewDate = (lastReviewDate, reviewCycleDays) => {
  const baseDate = lastReviewDate ? new Date(lastReviewDate) : new Date();
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + reviewCycleDays);
  return nextDate.toISOString();
};

// Utility to determine if ISO review is required
export const requiresISOReview = (request, resource) => {
  return (
    request.is_proxy_request ||
    resource.risk_rating === 'high' ||
    resource.classification === 'restricted' ||
    request.emergency_request ||
    request.duration_hours > 168 // More than 1 week
  );
};

// Default resource categories
export const ResourceCategories = {
  DATABASE: 'database',
  APPLICATION: 'application',
  FILE_SYSTEM: 'file_system',
  NETWORK: 'network',
  CLOUD_SERVICE: 'cloud_service',
  API: 'api',
  REPORT_SYSTEM: 'report_system'
};

// Default access types
export const AccessTypes = {
  READ_ONLY: 'read_only',
  READ_WRITE: 'read_write',
  ADMIN: 'admin',
  EXECUTE: 'execute',
  EXPORT: 'export',
  MODIFY: 'modify',
  DELETE: 'delete'
};

// Risk levels
export const RiskLevels = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Data classification levels
export const ClassificationLevels = {
  PUBLIC: 'public',
  INTERNAL: 'internal',
  CONFIDENTIAL: 'confidential',
  RESTRICTED: 'restricted'
};
