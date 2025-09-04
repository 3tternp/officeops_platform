import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MyAssetsView = ({ userAssets, onReturnAsset, onReportIssue, onViewDetails }) => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-accent';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'pending-return': return 'bg-warning text-warning-foreground';
      case 'maintenance': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!userAssets || userAssets?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Package" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Assets Assigned</h3>
        <p className="text-muted-foreground mb-6">
          You don't have any assets assigned to you at the moment.
        </p>
        <Button variant="outline" iconName="Plus" iconPosition="left">
          Request Asset
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Assets</h2>
          <p className="text-muted-foreground">
            {userAssets?.length} asset{userAssets?.length !== 1 ? 's' : ''} assigned to you
          </p>
        </div>
        <Button variant="outline" iconName="Plus" iconPosition="left">
          Request New Asset
        </Button>
      </div>
      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userAssets?.map((asset) => (
          <div key={asset?.id} className="bg-card border border-border rounded-lg shadow-enterprise hover:shadow-enterprise-md transition-enterprise">
            {/* Asset Image */}
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <Image
                src={asset?.image}
                alt={asset?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset?.assignmentStatus)}`}>
                  {asset?.assignmentStatus === 'active' ? 'Active' : 
                   asset?.assignmentStatus === 'pending-return'? 'Pending Return' : 'Maintenance'}
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
                  <span className="text-muted-foreground">Assigned:</span>
                  <span className="text-foreground">{asset?.assignedDate}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Condition:</span>
                  <span className={`font-medium ${getConditionColor(asset?.condition)}`}>
                    {asset?.condition?.charAt(0)?.toUpperCase() + asset?.condition?.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="text-foreground">{asset?.currentLocation || asset?.location}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReturnAsset(asset)}
                    className="flex-1"
                    iconName="RotateCcw"
                    iconPosition="left"
                    disabled={asset?.assignmentStatus === 'pending-return'}
                  >
                    {asset?.assignmentStatus === 'pending-return' ? 'Return Pending' : 'Return'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReportIssue(asset)}
                    iconName="AlertTriangle"
                    iconPosition="left"
                  >
                    Report Issue
                  </Button>
                </div>
              </div>

              {/* Usage Stats */}
              {asset?.usageStats && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Usage Statistics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-medium text-foreground">{asset?.usageStats?.daysAssigned}</p>
                      <p className="text-muted-foreground">Days</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-medium text-foreground">{asset?.usageStats?.issuesReported || 0}</p>
                      <p className="text-muted-foreground">Issues</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions Panel */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Zap" size={20} />
          <span>Quick Actions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            iconName="RotateCcw"
            iconPosition="left"
          >
            <div className="text-left">
              <p className="font-medium">Return Asset</p>
              <p className="text-sm text-muted-foreground">Process asset return</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            iconName="AlertTriangle"
            iconPosition="left"
          >
            <div className="text-left">
              <p className="font-medium">Report Issue</p>
              <p className="text-sm text-muted-foreground">Report problems or damage</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            iconName="Plus"
            iconPosition="left"
          >
            <div className="text-left">
              <p className="font-medium">Request Asset</p>
              <p className="text-sm text-muted-foreground">Request new equipment</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyAssetsView;