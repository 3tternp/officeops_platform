import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EditDocumentModal = ({ isOpen, onClose, onSubmit, document }) => {
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

  // Populate form with document data when document prop changes
  useEffect(() => {
    if (isOpen && document) {
      console.log('Loading document for editing:', document);
      
      setFormData({
        title: document.title || '',
        description: document.description || '',
        type: document.type || '',
        category: document.category || '',
        department: document.department || '',
        author: document.author || '',
        effectiveDate: document.effectiveDate ? document.effectiveDate.split('T')[0] : '',
        expiryDate: document.expiryDate ? document.expiryDate.split('T')[0] : '',
        priority: document.priority || 'medium',
        isRequired: document.isRequired || false,
        hasESignature: document.hasESignature || false,
        language: document.language || 'English',
        tags: Array.isArray(document.tags) ? document.tags.join(', ') : (document.tags || ''),
        content: document.content || '',
        relatedDocuments: document.relatedDocuments || []
      });
    }
  }, [isOpen, document]);

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
      const updatedDocumentData = {
        ...document, // Keep original document data
        ...formData,
        lastModified: new Date().toISOString(),
        fileSize: document.fileSize || '1.2 MB', // Keep original file size or default
        acknowledgmentStatus: document.acknowledgmentStatus || 'pending',
        targetCount: document.targetCount || 0,
        acknowledgedCount: document.acknowledgedCount || 0,
        viewCount: document.viewCount || 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        relatedDocuments: formData.relatedDocuments || []
      };

      await onSubmit(updatedDocumentData);
      onClose();
      
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Error updating document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-900 border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-foreground">Edit Document</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update the document details and settings
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted rounded-full">
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
              iconName="Save"
              iconPosition="left"
            >
              Update Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentModal;
