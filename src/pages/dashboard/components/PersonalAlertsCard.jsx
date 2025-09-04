import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import dataService from '../../../services/DataService';

const PersonalAlertsCard = ({ currentUser }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      loadPersonalAlerts();
    }
  }, [currentUser]);

  const loadPersonalAlerts = () => {
    try {
      const personalAlerts = [];

      // Check for security training overdue
      const courses = dataService.getModuleData('learningCourses') || [];
      const userProgress = dataService.getModuleData('userProgress') || {};
      const userCourseProgress = userProgress[currentUser.id] || {};

      const securityCourses = courses.filter(course => 
        course.title.toLowerCase().includes('security') ||
        course.category?.toLowerCase() === 'security' ||
        course.tags?.some(tag => tag.toLowerCase().includes('security'))
      );

      const overdueSecurityTraining = securityCourses.filter(course => {
        const progress = userCourseProgress[course.id];
        const isCompleted = progress?.completed;
        const hasDeadline = course.dueDate;
        const isOverdue = hasDeadline && new Date(course.dueDate) < new Date();
        return hasDeadline && !isCompleted && isOverdue;
      });

      if (overdueSecurityTraining.length > 0) {
        personalAlerts.push({
          id: 'security-training-overdue',
          title: 'Security Training Overdue',
          message: `${overdueSecurityTraining.length} security training course${overdueSecurityTraining.length > 1 ? 's' : ''} overdue`,
          type: 'error',
          priority: 'high',
          timestamp: 'Now',
          actionLabel: 'Complete Training',
          onActionClick: () => window.location.href = '/learning-management',
          icon: 'ShieldAlert'
        });
      }

      // Check for document acknowledgment overdue
      const documents = dataService.getModuleData('documents') || [];
      const acknowledgments = dataService.getModuleData('policyAcknowledgments') || [];
      
      const userAcknowledgments = acknowledgments.filter(ack => 
        ack.userId === currentUser.id || ack.userEmail === currentUser.email
      );
      const acknowledgedDocumentIds = userAcknowledgments.map(ack => ack.documentId);

      const overdueDocuments = documents.filter(doc => {
        if (!doc.isRequired || acknowledgedDocumentIds.includes(doc.id)) return false;
        
        const effectiveDate = new Date(doc.effectiveDate);
        const gracePeriod = 30; // 30 days grace period
        const overdueDate = new Date(effectiveDate.getTime() + (gracePeriod * 24 * 60 * 60 * 1000));
        return new Date() > overdueDate;
      });

      if (overdueDocuments.length > 0) {
        personalAlerts.push({
          id: 'document-acknowledgment-overdue',
          title: 'Document Acknowledgment Overdue',
          message: `${overdueDocuments.length} document${overdueDocuments.length > 1 ? 's' : ''} require immediate acknowledgment`,
          type: 'warning',
          priority: 'high',
          timestamp: 'Now',
          actionLabel: 'Acknowledge Documents',
          onActionClick: () => window.location.href = '/document-management',
          icon: 'FileX'
        });
      }

      // Check for upcoming training deadlines (next 7 days)
      const upcomingTrainingDeadlines = courses.filter(course => {
        const progress = userCourseProgress[course.id];
        const isCompleted = progress?.completed;
        const hasDeadline = course.dueDate;
        
        if (!hasDeadline || isCompleted) return false;
        
        const daysUntilDeadline = Math.ceil((new Date(course.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
      });

      if (upcomingTrainingDeadlines.length > 0) {
        personalAlerts.push({
          id: 'training-deadline-soon',
          title: 'Training Deadline Approaching',
          message: `${upcomingTrainingDeadlines.length} training course${upcomingTrainingDeadlines.length > 1 ? 's' : ''} due within 7 days`,
          type: 'warning',
          priority: 'medium',
          timestamp: 'This week',
          actionLabel: 'View Courses',
          onActionClick: () => window.location.href = '/learning-management',
          icon: 'Clock'
        });
      }

      // Check for asset return reminders (if any assets are temporary or need return)
      const assets = dataService.getModuleData('assets') || [];
      const userAssets = assets.filter(asset => 
        asset.assignedTo === currentUser.id || 
        asset.assignedTo === currentUser.email ||
        asset.assignedToEmail === currentUser.email
      );

      const assetsNeedingReturn = userAssets.filter(asset => {
        if (!asset.returnDate) return false;
        const returnDate = new Date(asset.returnDate);
        const daysUntilReturn = Math.ceil((returnDate - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilReturn <= 7 && daysUntilReturn >= 0;
      });

      if (assetsNeedingReturn.length > 0) {
        personalAlerts.push({
          id: 'asset-return-reminder',
          title: 'Asset Return Reminder',
          message: `${assetsNeedingReturn.length} asset${assetsNeedingReturn.length > 1 ? 's' : ''} need to be returned soon`,
          type: 'info',
          priority: 'medium',
          timestamp: 'This week',
          actionLabel: 'View Assets',
          onActionClick: () => window.location.href = '/asset-management',
          icon: 'PackageX'
        });
      }

      // Check for password change reminders (if user hasn't changed password in 90 days)
      if (currentUser.lastPasswordChange) {
        const daysSincePasswordChange = Math.floor((new Date() - new Date(currentUser.lastPasswordChange)) / (1000 * 60 * 60 * 24));
        if (daysSincePasswordChange >= 90) {
          personalAlerts.push({
            id: 'password-change-reminder',
            title: 'Password Change Recommended',
            message: `Your password hasn't been changed in ${daysSincePasswordChange} days`,
            type: 'info',
            priority: 'low',
            timestamp: 'Security reminder',
            actionLabel: 'Change Password',
            onActionClick: () => window.location.href = '/profile',
            icon: 'Lock'
          });
        }
      }

      setAlerts(personalAlerts.slice(0, 5)); // Limit to 5 alerts
    } catch (error) {
      console.error('Error loading personal alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-error/5 border-error/20 text-error';
      case 'warning':
        return 'bg-warning/5 border-warning/20 text-warning';
      case 'info':
        return 'bg-primary/5 border-primary/20 text-primary';
      default:
        return 'bg-accent/5 border-accent/20 text-accent';
    }
  };

  const getAlertIconColor = (type) => {
    switch (type) {
      case 'error':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      default:
        return 'text-accent';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Critical Alerts</h3>
          <div className="w-6 h-6 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-3">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Critical Alerts</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} className="text-primary" />
          {alerts.length > 0 && (
            <span className="text-sm font-medium text-primary">
              {alerts.length} alert{alerts.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
          <p className="text-sm font-medium text-success mb-2">All clear!</p>
          <p className="text-xs text-muted-foreground">
            No critical alerts at this time
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`relative p-4 border rounded-lg ${getAlertStyles(alert.type)}`}
            >
              <button
                onClick={() => handleDismissAlert(alert.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 transition-colors"
              >
                <Icon name="X" size={12} className="text-muted-foreground" />
              </button>
              
              <div className="flex items-start space-x-3 pr-6">
                <Icon 
                  name={alert.icon || 'AlertTriangle'} 
                  size={20} 
                  className={getAlertIconColor(alert.type)} 
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </span>
                    {alert.actionLabel && alert.onActionClick && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={alert.onActionClick}
                        className="h-8 text-xs"
                      >
                        {alert.actionLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalAlertsCard;
