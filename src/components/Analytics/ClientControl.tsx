import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Clock, Star, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  client: string;
  adminClosed: boolean;
  clientClosed: boolean;
  adminSummary: string;
  feedback: { experience: string; rating: number; savedTime: boolean; timeAmount: string } | null;
  ticketType: string;
}

const ClientControl: React.FC = () => {
  const { user } = useAuth();
  const [selectedClient, setSelectedClient] = useState('AMNSI');
  const [selectedClientTicketType, setSelectedClientTicketType] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Mock ticket data with additional RS3-1 and RS3-2 entries
  const tickets: Ticket[] = [
    { id: '1', title: 'Server Downtime', description: 'Server offline issue', priority: 'high', status: 'closed', createdAt: '2025-07-10T07:00:00Z', updatedAt: '2025-07-20T12:00:00Z', client: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Server restarted and firmware updated.', feedback: { experience: 'Quick resolution', rating: 4, savedTime: true, timeAmount: '2 hours' }, ticketType: 'RS1' },
    { id: '2', title: 'Login Failure', description: 'User authentication error', priority: 'medium', status: 'closed', createdAt: '2025-07-12T15:00:00Z', updatedAt: '2025-07-18T15:00:00Z', client: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Updated authentication module.', feedback: { experience: 'Satisfactory', rating: 3, savedTime: false, timeAmount: '' }, ticketType: 'RS2' },
    { id: '3', title: 'HMI Connectivity', description: 'HMI not connecting', priority: 'low', status: 'closed', createdAt: '2025-07-08T23:00:00Z', updatedAt: '2025-07-15T14:00:00Z', client: 'SAIL', adminClosed: true, clientClosed: true, adminSummary: 'Reconfigured network settings.', feedback: { experience: 'Excellent support', rating: 5, savedTime: true, timeAmount: '24 hours' }, ticketType: 'RS3-1' },
    { id: '4', title: 'PLC Error', description: 'PLC fault code 0x81', priority: 'high', status: 'resolved', createdAt: '2025-07-14T11:00:00Z', updatedAt: '2025-07-14T11:00:00Z', client: 'JSPL', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, ticketType: 'RS3-2' },
    { id: '5', title: 'Network Issue', description: 'Intermittent network drops', priority: 'medium', status: 'closed', createdAt: '2025-07-11T17:00:00Z', updatedAt: '2025-07-19T10:00:00Z', client: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Replaced faulty switch.', feedback: { experience: 'Very good', rating: 4, savedTime: true, timeAmount: '3 hours' }, ticketType: 'RS1' },
    { id: '6', title: 'Software Glitch', description: 'Application crashing on startup', priority: 'low', status: 'closed', createdAt: '2025-07-05T02:00:00Z', updatedAt: '2025-07-10T09:00:00Z', client: 'SAIL', adminClosed: true, clientClosed: true, adminSummary: 'Applied hotfix.', feedback: { experience: 'Satisfied', rating: 3, savedTime: false, timeAmount: '' }, ticketType: 'RS2' },
    { id: '7', title: 'Sensor Calibration', description: 'Sensor reading incorrect values', priority: 'high', status: 'closed', createdAt: '2025-07-13T09:00:00Z', updatedAt: '2025-07-16T11:00:00Z', client: 'JSPL', adminClosed: true, clientClosed: true, adminSummary: 'Recalibrated sensor.', feedback: { experience: 'Excellent', rating: 5, savedTime: true, timeAmount: '12 hours' }, ticketType: 'RS3-1' },
    { id: '8', title: 'Database Connectivity', description: 'Cannot connect to database', priority: 'medium', status: 'open', createdAt: '2025-07-15T10:00:00Z', updatedAt: '2025-07-15T10:00:00Z', client: 'AMNSI', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, ticketType: 'RS1' },
    { id: '9', title: 'HMI Display Issue', description: 'HMI screen flickering', priority: 'medium', status: 'closed', createdAt: '2025-07-09T08:00:00Z', updatedAt: '2025-07-12T16:00:00Z', client: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Updated HMI firmware.', feedback: { experience: 'Good support', rating: 4, savedTime: true, timeAmount: '4 hours' }, ticketType: 'RS3-1' },
    { id: '10', title: 'PLC Communication Failure', description: 'PLC not communicating with server', priority: 'high', status: 'open', createdAt: '2025-07-16T09:00:00Z', updatedAt: '2025-07-16T09:00:00Z', client: 'AMNSI', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, ticketType: 'RS3-2' },
    { id: '11', title: 'Sensor Drift', description: 'Sensor showing inconsistent readings', priority: 'medium', status: 'closed', createdAt: '2025-07-07T14:00:00Z', updatedAt: '2025-07-10T12:00:00Z', client: 'SAIL', adminClosed: true, clientClosed: true, adminSummary: 'Recalibrated sensor.', feedback: { experience: 'Prompt response', rating: 4, savedTime: true, timeAmount: '6 hours' }, ticketType: 'RS3-1' },
    { id: '12', title: 'PLC Overload', description: 'PLC overloaded with tasks', priority: 'high', status: 'closed', createdAt: '2025-07-11T10:00:00Z', updatedAt: '2025-07-13T15:00:00Z', client: 'JSPL', adminClosed: true, clientClosed: true, adminSummary: 'Optimized PLC tasks.', feedback: { experience: 'Efficient fix', rating: 5, savedTime: true, timeAmount: '8 hours' }, ticketType: 'RS3-2' },
  ];

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
        <p className="text-blue-600 mt-2">This page is only accessible to administrators.</p>
      </div>
    );
  }

  // Filter tickets by date range if specified
  const filteredTickets = tickets.filter((ticket) => {
    if (!dateRange.start || !dateRange.end) return true;
    const created = new Date(ticket.createdAt).getTime();
    const start = new Date(dateRange.start).getTime();
    const end = new Date(dateRange.end).getTime();
    return created >= start && created <= end;
  });

  // Get unique clients for the dropdown
  const uniqueClients = [...new Set(tickets.map(ticket => ticket.client))];

  // Client-specific analytics
  const clientTickets = filteredTickets.filter((ticket) => ticket.client === selectedClient);

  // Calculate client-specific time saved
  const clientTimeSavedData = clientTickets
    .filter((ticket) => ticket.feedback?.savedTime && ticket.feedback.timeAmount)
    .map((ticket) => {
      const timeAmount = ticket.feedback!.timeAmount.toLowerCase().trim();
      let hours = 0;
      const match = timeAmount.match(/^(\d*\.?\d*)\s*(hour|day)s?$/i);
      if (match) {
        const value = parseFloat(match[1]) || 0;
        hours = match[2].toLowerCase() === 'day' ? value * 24 : value;
      }
      return { ticketId: ticket.id, title: ticket.title, hours };
    })
    .filter((item) => item.hours > 0);

  const clientTotalTimeSaved = clientTimeSavedData.reduce((sum, item) => sum + item.hours, 0);

  // Calculate client-specific average rating
  const clientRatings = clientTickets
    .filter((ticket) => ticket.feedback?.rating)
    .map((ticket) => ticket.feedback!.rating);
  const clientAverageRating = clientRatings.length > 0 ? clientRatings.reduce((sum, rating) => sum + rating, 0) / clientRatings.length : 0;

  // Calculate client-specific average response time
  const clientResponseTimes = clientTickets
    .filter((ticket) => ticket.status === 'closed')
    .map((ticket) => {
      const created = new Date(ticket.createdAt).getTime();
      const resolved = new Date(ticket.updatedAt).getTime();
      return (resolved - created) / (1000 * 60 * 60);
    });
  const clientAverageResponseTime = clientResponseTimes.length > 0 ? clientResponseTimes.reduce((sum, time) => sum + time, 0) / clientResponseTimes.length : 0;

  // Calculate client-specific ticket type statistics
  const ticketTypes = ['RS1', 'RS2', 'RS3-1', 'RS3-2', 'All'];
  const clientTicketTypeStats: { [key: string]: { total: number; solved: number } } = {};

  ticketTypes.forEach(type => {
    clientTicketTypeStats[type] = { total: 0, solved: 0 };
  });

  filteredTickets.forEach(ticket => {
    if (ticket.client === selectedClient && ticketTypes.includes(ticket.ticketType)) {
      clientTicketTypeStats[ticket.ticketType].total++;
      if (ticket.status === 'closed') {
        clientTicketTypeStats[ticket.ticketType].solved++;
      }
    }
  });

  // Aggregate stats for 'All' ticket types
  clientTicketTypeStats['All'] = {
    total: Object.values(clientTicketTypeStats)
      .filter((_, index) => ticketTypes[index] !== 'All')
      .reduce((sum, stats) => sum + stats.total, 0),
    solved: Object.values(clientTicketTypeStats)
      .filter((_, index) => ticketTypes[index] !== 'All')
      .reduce((sum, stats) => sum + stats.solved, 0),
  };

  // Prepare data for the stacked bar chart
  const getClientTicketTypeBarData = () => {
    if (selectedClientTicketType === 'All') {
      return ticketTypes
        .filter(type => type !== 'All')
        .map(type => ({
          name: type,
          resolved: clientTicketTypeStats[type].solved,
          unresolved: clientTicketTypeStats[type].total - clientTicketTypeStats[type].solved,
        }))
        .filter(item => item.resolved > 0 || item.unresolved > 0);
    } else {
      const stats = clientTicketTypeStats[selectedClientTicketType];
      return [{
        name: selectedClientTicketType,
        resolved: stats.solved,
        unresolved: stats.total - stats.solved,
      }];
    }
  };

  const currentClientTicketTypeData = getClientTicketTypeBarData();

  // Custom tooltip for the bar chart
  const CustomClientBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-sm text-gray-800">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.fill }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate shift-based issue trends
  const getShift = (createdAt: string): string => {
    const date = new Date(createdAt);
    const hours = date.getUTCHours();
    if (hours >= 6 && hours < 14) return 'A';
    if (hours >= 14 && hours < 22) return 'B';
    return 'C';
  };

  const shiftData = filteredTickets
    .filter((ticket) => ticket.client === selectedClient)
    .reduce((acc, ticket) => {
      const shift = getShift(ticket.createdAt);
      acc[shift] = (acc[shift] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

  const shiftChartData = [
    { shift: 'A (6AM-2PM)', tickets: shiftData['A'] || 0 },
    { shift: 'B (2PM-10PM)', tickets: shiftData['B'] || 0 },
    { shift: 'C (10PM-6AM)', tickets: shiftData['C'] || 0 },
  ];

  // Export data as CSV
  const exportToCSV = () => {
    const headers = ['Client', 'Ticket ID', 'Title', 'Shift', 'Time Saved (Hours)', 'Rating', 'Response Time (Hours)', 'Ticket Type', 'Status'];
    const rows = filteredTickets
      .filter((ticket) => ticket.client === selectedClient)
      .map((ticket) => {
        const shift = getShift(ticket.createdAt);
        const timeSaved = ticket.feedback?.savedTime && ticket.feedback.timeAmount
          ? ticket.feedback.timeAmount.match(/^(\d*\.?\d*)\s*(hour|day)s?$/i)
            ? parseFloat(ticket.feedback.timeAmount.match(/^(\d*\.?\d*)/)![0]) * (ticket.feedback.timeAmount.includes('day') ? 24 : 1)
            : 0
          : 0;
        const responseTime = (new Date(ticket.updatedAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);
        return [
          ticket.client,
          ticket.id,
          ticket.title,
          shift,
          timeSaved,
          ticket.feedback?.rating || 'N/A',
          responseTime.toFixed(1),
          ticket.ticketType,
          ticket.status,
        ];
      });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedClient}_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow-md p-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Client Control</h1>
          <p className="text-blue-600 mt-2">Detailed analytics and insights for individual clients</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-48 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent className="border-blue-200">
              {uniqueClients.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 text-white">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Client Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Time Saved ({selectedClient})</p>
                <p className="text-3xl font-semibold text-blue-900 mt-1">{clientTotalTimeSaved.toFixed(1)}h</p>
              </div>
              <Clock className="h-10 w-10 text-blue-600 bg-blue-200 p-2 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Average Rating ({selectedClient})</p>
                <p className="text-3xl font-semibold text-yellow-900 mt-1">{clientAverageRating.toFixed(1)}</p>
              </div>
              <Star className="h-10 w-10 text-yellow-600 bg-yellow-200 p-2 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Avg Response Time ({selectedClient})</p>
                <p className="text-3xl font-semibold text-green-900 mt-1">{clientAverageResponseTime.toFixed(1)}h</p>
              </div>
              <Clock className="h-10 w-10 text-green-600 bg-green-200 p-2 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Time Saved per Ticket - {selectedClient}</CardTitle>
          </CardHeader>
          <CardContent>
            {clientTimeSavedData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientTimeSavedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="title" angle={0} textAnchor="middle" height={80} tick={{ fill: '#1E3A8A', fontSize: 12 }} />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#1E3A8A' }} tick={{ fill: '#1E3A8A' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1E3A8A' }} />
                  <Bar dataKey="hours" fill="#3B82F6" name="Time Saved" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-blue-600 py-8">
                <p>No time-saving tickets found for {selectedClient}.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-blue-900">Ticket Type Resolution - {selectedClient}</CardTitle>
            <Select onValueChange={setSelectedClientTicketType} defaultValue={selectedClientTicketType}>
              <SelectTrigger className="w-[180px] border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                <SelectValue placeholder="Select Ticket Type" />
              </SelectTrigger>
              <SelectContent className="border-blue-200">
                {ticketTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {currentClientTicketTypeData.length > 0 && currentClientTicketTypeData.some(item => item.resolved > 0 || item.unresolved > 0) ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={currentClientTicketTypeData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" tick={{ fill: '#1E3A8A' }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#1E3A8A', fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <Tooltip content={<CustomClientBarTooltip />} />
                  <Legend />
                  <Bar dataKey="resolved" name="Resolved" fill="#22C55E" stackId="a" barSize={60} />
                  <Bar dataKey="unresolved" name="Unresolved" fill="#EF4444" stackId="a" barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-blue-600 py-8">
                <p>No data available for {selectedClientTicketType} tickets from {selectedClient}.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Issue Trends by Shift - {selectedClient}</CardTitle>
          </CardHeader>
          <CardContent>
            {shiftChartData.some(data => data.tickets > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={shiftChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="shift" tick={{ fill: '#1E3A8A', fontSize: 12 }} />
                  <YAxis label={{ value: 'Tickets', angle: -90, position: 'insideLeft', fill: '#1E3A8A' }} tick={{ fill: '#1E3A8A' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1E3A8A' }} />
                  <Bar dataKey="tickets" fill="#10B981" name="Tickets Raised" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-blue-600 py-8">
                <p>No tickets found for {selectedClient} in the selected date range.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientControl;