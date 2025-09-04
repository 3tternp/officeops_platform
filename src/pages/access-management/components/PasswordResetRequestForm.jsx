import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/TextArea';
import Select from '../../../components/ui/Select';

const PasswordResetRequestForm = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    applicationName: '',
    username: '',
    businessJustification: '',
    priority: 'normal',
    lastLoginDate: '',
    accountLocked: false,
    securityClearance: 'standard',
    contactPhone: '',
    managerApproval: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const priorityOptions = [
    { value: 'normal', label: 'Normal (3-5 business days)' },
    { value: 'urgent', label: 'Urgent (Same day - requires justification)' },
    { value: 'emergency', label: 'Emergency (Immediate - security incident)' }
  ];

  const securityClearanceOptions = [
    { value: 'standard', label: 'Standard Access' },
    { value: 'elevated', label: 'Elevated Privileges' },
    { value: 'admin', label: 'Administrative Access' },
    { value: 'system', label: 'System/Service Account' }
  ];

  const applicationOptions = [
    { value: 'Active Directory', label: 'Active Directory (Windows Login)' },
    { value: 'Office 365', label: 'Microsoft Office 365' },
    { value: 'Employee Database', label: 'Employee Database System' },
    { value: 'Financial Systems', label: 'Financial Management System' },
    { value: 'CRM System', label: 'Customer Relationship Management' },
    { value: 'ERP System', label: 'Enterprise Resource Planning' },
    { value: 'Network Infrastructure', label: 'Network/VPN Access' },
    { value: 'Database Server', label: 'Database Server Access' },
    { value: 'Other', label: 'Other (specify in justification)' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.applicationName) {
      newErrors.applicationName = 'Application/System is required';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!formData.businessJustification || formData.businessJustification.length < 20) {
      newErrors.businessJustification = 'Business justification must be at least 20 characters';
    }

    if (formData.priority === 'urgent' && formData.businessJustification.length < 50) {
      newErrors.businessJustification = 'Urgent requests require detailed justification (minimum 50 characters)';
    }

    if (formData.priority === 'emergency' && formData.businessJustification.length < 100) {
      newErrors.businessJustification = 'Emergency requests require comprehensive justification (minimum 100 characters)';
    }

    if (!formData.contactPhone || formData.contactPhone.length < 10) {
      newErrors.contactPhone = 'Valid contact phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        ...formData,
        type: 'password_reset',
        requestCategory: 'Security',
        urgency: formData.priority,
        requesterRole: currentUser.role,
        requesterDepartment: currentUser.department,
        estimatedProcessingTime: formData.priority === 'emergency' ? '2 hours' : 
                                formData.priority === 'urgent' ? '4-6 hours' : '3-5 business days',
        securityImpact: formData.securityClearance === 'admin' ? 'High' : 
                       formData.securityClearance === 'elevated' ? 'Medium' : 'Low'
      };

      await onSubmit(requestData);
      onClose();
    } catch (error) {
      console.error('Error submitting password reset request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      applicationName: '',
      username: '',
      businessJustification: '',
      priority: 'normal',
      lastLoginDate: '',
      accountLocked: false,
      securityClearance: 'standard',
      contactPhone: '',
      managerApproval: false
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon name="KeyRound" size={20} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Password Reset Request</h2>
              <p className="text-sm text-gray-500 mt-1">
                Request password reset with security review and admin processing
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Security Review Required</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• All password reset requests require security or departmental approval</li>
                  <li>• ISO officers can approve any employee/manager requests</li>
                  <li>• Department managers can approve employee requests from their department</li>
                  <li>• After approval, admin will process the request and notify you</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Application/System */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application/System *
            </label>
            <Select
              options={applicationOptions}
              value={formData.applicationName}
              onChange={(value) => handleChange('applicationName', value)}
              placeholder="Select application or system"
              className={errors.applicationName ? 'border-red-500' : ''}
            />
            {errors.applicationName && (
              <p className="text-sm text-red-600 mt-1">{errors.applicationName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username/Account *
            </label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Enter your username or account name"
              className={errors.username ? 'border-red-500' : ''}
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Priority *
            </label>
            <Select
              options={priorityOptions}
              value={formData.priority}
              onChange={(value) => handleChange('priority', value)}
              placeholder="Select request priority"
            />
          </div>

          {/* Security Clearance Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security Clearance Level *
            </label>
            <Select
              options={securityClearanceOptions}
              value={formData.securityClearance}
              onChange={(value) => handleChange('securityClearance', value)}
              placeholder="Select your access level"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone Number *
            </label>
            <Input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              placeholder="Enter your direct phone number"
              className={errors.contactPhone ? 'border-red-500' : ''}
            />
            {errors.contactPhone && (
              <p className="text-sm text-red-600 mt-1">{errors.contactPhone}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Required for identity verification before password reset
            </p>
          </div>

          {/* Last Login Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Successful Login Date (if known)
            </label>
            <Input
              type="date"
              value={formData.lastLoginDate}
              onChange={(e) => handleChange('lastLoginDate', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Helps with security verification (optional but recommended)
            </p>
          </div>

          {/* Account Locked Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="accountLocked"
              checked={formData.accountLocked}
              onChange={(e) => handleChange('accountLocked', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="accountLocked" className="text-sm text-gray-700">
              Account is currently locked out
            </label>
          </div>

          {/* Business Justification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Justification *
            </label>
            <Textarea
              value={formData.businessJustification}
              onChange={(e) => handleChange('businessJustification', e.target.value)}
              placeholder="Provide detailed business justification for the password reset request..."
              rows={4}
              className={errors.businessJustification ? 'border-red-500' : ''}
            />
            {errors.businessJustification && (
              <p className="text-sm text-red-600 mt-1">{errors.businessJustification}</p>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                {formData.priority === 'emergency' ? 'Minimum 100 characters required for emergency requests' :
                 formData.priority === 'urgent' ? 'Minimum 50 characters required for urgent requests' :
                 'Minimum 20 characters required'}
              </p>
              <span className="text-xs text-gray-400">
                {formData.businessJustification.length} characters
              </span>
            </div>
          </div>

          {/* Manager Pre-approval for employees */}
          {currentUser.role === 'employee' && (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="managerApproval"
                checked={formData.managerApproval}
                onChange={(e) => handleChange('managerApproval', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="managerApproval" className="text-sm text-gray-700">
                I have informed my department manager about this request
              </label>
            </div>
          )}

          {/* Processing Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Processing Timeline</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li><strong>Normal:</strong> 3-5 business days after approval</li>
                  <li><strong>Urgent:</strong> 4-6 hours after approval (requires detailed justification)</li>
                  <li><strong>Emergency:</strong> 2 hours after approval (security incidents only)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Reset Form
              </Button>
            </div>
            <div className="flex space-x-3">
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
                variant="default"
                loading={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                <Icon name="Send" size={16} className="mr-2" />
                Submit Password Reset Request
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetRequestForm;
