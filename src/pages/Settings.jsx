import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Breadcrumb from '../components/ui/Breadcrumb';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { useUser } from '../contexts/UserContext';
import CompanyBrandingSettings from '../components/admin/CompanyBrandingSettings';
import { useBranding } from '../contexts/BrandingContext';
import EmailService from '../services/EmailService';
import SecurityService from '../services/SecurityService';

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { branding, updateBranding } = useBranding();
  const [brandingModalOpen, setBrandingModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      companyName: 'OfficeOps Platform',
      timezone: 'UTC-5',
      language: 'english',
      dateFormat: 'MM/DD/YYYY'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReports: true,
      securityAlerts: true
    },
    security: {
      sessionTimeout: '30',
      passwordPolicy: 'strong',
      twoFactorRequired: !!SecurityService.getSettings().twoFactorRequired,
      auditLogging: true
    }
  });

  const [emailAllowedDomainsInput, setEmailAllowedDomainsInput] = useState(
    (EmailService.getSettings().allowedDomains || []).join(', ')
  );
  const [testEmailAddress, setTestEmailAddress] = useState('');

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async (category) => {
    console.log(`Saving ${category} settings:`, settings[category]);
    if (category === 'security') {
      SecurityService.setSettings(settings.security);
    }
    alert(`${category} settings saved successfully!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      } pt-16`}>
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Configure application preferences and system settings
            </p>
          </div>

          {/* Settings Tabs */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {[
                  { id: 'general', label: 'General', icon: 'Settings' },
                  { id: 'notifications', label: 'Notifications', icon: 'Bell' },
                  { id: 'security', label: 'Security', icon: 'Shield' },
                  { id: 'integrations', label: 'Integrations', icon: 'Zap' },
                  ...(currentUser?.role === 'admin' ? [
                    { id: 'branding', label: 'Branding', icon: 'Sparkles' }
                  ] : [])
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="max-w-2xl">
            {activeTab === 'general' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">General Settings</h3>
                <div className="space-y-4">
                  <Input
                    label="Company Name"
                    value={settings.general.companyName}
                    onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                  />
                  
                  <Select
                    label="Timezone"
                    options={[
                      { value: 'UTC-5', label: 'UTC-5 (Eastern Time)' },
                      { value: 'UTC-6', label: 'UTC-6 (Central Time)' },
                      { value: 'UTC-7', label: 'UTC-7 (Mountain Time)' },
                      { value: 'UTC-8', label: 'UTC-8 (Pacific Time)' }
                    ]}
                    value={settings.general.timezone}
                    onChange={(value) => handleSettingChange('general', 'timezone', value)}
                  />
                  
                  <Select
                    label="Language"
                    options={[
                      { value: 'english', label: 'English' },
                      { value: 'spanish', label: 'Spanish' },
                      { value: 'french', label: 'French' }
                    ]}
                    value={settings.general.language}
                    onChange={(value) => handleSettingChange('general', 'language', value)}
                  />
                  
                  <Select
                    label="Date Format"
                    options={[
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                    ]}
                    value={settings.general.dateFormat}
                    onChange={(value) => handleSettingChange('general', 'dateFormat', value)}
                  />
                  
                  <div className="pt-4">
                    <Button onClick={() => handleSaveSettings('general')}>Save General Settings</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
                    </div>
                    <Checkbox
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Checkbox
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Weekly Reports</p>
                      <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                    </div>
                    <Checkbox
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Security Alerts</p>
                      <p className="text-sm text-muted-foreground">Critical security notifications</p>
                    </div>
                    <Checkbox
                      checked={settings.notifications.securityAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'securityAlerts', e.target.checked)}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={() => handleSaveSettings('notifications')}>Save Notification Settings</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <Select
                    label="Session Timeout (minutes)"
                    options={[
                      { value: '15', label: '15 minutes' },
                      { value: '30', label: '30 minutes' },
                      { value: '60', label: '1 hour' },
                      { value: '120', label: '2 hours' }
                    ]}
                    value={settings.security.sessionTimeout}
                    onChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}
                  />
                  
                  <Select
                    label="Password Policy"
                    options={[
                      { value: 'basic', label: 'Basic (8+ characters)' },
                      { value: 'strong', label: 'Strong (8+ chars, mixed case, numbers)' },
                      { value: 'enterprise', label: 'Enterprise (12+ chars, all requirements)' }
                    ]}
                    value={settings.security.passwordPolicy}
                    onChange={(value) => handleSettingChange('security', 'passwordPolicy', value)}
                  />
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Require Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Enforce 2FA for all users</p>
                    </div>
                    <Checkbox
                      checked={settings.security.twoFactorRequired}
                      onChange={(e) => handleSettingChange('security', 'twoFactorRequired', e.target.checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Audit Logging</p>
                      <p className="text-sm text-muted-foreground">Log all user actions for security</p>
                    </div>
                    <Checkbox
                      checked={settings.security.auditLogging}
                      onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={() => handleSaveSettings('security')}>Save Security Settings</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Integrations</h3>
                <div className="space-y-6">
                  {/* Email SMTP Settings */}
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="text-md font-semibold text-foreground mb-2">Email SMTP</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure allowed email domains for user registration. SMTP credentials are read from environment variables on the server.
                    </p>

                    <div className="space-y-3">
                      <Input
                        label="Allowed Email Domains (comma-separated)"
                        value={emailAllowedDomainsInput}
                        onChange={(e) => setEmailAllowedDomainsInput(e.target.value)}
                        placeholder="example.com, company.org"
                      />
                      <div className="flex justify-end">
                        <Button onClick={() => {
                          const domains = emailAllowedDomainsInput
                            .split(',')
                            .map(d => d.trim())
                            .filter(Boolean);
                          EmailService.setSettings({ allowedDomains: domains });
                          alert('Email domain policy saved');
                        }}>Save Email Settings</Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="text-sm font-medium text-foreground mb-2">Send Test Email</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          label="Recipient"
                          type="email"
                          value={testEmailAddress}
                          onChange={(e) => setTestEmailAddress(e.target.value)}
                          placeholder="admin@example.com"
                        />
                        <div className="flex items-end">
                          <Button onClick={async () => {
                            if (!testEmailAddress) {
                              alert('Enter a recipient email');
                              return;
                            }
                            try {
                              const res = await EmailService.sendTest(testEmailAddress);
                              alert(`Test email sent: ${res.messageId || 'OK'}`);
                            } catch (err) {
                              alert(`Failed to send test: ${err.message}`);
                            }
                          }}>Send Test</Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        SMTP env vars required: SMTP_HOST, SMTP_PORT, SMTP_SECURE (true|false), SMTP_USER, SMTP_PASS, SMTP_FROM. Optional: ALLOWED_EMAIL_DOMAIN(S).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'branding' && currentUser?.role === 'admin' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Company Branding</h3>
                <p className="text-sm text-muted-foreground mb-6">Customize application name, logo, favicon, and banner.</p>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {branding?.companyLogo ? (
                      <img src={branding.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="Building2" size={20} className="text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{branding?.companyName || 'OfficeOps'}</p>
                    <p className="text-xs text-muted-foreground">Favicon and banner applied globally</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button onClick={() => setBrandingModalOpen(true)}>
                    <Icon name="Settings" size={16} className="mr-2" />
                    Edit Branding
                  </Button>
                  <Button variant="outline" onClick={() => updateBranding({ companyName: 'OfficeOps', companyLogo: '', companyFavicon: '', loginBackgroundImage: '' })}>
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {brandingModalOpen && (
        <CompanyBrandingSettings
          isOpen={brandingModalOpen}
          onClose={() => setBrandingModalOpen(false)}
          onUpdate={(updated) => updateBranding(updated)}
        />
      )}
    </div>
  );
};

export default Settings;
