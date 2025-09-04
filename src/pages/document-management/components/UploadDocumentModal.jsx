import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { FileSecurityValidator } from '../../../utils/fileSecurityValidator';

const UploadDocumentModal = ({ isOpen, onClose, onSubmit }) => {
  const [uploadData, setUploadData] = useState({
    file: null,
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
    autoExtractMetadata: true,
    enableVersioning: true
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

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

  const handleFileChange = async (file) => {
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert(`❌ File too large: ${file.name}\n\nMaximum file size is 50MB.`);
        return;
      }

      // Get file extension and restrict to PDF only
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const supportedExtensions = ['pdf'];
      
      if (!supportedExtensions.includes(fileExtension)) {
        alert(`❌ Unsupported file type: ${file.name}\n\nOnly PDF files are supported for document uploads. This ensures proper document rendering and security.`);
        return;
      }

      try {
        let validationResult = { isValid: true, warnings: [] };
        
        // Apply appropriate validation based on file type
        if (fileExtension === 'pdf') {
          validationResult = await FileSecurityValidator.validatePDF(file);
        } else {
          // Basic validation for other file types
          validationResult = {
            isValid: true,
            warnings: [`File type ${fileExtension.toUpperCase()} - basic security checks applied`]
          };
        }
        
        if (!validationResult.isValid) {
          alert(`❌ Upload Failed: ${file.name}\n\n${validationResult.errors.join('\n')}`);
          return;
        }
        
        // Show warnings if any (but allow upload)
        if (validationResult.warnings && validationResult.warnings.length > 0) {
          const proceed = confirm(`⚠️ Security Warning for ${file.name}:\n\n${validationResult.warnings.join('\n')}\n\nThis file passed security checks but contains elements that require attention. Do you want to proceed?`);
          if (!proceed) return;
        }
        
        setUploadData(prev => ({ 
          ...prev, 
          file,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''), // Use filename as title if empty
          validated: true,
          securityCheck: 'passed',
          warnings: validationResult.warnings || [],
          fileExtension
        }));
        
        // Read file content for in-app viewing
        try {
          const content = await readFileContent(file);
          setUploadData(prev => ({ ...prev, fileContent: content }));
        } catch (error) {
          console.error('Error reading file content:', error);
        }
        
        console.log(`✅ File validated successfully: ${file.name}`);
        
      } catch (error) {
        console.error('Error validating file:', error);
        alert(`❌ Error validating ${file.name}: ${error.message}`);
      }
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target.result;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        // Store the actual file data for different file types
        setUploadData(prev => ({
          ...prev,
          fileExtension,
          actualFileContent: content // Store the raw file content
        }));
        
        // For different file types, create appropriate display content
        if (file.type === 'text/plain' || file.type === 'text/markdown') {
          resolve(formatTextContent(content));
        } else if (file.type === 'application/pdf') {
          // For PDFs, store the data URL for rendering
          resolve(content); // Return the data URL directly
        } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExtension)) {
          // For images, return the data URL
          resolve(content);
        } else if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(fileExtension)) {
          resolve(formatOfficeContent(file.name, file.type));
        } else {
          // For other file types, create a placeholder
          resolve(formatGenericContent(file.name, file.type));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      // Read different file types appropriately
      if (file.type === 'text/plain' || file.type === 'text/markdown') {
        reader.readAsText(file);
      } else if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        reader.readAsDataURL(file); // Use data URL for PDFs and images
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const formatTextContent = (content) => {
    // Convert plain text to HTML with basic formatting
    return content
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('');
  };

  const formatOfficeContent = (fileName, fileType) => {
    return `
      <h2>Office Document: ${fileName}</h2>
      <div class="bg-info/10 border border-info/20 rounded-lg p-4 my-4">
        <p><strong>File Type:</strong> ${fileType}</p>
        <p><strong>Note:</strong> This Office document has been uploaded successfully.</p>
        <p>Office documents (Word, PowerPoint, Excel) require special handling and would typically be converted to a viewable format or opened in compatible applications.</p>
      </div>
      <h2>Document Information</h2>
      <p>This document contains important business information and has been uploaded to the document management system.</p>
      <h2>Access Instructions</h2>
      <ul>
        <li>Download the document to view in the appropriate Office application</li>
        <li>Ensure you have the required software to open this document type</li>
        <li>Contact IT support if you need assistance accessing this document</li>
        <li>Review document permissions and sharing settings</li>
      </ul>
    `;
  };

  const formatGenericContent = (fileName, fileType) => {
    return `
      <h2>Document: ${fileName}</h2>
      <div class="bg-info/10 border border-info/20 rounded-lg p-4 my-4">
        <p><strong>File Type:</strong> ${fileType}</p>
        <p><strong>Status:</strong> Successfully uploaded and ready for review</p>
      </div>
      <h2>Document Information</h2>
      <p>This document has been uploaded to the system and is available for review. The content shown here is a formatted representation of the uploaded file.</p>
      <h2>Review Instructions</h2>
      <ul>
        <li>Take time to review the document thoroughly</li>
        <li>Pay attention to all sections and requirements</li>
        <li>Seek clarification if any part is unclear</li>
        <li>Complete the acknowledgment process when finished</li>
      </ul>
    `;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (field, value) => {
    setUploadData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadData.file) {
      alert('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Mock processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create document data
      const documentData = {
        ...uploadData,
        id: Date.now(),
        version: '1.0',
        lastModified: new Date().toISOString(),
        fileSize: (uploadData.file.size / 1024).toFixed(2) + ' KB',
        acknowledgmentStatus: 'pending',
        targetCount: 0,
        acknowledgedCount: 0,
        viewCount: 0,
        tags: uploadData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        relatedDocuments: [],
        originalFileName: uploadData.file.name,
        fileType: uploadData.file.type
      };

      await onSubmit(documentData);

      alert(`Successfully uploaded document: ${uploadData.file.name}`);
      onClose();
      
      // Reset form
      setUploadData({
        file: null,
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
        autoExtractMetadata: true,
        enableVersioning: true
      });
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
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
            <h2 className="text-xl font-semibold text-popover-foreground">Upload Document</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a document file and add metadata
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">File Upload</h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadData.file ? (
                <div className="space-y-2">
                  <Icon name="FileText" size={48} className="text-success mx-auto" />
                  <p className="font-medium text-foreground">{uploadData.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadData.file.size / 1024).toFixed(2)} KB • {uploadData.file.type || 'Unknown type'}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadData(prev => ({ ...prev, file: null }))}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Icon name="Upload" size={48} className="text-muted-foreground mx-auto" />
                  <p className="font-medium text-foreground">Drop your document file here</p>
                  <p className="text-sm text-muted-foreground">
                    Or click to browse and select a file
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    Select File
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Only PDF files supported (Max: 50MB) • Enhanced security scanning
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Document Metadata */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Document Information</h3>
            
            <Input
              label="Document Title"
              required
              value={uploadData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter document title"
            />
            
            <div>
              <label className="block text-sm font-medium text-popover-foreground mb-2">
                Description *
              </label>
              <textarea
                required
                value={uploadData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a description of the document..."
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Document Type"
                required
                options={typeOptions}
                value={uploadData.type}
                onChange={(value) => handleInputChange('type', value)}
                placeholder="Select type"
              />
              
              <Select
                label="Category"
                required
                options={categoryOptions}
                value={uploadData.category}
                onChange={(value) => handleInputChange('category', value)}
                placeholder="Select category"
              />
              
              <Select
                label="Department"
                required
                options={departmentOptions}
                value={uploadData.department}
                onChange={(value) => handleInputChange('department', value)}
                placeholder="Select department"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Author"
                required
                value={uploadData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="e.g., John Smith"
              />
              
              <Select
                label="Priority"
                required
                options={priorityOptions}
                value={uploadData.priority}
                onChange={(value) => handleInputChange('priority', value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Effective Date"
                type="date"
                required
                value={uploadData.effectiveDate}
                onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
              />
              
              <Input
                label="Expiry Date"
                type="date"
                value={uploadData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
              
              <Select
                label="Language"
                required
                options={languageOptions}
                value={uploadData.language}
                onChange={(value) => handleInputChange('language', value)}
              />
            </div>

            <Input
              label="Tags"
              value={uploadData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="e.g., security, policy, mandatory (comma-separated)"
              description="Add tags to help categorize and search for this document"
            />
          </div>

          {/* Document Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Document Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is-required"
                  checked={uploadData.isRequired}
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
                  checked={uploadData.hasESignature}
                  onChange={(e) => handleInputChange('hasESignature', e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <label htmlFor="has-esignature" className="text-sm text-foreground">
                  Requires electronic signature
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="auto-extract"
                  checked={uploadData.autoExtractMetadata}
                  onChange={(e) => handleInputChange('autoExtractMetadata', e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <label htmlFor="auto-extract" className="text-sm text-foreground">
                  Auto-extract metadata from file
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enable-versioning"
                  checked={uploadData.enableVersioning}
                  onChange={(e) => handleInputChange('enableVersioning', e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <label htmlFor="enable-versioning" className="text-sm text-foreground">
                  Enable version control for this document
                </label>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Uploading...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Upload Guidelines</p>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>• Supported formats: PDF files only (.pdf)</li>
                    <li>• Maximum file size: 50MB</li>
                    <li>• Enhanced security scanning and validation for PDFs</li>
                    <li>• Malicious content detection and signature validation</li>
                    <li>• Ensures reliable document viewing and rendering</li>
                    <li>• Maintains document integrity and security standards</li>
                  </ul>
                </div>
              </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isUploading}
              disabled={!uploadData.file}
              iconName="Upload"
              iconPosition="left"
            >
              Upload Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
