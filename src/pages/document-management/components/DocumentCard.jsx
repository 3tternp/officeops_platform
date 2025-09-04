import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { hasPermission, PERMISSIONS } from '../../../utils/permissions';

const DocumentCard = ({ document, onView, onAcknowledge, onEdit, onDelete, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'policy': return 'Shield';
      case 'procedure': return 'FileText';
      case 'handbook': return 'Book';
      case 'form': return 'FileSpreadsheet';
      case 'contract': return 'FileSignature';
      default: return 'File';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'acknowledged': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'overdue': return 'text-error bg-error/10';
      case 'expired': return 'text-error bg-error/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-success';
      default: return 'border-l-muted';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = () => {
    if (!document?.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((new Date(document.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = () => {
    if (!document?.expiryDate) return false;
    return new Date(document.expiryDate) < new Date();
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-enterprise hover:shadow-enterprise-md transition-all duration-200 border-l-4 ${getPriorityColor(document?.priority)}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={getDocumentIcon(document?.type)} size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-2">
                {document?.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>v{document?.version}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{formatDate(document?.effectiveDate)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="User" size={14} />
                  <span>{document?.author}</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document?.acknowledgmentStatus)}`}>
            {document?.acknowledgmentStatus === 'acknowledged' && 'Acknowledged'}
            {document?.acknowledgmentStatus === 'pending' && 'Pending Review'}
            {document?.acknowledgmentStatus === 'overdue' && 'Overdue'}
            {document?.acknowledgmentStatus === 'expired' && 'Expired'}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {document?.description}
        </p>

        {/* Metadata */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">Category:</span>
            <p className="font-medium text-foreground capitalize">{document?.category}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Department:</span>
            <p className="font-medium text-foreground">{document?.department}</p>
          </div>
          <div>
            <span className="text-muted-foreground">File Size:</span>
            <p className="font-medium text-foreground">{document?.fileSize}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Language:</span>
            <p className="font-medium text-foreground">{document?.language}</p>
          </div>
        </div>

        {/* Expiry Warning */}
        {(isExpiringSoon() || isExpired()) && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg mb-4 ${
            isExpired() ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
          }`}>
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm font-medium">
              {isExpired() 
                ? `Expired on ${formatDate(document?.expiryDate)}` 
                : `Expires on ${formatDate(document?.expiryDate)}`
              }
            </span>
          </div>
        )}

        {/* Acknowledgment Progress */}
        {document?.targetAudience && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Acknowledgment Progress</span>
              <span className="text-sm font-medium text-foreground">
                {document?.acknowledgedCount}/{document?.targetCount} ({Math.round((document?.acknowledgedCount / document?.targetCount) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(document?.acknowledgedCount / document?.targetCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {document?.tags && document?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {document?.tags?.slice(0, isExpanded ? document?.tags?.length : 3)?.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                {tag}
              </span>
            ))}
            {document?.tags?.length > 3 && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                +{document?.tags?.length - 3} more
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            {hasPermission(userRole, PERMISSIONS.DOCUMENT_VIEW) && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onView(document)}
                iconName="FileText"
                iconPosition="left"
              >
                Read Document
              </Button>
            )}
            
            {document?.acknowledgmentStatus === 'pending' && hasPermission(userRole, PERMISSIONS.DOCUMENT_ACKNOWLEDGE) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAcknowledge(document)}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Acknowledge
              </Button>
            )}
          </div>

          {/* Admin Actions */}
          <div className="flex items-center space-x-2">
            {hasPermission(userRole, PERMISSIONS.DOCUMENT_CREATE) && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(document)}
                iconName="Edit"
                iconPosition="left"
                className="text-accent hover:text-accent hover:bg-accent/10"
              >
                Edit
              </Button>
            )}
            
            {hasPermission(userRole, PERMISSIONS.DOCUMENT_DELETE) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${document?.title}"? This action cannot be undone.`)) {
                    onDelete(document);
                  }
                }}
                iconName="Trash2"
                iconPosition="left"
                className="text-error hover:text-error hover:bg-error/10"
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Document Info */}
        <div className="flex items-center justify-end space-x-4 text-xs text-muted-foreground mt-2">
          {document?.isRequired && (
            <span className="flex items-center space-x-1 text-error">
              <Icon name="AlertCircle" size={12} />
              <span>Required</span>
            </span>
          )}
          {document?.hasESignature && (
            <span className="flex items-center space-x-1 text-success">
              <Icon name="FileSignature" size={12} />
              <span>E-Signature</span>
            </span>
          )}
          <span className="flex items-center space-x-1">
            <Icon name="Eye" size={12} />
            <span>{document?.viewCount} views</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;