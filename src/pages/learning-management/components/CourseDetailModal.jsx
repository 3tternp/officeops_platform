import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { Badge } from '../../../components/ui/Badge';
import dataService from '../../../services/DataService';
import { useUser } from '../../../contexts/UserContext';

const CourseDetailModal = ({ course, isOpen, onClose, onEdit, onAssign, onTakeQuiz, canEdit = false, canAssign = false }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { currentUser } = useUser();

  if (!isOpen || !course) return null;

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video': return 'Play';
      case 'pdf': return 'FileText';
      case 'quiz': return 'HelpCircle';
      case 'scorm': return 'Package';
      default: return 'BookOpen';
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'content', label: 'Content', icon: 'BookOpen' },
    { id: 'progress', label: 'Progress', icon: 'BarChart3' },
    { id: 'assignments', label: 'Assignments', icon: 'Users' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Course Header */}
            <div className="flex items-start space-x-4">
              <Image
                src={course.thumbnail}
                alt={course.title}
                className="w-32 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">{course.title}</h2>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <div className="flex items-center space-x-4">
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={16} className="text-yellow-500 fill-current" />
                    <span className="text-sm">{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name={getContentTypeIcon(course.contentType)} size={16} />
                    <span className="text-sm capitalize">{course.contentType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <Icon name="Clock" size={24} className="mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{course.duration}</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <Icon name="Users" size={24} className="mx-auto mb-2 text-green-600" />
                <p className="text-sm text-muted-foreground">Enrolled</p>
                <p className="font-semibold">{course.enrolledCount}</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <Icon name="TrendingUp" size={24} className="mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="font-semibold">{course.completionRate}%</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <Icon name="Award" size={24} className="mx-auto mb-2 text-orange-600" />
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold capitalize">{course.status}</p>
              </div>
            </div>

            {/* Course Tags */}
            <div>
              <h3 className="font-semibold mb-3">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <h3 className="font-semibold mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-green-600 mt-1" />
                  <span className="text-sm">Understand key concepts and principles</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-green-600 mt-1" />
                  <span className="text-sm">Apply knowledge to real-world scenarios</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-green-600 mt-1" />
                  <span className="text-sm">Pass assessment with minimum 80% score</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-green-600 mt-1" />
                  <span className="text-sm">Obtain completion certificate</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            <h3 className="font-semibold">Course Content</h3>
            <div className="space-y-4">
              {(() => {
                const moduleDefinitions = course?.content?.modules || [];
                const moduleCount = course?.content?.modules?.length || course?.settings?.moduleCount || 4;
                const passingScore = course?.settings?.passingScore ?? 80;
                dataService.initializeCourseModuleProgress(currentUser?.id, course.id, moduleCount, passingScore);
                const cp = dataService.getCourseModuleProgress(currentUser?.id, course.id);
                const modules = Array.from({ length: moduleCount }, (_, idx) => {
                  const m = cp?.modules?.[idx] || { index: idx, unlocked: idx === 0, passed: false };
                  const definition = moduleDefinitions?.[idx];
                  return { ...m, definition };
                });
                return modules.map((mod, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{mod.definition?.title || `Module ${index + 1}: ${course.title}`}</h4>
                        {mod.definition?.aiGenerated && (
                          <Badge variant="outline" className="text-xs">
                            <Icon name="Sparkles" size={12} className="mr-1" />
                            AI-generated
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {mod.passed ? (
                          <Badge variant="secondary">
                            <Icon name="CheckCircle" size={12} className="mr-1 text-green-600" />
                            Passed
                          </Badge>
                        ) : mod.unlocked ? (
                          <Badge variant="outline">
                            <Icon name="Unlock" size={12} className="mr-1" />
                            Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Icon name="Lock" size={12} className="mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {mod.definition?.aiGeneratedSummary || 'Complete module content and pass the quiz to unlock the next module.'}
                    </p>
                    {mod.definition?.objective && (
                      <p className="text-sm text-foreground mb-3">{mod.definition.objective}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                      {mod.definition?.estimatedDuration && (
                        <span className="inline-flex items-center gap-1">
                          <Icon name="Clock" size={12} />
                          {mod.definition.estimatedDuration}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Icon name="HelpCircle" size={12} />
                        {mod.definition?.quiz?.questions?.length || course.content?.quizzes?.length || 0} Questions
                      </span>
                    </div>
                    {mod.definition?.resources?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {mod.definition.resources.map((res, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs capitalize">
                            <Icon name="FileText" size={12} className="mr-1" />
                            {res.title}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Icon name="Video" size={12} />
                          <span>3 Videos</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Icon name="FileText" size={12} />
                          <span>2 Documents</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Icon name="HelpCircle" size={12} />
                          <span>Quiz</span>
                        </div>
                      </div>
                      <Button
                        variant={mod.unlocked ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onTakeQuiz && mod.unlocked ? onTakeQuiz(course, index) : undefined}
                        disabled={!mod.unlocked}
                        iconName="HelpCircle"
                      >
                        {mod.passed ? 'Completed' : 'Take Quiz'}
                      </Button>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            <h3 className="font-semibold">Progress Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Completion Rate</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{course.completionRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Enrollment Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Enrolled:</span>
                    <span className="font-medium">{course.enrolledCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">{Math.round(course.enrolledCount * (course.completionRate / 100))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress:</span>
                    <span className="font-medium">{course.enrolledCount - Math.round(course.enrolledCount * (course.completionRate / 100))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Course Assignments</h3>
              {canAssign && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAssign(course)}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Create Assignment
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {[1, 2].map((assignment, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Assignment #{assignment}</h4>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Assigned to Human Resources department
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>Due: Dec 31, 2024</span>
                    <span>•</span>
                    <span>12/15 completed</span>
                    <span>•</span>
                    <span className="text-orange-600">3 pending</span>
                  </div>
                </div>
              ))}
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
            <h1 className="text-xl font-semibold text-foreground">Course Details</h1>
            <p className="text-sm text-muted-foreground">View and manage course information</p>
          </div>
        <div className="flex items-center space-x-2">
            {canEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(course)} iconName="Edit">
                Edit
              </Button>
            )}
            {canAssign && (
              <Button variant="outline" size="sm" onClick={() => onAssign(course)} iconName="UserPlus">
                Assign
              </Button>
            )}

          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>
        </div>

        <div className="flex h-[calc(90vh-8rem)]">
          {/* Tab Navigation */}
          <div className="w-64 border-r border-border p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;
