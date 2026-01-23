import React from 'react';

const ModernProgressBar = ({
  progress = 0,
  size = 'md',
  color = 'primary',
  showPercentage = true,
  animated = true,
  label = null
}) => {
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  };

  const colorClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    warning: 'bg-gradient-to-r from-amber-500 to-amber-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className={`font-medium text-gray-700 ${textSizes[size]}`}>{label}</span>
          {showPercentage && (
            <span className={`font-semibold text-gray-600 ${textSizes[size]}`}>
              {clampedProgress}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {!label && showPercentage && (
        <div className="flex justify-end mt-1">
          <span className={`font-semibold text-gray-600 ${textSizes[size]}`}>
            {clampedProgress}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ModernProgressBar;