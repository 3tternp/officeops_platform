import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useUser } from '../../contexts/UserContext';
import dataService from '../../services/DataService';

const Sidebar = ({ isCollapsed = false, onToggle, isMobileOpen = false, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  // Define navigation groups for better organization
  const navigationGroups = [
    {
      label: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'LayoutDashboard',
          path: '/dashboard',
          description: 'Overview and metrics',
          roles: ['admin', 'iso', 'manager', 'supervisor', 'employee', 'risk_officer'],
          badge: null
        }
      ]
    },
    {
      label: 'Core Modules',
      items: [
        {
          id: 'access-management',
          label: 'Access Management',
          icon: 'Shield',
          path: '/access-management',
          description: 'Permissions and security',
          roles: ['admin', 'iso', 'manager', 'supervisor', 'employee', 'risk_officer'],
          badge: null
        },
        {
          id: 'asset-management',
          label: 'Asset Management',
          icon: 'Package',
          path: '/asset-management',
          description: 'Equipment and inventory',
          roles: ['admin', 'iso', 'manager', 'supervisor', 'risk_officer'],
          badge: null
        },
        {
          id: 'risk-assessment',
          label: 'Risk Assessment',
          icon: 'AlertTriangle',
          path: '/risk-assessment',
          description: 'Risk evaluation and monitoring',
          roles: ['admin', 'iso', 'risk_officer'],
          badge: 'HOT'
        },
        {
          id: 'document-management',
          label: 'Document Management',
          icon: 'FileText',
          path: '/document-management',
          description: 'Policies and documents',
          roles: ['admin', 'iso', 'manager', 'supervisor', 'employee', 'risk_officer'],
          badge: null
        },
        {
          id: 'learning-management',
          label: 'Learning Management',
          icon: 'GraduationCap',
          path: '/learning-management',
          description: 'Training and courses',
          roles: ['admin', 'iso', 'manager', 'supervisor', 'employee', 'risk_officer'],
          badge: null
        }
      ]
    },
    {
      label: 'System Administration',
      items: [
        {
          id: 'user-management',
          label: 'User Management',
          icon: 'Users',
          path: '/user-management',
          description: 'Manage users and roles',
          roles: ['admin'],
          badge: null
        },
        {
          id: 'department-management',
          label: 'Department Management',
          icon: 'Building2',
          path: '/department-management',
          description: 'Manage departments',
          roles: ['admin'],
          badge: null
        }
      ]
    }
  ];

  // Filter navigation groups based on user role
  const filteredNavigationGroups = navigationGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (!currentUser?.role) return false;
        return item.roles.includes(currentUser.role);
      })
    }))
    .filter(group => group.items.length > 0);

  const handleNavigation = (path) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path || location?.pathname?.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-70 h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50/80 border-r border-gray-200/80 shadow-xl backdrop-blur-xl
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/60">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Icon name="Navigation" size={16} className="text-white" />
                </div>
                <span className="font-semibold text-gray-800">Navigation</span>
              </div>
            )}
            <button
              onClick={onToggle}
              className="hidden lg:flex p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {filteredNavigationGroups?.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-2">
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                    {group.label}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items?.map((item) => {
                    const isActive = isActiveRoute(item?.path);
                    
                    return (
                      <div key={item?.id} className="relative group">
                        <button
                          onClick={() => handleNavigation(item?.path)}
                          className={`
                            w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left relative overflow-hidden
                            transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98]
                            ${isActive 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                              : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                            }
                            ${isCollapsed ? 'justify-center' : ''}
                          `}
                        >
                          <Icon 
                            name={item?.icon} 
                            size={20} 
                            className={`flex-shrink-0 z-10 relative ${isActive ? 'text-white' : 'text-gray-600'}`}
                          />
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0 z-10 relative">
                              <div className="flex items-center justify-between">
                                <p className={`font-semibold text-sm truncate ${
                                  isActive ? 'text-white' : 'text-gray-800'
                                }`}>
                                  {item?.label}
                                </p>
                                {item.badge && (
                                  <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded uppercase tracking-wider">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs truncate mt-0.5 ${
                                isActive ? 'text-white/80' : 'text-gray-500'
                              }`}>
                                {item?.description}
                              </p>
                            </div>
                          )}
                          {/* Active indicator */}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-xl" />
                          )}
                        </button>
                        
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-80 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold text-sm">{item?.label}</p>
                              {item.badge && (
                                <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded uppercase">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-300 mt-1">{item?.description}</p>
                            {/* Arrow */}
                            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/settings')}
                >
                  <Icon name="Settings" size={16} className="mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.open('/help', '_blank')}
                >
                  <Icon name="HelpCircle" size={16} className="mr-2" />
                  Help & Support
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/settings')}
                  >
                    <Icon name="Settings" size={16} />
                  </Button>
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-enterprise-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-80 whitespace-nowrap">
                    <p className="text-sm text-popover-foreground">Settings</p>
                  </div>
                </div>
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open('/help', '_blank')}
                  >
                    <Icon name="HelpCircle" size={16} />
                  </Button>
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-enterprise-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-80 whitespace-nowrap">
                    <p className="text-sm text-popover-foreground">Help & Support</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;