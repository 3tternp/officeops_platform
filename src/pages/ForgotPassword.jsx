import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import { securityUtils } from '../utils/security';
import { AlertCircle, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    // Clear error when user starts typing
    if (error) setError('');
    
    // Validate and sanitize input
    const sanitizedValue = securityUtils.sanitizeInput(value);
    
    // Check for malicious patterns
    if (securityUtils.detectXSS(value) || securityUtils.detectSQLInjection(value)) {
      securityUtils.auditLog({
        action: 'malicious_input_detected',
        severity: 'high',
        details: {
          field,
          input: value,
          timestamp: new Date().toISOString()
        }
      });
      setError('Invalid input detected. Please try again.');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Validate email input
      const validationResult = securityUtils.validateInput(formData.email, {
        type: 'email',
        required: true,
        maxLength: 255
      });
      
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '));
      }

      // Rate limiting check for password reset attempts
      if (!securityUtils.checkRateLimit('forgot_password', 3, 900000)) { // 3 attempts per 15 minutes
        throw new Error('Too many password reset attempts. Please try again later.');
      }

      // Simulate sending password reset email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user exists in the system
      const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const userExists = users.some(user => user.email === formData.email);
      
      // Log password reset attempt (security best practice: don't reveal if email exists)
      securityUtils.auditLog({
        action: 'password_reset_requested',
        severity: 'info',
        details: {
          email: formData.email,
          userExists: userExists,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });

      // Always show success message for security (don't reveal if email exists)
      setSuccess(true);
      
    } catch (err) {
      // Log failed attempt
      securityUtils.auditLog({
        action: 'password_reset_failed',
        severity: 'warning',
        details: {
          email: formData.email,
          error: err.message,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });
      
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-lg mx-auto mb-4">
              <Icon name="Building2" size={32} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Password Reset Sent</h1>
            <p className="text-muted-foreground">Check your email for instructions</p>
          </div>

          {/* Success Card */}
          <div className="bg-card border border-border rounded-lg shadow-enterprise-lg p-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Password Reset Instructions Sent
              </h2>
              
              <div className="text-sm text-muted-foreground mb-6 space-y-2">
                <p>If an account with that email address exists, we've sent password reset instructions to:</p>
                <p className="font-medium text-foreground">{formData.email}</p>
                <p>Please check your email and follow the instructions to reset your password.</p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
                
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({ email: '' });
                  }}
                  className="w-full text-sm text-primary hover:underline"
                >
                  Try a different email address
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm text-blue-700">Security Notice</span>
              </div>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Password reset links expire after 1 hour</li>
                <li>• Links can only be used once</li>
                <li>• Check your spam/junk folder if email doesn't arrive</li>
                <li>• Contact IT support if you need further assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-lg mx-auto mb-4">
            <Icon name="Building2" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reset Your Password</h1>
          <p className="text-muted-foreground">Enter your email to receive reset instructions</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-card border border-border rounded-lg shadow-enterprise-lg p-6">
          {/* Security Indicator */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Secure Password Reset</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled={isLoading}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  isLoading 
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-input focus:ring-ring focus:border-transparent'
                }`}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Reset Link...</span>
                </div>
              ) : (
                <>
                  <Icon name="Mail" size={16} className="mr-2" />
                  Send Reset Instructions
                </>
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <Link 
              to="/login" 
              className="text-sm text-primary hover:underline flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
          
          {/* Security Notice */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm text-blue-700">How Password Reset Works</span>
            </div>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• We'll send a secure reset link to your email</li>
              <li>• The link expires after 1 hour for security</li>
              <li>• Rate limiting protects against abuse</li>
              <li>• Your account remains secure during this process</li>
            </ul>
          </div>
          
          {/* Demo Notice */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-accent" />
              <span className="font-medium text-sm text-foreground">Demo Mode</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This is a demo application. In a real environment, an email would be sent with password reset instructions.
              For this demo, any valid email will show the success message.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
