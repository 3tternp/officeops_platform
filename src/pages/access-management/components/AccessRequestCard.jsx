import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { hasPermission, PERMISSIONS } from '../../../utils/permissions';

const AccessRequestCard = ({ request, onApprove, onReject, onViewDetails, currentUser, compact = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-error/10 text-error border-error/20';
      case 'expired': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return 'N/A';
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    
    if (diff <= 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h`;
  };

  // Helper to get display values with fallbacks for different data structures
  const getDisplayValue = (field) => {
    switch (field) {
      case 'requestor':
        return request?.requestor || request?.requesterName || 'Unknown User';
      case 'department':
        return request?.department || request?.requesterDepartment || 'Unknown Department';
      case 'role':
        return request?.role || 'User';
      case 'resource':
        return request?.resource || request?.resourceName || 'Unknown Resource';
      case 'requestDate':
        return request?.requestDate || request?.createdDate || new Date().toISOString();
      case 'dueDate':
        return request?.dueDate || request?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return request?.[field] || 'N/A';
    }
  };

  // Check if current user can approve this request
  const canApprove = () => {
    if (!currentUser) return false;
    
    // Check if user has permission to approve access requests
    if (!hasPermission(currentUser?.role, PERMISSIONS.ACCESS_APPROVE)) {
      return false;
    }
    
    // Check if user is trying to approve their own request
    const isOwnRequest = request?.requesterId === currentUser?.id || 
                        request?.requesterEmail === currentUser?.email ||
                        getDisplayValue('requestor') === currentUser?.name;
    
    if (isOwnRequest) return false;
    
    // Only admin and iso roles should have ACCESS_APPROVE permission
    // This is enforced by the permissions system
    return true;
  };

  if (compact) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-enterprise-md transition-enterprise">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">{getDisplayValue('requestor')}</p>
              <p className="text-xs text-muted-foreground">{getDisplayValue('department')}</p>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${getPriorityColor(request?.priority)}`} />
        </div>
        <div className="mb-3">
          <p className="text-sm font-medium text-foreground mb-1">{getDisplayValue('resource')}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{request?.justification}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(request?.status)}`}>
            {request?.status?.charAt(0)?.toUpperCase() + request?.status?.slice(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            {getTimeRemaining(getDisplayValue('dueDate'))}
          </span>
        </div>
        {request?.status === 'pending' && canApprove() && (
          <div className="flex space-x-2 mt-3">
            <Button
              variant="success"
              size="sm"
              onClick={() => onApprove(request?.id)}
              className="flex-1"
            >
              <Icon name="Check" size={14} className="mr-1" />
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(request?.id)}
              className="flex-1"
            >
              <Icon name="X" size={14} className="mr-1" />
              Reject
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-enterprise-md transition-enterprise">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{getDisplayValue('requestor')}</h3>
            <p className="text-sm text-muted-foreground">{getDisplayValue('department')} • {getDisplayValue('role')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getPriorityColor(request?.priority)}`} />
          <span className="text-sm text-muted-foreground capitalize">{request?.priority}</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Shield" size={16} className="text-muted-foreground" />
          <span className="font-medium text-foreground">{getDisplayValue('resource')}</span>
        </div>
        <p className="text-sm text-muted-foreground pl-6">{request?.justification}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Requested Date</p>
          <p className="text-sm text-foreground">{new Date(getDisplayValue('requestDate'))?.toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Due Date</p>
          <p className="text-sm text-foreground">{new Date(getDisplayValue('dueDate'))?.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(request?.status)}`}>
          {request?.status?.charAt(0)?.toUpperCase() + request?.status?.slice(1)}
        </span>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            SLA: {getTimeRemaining(getDisplayValue('dueDate'))}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(request?.id)}
          >
            <Icon name="Eye" size={16} className="mr-1" />
            Details
          </Button>
        </div>
      </div>
      {request?.status === 'pending' && canApprove() && (
        <div className="flex space-x-3 mt-4 pt-4 border-t border-border">
          <Button
            variant="success"
            onClick={() => onApprove(request?.id)}
            className="flex-1"
          >
            <Icon name="Check" size={16} className="mr-2" />
            Approve Request
          </Button>
          <Button
            variant="destructive"
            onClick={() => onReject(request?.id)}
            className="flex-1"
          >
            <Icon name="X" size={16} className="mr-2" />
            Reject Request
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccessRequestCard;