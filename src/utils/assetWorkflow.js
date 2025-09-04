// Asset Management Workflow Utility
// Handles asset approval workflow with role-based limits and notifications

import { canApproveAsset, getNextApprover, getAssetApprovalNotificationTargets } from './permissions';

export const ASSET_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ESCALATED: 'escalated',
  COMPLETED: 'completed'
};

export const NOTIFICATION_TYPES = {
  APPROVAL_REQUIRED: 'approval_required',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ESCALATED: 'escalated',
  PROCUREMENT_READY: 'procurement_ready'
};

// Process asset approval request
export const processAssetApproval = (assetRequest, approverRole, action, comments = '') => {
  const { id, requestedAmount, requestor, description, priority } = assetRequest;
  
  const result = {
    assetId: id,
    originalRequest: assetRequest,
    action: action,
    approver: approverRole,
    timestamp: new Date().toISOString(),
    comments: comments,
    notifications: [],
    nextSteps: []
  };

  // Check if approver has authority for this amount
  if (action === 'approve') {
    if (!canApproveAsset(approverRole, requestedAmount)) {
      // Auto-escalate if amount exceeds approval limit
      const escalation = getNextApprover(requestedAmount, approverRole);
      
      result.status = ASSET_STATUS.ESCALATED;
      result.action = 'escalate';
      result.escalation = escalation;
      
      // Add escalation notification
      result.notifications.push({
        type: NOTIFICATION_TYPES.ESCALATED,
        target: escalation.nextApproverRole,
        message: `Asset request for $${requestedAmount.toLocaleString()} requires your approval. Escalated from ${approverRole}.`,
        priority: 'high',
        data: {
          assetId: id,
          amount: requestedAmount,
          reason: escalation.reason,
          originalApprover: approverRole
        }
      });
      
      result.nextSteps.push('Awaiting senior management approval');
      
    } else {
      // Approved within limits
      result.status = ASSET_STATUS.APPROVED;
      
      // Generate approval notifications
      const approvalNotifications = getAssetApprovalNotificationTargets(requestedAmount, 'approved');
      result.notifications.push(...approvalNotifications.map(notif => ({
        type: NOTIFICATION_TYPES.PROCUREMENT_READY,
        target: notif.target,
        message: notif.message,
        priority: notif.priority,
        data: {
          assetId: id,
          amount: requestedAmount,
          approver: approverRole,
          description: description
        }
      })));
      
      // Notify requestor
      result.notifications.push({
        type: NOTIFICATION_TYPES.APPROVED,
        target: requestor,
        message: `Your asset request for "${description}" ($${requestedAmount.toLocaleString()}) has been approved.`,
        priority: 'normal',
        data: {
          assetId: id,
          amount: requestedAmount,
          approver: approverRole
        }
      });
      
      if (requestedAmount < 5000) {
        result.nextSteps.push('IT Department will proceed with procurement process');
      } else {
        result.nextSteps.push('Approved by senior management - procurement can proceed');
      }
    }
    
  } else if (action === 'reject') {
    result.status = ASSET_STATUS.REJECTED;
    
    // Notify requestor of rejection
    result.notifications.push({
      type: NOTIFICATION_TYPES.REJECTED,
      target: requestor,
      message: `Your asset request for "${description}" has been rejected. Reason: ${comments}`,
      priority: 'normal',
      data: {
        assetId: id,
        amount: requestedAmount,
        approver: approverRole,
        comments: comments
      }
    });
    
    result.nextSteps.push('Request rejected - no further action required');
  }

  return result;
};

// Send notifications (mock implementation)
export const sendNotifications = (notifications) => {
  console.log('🔔 Asset Workflow Notifications:');
  
  notifications.forEach((notification, index) => {
    console.log(`\n${index + 1}. ${notification.type.toUpperCase()}`);
    console.log(`   Target: ${notification.target}`);
    console.log(`   Priority: ${notification.priority}`);
    console.log(`   Message: ${notification.message}`);
    
    if (notification.data) {
      console.log(`   Data:`, notification.data);
    }
  });
  
  // In a real implementation, this would integrate with:
  // - Email service (SendGrid, AWS SES, etc.)
  // - Slack/Teams notifications
  // - In-app notification system
  // - SMS notifications for high priority items
  
  return {
    sent: notifications.length,
    failed: 0,
    timestamp: new Date().toISOString()
  };
};

// Get approval workflow status for asset request
export const getAssetApprovalStatus = (assetRequest, userRole) => {
  const { requestedAmount } = assetRequest;
  
  const status = {
    canApprove: canApproveAsset(userRole, requestedAmount),
    approvalLimit: userRole === 'manager' ? 5000 : userRole === 'iso' ? Infinity : userRole === 'admin' ? Infinity : 0,
    requiresEscalation: false,
    nextApprover: null
  };
  
  if (requestedAmount >= 5000 && userRole === 'manager') {
    status.requiresEscalation = true;
    status.nextApprover = 'admin';
    status.canApprove = false;
  }
  
  return status;
};

// Sample asset request data for testing
export const createSampleAssetRequest = (amount, description, requestor = 'john.doe') => {
  return {
    id: `asset-${Date.now()}`,
    requestor: requestor,
    requestedAmount: amount,
    description: description,
    priority: amount >= 5000 ? 'high' : amount >= 1000 ? 'medium' : 'low',
    requestDate: new Date().toISOString(),
    status: ASSET_STATUS.PENDING,
    category: 'Equipment',
    justification: `Business need for ${description}`,
    department: 'IT'
  };
};

export default {
  ASSET_STATUS,
  NOTIFICATION_TYPES,
  processAssetApproval,
  sendNotifications,
  getAssetApprovalStatus,
  createSampleAssetRequest
};
