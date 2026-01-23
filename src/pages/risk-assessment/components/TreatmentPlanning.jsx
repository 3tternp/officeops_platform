import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TreatmentPlanning = ({ risk, onSave, onClose }) => {
  const [treatmentPlan, setTreatmentPlan] = useState({
    strategy: risk?.treatmentStrategy || '',
    controls: risk?.controls || [],
    owner: risk?.treatmentOwner || '',
    dueDate: risk?.treatmentDueDate || '',
    budget: risk?.treatmentBudget || '',
    priority: risk?.treatmentPriority || 'Medium',
    description: risk?.treatmentDescription || '',
    milestones: risk?.treatmentMilestones || []
  });

  const [newControl, setNewControl] = useState({
    type: '',
    description: '',
    effectiveness: 'Medium',
    implementationDate: '',
    responsible: ''
  });

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    dueDate: '',
    description: '',
    status: 'Pending'
  });

  const treatmentStrategies = [
    { value: 'mitigate', label: 'Mitigate', description: 'Reduce likelihood or impact' },
    { value: 'accept', label: 'Accept', description: 'Accept the risk as is' },
    { value: 'transfer', label: 'Transfer', description: 'Transfer risk to third party' },
    { value: 'avoid', label: 'Avoid', description: 'Eliminate the risk entirely' }
  ];

  const controlTypes = [
    'Preventive Control',
    'Detective Control',
    'Corrective Control',
    'Administrative Control',
    'Technical Control',
    'Physical Control'
  ];

  const effectivenessLevels = ['Low', 'Medium', 'High'];
  const priorityLevels = ['Low', 'Medium', 'High', 'Critical'];

  const handleAddControl = () => {
    if (newControl?.type && newControl?.description) {
      setTreatmentPlan(prev => ({
        ...prev,
        controls: [...prev?.controls, { ...newControl, id: Date.now() }]
      }));
      setNewControl({
        type: '',
        description: '',
        effectiveness: 'Medium',
        implementationDate: '',
        responsible: ''
      });
    }
  };

  const handleRemoveControl = (controlId) => {
    setTreatmentPlan(prev => ({
      ...prev,
      controls: prev?.controls?.filter(control => control?.id !== controlId)
    }));
  };

  const handleAddMilestone = () => {
    if (newMilestone?.title && newMilestone?.dueDate) {
      setTreatmentPlan(prev => ({
        ...prev,
        milestones: [...prev?.milestones, { ...newMilestone, id: Date.now() }]
      }));
      setNewMilestone({
        title: '',
        dueDate: '',
        description: '',
        status: 'Pending'
      });
    }
  };

  const handleRemoveMilestone = (milestoneId) => {
    setTreatmentPlan(prev => ({
      ...prev,
      milestones: prev?.milestones?.filter(milestone => milestone?.id !== milestoneId)
    }));
  };

  const handleSave = () => {
    onSave && onSave({ ...risk, ...treatmentPlan });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-900 border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-foreground">Treatment Planning</h2>
            <p className="text-sm text-muted-foreground mt-1">Risk: {risk?.title}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted rounded-full">
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Treatment Strategy */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Treatment Strategy</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {treatmentStrategies?.map(strategy => (
                <div
                  key={strategy?.value}
                  onClick={() => setTreatmentPlan(prev => ({ ...prev, strategy: strategy?.value }))}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    treatmentPlan?.strategy === strategy?.value
                      ? 'border-primary bg-primary/5 ring-1 ring-primary' :'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      treatmentPlan?.strategy === strategy?.value
                        ? 'border-primary bg-primary' :'border-muted-foreground'
                    }`}>
                      {treatmentPlan?.strategy === strategy?.value && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{strategy?.label}</p>
                      <p className="text-xs text-muted-foreground">{strategy?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Treatment Owner"
              type="text"
              value={treatmentPlan?.owner}
              onChange={(e) => setTreatmentPlan(prev => ({ ...prev, owner: e?.target?.value }))}
              placeholder="Assign responsible person"
            />
            
            <Input
              label="Due Date"
              type="date"
              value={treatmentPlan?.dueDate}
              onChange={(e) => setTreatmentPlan(prev => ({ ...prev, dueDate: e?.target?.value }))}
            />
            
            <Input
              label="Budget (USD)"
              type="number"
              value={treatmentPlan?.budget}
              onChange={(e) => setTreatmentPlan(prev => ({ ...prev, budget: e?.target?.value }))}
              placeholder="0.00"
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
              <select
                value={treatmentPlan?.priority}
                onChange={(e) => setTreatmentPlan(prev => ({ ...prev, priority: e?.target?.value }))}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {priorityLevels?.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Treatment Description</label>
            <textarea
              value={treatmentPlan?.description}
              onChange={(e) => setTreatmentPlan(prev => ({ ...prev, description: e?.target?.value }))}
              placeholder="Describe the treatment approach and expected outcomes..."
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Controls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Risk Controls</h3>
              <span className="text-sm text-muted-foreground">
                {treatmentPlan?.controls?.length} control{treatmentPlan?.controls?.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Add New Control */}
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-foreground mb-3">Add New Control</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Control Type</label>
                  <select
                    value={newControl?.type}
                    onChange={(e) => setNewControl(prev => ({ ...prev, type: e?.target?.value }))}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select type</option>
                    {controlTypes?.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Effectiveness</label>
                  <select
                    value={newControl?.effectiveness}
                    onChange={(e) => setNewControl(prev => ({ ...prev, effectiveness: e?.target?.value }))}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {effectivenessLevels?.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <Input
                  label="Implementation Date"
                  type="date"
                  value={newControl?.implementationDate}
                  onChange={(e) => setNewControl(prev => ({ ...prev, implementationDate: e?.target?.value }))}
                />
                
                <Input
                  label="Responsible Person"
                  type="text"
                  value={newControl?.responsible}
                  onChange={(e) => setNewControl(prev => ({ ...prev, responsible: e?.target?.value }))}
                  placeholder="Who will implement this control?"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-foreground mb-1">Control Description</label>
                <textarea
                  value={newControl?.description}
                  onChange={(e) => setNewControl(prev => ({ ...prev, description: e?.target?.value }))}
                  placeholder="Describe how this control will mitigate the risk..."
                  rows={2}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              
              <Button onClick={handleAddControl} size="sm">
                <Icon name="Plus" size={16} className="mr-2" />
                Add Control
              </Button>
            </div>

            {/* Controls List */}
            <div className="space-y-3">
              {treatmentPlan?.controls?.map((control, index) => (
                <div key={control?.id || index} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                          {control?.type}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          control?.effectiveness === 'High' ? 'bg-success/10 text-success' :
                          control?.effectiveness === 'Medium'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                        }`}>
                          {control?.effectiveness} Effectiveness
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2">{control?.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Due: {control?.implementationDate}</span>
                        <span>Responsible: {control?.responsible}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveControl(control?.id)}
                      className="text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Implementation Milestones</h3>
              <span className="text-sm text-muted-foreground">
                {treatmentPlan?.milestones?.length} milestone{treatmentPlan?.milestones?.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Add New Milestone */}
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-foreground mb-3">Add New Milestone</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <Input
                  label="Milestone Title"
                  type="text"
                  value={newMilestone?.title}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e?.target?.value }))}
                  placeholder="e.g., Control implementation complete"
                />
                
                <Input
                  label="Due Date"
                  type="date"
                  value={newMilestone?.dueDate}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, dueDate: e?.target?.value }))}
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  value={newMilestone?.description}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e?.target?.value }))}
                  placeholder="Describe what needs to be accomplished..."
                  rows={2}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              
              <Button onClick={handleAddMilestone} size="sm">
                <Icon name="Plus" size={16} className="mr-2" />
                Add Milestone
              </Button>
            </div>

            {/* Milestones List */}
            <div className="space-y-3">
              {treatmentPlan?.milestones?.map((milestone, index) => (
                <div key={milestone?.id || index} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-foreground">{milestone?.title}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          milestone?.status === 'Completed' ? 'bg-success/10 text-success' :
                          milestone?.status === 'In Progress'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                        }`}>
                          {milestone?.status}
                        </span>
                      </div>
                      {milestone?.description && (
                        <p className="text-sm text-muted-foreground mb-2">{milestone?.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">Due: {milestone?.dueDate}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMilestone(milestone?.id)}
                      className="text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Icon name="Save" size={16} className="mr-2" />
            Save Treatment Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanning;