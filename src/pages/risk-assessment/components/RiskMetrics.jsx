import React from 'react';
import Icon from '../../../components/AppIcon';

// Simple Pie Chart Component
const PieChart = ({ data, size = 120, showLabels = true }) => {
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Calculate total and angles
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const segments = data.map((item) => {
    const angle = (item.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const x1 = centerX + Math.cos(startAngle - Math.PI / 2) * radius;
    const y1 = centerY + Math.sin(startAngle - Math.PI / 2) * radius;
    const x2 = centerX + Math.cos(endAngle - Math.PI / 2) * radius;
    const y2 = centerY + Math.sin(endAngle - Math.PI / 2) * radius;
    
    const largeArc = angle > Math.PI ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    currentAngle += angle;
    
    return {
      ...item,
      pathData,
      percentage: ((item.value / total) * 100).toFixed(1)
    };
  });
  
  if (total === 0) {
    return (
      <div 
        style={{ width: size, height: size }}
        className="flex items-center justify-center bg-muted/20 rounded-full"
      >
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    );
  }
  
  return (
    <div style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.pathData}
            fill={segment.color}
            stroke="white"
            strokeWidth={2}
            className="hover:opacity-80 transition-opacity"
          />
        ))}
      </svg>
      {showLabels && (
        <div className="mt-2 space-y-1">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded"
                  style={{ backgroundColor: segment.color }}
                />
                <span>{segment.name}</span>
              </div>
              <span>{segment.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get risk level color
const getRiskLevelColor = (score) => {
  if (score >= 20) return '#dc2626'; // red-600
  if (score >= 15) return '#ea580c'; // orange-600
  if (score >= 10) return '#ca8a04'; // yellow-600
  if (score >= 5) return '#65a30d'; // lime-600
  return '#16a34a'; // green-600
};

// Helper function to get risk level distribution
const getRiskLevelDistribution = (risks, type) => {
  const distribution = { 'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0, 'Very Low': 0 };
  
  risks.forEach(risk => {
    let score;
    if (type === 'pre') {
      score = risk.pretreatmentRiskScore || (risk.likelihood * risk.impact);
    } else {
      score = risk.postTreatmentRiskScore || Math.max(1, (risk.likelihood * risk.impact) - (risk.treatmentEffectiveness || 5));
    }
    
    let level;
    if (score >= 20) level = 'Critical';
    else if (score >= 15) level = 'High';
    else if (score >= 10) level = 'Medium';
    else if (score >= 5) level = 'Low';
    else level = 'Very Low';
    
    distribution[level]++;
  });
  
  const colors = {
    'Critical': 'bg-red-600',
    'High': 'bg-red-500', 
    'Medium': 'bg-yellow-500',
    'Low': 'bg-yellow-400',
    'Very Low': 'bg-green-500'
  };
  
  return Object.entries(distribution)
    .filter(([_, count]) => count > 0)
    .map(([level, count]) => ({
      level,
      count,
      color: colors[level]
    }));
};

const RiskMetrics = ({ risks = [] }) => {
  // Calculate metrics
  const totalRisks = risks?.length;
  const openRisks = risks?.filter(risk => risk?.status === 'Open')?.length;
  const criticalRisks = risks?.filter(risk => (risk?.likelihood * risk?.impact) >= 20)?.length;
  const overdueReviews = risks?.filter(risk => risk?.reviewStatus === 'Overdue')?.length;

  const risksByCategory = risks?.reduce((acc, risk) => {
    acc[risk.category] = (acc?.[risk?.category] || 0) + 1;
    return acc;
  }, {});

  const risksByLevel = risks?.reduce((acc, risk) => {
    const score = risk?.likelihood * risk?.impact;
    let level;
    if (score >= 20) level = 'Critical';
    else if (score >= 15) level = 'High';
    else if (score >= 10) level = 'Medium';
    else if (score >= 5) level = 'Low';
    else level = 'Very Low';
    
    acc[level] = (acc?.[level] || 0) + 1;
    return acc;
  }, {});

  const treatmentProgress = risks?.reduce((acc, risk) => {
    acc[risk.treatmentStatus] = (acc?.[risk?.treatmentStatus] || 0) + 1;
    return acc;
  }, {});

  const averageRiskScore = totalRisks > 0 
    ? (risks?.reduce((sum, risk) => sum + (risk?.likelihood * risk?.impact), 0) / totalRisks)?.toFixed(1)
    : 0;

  const metrics = [
    {
      title: 'Total Risks',
      value: totalRisks,
      icon: 'AlertTriangle',
      color: 'text-foreground',
      bgColor: 'bg-muted',
      change: '+2 this month',
      changeType: 'neutral'
    },
    {
      title: 'Open Risks',
      value: openRisks,
      icon: 'AlertCircle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: `${((openRisks / totalRisks) * 100)?.toFixed(0)}% of total`,
      changeType: 'negative'
    },
    {
      title: 'Critical Risks',
      value: criticalRisks,
      icon: 'AlertOctagon',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: criticalRisks > 0 ? 'Immediate attention required' : 'No critical risks',
      changeType: criticalRisks > 0 ? 'negative' : 'positive'
    },
    {
      title: 'Overdue Reviews',
      value: overdueReviews,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: overdueReviews > 0 ? 'Action required' : 'All up to date',
      changeType: overdueReviews > 0 ? 'negative' : 'positive'
    },
    {
      title: 'Average Risk Score',
      value: averageRiskScore,
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: 'Organizational risk level',
      changeType: 'neutral'
    },
    {
      title: 'Treatment Progress',
      value: `${Math.round((treatmentProgress?.['Completed'] || 0) / totalRisks * 100)}%`,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: `${treatmentProgress?.['Completed'] || 0} completed`,
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric?.bgColor}`}>
                <Icon name={metric?.icon} size={20} className={metric?.color} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">{metric?.title}</p>
              <p className={`text-xs ${
                metric?.changeType === 'positive' ? 'text-success' :
                metric?.changeType === 'negative'? 'text-error' : 'text-muted-foreground'
              }`}>
                {metric?.change}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk by Category */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Risks by Category</h3>
          <div className="space-y-3">
            {Object.entries(risksByCategory)?.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(count / totalRisks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk by Level */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Risks by Level</h3>
          <div className="space-y-3">
            {Object.entries(risksByLevel)?.map(([level, count]) => {
              const colors = {
                'Critical': 'bg-red-600',
                'High': 'bg-red-500',
                'Medium': 'bg-yellow-500',
                'Low': 'bg-yellow-400',
                'Very Low': 'bg-green-500'
              };
              
              return (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded ${colors?.[level]}`}></div>
                    <span className="text-sm text-foreground">{level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors?.[level]}`}
                        style={{ width: `${(count / totalRisks) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-foreground w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pre-Treatment Risk Status */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pre-Treatment Risk Status</h3>
          <div className="relative flex items-center justify-center mb-4">
            <PieChart 
              data={risks?.map(risk => ({
                name: risk.category,
                value: risk.pretreatmentRiskScore || (risk.likelihood * risk.impact),
                color: getRiskLevelColor(risk.pretreatmentRiskScore || (risk.likelihood * risk.impact))
              }))}
              size={120}
              showLabels={false}
            />
          </div>
          <div className="space-y-2">
            {getRiskLevelDistribution(risks, 'pre')?.map(({level, count, color}) => (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded ${color}`}></div>
                  <span className="text-sm text-foreground">{level}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Post-Treatment Risk Status */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Post-Treatment Risk Status</h3>
          <div className="relative flex items-center justify-center mb-4">
            <PieChart 
              data={risks?.map(risk => ({
                name: risk.category,
                value: risk.postTreatmentRiskScore || Math.max(1, (risk.likelihood * risk.impact) - (risk.treatmentEffectiveness || 5)),
                color: getRiskLevelColor(risk.postTreatmentRiskScore || Math.max(1, (risk.likelihood * risk.impact) - (risk.treatmentEffectiveness || 5)))
              }))}
              size={120}
              showLabels={false}
            />
          </div>
          <div className="space-y-2">
            {getRiskLevelDistribution(risks, 'post')?.map(({level, count, color}) => (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded ${color}`}></div>
                  <span className="text-sm text-foreground">{level}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Risk Comparison Summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Treatment Impact Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-error mb-2">
              {risks?.filter(r => (r.pretreatmentRiskScore || (r.likelihood * r.impact)) >= 15)?.length}
            </div>
            <p className="text-sm text-muted-foreground">High Risks (Pre-Treatment)</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">
              {risks?.filter(r => (r.postTreatmentRiskScore || Math.max(1, (r.likelihood * r.impact) - 5)) >= 15)?.length}
            </div>
            <p className="text-sm text-muted-foreground">High Risks (Post-Treatment)</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {risks?.filter(r => (r.pretreatmentRiskScore || (r.likelihood * r.impact)) >= 15)?.length - 
               risks?.filter(r => (r.postTreatmentRiskScore || Math.max(1, (r.likelihood * r.impact) - 5)) >= 15)?.length}
            </div>
            <p className="text-sm text-muted-foreground">Risks Reduced</p>
          </div>
        </div>
      </div>
      
      {/* Risk Trend Chart Placeholder */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Risk Trend Analysis</h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded">6M</button>
            <button className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded">1Y</button>
            <button className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded">All</button>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="text-center">
            <Icon name="TrendingUp" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Risk trend chart would be displayed here</p>
            <p className="text-sm text-muted-foreground/80">Integration with charting library required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMetrics;