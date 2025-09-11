
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Area } from 'recharts';
// import { Clock, Star, TicketIcon, Target } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useAuth } from '@/contexts/AuthContext';
// import axios from 'axios';
// import { Ticket } from '@/types';

// const AdminAnalytics: React.FC = () => {
//   const { user } = useAuth();
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch all tickets for admin
//   useEffect(() => {
//     const fetchTickets = async () => {
//       if (!user?.token) {
//         console.warn('No user or token available');
//         setTickets([]);
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(true);
//       try {
//         const response = await axios.get('/api/tickets', {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         const fetchedTickets = response.data.map((ticket: any) => ({
//           ...ticket,
//           id: ticket.ticket_id,
//           ticket_id: ticket.ticket_id,
//           userId: ticket.client_id,
//           client_id: ticket.client_id,
//           title: ticket.issue_title,
//           issue_title: ticket.issue_title,
//           ticketType: ticket.ticket_type,
//           ticket_type: ticket.ticket_type,
//           createdAt: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
//           created_at: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
//           updatedAt: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
//           updated_at: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
//           closed_at: ticket.closed_at ? new Date(ticket.closed_at).toISOString() : null,
//           clientClosed: Boolean(ticket.clientClosed),
//           adminClosed: Boolean(ticket.adminClosed),
//           out_of_scope: Boolean(ticket.out_of_scope),
//           close_ticket: ticket.close_ticket
//             ? {
//                 ...ticket.close_ticket,
//                 created_at: ticket.close_ticket.created_at ? new Date(ticket.close_ticket.created_at).toISOString() : new Date().toISOString(),
//               }
//             : undefined,
//         }));
//         console.log('Fetched tickets:', fetchedTickets);
//         setTickets(fetchedTickets);
//       } catch (error) {
//         console.error('Error fetching tickets:', error);
//         alert('Failed to fetch tickets.');
//         setTickets([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTickets();
//   }, [user]);

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <p className="text-blue-600">Loading analytics...</p>
//       </div>
//     );
//   }

//   if (!user || user.role !== 'admin') {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
//         <p className="text-blue-600 mt-2">This page is only accessible to admins.</p>
//       </div>
//     );
//   }

//   // Filter tickets by date range
//   const filteredTickets = tickets.filter((ticket) => {
//     if (!dateRange.start || !dateRange.end) return true;
//     const created = new Date(ticket.createdAt).getTime();
//     const start = new Date(dateRange.start).getTime();
//     const end = new Date(dateRange.end).getTime();
//     return created >= start && created <= end;
//   });

//   // Calculate total time saved
//   const timeSavedData = filteredTickets
//     .filter((ticket) => ticket.close_ticket?.time_saved != null)
//     .map((ticket) => ({
//       ticketId: ticket.ticket_id,
//       title: ticket.issue_title,
//       hours: ticket.close_ticket?.time_saved || 0,
//       client: ticket.client.client_username,
//     }));
//   const totalTimeSaved = timeSavedData.reduce((sum, item) => sum + item.hours, 0);

//   // Calculate overall rating
//   const ratings = filteredTickets
//     .filter((ticket) => ticket.close_ticket?.rating != null)
//     .map((ticket) => ticket.close_ticket?.rating || 0);
//   const overallRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

//   // Calculate average response time
//   const responseTimes = filteredTickets
//     .filter((ticket) => ticket.status === 'closed' && ticket.closed_at)
//     .map((ticket) => {
//       const created = new Date(ticket.createdAt).getTime();
//       const closed = new Date(ticket.closed_at!).getTime();
//       return (closed - created) / (1000 * 60 * 60); // Convert to hours
//     });
//   const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

//   // Calculate total tickets
//   const totalTickets = filteredTickets.length;

//   // Calculate response time vs target (72 hours)
//   const targetResponseTime = 72; // 72 hours
//   const closedTickets = filteredTickets.filter((t) => t.status === 'closed' && t.closed_at);
//   const withinTarget = closedTickets.filter((ticket) => {
//     const created = new Date(ticket.createdAt).getTime();
//     const closed = new Date(ticket.closed_at!).getTime();
//     const responseTime = (closed - created) / (1000 * 60 * 60);
//     return responseTime <= targetResponseTime;
//   }).length;
//   const responseTimeVsTarget = closedTickets.length > 0 ? (withinTarget / closedTickets.length) * 100 : 0;
//   const responseTimeVsTargetData = [
//     { name: 'Within Target (≤72h)', value: responseTimeVsTarget, count: withinTarget },
//     { name: 'Beyond Target (>72h)', value: 100 - responseTimeVsTarget, count: closedTickets.length - withinTarget },
//   ];

//   // Calculate time saved by client
//   const timeSavedByClient = filteredTickets
//     .filter((ticket) => ticket.close_ticket?.time_saved != null)
//     .reduce((acc, ticket) => {
//       const client = ticket.client.client_username;
//       acc[client] = (acc[client] || 0) + (ticket.close_ticket?.time_saved || 0);
//       return acc;
//     }, {} as { [key: string]: number });
//   const timeSavedByClientData = Object.entries(timeSavedByClient).map(([client, hours]) => ({
//     client,
//     hours,
//   }));

//   // Calculate ticket trends (by month)
//   const ticketTrends = filteredTickets.reduce((acc, ticket) => {
//     const date = new Date(ticket.createdAt);
//     const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
//     acc[monthYear] = (acc[monthYear] || 0) + 1;
//     return acc;
//   }, {} as { [key: string]: number });
//   const ticketTrendsData = Object.entries(ticketTrends)
//     .map(([monthYear, count]) => ({
//       month: monthYear,
//       tickets: count,
//     }))
//     .sort((a, b) => a.month.localeCompare(b.month));

//   // Export data as CSV
//   const exportToCSV = () => {
//     const headers = [
//       'Ticket ID',
//       'Title',
//       'Client',
//       'Time Saved (Hours)',
//       'Rating',
//       'Response Time (Hours)',
//       'Ticket Type',
//       'Status',
//       'Created At',
//     ];
//     const rows = filteredTickets.map((ticket) => {
//       const timeSaved = ticket.close_ticket?.time_saved || 0;
//       const rating = ticket.close_ticket?.rating || 'N/A';
//       const responseTime = ticket.status === 'closed' && ticket.closed_at
//         ? (new Date(ticket.closed_at).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60)
//         : 0;
//       return [
//         ticket.ticket_id,
//         ticket.issue_title,
//         ticket.client.client_username,
//         timeSaved,
//         rating,
//         responseTime.toFixed(1),
//         ticket.ticket_type,
//         ticket.status,
//         ticket.createdAt,
//       ];
//     });

//     const csvContent = [
//       headers.join(','),
//       ...rows.map((row) => row.join(',')),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `admin_analytics_${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//   };

//   const PIE_COLORS = ['#22C55E', '#EF4444'];

//   const CustomPieTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       const data = payload[0].payload;
//       return (
//         <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-sm text-gray-800">
//           <p className="font-semibold">{`${data.name}: ${data.value.toFixed(1)}%`}</p>
//           <p>{`Tickets: ${data.count}`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="container mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow-md p-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-blue-900">Admin Analytics</h1>
//           <p className="text-blue-600 mt-2">Overall insights for all client support tickets</p>
//         </div>
//         <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 text-white">
//           Export CSV
//         </Button>
//       </div>

//       <div className="flex gap-4">
//         <div>
//           <label className="block text-sm font-medium text-blue-700">Start Date</label>
//           <Input
//             type="date"
//             value={dateRange.start}
//             onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
//             className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-blue-700">End Date</label>
//           <Input
//             type="date"
//             value={dateRange.end}
//             onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
//             className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
//           />
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-500 font-medium">Total Time Saved</p>
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{totalTimeSaved.toFixed(1)} h</p>
//               </div>
//               <Clock className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-500 font-medium">Overall Rating</p>
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{overallRating.toFixed(1)}</p>
//               </div>
//               <Star className="h-10 w-10 text-yellow-600 bg-yellow-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-500 font-medium">Avg Response Time</p>
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{averageResponseTime.toFixed(1)} h</p>
//               </div>
//               <Clock className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-500 font-medium">Total Tickets</p>
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{totalTickets}</p>
//               </div>
//               <TicketIcon className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardHeader>
//             <CardTitle className="text-blue-900">Response Time vs Target (72h)</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {responseTimeVsTargetData[0].value > 0 || responseTimeVsTargetData[1].value > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={responseTimeVsTargetData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={100}
//                     fill="#8884d8"
//                     paddingAngle={5}
//                     dataKey="value"
//                     labelLine={false}
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
//                   >
//                     {responseTimeVsTargetData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<CustomPieTooltip />} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center text-blue-600 py-8">
//                 <p>No closed tickets found in the selected date range.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
        
//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//   <CardHeader>
//     <CardTitle className="text-blue-900">Time Saved by Client</CardTitle>
//   </CardHeader>
//   <CardContent>
//     {timeSavedByClientData.length > 0 ? (
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={timeSavedByClientData}>
//           <defs>
//             <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8} />
//               <stop offset="100%" stopColor="#f9a8d4" stopOpacity={0.1} />
//             </linearGradient>
//           </defs>

//           <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//           <XAxis
//             dataKey="client"
//             angle={0}
//             textAnchor="middle"
//             height={80}
//             tick={{ fill: '#1E3A8A', fontSize: 12 }}
//           />
//           <YAxis
//             label={{
//               value: 'Hours',
//               angle: -90,
//               position: 'insideLeft',
//               fill: '#1E3A8A',
//             }}
//             tick={{ fill: '#1E3A8A' }}
//           />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: '#F9FAFB',
//               borderColor: '#E5E7EB',
//               color: '#1E3A8A',
//             }}
//           />

//           {/* Highlighted area under the line */}
//           <Area
//             type="monotone"
//             dataKey="hours"
//             stroke="none"
//             fill="url(#pinkGradient)"
//           />

//           {/* Line with dots */}
//           <Line
//             type="monotone"
//             dataKey="hours"
//             stroke="url(#pinkGradient)"
//             strokeWidth={3}
//             dot={{ r: 5, stroke: '#ec4899', strokeWidth: 2, fill: '#fff' }}
//             activeDot={{ r: 7, fill: '#ec4899' }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     ) : (
//       <div className="text-center text-blue-600 py-8">
//         <p>No time-saving data available.</p>
//       </div>
//     )}
//   </CardContent>
// </Card>


//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardHeader>
//             <CardTitle className="text-blue-900">Ticket Trends</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {ticketTrendsData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={ticketTrendsData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                   <XAxis dataKey="month" tick={{ fill: '#1E3A8A', fontSize: 12 }} />
//                   <YAxis label={{ value: 'Tickets', angle: -90, position: 'insideLeft', fill: '#1E3A8A' }} tick={{ fill: '#1E3A8A' }} />
//                   <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1E3A8A' }} />
//                   <Bar dataKey="tickets" fill="#10B981" name="Tickets Created" />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center text-blue-600 py-8">
//                 <p>No tickets found in the selected date range.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminAnalytics;







"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { Clock, Star, TicketIcon, Target, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import axios from "axios"
import type { Ticket } from "@/types"

const AdminAnalytics: React.FC = () => {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch all tickets for admin
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.token) {
        console.warn("No user or token available")
        setTickets([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await axios.get("/api/tickets", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        const fetchedTickets = response.data.map((ticket: any) => ({
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
          close_ticket: ticket.close_ticket
            ? {
                ...ticket.close_ticket,
                created_at: ticket.close_ticket.created_at
                  ? new Date(ticket.close_ticket.created_at).toISOString()
                  : new Date().toISOString(),
              }
            : undefined,
        }))
        console.log("Fetched tickets:", fetchedTickets)
        setTickets(fetchedTickets)
      } catch (error) {
        console.error("Error fetching tickets:", error)
        alert("Failed to fetch tickets.")
        setTickets([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-blue-600">Loading analytics...</p>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
        <p className="text-blue-600 mt-2">This page is only accessible to admins.</p>
      </div>
    )
  }

  // Filter tickets by date range
  const filteredTickets = tickets.filter((ticket) => {
    if (!dateRange.start || !dateRange.end) return true
    const created = new Date(ticket.createdAt).getTime()
    const start = new Date(dateRange.start).getTime()
    const end = new Date(dateRange.end).getTime()
    return created >= start && created <= end
  })

  // Calculate total time saved
  const timeSavedData = filteredTickets
    .filter((ticket) => ticket.close_ticket?.time_saved != null)
    .map((ticket) => ({
      ticketId: ticket.ticket_id,
      title: ticket.issue_title,
      hours: ticket.close_ticket?.time_saved || 0,
      client: ticket.client.client_username,
    }))
  const totalTimeSaved = timeSavedData.reduce((sum, item) => sum + item.hours, 0)

  // Calculate overall rating
  const ratings = filteredTickets
    .filter((ticket) => ticket.close_ticket?.rating != null)
    .map((ticket) => ticket.close_ticket?.rating || 0)
  const overallRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

  // Calculate average response time
  const responseTimes = filteredTickets
    .filter((ticket) => ticket.status === "closed" && ticket.closed_at)
    .map((ticket) => {
      const created = new Date(ticket.createdAt).getTime()
      const closed = new Date(ticket.closed_at!).getTime()
      return (closed - created) / (1000 * 60 * 60) // Convert to hours
    })
  const averageResponseTime =
    responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0

  // Calculate total tickets
  const totalTickets = filteredTickets.length

  // Calculate response time vs target (72 hours)
  const targetResponseTime = 72 // 72 hours
  const closedTickets = filteredTickets.filter((t) => t.status === "closed" && t.closed_at)
  const withinTarget = closedTickets.filter((ticket) => {
    const created = new Date(ticket.createdAt).getTime()
    const closed = new Date(ticket.closed_at!).getTime()
    const responseTime = (closed - created) / (1000 * 60 * 60)
    return responseTime <= targetResponseTime
  }).length
  const responseTimeVsTarget = closedTickets.length > 0 ? (withinTarget / closedTickets.length) * 100 : 0
  const responseTimeVsTargetData = [
    { name: "Within Target (≤72h)", value: responseTimeVsTarget, count: withinTarget },
    { name: "Beyond Target (>72h)", value: 100 - responseTimeVsTarget, count: closedTickets.length - withinTarget },
  ]

  // Calculate time saved by client
  const timeSavedByClient = filteredTickets
    .filter((ticket) => ticket.close_ticket?.time_saved != null)
    .reduce(
      (acc, ticket) => {
        const client = ticket.client.client_username
        acc[client] = (acc[client] || 0) + (ticket.close_ticket?.time_saved || 0)
        return acc
      },
      {} as { [key: string]: number },
    )
  const timeSavedByClientData = Object.entries(timeSavedByClient).map(([client, hours]) => ({
    client,
    hours,
  }))

  // Calculate ticket trends (by month)
  const ticketTrends = filteredTickets.reduce(
    (acc, ticket) => {
      const date = new Date(ticket.createdAt)
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
      acc[monthYear] = (acc[monthYear] || 0) + 1
      return acc
    },
    {} as { [key: string]: number },
  )
  const ticketTrendsData = Object.entries(ticketTrends)
    .map(([monthYear, count]) => ({
      month: monthYear,
      tickets: count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))

  // Export data as CSV
  const exportToCSV = () => {
    const headers = [
      "Ticket ID",
      "Title",
      "Client",
      "Time Saved (Hours)",
      "Rating",
      "Response Time (Hours)",
      "Ticket Type",
      "Status",
      "Created At",
    ]
    const rows = filteredTickets.map((ticket) => {
      const timeSaved = ticket.close_ticket?.time_saved || 0
      const rating = ticket.close_ticket?.rating || "N/A"
      const responseTime =
        ticket.status === "closed" && ticket.closed_at
          ? (new Date(ticket.closed_at).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60)
          : 0
      return [
        ticket.ticket_id,
        ticket.issue_title,
        ticket.client.client_username,
        timeSaved,
        rating,
        responseTime.toFixed(1),
        ticket.ticket_type,
        ticket.status,
        ticket.createdAt,
      ]
    })

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `admin_analytics_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const CHART_COLORS = {
    primary: "#3B82F6",
    secondary: "#10B981",
    accent: "#F59E0B",
    danger: "#EF4444",
    purple: "#8B5CF6",
    pink: "#EC4899",
    teal: "#14B8A6",
    gradient: {
      blue: ["#3B82F6", "#1D4ED8"],
      green: ["#10B981", "#059669"],
      purple: ["#8B5CF6", "#7C3AED"],
      pink: ["#EC4899", "#DB2777"],
    },
  }

  const PIE_COLORS = [CHART_COLORS.secondary, CHART_COLORS.danger]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-lg text-sm">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-gray-600" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-lg text-sm">
          <p className="font-semibold text-gray-800">{`${data.name}: ${data.value.toFixed(1)}%`}</p>
          <p className="text-gray-600">{`Tickets: ${data.count}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 gap-4 text-white">
        <div>
          <h1 className="text-4xl font-bold">Admin Analytics</h1>
          <p className="text-blue-100 mt-2 text-lg">Comprehensive insights and performance metrics</p>
        </div>
        <Button
          onClick={exportToCSV}
          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="flex gap-6 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg transition-all duration-300"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg transition-all duration-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium">Total Time Saved</p>
                <p className="text-3xl text-blue-600 font-bold mt-1">{totalTimeSaved.toFixed(1)} h</p>
              </div>
              <Clock className="h-12 w-12  bg-white/20 p-3 rounded-full text-blue-500"  />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-900 font-medium">Overall Rating</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{overallRating.toFixed(1)}</p>
              </div>
              <Star className="h-12 w-12 text-amber-800  p-3 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 font-medium">Avg Response Time</p>
                <p className="text-3xl font-bold mt-1 text-emerald-500">{averageResponseTime.toFixed(1)} h</p>
              </div>
              <Clock className="h-12 w-12 text-emerald-700 bg-white/20 p-3 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black font-medium">Total Tickets</p>
                <p className="text-3xl text-black font-bold mt-1">{totalTickets}</p>
              </div>
              <TicketIcon className="h-12 w-12 text-purple-200 bg-white/20 p-3 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Response Time vs Target (72h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {responseTimeVsTargetData[0].value > 0 || responseTimeVsTargetData[1].value > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={responseTimeVsTargetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="url(#greenGradient)" />
                    <Cell fill="url(#redGradient)" />
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No closed tickets found in the selected date range.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-pink-600" />
              Time Saved by Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeSavedByClientData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={timeSavedByClientData}>
                  <defs>
                    <linearGradient id="pinkAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                  <XAxis dataKey="client" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={{ stroke: "#E5E7EB" }} />
                  <YAxis
                    label={{
                      value: "Hours Saved",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#6B7280" },
                    }}
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#EC4899"
                    strokeWidth={3}
                    fill="url(#pinkAreaGradient)"
                    dot={{ r: 6, stroke: "#EC4899", strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 8, fill: "#EC4899", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No time-saving data available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Monthly Ticket Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ticketTrendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={ticketTrendsData}>
                  <defs>
                    <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                  <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={{ stroke: "#E5E7EB" }} />
                  <YAxis
                    label={{
                      value: "Tickets Created",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#6B7280" },
                    }}
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="#14B8A6"
                    strokeWidth={3}
                    fill="url(#tealGradient)"
                    dot={{ r: 5, stroke: "#14B8A6", strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 7, fill: "#14B8A6", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-16">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No tickets found in the selected date range.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminAnalytics
