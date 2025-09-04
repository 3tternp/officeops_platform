import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { Checkbox } from '../../../components/ui/Checkbox';
import { ApprovalStage, AccessRequestStatus } from '../utils/entities';

const ISOReviewWorkflow = ({ isOpen, onClose, request, currentUser, onAction }) => {
  const [review, setReview] = useState({
    decision: '', // approve, reject, request_info
    comments: '',
    escalate_to_ciso: false,
    additional_controls_required: false,
    follow_up_required: false,
    compliance_notes: '',
    risk_assessment_override: false,
    override_justification: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && request) {
      setReview({
        decision: '',
        comments: '',
        escalate_to_ciso: false,
        additional_controls_required: false,
        follow_up_required: false,
        compliance_notes: '',
        risk_assessment_override: false,
        override_justification: ''
      });
      setErrors({});
    }
  }, [isOpen, request]);

  const handleInputChange = (field, value) => {
    setReview(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateReview = () => {
    const newErrors = {};

    if (!review.decision) {
      newErrors.decision = 'Please select a decision';
    }

    if (!review.comments.trim()) {
      newErrors.comments = 'Comments are required for all ISO reviews';
    } else if (review.comments.trim().length < 20) {
      newErrors.comments = 'Comments must be at least 20 characters for compliance documentation';
    }

    if (review.decision === 'reject' && review.comments.trim().length < 50) {
      newErrors.comments = 'Rejection requires detailed explanation (minimum 50 characters)';
    }

    if (review.risk_assessment_override && !review.override_justification.trim()) {
      newErrors.override_justification = 'Risk override requires detailed justification';
    }

    if (review.additional_controls_required && !review.compliance_notes.trim()) {
      newErrors.compliance_notes = 'Please specify the additional controls required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (decision) => {
    const reviewData = { ...review, decision };
    
    if (!validateReview()) {
      return;
    }

    setLoading(true);

    try {
      const updatedRequest = {
        ...request,
        status: decision === 'approve' ? AccessRequestStatus.APPROVED : AccessRequestStatus.REJECTED,
        iso_review_completed: true,
        iso_reviewer_id: currentUser.id,
        iso_reviewer_name: currentUser.name,
        iso_review_date: new Date().toISOString(),
        iso_review_comments: reviewData.comments,
        iso_decision: decision,
        escalated_to_ciso: reviewData.escalate_to_ciso,
        additional_controls_required: reviewData.additional_controls_required,
        follow_up_required: reviewData.follow_up_required,
        compliance_notes: reviewData.compliance_notes,
        risk_assessment_override: reviewData.risk_assessment_override,
        override_justification: reviewData.override_justification,
        updated_at: new Date().toISOString()
      };

      await onAction(updatedRequest);
      onClose();
    } catch (error) {
      console.error('Error submitting ISO review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getApprovalChainStatus = () => {
    if (!request?.approval_chain) return [];
    
    return request.approval_chain.map(approval => {
      const isCurrentStage = approval.stage === ApprovalStage.ISO_OFFICER;
      return {
        ...approval,
        isCurrentStage,
        canApprove: isCurrentStage && currentUser?.role === 'iso'
      };
    });
  };

  const getRiskIndicators = () => {
    const indicators = [];
    
    if (request?.is_proxy_request) {
      indicators.push({ type: 'proxy', label: 'Proxy Request', level: 'high' });
    }
    
    if (request?.emergency_request) {
      indicators.push({ type: 'emergency', label: 'Emergency Request', level: 'critical' });
    }
    
    if (request?.duration_hours > 168) {
      indicators.push({ type: 'duration', label: 'Extended Duration (>1 week)', level: 'medium' });
    }
    
    if (request?.risk_level === 'high') {
      indicators.push({ type: 'risk', label: 'High Risk Resource', level: 'high' });
    }
    
    return indicators;
  };

  if (!isOpen || !request) return null;

  const approvalChain = getApprovalChainStatus();
  const riskIndicators = getRiskIndicators();

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="ShieldCheck" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">ISO Security Review</h2>
              <p className="text-sm text-muted-foreground">
                Review and approve access request - Request #{request.id}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Request Overview */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Requestor</div>
                  <div className="font-medium">{request.requestor_name}</div>
                  <div className="text-sm text-muted-foreground">{request.requestor_department}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Resource</div>
                  <div className="font-medium">{request.resource_name}</div>
                  <div className="text-sm text-muted-foreground">Access: {request.access_type}</div>
                </div>
                {request.is_proxy_request && (
                  <>
                    <div>
                      <div className="text-sm text-muted-foreground">On Behalf Of</div>
                      <div className="font-medium">{request.on_behalf_of_user_name}</div>
                      <div className="text-sm text-muted-foreground">{request.on_behalf_of_user_email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Proxy Manager</div>
                      <div className="font-medium">{request.proxy_manager_name}</div>
                    </div>
                  </>
                )}
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-medium">{request.duration_hours} hours</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(request.requested_start_date).toLocaleDateString()} - {' '}
                    {new Date(request.requested_end_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Priority</div>
                  <div className={`font-medium ${request.priority === 'high' ? 'text-error' : request.priority === 'medium' ? 'text-warning' : 'text-success'}`}>
                    {request.priority.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Indicators */}
            {riskIndicators.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <h3 className="text-lg font-medium text-foreground">Risk Indicators</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {riskIndicators.map((indicator, index) => (
                    <div key={index} className={`border rounded-lg p-3 ${getRiskLevelColor(indicator.level)}`}>
                      <div className="font-medium">{indicator.label}</div>
                      <div className="text-sm capitalize">{indicator.level} Risk</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Justifications */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Request Justifications</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="font-medium text-sm text-muted-foreground mb-2">Business Justification</div>
                  <div className="text-sm">{request.business_justification || request.justification}</div>
                </div>
                
                {request.is_proxy_request && (
                  <div className="border border-border rounded-lg p-4">
                    <div className="font-medium text-sm text-muted-foreground mb-2">Proxy Request Justification</div>
                    <div className="text-sm">{request.proxy_justification}</div>
                  </div>
                )}
                
                <div className="border border-border rounded-lg p-4">
                  <div className="font-medium text-sm text-muted-foreground mb-2">Duration Reasoning</div>
                  <div className="text-sm">{request.accurate_duration_reason}</div>
                </div>
              </div>
            </div>

            {/* Approval Chain Status */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Icon name="GitBranch" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Approval Chain Status</h3>
              </div>
              
              <div className="space-y-2">
                {approvalChain.map((approval, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    approval.isCurrentStage ? 'border-primary bg-primary/5' : 'border-border'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      approval.status === 'approved' ? 'bg-success' :
                      approval.status === 'rejected' ? 'bg-error' :
                      approval.isCurrentStage ? 'bg-primary' : 'bg-muted'
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-medium">{approval.stage.replace('_', ' ').toUpperCase()}</div>
                      <div className="text-sm text-muted-foreground">{approval.approver_name}</div>
                    </div>
                    <div className="text-sm capitalize font-medium">
                      {approval.status}
                    </div>
                    {approval.approved_at && (
                      <div className="text-sm text-muted-foreground">
                        {new Date(approval.approved_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ISO Review Form */}
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex items-center space-x-2">
                <Icon name="ShieldCheck" size={16} className="text-warning" />
                <h3 className="text-lg font-medium text-foreground">ISO Review & Decision</h3>
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Review Comments *"
                  value={review.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  error={errors.comments}
                  placeholder="Provide detailed security review comments, risk assessment, and decision rationale..."
                  rows={4}
                  helperText="Required for compliance documentation and audit trail"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Checkbox
                      label="Escalate to CISO"
                      checked={review.escalate_to_ciso}
                      onChange={(e) => handleInputChange('escalate_to_ciso', e.target.checked)}
                      helperText="Requires CISO review and approval"
                    />
                    
                    <Checkbox
                      label="Additional Controls Required"
                      checked={review.additional_controls_required}
                      onChange={(e) => handleInputChange('additional_controls_required', e.target.checked)}
                      helperText="Additional security controls must be implemented"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Checkbox
                      label="Follow-up Required"
                      checked={review.follow_up_required}
                      onChange={(e) => handleInputChange('follow_up_required', e.target.checked)}
                      helperText="Schedule follow-up review or monitoring"
                    />
                    
                    <Checkbox
                      label="Override Risk Assessment"
                      checked={review.risk_assessment_override}
                      onChange={(e) => handleInputChange('risk_assessment_override', e.target.checked)}
                      helperText="Override automated risk assessment"
                    />
                  </div>
                </div>

                {review.additional_controls_required && (
                  <Textarea
                    label="Compliance Notes - Additional Controls *"
                    value={review.compliance_notes}
                    onChange={(e) => handleInputChange('compliance_notes', e.target.value)}
                    error={errors.compliance_notes}
                    placeholder="Specify the additional security controls required..."
                    rows={3}
                  />
                )}

                {review.risk_assessment_override && (
                  <Textarea
                    label="Risk Override Justification *"
                    value={review.override_justification}
                    onChange={(e) => handleInputChange('override_justification', e.target.value)}
                    error={errors.override_justification}
                    placeholder="Provide detailed justification for risk assessment override..."
                    rows={3}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/25">
          <div className="text-sm text-muted-foreground">
            ISO review decisions are logged for compliance and audit purposes.
          </div>
          <div className="flex items-center space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleSubmit('reject')} 
              disabled={loading}
            >
              {loading ? (
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
              ) : (
                <Icon name="X" size={16} className="mr-2" />
              )}
              Reject Request
            </Button>
            <Button onClick={() => handleSubmit('approve')} disabled={loading}>
              {loading ? (
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
              ) : (
                <Icon name="CheckCircle" size={16} className="mr-2" />
              )}
              Approve Request
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ISOReviewWorkflow;
