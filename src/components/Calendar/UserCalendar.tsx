
// import React, { useState, useEffect } from 'react';
// import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// const monthNames = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];


// const formatDate = (d: Date) =>
//   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// const UserCalendar = () => {
//   const [viewMode, setViewMode] = useState('overview');
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [siteVisitDates, setSiteVisitDates] = useState<string[]>([]);
//   const [ticketRaisedDates, setTicketRaisedDates] = useState<string[]>([]);

//   useEffect(() => {
//   async function getCalendarData() {
//     const res = await fetch('/api/calendar-data', {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`, // 👈 or from your AuthContext/Clerk/NextAuth
//       },
//     });

//     const data = await res.json();

//     if (data.siteVisits && data.tickets) {
//       setSiteVisitDates(
//         data.siteVisits.map((visit: any) => formatDate(new Date(visit.date)))
//       );
//       setTicketRaisedDates(
//         data.tickets.map((ticket: any) => formatDate(new Date(ticket.created_at)))
//       );
//     }
//   }

//   getCalendarData();
// }, []);


//   const getDaysInMonth = (month: number, year: number) => {
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();

//     const days = [];
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }
//     for (let day = 1; day <= daysInMonth; day++) {
//       days.push(day);
//     }
//     return days;
//   };

//   const getEventForDate = (year: number, month: number, day: number) => {
//     const date = new Date(year, month, day);
//     const formattedDate = formatDate(date);

//     const isSiteVisit = siteVisitDates.includes(formattedDate);
//     const isTicketRaised = ticketRaisedDates.includes(formattedDate);

//     return { isSiteVisit, isTicketRaised };
//   };

//   const navigateMonth = (direction: 'prev' | 'next') => {
//     if (direction === 'prev') {
//       if (selectedMonth === 0) {
//         setSelectedMonth(11);
//         setSelectedYear(selectedYear - 1);
//       } else {
//         setSelectedMonth(selectedMonth - 1);
//       }
//     } else {
//       if (selectedMonth === 11) {
//         setSelectedMonth(0);
//         setSelectedYear(selectedYear + 1);
//       } else {
//         setSelectedMonth(selectedMonth + 1);
//       }
//     }
//   };

//   const renderMonthCalendar = (month: number, year: number) => {
//     const days = getDaysInMonth(month, year);
//     return (
//       <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
//         <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-center font-semibold text-gray-900">
//           {monthNames[month]} {year}
//         </div>
//         <div className="grid grid-cols-7 border-b bg-gray-50/50">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <div key={day} className="p-2 text-sm font-medium text-gray-600 text-center border-r last:border-r-0">
//               {day}
//             </div>
//           ))}
//         </div>
//         <div className="grid grid-cols-7">
//           {days.map((day, index) => {
//             if (!day) return <div key={index} className="h-32 border-r border-b last:border-r-0 bg-gray-50/30"></div>;

//             const { isSiteVisit, isTicketRaised } = getEventForDate(year, month, day);
//             const isToday = new Date().getDate() === day &&
//                           new Date().getMonth() === month &&
//                           new Date().getFullYear() === year;

//             return (
//               <div key={day} className="h-32 border-r border-b last:border-r-0 p-1 relative hover:bg-gray-50/50 transition-colors group">
//                 <div className={`text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center mb-1 ${ 
//                   isToday ? 'bg-blue-600 text-white' :
//                   isTicketRaised ? 'bg-red-500 text-white' :
//                   isSiteVisit ? 'bg-pink-500 text-white' :
//                   'text-gray-700 bg-gray-100'
//                 }`}>
//                   {day}
//                 </div>

//                 {isSiteVisit && (
//                   <div className="text-xs">
//                     <div className="px-1 py-0.5 rounded text-white text-xs font-medium mb-1 bg-pink-500">
//                       SITE VISIT
//                     </div>
//                   </div>
//                 )}

//                 {isTicketRaised && (
//                   <div className="text-xs">
//                     <div className="px-1 py-0.5 rounded text-white text-xs font-medium mb-1 bg-red-500">
//                       TICKET RAISED
//                     </div>
//                   </div>
//                 )}

//                 {(isSiteVisit || isTicketRaised) && (
//                   <div className="absolute z-20 bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap max-w-xs border border-gray-600">
//                     <div className="font-bold text-sm">
//                       {isSiteVisit ? '🏢 Site Visit Planned' : '🎫 Ticket Raised'}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   const getLastFourMonths = () => {
//     const months = [];
//     const currentDate = new Date();

//     for (let i = 3; i >= 0; i--) {
//       const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
//       months.push({
//         month: date.getMonth(),
//         year: date.getFullYear()
//       });
//     }
//     return months;
//   };

//   return (
//     <Card className="w-full max-w-7xl mx-auto">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-3 text-2xl">
//             <Calendar className="h-6 w-6 text-indigo-600" />
//             Tickets & Site Visits Calendar
//           </CardTitle>
//           <Select value={viewMode} onValueChange={setViewMode}>
//             <SelectTrigger className="w-56 bg-white shadow-sm">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="overview">Last 4 Months Overview</SelectItem>
//               <SelectItem value="monthly">Monthly View</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </CardHeader>
//       <CardContent className="p-6">
//         {viewMode === 'overview' ? (
//           <div className="space-y-6">
//             <h4 className="text-lg font-medium text-gray-700 mb-4">Last 4 Months Summary</h4>
//             <div className="grid grid-cols-4 gap-6">
//               {getLastFourMonths().map(({ month, year }) => (
//                 <div key={`${month}-${year}`} className="w-full">
//                   {renderMonthCalendar(month, year)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between bg-white border-b border-gray-200 pb-4">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => {
//                     setSelectedMonth(new Date().getMonth());
//                     setSelectedYear(new Date().getFullYear());
//                   }}
//                   className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
//                 >
//                   Today
//                 </button>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => navigateMonth('prev')}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <ChevronLeft className="h-5 w-5 text-gray-600" />
//                   </button>
//                   <button
//                     onClick={() => navigateMonth('next')}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <ChevronRight className="h-5 w-5 text-gray-600" />
//                   </button>
//                 </div>
//                 <h4 className="text-2xl font-semibold text-gray-900">
//                   {monthNames[selectedMonth]} {selectedYear}
//                 </h4>
//               </div>
//             </div>
//             <div className="max-w-4xl mx-auto">
//               {renderMonthCalendar(selectedMonth, selectedYear)}
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default UserCalendar;



import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {  Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const UserCalendar = () => {
  const [viewMode, setViewMode] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [siteVisitDates, setSiteVisitDates] = useState<string[]>([]);
  const [ticketRaisedDates, setTicketRaisedDates] = useState<string[]>([]);

  useEffect(() => {
    async function getCalendarData() {
      const res = await fetch('/api/calendar-data', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (data.siteVisits && data.tickets) {
        setSiteVisitDates(
          data.siteVisits.map((visit: any) => formatDate(new Date(visit.date)))
        );
        setTicketRaisedDates(
          data.tickets.map((ticket: any) => formatDate(new Date(ticket.created_at)))
        );
      }
    }

    getCalendarData();
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const getEventForDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    const formattedDate = formatDate(date);

    const isSiteVisit = siteVisitDates.includes(formattedDate);
    const isTicketRaised = ticketRaisedDates.includes(formattedDate);

    return { isSiteVisit, isTicketRaised };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const renderMonthCalendar = (month: number, year: number) => {
    const days = getDaysInMonth(month, year);
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 tracking-tight">
            {monthNames[month]} {year}
          </h3>
        </div>
        <div className="grid grid-cols-7 border-b border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="px-3 py-3 text-xs font-medium text-slate-600 text-center border-r border-slate-100 last:border-r-0 bg-slate-50/50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) return (
              <div key={index} className="h-20 border-r border-b border-slate-100 last:border-r-0 bg-slate-25"></div>
            );

            const { isSiteVisit, isTicketRaised } = getEventForDate(year, month, day);
            const isToday = new Date().getDate() === day &&
                          new Date().getMonth() === month &&
                          new Date().getFullYear() === year;

            return (
              <div key={day} className="h-20 border-r border-b border-slate-100 last:border-r-0 p-2 relative hover:bg-slate-50/70 transition-all duration-200 group cursor-pointer">
                <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1.5 transition-all duration-200 ${ 
                  isToday ? 'bg-blue-600 text-white shadow-md' :
                  isTicketRaised ? 'bg-red-500 text-white' :
                  isSiteVisit ? 'bg-emerald-500 text-white' :
                  'text-slate-700 hover:bg-slate-100'
                }`}>
                  {day}
                </div>

                <div className="space-y-1">
                  {isSiteVisit && (
                    <div className="px-1.5 py-0.5 rounded-md text-white text-xs font-medium bg-emerald-500 shadow-sm">
                      Site Visit
                    </div>
                  )}

                  {isTicketRaised && (
                    <div className="px-1.5 py-0.5 rounded-md text-white text-xs font-medium bg-red-500 shadow-sm">
                      Ticket
                    </div>
                  )}
                </div>

                {(isSiteVisit || isTicketRaised) && (
                  <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-slate-700">
                    <div className="font-medium">
                      {isSiteVisit ? '🏢 Site Visit Scheduled' : '🎫 Support Ticket Created'}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getLastTwoMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }
    return months;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <CardContent className="w-full max-w-7xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Calendar className="h-6 w-6" />
              </div>
              Calendar Overview
            </CardTitle>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-60 bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Last 2 Months Overview</SelectItem>
                <SelectItem value="monthly">Monthly View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {viewMode === 'overview' ? (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Recent Activity</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-8 max-w-5xl mx-auto">
                {getLastTwoMonths().map(({ month, year }) => (
                  <div key={`${month}-${year}`} className="w-full">
                    {renderMonthCalendar(month, year)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => {
                      setSelectedMonth(new Date().getMonth());
                      setSelectedYear(new Date().getFullYear());
                    }}
                    className="px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm"
                  >
                    Current Month
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-3 hover:bg-slate-200 rounded-xl transition-all duration-200 shadow-sm border border-slate-200"
                    >
                      <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-3 hover:bg-slate-200 rounded-xl transition-all duration-200 shadow-sm border border-slate-200"
                    >
                      <ChevronRight className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                    {monthNames[selectedMonth]} {selectedYear}
                  </h2>
                </div>
              </div>
    
              <div className="max-w-5xl mx-auto">
                {renderMonthCalendar(selectedMonth, selectedYear)}
              </div>
            </div>
          )}
        </CardContent>
      
      </CardContent>
    </div>
  );
};

function App() {
  return <UserCalendar />;
}

export default App;