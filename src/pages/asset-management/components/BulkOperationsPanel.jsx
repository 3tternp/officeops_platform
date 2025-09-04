import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkOperationsPanel = ({ 
  selectedAssets, 
  onBulkOperation, 
  onClearSelection,
  isVisible 
}) => {
  const [operation, setOperation] = useState('');
  const [operationData, setOperationData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const operationOptions = [
    { value: '', label: 'Select Operation' },
    { value: 'update-status', label: 'Update Status' },
    { value: 'update-location', label: 'Update Location' },
    { value: 'update-condition', label: 'Update Condition' },
    { value: 'assign-category', label: 'Assign Category' },
    { value: 'bulk-maintenance', label: 'Schedule Maintenance' },
    { value: 'export-data', label: 'Export Data' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'retired', label: 'Retired' }
  ];

  const locationOptions = [
    { value: 'headquarters', label: 'Headquarters' },
    { value: 'branch-office-1', label: 'Branch Office 1' },
    { value: 'branch-office-2', label: 'Branch Office 2' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'remote', label: 'Remote' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const categoryOptions = [
    { value: 'laptop', label: 'Laptops' },
    { value: 'desktop', label: 'Desktops' },
    { value: 'monitor', label: 'Monitors' },
    { value: 'phone', label: 'Phones' },
    { value: 'tablet', label: 'Tablets' },
    { value: 'printer', label: 'Printers' },
    { value: 'other', label: 'Other' }
  ];

  const handleOperationChange = (value) => {
    setOperation(value);
    setOperationData({});
  };

  const handleDataChange = (field, value) => {
    setOperationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExecute = async () => {
    if (!operation || selectedAssets?.length === 0) return;

    setIsProcessing(true);
    try {
      await onBulkOperation({
        operation,
        assetIds: selectedAssets,
        data: operationData
      });
      
      // Reset form
      setOperation('');
      setOperationData({});
      onClearSelection();
    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderOperationFields = () => {
    switch (operation) {
      case 'update-status':
        return (
          <Select
            placeholder="Select new status"
            options={statusOptions}
            value={operationData?.status || ''}
            onChange={(value) => handleDataChange('status', value)}
          />
        );
      
      case 'update-location':
        return (
          <Select
            placeholder="Select new location"
            options={locationOptions}
            value={operationData?.location || ''}
            onChange={(value) => handleDataChange('location', value)}
          />
        );
      
      case 'update-condition':
        return (
          <Select
            placeholder="Select new condition"
            options={conditionOptions}
            value={operationData?.condition || ''}
            onChange={(value) => handleDataChange('condition', value)}
          />
        );
      
      case 'assign-category':
        return (
          <Select
            placeholder="Select category"
            options={categoryOptions}
            value={operationData?.category || ''}
            onChange={(value) => handleDataChange('category', value)}
          />
        );
      
      case 'bulk-maintenance':
        return (
          <div className="space-y-3">
            <input
              type="date"
              value={operationData?.maintenanceDate || ''}
              onChange={(e) => handleDataChange('maintenanceDate', e?.target?.value)}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              min={new Date()?.toISOString()?.split('T')?.[0]}
            />
            <textarea
              placeholder="Maintenance notes..."
              value={operationData?.notes || ''}
              onChange={(e) => handleDataChange('notes', e?.target?.value)}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={2}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const canExecute = () => {
    if (!operation || selectedAssets?.length === 0) return false;
    
    switch (operation) {
      case 'update-status':
        return operationData?.status;
      case 'update-location':
        return operationData?.location;
      case 'update-condition':
        return operationData?.condition;
      case 'assign-category':
        return operationData?.category;
      case 'bulk-maintenance':
        return operationData?.maintenanceDate;
      case 'export-data':
        return true;
      default:
        return false;
    }
  };

  if (!isVisible || selectedAssets?.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-90">
      <div className="bg-card border border-border rounded-lg shadow-enterprise-lg p-4 min-w-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="CheckSquare" size={16} color="white" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {selectedAssets?.length} asset{selectedAssets?.length !== 1 ? 's' : ''} selected
              </p>
              <p className="text-sm text-muted-foreground">Choose a bulk operation</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="space-y-3">
          {/* Operation Selection */}
          <Select
            placeholder="Select bulk operation"
            options={operationOptions}
            value={operation}
            onChange={handleOperationChange}
          />

          {/* Operation-specific Fields */}
          {operation && renderOperationFields()}

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleExecute}
              loading={isProcessing}
              disabled={!canExecute()}
              className="flex-1"
              iconName="Play"
              iconPosition="left"
            >
              Execute
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Selected Assets</span>
            <span>{selectedAssets?.length} items</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsPanel;