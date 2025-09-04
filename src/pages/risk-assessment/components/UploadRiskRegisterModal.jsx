import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { generateRiskRegisterTemplate, validateRiskRegisterFile, getRiskRegisterInstructions } from '../../../utils/riskRegisterTemplate';
import { toast } from 'react-hot-toast';

const UploadRiskRegisterModal = ({ isOpen, onClose, onSubmit }) => {
  const [uploadData, setUploadData] = useState({
    file: null,
    fileType: 'csv',
    mergeStrategy: 'append',
    validateData: true,
    notifyOwners: false
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fileTypeOptions = [
    { value: 'csv', label: 'CSV (.csv)' },
    { value: 'excel', label: 'Excel (.xlsx)' }
  ];

  const mergeStrategyOptions = [
    { value: 'append', label: 'Append to existing risks' },
    { value: 'replace', label: 'Replace all existing risks' },
    { value: 'update', label: 'Update existing, add new' }
  ];

  const handleFileChange = (file) => {
    if (file) {
      try {
        // Validate file type and size
        validateRiskRegisterFile(file);
        
        setUploadData(prev => ({ ...prev, file }));
        
        // Generate preview data (mock)
        setPreviewData({
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(2) + ' KB',
          estimatedRecords: Math.floor(Math.random() * 50) + 10,
          columns: ['Risk ID', 'Title', 'Category', 'Likelihood', 'Impact', 'Owner', 'Status']
        });
        
        toast.success('File validated successfully!');
      } catch (error) {
        toast.error(error.message);
        return;
      }
    }
  };

  const handleDownloadTemplate = (format) => {
    try {
      generateRiskRegisterTemplate(format);
      toast.success(`${format.toUpperCase()} template downloaded successfully!`);
    } catch (error) {
      toast.error('Failed to download template');
    }
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

      // Generate mock parsed data
      const mockParsedRisks = Array.from({ length: previewData.estimatedRecords }, (_, index) => ({
        id: `RISK-UPL-${Date.now()}-${index + 1}`,
        title: `Imported Risk ${index + 1}`,
        description: `Risk imported from ${uploadData.file.name}`,
        category: ['Technology', 'Operational', 'Financial', 'Strategic'][index % 4],
        likelihood: Math.floor(Math.random() * 5) + 1,
        impact: Math.floor(Math.random() * 5) + 1,
        owner: ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson'][index % 4],
        status: 'Open',
        treatmentStatus: 'Not Started',
        reviewStatus: 'Current',
        assessmentDate: new Date().toISOString().split('T')[0],
        nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));

      await onSubmit({
        risks: mockParsedRisks,
        mergeStrategy: uploadData.mergeStrategy,
        file: uploadData.file
      });

      alert(`Successfully imported ${mockParsedRisks.length} risks from ${uploadData.file.name}`);
      onClose();
      
      // Reset form
      setUploadData({
        file: null,
        fileType: 'csv',
        mergeStrategy: 'append',
        validateData: true,
        notifyOwners: false
      });
      setPreviewData(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading risk register:', error);
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
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Upload Risk Register</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Import risks from CSV, Excel, or JSON files
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
                    {(uploadData.file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUploadData(prev => ({ ...prev, file: null }));
                      setPreviewData(null);
                    }}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Icon name="Upload" size={48} className="text-muted-foreground mx-auto" />
                  <p className="font-medium text-foreground">Drop your risk register file here</p>
                  <p className="text-sm text-muted-foreground">
                    Or click to browse and select a file
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
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
                </div>
              )}
            </div>

            {previewData && (
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">File Preview</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">File Name:</span>
                    <span className="ml-2 text-foreground">{previewData.fileName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">File Size:</span>
                    <span className="ml-2 text-foreground">{previewData.fileSize}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Records:</span>
                    <span className="ml-2 text-foreground">{previewData.estimatedRecords}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Detected Columns:</span>
                    <span className="ml-2 text-foreground">{previewData.columns.length}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-muted-foreground text-sm">Columns:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {previewData.columns.map((col, index) => (
                      <span key={index} className="px-2 py-1 bg-background rounded text-xs">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upload Options */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Import Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="File Format"
                options={fileTypeOptions}
                value={uploadData.fileType}
                onChange={(value) => handleInputChange('fileType', value)}
              />
              
              <Select
                label="Merge Strategy"
                options={mergeStrategyOptions}
                value={uploadData.mergeStrategy}
                onChange={(value) => handleInputChange('mergeStrategy', value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="validate-data"
                  checked={uploadData.validateData}
                  onChange={(e) => handleInputChange('validateData', e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <label htmlFor="validate-data" className="text-sm text-foreground">
                  Validate data before import (recommended)
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="notify-owners"
                  checked={uploadData.notifyOwners}
                  onChange={(e) => handleInputChange('notifyOwners', e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <label htmlFor="notify-owners" className="text-sm text-foreground">
                  Notify risk owners of new assignments
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
                <p className="font-medium text-foreground mb-1">File Format Requirements</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• CSV files should include headers: Risk ID, Title, Description, Category, Likelihood, Impact, Owner</li>
                  <li>• Excel files should have data in the first worksheet</li>
                  <li>• JSON files should contain an array of risk objects</li>
                  <li>• Maximum file size: 10MB</li>
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
              Import Risk Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadRiskRegisterModal;
