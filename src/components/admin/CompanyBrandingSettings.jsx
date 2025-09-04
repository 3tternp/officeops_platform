import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';
import dataService from '../../services/DataService';

const CompanyBrandingSettings = ({ isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const [brandingData, setBrandingData] = useState({
    companyName: '',
    companyLogo: '',
    companyFavicon: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#6366f1',
    loginBackgroundImage: '',
    footerText: '',
    supportEmail: '',
    supportPhone: '',
    website: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadBrandingSettings();
    }
  }, [isOpen]);

  const loadBrandingSettings = () => {
    const settings = dataService.getCompanyBranding();
    if (settings) {
      setBrandingData(settings);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleImageUpload = (file, field) => {
    return new Promise((resolve, reject) => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size must be less than 5MB.'));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file.'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const logoData = await handleImageUpload(file, 'logo');
        setBrandingData(prev => ({ ...prev, companyLogo: logoData }));
        showMessage('success', 'Logo uploaded successfully!');
      } catch (error) {
        showMessage('error', error.message);
      }
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const faviconData = await handleImageUpload(file, 'favicon');
        setBrandingData(prev => ({ ...prev, companyFavicon: faviconData }));
        showMessage('success', 'Favicon uploaded successfully!');
      } catch (error) {
        showMessage('error', error.message);
      }
    }
  };

  const handleBackgroundUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const backgroundData = await handleImageUpload(file, 'background');
        setBrandingData(prev => ({ ...prev, loginBackgroundImage: backgroundData }));
        showMessage('success', 'Background image uploaded successfully!');
      } catch (error) {
        showMessage('error', error.message);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save branding settings
      dataService.saveCompanyBranding(brandingData);
      
      // Update document title if company name is provided
      if (brandingData.companyName) {
        document.title = `${brandingData.companyName} - Business Operations Platform`;
      }

      // Update favicon if provided
      if (brandingData.companyFavicon) {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = brandingData.companyFavicon;
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      showMessage('success', 'Company branding updated successfully!');
      
      // Notify parent component
      if (onUpdate) {
        onUpdate(brandingData);
      }

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error saving branding settings:', error);
      showMessage('error', 'Failed to save branding settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBrandingData({
      companyName: '',
      companyLogo: '',
      companyFavicon: '',
      primaryColor: '#3b82f6',
      secondaryColor: '#6366f1',
      loginBackgroundImage: '',
      footerText: '',
      supportEmail: '',
      supportPhone: '',
      website: ''
    });
    showMessage('success', 'Settings reset to defaults!');
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
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Company Branding Settings</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Customize your company's branding and appearance
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                  size={16} 
                />
                <span>{message.text}</span>
              </div>
            </div>
          )}

          {/* Company Information */}
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name
                </label>
                <Input
                  type="text"
                  value={brandingData.companyName}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter your company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website URL
                </label>
                <Input
                  type="url"
                  value={brandingData.website}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://www.yourcompany.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Support Email
                </label>
                <Input
                  type="email"
                  value={brandingData.supportEmail}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, supportEmail: e.target.value }))}
                  placeholder="support@yourcompany.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Support Phone
                </label>
                <Input
                  type="tel"
                  value={brandingData.supportPhone}
                  onChange={(e) => setBrandingData(prev => ({ ...prev, supportPhone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Visual Branding */}
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Visual Branding</h3>
            
            {/* Company Logo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Logo
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {brandingData.companyLogo ? (
                    <img
                      src={brandingData.companyLogo}
                      alt="Company Logo"
                      className="w-24 h-24 object-contain border border-border rounded-lg bg-background p-2"
                    />
                  ) : (
                    <div className="w-24 h-24 border border-dashed border-border rounded-lg flex items-center justify-center bg-background">
                      <Icon name="Image" size={32} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload your company logo. Recommended size: 200x200px (PNG or SVG preferred)
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      Upload Logo
                    </Button>
                    {brandingData.companyLogo && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setBrandingData(prev => ({ ...prev, companyLogo: '' }))}
                      >
                        <Icon name="X" size={16} className="mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Favicon
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {brandingData.companyFavicon ? (
                    <img
                      src={brandingData.companyFavicon}
                      alt="Favicon"
                      className="w-12 h-12 object-contain border border-border rounded bg-background p-1"
                    />
                  ) : (
                    <div className="w-12 h-12 border border-dashed border-border rounded flex items-center justify-center bg-background">
                      <Icon name="Image" size={16} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload a favicon for your browser tab. Recommended size: 32x32px
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => faviconInputRef.current?.click()}
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      Upload Favicon
                    </Button>
                    {brandingData.companyFavicon && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setBrandingData(prev => ({ ...prev, companyFavicon: '' }))}
                      >
                        <Icon name="X" size={16} className="mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={faviconInputRef}
                    onChange={handleFaviconUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 border border-border rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={brandingData.secondaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-10 border border-border rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={brandingData.secondaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    placeholder="#6366f1"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Customization */}
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Footer Customization</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Footer Text
              </label>
              <Input
                type="text"
                value={brandingData.footerText}
                onChange={(e) => setBrandingData(prev => ({ ...prev, footerText: e.target.value }))}
                placeholder="© 2025 Your Company Name. All rights reserved."
              />
              <p className="text-xs text-muted-foreground mt-1">
                This text will appear in the footer of all pages
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Reset to Defaults
            </Button>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button type="submit" loading={loading}>
                <Icon name="Save" size={16} className="mr-2" />
                Save Branding Settings
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyBrandingSettings;
