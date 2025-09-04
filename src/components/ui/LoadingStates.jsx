import React from 'react';
import Icon from '../AppIcon';

// Animated loading spinner
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  text = null,
  fullScreen = false 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5', 
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    success: 'border-green-600',
    warning: 'border-yellow-600',
    error: 'border-red-600',
    white: 'border-white'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-t-transparent rounded-full animate-spin`} />
      {text && (
        <p className={`${textSizes[size]} text-gray-600 font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton loader for cards
export const CardSkeleton = ({ 
  rows = 3, 
  showImage = false, 
  showActions = true,
  className = '' 
}) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 animate-pulse ${className}`}>
      {/* Header with optional image */}
      <div className="flex items-start space-x-4 mb-4">
        {showImage && (
          <div className="w-16 h-16 bg-gray-200 rounded-xl" />
        )}
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </div>

      {/* Content rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        ))}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded-lg w-20" />
            <div className="h-8 bg-gray-200 rounded-lg w-16" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-24" />
        </div>
      )}
    </div>
  );
};

// Table skeleton loader
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4,
  showHeader = true,
  className = '' 
}) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse ${className}`}>
      {showHeader && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex space-x-8">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-24" />
            ))}
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4">
            <div className="flex space-x-8">
              {Array.from({ length: columns }).map((_, j) => (
                <div key={j} className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats card skeleton
export const StatsSkeleton = ({ count = 4, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            <div className="w-6 h-6 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  );
};

// List skeleton loader
export const ListSkeleton = ({ items = 5, showAvatar = true, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl divide-y divide-gray-200 animate-pulse ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="p-4">
          <div className="flex items-center space-x-4">
            {showAvatar && (
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
            )}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="w-16 h-6 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Page loading skeleton
export const PageSkeleton = ({ className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse" />
        </div>
      </div>

      {/* Stats */}
      <StatsSkeleton />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CardSkeleton rows={4} showImage={true} />
          <TableSkeleton />
        </div>
        <div className="space-y-6">
          <ListSkeleton />
          <CardSkeleton rows={2} showActions={false} />
        </div>
      </div>
    </div>
  );
};

// Pulse animation component for custom skeletons
export const Pulse = ({ className = '', children, ...props }) => {
  return (
    <div className={`animate-pulse ${className}`} {...props}>
      {children}
    </div>
  );
};

// Loading overlay component
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  text = 'Loading...', 
  blur = true,
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className={`absolute inset-0 z-10 flex items-center justify-center bg-white/80 ${
          blur ? 'backdrop-blur-sm' : ''
        } transition-all duration-200`}>
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  );
};

// Animated progress bar
export const ProgressBar = ({ 
  progress = 0, 
  color = 'primary',
  size = 'md',
  showPercent = false,
  animated = true,
  className = '' 
}) => {
  const colorClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={className}>
      {showPercent && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default {
  LoadingSpinner,
  CardSkeleton,
  TableSkeleton,
  StatsSkeleton,
  ListSkeleton,
  PageSkeleton,
  Pulse,
  LoadingOverlay,
  ProgressBar
};
