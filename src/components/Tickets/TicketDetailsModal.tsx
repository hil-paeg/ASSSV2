import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Clock, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const [commentHistory, setCommentHistory] = useState([
    { id: '1', role: 'user', comment: 'Ticket created by user', timestamp: '2024-01-15 10:30 AM', attachments: [] as string[] },
    { id: '2', role: 'admin', comment: 'Assigned to support team. Investigation started.', timestamp: '2024-01-15 02:15 PM', attachments: [] as string[] },
    { id: '3', role: 'admin', comment: 'Issue resolved. Solution implemented.', timestamp: '2024-01-16 11:45 AM', attachments: [] as string[] },
    ...(ticket?.comments && ticket?.ticketType
      ? [{ id: '4', role: 'admin', comment: `${ticket.comments} (Type: ${ticket.ticketType})`, timestamp: new Date().toLocaleString(), attachments: ticket.attachments || [] }]
      : []),
  ]);

  useEffect(() => {
    if (ticket?.comments && ticket?.ticketType) {
      setCommentHistory((prev) => [
        ...prev.filter((comment) => comment.id !== '4'),
        { id: '4', role: 'admin', comment: `${ticket.comments} (Type: ${ticket.ticketType})`, timestamp: new Date().toLocaleString(), attachments: ticket.attachments || [] },
      ]);
    }
  }, [ticket?.comments, ticket?.ticketType, ticket?.attachments]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const ticketImages = [
    '/placeholder.svg',
    '/placeholder.svg',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">#{ticket.id} - {ticket.title}</h2>
              <p className="text-sm text-gray-500 mt-1">Created on {new Date(ticket.createdAt).toLocaleDateString()}</p>
            </div>
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority.toUpperCase()} PRIORITY
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TicketStatusTracker status={ticket.status} />
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Images */}
          {ticketImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attached Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ticketImages.map((image, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Ticket image ${index + 1}`}
                        className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Ticket Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Ticket ID</p>
                  <p className="font-medium">{ticket.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Priority</p>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium capitalize">{ticket.status.replace('-', ' ')}</p>
                </div>
                {ticket.assignedTo && (
                  <div>
                    <p className="text-sm text-gray-600">Assigned To</p>
                    <p className="font-medium">{ticket.assignedTo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                </div>
                {ticket.responseTime && (
                  <div>
                    <p className="text-sm text-gray-600">Response Time</p>
                    <p className="font-medium">{ticket.responseTime}h</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Communication Channel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Communication Channel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commentHistory.map((entry, index) => (
                  <div key={entry.id} className="flex flex-col space-y-2 pb-4 border-b last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${entry.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium capitalize">{entry.role}</p>
                          <p className="text-sm text-gray-500">{entry.timestamp}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.comment}</p>
                        {entry.attachments.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Attachments:</p>
                            <div className="flex gap-2">
                              {entry.attachments.map((attachment, idx) => (
                                <a
                                  key={idx}
                                  href="#"
                                  className="text-sm text-blue-600 hover:underline"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    alert(`Opening attachment: ${attachment}`);
                                  }}
                                >
                                  {attachment}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Add a Reply</label>
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type your reply here..."
                    className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Attach File</label>
                  <Input
                    type="file"
                    onChange={(e) => setNewAttachment(e.target.files ? e.target.files[0] : null)}
                    className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
                  />
                </div>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                >
                  Submit Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailsModal;