import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCard = ({ title, description, icon, actions = [], color = 'primary' }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      error: 'bg-error/10 text-error border-error/20',
      accent: 'bg-accent/10 text-accent border-accent/20'
    };
    return colors?.[colorType] || colors?.primary;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise hover:shadow-enterprise-md transition-enterprise">
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          
          <div className="flex flex-wrap gap-2">
            {actions?.map((action, index) => (
              <Button
                key={index}
                variant={index === 0 ? 'default' : 'outline'}
                size="sm"
                onClick={action?.onClick}
                iconName={action?.icon}
                iconPosition="left"
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