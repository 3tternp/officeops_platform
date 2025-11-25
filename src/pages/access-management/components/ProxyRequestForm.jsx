import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/TextArea';
import { Checkbox } from '../../../components/ui/Checkbox';
import { createAccessRequest, AccessTypes, RiskLevels, requiresISOReview } from '../utils/entities';

const ProxyRequestForm = ({ isOpen, onClose, onSubmit, currentUser, resources = [], users = [] }) => {
  const [formData, setFormData] = useState({
    // Requestee Information
    on_behalf_of_user_id: '',
    on_behalf_of_user_name: '',
    on_behalf_of_user_email: '',
    on_behalf_of_user_department: '',
    
    // Access Details
    resource_id: '',
    access_type: '',
    duration_hours: 24,
    accurate_duration_reason: '',
    
    // Justifications
    business_justification: '',
    proxy_justification: '',
    emergency_request: false,
    
    // Schedule
    requested_start_date: new Date().toISOString().slice(0, 16),
    requested_end_date: '',
    
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [estimatedApprovalTime, setEstimatedApprovalTime] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        on_behalf_of_user_id: '',
        on_behalf_of_user_name: '',
        on_behalf_of_user_email: '',
        on_behalf_of_user_department: '',
        resource_id: '',
        access_type: '',
        duration_hours: 24,
        accurate_duration_reason: '',
        business_justification: '',
        proxy_justification: '',
        emergency_request: false,
        requested_start_date: new Date().toISOString().slice(0, 16),
        requested_end_date: '',
        priority: 'medium'
      });
      setErrors({});
      setSelectedResource(null);
    }
  }, [isOpen]);

  // Calculate estimated approval time based on requirements
  useEffect(() => {
    if (selectedResource && formData.duration_hours) {
      const mockRequest = {
        is_proxy_request: true,
        emergency_request: formData.emergency_request,
        duration_hours: parseInt(formData.duration_hours)
      };
      
      const needsISOReview = requiresISOReview(mockRequest, selectedResource);
      const approvalSteps = needsISOReview ? 4 : 3; // Manager, Asset Owner, System Owner + optional ISO
      
      if (formData.emergency_request) {
        setEstimatedApprovalTime('2-4 hours (Emergency)');
      } else {
        setEstimatedApprovalTime(`${approvalSteps * 24} hours (${approvalSteps} approval steps)`);
      }
    }
  }, [selectedResource, formData.duration_hours, formData.emergency_request]);

  // Auto-calculate end date based on duration
  useEffect(() => {
    if (formData.requested_start_date && formData.duration_hours) {
      const startDate = new Date(formData.requested_start_date);
      const endDate = new Date(startDate.getTime() + (formData.duration_hours * 60 * 60 * 1000));
      setFormData(prev => ({
        ...prev,
        requested_end_date: endDate.toISOString().slice(0, 16)
      }));
    }
  }, [formData.requested_start_date, formData.duration_hours]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle user selection
    if (field === 'on_behalf_of_user_id') {
      const selectedUser = users.find(u => u.id === value);
      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          on_behalf_of_user_name: selectedUser.name,
          on_behalf_of_user_email: selectedUser.email,
          on_behalf_of_user_department: selectedUser.department
        }));
      }
    }

    // Handle resource selection
    if (field === 'resource_id') {
      const resource = resources.find(r => r.id === value);
      setSelectedResource(resource);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.on_behalf_of_user_id) newErrors.on_behalf_of_user_id = 'Please select the user you are requesting access for';
    if (!formData.resource_id) newErrors.resource_id = 'Please select a resource';
    if (!formData.access_type) newErrors.access_type = 'Please select access type';
    if (!formData.business_justification.trim()) newErrors.business_justification = 'Business justification is required';
    if (!formData.proxy_justification.trim()) newErrors.proxy_justification = 'Please explain why you are making this request on behalf of the user';
    if (!formData.accurate_duration_reason.trim()) newErrors.accurate_duration_reason = 'Please provide accurate duration reasoning';

    // Duration validation
    if (!formData.duration_hours || formData.duration_hours < 1) {
      newErrors.duration_hours = 'Duration must be at least 1 hour';
    }

    // Date validation
    const startDate = new Date(formData.requested_start_date);
    const now = new Date();
    if (startDate < now && !formData.emergency_request) {
      newErrors.requested_start_date = 'Start date cannot be in the past unless this is an emergency request';
    }

    // Proxy justification validation (must be substantial for compliance)
    if (formData.proxy_justification.trim().length < 20) {
      newErrors.proxy_justification = 'Proxy justification must be at least 20 characters and explain the necessity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create the enhanced access request
      const request = createAccessRequest({
        id: Date.now().toString(),
        requestor_id: currentUser.id,
        requestor_name: currentUser.name,
        requestor_email: currentUser.email,
        requestor_department: currentUser.department,
        
        // Resource details
        resource_id: formData.resource_id,
        resource_name: selectedResource?.name || '',
        access_type: formData.access_type,
        
        // Justifications
        justification: formData.business_justification,
        business_justification: formData.business_justification,
        accurate_duration_reason: formData.accurate_duration_reason,
        
        // Duration and timing
        duration_hours: parseInt(formData.duration_hours),
        requested_start_date: formData.requested_start_date,
        requested_end_date: formData.requested_end_date,
        
        // Proxy request specific fields
        is_proxy_request: true,
        on_behalf_of_user_id: formData.on_behalf_of_user_id,
        on_behalf_of_user_name: formData.on_behalf_of_user_name,
        on_behalf_of_user_email: formData.on_behalf_of_user_email,
        proxy_justification: formData.proxy_justification,
        proxy_manager_id: currentUser.id,
        proxy_manager_name: currentUser.name,
        
        // Risk and compliance
        iso_review_required: requiresISOReview(
          { is_proxy_request: true, emergency_request: formData.emergency_request, duration_hours: parseInt(formData.duration_hours) },
          selectedResource
        ),
        emergency_request: formData.emergency_request,
        priority: formData.emergency_request ? 'high' : formData.priority,
        risk_level: selectedResource?.risk_rating || 'medium'
      });

      await onSubmit(request);
      onClose();
    } catch (error) {
      console.error('Error submitting proxy request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email}) - ${user.department}`
  }));

  const resourceOptions = resources.map(resource => ({
    value: resource.id,
    label: `${resource.name} - ${resource.category} (${resource.classification})`
  }));

  const accessTypeOptions = Object.entries(AccessTypes).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const durationOptions = [
    { value: 1, label: '1 hour' },
    { value: 4, label: '4 hours' },
    { value: 8, label: '8 hours (1 business day)' },
    { value: 24, label: '24 hours (1 day)' },
    { value: 48, label: '48 hours (2 days)' },
    { value: 72, label: '72 hours (3 days)' },
    { value: 168, label: '1 week' },
    { value: 336, label: '2 weeks' },
    { value: 720, label: '1 month' }
  ];

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Proxy Access Request</h2>
              <p className="text-sm text-muted-foreground">Request access on behalf of a team member</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {/* Requestee Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="User" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Requestee Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Select
                    label="Select User *"
                    options={userOptions}
                    value={formData.on_behalf_of_user_id}
                    onChange={(value) => handleInputChange('on_behalf_of_user_id', value)}
                    error={errors.on_behalf_of_user_id}
                    placeholder="Select the user you are requesting access for"
                  />
                </div>
                
                {formData.on_behalf_of_user_name && (
                  <>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Name</div>
                      <div className="font-medium">{formData.on_behalf_of_user_name}</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Department</div>
                      <div className="font-medium">{formData.on_behalf_of_user_department}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Resource and Access Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Resource Access Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Resource *"
                  options={resourceOptions}
                  value={formData.resource_id}
                  onChange={(value) => handleInputChange('resource_id', value)}
                  error={errors.resource_id}
                  placeholder="Select resource"
                />
                
                <Select
                  label="Access Type *"
                  options={accessTypeOptions}
                  value={formData.access_type}
                  onChange={(value) => handleInputChange('access_type', value)}
                  error={errors.access_type}
                  placeholder="Select access type"
                />

                <Select
                  label="Duration *"
                  options={durationOptions.map(opt => ({ value: opt.value.toString(), label: opt.label }))}
                  value={formData.duration_hours.toString()}
                  onChange={(value) => handleInputChange('duration_hours', parseInt(value))}
                  error={errors.duration_hours}
                />

                <Select
                  label="Priority"
                  options={priorityOptions}
                  value={formData.priority}
                  onChange={(value) => handleInputChange('priority', value)}
                />
              </div>

              {selectedResource && (
                <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Classification</div>
                      <div className="font-medium capitalize">{selectedResource.classification}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Risk Rating</div>
                      <div className="font-medium capitalize">{selectedResource.risk_rating}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Environment</div>
                      <div className="font-medium capitalize">{selectedResource.environment}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Est. Approval</div>
                      <div className="font-medium">{estimatedApprovalTime}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Schedule */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Access Schedule</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="datetime-local"
                  label="Start Date & Time *"
                  value={formData.requested_start_date}
                  onChange={(e) => handleInputChange('requested_start_date', e.target.value)}
                  error={errors.requested_start_date}
                />
                
                <Input
                  type="datetime-local"
                  label="End Date & Time *"
                  value={formData.requested_end_date}
                  onChange={(e) => handleInputChange('requested_end_date', e.target.value)}
                  disabled
                  helperText="Automatically calculated based on duration"
                />
              </div>
            </div>

            {/* Justifications */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Justifications & Documentation</h3>
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Business Justification *"
                  value={formData.business_justification}
                  onChange={(e) => handleInputChange('business_justification', e.target.value)}
                  error={errors.business_justification}
                  placeholder="Explain the business need for this access..."
                  rows={3}
                />

                <Textarea
                  label="Proxy Request Justification *"
                  value={formData.proxy_justification}
                  onChange={(e) => handleInputChange('proxy_justification', e.target.value)}
                  error={errors.proxy_justification}
                  placeholder="Explain why you are making this request on behalf of the user (e.g., user is unavailable, training purposes, delegation of authority)..."
                  rows={3}
                  helperText="Required for compliance - must explain the necessity of proxy request"
                />

                <Textarea
                  label="Duration Accuracy Reasoning *"
                  value={formData.accurate_duration_reason}
                  onChange={(e) => handleInputChange('accurate_duration_reason', e.target.value)}
                  error={errors.accurate_duration_reason}
                  placeholder="Explain why this specific duration is required and how it was determined..."
                  rows={2}
                  helperText="Prevents indefinite access - required for compliance"
                />
              </div>
            </div>

            {/* Emergency Request */}
            <div className="space-y-4">
              <Checkbox
                label="Emergency Request"
                checked={formData.emergency_request}
                onChange={(e) => handleInputChange('emergency_request', e.target.checked)}
                helperText="Emergency requests receive priority processing but require additional justification"
              />
              
              {formData.emergency_request && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-warning">Emergency Request Notice</div>
                      <div className="text-muted-foreground mt-1">
                        Emergency requests will be escalated immediately and require additional approvals. 
                        Ensure all justifications clearly explain the urgency and business impact.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Approval Preview */}
            {selectedResource && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="GitBranch" size={16} className="text-primary" />
                  <h4 className="font-medium text-foreground">Expected Approval Chain</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Manager Review (You - {currentUser.name})</span>
                  </div>
                  {(requiresISOReview(
                    { is_proxy_request: true, emergency_request: formData.emergency_request, duration_hours: parseInt(formData.duration_hours) },
                    selectedResource
                  )) && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span>ISO Security Review (Required)</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Asset Owner ({selectedResource.asset_owner_name})</span>
                  </div>
                  {(formData.access_type !== 'read_only' || selectedResource.environment === 'production') && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-info rounded-full"></div>
                      <span>System Owner ({selectedResource.system_owner_name})</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/25">
          <div className="text-sm text-muted-foreground">
            All proxy requests are subject to maker-checker approval process and audit logging.
          </div>
          <div className="flex items-center space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProxyRequestForm;
