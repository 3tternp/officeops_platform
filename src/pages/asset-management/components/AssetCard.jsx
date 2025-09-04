import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AssetCard = ({ asset, onViewDetails, onAssign, onReturn, onEdit, onDelete, currentUser }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success text-success-foreground';
      case 'assigned': return 'bg-warning text-warning-foreground';
      case 'maintenance': return 'bg-error text-error-foreground';
      case 'retired': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-accent';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const isAssignedToCurrentUser = asset?.assignedTo?.id === currentUser?.id;
  const canAssign = asset?.status === 'available' && currentUser?.role === 'admin';
  const canReturn = isAssignedToCurrentUser || currentUser?.role === 'admin';

  return (
    <div className="bg-card border border-border rounded-lg shadow-enterprise hover:shadow-enterprise-md transition-enterprise">
      {/* Asset Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <Image
          src={asset?.image}
          alt={asset?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset?.status)}`}>
            {asset?.status?.charAt(0)?.toUpperCase() + asset?.status?.slice(1)}
          </span>
        </div>
        {asset?.qrCode && (
          <div className="absolute top-3 left-3 bg-white p-1 rounded">
            <Icon name="QrCode" size={20} className="text-foreground" />
          </div>
        )}
      </div>
      {/* Asset Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{asset?.name}</h3>
            <p className="text-sm text-muted-foreground">{asset?.category}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(asset)}
            className="flex-shrink-0 ml-2"
          >
            <Icon name="Eye" size={16} />
          </Button>
        </div>

        {/* Asset Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Asset ID:</span>
            <span className="font-mono text-foreground">{asset?.assetId}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Location:</span>
            <span className="text-foreground">{asset?.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Condition:</span>
            <span className={`font-medium ${getConditionColor(asset?.condition)}`}>
              {asset?.condition?.charAt(0)?.toUpperCase() + asset?.condition?.slice(1)}
            </span>
          </div>

          {asset?.assignedTo && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Assigned to:</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={12} color="white" />
                </div>
                <span className="text-foreground">{asset?.assignedTo?.name}</span>
              </div>
            </div>
          )}

          {asset?.assignedDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Assigned:</span>
              <span className="text-foreground">{asset?.assignedDate}</span>
            </div>
          )}
        </div>

        {/* Specifications */}
        {asset?.specifications && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Specifications</h4>
            <div className="space-y-1">
              {Object.entries(asset?.specifications)?.slice(0, 2)?.map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground capitalize">{key?.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {canAssign && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onAssign(asset)}
              className="flex-1"
              iconName="UserPlus"
              iconPosition="left"
            >
              Assign
            </Button>
          )}
          
          {canReturn && asset?.status === 'assigned' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReturn(asset)}
              className="flex-1"
              iconName="RotateCcw"
              iconPosition="left"
            >
              Return
            </Button>
          )}

          {currentUser?.role === 'admin' && (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(asset)}
                iconName="Edit"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(asset)}
                iconName="Trash2"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetCard;