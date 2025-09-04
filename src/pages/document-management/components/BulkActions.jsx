import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedDocuments, onBulkAction, onClearSelection }) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Select Action' },
    { value: 'assign', label: 'Assign to Users/Groups' },
    { value: 'acknowledge', label: 'Bulk Acknowledge' },
    { value: 'archive', label: 'Archive Documents' },
    { value: 'delete', label: 'Delete Documents' },
    { value: 'update_tags', label: 'Update Tags' },
    { value: 'change_department', label: 'Change Department' },
    { value: 'extend_expiry', label: 'Extend Expiry Date' }
  ];

  const handleBulkAction = () => {
    if (!bulkActionType) return;
    
    onBulkAction(bulkActionType, selectedDocuments);
    setBulkActionType('');
    setIsActionsOpen(false);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'assign': return 'UserPlus';
      case 'acknowledge': return 'CheckCircle';
      case 'archive': return 'Archive';
      case 'delete': return 'Trash2';
      case 'update_tags': return 'Tag';
      case 'change_department': return 'Building';
      case 'extend_expiry': return 'Calendar';
      default: return 'Settings';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'delete': return 'text-error';
      case 'acknowledge': return 'text-success';
      case 'assign': return 'text-primary';
      case 'archive': return 'text-warning';
      default: return 'text-foreground';
    }
  };

  if (selectedDocuments?.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg shadow-enterprise p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckSquare" size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {selectedDocuments?.length} document{selectedDocuments?.length !== 1 ? 's' : ''} selected
              </p>
              <p className="text-sm text-muted-foreground">
                Choose an action to apply to selected documents
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isActionsOpen ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsActionsOpen(true)}
                iconName="Settings"
                iconPosition="left"
              >
                Bulk Actions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                iconName="X"
                iconPosition="left"
              >
                Clear Selection
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Select
                  options={bulkActionOptions}
                  value={bulkActionType}
                  onChange={setBulkActionType}
                  placeholder="Select action..."
                  className="min-w-48"
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleBulkAction}
                  disabled={!bulkActionType}
                  iconName={getActionIcon(bulkActionType)}
                  iconPosition="left"
                  className={getActionColor(bulkActionType)}
                >
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsActionsOpen(false);
                    setBulkActionType('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      {isActionsOpen && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkActionType('assign');
                handleBulkAction();
              }}
              iconName="UserPlus"
              iconPosition="left"
            >
              Assign to Users
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkActionType('update_tags');
                handleBulkAction();
              }}
              iconName="Tag"
              iconPosition="left"
            >
              Update Tags
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkActionType('archive');
                handleBulkAction();
              }}
              iconName="Archive"
              iconPosition="left"
            >
              Archive
            </Button>
          </div>
        </div>
      )}
      {/* Selected Documents Preview */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">Selected Documents:</p>
        <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
          {selectedDocuments?.slice(0, 10)?.map((doc) => (
            <span
              key={doc?.id}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              <Icon name="FileText" size={12} />
              <span className="truncate max-w-32">{doc?.title}</span>
            </span>
          ))}
          {selectedDocuments?.length > 10 && (
            <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              +{selectedDocuments?.length - 10} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActions;