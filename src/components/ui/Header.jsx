import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useUser } from '../../contexts/UserContext';
import UserRoleSwitcher from "../debug/UserRoleSwitcher";
import { useBranding } from '../../contexts/BrandingContext';
import dataService from '../../services/DataService';

const Header = ({ onSidebarToggle, sidebarCollapsed = false }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  const { branding } = useBranding();

  const [notifications, setNotifications] = useState([]);

  const formatTimeAgo = (iso) => {
    if (!iso) return '';
    const diffMs = Date.now() - new Date(iso).getTime();
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) return 'just now';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} min ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} hour${hr !== 1 ? 's' : ''} ago`;
    const day = Math.floor(hr / 24);
    return `${day} day${day !== 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    try {
      const user = currentUser || JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!user?.id) return;
      const allNotifications = dataService.getNotifications();
      const userNotifications = allNotifications
        .filter(notif =>
          notif.recipientId === user.id ||
          notif.recipientRole === user.role ||
          notif.recipientRole === 'all'
        )
        .map(notif => ({
          ...notif,
          unread: !notif.read,
          time: formatTimeAgo(notif.createdDate)
        }));
      setNotifications(userNotifications);
    } catch (e) {
      console.warn('Failed to load notifications', e);
    }
  }, [currentUser, notificationOpen]);

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const handleNotificationClick = (notification) => {
    try {
      dataService.markNotificationAsRead(notification.id);
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, unread: false } : n));
    } catch (e) {
      console.warn('Failed to mark notification as read', e);
    }
    setNotificationOpen(false);
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    setProfileOpen(false);
    
    switch(action) {
      case 'logout':
        logout();
        navigate('/login');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'preferences':
        navigate('/settings');
        break;
      case 'help':
        window.open('/help', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm"
      style={branding?.loginBackgroundImage ? {
        backgroundImage: `url(${branding.loginBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      } : undefined}
    >
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
            <div className="flex items-center justify-center w-10 h-10 rounded-xl shadow-lg overflow-hidden bg-primary">
              {branding?.companyLogo ? (
                <img src={branding.companyLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Icon name="Building2" size={22} color="white" />
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">{branding?.companyName || 'OfficeOps'}</h1>
              <p className="text-xs font-medium text-muted-foreground tracking-wide">PLATFORM</p>
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Search across modules, documents, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full pl-12 pr-4 py-3 text-sm bg-muted border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent focus:bg-background transition-all duration-200 placeholder:text-muted-foreground"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-muted-foreground bg-background border border-border rounded shadow-sm">⌘K</kbd>
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
              className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center font-medium shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 bg-popover border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 bg-muted border-b border-border">
                  <h3 className="font-semibold text-popover-foreground">Notifications</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{unreadCount} unread messages</p>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setNotificationOpen(false);
                      navigate('/access-management', { state: { openTab: 'notifications' } });
                    }}
                  >
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
              className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {currentUser?.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={18} color="white" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-foreground">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground font-medium">{currentUser?.role?.toUpperCase() || 'ROLE'}</p>
              </div>
              <Icon name="ChevronDown" size={16} className="hidden sm:block text-muted-foreground" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 bg-popover border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 bg-muted border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                      {currentUser?.profilePicture ? (
                        <img 
                          src={currentUser.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon name="User" size={20} color="white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-popover-foreground">{currentUser?.name || 'User'}</p>
                      <p className="text-sm text-muted-foreground">{currentUser?.email || 'email@company.com'}</p>
                      <p className="text-xs font-medium text-primary mt-0.5">{currentUser?.role === 'admin' ? 'Administrator' : currentUser?.role === 'manager' ? 'Manager' : 'Employee'}</p>
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
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => handleProfileAction('preferences')}
                      className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-enterprise flex items-center space-x-2"
                    >
                      <Icon name="Settings" size={16} />
                      <span>Preferences</span>
                    </button>
                  )}
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
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs lg:hidden"
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
