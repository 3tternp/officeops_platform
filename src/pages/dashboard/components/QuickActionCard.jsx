import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCard = ({ title, description, icon, actions = [], color = 'primary' }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
        icon: 'bg-blue-500',
        text: 'text-blue-700',
        border: 'border-blue-100',
        hover: 'hover:shadow-blue-50'
      },
      success: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100/50',
        icon: 'bg-green-500',
        text: 'text-green-700',
        border: 'border-green-100',
        hover: 'hover:shadow-green-50'
      },
      warning: {
        bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50',
        icon: 'bg-yellow-500',
        text: 'text-yellow-700',
        border: 'border-yellow-100',
        hover: 'hover:shadow-yellow-50'
      },
      error: {
        bg: 'bg-gradient-to-br from-red-50 to-red-100/50',
        icon: 'bg-red-500',
        text: 'text-red-700',
        border: 'border-red-100',
        hover: 'hover:shadow-red-50'
      },
      accent: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50',
        icon: 'bg-purple-500',
        text: 'text-purple-700',
        border: 'border-purple-100',
        hover: 'hover:shadow-purple-50'
      }
    };
    return colors?.[colorType] || colors?.primary;
  };

  const colorScheme = getColorClasses(color);

  return (
    <div className={`bg-white border ${colorScheme.border} rounded-xl p-6 hover:shadow-lg transition-all duration-200 ${colorScheme.bg} hover:scale-[1.02]`}>
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorScheme.icon} shadow-sm`}>
          <Icon name={icon} size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold mb-2 ${colorScheme.text}`}>{title}</h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            {actions?.map((action, index) => (
              <Button
                key={index}
                variant={index === 0 ? 'default' : 'outline'}
                size="sm"
                onClick={action?.onClick}
                iconName={action?.icon}
                iconPosition="left"
                className="flex-1"
              >
                {action?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionCard;