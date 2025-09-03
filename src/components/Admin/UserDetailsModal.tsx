import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Ticket, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TicketStatusTracker from '@/components/Tickets/TicketStatusTracker';

interface Client {
  client_id: number;
  client_username: string;
  name: string;
  tickets: {
    ticket_id: number;
    issue_title: string;
    priority: string | null;
    status: string;
    created_at: string;
    closed_at: string | null;
  }[];
  contract: {
    client_id: number;
    allowed_tickets: number;
    total_tickets_used: number;
    ticket_typeRS1: number;
    ticket_typeRS1_used: number;
    ticket_typeRS2: number;
    ticket_typeRS2_used: number;
    ticket_typeRS3_1: number;
    ticket_typeRS3_1_used: number;
    ticket_typeRS3_2: number;
    ticket_typeRS3_2_used: number;
    site_visit_frequency: number;
  } | null;
  pendingTickets: number;
  monthlyActivity: { [key: string]: number };
  months: string[];
  isContractActive: boolean;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Client | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'closed' ? 'success' : status === 'open' ? 'default' : status === 'confirmed by oem' ? 'warning' : 'destructive';
    return <Badge variant={variant as any}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  // Convert monthlyActivity to chart data
  const monthlyTicketData = user.months.map((month) => ({
    month,
    tickets: user.monthlyActivity[month] || 0,
  }));

  const ticketsUsed = user.contract?.total_tickets_used || 0;
  const ticketsRemaining = (user.contract?.allowed_tickets || 0) - ticketsUsed;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.client_username}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tickets Used</p>
                    <p className="text-2xl font-bold">{ticketsUsed}/{user.contract?.allowed_tickets || 0}</p>
                  </div>
                  <Ticket className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Remaining</p>
                    <p className="text-2xl font-bold">{ticketsRemaining}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">{user.pendingTickets}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contract</p>
                    <p className="text-sm font-bold text-green-600">{user.isContractActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Tickets Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Ticket Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyTicketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tickets" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.tickets.length === 0 ? (
                  <p className="text-gray-500">No recent tickets.</p>
                ) : (
                  user.tickets.map((ticket) => (
                    <div key={ticket.ticket_id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">#{ticket.ticket_id} - {ticket.issue_title}</h4>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority?.toUpperCase() || 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <TicketStatusTracker status={ticket.status} />
                        <p className="text-sm text-gray-500">
                          {new Date(ticket.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Site Visit Frequency</p>
                  <p className="font-medium">{user.contract?.site_visit_frequency || 0} per year</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contract Status</p>
                  <p className="font-medium">{user.isContractActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;