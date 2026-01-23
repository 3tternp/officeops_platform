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
      primary: {
        icon: 'text-blue-600',
        border: 'border-blue-200'
      },
      success: {
        icon: 'text-green-600',
        border: 'border-green-200'
      },
      warning: {
        icon: 'text-yellow-600',
        border: 'border-yellow-200'
      },
      error: {
        icon: 'text-red-600',
        border: 'border-red-200'
      },
      accent: {
        icon: 'text-purple-600',
        border: 'border-purple-200'
      }
    };
    return colors?.[colorType] || colors?.primary;
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive': return 'TrendingUp';
      case 'negative': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const colorScheme = getColorClasses(color);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name={icon} size={24} className={colorScheme.icon} />
            <div>
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              {change && (
                <div className={`flex items-center space-x-1 text-xs mt-1 ${getChangeColor(changeType)}`}>
                  <Icon name={getChangeIcon(changeType)} size={12} />
                  <span>{change}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-2xl font-semibold text-gray-900">{value}</div>
        </div>

        {actionLabel && onActionClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onActionClick}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MetricCard;