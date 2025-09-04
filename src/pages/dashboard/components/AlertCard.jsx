import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertCard = ({ 
  title, 
  message, 
  type = 'info', 
  priority = 'medium',
  timestamp,
  actionLabel,
  onActionClick,
  onDismiss 
}) => {
  const getAlertStyles = (alertType) => {
    const styles = {
      success: {
        bg: 'bg-success/10',
        border: 'border-success/20',
        icon: 'CheckCircle',
        iconColor: 'text-success'
      },
      warning: {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        icon: 'AlertTriangle',
        iconColor: 'text-warning'
      },
      error: {
        bg: 'bg-error/10',
        border: 'border-error/20',
        icon: 'XCircle',
        iconColor: 'text-error'
      },
      info: {
        bg: 'bg-accent/10',
        border: 'border-accent/20',
        icon: 'Info',
        iconColor: 'text-accent'
      }
    };
    return styles?.[alertType] || styles?.info;
  };

  const getPriorityIndicator = (priorityLevel) => {
    const indicators = {
      high: 'bg-error',
      medium: 'bg-warning',
      low: 'bg-success'
    };
    return indicators?.[priorityLevel] || indicators?.medium;
  };

  const alertStyles = getAlertStyles(type);

  return (
    <div className={`${alertStyles?.bg} ${alertStyles?.border} border rounded-lg p-4 shadow-enterprise`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 flex items-center space-x-2">
          <Icon name={alertStyles?.icon} size={20} className={alertStyles?.iconColor} />
          <div className={`w-2 h-2 rounded-full ${getPriorityIndicator(priority)}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{message}</p>
              {timestamp && (
                <p className="text-xs text-muted-foreground mt-2">{timestamp}</p>
              )}
            </div>
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-6 w-6 -mt-1 -mr-1"
              >
                <Icon name="X" size={14} />
              </Button>
            )}
          </div>
          
          {actionLabel && onActionClick && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onActionClick}
                iconName="ArrowRight"
                iconPosition="right"
              >
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;