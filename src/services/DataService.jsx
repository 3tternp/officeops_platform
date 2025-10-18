// Data Management Service for OfficeOps Platform
// Handles initialization, storage, and management of application data

class DataService {
  constructor() {
    this.initializeDefaultData();
  }

  // Initialize default data on first app load
  initializeDefaultData() {
    // Check if data has been initialized
    const isInitialized = localStorage.getItem('officeops_initialized');
    
    if (!isInitialized) {
      this.resetToDefaults();
      // Seed branding from environment variables if provided
      this.seedBrandingFromEnvIfEmpty();
      localStorage.setItem('officeops_initialized', 'true');
    }
  }

  // Reset all data to default state
  resetToDefaults() {
    // Default admin user with demo credentials
    const defaultAdmin = {
      id: 'admin001',
      name: 'Demo Administrator',
      email: 'admin@demo.com',
      password: 'admin123', // Demo password for testing
      role: 'admin',
      department: 'Information Technology',
      status: 'active',
      createdDate: new Date().toISOString(),
      lastLogin: null,
      permissions: ['all'] // Admin has all permissions
    };

    // Demo users for different roles
    const demoUsers = [
      defaultAdmin,
      {
        id: 'iso001',
        name: 'Security Officer',
        email: 'iso@demo.com',
        password: 'iso123',
        role: 'iso',
        department: 'Information Technology',
        status: 'active',
        createdDate: new Date().toISOString(),
        lastLogin: null
      },
      {
        id: 'mgr001',
        name: 'Department Manager',
        email: 'manager@demo.com',
        password: 'mgr123',
        role: 'manager',
        department: 'Human Resources',
        status: 'active',
        createdDate: new Date().toISOString(),
        lastLogin: null
      },
      {
        id: 'emp001',
        name: 'John Employee',
        email: 'employee@demo.com',
        password: 'emp123',
        role: 'employee',
        department: 'Finance',
        status: 'active',
        createdDate: new Date().toISOString(),
        lastLogin: null
      }
    ];

    // Default departments
    const defaultDepartments = [
      {
        id: 'dept001',
        name: 'Information Technology',
        description: 'IT infrastructure and systems management',
        head: 'System Administrator',
        employeeCount: 1,
        createdDate: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'dept002',
        name: 'Human Resources',
        description: 'Employee management and organizational development',
        head: '',
        employeeCount: 0,
        createdDate: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'dept003',
        name: 'Finance',
        description: 'Financial management and accounting',
        head: '',
        employeeCount: 0,
        createdDate: new Date().toISOString(),
        status: 'active'
      }
    ];

    // Default system resources
    const defaultResources = [
      {
        id: 'res001',
        name: 'Employee Database',
        description: 'Access to employee personal and professional information',
        category: 'Database',
        department: 'Human Resources',
        riskLevel: 'High',
        approvers: ['admin'],
        maxAccessDuration: 30, // days
        requiresJustification: true,
        status: 'active',
        createdDate: new Date().toISOString()
      },
      {
        id: 'res002',
        name: 'Financial Systems',
        description: 'Access to financial data and accounting systems',
        category: 'Application',
        department: 'Finance',
        riskLevel: 'Critical',
        approvers: ['admin'],
        maxAccessDuration: 7, // days
        requiresJustification: true,
        status: 'active',
        createdDate: new Date().toISOString()
      },
      {
        id: 'res003',
        name: 'Network Infrastructure',
        description: 'Access to network configuration and monitoring tools',
        category: 'Infrastructure',
        department: 'Information Technology',
        riskLevel: 'High',
        approvers: ['admin'],
        maxAccessDuration: 14, // days
        requiresJustification: true,
        status: 'active',
        createdDate: new Date().toISOString()
      }
    ];

    // Default role definitions with comprehensive permissions
    const defaultRoles = [
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full system access and management capabilities',
        permissions: [
          'user_management',
          'department_management', 
          'resource_management',
          'access_approval_all',
          'system_settings',
          'audit_access',
          'risk_management_full',
          'document_management_full',
          'asset_management_full',
          'learning_management_full',
          'asset_approval_unlimited',
          'role_configuration',
          'data_export',
          'system_reset'
        ],
        assetApprovalLimit: null, // Unlimited
        color: 'bg-error text-error-foreground',
        level: 5
      },
      {
        id: 'iso',
        name: 'Information Security Officer',
        description: 'Security oversight and compliance management',
        permissions: [
          'ACCESS_APPROVE',
          'access_approval',
          'risk_management_full',
          'document_management_full',
          'audit_access',
          'security_settings',
          'lms_content_creation',
          'asset_view_assigned',
          'asset_request',
          'compliance_reporting',
          'user_access_review'
        ],
        assetApprovalLimit: 10000, // 10,000 RS
        color: 'bg-warning text-warning-foreground',
        level: 4
      },
      {
        id: 'manager',
        name: 'Department Manager',
        description: 'Department-level management and approval authority',
        permissions: [
          'team_management',
          'access_approval_department',
          'document_access',
          'asset_request',
          'asset_approval_limited',
          'training_management',
          'employee_monitoring',
          'department_reporting'
        ],
        assetApprovalLimit: 5000, // 5,000 RS default
        color: 'bg-accent text-accent-foreground',
        level: 3
      },
      {
        id: 'employee',
        name: 'Employee',
        description: 'Standard employee access with limited privileges',
        permissions: [
          'profile_view_only',
          'access_request',
          'document_view',
          'training_participation',
          'asset_view_assigned',
          'asset_request',
          'policy_acknowledgment',
          'quiz_participation',
          'progress_view'
        ],
        assetApprovalLimit: 0, // Cannot approve
        color: 'bg-success text-success-foreground',
        level: 1
      }
    ];

    // Default sample assets for risk assessment
    const defaultAssets = [
      {
        id: 'asset001',
        assetId: 'LAP-2025-001',
        name: 'MacBook Pro 16"',
        category: 'laptop',
        brand: 'Apple',
        model: 'MacBook Pro',
        serialNumber: 'C02X1XXXX',
        status: 'available',
        condition: 'excellent',
        location: 'headquarters',
        createdDate: new Date().toISOString()
      },
      {
        id: 'asset002',
        assetId: 'SRV-2025-001',
        name: 'Database Server',
        category: 'server',
        brand: 'Dell',
        model: 'PowerEdge R750',
        serialNumber: 'DL001XXX',
        status: 'assigned',
        condition: 'excellent',
        location: 'data-center',
        createdDate: new Date().toISOString()
      },
      {
        id: 'asset003',
        assetId: 'NET-2025-001',
        name: 'Firewall Device',
        category: 'network',
        brand: 'Cisco',
        model: 'ASA 5516-X',
        serialNumber: 'FCH001XXX',
        status: 'assigned',
        condition: 'good',
        location: 'network-room',
        createdDate: new Date().toISOString()
      }
    ];

    // Store all default data
    localStorage.setItem('allUsers', JSON.stringify(demoUsers));
    localStorage.setItem('departments', JSON.stringify(defaultDepartments));
    localStorage.setItem('systemResources', JSON.stringify(defaultResources));
    localStorage.setItem('userRoles', JSON.stringify(defaultRoles));
    
    // Default sample access requests for testing approval hierarchy
    const defaultAccessRequests = [
      {
        id: 'accessReq1738480000001',
        requesterId: 'emp001',
        requesterName: 'John Employee',
        requesterEmail: 'employee@demo.com',
        requesterDepartment: 'Finance',
        requesterRole: 'employee',
        resourceId: 'res001',
        resourceName: 'Employee Database',
        resourceCategory: 'Database',
        routingDepartment: 'Human Resources',
        requestDate: new Date().toISOString(),
        status: 'pending',
        priority: 'medium',
        justification: 'Need access to update employee records for annual review process.',
        approvalHistory: []
      },
      {
        id: 'accessReq1738480000002',
        requesterId: 'mgr001',
        requesterName: 'Department Manager',
        requesterEmail: 'manager@demo.com',
        requesterDepartment: 'Human Resources',
        requesterRole: 'manager',
        resourceId: 'res002',
        resourceName: 'Financial Systems',
        resourceCategory: 'Application',
        routingDepartment: 'Finance',
        requestDate: new Date(Date.now() - 24*60*60*1000).toISOString(), // 1 day ago
        status: 'pending',
        priority: 'high',
        justification: 'Require access to financial reports for quarterly budget analysis and resource allocation.',
        approvalHistory: []
      },
      {
        id: 'accessReq1738480000003',
        requesterId: 'iso001',
        requesterName: 'Security Officer',
        requesterEmail: 'iso@demo.com',
        requesterDepartment: 'Information Technology',
        requesterRole: 'iso',
        resourceId: 'res003',
        resourceName: 'Network Infrastructure',
        resourceCategory: 'Infrastructure',
        routingDepartment: 'Information Technology',
        requestDate: new Date(Date.now() - 2*60*60*1000).toISOString(), // 2 hours ago
        status: 'pending',
        priority: 'high',
        justification: 'Security audit requires access to network configuration and monitoring tools to assess infrastructure vulnerabilities.',
        approvalHistory: []
      }
    ];

    // Clear all module data and set defaults
    localStorage.setItem('documents', JSON.stringify([]));
    localStorage.setItem('assets', JSON.stringify(defaultAssets));
    localStorage.setItem('risks', JSON.stringify([]));
    localStorage.setItem('accessRequests', JSON.stringify(defaultAccessRequests));
    localStorage.setItem('learningCourses', JSON.stringify([]));
    localStorage.setItem('certificates', JSON.stringify([]));
    localStorage.setItem('accessReviews', JSON.stringify([]));
    
    console.log('OfficeOps Platform initialized with default data');
  }

  // Branding settings
  seedBrandingFromEnvIfEmpty() {
    const existing = localStorage.getItem('companyBranding');
    if (existing) return;
    try {
      const env = import.meta.env;
      const envBrand = {
        companyName: env?.VITE_BRAND_NAME,
        companyLogo: env?.VITE_BRAND_LOGO,
        companyFavicon: env?.VITE_BRAND_FAVICON,
        loginBackgroundImage: env?.VITE_BRAND_LOGIN_BG || env?.VITE_BRAND_LOGIN_BACKGROUND_IMAGE,
        bannerImage: env?.VITE_BRAND_BANNER_IMAGE,
        primaryColor: env?.VITE_BRAND_PRIMARY_COLOR,
        secondaryColor: env?.VITE_BRAND_SECONDARY_COLOR,
        footerText: env?.VITE_BRAND_FOOTER_TEXT,
        supportEmail: env?.VITE_SUPPORT_EMAIL,
        supportPhone: env?.VITE_SUPPORT_PHONE,
        website: env?.VITE_BRAND_WEBSITE,
      };
      const cleaned = Object.fromEntries(Object.entries(envBrand).filter(([_, v]) => v !== undefined && v !== null && v !== ''));
      if (Object.keys(cleaned).length) {
        this.saveCompanyBranding(cleaned);
      }
    } catch (e) {
      console.warn('Failed to seed branding from environment:', e);
    }
  }
  getCompanyBranding() {
    const raw = localStorage.getItem('companyBranding');
    const defaults = {
      companyName: 'OfficeOps',
      companyLogo: '',
      companyFavicon: '',
      loginBackgroundImage: '',
      bannerImage: '',
      primaryColor: '#3b82f6',
      secondaryColor: '#6366f1',
      footerText: '',
      supportEmail: '',
      supportPhone: '',
      website: ''
    };
    try {
      return { ...defaults, ...(raw ? JSON.parse(raw) : {}) };
    } catch (e) {
      console.warn('Failed to parse companyBranding from localStorage:', e);
      return defaults;
    }
  }

  saveCompanyBranding(branding) {
    const current = this.getCompanyBranding();
    const merged = { ...current, ...branding, updatedAt: new Date().toISOString() };
    localStorage.setItem('companyBranding', JSON.stringify(merged));
    return merged;
  }

  // User management
  getUsers() {
    return JSON.parse(localStorage.getItem('allUsers') || '[]');
  }

  saveUsers(users) {
    localStorage.setItem('allUsers', JSON.stringify(users));
  }

  // Department management
  getDepartments() {
    return JSON.parse(localStorage.getItem('departments') || '[]');
  }

  saveDepartments(departments) {
    localStorage.setItem('departments', JSON.stringify(departments));
  }

  addDepartment(department) {
    const departments = this.getDepartments();
    const newDepartment = {
      ...department,
      id: `dept${Date.now()}`,
      createdDate: new Date().toISOString(),
      employeeCount: 0,
      status: 'active'
    };
    departments.push(newDepartment);
    this.saveDepartments(departments);
    return newDepartment;
  }

  updateDepartment(departmentId, updates) {
    const departments = this.getDepartments();
    const updatedDepartments = departments.map(dept => 
      dept.id === departmentId ? { ...dept, ...updates } : dept
    );
    this.saveDepartments(updatedDepartments);
    return updatedDepartments.find(dept => dept.id === departmentId);
  }

  deleteDepartment(departmentId) {
    const departments = this.getDepartments();
    const filteredDepartments = departments.filter(dept => dept.id !== departmentId);
    this.saveDepartments(filteredDepartments);
  }

  // Resource management
  getResources() {
    return JSON.parse(localStorage.getItem('systemResources') || '[]');
  }

  saveResources(resources) {
    localStorage.setItem('systemResources', JSON.stringify(resources));
  }

  addResource(resource) {
    const resources = this.getResources();
    const newResource = {
      ...resource,
      id: `res${Date.now()}`,
      createdDate: new Date().toISOString(),
      status: 'active'
    };
    resources.push(newResource);
    this.saveResources(resources);
    return newResource;
  }

  updateResource(resourceId, updates) {
    const resources = this.getResources();
    const updatedResources = resources.map(res => 
      res.id === resourceId ? { ...res, ...updates } : res
    );
    this.saveResources(updatedResources);
    return updatedResources.find(res => res.id === resourceId);
  }

  deleteResource(resourceId) {
    const resources = this.getResources();
    const filteredResources = resources.filter(res => res.id !== resourceId);
    this.saveResources(filteredResources);
  }

  // Role management
  getRoles() {
    return JSON.parse(localStorage.getItem('userRoles') || '[]');
  }

  saveRoles(roles) {
    localStorage.setItem('userRoles', JSON.stringify(roles));
  }

  // Access requests management
  getAccessRequests() {
    return JSON.parse(localStorage.getItem('accessRequests') || '[]');
  }

  saveAccessRequests(requests) {
    localStorage.setItem('accessRequests', JSON.stringify(requests));
  }

  addAccessRequest(request) {
    const requests = this.getAccessRequests();
    const newRequest = {
      ...request,
      id: `req${Date.now()}`,
      requestDate: new Date().toISOString(),
      status: 'pending'
    };
    requests.push(newRequest);
    this.saveAccessRequests(requests);
    return newRequest;
  }

  // Generic data management for modules
  getModuleData(module) {
    return JSON.parse(localStorage.getItem(module) || '[]');
  }

  saveModuleData(module, data) {
    localStorage.setItem(module, JSON.stringify(data));
  }

  // Clear all data (for testing/reset)
  clearAllData() {
    localStorage.removeItem('allUsers');
    localStorage.removeItem('departments');
    localStorage.removeItem('systemResources');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('documents');
    localStorage.removeItem('assets');
    localStorage.removeItem('risks');
    localStorage.removeItem('accessRequests');
    localStorage.removeItem('learningCourses');
    localStorage.removeItem('officeops_initialized');
    localStorage.removeItem('currentUser'); // Clear current user session
    this.initializeDefaultData();
    console.log('All data cleared and reset to defaults with demo accounts');
  }

  // Force reset to get new demo users
  forceReset() {
    this.clearAllData();
    window.location.reload(); // Reload to apply changes
  }

  // Check user permissions
  hasPermission(user, permission) {
    const roles = this.getRoles();
    const userRole = roles.find(role => role.id === user.role);
    return userRole?.permissions?.includes(permission) || userRole?.permissions?.includes('all');
  }

  // Get users by role
  getUsersByRole(role) {
    const users = this.getUsers();
    return users.filter(user => user.role === role);
  }

  // Get department by id
  getDepartmentById(departmentId) {
    const departments = this.getDepartments();
    return departments.find(dept => dept.id === departmentId);
  }

  // Get resource by id
  getResourceById(resourceId) {
    const resources = this.getResources();
    return resources.find(res => res.id === resourceId);
  }

  // Asset management for risk assessment
  getAssets() {
    return JSON.parse(localStorage.getItem('assets') || '[]');
  }

  saveAssets(assets) {
    localStorage.setItem('assets', JSON.stringify(assets));
  }

  getAssetById(assetId) {
    const assets = this.getAssets();
    return assets.find(asset => asset.id === assetId);
  }

  // Risk management methods
  getRisks() {
    return JSON.parse(localStorage.getItem('risks') || '[]');
  }

  saveRisks(risks) {
    localStorage.setItem('risks', JSON.stringify(risks));
  }

  addRisk(risk) {
    const risks = this.getRisks();
    const newRisk = {
      ...risk,
      id: `risk${Date.now()}`,
      createdDate: new Date().toISOString(),
      status: 'active'
    };
    risks.push(newRisk);
    this.saveRisks(risks);
    return newRisk;
  }

  updateRisk(riskId, updates) {
    const risks = this.getRisks();
    const updatedRisks = risks.map(risk => 
      risk.id === riskId ? { ...risk, ...updates } : risk
    );
    this.saveRisks(updatedRisks);
    return updatedRisks.find(risk => risk.id === riskId);
  }

  deleteRisk(riskId) {
    const risks = this.getRisks();
    const filteredRisks = risks.filter(risk => risk.id !== riskId);
    this.saveRisks(filteredRisks);
  }

  getRiskById(riskId) {
    const risks = this.getRisks();
    return risks.find(risk => risk.id === riskId);
  }

  // Get risks by various filters
  getRisksByLevel(level) {
    const risks = this.getRisks();
    return risks.filter(risk => risk.riskLevel === level);
  }

  getRisksByOwner(owner) {
    const risks = this.getRisks();
    return risks.filter(risk => risk.riskOwner === owner);
  }

  getRisksDueForReview() {
    const risks = this.getRisks();
    const today = new Date();
    return risks.filter(risk => {
      const reviewDate = new Date(risk.nextReviewDate);
      return reviewDate <= today;
    });
  }

  // Risk assessment statistics
  getRiskStatistics() {
    const risks = this.getRisks();
    const stats = {
      total: risks.length,
      critical: risks.filter(r => r.riskLevel === 'Critical').length,
      high: risks.filter(r => r.riskLevel === 'High').length,
      medium: risks.filter(r => r.riskLevel === 'Medium').length,
      low: risks.filter(r => r.riskLevel === 'Low').length,
      dueForReview: this.getRisksDueForReview().length
    };
    return stats;
  }

  // User management methods
  addUser(user) {
    const users = this.getUsers();
    const newUser = {
      ...user,
      id: `user${Date.now()}`,
      createdDate: new Date().toISOString(),
      status: 'active',
      lastLogin: null
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  updateUser(userId, updates) {
    const users = this.getUsers();
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    );
    this.saveUsers(updatedUsers);
    return updatedUsers.find(user => user.id === userId);
  }

  deleteUser(userId) {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    this.saveUsers(filteredUsers);
  }

  getUserById(userId) {
    const users = this.getUsers();
    return users.find(user => user.id === userId);
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  }

  // Asset request management
  getAssetRequests() {
    return JSON.parse(localStorage.getItem('assetRequests') || '[]');
  }

  saveAssetRequests(requests) {
    localStorage.setItem('assetRequests', JSON.stringify(requests));
  }

  addAssetRequest(request) {
    const requests = this.getAssetRequests();
    const newRequest = {
      ...request,
      id: `assetReq${Date.now()}`,
      requestDate: new Date().toISOString(),
      status: 'pending',
      approvalHistory: []
    };
    requests.push(newRequest);
    this.saveAssetRequests(requests);
    return newRequest;
  }

  // Notification management
  getNotifications() {
    return JSON.parse(localStorage.getItem('notifications') || '[]');
  }

  saveNotifications(notifications) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  addNotification(notification) {
    const notifications = this.getNotifications();
    const newNotification = {
      ...notification,
      id: `notif${Date.now()}`,
      createdDate: new Date().toISOString(),
      read: false
    };
    notifications.unshift(newNotification); // Add to beginning
    this.saveNotifications(notifications);
    return newNotification;
  }

  markNotificationAsRead(notificationId) {
    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    this.saveNotifications(updatedNotifications);
  }

  getUnreadNotifications(userId) {
    const notifications = this.getNotifications();
    return notifications.filter(notif => 
      (notif.recipientId === userId || notif.recipientRole) && !notif.read
    );
  }

  // Approval workflow methods
  approveAccessRequest(requestId, approvalData) {
    try {
      console.log('Approval attempt:', { requestId, approvalData });
      
      const requests = this.getAccessRequests();
      const requestIndex = requests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        throw new Error('Request not found');
      }

      const request = requests[requestIndex];
      console.log('Found request:', request);
      
      // Prevent self-approval: Check if approver is the same as requester
      if (request.requesterId === approvalData.approverId) {
        throw new Error('Users cannot approve their own access requests. Please contact your manager or ISO for approval.');
      }
      
      // Validate that the approver has the right role/permissions
      let currentUser = this.getUserById(approvalData.approverId);
      console.log('Current user found by ID:', currentUser);
      
      // If user not found by ID, try to find by email (fallback)
      if (!currentUser && approvalData.approvedBy) {
        // Try to extract user info from approvedBy name or create a temporary user object
        // This is a fallback mechanism for demo users
        const allUsers = this.getUsers();
        currentUser = allUsers.find(u => u.name === approvalData.approvedBy);
        console.log('Fallback user search by name:', currentUser);
      }
      
      // If still not found, create a temporary user object based on current session
      if (!currentUser) {
        // Get the current user from localStorage as fallback
        const sessionUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (sessionUser && sessionUser.role) {
          currentUser = sessionUser;
          console.log('Using session user as fallback:', currentUser);
        } else {
          throw new Error('Approver not found and no valid session user');
        }
      }
      
      // Check approval permissions
      const canApprove = this.canApproveAccessRequest(currentUser, request);
      console.log('Can approve?', canApprove);
      
      if (!canApprove) {
        throw new Error('You do not have permission to approve this access request.');
      }
      
      const updatedRequest = {
        ...request,
        status: 'approved',
        approvalDate: new Date().toISOString(),
        approvedBy: approvalData.approvedBy,
        approverComments: approvalData.comments,
        approvalHistory: [
          ...(request.approvalHistory || []),
          {
            action: 'approved',
            date: new Date().toISOString(),
            approver: approvalData.approvedBy,
            comments: approvalData.comments
          }
        ]
      };

      requests[requestIndex] = updatedRequest;
      this.saveAccessRequests(requests);

      // Create notification for requester
      this.addNotification({
        type: 'approval_granted',
        title: 'Access Request Approved',
        message: `Your access request for ${request.resourceName || 'requested resource'} has been approved.`,
        recipientId: request.requesterId,
        requestId: requestId,
        priority: 'high'
      });

      // Notify admin
      this.addNotification({
        type: 'approval_completed',
        title: 'Access Request Processed',
        message: `Access request for ${request.resourceName || 'requested resource'} by ${request.requesterName} has been approved.`,
        recipientRole: 'admin',
        requestId: requestId,
        priority: 'normal'
      });

      return updatedRequest;
    } catch (error) {
      console.error('Error in approveAccessRequest:', error);
      throw error;
    }
  }

  rejectAccessRequest(requestId, rejectionData) {
    const requests = this.getAccessRequests();
    const requestIndex = requests.findIndex(req => req.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('Request not found');
    }

    const request = requests[requestIndex];
    const updatedRequest = {
      ...request,
      status: 'rejected',
      rejectionDate: new Date().toISOString(),
      rejectedBy: rejectionData.rejectedBy,
      rejectionReason: rejectionData.reason,
      approvalHistory: [
        ...(request.approvalHistory || []),
        {
          action: 'rejected',
          date: new Date().toISOString(),
          approver: rejectionData.rejectedBy,
          reason: rejectionData.reason
        }
      ]
    };

    requests[requestIndex] = updatedRequest;
    this.saveAccessRequests(requests);

    // Create notification for requester
    this.addNotification({
      type: 'approval_denied',
      title: 'Access Request Rejected',
      message: `Your access request for ${request.resourceName} has been rejected. Reason: ${rejectionData.reason}`,
      recipientId: request.requesterId,
      requestId: requestId,
      priority: 'high'
    });

    // Notify admin
    this.addNotification({
      type: 'approval_completed',
      title: 'Access Request Processed',
      message: `Access request for ${request.resourceName} by ${request.requesterName} has been rejected.`,
      recipientRole: 'admin',
      requestId: requestId,
      priority: 'normal'
    });

    return updatedRequest;
  }

  // Enhanced access request creation with resource routing
  createAccessRequest(requestData, currentUser) {
    const resources = this.getResources();
    const selectedResource = resources.find(res => res.id === requestData.resourceId);
    
    if (!selectedResource) {
      throw new Error('Resource not found');
    }

    // Determine routing based on resource department
    let routingDepartment = selectedResource.department;
    if (selectedResource.category === 'Infrastructure' || selectedResource.category === 'Database' || selectedResource.category === 'Application') {
      routingDepartment = 'Information Technology';
    }

    const newRequest = {
      ...requestData,
      id: `accessReq${Date.now()}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      requesterDepartment: currentUser.department,
      requesterRole: currentUser.role, // Store requester's role for approval hierarchy
      resourceId: selectedResource.id,
      resourceName: selectedResource.name,
      resourceCategory: selectedResource.category,
      routingDepartment: routingDepartment,
      requestDate: new Date().toISOString(),
      status: 'pending',
      priority: requestData.urgency || 'medium',
      approvalHistory: []
    };

    const requests = this.getAccessRequests();
    requests.push(newRequest);
    this.saveAccessRequests(requests);

    // Create notification for appropriate department/admin
    const targetRole = routingDepartment === 'Information Technology' ? 'iso' : 'manager';
    
    this.addNotification({
      type: 'access_request_new',
      title: 'New Access Request',
      message: `${currentUser.name} has requested access to ${selectedResource.name}`,
      recipientRole: targetRole,
      requestId: newRequest.id,
      priority: requestData.urgency === 'urgent' ? 'urgent' : 'normal'
    });

    // Confirmation notification for requester
    this.addNotification({
      type: 'request_submitted',
      title: 'Access Request Submitted',
      message: `Your request for ${selectedResource.name} has been submitted and is under review.`,
      recipientId: currentUser.id,
      requestId: newRequest.id,
      priority: 'normal'
    });

    return newRequest;
  }

  // Get pending requests for approval
  getPendingAccessRequestsForUser(user) {
    const requests = this.getAccessRequests();
    const userRole = user.role;

    return requests.filter(request => {
      if (request.status !== 'pending') return false;
      
      // Admin can approve all requests
      if (userRole === 'admin') return true;
      
      // Managers can approve requests routed to their department
      if (userRole === 'manager') {
        return request.routingDepartment === user.department || 
               request.routingDepartment === 'Management';
      }
      
      // ISO can approve all requests according to role hierarchy
      if (userRole === 'iso') {
        // ISO can see and approve all access requests except those from other ISO/admin users
        // This is checked in canApproveAccessRequest method
        return true;
      }
      
      return false;
    });
  }

  // Get user's own requests
  getUserAccessRequests(userId) {
    const requests = this.getAccessRequests();
    return requests.filter(request => request.requesterId === userId);
  }

  // Check if user can approve access requests
  canApproveAccessRequest(user, request) {
    console.log('Checking approval permissions for:', { user, request });
    
    // Get requester's details to determine their role
    // First try by ID, then by email, fallback to stored role in request
    const requester = this.getUserById(request.requesterId) || 
                     this.getUserByEmail(request.requesterEmail) || 
                     { role: request.requesterRole || request.role || 'employee' };
    
    console.log('Requester found:', requester);
    const requesterRole = requester.role;
    
    // Prevent self-approval - users cannot approve their own requests
    if (user.id === request.requesterId || user.email === request.requesterEmail) {
      console.log('Self-approval detected - blocking');
      return false;
    }
    
    // Role hierarchy approval logic:
    // 1. Admin can approve/reject ALL requests (including ISO requests)
    // 2. ISO can approve/reject employee, manager, and other ISO requests
    // 3. Manager can approve requests from employees in their department
    // 4. Employees cannot approve requests
    
    console.log('User role:', user.role, 'Requester role:', requesterRole);
    
    if (user.role === 'admin') {
      // Admin can approve all requests from any role
      console.log('Admin approval - allowed');
      return true;
    }
    
    if (user.role === 'iso') {
      // ISO can approve requests from employees, managers, and other ISO users
      // Only admin requests require admin approval
      const canApprove = requesterRole === 'employee' || requesterRole === 'manager' || requesterRole === 'iso';
      console.log('ISO approval check:', canApprove);
      return canApprove;
    }
    
    if (user.role === 'manager') {
      // Manager can approve requests from employees in their department
      const canApprove = requesterRole === 'employee' && 
             (request.routingDepartment === user.department || 
              request.requesterDepartment === user.department);
      console.log('Manager approval check:', canApprove, { requesterRole, routingDept: request.routingDepartment, requesterDept: request.requesterDepartment, userDept: user.department });
      return canApprove;
    }
    
    // All other roles cannot approve requests
    console.log('No approval permissions for role:', user.role);
    return false;
  }

  updateAssetRequest(requestId, updates) {
    const requests = this.getAssetRequests();
    const updatedRequests = requests.map(req => 
      req.id === requestId ? { ...req, ...updates } : req
    );
    this.saveAssetRequests(updatedRequests);
    return updatedRequests.find(req => req.id === requestId);
  }

  // Check if user can approve asset requests
  canApproveAssetRequest(user, requestAmount) {
    const roles = this.getRoles();
    const userRole = roles.find(role => role.id === user.role);
    
    if (!userRole) return false;
    
    // Admin can approve unlimited
    if (userRole.assetApprovalLimit === null) return true;
    
    // Check if amount is within user's approval limit
    return requestAmount <= userRole.assetApprovalLimit;
  }

  // Get approval chain for asset requests
  getApprovalChain(requestAmount, department) {
    const chain = [];
    
    // Department manager first (if amount <= 5000)
    if (requestAmount <= 5000) {
      const managers = this.getUsersByRole('manager').filter(u => u.department === department);
      if (managers.length > 0) {
        chain.push({ level: 'manager', users: managers });
      }
    }
    
    // CTO/CEO for higher amounts or if no department manager
    if (requestAmount > 5000 || chain.length === 0) {
      const executives = this.getUsersByRole('admin');
      chain.push({ level: 'executive', users: executives });
    }
    
    return chain;
  }

  // Policy acknowledgment management
  getPolicyAcknowledgments() {
    return JSON.parse(localStorage.getItem('policyAcknowledgments') || '[]');
  }

  savePolicyAcknowledgments(acknowledgments) {
    localStorage.setItem('policyAcknowledgments', JSON.stringify(acknowledgments));
  }

  addPolicyAcknowledgment(acknowledgment) {
    const acknowledgments = this.getPolicyAcknowledgments();
    const newAck = {
      ...acknowledgment,
      id: `ack${Date.now()}`,
      acknowledgedDate: new Date().toISOString()
    };
    acknowledgments.push(newAck);
    this.savePolicyAcknowledgments(acknowledgments);
    return newAck;
  }


  updateAccessRequestStatus(requestId, status, approverId, reason = null) {
    const requests = this.getAccessRequests();
    const updatedRequests = requests.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status, 
            approver: approverId,
            approvedDate: status === 'approved' ? new Date().toISOString() : null,
            rejectedReason: reason
          } 
        : req
    );
    this.saveAccessRequests(updatedRequests);
    return updatedRequests.find(req => req.id === requestId);
  }

  // Quiz/Assessment management
  getQuizzes() {
    return JSON.parse(localStorage.getItem('quizzes') || '[]');
  }

  saveQuizzes(quizzes) {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }

  getUserProgress(userId) {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    return progress[userId] || { completedCourses: [], quizResults: [], acknowledgments: [] };
  }

  saveUserProgress(userId, progress) {
    const allProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    allProgress[userId] = progress;
    localStorage.setItem('userProgress', JSON.stringify(allProgress));
  }

  // Module gating: initialize per-course module progress if missing
  initializeCourseModuleProgress(userId, courseId, moduleCount = 4, passingScore = 80) {
    const progress = this.getUserProgress(userId);
    const updated = { ...progress };
    if (!updated.courses) updated.courses = {};
    if (!updated.courses[courseId]) {
      updated.courses[courseId] = {
        moduleCount,
        passingScore,
        currentModuleIndex: 0,
        modules: Array.from({ length: moduleCount }, (_, i) => ({
          index: i,
          unlocked: i === 0,
          passed: false,
          score: null,
          attempts: 0
        }))
      };
      this.saveUserProgress(userId, updated);
    }
    return updated.courses[courseId];
  }

  // Get module progress for a specific course
  getCourseModuleProgress(userId, courseId) {
    const progress = this.getUserProgress(userId);
    return progress?.courses?.[courseId] || null;
  }

  // Record a quiz result for a specific module and unlock next on pass
  recordQuizResultForModule(userId, courseId, moduleIndex, score) {
    const progress = this.getUserProgress(userId);
    if (!progress?.courses?.[courseId]) return null;
    const courseProg = progress.courses[courseId];
    const passing = score >= (courseProg.passingScore ?? 80);

    const mod = courseProg.modules?.[moduleIndex];
    if (!mod) return null;

    mod.score = score;
    mod.attempts = (mod.attempts || 0) + 1;
    if (passing) {
      mod.passed = true;
      const nextIndex = moduleIndex + 1;
      courseProg.currentModuleIndex = Math.min(nextIndex, (courseProg.moduleCount || courseProg.modules.length) - 1);
      if (nextIndex < (courseProg.moduleCount || courseProg.modules.length)) {
        courseProg.modules[nextIndex].unlocked = true;
      }
    }

    this.saveUserProgress(userId, progress);
    return { passed: passing, progress: courseProg };
  }

  // Check if all modules are passed for a course
  isCourseFullyCompleted(userId, courseId) {
    const courseProg = this.getCourseModuleProgress(userId, courseId);
    if (!courseProg) return false;
    return courseProg.modules?.every(m => m.passed) || false;
  }

  // Access Review management
  getAccessReviews() {
    return JSON.parse(localStorage.getItem('accessReviews') || '[]');
  }

  saveAccessReviews(reviews) {
    localStorage.setItem('accessReviews', JSON.stringify(reviews));
  }

  startAccessReview(reviewId, managerId) {
    const reviews = this.getAccessReviews();
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }

    const review = reviews[reviewIndex];
    const updatedReview = {
      ...review,
      status: 'in-progress',
      startedDate: new Date().toISOString(),
      startedBy: managerId,
      reviewedUsers: 0
    };

    reviews[reviewIndex] = updatedReview;
    this.saveAccessReviews(reviews);

    // Create notification for team
    this.addNotification({
      type: 'review_started',
      title: 'Access Review Started',
      message: `The access review "${review.title}" has been initiated by ${review.manager}`,
      recipientRole: 'admin',
      priority: 'normal'
    });

    return updatedReview;
  }

  completeAccessReview(reviewId, managerId) {
    const reviews = this.getAccessReviews();
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }

    const review = reviews[reviewIndex];
    const updatedReview = {
      ...review,
      status: 'completed',
      completedDate: new Date().toISOString(),
      completedBy: managerId,
      reviewedUsers: review.totalUsers
    };

    reviews[reviewIndex] = updatedReview;
    this.saveAccessReviews(reviews);

    // Create completion notification
    this.addNotification({
      type: 'review_completed',
      title: 'Access Review Completed',
      message: `The access review "${review.title}" has been completed by ${review.manager}`,
      recipientRole: 'admin',
      priority: 'normal'
    });

    return updatedReview;
  }

  addAccessReview(reviewData) {
    const reviews = this.getAccessReviews();
    const newReview = {
      ...reviewData,
      id: `review${Date.now()}`,
      createdDate: new Date().toISOString(),
      status: 'pending',
      reviewedUsers: 0,
      approvedUsers: 0,
      revokedUsers: 0
    };
    reviews.push(newReview);
    this.saveAccessReviews(reviews);
    return newReview;
  }

  updateAccessReview(reviewId, updates) {
    const reviews = this.getAccessReviews();
    const updatedReviews = reviews.map(review => 
      review.id === reviewId ? { ...review, ...updates } : review
    );
    this.saveAccessReviews(updatedReviews);
    return updatedReviews.find(review => review.id === reviewId);
  }

  deleteAccessReview(reviewId) {
    const reviews = this.getAccessReviews();
    const filteredReviews = reviews.filter(review => review.id !== reviewId);
    this.saveAccessReviews(filteredReviews);
  }

  getAccessReviewById(reviewId) {
    const reviews = this.getAccessReviews();
    return reviews.find(review => review.id === reviewId);
  }

  // Certificate management methods
  getCertificates() {
    return JSON.parse(localStorage.getItem('certificates') || '[]');
  }

  saveCertificates(certificates) {
    localStorage.setItem('certificates', JSON.stringify(certificates));
  }

  addCertificate(certificate) {
    const certificates = this.getCertificates();
    const newCertificate = {
      ...certificate,
      id: certificate.id || `cert${Date.now()}`,
      createdDate: new Date().toISOString(),
      status: 'active'
    };
    certificates.push(newCertificate);
    this.saveCertificates(certificates);
    
    // Create notification for certificate recipient
    this.addNotification({
      type: 'certificate_issued',
      title: 'Certificate Issued',
      message: `You have been issued a certificate for ${certificate.courseName}`,
      recipientId: certificate.recipientId,
      priority: 'normal',
      certificateId: newCertificate.id
    });
    
    return newCertificate;
  }

  getCertificateById(certificateId) {
    const certificates = this.getCertificates();
    return certificates.find(cert => cert.id === certificateId);
  }

  getCertificatesByUser(userId) {
    const certificates = this.getCertificates();
    return certificates.filter(cert => cert.recipientId === userId);
  }

  getCertificatesByCourse(courseId) {
    const certificates = this.getCertificates();
    return certificates.filter(cert => cert.courseId === courseId);
  }

  updateCertificate(certificateId, updates) {
    const certificates = this.getCertificates();
    const updatedCertificates = certificates.map(cert => 
      cert.id === certificateId ? { ...cert, ...updates } : cert
    );
    this.saveCertificates(updatedCertificates);
    return updatedCertificates.find(cert => cert.id === certificateId);
  }

  deleteCertificate(certificateId) {
    const certificates = this.getCertificates();
    const filteredCertificates = certificates.filter(cert => cert.id !== certificateId);
    this.saveCertificates(filteredCertificates);
  }

  verifyCertificate(verificationCode) {
    const certificates = this.getCertificates();
    return certificates.find(cert => 
      cert.verificationCode === verificationCode && cert.status === 'active'
    );
  }

  revokeCertificate(certificateId, reason) {
    const certificate = this.getCertificateById(certificateId);
    if (!certificate) {
      throw new Error('Certificate not found');
    }

    const updatedCertificate = this.updateCertificate(certificateId, {
      status: 'revoked',
      revokedDate: new Date().toISOString(),
      revocationReason: reason
    });

    // Create notification for certificate holder
    this.addNotification({
      type: 'certificate_revoked',
      title: 'Certificate Revoked',
      message: `Your certificate for ${certificate.courseName} has been revoked. Reason: ${reason}`,
      recipientId: certificate.recipientId,
      priority: 'high',
      certificateId: certificateId
    });

    return updatedCertificate;
  }

  renewCertificate(certificateId, newExpiryDate) {
    const certificate = this.getCertificateById(certificateId);
    if (!certificate) {
      throw new Error('Certificate not found');
    }

    const updatedCertificate = this.updateCertificate(certificateId, {
      expiryDate: newExpiryDate,
      renewedDate: new Date().toISOString(),
      status: 'active'
    });

    // Create notification for certificate holder
    this.addNotification({
      type: 'certificate_renewed',
      title: 'Certificate Renewed',
      message: `Your certificate for ${certificate.courseName} has been renewed until ${new Date(newExpiryDate).toLocaleDateString()}`,
      recipientId: certificate.recipientId,
      priority: 'normal',
      certificateId: certificateId
    });

    return updatedCertificate;
  }

  getExpiringCertificates(daysFromNow = 30) {
    const certificates = this.getCertificates();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysFromNow);
    
    return certificates.filter(cert => {
      if (cert.status !== 'active') return false;
      const expiryDate = new Date(cert.expiryDate);
      return expiryDate <= futureDate;
    });
  }

  getCertificateStatistics() {
    const certificates = this.getCertificates();
    return {
      total: certificates.length,
      active: certificates.filter(c => c.status === 'active').length,
      revoked: certificates.filter(c => c.status === 'revoked').length,
      expired: certificates.filter(c => {
        if (c.status !== 'active') return false;
        return new Date(c.expiryDate) < new Date();
      }).length,
      expiringSoon: this.getExpiringCertificates(30).length
    };
  }

  // Bulk certificate operations
  addMultipleCertificates(certificates) {
    const results = [];
    certificates.forEach(cert => {
      try {
        const added = this.addCertificate(cert);
        results.push({ success: true, certificate: added });
      } catch (error) {
        results.push({ success: false, error: error.message, certificate: cert });
      }
    });
    return results;
  }

  searchCertificates(searchTerm) {
    const certificates = this.getCertificates();
    const term = searchTerm.toLowerCase();
    
    return certificates.filter(cert => 
      cert.recipientName?.toLowerCase().includes(term) ||
      cert.courseName?.toLowerCase().includes(term) ||
      cert.verificationCode?.toLowerCase().includes(term) ||
      cert.issuer?.toLowerCase().includes(term)
    );
  }

  // Password Reset Management
  getPasswordResetRequests() {
    return JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
  }

  savePasswordResetRequests(requests) {
    localStorage.setItem('passwordResetRequests', JSON.stringify(requests));
  }

  createPasswordResetRequest(requestData, currentUser) {
    const requests = this.getPasswordResetRequests();
    const newRequest = {
      ...requestData,
      id: `pwdReset${Date.now()}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      requesterDepartment: currentUser.department,
      requesterRole: currentUser.role,
      requestDate: new Date().toISOString(),
      status: 'pending_approval',
      priority: requestData.priority || 'normal',
      approvalHistory: []
    };

    requests.push(newRequest);
    this.savePasswordResetRequests(requests);

    // Create notification for ISO (security approval required)
    this.addNotification({
      type: 'password_reset_request',
      title: 'New Password Reset Request - Security Review',
      message: `${currentUser.name} has requested a password reset for ${requestData.applicationName}. Security or departmental approval required before IT processing.`,
      recipientRole: 'iso',
      requestId: newRequest.id,
      priority: requestData.priority === 'urgent' ? 'high' : 'normal'
    });

    // Also notify department managers if requester is an employee
    if (currentUser.role === 'employee') {
      const departmentManagers = this.getUsersByRole('manager')
        .filter(manager => manager.department === currentUser.department);
      
      if (departmentManagers.length > 0) {
        departmentManagers.forEach(manager => {
          this.addNotification({
            type: 'password_reset_request',
            title: 'Password Reset Request from Team Member',
            message: `${currentUser.name} from your department has requested a password reset for ${requestData.applicationName}. You can approve this as their department manager.`,
            recipientId: manager.id,
            requestId: newRequest.id,
            priority: requestData.priority === 'urgent' ? 'high' : 'normal'
          });
        });
      }
    }

    // Confirmation notification for requester
    this.addNotification({
      type: 'password_reset_submitted',
      title: 'Password Reset Request Submitted',
      message: `Your password reset request for ${requestData.applicationName} has been submitted for approval. It can be approved by ISO or your department manager and will then be forwarded to IT for processing.`,
      recipientId: currentUser.id,
      requestId: newRequest.id,
      priority: 'normal'
    });

    return newRequest;
  }

  updatePasswordResetRequest(requestId, updates) {
    const requests = this.getPasswordResetRequests();
    const updatedRequests = requests.map(req => 
      req.id === requestId ? { ...req, ...updates, updatedDate: new Date().toISOString() } : req
    );
    this.savePasswordResetRequests(updatedRequests);
    return updatedRequests.find(req => req.id === requestId);
  }

  processPasswordResetRequest(requestId, adminData) {
    const requests = this.getPasswordResetRequests();
    const requestIndex = requests.findIndex(req => req.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('Password reset request not found');
    }

    const request = requests[requestIndex];
    const currentUser = this.getUserById(adminData.processedBy) || { role: 'unknown' };
    
    let updatedRequest;
    
    // Handle approval (ISO or Department Manager)
    if (request.status === 'pending_approval') {
      // Check if user can approve this request
      const canApprove = this.canApprovePasswordResetRequest(currentUser, request);
      
      if (!canApprove) {
        throw new Error('You do not have permission to approve this password reset request');
      }
      
      if (adminData.action === 'approved') {
        const approverRole = currentUser.role;
        const approverType = approverRole === 'iso' ? 'ISO' : 'Department Manager';
        
        updatedRequest = {
          ...request,
          status: 'pending_admin_processing',
          approvedDate: new Date().toISOString(),
          approvedBy: adminData.processedBy,
          approverRole: approverRole,
          approverComments: adminData.comments,
          approvalHistory: [
            ...(request.approvalHistory || []),
            {
              action: 'approved',
              date: new Date().toISOString(),
              approver: adminData.processedBy,
              approverRole: approverRole,
              comments: adminData.comments
            }
          ]
        };
        
        // Notify admin/IT for processing
        this.addNotification({
          type: 'password_reset_request',
          title: 'Password Reset Request - Ready for Processing',
          message: `Password reset request for ${request.applicationName} by ${request.requesterName} has been approved by ${approverType} and is ready for IT processing.`,
          recipientRole: 'admin',
          requestId: requestId,
          priority: request.priority === 'urgent' ? 'high' : 'normal'
        });
        
        // Notify requester of approval
        this.addNotification({
          type: 'password_reset_approved',
          title: `Password Reset Request Approved by ${approverType}`,
          message: `Your password reset request for ${request.applicationName} has been approved by ${approverType} and forwarded to IT for processing.`,
          recipientId: request.requesterId,
          requestId: requestId,
          priority: 'normal'
        });
      } else {
        // Request rejected
        const approverRole = currentUser.role;
        const approverType = approverRole === 'iso' ? 'ISO' : 'Department Manager';
        
        updatedRequest = {
          ...request,
          status: 'rejected',
          rejectedDate: new Date().toISOString(),
          rejectedBy: adminData.processedBy,
          rejectedByRole: approverRole,
          rejectionReason: adminData.comments,
          approvalHistory: [
            ...(request.approvalHistory || []),
            {
              action: 'rejected',
              date: new Date().toISOString(),
              approver: adminData.processedBy,
              approverRole: approverRole,
              reason: adminData.comments
            }
          ]
        };
        
        // Notify requester of rejection
        this.addNotification({
          type: 'password_reset_rejected',
          title: `Password Reset Request Rejected by ${approverType}`,
          message: `Your password reset request for ${request.applicationName} has been rejected by ${approverType}. Reason: ${adminData.comments}`,
          recipientId: request.requesterId,
          requestId: requestId,
          priority: 'high'
        });
      }
    }
    // Handle admin/IT processing after approval
    else if (request.status === 'pending_admin_processing' && currentUser.role === 'admin') {
      updatedRequest = {
        ...request,
        status: adminData.action, // 'completed' or 'rejected'
        processedDate: new Date().toISOString(),
        processedBy: adminData.processedBy,
        adminComments: adminData.comments,
        newPassword: adminData.action === 'completed' ? adminData.newPassword : null,
        approvalHistory: [
          ...(request.approvalHistory || []),
          {
            action: adminData.action,
            date: new Date().toISOString(),
            processor: adminData.processedBy,
            comments: adminData.comments
          }
        ]
      };

      // Notify requester about final status
      const notificationTitle = adminData.action === 'completed' ? 'Password Reset Completed' : 'Password Reset Request Rejected';
      const notificationMessage = adminData.action === 'completed' 
        ? `Your password for ${request.applicationName} has been reset. Check your email for the new credentials.`
        : `Your password reset request for ${request.applicationName} has been rejected by IT. Reason: ${adminData.comments}`;

      this.addNotification({
        type: adminData.action === 'completed' ? 'password_reset_completed' : 'password_reset_rejected',
        title: notificationTitle,
        message: notificationMessage,
        recipientId: request.requesterId,
        requestId: requestId,
        priority: 'high'
      });
    } else {
      throw new Error('Invalid request status or user role for processing this request');
    }

    requests[requestIndex] = updatedRequest;
    this.savePasswordResetRequests(requests);

    return updatedRequest;
  }

  getUserPasswordResetRequests(userId) {
    const requests = this.getPasswordResetRequests();
    return requests.filter(request => request.requesterId === userId);
  }

  getPendingPasswordResetRequests() {
    const requests = this.getPasswordResetRequests();
    return requests.filter(request => 
      request.status === 'pending_iso_approval' || 
      request.status === 'pending_admin_processing'
    );
  }

  getPasswordResetRequestsForRole(userRole, userId = null) {
    const requests = this.getPasswordResetRequests();
    
    if (userRole === 'iso') {
      // ISO users should see requests pending approval
      return requests.filter(request => request.status === 'pending_approval');
    }
    
    if (userRole === 'manager' && userId) {
      // Managers should see requests from employees in their department that are pending approval
      const manager = this.getUserById(userId);
      if (manager) {
        return requests.filter(request => 
          request.status === 'pending_approval' &&
          request.requesterDepartment === manager.department &&
          request.requesterRole === 'employee'
        );
      }
    }
    
    if (userRole === 'admin') {
      // Admin users should see requests ready for processing after approval
      return requests.filter(request => request.status === 'pending_admin_processing');
    }
    
    return [];
  }

  // Check if user can approve password reset requests
  canApprovePasswordResetRequest(user, request) {
    // Admin can process approved requests
    if (user.role === 'admin' && request.status === 'pending_admin_processing') {
      return true;
    }
    
    // Check approval permissions for pending requests
    if (request.status === 'pending_approval') {
      // ISO can approve any employee or manager request
      if (user.role === 'iso') {
        return request.requesterRole === 'employee' || request.requesterRole === 'manager';
      }
      
      // Department managers can approve requests from employees in their department only
      if (user.role === 'manager') {
        return request.requesterRole === 'employee' && 
               request.requesterDepartment === user.department;
      }
    }
    
    return false;
  }

  // Document Management CRUD
  getDocuments() {
    return JSON.parse(localStorage.getItem('documents') || '[]');
  }

  saveDocuments(documents) {
    localStorage.setItem('documents', JSON.stringify(documents));
  }

  addDocument(document) {
    const documents = this.getDocuments();
    const newDocument = {
      ...document,
      id: `doc${Date.now()}`,
      version: '1.0',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      status: 'active'
    };
    documents.push(newDocument);
    this.saveDocuments(documents);
    return newDocument;
  }

  updateDocument(documentId, updates) {
    const documents = this.getDocuments();
    const updatedDocuments = documents.map(doc => 
      doc.id === documentId ? { 
        ...doc, 
        ...updates, 
        updatedDate: new Date().toISOString(),
        version: this.incrementVersion(doc.version)
      } : doc
    );
    this.saveDocuments(updatedDocuments);
    return updatedDocuments.find(doc => doc.id === documentId);
  }

  deleteDocument(documentId) {
    const documents = this.getDocuments();
    const filteredDocuments = documents.filter(doc => doc.id !== documentId);
    this.saveDocuments(filteredDocuments);
  }

  getDocumentById(documentId) {
    const documents = this.getDocuments();
    return documents.find(doc => doc.id === documentId);
  }

  incrementVersion(currentVersion) {
    const parts = currentVersion.split('.');
    const major = parseInt(parts[0]) || 1;
    const minor = parseInt(parts[1]) || 0;
    return `${major}.${minor + 1}`;
  }

  // Learning Management CRUD
  getCourses() {
    return JSON.parse(localStorage.getItem('learningCourses') || '[]');
  }

  saveCourses(courses) {
    localStorage.setItem('learningCourses', JSON.stringify(courses));
  }

  addCourse(course) {
    const courses = this.getCourses();
    const newCourse = {
      ...course,
      id: `course${Date.now()}`,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      status: 'draft',
      enrolledCount: 0,
      completedCount: 0
    };
    courses.push(newCourse);
    this.saveCourses(courses);
    return newCourse;
  }

  updateCourse(courseId, updates) {
    const courses = this.getCourses();
    const updatedCourses = courses.map(course => 
      course.id === courseId ? { 
        ...course, 
        ...updates, 
        updatedDate: new Date().toISOString()
      } : course
    );
    this.saveCourses(updatedCourses);
    return updatedCourses.find(course => course.id === courseId);
  }

  deleteCourse(courseId) {
    const courses = this.getCourses();
    const filteredCourses = courses.filter(course => course.id !== courseId);
    this.saveCourses(filteredCourses);
  }

  getCourseById(courseId) {
    const courses = this.getCourses();
    return courses.find(course => course.id === courseId);
  }

  // Access Request Update and Delete
  updateAccessRequest(requestId, updates) {
    const requests = this.getAccessRequests();
    const updatedRequests = requests.map(req => 
      req.id === requestId ? { 
        ...req, 
        ...updates, 
        updatedDate: new Date().toISOString()
      } : req
    );
    this.saveAccessRequests(updatedRequests);
    return updatedRequests.find(req => req.id === requestId);
  }

  deleteAccessRequest(requestId) {
    const requests = this.getAccessRequests();
    const filteredRequests = requests.filter(req => req.id !== requestId);
    this.saveAccessRequests(filteredRequests);
  }

  getAccessRequestById(requestId) {
    const requests = this.getAccessRequests();
    return requests.find(req => req.id === requestId);
  }


  calculateRiskScore(impact, likelihood) {
    const impactScore = { 'very low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very high': 5 }[impact.toLowerCase()];
    const likelihoodScore = { 'very low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very high': 5 }[likelihood.toLowerCase()];
    return impactScore * likelihoodScore;
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;
