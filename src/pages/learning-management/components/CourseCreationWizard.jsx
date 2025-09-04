import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { autoGenerateSCORMFromMaterials, SCORM_VERSIONS, SCORM_TEMPLATES } from '../../../utils/scormGenerator';
import { FileSecurityValidator } from '../../../utils/fileSecurityValidator';

  const CourseCreationWizard = ({ onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const videoInputRef = React.useRef(null);
  const documentInputRef = React.useRef(null);
  const scormInputRef = React.useRef(null);
  const thumbnailInputRef = React.useRef(null);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    duration: '',
    thumbnail: null,
    contentType: 'video',
    prerequisites: [],
    tags: [],
    targetRoles: [],
    targetDepartments: [],
    isActive: true,
    allowRetakes: true,
    passingScore: 80,
    certificateEnabled: true,
    autoGenerateSCORM: false,
    scormVersion: SCORM_VERSIONS.SCORM_12,
    scormTemplate: SCORM_TEMPLATES.BASIC,
    content: {
      videos: [],
      documents: [],
      quizzes: [],
      scormPackages: [],
      materials: []
    }
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: 'Info' },
    { id: 2, title: 'Content Upload', icon: 'Upload' },
    { id: 3, title: 'SCORM Options', icon: 'Package' },
    { id: 4, title: 'Quiz Builder', icon: 'HelpCircle' },
    { id: 5, title: 'Settings & Publish', icon: 'Settings' }
  ];

  const categoryOptions = [
    { value: 'compliance', label: 'Compliance & Regulatory' },
    { value: 'technical', label: 'Technical Skills' },
    { value: 'soft_skills', label: 'Soft Skills' },
    { value: 'leadership', label: 'Leadership & Management' },
    { value: 'safety', label: 'Health & Safety' },
    { value: 'orientation', label: 'Orientation & Onboarding' }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const contentTypeOptions = [
    { value: 'video', label: 'Video Course' },
    { value: 'document', label: 'Document-based' },
    { value: 'mixed', label: 'Mixed Content' },
    { value: 'scorm', label: 'SCORM Package' }
  ];

  const roleOptions = [
    { value: 'developer', label: 'Software Developer' },
    { value: 'manager', label: 'Manager' },
    { value: 'analyst', label: 'Business Analyst' },
    { value: 'designer', label: 'UI/UX Designer' },
    { value: 'qa', label: 'Quality Assurance' }
  ];

  const departmentOptions = [
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'Information Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' }
  ];

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? value : [value]
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        // Basic Information validation
        if (!courseData.title?.trim()) {
          alert('Please enter a course title');
          return false;
        }
        if (!courseData.description?.trim()) {
          alert('Please provide a course description');
          return false;
        }
        if (!courseData.category) {
          alert('Please select a course category');
          return false;
        }
        if (!courseData.duration?.trim()) {
          alert('Please specify the course duration');
          return false;
        }
        break;
      
      case 2:
        // Content Upload validation
        if (courseData.content.materials.length === 0) {
          const proceed = confirm('No content has been uploaded yet. Do you want to continue to the next step anyway?');
          return proceed;
        }
        break;
      
      case 3:
        // SCORM Options validation (optional step, no validation needed)
        break;
      
      case 4:
        // Quiz Builder validation (optional)
        if (courseData.content.quizzes.length > 0) {
          // If there are quizzes, validate they're complete
          const incompleteQuizzes = courseData.content.quizzes.filter(quiz => 
            !quiz.question?.trim() || 
            quiz.options.some(opt => !opt?.trim()) || 
            quiz.correctAnswer === undefined
          );
          if (incompleteQuizzes.length > 0) {
            alert(`Please complete all quiz questions before proceeding. ${incompleteQuizzes.length} questions are incomplete.`);
            return false;
          }
        }
        break;
        
      case 5:
        // Final settings validation
        if (courseData.passingScore < 0 || courseData.passingScore > 100) {
          alert('Passing score must be between 0 and 100');
          return false;
        }
        break;
        
      default:
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps?.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleVideoUpload = async (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    
    for (const file of files) {
      try {
        // Validate MP4 file with security checks
        const validationResult = await FileSecurityValidator.validateMP4(file);
        
        if (!validationResult.isValid) {
          alert(`❌ Upload Failed: ${file.name}\n\n${validationResult.errors.join('\n')}`);
          continue;
        }
        
        // Show warnings if any
        if (validationResult.warnings && validationResult.warnings.length > 0) {
          const proceed = confirm(`⚠️ Warning for ${file.name}:\n\n${validationResult.warnings.join('\n')}\n\nDo you want to proceed with the upload?`);
          if (!proceed) continue;
        }
        
        const videoData = {
          id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: 'video',
          size: file.size,
          mimeType: file.type,
          uploadDate: new Date().toISOString(),
          duration: null, // Would be calculated in real implementation
          thumbnail: null, // Would be generated in real implementation
          validated: true,
          securityCheck: 'passed'
        };
        
        setCourseData(prev => ({
          ...prev,
          content: {
            ...prev.content,
            videos: [...prev.content.videos, videoData],
            materials: [...prev.content.materials, videoData]
          }
        }));
        
        console.log(`✅ Video uploaded successfully: ${file.name}`);
        
      } catch (error) {
        console.error('Error validating video file:', error);
        alert(`❌ Error validating ${file.name}: ${error.message}`);
      }
    }
    
    setIsUploading(false);
    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };
  
  const handleDocumentUpload = async (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    
    for (const file of files) {
      try {
        // Validate PDF file with security checks
        const validationResult = await FileSecurityValidator.validatePDF(file);
        
        if (!validationResult.isValid) {
          alert(`❌ Upload Failed: ${file.name}\n\n${validationResult.errors.join('\n')}`);
          continue;
        }
        
        // Show warnings if any (but allow upload)
        if (validationResult.warnings && validationResult.warnings.length > 0) {
          const proceed = confirm(`⚠️ Security Warning for ${file.name}:\n\n${validationResult.warnings.join('\n')}\n\nThis file passed security checks but contains elements that require attention. Do you want to proceed?`);
          if (!proceed) continue;
        }
        
        // Read file content for storage
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const documentData = {
            id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            type: 'document',
            size: file.size,
            mimeType: file.type,
            uploadDate: new Date().toISOString(),
            fileContent: e.target.result, // Store file content as data URL
            fileExtension: 'pdf',
            pages: null, // Would be calculated in real implementation
            status: 'uploaded',
            validated: true,
            securityCheck: 'passed',
            warnings: validationResult.warnings || []
          };
          
          setCourseData(prev => ({
            ...prev,
            content: {
              ...prev.content,
              documents: [...prev.content.documents, documentData],
              materials: [...prev.content.materials, documentData]
            }
          }));
          
          console.log(`✅ PDF uploaded successfully: ${file.name}`);
        };
        
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
          alert(`❌ Error reading ${file.name}. Please try again.`);
        };
        
        // Read as data URL for PDF files
        reader.readAsDataURL(file);
        
      } catch (error) {
        console.error('Error validating PDF file:', error);
        alert(`❌ Error validating ${file.name}: ${error.message}`);
      }
    }
    
    setIsUploading(false);
    // Reset input
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };
  
  const handleSCORMUpload = (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    
    files.forEach(file => {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        alert(`File ${file.name} is too large. Maximum size is 100MB.`);
        return;
      }
      
      if (!file.name.toLowerCase().endsWith('.zip')) {
        alert(`File ${file.name} must be a ZIP file.`);
        return;
      }
      
      const scormData = {
        id: `scorm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: 'scorm',
        size: file.size,
        mimeType: file.type,
        uploadDate: new Date().toISOString(),
        version: 'Unknown' // Would be detected from manifest
      };
      
      setCourseData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          scormPackages: [...prev.content.scormPackages, scormData],
          materials: [...prev.content.materials, scormData]
        }
      }));
    });
    
    setIsUploading(false);
    // Reset input
    if (scormInputRef.current) {
      scormInputRef.current.value = '';
    }
  };

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Check file size (5MB limit for images)
      if (file.size > 5 * 1024 * 1024) {
        alert(`❌ File too large: ${file.name}\n\nMaximum file size is 5MB for thumbnails.`);
        return;
      }

      // Check if it's an image file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert(`❌ Invalid file type: ${file.name}\n\nOnly image files (JPG, PNG, GIF, WebP) are allowed for thumbnails.`);
        return;
      }

      // Read the file as data URL for preview
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const thumbnailData = {
          file: file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString()
        };

        setCourseData(prev => ({
          ...prev,
          thumbnail: thumbnailData
        }));

        console.log(`✅ Thumbnail uploaded successfully: ${file.name}`);
      };

      reader.onerror = (error) => {
        console.error('Error reading thumbnail file:', error);
        alert(`❌ Error reading ${file.name}. Please try again.`);
      };

      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert(`❌ Error uploading thumbnail: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Reset input
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }
    }
  };

  const removeThumbnail = () => {
    setCourseData(prev => ({
      ...prev,
      thumbnail: null
    }));
  };
  
  const removeMaterial = (materialId, contentType) => {
    setCourseData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [contentType]: prev.content[contentType].filter(item => item.id !== materialId),
        materials: prev.content.materials.filter(item => item.id !== materialId)
      }
    }));
  };

  // Quiz Builder Functions
  const addNewQuestion = () => {
    const questionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newQuestion = {
      id: questionId,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      type: 'multiple-choice',
      points: 1,
      explanation: ''
    };
    
    setCourseData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        quizzes: [...prev.content.quizzes, newQuestion]
      }
    }));
    
    // Automatically open edit mode for the new question
    editQuestion(questionId);
  };
  
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionFormData, setQuestionFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  const editQuestion = (questionId) => {
    const question = courseData.content.quizzes.find(q => q.id === questionId);
    if (!question) return;
    
    setQuestionFormData({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || ''
    });
    setEditingQuestion(questionId);
  };

  const handleQuestionFormChange = (field, value) => {
    setQuestionFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    setQuestionFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleSaveQuestion = () => {
    if (!questionFormData.question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    if (questionFormData.options.some(opt => !opt.trim())) {
      alert('Please fill in all options');
      return;
    }
    
    setCourseData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        quizzes: prev.content.quizzes.map(q => 
          q.id === editingQuestion 
            ? {
                ...q,
                question: questionFormData.question,
                options: [...questionFormData.options],
                correctAnswer: questionFormData.correctAnswer,
                explanation: questionFormData.explanation
              }
            : q
        )
      }
    }));
    
    setEditingQuestion(null);
    setQuestionFormData({ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setQuestionFormData({ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' });
  };
  
  const removeQuestion = (questionId) => {
    if (confirm('Are you sure you want to remove this question?')) {
      setCourseData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          quizzes: prev.content.quizzes.filter(q => q.id !== questionId)
        }
      }));
    }
  };

  const handleSave = async () => {
    try {
      let finalCourseData = { ...courseData };
      
      // Auto-generate SCORM package if enabled and materials exist
      if (courseData.autoGenerateSCORM && courseData.content.materials.length > 0) {
        const scormOptions = {
          version: courseData.scormVersion,
          template: courseData.scormTemplate,
          includeQuiz: courseData.content.quizzes.length > 0
        };
        
        const scormResult = await autoGenerateSCORMFromMaterials(courseData, courseData.content.materials, scormOptions);
        
        if (scormResult.success) {
          finalCourseData = {
            ...finalCourseData,
            contentType: 'scorm',
            scormPackage: scormResult,
            autoGenerated: true
          };
        }
      }
      
      // Call onSave with a success callback
      await onSave(finalCourseData);
      
    } catch (error) {
      console.error('Error saving course:', error);
      // Show a user-friendly error message
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
            <h3 class="text-lg font-semibold text-foreground">Error Creating Course</h3>
          </div>
          <p class="text-muted-foreground mb-6">There was an error creating your course. Please check your data and try again.</p>
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Input
              label="Course Title"
              value={courseData?.title}
              onChange={(e) => handleInputChange('title', e?.target?.value)}
              placeholder="Enter course title"
              required
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course Description
              </label>
              <textarea
                value={courseData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                placeholder="Provide a detailed description of the course content and objectives"
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                options={categoryOptions}
                value={courseData?.category}
                onChange={(value) => handleInputChange('category', value)}
                required
              />

              <Select
                label="Difficulty Level"
                options={difficultyOptions}
                value={courseData?.difficulty}
                onChange={(value) => handleInputChange('difficulty', value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Estimated Duration"
                value={courseData?.duration}
                onChange={(e) => handleInputChange('duration', e?.target?.value)}
                placeholder="e.g., 2 hours, 30 minutes"
              />

              <Select
                label="Primary Content Type"
                options={contentTypeOptions}
                value={courseData?.contentType}
                onChange={(value) => handleInputChange('contentType', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course Thumbnail
              </label>
              
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
              
              {courseData?.thumbnail ? (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img 
                        src={courseData.thumbnail.url} 
                        alt="Course thumbnail" 
                        className="w-32 h-20 object-cover rounded-lg border border-border"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 bg-error text-error-foreground hover:bg-error/90 rounded-full w-6 h-6 p-0"
                        onClick={removeThumbnail}
                      >
                        <Icon name="X" size={12} />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{courseData.thumbnail.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(courseData.thumbnail.size / 1024).toFixed(1)} KB • {courseData.thumbnail.type}
                      </p>
                      <p className="text-xs text-success mt-1">
                        ✅ Thumbnail uploaded successfully
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                     onClick={() => thumbnailInputRef.current?.click()}>
                  <Icon name="Upload" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Drop your thumbnail here or click to browse</p>
                  <p className="text-xs text-muted-foreground mb-4">Supports: JPG, PNG, GIF, WebP • Max size: 5MB</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      thumbnailInputRef.current?.click();
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Choose File'}
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Target Roles"
                options={roleOptions}
                value={courseData?.targetRoles}
                onChange={(value) => handleArrayChange('targetRoles', value)}
                multiple
                searchable
              />

              <Select
                label="Target Departments"
                options={departmentOptions}
                value={courseData?.targetDepartments}
                onChange={(value) => handleArrayChange('targetDepartments', value)}
                multiple
                searchable
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Upload Course Content</h3>
              <p className="text-muted-foreground">Add videos, documents, and other learning materials</p>
            </div>

            {/* Video Upload */}
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground flex items-center">
                  <Icon name="Play" size={20} className="mr-2" />
                  Video Content ({courseData.content.videos.length})
                </h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="Plus"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Add Video
                </Button>
              </div>
              
              <input
                ref={videoInputRef}
                type="file"
                multiple
                accept=".mp4"
                onChange={handleVideoUpload}
                className="hidden"
              />
              
              {courseData.content.videos.length > 0 ? (
                <div className="space-y-2">
                  {courseData.content.videos.map(video => (
                    <div key={video.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="Play" size={20} className="text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{video.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(video.size / 1024 / 1024).toFixed(2)} MB • {new Date(video.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        className="text-error hover:text-error"
                        onClick={() => removeMaterial(video.id, 'videos')}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Icon name="Video" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Upload MP4 video files only</p>
                  <p className="text-sm text-muted-foreground mt-1">Maximum file size: 500MB • Secure file validation enabled</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Choose Videos'}
                  </Button>
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground flex items-center">
                  <Icon name="FileText" size={20} className="mr-2" />
                  Documents & Resources ({courseData.content.documents.length})
                </h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="Plus"
                  onClick={() => documentInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Add Document
                </Button>
              </div>
              
              <input
                ref={documentInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={handleDocumentUpload}
                className="hidden"
              />
              
              {courseData.content.documents.length > 0 ? (
                <div className="space-y-2">
                  {courseData.content.documents.map(document => (
                    <div key={document.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="FileText" size={20} className="text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{document.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(document.size / 1024 / 1024).toFixed(2)} MB • {new Date(document.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        className="text-error hover:text-error"
                        onClick={() => removeMaterial(document.id, 'documents')}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Upload PDF documents only</p>
                  <p className="text-sm text-muted-foreground mt-1">Maximum file size: 50MB • Security scanning enabled</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => documentInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Choose Documents'}
                  </Button>
                </div>
              )}
            </div>

            {/* SCORM Package */}
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground flex items-center">
                  <Icon name="Package" size={20} className="mr-2" />
                  SCORM Package ({courseData.content.scormPackages.length})
                </h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="Plus"
                  onClick={() => scormInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Upload SCORM
                </Button>
              </div>
              
              <input
                ref={scormInputRef}
                type="file"
                multiple
                accept=".zip"
                onChange={handleSCORMUpload}
                className="hidden"
              />
              
              {courseData.content.scormPackages.length > 0 ? (
                <div className="space-y-2">
                  {courseData.content.scormPackages.map(scorm => (
                    <div key={scorm.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="Package" size={20} className="text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{scorm.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(scorm.size / 1024 / 1024).toFixed(2)} MB • {scorm.version} • {new Date(scorm.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        className="text-error hover:text-error"
                        onClick={() => removeMaterial(scorm.id, 'scormPackages')}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Upload SCORM 1.2 or SCORM 2004 packages</p>
                  <p className="text-sm text-muted-foreground mt-1">ZIP files only, maximum 100MB</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => scormInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Choose SCORM Package'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">SCORM Options</h3>
              <p className="text-muted-foreground">Configure automatic SCORM package generation</p>
            </div>
            
            {/* Auto-Generate SCORM */}
            <div className="bg-card border border-border rounded-lg p-6">
              <Checkbox
                label="Auto-Generate SCORM Package"
                description="Automatically create a SCORM-compliant package from your course materials"
                checked={courseData?.autoGenerateSCORM}
                onChange={(e) => handleInputChange('autoGenerateSCORM', e?.target?.checked)}
              />
              
              {courseData?.autoGenerateSCORM && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="SCORM Version"
                      options={[
                        { value: SCORM_VERSIONS.SCORM_12, label: 'SCORM 1.2 (Recommended)' },
                        { value: SCORM_VERSIONS.SCORM_2004, label: 'SCORM 2004 4th Edition' }
                      ]}
                      value={courseData?.scormVersion}
                      onChange={(value) => handleInputChange('scormVersion', value)}
                      description="SCORM 1.2 has better LMS compatibility"
                    />
                    
                    <Select
                      label="Template Style"
                      options={[
                        { value: SCORM_TEMPLATES.BASIC, label: 'Basic Course' },
                        { value: SCORM_TEMPLATES.VIDEO_BASED, label: 'Video-Focused' },
                        { value: SCORM_TEMPLATES.DOCUMENT_BASED, label: 'Document-Based' },
                        { value: SCORM_TEMPLATES.INTERACTIVE, label: 'Interactive' },
                        { value: SCORM_TEMPLATES.ASSESSMENT, label: 'Assessment-Focused' }
                      ]}
                      value={courseData?.scormTemplate}
                      onChange={(value) => handleInputChange('scormTemplate', value)}
                    />
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-3">SCORM Package Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Version:</span>
                        <span className="text-foreground">
                          {courseData?.scormVersion === SCORM_VERSIONS.SCORM_12 ? 'SCORM 1.2' : 'SCORM 2004'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Template:</span>
                        <span className="text-foreground capitalize">
                          {courseData?.scormTemplate?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Materials:</span>
                        <span className="text-foreground">
                          {courseData?.content?.materials?.length || 0} files
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Include Quiz:</span>
                        <span className="text-foreground">
                          {courseData?.content?.quizzes?.length > 0 ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Your uploaded materials will be packaged into a SCORM-compliant ZIP file</li>
                          <li>• The package will include proper manifest files and API wrappers</li>
                          <li>• Progress tracking and completion status will be automatically handled</li>
                          <li>• The package can be deployed to any SCORM-compatible LMS</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Quiz Builder</h3>
              <p className="text-muted-foreground">Create assessments to test learner knowledge</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-medium text-foreground">Quiz Questions ({courseData?.content?.quizzes?.length || 0})</h4>
                <Button 
                  variant="default" 
                  size="sm" 
                  iconName="Plus"
                  onClick={addNewQuestion}
                >
                  Add Question
                </Button>
              </div>

              <div className="space-y-4">
                {/* Existing Questions */}
                {courseData?.content?.quizzes?.map((question, index) => (
                  <div key={question.id} className="bg-muted rounded-lg p-4">
                    {editingQuestion === question.id ? (
                      // Edit mode
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-foreground">Edit Question {index + 1}</span>
                          <div className="flex space-x-2">
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={handleSaveQuestion}
                            >
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                        
                        <Input
                          label="Question"
                          value={questionFormData.question}
                          onChange={(e) => handleQuestionFormChange('question', e.target.value)}
                          placeholder="Enter your question"
                        />
                        
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-foreground">Answer Options</label>
                          {questionFormData.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="correct-answer"
                                checked={questionFormData.correctAnswer === optIndex}
                                onChange={() => handleQuestionFormChange('correctAnswer', optIndex)}
                                className="text-primary"
                              />
                              <Input
                                value={option}
                                onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </div>
                        
                        <Input
                          label="Explanation (Optional)"
                          value={questionFormData.explanation}
                          onChange={(e) => handleQuestionFormChange('explanation', e.target.value)}
                          placeholder="Provide an explanation for the correct answer"
                        />
                      </div>
                    ) : (
                      // View mode
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-foreground">Question {index + 1}</span>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              iconName="Edit"
                              onClick={() => editQuestion(question.id)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              iconName="Trash2" 
                              className="text-error"
                              onClick={() => removeQuestion(question.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-foreground mb-3 font-medium">{question.question}</p>
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2 p-2 rounded bg-background">
                              <input 
                                type="radio" 
                                name={`q${question.id}`} 
                                className="text-primary" 
                                disabled
                                checked={optIndex === question.correctAnswer}
                              />
                              <span className={`text-sm flex-1 ${
                                optIndex === question.correctAnswer ? 'text-foreground font-medium' : 'text-muted-foreground'
                              }`}>{option}</span>
                              {optIndex === question.correctAnswer && (
                                <Icon name="Check" size={16} className="text-success" />
                              )}
                            </div>
                          ))}
                        </div>
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Explanation:</span> {question.explanation}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {/* Add Question Placeholder */}
                {courseData?.content?.quizzes?.length === 0 && (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Icon name="HelpCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Add questions to create your quiz</p>
                    <Button 
                      variant="outline" 
                      iconName="Plus"
                      onClick={addNewQuestion}
                    >
                      Create First Question
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Passing Score (%)"
                type="number"
                value={courseData?.passingScore}
                onChange={(e) => handleInputChange('passingScore', parseInt(e?.target?.value))}
                min="0"
                max="100"
              />
              <Input
                label="Time Limit (minutes)"
                type="number"
                value={courseData?.timeLimit || ''}
                onChange={(e) => handleInputChange('timeLimit', parseInt(e?.target?.value))}
                placeholder="Leave empty for no time limit"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Course Settings</h3>
              <p className="text-muted-foreground">Configure final settings and publish your course</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Access Settings</h4>
                <Checkbox
                  label="Course is Active"
                  description="Make this course available to learners"
                  checked={courseData?.isActive}
                  onChange={(e) => handleInputChange('isActive', e?.target?.checked)}
                />
                <Checkbox
                  label="Allow Retakes"
                  description="Learners can retake the course if they fail"
                  checked={courseData?.allowRetakes}
                  onChange={(e) => handleInputChange('allowRetakes', e?.target?.checked)}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Certification</h4>
                <Checkbox
                  label="Enable Certificate"
                  description="Generate certificates upon successful completion"
                  checked={courseData?.certificateEnabled}
                  onChange={(e) => handleInputChange('certificateEnabled', e?.target?.checked)}
                />
                <Input
                  label="Certificate Validity (months)"
                  type="number"
                  placeholder="12"
                  disabled={!courseData?.certificateEnabled}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course Tags
              </label>
              <Input
                placeholder="Add tags separated by commas (e.g., security, compliance, mandatory)"
                description="Tags help learners find relevant courses"
              />
            </div>
            {/* Course Preview */}
            <div className="bg-muted rounded-lg p-6">
              <h4 className="font-medium text-foreground mb-4">Course Preview</h4>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                    {courseData?.thumbnail ? (
                      <img 
                        src={courseData.thumbnail.url} 
                        alt="Course thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name="BookOpen" size={32} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-foreground">{courseData?.title || 'Course Title'}</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      {courseData?.description || 'Course description will appear here'}
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{courseData?.duration || 'Duration'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="BarChart" size={14} />
                        <span className="capitalize">{courseData?.difficulty}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Award" size={14} />
                        <span>{courseData?.certificateEnabled ? 'Certificate' : 'No Certificate'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-enterprise-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create New Course</h2>
            <p className="text-sm text-muted-foreground">Step {currentStep} of {steps?.length}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {steps?.map((step, index) => (
              <div key={step?.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step?.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-border text-muted-foreground'
                }`}>
                  {currentStep > step?.id ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step?.title}
                  </p>
                </div>
                {index < steps?.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step?.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
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
            {currentStep === steps?.length ? (
              <Button
                variant="default"
                onClick={handleSave}
                iconName="Save"
                iconPosition="left"
              >
                Save & Publish
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleNext}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreationWizard;