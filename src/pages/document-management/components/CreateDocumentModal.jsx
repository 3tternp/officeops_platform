import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateDocumentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    department: '',
    author: '',
    effectiveDate: '',
    expiryDate: '',
    priority: 'medium',
    isRequired: false,
    hasESignature: false,
    language: 'English',
    tags: '',
    content: '',
    relatedDocuments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const typeOptions = [
    { value: 'policy', label: 'Policy' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'handbook', label: 'Handbook' },
    { value: 'form', label: 'Form' },
    { value: 'guideline', label: 'Guideline' },
    { value: 'manual', label: 'Manual' },
    { value: 'template', label: 'Template' },
    { value: 'report', label: 'Report' }
  ];

  const categoryOptions = [
    { value: 'security', label: 'Security' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'operations', label: 'Operations' },
    { value: 'finance', label: 'Finance' },
    { value: 'risk', label: 'Risk Management' },
    { value: 'safety', label: 'Safety' },
    { value: 'quality', label: 'Quality' }
  ];

  const departmentOptions = [
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Risk Management', label: 'Risk Management' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const documentData = {
        ...formData,
        id: Date.now(),
        version: '1.0',
        lastModified: new Date().toISOString(),
        fileSize: '1.2 MB', // Mock file size
        acknowledgmentStatus: 'pending',
        targetCount: 0,
        acknowledgedCount: 0,
        viewCount: 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        relatedDocuments: []
      };

      await onSubmit(documentData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: '',
        category: '',
        department: '',
        author: '',
        effectiveDate: '',
        expiryDate: '',
        priority: 'medium',
        isRequired: false,
        hasESignature: false,
        language: 'English',
        tags: '',
        content: '',
        relatedDocuments: []
      });
    } catch (error) {
      console.error('Error creating document:', error);
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
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Create New Document</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new document for the document management system
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Basic Information</h3>
            
            <Input
              label="Document Title"
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Information Security Policy v3.2"
            />
            
            <div>
              <label className="block text-sm font-medium text-popover-foreground mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a comprehensive description of the document purpose and scope..."
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Document Type"
                required
                options={typeOptions}
                value={formData.type}
                onChange={(value) => handleInputChange('type', value)}
                placeholder="Select type"
              />
              
              <Select
                label="Category"
                required
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                placeholder="Select category"
              />
              
              <Select
                label="Department"
                required
                options={departmentOptions}
                value={formData.department}
                onChange={(value) => handleInputChange('department', value)}
                placeholder="Select department"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Author"
                required
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="e.g., John Smith"
              />
              
              <Select
                label="Language"
                required
                options={languageOptions}
                value={formData.language}
                onChange={(value) => handleInputChange('language', value)}
              />
            </div>
          </div>

          {/* Dates and Priority */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Dates and Priority</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Effective Date"
                type="date"
                required
                value={formData.effectiveDate}
                onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
              />
              
              <Input
                label="Expiry Date"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
              
              <Select
                label="Priority"
                required
                options={priorityOptions}
                value={formData.priority}
                onChange={(value) => handleInputChange('priority', value)}
              />
            </div>
          </div>

          {/* Document Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Document Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is-required"
                  checked={formData.isRequired}
                  onChange={(e) => handleInputChange('isRequired', e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <label htmlFor="is-required" className="text-sm text-foreground">
                  Required document (mandatory acknowledgment)
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="has-esignature"
                  checked={formData.hasESignature}
                  onChange={(e) => handleInputChange('hasESignature', e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <label htmlFor="has-esignature" className="text-sm text-foreground">
                  Requires electronic signature
                </label>
              </div>
            </div>

            <Input
              label="Tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="e.g., security, policy, mandatory, iso27001 (comma-separated)"
              description="Add tags to help categorize and search for this document"
            />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Document Content</h3>
            
            <div>
              <label className="block text-sm font-medium text-popover-foreground mb-2">
                Content *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the document content here. You can format this text as needed..."
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                For longer documents, you can upload a file using the Upload Document feature
              </p>
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
              iconName="FileText"
              iconPosition="left"
            >
              Create Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDocumentModal;
