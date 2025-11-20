import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import dataService from '../../../services/DataService';

const CreateRiskAssessmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    ref: '',
    assetGroup: '',
    asset: '',
    threat: '',
    vulnerability: '',
    riskType: '',
    riskOwner: '',
    riskDescription: '',
    
    // Pre-Treatment Assessment
    existingControls: '',
    likelihood: '',
    likelihoodRationale: '',
    impact: '',
    impactRationale: '',
    
    // Treatment Plan
    treatmentOptionChosen: '',
    proposedTreatmentAction: '',
    annexAControlReference: '',
    treatmentCost: '',
    treatmentActionOwner: '',
    treatmentActionTimescale: '',
    treatmentActionProgress: '0',
    treatmentActionStatus: 'Not Started',
    
    // Post-Treatment Assessment
    postTreatmentLikelihood: '',
    postTreatmentLikelihoodRationale: '',
    postTreatmentImpact: '',
    postTreatmentImpactRationale: '',
    
    // Additional
    comments: '',
    reviewFrequency: 'annually',
    nextReviewDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assets, setAssets] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Load assets from Asset Management
  useEffect(() => {
    if (isOpen) {
      try {
        // Try to get assets from the DataService
        const assetData = dataService.getModuleData('assets') || [];
        console.log('Loaded assets for risk assessment:', assetData);
        setAssets(assetData);
        
        // If no assets are found, initialize with default assets
        if (assetData.length === 0) {
          console.warn('No assets found in database, initializing defaults...');
          const defaultAssets = [
            {
              id: 'asset001',
              assetId: 'LAP-2025-001',
              name: 'MacBook Pro 16"',
              category: 'laptop'
            },
            {
              id: 'asset002',
              assetId: 'SRV-2025-001', 
              name: 'Database Server',
              category: 'server'
            },
            {
              id: 'asset003',
              assetId: 'NET-2025-001',
              name: 'Firewall Device',
              category: 'network'
            }
          ];
          setAssets(defaultAssets);
        }
      } catch (error) {
        console.error('Error loading assets:', error);
        setAssets([]); // Set empty array as fallback
      }
      
      // Auto-generate reference number
      if (!formData.ref) {
        const year = new Date().getFullYear();
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        handleInputChange('ref', `RISK-${year}${month}-${random}`);
      }
      
      // Set default next review date (1 year from now)
      if (!formData.nextReviewDate) {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        handleInputChange('nextReviewDate', nextYear.toISOString().split('T')[0]);
      }
    }
  }, [isOpen]);

  const riskTypeOptions = [
    { value: 'Technology', label: 'Technology Risk' },
    { value: 'Operational', label: 'Operational Risk' },
    { value: 'Financial', label: 'Financial Risk' },
    { value: 'Strategic', label: 'Strategic Risk' },
    { value: 'Compliance', label: 'Compliance Risk' },
    { value: 'Environmental', label: 'Environmental Risk' },
    { value: 'Legal', label: 'Legal Risk' },
    { value: 'Reputational', label: 'Reputational Risk' },
    { value: 'Physical', label: 'Physical Security Risk' },
    { value: 'Cyber', label: 'Cybersecurity Risk' }
  ];

  const assetGroupOptions = [
    { value: 'IT Infrastructure', label: 'IT Infrastructure' },
    { value: 'Applications', label: 'Applications' },
    { value: 'Data', label: 'Data & Information' },
    { value: 'People', label: 'People & Personnel' },
    { value: 'Facilities', label: 'Facilities & Buildings' },
    { value: 'Equipment', label: 'Equipment & Hardware' },
    { value: 'Processes', label: 'Business Processes' },
    { value: 'External', label: 'External Dependencies' }
  ];

  const assetOptions = assets.map(asset => ({
    value: asset.name,
    label: `${asset.name} (${asset.assetId})`
  }));

  const threatOptions = [
    { value: 'Malware', label: 'Malware/Virus Attack' },
    { value: 'Phishing', label: 'Phishing Attack' },
    { value: 'Data Breach', label: 'Data Breach' },
    { value: 'Unauthorized Access', label: 'Unauthorized Access' },
    { value: 'System Failure', label: 'System Failure' },
    { value: 'Natural Disaster', label: 'Natural Disaster' },
    { value: 'Fire', label: 'Fire Hazard' },
    { value: 'Theft', label: 'Theft/Burglary' },
    { value: 'Human Error', label: 'Human Error' },
    { value: 'Power Outage', label: 'Power Outage' },
    { value: 'Network Failure', label: 'Network Failure' },
    { value: 'Supplier Failure', label: 'Supplier/Vendor Failure' }
  ];

  const likelihoodOptions = [
    { value: '1', label: '1 - Very Unlikely' },
    { value: '2', label: '2 - Unlikely' },
    { value: '3', label: '3 - Possible' },
    { value: '4', label: '4 - Likely' },
    { value: '5', label: '5 - Very Likely' }
  ];

  const impactOptions = [
    { value: '1', label: '1 - Negligible' },
    { value: '2', label: '2 - Minor' },
    { value: '3', label: '3 - Moderate' },
    { value: '4', label: '4 - Major' },
    { value: '5', label: '5 - Catastrophic' }
  ];

  const treatmentStrategyOptions = [
    { value: 'mitigate', label: 'Mitigate' },
    { value: 'accept', label: 'Accept' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'avoid', label: 'Avoid' }
  ];

  const priorityOptions = [
    { value: 'Critical', label: 'Critical' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAISuggest = () => {
    const assetName = formData.asset || assets[0]?.name || '';
    const threatName = formData.threat || 'Phishing';
    const ai = dataService.aiGenerateRiskFromAsset(assetName, threatName);
    const mit = dataService.aiSuggestMitigation({
      ...ai,
      riskType: formData.riskType || 'Technology'
    });
    setFormData(prev => ({
      ...prev,
      assetGroup: ai.assetGroup || prev.assetGroup,
      asset: ai.asset || prev.asset,
      threat: ai.threat || prev.threat,
      vulnerability: ai.vulnerability || prev.vulnerability,
      riskDescription: ai.description || prev.riskDescription,
      existingControls: ai.existingControls || prev.existingControls,
      likelihood: String(ai.likelihood || prev.likelihood || ''),
      impact: String(ai.impact || prev.impact || ''),
      treatmentOptionChosen: mit.treatmentOptionChosen,
      proposedTreatmentAction: mit.proposedTreatmentAction,
      annexAControlReference: mit.annexAControlReference,
      treatmentCost: mit.treatmentCost,
      treatmentActionOwner: mit.treatmentActionOwner,
      treatmentActionTimescale: mit.treatmentActionTimescale,
      postTreatmentLikelihood: String(mit.postTreatmentLikelihood || ''),
      postTreatmentImpact: String(mit.postTreatmentImpact || ''),
      reviewFrequency: mit.reviewFrequency,
      nextReviewDate: mit.nextReviewDate
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate risk scores
      const preRiskScore = formData.likelihood && formData.impact ? 
        parseInt(formData.likelihood) * parseInt(formData.impact) : 0;
      
      const postRiskScore = formData.postTreatmentLikelihood && formData.postTreatmentImpact ? 
        parseInt(formData.postTreatmentLikelihood) * parseInt(formData.postTreatmentImpact) : 0;
      
      const riskData = {
        ...formData,
        id: `RISK-${Date.now()}`,
        
        // Calculated fields
        riskScore: preRiskScore,
        riskLevel: getRiskLevel(preRiskScore).level,
        postTreatmentRiskScore: postRiskScore,
        postTreatmentRiskLevel: postRiskScore > 0 ? getRiskLevel(postRiskScore).level : '',
        
        // Status fields
        status: 'Open',
        reviewStatus: 'Current',
        assessmentDate: new Date().toISOString().split('T')[0],
        
        // Convert string numbers to integers
        likelihood: parseInt(formData.likelihood) || 0,
        impact: parseInt(formData.impact) || 0,
        postTreatmentLikelihood: parseInt(formData.postTreatmentLikelihood) || 0,
        postTreatmentImpact: parseInt(formData.postTreatmentImpact) || 0,
        
        // Review scheduling
        nextReview: formData.nextReviewDate,
        
        // Additional metadata
        createdDate: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      await onSubmit(riskData);
      alert('Risk assessment created successfully!');
      onClose();
      
      // Reset form
      setFormData({
        ref: '',
        assetGroup: '',
        asset: '',
        threat: '',
        vulnerability: '',
        riskType: '',
        riskOwner: '',
        riskDescription: '',
        existingControls: '',
        likelihood: '',
        likelihoodRationale: '',
        impact: '',
        impactRationale: '',
        treatmentOptionChosen: '',
        proposedTreatmentAction: '',
        annexAControlReference: '',
        treatmentCost: '',
        treatmentActionOwner: '',
        treatmentActionTimescale: '',
        treatmentActionProgress: '0',
        treatmentActionStatus: 'Not Started',
        postTreatmentLikelihood: '',
        postTreatmentLikelihoodRationale: '',
        postTreatmentImpact: '',
        postTreatmentImpactRationale: '',
        comments: '',
        reviewFrequency: 'annually',
        nextReviewDate: ''
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating risk assessment:', error);
      alert('Error creating risk assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const riskScore = formData.likelihood && formData.impact ? 
    parseInt(formData.likelihood) * parseInt(formData.impact) : 0;

  const getRiskLevel = (score) => {
    if (score >= 20) return { level: 'Critical', color: 'text-error' };
    if (score >= 15) return { level: 'High', color: 'text-warning' };
    if (score >= 10) return { level: 'Medium', color: 'text-accent' };
    if (score >= 5) return { level: 'Low', color: 'text-success' };
    return { level: 'Very Low', color: 'text-muted-foreground' };
  };

  const riskLevel = getRiskLevel(riskScore);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Create Risk Assessment</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new risk assessment sheet for evaluation and monitoring
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleAISuggest}>
              <Icon name="Sparkles" size={16} className="mr-2" />
              AI Suggest
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Step Progress */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep ? 'bg-primary text-primary-foreground' :
                  step < currentStep ? 'bg-success text-success-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? <Icon name="Check" size={16} /> : step}
                </div>
                {step < totalSteps && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-success' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? 'Risk Identification' :
              currentStep === 2 ? 'Pre-Treatment Assessment' :
              currentStep === 3 ? 'Treatment Planning' :
              'Post-Treatment Assessment'
            }
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Risk Identification */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Risk Identification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Reference Number"
                  value={formData.ref}
                  onChange={(e) => handleInputChange('ref', e.target.value)}
                  placeholder="Auto-generated"
                  description="Unique risk reference identifier"
                />
                
                <Select
                  label="Asset Group"
                  required
                  options={assetGroupOptions}
                  value={formData.assetGroup}
                  onChange={(value) => handleInputChange('assetGroup', value)}
                  placeholder="Select asset group"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Asset"
                  required
                  options={assetOptions}
                  value={formData.asset}
                  onChange={(value) => handleInputChange('asset', value)}
                  placeholder="Select specific asset"
                  description="Select from Asset Management system"
                />
                
                <Select
                  label="Threat"
                  required
                  options={threatOptions}
                  value={formData.threat}
                  onChange={(value) => handleInputChange('threat', value)}
                  placeholder="Select threat type"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-popover-foreground mb-2">
                    Vulnerability *
                  </label>
                  <textarea
                    required
                    value={formData.vulnerability}
                    onChange={(e) => handleInputChange('vulnerability', e.target.value)}
                    placeholder="Describe the vulnerability that could be exploited..."
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-4">
                  <Select
                    label="Risk Type"
                    required
                    options={riskTypeOptions}
                    value={formData.riskType}
                    onChange={(value) => handleInputChange('riskType', value)}
                    placeholder="Select risk type"
                  />
                  
                  <Input
                    label="Risk Owner"
                    required
                    value={formData.riskOwner}
                    onChange={(e) => handleInputChange('riskOwner', e.target.value)}
                    placeholder="e.g., John Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-popover-foreground mb-2">
                  Risk Description *
                </label>
                <textarea
                  required
                  value={formData.riskDescription}
                  onChange={(e) => handleInputChange('riskDescription', e.target.value)}
                  placeholder="Detailed description of the risk scenario, causes, and potential consequences..."
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 2: Pre-Treatment Assessment */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Pre-Treatment Assessment</h3>
              
              <div>
                <label className="block text-sm font-medium text-popover-foreground mb-2">
                  Existing Controls *
                </label>
                <textarea
                  required
                  value={formData.existingControls}
                  onChange={(e) => handleInputChange('existingControls', e.target.value)}
                  placeholder="Describe current controls and safeguards in place..."
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Select
                    label="Likelihood"
                    required
                    options={likelihoodOptions}
                    value={formData.likelihood}
                    onChange={(value) => handleInputChange('likelihood', value)}
                    placeholder="Select likelihood"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-popover-foreground mb-2">
                      Likelihood Rationale *
                    </label>
                    <textarea
                      required
                      value={formData.likelihoodRationale}
                      onChange={(e) => handleInputChange('likelihoodRationale', e.target.value)}
                      placeholder="Explain the reasoning behind the likelihood rating..."
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Select
                    label="Impact"
                    required
                    options={impactOptions}
                    value={formData.impact}
                    onChange={(value) => handleInputChange('impact', value)}
                    placeholder="Select impact"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-popover-foreground mb-2">
                      Impact Rationale *
                    </label>
                    <textarea
                      required
                      value={formData.impactRationale}
                      onChange={(e) => handleInputChange('impactRationale', e.target.value)}
                      placeholder="Explain the reasoning behind the impact rating..."
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {formData.likelihood && formData.impact && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Pre-Treatment Risk Score:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{riskScore}</span>
                      <span className={`text-sm font-medium ${riskLevel.color}`}>
                        ({riskLevel.level})
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculated as Likelihood × Impact
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Treatment Planning */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Treatment Plan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Treatment Option Chosen"
                  required
                  options={treatmentStrategyOptions}
                  value={formData.treatmentOptionChosen}
                  onChange={(value) => handleInputChange('treatmentOptionChosen', value)}
                  placeholder="Select treatment option"
                />
                
                <Input
                  label="Treatment Action Owner"
                  required
                  value={formData.treatmentActionOwner}
                  onChange={(e) => handleInputChange('treatmentActionOwner', e.target.value)}
                  placeholder="e.g., Jane Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-popover-foreground mb-2">
                  Proposed Treatment Action *
                </label>
                <textarea
                  required
                  value={formData.proposedTreatmentAction}
                  onChange={(e) => handleInputChange('proposedTreatmentAction', e.target.value)}
                  placeholder="Describe the specific treatment actions to be implemented..."
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Annex A/Control Reference"
                  value={formData.annexAControlReference}
                  onChange={(e) => handleInputChange('annexAControlReference', e.target.value)}
                  placeholder="e.g., A.12.1.1"
                  description="ISO 27001 Annex A reference"
                />
                
                <Input
                  label="Treatment Cost"
                  value={formData.treatmentCost}
                  onChange={(e) => handleInputChange('treatmentCost', e.target.value)}
                  placeholder="e.g., $25,000"
                />
                
                <Input
                  label="Treatment Timescale"
                  value={formData.treatmentActionTimescale}
                  onChange={(e) => handleInputChange('treatmentActionTimescale', e.target.value)}
                  placeholder="e.g., 3 months"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-popover-foreground mb-2">
                    Treatment Progress (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.treatmentActionProgress}
                    onChange={(e) => handleInputChange('treatmentActionProgress', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span className="font-medium">{formData.treatmentActionProgress}%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <Select
                  label="Treatment Status"
                  required
                  options={[
                    { value: 'Not Started', label: 'Not Started' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'On Hold', label: 'On Hold' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Cancelled', label: 'Cancelled' }
                  ]}
                  value={formData.treatmentActionStatus}
                  onChange={(value) => handleInputChange('treatmentActionStatus', value)}
                />
              </div>
            </div>
          )}

          {/* Step 4: Post-Treatment Assessment */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Post-Treatment Assessment</h3>
              
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-accent mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Post-Treatment Evaluation</p>
                    <p className="text-muted-foreground">Assess the residual risk after implementing treatment actions.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Select
                    label="Post-Treatment Likelihood"
                    options={likelihoodOptions}
                    value={formData.postTreatmentLikelihood}
                    onChange={(value) => handleInputChange('postTreatmentLikelihood', value)}
                    placeholder="Select likelihood after treatment"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-popover-foreground mb-2">
                      Post-Treatment Likelihood Rationale
                    </label>
                    <textarea
                      value={formData.postTreatmentLikelihoodRationale}
                      onChange={(e) => handleInputChange('postTreatmentLikelihoodRationale', e.target.value)}
                      placeholder="Explain how treatment actions affect likelihood..."
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Select
                    label="Post-Treatment Impact"
                    options={impactOptions}
                    value={formData.postTreatmentImpact}
                    onChange={(value) => handleInputChange('postTreatmentImpact', value)}
                    placeholder="Select impact after treatment"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-popover-foreground mb-2">
                      Post-Treatment Impact Rationale
                    </label>
                    <textarea
                      value={formData.postTreatmentImpactRationale}
                      onChange={(e) => handleInputChange('postTreatmentImpactRationale', e.target.value)}
                      placeholder="Explain how treatment actions affect impact..."
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {formData.postTreatmentLikelihood && formData.postTreatmentImpact && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">Pre-Treatment:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">{riskScore}</span>
                          <span className={`text-sm font-medium ${riskLevel.color}`}>
                            ({riskLevel.level})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">Post-Treatment:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">
                            {parseInt(formData.postTreatmentLikelihood) * parseInt(formData.postTreatmentImpact)}
                          </span>
                          <span className={`text-sm font-medium ${
                            getRiskLevel(parseInt(formData.postTreatmentLikelihood) * parseInt(formData.postTreatmentImpact)).color
                          }`}>
                            ({getRiskLevel(parseInt(formData.postTreatmentLikelihood) * parseInt(formData.postTreatmentImpact)).level})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Review Frequency"
                  required
                  options={[
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'quarterly', label: 'Quarterly' },
                    { value: 'semi-annually', label: 'Semi-Annually' },
                    { value: 'annually', label: 'Annually' },
                    { value: 'bi-annually', label: 'Bi-Annually' }
                  ]}
                  value={formData.reviewFrequency}
                  onChange={(value) => handleInputChange('reviewFrequency', value)}
                />
                
                <Input
                  label="Next Review Date"
                  type="date"
                  required
                  value={formData.nextReviewDate}
                  onChange={(e) => handleInputChange('nextReviewDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-popover-foreground mb-2">
                  Comments
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  placeholder="Additional comments, notes, or observations..."
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="flex justify-between pt-4 border-t border-border">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={isSubmitting}
                >
                  <Icon name="ChevronLeft" size={16} className="mr-2" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={isSubmitting}
                >
                  Next
                  <Icon name="ChevronRight" size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={isSubmitting}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Create Risk Assessment
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRiskAssessmentModal;
