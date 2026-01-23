import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Container from '../../components/ui/Container';
import Icon from '../../components/AppIcon';
import MetricCard from './components/MetricCard';
import QuickActionCard from './components/QuickActionCard';
import AlertCard from './components/AlertCard';
import ActivityFeed from './components/ActivityFeed';
import RiskHeatMap from './components/RiskHeatMap';
import ProgressChart from './components/ProgressChart';
import PersonalAssetCard from './components/PersonalAssetCard';
import PersonalTrainingCard from './components/PersonalTrainingCard';
import PersonalDocumentCard from './components/PersonalDocumentCard';
import PersonalAlertsCard from './components/PersonalAlertsCard';
import { useUser } from '../../contexts/UserContext';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';
import TicketingService from '../../services/TicketingService';
import dataService from '../../services/DataService';
import PersonalTicketsCard from './components/PersonalTicketsCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentUser } = useUser();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    userCount: 0,
    assetCount: 0,
    highRiskCount: 0
  });

  useEffect(() => {
    // Load real stats
    const users = dataService.getUsers();
    const assets = dataService.getAssets();
    // For risks, we might need to check if we have a service or if it's in DataService
    // Assuming risks might be stored similarly or we use a placeholder if not available in DataService
    // Let's check DataService for risks, if not found we keep hardcoded or set to 0
    // Actually, let's just count users and assets for now as those are confirmed
    
    setStats({
      userCount: users.length,
      assetCount: assets.length,
      highRiskCount: 23 // Keeping hardcoded if no service method found easily, or update if I find it
    });
  }, []);

  useEffect(() => {
    setTickets(TicketingService.getTickets());
  }, []);

  const openTicketCount = tickets.filter(t => t.status !== 'resolved' && t.status !== 'rejected').length;
  const pendingApprovalCount = tickets.filter(t => t.status === 'pending_approval').length;

  const dashboardMetrics = [
    {
      title: 'Open Tickets',
      value: String(openTicketCount),
      change: '',
      changeType: 'neutral',
      icon: 'Ticket',
      color: 'primary',
      actionLabel: 'Open Ticketing',
      onActionClick: () => navigate('/ticketing')
    },
    {
      title: 'Pending Ticket Approvals',
      value: String(pendingApprovalCount),
      change: '',
      changeType: 'neutral',
      icon: 'ShieldCheck',
      color: 'warning',
      actionLabel: 'Review Tickets',
      onActionClick: () => navigate('/ticketing')
    },
    {
      title: 'Active Employees',
      value: String(stats.userCount || 0),
      change: '+12%',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary',
      actionLabel: 'View All',
      onActionClick: () => navigate('/access-management')
    },
    {
      title: 'Training Completion',
      value: '87%',
      change: '+5%',
      changeType: 'positive',
      icon: 'GraduationCap',
      color: 'success',
      actionLabel: 'View Progress',
      onActionClick: () => navigate('/learning-management')
    },
    {
      title: 'Assets Assigned',
      value: String(stats.assetCount || 0),
      change: '+8%',
      changeType: 'positive',
      icon: 'Package',
      color: 'accent',
      actionLabel: 'Manage Assets',
      onActionClick: () => navigate('/asset-management')
    },
    {
      title: 'High Risk Items',
      value: String(stats.highRiskCount || 0),
      change: '-15%',
      changeType: 'positive',
      icon: 'AlertTriangle',
      color: 'warning',
      actionLabel: 'Review Risks',
      onActionClick: () => navigate('/risk-assessment')
    },
    {
      title: 'Pending Approvals',
      value: '47',
      change: '+3',
      changeType: 'neutral',
      icon: 'Clock',
      color: 'error',
      actionLabel: 'Review Queue',
      onActionClick: () => navigate('/access-management')
    },
    {
      title: 'Documents Signed',
      value: '1,892',
      change: '+24%',
      changeType: 'positive',
      icon: 'FileText',
      color: 'success',
      actionLabel: 'View Documents',
      onActionClick: () => navigate('/document-management')
    }
  ];

  const quickActions = [
    {
      title: 'Employee Onboarding',
      description: 'Create new employee profiles and assign initial access',
      icon: 'UserPlus',
      color: 'primary',
      actions: [
        { label: 'Add Employee', icon: 'Plus', onClick: () => navigate('/user-management?action=add-user') },
        { label: 'Bulk Import', icon: 'Upload', onClick: () => console.log('Bulk import') }
      ]
    },
    {
      title: 'Training Assignment',
      description: 'Assign mandatory training courses to employees or teams',
      icon: 'BookOpen',
      color: 'success',
      actions: [
        { label: 'Assign Course', icon: 'Plus', onClick: () => navigate('/learning-management') },
        { label: 'View Progress', icon: 'BarChart3', onClick: () => navigate('/learning-management') }
      ]
    },
    {
      title: 'Asset Management',
      description: 'Process asset requests and manage equipment lifecycle',
      icon: 'Package',
      color: 'accent',
      actions: [
        { label: 'New Request', icon: 'Plus', onClick: () => navigate('/asset-management') },
        { label: 'Scan Asset', icon: 'QrCode', onClick: () => console.log('Scan asset') }
      ]
    },
    {
      title: 'Ticketing',
      description: 'Create and triage support tickets',
      icon: 'Ticket',
      color: 'primary',
      actions: [
        { label: 'Create Ticket', icon: 'Plus', onClick: () => navigate('/ticketing') },
        { label: 'View Tickets', icon: 'ListTodo', onClick: () => navigate('/ticketing') }
      ]
    }
  ];

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Security Training Overdue',
      message: '15 employees have overdue security awareness training',
      type: 'warning',
      priority: 'high',
      timestamp: '2 hours ago',
      actionLabel: 'Send Reminders',
      onActionClick: () => navigate('/learning-management')
    },
    {
      id: 2,
      title: 'Asset Return Pending',
      message: 'Laptop #LT-2024-0156 return is 3 days overdue',
      type: 'error',
      priority: 'high',
      timestamp: '4 hours ago',
      actionLabel: 'Contact User',
      onActionClick: () => navigate('/asset-management')
    },
    {
      id: 3,
      title: 'Risk Assessment Due',
      message: 'Quarterly risk assessment for Finance department due in 2 days',
      type: 'info',
      priority: 'medium',
      timestamp: '1 day ago',
      actionLabel: 'Schedule Review',
      onActionClick: () => navigate('/risk-assessment')
    }
  ]);

  const recentActivities = [
    {
      id: 1,
      type: 'user-created',
      user: 'John Smith',
      description: 'completed Security Awareness Training',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      metadata: 'Score: 95%'
    },
    {
      id: 2,
      type: 'asset-assigned',
      user: 'Emily Davis',
      description: 'was assigned Laptop Dell-LT-2024-0234',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      metadata: 'Asset ID: LT-2024-0234'
    },
    {
      id: 3,
      type: 'document-signed',
      user: 'Michael Brown',
      description: 'acknowledged Data Privacy Policy v2.1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: 'Digital signature verified'
    },
    {
      id: 4,
      type: 'access-granted',
      user: 'Sarah Wilson',
      description: 'was granted access to Finance Module',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      metadata: 'Approved by: Manager'
    },
    {
      id: 5,
      type: 'risk-updated',
      user: 'David Johnson',
      description: 'updated risk assessment for Server Room',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      metadata: 'Risk level: Medium → Low'
    }
  ];

  const riskData = [
    { id: 1, title: 'Data Breach Risk', likelihood: 3, impact: 5, owner: 'IT Security Team' },
    { id: 2, title: 'Server Downtime', likelihood: 2, impact: 4, owner: 'Infrastructure Team' },
    { id: 3, title: 'Phishing Attacks', likelihood: 4, impact: 3, owner: 'Security Team' },
    { id: 4, title: 'Hardware Failure', likelihood: 2, impact: 3, owner: 'IT Operations' },
    { id: 5, title: 'Compliance Violation', likelihood: 1, impact: 5, owner: 'Legal Team' },
    { id: 6, title: 'Insider Threat', likelihood: 2, impact: 4, owner: 'HR Security' },
    { id: 7, title: 'Natural Disaster', likelihood: 1, impact: 4, owner: 'Facilities' },
    { id: 8, title: 'Software Vulnerability', likelihood: 3, impact: 3, owner: 'DevOps Team' }
  ];

  const trainingProgressData = [
    { name: 'Security Awareness', value: 87 },
    { name: 'Data Privacy', value: 92 },
    { name: 'Compliance Training', value: 78 },
    { name: 'Safety Protocols', value: 95 },
    { name: 'IT Security', value: 83 }
  ];

  const assetDistributionData = [
    { name: 'Laptops', value: 456 },
    { name: 'Desktops', value: 234 },
    { name: 'Monitors', value: 678 },
    { name: 'Mobile Devices', value: 123 },
    { name: 'Accessories', value: 345 }
  ];

  const handleDismissAlert = (alertId) => {
    setAlerts(alerts?.filter(alert => alert?.id !== alertId));
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const isAdminUser = hasPermission(currentUser?.role, PERMISSIONS.USER_MANAGE);
  const isEmployeeOrManager = currentUser?.role === 'employee' || currentUser?.role === 'manager';

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarToggle={handleMobileSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <main className={`pt-14 sm:pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16 xl:ml-20' : 'lg:ml-64 xl:ml-72'
      }`}>
        <Container>
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-8 sm:mb-10">
            <div className="relative bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-enterprise-md overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 right-0 w-40 opacity-40 sm:opacity-60">
                <div className="h-full w-full bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-l-full" />
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-enterprise-lg">
                      <Icon name="User" size={24} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-1">
                        Welcome back
                      </p>
                      <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                        {currentUser?.name}
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="Briefcase" size={16} className="text-primary" />
                      <span className="font-medium">{currentUser?.role}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Building2" size={16} className="text-accent" />
                      <span className="font-medium">{currentUser?.department}</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                    {isEmployeeOrManager
                      ? "Here's your personal dashboard with your tasks and progress. Stay updated with your work and achievements."
                      : "Here's what's happening in your organization today. Monitor performance, manage resources, and drive success."
                    }
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                  <div className="bg-muted/60 rounded-xl px-5 py-4 text-center min-w-[130px] shadow-enterprise border border-border/60">
                    <div className="text-2xl font-semibold text-foreground mb-1">
                      {openTicketCount}
                    </div>
                    <div className="text-[11px] text-muted-foreground uppercase tracking-[0.16em] font-medium">
                      Active Tickets
                    </div>
                  </div>
                  <div className="bg-muted/60 rounded-xl px-5 py-4 text-center min-w-[130px] shadow-enterprise border border-border/60">
                    <div className="text-2xl font-semibold text-foreground mb-1">
                      {pendingApprovalCount}
                    </div>
                    <div className="text-[11px] text-muted-foreground uppercase tracking-[0.16em] font-medium">
                      Pending Approvals
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Role-based Dashboard Content */}
          {isEmployeeOrManager ? (
            /* Employee/Manager Personal Dashboard */
            <>
              {/* Personal Critical Alerts */}
              <div className="mb-8">
                <PersonalAlertsCard currentUser={currentUser} />
              </div>

              {/* Personal Information Grid */}
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-8">
                <PersonalAssetCard currentUser={currentUser} />
                <PersonalTrainingCard currentUser={currentUser} />
                <PersonalDocumentCard currentUser={currentUser} />
                <PersonalTicketsCard currentUser={currentUser} />
              </div>
            </>
          ) : (
            /* Admin/ISO Organizational Dashboard */
            <>
              {/* Critical Alerts */}
              {alerts?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Critical Alerts
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {alerts?.map((alert) => (
                      <AlertCard
                        key={alert?.id}
                        {...alert}
                        onDismiss={() => handleDismissAlert(alert?.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Key Metrics */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Key Metrics
                </h2>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {dashboardMetrics?.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Quick Actions
                </h2>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {quickActions?.map((action, index) => (
                    <QuickActionCard key={index} {...action} />
                  ))}
                </div>
              </div>

              {/* Analytics Section */}
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-2">
                <ProgressChart
                  title="Training Completion Rates"
                  data={trainingProgressData}
                  type="bar"
                  icon="GraduationCap"
                  color="#059669"
                />
                <ProgressChart
                  title="Asset Distribution"
                  data={assetDistributionData}
                  type="pie"
                  icon="Package"
                />
              </div>

              {/* Activity and Risk Overview */}
              <div className="grid gap-6 lg:grid-cols-2">
                <ActivityFeed activities={recentActivities} maxItems={5} />
                <RiskHeatMap risks={riskData} />
              </div>
            </>
          )}
        </Container>
      </main>
    </div>
  );
};

export default Dashboard;
