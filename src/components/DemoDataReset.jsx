import React, { useState } from 'react';
import Button from './ui/Button';
import Icon from './AppIcon';
import dataService from '../services/DataService';

const DemoDataReset = () => {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all data and reload demo accounts? This will clear all existing data.')) {
      setIsResetting(true);
      try {
        dataService.forceReset();
      } catch (error) {
        console.error('Error resetting data:', error);
        alert('Error resetting data. Please refresh the page manually.');
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="RotateCcw" size={20} color="white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">Reset Demo Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Reset all application data and reload with fresh demo accounts. This action cannot be undone.
          </p>
          
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-foreground mb-2">Demo Accounts:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Admin:</span>
                <span className="font-mono">admin@demo.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISO:</span>
                <span className="font-mono">iso@demo.com / iso123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Manager:</span>
                <span className="font-mono">manager@demo.com / mgr123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee:</span>
                <span className="font-mono">employee@demo.com / emp123</span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            loading={isResetting}
            className="text-warning hover:text-warning"
          >
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Reset to Demo Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemoDataReset;
