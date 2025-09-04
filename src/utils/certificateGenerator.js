// Certificate Generation Utility
// Generates PDF certificates with company branding and verification

import { jsPDF } from 'jspdf';

export class CertificateGenerator {
  
  // Certificate templates
  static TEMPLATES = {
    STANDARD: 'standard',
    COMPLIANCE: 'compliance',
    TECHNICAL: 'technical',
    SAFETY: 'safety',
    LEADERSHIP: 'leadership'
  };

  // Company branding
  static COMPANY_INFO = {
    name: 'OfficeOps Platform',
    address: '123 Business Street, Corporate City, BC 12345',
    phone: '+1 (555) 123-4567',
    email: 'certificates@officeops.com',
    website: 'https://www.officeops.com',
    logo: '/assets/company-logo.png' // Would be actual logo path
  };

  /**
   * Generate a certificate for a user who completed a course
   * @param {Object} certificateData - Certificate generation data
   * @returns {Promise<Object>} Generated certificate data
   */
  static async generateCertificate(certificateData) {
    try {
      const {
        employeeName,
        employeeId,
        department,
        courseName,
        courseId,
        completionDate,
        score,
        passingScore,
        validityMonths = 12,
        template = this.TEMPLATES.STANDARD,
        issuer = 'Learning Administrator'
      } = certificateData;

      // Generate unique certificate ID and verification code
      const certificateId = this.generateCertificateId();
      const verificationCode = this.generateVerificationCode();
      const verificationUrl = `${this.COMPANY_INFO.website}/verify/${verificationCode}`;

      // Calculate expiry date
      const issueDate = new Date();
      const expiryDate = new Date(issueDate);
      expiryDate.setMonth(expiryDate.getMonth() + validityMonths);

      // Certificate data structure
      const certificate = {
        id: certificateId,
        employeeName,
        employeeId,
        department,
        courseName,
        courseId,
        issueDate: issueDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        completionDate: completionDate || issueDate.toISOString(),
        score,
        passingScore,
        status: 'active',
        verificationCode,
        verificationUrl,
        template,
        issuer,
        companyInfo: this.COMPANY_INFO,
        generatedDate: new Date().toISOString()
      };

      // Generate PDF certificate
      const pdfBlob = await this.generatePDFCertificate(certificate);
      
      return {
        success: true,
        certificate,
        pdfBlob,
        downloadUrl: URL.createObjectURL(pdfBlob),
        filename: `certificate_${employeeName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}_${certificateId}.pdf`
      };

    } catch (error) {
      console.error('Error generating certificate:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate PDF certificate using jsPDF
   */
  static async generatePDFCertificate(certificate) {
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Set page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add background gradient effect (simulate with rectangles)
      pdf.setFillColor(248, 250, 252); // Light background
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Add border
      pdf.setDrawColor(30, 64, 175); // Blue border
      pdf.setLineWidth(2);
      pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Add inner border
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

      // Title
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(36);
      pdf.setFont('helvetica', 'bold');
      const title = 'CERTIFICATE OF COMPLETION';
      pdf.text(title, pageWidth / 2, 40, { align: 'center' });

      // Company name
      pdf.setTextColor(55, 65, 81);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text(this.COMPANY_INFO.name, pageWidth / 2, 50, { align: 'center' });

      // "This is to certify that"
      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(12);
      pdf.text('This is to certify that', pageWidth / 2, 70, { align: 'center' });

      // Employee name
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text(certificate.employeeName, pageWidth / 2, 85, { align: 'center' });

      // Employee ID and Department
      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${certificate.employeeId} • ${certificate.department}`, pageWidth / 2, 95, { align: 'center' });

      // "has successfully completed"
      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(12);
      pdf.text('has successfully completed', pageWidth / 2, 110, { align: 'center' });

      // Course name
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(certificate.courseName, pageWidth / 2, 125, { align: 'center' });

      // Score
      pdf.setTextColor(55, 65, 81);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const scoreText = `with a score of ${certificate.score}% (Passing: ${certificate.passingScore}%)`;
      pdf.text(scoreText, pageWidth / 2, 135, { align: 'center' });

      // Issue date
      const issueDate = new Date(certificate.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Issued on ${issueDate}`, pageWidth / 2, 150, { align: 'center' });

      // Footer information
      pdf.setTextColor(107, 114, 128);
      pdf.setFontSize(8);
      
      // Left side footer
      pdf.text(`Certificate ID: ${certificate.id}`, 20, pageHeight - 30);
      pdf.text(`Verification: ${certificate.verificationCode}`, 20, pageHeight - 25);
      
      // Right side footer
      const expiryDate = new Date(certificate.expiryDate).toLocaleDateString();
      pdf.text(`Valid until: ${expiryDate}`, pageWidth - 20, pageHeight - 30, { align: 'right' });
      pdf.text(`Issued by: ${certificate.issuer}`, pageWidth - 20, pageHeight - 25, { align: 'right' });

      // Add decorative elements (circles)
      pdf.setFillColor(251, 191, 36); // Golden color
      pdf.circle(30, 30, 5, 'F');
      pdf.circle(pageWidth - 30, 30, 5, 'F');
      pdf.circle(30, pageHeight - 30, 5, 'F');
      pdf.circle(pageWidth - 30, pageHeight - 30, 5, 'F');

      // Convert to blob
      const pdfBlob = pdf.output('blob');
      return pdfBlob;

    } catch (error) {
      console.error('PDF generation error:', error);
      // Fallback to creating a simple PDF certificate
      return this.createSimplePDFCertificate(certificate);
    }
  }

  /**
   * Generate HTML content for certificate
   */
  static generateCertificateHTML(certificate) {
    const issueDate = new Date(certificate.issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const expiryDate = new Date(certificate.expiryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <div style="
        width: 100%;
        height: 100%;
        padding: 40px;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border: 8px solid #1e40af;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        text-align: center;
        position: relative;
        page-break-inside: avoid;
      ">
        <!-- Header -->
        <div style="margin-bottom: 30px;">
          <h1 style="
            font-size: 48px;
            color: #1e40af;
            margin: 0;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
          ">Certificate of Completion</h1>
          <p style="
            font-size: 20px;
            color: #374151;
            margin: 10px 0;
            font-weight: 500;
          ">${this.COMPANY_INFO.name}</p>
        </div>

        <!-- Content -->
        <div style="margin: 40px 0;">
          <p style="font-size: 18px; color: #6b7280; margin: 20px 0;">This is to certify that</p>
          
          <h2 style="
            font-size: 36px;
            color: #1f2937;
            margin: 20px 0;
            font-weight: bold;
          ">${certificate.employeeName}</h2>
          
          <p style="
            font-size: 16px;
            color: #6b7280;
            margin: 10px 0;
          ">${certificate.employeeId} • ${certificate.department}</p>
          
          <p style="font-size: 18px; color: #6b7280; margin: 30px 0;">has successfully completed</p>
          
          <h3 style="
            font-size: 28px;
            color: #1e40af;
            margin: 20px 0;
            font-weight: bold;
          ">${certificate.courseName}</h3>
          
          <p style="
            font-size: 16px;
            color: #374151;
            margin: 20px 0;
          ">with a score of ${certificate.score}% (Passing: ${certificate.passingScore}%)</p>
          
          <p style="
            font-size: 16px;
            color: #374151;
            margin: 30px 0;
          ">Issued on ${issueDate}</p>
        </div>

        <!-- Footer -->
        <div style="
          position: absolute;
          bottom: 40px;
          left: 40px;
          right: 40px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
        ">
          <div style="text-align: left;">
            <p style="margin: 2px 0;">Certificate ID: ${certificate.id}</p>
            <p style="margin: 2px 0;">Verification: ${certificate.verificationCode}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 2px 0;">Valid until: ${expiryDate}</p>
            <p style="margin: 2px 0;">Issued by: ${certificate.issuer}</p>
          </div>
        </div>

        <!-- Decorative elements -->
        <div style="
          position: absolute;
          top: 20px;
          left: 20px;
          width: 30px;
          height: 30px;
          background: #fbbf24;
          border-radius: 50%;
        "></div>
        <div style="
          position: absolute;
          top: 20px;
          right: 20px;
          width: 30px;
          height: 30px;
          background: #fbbf24;
          border-radius: 50%;
        "></div>
        <div style="
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 30px;
          height: 30px;
          background: #fbbf24;
          border-radius: 50%;
        "></div>
        <div style="
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 30px;
          height: 30px;
          background: #fbbf24;
          border-radius: 50%;
        "></div>
      </div>
    `;
  }

  /**
   * Convert HTML to PDF blob (simplified approach)
   */
  static async htmlToPDFBlob(htmlContent) {
    // Create a simple PDF-like content using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set PDF dimensions (A4)
    canvas.width = 595;  // A4 width at 72 DPI
    canvas.height = 842; // A4 height at 72 DPI

    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Add text content
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 100);

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  }

  /**
   * Create simple PDF fallback certificate
   */
  static createSimplePDFCertificate(certificate) {
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Simple background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Border
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(1);
      pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Title
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 40, { align: 'center' });

      // Content
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('This certifies that', pageWidth / 2, 60, { align: 'center' });

      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(certificate.employeeName, pageWidth / 2, 80, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('has successfully completed', pageWidth / 2, 100, { align: 'center' });

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(certificate.courseName, pageWidth / 2, 120, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const issueDate = new Date(certificate.issueDate).toLocaleDateString();
      pdf.text(`Issued: ${issueDate}`, pageWidth / 2, 140, { align: 'center' });
      pdf.text(`Certificate ID: ${certificate.id}`, pageWidth / 2, 150, { align: 'center' });

      return pdf.output('blob');
    } catch (error) {
      console.error('Simple PDF creation failed:', error);
      // Return a text blob as ultimate fallback
      const textContent = `Certificate of Completion\n\nThis certifies that ${certificate.employeeName} has successfully completed ${certificate.courseName}\n\nIssued: ${new Date(certificate.issueDate).toLocaleDateString()}\nCertificate ID: ${certificate.id}`;
      return new Blob([textContent], { type: 'text/plain' });
    }
  }

  /**
   * Add decorative elements to certificate
   */
  static addDecorativeElements(ctx, canvas) {
    // Add corner decorations
    ctx.fillStyle = '#fbbf24';
    
    // Top-left corner
    ctx.beginPath();
    ctx.arc(100, 100, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Top-right corner
    ctx.beginPath();
    ctx.arc(canvas.width - 100, 100, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Bottom-left corner
    ctx.beginPath();
    ctx.arc(100, canvas.height - 100, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.arc(canvas.width - 100, canvas.height - 100, 15, 0, 2 * Math.PI);
    ctx.fill();

    // Add ribbon effect behind title
    ctx.fillStyle = '#dbeafe';
    ctx.fillRect(150, 90, canvas.width - 300, 50);
  }

  /**
   * Generate unique certificate ID
   */
  static generateCertificateId() {
    const prefix = 'CERT';
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${year}-${timestamp}-${random}`;
  }

  /**
   * Generate verification code
   */
  static generateVerificationCode() {
    return Array.from({ length: 12 }, () => 
      Math.random().toString(36).charAt(Math.floor(Math.random() * 36))
    ).join('').toUpperCase();
  }

  /**
   * Verify certificate by code
   */
  static verifyCertificate(verificationCode, certificates) {
    return certificates.find(cert => cert.verificationCode === verificationCode);
  }

  /**
   * Check if certificate is expired
   */
  static isCertificateExpired(certificate) {
    const now = new Date();
    const expiryDate = new Date(certificate.expiryDate);
    return now > expiryDate;
  }

  /**
   * Check if certificate is expiring soon (within 30 days)
   */
  static isCertificateExpiringSoon(certificate) {
    const now = new Date();
    const expiryDate = new Date(certificate.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }

  /**
   * Get certificate status
   */
  static getCertificateStatus(certificate) {
    if (this.isCertificateExpired(certificate)) {
      return 'expired';
    } else if (this.isCertificateExpiringSoon(certificate)) {
      return 'expiring_soon';
    } else {
      return 'active';
    }
  }

  /**
   * Bulk generate certificates for multiple users
   */
  static async bulkGenerateCertificates(certificateDataArray) {
    const results = [];
    
    for (const certData of certificateDataArray) {
      try {
        const result = await this.generateCertificate(certData);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          employeeName: certData.employeeName
        });
      }
    }
    
    return results;
  }

  /**
   * Renew an expired certificate
   */
  static async renewCertificate(originalCertificate, validityMonths = 12) {
    const renewalData = {
      ...originalCertificate,
      validityMonths,
      completionDate: new Date().toISOString()
    };
    
    return await this.generateCertificate(renewalData);
  }

  /**
   * Download certificate as PDF
   */
  static downloadCertificate(certificate, pdfBlob) {
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate_${certificate.employeeName.replace(/\s+/g, '_')}_${certificate.courseName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export function for generating certificate PDFs (used by CertificateManager)
 */
export const generateCertificatePDF = async (certificateData) => {
  try {
    const result = await CertificateGenerator.generateCertificate({
      employeeName: certificateData.recipientName,
      employeeId: 'EMP-' + Date.now().toString().slice(-4),
      department: 'Training Department',
      courseName: certificateData.courseName,
      courseId: certificateData.courseId || 'COURSE-001',
      completionDate: certificateData.completionDate,
      score: certificateData.completionScore || 95,
      passingScore: 80,
      validityMonths: 12,
      template: CertificateGenerator.TEMPLATES.STANDARD,
      issuer: certificateData.issuer || 'Learning Administrator'
    });

    if (result.success) {
      // Download the certificate
      const url = URL.createObjectURL(result.pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return result;
    } else {
      throw new Error(result.error || 'Certificate generation failed');
    }
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw error;
  }
};

export default CertificateGenerator;
