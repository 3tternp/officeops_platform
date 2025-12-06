import React, { useState } from "react";
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

const Input = React.forwardRef(({
    className,
    type = "text",
    label,
    description,
    error,
    success,
    required = false,
    id,
    leftIcon,
    rightIcon,
    onRightIconClick,
    size = 'default',
    variant = 'default',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Size variants
    const sizeClasses = {
        sm: "h-9 px-3 py-2 text-sm rounded-lg",
        default: "h-11 px-4 py-2.5 text-sm rounded-xl",
        lg: "h-12 px-5 py-3 text-base rounded-xl"
    };

    // Base input classes with modern styling
    const baseInputClasses = cn(
        "flex w-full border transition-all duration-200 bg-background text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size] || sizeClasses.default,
        error ? "border-error/50 bg-error/5 focus-visible:ring-2 focus-visible:ring-error/30 focus-visible:border-error" :
        success ? "border-success/50 bg-success/5 focus-visible:ring-2 focus-visible:ring-success/30 focus-visible:border-success" :
        "border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
    );

    // Checkbox-specific styles
    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Radio button-specific styles
    if (type === "radio") {
        return (
            <input
                type="radio"
                className={cn(
                    "h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Input element with icons
    const inputElement = (
        <div className="relative">
            {leftIcon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon name={leftIcon} size={18} className="text-muted-foreground" />
                </div>
            )}
            
            <input
                type={type}
                className={cn(
                    baseInputClasses,
                    leftIcon && "pl-10",
                    rightIcon && "pr-10",
                    className
                )}
                ref={ref}
                id={inputId}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
                {...props}
            />
            
            {rightIcon && (
                <div 
                    className={cn(
                        "absolute inset-y-0 right-0 flex items-center pr-3",
                        onRightIconClick ? "cursor-pointer hover:text-foreground" : "pointer-events-none"
                    )}
                    onClick={onRightIconClick}
                >
                    <Icon name={rightIcon} size={18} className="text-muted-foreground" />
                </div>
            )}
        </div>
    );

    // For regular inputs with wrapper structure
    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "block text-sm font-semibold transition-colors duration-200",
                        isFocused ? "text-primary" : "text-foreground",
                        error && "text-error",
                        success && "text-success"
                    )}
                >
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            {inputElement}

            {(error || success || description) && (
                <div className="flex items-start space-x-2">
                    {(error || success) && (
                        <Icon 
                            name={error ? "AlertCircle" : "CheckCircle"} 
                            size={16} 
                            className={cn(
                                "mt-0.5 flex-shrink-0",
                                error ? "text-red-500" : "text-green-500"
                            )} 
                        />
                    )}
                    <p className={cn(
                        "text-sm",
                        error ? "text-error" : success ? "text-success" : "text-muted-foreground"
                    )}>
                        {error || success || description}
                    </p>
                </div>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
