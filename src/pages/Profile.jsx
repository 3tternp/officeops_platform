import React, { useState, useEffect, useRef } from 'react';
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
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Initialize profile data with proper null checks
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    jobTitle: ''
  });

  // Update profile data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        department: currentUser.department || '',
        phone: currentUser.phone || '',
        jobTitle: currentUser.jobTitle || ''
      });
      // Set profile picture preview if user has one
      if (currentUser.profilePicture) {
        setProfilePicturePreview(currentUser.profilePicture);
      }
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
  
  // All users can edit their own profile
  const canEdit = true;
  const isReadOnly = false;

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

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, or GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }
      
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    if (!canEdit) return;
    
    setIsSaving(true);
    try {
      // Update user data
      const updatedUser = {
        ...currentUser,
        ...profileData,
        profilePicture: profilePicturePreview // Store the base64 image data
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
      setProfilePicture(null); // Clear file after save
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
      department: currentUser?.department || '',
      phone: currentUser?.phone || '',
      jobTitle: currentUser?.jobTitle || ''
    });
    // Reset profile picture changes
    setProfilePicture(null);
    setProfilePicturePreview(currentUser?.profilePicture || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsEditing(false);
  };

  const handlePasswordChange = async (passwordData) => {
    console.log('Changing password for:', passwordData.userEmail);
    try {
      // In a real application, you would validate the current password and update it
      // For demo purposes, we'll just simulate the process
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user's password (in real app, this would be hashed)
      const users = dataService.getUsers();
      const updatedUsers = users.map(user => 
        user.id === currentUser.id 
          ? { ...user, password: passwordData.newPassword, lastPasswordChange: new Date().toISOString() }
          : user
      );
      dataService.saveUsers(updatedUsers);
      
      // Update context with last password change date
      updateUser({ 
        ...currentUser, 
        lastPasswordChange: new Date().toISOString() 
      });
      
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
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
                  Manage your personal information and preferences
                </p>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
                <Icon name="CheckCircle" size={16} className="text-green-600" />
                <span className="text-sm text-green-700 font-medium">Fully Editable</span>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="max-w-2xl">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  {/* Profile Picture */}
                  <div className="relative group">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                      {profilePicturePreview ? (
                        <img 
                          src={profilePicturePreview} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon name="User" size={40} color="white" />
                      )}
                    </div>
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-white hover:text-blue-200 transition-colors"
                        >
                          <Icon name="Camera" size={20} />
                        </button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Profile Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-foreground mb-1">{currentUser?.name}</h2>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {currentUser?.role}
                      </span>
                      <span className="text-muted-foreground">{currentUser?.email}</span>
                      {currentUser?.department && (
                        <span className="text-muted-foreground">• {currentUser.department}</span>
                      )}
                    </div>
                    {currentUser?.lastLogin && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last active: {new Date(currentUser.lastLogin).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {isEditing && profilePicturePreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveProfilePicture}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Icon name="Trash2" size={16} className="mr-1" />
                      Remove Photo
                    </Button>
                  )}
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
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={isEditing ? profileData.name : currentUser?.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    value={isEditing ? profileData.email : currentUser?.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    value={isEditing ? profileData.department : currentUser?.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={!isEditing}
                  />
                  
                  <Input
                    label="Job Title"
                    value={isEditing ? profileData.jobTitle : currentUser?.jobTitle || ''}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Software Engineer, Manager"
                  />
                </div>
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={isEditing ? profileData.phone : currentUser?.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+1 (555) 123-4567"
                />
                
                {/* Read-only system fields */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">System Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Role
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {currentUser?.role || 'employee'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Contact admin to change role</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Status
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 capitalize">{currentUser?.status || 'active'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Member Since
                      </label>
                      <span className="text-sm text-gray-700">
                        {currentUser?.createdDate ? new Date(currentUser.createdDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {isEditing && canEdit && (
                  <div className="flex justify-between items-center pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      <Icon name="Info" size={16} className="inline mr-1" />
                      Changes will be saved to your profile immediately
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="default"
                        onClick={handleSaveProfile}
                        loading={isSaving}
                      >
                        <Icon name="Save" size={16} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
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
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground flex items-center">
                      <Icon name="Shield" size={18} className="mr-2 text-green-600" />
                      Password Security
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser?.lastPasswordChange 
                        ? `Last changed ${new Date(currentUser.lastPasswordChange).toLocaleDateString()}`
                        : 'Password has not been changed recently'
                      }
                    </p>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => setPasswordChangeModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Icon name="Key" size={16} className="mr-2" />
                    Change Password
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground flex items-center">
                      <Icon name="Smartphone" size={18} className="mr-2 text-yellow-600" />
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" disabled className="opacity-60">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Enable 2FA (Coming Soon)
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground flex items-center">
                      <Icon name="Monitor" size={18} className="mr-2 text-blue-600" />
                      Login Activity
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Current session: {new Date().toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" disabled className="opacity-60">
                    <Icon name="Activity" size={16} className="mr-2" />
                    View History (Coming Soon)
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
