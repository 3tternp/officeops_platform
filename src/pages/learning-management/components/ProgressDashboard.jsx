import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ProgressDashboard = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const timeRangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'Information Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' }
  ];

  const completionData = [
    { month: 'Jan', completed: 45, inProgress: 23, notStarted: 12 },
    { month: 'Feb', completed: 52, inProgress: 28, notStarted: 15 },
    { month: 'Mar', completed: 61, inProgress: 32, notStarted: 18 },
    { month: 'Apr', completed: 58, inProgress: 35, notStarted: 22 },
    { month: 'May', completed: 67, inProgress: 29, notStarted: 19 },
    { month: 'Jun', completed: 74, inProgress: 31, notStarted: 16 }
  ];

  const departmentProgress = [
    { name: 'IT', value: 85, color: '#3b82f6' },
    { name: 'HR', value: 92, color: '#10b981' },
    { name: 'Finance', value: 78, color: '#f59e0b' },
    { name: 'Marketing', value: 88, color: '#8b5cf6' },
    { name: 'Operations', value: 82, color: '#ef4444' }
  ];

  const engagementTrend = [
    { week: 'Week 1', timeSpent: 4.2, completions: 12 },
    { week: 'Week 2', timeSpent: 5.1, completions: 18 },
    { week: 'Week 3', timeSpent: 3.8, completions: 15 },
    { week: 'Week 4', timeSpent: 6.2, completions: 22 }
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', department: 'HR', coursesCompleted: 12, avgScore: 94 },
    { name: 'Mike Chen', department: 'IT', coursesCompleted: 11, avgScore: 91 },
    { name: 'Emily Davis', department: 'Marketing', coursesCompleted: 10, avgScore: 89 },
    { name: 'John Smith', department: 'Finance', coursesCompleted: 9, avgScore: 87 },
    { name: 'Lisa Wang', department: 'Operations', coursesCompleted: 8, avgScore: 85 }
  ];

  const overdueCourses = [
    { course: 'Security Awareness Training', assignees: 15, daysOverdue: 5 },
    { course: 'Data Privacy Fundamentals', assignees: 8, daysOverdue: 3 },
    { course: 'Project Management Basics', assignees: 12, daysOverdue: 7 },
    { course: 'Customer Service Excellence', assignees: 6, daysOverdue: 2 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Progress Dashboard</h2>
          <p className="text-sm text-muted-foreground">Track learning progress and engagement metrics</p>
        </div>
        <div className="flex space-x-3">
          <Select
            options={departmentOptions}
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            className="w-48"
          />
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="w-40"
          />
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export
          </Button>
        </div>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Enrollments</p>
              <p className="text-2xl font-bold text-foreground">1,247</p>
              <p className="text-sm text-success flex items-center mt-1">
                <Icon name="TrendingUp" size={14} className="mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icon name="Users" size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold text-foreground">84.2%</p>
              <p className="text-sm text-success flex items-center mt-1">
                <Icon name="TrendingUp" size={14} className="mr-1" />
                +3.2% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Time Spent</p>
              <p className="text-2xl font-bold text-foreground">4.8h</p>
              <p className="text-sm text-warning flex items-center mt-1">
                <Icon name="Minus" size={14} className="mr-1" />
                -0.3h from last month
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Icon name="Clock" size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Certificates Issued</p>
              <p className="text-2xl font-bold text-foreground">892</p>
              <p className="text-sm text-success flex items-center mt-1">
                <Icon name="TrendingUp" size={14} className="mr-1" />
                +18% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Icon name="Award" size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trends */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Completion Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
                <Bar dataKey="notStarted" stackId="a" fill="#ef4444" name="Not Started" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Progress */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Department Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentProgress}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentProgress?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Engagement Trend */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="timeSpent" stroke="#3b82f6" name="Time Spent (hours)" />
              <Line yAxisId="right" type="monotone" dataKey="completions" stroke="#10b981" name="Completions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bottom Row - Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Top Performers</h3>
            <Button variant="ghost" size="sm" iconName="ExternalLink">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {topPerformers?.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{performer?.name}</p>
                    <p className="text-sm text-muted-foreground">{performer?.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{performer?.coursesCompleted} courses</p>
                  <p className="text-sm text-muted-foreground">{performer?.avgScore}% avg score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Courses */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Overdue Assignments</h3>
            <Button variant="ghost" size="sm" iconName="AlertTriangle" className="text-warning">
              Send Reminders
            </Button>
          </div>
          <div className="space-y-3">
            {overdueCourses?.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{course?.course}</p>
                  <p className="text-sm text-muted-foreground">{course?.assignees} assignees</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-warning/10 text-warning">
                    {course?.daysOverdue} days overdue
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;