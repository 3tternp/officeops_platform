import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { hasPermission, PERMISSIONS } from '../../../utils/permissions';

const CourseFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  onCreateCourse,
  totalCourses,
  filteredCount,
  currentUser 
}) => {
  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'Information Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' },
    { value: 'sales', label: 'Sales' }
  ];

  const contentTypeOptions = [
    { value: 'all', label: 'All Content Types' },
    { value: 'video', label: 'Video' },
    { value: 'pdf', label: 'PDF Document' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'scorm', label: 'SCORM Package' }
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' }
  ];

  const sortOptions = [
    { value: 'title', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
    { value: 'created_date', label: 'Newest First' },
    { value: 'created_date_desc', label: 'Oldest First' },
    { value: 'completion_rate', label: 'Completion Rate High' },
    { value: 'completion_rate_desc', label: 'Completion Rate Low' },
    { value: 'enrolled_count', label: 'Most Enrolled' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = () => {
    return filters?.search || 
           filters?.department !== 'all' || 
           filters?.contentType !== 'all' || 
           filters?.difficulty !== 'all' || 
           filters?.status !== 'all';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Course Management</h2>
          <p className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalCourses} courses
          </p>
        </div>
        {hasPermission(currentUser?.role, PERMISSIONS.LMS_CREATE_COURSE) && (
          <Button
            variant="default"
            onClick={onCreateCourse}
            iconName="Plus"
            iconPosition="left"
          >
            Create Course
          </Button>
        )}
      </div>
      {/* Search and Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search courses by title, description, or tags..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="flex space-x-2">
          {hasPermission(currentUser?.role, PERMISSIONS.DATA_EXPORT) && (
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          )}
          {hasPermission(currentUser?.role, PERMISSIONS.LMS_UPLOAD_COURSE) && (
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              iconPosition="left"
            >
              Import
            </Button>
          )}
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <Select
          label="Department"
          options={departmentOptions}
          value={filters?.department}
          onChange={(value) => handleFilterChange('department', value)}
        />

        <Select
          label="Content Type"
          options={contentTypeOptions}
          value={filters?.contentType}
          onChange={(value) => handleFilterChange('contentType', value)}
        />

        <Select
          label="Difficulty"
          options={difficultyOptions}
          value={filters?.difficulty}
          onChange={(value) => handleFilterChange('difficulty', value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          label="Sort By"
          options={sortOptions}
          value={filters?.sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />
      </div>
      {/* Active Filters and Clear */}
      {hasActiveFilters() && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {filters?.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary">
                  Search: "{filters?.search}"
                </span>
              )}
              {filters?.department !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary">
                  {departmentOptions?.find(opt => opt?.value === filters?.department)?.label}
                </span>
              )}
              {filters?.contentType !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary">
                  {contentTypeOptions?.find(opt => opt?.value === filters?.contentType)?.label}
                </span>
              )}
              {filters?.difficulty !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary">
                  {difficultyOptions?.find(opt => opt?.value === filters?.difficulty)?.label}
                </span>
              )}
              {filters?.status !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary">
                  {statusOptions?.find(opt => opt?.value === filters?.status)?.label}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseFilters;