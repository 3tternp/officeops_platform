import React from 'react';
import Icon from '../../../components/AppIcon';

const DocumentStats = ({ stats }) => {
  const statCards = [
    {
      id: 'total',
      title: 'Total Documents',
      value: stats?.totalDocuments || 0,
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: stats?.totalChange || 0,
      changeType: 'increase'
    },
    {
      id: 'pending',
      title: 'Pending Review',
      value: stats?.pendingReview || 0,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: stats?.pendingChange || 0,
      changeType: 'decrease'
    },
    {
      id: 'acknowledged',
      title: 'Acknowledged',
      value: stats?.acknowledged || 0,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: stats?.acknowledgedChange || 0,
      changeType: 'increase'
    },
    {
      id: 'overdue',
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: stats?.overdueChange || 0,
      changeType: 'decrease'
    },
    {
      id: 'expiring',
      title: 'Expiring Soon',
      value: stats?.expiringSoon || 0,
      icon: 'Calendar',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: stats?.expiringChange || 0,
      changeType: 'neutral'
    },
    {
      id: 'compliance',
      title: 'Compliance Rate',
      value: `${stats?.complianceRate || 0}%`,
      icon: 'Shield',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: stats?.complianceChange || 0,
      changeType: 'increase'
    }
  ];

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'increase': return 'TrendingUp';
      case 'decrease': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'increase': return 'text-success';
      case 'decrease': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-card border border-border rounded-lg shadow-enterprise hover:shadow-enterprise-md transition-all duration-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
            {stat?.change !== 0 && (
              <div className={`flex items-center space-x-1 ${getChangeColor(stat?.changeType)}`}>
                <Icon name={getChangeIcon(stat?.changeType)} size={14} />
                <span className="text-xs font-medium">
                  {Math.abs(stat?.change)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
            <p className="text-sm text-muted-foreground">{stat?.title}</p>
          </div>

          {/* Progress bar for compliance rate */}
          {stat?.id === 'compliance' && (
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats?.complianceRate || 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Additional context for specific stats */}
          {stat?.id === 'pending' && stats?.pendingBreakdown && (
            <div className="mt-3 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>New:</span>
                <span>{stats?.pendingBreakdown?.new || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>In Review:</span>
                <span>{stats?.pendingBreakdown?.inReview || 0}</span>
              </div>
            </div>
          )}

          {stat?.id === 'overdue' && stats?.overdueBreakdown && (
            <div className="mt-3 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>&lt; 7 days:</span>
                <span>{stats?.overdueBreakdown?.week || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>&gt; 30 days:</span>
                <span>{stats?.overdueBreakdown?.month || 0}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DocumentStats;