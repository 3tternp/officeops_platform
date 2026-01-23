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
          badge: null
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
        },
        {
          id: 'ticketing',
          label: 'Ticketing',
          icon: 'Ticket',
          path: '/ticketing',
          description: 'Service desk tickets',
          roles: ['admin', 'iso', 'manager', 'employee', 'risk_officer'],
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
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`
          fixed top-14 sm:top-16 left-0 z-50 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-gradient-to-b from-card/95 via-card/90 to-muted/90 border-r border-border/60 shadow-enterprise-lg backdrop-blur-2xl
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16 lg:w-20' : 'w-64 lg:w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border/60">
            {!isCollapsed && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-enterprise-md">
                  <Icon name="Navigation" size={14} className="sm:w-4 sm:h-4" />
                </div>
                <span className="font-medium text-sm sm:text-base text-foreground">Navigation</span>
              </div>
            )}
            <button
              onClick={onToggle}
              className="hidden lg:flex p-1 sm:p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          <nav className="flex-1 p-2 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
            {filteredNavigationGroups?.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-2">
                {!isCollapsed && (
                  <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.16em] px-2 sm:px-3 mb-1.5 sm:mb-2">
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
                            w-full flex items-center space-x-2 sm:space-x-3 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-left relative overflow-hidden
                            transition-enterprise transform hover:-translate-y-0.5
                            ${isActive 
                              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-enterprise-lg ring-1 ring-primary/20' 
                              : 'text-foreground/80 hover:bg-muted/80 hover:text-foreground'
                            }
                            ${isCollapsed ? 'justify-center px-2' : ''}
                          `}
                        >
                          <Icon 
                            name={item?.icon} 
                            size={16}
                            className={`flex-shrink-0 z-10 relative w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                          />
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0 z-10 relative">
                              <div className="flex items-center justify-between">
                                <p className={`font-medium text-xs sm:text-sm truncate ${
                                  isActive ? 'text-primary-foreground' : 'text-foreground'
                                }`}>
                                  {item?.label}
                                </p>
                                {item.badge && (
                                  <span className="px-1 py-0.5 text-xs font-bold bg-red-500 text-white rounded uppercase tracking-wider">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs truncate mt-0.5 ${
                                isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                              }`}>
                                {item?.description}
                              </p>
                            </div>
                          )}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl" />
                          )}
                        </button>
                        
                        {isCollapsed && (
                          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-popover text-popover-foreground border border-border rounded-lg shadow-enterprise-lg opacity-0 group-hover:opacity-100 transition-enterprise pointer-events-none z-50 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-sm">{item?.label}</p>
                              {item.badge && (
                                <span className="px-1.5 py-0.5 text-xs font-semibold bg-error text-error-foreground rounded uppercase">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{item?.description}</p>
                            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-popover" />
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
