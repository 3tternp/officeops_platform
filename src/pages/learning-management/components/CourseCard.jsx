import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { hasPermission, PERMISSIONS } from '../../../utils/permissions';
import { useUser } from '../../../contexts/UserContext';

const CourseCard = ({ course, onView, onEdit, onAssign, onDelete }) => {
  const { currentUser } = useUser();
  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video': return 'Play';
      case 'pdf': return 'FileText';
      case 'quiz': return 'HelpCircle';
      case 'scorm': return 'Package';
      default: return 'BookOpen';
    }
  };

  const getContentTypeColor = (type) => {
    switch (type) {
      case 'video': return 'text-blue-600';
      case 'pdf': return 'text-red-600';
      case 'quiz': return 'text-green-600';
      case 'scorm': return 'text-purple-600';
      default: return 'text-gray-600';
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

  return (
    <div className="bg-card border border-border rounded-lg shadow-enterprise hover:shadow-enterprise-md transition-all duration-200 overflow-hidden group">
      {/* Course Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={course?.thumbnail}
          alt={course?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course?.difficulty)}`}>
            {course?.difficulty}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className={`p-2 bg-white/90 rounded-full ${getContentTypeColor(course?.contentType)}`}>
            <Icon name={getContentTypeIcon(course?.contentType)} size={16} />
          </div>
        </div>
        {course?.isNew && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              New
            </span>
          </div>
        )}
      </div>
      {/* Course Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {course?.title}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
            <span className="text-sm text-muted-foreground">{course?.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {course?.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{course?.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{course?.enrolledCount}</span>
            </div>
          </div>
          <div className="text-sm font-medium text-foreground">
            {course?.completionRate}% complete
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${course?.completionRate}%` }}
          />
        </div>

        {/* Course Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {course?.tags?.slice(0, 3)?.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {course?.tags?.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">
              +{course?.tags?.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onView(course)}
            className="flex-1"
            iconName="Eye"
            iconPosition="left"
          >
            View
          </Button>
          {hasPermission(currentUser?.role, PERMISSIONS.LMS_CREATE_COURSE) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(course)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit
            </Button>
          )}
          {hasPermission(currentUser?.role, PERMISSIONS.LMS_ASSIGN_COURSE) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAssign(course)}
              iconName="UserPlus"
              iconPosition="left"
            >
              Assign
            </Button>
          )}
          {/* Delete button - only for admin and ISO roles */}
          {(currentUser?.role === 'admin' || currentUser?.role === 'iso') && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete the course "${course?.title}"? This action cannot be undone.`)) {
                  onDelete(course);
                }
              }}
              className="text-error hover:text-error hover:bg-error/10"
              iconName="Trash2"
              iconPosition="left"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;