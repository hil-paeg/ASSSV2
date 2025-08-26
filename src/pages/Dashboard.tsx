
// import React from 'react';
// import DashboardCards from '@/components/Dashboard/DashboardCards';
// import ContractInfo from '@/components/Dashboard/ContractInfo';
// import UserCalendar from '@/components/Calendar/UserCalendar';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const Dashboard = () => {
//   // Mock data for charts
//   const ticketData = [
//     { month: 'Jan', tickets: 4 },
//     { month: 'Feb', tickets: 3 },
//     { month: 'Mar', tickets: 2 },
//     { month: 'Apr', tickets: 1 },
//     { month: 'May', tickets: 2 },
//     { month: 'Jun', tickets: 0 },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//         <p className="text-gray-600 mt-2">Welcome to your AMC support portal</p>
//       </div>

//       <DashboardCards />

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         <div className="lg:col-span-3 space-y-6">
//          {/* here */}
//         </div>

//         <div className="space-y-6">
//           <ContractInfo />
          
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Activity</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Ticket #1234 resolved</p>
//                     <p className="text-xs text-gray-500">2 hours ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Ticket #1235 in progress</p>
//                     <p className="text-xs text-gray-500">4 hours ago</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">New ticket created</p>
//                     <p className="text-xs text-gray-500">1 day ago</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="mt-6">
//         <UserCalendar />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import React from 'react';
import DashboardCards from '@/components/Dashboard/DashboardCards';
import ContractInfo from '@/components/Dashboard/ContractInfo';
import UserCalendar from '@/components/Calendar/UserCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RecentActivityCard from '@/pages/RecentActivityCard';

const Dashboard = () => {
  // Mock data for charts
  const ticketData = [
    { month: 'Jan', tickets: 4 },
    { month: 'Feb', tickets: 3 },
    { month: 'Mar', tickets: 2 },
    { month: 'Apr', tickets: 1 },
    { month: 'May', tickets: 2 },
    { month: 'Jun', tickets: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your AMC support portal</p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <UserCalendar />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContractInfo />
        <RecentActivityCard />
      </div>
    </div>
  );
};

export default Dashboard;






 {/* <Card className="my-4">
            <CardHeader>
              <CardTitle>Monthly Ticket Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ticketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tickets" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}