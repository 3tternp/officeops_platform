import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AssetReturnModal = ({ isOpen, onClose, onSubmit, asset }) => {
  const [formData, setFormData] = useState({
    returnReason: '',
    condition: '',
    damageDescription: '',
    accessories: [],
    cleaningRequired: false,
    dataWiped: false,
    returnLocation: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnReasonOptions = [
    { value: 'project-completion', label: 'Project Completion' },
    { value: 'employee-departure', label: 'Employee Departure' },
    { value: 'equipment-upgrade', label: 'Equipment Upgrade' },
    { value: 'maintenance-required', label: 'Maintenance Required' },
    { value: 'no-longer-needed', label: 'No Longer Needed' },
    { value: 'damaged', label: 'Damaged/Faulty' },
    { value: 'other', label: 'Other' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent - Like new condition' },
    { value: 'good', label: 'Good - Minor wear and tear' },
    { value: 'fair', label: 'Fair - Noticeable wear but functional' },
    { value: 'poor', label: 'Poor - Significant damage or issues' },
    { value: 'damaged', label: 'Damaged - Requires repair' }
  ];

  const locationOptions = [
    { value: 'headquarters', label: 'Headquarters IT Desk' },
    { value: 'branch-office-1', label: 'Branch Office 1' },
    { value: 'branch-office-2', label: 'Branch Office 2' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'pickup-requested', label: 'Pickup Requested' }
  ];

  const mockAccessories = [
    { id: 'charger', name: 'Power Charger', required: true },
    { id: 'mouse', name: 'Wireless Mouse', required: false },
    { id: 'keyboard', name: 'External Keyboard', required: false },
    { id: 'bag', name: 'Carrying Bag', required: true },
    { id: 'cables', name: 'Cables', required: false },
    { id: 'dock', name: 'Docking Station', required: false }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccessoryToggle = (accessoryId) => {
    setFormData(prev => ({
      ...prev,
      accessories: prev?.accessories?.includes(accessoryId)
        ? prev?.accessories?.filter(id => id !== accessoryId)
        : [...prev?.accessories, accessoryId]
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        assetId: asset?.id,
        assetName: asset?.name,
        returnDate: new Date()?.toISOString(),
        status: 'returned'
      });
      onClose();
      setFormData({
        returnReason: '',
        condition: '',
        damageDescription: '',
        accessories: [],
        cleaningRequired: false,
        dataWiped: false,
        returnLocation: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error processing return:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !asset) return null;

  const requiredAccessories = mockAccessories?.filter(acc => acc?.required);
  const missingRequiredAccessories = requiredAccessories?.filter(acc => 
    !formData?.accessories?.includes(acc?.id)
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Return Asset</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Returning: {asset?.name} ({asset?.assetId})
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Return Reason */}
          <Select
            label="Return Reason"
            description="Why is this asset being returned?"
            required
            options={returnReasonOptions}
            value={formData?.returnReason}
            onChange={(value) => handleInputChange('returnReason', value)}
          />

          {/* Asset Condition */}
          <Select
            label="Asset Condition"
            description="Current condition of the asset"
            required
            options={conditionOptions}
            value={formData?.condition}
            onChange={(value) => handleInputChange('condition', value)}
          />

          {/* Damage Description */}
          {(formData?.condition === 'poor' || formData?.condition === 'damaged') && (
            <div>
              <label className="block text-sm font-medium text-popover-foreground mb-2">
                Damage Description *
              </label>
              <textarea
                required
                value={formData?.damageDescription}
                onChange={(e) => handleInputChange('damageDescription', e?.target?.value)}
                placeholder="Describe any damage, issues, or problems with the asset..."
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={4}
              />
            </div>
          )}

          {/* Accessories Checklist */}
          <div>
            <label className="block text-sm font-medium text-popover-foreground mb-3">
              Accessories & Components
            </label>
            <div className="space-y-2">
              {mockAccessories?.map((accessory) => (
                <div
                  key={accessory?.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg ${
                    accessory?.required ? 'border-warning bg-warning/5' : 'border-input'
                  }`}
                >
                  <Checkbox
                    checked={formData?.accessories?.includes(accessory?.id)}
                    onChange={() => handleAccessoryToggle(accessory?.id)}
                  />
                  <div className="flex-1">
                    <span className="text-sm text-popover-foreground">
                      {accessory?.name}
                      {accessory?.required && (
                        <span className="text-warning ml-1">*</span>
                      )}
                    </span>
                    {accessory?.required && (
                      <p className="text-xs text-warning">Required item</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {missingRequiredAccessories?.length > 0 && (
              <div className="mt-2 p-3 bg-warning/10 border border-warning rounded-lg">
                <p className="text-sm text-warning font-medium">
                  Missing required accessories: {missingRequiredAccessories?.map(acc => acc?.name)?.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Data Security Checklist */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <Icon name="Shield" size={16} />
              <span>Data Security Checklist</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={formData?.dataWiped}
                  onChange={(e) => handleInputChange('dataWiped', e?.target?.checked)}
                />
                <div>
                  <span className="text-sm text-foreground">
                    All personal and company data has been removed/wiped *
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Required for security compliance
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={formData?.cleaningRequired}
                  onChange={(e) => handleInputChange('cleaningRequired', e?.target?.checked)}
                />
                <span className="text-sm text-foreground">
                  Asset has been cleaned and sanitized
                </span>
              </div>
            </div>
          </div>

          {/* Return Location */}
          <Select
            label="Return Location"
            description="Where will you return this asset?"
            required
            options={locationOptions}
            value={formData?.returnLocation}
            onChange={(value) => handleInputChange('returnLocation', value)}
          />

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-popover-foreground mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              placeholder="Any additional information about the return..."
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Return Summary */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
              <Icon name="Info" size={16} />
              <span>Return Summary</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Return Date:</span>
                <span className="text-foreground">{new Date()?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Time:</span>
                <span className="text-foreground">1-2 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accessories Included:</span>
                <span className="text-foreground">{formData?.accessories?.length} items</span>
              </div>
            </div>
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
              iconName="RotateCcw"
              iconPosition="left"
              disabled={!formData?.dataWiped || missingRequiredAccessories?.length > 0}
            >
              Process Return
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetReturnModal;