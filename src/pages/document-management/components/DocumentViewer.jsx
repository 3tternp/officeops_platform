import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import PDFViewer from '../../../components/ui/PDFViewer';
import dataService from '../../../services/DataService';

const DocumentViewer = ({ document, isOpen, onClose, onAcknowledge }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [documentType, setDocumentType] = useState('html');
  const [fileUrl, setFileUrl] = useState(null);

  // Load current user and document content
  useEffect(() => {
    if (!isOpen) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    
    // Load document content or use default content
    setIsLoading(true);
    
    // Determine document type and content
    if (document?.fileContent) {
      // Handle uploaded document content
      const fileExtension = document.fileExtension || document.title.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'pdf') {
        setDocumentType('pdf');
        setFileUrl(document.fileContent);
        setDocumentContent('');
      } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileExtension)) {
        setDocumentType('image');
        setFileUrl(document.fileContent);
        setDocumentContent('');
      } else if (['doc', 'docx', 'ppt', 'pptx'].includes(fileExtension)) {
        setDocumentType('office');
        setDocumentContent(`
          <div class="text-center py-8">
            <h3 class="text-lg font-semibold mb-4">${document.title}</h3>
            <p class="text-muted-foreground mb-6">This document type requires special handling.</p>
            <p class="text-sm text-muted-foreground">File: ${document.title}</p>
            <p class="text-sm text-muted-foreground">Size: ${document.fileSize || 'Unknown'}</p>
            <p class="text-sm text-muted-foreground">Uploaded: ${new Date(document.uploadDate || Date.now()).toLocaleDateString()}</p>
          </div>
        `);
      } else {
        setDocumentType('text');
        setDocumentContent(`
          <div class="whitespace-pre-wrap font-mono text-sm">${document.fileContent}</div>
        `);
      }
    } else {
      // Use default policy content as fallback
      setDocumentType('html');
      setDocumentContent(getDefaultContent(document));
    }
    
    setIsLoading(false);

    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      // Reset states when closing
      setReadingProgress(0);
      setTimeSpent(0);
      setHasScrolledToEnd(false);
      setDocumentContent('');
    };
  }, [isOpen, document]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e?.target;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setReadingProgress(Math.min(progress, 100));
    
    if (progress >= 95) {
      setHasScrolledToEnd(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getDefaultContent = (doc) => {
    // Return appropriate default content based on document type
    switch (doc?.category) {
      case 'security':
        return getSecurityPolicyContent();
      case 'hr':
        return getHRHandbookContent();
      case 'compliance':
        return getComplianceGuideContent();
      default:
        return getGenericDocumentContent(doc);
    }
  };

  const getSecurityPolicyContent = () => {
    return `
      <h2>1. Purpose and Scope</h2>
      <p>This document establishes the framework for information security management within our organization. It defines the policies, procedures, and guidelines necessary to protect our information assets and ensure compliance with regulatory requirements.</p>
      <p>The scope of this policy applies to all employees, contractors, consultants, and third parties who have access to organizational information systems and data.</p>
      
      <h2>2. Information Security Objectives</h2>
      <ul>
        <li>Ensure the confidentiality, integrity, and availability of information assets</li>
        <li>Comply with applicable legal, regulatory, and contractual requirements</li>
        <li>Minimize business risks related to information security incidents</li>
        <li>Maintain customer trust and organizational reputation</li>
        <li>Enable secure business operations and digital transformation</li>
      </ul>
      
      <h2>3. Roles and Responsibilities</h2>
      <h3>3.1 Senior Management</h3>
      <p>Senior management is responsible for providing leadership and support for information security initiatives, allocating adequate resources, and ensuring compliance with this policy.</p>
      
      <h3>3.2 Information Security Officer</h3>
      <p>The Information Security Officer is responsible for developing, implementing, and maintaining the information security management system and ensuring ongoing compliance.</p>
      
      <h3>3.3 All Personnel</h3>
      <p>All personnel are responsible for understanding and complying with this policy, reporting security incidents, and participating in security awareness training.</p>
      
      <h2>4. Access Control Requirements</h2>
      <p>Access to information systems and data must be controlled based on business requirements and the principle of least privilege. The following requirements apply:</p>
      <ul>
        <li>User access must be authorized by appropriate management</li>
        <li>Access rights must be reviewed regularly and updated as needed</li>
        <li>Strong authentication mechanisms must be implemented</li>
        <li>Privileged access must be strictly controlled and monitored</li>
        <li>Access must be revoked immediately upon termination of employment</li>
      </ul>
      
      <h2>5. Incident Response</h2>
      <p>All security incidents must be reported immediately to the Information Security team. The incident response process includes:</p>
      <ol>
        <li>Immediate containment of the incident</li>
        <li>Assessment of impact and risk</li>
        <li>Investigation and evidence collection</li>
        <li>Recovery and restoration of services</li>
        <li>Lessons learned and process improvement</li>
      </ol>
      
      <h2>6. Compliance and Monitoring</h2>
      <p>Compliance with this policy will be monitored through regular audits, assessments, and reviews. Non-compliance may result in disciplinary action up to and including termination of employment or contract.</p>
    `;
  };

  const getHRHandbookContent = () => {
    return `
      <h2>Welcome to Our Organization</h2>
      <p>This handbook contains important information about our company policies, benefits, and workplace guidelines. Please read it carefully and keep it for future reference.</p>
      
      <h2>1. Code of Conduct</h2>
      <p>We are committed to maintaining the highest standards of professional conduct and integrity in all our business activities.</p>
      
      <h2>2. Employment Policies</h2>
      <p>This section outlines our employment practices, including equal opportunity, non-discrimination, and workplace harassment policies.</p>
      
      <h2>3. Benefits Overview</h2>
      <p>We offer comprehensive benefits including health insurance, retirement plans, paid time off, and professional development opportunities.</p>
      
      <h2>4. Health and Safety</h2>
      <p>The health and safety of our employees is our top priority. This section covers workplace safety procedures and emergency protocols.</p>
    `;
  };

  const getComplianceGuideContent = () => {
    return `
      <h2>Data Privacy Compliance Guide</h2>
      <p>This guide provides comprehensive information on ensuring data privacy compliance including GDPR requirements, data handling procedures, and breach response protocols.</p>
      
      <h2>1. Legal Framework</h2>
      <p>Understanding the legal requirements for data protection and privacy regulations applicable to our organization.</p>
      
      <h2>2. Data Classification</h2>
      <p>Guidelines for classifying and handling different types of personal and sensitive data.</p>
      
      <h2>3. Privacy by Design</h2>
      <p>Implementing privacy considerations throughout the development lifecycle of systems and processes.</p>
      
      <h2>4. Data Subject Rights</h2>
      <p>Procedures for handling data subject requests and ensuring compliance with individual privacy rights.</p>
    `;
  };

  const getGenericDocumentContent = (doc) => {
    return `
      <h2>${doc?.title}</h2>
      <p>${doc?.description}</p>
      
      <h2>Document Overview</h2>
      <p>This document contains important information relevant to ${doc?.department} operations and procedures.</p>
      
      <h2>Key Points</h2>
      <ul>
        <li>Please review this document carefully</li>
        <li>Contact your supervisor with any questions</li>
        <li>Compliance with these guidelines is required</li>
      </ul>
      
      <h2>Contact Information</h2>
      <p>For questions about this document, please contact the ${doc?.department} department.</p>
    `;
  };

  const handleAcknowledge = () => {
    const acknowledgmentData = {
      documentId: document?.id,
      timestamp: new Date()?.toISOString(),
      timeSpent,
      readingProgress,
      hasScrolledToEnd,
      ipAddress: '192.168.1.100', // Mock IP
      userAgent: navigator.userAgent,
      userId: currentUser?.id,
      userName: currentUser?.name,
      userEmail: currentUser?.email
    };
    
    onAcknowledge(acknowledgmentData);
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm">
      <div className={`bg-card border border-border shadow-enterprise-lg ${
        isFullscreen ? 'fixed inset-0' : 'fixed inset-4 rounded-lg'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{document?.title}</h2>
              <p className="text-sm text-muted-foreground">
                Version {document?.version} • {document?.fileSize} • {formatTime(timeSpent)} reading time
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                disabled={zoom <= 50}
              >
                <Icon name="ZoomOut" size={16} />
              </Button>
              <span className="text-sm font-medium px-2">{zoom}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                disabled={zoom >= 200}
              >
                <Icon name="ZoomIn" size={16} />
              </Button>
            </div>

            {/* Fullscreen Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={16} />
            </Button>


            {/* Close */}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted h-1">
          <div 
            className="bg-primary h-1 transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="flex flex-1 h-[calc(100%-8rem)]">
          {/* Document Content */}
          {documentType === 'pdf' ? (
            <div className="flex-1">
              <PDFViewer 
                fileUrl={fileUrl}
                fileName={document?.title}
                zoom={zoom}
                onZoomChange={(newZoom) => setZoom(newZoom)}
                className="h-full"
              />
            </div>
          ) : documentType === 'image' ? (
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto">
                {/* Document Header */}
                <div className="mb-8 pb-6 border-b border-border bg-white p-6 rounded-lg">
                  <h1 className="text-3xl font-bold text-foreground mb-4">{document?.title}</h1>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium">Image Document</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <p className="font-medium">{document?.fileSize || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Format:</span>
                      <p className="font-medium">{document?.fileExtension?.toUpperCase() || 'IMG'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Uploaded:</span>
                      <p className="font-medium">{new Date(document.uploadDate || Date.now())?.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                {/* Image Content */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-center">
                    <img 
                      src={fileUrl} 
                      alt={document?.title}
                      className="max-w-full h-auto mx-auto"
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                      onLoad={() => setHasScrolledToEnd(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="flex-1 overflow-auto p-6"
              onScroll={handleScroll}
              style={{ fontSize: `${zoom}%` }}
            >
              <div className="max-w-4xl mx-auto">
                {/* Document Header */}
                <div className="mb-8 pb-6 border-b border-border">
                  <h1 className="text-3xl font-bold text-foreground mb-4">{document?.title}</h1>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Version:</span>
                      <p className="font-medium">{document?.version}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Effective Date:</span>
                      <p className="font-medium">{new Date(document.effectiveDate)?.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Author:</span>
                      <p className="font-medium">{document?.author}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Department:</span>
                      <p className="font-medium">{document?.department}</p>
                    </div>
                  </div>
                </div>

                {/* Document Content */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span className="ml-3 text-muted-foreground">Loading document content...</span>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none">
                    <div className="space-y-6 text-foreground document-content">
                      {documentContent ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: documentContent }}
                          style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: 'inherit'
                          }}
                        />
                      ) : (
                        <div className="text-muted-foreground text-center py-8">
                          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-muted-foreground/50" />
                          <p>Document content is not available for preview.</p>
                          <p className="text-sm">Please contact your administrator if this document should have content.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className="w-80 border-l border-border bg-muted/30 p-4 overflow-auto">
            <div className="space-y-6">
              {/* Reading Progress */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Reading Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(readingProgress)}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${readingProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Time: {formatTime(timeSpent)}</span>
                    <span>{hasScrolledToEnd ? 'Complete' : 'In Progress'}</span>
                  </div>
                </div>
              </div>

              {/* Document Info */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Document Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium capitalize">{document?.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Department:</span>
                    <p className="font-medium">{document?.department}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Language:</span>
                    <p className="font-medium">{document?.language}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Modified:</span>
                    <p className="font-medium">{new Date(document.lastModified)?.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Related Documents */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Related Documents</h3>
                <div className="space-y-2">
                  {document?.relatedDocuments?.map((related, index) => (
                    <div key={index} className="p-2 bg-background rounded-lg hover:bg-muted cursor-pointer transition-colors">
                      <p className="text-sm font-medium text-foreground">{related?.title}</p>
                      <p className="text-xs text-muted-foreground">{related?.type}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acknowledgment Requirements */}
              {document?.acknowledgmentStatus === 'pending' && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <h3 className="font-medium text-warning mb-2">Acknowledgment Required</h3>
                  <p className="text-sm text-warning/80 mb-3">
                    You must read this document completely and provide acknowledgment to proceed.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Reading Progress:</span>
                      <span className={readingProgress >= 95 ? 'text-success' : 'text-warning'}>
                        {readingProgress >= 95 ? '✓ Complete' : `${Math.round(readingProgress)}%`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minimum Time:</span>
                      <span className={timeSpent >= 120 ? 'text-success' : 'text-warning'}>
                        {timeSpent >= 120 ? '✓ Met' : `${Math.max(0, 120 - timeSpent)}s remaining`}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Page {currentPage} of 1</span>
            <span>•</span>
            <span>{document?.fileSize}</span>
            <span>•</span>
            <span>Last updated: {new Date(document.lastModified)?.toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {document?.acknowledgmentStatus === 'pending' && (
              <Button
                variant="default"
                onClick={handleAcknowledge}
                disabled={readingProgress < 95 || timeSpent < 120}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Acknowledge Document
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;