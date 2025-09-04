import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities = [], maxItems = 5 }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'user-created': 'UserPlus',
      'training-completed': 'GraduationCap',
      'asset-assigned': 'Package',
      'risk-updated': 'AlertTriangle',
      'document-signed': 'FileText',
      'access-granted': 'Shield',
      'access-revoked': 'ShieldOff',
      'training-assigned': 'BookOpen',
      'asset-returned': 'RotateCcw',
      'policy-updated': 'FileCheck'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      'user-created': 'text-success',
      'training-completed': 'text-success',
      'asset-assigned': 'text-accent',
      'risk-updated': 'text-warning',
      'document-signed': 'text-success',
      'access-granted': 'text-success',
      'access-revoked': 'text-error',
      'training-assigned': 'text-accent',
      'asset-returned': 'text-accent',
      'policy-updated': 'text-accent'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const displayActivities = activities?.slice(0, maxItems);

  return (
    <div className="bg-card border border-border rounded-lg shadow-enterprise">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <Icon name="Activity" size={20} className="text-muted-foreground" />
        </div>
      </div>
      <div className="p-6">
        {displayActivities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities?.map((activity, index) => (
              <div key={activity?.id || index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
                  <Icon name={getActivityIcon(activity?.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity?.user}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity?.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {formatTimestamp(activity?.timestamp)}
                    </span>
                  </div>
                  
                  {activity?.metadata && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {activity?.metadata}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activities?.length > maxItems && (
          <div className="mt-4 pt-4 border-t border-border">
            <button className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
              View all activity ({activities?.length - maxItems} more)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;