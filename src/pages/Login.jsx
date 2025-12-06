import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useUser } from '../contexts/UserContext';
import { securityUtils } from '../utils/security';
import { AlertCircle } from 'lucide-react';
import { useBranding } from '../contexts/BrandingContext';
import EmailService from '../services/EmailService';
import SecurityService from '../services/SecurityService';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useUser();
  const { branding } = useBranding();
  const enableMock = (
    import.meta?.env?.VITE_ENABLE_MOCK_DATA === 'true' ||
    localStorage.getItem('ENABLE_MOCK_DATA') === 'true'
  );
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [mfaPending, setMfaPending] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpData, setOtpData] = useState(null); // { code, expiresAt }
  const [pendingUser, setPendingUser] = useState(null);

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

  // Redirect to setup if admin not created and demo disabled
  useEffect(() => {
    const adminSetupComplete = localStorage.getItem('officeops_admin_setup_complete') === 'true';
    if (!enableMock && !adminSetupComplete) {
      navigate('/setup', { replace: true });
    }
  }, [enableMock, navigate]);

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

    const normalizedEmail = formData.email.trim().toLowerCase();

    setIsLoading(true);
    setError('');

    try {
      // Validate inputs
      const validationResult = securityUtils.validateInput(normalizedEmail, {
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
      const existingUser = users.find(user => user.email?.toLowerCase() === normalizedEmail);

      let userToLogin;

      if (existingUser) {
        const passwordValid = await securityUtils.verifyPassword(formData.password, existingUser);
        if (!passwordValid) {
          throw new Error('Invalid email or password');
        }

        // Upgrade legacy credentials with a salted hash after successful login
        if (!existingUser.passwordSalt) {
          const upgradedSalt = securityUtils.generateSalt();
          const upgradedHash = await securityUtils.derivePasswordHash(formData.password, upgradedSalt);
          const updatedUsers = users.map(user =>
            user.id === existingUser.id
              ? {
                  ...user,
                  passwordSalt: upgradedSalt,
                  passwordHash: upgradedHash,
                  passwordUpdatedAt: new Date().toISOString(),
                  password: undefined
                }
              : user
          );
          localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
          const refreshed = updatedUsers.find(u => u.id === existingUser.id);
          userToLogin = refreshed;
        } else {
          userToLogin = existingUser;
        }
      } else {
        // Create a default user only when mock data is enabled
        if (!enableMock) {
          throw new Error('User not found. Please contact your administrator.');
        }
        userToLogin = {
          id: Date.now().toString(),
          name: 'Demo User',
          email: normalizedEmail,
          role: 'employee',
          department: 'General',
          avatar: null,
          lastLogin: new Date().toISOString()
        };
      }

      // If 2FA is required, send OTP and wait for verification
      const sec = SecurityService.getSettings();
      if (sec?.twoFactorRequired) {
        try {
          const ttl = typeof sec.otpTTLSeconds === 'number' ? sec.otpTTLSeconds : 300;
          const code = Math.floor(100000 + Math.random() * 900000).toString();
          setPendingUser(userToLogin);
          setOtpData({ code, expiresAt: Date.now() + ttl * 1000 });
          await EmailService.sendEmail({
            to: userToLogin.email,
            subject: 'Your OfficeOps verification code',
            text: `Your verification code is ${code}. It expires in ${Math.round(ttl/60)} minutes.`
          });
          setMfaPending(true);
          setIsLoading(false);
          return; // wait for user to enter code
        } catch (sendErr) {
          throw new Error(sendErr.message || 'Failed to send verification code');
        }
      }

      // Log successful login
      securityUtils.auditLog({
        action: 'successful_login',
        severity: 'info',
        details: {
          email: normalizedEmail,
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
          email: normalizedEmail,
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

  const handleVerifyOtp = async (e) => {
    e?.preventDefault?.();
    if (!mfaPending || !otpData || !pendingUser) {
      setError('No verification in progress.');
      return;
    }
    if (!otpInput) {
      setError('Enter the verification code sent to your email.');
      return;
    }
    if (Date.now() > otpData.expiresAt) {
      setError('Verification code expired. Please sign in again.');
      setMfaPending(false);
      setOtpInput('');
      setOtpData(null);
      setPendingUser(null);
      return;
    }
    if (otpInput.trim() !== otpData.code) {
      setError('Invalid verification code. Please try again.');
      return;
    }

    try {
      // Log successful login after verification
      securityUtils.auditLog({
        action: 'successful_login',
        severity: 'info',
        details: {
          email: pendingUser.email,
          role: pendingUser.role,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      });
      securityUtils.resetLoginAttempts();

      const sessionToken = securityUtils.generateSecureToken();
      pendingUser.sessionToken = sessionToken;

      login(pendingUser);

      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl && returnUrl.startsWith('/')) {
        navigate(decodeURIComponent(returnUrl));
      } else {
        navigate('/dashboard');
      }
    } finally {
      setMfaPending(false);
      setOtpInput('');
      setOtpData(null);
      setPendingUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Background image or brand-tinted gradient */}
      <div
        className="absolute inset-0"
        style={branding?.loginBackgroundImage
          ? {
              backgroundImage: `url(${branding.loginBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {
              backgroundImage: `linear-gradient(135deg, ${(branding?.primaryColor || '#3b82f6')}11, #ffffff, ${(branding?.secondaryColor || '#6366f1')}11)`,
            }}
      />
      <div className="absolute inset-0 bg-background/70" />
      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg">
        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          {branding?.companyLogo ? (
            <img
              src={branding.companyLogo}
              alt={`${branding?.companyName || 'Company'} logo`}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl shadow-2xl mx-auto mb-4"
            />
          ) : (
            <div
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-2xl mx-auto mb-4"
              style={{
                backgroundImage: `linear-gradient(135deg, ${branding?.primaryColor || '#3b82f6'}, ${branding?.secondaryColor || '#6366f1'})`,
              }}
            >
              <Icon name="Building2" size={32} color="white" />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {branding?.companyName || 'OfficeOps'} Platform
          </h1>
          <p className="text-muted-foreground font-medium text-sm sm:text-base">Welcome back! Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-2xl shadow-enterprise-lg p-6 sm:p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
            <div className="w-full h-full bg-primary/10 rounded-full" />
          </div>
          <div className="relative z-10">
          

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-error" />
                <span className="text-sm text-error">{error}</span>
              </div>
            </div>
          )}

          {/* Lockout Notice */}
          {isLocked && (
            <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-error" />
                <span className="font-medium text-error">Account Temporarily Locked</span>
              </div>
              <p className="text-sm text-error">
                Too many failed login attempts. Your account is locked for security reasons.
                Please try again in 15 minutes.
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              required
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              leftIcon="Mail"
              disabled={isLocked || isLoading || mfaPending}
            />
            <Input
              label="Password"
              required
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              leftIcon="Lock"
              disabled={isLocked || isLoading || mfaPending}
            />
            
            {mfaPending && (
              <div className="space-y-2">
                <Input
                  label="Verification Code"
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 6-digit code"
                  leftIcon="ShieldCheck"
                />
                <p className="text-xs text-muted-foreground">We sent a code to {formData.email}. Check your inbox.</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  disabled={isLocked || isLoading || mfaPending}
                  className="rounded border-input" 
                />
                <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-primary hover:underline disabled:opacity-50"
                disabled={isLocked || isLoading || mfaPending}
              >
                Forgot password?
              </button>
            </div>
            
            {mfaPending ? (
              <Button 
                type="button" 
                onClick={handleVerifyOtp}
                className="w-full h-12 text-base font-semibold"
                disabled={isLocked || isLoading}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="ShieldCheck" size={18} />
                  <span>Verify Code</span>
                </div>
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
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
            )}
            {branding?.footerText && (
              <p className="text-xs text-muted-foreground text-center mt-6">{branding.footerText}</p>
            )}
          </form>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default Login;
