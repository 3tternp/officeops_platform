import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import components
import AssetCard from './components/AssetCard';
import AssetFilters from './components/AssetFilters';
import AssetRequestModal from './components/AssetRequestModal';
import AssetDetailsModal from './components/AssetDetailsModal';
import MyAssetsView from './components/MyAssetsView';
import AssetAssignmentModal from './components/AssetAssignmentModal';
import AssetReturnModal from './components/AssetReturnModal';
import BulkOperationsPanel from './components/BulkOperationsPanel';
import AddAssetModal from './components/AddAssetModal';
import dataService from '../../services/DataService';
import { hasPermission, PERMISSIONS, getRolePermissions } from '../../utils/permissions';
import { ensureDemoUser } from '../../utils/demoUser';

const AssetManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('catalog');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAssets, setSelectedAssets] = useState([]);
  
  // Modal states
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [addAssetModalOpen, setAddAssetModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    location: '',
    condition: ''
  });

  // Get current user from localStorage or default to employee
  const [currentUser, setCurrentUser] = useState(null);
  const [allAssets, setAllAssets] = useState([]);
  
  // Watch for user changes
  useEffect(() => {
    const updateUser = () => {
      const user = ensureDemoUser();
      
      // Debug logging
      console.log('🔧 Asset Management Debug Info:');
      console.log('- Current User:', user);
      console.log('- User Role:', user?.role);
      console.log('- ASSET_CREATE permission:', hasPermission(user?.role, PERMISSIONS.ASSET_CREATE));
      console.log('- ASSET_REQUEST permission:', hasPermission(user?.role, PERMISSIONS.ASSET_REQUEST));
      console.log('- ASSET_VIEW permission:', hasPermission(user?.role, PERMISSIONS.ASSET_VIEW));
      console.log('- Available permissions for role:', user?.role ? getRolePermissions(user.role) : 'No role');
      
      setCurrentUser(user);
    };

    updateUser();

    // Listen for localStorage changes (role switching)
    const handleStorageChange = (e) => {
      if (e.key === 'currentUser' || e.key === 'user') {
        updateUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for user changes periodically in case role was switched in same tab
    const interval = setInterval(updateUser, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  useEffect(() => {
    // Get assets from DataService
    const assets = dataService.getAssets();
    setAllAssets(assets);
  }, []);

  // Mock assets data
  const mockAssets = [
    {
      id: 'asset001',
      assetId: 'LAP-2024-001',
      name: 'MacBook Pro 16"',
      category: 'laptop',
      brand: 'Apple',
      model: 'MacBook Pro',
      serialNumber: 'C02XJ0AAJGH5',
      status: 'assigned',
      condition: 'excellent',
      location: 'headquarters',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      assignedTo: {
        id: 'emp001',
        name: 'John Doe',
        email: 'john.doe@company.com'
      },
      assignedDate: '2024-08-15',
      purchaseDate: '2024-07-01',
      purchaseCost: '$2,499',
      warrantyExpiry: '2027-07-01',
      qrCode: true,
      specifications: {
        processor: 'M3 Pro',
        memory: '16GB RAM',
        storage: '512GB SSD',
        display: '16.2" Liquid Retina XDR'
      }
    },
    {
      id: 'asset002',
      assetId: 'MON-2024-002',
      name: 'Dell UltraSharp 27"',
      category: 'monitor',
      brand: 'Dell',
      model: 'U2723QE',
      serialNumber: 'CN-0H7H8J-74180-25A-0001',
      status: 'available',
      condition: 'good',
      location: 'warehouse',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
      assignedTo: null,
      assignedDate: null,
      purchaseDate: '2024-06-15',
      purchaseCost: '$599',
      warrantyExpiry: '2027-06-15',
      qrCode: true,
      specifications: {
        resolution: '4K UHD (3840x2160)',
        panelType: 'IPS',
        connectivity: 'USB-C, HDMI, DisplayPort',
        colorGamut: '98% DCI-P3'
      }
    },
    {
      id: 'asset003',
      assetId: 'PHN-2024-003',
      name: 'iPhone 15 Pro',
      category: 'phone',
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      serialNumber: 'F2LN3LL/A',
      status: 'assigned',
      condition: 'excellent',
      location: 'remote',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      assignedTo: {
        id: 'emp002',
        name: 'Jane Smith',
        email: 'jane.smith@company.com'
      },
      assignedDate: '2024-08-10',
      purchaseDate: '2024-08-01',
      purchaseCost: '$999',
      warrantyExpiry: '2025-08-01',
      qrCode: true,
      specifications: {
        storage: '256GB',
        display: '6.1" Super Retina XDR',
        camera: '48MP Main, 12MP Ultra Wide',
        connectivity: '5G, Wi-Fi 6E'
      }
    },
    {
      id: 'asset004',
      assetId: 'PRT-2024-004',
      name: 'HP LaserJet Pro',
      category: 'printer',
      brand: 'HP',
      model: 'LaserJet Pro 4301dw',
      serialNumber: 'VNC3K25001',
      status: 'maintenance',
      condition: 'fair',
      location: 'headquarters',
      image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400',
      assignedTo: null,
      assignedDate: null,
      purchaseDate: '2024-05-20',
      purchaseCost: '$299',
      warrantyExpiry: '2026-05-20',
      qrCode: true,
      specifications: {
        printSpeed: '35 ppm',
        printResolution: '1200 x 1200 dpi',
        connectivity: 'Wi-Fi, Ethernet, USB',
        paperCapacity: '300 sheets'
      }
    },
    {
      id: 'asset005',
      assetId: 'TAB-2024-005',
      name: 'iPad Pro 12.9"',
      category: 'tablet',
      brand: 'Apple',
      model: 'iPad Pro',
      serialNumber: 'DMPH2LL/A',
      status: 'available',
      condition: 'excellent',
      location: 'branch-office-1',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      assignedTo: null,
      assignedDate: null,
      purchaseDate: '2024-07-15',
      purchaseCost: '$1,099',
      warrantyExpiry: '2025-07-15',
      qrCode: true,
      specifications: {
        display: '12.9" Liquid Retina XDR',
        storage: '256GB',
        processor: 'M2 chip',
        connectivity: 'Wi-Fi 6E, 5G'
      }
    },
    {
      id: 'asset006',
      assetId: 'CAM-2024-006',
      name: 'Canon EOS R6',
      category: 'camera',
      brand: 'Canon',
      model: 'EOS R6 Mark II',
      serialNumber: '013021000001',
      status: 'assigned',
      condition: 'good',
      location: 'headquarters',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
      assignedTo: {
        id: 'emp003',
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com'
      },
      assignedDate: '2024-08-05',
      purchaseDate: '2024-06-01',
      purchaseCost: '$2,499',
      warrantyExpiry: '2026-06-01',
      qrCode: true,
      specifications: {
        sensor: '24.2MP Full-Frame CMOS',
        videoRecording: '4K UHD at 60fps',
        isoRange: '100-102400',
        connectivity: 'Wi-Fi, Bluetooth'
      }
    }
  ];

  // Mock user assets (assets assigned to current user)
  const userAssets = mockAssets?.filter(asset => 
    asset?.assignedTo?.id === currentUser?.id
  )?.map(asset => ({
    ...asset,
    assignmentStatus: 'active',
    currentLocation: asset?.location,
    usageStats: {
      daysAssigned: Math.floor(Math.random() * 30) + 1,
      issuesReported: Math.floor(Math.random() * 3)
    }
  }));

  // Filter assets based on current filters and user permissions
  const getVisibleAssets = () => {
    let assetsToShow = mockAssets;
    
    // For non-admin users, show only assets assigned to them
    if (currentUser?.role !== 'admin') {
      assetsToShow = mockAssets?.filter(asset => 
        asset?.assignedTo?.id === currentUser?.id
      );
    }
    
    return assetsToShow;
  };
  
  const filteredAssets = getVisibleAssets()?.filter(asset => {
    if (filters?.search && !asset?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
        !asset?.assetId?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
      return false;
    }
    if (filters?.category && asset?.category !== filters?.category) return false;
    if (filters?.status && asset?.status !== filters?.status) return false;
    if (filters?.location && asset?.location !== filters?.location) return false;
    if (filters?.condition && asset?.condition !== filters?.condition) return false;
    return true;
  });

  // Asset statistics - show only assets visible to current user
  const getAssetStats = () => {
    const visibleAssets = getVisibleAssets();
    return {
      total: visibleAssets?.length,
      available: visibleAssets?.filter(a => a?.status === 'available')?.length,
      assigned: visibleAssets?.filter(a => a?.status === 'assigned')?.length,
      maintenance: visibleAssets?.filter(a => a?.status === 'maintenance')?.length,
      retired: visibleAssets?.filter(a => a?.status === 'retired')?.length
    };
  };
  
  const assetStats = getAssetStats();

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleViewDetails = (asset) => {
    setSelectedAsset(asset);
    setDetailsModalOpen(true);
  };

  const handleAssignAsset = (asset) => {
    setSelectedAsset(asset);
    setAssignmentModalOpen(true);
  };

  const handleReturnAsset = (asset) => {
    setSelectedAsset(asset);
    setReturnModalOpen(true);
  };

  const handleEditAsset = (asset) => {
    console.log('Edit asset:', asset);
    // Navigate to edit form or open edit modal
  };

  const handleRequestAsset = (asset = null) => {
    setSelectedAsset(asset);
    setRequestModalOpen(true);
  };

  const handleReportIssue = (asset) => {
    console.log('Report issue for asset:', asset);
    // Open issue reporting modal
  };

  const handleAssetSelection = (assetId) => {
    setSelectedAssets(prev => 
      prev?.includes(assetId)
        ? prev?.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssets?.length === filteredAssets?.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets?.map(asset => asset?.id));
    }
  };

  const handleBulkOperation = async (operationData) => {
    console.log('Executing bulk operation:', operationData);
    // Implement bulk operation logic
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSubmitRequest = async (requestData) => {
    console.log('Submitting asset request:', requestData);
    // Implement request submission logic
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSubmitAssignment = async (assignmentData) => {
    console.log('Submitting asset assignment:', assignmentData);
    // Implement assignment logic
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSubmitReturn = async (returnData) => {
    console.log('Submitting asset return:', returnData);
    // Implement return logic
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleAddAsset = () => {
    setAddAssetModalOpen(true);
  };

  const handleSubmitAddAsset = async (assetData) => {
    console.log('Adding new asset:', assetData);
    // Here you would typically send the data to your backend API
    // For now, we'll just simulate success
    alert('Asset added successfully!');
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const renderAssetCatalog = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} color="white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{assetStats?.total}</p>
              <p className="text-sm text-muted-foreground">Total Assets</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{assetStats?.available}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
              <Icon name="User" size={20} color="white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{assetStats?.assigned}</p>
              <p className="text-sm text-muted-foreground">Assigned</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error rounded-lg flex items-center justify-center">
              <Icon name="Wrench" size={20} color="white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{assetStats?.maintenance}</p>
              <p className="text-sm text-muted-foreground">Maintenance</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="Archive" size={20} color="white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{assetStats?.retired}</p>
              <p className="text-sm text-muted-foreground">Retired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AssetFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({ search: '', category: '', status: '', location: '', condition: '' })}
        onToggleView={setViewMode}
        viewMode={viewMode}
      />

      {/* Bulk Selection Header */}
      {filteredAssets?.length > 0 && (
        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedAssets?.length === filteredAssets?.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
            />
            <span className="text-sm text-foreground">
              {selectedAssets?.length > 0 
                ? `${selectedAssets?.length} of ${filteredAssets?.length} selected`
                : `Select all ${filteredAssets?.length} assets`
              }
            </span>
          </div>
          
          {selectedAssets?.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAssets([])}
              iconName="X"
            >
              Clear Selection
            </Button>
          )}
        </div>
      )}

      {/* Assets Grid/List */}
      {filteredAssets?.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Assets Found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search terms.
          </p>
          <Button variant="outline" onClick={() => setFilters({ search: '', category: '', status: '', location: '', condition: '' })}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' :'space-y-4'
        }>
          {filteredAssets?.map((asset) => (
            <div key={asset?.id} className="relative">
              {viewMode === 'grid' && (
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={selectedAssets?.includes(asset?.id)}
                    onChange={() => handleAssetSelection(asset?.id)}
                    className="w-4 h-4 text-primary bg-white border-border rounded focus:ring-primary shadow-sm"
                  />
                </div>
              )}
              <AssetCard
                asset={asset}
                onViewDetails={handleViewDetails}
                onAssign={handleAssignAsset}
                onReturn={handleReturnAsset}
                onEdit={handleEditAsset}
                currentUser={currentUser}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />
      <main className={`transition-all duration-300 ease-in-out pt-16 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Asset Management</h1>
              <p className="text-muted-foreground mt-2">
                Track equipment lifecycle, manage assignments, and maintain inventory
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={() => handleRequestAsset()}
                iconName="Plus"
                iconPosition="left"
              >
                Request Asset
              </Button>
              
              {hasPermission(currentUser?.role, PERMISSIONS.ASSET_CREATE) && (
                <Button
                  variant="default"
                  onClick={handleAddAsset}
                  iconName="Package"
                  iconPosition="left"
                >
                  Add Asset
                </Button>
              )}
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex items-center space-x-1 mb-6 bg-muted rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveView('catalog')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-enterprise ${
                activeView === 'catalog' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Package" size={16} className="mr-2 inline" />
              Asset Catalog
            </button>
            <button
              onClick={() => setActiveView('my-assets')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-enterprise ${
                activeView === 'my-assets' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="User" size={16} className="mr-2 inline" />
              My Assets ({userAssets?.length})
            </button>
          </div>

          {/* Content */}
          {activeView === 'catalog' ? renderAssetCatalog() : (
            <MyAssetsView
              userAssets={userAssets}
              onReturnAsset={handleReturnAsset}
              onReportIssue={handleReportIssue}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>
      </main>
      {/* Modals */}
      <AssetRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSubmit={handleSubmitRequest}
        asset={selectedAsset}
      />
      <AssetDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        asset={selectedAsset}
        onEdit={handleEditAsset}
        onAssign={handleAssignAsset}
        onReturn={handleReturnAsset}
        currentUser={currentUser}
      />
      <AssetAssignmentModal
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        onSubmit={handleSubmitAssignment}
        asset={selectedAsset}
      />
      <AssetReturnModal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        onSubmit={handleSubmitReturn}
        asset={selectedAsset}
      />
      <AddAssetModal
        isOpen={addAssetModalOpen}
        onClose={() => setAddAssetModalOpen(false)}
        onSubmit={handleSubmitAddAsset}
      />
      {/* Bulk Operations Panel */}
      <BulkOperationsPanel
        selectedAssets={selectedAssets}
        onBulkOperation={handleBulkOperation}
        onClearSelection={() => setSelectedAssets([])}
        isVisible={selectedAssets?.length > 0}
      />
    </div>
  );
};

export default AssetManagement;