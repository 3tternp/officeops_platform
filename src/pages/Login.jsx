import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import { useUser } from '../contexts/UserContext';
import { securityUtils } from '../utils/security';
import { AlertCircle, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);

  // Check for lockout on component mount
  useEffect(() => {
    const checkLockout = () => {
      const attempts = securityUtils.getLoginAttempts();
      if (attempts >= 5) {
        const lastAttempt = localStorage.getItem('lastLoginAttempt');
        if (lastAttempt) {
          const lockoutDuration = 15 * 60 * 1000; // 15 minutes
          const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt);
          
          if (timeSinceLastAttempt < lockoutDuration) {
            setIsLocked(true);
            setLockoutTime(lockoutDuration - timeSinceLastAttempt);
            
            // Set timer to unlock
            setTimeout(() => {
              setIsLocked(false);
              securityUtils.resetLoginAttempts();
            }, lockoutDuration - timeSinceLastAttempt);
          } else {
            securityUtils.resetLoginAttempts();
          }
        }
      }
      setLoginAttempts(attempts);
    };

    checkLockout();
    
    // Log login page access
    securityUtils.auditLog({
      action: 'login_page_access',
      severity: 'info',
      details: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
      }
    });
  }, []);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('Account temporarily locked due to multiple failed attempts. Please try again later.');
      return;
    }
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Validate inputs
      const validationResult = securityUtils.validateInput(formData.email, {
        type: 'email',
        required: true,
        maxLength: 255
      });
      
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '));
      }

      // Rate limiting check
      if (!securityUtils.checkRateLimit('login', 5, 900000)) { // 5 attempts per 15 minutes
        throw new Error('Too many login attempts. Please try again later.');
      }

      // Simulate authentication delay for security
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, any email/password combination will work
      const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const existingUser = users.find(user => user.email === formData.email);
      
      let userToLogin;
      
      if (existingUser) {
        userToLogin = existingUser;
      } else {
        // Create a default user for demo
        userToLogin = {
          id: Date.now().toString(),
          name: 'Demo User',
          email: formData.email,
          role: 'employee',
          department: 'General',
          avatar: null,
          lastLogin: new Date().toISOString()
        };
      }

      // Log successful login
      securityUtils.auditLog({
        action: 'successful_login',
        severity: 'info',
        details: {
          email: formData.email,
          role: userToLogin.role,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });

      // Reset failed attempts on successful login
      securityUtils.resetLoginAttempts();
      
      // Generate secure session
      const sessionToken = securityUtils.generateSecureToken();
      userToLogin.sessionToken = sessionToken;
      
      login(userToLogin);
      
      // Redirect to intended page or dashboard
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl && returnUrl.startsWith('/')) {
        navigate(decodeURIComponent(returnUrl));
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      // Log failed login attempt
      securityUtils.auditLog({
        action: 'failed_login_attempt',
        severity: 'warning',
        details: {
          email: formData.email,
          error: err.message,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });
      
      // Increment failed attempts
      securityUtils.incrementLoginAttempts();
      const newAttempts = securityUtils.getLoginAttempts();
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsLocked(true);
        setError('Too many failed attempts. Account locked for 15 minutes.');
        localStorage.setItem('lastLoginAttempt', Date.now().toString());
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl mx-auto mb-6">
            <Icon name="Building2" size={36} color="white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            OfficeOps Platform
          </h1>
          <p className="text-gray-600 font-medium">Welcome back! Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
            <div className="w-full h-full bg-gradient-to-br from-blue-100/30 to-transparent rounded-full" />
          </div>
          <div className="relative z-10">
          {/* Security Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-semibold">Secure Connection</span>
            </div>
            {loginAttempts > 0 && !isLocked && (
              <div className="flex items-center space-x-1">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-orange-500">
                  {loginAttempts}/5 attempts
                </span>
              </div>
            )}
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

          {/* Lockout Notice */}
          {isLocked && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-700">Account Temporarily Locked</span>
              </div>
              <p className="text-sm text-red-600">
                Too many failed login attempts. Your account is locked for security reasons.
                Please try again in 15 minutes.
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Mail" size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  disabled={isLocked || isLoading}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
                    isLocked || isLoading 
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white hover:border-gray-300'
                  }`}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Lock" size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  disabled={isLocked || isLoading}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm transition-all duration-200 ${
                    isLocked || isLoading 
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white hover:border-gray-300'
                  }`}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  disabled={isLocked || isLoading}
                  className="rounded border-input" 
                />
                <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-primary hover:underline disabled:opacity-50"
                disabled={isLocked || isLoading}
              >
                Forgot password?
              </button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" 
              disabled={isLocked || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing you in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Icon name="LogIn" size={18} />
                  <span>Sign In</span>
                </div>
              )}
            </Button>
          </form>
          </div>
          
          {/* Security Notice */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm text-blue-700">Security Features Active</span>
            </div>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Input validation and sanitization</li>
              <li>• Rate limiting protection</li>
              <li>• Security monitoring and audit logging</li>
              <li>• Account lockout after 5 failed attempts</li>
            </ul>
          </div>
          
          {/* Demo Notice */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-accent" />
              <span className="font-medium text-sm text-foreground">Demo Mode</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This is a demo application. Enter any email and password to sign in.
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              <p className="font-medium">Try these roles:</p>
              <ul className="mt-1 space-y-1">
                <li>• admin@demo.com - Admin access</li>
                <li>• manager@demo.com - Manager access</li>
                <li>• employee@demo.com - Employee access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
