import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddAssetModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    assetId: '',
    name: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    status: 'available',
    condition: 'excellent',
    location: '',
    purchaseDate: '',
    purchaseCost: '',
    warrantyExpiry: '',
    specifications: {
      processor: '',
      memory: '',
      storage: '',
      display: ''
    },
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: 'laptop', label: 'Laptop' },
    { value: 'desktop', label: 'Desktop Computer' },
    { value: 'monitor', label: 'Monitor' },
    { value: 'phone', label: 'Mobile Phone' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'printer', label: 'Printer' },
    { value: 'camera', label: 'Camera' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'retired', label: 'Retired' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const locationOptions = [
    { value: 'headquarters', label: 'Headquarters' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'branch-office-1', label: 'Branch Office 1' },
    { value: 'branch-office-2', label: 'Branch Office 2' },
    { value: 'remote', label: 'Remote Location' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const generateAssetId = () => {
    const category = formData.category.toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${category.substring(0, 3)}-${year}-${random}`;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      const assetData = {
        ...formData,
        id: `asset${Date.now()}`,
        assetId: formData.assetId || generateAssetId(),
        qrCode: true,
        assignedTo: null,
        assignedDate: null,
        createdDate: new Date().toISOString()
      };

      await onSubmit(assetData);
      onClose();
      
      // Reset form
      setFormData({
        assetId: '',
        name: '',
        category: '',
        brand: '',
        model: '',
        serialNumber: '',
        status: 'available',
        condition: 'excellent',
        location: '',
        purchaseDate: '',
        purchaseCost: '',
        warrantyExpiry: '',
        specifications: {
          processor: '',
          memory: '',
          storage: '',
          display: ''
        },
        description: ''
      });
    } catch (error) {
      console.error('Error adding asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Add New Asset</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new asset to the inventory system
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Asset ID"
              description="Leave blank to auto-generate"
              value={formData.assetId}
              onChange={(e) => handleInputChange('assetId', e.target.value)}
              placeholder="e.g., LAP-2025-001"
            />
            
            <Input
              label="Asset Name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., MacBook Pro 16 inch"
            />
          </div>

          {/* Category and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              required
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              placeholder="Select category"
            />
            
            <Input
              label="Brand"
              required
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              placeholder="e.g., Apple, Dell, HP"
            />
          </div>

          {/* Model and Serial Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Model"
              required
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              placeholder="e.g., MacBook Pro, ThinkPad X1"
            />
            
            <Input
              label="Serial Number"
              required
              value={formData.serialNumber}
              onChange={(e) => handleInputChange('serialNumber', e.target.value)}
              placeholder="Device serial number"
            />
          </div>

          {/* Status, Condition, and Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status"
              required
              options={statusOptions}
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
            />
            
            <Select
              label="Condition"
              required
              options={conditionOptions}
              value={formData.condition}
              onChange={(value) => handleInputChange('condition', value)}
            />
            
            <Select
              label="Location"
              required
              options={locationOptions}
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
            />
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Purchase Date"
              type="date"
              required
              value={formData.purchaseDate}
              onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
            />
            
            <Input
              label="Purchase Cost"
              required
              value={formData.purchaseCost}
              onChange={(e) => handleInputChange('purchaseCost', e.target.value)}
              placeholder="e.g., $2,499"
            />
            
            <Input
              label="Warranty Expiry"
              type="date"
              required
              value={formData.warrantyExpiry}
              onChange={(e) => handleInputChange('warrantyExpiry', e.target.value)}
            />
          </div>

          {/* Specifications */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Technical Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Processor/CPU"
                value={formData.specifications.processor}
                onChange={(e) => handleInputChange('specifications.processor', e.target.value)}
                placeholder="e.g., Intel i7, M3 Pro"
              />
              
              <Input
                label="Memory/RAM"
                value={formData.specifications.memory}
                onChange={(e) => handleInputChange('specifications.memory', e.target.value)}
                placeholder="e.g., 16GB RAM"
              />
              
              <Input
                label="Storage"
                value={formData.specifications.storage}
                onChange={(e) => handleInputChange('specifications.storage', e.target.value)}
                placeholder="e.g., 512GB SSD"
              />
              
              <Input
                label="Display"
                value={formData.specifications.display}
                onChange={(e) => handleInputChange('specifications.display', e.target.value)}
                placeholder="e.g., 16.2 inch Liquid Retina XDR"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-popover-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Additional notes about this asset..."
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Add any additional information about this asset
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Plus"
              iconPosition="left"
            >
              Add Asset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
