import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import dataService from '../../../services/DataService';

const PersonalAssetCard = ({ currentUser }) => {
  const [userAssets, setUserAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      loadUserAssets();
    }
  }, [currentUser]);

  const loadUserAssets = () => {
    try {
      // Get all assets from DataService
      const allAssets = dataService.getModuleData('assets') || [];
      
      // Filter assets assigned to current user
      const assignedAssets = allAssets.filter(asset => 
        asset.assignedTo === currentUser.id || 
        asset.assignedTo === currentUser.email ||
        asset.assignedToEmail === currentUser.email
      );
      
      setUserAssets(assignedAssets);
    } catch (error) {
      console.error('Error loading user assets:', error);
      setUserAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const getAssetStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'assigned':
        return 'text-success';
      case 'maintenance':
      case 'pending':
        return 'text-warning';
      case 'retired':
      case 'damaged':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAssetIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'laptop':
      case 'computer':
        return 'Laptop';
      case 'monitor':
      case 'display':
        return 'Monitor';
      case 'mobile':
      case 'phone':
        return 'Smartphone';
      case 'tablet':
        return 'Tablet';
      default:
        return 'Package';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">My Assets</h3>
          <div className="w-6 h-6 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
              <div className="flex-1">
                <div className="w-24 h-4 bg-muted animate-pulse rounded mb-1" />
                <div className="w-32 h-3 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">My Assets</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Package" size={20} className="text-primary" />
          <span className="text-sm font-medium text-primary">
            {userAssets.length} assigned
          </span>
        </div>
      </div>

      {userAssets.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Package" size={48} className="text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No assets assigned</p>
          <p className="text-sm text-muted-foreground">
            Contact your manager to request equipment
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {userAssets.slice(0, 4).map((asset) => (
            <div 
              key={asset.id} 
              className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Icon name={getAssetIcon(asset.category)} size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {asset.name || asset.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {asset.serialNumber || asset.model || asset.id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium ${getAssetStatusColor(asset.status)}`}>
                  {asset.status || 'Active'}
                </span>
                {asset.assignedDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Since {new Date(asset.assignedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {userAssets.length > 4 && (
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                iconName="ArrowRight"
                iconPosition="right"
              >
                View all {userAssets.length} assets
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalAssetCard;
