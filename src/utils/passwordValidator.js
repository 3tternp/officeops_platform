/**
 * Password validation utilities
 */

class PasswordValidator {
    constructor() {
        this.minLength = 8;
        this.maxLength = 128;
    }

    /**
     * Validate password strength
     * @param {string} password - The password to validate
     * @returns {Object} - Validation result with isValid and errors
     */
    validatePassword(password) {
        const errors = [];
        
        if (!password || typeof password !== 'string') {
            errors.push('Password is required');
            return { isValid: false, errors };
        }

        // Length validation
        if (password.length < this.minLength) {
            errors.push(`Password must be at least ${this.minLength} characters long`);
        }

        if (password.length > this.maxLength) {
            errors.push(`Password must not exceed ${this.maxLength} characters`);
        }

        // Complexity validation
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUpperCase) {
            errors.push('Password must contain at least one uppercase letter');
        }

        if (!hasLowerCase) {
            errors.push('Password must contain at least one lowercase letter');
        }

        if (!hasNumbers) {
            errors.push('Password must contain at least one number');
        }

        if (!hasSpecialChar) {
            errors.push('Password must contain at least one special character');
        }

        // Common password patterns
        if (this.isCommonPassword(password)) {
            errors.push('Password is too common. Please choose a more unique password');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Validate password change request
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @param {string} confirmPassword - Password confirmation
     * @returns {Object} - Validation result
     */
    validatePasswordChange(currentPassword, newPassword, confirmPassword) {
        const errors = [];

        // Check if current password is provided
        if (!currentPassword) {
            errors.push('Current password is required');
        }

        // Validate new password
        const newPasswordValidation = this.validatePassword(newPassword);
        if (!newPasswordValidation.isValid) {
            errors.push(...newPasswordValidation.errors);
        }

        // Check password confirmation
        if (newPassword !== confirmPassword) {
            errors.push('New password and confirmation do not match');
        }

        // Check if new password is same as current
        if (currentPassword === newPassword) {
            errors.push('New password must be different from current password');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Check if password is commonly used (basic check)
     * @param {string} password - Password to check
     * @returns {boolean} - True if password is common
     */
    isCommonPassword(password) {
        const commonPasswords = [
            'password', '123456', '12345678', 'qwerty', 'abc123',
            'password123', 'admin', 'letmein', 'welcome', '123456789',
            'password1', 'qwerty123', 'admin123'
        ];

        return commonPasswords.includes(password.toLowerCase());
    }

    /**
     * Generate password strength score (0-100)
     * @param {string} password - Password to score
     * @returns {number} - Strength score
     */
    getPasswordStrength(password) {
        if (!password) return 0;

        let score = 0;
        
        // Length bonus
        score += Math.min(password.length * 2, 20);

        // Character variety bonus
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^A-Za-z0-9]/.test(password)) score += 15;

        // Length bonus for longer passwords
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 10;

        // Penalty for common patterns
        if (this.isCommonPassword(password)) score -= 30;
        if (/^[a-zA-Z]+$/.test(password)) score -= 10; // Only letters
        if (/^[0-9]+$/.test(password)) score -= 20; // Only numbers

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Get password strength label
     * @param {number} score - Password strength score
     * @returns {string} - Strength label
     */
    getPasswordStrengthLabel(score) {
        if (score < 30) return 'Weak';
        if (score < 60) return 'Fair';
        if (score < 80) return 'Good';
        return 'Strong';
    }
}

module.exports = new PasswordValidator();
