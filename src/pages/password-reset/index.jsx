import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import dataService from '../../services/DataService';
import { ensureDemoUser } from '../../utils/demoUser';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPasswordResetRequests, setUserPasswordResetRequests] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    applicationName: '',
    applicationCategory: '',
    businessJustification: '',
    priority: 'normal',
    accessType: '',
    additionalNotes: ''
  });

  useEffect(() => {
    // Ensure demo user is properly set up
    const user = ensureDemoUser();
    setCurrentUser(user);
    loadUserPasswordResetRequests(user);
  }, []);

  const loadUserPasswordResetRequests = (user) => {
    if (user) {
      const requests = dataService.getUserPasswordResetRequests(user.id);
      setUserPasswordResetRequests(requests);
    }
  };

  // Application categories and common applications
  const applicationCategories = [
    { value: 'business', label: 'Business Applications' },
    { value: 'development', label: 'Development Tools' },
    { value: 'communication', label: 'Communication & Collaboration' },
    { value: 'security', label: 'Security Tools' },
    { value: 'database', label: 'Database Systems' },
    { value: 'infrastructure', label: 'Infrastructure & Network' },
    { value: 'other', label: 'Other Applications' }
  ];

  const commonApplications = {
    business: [
      'SAP ERP', 'Salesforce', 'Microsoft Dynamics', 'Oracle Applications', 
      'QuickBooks', 'Workday', 'ServiceNow', 'Jira'
    ],
    development: [
      'GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps', 'Jenkins', 
      'Docker Hub', 'AWS Console', 'Google Cloud Console'
    ],
    communication: [
      'Microsoft 365', 'Google Workspace', 'Slack', 'Microsoft Teams', 
      'Zoom', 'WebEx', 'Skype for Business', 'Discord'
    ],
    security: [
      'Active Directory', 'Okta', 'Auth0', 'CyberArk', 'Splunk', 
      'LastPass', '1Password', 'RSA SecurID'
    ],
    database: [
      'MySQL', 'PostgreSQL', 'SQL Server', 'Oracle Database', 
      'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra'
    ],
    infrastructure: [
      'VMware vSphere', 'Hyper-V', 'Cisco ASA', 'Fortinet FortiGate', 
      'Palo Alto Networks', 'Windows Server', 'Linux Servers', 'Network Switches'
    ]
  };

  const priorityOptions = [
    { value: 'low', label: 'Low - Can wait 3-5 business days' },
    { value: 'normal', label: 'Normal - Need within 1-2 business days' },
    { value: 'high', label: 'High - Need within 24 hours' },
    { value: 'urgent', label: 'Urgent - Critical business impact' }
  ];

  const accessTypeOptions = [
    { value: 'user_account', label: 'User Account Password Reset' },
    { value: 'admin_account', label: 'Administrator Account Password Reset' },
    { value: 'service_account', label: 'Service Account Password Reset' },
    { value: 'api_key', label: 'API Key Reset' },
    { value: 'certificate', label: 'Certificate Renewal' },
    { value: 'other', label: 'Other Access Type' }
  ];

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileSidebarClose = () => {
    setSidebarMobileOpen(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (!formData.applicationName || !formData.businessJustification || !formData.accessType) {
        throw new Error('Please fill in all required fields');
      }

      const newRequest = dataService.createPasswordResetRequest(formData, currentUser);
      
      // Reset form
      setFormData({
        applicationName: '',
        applicationCategory: '',
        businessJustification: '',
        priority: 'normal',
        accessType: '',
        additionalNotes: ''
      });

      // Reload user requests
      loadUserPasswordResetRequests(currentUser);

      alert('Password reset request submitted successfully! IT support will process your request shortly.');
    } catch (error) {
      console.error('Error submitting password reset request:', error);
      alert(`Failed to submit request: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-error';
      case 'high': return 'bg-warning';
      case 'normal': return 'bg-primary';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
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
        isMobileOpen={sidebarMobileOpen}
        onMobileClose={handleMobileSidebarClose}
      />
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">System Password Reset</h1>
                  <p className="text-muted-foreground">
                    Request password resets for organizational applications and systems (not for OfficeOps platform login)
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Back
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Password Reset Request Form */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <Icon name="Key" size={20} className="mr-2" />
                  New System Password Reset Request
                </h2>
                
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Info" size={16} className="text-blue-600" />
                    <span className="font-medium text-sm text-blue-700">Important Notice</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    This form is for requesting password resets for <strong>organizational applications and systems</strong> (like SAP, Salesforce, etc.).
                    If you need to reset your <strong>OfficeOps platform password</strong>, please use the "Forgot Password" link on the login page.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Application Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Salesforce, SAP, Microsoft 365"
                        value={formData.applicationName}
                        onChange={(e) => handleInputChange('applicationName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Application Category
                      </label>
                      <Select
                        options={applicationCategories}
                        value={formData.applicationCategory}
                        onChange={(value) => handleInputChange('applicationCategory', value)}
                        placeholder="Select category"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Access Type *
                      </label>
                      <Select
                        options={accessTypeOptions}
                        value={formData.accessType}
                        onChange={(value) => handleInputChange('accessType', value)}
                        placeholder="Select access type"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Priority Level
                      </label>
                      <Select
                        options={priorityOptions}
                        value={formData.priority}
                        onChange={(value) => handleInputChange('priority', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Business Justification *
                    </label>
                    <TextArea
                      placeholder="Explain why you need this password reset and how it impacts your work..."
                      value={formData.businessJustification}
                      onChange={(e) => handleInputChange('businessJustification', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Additional Notes
                    </label>
                    <TextArea
                      placeholder="Any additional information that might help IT support process your request..."
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    ) : (
                      <Icon name="Send" size={16} className="mr-2" />
                    )}
                    Submit Password Reset Request
                  </Button>
                </form>
              </div>

              {/* My Password Reset Requests */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <Icon name="Clock" size={20} className="mr-2" />
                  My Password Reset Requests ({userPasswordResetRequests.length})
                </h2>

                <div className="space-y-4">
                  {userPasswordResetRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="Key" size={48} className="text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">No password reset requests found</p>
                    </div>
                  ) : (
                    userPasswordResetRequests.map((request) => (
                      <div key={request.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-foreground">{request.applicationName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {request.accessType?.replace('_', ' ')?.toUpperCase()} • Requested {new Date(request.requestDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(request.priority)}`} />
                            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(request.status)}`}>
                              {request.status?.charAt(0)?.toUpperCase() + request.status?.slice(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{request.businessJustification}</p>
                        {request.adminComments && (
                          <div className="bg-muted/30 rounded p-3">
                            <p className="text-xs text-muted-foreground mb-1">Admin Comments:</p>
                            <p className="text-sm text-foreground">{request.adminComments}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Common Applications Help */}
            {formData.applicationCategory && commonApplications[formData.applicationCategory] && (
              <div className="mt-8 bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Info" size={20} className="mr-2" />
                  Common {applicationCategories.find(cat => cat.value === formData.applicationCategory)?.label}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {commonApplications[formData.applicationCategory].map((app, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleInputChange('applicationName', app)}
                      className="text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded transition-colors"
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Information Panel */}
            <div className="mt-8 bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="AlertCircle" size={20} className="mr-2" />
                Important Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Processing Times</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Low Priority: 3-5 business days</li>
                    <li>• Normal Priority: 1-2 business days</li>
                    <li>• High Priority: Within 24 hours</li>
                    <li>• Urgent Priority: Within 4 hours</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Provide clear business justification</li>
                    <li>• Manager approval may be required</li>
                    <li>• Identity verification will be performed</li>
                    <li>• New credentials will be sent securely</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PasswordReset;
