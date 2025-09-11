// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { Search, Plus, Filter, Star, User, Calendar, Activity, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Badge } from '@/components/ui/badge';
// import { StatusTracker } from '@/components/Tickets/StatusTracker';
// import TicketDetailsModal from '@/components/Tickets/TicketDetailsModal';
// import TicketBoard from './TicketBoard';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { Ticket } from '@/types';

// interface Feedback {
//   experience: string;
//   rating: number;
//   timeAmount: string;
// }

// const Tickets = () => {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [clientFilter, setClientFilter] = useState('all');
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [isAdminSummaryModalOpen, setIsAdminSummaryModalOpen] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
//   const [updateTicket, setUpdateTicket] = useState<Ticket | null>(null);
//   const [comments, setComments] = useState('');
//   const [ticketType, setTicketType] = useState('');
//   const [feedback, setFeedback] = useState<Feedback>({
//     experience: '',
//     rating: 0,
//     timeAmount: '',
//   });
//   const [adminSummary, setAdminSummary] = useState('');
//   const [adminAttachment, setAdminAttachment] = useState<File | null>(null);
//   const [adminOutOfScope, setAdminOutOfScope] = useState(false);
//   const [adminOutOfScopeReason, setAdminOutOfScopeReason] = useState('');

//   useEffect(() => {
//     const fetchTickets = async () => {
//       if (!user || !user.token) {
//         console.warn('No user or token available');
//         setTickets([]);
//         router.push('/');
//         return;
//       }

//       try {
//         const response = await axios.get('/api/tickets', {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         console.log('Fetched tickets:', response.data);
//         setTickets(
//           response.data.map((ticket: any) => ({
//             ...ticket,
//             id: ticket.ticket_id,
//             ticket_id: ticket.ticket_id,
//             userId: ticket.client_id,
//             client_id: ticket.client_id,
//             title: ticket.issue_title,
//             issue_title: ticket.issue_title,
//             ticketType: ticket.ticket_type,
//             ticket_type: ticket.ticket_type,
//             createdAt: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
//             created_at: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
//             updatedAt: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
//             updated_at: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
//             closed_at: ticket.closed_at ? new Date(ticket.closed_at).toISOString() : null,
//             clientClosed: Boolean(ticket.clientClosed),
//             adminClosed: Boolean(ticket.adminClosed),
//             out_of_scope: Boolean(ticket.out_of_scope),
//           }))
//         );
//       } catch (error) {
//         console.error('Error fetching tickets:', error);
//         alert('Failed to fetch tickets.');
//         setTickets([]);
//       }
//     };

//     fetchTickets();
//   }, [user, router]);

//   const getPriorityColor = (priority: string | null) => {
//     switch (priority) {
//       case 'high':
//         return 'bg-red-500';
//       case 'medium':
//         return 'bg-yellow-500';
//       case 'low':
//         return 'bg-green-500';
//       default:
//         return 'bg-gray-500';
//     }
//   };

//   const handleViewDetails = (ticket: Ticket) => {
//     setSelectedTicket(ticket);
//     setIsTicketModalOpen(true);
//   };

//   const handleUpdateStatus = (ticket: Ticket) => {
//     setUpdateTicket(ticket);
//     setComments(ticket.comments || '');
//     setTicketType(ticket.ticket_type || '');
//     setIsUpdateModalOpen(true);
//   };

//   const handleCloseTicket = async (ticket: Ticket, role: 'admin' | 'client' | 'clientMember') => {
//     if (role === 'admin') {
//       if (!ticket.clientClosed) {
//         alert('Cannot close ticket: Client must close the ticket first.');
//         return;
//       }
//       setUpdateTicket(ticket);
//       setAdminSummary(ticket.summary || '');
//       setAdminAttachment(null);
//       setAdminOutOfScope(ticket.out_of_scope);
//       setAdminOutOfScopeReason(ticket.out_of_scope_reason || '');
//       setIsAdminSummaryModalOpen(true);
//     } else {
//       if (ticket.status !== 'resolved') {
//         alert('Cannot close ticket: Ticket must be resolved first.');
//         return;
//       }
//       setUpdateTicket(ticket);
//       setFeedback({ experience: '', rating: 0, timeAmount: '' });
//       setIsFeedbackModalOpen(true);
//     }
//   };

//   const handleStatusUpdate = async () => {
//     if (!updateTicket || !user?.token) return;

//     // Enforce ticket_type for 'confirmed by oem' status
//     if (updateTicket.status === 'raised' && !ticketType) {
//       alert('Please select a ticket type before confirming.');
//       return;
//     }

//     try {
//       const newStatus =
//         updateTicket.status === 'raised'
//           ? 'confirmed by oem'
//           : updateTicket.status === 'confirmed by oem'
//           ? 'resolved'
//           : updateTicket.status === 'resolved'
//           ? 'closed'
//           : updateTicket.status;
//       const response = await axios.put(
//         `/api/tickets?id=${updateTicket.ticket_id}`,
//         { status: newStatus, comments, ticket_type: ticketType },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       setTickets(
//         tickets.map((t) =>
//           t.ticket_id === updateTicket.ticket_id
//             ? {
//                 ...t,
//                 status: newStatus,
//                 comments,
//                 ticket_type: ticketType,
//                 ticketType: ticketType,
//                 updated_at: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//               }
//             : t
//         )
//       );
//       setIsUpdateModalOpen(false);
//       setComments('');
//       setTicketType('');
//     } catch (error) {
//       console.error('Error updating ticket:', error);
//       alert('Failed to update ticket status.');
//     }
//   };

//   const handleAdminSummarySubmit = async () => {
//     if (!updateTicket || !user?.token || !adminSummary.trim()) return;

//     try {
//       const formData = new FormData();
//       formData.append('summary', adminSummary);
//       formData.append('out_of_scope', adminOutOfScope.toString());
//       if (adminOutOfScope) formData.append('out_of_scope_reason', adminOutOfScopeReason);
//       if (adminAttachment) formData.append('attachment', adminAttachment);

//       const response = await axios.post(
//         `/api/tickets?action=close&id=${updateTicket.ticket_id}`,
//         formData,
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       setTickets(
//         tickets.map((t) =>
//           t.ticket_id === updateTicket.ticket_id
//             ? {
//                 ...t,
//                 adminClosed: true,
//                 summary: adminSummary,
//                 attachments: adminAttachment
//                   ? t.attachments
//                     ? `${t.attachments},${adminAttachment.name}`
//                     : adminAttachment.name
//                   : t.attachments,
//                 out_of_scope: adminOutOfScope,
//                 out_of_scope_reason: adminOutOfScope ? adminOutOfScopeReason : null,
//                 status: t.clientClosed ? 'closed' : t.status,
//                 updated_at: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//                 closed_at: new Date().toISOString(),
//               }
//             : t
//         )
//       );
//       setIsAdminSummaryModalOpen(false);
//       setAdminSummary('');
//       setAdminAttachment(null);
//       setAdminOutOfScope(false);
//       setAdminOutOfScopeReason('');
//     } catch (error) {
//       console.error('Error closing ticket:', error);
//       alert('Failed to close ticket.');
//     }
//   };

//   const handleFeedbackSubmit = async () => {
//     if (!updateTicket || !user?.token || !feedback.experience.trim() || feedback.rating === 0) return;

//     try {
//       const response = await axios.post(
//         `/api/tickets?action=close&id=${updateTicket.ticket_id}`,
//         {
//           experience: feedback.experience,
//           rating: feedback.rating,
//           time_saved: feedback.timeAmount ? parseInt(feedback.timeAmount) : null,
//         },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       setTickets(
//         tickets.map((t) =>
//           t.ticket_id === updateTicket.ticket_id
//             ? {
//                 ...t,
//                 clientClosed: true,
//                 status: t.adminClosed ? 'closed' : t.status,
//                 updated_at: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//                 closed_at: t.adminClosed ? new Date().toISOString() : t.closed_at,
//               }
//             : t
//         )
//       );
//       setIsFeedbackModalOpen(false);
//       setFeedback({ experience: '', rating: 0, timeAmount: '' });
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//       alert('Failed to submit feedback.');
//     }
//   };

//   const filteredTickets = tickets.filter((ticket) => {
//     const matchesSearch = ticket.issue_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
//     const matchesClient = clientFilter === 'all' || ticket.client?.client_username === clientFilter;
//     return matchesSearch && matchesStatus && matchesClient;
//   });

//   // Simple stats
//   const totalTickets = tickets.length;
//   const closedTickets = tickets.filter((t) => t.status === 'closed').length;
//   const resolvedTickets = tickets.filter((t) => t.status === 'resolved').length;
//   const openTickets = totalTickets - closedTickets; // considers raised/confirmed/resolved as not fully closed

//   return (
//     <div className="container mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
//       <div className="flex flex-col bg-white rounded-lg shadow-md p-6">
//   {/* Header Section */}
//   <div className="flex justify-between items-center mb-6">
//     <div>
//       <h1 className="text-3xl font-bold text-blue-900">
//         {user?.role === 'admin' ? 'All Tickets' : 'My Tickets'}
//       </h1>
//       <p className="text-blue-600 mt-2">
//         {user?.role === 'admin'
//           ? 'Manage and track all support tickets'
//           : 'Track your support requests and their progress'}
//       </p>
//     </div>

//     {(user?.role === 'client' || user?.role === 'clientMember') && (
//       <Button
//         onClick={() => router.push('/tickets/new')}
//         className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
//       >
//         <Plus className="h-4 w-4" />
//         Create Ticket
//       </Button>
//     )}
//   </div>

//   {/* Cards Section */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//     <Card className="bg-white shadow-md">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-sm font-medium text-slate-600">Total Tickets</CardTitle>
//         <Activity className="h-5 w-5 text-blue-600" />
//       </CardHeader>
//       <CardContent>
//         <div className="text-3xl font-bold text-slate-900">{totalTickets}</div>
//       </CardContent>
//     </Card>

//     <Card className="bg-white shadow-md">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-sm font-medium text-slate-600">Open</CardTitle>
//         <AlertCircle className="h-5 w-5 text-amber-600" />
//       </CardHeader>
//       <CardContent>
//         <div className="text-3xl font-bold text-slate-900">{openTickets}</div>
//       </CardContent>
//     </Card>

//     <Card className="bg-white shadow-md">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-sm font-medium text-slate-600">Resolved</CardTitle>
//         <CheckCircle2 className="h-5 w-5 text-emerald-600" />
//       </CardHeader>
//       <CardContent>
//         <div className="text-3xl font-bold text-slate-900">{resolvedTickets}</div>
//       </CardContent>
//     </Card>

//     <Card className="bg-white shadow-md">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-sm font-medium text-slate-600">Closed</CardTitle>
//         <XCircle className="h-5 w-5 text-slate-600" />
//       </CardHeader>
//       <CardContent>
//         <div className="text-3xl font-bold text-slate-900">{closedTickets}</div>
//       </CardContent>
//     </Card>
//   </div>
// </div>


   

//       {/* Quick stats */}
     

//       <Card className="bg-white rounded-lg shadow-md">
//         <CardContent className="pt-2">
//           <div className="flex flex-col sm:flex-row gap-4 items-center">
//             <div className="flex-1 w-full">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
//                 <Input
//                   placeholder="Search tickets..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-2 w-full sm:w-auto">
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-full sm:w-40 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent className="border-blue-200">
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="raised">Raised</SelectItem>
//                   <SelectItem value="confirmed by oem">Confirmed by OEM</SelectItem>
//                   <SelectItem value="resolved">Resolved</SelectItem>
//                   <SelectItem value="closed">Closed</SelectItem>
//                 </SelectContent>
//               </Select>
//               {user?.role === 'admin' && (
//                 <Select value={clientFilter} onValueChange={setClientFilter}>
//                   <SelectTrigger className="w-full sm:w-40 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
//                     <SelectValue placeholder="Filter by client" />
//                   </SelectTrigger>
//                   <SelectContent className="border-blue-200">
//                     <SelectItem value="all">All Clients</SelectItem>
//                     <SelectItem value="AMNSI">AMNSI</SelectItem>
//                     <SelectItem value="URJA">URJA</SelectItem>
//                     <SelectItem value="SAIL">SAIL</SelectItem>
//                     <SelectItem value="JSPL">JSPL</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//               <Button variant="outline" size="icon" className="border-blue-200 hover:bg-blue-50">
//                 <Filter className="h-5 w-5 text-blue-600" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="space-y-6">
//         {filteredTickets.map((ticket) => (
//           <Card key={ticket.ticket_id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
//             <CardContent className="pt-6 pb-4">
//               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                 <div className="flex-1">
//                   <div className="flex items-center flex-wrap gap-3 mb-3">
//                     <h3 className="text-xl font-semibold text-blue-900">
//                       #{ticket.ticket_id} - {ticket.issue_title}
//                     </h3>
//                     <Badge className={`text-white ${getPriorityColor(ticket.priority)}`}>
//                       {ticket.priority?.toUpperCase() || 'UNKNOWN'}
//                     </Badge>
//                     {user?.role === 'admin' && ticket.client?.client_username && (
//                       <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200">
//                         <User className="h-3.5 w-3.5" />
//                         {ticket.client.client_username}
//                       </span>
//                     )}
//                     {ticket.out_of_scope && (
//                       <Badge className="bg-purple-500 text-white">Out of Scope</Badge>
//                     )}
//                   </div>
//                   <p className="text-blue-600 mb-4">{ticket.description || 'No description provided'}</p>
//                   <div className="space-y-3">
//                     <div className="w-full">
//                       <StatusTracker 
//                         status={ticket.status as 'raised' | 'in-progress' | 'confirmed by oem' | 'resolved' | 'closed'} 
//                         priority={ticket.priority || 'medium'}
//                         createdAt={ticket.created_at}
//                       />
//                     </div>
//                     <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-blue-500">
//                       {!ticket.clientClosed && user?.role !== 'admin' && (
//                         <span>Client: {ticket.client?.client_username || 'Unknown'}</span>
//                       )}
//                       <span className="inline-flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         <span>
//                           {new Date(ticket.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
//                           {' \u2022 '}Updated {new Date(ticket.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
//                         </span>
//                       </span>
//                       {ticket.attachments && <span>Attachment: {ticket.attachments}</span>}
//                       {ticket.out_of_scope && ticket.out_of_scope_reason && (
//                         <span>Out of Scope Reason: {ticket.out_of_scope_reason}</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex flex-col sm:flex-row gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="border-blue-300 text-blue-700 hover:bg-blue-50"
//                     onClick={() => handleViewDetails(ticket)}
//                   >
//                     View Details
//                   </Button>
//                   {user?.role === 'admin' && ticket.status !== 'closed' && (
//                     <>
//                       <Button
//                         size="sm"
//                         className="bg-blue-600 text-white hover:bg-blue-700"
//                         onClick={() => handleUpdateStatus(ticket)}
//                         disabled={ticket.status === 'resolved'}
//                       >
//                         Update Status
//                       </Button>
//                       <Button
//                         size="sm"
//                         className="bg-green-600 text-white hover:bg-green-700"
//                         onClick={() => handleCloseTicket(ticket, 'admin')}
//                         disabled={ticket.adminClosed || !ticket.clientClosed}
//                       >
//                         Close Ticket
//                       </Button>
//                     </>
//                   )}
//                   {(user?.role === 'client' || user?.role === 'clientMember') &&
//                     ticket.status === 'resolved' &&
//                     !ticket.clientClosed && (
//                       <Button
//                         size="sm"
//                         className="bg-green-600 text-white hover:bg-green-700"
//                         onClick={() => handleCloseTicket(ticket, user.role)}
//                       >
//                         Close Ticket
//                       </Button>
//                     )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredTickets.length === 0 && (
//         <Card className="bg-white rounded-lg shadow-md">
//           <CardContent className="pt-6 text-center">
//             <p className="text-blue-500">No tickets found matching your criteria.</p>
//           </CardContent>
//         </Card>
//       )}

//       <TicketDetailsModal
//         isOpen={isTicketModalOpen}
//         onClose={() => {
//           setIsTicketModalOpen(false);
//           setSelectedTicket(null);
//         }}
//         ticket={selectedTicket}
//       />

//       <Dialog open={isUpdateModalOpen} onOpenChange={(open) => {
//         setIsUpdateModalOpen(open);
//         if (!open) {
//           setUpdateTicket(null);
//           setComments('');
//           setTicketType('');
//         }
//       }}>
//         <DialogContent className="bg-white rounded-lg shadow-lg">
//           <DialogHeader>
//             <DialogTitle className="text-blue-900">Update Ticket Status</DialogTitle>
//           </DialogHeader>
//           {updateTicket && (
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-blue-600">
//                   Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
//                 </p>
//                 <p className="text-sm text-blue-600">Current Status: {updateTicket.status}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-700">Comments</label>
//                 <Textarea
//                   value={comments}
//                   onChange={(e) => setComments(e.target.value)}
//                   placeholder="Add comments for status update..."
//                   className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-700">Ticket Type</label>
//                 <Select value={ticketType} onValueChange={setTicketType}>
//                   <SelectTrigger className="w-full mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
//                     <SelectValue placeholder="Select ticket type" />
//                   </SelectTrigger>
//                   <SelectContent className="border-blue-200">
//                     <SelectItem value="RS1">RS1</SelectItem>
//                     <SelectItem value="RS2">RS2</SelectItem>
//                     <SelectItem value="RS3-1">RS3-1</SelectItem>
//                     <SelectItem value="RS3-2">RS3-2</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <DialogFooter>
//                 <Button
//                   variant="outline"
//                   className="border-blue-300 text-blue-700 hover:bg-blue-50"
//                   onClick={() => setIsUpdateModalOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   className="bg-blue-600 text-white hover:bg-blue-700"
//                   onClick={handleStatusUpdate}
//                   disabled={!comments.trim() || !ticketType}
//                 >
//                   Update Status
//                 </Button>
//               </DialogFooter>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isFeedbackModalOpen} onOpenChange={(open) => {
//         setIsFeedbackModalOpen(open);
//         if (!open) {
//           setUpdateTicket(null);
//           setFeedback({ experience: '', rating: 0, timeAmount: '' });
//         }
//       }}>
//         <DialogContent className="bg-white rounded-lg shadow-lg">
//           <DialogHeader>
//             <DialogTitle className="text-blue-900">Ticket Feedback</DialogTitle>
//           </DialogHeader>
//           {updateTicket && (
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-blue-600">
//                   Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-700">Your Experience</label>
//                 <Textarea
//                   value={feedback.experience}
//                   onChange={(e) => setFeedback({ ...feedback, experience: e.target.value })}
//                   placeholder="Describe your experience with this ticket resolution..."
//                   className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-700">Rating</label>
//                 <div className="flex gap-1 mt-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Button
//                       key={star}
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setFeedback({ ...feedback, rating: star })}
//                       className={feedback.rating >= star ? 'text-yellow-500' : 'text-gray-300'}
//                     >
//                       <Star className="h-5 w-5" fill={feedback.rating >= star ? 'currentColor' : 'none'} />
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-700">Time Saved (hours)</label>
//                 <Input
//                   type="number"
//                   value={feedback.timeAmount}
//                   onChange={(e) => setFeedback({ ...feedback, timeAmount: e.target.value })}
//                   placeholder="Enter time saved in hours (e.g., 2)"
//                   className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
//                 />
//               </div>
//               <DialogFooter>
//                 <Button
//                   variant="outline"
//                   className="border-blue-300 text-blue-700 hover:bg-blue-50"
//                   onClick={() => setIsFeedbackModalOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   className="bg-green-600 text-white hover:bg-green-700"
//                   onClick={handleFeedbackSubmit}
//                   disabled={!feedback.experience.trim() || feedback.rating === 0}
//                 >
//                   Submit Feedback
//                 </Button>
//               </DialogFooter>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isAdminSummaryModalOpen} onOpenChange={(open) => {
//         setIsAdminSummaryModalOpen(open);
//         if (!open) {
//           setUpdateTicket(null);
//           setAdminSummary('');
//           setAdminAttachment(null);
//           setAdminOutOfScope(false);
//           setAdminOutOfScopeReason('');
//         }
//       }}>
//         <DialogContent className="bg-white rounded-lg shadow-lg">
//           <DialogHeader>
//             <DialogTitle className="text-blue-900">Close Ticket - Admin Summary</DialogTitle>
//           </DialogHeader>
//           {updateTicket && (
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-blue-600">
//                   Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-700">Summary of Resolution</label>
//                 <Textarea
//                   value={adminSummary}
//                   onChange={(e) => setAdminSummary(e.target.value)}
//                   placeholder="Provide a brief summary of the ticket resolution..."
//                   className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-700">Attachment</label>
//                 <Input
//                   type="file"
//                   onChange={(e) => setAdminAttachment(e.target.files?.[0] || null)}
//                   className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-700">Out of Scope</label>
//                 <div className="flex items-center gap-2 mt-1">
//                   <input
//                     type="checkbox"
//                     checked={adminOutOfScope}
//                     onChange={(e) => setAdminOutOfScope(e.target.checked)}
//                   />
//                   <span className="text-sm text-blue-600">Mark as Out of Scope</span>
//                 </div>
//                 {adminOutOfScope && (
//                   <div className="mt-2">
//                     <label className="block text-sm font-medium text-blue-700">Reason for Out of Scope</label>
//                     <Textarea
//                       value={adminOutOfScopeReason}
//                       onChange={(e) => setAdminOutOfScopeReason(e.target.value)}
//                       placeholder="Provide reason for marking as out of scope..."
//                       className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
//                     />
//                   </div>
//                 )}
//               </div>
//               <DialogFooter>
//                 <Button
//                   variant="outline"
//                   className="border-blue-300 text-blue-700 hover:bg-blue-50"
//                   onClick={() => setIsAdminSummaryModalOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   className="bg-green-600 text-white hover:bg-green-700"
//                   onClick={handleAdminSummarySubmit}
//                   disabled={!adminSummary.trim() || (adminOutOfScope && !adminOutOfScopeReason.trim())}
//                 >
//                   Submit Summary
//                 </Button>
//               </DialogFooter>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Tickets;





// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { Search, Plus, Filter, Star, User, Calendar, Activity, AlertCircle, CheckCircle2, XCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';
// import { FileText, PlayCircle, Shield, CheckCircle, XCircle as ClosedIcon } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Badge } from '@/components/ui/badge';
// import { StatusTracker } from '@/components/Tickets/StatusTracker';
// import TicketDetailsModal from '@/components/Tickets/TicketDetailsModal';
// import TicketBoard from './TicketBoard';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { Ticket } from '@/types';

// interface Feedback {
//   experience: string;
//   rating: number;
//   timeAmount: string;
// }

// const Tickets = () => {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [clientFilter, setClientFilter] = useState('all');
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
//   const [isAdminSummaryModalOpen, setIsAdminSummaryModalOpen] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
//   const [updateTicket, setUpdateTicket] = useState<Ticket | null>(null);
//   const [comments, setComments] = useState('');
//   const [ticketType, setTicketType] = useState('');
//   const [feedback, setFeedback] = useState<Feedback>({
//     experience: '',
//     rating: 0,
//     timeAmount: '',
//   });
//   const [adminSummary, setAdminSummary] = useState('');
//   const [adminAttachment, setAdminAttachment] = useState<File | null>(null);
//   const [adminOutOfScope, setAdminOutOfScope] = useState(false);
//   const [adminOutOfScopeReason, setAdminOutOfScopeReason] = useState('');

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'raised':
//         return <FileText className="h-4 w-4" />;
//       case 'in-progress':
//         return <PlayCircle className="h-4 w-4" />;
//       case 'confirmed by oem':
//         return <Shield className="h-4 w-4" />;
//       case 'resolved':
//         return <CheckCircle className="h-4 w-4" />;
//       case 'closed':
//         return <ClosedIcon className="h-4 w-4" />;
//       default:
//         return <FileText className="h-4 w-4" />;
//     }
//   };

//   useEffect(() => {
//     const fetchTickets = async () => {
//       if (!user || !user.token) {
//         console.warn('No user or token available');
//         setTickets([]);
//         router.push('/');
//         return;
//       }

//       try {
//         const response = await axios.get('/api/tickets', {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         console.log('Fetched tickets:', response.data);
//         setTickets(
//           response.data.map((ticket: any) => ({
//             ...ticket,
//             id: ticket.ticket_id,
//             ticket_id: ticket.ticket_id,
//             userId: ticket.client_id,
//             client_id: ticket.client_id,
//             title: ticket.issue_title,
//             issue_title: ticket.issue_title,
//             ticketType: ticket.ticket_type,
//             ticket_type: ticket.ticket_type,
//             createdAt: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
//             created_at: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
//             updatedAt: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
//             updated_at: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
//             closed_at: ticket.closed_at ? new Date(ticket.closed_at).toISOString() : null,
//             clientClosed: Boolean(ticket.clientClosed),
//             adminClosed: Boolean(ticket.adminClosed),
//             out_of_scope: Boolean(ticket.out_of_scope),
//           }))
//         );
//       } catch (error) {
//         console.error('Error fetching tickets:', error);
//         alert('Failed to fetch tickets.');
//         setTickets([]);
//       }
//     };

//     fetchTickets();
//   }, [user, router]);

//   const getPriorityColor = (priority: string | null) => {
//     switch (priority) {
//       case 'high':
//         return 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-200';
//       case 'medium':
//         return 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-200';
//       case 'low':
//         return 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-green-200';
//       default:
//         return 'bg-gradient-to-r from-slate-400 to-slate-500 shadow-slate-200';
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'raised':
//         return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200';
//       case 'confirmed by oem':
//         return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-200';
//       case 'resolved':
//         return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-200';
//       case 'closed':
//         return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-slate-200';
//       default:
//         return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200';
//     }
//   };

//   const handleViewDetails = (ticket: Ticket) => {
//     setSelectedTicket(ticket);
//     setIsTicketModalOpen(true);
//   };

//   const handleUpdateStatus = (ticket: Ticket) => {
//     setUpdateTicket(ticket);
//     setComments(ticket.comments || '');
//     setTicketType(ticket.ticket_type || '');
//     setIsUpdateModalOpen(true);
//   };

//   const handleCloseTicket = async (ticket: Ticket, role: 'admin' | 'client' | 'clientMember') => {
//     if (role === 'admin') {
//       if (!ticket.clientClosed) {
//         alert('Cannot close ticket: Client must close the ticket first.');
//         return;
//       }
//       setUpdateTicket(ticket);
//       setAdminSummary(ticket.summary || '');
//       setAdminAttachment(null);
//       setAdminOutOfScope(ticket.out_of_scope);
//       setAdminOutOfScopeReason(ticket.out_of_scope_reason || '');
//       setIsAdminSummaryModalOpen(true);
//     } else {
//       if (ticket.status !== 'resolved') {
//         alert('Cannot close ticket: Ticket must be resolved first.');
//         return;
//       }
//       setUpdateTicket(ticket);
//       setFeedback({ experience: '', rating: 0, timeAmount: '' });
//       setIsFeedbackModalOpen(true);
//     }
//   };

//   const handleStatusUpdate = async () => {
//     if (!updateTicket || !user?.token) return;

//     // Enforce ticket_type for 'confirmed by oem' status
//     if (updateTicket.status === 'raised' && !ticketType) {
//       alert('Please select a ticket type before confirming.');
//       return;
//     }

//     try {
//       const newStatus =
//         updateTicket.status === 'raised'
//           ? 'confirmed by oem'
//           : updateTicket.status === 'confirmed by oem'
//           ? 'resolved'
//           : updateTicket.status === 'resolved'
//           ? 'closed'
//           : updateTicket.status;
//       const response = await axios.put(
//         `/api/tickets?id=${updateTicket.ticket_id}`,
//         { status: newStatus, comments, ticket_type: ticketType },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       setTickets(
//         tickets.map((t) =>
//           t.ticket_id === updateTicket.ticket_id
//             ? {
//                 ...t,
//                 status: newStatus,
//                 comments,
//                 ticket_type: ticketType,
//                 ticketType: ticketType,
//                 updated_at: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//               }
//             : t
//         )
//       );
//       setIsUpdateModalOpen(false);
//       setComments('');
//       setTicketType('');
//     } catch (error) {
//       console.error('Error updating ticket:', error);
//       alert('Failed to update ticket status.');
//     }
//   };

//   const handleAdminSummarySubmit = async () => {
//     if (!updateTicket || !user?.token || !adminSummary.trim()) return;

//     try {
//       const formData = new FormData();
//       formData.append('summary', adminSummary);
//       formData.append('out_of_scope', adminOutOfScope.toString());
//       if (adminOutOfScope) formData.append('out_of_scope_reason', adminOutOfScopeReason);
//       if (adminAttachment) formData.append('attachment', adminAttachment);

//       const response = await axios.post(
//         `/api/tickets?action=close&id=${updateTicket.ticket_id}`,
//         formData,
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       setTickets(
//         tickets.map((t) =>
//           t.ticket_id === updateTicket.ticket_id
//             ? {
//                 ...t,
//                 adminClosed: true,
//                 summary: adminSummary,
//                 attachments: adminAttachment
//                   ? t.attachments
//                     ? `${t.attachments},${adminAttachment.name}`
//                     : adminAttachment.name
//                   : t.attachments,
//                 out_of_scope: adminOutOfScope,
//                 out_of_scope_reason: adminOutOfScope ? adminOutOfScopeReason : null,
//                 status: t.clientClosed ? 'closed' : t.status,
//                 updated_at: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//                 closed_at: new Date().toISOString(),
//               }
//             : t
//         )
//       );
//       setIsAdminSummaryModalOpen(false);
//       setAdminSummary('');
//       setAdminAttachment(null);
//       setAdminOutOfScope(false);
//       setAdminOutOfScopeReason('');
//     } catch (error) {
//       console.error('Error closing ticket:', error);
//       alert('Failed to close ticket.');
//     }
//   };

//   const handleFeedbackSubmit = async () => {
//     if (!updateTicket || !user?.token || !feedback.experience.trim() || feedback.rating === 0) return;

//     try {
//       const response = await axios.post(
//         `/api/tickets?action=close&id=${updateTicket.ticket_id}`,
//         {
//           experience: feedback.experience,
//           rating: feedback.rating,
//           time_saved: feedback.timeAmount ? parseInt(feedback.timeAmount) : null,
//         },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       setTickets(
//         tickets.map((t) =>
//           t.ticket_id === updateTicket.ticket_id
//             ? {
//                 ...t,
//                 clientClosed: true,
//                 status: t.adminClosed ? 'closed' : t.status,
//                 updated_at: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//                 closed_at: t.adminClosed ? new Date().toISOString() : t.closed_at,
//               }
//             : t
//         )
//       );
//       setIsFeedbackModalOpen(false);
//       setFeedback({ experience: '', rating: 0, timeAmount: '' });
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//       alert('Failed to submit feedback.');
//     }
//   };

//   const filteredTickets = tickets.filter((ticket) => {
//     const matchesSearch = ticket.issue_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
//     const matchesClient = clientFilter === 'all' || ticket.client?.client_username === clientFilter;
//     return matchesSearch && matchesStatus && matchesClient;
//   });

//   // Simple stats
//   const totalTickets = tickets.length;
//   const closedTickets = tickets.filter((t) => t.status === 'closed').length;
//   const resolvedTickets = tickets.filter((t) => t.status === 'resolved').length;
//   const openTickets = totalTickets - closedTickets; // considers raised/confirmed/resolved as not fully closed
//   const inProgressTickets = tickets.filter((t) => t.status === 'confirmed by oem').length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
//       <div className="container mx-auto p-6 space-y-8">
//         {/* Enhanced Header Section */}
//         <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5" />
//           <div className="relative p-8">
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
//                     <BarChart3 className="h-8 w-8 text-white" />
//                   </div>
//                   <div>
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
//                       {user?.role === 'admin' ? 'Ticket Management' : 'My Support Center'}
//                     </h1>
//                     <p className="text-slate-600 text-lg mt-1">
//                       {user?.role === 'admin' 
//                         ? 'Monitor and manage all support requests across your organization' 
//                         : 'Track your support requests and their resolution progress'}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {(user?.role === 'client' || user?.role === 'clientMember') && (
//                 <Button
//                   onClick={() => router.push('/tickets/new')}
//                   size="lg"
//                   className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
//                   <Plus className="h-5 w-5 mr-2" />
//                   Create New Ticket
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />
//             <CardHeader className="relative flex flex-row items-center justify-between pb-3">
//               <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Total Tickets</CardTitle>
//               <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
//                 <Activity className="h-5 w-5 text-white" />
//               </div>
//             </CardHeader>
//             <CardContent className="relative">
//               <div className="text-3xl font-bold text-slate-900 mb-1">{totalTickets}</div>
//               <div className="flex items-center gap-2">
//                 <TrendingUp className="h-4 w-4 text-green-600" />
//                 <span className="text-sm text-slate-500">All time</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-amber-50 border border-amber-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
//             <CardHeader className="relative flex flex-row items-center justify-between pb-3">
//               <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Open Tickets</CardTitle>
//               <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg">
//                 <AlertCircle className="h-5 w-5 text-white" />
//               </div>
//             </CardHeader>
//             <CardContent className="relative">
//               <div className="text-3xl font-bold text-slate-900 mb-1">{openTickets}</div>
//               <div className="flex items-center gap-2">
//                 <Clock className="h-4 w-4 text-amber-600" />
//                 <span className="text-sm text-slate-500">Pending resolution</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5" />
//             <CardHeader className="relative flex flex-row items-center justify-between pb-3">
//               <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Resolved</CardTitle>
//               <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg">
//                 <CheckCircle2 className="h-5 w-5 text-white" />
//               </div>
//             </CardHeader>
//             <CardContent className="relative">
//               <div className="text-3xl font-bold text-slate-900 mb-1">{resolvedTickets}</div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//                 <span className="text-sm text-slate-500">Ready to close</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
//             <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5" />
//             <CardHeader className="relative flex flex-row items-center justify-between pb-3">
//               <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Closed</CardTitle>
//               <div className="p-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg shadow-lg">
//                 <XCircle className="h-5 w-5 text-white" />
//               </div>
//             </CardHeader>
//             <CardContent className="relative">
//               <div className="text-3xl font-bold text-slate-900 mb-1">{closedTickets}</div>
//               <div className="flex items-center gap-2">
//                 <XCircle className="h-4 w-4 text-slate-600" />
//                 <span className="text-sm text-slate-500">Completed</span>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Enhanced Search and Filter Section */}
//         <Card className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-xl">
//           <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent" />
//           <CardContent className="relative p-6">
//             <div className="flex flex-col lg:flex-row gap-4 items-center">
//               <div className="flex-1 w-full relative group">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 h-5 w-5 transition-colors" />
//                 <Input
//                   placeholder="Search tickets by title or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-12 pr-4 py-3 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-white shadow-sm"
//                 />
//               </div>
//               <div className="flex gap-3 w-full lg:w-auto">
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-full lg:w-48 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-white shadow-sm">
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent className="border-slate-200 rounded-xl shadow-xl">
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="raised">Raised</SelectItem>
//                     <SelectItem value="confirmed by oem">Confirmed by OEM</SelectItem>
//                     <SelectItem value="resolved">Resolved</SelectItem>
//                     <SelectItem value="closed">Closed</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {user?.role === 'admin' && (
//                   <Select value={clientFilter} onValueChange={setClientFilter}>
//                     <SelectTrigger className="w-full lg:w-48 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-white shadow-sm">
//                       <SelectValue placeholder="Filter by client" />
//                     </SelectTrigger>
//                     <SelectContent className="border-slate-200 rounded-xl shadow-xl">
//                       <SelectItem value="all">All Clients</SelectItem>
//                       <SelectItem value="AMNSI">AMNSI</SelectItem>
//                       <SelectItem value="URJA">URJA</SelectItem>
//                       <SelectItem value="SAIL">SAIL</SelectItem>
//                       <SelectItem value="JSPL">JSPL</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 )}
//                 <Button variant="outline" size="icon" className="border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm">
//                   <Filter className="h-5 w-5 text-slate-600" />
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Enhanced Tickets List */}
//         <div className="space-y-6">
//           {filteredTickets.map((ticket) => (
//             <Card key={ticket.ticket_id} className="group relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl">
//               {/* Priority Indicator */}
//               <div className={`absolute top-0 left-0 w-2 h-full ${getPriorityColor(ticket.priority)} opacity-80`} />
              
//               <CardContent className="relative p-6">
//                 <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
//                   <div className="flex-1 space-y-4">
//                     {/* Header */}
//                     <div className="space-y-3">
//                       <div className="flex items-start flex-wrap gap-3">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-800 transition-colors duration-300">
//                             #{ticket.ticket_id}
//                           </h3>
//                           <p className="text-lg text-slate-700 mt-1 font-medium">
//                             {ticket.issue_title}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Badge className={`text-white font-medium px-3 py-1 rounded-full shadow-md ${getPriorityColor(ticket.priority)}`}>
//                             {(ticket.priority?.toUpperCase() || 'UNKNOWN')} PRIORITY
//                           </Badge>
//                           <Badge className={`font-medium px-3 py-1 rounded-full shadow-md flex items-center gap-1 ${getStatusColor(ticket.status || 'unknown')}`}>
//                             {getStatusIcon(ticket.status || 'unknown')}
//                             {ticket.status?.toUpperCase() || 'UNKNOWN'}
//                           </Badge>
//                         </div>
//                       </div>

//                       {/* Client and Scope Badges */}
//                       <div className="flex items-center flex-wrap gap-3">
//                         {user?.role === 'admin' && ticket.client?.client_username && (
//                           <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 font-medium shadow-sm">
//                             <User className="h-4 w-4" />
//                             {ticket.client.client_username}
//                           </span>
//                         )}
//                         {ticket.out_of_scope && (
//                           <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium px-3 py-1 rounded-full shadow-md">
//                             Out of Scope
//                           </Badge>
//                         )}
//                         {ticket.ticket_type && (
//                           <Badge className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium px-3 py-1 rounded-full shadow-md">
//                             {ticket.ticket_type}
//                           </Badge>
//                         )}
//                       </div>
//                     </div>

//                     {/* Description */}
//                     <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 rounded-lg border border-slate-100">
//                       <p className="text-slate-700 leading-relaxed">
//                         {ticket.description || 'No description provided'}
//                       </p>
//                     </div>

//                     {/* Status Tracker */}
//                     <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
//                       <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">Progress Tracker</h4>
//                       <StatusTracker 
//                         status={ticket.status as 'raised' | 'in-progress' | 'confirmed by oem' | 'resolved' | 'closed'} 
//                         priority={ticket.priority || 'medium'}
//                         createdAt={ticket.created_at}
//                       />
//                     </div>

//                     {/* Metadata */}
//                     <div className="flex flex-wrap gap-4 text-sm text-slate-600">
//                       <span className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4 text-blue-500" />
//                         <span className="font-medium">Created:</span>
//                         {new Date(ticket.created_at).toLocaleDateString('en-US', { 
//                           year: 'numeric', 
//                           month: 'short', 
//                           day: 'numeric',
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </span>
//                       <span className="flex items-center gap-2">
//                         <Clock className="h-4 w-4 text-emerald-500" />
//                         <span className="font-medium">Updated:</span>
//                         {new Date(ticket.updated_at).toLocaleDateString('en-US', { 
//                           year: 'numeric', 
//                           month: 'short', 
//                           day: 'numeric',
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </span>
//                       {ticket.attachments && (
//                         <span className="flex items-center gap-2">
//                           <span className="font-medium">Attachments:</span>
//                           {ticket.attachments}
//                         </span>
//                       )}
//                     </div>

//                     {ticket.out_of_scope && ticket.out_of_scope_reason && (
//                       <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
//                         <span className="text-sm font-medium text-purple-800">Out of Scope Reason:</span>
//                         <p className="text-purple-700 mt-1">{ticket.out_of_scope_reason}</p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col gap-2 min-w-fit">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 text-slate-700 hover:from-slate-100 hover:to-slate-200 font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
//                       onClick={() => handleViewDetails(ticket)}
//                     >
//                       View Details
//                     </Button>
//                     {user?.role === 'admin' && ticket.status !== 'closed' && (
//                       <>
//                         <Button
//                           size="sm"
//                           className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
//                           onClick={() => handleUpdateStatus(ticket)}
//                           disabled={ticket.status === 'resolved'}
//                         >
//                           Update Status
//                         </Button>
//                         <Button
//                           size="sm"
//                           className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
//                           onClick={() => handleCloseTicket(ticket, 'admin')}
//                           disabled={ticket.adminClosed || !ticket.clientClosed}
//                         >
//                           Close Ticket
//                         </Button>
//                       </>
//                     )}
//                     {(user?.role === 'client' || user?.role === 'clientMember') &&
//                       ticket.status === 'resolved' &&
//                       !ticket.clientClosed && (
//                         <Button
//                           size="sm"
//                           className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
//                           onClick={() => handleCloseTicket(ticket, user.role)}
//                         >
//                           Close Ticket
//                         </Button>
//                       )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Empty State */}
//         {filteredTickets.length === 0 && (
//           <Card className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-lg rounded-xl">
//             <CardContent className="relative p-8 text-center">
//               <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
//                 <Search className="h-12 w-12 text-slate-400" />
//               </div>
//               <h3 className="text-2xl font-semibold text-slate-800 mb-2">No tickets found</h3>
//               <p className="text-slate-600 max-w-md mx-auto">
//                 No tickets match your current search criteria. Try adjusting your filters or search terms.
//               </p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Modals remain the same but with enhanced styling */}
//         <TicketDetailsModal
//           isOpen={isTicketModalOpen}
//           onClose={() => {
//             setIsTicketModalOpen(false);
//             setSelectedTicket(null);
//           }}
//           ticket={selectedTicket}
//         />

//         {/* Enhanced Update Modal */}
//         <Dialog open={isUpdateModalOpen} onOpenChange={(open) => {
//           setIsUpdateModalOpen(open);
//           if (!open) {
//             setUpdateTicket(null);
//             setComments('');
//             setTicketType('');
//           }
//         }}>
//           <DialogContent className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl border border-slate-200 max-w-2xl">
//             <DialogHeader className="pb-6">
//               <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
//                 Update Ticket Status
//               </DialogTitle>
//             </DialogHeader>
//             {updateTicket && (
//               <div className="space-y-6">
//                 <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
//                   <p className="text-lg font-semibold text-slate-800">
//                     Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
//                   </p>
//                   <p className="text-sm text-slate-600 mt-1">Current Status: <span className="font-medium">{updateTicket.status}</span></p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Comments</label>
//                   <Textarea
//                     value={comments}
//                     onChange={(e) => setComments(e.target.value)}
//                     placeholder="Add comments for status update..."
//                     className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-white shadow-sm min-h-[100px]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Ticket Type</label>
//                   <Select value={ticketType} onValueChange={setTicketType}>
//                     <SelectTrigger className="w-full border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-white shadow-sm">
//                       <SelectValue placeholder="Select ticket type" />
//                     </SelectTrigger>
//                     <SelectContent className="border-slate-200 rounded-xl shadow-xl">
//                       <SelectItem value="RS1">RS1</SelectItem>
//                       <SelectItem value="RS2">RS2</SelectItem>
//                       <SelectItem value="RS3-1">RS3-1</SelectItem>
//                       <SelectItem value="RS3-2">RS3-2</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <DialogFooter className="gap-3 pt-4">
//                   <Button
//                     variant="outline"
//                     className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-medium"
//                     onClick={() => setIsUpdateModalOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
//                     onClick={handleStatusUpdate}
//                     disabled={!comments.trim() || !ticketType}
//                   >
//                     Update Status
//                   </Button>
//                 </DialogFooter>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>

//         {/* Enhanced Feedback Modal */}
//         <Dialog open={isFeedbackModalOpen} onOpenChange={(open) => {
//           setIsFeedbackModalOpen(open);
//           if (!open) {
//             setUpdateTicket(null);
//             setFeedback({ experience: '', rating: 0, timeAmount: '' });
//           }
//         }}>
//           <DialogContent className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-2xl border border-emerald-100 max-w-2xl">
//             <DialogHeader className="pb-6">
//               <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent">
//                 Ticket Feedback
//               </DialogTitle>
//             </DialogHeader>
//             {updateTicket && (
//               <div className="space-y-6">
//                 <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
//                   <p className="text-lg font-semibold text-slate-800">
//                     Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Your Experience</label>
//                   <Textarea
//                     value={feedback.experience}
//                     onChange={(e) => setFeedback({ ...feedback, experience: e.target.value })}
//                     placeholder="Describe your experience with this ticket resolution..."
//                     className="border-slate-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl bg-white shadow-sm min-h-[100px]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
//                   <div className="flex gap-2 mt-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Button
//                         key={star}
//                         variant="ghost"
//                         size="lg"
//                         onClick={() => setFeedback({ ...feedback, rating: star })}
//                         className={`p-3 rounded-xl transition-all duration-300 ${
//                           feedback.rating >= star 
//                             ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
//                             : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
//                         }`}
//                       >
//                         <Star className="h-6 w-6" fill={feedback.rating >= star ? 'currentColor' : 'none'} />
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Time Saved (hours)</label>
//                   <Input
//                     type="number"
//                     value={feedback.timeAmount}
//                     onChange={(e) => setFeedback({ ...feedback, timeAmount: e.target.value })}
//                     placeholder="Enter time saved in hours (e.g., 2)"
//                     className="border-slate-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl bg-white shadow-sm"
//                   />
//                 </div>
//                 <DialogFooter className="gap-3 pt-4">
//                   <Button
//                     variant="outline"
//                     className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-medium"
//                     onClick={() => setIsFeedbackModalOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
//                     onClick={handleFeedbackSubmit}
//                     disabled={!feedback.experience.trim() || feedback.rating === 0}
//                   >
//                     Submit Feedback
//                   </Button>
//                 </DialogFooter>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>

//         {/* Enhanced Admin Summary Modal */}
//         <Dialog open={isAdminSummaryModalOpen} onOpenChange={(open) => {
//           setIsAdminSummaryModalOpen(open);
//           if (!open) {
//             setUpdateTicket(null);
//             setAdminSummary('');
//             setAdminAttachment(null);
//             setAdminOutOfScope(false);
//             setAdminOutOfScopeReason('');
//           }
//         }}>
//           <DialogContent className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-100 max-w-2xl">
//             <DialogHeader className="pb-6">
//               <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
//                 Close Ticket - Admin Summary
//               </DialogTitle>
//             </DialogHeader>
//             {updateTicket && (
//               <div className="space-y-6">
//                 <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
//                   <p className="text-lg font-semibold text-slate-800">
//                     Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Summary of Resolution</label>
//                   <Textarea
//                     value={adminSummary}
//                     onChange={(e) => setAdminSummary(e.target.value)}
//                     placeholder="Provide a brief summary of the ticket resolution..."
//                     className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-white shadow-sm min-h-[100px]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-slate-700 mb-2">Attachment</label>
//                   <Input
//                     type="file"
//                     onChange={(e) => setAdminAttachment(e.target.files?.[0] || null)}
//                     className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-white shadow-sm"
//                   />
//                 </div>
//                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
//                   <div className="flex items-center gap-3 mb-3">
//                     <input
//                       type="checkbox"
//                       checked={adminOutOfScope}
//                       onChange={(e) => setAdminOutOfScope(e.target.checked)}
//                       className="w-5 h-5 text-purple-600 bg-white border-slate-300 rounded focus:ring-purple-500"
//                     />
//                     <span className="text-sm font-semibold text-slate-700">Mark as Out of Scope</span>
//                   </div>
//                   {adminOutOfScope && (
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Out of Scope</label>
//                       <Textarea
//                         value={adminOutOfScopeReason}
//                         onChange={(e) => setAdminOutOfScopeReason(e.target.value)}
//                         placeholder="Provide reason for marking as out of scope..."
//                         className="border-slate-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl bg-white shadow-sm"
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <DialogFooter className="gap-3 pt-4">
//                   <Button
//                     variant="outline"
//                     className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-medium"
//                     onClick={() => setIsAdminSummaryModalOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
//                     onClick={handleAdminSummarySubmit}
//                     disabled={!adminSummary.trim() || (adminOutOfScope && !adminOutOfScopeReason.trim())}
//                   >
//                     Submit Summary
//                   </Button>
//                 </DialogFooter>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default Tickets;





"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  Filter,
  Star,
  User,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react"
import { FileText, PlayCircle, Shield, CheckCircle, CloudIcon as ClosedIcon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import { StatusTracker } from "@/components/Tickets/StatusTracker"
import TicketDetailsModal from "@/components/Tickets/TicketDetailsModal"
import { useRouter } from "next/navigation"
import axios from "axios"
import type { Ticket } from "@/types"

interface Feedback {
  experience: string
  rating: number
  timeAmount: string
}

const Tickets = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [clientFilter, setClientFilter] = useState("all")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isAdminSummaryModalOpen, setIsAdminSummaryModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [updateTicket, setUpdateTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState("")
  const [ticketType, setTicketType] = useState("")
  const [feedback, setFeedback] = useState<Feedback>({
    experience: "",
    rating: 0,
    timeAmount: "",
  })
  const [adminSummary, setAdminSummary] = useState("")
  const [adminAttachment, setAdminAttachment] = useState<File | null>(null)
  const [adminOutOfScope, setAdminOutOfScope] = useState(false)
  const [adminOutOfScopeReason, setAdminOutOfScopeReason] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "raised":
        return <FileText className="h-4 w-4" />
      case "in-progress":
        return <PlayCircle className="h-4 w-4" />
      case "confirmed by oem":
        return <Shield className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <ClosedIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user || !user.token) {
        console.warn("No user or token available")
        setTickets([])
        router.push("/")
        return
      }

      try {
        const response = await axios.get("/api/tickets", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        console.log("Fetched tickets:", response.data)
        setTickets(
          response.data.map((ticket: any) => ({
            ...ticket,
            id: ticket.ticket_id,
            ticket_id: ticket.ticket_id,
            userId: ticket.client_id,
            client_id: ticket.client_id,
            title: ticket.issue_title,
            issue_title: ticket.issue_title,
            ticketType: ticket.ticket_type,
            ticket_type: ticket.ticket_type,
            createdAt: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
            created_at: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
            updatedAt: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
            updated_at: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
            closed_at: ticket.closed_at ? new Date(ticket.closed_at).toISOString() : null,
            clientClosed: Boolean(ticket.clientClosed),
            adminClosed: Boolean(ticket.adminClosed),
            out_of_scope: Boolean(ticket.out_of_scope),
          })),
        )
      } catch (error) {
        console.error("Error fetching tickets:", error)
        alert("Failed to fetch tickets.")
        setTickets([])
      }
    }

    fetchTickets()
  }, [user, router])

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "raised":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "confirmed by oem":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200"
      case "closed":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsTicketModalOpen(true)
  }

  const handleUpdateStatus = (ticket: Ticket) => {
    setUpdateTicket(ticket)
    setComments(ticket.comments || "")
    setTicketType(ticket.ticket_type || "")
    setIsUpdateModalOpen(true)
  }

  const handleCloseTicket = async (ticket: Ticket, role: "admin" | "client" | "clientMember") => {
    if (role === "admin") {
      if (!ticket.clientClosed) {
        alert("Cannot close ticket: Client must close the ticket first.")
        return
      }
      setUpdateTicket(ticket)
      setAdminSummary(ticket.summary || "")
      setAdminAttachment(null)
      setAdminOutOfScope(ticket.out_of_scope)
      setAdminOutOfScopeReason(ticket.out_of_scope_reason || "")
      setIsAdminSummaryModalOpen(true)
    } else {
      if (ticket.status !== "resolved") {
        alert("Cannot close ticket: Ticket must be resolved first.")
        return
      }
      setUpdateTicket(ticket)
      setFeedback({ experience: "", rating: 0, timeAmount: "" })
      setIsFeedbackModalOpen(true)
    }
  }

  const handleStatusUpdate = async () => {
    if (!updateTicket || !user?.token) return

    // Enforce ticket_type for 'confirmed by oem' status
    if (updateTicket.status === "raised" && !ticketType) {
      alert("Please select a ticket type before confirming.")
      return
    }

    try {
      const newStatus =
        updateTicket.status === "raised"
          ? "confirmed by oem"
          : updateTicket.status === "confirmed by oem"
            ? "resolved"
            : updateTicket.status === "resolved"
              ? "closed"
              : updateTicket.status
      const response = await axios.put(
        `/api/tickets?id=${updateTicket.ticket_id}`,
        { status: newStatus, comments, ticket_type: ticketType },
        { headers: { Authorization: `Bearer ${user.token}` } },
      )
      setTickets(
        tickets.map((t) =>
          t.ticket_id === updateTicket.ticket_id
            ? {
                ...t,
                status: newStatus,
                comments,
                ticket_type: ticketType,
                ticketType: ticketType,
                updated_at: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      )
      setIsUpdateModalOpen(false)
      setComments("")
      setTicketType("")
    } catch (error) {
      console.error("Error updating ticket:", error)
      alert("Failed to update ticket status.")
    }
  }

  const handleAdminSummarySubmit = async () => {
    if (!updateTicket || !user?.token || !adminSummary.trim()) return

    try {
      const formData = new FormData()
      formData.append("summary", adminSummary)
      formData.append("out_of_scope", adminOutOfScope.toString())
      if (adminOutOfScope) formData.append("out_of_scope_reason", adminOutOfScopeReason)
      if (adminAttachment) formData.append("attachment", adminAttachment)

      const response = await axios.post(`/api/tickets?action=close&id=${updateTicket.ticket_id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      })

      setTickets(
        tickets.map((t) =>
          t.ticket_id === updateTicket.ticket_id
            ? {
                ...t,
                adminClosed: true,
                summary: adminSummary,
                attachments: adminAttachment
                  ? t.attachments
                    ? `${t.attachments},${adminAttachment.name}`
                    : adminAttachment.name
                  : t.attachments,
                out_of_scope: adminOutOfScope,
                out_of_scope_reason: adminOutOfScope ? adminOutOfScopeReason : null,
                status: t.clientClosed ? "closed" : t.status,
                updated_at: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                closed_at: new Date().toISOString(),
              }
            : t,
        ),
      )
      setIsAdminSummaryModalOpen(false)
      setAdminSummary("")
      setAdminAttachment(null)
      setAdminOutOfScope(false)
      setAdminOutOfScopeReason("")
    } catch (error) {
      console.error("Error closing ticket:", error)
      alert("Failed to close ticket.")
    }
  }

  const handleFeedbackSubmit = async () => {
    if (!updateTicket || !user?.token || !feedback.experience.trim() || feedback.rating === 0) return

    try {
      const response = await axios.post(
        `/api/tickets?action=close&id=${updateTicket.ticket_id}`,
        {
          experience: feedback.experience,
          rating: feedback.rating,
          time_saved: feedback.timeAmount ? Number.parseInt(feedback.timeAmount) : null,
        },
        { headers: { Authorization: `Bearer ${user.token}` } },
      )
      setTickets(
        tickets.map((t) =>
          t.ticket_id === updateTicket.ticket_id
            ? {
                ...t,
                clientClosed: true,
                status: t.adminClosed ? "closed" : t.status,
                updated_at: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                closed_at: t.adminClosed ? new Date().toISOString() : t.closed_at,
              }
            : t,
        ),
      )
      setIsFeedbackModalOpen(false)
      setFeedback({ experience: "", rating: 0, timeAmount: "" })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Failed to submit feedback.")
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.issue_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesClient = clientFilter === "all" || ticket.client?.client_username === clientFilter
    return matchesSearch && matchesStatus && matchesClient
  })

  // Simple stats
  const totalTickets = tickets.length
  const closedTickets = tickets.filter((t) => t.status === "closed").length
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length
  const openTickets = totalTickets - closedTickets // considers raised/confirmed/resolved as not fully closed
  const inProgressTickets = tickets.filter((t) => t.status === "confirmed by oem").length

  return (
    <div className="min-h-screen bg-gray-50">
     <div className="container mx-auto p-6 space-y-6">
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="p-6 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {user?.role === "admin" ? "Ticket Management" : "My Support Center"}
              </h1>
              <p className="text-gray-600">
                {user?.role === "admin"
                  ? "Monitor and manage all support requests"
                  : "Track your support requests and their progress"}
              </p>
            </div>
          </div>
        </div>

        {(user?.role === "client" || user?.role === "clientMember") && (
          <Button
            onClick={() => router.push("/tickets/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        )}
      </div>

      {/* Tickets Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Tickets</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-900">{totalTickets}</div>
            <p className="text-xs text-blue-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Open Tickets</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-orange-900">{openTickets}</div>
            <p className="text-xs text-orange-600 mt-1">Pending resolution</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Resolved</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-900">{resolvedTickets}</div>
            <p className="text-xs text-green-600 mt-1">Ready to close</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Closed</CardTitle>
            <div className="p-2 bg-gray-500 rounded-lg">
              <XCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">{closedTickets}</div>
            <p className="text-xs text-gray-600 mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>
      
    </div>
  </div>



        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tickets by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="raised">Raised</SelectItem>
                    <SelectItem value="confirmed by oem">Confirmed by OEM</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                {user?.role === "admin" && (
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger className="w-full lg:w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Filter by client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      <SelectItem value="AMNSI">AMNSI</SelectItem>
                      <SelectItem value="URJA">URJA</SelectItem>
                      <SelectItem value="SAIL">SAIL</SelectItem>
                      <SelectItem value="JSPL">JSPL</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50 bg-transparent">
                  <Filter className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card
              key={ticket.ticket_id}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div
                className={`h-1 w-full ${ticket.priority === "high" ? "bg-red-500" : ticket.priority === "medium" ? "bg-blue-500" : ticket.priority === "low" ? "bg-green-500" : "bg-gray-400"}`}
              />

              <CardContent className="p-4">
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start flex-wrap gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">#{ticket.ticket_id}</h3>
                          <p className="text-gray-700 font-medium">{ticket.issue_title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs font-medium px-2 py-1 border ${getPriorityColor(ticket.priority)}`}
                          >
                            {ticket.priority?.toUpperCase() || "UNKNOWN"} PRIORITY
                          </Badge>
                          <Badge
                            className={`text-xs font-medium px-2 py-1 border flex items-center gap-1 ${getStatusColor(ticket.status || "unknown")}`}
                          >
                            {getStatusIcon(ticket.status || "unknown")}
                            {ticket.status?.toUpperCase() || "UNKNOWN"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2">
                        {user?.role === "admin" && ticket.client?.client_username && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 border border-gray-200 rounded-md">
                            <User className="h-3 w-3" />
                            {ticket.client.client_username}
                          </span>
                        )}
                        {ticket.out_of_scope && (
                          <Badge className="text-xs bg-purple-100 text-purple-800 border border-purple-200">
                            Out of Scope
                          </Badge>
                        )}
                        {ticket.ticket_type && (
                          <Badge className="text-xs bg-teal-100 text-teal-800 border border-teal-200">
                            {ticket.ticket_type}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {ticket.description || "No description provided"}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-md border border-gray-200">
                      <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                        Progress Tracker
                      </h4>
                      <StatusTracker
                        status={ticket.status as "raised" | "in-progress" | "confirmed by oem" | "resolved" | "closed"}
                        priority={ticket.priority || "medium"}
                        createdAt={ticket.created_at}
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">Created:</span>
                        {new Date(ticket.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">Updated:</span>
                        {new Date(ticket.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {ticket.attachments && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Attachments:</span>
                          {ticket.attachments}
                        </span>
                      )}
                    </div>

                    {ticket.out_of_scope && ticket.out_of_scope_reason && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                        <span className="text-xs font-medium text-purple-800">Out of Scope Reason:</span>
                        <p className="text-purple-700 text-sm mt-1">{ticket.out_of_scope_reason}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-w-fit">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      onClick={() => handleViewDetails(ticket)}
                    >
                      View Details
                    </Button>
                    {user?.role === "admin" && ticket.status !== "closed" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleUpdateStatus(ticket)}
                          disabled={ticket.status === "resolved"}
                        >
                          Update Status
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleCloseTicket(ticket, "admin")}
                          disabled={ticket.adminClosed || !ticket.clientClosed}
                        >
                          Close Ticket
                        </Button>
                      </>
                    )}
                    {(user?.role === "client" || user?.role === "clientMember") &&
                      ticket.status === "resolved" &&
                      !ticket.clientClosed && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleCloseTicket(ticket, user.role)}
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

        {/* Empty State */}
        {filteredTickets.length === 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No tickets found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No tickets match your current search criteria. Try adjusting your filters or search terms.
              </p>
            </CardContent>
          </Card>
        )}

        <TicketDetailsModal
          isOpen={isTicketModalOpen}
          onClose={() => {
            setIsTicketModalOpen(false)
            setSelectedTicket(null)
          }}
          ticket={selectedTicket}
        />

        {/* Update Modal */}
        <Dialog
          open={isUpdateModalOpen}
          onOpenChange={(open) => {
            setIsUpdateModalOpen(open)
            if (!open) {
              setUpdateTicket(null)
              setComments("")
              setTicketType("")
            }
          }}
        >
          <DialogContent className="bg-white border border-gray-200 shadow-lg max-w-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-gray-900">Update Ticket Status</DialogTitle>
            </DialogHeader>
            {updateTicket && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="font-medium text-gray-800">
                    Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Current Status: <span className="font-medium">{updateTicket.status}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add comments for status update..."
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Type</label>
                  <Select value={ticketType} onValueChange={setTicketType}>
                    <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RS1">RS1</SelectItem>
                      <SelectItem value="RS2">RS2</SelectItem>
                      <SelectItem value="RS3-1">RS3-1</SelectItem>
                      <SelectItem value="RS3-2">RS3-2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    onClick={() => setIsUpdateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
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

        {/* Feedback Modal */}
        <Dialog
          open={isFeedbackModalOpen}
          onOpenChange={(open) => {
            setIsFeedbackModalOpen(open)
            if (!open) {
              setUpdateTicket(null)
              setFeedback({ experience: "", rating: 0, timeAmount: "" })
            }
          }}
        >
          <DialogContent className="bg-white border border-gray-200 shadow-lg max-w-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-gray-900">Ticket Feedback</DialogTitle>
            </DialogHeader>
            {updateTicket && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="font-medium text-gray-800">
                    Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
                  <Textarea
                    value={feedback.experience}
                    onChange={(e) => setFeedback({ ...feedback, experience: e.target.value })}
                    placeholder="Describe your experience with this ticket resolution..."
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="sm"
                        onClick={() => setFeedback({ ...feedback, rating: star })}
                        className={`p-2 ${
                          feedback.rating >= star
                            ? "text-yellow-500 hover:text-yellow-600"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        <Star className="h-5 w-5" fill={feedback.rating >= star ? "currentColor" : "none"} />
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Saved (hours)</label>
                  <Input
                    type="number"
                    value={feedback.timeAmount}
                    onChange={(e) => setFeedback({ ...feedback, timeAmount: e.target.value })}
                    placeholder="Enter time saved in hours (e.g., 2)"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <DialogFooter className="gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    onClick={() => setIsFeedbackModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleFeedbackSubmit}
                    disabled={!feedback.experience.trim() || feedback.rating === 0}
                  >
                    Submit Feedback
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Admin Summary Modal */}
        <Dialog
          open={isAdminSummaryModalOpen}
          onOpenChange={(open) => {
            setIsAdminSummaryModalOpen(open)
            if (!open) {
              setUpdateTicket(null)
              setAdminSummary("")
              setAdminAttachment(null)
              setAdminOutOfScope(false)
              setAdminOutOfScopeReason("")
            }
          }}
        >
          <DialogContent className="bg-white border border-gray-200 shadow-lg max-w-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-gray-900">Close Ticket - Admin Summary</DialogTitle>
            </DialogHeader>
            {updateTicket && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="font-medium text-gray-800">
                    Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary of Resolution</label>
                  <Textarea
                    value={adminSummary}
                    onChange={(e) => setAdminSummary(e.target.value)}
                    placeholder="Provide a brief summary of the ticket resolution..."
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                  <Input
                    type="file"
                    onChange={(e) => setAdminAttachment(e.target.files?.[0] || null)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={adminOutOfScope}
                      onChange={(e) => setAdminOutOfScope(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Out of Scope</span>
                  </div>
                  {adminOutOfScope && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Out of Scope</label>
                      <Textarea
                        value={adminOutOfScopeReason}
                        onChange={(e) => setAdminOutOfScopeReason(e.target.value)}
                        placeholder="Provide reason for marking as out of scope..."
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter className="gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    onClick={() => setIsAdminSummaryModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
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
    </div>
  )
}

export default Tickets
