import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

const cardVariants = cva(
  "rounded-xl border transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 shadow-sm hover:shadow-lg hover:shadow-gray-100/50",
        elevated: "bg-white border-gray-200 shadow-lg hover:shadow-xl hover:shadow-gray-100/60",
        gradient: "bg-gradient-to-br from-white to-gray-50/50 border-gray-200 shadow-md hover:shadow-lg hover:shadow-gray-100/50",
        outline: "bg-transparent border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
        ghost: "bg-transparent border-transparent hover:bg-gray-50/80 hover:border-gray-200",
        success: "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 shadow-sm hover:shadow-md hover:shadow-green-100/50",
        warning: "bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200 shadow-sm hover:shadow-md hover:shadow-yellow-100/50",
        error: "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 shadow-sm hover:shadow-md hover:shadow-red-100/50",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: "cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
);

const Card = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  interactive,
  children, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, size, interactive }), className)}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ 
  className, 
  children, 
  size = 'default',
  icon,
  iconColor = 'primary',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    default: "text-xl font-bold",
    lg: "text-2xl font-bold",
  };

  const iconColorClasses = {
    primary: "text-blue-600",
    success: "text-green-600", 
    warning: "text-yellow-600",
    error: "text-red-600",
    gray: "text-gray-600",
  };

  return (
    <h3
      ref={ref}
      className={cn(
        "leading-none tracking-tight text-gray-900 flex items-center space-x-3",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && (
        <div className={cn(
          "p-2 rounded-lg bg-gradient-to-br shadow-sm",
          iconColor === 'primary' && "from-blue-500 to-blue-600",
          iconColor === 'success' && "from-green-500 to-green-600",
          iconColor === 'warning' && "from-yellow-500 to-yellow-600",
          iconColor === 'error' && "from-red-500 to-red-600",
          iconColor === 'gray' && "from-gray-500 to-gray-600"
        )}>
          <Icon name={icon} size={20} className="text-white" />
        </div>
      )}
      <span>{children}</span>
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props}>
    {children}
  </div>
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 mt-4 border-t border-gray-100", className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = "CardFooter";

// Stats Card Component
export const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'neutral',
  className,
  ...props 
}) => {
  const trendColors = {
    positive: { text: 'text-green-600', bg: 'bg-green-50', icon: 'TrendingUp' },
    negative: { text: 'text-red-600', bg: 'bg-red-50', icon: 'TrendingDown' },
    neutral: { text: 'text-gray-600', bg: 'bg-gray-50', icon: 'Minus' }
  };

  const trendConfig = trendColors[trend];

  return (
    <Card variant="elevated" className={cn("relative overflow-hidden", className)} {...props}>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={cn(
                "flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full w-fit",
                trendConfig.text,
                trendConfig.bg
              )}>
                <Icon name={trendConfig.icon} size={14} />
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Icon name={icon} size={24} className="text-white" />
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
        <div className="w-full h-full bg-gradient-to-br from-blue-100/20 to-transparent rounded-full" />
      </div>
    </Card>
  );
};

// Feature Card Component
export const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  iconColor = 'primary',
  action,
  className,
  ...props 
}) => {
  return (
    <Card 
      variant="gradient" 
      interactive={Boolean(action)} 
      className={cn("group", className)} 
      {...props}
    >
      <CardHeader>
        <CardTitle icon={icon} iconColor={iconColor} size="sm">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      {action && (
        <CardFooter className="pt-4">
          <div className="flex items-center justify-between w-full">
            {action}
            <Icon 
              name="ArrowRight" 
              size={16} 
              className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" 
            />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Metric Card Component
export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  progress,
  color = 'blue',
  className,
  ...props 
}) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-500', ring: 'ring-blue-100' },
    green: { bg: 'bg-green-500', ring: 'ring-green-100' },
    yellow: { bg: 'bg-yellow-500', ring: 'ring-yellow-100' },
    red: { bg: 'bg-red-500', ring: 'ring-red-100' },
    purple: { bg: 'bg-purple-500', ring: 'ring-purple-100' },
  };

  const colorConfig = colorClasses[color];

  return (
    <Card variant="elevated" className={cn("relative", className)} {...props}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Circular indicator */}
          <div className={cn(
            "w-3 h-3 rounded-full ring-4",
            colorConfig.bg,
            colorConfig.ring
          )} />
        </div>
        
        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", colorConfig.bg)}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Quick Action Card
export const QuickActionCard = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  badge,
  className,
  ...props 
}) => {
  return (
    <Card 
      variant="outline" 
      interactive 
      onClick={onClick}
      className={cn("group relative", className)} 
      {...props}
    >
      <CardContent>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200">
            <Icon name={icon} size={20} className="text-gray-600 group-hover:text-blue-600" />
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-900">
                {title}
              </h3>
              {badge && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
