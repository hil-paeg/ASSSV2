// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { User, Calendar, Clock, MessageSquare } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import TicketStatusTracker from './TicketStatusTracker';
// import { Ticket } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';

// interface TicketDetailsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   ticket: Ticket | null;
// }

// const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ isOpen, onClose, ticket }) => {
//   const { user } = useAuth();
//   const [newComment, setNewComment] = useState('');
//   const [newAttachment, setNewAttachment] = useState<File | null>(null);
//   const [commentHistory, setCommentHistory] = useState([
//     { id: '1', role: 'user', comment: 'Ticket created by user', timestamp: '2024-01-15 10:30 AM', attachments: [] as string[] },
//     { id: '2', role: 'admin', comment: 'Assigned to support team. Investigation started.', timestamp: '2024-01-15 02:15 PM', attachments: [] as string[] },
//     { id: '3', role: 'admin', comment: 'Issue resolved. Solution implemented.', timestamp: '2024-01-16 11:45 AM', attachments: [] as string[] },
//     ...(ticket?.comments && ticket?.ticketType
//       ? [{ id: '4', role: 'admin', comment: `${ticket.comments} (Type: ${ticket.ticketType})`, timestamp: new Date().toLocaleString(), attachments: ticket.attachments ? ticket.attachments.split(',') : [] }]
//       : []),
//   ]);

//   useEffect(() => {
//     if (ticket?.comments && ticket?.ticketType) {
//       setCommentHistory((prev) => [
//         ...prev.filter((comment) => comment.id !== '4'),
//         { id: '4', role: 'admin', comment: `${ticket.comments} (Type: ${ticket.ticketType})`, timestamp: new Date().toLocaleString(), attachments: ticket.attachments ? ticket.attachments.split(',') : [] },
//       ]);
//     }
//   }, [ticket?.comments, ticket?.ticketType, ticket?.attachments]);

//   const getPriorityColor = (priority: string | null) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 text-red-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'low': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'raised': return 'bg-blue-50 text-blue-700';
//       case 'confirmed by oem': return 'bg-purple-50 text-purple-700';
//       case 'resolved': return 'bg-green-50 text-green-700';
//       case 'closed': return 'bg-gray-50 text-gray-700';
//       default: return 'bg-gray-50 text-gray-700';
//     }
//   };

//   const handleCommentSubmit = () => {
//     if (!newComment.trim()) return;

//     const newCommentEntry = {
//       id: `${commentHistory.length + 1}`,
//       role: user?.role === 'admin' ? 'admin' : 'user',
//       comment: newComment,
//       timestamp: new Date().toLocaleString(),
//       attachments: newAttachment ? [newAttachment.name] : [],
//     };

//     setCommentHistory([...commentHistory, newCommentEntry]);
//     setNewComment('');
//     setNewAttachment(null);
//   };

//   if (!ticket) return null;

//   const ticketImages = ticket.attachments ? ticket.attachments.split(',').filter((img) => img.trim()) : [];

//   // Parse timeline field
//   const timeline = ticket.timeline
//     ? Array.isArray(ticket.timeline)
//       ? ticket.timeline
//       : JSON.parse(ticket.timeline)
//     : [];

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-bold">#{ticket.ticket_id} - {ticket.issue_title}</h2>
//               <p className="text-sm text-gray-500 mt-1">Created on {new Date(ticket.created_at).toLocaleDateString()}</p>
//             </div>
//             <Badge className={getPriorityColor(ticket.priority)}>
//               {ticket.priority?.toUpperCase() || 'UNKNOWN'} PRIORITY
//             </Badge>
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Status Tracker */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5" />
//                 Current Status
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <TicketStatusTracker status={ticket.status as 'raised' | 'confirmed by oem' | 'resolved' | 'closed'} />
//             </CardContent>
//           </Card>

//           {/* Description */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Description</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-700 leading-relaxed">{ticket.description || 'No description provided'}</p>
//             </CardContent>
//           </Card>

//           {/* Images */}
//           {ticketImages.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Attached Images</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   {ticketImages.map((image, index) => (
//                     <div key={index} className="border rounded-lg overflow-hidden">
//                       <img 
//                         src={image} 
//                         alt={`Ticket image ${index + 1}`}
//                         className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
//                         onClick={() => window.open(image, '_blank')}
//                       />
//                     </div>
//                   ))}
//                   </div>
//                 </CardContent>
//             </Card>
//           )}

//           {/* Ticket Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <User className="h-5 w-5" />
//                   Ticket Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-600">Ticket ID</p>
//                   <p className="font-medium">{ticket.ticket_id}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Priority</p>
//                   <Badge className={getPriorityColor(ticket.priority)}>
//                     {ticket.priority?.toUpperCase() || 'UNKNOWN'}
//                   </Badge>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Status</p>
//                   <Badge className={getStatusColor(ticket.status)}>
//                     {ticket.status?.toUpperCase() || 'UNKNOWN'}
//                   </Badge>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Created By</p>
//                   <p className="font-medium">{ticket.creator_name || ticket.client?.client_username || 'Unknown'}</p>
//                 </div>
//                 {ticket.ticket_type && (
//                   <div>
//                     <p className="text-sm text-gray-600">Ticket Type</p>
//                     <Badge className="bg-teal-100 text-teal-800">{ticket.ticket_type}</Badge>
//                   </div>
//                 )}
//                 {ticket.out_of_scope && (
//                   <div>
//                     <p className="text-sm text-gray-600">Out of Scope</p>
//                     <Badge className="bg-purple-100 text-purple-800">Out of Scope</Badge>
//                   </div>
//                 )}
//                 {ticket.out_of_scope && ticket.out_of_scope_reason && (
//                   <div>
//                     <p className="text-sm text-gray-600">Out of Scope Reason</p>
//                     <p className="text-sm text-purple-700">{ticket.out_of_scope_reason}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Calendar className="h-5 w-5" />
//                   Event Timeline
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {timeline.length > 0 ? (
//                   <ul className="space-y-2">
//                     {timeline.map((event: { time: string; description: string }, index: number) => (
//                       <li key={index} className="text-sm text-gray-600">
//                         {event.time} - {event.description}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-gray-600">No timeline events available</p>
//                 )}
//                 <div>
//                   <p className="text-sm text-gray-600">Created</p>
//                   <p className="font-medium">{new Date(ticket.created_at).toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'short',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Last Updated</p>
//                   <p className="font-medium">{new Date(ticket.updated_at).toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'short',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Communication Channel */}
          
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default TicketDetailsModal;






import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Clock, MessageSquare, File, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import TicketStatusTracker from './TicketStatusTracker';
import { Ticket } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ isOpen, onClose, ticket }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [newAttachment, setNewAttachment] = useState<File | null>(null);
  const [commentHistory, setCommentHistory] = useState<
    { id: string; role: string; comment: string; timestamp: string; attachments: string[] }[]
  >([]);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);

  useEffect(() => {
    if (ticket?.comments && ticket?.ticketType) {
      setCommentHistory([
        {
          id: '1',
          role: 'admin',
          comment: `${ticket.comments} (Type: ${ticket.ticketType})`,
          timestamp: new Date().toLocaleString(),
          attachments: ticket.attachments ? ticket.attachments.split(',') : [],
        },
      ]);
    } else {
      setCommentHistory([]);
    }
  }, [ticket?.comments, ticket?.ticketType, ticket?.attachments]);

  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'raised':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed by oem':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const newCommentEntry = {
      id: `${commentHistory.length + 1}`,
      role: user?.role === 'admin' ? 'admin' : 'user',
      comment: newComment,
      timestamp: new Date().toLocaleString(),
      attachments: newAttachment ? [newAttachment.name] : [],
    };

    setCommentHistory([...commentHistory, newCommentEntry]);
    setNewComment('');
    setNewAttachment(null);
  };

  if (!ticket) return null;

  const ticketImages = ticket.attachments ? ticket.attachments.split(',').filter((img) => img.trim()) : [];

  const timeline = ticket.timeline
    ? Array.isArray(ticket.timeline)
      ? ticket.timeline
      : JSON.parse(ticket.timeline)
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">#{ticket.ticket_id} - {ticket.issue_title}</h2>
              <p className="text-sm text-gray-500 mt-1">Created on {new Date(ticket.created_at).toLocaleDateString()}</p>
            </div>
            <Badge className={`${getPriorityColor(ticket.priority)} px-3 py-1 font-medium rounded-full`}>
              {ticket.priority?.toUpperCase() || 'UNKNOWN'} PRIORITY
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Clock className="h-5 w-5 text-indigo-600" />
                Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={`${getStatusColor(ticket.status)} px-2 py-1 font-medium rounded-full`}>
                  {ticket.status?.toUpperCase() || 'UNKNOWN'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created By</p>
                <p className="font-medium text-gray-800">{ticket.creator_name || ticket.client?.client_username || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium text-gray-800">
                  {new Date(ticket.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {ticket.ticket_type && (
                <div>
                  <p className="text-sm text-gray-600">Ticket Type</p>
                  <Badge className="bg-teal-100 text-teal-800 border-teal-200 px-2 py-1 font-medium rounded-full">
                    {ticket.ticket_type}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Tracker */}
          <Card className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Clock className="h-5 w-5 text-indigo-600" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TicketStatusTracker status={ticket.status as 'raised' | 'confirmed by oem' | 'resolved' | 'closed'} />
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{ticket.description || 'No description provided'}</p>
            </CardContent>
          </Card>

          {/* Images */}
          {ticketImages.length > 0 && (
            <Card className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Attached Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {ticketImages.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden group">
                      <img
                        src={image}
                        alt={`Ticket image ${index + 1}`}
                        className="w-full h-32 object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                        onClick={() => window.open(image, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ticket Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-indigo-600" />
                      Ticket Details
                    </div>
                    {isDetailsOpen ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Ticket ID</p>
                      <p className="font-medium text-gray-800">{ticket.ticket_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Priority</p>
                      <Badge className={`${getPriorityColor(ticket.priority)} px-2 py-1 font-medium rounded-full`}>
                        {ticket.priority?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={`${getStatusColor(ticket.status)} px-2 py-1 font-medium rounded-full`}>
                        {ticket.status?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created By</p>
                      <p className="font-medium text-gray-800">{ticket.creator_name || ticket.client?.client_username || 'Unknown'}</p>
                    </div>
                    {ticket.ticket_type && (
                      <div>
                        <p className="text-sm text-gray-600">Ticket Type</p>
                        <Badge className="bg-teal-100 text-teal-800 border-teal-200 px-2 py-1 font-medium rounded-full">
                          {ticket.ticket_type}
                        </Badge>
                      </div>
                    )}
                    {ticket.out_of_scope && (
                      <div>
                        <p className="text-sm text-gray-600">Out of Scope</p>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-2 py-1 font-medium rounded-full">
                          Out of Scope
                        </Badge>
                      </div>
                    )}
                    {ticket.out_of_scope && ticket.out_of_scope_reason && (
                      <div>
                        <p className="text-sm text-gray-600">Out of Scope Reason</p>
                        <p className="text-sm text-purple-700">{ticket.out_of_scope_reason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                      Event Timeline
                    </div>
                    {isTimelineOpen ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="pt-4 space-y-3">
                    {timeline.length > 0 ? (
                      <ul className="space-y-2">
                        {timeline.map((event: { time: string; description: string }, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5" />
                            {event.time} - {event.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">No timeline events available</p>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium text-gray-800">
                        {new Date(ticket.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium text-gray-800">
                        {new Date(ticket.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Admin Comments */}
          <Collapsible open={isCommentSectionOpen} onOpenChange={setIsCommentSectionOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                    Admin Comments
                  </div>
                  {isCommentSectionOpen ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-3">
                    {commentHistory.length > 0 ? (
                      commentHistory.map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-4 rounded-lg border ${
                            comment.role === 'admin' ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'
                          } shadow-sm`}
                        >
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-800">
                              {comment.role === 'admin' ? 'Admin' : 'User'} • {comment.timestamp}
                            </p>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                          {comment.attachments.length > 0 && (
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {comment.attachments.map((attachment, index) => (
                                <a
                                  key={index}
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                  <File className="h-4 w-4" />
                                  {attachment.split('/').pop()}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">No comments yet.</p>
                    )}
                  </div>
                  {/* <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                     <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        onChange={(e) => setNewAttachment(e.target.files?.[0] || null)}
                        className="text-sm text-gray-600"
                      />
                      <Button
                        onClick={handleCommentSubmit}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2"
                        disabled={!newComment.trim()}
                      >
                        Post Comment
                      </Button>
                    </div> 
                  </div> */}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailsModal;