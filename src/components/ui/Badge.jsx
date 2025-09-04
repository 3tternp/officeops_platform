import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'secondary':
        return 'bg-muted text-muted-foreground border-muted';
      case 'destructive':
        return 'bg-error text-error-foreground border-error';
      case 'outline':
        return 'text-foreground border-border bg-transparent';
      case 'success':
        return 'bg-success text-success-foreground border-success';
      case 'warning':
        return 'bg-warning text-warning-foreground border-warning';
      default:
        return 'bg-primary text-primary-foreground border-primary';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getVariantStyles(variant)} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
export default Badge;
