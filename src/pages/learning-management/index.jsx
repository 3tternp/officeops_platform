import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { hasPermission, PERMISSIONS, getRolePermissions, hasAnyPermission } from '../../utils/permissions';
import { useUser } from '../../contexts/UserContext';

// Import components
import CourseCard from './components/CourseCard';
import CourseFilters from './components/CourseFilters';
import AssignmentPanel from './components/AssignmentPanel';
import ProgressDashboard from './components/ProgressDashboard';
import CertificateManager from './components/CertificateManager';
import CourseCreationWizard from './components/CourseCreationWizard';
import SCORMContentWizard from './components/SCORMContentWizard';
import SCORMPackageManager from './components/SCORMPackageManager';
import SCORMPlayer from './components/SCORMPlayer';
import CourseDetailModal from './components/CourseDetailModal';
import QuizModal from './components/QuizModal';

const LearningManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
  const [showAssignmentPanel, setShowAssignmentPanel] = useState(false);
  const [showCourseWizard, setShowCourseWizard] = useState(false);
  const [showSCORMWizard, setShowSCORMWizard] = useState(false);
  const [showSCORMManager, setShowSCORMManager] = useState(false);
  const [showSCORMPlayer, setShowSCORMPlayer] = useState(false);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [showCourseEditWizard, setShowCourseEditWizard] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [selectedSCORMPackage, setSelectedSCORMPackage] = useState(null);
  const { currentUser } = useUser();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizCourse, setQuizCourse] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    contentType: 'all',
    difficulty: 'all',
    status: 'all',
    sortBy: 'title'
  });

  // Debug user permissions
  useEffect(() => {
    if (currentUser) {
      console.log('🏋️ Learning Management - Current User:', currentUser);
      console.log('- Role:', currentUser.role);
      console.log('- LMS_CREATE_COURSE:', hasPermission(currentUser.role, PERMISSIONS.LMS_CREATE_COURSE));
      console.log('- DATA_EXPORT:', hasPermission(currentUser.role, PERMISSIONS.DATA_EXPORT));
    }
  }, [currentUser]);

  // Initial mock courses data
  const initialMockCourses = [
    {
      id: 'course001',
      title: 'Data Privacy and GDPR Compliance',
      description: 'Comprehensive training on data protection regulations, privacy principles, and compliance requirements for handling personal data in the workplace.',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
      contentType: 'video',
      difficulty: 'intermediate',
      duration: '2.5 hours',
      rating: 4.8,
      enrolledCount: 234,
      completionRate: 87,
      tags: ['compliance', 'privacy', 'gdpr', 'mandatory'],
      isNew: true,
      department: 'all',
      status: 'active',
      createdDate: '2024-01-01T00:00:00Z'
    },
    {
      id: 'course002',
      title: 'Cybersecurity Awareness Training',
      description: 'Essential cybersecurity practices, threat recognition, and incident response procedures to protect organizational assets and data.',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
      contentType: 'mixed',
      difficulty: 'beginner',
      duration: '1.5 hours',
      rating: 4.6,
      enrolledCount: 456,
      completionRate: 92,
      tags: ['security', 'awareness', 'mandatory', 'it'],
      isNew: false,
      department: 'all',
      status: 'active',
      createdDate: '2024-01-15T00:00:00Z'
    },
    {
      id: 'course003',
      title: 'Project Management Fundamentals',
      description: 'Learn core project management principles, methodologies, and tools to successfully plan, execute, and deliver projects on time and within budget.',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      contentType: 'scorm',
      difficulty: 'intermediate',
      duration: '4 hours',
      rating: 4.7,
      enrolledCount: 189,
      completionRate: 78,
      tags: ['management', 'planning', 'leadership', 'skills'],
      isNew: false,
      department: 'all',
      status: 'active',
      createdDate: '2024-02-01T00:00:00Z'
    },
    {
      id: 'course004',
      title: 'Financial Compliance and Ethics',
      description: 'Understanding financial regulations, ethical standards, and compliance requirements in financial reporting and business operations.',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      contentType: 'pdf',
      difficulty: 'advanced',
      duration: '3 hours',
      rating: 4.5,
      enrolledCount: 123,
      completionRate: 85,
      tags: ['finance', 'compliance', 'ethics', 'reporting'],
      isNew: false,
      department: 'finance',
      status: 'active',
      createdDate: '2024-02-15T00:00:00Z'
    },
    {
      id: 'course005',
      title: 'Customer Service Excellence',
      description: 'Develop exceptional customer service skills, communication techniques, and problem-solving strategies to enhance customer satisfaction.',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      contentType: 'video',
      difficulty: 'beginner',
      duration: '2 hours',
      rating: 4.9,
      enrolledCount: 312,
      completionRate: 94,
      tags: ['customer service', 'communication', 'soft skills'],
      isNew: true,
      department: 'all',
      status: 'active',
      createdDate: '2024-03-01T00:00:00Z'
    },
    {
      id: 'course006',
      title: 'Leadership and Team Management',
      description: 'Advanced leadership strategies, team building techniques, and management skills for effective team leadership and organizational success.',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      contentType: 'mixed',
      difficulty: 'advanced',
      duration: '5 hours',
      rating: 4.8,
      enrolledCount: 167,
      completionRate: 82,
      tags: ['leadership', 'management', 'team building', 'skills'],
      isNew: false,
      department: 'all',
      status: 'active',
      createdDate: '2024-03-15T00:00:00Z'
    }
  ];

  // State for managing courses
  const [courses, setCourses] = useState([]);

  // Load courses from localStorage or use initial mock data
  useEffect(() => {
    const savedCourses = localStorage.getItem('lms_courses');
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (error) {
        console.error('Error loading saved courses:', error);
        setCourses(initialMockCourses);
        localStorage.setItem('lms_courses', JSON.stringify(initialMockCourses));
      }
    } else {
      setCourses(initialMockCourses);
      localStorage.setItem('lms_courses', JSON.stringify(initialMockCourses));
    }
  }, []);

  // Filter tabs based on user permissions
  const allTabs = [
    { id: 'courses', label: 'Courses', icon: 'BookOpen', count: courses?.length, requiredPermissions: [PERMISSIONS.LMS_VIEW_COURSE] },
    { id: 'assignments', label: 'Assignments', icon: 'UserPlus', count: 45, requiredPermissions: [PERMISSIONS.LMS_ASSIGN_COURSE] },
    { id: 'progress', label: 'Progress Tracking', icon: 'BarChart3', count: null, requiredPermissions: [PERMISSIONS.LMS_VIEW_PROGRESS] },
    { id: 'certificates', label: 'Certificates', icon: 'Award', count: 892, requiredPermissions: [PERMISSIONS.LMS_VIEW_COURSE] }
  ];

  const tabs = allTabs.filter(tab => {
    return tab.requiredPermissions.some(permission => hasPermission(currentUser?.role, permission));
  });

  // Filter courses based on current filters
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = !filters?.search || 
      course?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      course?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      course?.tags?.some(tag => tag?.toLowerCase()?.includes(filters?.search?.toLowerCase()));
    
    const matchesDepartment = filters?.department === 'all' || 
      course?.department === filters?.department;
    
    const matchesContentType = filters?.contentType === 'all' || 
      course?.contentType === filters?.contentType;
    
    const matchesDifficulty = filters?.difficulty === 'all' || 
      course?.difficulty === filters?.difficulty;
    
    const matchesStatus = filters?.status === 'all' || 
      course?.status === filters?.status;

    return matchesSearch && matchesDepartment && matchesContentType && 
           matchesDifficulty && matchesStatus;
  });

  // Sort filtered courses
  const sortedCourses = [...filteredCourses]?.sort((a, b) => {
    switch (filters?.sortBy) {
      case 'title':
        return a?.title?.localeCompare(b?.title);
      case 'title_desc':
        return b?.title?.localeCompare(a?.title);
      case 'created_date':
        return new Date(b.createdDate || '2024-01-01') - new Date(a.createdDate || '2024-01-01');
      case 'created_date_desc':
        return new Date(a.createdDate || '2024-01-01') - new Date(b.createdDate || '2024-01-01');
      case 'completion_rate':
        return b?.completionRate - a?.completionRate;
      case 'completion_rate_desc':
        return a?.completionRate - b?.completionRate;
      case 'enrolled_count':
        return b?.enrolledCount - a?.enrolledCount;
      case 'rating':
        return b?.rating - a?.rating;
      default:
        return 0;
    }
  });

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileSidebarClose = () => {
    setSidebarMobileOpen(false);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      department: 'all',
      contentType: 'all',
      difficulty: 'all',
      status: 'all',
      sortBy: 'title'
    });
  };

  const handleCreateCourse = () => {
    setShowCourseWizard(true);
  };

  const handleCreateSCORMCourse = () => {
    setShowSCORMWizard(true);
  };

  const handleSCORMManager = () => {
    setShowSCORMManager(true);
  };

  const handlePlaySCORM = (packageData) => {
    setSelectedSCORMPackage(packageData);
    setShowSCORMPlayer(true);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const handleEditCourse = (course) => {
    console.log('Editing course:', course);
    setCourseToEdit(course);
    setShowCourseEditWizard(true);
  };

  const handleUpdateCourse = (updatedCourseData) => {
    try {
      // Find the course to update and replace it
      const updatedCourses = courses.map(course => {
        if (course.id === courseToEdit.id) {
          return {
            ...course,
            title: updatedCourseData.title,
            description: updatedCourseData.description,
            thumbnail: updatedCourseData.thumbnail?.url || course.thumbnail,
            contentType: updatedCourseData.contentType,
            difficulty: updatedCourseData.difficulty,
            duration: updatedCourseData.duration,
            category: updatedCourseData.category,
            tags: updatedCourseData.tags || [],
            department: updatedCourseData.targetDepartments?.length > 0 ? updatedCourseData.targetDepartments[0] : 'all',
            status: updatedCourseData.isActive ? 'active' : 'draft',
            content: updatedCourseData.content || course.content,
            settings: {
              allowRetakes: updatedCourseData.allowRetakes,
              passingScore: updatedCourseData.passingScore,
              certificateEnabled: updatedCourseData.certificateEnabled,
              prerequisites: updatedCourseData.prerequisites || [],
              targetRoles: updatedCourseData.targetRoles || []
            },
            updatedDate: new Date().toISOString(),
            updatedBy: currentUser?.name || 'System'
          };
        }
        return course;
      });
      
      setCourses(updatedCourses);
      
      // Save to localStorage for persistence
      localStorage.setItem('lms_courses', JSON.stringify(updatedCourses));
      
      console.log('Course updated successfully:', updatedCourseData.title);
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
            <h3 class="text-lg font-semibold text-foreground">Course Updated Successfully!</h3>
          </div>
          <p class="text-muted-foreground mb-6">Your course "${updatedCourseData.title}" has been updated with your changes.</p>
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
      console.error('Error updating course:', error);
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
            <h3 class="text-lg font-semibold text-foreground">Error Updating Course</h3>
          </div>
          <p class="text-muted-foreground mb-6">There was an error updating your course. Please try again.</p>
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
    
    setShowCourseEditWizard(false);
    setCourseToEdit(null);
  };

  const handleDeleteCourse = (courseToDelete) => {
    try {
      // Remove the course from the courses list
      const updatedCourses = courses.filter(course => course.id !== courseToDelete.id);
      setCourses(updatedCourses);
      
      // Save to localStorage for persistence
      localStorage.setItem('lms_courses', JSON.stringify(updatedCourses));
      
      console.log('Course deleted successfully:', courseToDelete.title);
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
            <h3 class="text-lg font-semibold text-foreground">Course Deleted</h3>
          </div>
          <p class="text-muted-foreground mb-6">Course "${courseToDelete.title}" has been deleted successfully.</p>
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
      console.error('Error deleting course:', error);
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
            <h3 class="text-lg font-semibold text-foreground">Error Deleting Course</h3>
          </div>
          <p class="text-muted-foreground mb-6">There was an error deleting the course. Please try again.</p>
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

  const handleAssignCourse = (course) => {
    setSelectedCourses([course]);
    setShowAssignmentPanel(true);
  };

  const handleBulkAssignment = () => {
    setShowAssignmentPanel(true);
  };

  const handleAssignmentSubmit = (assignmentData) => {
    console.log('Assignment data:', assignmentData);
    setShowAssignmentPanel(false);
    setSelectedCourses([]);
  };

  const handleSaveCourse = (courseData) => {
    console.log('Saving course:', courseData);
    
    try {
      // Generate a unique ID for the new course
      const newCourseId = `course${String(Date.now()).slice(-6)}`;
      
      // Create the course object with required fields
      const newCourse = {
        id: newCourseId,
        title: courseData.title,
        description: courseData.description,
        thumbnail: courseData.thumbnail?.url || null,
        contentType: courseData.contentType,
        difficulty: courseData.difficulty,
        duration: courseData.duration,
        category: courseData.category,
        tags: courseData.tags || [],
        department: courseData.targetDepartments?.length > 0 ? courseData.targetDepartments[0] : 'all',
        status: courseData.isActive ? 'active' : 'draft',
        rating: 0, // New courses start with no rating
        enrolledCount: 0, // New courses start with no enrollments
        completionRate: 0, // New courses start with 0% completion
        isNew: true,
        createdDate: new Date().toISOString(),
        createdBy: currentUser?.name || 'System',
        content: courseData.content || {},
        settings: {
          allowRetakes: courseData.allowRetakes,
          passingScore: courseData.passingScore,
          certificateEnabled: courseData.certificateEnabled,
          prerequisites: courseData.prerequisites || [],
          targetRoles: courseData.targetRoles || []
        }
      };
      
      // Add the new course to the courses list
      const updatedCourses = [newCourse, ...courses];
      setCourses(updatedCourses);
      
      // Save to localStorage for persistence
      localStorage.setItem('lms_courses', JSON.stringify(updatedCourses));
      
      console.log('Course saved successfully:', newCourse);
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
            <h3 class="text-lg font-semibold text-foreground">Course Created Successfully!</h3>
          </div>
          <p class="text-muted-foreground mb-6">Your course "${newCourse.title}" has been created and is ready to use.</p>
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
      console.error('Error saving course:', error);
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
    
    setShowCourseWizard(false);
  };

  const handleSaveSCORMCourse = (courseData) => {
    console.log('Saving SCORM course:', courseData);
    
    try {
      // Generate a unique ID for the new SCORM course
      const newCourseId = `scorm${String(Date.now()).slice(-6)}`;
      
      // Create the SCORM course object
      const newSCORMCourse = {
        id: newCourseId,
        title: courseData.title,
        description: courseData.description,
        thumbnail: courseData.thumbnail?.url || null,
        contentType: 'scorm',
        difficulty: courseData.difficulty || 'intermediate',
        duration: courseData.duration || 'Variable',
        category: courseData.category || 'technical',
        tags: courseData.tags || ['scorm'],
        department: courseData.targetDepartments?.length > 0 ? courseData.targetDepartments[0] : 'all',
        status: courseData.isActive ? 'active' : 'draft',
        rating: 0,
        enrolledCount: 0,
        completionRate: 0,
        isNew: true,
        createdDate: new Date().toISOString(),
        createdBy: currentUser?.name || 'System',
        scormPackage: courseData.scormPackage || null,
        content: courseData.content || {}
      };
      
      // Add the new SCORM course to the courses list
      const updatedCourses = [newSCORMCourse, ...courses];
      setCourses(updatedCourses);
      
      // Save to localStorage for persistence
      localStorage.setItem('lms_courses', JSON.stringify(updatedCourses));
      
      console.log('SCORM course saved successfully:', newSCORMCourse);
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
            <h3 class="text-lg font-semibold text-foreground">SCORM Course Created!</h3>
          </div>
          <p class="text-muted-foreground mb-6">Your SCORM course "${newSCORMCourse.title}" has been created successfully.</p>
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
      console.error('Error saving SCORM course:', error);
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
            <h3 class="text-lg font-semibold text-foreground">Error Creating SCORM Course</h3>
          </div>
          <p class="text-muted-foreground mb-6">There was an error creating your SCORM course. Please try again.</p>
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
    
    setShowSCORMWizard(false);
  };

  const handleSCORMComplete = (completionData) => {
    console.log('SCORM course completed:', completionData);
    setShowSCORMPlayer(false);
    setSelectedSCORMPackage(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-6">
            <CourseFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              onCreateCourse={handleCreateCourse}
              totalCourses={courses?.length}
              filteredCount={sortedCourses?.length}
              currentUser={currentUser}
            />
            {/* Bulk Actions */}
            {sortedCourses?.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {sortedCourses?.length} of {courses?.length} courses
                </p>
                {hasPermission(currentUser?.role, PERMISSIONS.LMS_ASSIGN_COURSE) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkAssignment}
                    iconName="Send"
                    iconPosition="left"
                  >
                    Bulk Assignment
                  </Button>
                )}
              </div>
            )}
            {/* Course Grid */}
            {sortedCourses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses?.map((course) => (
                  <CourseCard
                    key={course?.id}
                    course={course}
                    onView={handleViewCourse}
                    onEdit={handleEditCourse}
                    onAssign={handleAssignCourse}
                    onDelete={handleDeleteCourse}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="BookOpen" size={64} className="text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-6">
                  {filters?.search || filters?.department !== 'all' || filters?.contentType !== 'all' ?'Try adjusting your filters to see more courses' : hasPermission(currentUser?.role, PERMISSIONS.LMS_CREATE_COURSE) ? 'Get started by creating your first course' : 'No courses are available at this time'
                  }
                </p>
                {hasPermission(currentUser?.role, PERMISSIONS.LMS_CREATE_COURSE) && (
                  <Button variant="default" onClick={handleCreateCourse} iconName="Plus" iconPosition="left">
                    Create Course
                  </Button>
                )}
              </div>
            )}
          </div>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Icon name="UserPlus" size={64} className="text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Assignment Management</h3>
              <p className="text-muted-foreground mb-6">
                Manage course assignments, track progress, and monitor completion status
              </p>
              {hasPermission(currentUser?.role, PERMISSIONS.LMS_ASSIGN_COURSE) && (
                <Button variant="default" onClick={handleBulkAssignment} iconName="Send" iconPosition="left">
                  Create New Assignment
                </Button>
              )}
            </div>
          </div>
        );

      case 'progress':
        return <ProgressDashboard />;

      case 'certificates':
        return <CertificateManager />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={sidebarMobileOpen}
        onMobileClose={handleMobileSidebarClose}
      />
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Learning Management</h1>
                <p className="text-muted-foreground mt-2">
                  Create, assign, and track educational content across your organization
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Debug: Log permission check results */}
                {(() => {
                  const exportAllowed = hasPermission(currentUser?.role, PERMISSIONS.DATA_EXPORT);
                  const createAllowed = hasPermission(currentUser?.role, PERMISSIONS.LMS_CREATE_COURSE);
                  console.log('🔍 RENDER CHECK:', {
                    role: currentUser?.role,
                    exportAllowed,
                    createAllowed,
                    timestamp: new Date().toLocaleTimeString()
                  });
                  return null;
                })()}
                
                {hasPermission(currentUser?.role, PERMISSIONS.DATA_EXPORT) && (
                  <Button variant="outline" iconName="Download" iconPosition="left">
                    Export Data
                  </Button>
                )}
                {hasPermission(currentUser?.role, PERMISSIONS.LMS_CREATE_COURSE) && (
                  <div className="flex space-x-2">
                    <Button variant="default" onClick={handleCreateCourse} iconName="Plus" iconPosition="left">
                      Create Course
                    </Button>
                    <Button variant="outline" onClick={handleCreateSCORMCourse} iconName="Package" iconPosition="left">
                      SCORM Creator
                    </Button>
                    <Button variant="ghost" onClick={handleSCORMManager} iconName="FolderOpen" iconPosition="left">
                      SCORM Manager
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                    {tab?.count !== null && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        activeTab === tab?.id
                          ? 'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
                      }`}>
                        {tab?.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>
      {/* Modals */}
      {showAssignmentPanel && (
        <AssignmentPanel
          courses={selectedCourses?.length > 0 ? selectedCourses : courses}
          onAssign={handleAssignmentSubmit}
          onClose={() => {
            setShowAssignmentPanel(false);
            setSelectedCourses([]);
          }}
        />
      )}
      {showCourseWizard && (
        <CourseCreationWizard
          onSave={handleSaveCourse}
          onClose={() => setShowCourseWizard(false)}
        />
      )}
      {showCourseEditWizard && courseToEdit && (
        <CourseCreationWizard
          initialData={{
            title: courseToEdit.title,
            description: courseToEdit.description,
            category: courseToEdit.category,
            difficulty: courseToEdit.difficulty,
            duration: courseToEdit.duration,
            contentType: courseToEdit.contentType,
            tags: courseToEdit.tags || [],
            targetDepartments: courseToEdit.department === 'all' ? [] : [courseToEdit.department],
            targetRoles: courseToEdit.settings?.targetRoles || [],
            isActive: courseToEdit.status === 'active',
            allowRetakes: courseToEdit.settings?.allowRetakes || true,
            passingScore: courseToEdit.settings?.passingScore || 80,
            certificateEnabled: courseToEdit.settings?.certificateEnabled || false,
            prerequisites: courseToEdit.settings?.prerequisites || [],
            content: courseToEdit.content || {},
            thumbnail: courseToEdit.thumbnail ? { url: courseToEdit.thumbnail } : null
          }}
          isEditing={true}
          onSave={handleUpdateCourse}
          onClose={() => {
            setShowCourseEditWizard(false);
            setCourseToEdit(null);
          }}
        />
      )}
      {showSCORMWizard && (
        <SCORMContentWizard
          onSave={handleSaveSCORMCourse}
          onClose={() => setShowSCORMWizard(false)}
        />
      )}
      {showSCORMManager && (
        <SCORMPackageManager
          onClose={() => setShowSCORMManager(false)}
          onDeploy={handlePlaySCORM}
        />
      )}
      {showSCORMPlayer && selectedSCORMPackage && (
        <SCORMPlayer
          packageData={selectedSCORMPackage}
          onClose={() => setShowSCORMPlayer(false)}
          onComplete={handleSCORMComplete}
        />
      )}
      {showCourseDetail && selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          isOpen={showCourseDetail}
          onClose={() => {
            setShowCourseDetail(false);
            setSelectedCourse(null);
          }}
          onEdit={handleEditCourse}
          onAssign={handleAssignCourse}
          canEdit={hasAnyPermission(currentUser?.role, [PERMISSIONS.LMS_CREATE_COURSE, PERMISSIONS.LMS_MANAGE_ALL])}
          canAssign={hasAnyPermission(currentUser?.role, [PERMISSIONS.LMS_ASSIGN_COURSE, PERMISSIONS.LMS_MANAGE_ALL])}
          onTakeQuiz={hasPermission(currentUser?.role, PERMISSIONS.LMS_TAKE_QUIZ) ? ((course) => {
            setQuizCourse(course);
            setShowQuizModal(true);
          }) : undefined}
        />
      )}
      {showQuizModal && quizCourse && (
        <QuizModal
          course={quizCourse}
          isOpen={showQuizModal}
          onClose={() => {
            setShowQuizModal(false);
            setQuizCourse(null);
          }}
        />
      )}
    </div>
  );
};

export default LearningManagement;
