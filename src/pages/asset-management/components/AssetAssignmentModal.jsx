import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AssetAssignmentModal = ({ isOpen, onClose, onSubmit, asset }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    assignmentType: 'temporary',
    duration: '',
    notes: '',
    location: '',
    conditions: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock employee data
  const mockEmployees = [
    { value: 'emp001', label: 'John Doe', department: 'Engineering', email: 'john.doe@company.com' },
    { value: 'emp002', label: 'Jane Smith', department: 'Marketing', email: 'jane.smith@company.com' },
    { value: 'emp003', label: 'Mike Johnson', department: 'Sales', email: 'mike.johnson@company.com' },
    { value: 'emp004', label: 'Sarah Wilson', department: 'HR', email: 'sarah.wilson@company.com' },
    { value: 'emp005', label: 'David Brown', department: 'Finance', email: 'david.brown@company.com' }
  ];

  const assignmentTypeOptions = [
    { value: 'temporary', label: 'Temporary Assignment' },
    { value: 'permanent', label: 'Permanent Assignment' },
    { value: 'project', label: 'Project-based' },
    { value: 'trial', label: 'Trial Period' }
  ];

  const durationOptions = [
    { value: '1-week', label: '1 Week' },
    { value: '2-weeks', label: '2 Weeks' },
    { value: '1-month', label: '1 Month' },
    { value: '3-months', label: '3 Months' },
    { value: '6-months', label: '6 Months' },
    { value: '1-year', label: '1 Year' },
    { value: 'indefinite', label: 'Indefinite' }
  ];

  const locationOptions = [
    { value: 'headquarters', label: 'Headquarters' },
    { value: 'branch-office-1', label: 'Branch Office 1' },
    { value: 'branch-office-2', label: 'Branch Office 2' },
    { value: 'remote', label: 'Remote Work' },
    { value: 'client-site', label: 'Client Site' }
  ];

  const conditionOptions = [
    { value: 'no-personal-use', label: 'No personal use allowed' },
    { value: 'return-on-termination', label: 'Must return on employment termination' },
    { value: 'regular-maintenance', label: 'Regular maintenance required' },
    { value: 'damage-liability', label: 'Employee liable for damage' },
    { value: 'software-compliance', label: 'Software license compliance required' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConditionToggle = (condition) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev?.conditions?.includes(condition)
        ? prev?.conditions?.filter(c => c !== condition)
        : [...prev?.conditions, condition]
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedEmployee = mockEmployees?.find(emp => emp?.value === formData?.employeeId);
      await onSubmit({
        ...formData,
        assetId: asset?.id,
        assetName: asset?.name,
        employeeName: selectedEmployee?.label,
        employeeEmail: selectedEmployee?.email,
        assignmentDate: new Date()?.toISOString(),
        status: 'active'
      });
      onClose();
      setFormData({
        employeeId: '',
        assignmentType: 'temporary',
        duration: '',
        notes: '',
        location: '',
        conditions: []
      });
    } catch (error) {
      console.error('Error assigning asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !asset) return null;

  const filteredEmployees = mockEmployees?.filter(emp =>
    emp?.label?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    emp?.department?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    emp?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
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
            <h2 className="text-xl font-semibold text-popover-foreground">Assign Asset</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Assigning: {asset?.name} ({asset?.assetId})
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-popover-foreground mb-2">
              Select Employee *
            </label>
            <div className="space-y-3">
              <Input
                type="search"
                placeholder="Search employees by name, department, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
              />
              
              <div className="max-h-48 overflow-y-auto border border-input rounded-lg">
                {filteredEmployees?.map((employee) => (
                  <div
                    key={employee?.value}
                    onClick={() => handleInputChange('employeeId', employee?.value)}
                    className={`p-3 cursor-pointer hover:bg-muted transition-enterprise border-b border-border last:border-b-0 ${
                      formData?.employeeId === employee?.value ? 'bg-accent/10 border-accent' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData?.employeeId === employee?.value 
                          ? 'bg-accent border-accent' :'border-muted-foreground'
                      }`}>
                        {formData?.employeeId === employee?.value && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-popover-foreground">{employee?.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee?.department} • {employee?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assignment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Assignment Type"
              description="Type of assignment"
              required
              options={assignmentTypeOptions}
              value={formData?.assignmentType}
              onChange={(value) => handleInputChange('assignmentType', value)}
            />

            <Select
              label="Duration"
              description="Expected assignment duration"
              required
              options={durationOptions}
              value={formData?.duration}
              onChange={(value) => handleInputChange('duration', value)}
            />
          </div>

          {/* Location */}
          <Select
            label="Primary Location"
            description="Where will this asset be primarily used?"
            required
            options={locationOptions}
            value={formData?.location}
            onChange={(value) => handleInputChange('location', value)}
          />

          {/* Assignment Conditions */}
          <div>
            <label className="block text-sm font-medium text-popover-foreground mb-3">
              Assignment Conditions
            </label>
            <div className="space-y-2">
              {conditionOptions?.map((condition) => (
                <div
                  key={condition?.value}
                  onClick={() => handleConditionToggle(condition?.value)}
                  className="flex items-center space-x-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted transition-enterprise"
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    formData?.conditions?.includes(condition?.value)
                      ? 'bg-accent border-accent' :'border-muted-foreground'
                  }`}>
                    {formData?.conditions?.includes(condition?.value) && (
                      <Icon name="Check" size={12} color="white" />
                    )}
                  </div>
                  <span className="text-sm text-popover-foreground">{condition?.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-popover-foreground mb-2">
              Assignment Notes
            </label>
            <textarea
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              placeholder="Add any special instructions or notes for this assignment..."
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Assignment Summary */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
              <Icon name="Info" size={16} />
              <span>Assignment Summary</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Asset:</span>
                <span className="text-foreground">{asset?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Asset ID:</span>
                <span className="font-mono text-foreground">{asset?.assetId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assignment Date:</span>
                <span className="text-foreground">{new Date()?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conditions:</span>
                <span className="text-foreground">{formData?.conditions?.length} selected</span>
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
              iconName="UserPlus"
              iconPosition="left"
              disabled={!formData?.employeeId}
            >
              Assign Asset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetAssignmentModal;