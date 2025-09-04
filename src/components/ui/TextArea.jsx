import React from 'react';

const TextArea = React.forwardRef(({ 
  className = '', 
  rows = 4, 
  placeholder = '', 
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      placeholder={placeholder}
      className={`
        w-full px-3 py-2 border border-border rounded-md 
        bg-background text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
        disabled:cursor-not-allowed disabled:opacity-50
        resize-y min-h-[80px]
        transition-colors duration-200
        ${className}
      `}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

// Export with both names to support different import styles
export default TextArea;
export { TextArea as Textarea };
