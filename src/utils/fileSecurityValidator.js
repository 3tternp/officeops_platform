// File Security Validator
// Provides basic security checks for uploaded files

export class FileSecurityValidator {
  
  // PDF magic bytes and known malicious patterns
  static PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46]; // %PDF
  
  // Suspicious patterns that might indicate malicious content
  static SUSPICIOUS_PATTERNS = [
    /\/JavaScript/gi,
    /\/JS/gi,
    /\/URI/gi,
    /\/GoTo/gi,
    /\/Launch/gi,
    /\/SubmitForm/gi,
    /\/ImportData/gi,
    /\/AA\s*<<\s*\/O/gi, // Auto-action on open
    /\/OpenAction/gi,
    /\/AcroForm/gi,
    /\/XFA/gi,
    /\/EmbeddedFile/gi,
    /\/F\s+\/Type\s+\/Filespec/gi,
    /<script/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /eval\s*\(/gi,
    /document\.write/gi,
    /window\.open/gi,
    /XMLHttpRequest/gi,
    /ActiveXObject/gi
  ];
  
  // File size limits (in bytes)
  static MAX_FILE_SIZES = {
    pdf: 50 * 1024 * 1024,  // 50MB
    mp4: 500 * 1024 * 1024, // 500MB
    default: 25 * 1024 * 1024 // 25MB
  };

  /**
   * Validates if the file is a legitimate PDF
   * @param {File} file - The file to validate
   * @returns {Promise<{isValid: boolean, errors: string[]}>}
   */
  static async validatePDF(file) {
    const errors = [];
    
    try {
      // Check file extension
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.pdf')) {
        errors.push('File must have a .pdf extension');
      }
      
      // Check MIME type
      if (file.type !== 'application/pdf') {
        errors.push('Invalid file type. Expected application/pdf');
      }
      
      // Check file size
      if (file.size > this.MAX_FILE_SIZES.pdf) {
        errors.push(`File size exceeds maximum limit of ${this.MAX_FILE_SIZES.pdf / 1024 / 1024}MB`);
      }
      
      // Check for empty file
      if (file.size === 0) {
        errors.push('File appears to be empty');
      }
      
      // Read first few bytes to check PDF magic signature
      const arrayBuffer = await this.readFileBytes(file, 0, 4);
      const bytes = new Uint8Array(arrayBuffer);
      
      if (!this.checkPDFMagicBytes(bytes)) {
        errors.push('File does not appear to be a valid PDF (invalid file signature)');
      }
      
      // Scan for suspicious content
      const suspiciousResults = await this.scanForSuspiciousContent(file);
      if (!suspiciousResults.isSafe) {
        errors.push(...suspiciousResults.threats);
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings: suspiciousResults.warnings || []
      };
      
    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
      return { isValid: false, errors };
    }
  }

  /**
   * Validates if the file is a legitimate MP4 video
   * @param {File} file - The file to validate
   * @returns {Promise<{isValid: boolean, errors: string[]}>}
   */
  static async validateMP4(file) {
    const errors = [];
    
    try {
      // Check file extension
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.mp4')) {
        errors.push('File must have a .mp4 extension');
      }
      
      // Check MIME type
      if (!['video/mp4', 'video/mpeg'].includes(file.type)) {
        errors.push('Invalid file type. Expected video/mp4');
      }
      
      // Check file size
      if (file.size > this.MAX_FILE_SIZES.mp4) {
        errors.push(`File size exceeds maximum limit of ${this.MAX_FILE_SIZES.mp4 / 1024 / 1024}MB`);
      }
      
      // Check for empty file
      if (file.size === 0) {
        errors.push('File appears to be empty');
      }
      
      // Check MP4 file signature (ftyp box)
      const arrayBuffer = await this.readFileBytes(file, 0, 12);
      const bytes = new Uint8Array(arrayBuffer);
      
      if (!this.checkMP4Signature(bytes)) {
        errors.push('File does not appear to be a valid MP4 video (invalid file signature)');
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings: []
      };
      
    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
      return { isValid: false, errors };
    }
  }

  /**
   * Checks PDF magic bytes
   */
  static checkPDFMagicBytes(bytes) {
    if (bytes.length < 4) return false;
    
    return this.PDF_MAGIC_BYTES.every((byte, index) => bytes[index] === byte);
  }

  /**
   * Checks MP4 file signature
   */
  static checkMP4Signature(bytes) {
    if (bytes.length < 12) return false;
    
    // Check for 'ftyp' at offset 4
    const ftypBytes = [0x66, 0x74, 0x79, 0x70]; // 'ftyp'
    return ftypBytes.every((byte, index) => bytes[4 + index] === byte);
  }

  /**
   * Reads specific bytes from a file
   */
  static readFileBytes(file, start, length) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const blob = file.slice(start, start + length);
      
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file bytes'));
      
      reader.readAsArrayBuffer(blob);
    });
  }

  /**
   * Scans file content for suspicious patterns
   */
  static async scanForSuspiciousContent(file) {
    const warnings = [];
    const threats = [];
    
    try {
      // Read first 64KB for pattern matching
      const chunkSize = Math.min(64 * 1024, file.size);
      const arrayBuffer = await this.readFileBytes(file, 0, chunkSize);
      const content = new TextDecoder('utf-8').decode(arrayBuffer);
      
      // Check for suspicious patterns
      for (const pattern of this.SUSPICIOUS_PATTERNS) {
        if (pattern.test(content)) {
          const patternName = pattern.source.replace(/[\/\\]/g, '');
          threats.push(`Suspicious pattern detected: ${patternName}`);
        }
      }
      
      // Check for embedded files
      if (content.includes('/EmbeddedFile')) {
        warnings.push('PDF contains embedded files - review carefully');
      }
      
      // Check for forms
      if (content.includes('/AcroForm')) {
        warnings.push('PDF contains interactive forms');
      }
      
      // Check for JavaScript
      if (content.includes('/JavaScript') || content.includes('/JS')) {
        threats.push('PDF contains JavaScript - potentially malicious');
      }
      
      // Check for auto-actions
      if (content.includes('/OpenAction') || content.includes('/AA')) {
        threats.push('PDF contains auto-actions - potentially malicious');
      }
      
      return {
        isSafe: threats.length === 0,
        threats,
        warnings
      };
      
    } catch (error) {
      warnings.push('Could not scan file content completely');
      return {
        isSafe: true, // Allow if scanning fails
        threats: [],
        warnings
      };
    }
  }

  /**
   * General file validation for common security checks
   */
  static async validateFile(file, allowedTypes) {
    const errors = [];
    
    // Check if file type is allowed
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      errors.push(`File type '${fileExtension}' is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    // Check file name for suspicious characters
    const suspiciousChars = /[<>:"|?*\x00-\x1f]/;
    if (suspiciousChars.test(file.name)) {
      errors.push('File name contains invalid characters');
    }
    
    // Check for double extensions (e.g., .pdf.exe)
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    if (nameWithoutExt.includes('.')) {
      const hiddenExt = nameWithoutExt.split('.').pop().toLowerCase();
      const dangerousExts = ['exe', 'bat', 'cmd', 'scr', 'pif', 'com', 'js', 'vbs'];
      if (dangerousExts.includes(hiddenExt)) {
        errors.push('File has potentially dangerous double extension');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default FileSecurityValidator;
