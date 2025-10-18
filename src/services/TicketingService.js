// TicketingService: manages tickets CRUD and simple workflow using DataService's module storage
import dataService from './DataService';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

const MODULE_KEY = 'tickets';

const getTickets = () => {
  return dataService.getModuleData(MODULE_KEY);
};

const saveTickets = (tickets) => {
  dataService.saveModuleData(MODULE_KEY, tickets);
};

const createTicket = (ticket, currentUser) => {
  const all = getTickets();
  const newTicket = {
    ...ticket,
    id: `ticket${Date.now()}`,
    title: ticket?.title || 'Untitled Ticket',
    description: ticket?.description || '',
    category: ticket?.category || 'general',
    priority: ticket?.priority || 'medium',
    status: ticket?.status || 'open',
    implementationStatus: ticket?.implementationStatus || 'not_started',
    attachments: ticket?.attachments || [],
    requester: currentUser ? { id: currentUser.id, name: currentUser.name, role: currentUser.role, department: currentUser.department, email: currentUser.email } : null,
    assignedTo: ticket?.assignedTo || null,
    approvals: ticket?.approvals || [],
    comments: ticket?.comments || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  all.push(newTicket);
  saveTickets(all);
  return newTicket;
};

const updateTicket = (ticketId, updates) => {
  const all = getTickets();
  const updated = all.map(t => t.id === ticketId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t);
  saveTickets(updated);
  return updated.find(t => t.id === ticketId);
};

const deleteTicket = (ticketId) => {
  const all = getTickets();
  const filtered = all.filter(t => t.id !== ticketId);
  saveTickets(filtered);
};

const assignTicket = (ticketId, user) => {
  return updateTicket(ticketId, {
    assignedTo: user ? { id: user.id, name: user.name, role: user.role } : null,
    status: 'assigned',
    implementationStatus: 'in_progress'
  });
};

const addComment = (ticketId, comment, author) => {
  const ticket = getTickets().find(t => t.id === ticketId);
  if (!ticket) return null;
  const newComment = {
    id: `c${Date.now()}`,
    text: comment,
    author: author ? { id: author.id, name: author.name, role: author.role } : null,
    createdAt: new Date().toISOString()
  };
  return updateTicket(ticketId, { comments: [...(ticket.comments || []), newComment] });
};

const approveTicket = (ticketId, approver, decision = 'approved', notes = '') => {
  const ticket = getTickets().find(t => t.id === ticketId);
  if (!ticket) return null;
  const approvalRecord = {
    id: `appr${Date.now()}`,
    approver: approver ? { id: approver.id, name: approver.name, role: approver.role } : null,
    decision,
    notes,
    date: new Date().toISOString()
  };
  const nextStatus = decision === 'approved' ? (ticket.assignedTo ? 'assigned' : 'open') : 'rejected';
  return updateTicket(ticketId, { approvals: [...(ticket.approvals || []), approvalRecord], status: nextStatus });
};

const resolveTicket = (ticketId, resolver, resolution = '') => {
  const ticket = getTickets().find(t => t.id === ticketId);
  if (!ticket) return null;
  return updateTicket(ticketId, {
    status: 'resolved',
    implementationStatus: 'implemented',
    resolution,
    resolvedBy: resolver ? { id: resolver.id, name: resolver.name, role: resolver.role } : null,
    resolvedAt: new Date().toISOString()
  });
};

const getTicketsForUser = (user) => {
  const all = getTickets();
  if (hasPermission(user?.role, PERMISSIONS.TICKET_VIEW_ALL)) {
    return all;
  }
  return all.filter(t => t?.requester?.id === user?.id || t?.assignedTo?.id === user?.id);
};

const getPendingTicketsForApproval = (user) => {
  const all = getTickets();
  if (!hasPermission(user?.role, PERMISSIONS.TICKET_APPROVE)) return [];
  return all.filter(t => t.status === 'pending_approval' || t.status === 'open');
};

export default {
  getTickets,
  saveTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  addComment,
  approveTicket,
  resolveTicket,
  getTicketsForUser,
  getPendingTicketsForApproval
};