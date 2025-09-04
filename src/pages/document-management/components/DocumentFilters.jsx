import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DocumentFilters = ({ filters, onFiltersChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const documentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'policy', label: 'Policy' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'handbook', label: 'Handbook' },
    { value: 'form', label: 'Form' },
    { value: 'contract', label: 'Contract' }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'Information Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'legal', label: 'Legal' },
    { value: 'operations', label: 'Operations' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'expired', label: 'Expired' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const sortOptions = [
    { value: 'title', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.search) count++;
    if (filters?.type !== 'all') count++;
    if (filters?.department !== 'all') count++;
    if (filters?.status !== 'all') count++;
    if (filters?.priority !== 'all') count++;
    if (filters?.dateFrom || filters?.dateTo) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card border border-border rounded-lg shadow-enterprise">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="p-4 border-b border-border">
        <Input
          type="search"
          placeholder="Search documents by title, content, or tags..."
          value={filters?.search || ''}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Expandable Filters */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Quick Filters Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Document Type"
              options={documentTypes}
              value={filters?.type || 'all'}
              onChange={(value) => handleFilterChange('type', value)}
            />
            
            <Select
              label="Department"
              options={departments}
              value={filters?.department || 'all'}
              onChange={(value) => handleFilterChange('department', value)}
            />
            
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status || 'all'}
              onChange={(value) => handleFilterChange('status', value)}
            />
            
            <Select
              label="Priority"
              options={priorityOptions}
              value={filters?.priority || 'all'}
              onChange={(value) => handleFilterChange('priority', value)}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <Input
                type="date"
                label="Effective Date From"
                value={filters?.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
              />
            </div>
            <div className="lg:col-span-1">
              <Input
                type="date"
                label="Effective Date To"
                value={filters?.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
              />
            </div>
            <div className="lg:col-span-1">
              <Select
                label="Sort By"
                options={sortOptions}
                value={filters?.sortBy || 'date_desc'}
                onChange={(value) => handleFilterChange('sortBy', value)}
              />
            </div>
          </div>

          {/* Advanced Options */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requiresAcknowledgment"
                checked={filters?.requiresAcknowledgment || false}
                onChange={(e) => handleFilterChange('requiresAcknowledgment', e?.target?.checked)}
                className="rounded border-border"
              />
              <label htmlFor="requiresAcknowledgment" className="text-sm text-foreground">
                Requires Acknowledgment
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasESignature"
                checked={filters?.hasESignature || false}
                onChange={(e) => handleFilterChange('hasESignature', e?.target?.checked)}
                className="rounded border-border"
              />
              <label htmlFor="hasESignature" className="text-sm text-foreground">
                E-Signature Required
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="expiringSoon"
                checked={filters?.expiringSoon || false}
                onChange={(e) => handleFilterChange('expiringSoon', e?.target?.checked)}
                className="rounded border-border"
              />
              <label htmlFor="expiringSoon" className="text-sm text-foreground">
                Expiring Soon (30 days)
              </label>
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <Input
              type="text"
              label="Tags"
              placeholder="Enter tags separated by commas"
              value={filters?.tags || ''}
              onChange={(e) => handleFilterChange('tags', e?.target?.value)}
              description="Filter by document tags (comma-separated)"
            />
          </div>
        </div>
      )}
      {/* Quick Action Buttons */}
      <div className="flex items-center justify-between p-4 bg-muted/30 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant={filters?.status === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('status', filters?.status === 'pending' ? 'all' : 'pending')}
          >
            Pending Review
          </Button>
          <Button
            variant={filters?.status === 'overdue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('status', filters?.status === 'overdue' ? 'all' : 'overdue')}
          >
            Overdue
          </Button>
          <Button
            variant={filters?.expiringSoon ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('expiringSoon', !filters?.expiringSoon)}
          >
            Expiring Soon
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {filters?.resultCount || 0} documents found
        </div>
      </div>
    </div>
  );
};

export default DocumentFilters;