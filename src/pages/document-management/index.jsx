import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DocumentCard from './components/DocumentCard';
import DocumentViewer from './components/DocumentViewer';
import DocumentFilters from './components/DocumentFilters';
import AcknowledgmentModal from './components/AcknowledgmentModal';
import DocumentStats from './components/DocumentStats';
import BulkActions from './components/BulkActions';
import CreateDocumentModal from './components/CreateDocumentModal';
import EditDocumentModal from './components/EditDocumentModal';
import UploadDocumentModal from './components/UploadDocumentModal';
import dataService from '../../services/DataService';
import { hasPermission, PERMISSIONS, getRolePermissions } from '../../utils/permissions';
import { useUser } from '../../contexts/UserContext';

const DocumentManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [acknowledgmentModalOpen, setAcknowledgmentModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    department: 'all',
    status: 'all',
    priority: 'all',
    sortBy: 'date_desc'
  });
  const [createDocumentModalOpen, setCreateDocumentModalOpen] = useState(false);
  const [editDocumentModalOpen, setEditDocumentModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [uploadDocumentModalOpen, setUploadDocumentModalOpen] = useState(false);

  // Mock data
  const mockDocuments = [
    {
      id: 1,
      title: "Information Security Policy v3.2",
      description: "Comprehensive information security policy covering data protection, access controls, and incident response procedures for all organizational assets.",
      version: "3.2",
      type: "policy",
      category: "security",
      department: "Information Technology",
      author: "John Smith",
      effectiveDate: "2024-01-15",
      expiryDate: "2025-01-15",
      lastModified: "2024-08-15",
      fileSize: "2.4 MB",
      language: "English",
      acknowledgmentStatus: "pending",
      priority: "high",
      isRequired: true,
      hasESignature: true,
      targetCount: 150,
      acknowledgedCount: 89,
      viewCount: 234,
      tags: ["security", "policy", "mandatory", "iso27001"],
      relatedDocuments: [
        { title: "Data Classification Guide", type: "procedure" },
        { title: "Incident Response Plan", type: "procedure" }
      ]
    },
    {
      id: 2,
      title: "Employee Handbook 2024",
      description: "Complete employee handbook covering company policies, benefits, code of conduct, and workplace guidelines for all staff members.",
      version: "2024.1",
      type: "handbook",
      category: "hr",
      department: "Human Resources",
      author: "Sarah Wilson",
      effectiveDate: "2024-01-01",
      expiryDate: "2024-12-31",
      lastModified: "2024-07-20",
      fileSize: "5.8 MB",
      language: "English",
      acknowledgmentStatus: "acknowledged",
      priority: "medium",
      isRequired: true,
      hasESignature: true,
      targetCount: 200,
      acknowledgedCount: 195,
      viewCount: 456,
      tags: ["handbook", "hr", "policies", "benefits"],
      relatedDocuments: [
        { title: "Code of Conduct", type: "policy" },
        { title: "Benefits Guide", type: "handbook" }
      ]
    },
    {
      id: 3,
      title: "Risk Assessment Framework",
      description: "Standardized framework for conducting risk assessments across all business units, including templates and evaluation criteria.",
      version: "1.5",
      type: "procedure",
      category: "risk",
      department: "Risk Management",
      author: "Michael Chen",
      effectiveDate: "2024-03-01",
      expiryDate: "2025-03-01",
      lastModified: "2024-08-10",
      fileSize: "1.2 MB",
      language: "English",
      acknowledgmentStatus: "overdue",
      priority: "high",
      isRequired: true,
      hasESignature: false,
      targetCount: 45,
      acknowledgedCount: 32,
      viewCount: 123,
      tags: ["risk", "assessment", "framework", "procedure"],
      relatedDocuments: [
        { title: "Risk Register Template", type: "form" },
        { title: "Business Impact Analysis", type: "procedure" }
      ]
    },
    {
      id: 4,
      title: "Data Privacy Compliance Guide",
      description: "Comprehensive guide for ensuring data privacy compliance including GDPR requirements, data handling procedures, and breach response.",
      version: "2.1",
      type: "procedure",
      category: "compliance",
      department: "Legal",
      author: "Emma Thompson",
      effectiveDate: "2024-05-01",
      expiryDate: "2025-05-01",
      lastModified: "2024-08-05",
      fileSize: "3.1 MB",
      language: "English",
      acknowledgmentStatus: "pending",
      priority: "high",
      isRequired: true,
      hasESignature: true,
      targetCount: 85,
      acknowledgedCount: 67,
      viewCount: 189,
      tags: ["privacy", "gdpr", "compliance", "data"],
      relatedDocuments: [
        { title: "Privacy Impact Assessment Template", type: "form" },
        { title: "Data Retention Policy", type: "policy" }
      ]
    },
    {
      id: 5,
      title: "Asset Management Procedures",
      description: "Detailed procedures for asset lifecycle management including procurement, assignment, maintenance, and disposal processes.",
      version: "1.8",
      type: "procedure",
      category: "operations",
      department: "Operations",
      author: "David Rodriguez",
      effectiveDate: "2024-02-15",
      expiryDate: "2025-02-15",
      lastModified: "2024-07-30",
      fileSize: "2.7 MB",
      language: "English",
      acknowledgmentStatus: "acknowledged",
      priority: "medium",
      isRequired: false,
      hasESignature: false,
      targetCount: 65,
      acknowledgedCount: 58,
      viewCount: 167,
      tags: ["assets", "procedures", "lifecycle", "operations"],
      relatedDocuments: [
        { title: "Asset Request Form", type: "form" },
        { title: "Disposal Guidelines", type: "procedure" }
      ]
    },
    {
      id: 6,
      title: "Emergency Response Plan",
      description: "Comprehensive emergency response plan covering various scenarios including natural disasters, security incidents, and business continuity measures.",
      version: "4.0",
      type: "procedure",
      category: "safety",
      department: "Operations",
      author: "Lisa Anderson",
      effectiveDate: "2024-06-01",
      expiryDate: "2024-12-01",
      lastModified: "2024-08-01",
      fileSize: "4.2 MB",
      language: "English",
      acknowledgmentStatus: "expired",
      priority: "high",
      isRequired: true,
      hasESignature: true,
      targetCount: 180,
      acknowledgedCount: 165,
      viewCount: 298,
      tags: ["emergency", "response", "safety", "continuity"],
      relatedDocuments: [
        { title: "Evacuation Procedures", type: "procedure" },
        { title: "Contact Directory", type: "form" }
      ]
    }
  ];

  const mockStats = {
    totalDocuments: 156,
    pendingReview: 23,
    acknowledged: 98,
    overdue: 12,
    expiringSoon: 8,
    complianceRate: 87,
    totalChange: 5,
    pendingChange: -3,
    acknowledgedChange: 12,
    overdueChange: -2,
    expiringChange: 1,
    complianceChange: 3,
    pendingBreakdown: { new: 15, inReview: 8 },
    overdueBreakdown: { week: 8, month: 4 }
  };

  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({});
  const { currentUser } = useUser();

  // Load documents and current user from DataService
  useEffect(() => {
    const loadData = () => {
      const storedDocuments = dataService.getModuleData('documents') || mockDocuments;
      setDocuments(storedDocuments);
      
      // Calculate stats from actual documents
      const calculatedStats = {
        totalDocuments: storedDocuments.length,
        acknowledged: storedDocuments.filter(d => d.acknowledgmentStatus === 'acknowledged').length,
        pending: storedDocuments.filter(d => d.acknowledgmentStatus === 'pending').length,
        overdue: storedDocuments.filter(d => d.acknowledgmentStatus === 'overdue').length,
        expiringSoon: storedDocuments.filter(d => {
          const daysUntilExpiry = Math.ceil((new Date(d.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length,
        complianceRate: storedDocuments.length > 0 ? Math.round((storedDocuments.filter(d => d.acknowledgmentStatus === 'acknowledged').length / storedDocuments.length) * 100) : 0
      };
      
      setStats(calculatedStats);
    };
    loadData();
  }, []);

  // Debug user permissions
  useEffect(() => {
    if (currentUser) {
      console.log('🔍 Document Management - Current User:', currentUser);
      console.log('- Role:', currentUser.role);
      console.log('- DOCUMENT_CREATE:', hasPermission(currentUser.role, PERMISSIONS.DOCUMENT_CREATE));
      console.log('- DOCUMENT_UPLOAD:', hasPermission(currentUser.role, PERMISSIONS.DOCUMENT_UPLOAD));
    }
  }, [currentUser]);

  // Filter documents based on current filters
  const filteredDocuments = documents?.filter(doc => {
    if (filters?.search && !doc?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) && 
        !doc?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
        !doc?.tags?.some(tag => tag?.toLowerCase()?.includes(filters?.search?.toLowerCase()))) {
      return false;
    }
    if (filters?.type !== 'all' && doc?.type !== filters?.type) return false;
    if (filters?.department !== 'all' && doc?.department?.toLowerCase()?.replace(' ', '-') !== filters?.department) return false;
    if (filters?.status !== 'all' && doc?.acknowledgmentStatus !== filters?.status) return false;
    if (filters?.priority !== 'all' && doc?.priority !== filters?.priority) return false;
    if (filters?.requiresAcknowledgment && !doc?.isRequired) return false;
    if (filters?.hasESignature && !doc?.hasESignature) return false;
    if (filters?.expiringSoon) {
      const daysUntilExpiry = Math.ceil((new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry > 30 || daysUntilExpiry < 0) return false;
    }
    return true;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments]?.sort((a, b) => {
    switch (filters?.sortBy) {
      case 'title':
        return a?.title?.localeCompare(b?.title);
      case 'title_desc':
        return b?.title?.localeCompare(a?.title);
      case 'date_asc':
        return new Date(a.effectiveDate) - new Date(b.effectiveDate);
      case 'date_desc':
        return new Date(b.effectiveDate) - new Date(a.effectiveDate);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
      case 'status':
        return a?.acknowledgmentStatus?.localeCompare(b?.acknowledgmentStatus);
      default:
        return 0;
    }
  });

  const handleDocumentView = (document) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  const handleDocumentAcknowledge = (document) => {
    setSelectedDocument(document);
    setAcknowledgmentModalOpen(true);
  };


  const handleEditDocument = (documentToEdit) => {
    setDocumentToEdit(documentToEdit);
    setEditDocumentModalOpen(true);
  };

  const handleEditDocumentSave = (updatedDocument) => {
    try {
      // Update in DataService
      dataService.updateDocument(updatedDocument.id, updatedDocument);
      
      // Update local state
      const updatedDocuments = documents.map(doc => 
        doc.id === updatedDocument.id ? updatedDocument : doc
      );
      setDocuments(updatedDocuments);
      
      // Save to DataService
      dataService.saveModuleData('documents', updatedDocuments);
      
      // Create notification
      dataService.addNotification({
        type: 'document_updated',
        title: 'Document Updated',
        message: `Document updated: ${updatedDocument.title}`,
        recipientRole: 'admin',
        priority: 'normal',
        documentId: updatedDocument.id
      });
      
      setEditDocumentModalOpen(false);
      setDocumentToEdit(null);
      
      // Show success notification
      const successDialog = document.createElement('div');
      successDialog.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
      successDialog.innerHTML = `
        <div class="bg-card border border-border rounded-lg shadow-enterprise-lg p-6 max-w-md w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-success/10 rounded-full">
              <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground">Document Updated</h3>
          </div>
          <p class="text-muted-foreground mb-6">Document "${updatedDocument.title}" has been updated successfully.</p>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors">
            OK
          </button>
        </div>
      `;
      document.body.appendChild(successDialog);
      
      // Remove after 3 seconds if not manually closed
      setTimeout(() => {
        if (document.body.contains(successDialog)) {
          successDialog.remove();
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error updating document:', error);
      // Show error notification
      const errorDialog = document.createElement('div');
      errorDialog.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
      errorDialog.innerHTML = `
        <div class="bg-card border border-border rounded-lg shadow-enterprise-lg p-6 max-w-md w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-error/10 rounded-full">
              <svg class="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground">Error Updating Document</h3>
          </div>
          <p class="text-muted-foreground mb-6">There was an error updating the document. Please try again.</p>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors">
            OK
          </button>
        </div>
      `;
      document.body.appendChild(errorDialog);
      
      // Remove after 5 seconds if not manually closed
      setTimeout(() => {
        if (document.body.contains(errorDialog)) {
          errorDialog.remove();
        }
      }, 5000);
    }
  };

  const handleDeleteDocument = (documentToDelete) => {
    try {
      // Remove the document from the documents list
      const updatedDocuments = documents.filter(doc => doc.id !== documentToDelete.id);
      setDocuments(updatedDocuments);
      
      // Save to DataService
      dataService.saveModuleData('documents', updatedDocuments);
      
      // Create notification
      dataService.addNotification({
        type: 'document_deleted',
        title: 'Document Deleted',
        message: `Document deleted: ${documentToDelete.title}`,
        recipientRole: 'admin',
        priority: 'normal',
        documentId: documentToDelete.id
      });
      
      console.log('Document deleted successfully:', documentToDelete.title);
      // Show success notification
      const successDialog = document.createElement('div');
      successDialog.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
      successDialog.innerHTML = `
        <div class="bg-card border border-border rounded-lg shadow-enterprise-lg p-6 max-w-md w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-success/10 rounded-full">
              <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground">Document Deleted</h3>
          </div>
          <p class="text-muted-foreground mb-6">Document "${documentToDelete.title}" has been deleted successfully.</p>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors">
            OK
          </button>
        </div>
      `;
      document.body.appendChild(successDialog);
      
      // Remove after 3 seconds if not manually closed
      setTimeout(() => {
        if (document.body.contains(successDialog)) {
          successDialog.remove();
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error deleting document:', error);
      // Show error notification
      const errorDialog = document.createElement('div');
      errorDialog.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
      errorDialog.innerHTML = `
        <div class="bg-card border border-border rounded-lg shadow-enterprise-lg p-6 max-w-md w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-error/10 rounded-full">
              <svg class="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground">Error Deleting Document</h3>
          </div>
          <p class="text-muted-foreground mb-6">There was an error deleting the document. Please try again.</p>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors">
            OK
          </button>
        </div>
      `;
      document.body.appendChild(errorDialog);
      
      // Remove after 5 seconds if not manually closed
      setTimeout(() => {
        if (document.body.contains(errorDialog)) {
          errorDialog.remove();
        }
      }, 5000);
    }
  };

  const handleAcknowledgmentConfirm = (acknowledgmentData) => {
    console.log('Acknowledgment confirmed:', acknowledgmentData);
    
    try {
      // Save acknowledgment to DataService
      dataService.addPolicyAcknowledgment({
        ...acknowledgmentData,
        userId: currentUser?.id,
        userName: currentUser?.name,
        userEmail: currentUser?.email
      });
      
      // Update document status
      const updatedDocuments = documents.map(doc => 
        doc?.id === acknowledgmentData?.documentId 
          ? { 
              ...doc, 
              acknowledgmentStatus: 'acknowledged', 
              acknowledgedCount: (doc?.acknowledgedCount || 0) + 1,
              viewCount: (doc?.viewCount || 0) + 1
            }
          : doc
      );
      
      setDocuments(updatedDocuments);
      
      // Save updated documents to DataService
      dataService.saveModuleData('documents', updatedDocuments);
      
      // Create notification for document owner/admin
      dataService.addNotification({
        type: 'document_acknowledged',
        title: 'Document Acknowledged',
        message: `${currentUser?.name} has acknowledged: ${selectedDocument?.title}`,
        recipientRole: 'admin',
        priority: 'normal',
        documentId: acknowledgmentData?.documentId
      });
      
      setAcknowledgmentModalOpen(false);
      setSelectedDocument(null);
      
      // Show success notification
      const successDialog = document.createElement('div');
      successDialog.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
      successDialog.innerHTML = `
        <div class="bg-card border border-border rounded-lg shadow-enterprise-lg p-6 max-w-md w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-success/10 rounded-full">
              <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground">Document Acknowledged!</h3>
          </div>
          <p class="text-muted-foreground mb-6">Your acknowledgment has been recorded successfully.</p>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors">
            Great!
          </button>
        </div>
      `;
      document.body.appendChild(successDialog);
      
      // Remove after 3 seconds if not manually closed
      setTimeout(() => {
        if (document.body.contains(successDialog)) {
          successDialog.remove();
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error recording acknowledgment:', error);
      // Show error notification
      const errorDialog = document.createElement('div');
      errorDialog.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
      errorDialog.innerHTML = `
        <div class="bg-card border border-border rounded-lg shadow-enterprise-lg p-6 max-w-md w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-error/10 rounded-full">
              <svg class="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground">Error Recording Acknowledgment</h3>
          </div>
          <p class="text-muted-foreground mb-6">There was an error recording your acknowledgment. Please try again.</p>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors">
            OK
          </button>
        </div>
      `;
      document.body.appendChild(errorDialog);
      
      // Remove after 5 seconds if not manually closed
      setTimeout(() => {
        if (document.body.contains(errorDialog)) {
          errorDialog.remove();
        }
      }, 5000);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters({ ...newFilters, resultCount: filteredDocuments?.length });
  };

  const handleFiltersReset = () => {
    setFilters({
      search: '',
      type: 'all',
      department: 'all',
      status: 'all',
      priority: 'all',
      sortBy: 'date_desc'
    });
  };

  const handleDocumentSelect = (document, isSelected) => {
    if (isSelected) {
      setSelectedDocuments(prev => [...prev, document]);
    } else {
      setSelectedDocuments(prev => prev?.filter(doc => doc?.id !== document?.id));
    }
  };

  const handleSelectAll = () => {
    if (selectedDocuments?.length === sortedDocuments?.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments([...sortedDocuments]);
    }
  };

  const handleBulkAction = (actionType, documents) => {
    console.log('Bulk action:', actionType, documents);
    
    switch (actionType) {
      case 'acknowledge':
        setDocuments(prev => prev?.map(doc => 
          documents?.some(selected => selected?.id === doc?.id)
            ? { ...doc, acknowledgmentStatus: 'acknowledged' }
            : doc
        ));
        break;
      case 'archive': console.log('Archiving documents:', documents?.map(d => d?.title));
        break;
      default:
        console.log('Unknown bulk action:', actionType);
    }
    
    setSelectedDocuments([]);
  };

  const handleCreateDocument = () => {
    setCreateDocumentModalOpen(true);
  };

  const handleUploadDocument = () => {
    setUploadDocumentModalOpen(true);
  };

  const handleSubmitNewDocument = async (documentData) => {
    console.log('Creating new document:', documentData);
    
    try {
      // Create enhanced document data
      const newDocument = {
        ...documentData,
        createdBy: currentUser?.name || 'System',
        createdById: currentUser?.id || 'system',
        createdDate: new Date().toISOString(),
        fileContent: documentData.content ? `
          <h1>${documentData.title}</h1>
          <div class="bg-info/10 border border-info/20 rounded-lg p-4 my-4">
            <p><strong>Document Type:</strong> ${documentData.type}</p>
            <p><strong>Category:</strong> ${documentData.category}</p>
            <p><strong>Department:</strong> ${documentData.department}</p>
            <p><strong>Author:</strong> ${documentData.author}</p>
            <p><strong>Created:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="document-content">
            ${documentData.content.replace(/\n/g, '<br>')}
          </div>
        ` : null
      };
      
      // Add to documents list
      const updatedDocuments = [newDocument, ...documents];
      setDocuments(updatedDocuments);
      
      // Save to DataService
      dataService.saveModuleData('documents', updatedDocuments);
      
      // Create notification
      dataService.addNotification({
        type: 'document_created',
        title: 'Document Created',
        message: `New document created: ${documentData.title}`,
        recipientRole: 'admin',
        priority: 'normal',
        documentId: newDocument.id
      });
      
      // Show success notification
      const successDialog = document.createElement('div');
      successDialog.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
      successDialog.innerHTML = `
        <div class="bg-card border border-border rounded-lg shadow-enterprise-lg p-6 max-w-md w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-success/10 rounded-full">
              <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground">Document Created Successfully!</h3>
          </div>
          <p class="text-muted-foreground mb-6">Your document "${newDocument.title}" has been created successfully.</p>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors">
            Great!
          </button>
        </div>
      `;
      document.body.appendChild(successDialog);
      
      // Remove after 3 seconds if not manually closed
      setTimeout(() => {
        if (document.body.contains(successDialog)) {
          successDialog.remove();
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error creating document:', error);
      // Show error notification
      const errorDialog = document.createElement('div');
      errorDialog.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
      errorDialog.innerHTML = `
        <div class="bg-card border border-border rounded-lg shadow-enterprise-lg p-6 max-w-md w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-error/10 rounded-full">
              <svg class="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground">Error Creating Document</h3>
          </div>
          <p class="text-muted-foreground mb-6">There was an error creating your document. Please try again.</p>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors">
            OK
          </button>
        </div>
      `;
      document.body.appendChild(errorDialog);
      
      // Remove after 5 seconds if not manually closed
      setTimeout(() => {
        if (document.body.contains(errorDialog)) {
          errorDialog.remove();
        }
      }, 5000);
    }
  };

  const handleSubmitUploadDocument = async (documentData) => {
    console.log('Uploading document:', documentData);
    
    try {
      // Add to documents list
      const newDocument = {
        ...documentData,
        uploadedBy: currentUser?.name,
        uploadedById: currentUser?.id,
        uploadDate: new Date().toISOString()
      };
      
      const updatedDocuments = [newDocument, ...documents];
      setDocuments(updatedDocuments);
      
      // Save to DataService
      dataService.saveModuleData('documents', updatedDocuments);
      
      // Show success notification
      const successDialog = document.createElement('div');
      successDialog.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
      successDialog.innerHTML = `
        <div class="bg-card border border-border rounded-lg shadow-enterprise-lg p-6 max-w-md w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-success/10 rounded-full">
              <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground">Document Uploaded Successfully!</h3>
          </div>
          <p class="text-muted-foreground mb-6">Your document "${newDocument.title}" has been uploaded successfully.</p>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors">
            Great!
          </button>
        </div>
      `;
      document.body.appendChild(successDialog);
      
      // Remove after 3 seconds if not manually closed
      setTimeout(() => {
        if (document.body.contains(successDialog)) {
          successDialog.remove();
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading document:', error);
      // Show error notification
      const errorDialog = document.createElement('div');
      errorDialog.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4';
      errorDialog.innerHTML = `
        <div class="bg-card border border-border rounded-lg shadow-enterprise-lg p-6 max-w-md w-full">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-2 bg-error/10 rounded-full">
              <svg class="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-foreground">Error Uploading Document</h3>
          </div>
          <p class="text-muted-foreground mb-6">There was an error uploading your document. Please try again.</p>
          <button onclick="this.closest('.fixed').remove()" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors">
            OK
          </button>
        </div>
      `;
      document.body.appendChild(errorDialog);
      
      // Remove after 5 seconds if not manually closed
      setTimeout(() => {
        if (document.body.contains(errorDialog)) {
          errorDialog.remove();
        }
      }, 5000);
    }
  };

  useEffect(() => {
    setFilters(prev => ({ ...prev, resultCount: filteredDocuments?.length }));
  }, [filteredDocuments?.length]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={sidebarMobileOpen}
        onMobileClose={() => setSidebarMobileOpen(false)}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      } pt-16`}>
        <div className="p-6 space-y-6">
          <Breadcrumb />
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
              <p className="text-muted-foreground mt-1">
                {hasPermission(currentUser?.role, PERMISSIONS.DOCUMENT_CREATE) 
                  ? 'Manage policies, procedures, and compliance documents with acknowledgment workflows'
                  : 'View and acknowledge company documents and policies'
                }
              </p>
            </div>
            
            {/* Show create/upload buttons - restricted to admin and iso roles only */}
            <div className="flex items-center space-x-3">
              {hasPermission(currentUser?.role, PERMISSIONS.DOCUMENT_UPLOAD) && (
                <Button
                  variant="outline"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={handleUploadDocument}
                >
                  Upload Document
                </Button>
              )}
              {hasPermission(currentUser?.role, PERMISSIONS.DOCUMENT_CREATE) && (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleCreateDocument}
                >
                  Create Document
                </Button>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <DocumentStats stats={stats} />

          {/* Filters Section */}
          <DocumentFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleFiltersReset}
          />

          {/* Bulk Actions - Only for users with permission */}
          {hasPermission(currentUser?.role, PERMISSIONS.DOCUMENT_BULK_ACTIONS) && (
            <BulkActions
              selectedDocuments={selectedDocuments}
              onBulkAction={handleBulkAction}
              onClearSelection={() => setSelectedDocuments([])}
            />
          )}

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                Showing {sortedDocuments?.length} of {documents?.length} documents
              </p>
              {selectedDocuments?.length > 0 && hasPermission(currentUser?.role, PERMISSIONS.DOCUMENT_BULK_ACTIONS) && (
                <p className="text-sm text-primary">
                  {selectedDocuments?.length} selected
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Only show bulk selection for users with bulk actions permission */}
              {hasPermission(currentUser?.role, PERMISSIONS.DOCUMENT_BULK_ACTIONS) && (
                <Button
                  variant={selectedDocuments?.length === sortedDocuments?.length ? "default" : "outline"}
                  size="sm"
                  onClick={handleSelectAll}
                  iconName={selectedDocuments?.length === sortedDocuments?.length ? "CheckSquare" : "Square"}
                  iconPosition="left"
                >
                  {selectedDocuments?.length === sortedDocuments?.length ? 'Deselect All' : 'Select All'}
                </Button>
              )}
              
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none border-r border-border"
                >
                  <Icon name="Grid3X3" size={16} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <Icon name="List" size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Documents Grid/List */}
          {sortedDocuments?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FileText" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {filters?.search || filters?.type !== 'all' || filters?.status !== 'all' 
                  ?'Try adjusting your filters to see more results.' 
                  : hasPermission(currentUser?.role, PERMISSIONS.DOCUMENT_CREATE)
                    ? 'Get started by creating your first document.'
                    : 'No documents are currently available for viewing.'
                }
              </p>
              {hasPermission(currentUser?.role, PERMISSIONS.DOCUMENT_CREATE) && (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleCreateDocument}
                >
                  Create Document
                </Button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' ?'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' :'space-y-4'
            }>
              {sortedDocuments?.map((document) => (
                <div key={document?.id} className="relative">
                  {/* Selection Checkbox - Only for users with bulk actions permission */}
                  {hasPermission(currentUser?.role, PERMISSIONS.DOCUMENT_BULK_ACTIONS) && (
                    <div className="absolute top-4 left-4 z-10">
                      <input
                        type="checkbox"
                        checked={selectedDocuments?.some(doc => doc?.id === document?.id)}
                        onChange={(e) => handleDocumentSelect(document, e?.target?.checked)}
                        className="w-4 h-4 rounded border-border bg-background"
                      />
                    </div>
                  )}
                  
                  <DocumentCard
                    document={document}
                    onView={handleDocumentView}
                    onAcknowledge={handleDocumentAcknowledge}
                    onEdit={handleEditDocument}
                    onDelete={handleDeleteDocument}
                    userRole={currentUser?.role}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {/* Document Viewer Modal */}
      <DocumentViewer
        document={selectedDocument}
        isOpen={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setSelectedDocument(null);
        }}
        onAcknowledge={(acknowledgmentData) => {
          setViewerOpen(false);
          handleAcknowledgmentConfirm(acknowledgmentData);
        }}
      />
      {/* Acknowledgment Modal */}
      <AcknowledgmentModal
        document={selectedDocument}
        isOpen={acknowledgmentModalOpen}
        onClose={() => {
          setAcknowledgmentModalOpen(false);
          setSelectedDocument(null);
        }}
        onConfirm={handleAcknowledgmentConfirm}
      />
      
      {/* Create Document Modal - Always available */}
      <CreateDocumentModal
        isOpen={createDocumentModalOpen}
        onClose={() => setCreateDocumentModalOpen(false)}
        onSubmit={handleSubmitNewDocument}
      />
      
      {/* Edit Document Modal */}
      <EditDocumentModal
        isOpen={editDocumentModalOpen}
        onClose={() => {
          setEditDocumentModalOpen(false);
          setDocumentToEdit(null);
        }}
        onSubmit={handleEditDocumentSave}
        document={documentToEdit}
      />
      
      {/* Upload Document Modal - Always available */}
      <UploadDocumentModal
        isOpen={uploadDocumentModalOpen}
        onClose={() => setUploadDocumentModalOpen(false)}
        onSubmit={handleSubmitUploadDocument}
      />
    </div>
  );
};

export default DocumentManagement;
