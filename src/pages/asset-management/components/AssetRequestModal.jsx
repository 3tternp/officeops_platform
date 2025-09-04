import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import dataService from '../../../services/DataService';

const AssetRequestModal = ({ isOpen, onClose, onSubmit, asset = null }) => {
  const [formData, setFormData] = useState({
    assetId: asset?.id || '',
    requestType: 'assignment',
    justification: '',
    urgency: 'medium',
    expectedDuration: '',
    alternativeOptions: '',
    estimatedCost: '',
    costCategory: 'purchase'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
  }, []);

  // Calculate approval workflow based on cost
  const getApprovalWorkflow = () => {
    const cost = parseInt(formData?.estimatedCost) || 0;
    if (cost === 0) {
      return { approvers: ['Manager'], processingTime: '1-2 business days' };
    }
    if (cost <= 5000) {
      return { approvers: ['Department Manager'], processingTime: '2-3 business days' };
    }
    return { approvers: ['Department Manager', 'CTO/CEO'], processingTime: '3-5 business days' };
  };

  const approvalInfo = getApprovalWorkflow();

  const requestTypeOptions = [
    { value: 'assignment', label: 'Asset Assignment' },
    { value: 'replacement', label: 'Asset Replacement' },
    { value: 'upgrade', label: 'Asset Upgrade' },
    { value: 'repair', label: 'Repair Request' },
    { value: 'return', label: 'Asset Return' }
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const durationOptions = [
    { value: '1-week', label: '1 Week' },
    { value: '1-month', label: '1 Month' },
    { value: '3-months', label: '3 Months' },
    { value: '6-months', label: '6 Months' },
    { value: '1-year', label: '1 Year' },
    { value: 'permanent', label: 'Permanent' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        assetName: asset?.name,
        requestDate: new Date()?.toISOString(),
        status: 'pending'
      });
      onClose();
      setFormData({
        assetId: '',
        requestType: 'assignment',
        justification: '',
        urgency: 'medium',
        expectedDuration: '',
        alternativeOptions: ''
      });
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Asset Request</h2>
            {asset && (
              <p className="text-sm text-muted-foreground mt-1">
                Requesting: {asset?.name} ({asset?.assetId})
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Type */}
          <Select
            label="Request Type"
            description="Select the type of request you're making"
            required
            options={requestTypeOptions}
            value={formData?.requestType}
            onChange={(value) => handleInputChange('requestType', value)}
          />

          {/* Justification */}
          <div>
            <label className="block text-sm font-medium text-popover-foreground mb-2">
              Business Justification *
            </label>
            <textarea
              required
              value={formData?.justification}
              onChange={(e) => handleInputChange('justification', e?.target?.value)}
              placeholder="Explain why you need this asset and how it will be used..."
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Provide detailed justification for approval process
            </p>
          </div>

          {/* Cost Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Estimated Cost (₹)"
              type="number"
              required
              value={formData?.estimatedCost}
              onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
              placeholder="Enter estimated cost in Rupees"
              description="Required for approval workflow routing"
            />
            
            <Select
              label="Cost Category"
              required
              options={[
                { value: 'purchase', label: 'New Purchase' },
                { value: 'upgrade', label: 'Upgrade/Enhancement' },
                { value: 'maintenance', label: 'Maintenance/Repair' },
                { value: 'replacement', label: 'Replacement' }
              ]}
              value={formData?.costCategory}
              onChange={(value) => handleInputChange('costCategory', value)}
            />
          </div>

          {/* Urgency and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Priority Level"
              description="How urgent is this request?"
              required
              options={urgencyOptions}
              value={formData?.urgency}
              onChange={(value) => handleInputChange('urgency', value)}
            />

            <Select
              label="Expected Duration"
              description="How long do you need this asset?"
              required
              options={durationOptions}
              value={formData?.expectedDuration}
              onChange={(value) => handleInputChange('expectedDuration', value)}
            />
          </div>

          {/* Alternative Options */}
          <div>
            <label className="block text-sm font-medium text-popover-foreground mb-2">
              Alternative Options
            </label>
            <textarea
              value={formData?.alternativeOptions}
              onChange={(e) => handleInputChange('alternativeOptions', e?.target?.value)}
              placeholder="List any alternative assets that would meet your needs..."
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Help us find alternatives if this asset is unavailable
            </p>
          </div>

          {/* Approval Workflow Information */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <Icon name="Shield" size={16} />
              <span>Approval Workflow</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Request Date:</span>
                <span className="text-foreground">{new Date()?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Processing:</span>
                <span className="text-foreground">{approvalInfo?.processingTime}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Required Approvers:</span>
                <div className="text-right">
                  {approvalInfo?.approvers?.map((approver, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <Icon name="User" size={14} className="text-primary" />
                      <span className="text-foreground">{approver}</span>
                    </div>
                  ))}
                </div>
              </div>
              {parseInt(formData?.estimatedCost) > 5000 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
                    <span className="font-medium text-yellow-800">Executive Approval Required</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    Requests over ₹5,000 require approval from CTO/CEO in addition to department manager.
                  </p>
                </div>
              )}
              {parseInt(formData?.estimatedCost) > 0 && parseInt(formData?.estimatedCost) <= 5000 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-blue-600" />
                    <span className="font-medium text-blue-800">Manager Approval</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Your department manager can approve this request directly.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Send"
              iconPosition="left"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetRequestModal;