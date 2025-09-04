import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color = 'primary',
  actionLabel,
  onActionClick,
  loading = false 
}) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: 'bg-primary text-primary-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      error: 'bg-error text-error-foreground',
      accent: 'bg-accent text-accent-foreground'
    };
    return colors?.[colorType] || colors?.primary;
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive': return 'TrendingUp';
      case 'negative': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise hover:shadow-enterprise-md transition-enterprise">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
              <Icon name={icon} size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              {loading ? (
                <div className="w-16 h-8 bg-muted animate-pulse rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{value}</p>
              )}
            </div>
          </div>

          {change && !loading && (
            <div className="flex items-center space-x-2 mb-4">
              <Icon 
                name={getChangeIcon(changeType)} 
                size={16} 
                className={getChangeColor(changeType)}
              />
              <span className={`text-sm font-medium ${getChangeColor(changeType)}`}>
                {change}
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          )}

          {actionLabel && onActionClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onActionClick}
              iconName="ArrowRight"
              iconPosition="right"
              className="mt-2"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;