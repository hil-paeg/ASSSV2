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



import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Ticket, Clock, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [ticketTypePeriod, setTicketTypePeriod] = useState('all');

  // Mock ticket data
  const tickets: Ticket[] = [
    { id: '1', title: 'Server Downtime', description: 'Server offline issue', priority: 'high', status: 'closed', createdAt: '2025-07-10T10:00:00Z', updatedAt: '2025-07-20T12:00:00Z', client: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Server restarted and firmware updated.', feedback: { experience: 'Quick resolution', rating: 4, savedTime: true, timeAmount: '2 hours' }, ticketType: 'RS1' },
    { id: '2', title: 'Login Failure', description: 'User authentication error', priority: 'medium', status: 'closed', createdAt: '2025-07-12T09:00:00Z', updatedAt: '2025-07-18T15:00:00Z', client: 'AMNSI', adminClosed: true, clientClosed: true, adminSummary: 'Updated authentication module.', feedback: { experience: 'Satisfactory', rating: 3, savedTime: false, timeAmount: '' }, ticketType: 'RS2' },
    { id: '3', title: 'HMI Connectivity', description: 'HMI not connecting', priority: 'low', status: 'closed', createdAt: '2025-07-08T08:00:00Z', updatedAt: '2025-07-15T14:00:00Z', client: 'SAIL', adminClosed: true, clientClosed: true, adminSummary: 'Reconfigured network settings.', feedback: { experience: 'Excellent support', rating: 5, savedTime: true, timeAmount: '24 hours' }, ticketType: 'RS3-1' },
    { id: '4', title: 'PLC Error', description: 'PLC fault code 0x81', priority: 'high', status: 'resolved', createdAt: '2025-07-14T11:00:00Z', updatedAt: '2025-07-14T11:00:00Z', client: 'JSPL', adminClosed: false, clientClosed: false, adminSummary: '', feedback: null, ticketType: 'RS3-2' },
  ];

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
        <p className="text-blue-600 mt-2">This page is only accessible to administrators.</p>
      </div>
    );
  }

  // Calculate total time saved per client
  const timeSavedData = tickets
    .filter((ticket) => ticket.status === 'closed' && ticket.feedback?.savedTime && ticket.feedback.timeAmount)
    .reduce((acc, ticket) => {
      const timeAmount = ticket.feedback!.timeAmount.toLowerCase();
      let hours = 0;
      if (timeAmount.includes('hour')) {
        hours = parseFloat(timeAmount) || 0;
      } else if (timeAmount.includes('day')) {
        hours = (parseFloat(timeAmount) || 0) * 24;
      }
      if (!acc[ticket.client]) {
        acc[ticket.client] = { client: ticket.client, hours };
      } else {
        acc[ticket.client].hours += hours;
      }
      return acc;
    }, {} as Record<string, { client: string; hours: number }>);
  const timeSavedChartData = Object.values(timeSavedData);

  const totalTimeSaved = timeSavedChartData.reduce((sum, item) => sum + item.hours, 0);

  // Calculate overall star rating
  const ratings = tickets
    .filter((ticket) => ticket.status === 'closed' && ticket.feedback?.rating)
    .map((ticket) => ticket.feedback!.rating);
  const overallRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

  // Calculate average response time
  const responseTimes = tickets
    .filter((ticket) => ticket.status === 'closed')
    .map((ticket) => {
      const created = new Date(ticket.createdAt).getTime();
      const resolved = new Date(ticket.updatedAt).getTime();
      return (resolved - created) / (1000 * 60 * 60); // Convert to hours
    });
  const averageResponseTime = responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

  // Calculate ticket type distribution
  const ticketTypeData = tickets
    .filter((ticket) => ticket.status === 'closed')
    .reduce((acc, ticket) => {
      acc[ticket.ticketType] = (acc[ticket.ticketType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const totalTickets = Object.values(ticketTypeData).reduce((sum, count) => sum + count, 0);
  const ticketTypeChartData = Object.entries(ticketTypeData).map(([name, value]) => ({
    name,
    value: totalTickets > 0 ? (value / totalTickets) * 100 : 0, // Percentage
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Existing ticket trends and response time data
  const ticketTrends = [
    { month: 'Jan', total: 45, resolved: 42, inProgress: 3 },
    { month: 'Feb', total: 38, resolved: 35, inProgress: 3 },
    { month: 'Mar', total: 52, resolved: 48, inProgress: 4 },
    { month: 'Apr', total: 41, resolved: 39, inProgress: 2 },
    { month: 'May', total: 47, resolved: 44, inProgress: 3 },
    { month: 'Jun', total: 35, resolved: 33, inProgress: 2 },
  ];

  const responseTimeData = [
    { week: 'Week 1', avgTime: 2.1, target: 2.0 },
    { week: 'Week 2', avgTime: 2.8, target: 2.0 },
    { week: 'Week 3', avgTime: 1.9, target: 2.0 },
    { week: 'Week 4', avgTime: 2.3, target: 2.0 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Admin Analytics</h1>
          <p className="text-blue-600 mt-2">Comprehensive analytics and insights for all clients</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="border-blue-200">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-500 font-medium">Total Time Saved</p>
                <p className="text-3xl font-semibold text-blue-900 mt-1">{totalTimeSaved.toFixed(1)}h</p>
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
                <p className="text-3xl font-semibold text-blue-900 mt-1">{averageResponseTime.toFixed(1)}h</p>
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
                <p className="text-3xl font-semibold text-blue-900 mt-1">{tickets.length}</p>
              </div>
              <Ticket className="h-10 w-10 text-green-600 bg-green-100 p-2 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Time Saved by Client</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSavedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="client" />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="hours" fill="#3B82F6" name="Time Saved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Ticket Type Distribution</CardTitle>
            <Select value={ticketTypePeriod} onValueChange={setTicketTypePeriod}>
              <SelectTrigger className="w-40 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-md">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="border-blue-200">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketTypeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  {ticketTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {ticketTypeChartData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-blue-700">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Ticket Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-blue-900">Response Time vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" strokeWidth= '2' name="Actual" />
                <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;