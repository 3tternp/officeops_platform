import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import dataService from '../../../services/DataService';

const PersonalDocumentCard = ({ currentUser }) => {
  const [documentData, setDocumentData] = useState({
    acknowledged: 0,
    pending: 0,
    overdue: 0,
    recentAcknowledgments: [],
    pendingDocuments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      loadDocumentData();
    }
  }, [currentUser]);

  const loadDocumentData = () => {
    try {
      // Get documents and acknowledgments from DataService
      const documents = dataService.getModuleData('documents') || [];
      const acknowledgments = dataService.getModuleData('policyAcknowledgments') || [];
      
      // Filter user's acknowledgments
      const userAcknowledgments = acknowledgments.filter(ack => 
        ack.userId === currentUser.id || ack.userEmail === currentUser.email
      );

      const acknowledgedDocumentIds = userAcknowledgments.map(ack => ack.documentId);
      
      // Get recent acknowledgments
      const recentAcknowledgments = userAcknowledgments
        .sort((a, b) => new Date(b.acknowledgedAt || b.timestamp) - new Date(a.acknowledgedAt || a.timestamp))
        .slice(0, 3)
        .map(ack => {
          const document = documents.find(doc => doc.id === ack.documentId);
          return {
            ...ack,
            documentTitle: document?.title || 'Document',
            documentType: document?.type || 'document'
          };
        });

      // Get pending documents (not acknowledged and required)
      const pendingDocuments = documents
        .filter(doc => 
          doc.isRequired && 
          !acknowledgedDocumentIds.includes(doc.id)
        )
        .sort((a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate))
        .slice(0, 3);

      // Calculate overdue documents (past effective date + grace period)
      const overdueDocuments = pendingDocuments.filter(doc => {
        const effectiveDate = new Date(doc.effectiveDate);
        const gracePeriod = 30; // 30 days grace period
        const overdueDate = new Date(effectiveDate.getTime() + (gracePeriod * 24 * 60 * 60 * 1000));
        return new Date() > overdueDate;
      });

      setDocumentData({
        acknowledged: userAcknowledgments.length,
        pending: pendingDocuments.length,
        overdue: overdueDocuments.length,
        recentAcknowledgments,
        pendingDocuments
      });
    } catch (error) {
      console.error('Error loading document data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'policy':
        return 'FileText';
      case 'procedure':
        return 'FileCheck';
      case 'handbook':
        return 'Book';
      case 'form':
        return 'FileInput';
      default:
        return 'File';
    }
  };

  const getDaysUntilDue = (effectiveDate) => {
    const today = new Date();
    const due = new Date(effectiveDate);
    const gracePeriod = 30; // 30 days to acknowledge
    const dueDate = new Date(due.getTime() + (gracePeriod * 24 * 60 * 60 * 1000));
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (days) => {
    if (days < 0) return 'text-error'; // Overdue
    if (days <= 7) return 'text-warning'; // Due soon
    return 'text-muted-foreground'; // Normal
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Document Status</h3>
          <div className="w-6 h-6 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="w-20 h-4 bg-muted animate-pulse rounded" />
            <div className="w-8 h-4 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex justify-between">
            <div className="w-16 h-4 bg-muted animate-pulse rounded" />
            <div className="w-8 h-4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Document Status</h3>
        <Icon name="FileCheck" size={20} className="text-primary" />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-success/10 border border-success/20 rounded-lg mx-auto mb-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
          </div>
          <p className="text-lg font-bold text-foreground">{documentData.acknowledged}</p>
          <p className="text-xs text-muted-foreground">Signed</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-warning/10 border border-warning/20 rounded-lg mx-auto mb-2">
            <Icon name="Clock" size={20} className="text-warning" />
          </div>
          <p className="text-lg font-bold text-foreground">{documentData.pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-error/10 border border-error/20 rounded-lg mx-auto mb-2">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <p className="text-lg font-bold text-foreground">{documentData.overdue}</p>
          <p className="text-xs text-muted-foreground">Overdue</p>
        </div>
      </div>

      {/* Recent Acknowledgments */}
      {documentData.recentAcknowledgments.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Recently Signed</h4>
          <div className="space-y-2">
            {documentData.recentAcknowledgments.map((ack, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name={getDocumentTypeIcon(ack.documentType)} size={16} className="text-success" />
                  <span className="text-sm font-medium text-foreground">{ack.documentTitle}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(ack.acknowledgedAt || ack.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Documents */}
      {documentData.pendingDocuments.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Pending Acknowledgment
            {documentData.overdue > 0 && (
              <span className="ml-2 text-xs bg-error/10 text-error px-2 py-1 rounded-full">
                {documentData.overdue} overdue
              </span>
            )}
          </h4>
          <div className="space-y-2">
            {documentData.pendingDocuments.map((doc) => {
              const daysLeft = getDaysUntilDue(doc.effectiveDate);
              const isOverdue = daysLeft < 0;
              return (
                <div key={doc.id} className={`flex items-center justify-between p-2 border rounded-lg ${
                  isOverdue 
                    ? 'bg-error/5 border-error/20' 
                    : daysLeft <= 7 
                      ? 'bg-warning/5 border-warning/20'
                      : 'bg-accent/5 border-accent/20'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={isOverdue ? "AlertTriangle" : daysLeft <= 7 ? "Clock" : getDocumentTypeIcon(doc.type)} 
                      size={16} 
                      className={isOverdue ? "text-error" : daysLeft <= 7 ? "text-warning" : "text-accent"} 
                    />
                    <span className="text-sm font-medium text-foreground">{doc.title}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${getPriorityColor(daysLeft)}`}>
                      {isOverdue ? 'Overdue' : daysLeft <= 7 ? `${daysLeft} days left` : 'Pending'}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Due {new Date(new Date(doc.effectiveDate).getTime() + (30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {documentData.pendingDocuments.length === 0 && documentData.acknowledged > 0 && (
        <div className="text-center py-4 mb-4">
          <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
          <p className="text-sm font-medium text-success">All documents acknowledged!</p>
          <p className="text-xs text-muted-foreground">You're up to date with all required documents</p>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        iconName="ArrowRight"
        iconPosition="right"
        onClick={() => window.location.href = '/document-management'}
      >
        View All Documents
      </Button>
    </div>
  );
};

export default PersonalDocumentCard;
