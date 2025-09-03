//  import React, { useState } from 'react';
// import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// const UserCalendar = () => {
//   const [viewMode, setViewMode] = useState('overview');
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   // Enhanced data for last 4 months (April - July 2025)
//   const ticketOverviewData = {
//     // April 2025
//     '2025-04-02': { type: 'ticket_raised', title: 'Server Downtime Reported - Critical' },
//     '2025-04-08': { type: 'ticket_raised', title: 'Database Connection Timeout' },
//     '2025-04-18': { type: 'ticket_raised', title: 'Application Crash - Priority High' },
//     '2025-04-28': { type: 'ticket_raised', title: 'Security Breach Alert' },
//     '2025-04-30': { type: 'site_visit', title: 'Monthly System Health Check' },

//     // May 2025
//     '2025-05-01': { type: 'ticket_raised', title: 'Backup System Failure' },
//     '2025-05-03': { type: 'site_visit', title: 'Hardware Upgrade - Memory Installation' },
    
//     '2025-05-07': { type: 'ticket_raised', title: 'Database Connection Error' },
 
//     '2025-05-25': { type: 'site_visit', title: 'Equipment Calibration' },

//     '2025-05-31': { type: 'ticket_raised', title: 'Disk Space Alert - Critical' },

//     // June 2025
//     '2025-06-02': { type: 'ticket_raised', title: 'Login System Failure' },
//     '2025-06-04': { type: 'site_visit', title: 'Server Room Temperature Control' },
//     '2025-06-07': { type: 'ticket_raised', title: 'CDN Performance Issues' },
//     '2025-06-19': { type: 'ticket_raised', title: 'Memory Leak in Application' },
  
//     '2025-06-29': { type: 'site_visit', title: 'System Health & Performance Check' },

//     // July 2025
//     '2025-07-01': { type: 'ticket_raised', title: 'Monitoring System Alert' },
//     '2025-07-02': { type: 'site_visit', title: 'Server Room Maintenance' },
//     '2025-07-16': { type: 'site_visit', title: 'Cable Management & Organization' },

//   };

//   // Enhanced data for monthly view (current month focus)
  // const calendarEvents = {
  //   '2025-07-01': { type: 'ticket_raised', title: 'System Monitoring Alert - High CPU Usage' },
  //   '2025-07-09': { type: 'site_visit', title: 'Hardware Maintenance - Storage Upgrade' },
  //   '2025-07-10': { type: 'ticket_raised', title: 'API Service Down' },
  //   '2025-07-11': { type: 'ticket_raised', title: 'Email Server Configuration Issue' },
  //   '2025-07-12': { type: 'ticket_raised', title: 'Network Connectivity Issue - Branch Office' },
  //   '2025-07-14': { type: 'site_visit', title: 'Firewall Update' },
  //   '2025-07-15': { type: 'site_visit', title: 'System Upgrade Visit - OS Updates' },
  //   '2025-07-16': { type: 'ticket_raised', title: 'Payment Gateway Error' },
  //   '2025-07-17': { type: 'ticket_raised', title: 'User Access Permission Error' },
  //   '2025-07-18': { type: 'ticket_raised', title: 'Software Crash - Inventory Module' },
  //   '2025-07-19': { type: 'site_visit', title: 'Server Room Temperature Check' },
  //   '2025-07-20': { type: 'site_visit', title: 'Cooling System Audit & Maintenance' },
  //   '2025-07-21': { type: 'ticket_raised', title: 'Application Performance Issue' },
 
  // };

//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];


//   const getDaysInMonth = (month, year) => {
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

//   const getEventForDate = (year, month, day) => {
//     const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//     return viewMode === 'overview' ? ticketOverviewData[dateKey] : calendarEvents[dateKey];
//   };

//   const navigateMonth = (direction) => {
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

//   const renderMonthCalendar = (month, year) => {
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
            
//             const event = getEventForDate(year, month, day);
//             const isToday = new Date().getDate() === day && 
//                           new Date().getMonth() === month && 
//                           new Date().getFullYear() === year;
            
//             return (
//               <div key={day} className="h-32 border-r border-b last:border-r-0 p-1 relative hover:bg-gray-50/50 transition-colors group">
//                 <div className={`text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
//                   isToday ? 'bg-blue-600 text-white' : 
//                   event?.type === 'ticket_raised' ? 'bg-red-500 text-white' :
//                   event?.type === 'site_visit' ? 'bg-pink-500 text-white' :
//                   'text-gray-700 bg-gray-100'
//                 }`}>
//                   {day}
//                 </div>
                
//                 {event && (
//                   <div className="text-xs">
//                     <div className={`px-1 py-0.5 rounded text-white text-xs font-medium mb-1 ${
//                       event.type === 'ticket_raised' ? 'bg-red-500' : 'bg-pink-500'
//                     }`}>
//                       {event.type === 'ticket_raised' ? 'TICKET' : 'VISIT'}
//                     </div>
//                     <div className="text-gray-700 text-xs leading-tight line-clamp-3 overflow-hidden font-medium">
//                       {event.title}
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced tooltip on hover */}
//                 {event && (
//                   <div className="absolute z-20 bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap max-w-xs border border-gray-600">
//                     <div className="font-bold text-sm">{event.title}</div>
//                     <div className="text-gray-300 text-xs mt-1">
//                       {event.type === 'ticket_raised' ? '🎫 Ticket Raised' : '🏢 Site Visit Planned'}
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
//             <div className="flex items-center justify-center gap-8 pt-6 border-t border-gray-200">
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//                 <span className="text-sm text-gray-600">Ticket Raised Date</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
//                 <span className="text-sm text-gray-600">Site Visit Scheduled</span>
//               </div>
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
//             <div className="flex items-center justify-center gap-8 pt-6 border-t border-gray-200">
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//                 <span className="text-sm text-gray-600">Ticket Raised Date</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
//                 <span className="text-sm text-gray-600">Site Visit Scheduled</span>
//               </div>
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  // Fetch data from API on component mount
  useEffect(() => {
    async function getCalendarData() {
      const res = await fetch('/api/calendar-data');
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
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-center font-semibold text-gray-900">
          {monthNames[month]} {year}
        </div>
        <div className="grid grid-cols-7 border-b bg-gray-50/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-sm font-medium text-gray-600 text-center border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) return <div key={index} className="h-32 border-r border-b last:border-r-0 bg-gray-50/30"></div>;

            const { isSiteVisit, isTicketRaised } = getEventForDate(year, month, day);
            const isToday = new Date().getDate() === day &&
                          new Date().getMonth() === month &&
                          new Date().getFullYear() === year;

            return (
              <div key={day} className="h-32 border-r border-b last:border-r-0 p-1 relative hover:bg-gray-50/50 transition-colors group">
                <div className={`text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center mb-1 ${ 
                  isToday ? 'bg-blue-600 text-white' :
                  isTicketRaised ? 'bg-red-500 text-white' :
                  isSiteVisit ? 'bg-pink-500 text-white' :
                  'text-gray-700 bg-gray-100'
                }`}>
                  {day}
                </div>

                {isSiteVisit && (
                  <div className="text-xs">
                    <div className="px-1 py-0.5 rounded text-white text-xs font-medium mb-1 bg-pink-500">
                      SITE VISIT
                    </div>
                  </div>
                )}

                {isTicketRaised && (
                  <div className="text-xs">
                    <div className="px-1 py-0.5 rounded text-white text-xs font-medium mb-1 bg-red-500">
                      TICKET RAISED
                    </div>
                  </div>
                )}

                {(isSiteVisit || isTicketRaised) && (
                  <div className="absolute z-20 bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap max-w-xs border border-gray-600">
                    <div className="font-bold text-sm">
                      {isSiteVisit ? '🏢 Site Visit Planned' : '🎫 Ticket Raised'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getLastFourMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 3; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }
    return months;
  };

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Calendar className="h-6 w-6 text-indigo-600" />
            Tickets & Site Visits Calendar
          </CardTitle>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-56 bg-white shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Last 4 Months Overview</SelectItem>
              <SelectItem value="monthly">Monthly View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {viewMode === 'overview' ? (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Last 4 Months Summary</h4>
            <div className="grid grid-cols-4 gap-6">
              {getLastFourMonths().map(({ month, year }) => (
                <div key={`${month}-${year}`} className="w-full">
                  {renderMonthCalendar(month, year)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white border-b border-gray-200 pb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedMonth(new Date().getMonth());
                    setSelectedYear(new Date().getFullYear());
                  }}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
                >
                  Today
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <h4 className="text-2xl font-semibold text-gray-900">
                  {monthNames[selectedMonth]} {selectedYear}
                </h4>
              </div>
            </div>
            <div className="max-w-4xl mx-auto">
              {renderMonthCalendar(selectedMonth, selectedYear)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCalendar;
