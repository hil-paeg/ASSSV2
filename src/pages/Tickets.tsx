import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Filter, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import TicketStatusTracker from '@/components/Tickets/TicketStatusTracker';
import TicketDetailsModal from '@/components/Tickets/TicketDetailsModal';
import TicketBoard from './TicketBoard';
import { useRouter } from 'next/navigation';

const Tickets = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [tickets, setTickets] = useState([
    { id: '1', title: 'Server Downtime', description: 'Server offline issue', priority: 'high', status: 'raised', createdAt: '2025-07-10', updatedAt: '2025-07-10', client: 'AMNSI', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, attachments: [], outOfScope: false, outOfScopeReason: '' },
    { id: '2', title: 'Login Failure', description: 'User authentication error', priority: 'medium', status: 'in-progress', createdAt: '2025-07-12', updatedAt: '2025-07-15', client: 'URJA', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, attachments: [], outOfScope: false, outOfScopeReason: '' },
    { id: '3', title: 'HMI Connectivity', description: 'HMI not connecting', priority: 'low', status: 'resolved', createdAt: '2025-07-08', updatedAt: '2025-07-09', client: 'SAIL', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, attachments: [], outOfScope: false, outOfScopeReason: '' },
    { id: '4', title: 'PLC Error', description: 'PLC fault code 0x81', priority: 'high', status: 'raised', createdAt: '2025-07-14', updatedAt: '2025-07-14', client: 'JSPL', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, attachments: [], outOfScope: false, outOfScopeReason: '' },
  ]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isAdminSummaryModalOpen, setIsAdminSummaryModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateTicket, setUpdateTicket] = useState(null);
  const [comments, setComments] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [feedback, setFeedback] = useState({
    experience: '',
    rating: 0,
    savedTime: false,
    timeAmount: '',
  });
  const [adminSummary, setAdminSummary] = useState('');
  const [adminAttachment, setAdminAttachment] = useState(null);
  const [adminOutOfScope, setAdminOutOfScope] = useState(false);
  const [adminOutOfScopeReason, setAdminOutOfScopeReason] = useState('');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const handleUpdateStatus = (ticket) => {
    setUpdateTicket(ticket);
    setComments('');
    setTicketType('');
    setIsUpdateModalOpen(true);
  };

  const handleCloseTicket = (ticket, role) => {
    if (role === 'admin') {
      setUpdateTicket(ticket);
      setAdminSummary('');
      setAdminAttachment(null);
      setAdminOutOfScope(ticket.outOfScope);
      setAdminOutOfScopeReason(ticket.outOfScopeReason);
      setIsAdminSummaryModalOpen(true);
    } else {
      setUpdateTicket(ticket);
      setFeedback({ experience: '', rating: 0, savedTime: false, timeAmount: '' });
      setIsFeedbackModalOpen(true);
    }
  };

  const handleStatusUpdate = () => {
    if (updateTicket) {
      const newStatus = updateTicket.status === 'raised' ? 'in-progress' : 'resolved';
      const updatedTickets = tickets.map(t =>
        t.id === updateTicket.id ? { 
          ...t, 
          status: newStatus, 
          updatedAt: new Date().toISOString().split('T')[0], 
          comments, 
          ticketType 
        } : t
      );
      setTickets(updatedTickets);
      setIsUpdateModalOpen(false);
    }
  };

  const handleAdminSummarySubmit = () => {
    if (updateTicket && adminSummary.trim()) {
      const updatedTickets = tickets.map(t =>
        t.id === updateTicket.id
          ? {
              ...t,
              adminClosed: true,
              adminSummary,
              attachments: adminAttachment ? [...t.attachments, adminAttachment.name] : t.attachments,
              outOfScope: adminOutOfScope,
              outOfScopeReason: adminOutOfScope ? adminOutOfScopeReason : '',
              status: t.clientClosed && t.adminClosed ? 'closed' : t.status,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : t
      );
      setTickets(updatedTickets);
      setIsAdminSummaryModalOpen(false);
      setAdminAttachment(null);
      setAdminOutOfScope(false);
      setAdminOutOfScopeReason('');
    }
  };

  const handleFeedbackSubmit = () => {
    if (updateTicket && feedback.experience.trim() && feedback.rating > 0) {
      const updatedTickets = tickets.map(t =>
        t.id === updateTicket.id
          ? {
              ...t,
              clientClosed: true,
              feedback,
              status: t.adminClosed && t.clientClosed ? 'closed' : t.status,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : t
      );
      setTickets(updatedTickets);
      setIsFeedbackModalOpen(false);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    (ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || ticket.status === statusFilter) &&
    (clientFilter === 'all' || ticket.client === clientFilter)
  );

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            {user?.role === 'admin' ? 'All Tickets' : 'My Tickets'}
          </h1>
          <p className="text-blue-600 mt-2">
            {user?.role === 'admin'
              ? 'Manage and track all support tickets'
              : 'Track your support requests and their progress'}
          </p>
        </div>
        {user?.role === 'user' && (
          <Button onClick={() => router.push('/tickets/new')} className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        )}
      </div>

      {user?.role === 'admin' && <TicketBoard />}

      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="pt-2">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="border-blue-200">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="raised">Raised</SelectItem>
                  <SelectItem value="in-progress">Confirmed by OEM</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              {user?.role === 'admin' && (
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
                    <SelectValue placeholder="Filter by client" />
                  </SelectTrigger>
                  <SelectContent className="border-blue-200">
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="AMNSI">AMNSI</SelectItem>
                    <SelectItem value="URJA">URJA</SelectItem>
                    <SelectItem value="SAIL">SAIL</SelectItem>
                    <SelectItem value="JSPL">JSPL</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button variant="outline" size="icon" className="border-blue-200 hover:bg-blue-50">
                <Filter className="h-5 w-5 text-blue-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6 pb-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-blue-900">
                      #{ticket.id} - {ticket.title}
                    </h3>
                    <Badge className={`text-white ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                    {ticket.outOfScope && (
                      <Badge className="bg-purple-500 text-white">
                        Out of Scope
                      </Badge>
                    )}
                  </div>
                  <p className="text-blue-600 mb-4">{ticket.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-blue-700">
                    <TicketStatusTracker status={ticket.status} />
                    <div className="text-sm text-blue-500">
                      {user?.role === 'admin' && <p>Client: {ticket.client}</p>}
                      <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</p>
                      {ticket.attachments.length > 0 && (
                        <p>Attachments: {ticket.attachments.join(', ')}</p>
                      )}
                      {ticket.outOfScope && ticket.outOfScopeReason && (
                        <p>Out of Scope Reason: {ticket.outOfScopeReason}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={() => handleViewDetails(ticket)}
                  >
                    View Details
                  </Button>
                  {user?.role === 'admin' && ticket.status !== 'closed' && (
                    <>
                      <Button
                        size="sm"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => handleUpdateStatus(ticket)}
                        disabled={ticket.status === 'resolved'}
                      >
                        Update Status
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => handleCloseTicket(ticket, 'admin')}
                        disabled={ticket.adminClosed}
                      >
                        Close Ticket
                      </Button>
                    </>
                  )}
                  {user?.role === 'user' && ticket.status === 'resolved' && !ticket.clientClosed && (
                    <Button
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleCloseTicket(ticket, 'client')}
                    >
                      Close Ticket
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card className="bg-white rounded-lg shadow-md">
          <CardContent className="pt-6 text-center">
            <p className="text-blue-500">No tickets found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      <TicketDetailsModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticket={selectedTicket}
      />

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Update Ticket Status</DialogTitle>
          </DialogHeader>
          {updateTicket && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-blue-600">Ticket #{updateTicket.id} - {updateTicket.title}</p>
                <p className="text-sm text-blue-600">Current Status: {updateTicket.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Comments</label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add comments for status update..."
                  className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Ticket Type</label>
                <Select value={ticketType} onValueChange={setTicketType}>
                  <SelectTrigger className="w-full mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
                    <SelectValue placeholder="Select ticket type" />
                  </SelectTrigger>
                  <SelectContent className="border-blue-200">
                    <SelectItem value="RS1">RS1</SelectItem>
                    <SelectItem value="RS2">RS2</SelectItem>
                    <SelectItem value="RS3-1">RS3-1</SelectItem>
                    <SelectItem value="RS3-2">RS3-2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => setIsUpdateModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleStatusUpdate}
                  disabled={!comments.trim() || !ticketType}
                >
                  Update Status
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent className="bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Ticket Feedback</DialogTitle>
          </DialogHeader>
          {updateTicket && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-blue-600">Ticket #{updateTicket.id} - {updateTicket.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Your Experience</label>
                <Textarea
                  value={feedback.experience}
                  onChange={(e) => setFeedback({ ...feedback, experience: e.target.value })}
                  placeholder="Describe your experience with this ticket resolution..."
                  className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Rating</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => setFeedback({ ...feedback, rating: star })}
                      className={feedback.rating >= star ? 'text-yellow-500' : 'text-gray-300'}
                    >
                      <Star className="h-5 w-5" fill={feedback.rating >= star ? 'currentColor' : 'none'} />
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Did this resolution save you time?</label>
                <div className="flex items-center gap-2 mt-1">
                  <Checkbox
                    checked={feedback.savedTime}
                    onCheckedChange={(checked) => setFeedback({ ...feedback, savedTime: checked })}
                  />
                  <span className="text-sm text-blue-600">Yes, it saved time</span>
                </div>
                {feedback.savedTime && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-blue-700">How much time was saved?</label>
                    <Input
                      value={feedback.timeAmount}
                      onChange={(e) => setFeedback({ ...feedback, timeAmount: e.target.value })}
                      placeholder="e.g., 2 hours, 1 day"
                      className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => setIsFeedbackModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedback.experience.trim() || feedback.rating === 0 || (feedback.savedTime && !feedback.timeAmount.trim())}
                >
                  Submit Feedback
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAdminSummaryModalOpen} onOpenChange={setIsAdminSummaryModalOpen}>
        <DialogContent className="bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Close Ticket - Admin Summary</DialogTitle>
          </DialogHeader>
          {updateTicket && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-blue-600">Ticket #{updateTicket.id} - {updateTicket.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Summary of Resolution</label>
                <Textarea
                  value={adminSummary}
                  onChange={(e) => setAdminSummary(e.target.value)}
                  placeholder="Provide a brief summary of the ticket resolution..."
                  className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Attachment</label>
                <Input
                  type="file"
                  onChange={(e) => setAdminAttachment(e.target.files[0])}
                  className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700">Out of Scope</label>
                <div className="flex items-center gap-2 mt-1">
                  <Checkbox
                    checked={adminOutOfScope}
                    onCheckedChange={(checked) => setAdminOutOfScope(checked)}
                  />
                  <span className="text-sm text-blue-600">Mark as Out of Scope</span>
                </div>
                {adminOutOfScope && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-blue-700">Reason for Out of Scope</label>
                    <Textarea
                      value={adminOutOfScopeReason}
                      onChange={(e) => setAdminOutOfScopeReason(e.target.value)}
                      placeholder="Provide reason for marking as out of scope..."
                      className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => setIsAdminSummaryModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={handleAdminSummarySubmit}
                  disabled={!adminSummary.trim() || (adminOutOfScope && !adminOutOfScopeReason.trim())}
                >
                  Submit Summary
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tickets;