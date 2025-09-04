import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActionsPanel = ({ 
  selectedRequests, 
  onBulkApprove, 
  onBulkReject, 
  onBulkAssign, 
  onClearSelection,
  availableApprovers 
}) => {
  const [bulkAction, setBulkAction] = useState('');
  const [selectedApprover, setSelectedApprover] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  const actionOptions = [
    { value: '', label: 'Select Action' },
    { value: 'approve', label: 'Approve Selected' },
    { value: 'reject', label: 'Reject Selected' },
    { value: 'assign', label: 'Assign to Approver' },
    { value: 'export', label: 'Export Selected' }
  ];

  const approverOptions = [
    { value: '', label: 'Select Approver' },
    ...availableApprovers?.map(approver => ({
      value: approver?.id,
      label: `${approver?.name} (${approver?.department})`
    }))
  ];

  const rejectionReasons = [
    { value: '', label: 'Select Reason' },
    { value: 'insufficient-justification', label: 'Insufficient Business Justification' },
    { value: 'policy-violation', label: 'Policy Violation' },
    { value: 'security-risk', label: 'Security Risk Assessment' },
    { value: 'duplicate-request', label: 'Duplicate Request' },
    { value: 'other', label: 'Other (Manual Entry)' }
  ];

  const handleActionExecute = () => {
    if (!bulkAction) return;

    const actionData = {
      requestIds: selectedRequests?.map(req => req?.id),
      action: bulkAction,
      approver: selectedApprover,
      reason: rejectionReason
    };

    setConfirmationAction(actionData);
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (!confirmationAction) return;

    switch (confirmationAction?.action) {
      case 'approve':
        onBulkApprove(confirmationAction?.requestIds);
        break;
      case 'reject':
        onBulkReject(confirmationAction?.requestIds, confirmationAction?.reason);
        break;
      case 'assign':
        onBulkAssign(confirmationAction?.requestIds, confirmationAction?.approver);
        break;
      case 'export':
        handleExport(confirmationAction?.requestIds);
        break;
    }

    setShowConfirmation(false);
    setConfirmationAction(null);
    setBulkAction('');
    setSelectedApprover('');
    setRejectionReason('');
  };

  const handleExport = (requestIds) => {
    const exportData = selectedRequests?.filter(req => requestIds?.includes(req?.id));
    const csvContent = convertToCSV(exportData);
    downloadCSV(csvContent, 'access-requests-export.csv');
  };

  const convertToCSV = (data) => {
    const headers = ['ID', 'Requestor', 'Resource', 'Status', 'Request Date', 'Due Date', 'Justification'];
    const rows = data?.map(req => [
      req?.id,
      req?.requestor,
      req?.resource,
      req?.status,
      new Date(req.requestDate)?.toLocaleDateString(),
      new Date(req.dueDate)?.toLocaleDateString(),
      `"${req?.justification}"`
    ]);
    
    return [headers, ...rows]?.map(row => row?.join(','))?.join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const getActionSummary = () => {
    const count = selectedRequests?.length;
    switch (bulkAction) {
      case 'approve':
        return `Approve ${count} request${count !== 1 ? 's' : ''}`;
      case 'reject':
        return `Reject ${count} request${count !== 1 ? 's' : ''}`;
      case 'assign':
        return `Assign ${count} request${count !== 1 ? 's' : ''} to approver`;
      case 'export':
        return `Export ${count} request${count !== 1 ? 's' : ''}`;
      default:
        return '';
    }
  };

  if (selectedRequests?.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="CheckSquare" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Bulk Actions</h3>
              <p className="text-sm text-muted-foreground">
                {selectedRequests?.length} request{selectedRequests?.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
          >
            <Icon name="X" size={16} className="mr-1" />
            Clear Selection
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Select
            label="Action"
            options={actionOptions}
            value={bulkAction}
            onChange={setBulkAction}
            placeholder="Choose action"
          />

          {bulkAction === 'assign' && (
            <Select
              label="Assign to"
              options={approverOptions}
              value={selectedApprover}
              onChange={setSelectedApprover}
              placeholder="Select approver"
            />
          )}

          {bulkAction === 'reject' && (
            <Select
              label="Rejection Reason"
              options={rejectionReasons}
              value={rejectionReason}
              onChange={setRejectionReason}
              placeholder="Select reason"
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Selected requests will be processed with audit trail logging
          </div>
          <Button
            variant="default"
            onClick={handleActionExecute}
            disabled={!bulkAction || (bulkAction === 'assign' && !selectedApprover) || (bulkAction === 'reject' && !rejectionReason)}
          >
            <Icon name="Play" size={16} className="mr-2" />
            Execute Action
          </Button>
        </div>
      </div>
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-popover border border-border rounded-lg shadow-enterprise-lg max-w-md w-full">
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-popover-foreground">Confirm Bulk Action</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-popover-foreground mb-2">
                  You are about to: <strong>{getActionSummary()}</strong>
                </p>
                
                {confirmationAction?.reason && (
                  <p className="text-sm text-muted-foreground">
                    Reason: {rejectionReasons?.find(r => r?.value === confirmationAction?.reason)?.label}
                  </p>
                )}
                
                {confirmationAction?.approver && (
                  <p className="text-sm text-muted-foreground">
                    Assignee: {approverOptions?.find(a => a?.value === confirmationAction?.approver)?.label}
                  </p>
                )}
              </div>

              <div className="bg-muted rounded-lg p-3 mb-4">
                <p className="text-sm text-muted-foreground mb-2">Affected Requests:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedRequests?.slice(0, 5)?.map((request) => (
                    <div key={request?.id} className="text-sm text-foreground">
                      {request?.requestor} - {request?.resource}
                    </div>
                  ))}
                  {selectedRequests?.length > 5 && (
                    <div className="text-sm text-muted-foreground">
                      ...and {selectedRequests?.length - 5} more
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="audit-confirm"
                  label="I understand this action will be logged in the audit trail"
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={confirmAction}
                className="flex-1"
              >
                <Icon name="Check" size={16} className="mr-2" />
                Confirm Action
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsPanel;