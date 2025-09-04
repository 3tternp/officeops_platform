import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { extractSCORMInfo, SCORM_VERSIONS } from '../../../utils/scormGenerator';

const SCORMPackageManager = ({ onClose, onDeploy }) => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadSCORMPackages();
  }, []);

  const loadSCORMPackages = () => {
    // Load SCORM packages from localStorage
    const savedPackages = localStorage.getItem('scormPackages');
    if (savedPackages) {
      setPackages(JSON.parse(savedPackages));
    }
  };

  const saveSCORMPackages = (packagesData) => {
    localStorage.setItem('scormPackages', JSON.stringify(packagesData));
    setPackages(packagesData);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Extract SCORM package info
      const scormInfo = await extractSCORMInfo(file);
      
      if (!scormInfo.success) {
        alert('Invalid SCORM package: ' + scormInfo.error);
        setIsUploading(false);
        return;
      }

      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const packageData = {
          id: `scorm_${Date.now()}`,
          filename: file.name,
          title: scormInfo.info.title,
          version: scormInfo.info.version,
          metadata: scormInfo.info.metadata,
          fileCount: scormInfo.info.files,
          size: scormInfo.info.size,
          uploadDate: new Date().toISOString(),
          data: e.target.result.split(',')[1], // Remove data:application/zip;base64, prefix
          status: 'active'
        };

        const updatedPackages = [...packages, packageData];
        saveSCORMPackages(updatedPackages);
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading SCORM package:', error);
      alert('Error uploading SCORM package: ' + error.message);
      setIsUploading(false);
    }
  };

  const deletePackage = (packageId) => {
    if (confirm('Are you sure you want to delete this SCORM package?')) {
      const updatedPackages = packages.filter(pkg => pkg.id !== packageId);
      saveSCORMPackages(updatedPackages);
    }
  };

  const downloadPackage = (pkg) => {
    try {
      // Convert base64 back to blob
      const binaryString = atob(pkg.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/zip' });
      
      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pkg.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading package:', error);
      alert('Error downloading package');
    }
  };

  const previewPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowPreview(true);
  };

  const deployToLMS = (pkg) => {
    if (onDeploy) {
      onDeploy(pkg);
    } else {
      alert('LMS deployment would be configured here. Package: ' + pkg.title);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVersionBadgeColor = (version) => {
    if (version.includes('1.2')) return 'bg-blue-100 text-blue-800';
    if (version.includes('2004')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-enterprise-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">SCORM Package Manager</h2>
            <p className="text-sm text-muted-foreground">
              Manage, deploy, and organize your SCORM packages
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                iconName="Search"
                className="w-64"
              />
              <span className="text-sm text-muted-foreground">
                {filteredPackages.length} packages
              </span>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                onClick={() => document.getElementById('scorm-upload').click()}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload SCORM'}
              </Button>
              <input
                id="scorm-upload"
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Package" size={64} className="text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No SCORM Packages</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'No packages match your search criteria' : 'Upload your first SCORM package to get started'}
              </p>
              <Button
                variant="default"
                onClick={() => document.getElementById('scorm-upload').click()}
                iconName="Upload"
                iconPosition="left"
              >
                Upload SCORM Package
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-muted rounded-lg p-4 border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">{pkg.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getVersionBadgeColor(pkg.version)}`}>
                          {pkg.version.includes('1.2') ? 'SCORM 1.2' : 'SCORM 2004'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          pkg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pkg.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{pkg.filename}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <p className="font-medium text-foreground">{formatFileSize(pkg.size)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Files:</span>
                          <p className="font-medium text-foreground">{pkg.fileCount}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Uploaded:</span>
                          <p className="font-medium text-foreground">
                            {new Date(pkg.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Template:</span>
                          <p className="font-medium text-foreground">
                            {pkg.metadata?.course?.template || 'Standard'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => previewPackage(pkg)}
                        iconName="Eye"
                        title="Preview Package"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadPackage(pkg)}
                        iconName="Download"
                        title="Download Package"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deployToLMS(pkg)}
                        iconName="Upload"
                        title="Deploy to LMS"
                        className="text-primary hover:text-primary"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePackage(pkg.id)}
                        iconName="Trash2"
                        title="Delete Package"
                        className="text-error hover:text-error"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Package Preview Modal */}
        {showPreview && selectedPackage && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg shadow-enterprise-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Package Preview</h3>
                  <p className="text-sm text-muted-foreground">{selectedPackage.title}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
                <div className="space-y-6">
                  {/* Package Info */}
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-3">Package Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Title:</span>
                        <p className="font-medium text-foreground">{selectedPackage.title}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Version:</span>
                        <p className="font-medium text-foreground">{selectedPackage.version}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <p className="font-medium text-foreground">{formatFileSize(selectedPackage.size)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Files:</span>
                        <p className="font-medium text-foreground">{selectedPackage.fileCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  {selectedPackage.metadata && (
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-3">Course Metadata</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Course ID:</span>
                          <span className="text-foreground font-mono">{selectedPackage.metadata.course.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Description:</span>
                          <span className="text-foreground">{selectedPackage.metadata.course.description}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span className="text-foreground">
                            {new Date(selectedPackage.metadata.course.created).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Template:</span>
                          <span className="text-foreground">{selectedPackage.metadata.course.template}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button
                      variant="default"
                      onClick={() => downloadPackage(selectedPackage)}
                      iconName="Download"
                      iconPosition="left"
                      className="flex-1"
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => deployToLMS(selectedPackage)}
                      iconName="Upload"
                      iconPosition="left"
                      className="flex-1"
                    >
                      Deploy to LMS
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SCORMPackageManager;
