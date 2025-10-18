import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import TicketingService from '../../../services/TicketingService';
import { hasPermission, hasAnyPermission, PERMISSIONS } from '../../../utils/permissions';
import { useNavigate } from 'react-router-dom';

const PersonalTicketsCard = ({ currentUser }) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setTickets(TicketingService.getTickets() || []);
  }, []);

  const canView = hasAnyPermission(currentUser?.role, [
    PERMISSIONS.TICKET_VIEW_ALL,
    PERMISSIONS.TICKET_VIEW_OWN
  ]);
  const canCreate = hasPermission(currentUser?.role, PERMISSIONS.TICKET_CREATE);
  const canApprove = hasPermission(currentUser?.role, PERMISSIONS.TICKET_APPROVE);

  const myTickets = useMemo(() => TicketingService.getTicketsForUser(currentUser) || [], [currentUser, tickets]);
  const pendingApprovals = useMemo(() => TicketingService.getPendingTicketsForApproval(currentUser) || [], [currentUser, tickets]);

  const openMine = useMemo(() => myTickets.filter(t => t.status !== 'resolved' && t.status !== 'rejected'), [myTickets]);

  if (!canView) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-enterprise">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">My Tickets</h3>
        <Icon name="Ticket" size={20} className="text-primary" />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg mx-auto mb-2">
            <Icon name="FolderOpen" size={20} className="text-primary" />
          </div>
          <p className="text-lg font-bold text-foreground">{openMine.length}</p>
          <p className="text-xs text-muted-foreground">Open</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-accent/10 border border-accent/20 rounded-lg mx-auto mb-2">
            <Icon name="ListTodo" size={20} className="text-accent" />
          </div>
          <p className="text-lg font-bold text-foreground">{myTickets.length}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        {canApprove && (
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-warning/10 border border-warning/20 rounded-lg mx-auto mb-2">
              <Icon name="ShieldCheck" size={20} className="text-warning" />
            </div>
            <p className="text-lg font-bold text-foreground">{pendingApprovals.length}</p>
            <p className="text-xs text-muted-foreground">Approvals</p>
          </div>
        )}
      </div>

      {/* Recent/Open Tickets */}
      {openMine.length > 0 ? (
        <div className="space-y-2 mb-4">
          {openMine.slice(0, 3).map((t) => (
            <div key={t.id} className="flex items-center justify-between p-2 bg-accent/5 border border-accent/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="MessageSquare" size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">{t.title}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground capitalize">{t.priority}</span>
                <p className="text-xs text-muted-foreground">{t.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Icon name="MessageSquare" size={32} className="text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No open tickets</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => navigate('/ticketing')}
        >
          View Tickets
        </Button>
        {canCreate && (
          <Button
            variant="default"
            size="sm"
            className="w-full"
            iconName="Plus"
            onClick={() => navigate('/ticketing')}
          >
            Create Ticket
          </Button>
        )}
      </div>
    </div>
  );
};

export default PersonalTicketsCard;