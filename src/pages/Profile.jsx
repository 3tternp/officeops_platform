import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Breadcrumb from '../components/ui/Breadcrumb';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PasswordChangeModal from '../components/PasswordChangeModal';
import { useUser } from '../contexts/UserContext';
import dataService from '../services/DataService';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [passwordChangeModalOpen, setPasswordChangeModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize profile data with proper null checks
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: ''
  });

  // Update profile data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        department: currentUser.department || ''
      });
    }
  }, [currentUser]);
  
  // Redirect to login if no user after a delay (to prevent immediate redirect)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentUser) {
        console.log('No current user found, redirecting to login');
        navigate('/login');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);
  
  // Check if user has edit permissions (not employee role)
  const canEdit = currentUser?.role !== 'employee';
  const isReadOnly = currentUser?.role === 'employee';

  // Show loading state if no user data
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!canEdit) return;
    
    setIsSaving(true);
    try {
      // Update user data
      const updatedUser = {
        ...currentUser,
        ...profileData
      };
      
      // Update in DataService
      const users = dataService.getUsers();
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? updatedUser : user
      );
      dataService.saveUsers(updatedUsers);
      
      // Update context
      updateUser(updatedUser);
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      department: currentUser?.department || ''
    });
    setIsEditing(false);
  };

  const handlePasswordChange = async (passwordData) => {
    console.log('Changing password for:', passwordData.userEmail);
    // Here you would typically call your API
    // For now, we'll just simulate success
    return new Promise(resolve => setTimeout(resolve, 1000));
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
      <main className={`transition-all duration-300 ease-in-out pt-16 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
                <p className="text-muted-foreground">
                  {isReadOnly ? 'View your personal information' : 'Manage your personal information and preferences'}
                </p>
              </div>
              {isReadOnly && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-lg">
                  <Icon name="Lock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Read Only Access</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Card */}
          <div className="max-w-2xl">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={32} color="white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{currentUser?.name}</h2>
                    <p className="text-muted-foreground capitalize">{currentUser?.role}</p>
                    <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                  </div>
                </div>
                {canEdit && !isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Icon name="Edit" size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={isEditing ? profileData.name : currentUser?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing || isReadOnly}
                  className={isReadOnly ? 'bg-muted' : ''}
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  value={isEditing ? profileData.email : currentUser?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing || isReadOnly}
                  className={isReadOnly ? 'bg-muted' : ''}
                />
                
                <Input
                  label="Department"
                  value={isEditing ? profileData.department : currentUser?.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  disabled={!isEditing || isReadOnly}
                  className={isReadOnly ? 'bg-muted' : ''}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={currentUser?.role || ''}
                      disabled
                      className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground capitalize"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Contact admin to change role</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Status
                    </label>
                    <input
                      type="text"
                      value={currentUser?.status || 'active'}
                      disabled
                      className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground capitalize"
                    />
                  </div>
                </div>
                
                {isEditing && canEdit && (
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      variant="default"
                      onClick={handleSaveProfile}
                      loading={isSaving}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="mt-6 max-w-2xl">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Shield" size={20} />
                <span>Security Settings</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPasswordChangeModalOpen(true)}
                    disabled={isReadOnly}
                  >
                    <Icon name="Lock" size={16} className="mr-2" />
                    {isReadOnly ? 'Password Protected' : 'Change Password'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" disabled>
                    <Icon name="Smartphone" size={16} className="mr-2" />
                    Enable 2FA
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Active Sessions</p>
                    <p className="text-sm text-muted-foreground">Manage your login sessions</p>
                  </div>
                  <Button variant="outline" disabled>
                    <Icon name="Monitor" size={16} className="mr-2" />
                    View Sessions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Password Change Modal */}
      {currentUser && (
        <PasswordChangeModal
          isOpen={passwordChangeModalOpen}
          onClose={() => setPasswordChangeModalOpen(false)}
          onSubmit={handlePasswordChange}
          userEmail={currentUser.email}
        />
      )}
    </div>
  );
};

export default Profile;
