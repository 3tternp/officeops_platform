import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';

const ModernTabs = ({
  tabs,
  defaultActiveTab = 0,
  onTabChange,
  variant = 'underline',
  size = 'md',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  const tabClasses = {
    underline: {
      container: 'border-b border-gray-200',
      tab: `relative ${sizeClasses[size]} font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer`,
      activeTab: 'text-blue-600',
      indicator: 'absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600'
    },
    pills: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: `${sizeClasses[size]} font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer rounded-md`,
      activeTab: 'bg-white text-blue-600 shadow-sm',
      indicator: null
    },
    buttons: {
      container: 'bg-white border border-gray-200 rounded-lg p-1',
      tab: `${sizeClasses[size]} font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 cursor-pointer rounded-md`,
      activeTab: 'bg-blue-600 text-white',
      indicator: null
    }
  };

  const config = tabClasses[variant];

  return (
    <div className={`w-full ${className}`}>
      <div className={config.container}>
        <div className="flex space-x-1 relative">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 ${config.tab} ${
                activeTab === index ? config.activeTab : ''
              }`}
              onClick={() => handleTabClick(index)}
            >
              {tab.icon && (
                <Icon name={tab.icon} size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
              )}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {tab.badge}
                </span>
              )}
            </div>
          ))}

          {variant === 'underline' && (
            <motion.div
              className={config.indicator}
              initial={false}
              animate={{
                width: `${100 / tabs.length}%`,
                x: `${activeTab * 100}%`
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            />
          )}
        </div>
      </div>

      <div className="mt-6">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default ModernTabs;