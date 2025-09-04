import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimeboxedAccessPanel = ({ timeboxedAccess, onExtendAccess, onRevokeAccess }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (expiryDate) => {
    const now = currentTime;
    const expiry = new Date(expiryDate);
    const diff = expiry - now;
    
    if (diff <= 0) return { expired: true, display: 'Expired' };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return { expired: false, display: `${days}d ${hours}h`, urgent: days <= 1 };
    if (hours > 0) return { expired: false, display: `${hours}h ${minutes}m`, urgent: hours <= 4 };
    return { expired: false, display: `${minutes}m`, urgent: true };
  };

  const getStatusColor = (access) => {
    const timeInfo = getTimeRemaining(access?.expiryDate);
    if (timeInfo?.expired) return 'bg-error/10 text-error border-error/20';
    if (timeInfo?.urgent) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-success/10 text-success border-success/20';
  };

  const getProgressPercentage = (startDate, expiryDate) => {
    const now = currentTime;
    const start = new Date(startDate);
    const expiry = new Date(expiryDate);
    
    const total = expiry - start;
    const elapsed = now - start;
    
    if (elapsed <= 0) return 0;
    if (elapsed >= total) return 100;
    
    return Math.round((elapsed / total) * 100);
  };

  const activeAccess = timeboxedAccess?.filter(access => {
    const timeInfo = getTimeRemaining(access?.expiryDate);
    return !timeInfo?.expired;
  });

  const expiredAccess = timeboxedAccess?.filter(access => {
    const timeInfo = getTimeRemaining(access?.expiryDate);
    return timeInfo?.expired;
  });

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Access</p>
              <p className="text-2xl font-bold text-success">{activeAccess?.length}</p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-2xl font-bold text-warning">
                {activeAccess?.filter(access => getTimeRemaining(access?.expiryDate)?.urgent)?.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold text-error">{expiredAccess?.length}</p>
            </div>
            <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="XCircle" size={20} className="text-error" />
            </div>
          </div>
        </div>
      </div>
      {/* Active Access */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Active Time-boxed Access</h3>
              <p className="text-sm text-muted-foreground">Temporary access grants with expiration</p>
            </div>
            <Button variant="outline" size="sm">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {activeAccess?.map((access) => {
            const timeInfo = getTimeRemaining(access?.expiryDate);
            const progress = getProgressPercentage(access?.startDate, access?.expiryDate);

            return (
              <div key={access?.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{access?.userName}</h4>
                      <p className="text-sm text-muted-foreground">{access?.userEmail}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(access)}`}>
                    {timeInfo?.display}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Shield" size={16} className="text-muted-foreground" />
                    <span className="font-medium text-foreground">{access?.resource}</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{access?.justification}</p>
                </div>
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Time Elapsed</span>
                    <span className="text-foreground font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        timeInfo?.urgent ? 'bg-warning' : 'bg-primary'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="text-foreground font-medium">
                      {new Date(access.startDate)?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expiry Date</p>
                    <p className="text-foreground font-medium">
                      {new Date(access.expiryDate)?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="User" size={14} />
                    <span>Approved by {access?.approvedBy}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {access?.canExtend && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onExtendAccess(access?.id)}
                      >
                        <Icon name="Clock" size={16} className="mr-1" />
                        Extend
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRevokeAccess(access?.id)}
                    >
                      <Icon name="XCircle" size={16} className="mr-1" />
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {activeAccess?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Clock" size={48} className="text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No active time-boxed access grants</p>
          </div>
        )}
      </div>
      {/* Expired Access */}
      {expiredAccess?.length > 0 && (
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Recently Expired Access</h3>
            <p className="text-sm text-muted-foreground">Access that has automatically expired</p>
          </div>

          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {expiredAccess?.slice(0, 5)?.map((access) => (
              <div key={access?.id} className="p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center">
                      <Icon name="XCircle" size={16} className="text-error" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{access?.userName}</p>
                      <p className="text-sm text-muted-foreground">{access?.resource}</p>
                    </div>
                  </div>
                  <span className="text-sm text-error">
                    Expired {new Date(access.expiryDate)?.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeboxedAccessPanel;