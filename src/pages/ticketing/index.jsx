import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useUser } from '../../contexts/UserContext';
import { hasPermission, hasAnyPermission, PERMISSIONS } from '../../utils/permissions';
import TicketingService from '../../services/TicketingService';

const Ticketing = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'mine' | 'approvals'
  const [createTicketOpen, setCreateTicketOpen] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', category: 'all' });

  // Guard: redirect if user lacks ticketing view permission
  useEffect(() => {
    if (currentUser && !hasAnyPermission(currentUser?.role, [
      PERMISSIONS.TICKET_VIEW_ALL,
      PERMISSIONS.TICKET_VIEW_OWN
    ])) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    setTickets(TicketingService.getTickets());
  }, []);

  const canCreate = hasPermission(currentUser?.role, PERMISSIONS.TICKET_CREATE);
  const canApprove = hasPermission(currentUser?.role, PERMISSIONS.TICKET_APPROVE);
  const canAssign = hasPermission(currentUser?.role, PERMISSIONS.TICKET_ASSIGN);
  const canResolve = hasPermission(currentUser?.role, PERMISSIONS.TICKET_RESOLVE);

  const refreshTickets = () => setTickets(TicketingService.getTickets());

  const myTickets = useMemo(() => TicketingService.getTicketsForUser(currentUser), [currentUser, tickets]);
  const pendingApprovals = useMemo(() => TicketingService.getPendingTicketsForApproval(currentUser), [currentUser, tickets]);

  const ticketStats = useMemo(() => {
    const open = tickets.filter(t => t.status !== 'resolved' && t.status !== 'rejected').length;
    const mine = myTickets.length;
    const approvals = pendingApprovals.length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    return { open, mine, approvals, resolved };
  }, [tickets, myTickets, pendingApprovals]);

  const filteredTickets = useMemo(() => {
    const list = activeTab === 'mine' ? myTickets : (activeTab === 'approvals' ? pendingApprovals : tickets);
    return list.filter(t => {
      const matchesSearch = (t.title + ' ' + t.description).toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || t.status === filters.status;
      const matchesPriority = filters.priority === 'all' || t.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || t.category === filters.category;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, myTickets, pendingApprovals, activeTab, filters]);

  const handleSidebarToggle = () => setSidebarCollapsed(!sidebarCollapsed);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);

  const [formData, setFormData] = useState({ title: '', description: '', category: 'general', priority: 'medium' });
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    TicketingService.createTicket(formData, currentUser);
    setFormData({ title: '', description: '', category: 'general', priority: 'medium' });
    setCreateTicketOpen(false);
    refreshTickets();
  };

  const handleAssign = (ticket) => {
    if (!canAssign) return;
    TicketingService.assignTicket(ticket.id, currentUser);
    refreshTickets();
  };

  const handleApprove = (ticket, decision = 'approved') => {
    if (!canApprove) return;
    TicketingService.approveTicket(ticket.id, currentUser, decision);
    refreshTickets();
  };

  const handleResolve = (ticket) => {
    if (!canResolve) return;
    TicketingService.resolveTicket(ticket.id, currentUser, 'Resolved via Ticketing page');
    refreshTickets();
  };

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'it_support', label: 'IT Support' },
    { value: 'access', label: 'Access' },
    { value: 'asset', label: 'Asset' },
    { value: 'security', label: 'Security' }
  ];
  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];
  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'pending_approval', label: 'Pending Approval' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'resolved', label: 'Resolved' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} isMobileOpen={mobileMenuOpen} onMobileClose={handleMobileMenuClose} />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'} pt-20 p-4 sm:p-6`}>
        <Breadcrumb />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ticketing</h1>
            <p className="text-muted-foreground mt-2">Create, triage, assign, and resolve service desk tickets</p>
          </div>
          {canCreate && (
            <Button onClick={() => setCreateTicketOpen(true)}>
              <Icon name="Plus" className="mr-2" />
              New Ticket
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Open</span>
              <Icon name="FolderOpen" className="text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold">{ticketStats.open}</div>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">My Tickets</span>
              <Icon name="User" className="text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold">{ticketStats.mine}</div>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Approval</span>
              <Icon name="ShieldCheck" className="text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold">{ticketStats.approvals}</div>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resolved</span>
              <Icon name="CheckCircle" className="text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold">{ticketStats.resolved}</div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Button variant={activeTab === 'all' ? 'default' : 'outline'} onClick={() => setActiveTab('all')}>All</Button>
            <Button variant={activeTab === 'mine' ? 'default' : 'outline'} onClick={() => setActiveTab('mine')}>My Tickets</Button>
            {canApprove && (
              <Button variant={activeTab === 'approvals' ? 'default' : 'outline'} onClick={() => setActiveTab('approvals')}>Approvals</Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Input placeholder="Search" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
            <Select options={statuses} value={filters.status} onChange={val => setFilters({ ...filters, status: val })} />
            <Select options={priorities} value={filters.priority} onChange={val => setFilters({ ...filters, priority: val })} />
            <Select options={categories} value={filters.category} onChange={val => setFilters({ ...filters, category: val })} />
          </div>
        </div>

        {/* Tickets list */}
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-3 bg-muted text-xs font-semibold text-muted-foreground">
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {filteredTickets.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No tickets found</div>
          ) : (
            filteredTickets.map(ticket => (
              <div key={ticket.id} className="grid grid-cols-12 gap-4 p-4 border-t items-center">
                <div className="col-span-4">
                  <div className="font-medium text-foreground">{ticket.title}</div>
                  <div className="text-xs text-muted-foreground">Requested by {ticket.requester?.name || 'Unknown'} on {new Date(ticket.createdAt).toLocaleString()}</div>
                </div>
                <div className="col-span-2"><span className="px-2 py-1 rounded bg-muted text-xs">{ticket.category}</span></div>
                <div className="col-span-2"><span className="px-2 py-1 rounded bg-muted text-xs capitalize">{ticket.priority}</span></div>
                <div className="col-span-2"><span className="px-2 py-1 rounded bg-muted text-xs capitalize">{ticket.status}</span></div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  {canApprove && ticket.status !== 'resolved' && ticket.status !== 'rejected' && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleApprove(ticket, 'approved')}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleApprove(ticket, 'rejected')}>Reject</Button>
                    </div>
                  )}
                  {canAssign && (
                    <Button size="sm" variant="outline" onClick={() => handleAssign(ticket)}>Assign to me</Button>
                  )}
                  {canResolve && ticket.status !== 'resolved' && (
                    <Button size="sm" onClick={() => handleResolve(ticket)}>
                      <Icon name="CheckCircle" className="mr-1" /> Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Ticket Modal */}
        {createTicketOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card border rounded-xl shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">New Ticket</h2>
                <button className="text-muted-foreground hover:text-foreground" onClick={() => setCreateTicketOpen(false)}>
                  <Icon name="X" />
                </button>
              </div>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <Input label="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                <div>
                  <label className="text-sm text-muted-foreground">Description</label>
                  <textarea className="mt-1 w-full border rounded-lg p-2" rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Category" options={categories} value={formData.category} onChange={val => setFormData({ ...formData, category: val })} />
                  <Select label="Priority" options={priorities} value={formData.priority} onChange={val => setFormData({ ...formData, priority: val })} />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setCreateTicketOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Ticket</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Ticketing;