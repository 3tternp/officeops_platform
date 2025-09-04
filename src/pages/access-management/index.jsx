import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import AccessRequestCard from './components/AccessRequestCard';
import PermissionMatrix from './components/PermissionMatrix';
import AccessReviewDashboard from './components/AccessReviewDashboard';
import TimeboxedAccessPanel from './components/TimeboxedAccessPanel';
import BulkActionsPanel from './components/BulkActionsPanel';
import ApprovalRequestModal from './components/ApprovalRequestModal';
import ApprovalActionsModal from './components/ApprovalActionsModal';
import ProxyRequestForm from './components/ProxyRequestForm';
import ResourceOwnershipManager from './components/ResourceOwnershipManager';
import ISOReviewWorkflow from './components/ISOReviewWorkflow';
import ReviewNotifications from './components/ReviewNotifications';
import PasswordResetRequestForm from './components/PasswordResetRequestForm';
import { createAccessRequest, createResource, AccessRequestStatus } from './utils/entities';
import dataService from '../../services/DataService';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';
import { ensureDemoUser } from '../../utils/demoUser';

const AccessManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accessRequests, setAccessRequests] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequestForApproval, setSelectedRequestForApproval] = useState(null);
  
  // New enhanced modals
  const [showProxyRequestModal, setShowProxyRequestModal] = useState(false);
  const [showResourceManagerModal, setShowResourceManagerModal] = useState(false);
  const [showISOReviewModal, setShowISOReviewModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [passwordResetRequests, setPasswordResetRequests] = useState([]);

  useEffect(() => {
    // Ensure demo user is properly set up
    const user = ensureDemoUser();
    setCurrentUser(user);
    loadAccessRequests();
  }, []);

  const loadAccessRequests = () => {
    const requests = dataService.getAccessRequests();
    setAccessRequests(requests);
  };

  const handleCreateRequest = () => {
    loadAccessRequests();
    setShowRequestModal(false);
    alert('Access request submitted successfully!');
  };

  const handleApprovalAction = () => {
    loadAccessRequests();
    setSelectedRequestForApproval(null);
  };

  // Mock data
  const mockRequests = [
    {
      id: 1,
      requestor: "John Smith",
      department: "Engineering",
      role: "Senior Developer",
      resource: "Production Database Access",
      justification: "Need access to investigate critical performance issues affecting customer transactions. Temporary access required for 48 hours to analyze query patterns and optimize database performance.",
      status: "pending",
      priority: "high",
      requestDate: "2025-01-15T09:00:00Z",
      dueDate: "2025-01-17T17:00:00Z"
    },
    {
      id: 2,
      requestor: "Sarah Wilson",
      department: "Finance",
      role: "Financial Analyst",
      resource: "Payroll System Access",
      justification: "Quarterly payroll audit requires access to employee compensation data and tax calculations for compliance reporting.",
      status: "approved",
      priority: "medium",
      requestDate: "2025-01-14T14:30:00Z",
      dueDate: "2025-01-16T17:00:00Z"
    },
    {
      id: 3,
      requestor: "Mike Johnson",
      department: "Marketing",
      role: "Marketing Manager",
      resource: "Customer Analytics Platform",
      justification: "Campaign performance analysis and customer segmentation for Q1 marketing strategy development.",
      status: "rejected",
      priority: "low",
      requestDate: "2025-01-13T11:15:00Z",
      dueDate: "2025-01-15T17:00:00Z"
    },
    {
      id: 4,
      requestor: "Emily Davis",
      department: "HR",
      role: "HR Specialist",
      resource: "Employee Records System",
      justification: "Annual performance review cycle requires access to employee performance data and historical records.",
      status: "pending",
      priority: "medium",
      requestDate: "2025-01-16T08:45:00Z",
      dueDate: "2025-01-18T17:00:00Z"
    },
    {
      id: 5,
      requestor: "David Brown",
      department: "IT Security",
      role: "Security Analyst",
      resource: "Network Monitoring Tools",
      justification: "Security incident investigation requires elevated access to network logs and monitoring dashboards.",
      status: "expired",
      priority: "high",
      requestDate: "2025-01-10T16:20:00Z",
      dueDate: "2025-01-12T17:00:00Z"
    }
  ];

  const mockRoles = [
    { id: 'admin', name: 'System Administrator', color: 'bg-error' },
    { id: 'manager', name: 'Department Manager', color: 'bg-warning' },
    { id: 'employee', name: 'Employee', color: 'bg-success' },
    { id: 'auditor', name: 'Auditor', color: 'bg-accent' },
    { id: 'hr', name: 'HR Specialist', color: 'bg-primary' }
  ];

  const mockResources = [
    { id: 'database', name: 'Production Database', icon: 'Database' },
    { id: 'payroll', name: 'Payroll System', icon: 'DollarSign' },
    { id: 'analytics', name: 'Analytics Platform', icon: 'BarChart3' },
    { id: 'hr-system', name: 'HR Management System', icon: 'Users' },
    { id: 'network', name: 'Network Tools', icon: 'Network' }
  ];

  const mockPermissions = [
    {
      id: 1,
      roleId: 'admin',
      resourceId: 'database',
      read: true,
      write: true,
      delete: true,
      lastModified: '2025-01-15T10:30:00Z'
    },
    {
      id: 2,
      roleId: 'manager',
      resourceId: 'payroll',
      read: true,
      write: true,
      delete: false,
      lastModified: '2025-01-14T15:20:00Z'
    },
    {
      id: 3,
      roleId: 'employee',
      resourceId: 'analytics',
      read: true,
      write: false,
      delete: false,
      lastModified: '2025-01-13T09:15:00Z'
    }
  ];

  const [accessReviews, setAccessReviews] = useState([]);

  // Initialize access reviews on component load
  useEffect(() => {
    loadAccessReviews();
  }, []);

  const loadAccessReviews = () => {
    let reviews = dataService.getAccessReviews();
    
    // If no reviews exist, create some default ones
    if (reviews.length === 0) {
      const defaultReviews = [
        {
          title: "Q1 2025 Access Review - Engineering",
          description: "Quarterly review of engineering team access permissions",
          manager: "Alex Thompson",
          status: "in-progress",
          dueDate: "2025-01-25T17:00:00Z",
          totalUsers: 25,
          reviewedUsers: 18,
          approvedUsers: 15,
          revokedUsers: 2,
          pendingUsers: 7
        },
        {
          title: "Annual Admin Access Review",
          description: "Annual review of administrative privileges",
          manager: "Sarah Johnson",
          status: "pending",
          dueDate: "2025-01-30T17:00:00Z",
          totalUsers: 8,
          reviewedUsers: 0,
          approvedUsers: 0,
          revokedUsers: 0,
          pendingUsers: 8
        },
        {
          title: "Finance Team Access Review",
          description: "Monthly review of finance system access",
          manager: "Robert Chen",
          status: "overdue",
          dueDate: "2025-01-10T17:00:00Z",
          totalUsers: 12,
          reviewedUsers: 8,
          approvedUsers: 6,
          revokedUsers: 1,
          pendingUsers: 4
        }
      ];
      
      // Add the default reviews to storage
      defaultReviews.forEach(review => {
        dataService.addAccessReview(review);
      });
      
      reviews = dataService.getAccessReviews();
    }
    
    setAccessReviews(reviews);
  };

  const mockTimeboxedAccess = [
    {
      id: 1,
      userName: "John Smith",
      userEmail: "john.smith@company.com",
      resource: "Production Database Access",
      justification: "Emergency maintenance window for critical bug fix",
      startDate: "2025-01-16T09:00:00Z",
      expiryDate: "2025-01-17T17:00:00Z",
      approvedBy: "Sarah Johnson",
      canExtend: true
    },
    {
      id: 2,
      userName: "Emily Davis",
      userEmail: "emily.davis@company.com",
      resource: "Financial Reports Access",
      justification: "Month-end closing procedures",
      startDate: "2025-01-15T08:00:00Z",
      expiryDate: "2025-01-16T20:00:00Z",
      approvedBy: "Robert Chen",
      canExtend: false
    },
    {
      id: 3,
      userName: "Mike Johnson",
      userEmail: "mike.johnson@company.com",
      resource: "Customer Data Export",
      justification: "Marketing campaign data analysis",
      startDate: "2025-01-10T10:00:00Z",
      expiryDate: "2025-01-12T18:00:00Z",
      approvedBy: "Alex Thompson",
      canExtend: false
    }
  ];

  const mockApprovers = [
    { id: 'sarah', name: 'Sarah Johnson', department: 'IT Security' },
    { id: 'alex', name: 'Alex Thompson', department: 'Engineering' },
    { id: 'robert', name: 'Robert Chen', department: 'Finance' },
    { id: 'lisa', name: 'Lisa Wang', department: 'HR' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'expired', label: 'Expired' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  // Filter tabs based on user permissions
  const allTabs = [
    { id: 'requests', label: 'Access Requests', icon: 'FileText', count: accessRequests?.length, requiredPermissions: [PERMISSIONS.ACCESS_VIEW_ALL, PERMISSIONS.ACCESS_VIEW_OWN] },
    { id: 'proxy', label: 'Proxy Requests (Maker-Checker)', icon: 'Users', count: 0, requiredPermissions: ['manager', 'admin'] },
    { id: 'permissions', label: 'Permission Matrix', icon: 'Shield', count: mockPermissions?.length, requiredPermissions: [PERMISSIONS.ACCESS_VIEW_ALL] },
    { id: 'resources', label: 'Resource Ownership', icon: 'Database', count: mockResources?.length, requiredPermissions: ['admin', 'iso'] },
    { id: 'reviews', label: 'Access Reviews', icon: 'ClipboardList', count: accessReviews?.length, requiredPermissions: [PERMISSIONS.ACCESS_VIEW_ALL] },
    { id: 'notifications', label: 'Review Notifications', icon: 'Bell', count: 3, requiredPermissions: ['asset_owner', 'system_owner', 'data_custodian', 'manager', 'admin'] },
    { id: 'timebox', label: 'Time-boxed Access', icon: 'Clock', count: mockTimeboxedAccess?.length, requiredPermissions: [PERMISSIONS.ACCESS_VIEW_ALL] },
    { id: 'iso-review', label: 'ISO Reviews', icon: 'ShieldCheck', count: 0, requiredPermissions: ['iso'] },
    { id: 'password-reset', label: 'Password Resets', icon: 'Lock', count: passwordResetRequests?.length, requiredPermissions: [PERMISSIONS.ACCESS_VIEW_ALL, PERMISSIONS.ACCESS_VIEW_OWN] }
  ];

  const tabs = allTabs.filter(tab => {
    return tab.requiredPermissions.some(permission => hasPermission(currentUser?.role, permission));
  });

  // Get pending requests for approval (for managers/admins)
  const pendingRequestsForApproval = currentUser ? dataService.getPendingAccessRequestsForUser(currentUser) : [];

  // Combine real access requests with pending ones that user can see/approve
  const allViewableRequests = currentUser?.role === 'admin' || currentUser?.role === 'manager' || currentUser?.role === 'iso' 
    ? accessRequests 
    : dataService.getUserAccessRequests(currentUser?.id || '');

  const filteredRequests = allViewableRequests?.filter(request => {
    const statusMatch = filterStatus === 'all' || request?.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || request?.priority === filterPriority;
    const searchMatch = searchQuery === '' || 
      request?.requestor?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      request?.resource?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      request?.department?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    return statusMatch && priorityMatch && searchMatch;
  });

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileSidebarClose = () => {
    setSidebarMobileOpen(false);
  };

  const handleRequestSelection = (requestId, selected) => {
    if (selected) {
      const request = mockRequests?.find(r => r?.id === requestId);
      if (request) {
        setSelectedRequests(prev => [...prev, request]);
      }
    } else {
      setSelectedRequests(prev => prev?.filter(r => r?.id !== requestId));
    }
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedRequests(filteredRequests);
    } else {
      setSelectedRequests([]);
    }
  };

  const handleApproveRequest = (requestId) => {
    const request = allViewableRequests.find(r => r.id === requestId);
    if (request && currentUser) {
      setSelectedRequestForApproval(request);
      setShowApprovalModal(true);
    }
  };

  const handleRejectRequest = (requestId) => {
    const request = allViewableRequests.find(r => r.id === requestId);
    if (request && currentUser) {
      setSelectedRequestForApproval(request);
      setShowApprovalModal(true);
    }
  };

  const handleViewDetails = (requestId) => {
    const request = allViewableRequests.find(r => r.id === requestId);
    if (request && currentUser) {
      setSelectedRequestForApproval(request);
      setShowApprovalModal(true);
    }
  };

  const handleUpdatePermission = (permissionId, updates) => {
    console.log('Updating permission:', permissionId, updates);
    // Implementation would update permission matrix
  };

  const handleStartReview = async (reviewId) => {
    try {
      if (!currentUser) {
        alert('User not authenticated');
        return;
      }
      
      const updatedReview = dataService.startAccessReview(reviewId, currentUser.id);
      
      if (updatedReview) {
        // Refresh the reviews list
        loadAccessReviews();
        
        // Show success message
        alert(`Access review "${updatedReview.title}" has been started successfully!`);
        
        console.log('Review started successfully:', updatedReview);
      }
    } catch (error) {
      console.error('Error starting review:', error);
      alert('Failed to start the review. Please try again.');
    }
  };

  const handleCompleteReview = async (reviewId) => {
    try {
      if (!currentUser) {
        alert('User not authenticated');
        return;
      }
      
      const confirmComplete = window.confirm(
        'Are you sure you want to mark this review as completed? This action cannot be undone.'
      );
      
      if (confirmComplete) {
        const updatedReview = dataService.completeAccessReview(reviewId, currentUser.id);
        
        if (updatedReview) {
          // Refresh the reviews list
          loadAccessReviews();
          
          // Show success message
          alert(`Access review "${updatedReview.title}" has been completed successfully!`);
          
          console.log('Review completed successfully:', updatedReview);
        }
      }
    } catch (error) {
      console.error('Error completing review:', error);
      alert('Failed to complete the review. Please try again.');
    }
  };

  const handleExtendAccess = (accessId) => {
    const confirmExtend = window.confirm('Are you sure you want to extend this time-boxed access by 24 hours?');
    if (confirmExtend) {
      // In a real app, this would make an API call
      console.log('Extending access:', accessId);
      alert('Access has been extended by 24 hours successfully!');
    }
  };

  const handleRevokeAccess = (accessId) => {
    const confirmRevoke = window.confirm('Are you sure you want to revoke this access immediately? This action cannot be undone.');
    if (confirmRevoke) {
      // In a real app, this would make an API call
      console.log('Revoking access:', accessId);
      alert('Access has been revoked successfully!');
    }
  };

  const handleBulkApprove = (requestIds) => {
    if (requestIds.length === 0) {
      alert('No requests selected for bulk approval.');
      return;
    }
    
    const confirmApprove = window.confirm(`Are you sure you want to approve ${requestIds.length} selected request(s)?`);
    if (confirmApprove) {
      console.log('Bulk approving requests:', requestIds);
      setSelectedRequests([]);
      loadAccessRequests();
      alert(`${requestIds.length} request(s) have been approved successfully!`);
    }
  };

  const handleBulkReject = (requestIds, reason) => {
    if (requestIds.length === 0) {
      alert('No requests selected for bulk rejection.');
      return;
    }
    
    const confirmReject = window.confirm(`Are you sure you want to reject ${requestIds.length} selected request(s)?`);
    if (confirmReject) {
      console.log('Bulk rejecting requests:', requestIds, 'Reason:', reason);
      setSelectedRequests([]);
      loadAccessRequests();
      alert(`${requestIds.length} request(s) have been rejected successfully!`);
    }
  };

  const handleBulkAssign = (requestIds, approverId) => {
    if (requestIds.length === 0) {
      alert('No requests selected for bulk assignment.');
      return;
    }
    
    const approver = mockApprovers.find(a => a.id === approverId);
    const approverName = approver ? approver.name : 'Unknown Approver';
    
    const confirmAssign = window.confirm(`Are you sure you want to assign ${requestIds.length} request(s) to ${approverName}?`);
    if (confirmAssign) {
      console.log('Bulk assigning requests:', requestIds, 'to approver:', approverId);
      setSelectedRequests([]);
      loadAccessRequests();
      alert(`${requestIds.length} request(s) have been assigned to ${approverName} successfully!`);
    }
  };

  const handleClearSelection = () => {
    setSelectedRequests([]);
  };

  const handleNewRequest = () => {
    setShowRequestModal(true);
  };

  const handleRequestAction = (request) => {
    setSelectedRequestForApproval(request);
    setShowApprovalModal(true);
  };

  const handleSettings = () => {
    // Navigate to access management settings
    navigate('/settings');
  };

  const handleExportResults = () => {
    if (!filteredRequests || filteredRequests.length === 0) {
      alert('No data to export. Please adjust your filters and try again.');
      return;
    }

    try {
      // Create CSV content
      const csvHeaders = ['ID', 'Requestor', 'Department', 'Role', 'Resource', 'Status', 'Priority', 'Request Date', 'Due Date', 'Justification'];
      const csvContent = [
        csvHeaders.join(','),
        ...filteredRequests.map(request => [
          request.id,
          `"${request.requestor}"`,
          `"${request.department}"`,
          `"${request.role}"`,
          `"${request.resource}"`,
          request.status,
          request.priority,
          new Date(request.requestDate).toLocaleDateString(),
          new Date(request.dueDate).toLocaleDateString(),
          `"${request.justification.replace(/"/g, '""')}"` // Escape quotes in CSV
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `access-requests-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`Successfully exported ${filteredRequests.length} access requests to CSV file.`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'requests':
        return (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Input
                  type="search"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                />
                <Select
                  options={statusOptions}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  placeholder="Filter by status"
                />
                <Select
                  options={priorityOptions}
                  value={filterPriority}
                  onChange={setFilterPriority}
                  placeholder="Filter by priority"
                />
                <Button variant="outline" className="w-full">
                  <Icon name="Filter" size={16} className="mr-2" />
                  Advanced Filters
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {hasPermission(currentUser?.role, PERMISSIONS.ACCESS_APPROVE) && (
                    <Checkbox
                      label={`Select All (${filteredRequests?.length})`}
                      checked={selectedRequests?.length === filteredRequests?.length && filteredRequests?.length > 0}
                      onChange={(e) => handleSelectAll(e?.target?.checked)}
                    />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {filteredRequests?.length} request{filteredRequests?.length !== 1 ? 's' : ''} found
                  </span>
                </div>
                {hasPermission(currentUser?.role, PERMISSIONS.DATA_EXPORT) && (
                  <Button variant="outline" size="sm" onClick={handleExportResults}>
                    <Icon name="Download" size={16} className="mr-2" />
                    Export Results
                  </Button>
                )}
              </div>
            </div>
            {/* Bulk Actions */}
            {hasPermission(currentUser?.role, PERMISSIONS.ACCESS_APPROVE) && (
              <BulkActionsPanel
                selectedRequests={selectedRequests}
                onBulkApprove={handleBulkApprove}
                onBulkReject={handleBulkReject}
                onBulkAssign={handleBulkAssign}
                onClearSelection={handleClearSelection}
                availableApprovers={mockApprovers}
              />
            )}
            {/* Requests Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRequests?.map((request) => (
                <div key={request?.id} className="relative">
                  {hasPermission(currentUser?.role, PERMISSIONS.ACCESS_APPROVE) && (
                    <div className="absolute top-4 left-4 z-10">
                      <Checkbox
                        checked={selectedRequests?.some(r => r?.id === request?.id)}
                        onChange={(e) => handleRequestSelection(request?.id, e?.target?.checked)}
                      />
                    </div>
                  )}
                  <div className={hasPermission(currentUser?.role, PERMISSIONS.ACCESS_APPROVE) ? "pl-10" : ""}>
                    <AccessRequestCard
                      request={request}
                      onApprove={handleApproveRequest}
                      onReject={handleRejectRequest}
                      onViewDetails={handleViewDetails}
                      currentUser={currentUser}
                    />
                  </div>
                </div>
              ))}
            </div>
            {filteredRequests?.length === 0 && (
              <div className="text-center py-12">
                <Icon name="FileText" size={64} className="text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Access Requests Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' ?'Try adjusting your filters to see more results.' :'No access requests have been submitted yet.'}
                </p>
                <Button variant="outline" onClick={handleNewRequest}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Create New Request
                </Button>
              </div>
            )}
          </div>
        );

      case 'permissions':
        return (
          <PermissionMatrix
            permissions={mockPermissions}
            roles={mockRoles}
            resources={mockResources}
            onUpdatePermission={handleUpdatePermission}
          />
        );

      case 'reviews':
        return (
          <AccessReviewDashboard
            reviews={accessReviews}
            onStartReview={handleStartReview}
            onCompleteReview={handleCompleteReview}
          />
        );

      case 'proxy':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Proxy Access Requests (Maker-Checker)</h3>
                  <p className="text-sm text-muted-foreground">
                    Request access on behalf of team members with proper segregation of duties
                  </p>
                </div>
                <Button onClick={() => setShowProxyRequestModal(true)}>
                  <Icon name="Users" size={16} className="mr-2" />
                  New Proxy Request
                </Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No proxy requests found. Create a new proxy request to get started.</p>
              </div>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Resource Ownership Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage mandatory asset and system ownership for all resources
                  </p>
                </div>
                <Button onClick={() => setShowResourceManagerModal(true)}>
                  <Icon name="Database" size={16} className="mr-2" />
                  Add Resource
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockResources.map((resource) => (
                  <div key={resource.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name={resource.icon} size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{resource.name}</h4>
                        <div className="text-sm text-muted-foreground">Production</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Asset Owner:</span>
                        <span className="font-medium">Required</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">System Owner:</span>
                        <span className="font-medium">Required</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3"
                      onClick={() => {
                        setSelectedResource(resource);
                        setShowResourceManagerModal(true);
                      }}
                    >
                      Configure Ownership
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <ReviewNotifications 
            currentUser={currentUser}
            onNotificationAction={(action, notificationId) => {
              console.log('Notification action:', action, notificationId);
            }}
          />
        );

      case 'iso-review':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">ISO Security Reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    Review and approve access requests requiring security officer approval
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-warning/10 text-warning rounded-full text-sm">High Priority</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">0 Pending</span>
                </div>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="ShieldCheck" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No requests pending ISO review. All requests requiring security review will appear here.</p>
              </div>
            </div>
          </div>
        );

      case 'timebox':
        return (
          <TimeboxedAccessPanel
            timeboxedAccess={mockTimeboxedAccess}
            onExtendAccess={handleExtendAccess}
            onRevokeAccess={handleRevokeAccess}
          />
        );

      case 'password-reset':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Password Reset Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit and track password reset requests with proper approval workflow
                  </p>
                </div>
                <Button onClick={() => setShowPasswordResetModal(true)}>
                  <Icon name="Lock" size={16} className="mr-2" />
                  New Password Reset Request
                </Button>
              </div>
              
              {passwordResetRequests?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Lock" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No password reset requests found. Create a new request to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {passwordResetRequests.map((request) => (
                    <div key={request.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="Lock" size={16} className="text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{request.application}</h4>
                            <p className="text-sm text-muted-foreground">Username: {request.username}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-warning/10 text-warning' :
                          request.status === 'approved' ? 'bg-success/10 text-success' :
                          request.status === 'rejected' ? 'bg-error/10 text-error' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Priority:</span>
                          <span className="ml-2 font-medium">{request.priority}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Security Clearance:</span>
                          <span className="ml-2 font-medium">{request.securityClearance}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        <span className="font-medium">Justification:</span> {request.justification}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Requested by {request.requestedBy} on {new Date(request.requestDate).toLocaleDateString()}</span>
                        {request.contactPhone && (
                          <span>Contact: {request.contactPhone}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Access Management</h1>
                  <p className="text-muted-foreground">
                    Manage user permissions, access requests, and periodic reviews with comprehensive audit trails
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleSettings}>
                    <Icon name="Settings" size={16} className="mr-2" />
                    Settings
                  </Button>
                  <Button onClick={handleNewRequest}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    New Request
                  </Button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-border">
                <nav className="flex space-x-8 overflow-x-auto">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab?.id
                          ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span>{tab?.label}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {tab?.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" size={32} className="animate-spin text-muted-foreground" />
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ApprovalRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleCreateRequest}
      />

      <ApprovalActionsModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        request={selectedRequestForApproval}
        currentUser={currentUser}
        onAction={handleApprovalAction}
      />
      
      {/* Enhanced Modals */}
      <ProxyRequestForm
        isOpen={showProxyRequestModal}
        onClose={() => setShowProxyRequestModal(false)}
        onSubmit={(request) => {
          console.log('Proxy request submitted:', request);
          setShowProxyRequestModal(false);
          alert('Proxy access request submitted successfully! It will require manager approval followed by ISO review.');
        }}
        currentUser={currentUser}
        resources={mockResources.map(r => ({ ...r, 
          asset_owner_name: 'Asset Owner', 
          system_owner_name: 'System Owner',
          risk_rating: 'medium',
          classification: 'internal',
          environment: 'production'
        }))}
        users={[
          { id: '1', name: 'John Smith', email: 'john.smith@company.com', department: 'Engineering' },
          { id: '2', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Finance' },
          { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Marketing' },
          { id: '4', name: 'Emily Davis', email: 'emily.davis@company.com', department: 'HR' }
        ]}
      />
      
      <ResourceOwnershipManager
        isOpen={showResourceManagerModal}
        onClose={() => {
          setShowResourceManagerModal(false);
          setSelectedResource(null);
        }}
        onSubmit={(resource) => {
          console.log('Resource ownership configured:', resource);
          setShowResourceManagerModal(false);
          setSelectedResource(null);
          alert('Resource ownership configuration saved successfully!');
        }}
        resource={selectedResource}
        users={[
          { id: '1', name: 'John Smith', email: 'john.smith@company.com', department: 'Engineering' },
          { id: '2', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Finance' },
          { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Marketing' },
          { id: '4', name: 'Emily Davis', email: 'emily.davis@company.com', department: 'HR' },
          { id: '5', name: 'Alex Thompson', email: 'alex.thompson@company.com', department: 'IT' },
          { id: '6', name: 'Lisa Wang', email: 'lisa.wang@company.com', department: 'Security' }
        ]}
      />
      
      <ISOReviewWorkflow
        isOpen={showISOReviewModal}
        onClose={() => {
          setShowISOReviewModal(false);
          setSelectedRequestForApproval(null);
        }}
        request={selectedRequestForApproval}
        currentUser={currentUser}
        onAction={(updatedRequest) => {
          console.log('ISO review completed:', updatedRequest);
          setShowISOReviewModal(false);
          setSelectedRequestForApproval(null);
          loadAccessRequests();
          alert('ISO security review completed successfully!');
        }}
      />
      
      <PasswordResetRequestForm
        isOpen={showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(false)}
        onSubmit={(request) => {
          console.log('Password reset request submitted:', request);
          // Add the request to the password reset requests list
          setPasswordResetRequests(prev => [...prev, {
            id: Date.now(),
            ...request,
            status: 'pending',
            requestDate: new Date().toISOString(),
            requestedBy: currentUser?.name || 'Unknown User'
          }]);
          setShowPasswordResetModal(false);
          alert('Password reset request submitted successfully! It will be routed to the appropriate ISO officer for approval.');
        }}
        currentUser={currentUser}
      />
    </div>
  );
};

export default AccessManagement;
