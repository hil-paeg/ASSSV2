// 'use client';

// import React, { useState, useMemo } from 'react';
// import { Folder, ArrowLeft, Calendar, Filter } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Search, X } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Badge } from '@/components/ui/badge';

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
// }

// const Reports = () => {
//   const { user } = useAuth();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeClient, setActiveClient] = useState<string | null>(null);
//   const [dateFrom, setDateFrom] = useState('');
//   const [dateTo, setDateTo] = useState('');
//   const [priorityFilter, setPriorityFilter] = useState('');
//   const [showFilters, setShowFilters] = useState(false);



//   if (user?.role !== 'admin') {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
//         <p className="text-gray-500 mt-2">This page is only accessible to administrators.</p>
//       </div>
//     );
//   }

//   const filteredTickets = tickets.filter(ticket => ticket.status === 'closed');

//   const groupedTickets = filteredTickets.reduce((acc, ticket) => {
//     if (!acc[ticket.client]) acc[ticket.client] = [];
//     acc[ticket.client].push(ticket);
//     return acc;
//   }, {} as Record<string, Ticket[]>);

//   // Filter tickets for active client view
//   const clientTickets = useMemo(() => {
//     if (!activeClient) return [];
    
//     let filtered = groupedTickets[activeClient] || [];
    
//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(ticket =>
//         ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         ticket.adminSummary.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     // Date filters
//     if (dateFrom) {
//       filtered = filtered.filter(ticket => new Date(ticket.createdAt) >= new Date(dateFrom));
//     }
    
//     if (dateTo) {
//       filtered = filtered.filter(ticket => new Date(ticket.createdAt) <= new Date(dateTo));
//     }
    
//     // Priority filter
//     if (priorityFilter) {
//       filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
//     }
    
//     return filtered;
//   }, [activeClient, groupedTickets, searchTerm, dateFrom, dateTo, priorityFilter]);

//   const getPriorityColor = (priority: string) => {
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

//   const getRatingStars = (rating: number) => {
//     return '★'.repeat(rating) + '☆'.repeat(5 - rating);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setDateFrom('');
//     setDateTo('');
//     setPriorityFilter('');
//   };

//   // Folder view
//   if (!activeClient) {
//     return (
//       <div className="container mx-auto px-4 py-6 min-h-screen bg-gradient-to-br from-gray-50 to-white">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-blue-900">Client Reports Folders</h1>
//           <p className="text-blue-600">Click on a folder to view resolved ticket reports</p>
//         </div>

//         {Object.keys(groupedTickets).length === 0 ? (
//           <p className="text-center text-blue-500 mt-10">No closed tickets found.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {Object.entries(groupedTickets).map(([client, clientTickets]) => (
//               <Card
//                 key={client}
//                 onClick={() => setActiveClient(client)}
//                 className="bg-white shadow-md rounded-lg border hover:shadow-xl transition-all duration-300 cursor-pointer text-center p-6 hover:scale-105"
//               >
//                 <CardHeader className="flex flex-col items-center">
//                   <Folder className="h-16 w-16 text-blue-600 mb-3" />
//                   <CardTitle className="text-xl font-semibold text-blue-800">{client}</CardTitle>
//                   <p className="text-sm text-gray-500">{clientTickets.length} Reports</p>
//                   <Badge className="mt-2 bg-blue-100 text-blue-800">
//                     Last updated: {new Date(Math.max(...clientTickets.map(t => new Date(t.updatedAt).getTime()))).toLocaleDateString()}
//                   </Badge>
//                 </CardHeader>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   // Client detail view
//   return (
//     <div className="container mx-auto px-4 py-6 min-h-screen bg-gradient-to-br from-gray-50 to-white">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center gap-4 mb-4">
//           <button
//             onClick={() => {
//               setActiveClient(null);
//               clearFilters();
//             }}
//             className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
//           >
//             <ArrowLeft className="h-5 w-5" />
//             Back to Folders
//           </button>
//         </div>
//         <h1 className="text-3xl font-bold text-blue-900">{activeClient} - Resolved Tickets</h1>
//         <p className="text-blue-600">Total Reports: {groupedTickets[activeClient]?.length || 0} | Filtered Results: {clientTickets.length}</p>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//             <Filter className="h-5 w-5" />
//             Filters
//           </h3>
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="text-blue-600 hover:text-blue-800 transition-colors"
//           >
//             {showFilters ? 'Hide Filters' : 'Show Filters'}
//           </button>
//         </div>

//         {showFilters && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 placeholder="Search tickets..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             {/* Date From */}
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 type="date"
//                 placeholder="From Date"
//                 value={dateFrom}
//                 onChange={(e) => setDateFrom(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             {/* Date To */}
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 type="date"
//                 placeholder="To Date"
//                 value={dateTo}
//                 onChange={(e) => setDateTo(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             {/* Priority Filter */}
//             <select
//               value={priorityFilter}
//               onChange={(e) => setPriorityFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
//             >
//               <option value="">All Priorities</option>
//               <option value="high">High</option>
//               <option value="medium">Medium</option>
//               <option value="low">Low</option>
//             </select>
//           </div>
//         )}

//         {/* Clear Filters */}
//         {(searchTerm || dateFrom || dateTo || priorityFilter) && (
//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <button
//               onClick={clearFilters}
//               className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
//             >
//               <X className="h-4 w-4" />
//               Clear All Filters
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Tickets List */}
//       {clientTickets.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No tickets found matching your filters.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {clientTickets.map((ticket) => (
//             <Card key={ticket.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex-1">
//                     <h3 className="text-xl font-semibold text-blue-900 mb-2">{ticket.title}</h3>
//                     <p className="text-gray-700 mb-3">{ticket.description}</p>
//                   </div>
//                   <Badge className={`text-white ${getPriorityColor(ticket.priority)} ml-4`}>
//                     {ticket.priority.toUpperCase()}
//                   </Badge>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">
//                       <strong>Ticket ID:</strong> #{ticket.id}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <strong>Resolved:</strong> {new Date(ticket.updatedAt).toLocaleDateString()}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <strong>Resolution Time:</strong> {Math.ceil((new Date(ticket.updatedAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
//                     </p>
//                   </div>

//                   {ticket.feedback && (
//                     <div className="space-y-2">
//                       <p className="text-sm text-gray-600">
//                         <strong>Client Rating:</strong> <span className="text-yellow-500">{getRatingStars(ticket.feedback.rating)}</span> ({ticket.feedback.rating}/5)
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         <strong>Experience:</strong> {ticket.feedback.experience}
//                       </p>
//                       {ticket.feedback.savedTime && (
//                         <p className="text-sm text-green-600">
//                           <strong>Time Saved:</strong> {ticket.feedback.timeAmount}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <div className="bg-blue-50 rounded-lg p-4">
//                   <h4 className="font-semibold text-blue-900 mb-2">Admin Summary:</h4>
//                   <p className="text-blue-800">{ticket.adminSummary}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Reports;


  // const tickets: Ticket[] = [
  //   {
  //     id: '1',
  //     title: 'Server Downtime',
  //     description: 'Server offline issue',
  //     priority: 'high',
  //     status: 'closed',
  //     createdAt: '2025-07-10',
  //     updatedAt: '2025-07-20',
  //     client: 'AMNSI',
  //     adminClosed: true,
  //     clientClosed: true,
  //     adminSummary: 'Server restarted and firmware updated.',
  //     feedback: {
  //       experience: 'Quick resolution',
  //       rating: 4,
  //       savedTime: true,
  //       timeAmount: '2 hours',
  //     },
  //   },
  //   {
  //     id: '2',
  //     title: 'Login Failure',
  //     description: 'User authentication error',
  //     priority: 'medium',
  //     status: 'closed',
  //     createdAt: '2025-07-12',
  //     updatedAt: '2025-07-18',
  //     client: 'URJA',
  //     adminClosed: true,
  //     clientClosed: true,
  //     adminSummary: 'Updated authentication module.',
  //     feedback: {
  //       experience: 'Satisfactory',
  //       rating: 3,
  //       savedTime: false,
  //       timeAmount: '',
  //     },
  //   },
  //   {
  //     id: '3',
  //     title: 'HMI Connectivity',
  //     description: 'HMI not connecting',
  //     priority: 'low',
  //     status: 'closed',
  //     createdAt: '2025-07-08',
  //     updatedAt: '2025-07-15',
  //     client: 'SAIL',
  //     adminClosed: true,
  //     clientClosed: true,
  //     adminSummary: 'Reconfigured network settings.',
  //     feedback: {
  //       experience: 'Excellent support',
  //       rating: 5,
  //       savedTime: true,
  //       timeAmount: '1 day',
  //     },
  //   },
  //   {
  //     id: '4',
  //     title: 'Database Connection Issue',
  //     description: 'Database timeout errors',
  //     priority: 'high',
  //     status: 'closed',
  //     createdAt: '2025-06-15',
  //     updatedAt: '2025-06-20',
  //     client: 'AMNSI',
  //     adminClosed: true,
  //     clientClosed: true,
  //     adminSummary: 'Optimized database queries and increased connection pool.',
  //     feedback: {
  //       experience: 'Very good',
  //       rating: 4,
  //       savedTime: true,
  //       timeAmount: '4 hours',
  //     },
  //   },
  //   {
  //     id: '5',
  //     title: 'Network Configuration',
  //     description: 'Port configuration issue',
  //     priority: 'medium',
  //     status: 'closed',
  //     createdAt: '2025-06-25',
  //     updatedAt: '2025-07-02',
  //     client: 'URJA',
  //     adminClosed: true,
  //     clientClosed: true,
  //     adminSummary: 'Reconfigured firewall rules and port mappings.',
  //     feedback: {
  //       experience: 'Good',
  //       rating: 4,
  //       savedTime: true,
  //       timeAmount: '1 hour',
  //     },
  //   },
  //   {
  //     id: '6',
  //     title: 'Software Update Failed',
  //     description: 'Update process interrupted',
  //     priority: 'low',
  //     status: 'closed',
  //     createdAt: '2025-05-10',
  //     updatedAt: '2025-05-15',
  //     client: 'SAIL',
  //     adminClosed: true,
  //     clientClosed: true,
  //     adminSummary: 'Rolled back update and applied patches manually.',
  //     feedback: {
  //       experience: 'Excellent',
  //       rating: 5,
  //       savedTime: true,
  //       timeAmount: '2 hours',
  //     },
  //   },
  // ];


  
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Folder, ArrowLeft, Calendar, Filter, Search, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

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
}

const Reports = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch tickets from /api/tickets
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.token) {
        console.warn('No user or token available');
        setError('User not authenticated');
        setTickets([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/tickets', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const fetchedTickets = response.data.map((ticket: any) => ({
          id: ticket.ticket_id.toString(),
          title: ticket.issue_title,
          description: ticket.description || '',
          priority: ticket.priority || 'low',
          status: ticket.status,
          createdAt: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
          updatedAt: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
          client: ticket.client.client_username,
          adminClosed: Boolean(ticket.adminClosed),
          clientClosed: Boolean(ticket.clientClosed),
          adminSummary: ticket.summary || '',
          feedback: ticket.close_ticket
            ? {
                experience: ticket.close_ticket.experience || '',
                rating: ticket.close_ticket.rating || 0,
                savedTime: !!ticket.close_ticket.time_saved,
                timeAmount: ticket.close_ticket.time_saved ? `${ticket.close_ticket.time_saved} hours` : '',
              }
            : null,
        }));
        console.log('Fetched tickets:', fetchedTickets);
        setTickets(fetchedTickets);
      } catch (error: any) {
        console.error('Error fetching tickets:', error);
        setError('Failed to fetch tickets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  // Filter and group tickets
  const filteredTickets = useMemo(() => tickets.filter((ticket) => ticket.status === 'closed'), [tickets]);

  const groupedTickets = useMemo(() => {
    return filteredTickets.reduce((acc, ticket) => {
      if (!acc[ticket.client]) acc[ticket.client] = [];
      acc[ticket.client].push(ticket);
      return acc;
    }, {} as Record<string, Ticket[]>);
  }, [filteredTickets]);

  // Filter tickets for active client view
  const clientTickets = useMemo(() => {
    if (!activeClient) return [];

    let filtered = groupedTickets[activeClient] || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.adminSummary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filters
    if (dateFrom) {
      filtered = filtered.filter((ticket) => new Date(ticket.createdAt) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter((ticket) => new Date(ticket.createdAt) <= new Date(dateTo));
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
    }

    return filtered;
  }, [activeClient, groupedTickets, searchTerm, dateFrom, dateTo, priorityFilter]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setPriorityFilter('');
  };

  // Conditional rendering after all hooks
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-500">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-500 mt-2">This page is only accessible to administrators.</p>
      </div>
    );
  }

  // Folder view
  if (!activeClient) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Client Reports</h1>
          <p className="text-gray-500 mt-1">Click a client to view their resolved ticket reports</p>
        </div>

        {Object.keys(groupedTickets).length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No closed tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(groupedTickets).map(([client, clientTickets]) => (
              <Card
                key={client}
                onClick={() => setActiveClient(client)}
                className="bg-white shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer text-center p-6 hover:bg-gray-50"
              >
                <CardHeader className="flex flex-col items-center">
                  <Folder className="h-12 w-12 text-blue-600 mb-3" />
                  <CardTitle className="text-lg font-semibold text-gray-800">{client}</CardTitle>
                  <p className="text-sm text-gray-500">{clientTickets.length} Reports</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700 text-xs">
                    Last updated: {new Date(Math.max(...clientTickets.map((t) => new Date(t.updatedAt).getTime()))).toLocaleDateString()}
                  </Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Client detail view
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => {
            setActiveClient(null);
            clearFilters();
          }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Clients
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">{activeClient} - Resolved Tickets</h1>
        <p className="text-gray-500 mt-1">
          Total Reports: {groupedTickets[activeClient]?.length || 0} | Filtered Results: {clientTickets.length}
        </p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            Filters
          </h3>
          <Button
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Date From */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-800"
              />
            </div>

            {/* Date To */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-800"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-gray-800"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        )}

        {(searchTerm || dateFrom || dateTo || priorityFilter) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear All Filters
            </Button>
          </div>
        )}
      </motion.div>

      {/* Tickets List */}
      {clientTickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tickets found matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {clientTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="bg-white shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{ticket.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
                  </div>
                  <Badge className={`text-white text-xs font-medium px-2 py-1 ${getPriorityColor(ticket.priority)} ml-4`}>
                    {ticket.priority.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Ticket ID:</strong> #{ticket.id}
                    </p>
                    <p>
                      <strong>Created:</strong>{' '}
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p>
                      <strong>Resolved:</strong>{' '}
                      {new Date(ticket.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p>
                      <strong>Resolution Time:</strong>{' '}
                      {Math.ceil(
                        (new Date(ticket.updatedAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                      )}{' '}
                      days
                    </p>
                  </div>

                  {ticket.feedback && (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Client Rating:</strong>{' '}
                        <span className="text-yellow-500">{getRatingStars(ticket.feedback.rating)}</span> (
                        {ticket.feedback.rating}/5)
                      </p>
                      <p>
                        <strong>Experience:</strong> {ticket.feedback.experience}
                      </p>
                      {ticket.feedback.savedTime && (
                        <p className="text-green-600">
                          <strong>Time Saved:</strong> {ticket.feedback.timeAmount}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">Admin Summary</h4>
                  <p className="text-gray-700 text-sm">{ticket.adminSummary}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;