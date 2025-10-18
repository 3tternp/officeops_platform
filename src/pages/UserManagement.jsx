import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Breadcrumb from '../components/ui/Breadcrumb';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import dataService from '../services/DataService';

const UserManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('users');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal states
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Load data from DataService on mount
  useEffect(() => {
    const loadData = () => {
      const storedUsers = dataService.getUsers();
      const storedRoles = dataService.getRoles();
      const storedDepartments = dataService.getDepartments();
      
      setUsers(storedUsers);
      setRoles(storedRoles);
      setDepartments(storedDepartments);
    };
    loadData();
  }, []);

  // Handle URL parameters to auto-open add user modal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'add-user') {
      setAddUserModalOpen(true);
      // Clear the URL parameter to avoid reopening modal on page refresh
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' },
    { value: 'auditor', label: 'Auditor' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // Filter users based on current filters
  const filteredUsers = users.filter(user => {
    const searchMatch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const roleMatch = filterRole === 'all' || user.role === filterRole;
    const statusMatch = filterStatus === 'all' || user.status === filterStatus;
    
    return searchMatch && roleMatch && statusMatch;
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setAddUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // Delete from DataService
      dataService.deleteUser(userId);
      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    }
  };

  const handleSubmitUser = (userData, isEdit = false) => {
    if (isEdit) {
      // Update in DataService
      const updatedUser = dataService.updateUser(userData.id, userData);
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userData.id ? updatedUser : user
      ));
      alert('User updated successfully!');
    } else {
      // Add to DataService
      const newUser = dataService.addUser(userData);
      // Update local state
      setUsers(prev => [...prev, newUser]);
      alert(`User added successfully! You can now login with email: ${newUser.email}`);
    }
    setAddUserModalOpen(false);
    setEditUserModalOpen(false);
  };

  // Get role information with approval limits
  const getRoleInfo = (roleId) => {
    return roles.find(role => role.id === roleId);
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-error text-error-foreground';
      case 'manager': return 'bg-warning text-warning-foreground';
      case 'employee': return 'bg-success text-success-foreground';
      case 'auditor': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-warning text-warning-foreground';
      case 'suspended': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
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
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={() => alert('Export functionality will be implemented')}
              >
                <Icon name="Download" size={16} className="mr-2" />
                Export Users
              </Button>
              
              <Button
                variant="default"
                onClick={handleAddUser}
              >
                <Icon name="UserPlus" size={16} className="mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} color="white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} color="white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{users.filter(u => u.status === 'active').length}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} color="white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{users.filter(u => u.status === 'inactive').length}</p>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-error rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={20} color="white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{users.filter(u => u.role === 'admin').length}</p>
                  <p className="text-sm text-muted-foreground">Admins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="search"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select
                options={roleOptions}
                value={filterRole}
                onChange={setFilterRole}
                placeholder="Filter by role"
              />
              <Select
                options={statusOptions}
                value={filterStatus}
                onChange={setFilterStatus}
                placeholder="Filter by status"
              />
              <Button variant="outline" className="w-full">
                <Icon name="Filter" size={16} className="mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground">Users ({filteredUsers.length})</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-foreground">User</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-foreground">Role</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-foreground">Department</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-foreground">Asset Approval Limit</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-foreground">Last Login</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const userRole = getRoleInfo(user.role);
                    return (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <Icon name="User" size={16} color="white" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                            <div className="text-xs text-muted-foreground">
                              Level {userRole?.level || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-foreground">{user.department}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-foreground">
                            {userRole?.assetApprovalLimit === null ? 'Unlimited' : 
                             userRole?.assetApprovalLimit === 0 ? 'No Approval' : 
                             `₹${userRole?.assetApprovalLimit?.toLocaleString()}`}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-muted-foreground">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              title="Edit user"
                            >
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => alert(`Permissions: ${userRole?.permissions?.join(', ') || 'None'}`)}
                              title="View permissions"
                            >
                              <Icon name="Eye" size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-error hover:text-error"
                              title="Delete user"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Users Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterRole !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your filters to see more results.' 
                    : 'No users have been added yet.'}
                </p>
                <Button variant="outline" onClick={handleAddUser}>
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Add First User
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {addUserModalOpen && (
        <UserModal
          isOpen={addUserModalOpen}
          onClose={() => setAddUserModalOpen(false)}
          onSubmit={handleSubmitUser}
          user={null}
          isEdit={false}
        />
      )}

      {/* Edit User Modal */}
      {editUserModalOpen && (
        <UserModal
          isOpen={editUserModalOpen}
          onClose={() => setEditUserModalOpen(false)}
          onSubmit={(userData) => handleSubmitUser(userData, true)}
          user={selectedUser}
          isEdit={true}
        />
      )}
    </div>
  );
};

// User Modal Component
const UserModal = ({ isOpen, onClose, onSubmit, user, isEdit }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'employee',
    department: user?.department || '',
    status: user?.status || 'active',
    password: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const storedRoles = dataService.getRoles();
      const storedDepartments = dataService.getDepartments();
      setRoles(storedRoles);
      setDepartments(storedDepartments);
    };
    loadData();
  }, []);

  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.name
  }));

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const departmentOptions = departments.map(dept => ({
    value: dept.name,
    label: dept.name
  }));

  const selectedRole = roles.find(role => role.id === formData.role);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!isEdit && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      setIsSubmitting(false);
      return;
    }

    try {
      const userData = {
        ...formData,
        id: user?.id,
        createdDate: user?.createdDate,
        lastLogin: user?.lastLogin
      };
      
      await onSubmit(userData);
      onClose();
    } catch (error) {
      console.error('Error submitting user:', error);
      alert('Error submitting user. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">
              {isEdit ? 'Edit User' : 'Add New User'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isEdit ? 'Update user information and permissions' : 'Create a new user account'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter full name"
            />
            
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="user@company.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Role"
              required
              options={roleOptions}
              value={formData.role}
              onChange={(value) => handleInputChange('role', value)}
            />
            
            <Select
              label="Department"
              required
              options={departmentOptions}
              value={formData.department}
              onChange={(value) => handleInputChange('department', value)}
            />
          </div>

          <Select
            label="Status"
            required
            options={statusOptions}
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
          />

          {/* Role Information */}
          {selectedRole && (
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Role Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Asset Approval Limit:</p>
                  <p className="font-medium text-foreground">
                    {selectedRole.assetApprovalLimit === null ? 'Unlimited' : 
                     selectedRole.assetApprovalLimit === 0 ? 'No Approval Rights' : 
                     `₹${selectedRole.assetApprovalLimit.toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Authority Level:</p>
                  <p className="font-medium text-foreground">Level {selectedRole.level}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-muted-foreground">Description:</p>
                <p className="text-sm text-foreground">{selectedRole.description}</p>
              </div>
              <div className="mt-3">
                <p className="text-muted-foreground mb-2">Key Permissions:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.permissions.slice(0, 5).map((permission, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {permission.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {selectedRole.permissions.length > 5 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                      +{selectedRole.permissions.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
              />
              
              <Input
                label="Confirm Password"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm password"
              />
            </div>
          )}

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
            >
              {isEdit ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
