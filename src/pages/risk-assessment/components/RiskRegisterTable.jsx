import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RiskRegisterTable = ({
  risks = [],
  onRiskClick,
  onEditRisk,
  onDeleteRisk,
  onAddRisk,
  canManage = false,
  canDelete = false,
  canCreate = false
}) => {
  const [sortField, setSortField] = useState('riskScore');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedRisks, setSelectedRisks] = useState([]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectRisk = (riskId) => {
    setSelectedRisks(prev => 
      prev?.includes(riskId) 
        ? prev?.filter(id => id !== riskId)
        : [...prev, riskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRisks?.length === risks?.length) {
      setSelectedRisks([]);
    } else {
      setSelectedRisks(risks?.map(risk => risk?.id));
    }
  };

  const sortedRisks = [...risks]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'riskScore') {
      aValue = a?.likelihood * a?.impact;
      bValue = b?.likelihood * b?.impact;
    }

    if (sortField === 'owner') {
      aValue = a?.owner || a?.riskOwner || '';
      bValue = b?.owner || b?.riskOwner || '';
    }

    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getRiskScoreColor = (likelihood, impact) => {
    const score = likelihood * impact;
    if (score >= 20) return 'bg-error text-error-foreground';
    if (score >= 15) return 'bg-error/80 text-error-foreground';
    if (score >= 10) return 'bg-warning text-warning-foreground';
    if (score >= 5) return 'bg-warning/80 text-warning-foreground';
    return 'bg-success text-success-foreground';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-error/10 text-error border-error/20';
      case 'In Progress': return 'bg-warning/10 text-warning border-warning/20';
      case 'Closed': return 'bg-success/10 text-success border-success/20';
      case 'Under Review': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTreatmentStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return 'bg-muted text-muted-foreground';
      case 'In Progress': return 'bg-warning/10 text-warning';
      case 'Completed': return 'bg-success/10 text-success';
      case 'Overdue': return 'bg-error/10 text-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-foreground" />
      : <Icon name="ArrowDown" size={14} className="text-foreground" />;
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Risk Register</h3>
            <p className="text-sm text-muted-foreground">
              {risks?.length} risks • {selectedRisks?.length} selected
            </p>
          </div>
          
          <div className="flex items-center flex-wrap gap-2">
            {selectedRisks?.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="Download" size={16} className="mr-2" />
                  Export Selected
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Archive" size={16} className="mr-2" />
                  Archive
                </Button>
              </div>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={onAddRisk}
              disabled={!canCreate}
              title={canCreate ? '' : 'Only Admin or ISO users can create risk assessments'}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Add Risk
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedRisks?.length === risks?.length && risks?.length > 0}
                  onChange={handleSelectAll}
                  disabled={!canManage}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary"
                >
                  <span>Risk ID</span>
                  <SortIcon field="id" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary"
                >
                  <span>Risk Description</span>
                  <SortIcon field="title" />
                </button>
              </th>
              <th className="text-left p-4 hidden md:table-cell">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary"
                >
                  <span>Category</span>
                  <SortIcon field="category" />
                </button>
              </th>
              <th className="text-center p-4">
                <button
                  onClick={() => handleSort('likelihood')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary"
                >
                  <span>Likelihood</span>
                  <SortIcon field="likelihood" />
                </button>
              </th>
              <th className="text-center p-4">
                <button
                  onClick={() => handleSort('impact')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary"
                >
                  <span>Impact</span>
                  <SortIcon field="impact" />
                </button>
              </th>
              <th className="text-center p-4">
                <button
                  onClick={() => handleSort('riskScore')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary"
                >
                  <span>Risk Score</span>
                  <SortIcon field="riskScore" />
                </button>
              </th>
              <th className="text-left p-4 hidden lg:table-cell">
                <button
                  onClick={() => handleSort('owner')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary"
                >
                  <span>Owner</span>
                  <SortIcon field="owner" />
                </button>
              </th>
              <th className="text-left p-4 hidden md:table-cell">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left p-4 hidden lg:table-cell">
                <button
                  onClick={() => handleSort('treatmentStatus')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary"
                >
                  <span>Treatment</span>
                  <SortIcon field="treatmentStatus" />
                </button>
              </th>
              <th className="text-left p-4 hidden xl:table-cell">
                <button
                  onClick={() => handleSort('nextReviewDate')}
                  className="flex items-center space-x-2 font-medium text-foreground hover:text-primary"
                >
                  <span>Next Review</span>
                  <SortIcon field="nextReviewDate" />
                </button>
              </th>
              <th className="w-24 p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedRisks?.map((risk) => (
              <tr 
                key={risk?.id} 
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onRiskClick && onRiskClick(risk)}
              >
                <td className="p-4" onClick={(e) => e?.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRisks?.includes(risk?.id)}
                    onChange={() => handleSelectRisk(risk?.id)}
                    disabled={!canManage}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-foreground">{risk?.id}</span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{risk?.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{risk?.description}</p>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                    {risk?.category}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="font-medium text-foreground">{risk?.likelihood}</span>
                </td>
                <td className="p-4 text-center">
                  <span className="font-medium text-foreground">{risk?.impact}</span>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskScoreColor(risk?.likelihood, risk?.impact)}`}>
                    {risk?.likelihood * risk?.impact}
                  </span>
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <div className="flex items-center space-x-2">
                    {Boolean(risk?.owner || risk?.riskOwner) && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">
                        {(risk?.owner || risk?.riskOwner)
                          ?.split(' ')
                          ?.map(n => n?.[0])
                          ?.join('')}
                      </span>
                    </div>
                    )}
                    <span className="text-sm text-foreground">{risk?.owner || risk?.riskOwner || 'Unassigned'}</span>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(risk?.status)}`}>
                    {risk?.status}
                  </span>
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTreatmentStatusColor(risk?.treatmentStatus)}`}>
                    {risk?.treatmentStatus}
                  </span>
                </td>
                <td className="p-4 hidden xl:table-cell">
                  <span className="text-sm text-foreground">
                    {risk?.nextReviewDate ? new Date(risk?.nextReviewDate).toLocaleDateString() : 'N/A'}
                  </span>
                </td>
                <td className="p-4" onClick={(e) => e?.stopPropagation()}>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => canManage && onEditRisk && onEditRisk(risk)}
                      className="h-8 w-8"
                      disabled={!canManage}
                      title={canManage ? '' : 'Edit restricted to Admin/ISO'}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => canDelete && onDeleteRisk && onDeleteRisk(risk)}
                      className="h-8 w-8 text-error hover:text-error"
                      disabled={!canDelete}
                      title={canDelete ? '' : 'Delete restricted to Admin/ISO'}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {risks?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="AlertTriangle" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Risks Found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first risk assessment.</p>
          <Button
            variant="default"
            onClick={onAddRisk}
            disabled={!canCreate}
            title={canCreate ? '' : 'Only Admin or ISO users can create risk assessments'}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Risk
          </Button>
        </div>
      )}
    </div>
  );
};

export default RiskRegisterTable;