import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AssetFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  onToggleView,
  viewMode = 'grid'
}) => {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'laptop', label: 'Laptops' },
    { value: 'desktop', label: 'Desktops' },
    { value: 'monitor', label: 'Monitors' },
    { value: 'phone', label: 'Phones' },
    { value: 'tablet', label: 'Tablets' },
    { value: 'printer', label: 'Printers' },
    { value: 'camera', label: 'Cameras' },
    { value: 'projector', label: 'Projectors' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'retired', label: 'Retired' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'headquarters', label: 'Headquarters' },
    { value: 'branch-office-1', label: 'Branch Office 1' },
    { value: 'branch-office-2', label: 'Branch Office 2' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'remote', label: 'Remote' }
  ];

  const conditionOptions = [
    { value: '', label: 'All Conditions' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={20} />
          <span>Filters</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToggleView('grid')}
              iconName="Grid3X3"
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToggleView('list')}
              iconName="List"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search assets..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <Select
          placeholder="Category"
          options={categoryOptions}
          value={filters?.category || ''}
          onChange={(value) => handleFilterChange('category', value)}
        />

        {/* Status Filter */}
        <Select
          placeholder="Status"
          options={statusOptions}
          value={filters?.status || ''}
          onChange={(value) => handleFilterChange('status', value)}
        />

        {/* Location Filter */}
        <Select
          placeholder="Location"
          options={locationOptions}
          value={filters?.location || ''}
          onChange={(value) => handleFilterChange('location', value)}
        />

        {/* Condition Filter */}
        <Select
          placeholder="Condition"
          options={conditionOptions}
          value={filters?.condition || ''}
          onChange={(value) => handleFilterChange('condition', value)}
        />
      </div>
      {/* Advanced Filters Toggle */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Quick Filters:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange('status', 'available')}
              className="h-auto p-1"
            >
              Available Only
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange('status', 'assigned')}
              className="h-auto p-1"
            >
              Assigned Only
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange('status', 'maintenance')}
              className="h-auto p-1"
            >
              In Maintenance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetFilters;