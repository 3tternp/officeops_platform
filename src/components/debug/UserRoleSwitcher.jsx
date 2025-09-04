import React from 'react';
import { useUser } from '../../contexts/UserContext';
import Button from '../ui/Button';
import Icon from '../AppIcon';

const UserRoleSwitcher = () => {
  const { currentUser, setCurrentUser } = useUser();

  const availableRoles = [
    { 
      role: 'admin', 
      name: 'Administrator',
      icon: 'Shield',
      user: {
        id: '1',
        name: 'John Admin',
        email: 'admin@demo.com',
        role: 'admin',
        department: 'IT',
        status: 'active'
      }
    },
    { 
      role: 'iso', 
      name: 'ISO Officer',
      icon: 'FileCheck',
      user: {
        id: '2',
        name: 'Sarah ISO',
        email: 'iso@demo.com',
        role: 'iso',
        department: 'Security',
        status: 'active'
      }
    },
    { 
      role: 'manager', 
      name: 'Manager',
      icon: 'Users',
      user: {
        id: '3',
        name: 'Mike Manager',
        email: 'manager@demo.com',
        role: 'manager',
        department: 'Operations',
        status: 'active'
      }
    },
    { 
      role: 'employee', 
      name: 'Employee',
      icon: 'User',
      user: {
        id: '4',
        name: 'Jane Employee',
        email: 'employee@demo.com',
        role: 'employee',
        department: 'Sales',
        status: 'active'
      }
    }
  ];

  const handleRoleSwitch = (roleData) => {
    setCurrentUser(roleData.user);
    // Force a page reload to ensure all components update with the new role
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="hidden lg:flex items-center space-x-2">
      <div className="text-xs text-gray-500 font-medium">DEBUG:</div>
      <select
        value={currentUser?.role || 'employee'}
        onChange={(e) => {
          const selectedRole = availableRoles.find(r => r.role === e.target.value);
          if (selectedRole) {
            handleRoleSwitch(selectedRole);
          }
        }}
        className="text-xs bg-gray-100 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {availableRoles.map((roleData) => (
          <option key={roleData.role} value={roleData.role}>
            {roleData.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserRoleSwitcher;
