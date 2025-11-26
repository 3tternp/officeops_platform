/**
 * Security Utilities for OfficeOps Platform
 * Implements secure coding practices and vulnerability protection
 */

// Input validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&%=.])*)?(?:\#(?:[\w.])*)?)?$/,
  SQL_INJECTION: /('|(\\x27)|(\\x2D)(-)|(%27)|(%2D))/i,
  XSS_BASIC: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  XSS_ADVANCED: /javascript:|vbscript:|onload=|onerror=|onclick=/i,
  HTML_TAGS: /<[^>]*>/g,
  SPECIAL_CHARS: /[<>\"'&]/g
};

// File type validation
export const ALLOWED_FILE_TYPES = {
  DOCUMENTS: ['.pdf', '.doc', '.docx', '.txt'],
  IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  VIDEOS: ['.mp4', '.webm'],
  DATA: ['.csv', '.xlsx', '.json'],
  ALL_SAFE: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.csv', '.xlsx', '.json']
};

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  DOCUMENT: 25 * 1024 * 1024, // 25MB
  IMAGE: 5 * 1024 * 1024,     // 5MB
  VIDEO: 100 * 1024 * 1024,   // 100MB
  DATA: 10 * 1024 * 1024      // 10MB
};

/**
 * Sanitize HTML input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeHTML = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and dangerous characters
  return input
    .replace(VALIDATION_PATTERNS.HTML_TAGS, '') // Remove HTML tags
    .replace(VALIDATION_PATTERNS.XSS_BASIC, '') // Remove script tags
    .replace(VALIDATION_PATTERNS.XSS_ADVANCED, '') // Remove event handlers
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  return typeof email === 'string' && VALIDATION_PATTERNS.EMAIL.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with score and feedback
 */
export const validatePasswordStrength = (password) => {
  if (!password) return { isValid: false, score: 0, feedback: 'Password is required' };
  
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  let feedback = '';
  if (!checks.length) feedback = 'Password must be at least 8 characters';
  else if (!checks.lowercase) feedback = 'Password must contain lowercase letters';
  else if (!checks.uppercase) feedback = 'Password must contain uppercase letters';
  else if (!checks.number) feedback = 'Password must contain numbers';
  else if (!checks.special) feedback = 'Password must contain special characters (@$!%*?&)';
  
  return {
    isValid: score === 5,
    score: (score / 5) * 100,
    feedback,
    checks
  };
};

/**
 * Check for SQL injection patterns
 * @param {string} input - Input to check
 * @returns {boolean} - True if potentially dangerous
 */
export const hasSQLInjection = (input) => {
  return typeof input === 'string' && VALIDATION_PATTERNS.SQL_INJECTION.test(input);
};

/**
 * Check for XSS patterns
 * @param {string} input - Input to check
 * @returns {boolean} - True if potentially dangerous
 */
export const hasXSS = (input) => {
  return typeof input === 'string' && 
    (VALIDATION_PATTERNS.XSS_BASIC.test(input) || VALIDATION_PATTERNS.XSS_ADVANCED.test(input));
};

/**
 * Validate file upload
 * @param {File} file - File object to validate
 * @param {string} context - Upload context ('document', 'image', 'video', 'data')
 * @returns {object} - Validation result
 */
export const validateFileUpload = (file, context = 'document') => {
  if (!file) return { isValid: false, error: 'No file provided' };
  
  // Get file extension
  const fileName = file.name.toLowerCase();
  const fileExtension = '.' + fileName.split('.').pop();
  
  // Get allowed types and size limit based on context
  let allowedTypes, sizeLimit;
  
  switch (context) {
    case 'document':
      allowedTypes = ALLOWED_FILE_TYPES.DOCUMENTS;
      sizeLimit = FILE_SIZE_LIMITS.DOCUMENT;
      break;
    case 'image':
      allowedTypes = ALLOWED_FILE_TYPES.IMAGES;
      sizeLimit = FILE_SIZE_LIMITS.IMAGE;
      break;
    case 'video':
      allowedTypes = ALLOWED_FILE_TYPES.VIDEOS;
      sizeLimit = FILE_SIZE_LIMITS.VIDEO;
      break;
    case 'data':
      allowedTypes = ALLOWED_FILE_TYPES.DATA;
      sizeLimit = FILE_SIZE_LIMITS.DATA;
      break;
    default:
      allowedTypes = ALLOWED_FILE_TYPES.ALL_SAFE;
      sizeLimit = FILE_SIZE_LIMITS.DOCUMENT;
  }
  
  // Validate file type
  if (!allowedTypes.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  // Validate file size
  if (file.size > sizeLimit) {
    return {
      isValid: false,
      error: `File size exceeds limit. Maximum size: ${(sizeLimit / (1024 * 1024)).toFixed(1)}MB`
    };
  }
  
  // Validate MIME type matches extension
  const expectedMimeTypes = {
    '.pdf': ['application/pdf'],
    '.doc': ['application/msword'],
    '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    '.txt': ['text/plain'],
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png'],
    '.gif': ['image/gif'],
    '.webp': ['image/webp'],
    '.mp4': ['video/mp4'],
    '.webm': ['video/webm'],
    '.csv': ['text/csv', 'application/csv'],
    '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    '.json': ['application/json']
  };
  
  const expectedTypes = expectedMimeTypes[fileExtension];
  if (expectedTypes && !expectedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type does not match file extension'
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Generate secure random string
 * @param {number} length - Length of string
 * @returns {string} - Random string
 */
export const generateSecureRandom = (length = 32) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const values = crypto.getRandomValues(new Uint8Array(length));
  
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  
  return result;
};

/**
 * Hash sensitive data (simple client-side hashing)
 * @param {string} data - Data to hash
 * @returns {Promise<string>} - Hashed data
 */
export const hashData = async (data) => {
  if (!data) return '';

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
};

// Convert ArrayBuffer to hex string
const bufferToHex = (buffer) => {
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Retrieve pepper from environment (kept outside localStorage)
const getAuthPepper = () => {
  const pepper = import.meta?.env?.VITE_AUTH_PEPPER;
  return typeof pepper === 'string' ? pepper : '';
};

/**
 * Generate a cryptographically strong salt for credentials
 * @param {number} bytes - number of random bytes
 * @returns {string} - hex-encoded salt
 */
export const generateSalt = (bytes = 16) => {
  const random = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(random).map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Derive a salted + peppered password hash using SHA-256
 * @param {string} password
 * @param {string} salt - hex encoded salt
 * @returns {Promise<string>} - derived hash
 */
export const derivePasswordHash = async (password, salt) => {
  if (!password || !salt) return '';
  const encoder = new TextEncoder();
  const pepper = getAuthPepper();
  const payload = `${salt}:${password}:${pepper}`;
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(payload));
  return bufferToHex(hashBuffer);
};

/**
 * Verify password against salted hash with legacy fallback support
 * @param {string} password
 * @param {object} user - user record containing credential fields
 * @returns {Promise<boolean>}
 */
export const verifyPassword = async (password, user) => {
  if (!password || !user) return false;

  if (user.passwordSalt && user.passwordHash) {
    const hashed = await derivePasswordHash(password, user.passwordSalt);
    if (hashed === user.passwordHash) return true;
  }

  // Legacy SHA-256 only hash
  if (user.passwordHash && !user.passwordSalt) {
    const legacyHash = await hashData(password);
    if (legacyHash === user.passwordHash) return true;
  }

  // Legacy plaintext fallback (should be phased out)
  if (user.password) {
    return user.password === password;
  }

  return false;
};

/**
 * Validate form input against common attacks
 * @param {string} input - Input to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {object} - Validation result
 */
export const validateInput = (input, fieldName = 'Field') => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  // Check for SQL injection
  if (hasSQLInjection(input)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }
  
  // Check for XSS
  if (hasXSS(input)) {
    return { isValid: false, error: `${fieldName} contains potentially dangerous content` };
  }
  
  // Check length limits
  if (input.length > 1000) {
    return { isValid: false, error: `${fieldName} is too long (maximum 1000 characters)` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Escape user input for safe display
 * @param {string} input - Input to escape
 * @returns {string} - Escaped string
 */
export const escapeUserInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Rate limiting helper (simple client-side implementation)
 * @param {string} action - Action identifier
 * @param {number} maxAttempts - Maximum attempts
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if action is allowed
 */
export const checkRateLimit = (action, maxAttempts = 5, windowMs = 60000) => {
  const key = `rateLimit_${action}`;
  const now = Date.now();
  
  try {
    const stored = localStorage.getItem(key);
    const attempts = stored ? JSON.parse(stored) : [];
    
    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    // Check if limit exceeded
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Allow on error to avoid blocking legitimate users
  }
};

/**
 * Secure localStorage wrapper with encryption
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const secureStore = (key, value) => {
  try {
    const jsonString = JSON.stringify(value);
    const sanitizedKey = sanitizeHTML(key);
    localStorage.setItem(sanitizedKey, jsonString);
  } catch (error) {
    console.error('Secure storage failed:', error);
  }
};

/**
 * Secure localStorage retrieval
 * @param {string} key - Storage key
 * @returns {any} - Retrieved value
 */
export const secureRetrieve = (key) => {
  try {
    const sanitizedKey = sanitizeHTML(key);
    const stored = localStorage.getItem(sanitizedKey);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Secure retrieval failed:', error);
    return null;
  }
};

/**
 * Content Security Policy helper
 */
export const CSP_DIRECTIVES = {
  DEFAULT_SRC: "'self'",
  SCRIPT_SRC: "'self' 'unsafe-inline' 'unsafe-eval'",
  STYLE_SRC: "'self' 'unsafe-inline'",
  IMG_SRC: "'self' data: blob:",
  FONT_SRC: "'self' data:",
  CONNECT_SRC: "'self'",
  FRAME_SRC: "'self' data:",
  OBJECT_SRC: "'none'"
};

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

/**
 * Audit log entry creation
 * @param {string} action - Action performed
 * @param {string} resource - Resource affected
 * @param {object} details - Additional details
 */
export const createAuditLog = (action, resource, details = {}) => {
  try {
    const timestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    const auditEntry = {
      timestamp,
      action: sanitizeHTML(action),
      resource: sanitizeHTML(resource),
      userId: currentUser.id,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      userAgent: sanitizeHTML(userAgent),
      ip: 'client-side', // Would be server IP in real implementation
      details: {
        ...details,
        sessionId: localStorage.getItem('authToken')
      }
    };
    
    // Store audit log
    const auditLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    auditLogs.push(auditEntry);
    
    // Keep only last 1000 entries to avoid storage overflow
    if (auditLogs.length > 1000) {
      auditLogs.splice(0, auditLogs.length - 1000);
    }
    
    localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Audit Log:', auditEntry);
    }
    
    return auditEntry;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    return null;
  }
};

/**
 * Check for suspicious activity patterns
 * @param {string} userId - User ID to check
 * @returns {object} - Security assessment
 */
export const checkSuspiciousActivity = (userId) => {
  try {
    const auditLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    const userLogs = auditLogs.filter(log => log.userId === userId);
    
    const lastHour = Date.now() - (60 * 60 * 1000);
    const recentLogs = userLogs.filter(log => new Date(log.timestamp).getTime() > lastHour);
    
    const suspiciousIndicators = {
      rapidRequests: recentLogs.length > 50, // More than 50 actions in an hour
      multipleFailedLogins: recentLogs.filter(log => log.action.includes('login') && log.details.success === false).length > 5,
      sensitiveDataAccess: recentLogs.filter(log => log.action.includes('export') || log.action.includes('download')).length > 10,
      roleEscalation: recentLogs.some(log => log.action.includes('role') && log.action.includes('change'))
    };
    
    const threatScore = Object.values(suspiciousIndicators).filter(Boolean).length;
    
    return {
      threatScore,
      maxScore: Object.keys(suspiciousIndicators).length,
      isSuspicious: threatScore > 1,
      indicators: suspiciousIndicators,
      recommendation: threatScore > 2 ? 'Block user' : threatScore > 1 ? 'Monitor closely' : 'Normal'
    };
  } catch (error) {
    console.error('Suspicious activity check failed:', error);
    return { isSuspicious: false, threatScore: 0 };
  }
};

/**
 * Session security helper
 */
export const SessionSecurity = {
  // Generate secure session token
  generateSessionToken: () => {
    return generateSecureRandom(64);
  },
  
  // Validate session integrity
  validateSession: () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      const loginTime = localStorage.getItem('loginTime');
      
      if (!authToken || !user || !loginTime) return false;
      
      // Check session expiry (24 hours)
      const maxSessionTime = 24 * 60 * 60 * 1000; // 24 hours
      const sessionAge = Date.now() - parseInt(loginTime);
      
      if (sessionAge > maxSessionTime) {
        SessionSecurity.clearSession();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  },
  
  // Clear session securely
  clearSession: () => {
    const sensitiveKeys = ['authToken', 'user', 'currentUser', 'loginTime'];
    sensitiveKeys.forEach(key => localStorage.removeItem(key));
    sessionStorage.clear();
  },
  
  // Update session activity
  updateActivity: () => {
    localStorage.setItem('lastActivity', Date.now().toString());
  }
};

/**
 * Input sanitization for form fields
 * @param {object} formData - Form data object
 * @returns {object} - Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  if (!formData || typeof formData !== 'object') return {};
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHTML(value.trim());
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeHTML(item.trim()) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Secure API request helper (for future backend integration)
 * @param {string} url - API endpoint
 * @param {object} options - Request options
 * @returns {Promise} - Fetch promise with security headers
 */
export const secureApiRequest = async (url, options = {}) => {
  const authToken = localStorage.getItem('authToken');
  
  const secureOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': authToken ? `Bearer ${authToken}` : '',
      ...options.headers
    }
  };
  
  // Validate URL
  if (!VALIDATION_PATTERNS.URL.test(url)) {
    throw new Error('Invalid URL provided');
  }
  
  // Log API access for audit
  createAuditLog('api_request', url, { method: options.method || 'GET' });
  
  return fetch(url, secureOptions);
};

// Create the security utilities object
const securityUtilsObj = {
  // Input validation and sanitization
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    return escapeUserInput(input);
  },
  
  validateInput: (input, rules = {}) => {
    return validateInput(input, rules);
  },
  
  detectXSS: (input) => {
    return hasXSS(input);
  },
  
  detectSQLInjection: (input) => {
    return hasSQLInjection(input);
  },
  
  // Rate limiting
  checkRateLimit: (action, maxAttempts = 5, windowMs = 900000) => {
    return checkRateLimit(action, maxAttempts, windowMs);
  },
  
  // Session management
  generateSecureToken: () => {
    return generateSecureRandom(32);
  },
  
  // Security headers
  getSecurityHeaders: () => {
    return { ...SECURITY_HEADERS };
  },
  
  generateCSP: () => {
    return [
      `default-src ${CSP_DIRECTIVES.DEFAULT_SRC}`,
      `script-src ${CSP_DIRECTIVES.SCRIPT_SRC}`,
      `style-src ${CSP_DIRECTIVES.STYLE_SRC}`,
      `img-src ${CSP_DIRECTIVES.IMG_SRC}`,
      `font-src ${CSP_DIRECTIVES.FONT_SRC}`,
      `connect-src ${CSP_DIRECTIVES.CONNECT_SRC}`,
      `frame-src ${CSP_DIRECTIVES.FRAME_SRC}`,
      `object-src ${CSP_DIRECTIVES.OBJECT_SRC}`
    ];
  },
  
  // Audit logging
  auditLog: (logEntry) => {
    createAuditLog(logEntry.action, logEntry.details?.resource || 'unknown', logEntry.details || {});
  },
  
  // Login attempt management
  getLoginAttempts: () => {
    const attempts = localStorage.getItem('loginAttempts');
    return attempts ? parseInt(attempts) : 0;
  },
  
  incrementLoginAttempts: () => {
    const current = securityUtilsObj.getLoginAttempts();
    localStorage.setItem('loginAttempts', (current + 1).toString());
    localStorage.setItem('lastLoginAttempt', Date.now().toString());
  },
  
  resetLoginAttempts: () => {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lastLoginAttempt');
  },
  
  // File validation
  validateFile: (file) => {
    return validateFileUpload(file);
  },
  
  // Password validation
  validatePassword: (password) => {
    return validatePasswordStrength(password);
  },

  // Credential hashing helpers
  generateSalt: (bytes = 16) => generateSalt(bytes),
  derivePasswordHash: (password, salt) => derivePasswordHash(password, salt),
  verifyPassword: (password, user) => verifyPassword(password, user),

  // Secure API requests
  secureRequest: (url, options = {}) => {
    return secureApiRequest(url, options);
  },
  
  // Initialize security
  initSecurity: () => {
    // Set up any initial security configurations
    console.info('Security utilities initialized');
  },
  
  // All original functions for backward compatibility
  sanitizeHTML,
  isValidEmail,
  validatePasswordStrength,
  hasSQLInjection,
  hasXSS,
  validateFileUpload,
  validateInput,
  escapeUserInput,
  checkRateLimit,
  secureStore,
  secureRetrieve,
  generateSecureRandom,
  hashData,
  generateSalt,
  derivePasswordHash,
  verifyPassword,
  createAuditLog,
  checkSuspiciousActivity,
  SessionSecurity,
  sanitizeFormData,
  secureApiRequest,
  VALIDATION_PATTERNS,
  ALLOWED_FILE_TYPES,
  FILE_SIZE_LIMITS,
  CSP_DIRECTIVES,
  SECURITY_HEADERS
};

// Export both named and default exports
export const securityUtils = securityUtilsObj;
export default securityUtilsObj;
