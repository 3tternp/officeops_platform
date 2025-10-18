import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import dataService from '../../services/DataService';

const NotificationCenter = ({ isOpen, onClose, onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      setCurrentUser(user);
      loadNotifications(user);
    }
  }, [isOpen]);

  const loadNotifications = (user) => {
    if (!user || !user.id) return;
    
    const allNotifications = dataService.getNotifications();
    
    // Filter notifications for current user or their role
    const userNotifications = allNotifications.filter(notif => 
      notif.recipientId === user.id || 
      notif.recipientRole === user.role || 
      notif.recipientRole === 'all'
    ).map(notif => ({
      ...notif,
      unread: !notif.read,
      actionRequired: notif.type === 'access_request_new' || notif.type === 'approval_pending',
      time: formatTimeAgo(notif.createdDate),
      timestamp: new Date(notif.createdDate)
    }));
    
    setNotifications(userNotifications);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification?.unread;
    if (filter === 'action-required') return notification?.actionRequired;
    return notification?.type === filter;
  });

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  const handleNotificationClick = (notification) => {
    try {
      dataService.markNotificationAsRead(notification?.id);
    } catch (e) {
      console.warn('Failed to persist read state', e);
    }
    // Mark as read in local state
    setNotifications(prev => 
      prev?.map(n => 
        n?.id === notification?.id ? { ...n, unread: false } : n
      )
    );

    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const markAllAsRead = () => {
    try {
      notifications?.forEach(n => {
        if (n?.unread) dataService.markNotificationAsRead(n?.id);
      });
    } catch (e) {
      console.warn('Failed to persist mark-all-read', e);
    }
    setNotifications(prev => 
      prev?.map(n => ({ ...n, unread: false }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'info': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 lg:relative lg:inset-auto">
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs lg:hidden"
        onClick={onClose}
      />
      {/* Notification Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-popover border-l border-border shadow-enterprise-lg lg:absolute lg:right-0 lg:top-full lg:mt-2 lg:h-auto lg:max-h-96 lg:w-96 lg:rounded-lg lg:border">
        <div className="flex flex-col h-full lg:max-h-96">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-popover-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread of {notifications?.length} total
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 p-4 border-b border-border overflow-x-auto">
            {[
              { key: 'all', label: 'All', count: notifications?.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'action-required', label: 'Action', count: notifications?.filter(n => n?.actionRequired)?.length }
            ]?.map((tab) => (
              <Button
                key={tab?.key}
                variant={filter === tab?.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(tab?.key)}
                className="flex-shrink-0"
              >
                {tab?.label}
                {tab?.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    filter === tab?.key 
                      ? 'bg-primary-foreground text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {tab?.count}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Icon name="Loader2" size={24} className="animate-spin text-muted-foreground" />
              </div>
            ) : filteredNotifications?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Icon name="Bell" size={48} className="text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No notifications found</p>
                <p className="text-sm text-muted-foreground/80">
                  {filter === 'all' ? 'All caught up!' : `No ${filter} notifications`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredNotifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer hover:bg-muted transition-enterprise ${
                      notification?.unread ? 'bg-accent/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <Icon 
                          name={getNotificationIcon(notification?.type)} 
                          size={16} 
                          className={getNotificationColor(notification?.type)}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm text-popover-foreground">
                            {notification?.title}
                          </p>
                          <div className="flex items-center space-x-2 ml-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityIndicator(notification?.priority)}`} />
                            {notification?.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification?.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {notification?.time}
                          </p>
                          {notification?.actionRequired && (
                            <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">
                              Action Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {notifications?.length > 0 && (
            <div className="p-4 border-t border-border space-y-2">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex-1"
                >
                  Mark All Read
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAll}
                  className="flex-1"
                >
                  Clear All
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="w-full">
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;