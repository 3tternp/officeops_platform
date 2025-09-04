import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useUser } from '../../contexts/UserContext';
import UserRoleSwitcher from "../debug/UserRoleSwitcher";

const Header = ({ onSidebarToggle, sidebarCollapsed = false }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { currentUser, logout } = useUser();

  const notifications = [
    {
      id: 1,
      title: 'Asset Assignment Pending',
      message: 'Laptop assignment for John Doe requires approval',
      time: '5 min ago',
      type: 'warning',
      unread: true
    },
    {
      id: 2,
      title: 'Training Completion',
      message: 'Security awareness training completed by 15 employees',
      time: '1 hour ago',
      type: 'success',
      unread: true
    },
    {
      id: 3,
      title: 'Risk Assessment Due',
      message: 'Quarterly risk assessment due in 3 days',
      time: '2 hours ago',
      type: 'error',
      unread: false
    }
  ];

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    setNotificationOpen(false);
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    setProfileOpen(false);
    
    switch(action) {
      case 'logout':
        logout();
        window.location.href = '/login';
        break;
      case 'profile':
        window.location.href = '/profile';
        break;
      case 'preferences':
        window.location.href = '/settings';
        break;
      case 'help':
        window.open('/help', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-80 bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Logo and Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Icon name="Menu" size={20} />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <Icon name="Building2" size={22} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">OfficeOps</h1>
              <p className="text-xs font-medium text-gray-500 tracking-wide">PLATFORM</p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative">
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search across modules, documents, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded shadow-sm">⌘K</kbd>
              </div>
            </div>
          </form>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Role Switcher for Testing */}
          <UserRoleSwitcher />
          
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Icon name="Search" size={20} />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-90 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{unreadCount} unread messages</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <div
                      key={notification?.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted transition-enterprise ${
                        notification?.unread ? 'bg-accent/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification?.type === 'success' ? 'bg-success' :
                          notification?.type === 'warning' ? 'bg-warning' :
                          notification?.type === 'error' ? 'bg-error' : 'bg-accent'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-popover-foreground">{notification?.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{notification?.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification?.time}</p>
                        </div>
                        {notification?.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Icon name="User" size={18} color="white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-gray-500 font-medium">{currentUser?.role?.toUpperCase() || 'ROLE'}</p>
              </div>
              <Icon name="ChevronDown" size={16} className="hidden sm:block text-gray-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-90 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{currentUser?.name || 'User'}</p>
                      <p className="text-sm text-gray-600">{currentUser?.email || 'email@company.com'}</p>
                      <p className="text-xs font-medium text-blue-600 mt-0.5">{currentUser?.role === 'admin' ? 'Administrator' : currentUser?.role === 'manager' ? 'Manager' : 'Employee'}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => handleProfileAction('profile')}
                    className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-enterprise flex items-center space-x-2"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => handleProfileAction('preferences')}
                    className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-enterprise flex items-center space-x-2"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <button
                    onClick={() => handleProfileAction('help')}
                    className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-enterprise flex items-center space-x-2"
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                </div>
                <div className="border-t border-border py-2">
                  <button
                    onClick={() => handleProfileAction('logout')}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted transition-enterprise flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Search Bar */}
      <div className="md:hidden border-t border-border px-6 py-3">
        <form onSubmit={handleSearch} className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search across modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-enterprise"
          />
        </form>
      </div>
      {/* Overlay for mobile dropdowns */}
      {(notificationOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-70 bg-black/20 backdrop-blur-xs lg:hidden"
          onClick={() => {
            setNotificationOpen(false);
            setProfileOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;