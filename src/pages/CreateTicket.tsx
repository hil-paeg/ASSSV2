import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, FileText, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface TimelineEvent {
  time: string;
  description: string;
}

const CreateTicket: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [attachments, setAttachments] = useState<File[]>([]);
 const [isLoading, setIsLoading] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([{ time: '', description: '' }]);
  const [location, setLocation] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');
  const [creatorName, setCreatorName] = useState('');  // New field for creator_name
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addTimelineEvent = () => {
    setTimelineEvents(prev => [...prev, { time: '', description: '' }]);
  };

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    setTimelineEvents(prev => {
      const newEvents = [...prev];
      newEvents[index] = { ...newEvents[index], [field]: value };
      return newEvents;
    });
  };

  const removeTimelineEvent = (index: number) => {
    setTimelineEvents(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert attachments to base64 (or file names; extend for real uploads)
      const attachmentsBase64 = await Promise.all(
        attachments.map(file => new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
        }))
      );

      const formData = {
        issue_title: title,
        priority,
        description,
        location,
        actions_performed: actionsTaken,
        creator_name: creatorName,
        attachments: attachmentsBase64.join(','),  // Comma-separated base64 strings; adjust as needed
        // Timeline events can be stored in comments or a separate field; here as JSON in comments for simplicity
        comments: JSON.stringify(timelineEvents),
      };

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create ticket');
      }

      const newTicket = await response.json();
      setTicketNumber(`TICKET-${newTicket.ticket_id}`);  // Use real ticket_id from DB
      setShowSuccessDialog(true);
      toast({ title: 'Success', description: 'Ticket created successfully!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role === 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
        <p className="text-gray-600">Admins cannot create tickets. This feature is for users only.</p>
        <Button onClick={() => router.push('/tickets')} className="mt-4">
          View All Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Support Ticket</h1>
        <p className="text-gray-600 mt-2">
          Describe your issue and we'll help you resolve it quickly
        </p>
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tickets Remaining:</strong> {user?.ticketsRemaining} out of 12
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of your issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Minor issue</SelectItem>
                  <SelectItem value="medium">Medium - Normal issue</SelectItem>
                  <SelectItem value="high">High - Urgent issue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Please provide a detailed description of the issue, including steps to reproduce if applicable"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Specify the location where the issue occurred"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Event Timeline</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTimelineEvent}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Event
                </Button>
              </div>
              {timelineEvents.map((event, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`time-${index}`}>Time</Label>
                    <Input
                      id={`time-${index}`}
                      placeholder="HH:MM or date/time"
                      value={event.time}
                      onChange={(e) => updateTimelineEvent(index, 'time', e.target.value)}
                    />
                  </div>
                  <div className="flex-2">
                    <Label htmlFor={`desc-${index}`}>Description</Label>
                    <Input
                      id={`desc-${index}`}
                      placeholder="What happened?"
                      value={event.description}
                      onChange={(e) => updateTimelineEvent(index, 'description', e.target.value)}
                    />
                  </div>
                  {timelineEvents.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimelineEvent(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="actions-taken">Actions Taken</Label>
              <Textarea
                id="actions-taken"
                placeholder="Describe any actions taken to resolve the issue"
                value={actionsTaken}
                onChange={(e) => setActionsTaken(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creator-name">Ticket Creator Name</Label>
              <Input
                id="creator-name"
                placeholder="Input Ticket creator name"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Attachments (Screenshots, Documents)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload files or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, PDF, DOC up to 10MB each
                  </p>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>Uploaded Files:</Label>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading || !title || !description || !creatorName}
                className="flex-1"
              >
                {isLoading ? 'Creating Ticket...' : 'Create Ticket'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/tickets')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Dialog open={showSuccessDialog} onOpenChange={(open) => {
        setShowSuccessDialog(open);
        if (!open) router.push('/tickets');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Ticket number: <strong>{ticketNumber}</strong></p>
            <p>Date and Time: <strong>{new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}</strong></p>
            <p>Email sent to: <strong>asss@hitachi.co.in</strong></p>
            <Button onClick={() => {
              setShowSuccessDialog(false);
              router.push('/tickets');
            }}>
              View Tickets
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTicket;