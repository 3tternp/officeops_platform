import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const PDFViewer = ({ 
  fileUrl, 
  fileName, 
  onClose, 
  zoom = 100, 
  onZoomChange,
  onProgressUpdate,
  className = "" 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingProgress, setViewingProgress] = useState(0);

  useEffect(() => {
    if (fileUrl) {
      setIsLoading(false);
    }
  }, [fileUrl]);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 300);
    onZoomChange?.(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 50);
    onZoomChange?.(newZoom);
  };

  const handleResetZoom = () => {
    onZoomChange?.(100);
  };

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <Icon name="AlertCircle" size={48} className="text-error mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading PDF</h3>
        <p className="text-muted-foreground text-center mb-4">
          Unable to load the PDF document. This might be due to browser security restrictions.
        </p>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => window.open(fileUrl, '_blank')}
            iconName="ExternalLink"
            iconPosition="left"
          >
            Open in New Tab
          </Button>
          {onClose && (
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground">Loading PDF document...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* PDF Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground truncate max-w-xs">
            {fileName || 'Document'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              iconName="ZoomOut"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetZoom}
              className="min-w-[4rem]"
            >
              {zoom}%
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 300}
              iconName="ZoomIn"
            />
          </div>

          {/* Open in new tab */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(fileUrl, '_blank')}
            iconName="ExternalLink"
          />
        </div>
      </div>

      {/* PDF Content */}
      <div 
        className="flex-1 overflow-auto bg-gray-100"
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
          const clampedProgress = Math.min(Math.max(progress, 0), 100);
          setViewingProgress(clampedProgress);
          
          // Report progress to parent component
          if (onProgressUpdate) {
            onProgressUpdate({
              progress: clampedProgress,
              hasReachedEnd: clampedProgress >= 95
            });
          }
        }}
      >
        <div className="flex justify-center p-4">
          <div 
            className="bg-white shadow-lg"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            {fileUrl ? (
              <iframe
                src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1&page=${currentPage}&view=FitH&zoom=page-fit`}
                width="794"
                height="1123" 
                className="border-0"
                title={fileName || 'PDF Document'}
                onLoad={(e) => {
                  try {
                    setIsLoading(false);
                    // Check if iframe content loaded successfully
                    const iframe = e.target;
                    if (iframe && iframe.contentWindow) {
                      // Test if we can access the document
                      try {
                        const iframeDoc = iframe.contentWindow.document;
                        if (!iframeDoc || iframeDoc.title.includes('Error')) {
                          throw new Error('PDF failed to load properly');
                        }
                      } catch (err) {
                        // Cross-origin restrictions are expected for data URLs
                        console.log('Cross-origin access restricted (expected for data URLs)');
                      }
                    }
                    
                    // Simulate progress when PDF loads
                    setTimeout(() => {
                      if (onProgressUpdate) {
                        onProgressUpdate({
                          progress: 10,
                          hasReachedEnd: false
                        });
                      }
                    }, 1000);
                  } catch (error) {
                    console.error('PDF load error:', error);
                    setError('PDF document could not be displayed properly');
                  }
                }}
                onError={(e) => {
                  console.error('iframe error:', e);
                  setError('Failed to load PDF document. The file may be corrupted or incompatible.');
                  setIsLoading(false);
                }}
              />
            ) : (
              <div className="w-[794px] h-[1123px] flex items-center justify-center border border-border">
                <div className="text-center">
                  <Icon name="FileText" size={48} className="text-muted-foreground mb-4 mx-auto" />
                  <p className="text-muted-foreground">No PDF content available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternative Content for Non-PDF Documents */}
      {!fileUrl && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="FileText" size={64} className="text-muted-foreground mb-4 mx-auto" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Document Preview</h3>
            <p className="text-muted-foreground mb-4">
              PDF preview is not available for this document type.
            </p>
            <Button
              variant="outline"
              onClick={() => window.open(fileUrl, '_blank')}
              iconName="Download"
            >
              Download Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
