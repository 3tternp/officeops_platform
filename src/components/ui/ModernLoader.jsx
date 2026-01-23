import React from 'react';
import Icon from '../AppIcon';

const ModernLoader = ({
  size = 'md',
  text = 'Loading...',
  variant = 'spinner',
  color = 'primary'
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="flex space-x-1">
          <div className={`w-2 h-2 bg-current rounded-full animate-bounce ${colorClasses[color]}`} style={{ animationDelay: '0ms' }} />
          <div className={`w-2 h-2 bg-current rounded-full animate-bounce ${colorClasses[color]}`} style={{ animationDelay: '150ms' }} />
          <div className={`w-2 h-2 bg-current rounded-full animate-bounce ${colorClasses[color]}`} style={{ animationDelay: '300ms' }} />
        </div>
        {text && <p className={`text-gray-600 font-medium ${textSizes[size]}`}>{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={`bg-current rounded-full animate-pulse ${sizeClasses[size]} ${colorClasses[color]}`} />
        {text && <p className={`text-gray-600 font-medium ${textSizes[size]}`}>{text}</p>}
      </div>
    );
  }

  // Default spinner
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`} />
        <div className={`${sizeClasses[size]} border-4 border-t-current rounded-full animate-spin absolute top-0 ${colorClasses[color]}`} />
      </div>
      {text && <p className={`text-gray-600 font-medium ${textSizes[size]}`}>{text}</p>}
    </div>
  );
};

export default ModernLoader;