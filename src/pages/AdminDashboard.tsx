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


import React, { useState, Component, ErrorInfo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Plus, Clock, AlertTriangle, Ticket, User } from 'lucide-react';
import AdminCalendar from '@/components/Calendar/AdminCalendar';
import UserDetailsModal from '@/components/Admin/UserDetailsModal';
import { Badge } from '@/components/ui/badge';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error; errorInfo?: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);

  const allUsers = [
    { id: '1', name: 'Mr. Saxena', email: 'john@example.com', company: 'URJA', ticketsRemaining: 5, status: 'active', lastActivity: '2025-07-15' },
    { id: '2', name: 'Mr. Rakesh', email: 'jane@example.com', company: 'AMNSI', ticketsRemaining: 2, status: 'active', lastActivity: '2025-07-10' },
    { id: '3', name: 'Mr. Suren', email: 'jane@example.com', company: 'SAIL', ticketsRemaining: 2, status: 'active', lastActivity: '2025-07-10' },
    { id: '4', name: 'Mr. Rakesh', email: 'jane@example.com', company: 'JSPL', ticketsRemaining: 2, status: 'inactive', lastActivity: '2025-07-10' },

  ];

  const overallStats = {
    totalUsers: 4,
    totalTickets: 67,
    avgResponseTime: 2.4,
    expiringSoon: 1,
  };

  const recentTicketActivity = [
    {
      id: 'T001',
      title: 'Server Down Issue',
      customer: 'John Doe',
      events: [
        { type: 'raised', start: '2025-07-21 09:00 AM IST', end: '2025-07-21 09:10 AM IST', description: 'Ticket raised by customer' },
        { type: 'oemConfirmed', start: '2025-07-21 09:05 AM IST', end: '2025-07-21 09:15 AM IST', description: 'Confirmed by OEM' },
        { type: 'commentAdded', start: '2025-07-21 11:00 AM IST', end: '2025-07-21 11:15 AM IST', description: 'Comment: Awaiting resolution' },
      ],
      priority: 'high',
    },
    {
      id: 'T002',
      title: 'Login Error',
      customer: 'Jane Smith',
      events: [
        { type: 'raised', start: '2025-07-21 08:30 AM IST', end: '2025-07-21 08:15 AM IST', description: 'Ticket raised by customer' },
        { type: 'oemConfirmed', start: '2025-07-21 09:45 AM IST', end: '2025-07-21 10:00 AM IST', description: 'Confirmed by OEM' },
        { type: 'commentAdded', start: '2025-07-21 11:40 AM IST', end: '2025-07-21 11:45 AM IST', description: 'Comment: Fixed login issue' },
      ],
      priority: 'medium',
    },
    {
      id: 'T003',
      title: 'Database Sync',
      customer: 'John Doe',
      events: [
        { type: 'raised', start: '2025-07-21 06:00 PM IST', end: '2025-07-21 06:15 PM IST', description: 'Ticket raised by customer' },
        { type: 'oemConfirmed', start: '2025-07-21 07:20 PM IST', end: '2025-07-21 07:30 PM IST', description: 'Confirmed by OEM' },

      ],
      priority: 'low',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variant = status === 'active' || status === 'resolved' ? 'success' : status === 'in-progress' ? 'warning' : 'destructive';
    return <Badge variant={variant as any}>{status}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicketDetails(ticket);
    setIsUserModalOpen(true);
  };

  const getMinutesFromMidnight = (timeStr: string | undefined): number => {
    if (!timeStr) {
      console.warn('Invalid time string:', timeStr);
      return 0;
    }
    const [, timePart] = timeStr.split(' ');
    if (!timePart) {
      console.warn('No time part found in:', timeStr);
      return 0;
    }
    const [hours, minutes] = timePart.split(':').map(Number);
    const isPM = timePart.includes('PM');
    const totalHours = hours + (isPM && hours !== 12 ? 12 : hours === 12 && !isPM ? -12 : 0);
    return totalHours * 60 + minutes;
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Users</p>
                  <p className="text-3xl font-semibold text-gray-800 mt-1">
                    {overallStats.totalUsers}
                  </p>
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
                  <p className="text-3xl font-semibold text-gray-800 mt-1">
                    {overallStats.totalTickets}
                  </p>
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
                  <p className="text-3xl font-semibold text-gray-800 mt-1">
                    {overallStats.avgResponseTime}h
                  </p>
                </div>
                <Clock className="h-10 w-10 text-yellow-600 bg-yellow-100 p-2 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Expiring Soon</p>
                  <p className="text-3xl font-semibold text-gray-800 mt-1">
                    {overallStats.expiringSoon}
                  </p>
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
              <div>
                {showCreateUserForm ? (
                  <AdminCalendar />
                ) : (
                  <AdminCalendar />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleTicketClick(user)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Tickets Used</p>
                        <p className="font-medium">{12 - user.ticketsRemaining}/12</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Remaining</p>
                        <p className="font-medium">{user.ticketsRemaining}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Last Activity</p>
                        <p className="font-medium">{new Date(user.lastActivity).toLocaleDateString()}</p>
                      </div>
                      <div>
                        {getStatusBadge(user.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>

          {activeTab === 'calendar' && (
            <Card className="border border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-blue-600" />
                  Recent Ticket Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[1200px]">
                    <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(250px,1fr))] gap-2">
                      <div className="flex flex-col pt-8">
                        {Array.from({ length: 13 }, (_, i) => i + 6).map((hour) => (
                          <div key={hour} className="h-16 border-b border-gray-200 flex items-start pl-2 text-sm text-gray-600 font-medium">
                            {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                          </div>
                        ))}
                      </div>
                      {recentTicketActivity.map((ticket) => {
                        const eventsByTime = ticket.events.reduce((acc, event, index, arr) => {
                          const startMinutes = getMinutesFromMidnight(event.start);
                          const prevEndMinutes = index > 0 ? getMinutesFromMidnight(arr[index - 1].end) : -Infinity;
                          const isClose = startMinutes - prevEndMinutes < 15;
                          if (isClose && index > 0) {
                            acc[acc.length - 1].push(event);
                          } else {
                            acc.push([event]);
                          }
                          return acc;
                        }, [] as typeof ticket.events[]);

                        return (
                          <div key={ticket.id} className="relative border-l border-gray-200 min-h-[832px] pt-8">
                            {eventsByTime.map((eventGroup, groupIndex) => {
                              const firstEvent = eventGroup[0];
                              const startMinutes = getMinutesFromMidnight(firstEvent.start);
                              const endMinutes = Math.max(...eventGroup.map(e => getMinutesFromMidnight(e.end)));
                              const top = ((startMinutes - 360) / 60) * 64;
                              const height = Math.max(((endMinutes - startMinutes) / 60) * 64, 48);

                              return (
                                <div
                                  key={`${ticket.id}-group-${groupIndex}`}
                                  className="absolute left-1 right-1"
                                  style={{
                                    top: `${Math.max(top, 0)}px`,
                                    height: `${height}px`,
                                  }}
                                >
                                  <div className="flex gap-1 h-full">
                                    {eventGroup.map((event, index) => (
                                      <div
                                        key={`${ticket.id}-${event.type}-${index}`}
                                        className="flex-1 min-w-0 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-3 text-sm text-gray-700 hover:bg-blue-100 transition-colors cursor-pointer shadow-sm"
                                        style={{
                                          flex: `1 1 ${100 / Math.min(eventGroup.length, 4)}%`,
                                          maxWidth: eventGroup.length > 1 ? `${100 / Math.min(eventGroup.length, 4)}%` : '100%',
                                        }}
                                        onClick={() => handleTicketClick(ticket)}
                                      >
                                        <div className="font-semibold truncate">{ticket.title}</div>
                                        <div className="text-xs font-medium text-gray-600">
                                          {event.type.replace(/([A-Z])/g, ' $1').trim()}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                          {event.start.split(' ')[1]} - {event.end.split(' ')[1]}
                                        </div>
                                        <div className="text-xs text-gray-600 truncate">{event.description}</div>
                                        {event.type === 'raised' && (
                                          <Badge className={`mt-1 ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority.toUpperCase()}
                                          </Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
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
        </div>
      </ErrorBoundary>
    );
  };

export default AdminDashboard;



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