// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Users, Calendar, Plus, Clock, AlertTriangle, Ticket, User } from 'lucide-react';
// import AdminCalendar from '@/components/Calendar/AdminCalendar';
// import UserDetailsModal from '@/components/Admin/UserDetailsModal';
// import { Badge } from '@/components/ui/badge';

// const AdminDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('calendar'); // Default to 'calendar'
//   const [showCreateUserForm, setShowCreateUserForm] = useState(false);
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [selectedUserDetails, setSelectedUserDetails] = useState(null);

//   // Mock data for users
//   const allUsers = [
//     { id: '1', name: 'John Doe', email: 'john@example.com', company: 'Tech Corp', ticketsRemaining: 5, status: 'active', lastActivity: '2025-07-15' },
//     { id: '2', name: 'Jane Smith', email: 'jane@example.com', company: 'Soft Solutions', ticketsRemaining: 2, status: 'inactive', lastActivity: '2025-07-10' },
//   ];

//   // Mock admin data
//   const overallStats = {
//     totalUsers: 45,
//     totalTickets: 287,
//     avgResponseTime: 2.4,
//     expiringSoon: 8,
//   };

//   const getStatusBadge = (status: string) => {
//     const variant = status === 'active' ? 'success' : 'destructive';
//     return <Badge >{status}</Badge>;
//   };

//   const handleUserClick = (user: any) => {
//     setSelectedUserDetails(user);
//     setIsUserModalOpen(true);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
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


//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Management Center</CardTitle>
//             <div className="flex gap-2">
              
//               <Button
//                 variant={activeTab === 'calendar' ? 'default' : 'outline'}
//                 onClick={() => setActiveTab('calendar')}
//                 className="flex items-center gap-2"
//               >
//                 <Calendar className="h-4 w-4" />
//                 Calendar
//               </Button>
//               <Button
//                 variant={activeTab === 'users' ? 'default' : 'outline'}
//                 onClick={() => setActiveTab('users')}
//                 className="flex items-center gap-2"
//               >
//                 <Users className="h-4 w-4" />
//                 Users
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {activeTab === 'calendar' ? (
//             <div>
             
//               {showCreateUserForm ? (
//                 <AdminCalendar /> // Placeholder for create event form
//               ) : (
//                 <AdminCalendar /> // Default calendar view
//               )}
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {allUsers.map((user) => (
//                 <div
//                   key={user.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
//                   onClick={() => handleUserClick(user)}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <User className="h-5 w-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-medium">{user.name}</h4>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                       <p className="text-sm text-gray-500">{user.company}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-8">
//                     <div className="text-center">
//                       <p className="text-sm text-gray-500">Tickets Used</p>
//                       <p className="font-medium">{12 - user.ticketsRemaining}/12</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-sm text-gray-500">Remaining</p>
//                       <p className="font-medium">{user.ticketsRemaining}</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-sm text-gray-500">Last Activity</p>
//                       <p className="font-medium">{new Date(user.lastActivity).toLocaleDateString()}</p>
//                     </div>
//                     <div>
//                       {getStatusBadge(user.status)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* User Details Modal */}
//       <UserDetailsModal
//         isOpen={isUserModalOpen}
//         onClose={() => setIsUserModalOpen(false)}
//         user={selectedUserDetails}
//       />
//     </div>
//   );
// };

// export default AdminDashboard;



// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Users, Calendar, Plus, Clock, AlertTriangle, Ticket, User } from 'lucide-react';
// import AdminCalendar from '@/components/Calendar/AdminCalendar';
// import UserDetailsModal from '@/components/Admin/UserDetailsModal';
// import { Badge } from '@/components/ui/badge';

// const AdminDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('calendar'); // Default to 'calendar'
//   const [showCreateUserForm, setShowCreateUserForm] = useState(false);
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [selectedUserDetails, setSelectedUserDetails] = useState(null);

//   // Mock data for users
//   const allUsers = [
//     { id: '1', name: 'John Doe', email: 'john@example.com', company: 'Tech Corp', ticketsRemaining: 5, status: 'active', lastActivity: '2025-07-15' },
//     { id: '2', name: 'Jane Smith', email: 'jane@example.com', company: 'Soft Solutions', ticketsRemaining: 2, status: 'inactive', lastActivity: '2025-07-10' },
//   ];

//   // Mock admin data
//   const overallStats = {
//     totalUsers: 45,
//     totalTickets: 287,
//     avgResponseTime: 2.4,
//     expiringSoon: 8,
//   };

//   // Mock recent ticket activity data (updated with current date)
//   const recentTicketActivity = [
//     { id: 'T001', title: 'Server Down Issue', status: 'in-progress', time: '11:30 AM', customer: 'John Doe', priority: 'high' },
//     { id: 'T002', title: 'Login Error', status: 'resolved', time: '10:45 AM', customer: 'Jane Smith', priority: 'medium' },
//     { id: 'T003', title: 'Database Sync', status: 'raised', time: '09:15 AM', customer: 'John Doe', priority: 'low' },
//     { id: 'T004', title: 'Network Delay', status: 'in-progress', time: '11:00 AM', customer: 'Jane Smith', priority: 'high' }, // Added for more data
//   ];

//   const getStatusBadge = (status: string) => {
//     const variant = status === 'active' || status === 'resolved' ? 'success' : status === 'in-progress' ? 'warning' : 'destructive';
//     return <Badge variant={variant as any}>{status}</Badge>;
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 text-red-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'low': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const handleTicketClick = (ticket: any) => {
//     setSelectedUserDetails(ticket); // Assuming UserDetailsModal can handle ticket details
//     setIsUserModalOpen(true);
//   };

//   function handleUserClick(user: { id: string; name: string; email: string; company: string; ticketsRemaining: number; status: string; lastActivity: string; }): void {
//     throw new Error('Function not implemented.');
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//         </div>
//       </div>

//       {/* Overview Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//         {/* Total Users */}
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Total Users</p>
//                 <p className="text-3xl font-semibold text-gray-800 mt-1">
//                   {overallStats.totalUsers}
//                 </p>
//               </div>
//               <Users className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Total Tickets */}
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Total Tickets</p>
//                 <p className="text-3xl font-semibold text-gray-800 mt-1">
//                   {overallStats.totalTickets}
//                 </p>
//               </div>
//               <Ticket className="h-10 w-10 text-green-600 bg-green-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Average Response */}
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Avg Response</p>
//                 <p className="text-3xl font-semibold text-gray-800 mt-1">
//                   {overallStats.avgResponseTime}h
//                 </p>
//               </div>
//               <Clock className="h-10 w-10 text-yellow-600 bg-yellow-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Expiring Soon */}
//         <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Expiring Soon</p>
//                 <p className="text-3xl font-semibold text-gray-800 mt-1">
//                   {overallStats.expiringSoon}
//                 </p>
//               </div>
//               <AlertTriangle className="h-10 w-10 text-red-600 bg-red-100 p-2 rounded-full" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Management Center</CardTitle>
//             <div className="flex gap-2">
//               <Button
//                 variant={activeTab === 'calendar' ? 'default' : 'outline'}
//                 onClick={() => setActiveTab('calendar')}
//                 className="flex items-center gap-2"
//               >
//                 <Calendar className="h-4 w-4" />
//                 Calendar
//               </Button>
//               <Button
//                 variant={activeTab === 'users' ? 'default' : 'outline'}
//                 onClick={() => setActiveTab('users')}
//                 className="flex items-center gap-2"
//               >
//                 <Users className="h-4 w-4" />
//                 Users
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {activeTab === 'calendar' ? (
//             <div>
//               {showCreateUserForm ? (
//                 <AdminCalendar /> // Placeholder for create event form
//               ) : (
//                 <AdminCalendar /> // Default calendar view
//               )}
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {allUsers.map((user) => (
//                 <div
//                   key={user.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
//                   onClick={() => handleUserClick(user)}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <User className="h-5 w-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-medium">{user.name}</h4>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                       <p className="text-sm text-gray-500">{user.company}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-8">
//                     <div className="text-center">
//                       <p className="text-sm text-gray-500">Tickets Used</p>
//                       <p className="font-medium">{12 - user.ticketsRemaining}/12</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-sm text-gray-500">Remaining</p>
//                       <p className="font-medium">{user.ticketsRemaining}</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-sm text-gray-500">Last Activity</p>
//                       <p className="font-medium">{new Date(user.lastActivity).toLocaleDateString()}</p>
//                     </div>
//                     <div>
//                       {getStatusBadge(user.status)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Recent Ticket Activity Section */}
//       {activeTab === 'calendar' && (
//         <Card className="border border-gray-200 shadow-md">
//           <CardHeader>
//             <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//               <Ticket className="h-5 w-5 text-blue-600" />
//               Recent Ticket Activity
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto whitespace-nowrap pb-4">
//               {recentTicketActivity.map((ticket, index) => (
//                 <div
//                   key={ticket.id}
//                   className="inline-block w-72 p-4 bg-white border-l-4 border-blue-500 rounded-r-lg mr-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
//                   style={{ borderLeftColor: getPriorityColor(ticket.priority).split(' ')[0] }}
//                   onClick={() => handleTicketClick(ticket)}
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <h4 className="text-md font-medium text-gray-800">{ticket.title}</h4>
//                     <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority.toUpperCase()}</Badge>
//                   </div>
//                   <p className="text-sm text-gray-600">Customer: {ticket.customer}</p>
//                   <p className="text-sm text-gray-500">Time: {ticket.time} IST, {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
//                   <div className="mt-2">{getStatusBadge(ticket.status)}</div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* User Details Modal */}
//       <UserDetailsModal
//         isOpen={isUserModalOpen}
//         onClose={() => setIsUserModalOpen(false)}
//         user={selectedUserDetails}
//       />
//     </div>
//   );
// };

// export default AdminDashboard;







// import React, { useState, Component, ErrorInfo } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Users, Calendar, Plus, Clock, AlertTriangle, Ticket, User } from 'lucide-react';
// import AdminCalendar from '@/components/Calendar/AdminCalendar';
// import UserDetailsModal from '@/components/Admin/UserDetailsModal';
// import { Badge } from '@/components/ui/badge';

// class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error; errorInfo?: string }> {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
//     console.error('Error caught by boundary:', error, errorInfo.componentStack);
//     this.setState({ errorInfo: error.message + '\n' + errorInfo.componentStack });
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
//           <h2 className="text-lg font-semibold">Something went wrong.</h2>
//           <p>Please try refreshing the page or contact support if the issue persists.</p>
//           {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
//             <pre className="mt-2 text-sm text-gray-800 bg-gray-100 p-2 rounded">{this.state.errorInfo}</pre>
//           )}
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const AdminDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('calendar');
//   const [showCreateUserForm, setShowCreateUserForm] = useState(false);
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);

//   const allUsers = [
//     { id: '1', name: 'Mr. Saxena', email: 'john@example.com', company: 'URJA', ticketsRemaining: 5, status: 'active', lastActivity: '2025-07-15' },
//     { id: '2', name: 'Mr. Rakesh', email: 'jane@example.com', company: 'AMNSI', ticketsRemaining: 2, status: 'active', lastActivity: '2025-07-10' },
//     { id: '3', name: 'Mr. Suren', email: 'jane@example.com', company: 'SAIL', ticketsRemaining: 2, status: 'active', lastActivity: '2025-07-10' },
//     { id: '4', name: 'Mr. Rakesh', email: 'jane@example.com', company: 'JSPL', ticketsRemaining: 2, status: 'inactive', lastActivity: '2025-07-10' },

//   ];

//   const overallStats = {
//     totalUsers: 4,
//     totalTickets: 67,
//     avgResponseTime: 2.4,
//     expiringSoon: 1,
//   };

//   const recentTicketActivity = [
//     {
//       id: 'T001',
//       title: 'Server Down Issue',
//       customer: 'John Doe',
//       events: [
//         { type: 'raised', start: '2025-07-21 09:00 AM IST', end: '2025-07-21 09:10 AM IST', description: 'Ticket raised by customer' },
//         { type: 'oemConfirmed', start: '2025-07-21 09:05 AM IST', end: '2025-07-21 09:15 AM IST', description: 'Confirmed by OEM' },
//         { type: 'commentAdded', start: '2025-07-21 11:00 AM IST', end: '2025-07-21 11:15 AM IST', description: 'Comment: Awaiting resolution' },
//       ],
//       priority: 'high',
//     },
//     {
//       id: 'T002',
//       title: 'Login Error',
//       customer: 'Jane Smith',
//       events: [
//         { type: 'raised', start: '2025-07-21 08:30 AM IST', end: '2025-07-21 08:15 AM IST', description: 'Ticket raised by customer' },
//         { type: 'oemConfirmed', start: '2025-07-21 09:45 AM IST', end: '2025-07-21 10:00 AM IST', description: 'Confirmed by OEM' },
//         { type: 'commentAdded', start: '2025-07-21 11:40 AM IST', end: '2025-07-21 11:45 AM IST', description: 'Comment: Fixed login issue' },
//       ],
//       priority: 'medium',
//     },
//     {
//       id: 'T003',
//       title: 'Database Sync',
//       customer: 'John Doe',
//       events: [
//         { type: 'raised', start: '2025-07-21 06:00 PM IST', end: '2025-07-21 06:15 PM IST', description: 'Ticket raised by customer' },
//         { type: 'oemConfirmed', start: '2025-07-21 07:20 PM IST', end: '2025-07-21 07:30 PM IST', description: 'Confirmed by OEM' },

//       ],
//       priority: 'low',
//     },
//   ];

//   const getStatusBadge = (status: string) => {
//     const variant = status === 'active' || status === 'resolved' ? 'success' : status === 'in-progress' ? 'warning' : 'destructive';
//     return <Badge variant={variant as any}>{status}</Badge>;
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 text-red-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'low': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const handleTicketClick = (ticket: any) => {
//     setSelectedTicketDetails(ticket);
//     setIsUserModalOpen(true);
//   };

//   const getMinutesFromMidnight = (timeStr: string | undefined): number => {
//     if (!timeStr) {
//       console.warn('Invalid time string:', timeStr);
//       return 0;
//     }
//     const [, timePart] = timeStr.split(' ');
//     if (!timePart) {
//       console.warn('No time part found in:', timeStr);
//       return 0;
//     }
//     const [hours, minutes] = timePart.split(':').map(Number);
//     const isPM = timePart.includes('PM');
//     const totalHours = hours + (isPM && hours !== 12 ? 12 : hours === 12 && !isPM ? -12 : 0);
//     return totalHours * 60 + minutes;
//   };

//   return (
//     <ErrorBoundary>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//           <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium">Total Users</p>
//                   <p className="text-3xl font-semibold text-gray-800 mt-1">
//                     {overallStats.totalUsers}
//                   </p>
//                 </div>
//                 <Users className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium">Total Tickets</p>
//                   <p className="text-3xl font-semibold text-gray-800 mt-1">
//                     {overallStats.totalTickets}
//                   </p>
//                 </div>
//                 <Ticket className="h-10 w-10 text-green-600 bg-green-100 p-2 rounded-full" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium">Avg Response</p>
//                   <p className="text-3xl font-semibold text-gray-800 mt-1">
//                     {overallStats.avgResponseTime}h
//                   </p>
//                 </div>
//                 <Clock className="h-10 w-10 text-yellow-600 bg-yellow-100 p-2 rounded-full" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium">Expiring Soon</p>
//                   <p className="text-3xl font-semibold text-gray-800 mt-1">
//                     {overallStats.expiringSoon}
//                   </p>
//                 </div>
//                 <AlertTriangle className="h-10 w-10 text-red-600 bg-red-100 p-2 rounded-full" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle>Management Center</CardTitle>
//               <div className="flex gap-2">
//                 <Button
//                   variant={activeTab === 'calendar' ? 'default' : 'outline'}
//                   onClick={() => setActiveTab('calendar')}
//                   className="flex items-center gap-2"
//                 >
//                   <Calendar className="h-4 w-4" />
//                   Calendar
//                 </Button>
//                 <Button
//                   variant={activeTab === 'users' ? 'default' : 'outline'}
//                   onClick={() => setActiveTab('users')}
//                   className="flex items-center gap-2"
//                 >
//                   <Users className="h-4 w-4" />
//                   Clients
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {activeTab === 'calendar' ? (
//               <div>
//                 {showCreateUserForm ? (
//                   <AdminCalendar />
//                 ) : (
//                   <AdminCalendar />
//                 )}
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {allUsers.map((user) => (
//                   <div
//                     key={user.id}
//                     className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
//                     onClick={() => handleTicketClick(user)}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <User className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <h4 className="font-medium">{user.name}</h4>
//                         <p className="text-sm text-gray-500">{user.email}</p>
//                         <p className="text-sm text-gray-500">{user.company}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-8">
//                       <div className="text-center">
//                         <p className="text-sm text-gray-500">Tickets Used</p>
//                         <p className="font-medium">{12 - user.ticketsRemaining}/12</p>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm text-gray-500">Remaining</p>
//                         <p className="font-medium">{user.ticketsRemaining}</p>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm text-gray-500">Last Activity</p>
//                         <p className="font-medium">{new Date(user.lastActivity).toLocaleDateString()}</p>
//                       </div>
//                       <div>
//                         {getStatusBadge(user.status)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               )}
//             </CardContent>
//           </Card>

//           {activeTab === 'calendar' && (
//             <Card className="border border-gray-200 shadow-md">
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                   <Ticket className="h-5 w-5 text-blue-600" />
//                   Recent Ticket Activity
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="overflow-x-auto">
//                   <div className="min-w-[1200px]">
//                     <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(250px,1fr))] gap-2">
//                       <div className="flex flex-col pt-8">
//                         {Array.from({ length: 13 }, (_, i) => i + 6).map((hour) => (
//                           <div key={hour} className="h-16 border-b border-gray-200 flex items-start pl-2 text-sm text-gray-600 font-medium">
//                             {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
//                           </div>
//                         ))}
//                       </div>
//                       {recentTicketActivity.map((ticket) => {
//                         const eventsByTime = ticket.events.reduce((acc, event, index, arr) => {
//                           const startMinutes = getMinutesFromMidnight(event.start);
//                           const prevEndMinutes = index > 0 ? getMinutesFromMidnight(arr[index - 1].end) : -Infinity;
//                           const isClose = startMinutes - prevEndMinutes < 15;
//                           if (isClose && index > 0) {
//                             acc[acc.length - 1].push(event);
//                           } else {
//                             acc.push([event]);
//                           }
//                           return acc;
//                         }, [] as typeof ticket.events[]);

//                         return (
//                           <div key={ticket.id} className="relative border-l border-gray-200 min-h-[832px] pt-8">
//                             {eventsByTime.map((eventGroup, groupIndex) => {
//                               const firstEvent = eventGroup[0];
//                               const startMinutes = getMinutesFromMidnight(firstEvent.start);
//                               const endMinutes = Math.max(...eventGroup.map(e => getMinutesFromMidnight(e.end)));
//                               const top = ((startMinutes - 360) / 60) * 64;
//                               const height = Math.max(((endMinutes - startMinutes) / 60) * 64, 48);

//                               return (
//                                 <div
//                                   key={`${ticket.id}-group-${groupIndex}`}
//                                   className="absolute left-1 right-1"
//                                   style={{
//                                     top: `${Math.max(top, 0)}px`,
//                                     height: `${height}px`,
//                                   }}
//                                 >
//                                   <div className="flex gap-1 h-full">
//                                     {eventGroup.map((event, index) => (
//                                       <div
//                                         key={`${ticket.id}-${event.type}-${index}`}
//                                         className="flex-1 min-w-0 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-3 text-sm text-gray-700 hover:bg-blue-100 transition-colors cursor-pointer shadow-sm"
//                                         style={{
//                                           flex: `1 1 ${100 / Math.min(eventGroup.length, 4)}%`,
//                                           maxWidth: eventGroup.length > 1 ? `${100 / Math.min(eventGroup.length, 4)}%` : '100%',
//                                         }}
//                                         onClick={() => handleTicketClick(ticket)}
//                                       >
//                                         <div className="font-semibold truncate">{ticket.title}</div>
//                                         <div className="text-xs font-medium text-gray-600">
//                                           {event.type.replace(/([A-Z])/g, ' $1').trim()}
//                                         </div>
//                                         <div className="text-xs text-gray-500 truncate">
//                                           {event.start.split(' ')[1]} - {event.end.split(' ')[1]}
//                                         </div>
//                                         <div className="text-xs text-gray-600 truncate">{event.description}</div>
//                                         {event.type === 'raised' && (
//                                           <Badge className={`mt-1 ${getPriorityColor(ticket.priority)}`}>
//                                             {ticket.priority.toUpperCase()}
//                                           </Badge>
//                                         )}
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           <UserDetailsModal
//             isOpen={isUserModalOpen}
//             onClose={() => setIsUserModalOpen(false)}
//             user={selectedTicketDetails}
//           />
//         </div>
//       </ErrorBoundary>
//     );
//   };

// export default AdminDashboard;



//      {activeTab === 'calendar' && (
//   <Card className="border border-gray-200 shadow-md">
//     <CardHeader>
//       <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//         <Ticket className="h-5 w-5 text-blue-600" />
//         Recent Ticket Activity
//       </CardTitle>
//     </CardHeader>
//     <CardContent>
//       <div className="overflow-x-auto">
//         <div className="min-w-[1000px]">
//           <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(200px,1fr))] gap-4">
//             {/* Time Column */}
//             <div className="flex flex-col pt-4">
//               {Array.from({ length: 13 }, (_, i) => i + 6).map((hour) => (
//                 <div key={hour} className="h-16 border-b border-gray-200 flex items-start pl-2 text-sm text-gray-500">
//                   {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
//                 </div>
//               ))}
//             </div>

//             {/* Events Columns */}
//             {recentTicketActivity.map((ticket, ticketIndex) => {
//               const eventsByTime = ticket.events.reduce((acc, event, index, arr) => {
//                 const startMinutes = getMinutesFromMidnight(event.start);
//                 const prevEndMinutes = index > 0 ? getMinutesFromMidnight(arr[index - 1].end) : -Infinity;
//                 const isClose = startMinutes - prevEndMinutes < 15;
//                 if (isClose && index > 0) {
//                   acc[acc.length - 1].push(event);
//                 } else {
//                   acc.push([event]);
//                 }
//                 return acc;
//               }, [] as typeof ticket.events[]);

//               return (
//                 <div key={ticket.id} className="relative border-l border-gray-100 min-h-[832px] pt-4">
//                   {eventsByTime.map((eventGroup, groupIndex) => {
//                     const firstEvent = eventGroup[0];
//                     const startMinutes = getMinutesFromMidnight(firstEvent.start);
//                     const endMinutes = Math.max(...eventGroup.map(e => getMinutesFromMidnight(e.end)));

//                     const top = ((startMinutes - 360) / 60) * 64; // 64px per hour (16px per 15 min)
//                     const height = ((endMinutes - startMinutes) / 60) * 64;

//                     return (
//                       <div
//                         key={`${ticket.id}-group-${groupIndex}`}
//                         className="absolute left-2 right-2"
//                         style={{
//                           top: `${top}px`,
//                           height: `${Math.max(height, 24)}px`, // ensure minimum height
//                         }}
//                       >
//                         <div className="flex gap-2 h-full">
//                           {eventGroup.map((event, index) => (
//                             <div
//                               key={`${ticket.id}-${event.type}-${index}`}
//                               className="bg-blue-100 border-l-4 border-blue-500 rounded-r p-2 text-sm text-gray-700 w-full hover:bg-blue-200 transition-colors cursor-pointer"
//                               onClick={() => handleTicketClick(ticket)}
//                             >
//                               <div className="font-medium truncate">
//                                 {event.type.replace(/([A-Z])/g, ' $1').trim()}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {event.start} - {event.end}
//                               </div>
//                               <div className="text-xs truncate">{event.description}</div>
//                               {event.type === 'raised' && (
//                                 <Badge className={getPriorityColor(ticket.priority)}>
//                                   {ticket.priority.toUpperCase()}
//                                 </Badge>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// )}






// import React, { useState, useEffect, useContext } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Users, Calendar, Clock, AlertTriangle, Ticket, User } from 'lucide-react';
// import AdminCalendar from '@/components/Calendar/AdminCalendar';
// import UserDetailsModal from '@/components/Admin/UserDetailsModal';
// import { Badge } from '@/components/ui/badge';
// import { useAuth } from '@/contexts/AuthContext';

// interface ErrorBoundaryProps {
//   children: React.ReactNode;
// }

// interface ErrorBoundaryState {
//   hasError: boolean;
//   error?: Error;
//   errorInfo?: string;
// }

// class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   constructor(props: ErrorBoundaryProps) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error('Error caught by boundary:', error, errorInfo.componentStack);
//     this.setState({ errorInfo: error.message + '\n' + errorInfo.componentStack });
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
//           <h2 className="text-lg font-semibold">Something went wrong.</h2>
//           <p>Please try refreshing the page or contact support if the issue persists.</p>
//           {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
//             <pre className="mt-2 text-sm text-gray-800 bg-gray-100 p-2 rounded">{this.state.errorInfo}</pre>
//           )}
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// interface Client {
//   client_id: number;
//   client_username: string;
//   name: string;
//   start_date: string;
//   tickets: { ticket_id: number; created_at: string }[];
// }

// interface Ticket {
//   ticket_id: number;
//   client_id: number;
//   issue_title: string;
//   priority: string | null;
//   status: string;
//   created_at: string;
//   closed_at: string | null;
//   client: { client_username: string };
// }

// interface OverallStats {
//   totalUsers: number;
//   totalTickets: number;
//   avgResponseTime: number;
//   expiringSoon: number;
// }

// const AdminDashboard: React.FC = () => {
//   const { user, isLoading: authLoading } = useAuth();
//   const [activeTab, setActiveTab] = useState('calendar');
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [selectedTicketDetails, setSelectedTicketDetails] = useState<Client | null>(null);
//   const [clients, setClients] = useState<Client[]>([]);
//   const [overallStats, setOverallStats] = useState<OverallStats>({
//     totalUsers: 0,
//     totalTickets: 0,
//     avgResponseTime: 0,
//     expiringSoon: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.token) {
//         setError('Not authenticated. Please log in.');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch clients
//         const clientsResponse = await fetch('/api/clients', {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         if (!clientsResponse.ok) {
//           throw new Error(`Clients fetch failed: ${clientsResponse.statusText}`);
//         }
//         const clientsData: Client[] = await clientsResponse.json();
//         setClients(clientsData);

//         // Fetch tickets
//         const ticketsResponse = await fetch('/api/tickets', {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         if (!ticketsResponse.ok) {
//           throw new Error(`Tickets fetch failed: ${ticketsResponse.statusText}`);
//         }
//         const ticketsData: Ticket[] = await ticketsResponse.json();

//         // Calculate average response time
//         const closedTickets = ticketsData.filter((ticket) => ticket.closed_at);
//         const totalResponseTime = closedTickets.reduce((sum, ticket) => {
//           const created = new Date(ticket.created_at).getTime();
//           const closed = new Date(ticket.closed_at!).getTime();
//           return sum + (closed - created) / (1000 * 60 * 60); // Convert to hours
//         }, 0);
//         const avgResponseTime = closedTickets.length
//           ? Number((totalResponseTime / closedTickets.length).toFixed(1))
//           : 0;

//         setOverallStats({
//           totalUsers: clientsData.length,
//           totalTickets: ticketsData.length,
//           avgResponseTime,
//           expiringSoon: 0,
//         });
//       } catch (err: any) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user?.token]);

//   const recentTicketActivity = [
//     // Unchanged as requested
//     {
//       id: 'T001',
//       title: 'Server Down Issue',
//       customer: 'John Doe',
//       events: [
//         { type: 'raised', start: '2025-07-21 09:00 AM IST', end: '2025-07-21 09:10 AM IST', description: 'Ticket raised by customer' },
//         { type: 'oemConfirmed', start: '2025-07-21 09:05 AM IST', end: '2025-07-21 09:15 AM IST', description: 'Confirmed by OEM' },
//         { type: 'commentAdded', start: '2025-07-21 11:00 AM IST', end: '2025-07-21 11:15 AM IST', description: 'Comment: Awaiting resolution' },
//       ],
//       priority: 'high',
//     },
//     {
//       id: 'T002',
//       title: 'Login Error',
//       customer: 'Jane Smith',
//       events: [
//         { type: 'raised', start: '2025-07-21 08:30 AM IST', end: '2025-07-21 08:15 AM IST', description: 'Ticket raised by customer' },
//         { type: 'oemConfirmed', start: '2025-07-21 09:45 AM IST', end: '2025-07-21 10:00 AM IST', description: 'Confirmed by OEM' },
//         { type: 'commentAdded', start: '2025-07-21 11:40 AM IST', end: '2025-07-21 11:45 AM IST', description: 'Comment: Fixed login issue' },
//       ],
//       priority: 'medium',
//     },
//     {
//       id: 'T003',
//       title: 'Database Sync',
//       customer: 'John Doe',
//       events: [
//         { type: 'raised', start: '2025-07-21 06:00 PM IST', end: '2025-07-21 06:15 PM IST', description: 'Ticket raised by customer' },
//         { type: 'oemConfirmed', start: '2025-07-21 07:20 PM IST', end: '2025-07-21 07:30 PM IST', description: 'Confirmed by OEM' },
//       ],
//       priority: 'low',
//     },
//   ];

//   const getStatusBadge = (status: string) => {
//     const variant = status === 'active' || status === 'resolved' ? 'success' : status === 'in-progress' ? 'warning' : 'destructive';
//     return <Badge variant={variant as any}>{status}</Badge>;
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'high':
//         return 'bg-red-100 text-red-800';
//       case 'medium':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'low':
//         return 'bg-green-100 text-green-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const handleTicketClick = (client: Client) => {
//     setSelectedTicketDetails(client);
//     setIsUserModalOpen(true);
//   };

//   const getMinutesFromMidnight = (timeStr: string | undefined): number => {
//     if (!timeStr) {
//       console.warn('Invalid time string:', timeStr);
//       return 0;
//     }
//     const [, timePart] = timeStr.split(' ');
//     if (!timePart) {
//       console.warn('No time part found in:', timeStr);
//       return 0;
//     }
//     const [hours, minutes] = timePart.split(':').map(Number);
//     const isPM = timePart.includes('PM');
//     const totalHours = hours + (isPM && hours !== 12 ? 12 : hours === 12 && !isPM ? -12 : 0);
//     return totalHours * 60 + minutes;
//   };

//   return (
//     <ErrorBoundary>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//         </div>
//         {loading ? (
//           <div>Loading...</div>
//         ) : error ? (
//           <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Total Users</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.totalUsers}</p>
//                     </div>
//                     <Users className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Total Tickets</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.totalTickets}</p>
//                     </div>
//                     <Ticket className="h-10 w-10 text-green-600 bg-green-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Avg Response</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.avgResponseTime}h</p>
//                     </div>
//                     <Clock className="h-10 w-10 text-yellow-600 bg-yellow-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Expiring Soon</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.expiringSoon}</p>
//                     </div>
//                     <AlertTriangle className="h-10 w-10 text-red-600 bg-red-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle>Management Center</CardTitle>
//                   <div className="flex gap-2">
//                     <Button
//                       variant={activeTab === 'calendar' ? 'default' : 'outline'}
//                       onClick={() => setActiveTab('calendar')}
//                       className="flex items-center gap-2"
//                     >
//                       <Calendar className="h-4 w-4" />
//                       Calendar
//                     </Button>
//                     <Button
//                       variant={activeTab === 'users' ? 'default' : 'outline'}
//                       onClick={() => setActiveTab('users')}
//                       className="flex items-center gap-2"
//                     >
//                       <Users className="h-4 w-4" />
//                       Clients
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {activeTab === 'calendar' ? (
//                   <AdminCalendar />
//                 ) : (
//                   <div className="space-y-4">
//                     {clients.map((client) => (
//                       <div
//                         key={client.client_id}
//                         className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
//                         onClick={() => handleTicketClick(client)}
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <User className="h-5 w-5 text-blue-600" />
//                           </div>
//                           <div>
//                             <h4 className="font-medium">{client.name}</h4>
//                             <p className="text-sm text-gray-500">{client.client_username}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-8">
//                           <div className="text-center">
//                             <p className="text-sm text-gray-500">Tickets Used</p>
//                             <p className="font-medium">{client.tickets.length}</p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-sm text-gray-500">Last Activity</p>
//                             <p className="font-medium">
//                               {client.tickets.length > 0
//                                 ? new Date(
//                                     client.tickets.reduce((latest, ticket) =>
//                                       new Date(ticket.created_at) > new Date(latest.created_at) ? ticket : latest
//                                     ).created_at
//                                   ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
//                                 : 'N/A'}
//                             </p>
//                           </div>
//                           <div>{getStatusBadge('active')}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//             {activeTab === 'calendar' && (
//               <Card className="border border-gray-200 shadow-md">
//                 <CardHeader>
//                   <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                     <Ticket className="h-5 w-5 text-blue-600" />
//                     Recent Ticket Activity
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="overflow-x-auto">
//                     <div className="min-w-[1200px]">
//                       <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(250px,1fr))] gap-2">
//                         <div className="flex flex-col pt-8">
//                           {Array.from({ length: 13 }, (_, i) => i + 6).map((hour) => (
//                             <div
//                               key={hour}
//                               className="h-16 border-b border-gray-200 flex items-start pl-2 text-sm text-gray-600 font-medium"
//                             >
//                               {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
//                             </div>
//                           ))}
//                         </div>
//                         {recentTicketActivity.map((ticket) => {
//                           const eventsByTime = ticket.events.reduce(
//                             (acc, event, index, arr) => {
//                               const startMinutes = getMinutesFromMidnight(event.start);
//                               const prevEndMinutes = index > 0 ? getMinutesFromMidnight(arr[index - 1].end) : -Infinity;
//                               const isClose = startMinutes - prevEndMinutes < 15;
//                               if (isClose && index > 0) {
//                                 acc[acc.length - 1].push(event);
//                               } else {
//                                 acc.push([event]);
//                               }
//                               return acc;
//                             },
//                             [] as typeof ticket.events[]
//                           );

//                           return (
//                             <div key={ticket.id} className="relative border-l border-gray-200 min-h-[832px] pt-8">
//                               {eventsByTime.map((eventGroup, groupIndex) => {
//                                 const firstEvent = eventGroup[0];
//                                 const startMinutes = getMinutesFromMidnight(firstEvent.start);
//                                 const endMinutes = Math.max(...eventGroup.map((e) => getMinutesFromMidnight(e.end)));
//                                 const top = ((startMinutes - 360) / 60) * 64;
//                                 const height = Math.max(((endMinutes - startMinutes) / 60) * 64, 48);

//                                 return (
//                                   <div
//                                     key={`${ticket.id}-group-${groupIndex}`}
//                                     className="absolute left-1 right-1"
//                                     style={{
//                                       top: `${Math.max(top, 0)}px`,
//                                       height: `${height}px`,
//                                     }}
//                                   >
//                                     <div className="flex gap-1 h-full">
//                                       {eventGroup.map((event, index) => (
//                                         <div
//                                           key={`${ticket.id}-${event.type}-${index}`}
//                                           className="flex-1 min-w-0 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-3 text-sm text-gray-700 hover:bg-blue-100 transition-colors cursor-pointer shadow-sm"
//                                           style={{
//                                             flex: `1 1 ${100 / Math.min(eventGroup.length, 4)}%`,
//                                             maxWidth: eventGroup.length > 1 ? `${100 / Math.min(eventGroup.length, 4)}%` : '100%',
//                                           }}
//                                           onClick={() => handleTicketClick(ticket as any)}
//                                         >
//                                           <div className="font-semibold truncate">{ticket.title}</div>
//                                           <div className="text-xs font-medium text-gray-600">
//                                             {event.type.replace(/([A-Z])/g, ' $1').trim()}
//                                           </div>
//                                           <div className="text-xs text-gray-500 truncate">
//                                             {event.start.split(' ')[1]} - {event.end.split(' ')[1]}
//                                           </div>
//                                           <div className="text-xs text-gray-600 truncate">{event.description}</div>
//                                           {event.type === 'raised' && (
//                                             <Badge className={`mt-1 ${getPriorityColor(ticket.priority)}`}>
//                                               {ticket.priority.toUpperCase()}
//                                             </Badge>
//                                           )}
//                                         </div>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//             <UserDetailsModal
//               isOpen={isUserModalOpen}
//               onClose={() => setIsUserModalOpen(false)}
//               user={selectedTicketDetails}
//             />
//           </>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default AdminDashboard;








// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Users, Calendar, Clock, AlertTriangle, Ticket, User } from 'lucide-react';
// import AdminCalendar from '@/components/Calendar/AdminCalendar';
// import UserDetailsModal from '@/components/Admin/UserDetailsModal';
// import { Badge } from '@/components/ui/badge';
// import { useAuth } from '@/contexts/AuthContext';

// interface ErrorBoundaryProps {
//   children: React.ReactNode;
// }

// interface ErrorBoundaryState {
//   hasError: boolean;
//   error?: Error;
//   errorInfo?: string;
// }

// class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   constructor(props: ErrorBoundaryProps) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error('Error caught by boundary:', error, errorInfo.componentStack);
//     this.setState({ errorInfo: error.message + '\n' + errorInfo.componentStack });
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
//           <h2 className="text-lg font-semibold">Something went wrong.</h2>
//           <p>Please try refreshing the page or contact support if the issue persists.</p>
//           {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
//             <pre className="mt-2 text-sm text-gray-800 bg-gray-100 p-2 rounded">{this.state.errorInfo}</pre>
//           )}
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// interface Client {
//   client_id: number;
//   client_username: string;
//   name: string;
//   tickets: {
//     ticket_id: number;
//     issue_title: string;
//     priority: string | null;
//     status: string;
//     created_at: string;
//     closed_at: string | null;
//   }[];
//   contract: {
//     client_id: number;
//     allowed_tickets: number;
//     total_tickets_used: number;
//     ticket_typeRS1: number;
//     ticket_typeRS1_used: number;
//     ticket_typeRS2: number;
//     ticket_typeRS2_used: number;
//     ticket_typeRS3_1: number;
//     ticket_typeRS3_1_used: number;
//     ticket_typeRS3_2: number;
//     ticket_typeRS3_2_used: number;
//     site_visit_frequency: number;
//   } | null;
//   pendingTickets: number;
//   monthlyActivity: { [key: string]: number };
//   months: string[];
//   isContractActive: boolean;
// }

// interface OverallStats {
//   totalUsers: number;
//   totalTickets: number;
//   avgResponseTime: number;
//   expiringSoon: number;
// }

// const AdminDashboard: React.FC = () => {
//   const { user, isLoading: authLoading, logout } = useAuth();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('calendar');
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [selectedTicketDetails, setSelectedTicketDetails] = useState<Client | null>(null);
//   const [clients, setClients] = useState<Client[]>([]);
//   const [overallStats, setOverallStats] = useState<OverallStats>({
//     totalUsers: 0,
//     totalTickets: 0,
//     avgResponseTime: 0,
//     expiringSoon: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.id) {
//         setError('Not authenticated. Please log in as an admin.');
//         setLoading(false);
//         router.push('/login');
//         return;
//       }

//       if (user.role !== 'admin') {
//         setError('Unauthorized: Admin access required.');
//         setLoading(false);
//         router.push('/login');
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         console.log('Fetching clients with token:', localStorage.getItem('token'));
//         const clientsResponse = await fetch('/api/clients', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });

//         if (clientsResponse.status === 401) {
//           const errorData = await clientsResponse.json();
//           if (errorData.error.includes('Token expired') || errorData.error.includes('Invalid token')) {
//             setError('Session expired. Please log in again.');
//             logout();
//             router.push('/login');
//             return;
//           }
//           throw new Error(`Clients fetch failed: ${errorData.error}`);
//         }

//         if (!clientsResponse.ok) {
//           const errorData = await clientsResponse.json();
//           throw new Error(`Clients fetch failed: ${errorData.error || clientsResponse.statusText}`);
//         }

//         const clientsData: Client[] = await clientsResponse.json();
//         console.log('Clients data:', clientsData);

//         const totalTickets = clientsData.reduce((sum, client) => sum + client.tickets.length, 0);
//         const closedTickets = clientsData
//           .flatMap((client) => client.tickets)
//           .filter((ticket) => ticket.closed_at);
//         const totalResponseTime = closedTickets.reduce((sum, ticket) => {
//           const created = new Date(ticket.created_at).getTime();
//           const closed = new Date(ticket.closed_at!).getTime();
//           return sum + (closed - created) / (1000 * 60 * 60); // Convert to hours
//         }, 0);
//         const avgResponseTime = closedTickets.length
//           ? Number((totalResponseTime / closedTickets.length).toFixed(1))
//           : 0;

//         const expiringSoon = clientsData.filter((client) => client.isContractActive).length; // Simplified

//         setClients(clientsData);
//         setOverallStats({
//           totalUsers: clientsData.length,
//           totalTickets,
//           avgResponseTime,
//           expiringSoon,
//         });
//       } catch (err: any) {
//         console.error('Error fetching data:', err);
//         setError(`Failed to load data: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!authLoading) {
//       fetchData();
//     }
//   }, [user, authLoading, router, logout]);

//   const recentTicketActivity = [
//     {
//       id: 'T001',
//       title: 'Server Down Issue',
//       customer: 'John Doe',
//       events: [
//         { type: 'raised', start: '2025-07-21 09:00 AM IST', end: '2025-07-21 09:10 AM IST', description: 'Ticket raised by customer' },
//         { type: 'oemConfirmed', start: '2025-07-21 09:05 AM IST', end: '2025-07-21 09:15 AM IST', description: 'Confirmed by OEM' },
//         { type: 'commentAdded', start: '2025-07-21 11:00 AM IST', end: '2025-07-21 11:15 AM IST', description: 'Comment: Awaiting resolution' },
//       ],
//       priority: 'high',
//     },
//     {
//       id: 'T002',
//       title: 'Login Error',
//       customer: 'Jane Smith',
//       events: [
//         { type: 'raised', start: '2025-07-21 08:30 AM IST', end: '2025-07-21 08:45 AM IST', description: 'Ticket raised by customer' },
//         { type: 'oemConfirmed', start: '2025-07-21 09:45 AM IST', end: '2025-07-21 10:00 AM IST', description: 'Confirmed by OEM' },
//         { type: 'commentAdded', start: '2025-07-21 11:40 AM IST', end: '2025-07-21 11:45 AM IST', description: 'Comment: Fixed login issue' },
//       ],
//       priority: 'medium',
//     },
//     {
//       id: 'T003',
//       title: 'Database Sync',
//       customer: 'John Doe',
//       events: [
//         { type: 'raised', start: '2025-07-21 06:00 PM IST', end: '2025-07-21 06:15 PM IST', description: 'Ticket raised by customer' },
//         { type: 'oemConfirmed', start: '2025-07-21 07:20 PM IST', end: '2025-07-21 07:30 PM IST', description: 'Confirmed by OEM' },
//       ],
//       priority: 'low',
//     },
//   ];

//   const getStatusBadge = (status: string) => {
//     const variant = status === 'closed' ? 'success' : status === 'open' ? 'default' : status === 'confirmed by oem' ? 'warning' : 'destructive';
//     return <Badge variant={variant as any}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
//   };

//   const getPriorityColor = (priority: string | null) => {
//     switch (priority?.toLowerCase()) {
//       case 'high':
//         return 'bg-red-100 text-red-800';
//       case 'medium':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'low':
//         return 'bg-green-100 text-green-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const handleTicketClick = (client: Client) => {
//     setSelectedTicketDetails(client);
//     setIsUserModalOpen(true);
//   };

//   const getMinutesFromMidnight = (timeStr: string | undefined): number => {
//     if (!timeStr) {
//       console.warn('Invalid time string:', timeStr);
//       return 0;
//     }
//     const [, timePart] = timeStr.split(' ');
//     if (!timePart) {
//       console.warn('No time part found in:', timeStr);
//       return 0;
//     }
//     const [hours, minutes] = timePart.split(':').map(Number);
//     const isPM = timePart.includes('PM');
//     const totalHours = hours + (isPM && hours !== 12 ? 12 : hours === 12 && !isPM ? -12 : 0);
//     return totalHours * 60 + minutes;
//   };

//   return (
//     <ErrorBoundary>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//         </div>
//         {authLoading || loading ? (
//           <div className="text-center">Loading...</div>
//         ) : error ? (
//           <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
//             {error}
//             {error.includes('Session expired') && (
//               <Button className="mt-2" onClick={() => router.push('/login')}>
//                 Log In Again
//               </Button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Total Users</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.totalUsers}</p>
//                     </div>
//                     <Users className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Total Tickets</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.totalTickets}</p>
//                     </div>
//                     <Ticket className="h-10 w-10 text-green-600 bg-green-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Avg Response</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.avgResponseTime}h</p>
//                     </div>
//                     <Clock className="h-10 w-10 text-yellow-600 bg-yellow-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Active Contracts</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.expiringSoon}</p>
//                     </div>
//                     <AlertTriangle className="h-10 w-10 text-red-600 bg-red-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle>Management Center</CardTitle>
//                   <div className="flex gap-2">
//                     <Button
//                       variant={activeTab === 'calendar' ? 'default' : 'outline'}
//                       onClick={() => setActiveTab('calendar')}
//                       className="flex items-center gap-2"
//                     >
//                       <Calendar className="h-4 w-4" />
//                       Calendar
//                     </Button>
//                     <Button
//                       variant={activeTab === 'users' ? 'default' : 'outline'}
//                       onClick={() => setActiveTab('users')}
//                       className="flex items-center gap-2"
//                     >
//                       <Users className="h-4 w-4" />
//                       Clients
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {activeTab === 'calendar' ? (
//                   <AdminCalendar />
//                 ) : (
//                   <div className="space-y-4">
//                     {clients.length === 0 ? (
//                       <p className="text-gray-500">No clients found.</p>
//                     ) : (
//                       clients.map((client) => (
//                         <div
//                           key={client.client_id}
//                           className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
//                           onClick={() => handleTicketClick(client)}
//                         >
//                           <div className="flex items-center gap-4">
//                             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                               <User className="h-5 w-5 text-blue-600" />
//                             </div>
//                             <div>
//                               <h4 className="font-medium">{client.name}</h4>
//                               <p className="text-sm text-gray-500">{client.client_username}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-8">
//                             <div className="text-center">
//                               <p className="text-sm text-gray-500">Tickets Used</p>
//                               <p className="font-medium">
//                                 {client.contract?.total_tickets_used || 0}/{client.contract?.allowed_tickets || 0}
//                               </p>
//                             </div>
//                             <div className="text-center">
//                               <p className="text-sm text-gray-500">Remaining</p>
//                               <p className="font-medium">
//                                 {(client.contract?.allowed_tickets || 0) - (client.contract?.total_tickets_used || 0)}
//                               </p>
//                             </div>
//                             <div className="text-center">
//                               <p className="text-sm text-gray-500">Pending</p>
//                               <p className="font-medium">{client.pendingTickets}</p>
//                             </div>
//                             <div className="text-center">
//                               <p className="text-sm text-gray-500">Contract</p>
//                               <p className="font-medium">{client.isContractActive ? 'Active' : 'Inactive'}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//             {activeTab === 'users' && (
//               <Card className="border border-gray-200 shadow-md">
//                 <CardHeader>
//                   <CardTitle className="text-xl font-semibold text-gray-900">Client Details</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {clients.length === 0 ? (
//                     <p className="text-gray-500">No clients selected.</p>
//                   ) : (
//                     clients.map((client) => (
//                       <div key={client.client_id} className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                           <Card>
//                             <CardHeader>
//                               <CardTitle className="text-sm font-medium">Monthly Ticket Activity</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                               <div className="grid grid-cols-4 gap-2 text-center">
//                                 {client.months.map((month) => (
//                                   <div key={month}>
//                                     <p className="text-sm text-gray-500">{month}</p>
//                                     <p className="font-medium">{client.monthlyActivity[month]}</p>
//                                   </div>
//                                 ))}
//                               </div>
//                             </CardContent>
//                           </Card>
//                           <Card>
//                             <CardHeader>
//                               <CardTitle className="text-sm font-medium">Contract Information</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                               <div className="space-y-2">
//                                 <div>
//                                   <p className="text-sm text-gray-500">Site Visit Frequency</p>
//                                   <p className="font-medium">{client.contract?.site_visit_frequency || 0} per year</p>
//                                 </div>
//                                 <div>
//                                   <p className="text-sm text-gray-500">Contract Status</p>
//                                   <p className="font-medium">{client.isContractActive ? 'Active' : 'Inactive'}</p>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         </div>
//                         <Card className="mt-4">
//                           <CardHeader>
//                             <CardTitle className="text-sm font-medium">Recent Tickets</CardTitle>
//                           </CardHeader>
//                           <CardContent>
//                             {client.tickets.length === 0 ? (
//                               <p className="text-gray-500">No recent tickets.</p>
//                             ) : (
//                               <div className="space-y-4">
//                                 {client.tickets.map((ticket) => (
//                                   <div
//                                     key={ticket.ticket_id}
//                                     className="flex items-center justify-between p-3 border rounded-lg"
//                                   >
//                                     <div>
//                                       <p className="font-medium">
//                                         #{ticket.ticket_id} - {ticket.issue_title}
//                                       </p>
//                                       <p className="text-sm text-gray-500">
//                                         {new Date(ticket.created_at).toLocaleDateString('en-US', {
//                                           month: 'short',
//                                           day: 'numeric',
//                                           year: 'numeric',
//                                         })}
//                                       </p>
//                                     </div>
//                                     <div className="flex items-center gap-4">
//                                       <Badge className={getPriorityColor(ticket.priority)}>
//                                         {ticket.priority?.toUpperCase() || 'N/A'}
//                                       </Badge>
//                                       {getStatusBadge(ticket.status)}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </CardContent>
//                         </Card>
//                       </div>
//                     ))
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//             {activeTab === 'calendar' && (
//               <Card className="border border-gray-200 shadow-md">
//                 <CardHeader>
//                   <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                     <Ticket className="h-5 w-5 text-blue-600" />
//                     Recent Ticket Activity
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="overflow-x-auto">
//                     <div className="min-w-[1200px]">
//                       <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(250px,1fr))] gap-2">
//                         <div className="flex flex-col pt-8">
//                           {Array.from({ length: 13 }, (_, i) => i + 6).map((hour) => (
//                             <div
//                               key={hour}
//                               className="h-16 border-b border-gray-200 flex items-start pl-2 text-sm text-gray-600 font-medium"
//                             >
//                               {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
//                             </div>
//                           ))}
//                         </div>
//                         {recentTicketActivity.map((ticket) => {
//                           const eventsByTime = ticket.events.reduce(
//                             (acc, event, index, arr) => {
//                               const startMinutes = getMinutesFromMidnight(event.start);
//                               const prevEndMinutes = index > 0 ? getMinutesFromMidnight(arr[index - 1].end) : -Infinity;
//                               const isClose = startMinutes - prevEndMinutes < 15;
//                               if (isClose && index > 0) {
//                                 acc[acc.length - 1].push(event);
//                               } else {
//                                 acc.push([event]);
//                               }
//                               return acc;
//                             },
//                             [] as typeof ticket.events[]
//                           );

//                           return (
//                             <div key={ticket.id} className="relative border-l border-gray-200 min-h-[832px] pt-8">
//                               {eventsByTime.map((eventGroup, groupIndex) => {
//                                 const firstEvent = eventGroup[0];
//                                 const startMinutes = getMinutesFromMidnight(firstEvent.start);
//                                 const endMinutes = Math.max(...eventGroup.map((e) => getMinutesFromMidnight(e.end)));
//                                 const top = ((startMinutes - 360) / 60) * 64;
//                                 const height = Math.max(((endMinutes - startMinutes) / 60) * 64, 48);

//                                 return (
//                                   <div
//                                     key={`${ticket.id}-group-${groupIndex}`}
//                                     className="absolute left-1 right-1"
//                                     style={{
//                                       top: `${Math.max(top, 0)}px`,
//                                       height: `${height}px`,
//                                     }}
//                                   >
//                                     <div className="flex gap-1 h-full">
//                                       {eventGroup.map((event, index) => (
//                                         <div
//                                           key={`${ticket.id}-${event.type}-${index}`}
//                                           className="flex-1 min-w-0 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-3 text-sm text-gray-700 hover:bg-blue-100 transition-colors cursor-pointer shadow-sm"
//                                           style={{
//                                             flex: `1 1 ${100 / Math.min(eventGroup.length, 4)}%`,
//                                             maxWidth: eventGroup.length > 1 ? `${100 / Math.min(eventGroup.length, 4)}%` : '100%',
//                                           }}
//                                           onClick={() => handleTicketClick({} as any)} // Adjust as needed
//                                         >
//                                           <div className="font-semibold truncate">{ticket.title}</div>
//                                           <div className="text-xs font-medium text-gray-600">
//                                             {event.type.replace(/([A-Z])/g, ' $1').trim()}
//                                           </div>
//                                           <div className="text-xs text-gray-500 truncate">
//                                             {event.start.split(' ')[1]} - {event.end.split(' ')[1]}
//                                           </div>
//                                           <div className="text-xs text-gray-600 truncate">{event.description}</div>
//                                           {event.type === 'raised' && (
//                                             <Badge className={`mt-1 ${getPriorityColor(ticket.priority)}`}>
//                                               {ticket.priority.toUpperCase()}
//                                             </Badge>
//                                           )}
//                                         </div>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//             <UserDetailsModal
//               isOpen={isUserModalOpen}
//               onClose={() => setIsUserModalOpen(false)}
//               user={selectedTicketDetails}
//             />
//           </>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default AdminDashboard;









// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Users, Calendar, Clock, AlertTriangle, Ticket, User } from 'lucide-react';
// import AdminCalendar from '@/components/Calendar/AdminCalendar';
// import UserDetailsModal from '@/components/Admin/UserDetailsModal';
// import { Badge } from '@/components/ui/badge';
// import { useAuth } from '@/contexts/AuthContext';

// interface ErrorBoundaryProps {
//   children: React.ReactNode;
// }

// interface ErrorBoundaryState {
//   hasError: boolean;
//   error?: Error;
//   errorInfo?: string;
// }

// class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   constructor(props: ErrorBoundaryProps) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error('Error caught by boundary:', error, errorInfo.componentStack);
//     this.setState({ errorInfo: error.message + '\n' + errorInfo.componentStack });
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
//           <h2 className="text-lg font-semibold">Something went wrong.</h2>
//           <p>Please try refreshing the page or contact support if the issue persists.</p>
//           {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
//             <pre className="mt-2 text-sm text-gray-800 bg-gray-100 p-2 rounded">{this.state.errorInfo}</pre>
//           )}
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// interface Client {
//   client_id: number;
//   client_username: string;
//   name: string;
//   tickets: {
//     ticket_id: number;
//     issue_title: string;
//     priority: string | null;
//     status: string;
//     created_at: string;
//     updated_at: string;
//     closed_at: string | null;
//   }[];
//   contract: {
//     client_id: number;
//     allowed_tickets: number;
//     total_tickets_used: number;
//     ticket_typeRS1: number;
//     ticket_typeRS1_used: number;
//     ticket_typeRS2: number;
//     ticket_typeRS2_used: number;
//     ticket_typeRS3_1: number;
//     ticket_typeRS3_1_used: number;
//     ticket_typeRS3_2: number;
//     ticket_typeRS3_2_used: number;
//     site_visit_frequency: number;
//   } | null;
//   pendingTickets: number;
//   monthlyActivity: { [key: string]: number };
//   months: string[];
//   isContractActive: boolean;
// }

// interface OverallStats {
//   totalUsers: number;
//   totalTickets: number;
//   avgResponseTime: number;
//   expiringSoon: number;
// }

// interface TicketEvent {
//   ticket_id: number;
//   title: string;
//   customer: string;
//   type: 'created' | 'updated' | 'closed';
//   timestamp: string;
//   priority: string | null;
// }

// const AdminDashboard: React.FC = () => {
//   const { user, isLoading: authLoading, logout } = useAuth();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('calendar');
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [selectedTicketDetails, setSelectedTicketDetails] = useState<Client | null>(null);
//   const [clients, setClients] = useState<Client[]>([]);
//   const [overallStats, setOverallStats] = useState<OverallStats>({
//     totalUsers: 0,
//     totalTickets: 0,
//     avgResponseTime: 0,
//     expiringSoon: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.id) {
//         setError('Not authenticated. Please log in as an admin.');
//         setLoading(false);
//         router.push('/login');
//         return;
//       }

//       if (user.role !== 'admin') {
//         setError('Unauthorized: Admin access required.');
//         setLoading(false);
//         router.push('/login');
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         console.log('Fetching clients with token:', localStorage.getItem('token'));
//         const clientsResponse = await fetch('/api/clients', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });

//         if (clientsResponse.status === 401) {
//           const errorData = await clientsResponse.json();
//           if (errorData.error.includes('Token expired') || errorData.error.includes('Invalid token')) {
//             setError('Session expired. Please log in again.');
//             logout();
//             router.push('/login');
//             return;
//           }
//           throw new Error(`Clients fetch failed: ${errorData.error}`);
//         }

//         if (!clientsResponse.ok) {
//           const errorData = await clientsResponse.json();
//           throw new Error(`Clients fetch failed: ${errorData.error || clientsResponse.statusText}`);
//         }

//         const clientsData: Client[] = await clientsResponse.json();
//         console.log('Clients data:', clientsData);

//         const totalTickets = clientsData.reduce((sum, client) => sum + client.tickets.length, 0);
//         const closedTickets = clientsData
//           .flatMap((client) => client.tickets)
//           .filter((ticket) => ticket.closed_at);
//         const totalResponseTime = closedTickets.reduce((sum, ticket) => {
//           const created = new Date(ticket.created_at).getTime();
//           const closed = new Date(ticket.closed_at!).getTime();
//           return sum + (closed - created) / (1000 * 60 * 60); // Convert to hours
//         }, 0);
//         const avgResponseTime = closedTickets.length
//           ? Number((totalResponseTime / closedTickets.length).toFixed(1))
//           : 0;

//         const expiringSoon = clientsData.filter((client) => client.isContractActive).length;

//         setClients(clientsData);
//         setOverallStats({
//           totalUsers: clientsData.length,
//           totalTickets,
//           avgResponseTime,
//           expiringSoon,
//         });
//       } catch (err: any) {
//         console.error('Error fetching data:', err);
//         setError(`Failed to load data: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!authLoading) {
//       fetchData();
//     }
//   }, [user, authLoading, router, logout]);

//   const getStatusBadge = (status: string) => {
//     const variant = status === 'closed' ? 'success' : status === 'open' ? 'default' : status === 'confirmed by oem' ? 'warning' : 'destructive';
//     return <Badge variant={variant as any}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
//   };

//   const getPriorityColor = (priority: string | null) => {
//     switch (priority?.toLowerCase()) {
//       case 'high':
//         return 'bg-red-100 text-red-800';
//       case 'medium':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'low':
//         return 'bg-green-100 text-green-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const handleTicketClick = (client: Client) => {
//     setSelectedTicketDetails(client);
//     setIsUserModalOpen(true);
//   };

//   // Generate ticket events for the past week
//   const recentTicketActivity: TicketEvent[] = clients
//     .flatMap((client) =>
//       client.tickets.flatMap((ticket) => {
//         const events: TicketEvent[] = [];
//         const oneWeekAgo = new Date('2025-09-03T15:52:00+05:30');
//         oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

//         if (new Date(ticket.created_at) >= oneWeekAgo) {
//           events.push({
//             ticket_id: ticket.ticket_id,
//             title: ticket.issue_title,
//             customer: client.name,
//             type: 'created',
//             timestamp: ticket.created_at,
//             priority: ticket.priority,
//           });
//         }
//         if (new Date(ticket.updated_at) >= oneWeekAgo) {
//           events.push({
//             ticket_id: ticket.ticket_id,
//             title: ticket.issue_title,
//             customer: client.name,
//             type: 'updated',
//             timestamp: ticket.updated_at,
//             priority: ticket.priority,
//           });
//         }
//         if (ticket.closed_at && new Date(ticket.closed_at) >= oneWeekAgo) {
//           events.push({
//             ticket_id: ticket.ticket_id,
//             title: ticket.issue_title,
//             customer: client.name,
//             type: 'closed',
//             timestamp: ticket.closed_at,
//             priority: ticket.priority,
//           });
//         }
//         return events;
//       })
//     )
//     .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

//   const getDayOfWeek = (timestamp: string): number => {
//     const date = new Date(timestamp);
//     return (date.getDay() + 6) % 7; // Shift to start with Monday (0) to Sunday (6)
//   };

//   const formatTimestamp = (timestamp: string): string => {
//     return new Date(timestamp).toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   return (
//     <ErrorBoundary>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//         </div>
//         {authLoading || loading ? (
//           <div className="text-center">Loading...</div>
//         ) : error ? (
//           <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
//             {error}
//             {error.includes('Session expired') && (
//               <Button className="mt-2" onClick={() => router.push('/login')}>
//                 Log In Again
//               </Button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Total Users</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.totalUsers}</p>
//                     </div>
//                     <Users className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Total Tickets</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.totalTickets}</p>
//                     </div>
//                     <Ticket className="h-10 w-10 text-green-600 bg-green-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Avg Response</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.avgResponseTime}h</p>
//                     </div>
//                     <Clock className="h-10 w-10 text-yellow-600 bg-yellow-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-500 font-medium">Active Contracts</p>
//                       <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.expiringSoon}</p>
//                     </div>
//                     <AlertTriangle className="h-10 w-10 text-red-600 bg-red-100 p-2 rounded-full" />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle>Management Center</CardTitle>
//                   <div className="flex gap-2">
//                     <Button
//                       variant={activeTab === 'calendar' ? 'default' : 'outline'}
//                       onClick={() => setActiveTab('calendar')}
//                       className="flex items-center gap-2"
//                     >
//                       <Calendar className="h-4 w-4" />
//                       Calendar
//                     </Button>
//                     <Button
//                       variant={activeTab === 'users' ? 'default' : 'outline'}
//                       onClick={() => setActiveTab('users')}
//                       className="flex items-center gap-2"
//                     >
//                       <Users className="h-4 w-4" />
//                       Clients
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {activeTab === 'calendar' ? (
//                   <AdminCalendar />
//                 ) : (
//                   <div className="space-y-4">
//                     {clients.length === 0 ? (
//                       <p className="text-gray-500">No clients found.</p>
//                     ) : (
//                       clients.map((client) => (
//                         <div
//                           key={client.client_id}
//                           className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
//                           onClick={() => handleTicketClick(client)}
//                         >
//                           <div className="flex items-center gap-4">
//                             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                               <User className="h-5 w-5 text-blue-600" />
//                             </div>
//                             <div>
//                               <h4 className="font-medium">{client.name}</h4>
//                               <p className="text-sm text-gray-500">{client.client_username}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-8">
//                             <div className="text-center">
//                               <p className="text-sm text-gray-500">Tickets Used</p>
//                               <p className="font-medium">
//                                 {client.contract?.total_tickets_used || 0}/{client.contract?.allowed_tickets || 0}
//                               </p>
//                             </div>
//                             <div className="text-center">
//                               <p className="text-sm text-gray-500">Remaining</p>
//                               <p className="font-medium">
//                                 {(client.contract?.allowed_tickets || 0) - (client.contract?.total_tickets_used || 0)}
//                               </p>
//                             </div>
//                             <div className="text-center">
//                               <p className="text-sm text-gray-500">Pending</p>
//                               <p className="font-medium">{client.pendingTickets}</p>
//                             </div>
//                             <div className="text-center">
//                               <p className="text-sm text-gray-500">Contract</p>
//                               <p className="font-medium">{client.isContractActive ? 'Active' : 'Inactive'}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//             {activeTab === 'users' && (
//               <Card className="border border-gray-200 shadow-md">
//                 <CardHeader>
//                   <CardTitle className="text-xl font-semibold text-gray-900">Client Details</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {clients.length === 0 ? (
//                     <p className="text-gray-500">No clients found.</p>
//                   ) : (
//                     clients.map((client) => (
//                       <div key={client.client_id} className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//                           <Card>
//                             <CardHeader>
//                               <CardTitle className="text-sm font-medium">Monthly Ticket Activity</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                               <div className="grid grid-cols-4 gap-2 text-center">
//                                 {client.months.map((month) => (
//                                   <div key={month}>
//                                     <p className="text-sm text-gray-500">{month}</p>
//                                     <p className="font-medium">{client.monthlyActivity[month]}</p>
//                                   </div>
//                                 ))}
//                               </div>
//                             </CardContent>
//                           </Card>
//                           <Card>
//                             <CardHeader>
//                               <CardTitle className="text-sm font-medium">Contract Information</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                               <div className="space-y-2">
//                                 <div>
//                                   <p className="text-sm text-gray-500">Site Visit Frequency</p>
//                                   <p className="font-medium">{client.contract?.site_visit_frequency || 0} per year</p>
//                                 </div>
//                                 <div>
//                                   <p className="text-sm text-gray-600">Contract Status</p>
//                                   <p className="font-medium">{client.isContractActive ? 'Active' : 'Inactive'}</p>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         </div>
//                         <Card className="mt-4">
//                           <CardHeader>
//                             <CardTitle className="text-sm font-medium">Recent Tickets</CardTitle>
//                           </CardHeader>
//                           <CardContent>
//                             {client.tickets.length === 0 ? (
//                               <p className="text-gray-500">No recent tickets.</p>
//                             ) : (
//                               <div className="space-y-4">
//                                 {client.tickets.map((ticket) => (
//                                   <div
//                                     key={ticket.ticket_id}
//                                     className="flex items-center justify-between p-3 border rounded-lg"
//                                   >
//                                     <div>
//                                       <p className="font-medium">
//                                         #{ticket.ticket_id} - {ticket.issue_title}
//                                       </p>
//                                       <p className="text-sm text-gray-500">
//                                         {new Date(ticket.created_at).toLocaleDateString('en-US', {
//                                           month: 'short',
//                                           day: 'numeric',
//                                           year: 'numeric',
//                                         })}
//                                       </p>
//                                     </div>
//                                     <div className="flex items-center gap-4">
//                                       <Badge className={getPriorityColor(ticket.priority)}>
//                                         {ticket.priority?.toUpperCase() || 'N/A'}
//                                       </Badge>
//                                       {getStatusBadge(ticket.status)}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </CardContent>
//                         </Card>
//                       </div>
//                     ))
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//             {activeTab === 'calendar' && (
//               <Card className="border border-gray-200 shadow-md">
//                 <CardHeader>
//                   <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                     <Ticket className="h-5 w-5 text-blue-600" />
//                     Recent Ticket Activity (Last 7 Days)
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="overflow-x-auto">
//                     <div className="min-w-[1200px]">
//                       <div className="grid grid-cols-[80px_repeat(7,minmax(150px,1fr))] gap-2">
//                         <div className="pt-8" />
//                         {Array.from({ length: 7 }, (_, i) => {
//                           const date = new Date('2025-09-03T15:52:00+05:30');
//                           date.setDate(date.getDate() - 6 + i); // Start from Aug 28, 2025
//                           return (
//                             <div key={i} className="relative border-l border-gray-200 min-h-[400px] pt-8">
//                               <div className="absolute top-0 left-0 right-0 text-center text-sm font-medium text-gray-600">
//                                 {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
//                               </div>
//                               <div className="space-y-2 mt-8">
//                                 {recentTicketActivity
//                                   .filter((event) => getDayOfWeek(event.timestamp) === i)
//                                   .map((event, index) => (
//                                     <div
//                                       key={`${event.ticket_id}-${event.type}-${index}`}
//                                       className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-3 text-sm text-gray-700 hover:bg-blue-100 transition-colors cursor-pointer shadow-sm"
//                                       onClick={() => router.push(`/tickets/${event.ticket_id}`)}
//                                     >
//                                       <div className="font-semibold truncate">{event.title}</div>
//                                       <div className="text-xs font-medium text-gray-600">
//                                         {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
//                                       </div>
//                                       <div className="text-xs text-gray-500 truncate">
//                                         {formatTimestamp(event.timestamp)}
//                                       </div>
//                                       <div className="text-xs text-gray-600 truncate">
//                                         Customer: {event.customer}
//                                       </div>
//                                       {event.type === 'created' && (
//                                         <Badge className={`mt-1 ${getPriorityColor(event.priority)}`}>
//                                           {event.priority?.toUpperCase() || 'N/A'}
//                                         </Badge>
//                                       )}
//                                     </div>
//                                   ))}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//             <UserDetailsModal
//               isOpen={isUserModalOpen}
//               onClose={() => setIsUserModalOpen(false)}
//               user={selectedTicketDetails}
//             />
//           </>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default AdminDashboard;



'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock, AlertTriangle, Ticket, User, ArrowLeft, ArrowRight } from 'lucide-react';
import AdminCalendar from '@/components/Calendar/AdminCalendar';
import UserDetailsModal from '@/components/Admin/UserDetailsModal';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo.componentStack);
    this.setState({ errorInfo: error.message + '\n' + errorInfo.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold">Something went wrong.</h2>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <pre className="mt-2 text-sm text-gray-800 bg-gray-100 p-2 rounded">{this.state.errorInfo}</pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

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
    updated_at: string;
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

interface OverallStats {
  totalUsers: number;
  totalTickets: number;
  avgResponseTime: number;
  expiringSoon: number;
}

interface TicketEvent {
  ticket_id: number;
  title: string;
  customer: string;
  type: 'created' | 'updated' | 'closed';
  timestamp: string;
  priority: string | null;
}

const AdminDashboard: React.FC = () => {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('calendar');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalUsers: 0,
    totalTickets: 0,
    avgResponseTime: 0,
    expiringSoon: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setError('Not authenticated. Please log in as an admin.');
        setLoading(false);
        router.push('/login');
        return;
      }

      if (user.role !== 'admin') {
        setError('Unauthorized: Admin access required.');
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching clients with token:', localStorage.getItem('token'));
        const clientsResponse = await fetch('/api/clients', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (clientsResponse.status === 401) {
          const errorData = await clientsResponse.json();
          if (errorData.error.includes('Token expired') || errorData.error.includes('Invalid token')) {
            setError('Session expired. Please log in again.');
            logout();
            router.push('/login');
            return;
          }
          throw new Error(`Clients fetch failed: ${errorData.error}`);
        }

        if (!clientsResponse.ok) {
          const errorData = await clientsResponse.json();
          throw new Error(`Clients fetch failed: ${errorData.error || clientsResponse.statusText}`);
        }

        const clientsData: Client[] = await clientsResponse.json();
        console.log('Clients data:', clientsData);

        const totalTickets = clientsData.reduce((sum, client) => sum + client.tickets.length, 0);
        const closedTickets = clientsData
          .flatMap((client) => client.tickets)
          .filter((ticket) => ticket.closed_at);
        const totalResponseTime = closedTickets.reduce((sum, ticket) => {
          const created = new Date(ticket.created_at).getTime();
          const closed = new Date(ticket.closed_at!).getTime();
          return sum + (closed - created) / (1000 * 60 * 60); // Convert to hours
        }, 0);
        const avgResponseTime = closedTickets.length
          ? Number((totalResponseTime / closedTickets.length).toFixed(1))
          : 0;

        const expiringSoon = clientsData.filter((client) => client.isContractActive).length;

        setClients(clientsData);
        setOverallStats({
          totalUsers: clientsData.length,
          totalTickets,
          avgResponseTime,
          expiringSoon,
        });
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading, router, logout]);

  const getStatusBadge = (status: string) => {
    const variant = status === 'closed' ? 'success' : status === 'open' ? 'default' : status === 'confirmed by oem' ? 'warning' : 'destructive';
    return <Badge variant={variant as any}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

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

  const handleTicketClick = (client: Client) => {
    setSelectedTicketDetails(client);
    setIsUserModalOpen(true);
  };

  // Generate ticket events
  const recentTicketActivity: TicketEvent[] = clients
    .flatMap((client) => client.tickets.flatMap((ticket) => {
      const events: TicketEvent[] = [];
      events.push({
        ticket_id: ticket.ticket_id,
        title: ticket.issue_title,
        customer: client.name,
        type: 'created',
        timestamp: ticket.created_at,
        priority: ticket.priority,
      });
      events.push({
        ticket_id: ticket.ticket_id,
        title: ticket.issue_title,
        customer: client.name,
        type: 'updated',
        timestamp: ticket.updated_at,
        priority: ticket.priority,
      });
      if (ticket.closed_at) {
        events.push({
          ticket_id: ticket.ticket_id,
          title: ticket.issue_title,
          customer: client.name,
          type: 'closed',
          timestamp: ticket.closed_at,
          priority: ticket.priority,
        });
      }
      return events;
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const getWeekIndex = (timestamp: string, weekStart: Date): number => {
    const eventDate = new Date(timestamp);
    eventDate.setHours(0, 0, 0, 0);
    const start = new Date(weekStart);
    start.setHours(0, 0, 0, 0);
    const diff = eventDate.getTime() - start.getTime();
    return Math.floor(diff / (24 * 60 * 60 * 1000));
  };

  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() + weekOffset * 7 - 6);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const isFutureWeek = weekEnd > today;

  const filteredEvents = recentTicketActivity.filter((event) => {
    const eventDate = new Date(event.timestamp);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        {authLoading || loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
            {error.includes('Session expired') && (
              <Button className="mt-2" onClick={() => router.push('/login')}>
                Log In Again
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Users</p>
                      <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.totalUsers}</p>
                    </div>
                    <Users className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Tickets</p>
                      <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.totalTickets}</p>
                    </div>
                    <Ticket className="h-10 w-10 text-green-600 bg-green-100 p-2 rounded-full" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Avg Response</p>
                      <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.avgResponseTime}h</p>
                    </div>
                    <Clock className="h-10 w-10 text-yellow-600 bg-yellow-100 p-2 rounded-full" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Active Contracts</p>
                      <p className="text-3xl font-semibold text-gray-800 mt-1">{overallStats.expiringSoon}</p>
                    </div>
                    <AlertTriangle className="h-10 w-10 text-red-600 bg-red-100 p-2 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Management Center</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={activeTab === 'calendar' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('calendar')}
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Calendar
                    </Button>
                    <Button
                      variant={activeTab === 'users' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('users')}
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Clients
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === 'calendar' ? (
                  <AdminCalendar />
                ) : (
                  <div className="space-y-4">
                    {clients.length === 0 ? (
                      <p className="text-gray-500">No clients found.</p>
                    ) : (
                      clients.map((client) => (
                        <div
                          key={client.client_id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleTicketClick(client)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{client.name}</h4>
                              <p className="text-sm text-gray-500">{client.client_username}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Tickets Used</p>
                              <p className="font-medium">
                                {client.contract?.total_tickets_used || 0}/{client.contract?.allowed_tickets || 0}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Remaining</p>
                              <p className="font-medium">
                                {(client.contract?.allowed_tickets || 0) - (client.contract?.total_tickets_used || 0)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Pending</p>
                              <p className="font-medium">{client.pendingTickets}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Contract</p>
                              <p className="font-medium">{client.isContractActive ? 'Active' : 'Inactive'}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            {activeTab === 'users' && (
              <Card className="border border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Client Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {clients.length === 0 ? (
                    <p className="text-gray-500">No clients found.</p>
                  ) : (
                    clients.map((client) => (
                      <div key={client.client_id} className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm font-medium">Monthly Ticket Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-4 gap-2 text-center">
                                {client.months.map((month) => (
                                  <div key={month}>
                                    <p className="text-sm text-gray-500">{month}</p>
                                    <p className="font-medium">{client.monthlyActivity[month]}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm font-medium">Contract Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-gray-500">Site Visit Frequency</p>
                                  <p className="font-medium">{client.contract?.site_visit_frequency || 0} per year</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Contract Status</p>
                                  <p className="font-medium">{client.isContractActive ? 'Active' : 'Inactive'}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <Card className="mt-4">
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">Recent Tickets</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {client.tickets.length === 0 ? (
                              <p className="text-gray-500">No recent tickets.</p>
                            ) : (
                              <div className="space-y-4">
                                {client.tickets.map((ticket) => (
                                  <div
                                    key={ticket.ticket_id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        #{ticket.ticket_id} - {ticket.issue_title}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {new Date(ticket.created_at).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                        })}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <Badge className={getPriorityColor(ticket.priority)}>
                                        {ticket.priority?.toUpperCase() || 'N/A'}
                                      </Badge>
                                      {getStatusBadge(ticket.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
            {activeTab === 'calendar' && (
              <Card className="border border-gray-200 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => setWeekOffset(weekOffset - 1)} className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Previous Week
                    </Button>
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-blue-600" />
                      Ticket Activity ({weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                    </CardTitle>
                    <Button variant="outline" onClick={() => setWeekOffset(weekOffset + 1)} disabled={isFutureWeek} className="flex items-center gap-2">
                      Next Week
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[1200px]">
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 7 }, (_, i) => {
                          const date = new Date(weekStart);
                          date.setDate(date.getDate() + i);
                          return (
                            <div key={i} className="relative border-l border-gray-200 min-h-[400px] pt-8">
                              <div className="absolute top-0 left-0 right-0 text-center text-sm font-medium text-gray-600">
                                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </div>
                              <div className="space-y-2 mt-8">
                                {filteredEvents
                                  .filter((event) => getWeekIndex(event.timestamp, weekStart) === i)
                                  .map((event, index) => (
                                    <div
                                      key={`${event.ticket_id}-${event.type}-${index}`}
                                      className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-3 text-sm text-gray-700 hover:bg-blue-100 transition-colors cursor-pointer shadow-sm"
                                      onClick={() => router.push(`/tickets/${event.ticket_id}`)}
                                    >
                                      <div className="font-semibold truncate">{event.title}</div>
                                      <div className="text-xs font-medium text-gray-600">
                                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                      </div>
                                      <div className="text-xs text-gray-500 truncate">
                                        {formatTimestamp(event.timestamp)}
                                      </div>
                                      <div className="text-xs text-gray-600 truncate">
                                        Customer: {event.customer}
                                      </div>
                                      {event.type === 'created' && (
                                        <Badge className={`mt-1 ${getPriorityColor(event.priority)}`}>
                                          {event.priority?.toUpperCase() || 'N/A'}
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                {filteredEvents.filter((event) => getWeekIndex(event.timestamp, weekStart) === i).length === 0 && (
                                  <div className="text-center text-gray-500 py-4">
                                    No activity
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <UserDetailsModal
              isOpen={isUserModalOpen}
              onClose={() => setIsUserModalOpen(false)}
              user={selectedTicketDetails}
            />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;