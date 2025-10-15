import React, { createContext, useContext, useMemo, useState } from 'react';
import dataService from '../services/DataService';

const BrandingContext = createContext({ branding: null, updateBranding: () => {} });

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(() => dataService.getCompanyBranding());

  const updateBranding = (updates) => {
    const merged = { ...branding, ...updates };
    dataService.saveCompanyBranding(merged);
    setBranding(merged);
  };

  const value = useMemo(() => ({ branding, updateBranding }), [branding]);
  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);