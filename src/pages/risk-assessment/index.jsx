import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import RiskHeatMap from './components/RiskHeatMap';
import RiskRegisterTable from './components/RiskRegisterTable';
import RiskFilters from './components/RiskFilters';
import RiskMetrics from './components/RiskMetrics';
import TreatmentPlanning from './components/TreatmentPlanning';
import CreateRiskAssessmentModal from './components/CreateRiskAssessmentModal';
import UploadRiskRegisterModal from './components/UploadRiskRegisterModal';
import dataService from '../../services/DataService';
import { generateRiskRegisterTemplate } from '../../utils/riskRegisterTemplate';
import { toast } from 'react-hot-toast';

const RiskAssessment = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [showTreatmentPlanning, setShowTreatmentPlanning] = useState(false);
  const [filters, setFilters] = useState({});
  const [createAssessmentModalOpen, setCreateAssessmentModalOpen] = useState(false);
  const [uploadRegisterModalOpen, setUploadRegisterModalOpen] = useState(false);

  const [risks, setRisks] = useState([]);
  const [filteredRisks, setFilteredRisks] = useState([]);

  // Risk level calculation helper
  const getRiskLevel = (score) => {
    if (score >= 20) return 'Critical';
    if (score >= 15) return 'High';
    if (score >= 10) return 'Medium';
    if (score >= 5) return 'Low';
    return 'Very Low';
  };

  // Load risks from DataService on component mount
  useEffect(() => {
    const loadRisks = () => {
      const storedRisks = dataService.getRisks();
      setRisks(storedRisks);
      setFilteredRisks(storedRisks);
    };
    loadRisks();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = risks;
    
    if (filters?.search) {
      filtered = filtered?.filter(risk => 
        risk?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        risk?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        risk?.id?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }
    
    if (filters?.category) {
      filtered = filtered?.filter(risk => risk?.category === filters?.category);
    }
    
    if (filters?.owner) {
      filtered = filtered?.filter(risk => risk?.owner === filters?.owner);
    }
    
    if (filters?.status) {
      filtered = filtered?.filter(risk => risk?.status === filters?.status);
    }
    
    if (filters?.treatmentStatus) {
      filtered = filtered?.filter(risk => risk?.treatmentStatus === filters?.treatmentStatus);
    }
    
    if (filters?.riskLevel) {
      filtered = filtered?.filter(risk => {
        const score = risk?.riskScore || (risk?.likelihood * risk?.impact);
        const level = risk?.riskLevel || getRiskLevel(score);
        switch (filters?.riskLevel) {
          case 'critical': return level === 'Critical';
          case 'high': return level === 'High';
          case 'medium': return level === 'Medium';
          case 'low': return level === 'Low';
          case 'very-low': return level === 'Very Low';
          default: return true;
        }
      });
    }
    
    setFilteredRisks(filtered);
  }, [filters, risks]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleRiskClick = (risk) => {
    setSelectedRisk(risk);
  };

  const handleEditRisk = (risk) => {
    setSelectedRisk(risk);
    setShowTreatmentPlanning(true);
  };

  const handleDeleteRisk = (risk) => {
    if (window.confirm(`Are you sure you want to delete risk "${risk?.title}"?`)) {
      // Delete from DataService
      dataService.deleteRisk(risk?.id);
      // Update local state
      setRisks(prev => prev?.filter(r => r?.id !== risk?.id));
    }
  };

  const handleTreatmentSave = (updatedRisk) => {
    // Update in DataService
    dataService.updateRisk(updatedRisk?.id, updatedRisk);
    // Update local state
    setRisks(prev => prev?.map(r => r?.id === updatedRisk?.id ? updatedRisk : r));
    setShowTreatmentPlanning(false);
    setSelectedRisk(null);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCreateAssessment = () => {
    setCreateAssessmentModalOpen(true);
  };

  const handleUploadRegister = () => {
    setUploadRegisterModalOpen(true);
  };

  const handleSubmitNewRisk = async (riskData) => {
    console.log('Creating new risk assessment:', riskData);
    // Save to DataService
    const newRisk = dataService.addRisk(riskData);
    // Update local state
    setRisks(prev => [newRisk, ...prev]);
    alert('Risk assessment created successfully!');
  };

  const handleSubmitUpload = async (uploadData) => {
    console.log('Uploading risk register:', uploadData);
    // Add imported risks based on merge strategy
    if (uploadData.mergeStrategy === 'replace') {
      setRisks(uploadData.risks);
    } else if (uploadData.mergeStrategy === 'append') {
      setRisks(prev => [...prev, ...uploadData.risks]);
    } else {
      // Update existing, add new
      setRisks(prev => {
        const existingIds = prev.map(r => r.id);
        const newRisks = uploadData.risks.filter(r => !existingIds.includes(r.id));
        return [...prev, ...newRisks];
      });
    }
  };

  const handleExportReport = () => {
    try {
      const csvContent = generateRiskReportCSV();
      downloadCSV(csvContent, `risk_assessment_report_${new Date().toISOString().split('T')[0]}.csv`);
      alert('Risk assessment report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export risk assessment report. Please try again.');
    }
  };

  const generateRiskReportCSV = () => {
    const headers = [
      'Risk ID',
      'Title',
      'Description',
      'Category',
      'Likelihood',
      'Impact',
      'Risk Score',
      'Risk Level',
      'Owner',
      'Status',
      'Treatment Status',
      'Review Status',
      'Assessment Date',
      'Next Review Date',
      'Treatment Description',
      'Post-Treatment Likelihood',
      'Post-Treatment Impact',
      'Post-Treatment Score',
      'Post-Treatment Level'
    ];
    
    const rows = filteredRisks.map(risk => {
      const riskScore = risk.riskScore || (risk.likelihood * risk.impact);
      const riskLevel = risk.riskLevel || getRiskLevel(riskScore);
      const postTreatmentScore = risk.postTreatmentRiskScore || 
        (risk.postTreatmentLikelihood && risk.postTreatmentImpact ? 
         risk.postTreatmentLikelihood * risk.postTreatmentImpact : '');
      const postTreatmentLevel = risk.postTreatmentRiskLevel || 
        (postTreatmentScore ? getRiskLevel(postTreatmentScore) : '');
      
      return [
        risk.id || '',
        `"${risk.title || ''}"`,
        `"${risk.description || ''}"`,
        risk.category || '',
        risk.likelihood || '',
        risk.impact || '',
        riskScore || '',
        riskLevel || '',
        `"${risk.riskOwner || risk.owner || ''}"`,
        risk.status || '',
        risk.treatmentStatus || '',
        risk.reviewStatus || '',
        risk.assessmentDate || '',
        risk.nextReviewDate || '',
        `"${risk.treatmentDescription || ''}"`,
        risk.postTreatmentLikelihood || '',
        risk.postTreatmentImpact || '',
        postTreatmentScore || '',
        postTreatmentLevel || ''
      ];
    });
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };


  const handleDownloadTemplate = (format = 'csv') => {
    try {
      generateRiskRegisterTemplate(format);
      toast.success(`${format.toUpperCase()} template downloaded successfully!`);
    } catch (error) {
      console.error('Template download error:', error);
      toast.error('Failed to download template');
    }
  };

  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'heatmap', label: 'Heat Map', icon: 'Grid3X3' },
    { id: 'register', label: 'Risk Register', icon: 'List' },
    { id: 'metrics', label: 'Analytics', icon: 'BarChart3' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } pt-16`}>
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Risk Assessment</h1>
              <p className="text-muted-foreground">
                Conduct evaluations, monitor treatments, and generate compliance reports
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button variant="outline" onClick={handleExportReport}>
                <Icon name="Download" size={16} className="mr-2" />
                Export Report
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleDownloadTemplate('csv')}
              >
                <Icon name="FileDown" size={16} className="mr-2" />
                Download Template
              </Button>
              <Button 
                variant="outline"
                onClick={handleUploadRegister}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Upload Risk Register
              </Button>
              <Button
                onClick={handleCreateAssessment}
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Create Risk Assessment
              </Button>
            </div>
          </div>

          {/* View Navigation */}
          <div className="flex items-center space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
            {views?.map(view => (
              <button
                key={view?.id}
                onClick={() => setActiveView(view?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeView === view?.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={view?.icon} size={16} />
                <span className="hidden sm:inline">{view?.label}</span>
              </button>
            ))}
          </div>

          {/* Filters */}
          <RiskFilters 
            onFiltersChange={handleFiltersChange}
            totalRisks={filteredRisks?.length}
          />

          {/* Content based on active view */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <RiskMetrics risks={filteredRisks} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <RiskHeatMap 
                  risks={filteredRisks} 
                  onRiskClick={handleRiskClick}
                />
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Treatment Status Overview</h3>
                  <div className="space-y-4">
                    {filteredRisks?.slice(0, 5)?.map(risk => {
                      const preScore = risk?.riskScore || (risk?.likelihood * risk?.impact);
                      const postScore = risk?.postTreatmentRiskScore || (risk?.postTreatmentLikelihood * risk?.postTreatmentImpact) || 0;
                      const preLevel = risk?.riskLevel || getRiskLevel(preScore);
                      const postLevel = risk?.postTreatmentRiskLevel || (postScore > 0 ? getRiskLevel(postScore) : 'N/A');
                      
                      return (
                        <div key={risk?.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                risk?.status === 'Open' ? 'bg-error' :
                                risk?.status === 'In Progress'? 'bg-warning' : 'bg-success'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-foreground truncate">{risk?.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {risk?.category} • {risk?.riskOwner || risk?.owner}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-background rounded border">
                              <p className="text-xs text-muted-foreground mb-1">Pre-Treatment</p>
                              <div className="flex items-center justify-center space-x-2">
                                <span className={`text-lg font-bold ${
                                  preLevel === 'Critical' ? 'text-error' :
                                  preLevel === 'High' ? 'text-warning' :
                                  preLevel === 'Medium' ? 'text-accent' :
                                  preLevel === 'Low' ? 'text-success' : 'text-muted-foreground'
                                }`}>
                                  {preScore}
                                </span>
                                <span className="text-xs text-muted-foreground">({preLevel})</span>
                              </div>
                            </div>
                            <div className="text-center p-3 bg-background rounded border">
                              <p className="text-xs text-muted-foreground mb-1">Post-Treatment</p>
                              <div className="flex items-center justify-center space-x-2">
                                <span className={`text-lg font-bold ${
                                  postLevel === 'Critical' ? 'text-error' :
                                  postLevel === 'High' ? 'text-warning' :
                                  postLevel === 'Medium' ? 'text-accent' :
                                  postLevel === 'Low' ? 'text-success' : 'text-muted-foreground'
                                }`}>
                                  {postScore || 'N/A'}
                                </span>
                                <span className="text-xs text-muted-foreground">({postLevel})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'heatmap' && (
            <RiskHeatMap 
              risks={filteredRisks} 
              onRiskClick={handleRiskClick}
            />
          )}

          {activeView === 'register' && (
            <RiskRegisterTable
              risks={filteredRisks}
              onRiskClick={handleRiskClick}
              onEditRisk={handleEditRisk}
              onDeleteRisk={handleDeleteRisk}
            />
          )}

          {activeView === 'metrics' && (
            <RiskMetrics risks={filteredRisks} />
          )}
        </div>
      </main>
      {/* Treatment Planning Modal */}
      {showTreatmentPlanning && selectedRisk && (
        <TreatmentPlanning
          risk={selectedRisk}
          onSave={handleTreatmentSave}
          onClose={() => {
            setShowTreatmentPlanning(false);
            setSelectedRisk(null);
          }}
        />
      )}
      {/* Risk Detail Modal */}
      {selectedRisk && !showTreatmentPlanning && (
        <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{selectedRisk?.title}</h2>
                <p className="text-sm text-muted-foreground">Risk ID: {selectedRisk?.id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedRisk(null)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedRisk?.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Category</h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                    {selectedRisk?.category}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Risk Score</h4>
                  <span className="text-lg font-bold text-foreground">
                    {selectedRisk?.likelihood * selectedRisk?.impact}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({selectedRisk?.likelihood} × {selectedRisk?.impact})
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Owner</h4>
                  <p className="text-sm text-foreground">{selectedRisk?.owner}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Status</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    selectedRisk?.status === 'Open' ? 'bg-error/10 text-error' :
                    selectedRisk?.status === 'In Progress'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    {selectedRisk?.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button variant="ghost" onClick={() => setSelectedRisk(null)}>
                Close
              </Button>
              <Button onClick={() => setShowTreatmentPlanning(true)}>
                <Icon name="Settings" size={16} className="mr-2" />
                Treatment Planning
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Risk Assessment Modal */}
      <CreateRiskAssessmentModal
        isOpen={createAssessmentModalOpen}
        onClose={() => setCreateAssessmentModalOpen(false)}
        onSubmit={handleSubmitNewRisk}
      />
      
      {/* Upload Risk Register Modal */}
      <UploadRiskRegisterModal
        isOpen={uploadRegisterModalOpen}
        onClose={() => setUploadRegisterModalOpen(false)}
        onSubmit={handleSubmitUpload}
      />
    </div>
  );
};

export default RiskAssessment;
