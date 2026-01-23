import React, { useState } from 'react';
import { cn } from '../../utils/cn';

const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      {...props}
    >
      {children}
      {isVisible && content && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-popover-foreground bg-popover border border-border rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200',
            positionClasses[position],
            className
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              'absolute w-2 h-2 bg-popover border border-border transform rotate-45',
              {
                'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-0 border-l-0': position === 'top',
                'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-0 border-r-0': position === 'bottom',
                'top-1/2 left-full -translate-y-1/2 -ml-1 border-t-0 border-l-0': position === 'left',
                'top-1/2 right-full -translate-y-1/2 -mr-1 border-b-0 border-r-0': position === 'right'
              }
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;