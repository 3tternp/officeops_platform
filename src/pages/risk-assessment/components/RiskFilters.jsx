import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RiskFilters = ({ onFiltersChange, totalRisks = 0 }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    owner: '',
    status: '',
    treatmentStatus: '',
    riskLevel: '',
    dateRange: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    'Operational',
    'Financial',
    'Strategic',
    'Compliance',
    'Technology',
    'Reputational',
    'Environmental',
    'Legal'
  ];

  const statuses = [
    'Open',
    'In Progress',
    'Under Review',
    'Closed'
  ];

  const treatmentStatuses = [
    'Not Started',
    'In Progress',
    'Completed',
    'Overdue'
  ];

  const riskLevels = [
    { value: 'critical', label: 'Critical (20-25)', color: 'bg-red-600' },
    { value: 'high', label: 'High (15-19)', color: 'bg-red-500' },
    { value: 'medium', label: 'Medium (10-14)', color: 'bg-yellow-500' },
    { value: 'low', label: 'Low (5-9)', color: 'bg-yellow-400' },
    { value: 'very-low', label: 'Very Low (1-4)', color: 'bg-green-500' }
  ];

  const owners = [
    'Sarah Johnson',
    'Michael Chen',
    'Emily Rodriguez',
    'David Thompson',
    'Lisa Anderson',
    'James Wilson'
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange && onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      owner: '',
      status: '',
      treatmentStatus: '',
      riskLevel: '',
      dateRange: ''
    };
    setFilters(clearedFilters);
    onFiltersChange && onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');
  const activeFilterCount = Object.values(filters)?.filter(value => value !== '')?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Risk Filters</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {totalRisks} risk{totalRisks !== 1 ? 's' : ''} found
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} className="mr-2" />
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search risks by title, description, or ID..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="pl-10"
          />
        </div>
      </div>
      {/* Quick Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            value={filters?.category}
            onChange={(e) => handleFilterChange('category', e?.target?.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Categories</option>
            {categories?.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={filters?.status}
            onChange={(e) => handleFilterChange('status', e?.target?.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Statuses</option>
            {statuses?.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Risk Level</label>
          <select
            value={filters?.riskLevel}
            onChange={(e) => handleFilterChange('riskLevel', e?.target?.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Levels</option>
            {riskLevels?.map(level => (
              <option key={level?.value} value={level?.value}>{level?.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Owner</label>
          <select
            value={filters?.owner}
            onChange={(e) => handleFilterChange('owner', e?.target?.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Owners</option>
            {owners?.map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Treatment</label>
          <select
            value={filters?.treatmentStatus}
            onChange={(e) => handleFilterChange('treatmentStatus', e?.target?.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Treatments</option>
            {treatmentStatuses?.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Assessment Date Range</label>
              <select
                value={filters?.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e?.target?.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="overdue">Overdue Reviews</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Risk Score Range</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min="1"
                  max="25"
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  min="1"
                  max="25"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Has Treatment Plan</label>
              <select className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">All Risks</option>
                <option value="yes">With Treatment Plan</option>
                <option value="no">Without Treatment Plan</option>
              </select>
            </div>
          </div>

          {/* Risk Level Visual Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground mb-2">Filter by Risk Level</label>
            <div className="flex flex-wrap gap-2">
              {riskLevels?.map(level => (
                <button
                  key={level?.value}
                  onClick={() => handleFilterChange('riskLevel', filters?.riskLevel === level?.value ? '' : level?.value)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                    filters?.riskLevel === level?.value
                      ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  <div className={`w-3 h-3 rounded ${level?.color}`}></div>
                  <span className="text-sm">{level?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Filter Actions */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={16} />
            <span>Active filters applied</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <Icon name="X" size={16} className="mr-2" />
              Clear All
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Save" size={16} className="mr-2" />
              Save Filter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskFilters;