// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
// import { Clock, Star, TicketIcon } from 'lucide-react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// // Mock useAuth context for demonstration purposes.
// // In a real application, this would come from your actual AuthContext.
// const useAuth = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Simulate user login/auth state. Replace with actual auth logic.
//     // For this demo, we'll assume a user with role 'user' and a specific user ID.
//     setUser({ role: 'user', user: 'AMNSI' }); // Mocking the user object
//   }, []);

//   return { user };
// };


// interface Ticket {
//   id: string;
//   title: string;
//   description: string;
//   priority: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   user: string; // Changed from 'client' to 'user' to match filtering logic
//   adminClosed: boolean;
//   clientClosed: boolean;
//   adminSummary: string;
//   feedback: { experience: string; rating: number; savedTime: boolean; timeAmount: string } | null;
//   ticketType: string;
// }

// const ClientAnalytics: React.FC = () => {
//   const { user } = useAuth();
//   const [selectedPeriod] = useState('all'); // Could add period filter later
//   const [selectedTicketType, setSelectedTicketType] = useState('RS1'); // State for dropdown selection

//   // Mock ticket data (filtered for the logged-in client)
//   // Changed 'client' property to 'user' to match the filtering logic
//   const tickets: Ticket[] = [
//     { id: '1', title: 'Server Downtime', description: 'Server offline issue', priority: 'high', status: 'closed', createdAt: '2025-07-10T10:00:00Z', updatedAt: '2025-07-20T12:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Server restarted and firmware updated.', feedback: { experience: 'Quick resolution', rating: 4, savedTime: true, timeAmount: '2 hours' }, ticketType: 'RS1' },
//     { id: '2', title: 'Login Failure', description: 'User authentication error', priority: 'medium', status: 'closed', createdAt: '2025-07-12T09:00:00Z', updatedAt: '2025-07-18T15:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Updated authentication module.', feedback: { experience: 'Satisfactory', rating: 3, savedTime: false, timeAmount: '' }, ticketType: 'RS2' },
//     { id: '3', title: 'HMI Connectivity', description: 'HMI not connecting', priority: 'low', status: 'closed', createdAt: '2025-07-08T08:00:00Z', updatedAt: '2025-07-15T14:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Reconfigured network settings.', feedback: { experience: 'Excellent support', rating: 5, savedTime: true, timeAmount: '1 day' }, ticketType: 'RS3-1' },
//     { id: '4', title: 'PLC Error', description: 'PLC fault code 0x81', priority: 'high', status: 'open', createdAt: '2025-07-14T11:00:00Z', updatedAt: '2025-07-14T11:00:00Z', user: 'AMNSI', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, ticketType: 'RS3-2' },
//     { id: '5', title: 'Network Issue', description: 'Intermittent network drops', priority: 'medium', status: 'closed', createdAt: '2025-07-11T13:00:00Z', updatedAt: '2025-07-19T10:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Replaced faulty switch.', feedback: { experience: 'Very good', rating: 4, savedTime: true, timeAmount: '3 hours' }, ticketType: 'RS1' },
//     { id: '6', title: 'Software Glitch', description: 'Application crashing on startup', priority: 'low', status: 'closed', createdAt: '2025-07-05T16:00:00Z', updatedAt: '2025-07-10T09:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Applied hotfix.', feedback: { experience: 'Satisfied', rating: 3, savedTime: false, timeAmount: '' }, ticketType: 'RS2' },
//     { id: '7', title: 'Sensor Calibration', description: 'Sensor reading incorrect values', priority: 'high', status: 'closed', createdAt: '2025-07-13T09:00:00Z', updatedAt: '2025-07-16T11:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Recalibrated sensor.', feedback: { experience: 'Excellent', rating: 5, savedTime: true, timeAmount: '0.5 days' }, ticketType: 'RS3-1' },
//     { id: '8', title: 'Database Connectivity', description: 'Cannot connect to database', priority: 'medium', status: 'open', createdAt: '2025-07-15T10:00:00Z', updatedAt: '2025-07-15T10:00:00Z', user: 'AMNSI', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, ticketType: 'RS1' },
//   ];

//   // Ensure only clients can access this page
//   // The user object might be null initially due to async auth, so check for it.
//   if (!user || user.role !== 'user') {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
//         <p className="text-blue-600 mt-2">This page is only accessible to clients.</p>
//       </div>
//     );
//   }

//   // Filter tickets for the current client and closed status
//   const clientTickets = tickets.filter((ticket) => ticket.user === user?.user && ticket.status === 'closed');

//   // Calculate time saved (convert timeAmount to hours)
//   const timeSavedData = clientTickets
//     .filter((ticket) => ticket.feedback?.savedTime && ticket.feedback.timeAmount)
//     .map((ticket) => {
//       const timeAmount = ticket.feedback!.timeAmount.toLowerCase().trim();
//       let hours = 0;
//       // Parse timeAmount (e.g., "2 hours", "1 day", "1.5 hours")
//       const match = timeAmount.match(/^(\d*\.?\d*)\s*(hour|day)s?$/i);
//       if (match) {
//         const value = parseFloat(match[1]) || 0;
//         hours = match[2].toLowerCase() === 'day' ? value * 24 : value;
//       }
//       return { ticketId: ticket.id, title: ticket.title, hours };
//     })
//     .filter((item) => item.hours > 0); // Only include valid entries

//   const totalTimeSaved = timeSavedData.reduce((sum, item) => sum + item.hours, 0);

//   // Calculate average rating
//   const ratings = clientTickets
//     .filter((ticket) => ticket.feedback?.rating)
//     .map((ticket) => ticket.feedback!.rating);
//   const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

//   // Calculate average response time (in hours)
//   const responseTimes = clientTickets.map((ticket) => {
//     const created = new Date(ticket.createdAt).getTime();
//     const resolved = new Date(ticket.updatedAt).getTime();
//     return (resolved - created) / (1000 * 60 * 60); // Convert to hours
//   });
//   const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

//   // Calculate percentage of each type of tickets solved
//   const ticketTypes = ['RS1', 'RS2', 'RS3-1', 'RS3-2'];
//   const ticketTypeStats: { [key: string]: { total: number; solved: number } } = {};

//   ticketTypes.forEach(type => {
//     ticketTypeStats[type] = { total: 0, solved: 0 };
//   });

//   tickets.forEach(ticket => { // Iterate over all tickets, not just clientTickets, to get total raised
//     if (ticket.user === user?.user && ticketTypes.includes(ticket.ticketType)) {
//       ticketTypeStats[ticket.ticketType].total++;
//       if (ticket.status === 'closed') {
//         ticketTypeStats[ticket.ticketType].solved++;
//       }
//     }
//   });

//   // Prepare data for the pie chart for the selected ticket type
//   const getTicketTypePercentageData = (type: string) => {
//     const stats = ticketTypeStats[type];
//     if (!stats) return []; // Should not happen if `type` is from `ticketTypes`

//     const percentageSolved = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
//     const percentageUnsolved = 100 - percentageSolved;

//     return [
//       { name: 'Solved', value: percentageSolved, count: stats.solved },
//       { name: 'Unsolved', value: percentageUnsolved, count: stats.total - stats.solved },
//     ];
//   };

//   const currentTicketTypeData = getTicketTypePercentageData(selectedTicketType);

//   // Colors for the pie chart slices
//   const PIE_COLORS = ['#22C55E', '#EF4444']; // Green for Solved, Red for Unsolved

//   // Custom tooltip for the pie chart
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
//       <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6">
//         <div>
//           <h1 className="text-3xl font-bold text-blue-900">Client Analytics</h1>
//           <p className="text-blue-600 mt-2">Insights for your support tickets</p>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-500 font-medium">Total Time Saved</p>
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{totalTimeSaved.toFixed(1)}h</p>
//               </div>
//               <Clock className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-500 font-medium">Average Rating</p>
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{averageRating.toFixed(1)}</p>
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
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{averageResponseTime.toFixed(1)}h</p>
//               </div>
//               <Clock className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Time Saved Chart */}
//       <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle className="text-blue-900">Time Saved per Ticket</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {timeSavedData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={timeSavedData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                 {/* Changed XAxis angle to 0 and textAnchor to middle for horizontal labels */}
//                 <XAxis dataKey="title" angle={0} textAnchor="middle" height={80} tick={{ fill: '#1E3A8A', fontSize: 12 }} />
//                 <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#1E3A8A' }} tick={{ fill: '#1E3A8A' }} />
//                 <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1E3A8A' }} />
//                 <Bar dataKey="hours" fill="#3B82F6" name="Time Saved" />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="text-center text-blue-600 py-8">
//               <p>No time-saving tickets found for your account.</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Ticket Type Percentage Chart */}
//       <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-blue-900">Ticket Type Resolution</CardTitle>
//           <Select onValueChange={setSelectedTicketType} defaultValue={selectedTicketType}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select Ticket Type" />
//             </SelectTrigger>
//             <SelectContent>
//               {ticketTypes.map((type) => (
//                 <SelectItem key={type} value={type}>
//                   {type}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </CardHeader>
//         <CardContent>
//           {currentTicketTypeData.length > 0 && (currentTicketTypeData[0].value > 0 || currentTicketTypeData[1].value > 0) ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={currentTicketTypeData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   paddingAngle={5}
//                   dataKey="value"
//                   labelLine={false}
//                   label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
//                 >
//                   {currentTicketTypeData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip content={<CustomPieTooltip />} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="text-center text-blue-600 py-8">
//               <p>No data available for {selectedTicketType} tickets.</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ClientAnalytics;


// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
// import { Clock, Star, TicketIcon, Calendar } from 'lucide-react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// // Mock useAuth context for demonstration purposes
// const useAuth = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     setUser({ role: 'user', user: 'AMNSI' });
//   }, []);

//   return { user };
// };

// interface Ticket {
//   id: string;
//   title: string;
//   description: string;
//   priority: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   user: string;
//   adminClosed: boolean;
//   clientClosed: boolean;
//   adminSummary: string;
//   feedback: { experience: string; rating: number; savedTime: boolean; timeAmount: string } | null;
//   ticketType: string;
// }

// const ClientAnalytics: React.FC = () => {
//   const { user } = useAuth();
//   const [selectedPeriod] = useState('all');
//   const [selectedTicketType, setSelectedTicketType] = useState('RS1');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });

//   // Mock ticket data
//   const tickets: Ticket[] = [
//     { id: '1', title: 'Server Downtime', description: 'Server offline issue', priority: 'high', status: 'closed', createdAt: '2025-07-10T07:00:00Z', updatedAt: '2025-07-20T12:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Server restarted and firmware updated.', feedback: { experience: 'Quick resolution', rating: 4, savedTime: true, timeAmount: '2 hours' }, ticketType: 'RS1' },
//     { id: '2', title: 'Login Failure', description: 'User authentication error', priority: 'medium', status: 'closed', createdAt: '2025-07-12T15:00:00Z', updatedAt: '2025-07-18T15:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Updated authentication module.', feedback: { experience: 'Satisfactory', rating: 3, savedTime: false, timeAmount: '' }, ticketType: 'RS2' },
//     { id: '3', title: 'HMI Connectivity', description: 'HMI not connecting', priority: 'low', status: 'closed', createdAt: '2025-07-08T23:00:00Z', updatedAt: '2025-07-15T14:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Reconfigured network settings.', feedback: { experience: 'Excellent support', rating: 5, savedTime: true, timeAmount: '1 day' }, ticketType: 'RS3-1' },
//     { id: '4', title: 'PLC Error', description: 'PLC fault code 0x81', priority: 'high', status: 'open', createdAt: '2025-07-14T11:00:00Z', updatedAt: '2025-07-14T11:00:00Z', user: 'AMNSI', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, ticketType: 'RS3-2' },
//     { id: '5', title: 'Network Issue', description: 'Intermittent network drops', priority: 'medium', status: 'closed', createdAt: '2025-07-11T17:00:00Z', updatedAt: '2025-07-19T10:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Replaced faulty switch.', feedback: { experience: 'Very good', rating: 4, savedTime: true, timeAmount: '3 hours' }, ticketType: 'RS1' },
//     { id: '6', title: 'Software Glitch', description: 'Application crashing on startup', priority: 'low', status: 'closed', createdAt: '2025-07-05T02:00:00Z', updatedAt: '2025-07-10T09:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Applied hotfix.', feedback: { experience: 'Satisfied', rating: 3, savedTime: false, timeAmount: '' }, ticketType: 'RS2' },
//     { id: '7', title: 'Sensor Calibration', description: 'Sensor reading incorrect values', priority: 'high', status: 'closed', createdAt: '2025-07-13T09:00:00Z', updatedAt: '2025-07-16T11:00:00Z', user: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Recalibrated sensor.', feedback: { experience: 'Excellent', rating: 5, savedTime: true, timeAmount: '0.5 days' }, ticketType: 'RS3-1' },
//     { id: '8', title: 'Database Connectivity', description: 'Cannot connect to database', priority: 'medium', status: 'open', createdAt: '2025-07-15T10:00:00Z', updatedAt: '2025-07-15T10:00:00Z', user: 'AMNSI', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, ticketType: 'RS1' },
//   ];

//   if (!user || user.role !== 'user') {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
//         <p className="text-blue-600 mt-2">This page is only accessible to clients.</p>
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

//   // Filter tickets for the current user and closed status
//   const clientTickets = filteredTickets.filter((ticket) => ticket.user === user?.user && ticket.status === 'closed');

//   // Calculate time saved
//   const timeSavedData = clientTickets
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

//   const totalTimeSaved = timeSavedData.reduce((sum, item) => sum + item.hours, 0);

//   // Calculate average rating
//   const ratings = clientTickets
//     .filter((ticket) => ticket.feedback?.rating)
//     .map((ticket) => ticket.feedback!.rating);
//   const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

//   // Calculate average response time
//   const responseTimes = clientTickets.map((ticket) => {
//     const created = new Date(ticket.createdAt).getTime();
//     const resolved = new Date(ticket.updatedAt).getTime();
//     return (resolved - created) / (1000 * 60 * 60);
//   });
//   const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

//   // Calculate ticket type statistics
//   const ticketTypes = ['RS1', 'RS2', 'RS3-1', 'RS3-2'];
//   const ticketTypeStats: { [key: string]: { total: number; solved: number } } = {};

//   ticketTypes.forEach(type => {
//     ticketTypeStats[type] = { total: 0, solved: 0 };
//   });

//   filteredTickets.forEach(ticket => {
//     if (ticket.user === user?.user && ticketTypes.includes(ticket.ticketType)) {
//       ticketTypeStats[ticket.ticketType].total++;
//       if (ticket.status === 'closed') {
//         ticketTypeStats[ticket.ticketType].solved++;
//       }
//     }
//   });

//   const getTicketTypePercentageData = (type: string) => {
//     const stats = ticketTypeStats[type];
//     if (!stats) return [];

//     const percentageSolved = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
//     const percentageUnsolved = 100 - percentageSolved;

//     return [
//       { name: 'Solved', value: percentageSolved, count: stats.solved },
//       { name: 'Unsolved', value: percentageUnsolved, count: stats.total - stats.solved },
//     ];
//   };

//   const currentTicketTypeData = getTicketTypePercentageData(selectedTicketType);

//   // Calculate shift-based issue trends
//   const getShift = (createdAt: string): string => {
//     const date = new Date(createdAt);
//     const hours = date.getUTCHours();
//     if (hours >= 6 && hours < 14) return 'A';
//     if (hours >= 14 && hours < 22) return 'B';
//     return 'C';
//   };

//   const shiftData = filteredTickets
//     .filter((ticket) => ticket.user === user?.user)
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
//     const headers = ['Ticket ID', 'Title', 'Shift', 'Time Saved (Hours)', 'Rating', 'Response Time (Hours)', 'Ticket Type', 'Status'];
//     const rows = filteredTickets
//       .filter((ticket) => ticket.user === user?.user)
//       .map((ticket) => {
//         const shift = getShift(ticket.createdAt);
//         const timeSaved = ticket.feedback?.savedTime && ticket.feedback.timeAmount
//           ? ticket.feedback.timeAmount.match(/^(\d*\.?\d*)\s*(hour|day)s?$/i)
//             ? parseFloat(ticket.feedback.timeAmount.match(/^(\d*\.?\d*)/)![0]) * (ticket.feedback.timeAmount.includes('day') ? 24 : 1)
//             : 0
//           : 0;
//         const responseTime = (new Date(ticket.updatedAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);
//         return [
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
//       ...rows.map(row => row.join(',')),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `analytics_${user?.user}_${new Date().toISOString().split('T')[0]}.csv`;
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
//           <h1 className="text-3xl font-bold text-blue-900">Client Analytics</h1>
//           <p className="text-blue-600 mt-2">Insights for your support tickets</p>
//         </div>
//         <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 text-white">
//           Export CSV
//         </Button>
//       </div>


//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-500 font-medium">Total Time Saved</p>
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{totalTimeSaved.toFixed(1)}h</p>
//               </div>
//               <Clock className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-500 font-medium">Average Rating</p>
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{averageRating.toFixed(1)}</p>
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
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">3h</p>
//               </div>
//               <Clock className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardHeader>
//             <CardTitle className="text-blue-900">Time Saved per Ticket</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {timeSavedData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={timeSavedData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                   <XAxis dataKey="title" angle={0} textAnchor="middle" height={80} tick={{ fill: '#1E3A8A', fontSize: 12 }} />
//                   <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#1E3A8A' }} tick={{ fill: '#1E3A8A' }} />
//                   <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1E3A8A' }} />
//                   <Bar dataKey="hours" fill="#3B82F6" name="Time Saved" />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center text-blue-600 py-8">
//                 <p>No time-saving tickets found for your account.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-blue-900">Ticket Type Resolution</CardTitle>
//             <Select onValueChange={setSelectedTicketType} defaultValue={selectedTicketType}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select Ticket Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 {ticketTypes.map((type) => (
//                   <SelectItem key={type} value={type}>
//                     {type}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </CardHeader>
//           <CardContent>
//             {currentTicketTypeData.length > 0 && (currentTicketTypeData[0].value > 0 || currentTicketTypeData[1].value > 0) ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={currentTicketTypeData}
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
//                     {currentTicketTypeData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<CustomPieTooltip />} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center text-blue-600 py-8">
//                 <p>No data available for {selectedTicketType} tickets.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardHeader>
//             <CardTitle className="text-blue-900">Issue Trends by Shift</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {shiftChartData.some(data => data.tickets > 0) ? (
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
//                 <p>No tickets found for your account in the selected date range.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ClientAnalytics;




'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Clock, Star, TicketIcon, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Ticket } from '@/types';

const ClientAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [selectedTicketType, setSelectedTicketType] = useState('RS1');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tickets from the backend
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.token) {
        console.warn('No user or token available');
        setTickets([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get('/api/tickets', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
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
                created_at: ticket.close_ticket.created_at ? new Date(ticket.close_ticket.created_at).toISOString() : new Date().toISOString(),
              }
            : undefined,
        }));
        console.log('Fetched tickets:', fetchedTickets);
        setTickets(fetchedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        alert('Failed to fetch tickets.');
        setTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-blue-600">Loading analytics...</p>
      </div>
    );
  }

  if (!user || (user.role !== 'client' && user.role !== 'clientMember')) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
        <p className="text-blue-600 mt-2">This page is only accessible to clients.</p>
      </div>
    );
  }

  // Filter tickets by date range and client
  const filteredTickets = tickets.filter((ticket) => {
    if (!dateRange.start || !dateRange.end) return true;
    const created = new Date(ticket.createdAt).getTime();
    const start = new Date(dateRange.start).getTime();
    const end = new Date(dateRange.end).getTime();
    return created >= start && created <= end;
  });

  // Calculate time saved from close_ticket
  const timeSavedData = filteredTickets
    .filter((ticket) => ticket.close_ticket?.time_saved != null)
    .map((ticket) => ({
      ticketId: ticket.ticket_id,
      title: ticket.issue_title,
      hours: ticket.close_ticket?.time_saved || 0,
    }));

  const totalTimeSaved = timeSavedData.reduce((sum, item) => sum + item.hours, 0);

  // Calculate average rating from close_ticket
  const ratings = filteredTickets
    .filter((ticket) => ticket.close_ticket?.rating != null)
    .map((ticket) => ticket.close_ticket?.rating || 0);
  const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

  // Calculate average response time
  const responseTimes = filteredTickets
    .filter((ticket) => ticket.status === 'closed' && ticket.closed_at)
    .map((ticket) => {
      const created = new Date(ticket.createdAt).getTime();
      const closed = new Date(ticket.closed_at!).getTime();
      return (closed - created) / (1000 * 60 * 60); // Convert to hours
    });
  const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

  // Calculate ticket type statistics
  const ticketTypes = ['RS1', 'RS2', 'RS3-1', 'RS3-2'];
  const ticketTypeStats: { [key: string]: { total: number; solved: number } } = {};

  ticketTypes.forEach((type) => {
    ticketTypeStats[type] = { total: 0, solved: 0 };
  });

  filteredTickets.forEach((ticket) => {
    if (ticket.ticket_type && ticketTypes.includes(ticket.ticket_type)) {
      ticketTypeStats[ticket.ticket_type].total++;
      if (ticket.status === 'closed') {
        ticketTypeStats[ticket.ticket_type].solved++;
      }
    }
  });

  const getTicketTypePercentageData = (type: string) => {
    const stats = ticketTypeStats[type];
    if (!stats) return [];

    const percentageSolved = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
    const percentageUnsolved = 100 - percentageSolved;

    return [
      { name: 'Solved', value: percentageSolved, count: stats.solved },
      { name: 'Unsolved', value: percentageUnsolved, count: stats.total - stats.solved },
    ];
  };

  const currentTicketTypeData = getTicketTypePercentageData(selectedTicketType);

  // Calculate shift-based issue trends
  const getShift = (createdAt: string): string => {
    const date = new Date(createdAt);
    const hours = date.getHours();
    if (hours >= 6 && hours < 14) return 'A';
    if (hours >= 14 && hours < 22) return 'B';
    return 'C';
  };

  const shiftData = filteredTickets.reduce((acc, ticket) => {
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
    const headers = ['Ticket ID', 'Title', 'Shift', 'Time Saved (Hours)', 'Rating', 'Response Time (Hours)', 'Ticket Type', 'Status'];
    const rows = filteredTickets.map((ticket) => {
      const shift = getShift(ticket.createdAt);
      const timeSaved = ticket.close_ticket?.time_saved || 0;
      const rating = ticket.close_ticket?.rating || 'N/A';
      const responseTime = ticket.status === 'closed' && ticket.closed_at
        ? (new Date(ticket.closed_at).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60)
        : 0;
      return [
        ticket.ticket_id,
        ticket.issue_title,
        shift,
        timeSaved,
        rating,
        responseTime.toFixed(1),
        ticket.ticket_type,
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
    link.download = `analytics_${user.clientId || 'client'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const PIE_COLORS = ['#22C55E', '#EF4444'];

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-sm text-gray-800">
          <p className="font-semibold">{`${data.name}: ${data.value.toFixed(1)}%`}</p>
          <p>{`Tickets: ${data.count}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow-md p-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Client Analytics</h1>
          <p className="text-blue-600 mt-2">Insights for your support tickets</p>
        </div>
        <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 text-white">
          Export CSV
        </Button>
      </div>

      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-blue-700">Start Date</label>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700">End Date</label>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-500 font-medium">Total Time Saved</p>
                <p className="text-3xl font-semibold text-blue-900 mt-1">{totalTimeSaved} h</p>
              </div>
              <Clock className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-500 font-medium">Average Rating</p>
                <p className="text-3xl font-semibold text-blue-900 mt-1">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-10 w-10 text-yellow-600 bg-yellow-100 p-2 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-500 font-medium">Avg Response Time</p>
                <p className="text-3xl font-semibold text-blue-900 mt-1">{averageResponseTime.toFixed(1)} h</p>
              </div>
              <Clock className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Time Saved per Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            {timeSavedData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeSavedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="title" angle={0} textAnchor="middle" height={80} tick={{ fill: '#1E3A8A', fontSize: 12 }} />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#1E3A8A' }} tick={{ fill: '#1E3A8A' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1E3A8A' }} />
                  <Bar dataKey="hours" fill="#3B82F6" name="Time Saved" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-blue-600 py-8">
                <p>No time-saving tickets found for your account.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-blue-900">Ticket Type Resolution</CardTitle>
            <Select onValueChange={setSelectedTicketType} defaultValue={selectedTicketType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Ticket Type" />
              </SelectTrigger>
              <SelectContent>
                {ticketTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {currentTicketTypeData.length > 0 && (currentTicketTypeData[0].value > 0 || currentTicketTypeData[1].value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={currentTicketTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {currentTicketTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-blue-600 py-8">
                <p>No data available for {selectedTicketType} tickets.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Issue Trends by Shift</CardTitle>
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
                <p>No tickets found for your account in the selected date range.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientAnalytics;