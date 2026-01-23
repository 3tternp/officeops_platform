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
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'CheckCircle',
        iconColor: 'text-green-600',
        text: 'text-green-800'
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'AlertTriangle',
        iconColor: 'text-yellow-600',
        text: 'text-yellow-800'
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'XCircle',
        iconColor: 'text-red-600',
        text: 'text-red-800'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'Info',
        iconColor: 'text-blue-600',
        text: 'text-blue-800'
      }
    };
    return styles?.[alertType] || styles?.info;
  };

  const alertStyles = getAlertStyles(type);

  return (
    <div className={`border-l-4 ${alertStyles.border} ${alertStyles.bg} rounded-r-xl p-5 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start space-x-3">
        <Icon name={alertStyles.icon} size={22} className={`${alertStyles.iconColor} flex-shrink-0 mt-0.5`} />

        <div className="flex-1 min-w-0">
          <h4 className={`text-base font-semibold ${alertStyles.text} mb-2`}>{title}</h4>
          <p className="text-gray-700 text-sm mb-3 leading-relaxed">{message}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {timestamp && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Icon name="Clock" size={12} />
                  <span>{timestamp}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {actionLabel && onActionClick && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onActionClick}
                  className="text-xs"
                >
                  {actionLabel}
                </Button>
              )}

              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-md transition-colors duration-200"
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;