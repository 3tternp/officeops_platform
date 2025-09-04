import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Checkbox } from '../../../components/ui/Checkbox';
import { createResource, ResourceCategories, ClassificationLevels, RiskLevels, calculateNextReviewDate } from '../utils/entities';

const ResourceOwnershipManager = ({ isOpen, onClose, onSubmit, resource = null, users = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    classification: 'internal',
    
    // Mandatory Asset Owner
    asset_owner_id: '',
    asset_owner_name: '',
    asset_owner_email: '',
    asset_owner_department: '',
    
    // Mandatory System Owner
    system_owner_id: '',
    system_owner_name: '',
    system_owner_email: '',
    system_owner_department: '',
    
    // Optional Data Custodian
    data_custodian_id: '',
    data_custodian_name: '',
    data_custodian_email: '',
    data_custodian_department: '',
    
    // Review Configuration
    review_cycle_days: 90,
    
    // Risk and Compliance
    risk_rating: 'medium',
    compliance_requirements: [],
    data_types: [],
    
    // Technical Details
    environment: 'production',
    access_methods: [],
    location: 'on_premise',
    
    is_active: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [nextReviewDate, setNextReviewDate] = useState('');

  // Initialize form data when editing existing resource
  useEffect(() => {
    if (isOpen) {
      if (resource) {
        setFormData({
          name: resource.name || '',
          description: resource.description || '',
          category: resource.category || '',
          classification: resource.classification || 'internal',
          asset_owner_id: resource.asset_owner_id || '',
          asset_owner_name: resource.asset_owner_name || '',
          asset_owner_email: resource.asset_owner_email || '',
          asset_owner_department: resource.asset_owner_department || '',
          system_owner_id: resource.system_owner_id || '',
          system_owner_name: resource.system_owner_name || '',
          system_owner_email: resource.system_owner_email || '',
          system_owner_department: resource.system_owner_department || '',
          data_custodian_id: resource.data_custodian_id || '',
          data_custodian_name: resource.data_custodian_name || '',
          data_custodian_email: resource.data_custodian_email || '',
          data_custodian_department: resource.data_custodian_department || '',
          review_cycle_days: resource.review_cycle_days || 90,
          risk_rating: resource.risk_rating || 'medium',
          compliance_requirements: resource.compliance_requirements || [],
          data_types: resource.data_types || [],
          environment: resource.environment || 'production',
          access_methods: resource.access_methods || [],
          location: resource.location || 'on_premise',
          is_active: resource.is_active !== undefined ? resource.is_active : true
        });
      } else {
        // Reset for new resource
        setFormData({
          name: '',
          description: '',
          category: '',
          classification: 'internal',
          asset_owner_id: '',
          asset_owner_name: '',
          asset_owner_email: '',
          asset_owner_department: '',
          system_owner_id: '',
          system_owner_name: '',
          system_owner_email: '',
          system_owner_department: '',
          data_custodian_id: '',
          data_custodian_name: '',
          data_custodian_email: '',
          data_custodian_department: '',
          review_cycle_days: 90,
          risk_rating: 'medium',
          compliance_requirements: [],
          data_types: [],
          environment: 'production',
          access_methods: [],
          location: 'on_premise',
          is_active: true
        });
      }
      setErrors({});
    }
  }, [isOpen, resource]);

  // Calculate next review date when cycle changes
  useEffect(() => {
    if (formData.review_cycle_days) {
      const nextDate = calculateNextReviewDate(null, formData.review_cycle_days);
      setNextReviewDate(new Date(nextDate).toLocaleDateString());
    }
  }, [formData.review_cycle_days]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle user selections
    if (field === 'asset_owner_id') {
      const selectedUser = users.find(u => u.id === value);
      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          asset_owner_name: selectedUser.name,
          asset_owner_email: selectedUser.email,
          asset_owner_department: selectedUser.department
        }));
      }
    }

    if (field === 'system_owner_id') {
      const selectedUser = users.find(u => u.id === value);
      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          system_owner_name: selectedUser.name,
          system_owner_email: selectedUser.email,
          system_owner_department: selectedUser.department
        }));
      }
    }

    if (field === 'data_custodian_id') {
      const selectedUser = users.find(u => u.id === value);
      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          data_custodian_name: selectedUser.name,
          data_custodian_email: selectedUser.email,
          data_custodian_department: selectedUser.department
        }));
      } else if (value === '') {
        setFormData(prev => ({
          ...prev,
          data_custodian_name: '',
          data_custodian_email: '',
          data_custodian_department: ''
        }));
      }
    }
  };

  const handleArrayChange = (field, option, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], option]
        : prev[field].filter(item => item !== option)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Resource name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';

    // Mandatory Asset Owner
    if (!formData.asset_owner_id) newErrors.asset_owner_id = 'Asset Owner is mandatory for all resources';
    
    // Mandatory System Owner
    if (!formData.system_owner_id) newErrors.system_owner_id = 'System Owner is mandatory for all resources';
    
    // Asset and System owners cannot be the same person
    if (formData.asset_owner_id && formData.system_owner_id && formData.asset_owner_id === formData.system_owner_id) {
      newErrors.system_owner_id = 'System Owner must be different from Asset Owner for proper segregation of duties';
    }

    // Review cycle validation
    if (!formData.review_cycle_days || formData.review_cycle_days < 30) {
      newErrors.review_cycle_days = 'Review cycle must be at least 30 days';
    }

    // Name uniqueness (simplified check)
    if (formData.name.length < 3) {
      newErrors.name = 'Resource name must be at least 3 characters';
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
      const resourceData = createResource({
        id: resource ? resource.id : Date.now().toString(),
        ...formData,
        next_review_date: calculateNextReviewDate(null, formData.review_cycle_days),
        updated_at: new Date().toISOString()
      });

      await onSubmit(resourceData);
      onClose();
    } catch (error) {
      console.error('Error submitting resource:', error);
      alert('Error submitting resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.name} (${user.department}) - ${user.email}`
  }));

  const categoryOptions = Object.entries(ResourceCategories).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));

  const classificationOptions = Object.entries(ClassificationLevels).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));

  const riskOptions = Object.entries(RiskLevels).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));

  const environmentOptions = [
    { value: 'development', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' }
  ];

  const locationOptions = [
    { value: 'on_premise', label: 'On Premise' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const reviewCycleOptions = [
    { value: '30', label: '30 days (Monthly)' },
    { value: '60', label: '60 days (Bi-monthly)' },
    { value: '90', label: '90 days (Quarterly)' },
    { value: '180', label: '180 days (Semi-annually)' },
    { value: '365', label: '365 days (Annually)' }
  ];

  const complianceOptions = [
    'GDPR', 'HIPAA', 'SOX', 'PCI DSS', 'ISO 27001', 'SOC 2', 'CCPA', 'FERPA'
  ];

  const dataTypeOptions = [
    'PII', 'PHI', 'Financial', 'Intellectual Property', 'Trade Secrets', 'Public', 'Internal', 'Customer Data'
  ];

  const accessMethodOptions = [
    'Web Interface', 'API', 'Database', 'File Share', 'SSH', 'RDP', 'VPN', 'Mobile App'
  ];

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {resource ? 'Edit Resource' : 'Create New Resource'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure resource ownership and access management
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="Info" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Resource Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  placeholder="Enter resource name"
                />
                
                <Select
                  label="Category *"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => handleInputChange('category', value)}
                  error={errors.category}
                  placeholder="Select category"
                />

                <Select
                  label="Classification *"
                  options={classificationOptions}
                  value={formData.classification}
                  onChange={(value) => handleInputChange('classification', value)}
                />

                <Select
                  label="Risk Rating *"
                  options={riskOptions}
                  value={formData.risk_rating}
                  onChange={(value) => handleInputChange('risk_rating', value)}
                />
              </div>

              <Textarea
                label="Description *"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={errors.description}
                placeholder="Describe the resource and its purpose"
                rows={3}
              />
            </div>

            {/* Ownership Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Ownership & Responsibility</h3>
                <div className="bg-error/10 text-error text-xs px-2 py-1 rounded-full">
                  Mandatory
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-warning">Segregation of Duties Required</div>
                    <div className="text-muted-foreground mt-1">
                      Asset Owner and System Owner must be different individuals to ensure proper segregation of duties and compliance.
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset Owner */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="Briefcase" size={16} className="text-success" />
                  <h4 className="font-medium text-foreground">Asset Owner *</h4>
                  <div className="text-xs text-muted-foreground">(Business Responsibility)</div>
                </div>
                
                <Select
                  label="Select Asset Owner *"
                  options={userOptions}
                  value={formData.asset_owner_id}
                  onChange={(value) => handleInputChange('asset_owner_id', value)}
                  error={errors.asset_owner_id}
                  placeholder="Select asset owner"
                />
                
                {formData.asset_owner_name && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Name & Department</div>
                      <div className="font-medium">{formData.asset_owner_name}</div>
                      <div className="text-sm text-muted-foreground">{formData.asset_owner_department}</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{formData.asset_owner_email}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* System Owner */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="Settings" size={16} className="text-info" />
                  <h4 className="font-medium text-foreground">System Owner *</h4>
                  <div className="text-xs text-muted-foreground">(Technical Responsibility)</div>
                </div>
                
                <Select
                  label="Select System Owner *"
                  options={userOptions}
                  value={formData.system_owner_id}
                  onChange={(value) => handleInputChange('system_owner_id', value)}
                  error={errors.system_owner_id}
                  placeholder="Select system owner"
                />
                
                {formData.system_owner_name && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Name & Department</div>
                      <div className="font-medium">{formData.system_owner_name}</div>
                      <div className="text-sm text-muted-foreground">{formData.system_owner_department}</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{formData.system_owner_email}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Data Custodian (Optional) */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="Database" size={16} className="text-warning" />
                  <h4 className="font-medium text-foreground">Data Custodian</h4>
                  <div className="text-xs text-muted-foreground">(Optional - Day-to-day Management)</div>
                </div>
                
                <Select
                  label="Select Data Custodian (Optional)"
                  options={[{ value: '', label: 'None' }, ...userOptions]}
                  value={formData.data_custodian_id}
                  onChange={(value) => handleInputChange('data_custodian_id', value)}
                  placeholder="Select data custodian (optional)"
                />
                
                {formData.data_custodian_name && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Name & Department</div>
                      <div className="font-medium">{formData.data_custodian_name}</div>
                      <div className="text-sm text-muted-foreground">{formData.data_custodian_department}</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{formData.data_custodian_email}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Review Configuration */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Access Review Configuration</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Review Cycle *"
                  options={reviewCycleOptions}
                  value={formData.review_cycle_days.toString()}
                  onChange={(value) => handleInputChange('review_cycle_days', parseInt(value))}
                  error={errors.review_cycle_days}
                />
                
                <div className="bg-info/10 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Next Review Date</div>
                  <div className="font-medium">{nextReviewDate}</div>
                </div>
              </div>
            </div>

            {/* Technical Configuration */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="Server" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Technical Configuration</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Environment"
                  options={environmentOptions}
                  value={formData.environment}
                  onChange={(value) => handleInputChange('environment', value)}
                />
                
                <Select
                  label="Location"
                  options={locationOptions}
                  value={formData.location}
                  onChange={(value) => handleInputChange('location', value)}
                />

                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    label="Resource Active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  />
                </div>
              </div>

              {/* Access Methods */}
              <div>
                <label className="block text-sm font-medium mb-2">Access Methods</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {accessMethodOptions.map((method) => (
                    <Checkbox
                      key={method}
                      label={method}
                      checked={formData.access_methods.includes(method)}
                      onChange={(e) => handleArrayChange('access_methods', method, e.target.checked)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Configuration */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Compliance & Data Classification</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Compliance Requirements */}
                <div>
                  <label className="block text-sm font-medium mb-2">Compliance Requirements</label>
                  <div className="grid grid-cols-2 gap-2">
                    {complianceOptions.map((requirement) => (
                      <Checkbox
                        key={requirement}
                        label={requirement}
                        checked={formData.compliance_requirements.includes(requirement)}
                        onChange={(e) => handleArrayChange('compliance_requirements', requirement, e.target.checked)}
                      />
                    ))}
                  </div>
                </div>

                {/* Data Types */}
                <div>
                  <label className="block text-sm font-medium mb-2">Data Types</label>
                  <div className="grid grid-cols-2 gap-2">
                    {dataTypeOptions.map((dataType) => (
                      <Checkbox
                        key={dataType}
                        label={dataType}
                        checked={formData.data_types.includes(dataType)}
                        onChange={(e) => handleArrayChange('data_types', dataType, e.target.checked)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/25">
          <div className="text-sm text-muted-foreground">
            All resources require mandatory Asset and System Owner assignment for compliance.
          </div>
          <div className="flex items-center space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} className="mr-2" />
                  {resource ? 'Update Resource' : 'Create Resource'}
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

export default ResourceOwnershipManager;
