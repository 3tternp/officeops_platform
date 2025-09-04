import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useUser } from '../../contexts/UserContext';
import dataService from '../../services/DataService';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    avatar: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        department: currentUser.department || '',
        role: currentUser.role || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileSidebarClose = () => {
    setSidebarMobileOpen(false);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user profile
      const updatedUser = {
        ...currentUser,
        ...profileData,
        updatedDate: new Date().toISOString()
      };

      // Update in DataService
      dataService.updateUser(currentUser.id, updatedUser);
      
      // Update in context
      updateUser(updatedUser);

      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!passwordData.currentPassword) {
        showMessage('error', 'Current password is required.');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        showMessage('error', 'New password must be at least 6 characters long.');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        showMessage('error', 'New passwords do not match.');
        return;
      }

      // In a real app, you'd verify the current password
      // For demo purposes, we'll skip this verification
      
      // Update password in DataService
      const updatedUser = {
        ...currentUser,
        password: passwordData.newPassword,
        passwordUpdatedDate: new Date().toISOString()
      };

      dataService.updateUser(currentUser.id, updatedUser);
      
      // Clear password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      showMessage('success', 'Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      showMessage('error', 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showMessage('error', 'File size must be less than 5MB.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showMessage('error', 'Please select a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const avatar = event.target.result;
        setProfileData(prev => ({ ...prev, avatar }));
        
        // Auto-save avatar
        const updatedUser = {
          ...currentUser,
          avatar,
          updatedDate: new Date().toISOString()
        };

        dataService.updateUser(currentUser.id, updatedUser);
        updateUser(updatedUser);
        
        showMessage('success', 'Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setProfileData(prev => ({ ...prev, avatar: '' }));
    
    const updatedUser = {
      ...currentUser,
      avatar: '',
      updatedDate: new Date().toISOString()
    };

    dataService.updateUser(currentUser.id, updatedUser);
    updateUser(updatedUser);
    
    showMessage('success', 'Profile picture removed successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General Information', icon: 'User' },
    { id: 'security', label: 'Password & Security', icon: 'Lock' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                      {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload a new avatar. For best results, use an image that's at least 200x200px.
                  </p>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      Upload Photo
                    </Button>
                    {profileData.avatar && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveAvatar}
                      >
                        <Icon name="X" size={16} className="mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* General Information Form */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Department
                    </label>
                    <Input
                      type="text"
                      value={profileData.department}
                      placeholder="Department"
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact your administrator to change departments
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Role
                    </label>
                    <Input
                      type="text"
                      value={profileData.role}
                      placeholder="Role"
                      disabled
                      className="bg-muted capitalize"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact your administrator to change roles
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button type="submit" loading={loading}>
                    <Icon name="Save" size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter your current password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter your new password"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button type="submit" loading={loading}>
                    <Icon name="Lock" size={16} className="mr-2" />
                    Change Password
                  </Button>
                </div>
              </form>
            </div>

            {/* Security Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Security Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Shield" size={20} className="text-green-600" />
                    <div>
                      <p className="font-medium text-foreground">Account Security</p>
                      <p className="text-sm text-muted-foreground">Your account is secure</p>
                    </div>
                  </div>
                  <div className="text-green-600">
                    <Icon name="Check" size={20} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Key" size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-foreground">Password Reset via Access Management</p>
                      <p className="text-sm text-muted-foreground">
                        Use the Password Reset feature in Access Management for application passwords
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/access-management')}
                  >
                    Go to Access Management
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Application Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Theme</p>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <select className="px-3 py-2 border border-input rounded-lg bg-background text-foreground">
                    <option value="system">System Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Language</p>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                  <select className="px-3 py-2 border border-input rounded-lg bg-background text-foreground">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications about important updates</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
          <div className="max-w-4xl mx-auto">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon name="User" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
                  <p className="text-muted-foreground">
                    Manage your account settings and preferences
                  </p>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
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

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-border">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
