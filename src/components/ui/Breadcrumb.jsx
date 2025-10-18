import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/learning-management': { label: 'Learning Management', icon: 'GraduationCap' },
    '/access-management': { label: 'Access Management', icon: 'Shield' },
    '/asset-management': { label: 'Asset Management', icon: 'Package' },
    '/risk-assessment': { label: 'Risk Assessment', icon: 'AlertTriangle' },
    '/document-management': { label: 'Document Management', icon: 'FileText' },
    '/ticketing': { label: 'Ticketing', icon: 'Ticket' }
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [];

    // Always start with Dashboard if not already there
    if (location?.pathname !== '/dashboard') {
      breadcrumbs?.push({
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'LayoutDashboard'
      });
    }

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const routeInfo = routeMap?.[currentPath];
      
      if (routeInfo) {
        breadcrumbs?.push({
          label: routeInfo?.label,
          path: currentPath,
          icon: routeInfo?.icon,
          isLast: index === pathSegments?.length - 1
        });
      } else {
        // Handle dynamic segments or sub-pages
        const formattedLabel = segment?.split('-')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ');
        
        breadcrumbs?.push({
          label: formattedLabel,
          path: currentPath,
          isLast: index === pathSegments?.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  if (breadcrumbs?.length <= 1 && location?.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <div className="flex items-center space-x-2">
        {breadcrumbs?.map((item, index) => (
          <React.Fragment key={item?.path || index}>
            {index > 0 && (
              <Icon name="ChevronRight" size={14} className="text-muted-foreground/60" />
            )}
            
            <div className="flex items-center space-x-1.5">
              {item?.icon && (
                <Icon 
                  name={item?.icon} 
                  size={14} 
                  className={item?.isLast ? 'text-foreground' : 'text-muted-foreground'} 
                />
              )}
              
              {item?.isLast || !item?.path ? (
                <span className="font-medium text-foreground">{item?.label}</span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(item?.path)}
                  className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item?.label}
                </Button>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;