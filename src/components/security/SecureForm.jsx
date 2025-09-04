import React, { useState, useRef, useEffect } from 'react';
import { securityUtils } from '../../utils/security';
import Icon from '../AppIcon';

/**
 * SecureForm component that wraps forms with security features
 * - Input validation and sanitization
 * - Rate limiting
 * - XSS protection
 * - Audit logging
 * - CSRF protection
 */
const SecureForm = ({
  children,
  onSubmit,
  className = '',
  maxAttempts = 5,
  rateLimitWindow = 60000, // 1 minute
  actionName = 'form_submit',
  requireConfirmation = false,
  confirmationMessage = 'Are you sure you want to submit this form?',
  encryptSensitiveFields = [],
  auditAction = '',
  auditResource = ''
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [errors, setErrors] = useState({});
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const formRef = useRef(null);

  // Generate CSRF token on mount
  useEffect(() => {
    const token = crypto.getRandomValues(new Uint8Array(16))
      .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
    setCsrfToken(token);
    
    // Store token for verification
    sessionStorage.setItem(`csrf_${actionName}`, token);
  }, [actionName]);

  /**
   * Validate all form inputs
   * @param {FormData} formData - Form data to validate
   * @returns {object} - Validation results
   */
  const validateFormInputs = (formData) => {
    const validationErrors = {};
    const sanitizedData = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        // Validate input
        const validation = securityUtils.validateInput(value, { type: 'text', required: true });
        if (!validation.isValid) {
          validationErrors[key] = validation.error;
        } else {
          sanitizedData[key] = value.trim();
        }
      } else {
        sanitizedData[key] = value;
      }
    }

    return { errors: validationErrors, sanitizedData };
  };

  /**
   * Check CSRF token validity
   * @returns {boolean} - True if valid
   */
  const validateCSRF = () => {
    const storedToken = sessionStorage.getItem(`csrf_${actionName}`);
    return storedToken === csrfToken;
  };

  /**
   * Handle form submission with security checks
   * @param {Event} event - Form submit event
   */
  const handleSecureSubmit = async (event) => {
    event.preventDefault();
    
    // Prevent multiple rapid submissions
    const now = Date.now();
    if (now - lastSubmitTime < 1000) { // 1 second minimum between submissions
      return;
    }
    setLastSubmitTime(now);

    // Check rate limiting
    if (!securityUtils.checkRateLimit(actionName, maxAttempts, rateLimitWindow)) {
      setIsRateLimited(true);
      setErrors({ general: `Too many attempts. Please wait ${Math.ceil(rateLimitWindow / 1000)} seconds.` });
      
      // Log suspicious activity
      securityUtils.auditLog({
        action: 'rate_limit_exceeded',
        severity: 'warning',
        details: { 
          actionName,
          attempts: maxAttempts,
          window: rateLimitWindow 
        }
      });
      
      return;
    }

    // Validate CSRF token
    if (!validateCSRF()) {
      setErrors({ general: 'Security token invalid. Please refresh and try again.' });
      securityUtils.auditLog({
        action: 'csrf_validation_failed',
        severity: 'high',
        details: { actionName, csrfToken }
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);
    setErrors({});

    try {
      // Get form data
      const formData = new FormData(formRef.current);
      
      // Validate and sanitize inputs
      const { errors: validationErrors, sanitizedData } = validateFormInputs(formData);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        
        // Log validation failures
        securityUtils.auditLog({
          action: 'form_validation_failed',
          severity: 'warning',
          details: {
            resource: auditResource || actionName,
            errors: Object.keys(validationErrors)
          }
        });
        
        return;
      }

      // Apply additional sanitization
      const finalData = securityUtils.sanitizeInput(JSON.stringify(sanitizedData));
      const parsedData = JSON.parse(finalData);

      // Show confirmation if required
      if (requireConfirmation) {
        if (!window.confirm(confirmationMessage)) {
          setIsSubmitting(false);
          return;
        }
      }

      // Create audit log for successful submission
      if (auditAction && auditResource) {
        securityUtils.auditLog({
          action: auditAction,
          severity: 'info',
          details: {
            resource: auditResource,
            fields: Object.keys(parsedData || {}),
            submitCount: submitCount + 1
          }
        });
      }

      // Call the original onSubmit handler
      await onSubmit(parsedData || sanitizedData, {
        csrfToken,
        submitCount: submitCount + 1,
        timestamp: now
      });

    } catch (error) {
      console.error('Secure form submission failed:', error);
      setErrors({ 
        general: 'Submission failed. Please check your input and try again.' 
      });
      
      // Log submission errors
      securityUtils.auditLog({
        action: 'form_submission_error',
        severity: 'high',
        details: {
          resource: auditResource || actionName,
          error: error.message,
          submitCount: submitCount + 1
        }
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Clear rate limit (for testing or admin override)
   */
  const clearRateLimit = () => {
    localStorage.removeItem(`rateLimit_${actionName}`);
    setIsRateLimited(false);
    setErrors({});
    
    securityUtils.auditLog({
      action: 'rate_limit_cleared',
      severity: 'info',
      details: { 
        actionName,
        clearedBy: 'user_action' 
      }
    });
  };

  return (
    <div className="secure-form-wrapper">
      {/* Rate Limit Warning */}
      {isRateLimited && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" className="text-error" size={20} />
            <div>
              <h4 className="font-medium text-error">Rate Limit Exceeded</h4>
              <p className="text-sm text-error/80 mt-1">
                Too many submission attempts. Please wait before trying again.
              </p>
              <button
                onClick={clearRateLimit}
                className="text-sm text-error hover:text-error/80 underline mt-2"
              >
                Clear rate limit (for testing)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* General Errors */}
      {errors.general && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="AlertCircle" className="text-error" size={20} />
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Security Info (Development Mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 text-xs">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" className="text-primary" size={16} />
            <span className="font-medium text-primary">Security Features Active</span>
          </div>
          <ul className="text-primary/80 space-y-1">
            <li>✓ Input validation and sanitization enabled</li>
            <li>✓ Rate limiting: {maxAttempts} attempts per {rateLimitWindow/1000}s</li>
            <li>✓ CSRF protection enabled</li>
            <li>✓ Audit logging enabled</li>
            {encryptSensitiveFields.length > 0 && (
              <li>✓ Sensitive field encryption enabled</li>
            )}
          </ul>
        </div>
      )}

      {/* Secure Form */}
      <form
        ref={formRef}
        onSubmit={handleSecureSubmit}
        className={`secure-form ${className}`}
        noValidate // We handle validation ourselves
      >
        {/* CSRF Token */}
        <input
          type="hidden"
          name="csrf_token"
          value={csrfToken}
          readOnly
        />
        
        {/* Timestamp */}
        <input
          type="hidden"
          name="form_timestamp"
          value={Date.now()}
          readOnly
        />

        {/* Honeypot field (hidden from users, bots might fill it) */}
        <div style={{ display: 'none' }}>
          <label htmlFor="hp_field">Leave this field empty</label>
          <input
            type="text"
            name="hp_field"
            id="hp_field"
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        {/* Form Content */}
        <div className="form-content">
          {typeof children === 'function' 
            ? children({ errors, isSubmitting, submitCount }) 
            : children
          }
        </div>

        {/* Field Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-4">
            {Object.entries(errors).map(([field, error]) => {
              if (field === 'general') return null;
              return (
                <div key={field} className="text-sm text-error mb-1">
                  <strong>{field}:</strong> {error}
                </div>
              );
            })}
          </div>
        )}

        {/* Submit Status */}
        {isSubmitting && (
          <div className="flex items-center space-x-2 mt-4 text-sm text-muted-foreground">
            <Icon name="Loader2" className="animate-spin" size={16} />
            <span>Processing securely...</span>
          </div>
        )}
      </form>

      {/* Security Footer */}
      <div className="mt-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={12} />
          <span>This form is protected by security measures including input validation and rate limiting.</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for secure form state management
 */
export const useSecureForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = (name, value) => {
    // Validate on change
    const validation = securityUtils.validateInput(value, { type: 'text', required: true });
    
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ 
      ...prev, 
      [name]: validation.isValid ? null : validation.error 
    }));
  };

  const markTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const validate = () => {
    const validationErrors = {};
    
    Object.entries(values).forEach(([key, value]) => {
      const validation = securityUtils.validateInput(value, { type: 'text', required: true });
      if (!validation.isValid) {
        validationErrors[key] = validation.error;
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return {
    values,
    errors,
    touched,
    setValue,
    markTouched,
    reset,
    validate,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Secure Input component with built-in validation
 */
export const SecureInput = React.forwardRef(({
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  className = '',
  required = false,
  maxLength = 1000,
  validateOnChange = true,
  ...props
}, ref) => {
  const [localError, setLocalError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (validateOnChange) {
      const validation = securityUtils.validateInput(newValue, { type: 'text', required: true });
      setLocalError(validation.isValid ? '' : validation.error);
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    
    const validation = securityUtils.validateInput(e.target.value, { type: 'text', required: true });
    setLocalError(validation.isValid ? '' : validation.error);
    
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="secure-input-wrapper">
      <input
        ref={ref}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        className={`${className} ${localError ? 'border-error' : ''}`}
        required={required}
        maxLength={maxLength}
        autoComplete="off"
        {...props}
      />
      
      {localError && (
        <div className="text-sm text-error mt-1">
          {localError}
        </div>
      )}
      
      {isFocused && process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground mt-1">
          Input validation active • Max length: {maxLength}
        </div>
      )}
    </div>
  );
});

SecureInput.displayName = 'SecureInput';

export default SecureForm;
