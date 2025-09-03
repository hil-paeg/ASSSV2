// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// import { Users, Ticket, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

// const Analytics: React.FC = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState('monthly');

//   // Mock admin data
//   const overallStats = {
//     totalUsers: 45,
//     totalTickets: 287,
//     avgResponseTime: 2.4,
//     satisfactionRate: 4.2,
//     activeContracts: 42,
//     expiringSoon: 8,
//   };

//   const ticketTrends = [
//     { month: 'Jan', total: 45, resolved: 42, inProgress: 3 },
//     { month: 'Feb', total: 38, resolved: 35, inProgress: 3 },
//     { month: 'Mar', total: 52, resolved: 48, inProgress: 4 },
//     { month: 'Apr', total: 41, resolved: 39, inProgress: 2 },
//     { month: 'May', total: 47, resolved: 44, inProgress: 3 },
//     { month: 'Jun', total: 35, resolved: 33, inProgress: 2 },
//   ];

//   const responseTimeData = [
//     { week: 'Week 1', avgTime: 2.1, target: 2.0 },
//     { week: 'Week 2', avgTime: 2.8, target: 2.0 },
//     { week: 'Week 3', avgTime: 1.9, target: 2.0 },
//     { week: 'Week 4', avgTime: 2.3, target: 2.0 },
//   ];


//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
//           <p className="text-gray-600 mt-2">Comprehensive analytics and insights</p>
//         </div>
        
//         <div className="flex gap-3">
//           <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
//             <SelectTrigger className="w-40">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="daily">Daily</SelectItem>
//               <SelectItem value="weekly">Weekly</SelectItem>
//               <SelectItem value="monthly">Monthly</SelectItem>
//               <SelectItem value="yearly">Yearly</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Overview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Users</p>
//                 <p className="text-2xl font-bold">{overallStats.totalUsers}</p>
//               </div>
//               <Users className="h-8 w-8 text-blue-600" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Tickets</p>
//                 <p className="text-2xl font-bold">{overallStats.totalTickets}</p>
//               </div>
//               <Ticket className="h-8 w-8 text-green-600" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Avg Response</p>
//                 <p className="text-2xl font-bold">{overallStats.avgResponseTime}h</p>
//               </div>
//               <Clock className="h-8 w-8 text-yellow-600" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
//                 <p className="text-2xl font-bold">{overallStats.expiringSoon}</p>
//               </div>
//               <AlertTriangle className="h-8 w-8 text-red-600" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Analytics Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Ticket Trends</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={ticketTrends}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
//                 <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Response Time vs Target</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={responseTimeData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="week" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" strokeWidth={2} name="Actual" />
//                 <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" name="Target" />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

      
//       </div>
//     </div>
//   );
// };

// export default Analytics;




// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// import { Users, Ticket, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

// const Analytics: React.FC = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState('monthly');

//   // Mock admin data
//   const overallStats = {
//     totalUsers: 45,
//     totalTickets: 287,
//     avgResponseTime: 2.4,
//     satisfactionRate: 4.2,
//     activeContracts: 42,
//     expiringSoon: 8,
//   };

//   const ticketTrends = [
//     { month: 'Jan', total: 45, resolved: 42, inProgress: 3 },
//     { month: 'Feb', total: 38, resolved: 35, inProgress: 3 },
//     { month: 'Mar', total: 52, resolved: 48, inProgress: 4 },
//     { month: 'Apr', total: 41, resolved: 39, inProgress: 2 },
//     { month: 'May', total: 47, resolved: 44, inProgress: 3 },
//     { month: 'Jun', total: 35, resolved: 33, inProgress: 2 },
//   ];

//   const responseTimeData = [
//     { week: 'Week 1', avgTime: 2.1, target: 2.0 },
//     { week: 'Week 2', avgTime: 2.8, target: 2.0 },
//     { week: 'Week 3', avgTime: 1.9, target: 2.0 },
//     { week: 'Week 4', avgTime: 2.3, target: 2.0 },
//   ];

//   // Mock data for ticket types pie chart
//   const ticketTypeData = [
//     { name: 'RS1', value: 80 },
//     { name: 'RS2', value: 60 },
//     { name: 'RS3-1', value: 90 },
//     { name: 'RS3-2', value: 57 },
//   ];

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
//           <p className="text-gray-600 mt-2">Comprehensive analytics and insights</p>
//         </div>
   
//       </div>

//       {/* Overview Cards */}
//      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//   {/* Total Users */}
//   <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//     <CardContent className="p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-500 font-medium">Total Users</p>
//           <p className="text-3xl font-semibold text-gray-800 mt-1">
//             {overallStats.totalUsers}
//           </p>
//         </div>
//         <Users className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//       </div>
//     </CardContent>
//   </Card>

//   {/* Total Tickets */}
//   <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//     <CardContent className="p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-500 font-medium">Total Tickets</p>
//           <p className="text-3xl font-semibold text-gray-800 mt-1">
//             {overallStats.totalTickets}
//           </p>
//         </div>
//         <Ticket className="h-10 w-10 text-green-600 bg-green-100 p-2 rounded-full" />
//       </div>
//     </CardContent>
//   </Card>

//   {/* Average Response */}
//   <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//     <CardContent className="p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-500 font-medium">Avg Response</p>
//           <p className="text-3xl font-semibold text-gray-800 mt-1">
//             {overallStats.avgResponseTime}h
//           </p>
//         </div>
//         <Clock className="h-10 w-10 text-yellow-600 bg-yellow-100 p-2 rounded-full" />
//       </div>
//     </CardContent>
//   </Card>

//   {/* Expiring Soon */}
//   <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//     <CardContent className="p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-500 font-medium">Expiring Soon</p>
//           <p className="text-3xl font-semibold text-gray-800 mt-1">
//             {overallStats.expiringSoon}
//           </p>
//         </div>
//         <AlertTriangle className="h-10 w-10 text-red-600 bg-red-100 p-2 rounded-full" />
//       </div>
//     </CardContent>
//   </Card>
// </div>


//       {/* Analytics Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Ticket Trends</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={ticketTrends}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
//                 <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Response Time vs Target</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={responseTimeData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="week" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" strokeWidth={2} name="Actual" />
//                 <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" name="Target" />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card>
//       <CardHeader>
//         <CardTitle>Ticket Types Distribution</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={ticketTypeData}
//               cx="50%"
//               cy="50%"
//               innerRadius={0}
//               outerRadius={100}
//               fill="#8884d8"
//               dataKey="value"
//               label
//             >
//               {ticketTypeData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//         <div className="flex justify-center gap-4 mt-4">
//           {ticketTypeData.map((entry, index) => (
//             <div key={`legend-${index}`} className="flex items-center gap-2">
//               <span
//                 className="w-4 h-4 rounded-full"
//                 style={{ backgroundColor: COLORS[index % COLORS.length] }}
//               />
//               <span className="text-sm text-gray-700">{entry.name}</span>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//       </div>
//     </div>
//   );
// };

// export default Analytics;





// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// import { Users, Ticket, Clock, Star } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

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

// const Analytics: React.FC = () => {
//   const { user } = useAuth();
//   const [selectedPeriod, setSelectedPeriod] = useState('all');
//   const [ticketTypePeriod, setTicketTypePeriod] = useState('all');

//   // Mock ticket data
//   const tickets: Ticket[] = [
//     { id: '1', title: 'Server Downtime', description: 'Server offline issue', priority: 'high', status: 'closed', createdAt: '2025-07-10T10:00:00Z', updatedAt: '2025-07-20T12:00:00Z', client: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Server restarted and firmware updated.', feedback: { experience: 'Quick resolution', rating: 4, savedTime: true, timeAmount: '2 hours' }, ticketType: 'RS1' },
//     { id: '2', title: 'Login Failure', description: 'User authentication error', priority: 'medium', status: 'closed', createdAt: '2025-07-12T09:00:00Z', updatedAt: '2025-07-18T15:00:00Z', client: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Updated authentication module.', feedback: { experience: 'Satisfactory', rating: 3, savedTime: false, timeAmount: '' }, ticketType: 'RS2' },
//     { id: '3', title: 'HMI Connectivity', description: 'HMI not connecting', priority: 'low', status: 'closed', createdAt: '2025-07-08T08:00:00Z', updatedAt: '2025-07-15T14:00:00Z', client: 'SAIL', adminClosed: true, clientClosed: true, adminSummary: 'Reconfigured network settings.', feedback: { experience: 'Excellent support', rating: 5, savedTime: true, timeAmount: '24 hours' }, ticketType: 'RS3-1' },
//     { id: '4', title: 'PLC Error', description: 'PLC fault code 0x81', priority: 'high', status: 'resolved', createdAt: '2025-07-14T11:00:00Z', updatedAt: '2025-07-14T11:00:00Z', client: 'JSPL', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, ticketType: 'RS3-2' },
//   ];

//   if (user?.role !== 'admin') {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
//         <p className="text-blue-600 mt-2">This page is only accessible to administrators.</p>
//       </div>
//     );
//   }

//   // Calculate total time saved per client
//   const timeSavedData = tickets
//     .filter((ticket) => ticket.status === 'closed' && ticket.feedback?.savedTime && ticket.feedback.timeAmount)
//     .reduce((acc, ticket) => {
//       const timeAmount = ticket.feedback!.timeAmount.toLowerCase();
//       let hours = 0;
//       if (timeAmount.includes('hour')) {
//         hours = parseFloat(timeAmount) || 0;
//       } else if (timeAmount.includes('day')) {
//         hours = (parseFloat(timeAmount) || 0) * 24;
//       }
//       if (!acc[ticket.client]) {
//         acc[ticket.client] = { client: ticket.client, hours };
//       } else {
//         acc[ticket.client].hours += hours;
//       }
//       return acc;
//     }, {} as Record<string, { client: string; hours: number }>);
//   const timeSavedChartData = Object.values(timeSavedData);

//   const totalTimeSaved = timeSavedChartData.reduce((sum, item) => sum + item.hours, 0);

//   // Calculate overall star rating
//   const ratings = tickets
//     .filter((ticket) => ticket.status === 'closed' && ticket.feedback?.rating)
//     .map((ticket) => ticket.feedback!.rating);
//   const overallRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

//   // Calculate average response time
//   const responseTimes = tickets
//     .filter((ticket) => ticket.status === 'closed')
//     .map((ticket) => {
//       const created = new Date(ticket.createdAt).getTime();
//       const resolved = new Date(ticket.updatedAt).getTime();
//       return (resolved - created) / (1000 * 60 * 60); // Convert to hours
//     });
//   const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

//   // Calculate ticket type distribution
//   const ticketTypeData = tickets
//     .filter((ticket) => ticket.status === 'closed')
//     .reduce((acc, ticket) => {
//       acc[ticket.ticketType] = (acc[ticket.ticketType] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);
//   const totalTickets = Object.values(ticketTypeData).reduce((sum, count) => sum + count, 0);
//   const ticketTypeChartData = Object.entries(ticketTypeData).map(([name, value]) => ({
//     name,
//     value: totalTickets > 0 ? (value / totalTickets) * 100 : 0, // Percentage
//   }));

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   // Existing ticket trends and response time data
//   const ticketTrends = [
//     { month: 'Jan', total: 45, resolved: 42, inProgress: 3 },
//     { month: 'Feb', total: 38, resolved: 35, inProgress: 3 },
//     { month: 'Mar', total: 52, resolved: 48, inProgress: 4 },
//     { month: 'Apr', total: 41, resolved: 39, inProgress: 2 },
//     { month: 'May', total: 47, resolved: 44, inProgress: 3 },
//     { month: 'Jun', total: 35, resolved: 33, inProgress: 2 },
//   ];

//   const responseTimeData = [
//     { week: 'Week 1', avgTime: 2.1, target: 2.0 },
//     { week: 'Week 2', avgTime: 2.8, target: 2.0 },
//     { week: 'Week 3', avgTime: 1.9, target: 2.0 },
//     { week: 'Week 4', avgTime: 2.3, target: 2.0 },
//   ];

//   return (
//     <div className="container mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6">
//         <div>
//           <h1 className="text-3xl font-bold text-blue-900">Admin Analytics</h1>
//           <p className="text-blue-600 mt-2">Comprehensive analytics and insights for all clients</p>
//         </div>
//         <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
//           <SelectTrigger className="w-40 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
//             <SelectValue placeholder="Select period" />
//           </SelectTrigger>
//           <SelectContent className="border-blue-200">
//             <SelectItem value="all">All Time</SelectItem>
//             <SelectItem value="monthly">Monthly</SelectItem>
//             <SelectItem value="quarterly">Quarterly</SelectItem>
//             <SelectItem value="yearly">Yearly</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{averageResponseTime.toFixed(1)}h</p>
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
//                 <p className="text-3xl font-semibold text-blue-900 mt-1">{tickets.length}</p>
//               </div>
//               <Ticket className="h-10 w-10 text-green-600 bg-green-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardHeader>
//             <CardTitle className="text-blue-900">Time Saved by Client</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={timeSavedChartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="client" />
//                 <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
//                 <Tooltip />
//                 <Bar dataKey="hours" fill="#3B82F6" name="Time Saved" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardHeader>
//             <CardTitle className="text-blue-900">Ticket Type Distribution</CardTitle>
//             <Select value={ticketTypePeriod} onValueChange={setTicketTypePeriod}>
//               <SelectTrigger className="w-40 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
//                 <SelectValue placeholder="Select period" />
//               </SelectTrigger>
//               <SelectContent className="border-blue-200">
//                 <SelectItem value="all">All Time</SelectItem>
//                 <SelectItem value="monthly">Monthly</SelectItem>
//                 <SelectItem value="quarterly">Quarterly</SelectItem>
//                 <SelectItem value="yearly">Yearly</SelectItem>
//               </SelectContent>
//             </Select>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={ticketTypeChartData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={0}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
//                 >
//                   {ticketTypeChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="flex justify-center gap-4 mt-4">
//               {ticketTypeChartData.map((entry, index) => (
//                 <div key={`legend-${index}`} className="flex items-center gap-2">
//                   <span
//                     className="w-4 h-4 rounded-full"
//                     style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                   />
//                   <span className="text-sm text-blue-700">{entry.name}</span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardHeader>
//             <CardTitle className="text-blue-900">Ticket Trends</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={ticketTrends}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
//                 <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
//           <CardHeader>
//             <CardTitle className="text-blue-900">Response Time vs Target</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={responseTimeData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="week" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" strokeWidth= '2' name="Actual" />
//                 <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" name="Target" />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Analytics;








'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Clock, Star, TicketIcon, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Ticket } from '@/types';

const AdminAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all tickets for admin
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
        <p className="text-blue-600 mt-2">This page is only accessible to admins.</p>
      </div>
    );
  }

  // Filter tickets by date range
  const filteredTickets = tickets.filter((ticket) => {
    if (!dateRange.start || !dateRange.end) return true;
    const created = new Date(ticket.createdAt).getTime();
    const start = new Date(dateRange.start).getTime();
    const end = new Date(dateRange.end).getTime();
    return created >= start && created <= end;
  });

  // Calculate total time saved
  const timeSavedData = filteredTickets
    .filter((ticket) => ticket.close_ticket?.time_saved != null)
    .map((ticket) => ({
      ticketId: ticket.ticket_id,
      title: ticket.issue_title,
      hours: ticket.close_ticket?.time_saved || 0,
      client: ticket.client.client_username,
    }));
  const totalTimeSaved = timeSavedData.reduce((sum, item) => sum + item.hours, 0);

  // Calculate overall rating
  const ratings = filteredTickets
    .filter((ticket) => ticket.close_ticket?.rating != null)
    .map((ticket) => ticket.close_ticket?.rating || 0);
  const overallRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

  // Calculate average response time
  const responseTimes = filteredTickets
    .filter((ticket) => ticket.status === 'closed' && ticket.closed_at)
    .map((ticket) => {
      const created = new Date(ticket.createdAt).getTime();
      const closed = new Date(ticket.closed_at!).getTime();
      return (closed - created) / (1000 * 60 * 60); // Convert to hours
    });
  const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

  // Calculate total tickets
  const totalTickets = filteredTickets.length;

  // Calculate response time vs target (72 hours)
  const targetResponseTime = 72; // 72 hours
  const closedTickets = filteredTickets.filter((t) => t.status === 'closed' && t.closed_at);
  const withinTarget = closedTickets.filter((ticket) => {
    const created = new Date(ticket.createdAt).getTime();
    const closed = new Date(ticket.closed_at!).getTime();
    const responseTime = (closed - created) / (1000 * 60 * 60);
    return responseTime <= targetResponseTime;
  }).length;
  const responseTimeVsTarget = closedTickets.length > 0 ? (withinTarget / closedTickets.length) * 100 : 0;
  const responseTimeVsTargetData = [
    { name: 'Within Target (≤72h)', value: responseTimeVsTarget, count: withinTarget },
    { name: 'Beyond Target (>72h)', value: 100 - responseTimeVsTarget, count: closedTickets.length - withinTarget },
  ];

  // Calculate time saved by client
  const timeSavedByClient = filteredTickets
    .filter((ticket) => ticket.close_ticket?.time_saved != null)
    .reduce((acc, ticket) => {
      const client = ticket.client.client_username;
      acc[client] = (acc[client] || 0) + (ticket.close_ticket?.time_saved || 0);
      return acc;
    }, {} as { [key: string]: number });
  const timeSavedByClientData = Object.entries(timeSavedByClient).map(([client, hours]) => ({
    client,
    hours,
  }));

  // Calculate ticket trends (by month)
  const ticketTrends = filteredTickets.reduce((acc, ticket) => {
    const date = new Date(ticket.createdAt);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  const ticketTrendsData = Object.entries(ticketTrends)
    .map(([monthYear, count]) => ({
      month: monthYear,
      tickets: count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Export data as CSV
  const exportToCSV = () => {
    const headers = [
      'Ticket ID',
      'Title',
      'Client',
      'Time Saved (Hours)',
      'Rating',
      'Response Time (Hours)',
      'Ticket Type',
      'Status',
      'Created At',
    ];
    const rows = filteredTickets.map((ticket) => {
      const timeSaved = ticket.close_ticket?.time_saved || 0;
      const rating = ticket.close_ticket?.rating || 'N/A';
      const responseTime = ticket.status === 'closed' && ticket.closed_at
        ? (new Date(ticket.closed_at).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60)
        : 0;
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
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `admin_analytics_${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1 className="text-3xl font-bold text-blue-900">Admin Analytics</h1>
          <p className="text-blue-600 mt-2">Overall insights for all client support tickets</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-500 font-medium">Total Time Saved</p>
                <p className="text-3xl font-semibold text-blue-900 mt-1">{totalTimeSaved.toFixed(1)} h</p>
              </div>
              <Clock className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-500 font-medium">Overall Rating</p>
                <p className="text-3xl font-semibold text-blue-900 mt-1">{overallRating.toFixed(1)}</p>
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

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-500 font-medium">Total Tickets</p>
                <p className="text-3xl font-semibold text-blue-900 mt-1">{totalTickets}</p>
              </div>
              <TicketIcon className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Response Time vs Target (72h)</CardTitle>
          </CardHeader>
          <CardContent>
            {responseTimeVsTargetData[0].value > 0 || responseTimeVsTargetData[1].value > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={responseTimeVsTargetData}
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
                    {responseTimeVsTargetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-blue-600 py-8">
                <p>No closed tickets found in the selected date range.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Time Saved by Client</CardTitle>
          </CardHeader>
          <CardContent>
            {timeSavedByClientData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeSavedByClientData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="client" angle={0} textAnchor="middle" height={80} tick={{ fill: '#1E3A8A', fontSize: 12 }} />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#1E3A8A' }} tick={{ fill: '#1E3A8A' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1E3A8A' }} />
                  <Bar dataKey="hours" fill="#3B82F6" name="Time Saved" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-blue-600 py-8">
                <p>No time-saving data available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Ticket Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {ticketTrendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fill: '#1E3A8A', fontSize: 12 }} />
                  <YAxis label={{ value: 'Tickets', angle: -90, position: 'insideLeft', fill: '#1E3A8A' }} tick={{ fill: '#1E3A8A' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#1E3A8A' }} />
                  <Bar dataKey="tickets" fill="#10B981" name="Tickets Created" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-blue-600 py-8">
                <p>No tickets found in the selected date range.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;