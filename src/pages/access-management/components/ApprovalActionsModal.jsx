import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import dataService from '../../../services/DataService';

const ApprovalActionsModal = ({ isOpen, onClose, request, currentUser, onAction }) => {
  const [action, setAction] = useState(''); // 'approve' or 'reject'
  const [comments, setComments] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const rejectionReasons = [
    'Insufficient business justification',
    'Security policy violation',
    'Resource not available',
    'Requires additional approval',
    'Documentation incomplete',
    'Risk level too high',
    'Alternative solution available',
    'Other (specify in comments)'
  ];

  const handleAction = async (actionType) => {
    setAction(actionType);
    setIsProcessing(true);

    try {
      if (actionType === 'approve') {
        await dataService.approveAccessRequest(request.id, {
          approverId: currentUser.id,
          approvedBy: currentUser.name,
          comments: comments || 'Request approved'
        });
      } else if (actionType === 'reject') {
        if (!reason && !comments) {
          alert('Please provide a reason for rejection');
          setIsProcessing(false);
          return;
        }
        
        await dataService.rejectAccessRequest(request.id, {
          approverId: currentUser.id,
          rejectedBy: currentUser.name,
          reason: reason || comments
        });
      }

      onAction && onAction(actionType);
      onClose();
      
      // Reset state
      setAction('');
      setComments('');
      setReason('');
      
      alert(`Request ${actionType}d successfully!`);
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
      
      // Show specific error message if available
      const errorMessage = error.message || `Error ${actionType}ing request. Please try again.`;
      alert(`${actionType === 'approve' ? 'Approval' : 'Rejection'} Failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Review Access Request</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Request #{request.id.slice(-8)}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Request Summary */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="FileText" size={18} />
              <span>Request Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">Requested by:</span>
                  <p className="font-medium text-foreground">{request.requesterName}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Department:</span>
                  <p className="font-medium text-foreground">{request.requesterDepartment}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Resource:</span>
                  <p className="font-medium text-foreground">{request.resourceName}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-medium text-foreground">{request.resourceCategory}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">Request Date:</span>
                  <p className="font-medium text-foreground">{formatDate(request.requestDate)}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                  </span>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Priority:</span>
                  <span className={`font-medium ${getPriorityColor(request.priority)}`}>
                    {request.priority?.charAt(0).toUpperCase() + request.priority?.slice(1)}
                  </span>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Access Type:</span>
                  <p className="font-medium text-foreground">{request.accessType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Access Period */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <Icon name="Calendar" size={16} />
              <span>Access Period</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Start Date:</span>
                <p className="font-medium text-foreground">{formatDate(request.startDate)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">End Date:</span>
                <p className="font-medium text-foreground">{formatDate(request.endDate)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-medium text-foreground">{request.duration} days</p>
              </div>
            </div>
          </div>

          {/* Justification */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <Icon name="MessageSquare" size={16} />
              <span>Business Justification</span>
            </h4>
            <p className="text-foreground text-sm leading-relaxed">
              {request.justification}
            </p>
          </div>

          {/* Approval History */}
          {request.approvalHistory && request.approvalHistory.length > 0 && (
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Clock" size={16} />
                <span>Approval History</span>
              </h4>
              <div className="space-y-2">
                {request.approvalHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatDate(item.date)} - {item.approver}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.action === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Selection */}
          {request.status === 'pending' && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground flex items-center space-x-2">
                <Icon name="Gavel" size={16} />
                <span>Action Required</span>
              </h4>

              {/* Approval Comments */}
              <div>
                <label className="block text-sm font-medium text-popover-foreground mb-2">
                  Comments {action === 'reject' ? '*' : '(Optional)'}
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={action === 'approve' ? 'Additional comments or conditions...' : 'Provide detailed feedback...'}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Rejection Reason */}
              {action === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-popover-foreground mb-2">
                    Reason for Rejection *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select a reason...</option>
                    {rejectionReasons.map((reasonOption, index) => (
                      <option key={index} value={reasonOption}>
                        {reasonOption}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={() => handleAction('reject')}
                  loading={isProcessing && action === 'reject'}
                  iconName="X"
                  iconPosition="left"
                  disabled={isProcessing}
                >
                  Reject Request
                </Button>
                
                <Button
                  onClick={() => handleAction('approve')}
                  loading={isProcessing && action === 'approve'}
                  iconName="Check"
                  iconPosition="left"
                  disabled={isProcessing}
                >
                  Approve Request
                </Button>
              </div>
            </div>
          )}

          {/* Read-only view for completed requests */}
          {request.status !== 'pending' && (
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Request Status</h4>
              <p className="text-sm text-muted-foreground">
                This request has already been {request.status}.
                {request.status === 'approved' && request.approverComments && (
                  <span className="block mt-2 font-medium">Comments: {request.approverComments}</span>
                )}
                {request.status === 'rejected' && request.rejectionReason && (
                  <span className="block mt-2 font-medium">Reason: {request.rejectionReason}</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalActionsModal;
