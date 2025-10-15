import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import dataService from '../../../services/DataService';

const ApprovalRequestModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    resourceId: '',
    accessType: 'read',
    duration: '7',
    justification: '',
    urgency: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Load resources and current user
      setResources(dataService.getResources());
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      setCurrentUser(user);
      
      // Calculate end date based on duration
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + parseInt(formData.duration));
      setFormData(prev => ({
        ...prev,
        endDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [isOpen, formData.startDate, formData.duration]);

  useEffect(() => {
    if (formData.resourceId) {
      const resource = resources.find(r => r.id === formData.resourceId);
      setSelectedResource(resource);
    } else {
      setSelectedResource(null);
    }
  }, [formData.resourceId, resources]);

  const accessTypeOptions = [
    { value: 'read', label: 'Read Only' },
    { value: 'read-write', label: 'Read & Write' },
    { value: 'admin', label: 'Administrative' },
    { value: 'full', label: 'Full Access' }
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const durationOptions = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '7', label: '1 Week' },
    { value: '14', label: '2 Weeks' },
    { value: '30', label: '1 Month' },
    { value: '90', label: '3 Months' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resourceId || !formData.justification) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await dataService.createAccessRequest(formData, currentUser);
      onSubmit && onSubmit();
      onClose();
      
      // Reset form
      setFormData({
        resourceId: '',
        accessType: 'read',
        duration: '7',
        justification: '',
        urgency: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      
      alert('Access request submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoutingInfo = () => {
    if (!selectedResource) return null;
    
    let routingDepartment = selectedResource.department;
    if (selectedResource.category === 'Infrastructure' || 
        selectedResource.category === 'Database' || 
        selectedResource.category === 'Application') {
      routingDepartment = 'Information Technology';
    }

    return {
      department: routingDepartment,
      approverRole: routingDepartment === 'Information Technology' ? 'ISO' : 'Department Manager'
    };
  };

  const routingInfo = getRoutingInfo();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Request Access</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Request access to system resources
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Resource Selection */}
          <Select
            label="System Resource"
            description="Select the resource you need access to"
            required
            options={resources.map(resource => ({
              value: resource.id,
              label: `${resource.name} - ${resource.category}`
            }))}
            value={formData.resourceId}
            onChange={(value) => handleInputChange('resourceId', value)}
          />

          {/* Selected Resource Info */}
          {selectedResource && (
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                <Icon name="Info" size={16} />
                <span>Resource Information</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="text-foreground">{selectedResource.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-foreground">{selectedResource.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <span className={`text-foreground px-2 py-1 rounded text-xs ${
                    selectedResource.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                    selectedResource.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                    selectedResource.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedResource.riskLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Duration:</span>
                  <span className="text-foreground">{selectedResource.maxAccessDuration} days</span>
                </div>
              </div>
            </div>
          )}

          {/* Access Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Access Type"
              description="Level of access required"
              required
              options={accessTypeOptions}
              value={formData.accessType}
              onChange={(value) => handleInputChange('accessType', value)}
            />

            <Select
              label="Duration"
              description="How long do you need access?"
              required
              options={durationOptions}
              value={formData.duration}
              onChange={(value) => handleInputChange('duration', value)}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              description="When do you need access to start?"
            />

            <Input
              label="End Date"
              type="date"
              required
              value={formData.endDate}
              readOnly
              description="Automatically calculated based on duration"
            />
          </div>

          {/* Priority */}
          <Select
            label="Priority Level"
            description="How urgent is this request?"
            required
            options={urgencyOptions}
            value={formData.urgency}
            onChange={(value) => handleInputChange('urgency', value)}
          />

          {/* Justification */}
          <div>
            <label className="block text-sm font-medium text-popover-foreground mb-2">
              Business Justification *
            </label>
            <textarea
              required
              value={formData.justification}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              placeholder="Explain why you need this access and how it will be used..."
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Provide detailed justification for approval process
            </p>
          </div>

          {/* Routing Information */}
          {routingInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
                <Icon name="Route" size={16} />
                <span>Request Routing</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600">Routed to:</span>
                  <span className="text-blue-800 font-medium">{routingInfo.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Approver:</span>
                  <span className="text-blue-800 font-medium">{routingInfo.approverRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Expected Processing:</span>
                  <span className="text-blue-800">2-3 business days</span>
                </div>
              </div>
            </div>
          )}

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

export default ApprovalRequestModal;
