// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// import { Clock, Star, Users, Calendar } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// interface Ticket {
//   id: string;
//   title: string;
//   description: string;
//   priority: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   client: string;
//   adminClosed: boolean;
//   clientClosed: boolean;
//   adminSummary: string;
//   feedback: { experience: string; rating: number; savedTime: boolean; timeAmount: string } | null;
//   ticketType: string;
// }

// const ClientControl: React.FC = () => {
//   const { user, isLoading: authLoading, logout } = useAuth();
//   const router = useRouter();
//   const [selectedClient, setSelectedClient] = useState<string>('');
//   const [selectedClientTicketType, setSelectedClientTicketType] = useState('All');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       if (!user?.id || authLoading) {
//         setError('Not authenticated. Please log in as an admin.');
//         router.push('/login');
//         return;
//       }

//       if (user.role !== 'admin') {
//         setError('Unauthorized: Admin access required.');
//         router.push('/login');
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch('/api/tickets', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });

//         if (response.status === 401) {
//           const errorData = await response.json();
//           if (errorData.error.includes('Token expired') || errorData.error.includes('Invalid token')) {
//             setError('Session expired. Please log in again.');
//             logout();
//             router.push('/login');
//             return;
//           }
//           throw new Error(`Tickets fetch failed: ${errorData.error}`);
//         }

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`Tickets fetch failed: ${errorData.error || response.statusText}`);
//         }

//         const data = await response.json();
//         // Map backend data to Ticket interface
//         const mappedTickets: Ticket[] = data.map((ticket: any) => ({
//           id: ticket.ticket_id.toString(),
//           title: ticket.issue_title || 'Untitled',
//           description: ticket.description || '',
//           priority: ticket.priority || 'N/A',
//           status: ticket.status || 'open',
//           createdAt: new Date(ticket.created_at).toISOString(),
//           updatedAt: new Date(ticket.updated_at).toISOString(),
//           client: ticket.client?.client_username || 'Unknown',
//           adminClosed: ticket.adminClosed || false,
//           clientClosed: ticket.clientClosed || false,
//           adminSummary: ticket.summary || '',
//           feedback: ticket.close_ticket
//             ? {
//                 experience: ticket.close_ticket.experience || '',
//                 rating: ticket.close_ticket.rating || 0,
//                 savedTime: !!ticket.close_ticket.time_saved,
//                 timeAmount:
//                   ticket.close_ticket.time_saved !== null
//                     ? ticket.close_ticket.time_saved >= 24
//                       ? `${Math.floor(ticket.close_ticket.time_saved / 24)} day${ticket.close_ticket.time_saved >= 48 ? 's' : ''}`
//                       : `${ticket.close_ticket.time_saved} hour${ticket.close_ticket.time_saved !== 1 ? 's' : ''}`
//                     : '',
//               }
//             : null,
//           ticketType: ticket.ticket_type || 'Unknown',
//         }));

//         setTickets(mappedTickets);

//         // Set default selected client to the first available client
//         const uniqueClients = [...new Set(mappedTickets.map((t) => t.client))];
//         if (uniqueClients.length > 0 && !selectedClient) {
//           setSelectedClient(uniqueClients[0]);
//         }
//       } catch (err: any) {
//         console.error('Error fetching tickets:', err);
//         setError(`Failed to load tickets: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!authLoading) {
//       fetchTickets();
//     }
//   }, [user, authLoading, router, logout, selectedClient]);

//   if (authLoading || loading) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <p className="text-blue-600">Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <h1 className="text-2xl font-bold text-red-900">Error</h1>
//         <p className="text-red-600 mt-2">{error}</p>
//         {error.includes('Session expired') && (
//           <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push('/login')}>
//             Log In Again
//           </Button>
//         )}
//       </div>
//     );
//   }

//   if (user?.role !== 'admin') {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
//         <p className="text-blue-600 mt-2">This page is only accessible to administrators.</p>
//       </div>
//     );
//   }

//   // Filter tickets by date range if specified
//   const filteredTickets = tickets.filter((ticket) => {
//     if (!dateRange.start || !dateRange.end) return true;
//     const created = new Date(ticket.createdAt).getTime();
//     const start = new Date(dateRange.start).getTime();
//     const end = new Date(dateRange.end).getTime();
//     return created >= start && created <= end;
//   });

//   // Get unique clients for the dropdown
//   const uniqueClients = [...new Set(tickets.map((ticket) => ticket.client))];

//   // Client-specific analytics
//   const clientTickets = filteredTickets.filter((ticket) => ticket.client === selectedClient);

//   // Calculate client-specific time saved
//   const clientTimeSavedData = clientTickets
//     .filter((ticket) => ticket.feedback?.savedTime && ticket.feedback.timeAmount)
//     .map((ticket) => {
//       const timeAmount = ticket.feedback!.timeAmount.toLowerCase().trim();
//       let hours = 0;
//       const match = timeAmount.match(/^(\d*\.?\d*)\s*(hour|day)s?$/i);
//       if (match) {
//         const value = parseFloat(match[1]) || 0;
//         hours = match[2].toLowerCase() === 'day' ? value * 24 : value;
//       }
//       return { ticketId: ticket.id, title: ticket.title, hours };
//     })
//     .filter((item) => item.hours > 0);

//   const clientTotalTimeSaved = clientTimeSavedData.reduce((sum, item) => sum + item.hours, 0);

//   // Calculate client-specific average rating
//   const clientRatings = clientTickets
//     .filter((ticket) => ticket.feedback?.rating)
//     .map((ticket) => ticket.feedback!.rating);
//   const clientAverageRating = clientRatings.length > 0 ? clientRatings.reduce((sum, rating) => sum + rating, 0) / clientRatings.length : 0;

//   // Calculate client-specific average response time
//   const clientResponseTimes = clientTickets
//     .filter((ticket) => ticket.status === 'closed')
//     .map((ticket) => {
//       const created = new Date(ticket.createdAt).getTime();
//       const resolved = new Date(ticket.updatedAt).getTime();
//       return (resolved - created) / (1000 * 60 * 60);
//     });
//   const clientAverageResponseTime = clientResponseTimes.length > 0 ? clientResponseTimes.reduce((sum, time) => sum + time, 0) / clientResponseTimes.length : 0;

//   // Calculate client-specific ticket type statistics
//   const ticketTypes = ['RS1', 'RS2', 'RS3-1', 'RS3-2', 'All'];
//   const clientTicketTypeStats: { [key: string]: { total: number; solved: number } } = {};

//   ticketTypes.forEach((type) => {
//     clientTicketTypeStats[type] = { total: 0, solved: 0 };
//   });

//   filteredTickets.forEach((ticket) => {
//     if (ticket.client === selectedClient && ticketTypes.includes(ticket.ticketType)) {
//       clientTicketTypeStats[ticket.ticketType].total++;
//       if (ticket.status === 'closed') {
//         clientTicketTypeStats[ticket.ticketType].solved++;
//       }
//     }
//   });

//   // Aggregate stats for 'All' ticket types
//   clientTicketTypeStats['All'] = {
//     total: Object.values(clientTicketTypeStats)
//       .filter((_, index) => ticketTypes[index] !== 'All')
//       .reduce((sum, stats) => sum + stats.total, 0),
//     solved: Object.values(clientTicketTypeStats)
//       .filter((_, index) => ticketTypes[index] !== 'All')
//       .reduce((sum, stats) => sum + stats.solved, 0),
//   };

//   // Prepare data for the stacked bar chart
//   const getClientTicketTypeBarData = () => {
//     if (selectedClientTicketType === 'All') {
//       return ticketTypes
//         .filter((type) => type !== 'All')
//         .map((type) => ({
//           name: type,
//           resolved: clientTicketTypeStats[type].solved,
//           unresolved: clientTicketTypeStats[type].total - clientTicketTypeStats[type].solved,
//         }))
//         .filter((item) => item.resolved > 0 || item.unresolved > 0);
//     } else {
//       const stats = clientTicketTypeStats[selectedClientTicketType];
//       return [{
//         name: selectedClientTicketType,
//         resolved: stats.solved,
//         unresolved: stats.total - stats.solved,
//       }];
//     }
//   };

//   const currentClientTicketTypeData = getClientTicketTypeBarData();

//   // Custom tooltip for the bar chart
//   const CustomClientBarTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-sm text-gray-800">
//           <p className="font-semibold">{label}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} style={{ color: entry.fill }}>
//               {entry.name}: {entry.value}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Calculate shift-based issue trends
//   const getShift = (createdAt: string): string => {
//     const date = new Date(createdAt);
//     // Convert UTC to IST (UTC +5:30)
//     const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
//     const istDate = new Date(date.getTime() + istOffset);
//     const hours = istDate.getUTCHours() + (istDate.getUTCMinutes() / 60); // Fractional hours
//     if (hours >= 6 && hours < 14) return 'A';
//     if (hours >= 14 && hours < 22) return 'B';
//     return 'C';
//   };

//   const shiftData = filteredTickets
//     .filter((ticket) => ticket.client === selectedClient)
//     .reduce((acc, ticket) => {
//       const shift = getShift(ticket.createdAt);
//       acc[shift] = (acc[shift] || 0) + 1;
//       return acc;
//     }, {} as { [key: string]: number });

//   const shiftChartData = [
//     { shift: 'A (6AM-2PM)', tickets: shiftData['A'] || 0 },
//     { shift: 'B (2PM-10PM)', tickets: shiftData['B'] || 0 },
//     { shift: 'C (10PM-6AM)', tickets: shiftData['C'] || 0 },
//   ];

//   // Export data as CSV
//   const exportToCSV = () => {
//     const headers = ['Client', 'Ticket ID', 'Title', 'Shift', 'Time Saved (Hours)', 'Rating', 'Response Time (Hours)', 'Ticket Type', 'Status'];
//     const rows = filteredTickets
//       .filter((ticket) => ticket.client === selectedClient)
//       .map((ticket) => {
//         const shift = getShift(ticket.createdAt);
//         const timeSaved = ticket.feedback?.savedTime && ticket.feedback.timeAmount
//           ? ticket.feedback.timeAmount.match(/^(\d*\.?\d*)\s*(hour|day)s?$/i)
//             ? parseFloat(ticket.feedback.timeAmount.match(/^(\d*\.?\d*)/)![0]) * (ticket.feedback.timeAmount.includes('day') ? 24 : 1)
//             : 0
//           : 0;
//         const responseTime = (new Date(ticket.updatedAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);
//         return [
//           ticket.client,
//           ticket.id,
//           ticket.title,
//           shift,
//           timeSaved,
//           ticket.feedback?.rating || 'N/A',
//           responseTime.toFixed(1),
//           ticket.ticketType,
//           ticket.status,
//         ];
//       });

//     const csvContent = [
//       headers.join(','),
//       ...rows.map((row) => row.join(',')),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `${selectedClient}_analytics_${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//   };

//   return (
//     <div className="container mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow-md p-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-blue-900">Client Control</h1>
//           <p className="text-blue-600 mt-2">Detailed analytics and insights for individual clients</p>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <Select value={selectedClient} onValueChange={setSelectedClient}>
//             <SelectTrigger className="w-48 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
//               <SelectValue placeholder="Select client" />
//             </SelectTrigger>
//             <SelectContent className="border-blue-200">
//               {uniqueClients.map((client) => (
//                 <SelectItem key={client} value={client}>
//                   {client}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <div className="flex flex-col sm:flex-row gap-2">
//             <Input
//               type="date"
//               value={dateRange.start}
//               onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
//               className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
//             />
//             <Input
//               type="date"
//               value={dateRange.end}
//               onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
//               className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
//             />
//           </div>
//           <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 text-white">
//             Export CSV
//           </Button>
//         </div>
//       </div>

//       {/* Client Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-600 font-medium">Time Saved ({selectedClient})</p>
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{clientTotalTimeSaved.toFixed(1)}h</p>
//               </div>
//               <Clock className="h-10 w-10 text-blue-600 bg-blue-200 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-yellow-600 font-medium">Average Rating ({selectedClient})</p>
//                 <p className="text-3xl font-semibold text-yellow-900 mt-1">{clientAverageRating.toFixed(1)}</p>
//               </div>
//               <Star className="h-10 w-10 text-yellow-600 bg-yellow-200 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-green-600 font-medium">Avg Response Time ({selectedClient})</p>
//                 <p className="text-3xl font-semibold text-green-900 mt-1">{clientAverageResponseTime.toFixed(1)}h</p>
//               </div>
//               <Clock className="h-10 w-10 text-green-600 bg-green-200 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Client Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100">
//           <CardHeader>
//             <CardTitle className="text-blue-900">Time Saved per Ticket - {selectedClient}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {clientTimeSavedData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={clientTimeSavedData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                   <XAxis dataKey="title" angle={0} textAnchor="middle" height={80} tick={{ fill: '#1E3A8A', fontSize: 12 }} />
//                   <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#1E3A8A' }} tick={{ fill: '#1E3A8A' }} />
//                   <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1E3A8A' }} />
//                   <Bar dataKey="hours" fill="#3B82F6" name="Time Saved" />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center text-blue-600 py-8">
//                 <p>No time-saving tickets found for {selectedClient}.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-blue-900">Ticket Type Resolution - {selectedClient}</CardTitle>
//             <Select onValueChange={setSelectedClientTicketType} defaultValue={selectedClientTicketType}>
//               <SelectTrigger className="w-[180px] border-blue-200 focus:border-blue-400 focus:ring-blue-400">
//                 <SelectValue placeholder="Select Ticket Type" />
//               </SelectTrigger>
//               <SelectContent className="border-blue-200">
//                 {ticketTypes.map((type) => (
//                   <SelectItem key={type} value={type}>
//                     {type}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </CardHeader>
//           <CardContent>
//             {currentClientTicketTypeData.length > 0 && currentClientTicketTypeData.some((item) => item.resolved > 0 || item.unresolved > 0) ? (
//               <ResponsiveContainer width="100%" height={400}>
//                 <BarChart data={currentClientTicketTypeData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <XAxis type="number" tick={{ fill: '#1E3A8A' }} />
//                   <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#1E3A8A', fontSize: 12 }} />
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                   <Tooltip content={<CustomClientBarTooltip />} />
//                   <Legend />
//                   <Bar dataKey="resolved" name="Resolved" fill="#22C55E" stackId="a" barSize={60} />
//                   <Bar dataKey="unresolved" name="Unresolved" fill="#EF4444" stackId="a" barSize={60} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center text-blue-600 py-8">
//                 <p>No data available for {selectedClientTicketType} tickets from {selectedClient}.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-blue-100">
//           <CardHeader>
//             <CardTitle className="text-blue-900">Issue Trends by Shift - {selectedClient}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {shiftChartData.some((data) => data.tickets > 0) ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={shiftChartData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                   <XAxis dataKey="shift" tick={{ fill: '#1E3A8A', fontSize: 12 }} />
//                   <YAxis label={{ value: 'Tickets', angle: -90, position: 'insideLeft', fill: '#1E3A8A' }} tick={{ fill: '#1E3A8A' }} />
//                   <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1E3A8A' }} />
//                   <Bar dataKey="tickets" fill="#10B981" name="Tickets Raised" />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center text-blue-600 py-8">
//                 <p>No tickets found for {selectedClient} in the selected date range.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ClientControl;





"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Clock, Star, Users, Calendar, TrendingUp, Download, BarChart3 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

interface Ticket {
  id: string
  title: string
  description: string
  priority: string
  status: string
  createdAt: string
  updatedAt: string
  client: string
  adminClosed: boolean
  clientClosed: boolean
  adminSummary: string
  feedback: { experience: string; rating: number; savedTime: boolean; timeAmount: string } | null
  ticketType: string
}

const ClientControl: React.FC = () => {
  const { user, isLoading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [selectedClient, setSelectedClient] = useState<string>("All")
  const [selectedClientTicketType, setSelectedClientTicketType] = useState("All")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.id || authLoading) {
        setError("Not authenticated. Please log in as an admin.")
        router.push("/")
        return
      }

      if (user.role !== "admin") {
        setError("Unauthorized: Admin access required.")
        router.push("/")
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/tickets", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        if (response.status === 401) {
          const errorData = await response.json()
          if (errorData.error.includes("Token expired") || errorData.error.includes("Invalid token")) {
            setError("Session expired. Please log in again.")
            logout()
            router.push("/")
            return
          }
          throw new Error(`Tickets fetch failed: ${errorData.error}`)
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Tickets fetch failed: ${errorData.error || response.statusText}`)
        }

        const data = await response.json()
        // Map backend data to Ticket interface
        const mappedTickets: Ticket[] = data.map((ticket: any) => ({
          id: ticket.ticket_id.toString(),
          title: ticket.issue_title || "Untitled",
          description: ticket.description || "",
          priority: ticket.priority || "N/A",
          status: ticket.status || "open",
          createdAt: new Date(ticket.created_at).toISOString(),
          updatedAt: new Date(ticket.updated_at).toISOString(),
          client: ticket.client?.client_username || "Unknown",
          adminClosed: ticket.adminClosed || false,
          clientClosed: ticket.clientClosed || false,
          adminSummary: ticket.summary || "",
          feedback: ticket.close_ticket
            ? {
                experience: ticket.close_ticket.experience || "",
                rating: ticket.close_ticket.rating || 0,
                savedTime: !!ticket.close_ticket.time_saved,
                timeAmount:
                  ticket.close_ticket.time_saved !== null
                    ? ticket.close_ticket.time_saved >= 24
                      ? `${Math.floor(ticket.close_ticket.time_saved / 24)} day${ticket.close_ticket.time_saved >= 48 ? "s" : ""}`
                      : `${ticket.close_ticket.time_saved} hour${ticket.close_ticket.time_saved !== 1 ? "s" : ""}`
                    : "",
              }
            : null,
          ticketType: ticket.ticket_type || "Unknown",
        }))

        setTickets(mappedTickets)

        // Set default selected client to 'All'
        if (!selectedClient) {
          setSelectedClient("All")
        }
      } catch (err: any) {
        console.error("Error fetching tickets:", err)
        setError(`Failed to load tickets: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchTickets()
    }
  }, [user, authLoading, router, logout, selectedClient])

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-blue-600">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-900">Error</h1>
        <p className="text-red-600 mt-2">{error}</p>
        {error.includes("Session expired") && (
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push("/")}>
            Log In Again
          </Button>
        )}
      </div>
    )
  }

  if (user?.role !== "admin") {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
        <p className="text-blue-600 mt-2">This page is only accessible to administrators.</p>
      </div>
    )
  }

  // Filter tickets by date range if specified
  const filteredTickets = tickets

  // Get unique clients for the dropdown
  const uniqueClients = [...new Set(tickets.map((ticket) => ticket.client))]

  // Client-specific analytics
  const clientTickets =
    selectedClient === "All" ? filteredTickets : filteredTickets.filter((ticket) => ticket.client === selectedClient)

  // Calculate client-specific time saved
  const clientTimeSavedData = clientTickets
    .filter((ticket) => ticket.feedback?.savedTime && ticket.feedback.timeAmount)
    .map((ticket) => {
      const timeAmount = ticket.feedback!.timeAmount.toLowerCase().trim()
      let hours = 0
      const match = timeAmount.match(/^(\d*\.?\d*)\s*(hour|day)s?$/i)
      if (match) {
        const value = Number.parseFloat(match[1]) || 0
        hours = match[2].toLowerCase() === "day" ? value * 24 : value
      }
      return { ticketId: ticket.id, title: ticket.title, hours }
    })
    .filter((item) => item.hours > 0)

  const clientTotalTimeSaved = clientTimeSavedData.reduce((sum, item) => sum + item.hours, 0)

  // Calculate client-specific average rating
  const clientRatings = clientTickets
    .filter((ticket) => ticket.feedback?.rating)
    .map((ticket) => ticket.feedback!.rating)
  const clientAverageRating =
    clientRatings.length > 0 ? clientRatings.reduce((sum, rating) => sum + rating, 0) / clientRatings.length : 0

  // Calculate client-specific average response time
  const clientResponseTimes = clientTickets
    .filter((ticket) => ticket.status === "closed")
    .map((ticket) => {
      const created = new Date(ticket.createdAt).getTime()
      const resolved = new Date(ticket.updatedAt).getTime()
      return (resolved - created) / (1000 * 60 * 60)
    })
  const clientAverageResponseTime =
    clientResponseTimes.length > 0
      ? clientResponseTimes.reduce((sum, time) => sum + time, 0) / clientResponseTimes.length
      : 0

  // Calculate client-specific ticket type statistics
  const ticketTypes = ["RS1", "RS2", "RS3-1", "RS3-2", "All"]
  const clientTicketTypeStats: { [key: string]: { total: number; solved: number } } = {}

  ticketTypes.forEach((type) => {
    clientTicketTypeStats[type] = { total: 0, solved: 0 }
  })

  filteredTickets.forEach((ticket) => {
    if (ticketTypes.includes(ticket.ticketType)) {
      clientTicketTypeStats[ticket.ticketType].total++
      if (ticket.status === "closed") {
        clientTicketTypeStats[ticket.ticketType].solved++
      }
    }
  })

  // Aggregate stats for 'All' ticket types
  clientTicketTypeStats["All"] = {
    total: Object.values(clientTicketTypeStats)
      .filter((_, index) => ticketTypes[index] !== "All")
      .reduce((sum, stats) => sum + stats.total, 0),
    solved: Object.values(clientTicketTypeStats)
      .filter((_, index) => ticketTypes[index] !== "All")
      .reduce((sum, stats) => sum + stats.solved, 0),
  }

  // Prepare data for the stacked bar chart
  const getClientTicketTypeBarData = () => {
    if (selectedClientTicketType === "All") {
      return ticketTypes
        .filter((type) => type !== "All")
        .map((type) => ({
          name: type,
          resolved: clientTicketTypeStats[type].solved,
          unresolved: clientTicketTypeStats[type].total - clientTicketTypeStats[type].solved,
        }))
        .filter((item) => item.resolved > 0 || item.unresolved > 0)
    } else {
      const stats = clientTicketTypeStats[selectedClientTicketType]
      return [
        {
          name: selectedClientTicketType,
          resolved: stats.solved,
          unresolved: stats.total - stats.solved,
        },
      ]
    }
  }

  const currentClientTicketTypeData = getClientTicketTypeBarData()

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
      )
    }
    return null
  }

  // Calculate shift-based issue trends
  const getShift = (createdAt: string): string => {
    const date = new Date(createdAt)
    // Convert UTC to IST (UTC +5:30)
    const istOffset = 5.5 * 60 * 60 * 1000 // 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime() + istOffset)
    const hours = istDate.getUTCHours() + istDate.getUTCMinutes() / 60 // Fractional hours
    if (hours >= 6 && hours < 14) return "A"
    if (hours >= 14 && hours < 22) return "B"
    return "C"
  }

  const getResolutionStatusData = () => {
    const clientSpecificTickets =
      selectedClient === "All" ? filteredTickets : filteredTickets.filter((ticket) => ticket.client === selectedClient)

    const statusData: { [key: string]: { resolved: number; unresolved: number } } = {}

    // Initialize all ticket types
    const allTicketTypes = [...new Set(clientSpecificTickets.map((ticket) => ticket.ticketType))]
    allTicketTypes.forEach((type) => {
      statusData[type] = { resolved: 0, unresolved: 0 }
    })

    // Count resolved and unresolved tickets by type
    clientSpecificTickets.forEach((ticket) => {
      if (ticket.status === "closed") {
        statusData[ticket.ticketType].resolved++
      } else {
        statusData[ticket.ticketType].unresolved++
      }
    })

    // Convert to chart format
    return Object.entries(statusData)
      .filter(([type, data]) => data.resolved > 0 || data.unresolved > 0)
      .map(([type, data]) => ({
        name: type,
        resolved: data.resolved,
        unresolved: data.unresolved,
      }))
  }

  const getClientShiftData = () => {
    const clientSpecificTickets =
      selectedClient === "All" ? filteredTickets : filteredTickets.filter((ticket) => ticket.client === selectedClient)

    const shiftCounts = clientSpecificTickets.reduce(
      (acc, ticket) => {
        const shift = getShift(ticket.createdAt)
        acc[shift] = (acc[shift] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    return [
      { shift: "A (6AM-2PM)", tickets: shiftCounts["A"] || 0 },
      { shift: "B (2PM-10PM)", tickets: shiftCounts["B"] || 0 },
      { shift: "C (10PM-6AM)", tickets: shiftCounts["C"] || 0 },
    ]
  }

  const resolutionStatusData = getResolutionStatusData()
  const clientShiftData = getClientShiftData()

  // Export data as CSV
  const exportToCSV = () => {
    const headers = [
      "Client",
      "Ticket ID",
      "Title",
      "Shift",
      "Time Saved (Hours)",
      "Rating",
      "Response Time (Hours)",
      "Ticket Type",
      "Status",
    ]
    const rows = filteredTickets.map((ticket) => {
      const shift = getShift(ticket.createdAt)
      const timeSaved =
        ticket.feedback?.savedTime && ticket.feedback.timeAmount
          ? ticket.feedback.timeAmount.match(/^(\d*\.?\d*)\s*(hour|day)s?$/i)
            ? Number.parseFloat(ticket.feedback.timeAmount.match(/^(\d*\.?\d*)/)![0]) *
              (ticket.feedback.timeAmount.includes("day") ? 24 : 1)
            : 0
          : 0
      const responseTime =
        (new Date(ticket.updatedAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60)
      return [
        ticket.client,
        ticket.id,
        ticket.title,
        shift,
        timeSaved,
        ticket.feedback?.rating || "N/A",
        responseTime.toFixed(1),
        ticket.ticketType,
        ticket.status,
      ]
    })

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `client_analytics_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Client Analytics Dashboard</h1>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 min-w-0">
                <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="w-40 bg-card border-border">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="All" value="All">
                      Select Client
                    </SelectItem>
                    {uniqueClients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={exportToCSV}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-700">Total Time Saved</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-blue-900">{clientTotalTimeSaved.toFixed(1)}</p>
                    <span className="text-sm text-blue-600">hours</span>
                  </div>
                  <p className="text-xs text-blue-600">Client: {selectedClient}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Clock className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-amber-700">Average Rating</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-amber-900">{clientAverageRating.toFixed(1)}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(clientAverageRating) ? "text-amber-500 fill-amber-500" : "text-amber-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-amber-600">Client satisfaction score</p>
                </div>
                <div className="p-3 bg-amber-200 rounded-full">
                  <Star className="h-6 w-6 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-700">Avg Response Time</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-emerald-900">{clientAverageResponseTime.toFixed(1)}</p>
                    <span className="text-sm text-emerald-600">hours</span>
                  </div>
                  <p className="text-xs text-emerald-600">Resolution efficiency</p>
                </div>
                <div className="p-3 bg-emerald-200 rounded-full">
                  <TrendingUp className="h-6 w-6 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="bg-white shadow-lg border-border hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                Time Saved Analysis - {selectedClient}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Individual ticket performance breakdown</p>
            </CardHeader>
            <CardContent>
              {clientTimeSavedData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={clientTimeSavedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <YAxis
                      label={{
                        value: "Hours Saved",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "#64748b" },
                      }}
                      tick={{ fill: "#64748b" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value, name, props) => [`${value} hours`, "Time Saved"]}
                      labelFormatter={(label, payload) => {
                        if (payload && payload.length > 0) {
                          return `Ticket: ${payload[0].payload.title}`
                        }
                        return ""
                      }}
                    />
                    <Bar dataKey="hours" fill="#3b82f6" name="Time Saved (Hours)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No time-saving data available for {selectedClient}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-border hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Resolution Status - {selectedClient}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Ticket type performance overview</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {resolutionStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={resolutionStatusData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <XAxis type="number" tick={{ fill: "#64748b" }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <Tooltip content={<CustomClientBarTooltip />} />
                    <Legend />
                    <Bar dataKey="resolved" name="Resolved" fill="#10b981" stackId="a" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="unresolved" name="Unresolved" fill="#ef4444" stackId="a" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tickets found for {selectedClient}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-border hover:shadow-xl transition-all duration-300 xl:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Issue Trends by Work Shift - {selectedClient}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Distribution of tickets across different work shifts</p>
            </CardHeader>
            <CardContent>
              {clientShiftData.some((data) => data.tickets > 0) ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={clientShiftData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="shift" tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis
                      label={{
                        value: "Number of Tickets",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: "#64748b" },
                      }}
                      tick={{ fill: "#64748b" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="tickets" fill="#8b5cf6" name="Tickets Raised" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tickets found for {selectedClient}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ClientControl
