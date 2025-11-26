import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';
import { useBranding } from '../contexts/BrandingContext';
import { securityUtils } from '../utils/security';

const InitialSetup = () => {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const [orgName, setOrgName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const enableMock = (
    (import.meta.env?.VITE_ENABLE_MOCK_DATA === 'true') ||
    localStorage.getItem('ENABLE_MOCK_DATA') === 'true'
  );
  const adminSetupComplete = localStorage.getItem('officeops_admin_setup_complete') === 'true';

  useEffect(() => {
    // If mock/demo data is enabled or admin setup already complete, skip setup
    if (enableMock || adminSetupComplete) {
      navigate('/login', { replace: true });
    }
  }, [enableMock, adminSetupComplete, navigate]);

  const validate = () => {
    if (!name || !email || !password || !confirmPassword) {
      return 'Please fill in all required fields';
    }

    const emailValid = securityUtils.isValidEmail(email);
    if (!emailValid) return 'Please enter a valid email address';

    const pwdCheck = securityUtils.validatePassword(password);
    if (!pwdCheck.isValid) return pwdCheck.feedback || 'Password does not meet requirements';

    if (password !== confirmPassword) return 'Password and confirmation do not match';

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      // Harden credentials with per-user salt + optional environment pepper
      const passwordSalt = securityUtils.generateSalt();
      const passwordHash = await securityUtils.derivePasswordHash(password, passwordSalt);

      const adminUser = {
        id: `admin_${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'admin',
        department: 'Information Technology',
        avatar: null,
        createdDate: new Date().toISOString(),
        lastLogin: null,
        passwordSalt,
        passwordHash,
        passwordUpdatedAt: new Date().toISOString()
      };

      const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const existing = users.find(u => u.email === adminUser.email);
      if (existing) {
        setError('An account with this email already exists.');
        setIsSubmitting(false);
        return;
      }

      users.push(adminUser);
      localStorage.setItem('allUsers', JSON.stringify(users));

      if (orgName && orgName.trim().length > 0) {
        const existingBrand = JSON.parse(localStorage.getItem('companyBranding') || '{}');
        localStorage.setItem('companyBranding', JSON.stringify({
          ...existingBrand,
          companyName: orgName.trim()
        }));
      }

      // Mark setup complete
      localStorage.setItem('officeops_admin_setup_complete', 'true');

      setSuccess('Admin account created successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (err) {
      setError(err?.message || 'Failed to complete setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-3 sm:p-4 md:p-6">
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
      <div className="absolute inset-0 bg-white/70" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg">
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
              <Icon name="Shield" size={32} color="white" />
            </div>
          )}
          <h1
            className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent mb-1"
            style={{ backgroundImage: 'linear-gradient(90deg, #111827, #374151)' }}
          >
            Initial Setup
          </h1>
          <p className="text-gray-600">Create your first administrator account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200">
          <div className="space-y-4">
            <Input
              label="Organization Name (optional)"
              placeholder="e.g., Acme Corp"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              leftIcon="Building2"
            />
            <Input
              label="Admin Full Name"
              required
              placeholder="e.g., Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon="User"
            />
            <Input
              label="Admin Email"
              required
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon="Mail"
            />
            <Input
              label="Password"
              required
              type="password"
              placeholder="At least 8 characters, mixed case, number, symbol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon="Lock"
            />
            <Input
              label="Confirm Password"
              required
              type="password"
              placeholder="Re-enter the password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon="Lock"
            />

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <Icon name="AlertCircle" size={16} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Icon name="CheckCircle" size={16} />
                <span>{success}</span>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Setting up...' : 'Create Admin Account'}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              This setup is only shown on first install when demo data is disabled.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitialSetup;