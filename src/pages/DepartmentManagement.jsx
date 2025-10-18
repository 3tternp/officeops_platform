import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Breadcrumb from '../components/ui/Breadcrumb';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useUser } from '../contexts/UserContext';
import dataService from '../services/DataService';

const DepartmentManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false);
  const [editDepartmentModalOpen, setEditDepartmentModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    // Check if user is admin
    if (currentUser?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    // Load departments
    setDepartments(dataService.getDepartments());
  }, [currentUser, navigate]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setAddDepartmentModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setEditDepartmentModalOpen(true);
  };

  const handleDeleteDepartment = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    if (window.confirm(`Are you sure you want to delete "${department.name}"? This action cannot be undone.`)) {
      dataService.deleteDepartment(departmentId);
      setDepartments(dataService.getDepartments());
      alert('Department deleted successfully!');
    }
  };

  const handleSubmitDepartment = (departmentData, isEdit = false) => {
    if (isEdit) {
      dataService.updateDepartment(departmentData.id, departmentData);
      alert('Department updated successfully!');
    } else {
      dataService.addDepartment(departmentData);
      alert('Department added successfully!');
    }
    
    setDepartments(dataService.getDepartments());
    setAddDepartmentModalOpen(false);
    setEditDepartmentModalOpen(false);
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
              <h1 className="text-3xl font-bold text-foreground">Department Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage organizational departments and structure
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={() => alert('Export functionality will be implemented')}
              >
                <Icon name="Download" size={16} className="mr-2" />
                Export Departments
              </Button>
              
              <Button
                variant="default"
                onClick={handleAddDepartment}
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Add Department
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Building2" size={20} color="white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{departments.length}</p>
                  <p className="text-sm text-muted-foreground">Total Departments</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} color="white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {departments.filter(d => d.status === 'active').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} color="white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {departments.reduce((sum, d) => sum + d.employeeCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="UserCheck" size={20} color="white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {departments.filter(d => d.head).length}
                  </p>
                  <p className="text-sm text-muted-foreground">With Department Heads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <Input
              type="search"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Departments Grid */}
          {filteredDepartments.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Building2" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? 'No Departments Found' : 'No Departments Yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 
                  'Try adjusting your search terms.' : 
                  'Get started by adding your first department.'}
              </p>
              <Button variant="outline" onClick={handleAddDepartment}>
                <Icon name="Plus" size={16} className="mr-2" />
                Add Department
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map((department) => (
                <div key={department.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Icon name="Building2" size={24} color="white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{department.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          department.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {department.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDepartment(department)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="text-error hover:text-error"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {department.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Department Head:</span>
                      <p className="font-medium text-foreground">
                        {department.head || 'Not assigned'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Employees:</span>
                      <p className="font-medium text-foreground">{department.employeeCount}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Created: {new Date(department.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Department Modal */}
      {addDepartmentModalOpen && (
        <DepartmentModal
          isOpen={addDepartmentModalOpen}
          onClose={() => setAddDepartmentModalOpen(false)}
          onSubmit={handleSubmitDepartment}
          department={null}
          isEdit={false}
        />
      )}

      {/* Edit Department Modal */}
      {editDepartmentModalOpen && (
        <DepartmentModal
          isOpen={editDepartmentModalOpen}
          onClose={() => setEditDepartmentModalOpen(false)}
          onSubmit={(data) => handleSubmitDepartment(data, true)}
          department={selectedDepartment}
          isEdit={true}
        />
      )}
    </div>
  );
};

// Department Modal Component
const DepartmentModal = ({ isOpen, onClose, onSubmit, department, isEdit }) => {
  const [formData, setFormData] = useState({
    name: department?.name || '',
    description: department?.description || '',
    head: department?.head || '',
    status: department?.status || 'active'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const departmentData = {
        ...formData,
        id: department?.id,
        createdDate: department?.createdDate,
        employeeCount: department?.employeeCount || 0
      };
      
      await onSubmit(departmentData);
      onClose();
    } catch (error) {
      console.error('Error submitting department:', error);
      alert('Error submitting department. Please try again.');
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
              {isEdit ? 'Edit Department' : 'Add New Department'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isEdit ? 'Update department information' : 'Create a new organizational department'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Department Name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Information Technology"
          />
          
          <div>
            <label className="block text-sm font-medium text-popover-foreground mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter department description and responsibilities..."
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <Input
            label="Department Head"
            value={formData.head}
            onChange={(e) => handleInputChange('head', e.target.value)}
            placeholder="e.g., John Smith"
            description="Name of the department manager or head"
          />

          <Select
            label="Status"
            required
            options={statusOptions}
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
          />

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
              {isEdit ? 'Update Department' : 'Add Department'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentManagement;
