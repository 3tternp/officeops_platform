import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AssetDetailsModal = ({ isOpen, onClose, asset, onEdit, onAssign, onReturn, currentUser }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !asset) return null;

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

  const tabs = [
    { id: 'details', label: 'Details', icon: 'Info' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'maintenance', label: 'Maintenance', icon: 'Wrench' },
    { id: 'documents', label: 'Documents', icon: 'FileText' }
  ];

  const mockHistory = [
    {
      id: 1,
      action: 'Asset Assigned',
      user: 'John Doe',
      date: '2024-08-15',
      details: 'Assigned to John Doe for project work'
    },
    {
      id: 2,
      action: 'Condition Updated',
      user: 'Asset Manager',
      date: '2024-08-10',
      details: 'Condition changed from Good to Excellent after maintenance'
    },
    {
      id: 3,
      action: 'Asset Created',
      user: 'System',
      date: '2024-08-01',
      details: 'Asset added to inventory'
    }
  ];

  const mockMaintenance = [
    {
      id: 1,
      type: 'Scheduled Maintenance',
      date: '2024-09-01',
      status: 'upcoming',
      description: 'Quarterly hardware inspection and cleaning'
    },
    {
      id: 2,
      type: 'Repair',
      date: '2024-08-10',
      status: 'completed',
      description: 'Screen replacement and keyboard repair'
    }
  ];

  const mockDocuments = [
    {
      id: 1,
      name: 'Purchase Receipt',
      type: 'PDF',
      size: '245 KB',
      uploadDate: '2024-08-01'
    },
    {
      id: 2,
      name: 'Warranty Certificate',
      type: 'PDF',
      size: '189 KB',
      uploadDate: '2024-08-01'
    },
    {
      id: 3,
      name: 'User Manual',
      type: 'PDF',
      size: '2.1 MB',
      uploadDate: '2024-08-01'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Asset ID</label>
                    <p className="font-mono text-foreground">{asset?.assetId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Category</label>
                    <p className="text-foreground">{asset?.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Brand</label>
                    <p className="text-foreground">{asset?.brand || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Model</label>
                    <p className="text-foreground">{asset?.model || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Serial Number</label>
                    <p className="font-mono text-foreground">{asset?.serialNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Purchase Date</label>
                    <p className="text-foreground">{asset?.purchaseDate || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Purchase Cost</label>
                    <p className="text-foreground">{asset?.purchaseCost || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Warranty Expires</label>
                    <p className="text-foreground">{asset?.warrantyExpiry || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Current Status */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Current Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset?.status)}`}>
                        {asset?.status?.charAt(0)?.toUpperCase() + asset?.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Condition</label>
                    <p className={`font-medium ${getConditionColor(asset?.condition)}`}>
                      {asset?.condition?.charAt(0)?.toUpperCase() + asset?.condition?.slice(1)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Location</label>
                    <p className="text-foreground">{asset?.location}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {asset?.assignedTo && (
                    <>
                      <div>
                        <label className="text-sm text-muted-foreground">Assigned To</label>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Icon name="User" size={12} color="white" />
                          </div>
                          <span className="text-foreground">{asset?.assignedTo?.name}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Assignment Date</label>
                        <p className="text-foreground">{asset?.assignedDate}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Specifications */}
            {asset?.specifications && (
              <div>
                <h4 className="font-medium text-foreground mb-3">Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(asset?.specifications)?.map(([key, value]) => (
                    <div key={key}>
                      <label className="text-sm text-muted-foreground capitalize">
                        {key?.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <p className="text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Asset History</h4>
            <div className="space-y-3">
              {mockHistory?.map((entry) => (
                <div key={entry?.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Clock" size={14} color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{entry?.action}</p>
                      <span className="text-sm text-muted-foreground">{entry?.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">by {entry?.user}</p>
                    <p className="text-sm text-foreground mt-1">{entry?.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Maintenance Records</h4>
              <Button variant="outline" size="sm" iconName="Plus">
                Schedule Maintenance
              </Button>
            </div>
            <div className="space-y-3">
              {mockMaintenance?.map((maintenance) => (
                <div key={maintenance?.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    maintenance?.status === 'completed' ? 'bg-success' : 'bg-warning'
                  }`}>
                    <Icon name="Wrench" size={14} color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{maintenance?.type}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        maintenance?.status === 'completed' 
                          ? 'bg-success text-success-foreground' :'bg-warning text-warning-foreground'
                      }`}>
                        {maintenance?.status?.charAt(0)?.toUpperCase() + maintenance?.status?.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{maintenance?.date}</p>
                    <p className="text-sm text-foreground mt-1">{maintenance?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Documents</h4>
              <Button variant="outline" size="sm" iconName="Upload">
                Upload Document
              </Button>
            </div>
            <div className="space-y-3">
              {mockDocuments?.map((doc) => (
                <div key={doc?.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={14} color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{doc?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc?.type} • {doc?.size} • Uploaded {doc?.uploadDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Download" />
                    <Button variant="ghost" size="sm" iconName="Eye" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-popover border border-border rounded-lg shadow-enterprise-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 overflow-hidden rounded-lg">
              <Image
                src={asset?.image}
                alt={asset?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-popover-foreground">{asset?.name}</h2>
              <p className="text-sm text-muted-foreground">{asset?.assetId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {currentUser?.role === 'admin' && (
              <>
                <Button variant="outline" size="sm" onClick={() => onEdit(asset)} iconName="Edit">
                  Edit
                </Button>
                {asset?.status === 'available' && (
                  <Button variant="default" size="sm" onClick={() => onAssign(asset)} iconName="UserPlus">
                    Assign
                  </Button>
                )}
                {asset?.status === 'assigned' && (
                  <Button variant="outline" size="sm" onClick={() => onReturn(asset)} iconName="RotateCcw">
                    Return
                  </Button>
                )}
              </>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 p-1">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-enterprise ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsModal;