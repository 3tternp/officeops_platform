import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const ProgressChart = ({ 
  title, 
  data = [], 
  type = 'bar', 
  icon,
  color = '#1e40af',
  height = 300 
}) => {
  const COLORS = ['#1e40af', '#059669', '#d97706', '#dc2626', '#0ea5e9'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-enterprise-lg p-3">
          <p className="text-sm font-medium text-popover-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span className="font-medium" style={{ color: entry?.color }}>
                {entry?.name}:
              </span>
              {' '}{entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-enterprise">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {icon && <Icon name={icon} size={20} className="text-muted-foreground" />}
        </div>
      </div>
      <div className="p-6">
        {data?.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="BarChart3" size={48} className="text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No data available</p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {type === 'bar' ? renderBarChart() : renderPieChart()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;