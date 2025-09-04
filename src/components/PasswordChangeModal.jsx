import React, { useState } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import Input from './ui/Input';

const PasswordChangeModal = ({ isOpen, onClose, onSubmit, userEmail }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.newPassword);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      setIsSubmitting(false);
      return;
    }

    if (!isPasswordValid) {
      alert('Password does not meet requirements!');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        userEmail: userEmail
      });
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      onClose();
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Change Password</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update your account password
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Password */}
          <div className="relative">
            <Input
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              required
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
            >
              <Icon name={showPasswords.current ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <Input
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              required
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
            >
              <Icon name={showPasswords.new ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>

          {/* Password Requirements */}
          {formData.newPassword && (
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2 text-sm">Password Requirements:</h4>
              <div className="space-y-1">
                {Object.entries({
                  length: 'At least 8 characters',
                  uppercase: 'One uppercase letter',
                  lowercase: 'One lowercase letter',
                  number: 'One number',
                  special: 'One special character'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Icon 
                      name={passwordRequirements[key] ? "CheckCircle" : "Circle"} 
                      size={14} 
                      className={passwordRequirements[key] ? "text-success" : "text-muted-foreground"} 
                    />
                    <span className={`text-xs ${passwordRequirements[key] ? "text-success" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
            >
              <Icon name={showPasswords.confirm ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>

          {/* Password Match Indicator */}
          {formData.newPassword && formData.confirmPassword && (
            <div className={`text-xs flex items-center space-x-2 ${
              formData.newPassword === formData.confirmPassword ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={formData.newPassword === formData.confirmPassword ? "CheckCircle" : "XCircle"} 
                size={14} 
              />
              <span>
                {formData.newPassword === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isPasswordValid || formData.newPassword !== formData.confirmPassword}
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
