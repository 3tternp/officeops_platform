import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, asset }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  if (!isOpen || !asset) return null;

  const handleConfirm = async () => {
    if (confirmation !== asset.assetId) {
      alert('Asset ID confirmation does not match. Please type the exact Asset ID to confirm deletion.');
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm(asset);
      onClose();
    } catch (error) {
      console.error('Error deleting asset:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setConfirmation('');
    onClose();
  };

  const canDelete = asset.status === 'available' || asset.status === 'retired';
  const isAssigned = asset.status === 'assigned';

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-popover-foreground">
                Delete Asset
              </h2>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!canDelete ? (
            <div className="mb-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Cannot Delete Asset</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      {isAssigned 
                        ? 'This asset is currently assigned to a user and cannot be deleted. Please return the asset first.'
                        : 'This asset cannot be deleted in its current status. Only available or retired assets can be deleted.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Asset Info */}
              <div className="mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">{asset.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Asset ID:</span>
                      <span className="ml-2 font-mono">{asset.assetId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <span className="ml-2">{asset.category}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Brand:</span>
                      <span className="ml-2">{asset.brand}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 capitalize">{asset.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertTriangle" size={20} className="text-red-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Warning</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Deleting this asset will permanently remove it from the system, including:
                      </p>
                      <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
                        <li>All asset information and specifications</li>
                        <li>Assignment and maintenance history</li>
                        <li>Associated documents and records</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type the Asset ID "<span className="font-mono text-red-600">{asset.assetId}</span>" to confirm deletion:
                </label>
                <input
                  type="text"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder={asset.assetId}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
                  disabled={isDeleting}
                />
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          
          {canDelete && (
            <Button
              variant="destructive"
              onClick={handleConfirm}
              loading={isDeleting}
              disabled={confirmation !== asset.assetId}
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Delete Asset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
