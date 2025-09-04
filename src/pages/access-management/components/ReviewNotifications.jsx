import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Textarea } from '../../../components/ui/Textarea';
import { createAccessReviewNotification, NotificationStatus } from '../utils/entities';

const ReviewNotifications = ({ currentUser, onNotificationAction }) => {
  const [notifications, setNotifications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock notifications data - in real app, this would come from API
  const mockNotifications = [
    {
      id: '1',
      resource_id: 'res_1',
      resource_name: 'Customer Database',
      responsible_user_id: currentUser?.id,
      responsible_user_name: currentUser?.name,
      responsible_user_email: currentUser?.email,
      responsible_user_role: 'asset_owner',
      notification_type: 'periodic_review',
      status: NotificationStatus.SENT,
      review_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      review_scope: 'all_users',
      users_to_review: [
        { id: 'u1', name: 'John Smith', department: 'Engineering', access_type: 'read_write' },
        { id: 'u2', name: 'Sarah Wilson', department: 'Marketing', access_type: 'read_only' },
        { id: 'u3', name: 'Mike Johnson', department: 'Sales', access_type: 'read_only' }
      ],
      sent_at: new Date().toISOString(),
      escalation_level: 0,
      subject: 'Quarterly Access Review Required - Customer Database',
      message: 'Please review and validate access permissions for all users with access to the Customer Database.',
      action_required: true,
      priority: 'high',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      resource_id: 'res_2',
      resource_name: 'Financial Reports System',
      responsible_user_id: currentUser?.id,
      responsible_user_name: currentUser?.name,
      responsible_user_email: currentUser?.email,
      responsible_user_role: 'system_owner',
      notification_type: 'escalation',
      status: NotificationStatus.ESCALATED,
      review_due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days overdue
      review_scope: 'department',
      users_to_review: [
        { id: 'u4', name: 'Emily Davis', department: 'Finance', access_type: 'admin' },
        { id: 'u5', name: 'David Brown', department: 'Finance', access_type: 'read_write' }
      ],
      sent_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      escalation_level: 1,
      escalated_to_user_id: 'manager_id',
      escalated_to_user_name: 'Alex Thompson',
      escalation_reason: 'Review overdue by 3 days',
      subject: 'OVERDUE: Financial Reports Access Review',
      message: 'This access review is now overdue. Please complete the review immediately to maintain compliance.',
      action_required: true,
      priority: 'critical',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      resource_id: 'res_3',
      resource_name: 'HR Information System',
      responsible_user_id: currentUser?.id,
      responsible_user_name: currentUser?.name,
      responsible_user_email: currentUser?.email,
      responsible_user_role: 'data_custodian',
      notification_type: 'reminder',
      status: NotificationStatus.ACKNOWLEDGED,
      review_due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      review_scope: 'specific_users',
      users_to_review: [
        { id: 'u6', name: 'Lisa Wang', department: 'HR', access_type: 'admin' }
      ],
      sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      acknowledged_at: new Date().toISOString(),
      escalation_level: 0,
      subject: 'Upcoming Access Review - HR Information System',
      message: 'Your access review is due in 2 weeks. Please prepare for the review process.',
      action_required: false,
      priority: 'medium',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    // Simulate loading notifications
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case NotificationStatus.SENT: return 'bg-blue-50 text-blue-600 border-blue-200';
      case NotificationStatus.ACKNOWLEDGED: return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case NotificationStatus.COMPLETED: return 'bg-green-50 text-green-600 border-green-200';
      case NotificationStatus.ESCALATED: return 'bg-red-50 text-red-600 border-red-200';
      case NotificationStatus.OVERDUE: return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredNotifications = notifications.filter(notification => {
    const statusMatch = filterStatus === 'all' || notification.status === filterStatus;
    const typeMatch = filterType === 'all' || notification.notification_type === filterType;
    const searchMatch = searchQuery === '' || 
      notification.resource_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && typeMatch && searchMatch;
  });

  const handleAcknowledge = async (notificationId) => {
    setLoading(true);
    try {
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? {
          ...n,
          status: NotificationStatus.ACKNOWLEDGED,
          acknowledged_at: new Date().toISOString()
        } : n
      );
      setNotifications(updatedNotifications);
      
      if (onNotificationAction) {
        await onNotificationAction('acknowledge', notificationId);
      }
      
      alert('Notification acknowledged successfully');
    } catch (error) {
      console.error('Error acknowledging notification:', error);
      alert('Error acknowledging notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (notificationId) => {
    setLoading(true);
    try {
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? {
          ...n,
          status: NotificationStatus.COMPLETED,
          completed_at: new Date().toISOString()
        } : n
      );
      setNotifications(updatedNotifications);
      
      if (onNotificationAction) {
        await onNotificationAction('complete', notificationId);
      }
      
      alert('Access review completed successfully');
    } catch (error) {
      console.error('Error completing review:', error);
      alert('Error completing review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedNotifications.length === 0) {
      alert('Please select notifications to perform bulk action');
      return;
    }

    setLoading(true);
    try {
      const updatedNotifications = notifications.map(n => 
        selectedNotifications.includes(n.id) ? {
          ...n,
          status: action === 'acknowledge' ? NotificationStatus.ACKNOWLEDGED : NotificationStatus.COMPLETED,
          [action === 'acknowledge' ? 'acknowledged_at' : 'completed_at']: new Date().toISOString()
        } : n
      );
      setNotifications(updatedNotifications);
      setSelectedNotifications([]);
      
      alert(`${selectedNotifications.length} notifications ${action}d successfully`);
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      alert(`Error performing bulk ${action}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: NotificationStatus.SENT, label: 'Sent' },
    { value: NotificationStatus.ACKNOWLEDGED, label: 'Acknowledged' },
    { value: NotificationStatus.COMPLETED, label: 'Completed' },
    { value: NotificationStatus.ESCALATED, label: 'Escalated' },
    { value: NotificationStatus.OVERDUE, label: 'Overdue' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'periodic_review', label: 'Periodic Review' },
    { value: 'escalation', label: 'Escalation' },
    { value: 'reminder', label: 'Reminder' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Access Review Notifications</h2>
          <p className="text-muted-foreground">
            Manage periodic access reviews and compliance notifications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Icon name="Settings" size={16} className="mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon name="Bell" size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {notifications.filter(n => n.status === NotificationStatus.SENT).length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Reviews</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {notifications.filter(n => n.status === NotificationStatus.ESCALATED || getDaysUntilDue(n.review_due_date) < 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Overdue</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {notifications.filter(n => getDaysUntilDue(n.review_due_date) <= 7 && getDaysUntilDue(n.review_due_date) > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Due This Week</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {notifications.filter(n => n.status === NotificationStatus.COMPLETED).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            type="search"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
          />
          <Select
            options={typeOptions}
            value={filterType}
            onChange={setFilterType}
            placeholder="Filter by type"
          />
          <Button variant="outline" className="w-full">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
        </div>

        {selectedNotifications.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">
              {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('acknowledge')}>
                Bulk Acknowledge
              </Button>
              <Button size="sm" onClick={() => handleBulkAction('complete')}>
                Bulk Complete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedNotifications([])}>
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => {
          const daysUntilDue = getDaysUntilDue(notification.review_due_date);
          const isOverdue = daysUntilDue < 0;
          const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

          return (
            <div key={notification.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNotifications(prev => [...prev, notification.id]);
                    } else {
                      setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                    }
                  }}
                />

                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{notification.subject}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-muted-foreground">
                          Resource: {notification.resource_name}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full border ${getStatusColor(notification.status)}`}>
                          {notification.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.toUpperCase()} Priority
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                        {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : 
                         isDueSoon ? `Due in ${daysUntilDue} days` :
                         `Due in ${daysUntilDue} days`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(notification.review_due_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{notification.message}</p>

                    {/* Users to Review */}
                    <div>
                      <div className="text-sm font-medium text-foreground mb-2">
                        Users to Review ({notification.users_to_review.length}):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {notification.users_to_review.slice(0, 3).map((user) => (
                          <div key={user.id} className="bg-muted/50 px-3 py-1 rounded-full text-sm">
                            {user.name} ({user.access_type})
                          </div>
                        ))}
                        {notification.users_to_review.length > 3 && (
                          <div className="bg-muted/50 px-3 py-1 rounded-full text-sm">
                            +{notification.users_to_review.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Escalation Info */}
                    {notification.escalation_level > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Icon name="AlertTriangle" size={16} className="text-red-600" />
                          <span className="text-sm font-medium text-red-600">
                            Escalated to: {notification.escalated_to_user_name}
                          </span>
                        </div>
                        <div className="text-sm text-red-600 mt-1">
                          Reason: {notification.escalation_reason}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Role: {notification.responsible_user_role.replace('_', ' ')}</span>
                      <span>Sent: {new Date(notification.sent_at).toLocaleDateString()}</span>
                      {notification.acknowledged_at && (
                        <span>Acknowledged: {new Date(notification.acknowledged_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowDetails(showDetails === notification.id ? null : notification.id)}
                      >
                        <Icon name="Eye" size={16} className="mr-2" />
                        {showDetails === notification.id ? 'Hide' : 'View'} Details
                      </Button>
                      {notification.status === NotificationStatus.SENT && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAcknowledge(notification.id)}
                        >
                          <Icon name="Check" size={16} className="mr-2" />
                          Acknowledge
                        </Button>
                      )}
                      {(notification.status === NotificationStatus.SENT || notification.status === NotificationStatus.ACKNOWLEDGED) && (
                        <Button 
                          size="sm"
                          onClick={() => handleComplete(notification.id)}
                        >
                          <Icon name="CheckCircle" size={16} className="mr-2" />
                          Complete Review
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {showDetails === notification.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Review Scope</h4>
                          <div className="space-y-2 text-sm">
                            <div>Scope: {notification.review_scope.replace('_', ' ')}</div>
                            <div>Priority: {notification.priority}</div>
                            <div>Action Required: {notification.action_required ? 'Yes' : 'No'}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">All Users to Review</h4>
                          <div className="space-y-1 text-sm">
                            {notification.users_to_review.map((user) => (
                              <div key={user.id} className="flex justify-between">
                                <span>{user.name}</span>
                                <span className="text-muted-foreground">{user.access_type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Bell" size={64} className="text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterStatus !== 'all' || filterType !== 'all' 
              ? 'Try adjusting your filters to see more notifications.' 
              : 'You have no pending access review notifications.'}
          </p>
          <Button variant="outline">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Refresh Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewNotifications;
