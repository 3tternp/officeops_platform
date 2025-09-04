// Demo User Setup Utility
// Ensures proper user permissions for demonstration purposes

export const ensureDemoUser = () => {
  // Prefer the 'user' key (used by UserContext and header role switcher)
  let userFromContext = {};
  let userFromLegacy = {};
  try { userFromContext = JSON.parse(localStorage.getItem('user') || '{}'); } catch {}
  try { userFromLegacy = JSON.parse(localStorage.getItem('currentUser') || '{}'); } catch {}

  // Choose the most complete record
  const chosen = userFromContext?.role ? userFromContext : userFromLegacy;

  if (chosen && chosen.id && chosen.role) {
    // Keep both keys in sync to avoid drift between UserContext and pages
    localStorage.setItem('user', JSON.stringify(chosen));
    localStorage.setItem('currentUser', JSON.stringify(chosen));
    return chosen;
  }
  
  // If no user exists, create a demo employee user by default (not admin!)
  const demoUser = {
    id: 'demo-employee-001',
    name: 'John Employee',
    email: 'employee@officeops-demo.com',
    role: 'employee',
    department: 'General',
    avatar: null,
    loginTime: new Date().toISOString()
  };
  
  localStorage.setItem('currentUser', JSON.stringify(demoUser));
  localStorage.setItem('user', JSON.stringify(demoUser));
  
  console.log('✅ Demo employee user created:', demoUser.name, '(' + demoUser.role + ')');
  console.log('💡 Use the role switcher in header or window.forceSetUser("admin") to become admin');
  return demoUser;
};

export const createDemoUsers = () => {
  const demoUsers = [
    {
      id: 'demo-admin-001',
      name: 'Demo Administrator',
      email: 'admin@officeops-demo.com',
      role: 'admin',
      department: 'Information Technology',
      loginTime: new Date().toISOString()
    },
    {
      id: 'demo-iso-001',
      name: 'ISO Officer',
      email: 'iso@officeops-demo.com',
      role: 'iso',
      department: 'Quality Assurance',
      loginTime: new Date().toISOString()
    },
    {
      id: 'demo-manager-001',
      name: 'Department Manager',
      email: 'manager@officeops-demo.com',
      role: 'manager',
      department: 'Operations',
      loginTime: new Date().toISOString()
    },
    {
      id: 'demo-employee-001',
      name: 'Regular Employee',
      email: 'employee@officeops-demo.com',
      role: 'employee',
      department: 'General',
      loginTime: new Date().toISOString()
    }
  ];
  
  // Save demo users to localStorage for the demo
  localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
  
  return demoUsers;
};

export const switchDemoUser = (userRole) => {
  const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
  const targetUser = demoUsers.find(user => user.role === userRole);
  
  if (targetUser) {
    localStorage.setItem('currentUser', JSON.stringify(targetUser));
    localStorage.setItem('user', JSON.stringify(targetUser));
    
    // Reload the page to reflect changes
    window.location.reload();
    
    return targetUser;
  }
  
  return null;
};

// Initialize demo environment
export const initializeDemoEnvironment = () => {
  createDemoUsers();
  return ensureDemoUser();
};

  // Force clear localStorage and set specific user (for testing)
export const forceSetUser = (roleType = 'employee') => {
  // Clear existing user data
  localStorage.removeItem('currentUser');
  localStorage.removeItem('user');
  
  // Use IDs that match the DataService user database
  const demoUsers = {
    admin: {
      id: 'admin001',
      name: 'Demo Administrator', 
      email: 'admin@demo.com',
      role: 'admin',
      department: 'Information Technology'
    },
    iso: {
      id: 'iso001',
      name: 'Security Officer',
      email: 'iso@demo.com', 
      role: 'iso',
      department: 'Information Technology'
    },
    manager: {
      id: 'mgr001',
      name: 'Department Manager',
      email: 'manager@demo.com',
      role: 'manager',
      department: 'Human Resources'
    },
    employee: {
      id: 'emp001',
      name: 'John Employee',
      email: 'employee@demo.com',
      role: 'employee',
      department: 'Finance'
    }
  };
  
  const user = {
    ...demoUsers[roleType],
    avatar: null,
    loginTime: new Date().toISOString()
  };
  
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('user', JSON.stringify(user));
  
  console.log('🔄 Forced user role switch:', user.name, '(' + user.role + ')');
  return user;
};

// Add this to window for easy testing
if (typeof window !== 'undefined') {
  window.forceSetUser = forceSetUser;
  window.clearUserData = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    console.log('🗑️ Cleared user data from localStorage');
    window.location.reload();
  };
  
  // Force clear and reset to employee
  window.resetToEmployee = () => {
    localStorage.clear(); // Clear ALL localStorage
    forceSetUser('employee');
    console.log('🔄 Reset to employee and cleared all localStorage');
    window.location.reload();
  };
  
  // Debug utilities for testing permissions
  window.checkCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('Current User:', user);
    return user;
  };
  
  window.testPermissions = () => {
    const { hasPermission, PERMISSIONS } = require('./permissions');
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    console.log('\n=== Permission Test Results ===');
    console.log('User:', user.name, '(' + user.role + ')');
    console.log('\nDocument Permissions:');
    console.log('- Create:', hasPermission(user.role, PERMISSIONS.DOCUMENT_CREATE));
    console.log('- Upload:', hasPermission(user.role, PERMISSIONS.DOCUMENT_UPLOAD));
    console.log('\nLMS Permissions:');
    console.log('- Create Course:', hasPermission(user.role, PERMISSIONS.LMS_CREATE_COURSE));
    console.log('- Upload Course:', hasPermission(user.role, PERMISSIONS.LMS_UPLOAD_COURSE));
    console.log('\nAccess Permissions:');
    console.log('- Approve Requests:', hasPermission(user.role, PERMISSIONS.ACCESS_APPROVE));
    console.log('================================\n');
  };
  
  // Quick role switching shortcuts
  window.switchToAdmin = () => forceSetUser('admin');
  window.switchToISO = () => forceSetUser('iso');
  window.switchToManager = () => forceSetUser('manager');
  window.switchToEmployee = () => forceSetUser('employee');
  
  console.log('🔠️  Debug tools available:');
  console.log('- forceSetUser("admin|iso|manager|employee")');
  console.log('- switchToAdmin(), switchToISO(), switchToManager(), switchToEmployee()');
  console.log('- checkCurrentUser()');
  console.log('- testPermissions()');
  console.log('- clearUserData()');
}
