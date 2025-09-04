import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import dataService from '../../../services/DataService';
import CertificateGenerator from '../../../utils/certificateGenerator';

const CertificateGenerationModal = ({ isOpen, onClose, onGenerate }) => {
  const [step, setStep] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [certificateSettings, setCertificateSettings] = useState({
    template: CertificateGenerator.TEMPLATES.STANDARD,
    validityMonths: 12,
    issuer: 'Learning Administrator',
    bulkGeneration: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
      loadCourses();
    }
  }, [isOpen]);

  const loadEmployees = () => {
    const users = dataService.getUsers();
    setEmployees(users);
  };

  const loadCourses = () => {
    // Mock courses - in real implementation, would load from DataService
    const mockCourses = [
      { id: 'course001', title: 'Data Privacy and GDPR Compliance', passingScore: 80 },
      { id: 'course002', title: 'Cybersecurity Awareness Training', passingScore: 75 },
      { id: 'course003', title: 'Project Management Fundamentals', passingScore: 85 },
      { id: 'course004', title: 'Financial Compliance and Ethics', passingScore: 90 },
      { id: 'course005', title: 'Customer Service Excellence', passingScore: 80 },
      { id: 'course006', title: 'Leadership and Team Management', passingScore: 85 }
    ];
    setCourses(mockCourses);
  };

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' }
  ];

  const templateOptions = [
    { value: CertificateGenerator.TEMPLATES.STANDARD, label: 'Standard Certificate' },
    { value: CertificateGenerator.TEMPLATES.COMPLIANCE, label: 'Compliance Certificate' },
    { value: CertificateGenerator.TEMPLATES.TECHNICAL, label: 'Technical Certificate' },
    { value: CertificateGenerator.TEMPLATES.SAFETY, label: 'Safety Certificate' },
    { value: CertificateGenerator.TEMPLATES.LEADERSHIP, label: 'Leadership Certificate' }
  ];

  const courseOptions = courses.map(course => ({
    value: course.id,
    label: course.title
  }));

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name?.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                         emp.email?.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                         emp.id?.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleEmployeeSelection = (employee, selected) => {
    if (selected) {
      setSelectedEmployees(prev => [...prev, employee]);
    } else {
      setSelectedEmployees(prev => prev.filter(emp => emp.id !== employee.id));
    }
  };

  const handleSelectAllEmployees = (selected) => {
    if (selected) {
      setSelectedEmployees(filteredEmployees);
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedEmployees.length === 0) {
      alert('Please select at least one employee');
      return;
    }
    if (step === 2 && !selectedCourse) {
      alert('Please select a course');
      return;
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      const selectedCourseData = courses.find(c => c.id === selectedCourse);
      if (!selectedCourseData) {
        throw new Error('Selected course not found');
      }

      const results = [];
      
      for (const employee of selectedEmployees) {
        // Generate random score between passing score and 100
        const randomScore = Math.floor(Math.random() * (100 - selectedCourseData.passingScore + 1)) + selectedCourseData.passingScore;
        
        const certificateData = {
          employeeName: employee.name,
          employeeId: employee.id,
          department: employee.department,
          courseName: selectedCourseData.title,
          courseId: selectedCourseData.id,
          score: randomScore,
          passingScore: selectedCourseData.passingScore,
          validityMonths: certificateSettings.validityMonths,
          template: certificateSettings.template,
          issuer: certificateSettings.issuer
        };

        const result = await CertificateGenerator.generateCertificate(certificateData);
        
        if (result.success) {
          // Store certificate in DataService
          dataService.addCertificate(result.certificate);
          results.push(result);
        } else {
          console.error('Failed to generate certificate for', employee.name, result.error);
        }
      }

      alert(`Successfully generated ${results.length} certificate(s)!`);
      onGenerate(results);
      handleClose();

    } catch (error) {
      console.error('Error generating certificates:', error);
      alert('Failed to generate certificates. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedEmployees([]);
    setSelectedCourse(null);
    setCertificateSettings({
      template: CertificateGenerator.TEMPLATES.STANDARD,
      validityMonths: 12,
      issuer: 'Learning Administrator',
      bulkGeneration: false
    });
    onClose();
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Select Employees</h3>
              <p className="text-muted-foreground">Choose employees to generate certificates for</p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
              />
              <Select
                options={departmentOptions}
                value={departmentFilter}
                onChange={setDepartmentFilter}
                placeholder="Filter by department"
              />
            </div>

            {/* Employee List */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Employees ({filteredEmployees.length})</h4>
                  <Checkbox
                    label="Select All"
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={(e) => handleSelectAllEmployees(e.target.checked)}
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredEmployees.map(employee => (
                  <div key={employee.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.email} • {employee.department}</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedEmployees.some(emp => emp.id === employee.id)}
                      onChange={(e) => handleEmployeeSelection(employee, e.target.checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {selectedEmployees.length > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-primary">
                  {selectedEmployees.length} employee(s) selected for certificate generation
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Select Course</h3>
              <p className="text-muted-foreground">Choose the course for certificate generation</p>
            </div>

            <Select
              label="Course"
              options={courseOptions}
              value={selectedCourse}
              onChange={setSelectedCourse}
              placeholder="Select a course"
              searchable
            />

            {selectedCourse && (
              <div className="bg-card border border-border rounded-lg p-4">
                {(() => {
                  const course = courses.find(c => c.id === selectedCourse);
                  return course ? (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Passing Score: {course.passingScore}%
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Certificate Settings</h3>
              <p className="text-muted-foreground">Configure certificate properties</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Certificate Template"
                options={templateOptions}
                value={certificateSettings.template}
                onChange={(value) => setCertificateSettings(prev => ({ ...prev, template: value }))}
              />

              <Input
                label="Validity (months)"
                type="number"
                value={certificateSettings.validityMonths}
                onChange={(e) => setCertificateSettings(prev => ({ ...prev, validityMonths: parseInt(e.target.value) }))}
                min="1"
                max="60"
              />
            </div>

            <Input
              label="Issuer Name"
              value={certificateSettings.issuer}
              onChange={(e) => setCertificateSettings(prev => ({ ...prev, issuer: e.target.value }))}
              placeholder="Enter issuer name"
            />

            {/* Preview */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Generation Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employees:</span>
                  <span className="text-foreground">{selectedEmployees.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course:</span>
                  <span className="text-foreground">{courses.find(c => c.id === selectedCourse)?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Template:</span>
                  <span className="text-foreground capitalize">{certificateSettings.template}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Validity:</span>
                  <span className="text-foreground">{certificateSettings.validityMonths} months</span>
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
      <div className="bg-card border border-border rounded-lg shadow-enterprise-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Generate Certificates</h2>
            <p className="text-sm text-muted-foreground">Step {step} of 3</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {[
              { id: 1, title: 'Select Employees', icon: 'Users' },
              { id: 2, title: 'Choose Course', icon: 'BookOpen' },
              { id: 3, title: 'Configure Settings', icon: 'Settings' }
            ].map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= stepItem.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-border text-muted-foreground'
                }`}>
                  {step > stepItem.id ? (
                    <Icon name="Check" size={14} />
                  ) : (
                    <Icon name={stepItem.icon} size={14} />
                  )}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className={`text-xs font-medium ${
                    step >= stepItem.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {stepItem.title}
                  </p>
                </div>
                {index < 2 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    step > stepItem.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={step === 1 ? handleClose : handlePrevious}
            disabled={isGenerating}
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={handleClose} disabled={isGenerating}>
              Cancel
            </Button>
            {step === 3 ? (
              <Button
                variant="default"
                onClick={handleGenerate}
                disabled={isGenerating || selectedEmployees.length === 0 || !selectedCourse}
                iconName={isGenerating ? "Loader2" : "Award"}
                iconPosition="left"
                className={isGenerating ? "animate-spin" : ""}
              >
                {isGenerating ? 'Generating...' : 'Generate Certificates'}
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleNext}
                disabled={
                  (step === 1 && selectedEmployees.length === 0) ||
                  (step === 2 && !selectedCourse)
                }
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

export default CertificateGenerationModal;
