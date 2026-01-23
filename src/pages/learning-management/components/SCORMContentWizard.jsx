import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { autoGenerateSCORMFromMaterials, SCORM_VERSIONS, SCORM_TEMPLATES, validateCourseForSCORM } from '../../../utils/scormGenerator';

const SCORMContentWizard = ({ onClose, onSave, initialData = {} }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPackage, setGeneratedPackage] = useState(null);
  const fileInputRef = useRef(null);
  
  const [scormData, setSCORMData] = useState({
    id: initialData.id || `course_${Date.now()}`,
    title: initialData.title || '',
    description: initialData.description || '',
    version: SCORM_VERSIONS.SCORM_12,
    template: SCORM_TEMPLATES.BASIC,
    duration: initialData.duration || '',
    passingScore: initialData.passingScore || 80,
    certificateEnabled: initialData.certificateEnabled || true,
    includeQuiz: true,
    materials: [],
    customContent: {
      learningObjectives: '',
      courseOutline: '',
      additionalResources: ''
    }
  });

  const steps = [
    { id: 1, title: 'Course Setup', icon: 'Settings', description: 'Configure basic course information' },
    { id: 2, title: 'Content Upload', icon: 'Upload', description: 'Add course materials and resources' },
    { id: 3, title: 'SCORM Options', icon: 'Package', description: 'Choose SCORM version and template' },
    { id: 4, title: 'Generate Package', icon: 'Zap', description: 'Create and download SCORM package' }
  ];

  const versionOptions = [
    { value: SCORM_VERSIONS.SCORM_12, label: 'SCORM 1.2 (Recommended)' },
    { value: SCORM_VERSIONS.SCORM_2004, label: 'SCORM 2004 4th Edition' }
  ];

  const templateOptions = [
    { value: SCORM_TEMPLATES.BASIC, label: 'Basic Course', description: 'Simple text-based course with navigation' },
    { value: SCORM_TEMPLATES.VIDEO_BASED, label: 'Video Course', description: 'Video-focused learning experience' },
    { value: SCORM_TEMPLATES.DOCUMENT_BASED, label: 'Document Course', description: 'PDF and document-based learning' },
    { value: SCORM_TEMPLATES.INTERACTIVE, label: 'Interactive Course', description: 'Mixed media with interactive elements' },
    { value: SCORM_TEMPLATES.ASSESSMENT, label: 'Assessment Course', description: 'Quiz and assessment focused' }
  ];

  const handleInputChange = (field, value) => {
    setSCORMData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomContentChange = (field, value) => {
    setSCORMData(prev => ({
      ...prev,
      customContent: {
        ...prev.customContent,
        [field]: value
      }
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const material = {
          id: `material_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: getFileType(file.name),
          size: file.size,
          file: e.target.result,
          uploadDate: new Date().toISOString()
        };
        
        setSCORMData(prev => ({
          ...prev,
          materials: [...prev.materials, material]
        }));
      };
      
      if (file.type.startsWith('text/') || file.name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileType = (filename) => {
    const ext = filename.toLowerCase().split('.').pop();
    if (['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(ext)) return 'video';
    if (['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(ext)) return 'document';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return 'image';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
    return 'other';
  };

  const removeMaterial = (materialId) => {
    setSCORMData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== materialId)
    }));
  };

  const generateSCORMPackage = async () => {
    setIsGenerating(true);
    
    try {
      // Validate course data
      const validation = validateCourseForSCORM(scormData);
      if (!validation.isValid) {
        alert('Please fix the following errors:\n' + validation.errors.join('\n'));
        setIsGenerating(false);
        return;
      }

      // Generate SCORM package
      const result = await autoGenerateSCORMFromMaterials(scormData, scormData.materials);
      
      if (result.success) {
        setGeneratedPackage(result);
        setCurrentStep(4);
      } else {
        alert('Failed to generate SCORM package: ' + result.error);
      }
    } catch (error) {
      console.error('SCORM generation error:', error);
      alert('An error occurred while generating the SCORM package.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPackage = () => {
    if (!generatedPackage) return;
    
    const url = URL.createObjectURL(generatedPackage.package);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedPackage.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (currentStep === 3) {
        generateSCORMPackage();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const courseWithSCORM = {
      ...scormData,
      contentType: 'scorm',
      scormPackage: generatedPackage,
      autoGenerated: true
    };
    
    onSave(courseWithSCORM);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Icon name="Settings" size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Course Setup</h3>
              <p className="text-muted-foreground">Configure the basic information for your SCORM course</p>
            </div>
            
            <Input
              label="Course Title"
              value={scormData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter course title"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course Description
              </label>
              <textarea
                value={scormData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of the course content and objectives"
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Estimated Duration"
                value={scormData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 2 hours, 30 minutes"
              />
              
              <Input
                label="Passing Score (%)"
                type="number"
                value={scormData.passingScore}
                onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value))}
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Learning Objectives
              </label>
              <textarea
                value={scormData.customContent.learningObjectives}
                onChange={(e) => handleCustomContentChange('learningObjectives', e.target.value)}
                placeholder="List the key learning objectives for this course"
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Icon name="Upload" size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Content Upload</h3>
              <p className="text-muted-foreground">Add your course materials that will be included in the SCORM package</p>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Icon name="Upload" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                Drag and drop files here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supported: Videos (MP4, AVI, MOV), Documents (PDF, DOC, DOCX), Images (JPG, PNG), Audio (MP3, WAV)
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                iconName="Upload"
                iconPosition="left"
              >
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".mp4,.avi,.mov,.wmv,.webm,.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.svg,.mp3,.wav,.ogg"
              />
            </div>

            {/* Uploaded Materials List */}
            {scormData.materials.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Uploaded Materials ({scormData.materials.length})</h4>
                <div className="space-y-2">
                  {scormData.materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon 
                          name={
                            material.type === 'video' ? 'Play' :
                            material.type === 'document' ? 'FileText' :
                            material.type === 'image' ? 'Image' :
                            material.type === 'audio' ? 'Volume2' : 'File'
                          } 
                          size={20} 
                          className="text-muted-foreground" 
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{material.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {material.type} • {(material.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMaterial(material.id)}
                        iconName="Trash2"
                        className="text-error hover:text-error"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Content */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course Outline
              </label>
              <textarea
                value={scormData.customContent.courseOutline}
                onChange={(e) => handleCustomContentChange('courseOutline', e.target.value)}
                placeholder="Provide a detailed course outline or syllabus"
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Icon name="Package" size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">SCORM Configuration</h3>
              <p className="text-muted-foreground">Choose your SCORM version and template options</p>
            </div>

            <Select
              label="SCORM Version"
              options={versionOptions}
              value={scormData.version}
              onChange={(value) => handleInputChange('version', value)}
              description="SCORM 1.2 is recommended for better LMS compatibility"
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Course Template
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateOptions.map((template) => (
                  <div
                    key={template.value}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      scormData.template === template.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('template', template.value)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{template.label}</h4>
                      {scormData.template === template.value && (
                        <Icon name="Check" size={20} className="text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Package Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course Title:</span>
                  <span className="text-foreground font-medium">{scormData.title || 'Untitled Course'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SCORM Version:</span>
                  <span className="text-foreground">{scormData.version === SCORM_VERSIONS.SCORM_12 ? 'SCORM 1.2' : 'SCORM 2004'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Template:</span>
                  <span className="text-foreground">{templateOptions.find(t => t.value === scormData.template)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Materials:</span>
                  <span className="text-foreground">{scormData.materials.length} files</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passing Score:</span>
                  <span className="text-foreground">{scormData.passingScore}%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              {isGenerating ? (
                <>
                  <div className="animate-spin mx-auto mb-4">
                    <Icon name="Loader2" size={48} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Generating SCORM Package</h3>
                  <p className="text-muted-foreground">Please wait while we create your SCORM package...</p>
                </>
              ) : generatedPackage ? (
                <>
                  <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Package Generated Successfully!</h3>
                  <p className="text-muted-foreground">Your SCORM package is ready for download and deployment</p>
                </>
              ) : (
                <>
                  <Icon name="Zap" size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Generate</h3>
                  <p className="text-muted-foreground">Click the button below to create your SCORM package</p>
                </>
              )}
            </div>

            {generatedPackage && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-medium text-foreground mb-4">Package Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Filename:</span>
                    <span className="text-foreground font-mono">{generatedPackage.filename}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SCORM Version:</span>
                    <span className="text-foreground">{generatedPackage.metadata.course.scormVersion === SCORM_VERSIONS.SCORM_12 ? 'SCORM 1.2' : 'SCORM 2004'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Template:</span>
                    <span className="text-foreground">{generatedPackage.metadata.course.template}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Generated:</span>
                    <span className="text-foreground">{new Date(generatedPackage.metadata.generator.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button
                    variant="default"
                    onClick={downloadPackage}
                    iconName="Download"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Download SCORM Package
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    iconName="Save"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Save to Course Library
                  </Button>
                </div>
              </div>
            )}

            {!generatedPackage && !isGenerating && (
              <div className="text-center">
                <Button
                  variant="default"
                  onClick={generateSCORMPackage}
                  iconName="Zap"
                  iconPosition="left"
                  size="lg"
                >
                  Generate SCORM Package
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">SCORM Course Creator</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Step {currentStep} of {steps.length} - {steps.find(s => s.id === currentStep)?.description}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-white' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                }`}>
                  {currentStep > step.id ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step.icon} size={16} />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium transition-colors ${
                    currentStep >= step.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 transition-colors ${
                    currentStep > step.id ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-slate-900">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {currentStep === steps.length ? (
              generatedPackage ? (
                <Button
                  variant="default"
                  onClick={handleSave}
                  iconName="Save"
                  iconPosition="left"
                >
                  Save Course
                </Button>
              ) : null
            ) : (
              <Button
                variant="default"
                onClick={handleNext}
                disabled={isGenerating}
                iconName={currentStep === 3 ? "Zap" : "ChevronRight"}
                iconPosition="right"
              >
                {currentStep === 3 ? 'Generate Package' : 'Next'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCORMContentWizard;
