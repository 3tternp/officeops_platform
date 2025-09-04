import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import dataService from '../../../services/DataService';

const AssignmentPanel = ({ courses, onAssign, onClose }) => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [assignmentType, setAssignmentType] = useState('individual');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [sendNotification, setSendNotification] = useState(true);
  const [escalationDays, setEscalationDays] = useState('7');
  
  // Data from DataService
  const [allUsers, setAllUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  // Load data from DataService on component mount
  useEffect(() => {
    const loadData = () => {
      const users = dataService.getUsers();
      const depts = dataService.getDepartments();
      const userRoles = dataService.getRoles();
      
      setAllUsers(users);
      setDepartments(depts);
      setRoles(userRoles);
      
      // Set default to assign to all employees
      const activeUsers = users.filter(user => user.status === 'active');
      setSelectedUsers(activeUsers.map(user => user.id));
    };
    loadData();
  }, []);

  // Reset selected targets when assignment type changes
  useEffect(() => {
    if (assignmentType === 'individual') {
      // Set default to all employees for individual assignment
      const activeUsers = allUsers.filter(user => user.status === 'active');
      setSelectedUsers(activeUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
    setSelectedTeams([]);
    setSelectedRoles([]);
    setSelectedDepartments([]);
  }, [assignmentType, allUsers]);

  const assignmentTypeOptions = [
    { value: 'individual', label: 'Individual Users' },
    { value: 'team', label: 'Teams' },
    { value: 'role', label: 'Roles' },
    { value: 'department', label: 'Departments' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  // Generate dynamic options based on loaded data
  const getUserOptions = () => {
    if (assignmentType === 'individual') {
      // For individual users, show all employees/users
      return allUsers
        .filter(user => user.status === 'active')
        .map(user => ({
          value: user.id,
          label: `${user.name} (${user.email})`,
          department: user.department,
          role: user.role
        }));
    } else {
      // For other assignment types, filter by department-based users
      return allUsers
        .filter(user => user.status === 'active' && selectedDepartments.includes(user.department))
        .map(user => ({
          value: user.id,
          label: `${user.name} (${user.email})`,
          department: user.department,
          role: user.role
        }));
    }
  };

  const getTeamOptions = () => {
    // Generate teams based on departments - simplified approach
    const teams = departments.map(dept => ({
      value: `team_${dept.id}`,
      label: `${dept.name} Team`,
      department: dept.name
    }));
    return teams;
  };

  const getRoleOptions = () => {
    return roles.map(role => ({
      value: role.id,
      label: role.name,
      description: role.description
    }));
  };

  const getDepartmentOptions = () => {
    return departments
      .filter(dept => dept.status === 'active')
      .map(dept => ({
        value: dept.name,
        label: dept.name,
        description: dept.description
      }));
  };

  const handleCourseSelection = (courseId) => {
    setSelectedCourses(prev => 
      prev?.includes(courseId) 
        ? prev?.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAllCourses = () => {
    if (selectedCourses?.length === courses?.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses?.map(course => course?.id));
    }
  };

  const handleAssignment = () => {
    let targets = [];
    let additionalData = {};
    
    switch (assignmentType) {
      case 'individual':
        targets = selectedUsers;
        break;
      case 'team':
        targets = selectedTeams;
        break;
      case 'role':
        targets = selectedRoles;
        break;
      case 'department':
        // For department assignment, include both departments and specific users
        targets = selectedDepartments;
        additionalData.departmentUsers = selectedUsers;
        break;
      default:
        targets = [];
    }

    const assignmentData = {
      courses: selectedCourses,
      assignmentType,
      targets,
      ...additionalData,
      dueDate,
      priority,
      sendNotification,
      escalationDays: parseInt(escalationDays)
    };

    onAssign(assignmentData);
  };

  const isAssignmentValid = () => {
    if (selectedCourses?.length === 0 || !dueDate) {
      return false;
    }

    switch (assignmentType) {
      case 'individual':
        return selectedUsers?.length > 0;
      case 'team':
        return selectedTeams?.length > 0;
      case 'role':
        return selectedRoles?.length > 0;
      case 'department':
        // For department assignment, we need both departments selected and users from those departments
        return selectedDepartments?.length > 0 && selectedUsers?.length > 0;
      default:
        return false;
    }
  };

  const getTargetOptions = () => {
    switch (assignmentType) {
      case 'individual': return getUserOptions();
      case 'team': return getTeamOptions();
      case 'role': return getRoleOptions();
      case 'department': return getDepartmentOptions();
      default: return [];
    }
  };

  const getSelectedTargets = () => {
    switch (assignmentType) {
      case 'individual': return selectedUsers;
      case 'team': return selectedTeams;
      case 'role': return selectedRoles;
      case 'department': return selectedDepartments;
      default: return [];
    }
  };

  const setSelectedTargets = (targets) => {
    switch (assignmentType) {
      case 'individual': setSelectedUsers(targets); break;
      case 'team': setSelectedTeams(targets); break;
      case 'role': setSelectedRoles(targets); break;
      case 'department': setSelectedDepartments(targets); break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-enterprise-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Bulk Course Assignment</h2>
            <p className="text-sm text-muted-foreground">Assign courses to users, teams, or roles</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-8rem)]">
          {/* Course Selection */}
          <div className="w-1/2 border-r border-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Select Courses</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllCourses}
              >
                {selectedCourses?.length === courses?.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="space-y-3">
              {courses?.map((course) => (
                <div
                  key={course?.id}
                  className={`p-3 border border-border rounded-lg cursor-pointer transition-colors ${
                    selectedCourses?.includes(course?.id) 
                      ? 'bg-primary/5 border-primary' :'hover:bg-muted'
                  }`}
                  onClick={() => handleCourseSelection(course?.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedCourses?.includes(course?.id)}
                      onChange={() => handleCourseSelection(course?.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground">{course?.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {course?.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>{course?.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Users" size={12} />
                          <span>{course?.enrolledCount}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Configuration */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <h3 className="font-medium text-foreground mb-4">Assignment Configuration</h3>

            <div className="space-y-4">
              <Select
                label="Assignment Type"
                options={assignmentTypeOptions}
                value={assignmentType}
                onChange={setAssignmentType}
              />

              {assignmentType === 'department' && (
                <Select
                  label="Select Departments"
                  options={getDepartmentOptions()}
                  value={selectedDepartments}
                  onChange={setSelectedDepartments}
                  multiple
                  searchable
                  placeholder="Choose departments..."
                  description="Select departments first, then users from those departments will be available"
                />
              )}

              {assignmentType !== 'department' && (
                <Select
                  label={`Select ${assignmentType === 'individual' ? 'Users' : 
                                  assignmentType === 'team' ? 'Teams' : 
                                  assignmentType === 'role' ? 'Roles' : 'Targets'}`}
                  options={getTargetOptions()}
                  value={getSelectedTargets()}
                  onChange={setSelectedTargets}
                  multiple
                  searchable
                  placeholder={`Choose ${assignmentType}s...`}
                  description={assignmentType === 'individual' ? 'All active employees are available for individual assignment' : undefined}
                />
              )}

              {assignmentType === 'department' && selectedDepartments.length > 0 && (
                <Select
                  label="Select Users from Departments"
                  options={getUserOptions()}
                  value={selectedUsers}
                  onChange={setSelectedUsers}
                  multiple
                  searchable
                  placeholder="Choose users from selected departments..."
                  description={`Users from ${selectedDepartments.join(', ')}`}
                />
              )}

              <Input
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e?.target?.value)}
                required
              />

              <Select
                label="Priority"
                options={priorityOptions}
                value={priority}
                onChange={setPriority}
              />

              <Input
                label="Escalation Days"
                type="number"
                value={escalationDays}
                onChange={(e) => setEscalationDays(e?.target?.value)}
                description="Send reminder after this many days"
                min="1"
                max="30"
              />

              <div className="space-y-3">
                <Checkbox
                  label="Send Email Notification"
                  description="Notify assignees about new course assignments"
                  checked={sendNotification}
                  onChange={(e) => setSendNotification(e?.target?.checked)}
                />
              </div>

              {/* Assignment Summary */}
              <div className="bg-muted rounded-lg p-4 mt-6">
                <h4 className="font-medium text-foreground mb-2">Assignment Summary</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Selected Courses:</span>
                    <span className="font-medium">{selectedCourses?.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target {assignmentType}s:</span>
                    <span className="font-medium">{getSelectedTargets()?.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span className="font-medium">{dueDate || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority:</span>
                    <span className="font-medium capitalize">{priority}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {selectedCourses?.length} course(s) selected for {getSelectedTargets()?.length} {assignmentType}(s)
            {assignmentType === 'department' && selectedUsers?.length > 0 && (
              <span> ({selectedUsers?.length} specific users)</span>
            )}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAssignment}
              disabled={!isAssignmentValid()}
              iconName="Send"
              iconPosition="left"
            >
              Create Assignment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPanel;