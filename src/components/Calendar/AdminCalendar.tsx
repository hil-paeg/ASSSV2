// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Calendar, ChevronLeft, ChevronRight, Building2, MapPin } from 'lucide-react';

// const AdminCalendar: React.FC = () => {
//   const [currentWeek, setCurrentWeek] = useState(new Date());

//   // Mock data for the week view
//   const weekData = {
//     '2024-07-15': {
//       tickets: [
//         { company: 'Tech Corp Ltd', count: 3, type: 'mixed' },
//         { company: 'Global Systems', count: 2, type: 'rsa1' },
//       ],
//       siteVisits: [
//         { company: 'Tech Corp Ltd', time: '10:00 AM', location: 'Office Building A' },
//       ]
//     },
//     '2024-07-16': {
//       tickets: [
//         { company: 'Innovate Solutions', count: 1, type: 'rsa2' },
//         { company: 'Startup Inc', count: 4, type: 'mixed' },
//       ],
//       siteVisits: []
//     },
//     '2024-07-17': {
//       tickets: [
//         { company: 'Tech Corp Ltd', count: 2, type: 'rsa3' },
//       ],
//       siteVisits: [
//         { company: 'Global Systems', time: '2:00 PM', location: 'Data Center' },
//         { company: 'Innovate Solutions', time: '4:00 PM', location: 'Main Office' },
//       ]
//     },
//     '2024-07-18': {
//       tickets: [],
//       siteVisits: []
//     },
//     '2024-07-19': {
//       tickets: [
//         { company: 'Startup Inc', count: 1, type: 'rsa1' },
//         { company: 'Tech Corp Ltd', count: 3, type: 'mixed' },
//       ],
//       siteVisits: [
//         { company: 'Tech Corp Ltd', time: '11:00 AM', location: 'Branch Office' },
//       ]
//     },
//   };

//   const getWeekDays = (startDate: Date) => {
//     const week = [];
//     const start = new Date(startDate);
//     start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    
//     for (let i = 0; i < 7; i++) {
//       const day = new Date(start);
//       day.setDate(start.getDate() + i);
//       week.push(day);
//     }
    
//     return week;
//   };

//   const navigateWeek = (direction: 'prev' | 'next') => {
//     const newWeek = new Date(currentWeek);
//     newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
//     setCurrentWeek(newWeek);
//   };

//   const formatDate = (date: Date) => {
//     return date.toISOString().split('T')[0];
//   };

//   const formatDisplayDate = (date: Date) => {
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'short', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case 'rsa1': return 'bg-blue-100 text-blue-800';
//       case 'rsa2': return 'bg-green-100 text-green-800';
//       case 'rsa3': return 'bg-purple-100 text-purple-800';
//       case 'mixed': return 'bg-orange-100 text-orange-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const weekDays = getWeekDays(currentWeek);
//   const weekStart = weekDays[0];
//   const weekEnd = weekDays[6];

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               Weekly Calendar View
//             </CardTitle>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600">
//                 {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
//               </span>
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => navigateWeek('prev')}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentWeek(new Date())}
//                 >
//                   Today
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => navigateWeek('next')}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-7 gap-4">
//             {weekDays.map((day, index) => {
//               const dateKey = formatDate(day);
//               const dayData = weekData[dateKey] || { tickets: [], siteVisits: [] };
//               const isToday = day.toDateString() === new Date().toDateString();
              
//               return (
//                 <div key={index} className={`border rounded-lg p-3 min-h-[200px] ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
//                   <div className="text-center mb-3">
//                     <div className={`text-sm font-medium ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
//                       {formatDisplayDate(day)}
//                     </div>
//                     {isToday && (
//                       <div className="text-xs text-blue-600 mt-1">Today</div>
//                     )}
//                   </div>
                  
//                   <div className="space-y-3">
//                     {/* Tickets Section */}
//                     {dayData.tickets.length > 0 && (
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
//                           <Building2 className="h-3 w-3" />
//                           Tickets
//                         </div>
//                         {dayData.tickets.map((ticket, ticketIndex) => (
//                           <div key={ticketIndex} className="text-xs">
//                             <div className="font-medium text-gray-700 mb-1">{ticket.company}</div>
//                             <Badge 
//                               variant="outline" 
//                               className={`text-xs ${getTypeColor(ticket.type)}`}
//                             >
//                               {ticket.count} tickets
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                     )}
                    
//                     {/* Site Visits Section */}
//                     {dayData.siteVisits.length > 0 && (
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
//                           <MapPin className="h-3 w-3" />
//                           Site Visits
//                         </div>
//                         {dayData.siteVisits.map((visit, visitIndex) => (
//                           <div key={visitIndex} className="bg-green-50 p-2 rounded text-xs">
//                             <div className="font-medium text-green-800">{visit.time}</div>
//                             <div className="text-green-700">{visit.company}</div>
//                             <div className="text-green-600 text-xs">{visit.location}</div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
                    
//                     {/* Empty state */}
//                     {dayData.tickets.length === 0 && dayData.siteVisits.length === 0 && (
//                       <div className="text-xs text-gray-400 text-center mt-4">
//                         No activities
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>
      
//       {/* Legend */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center justify-center gap-8 text-sm">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-blue-500 rounded"></div>
//               <span>RSA1 Tickets</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-green-500 rounded"></div>
//               <span>RSA2 Tickets</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-purple-500 rounded"></div>
//               <span>RSA3 Tickets</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-orange-500 rounded"></div>
//               <span>Mixed Tickets</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <MapPin className="h-3 w-3 text-green-600" />
//               <span>Site Visits</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminCalendar;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminCalendar: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');

  // Reduced dummy data with 3 days per week, fewer site visits, and multiple events
  const ticketOverviewData = {

    '2025-07-22': { type: 'ticket_raised', title: 'Database Connection Error', client: 'Client B' },
    '2025-07-23': { type: 'ticket_raised', title: 'Application Performance Issue', client: 'Client C' },
    '2025-07-24': { type: 'site_visit', title: 'Server Room Maintenance', client: 'Tech Corp' },
    '2025-07-25': { type: 'ticket_raised', title: 'Network Connectivity Issue', client: 'Client A' },
  };

  const calendarEvents = {
    '2025-07-21': [
      
      { type: 'ticket_raised', title: 'Email Server Issue', client: 'Client C' },
    ],
    '2025-07-22': [
      { type: 'ticket_raised', title: 'Payment Gateway Error', client: 'Client A' },
    ],
    '2025-07-25': [
      { type: 'ticket_raised', title: 'Software Crash', client: 'Client B' },
    ],
  };

  const getWeekDays = (startDate: Date) => {
    const week = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1)); // Start from Monday
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric'
    });
  };

  const weekDays = getWeekDays(currentWeek);
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  const getEventsForDay = (date: Date) => {
    const dateKey = formatDate(date);
    const baseEvent = ticketOverviewData[dateKey];
    const additionalEvents = calendarEvents[dateKey] || [];
    return baseEvent ? [baseEvent, ...additionalEvents] : additionalEvents;
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    const startDate = new Date(firstDay);
    startDate.setDate(1 - firstDay.getDay());

    while (startDate <= lastDay || startDate.getDay() !== 1) {
      days.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    return days;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {view === 'week' ? 'Weekly Calendar View' : 'Monthly Calendar View'}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setView('week')}
                >
                  Week View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setView('month')}
                >
                  Month View
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeek(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {view === 'week' ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-8 bg-gray-100 text-sm font-medium">
                <div className="p-2"></div>
                {weekDays.map((day, index) => (
                  <div key={index} className="p-2 text-center border-b">
                    {formatDisplayDate(day).split(' ')[0]}
                    <br />
                    {day.getDate()}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-8 h-[600px]">
                <div className="border-r">
                  {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                    <div key={hour} className="h-24 border-b flex items-center pl-2 text-sm">
                      {hour}:00
                    </div>
                  ))}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const events = getEventsForDay(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div key={dayIndex} className={`border-r h-full relative ${isToday ? 'bg-blue-50' : ''}`}>
                      {events.map((event, idx) => (
                        <div
                          key={idx}
                          className={`absolute p-2 rounded shadow-md text-xs ${event.type === 'ticket_raised' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}
                          style={{ top: `${10 + idx * 80}px`, width: '90%', minHeight: '60px' }}
                        >
                          <div className="font-bold">{event.client}</div>
                          <div>{event.type === 'ticket_raised' ? 'Ticket: ' : 'Visit: '} {event.title}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium p-2 bg-gray-100">
                  {day}
                </div>
              ))}
              {getMonthDays(currentWeek).map((day, index) => {
                const dateKey = formatDate(day);
                const events = getEventsForDay(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isCurrentMonth = day.getMonth() === currentWeek.getMonth();

                return (
                  <div
                    key={index}
                    className={`border my-2 p-2 min-h-[100px] ${isToday ? 'bg-blue-100' : ''} ${!isCurrentMonth ? 'text-gray-400' : ''}`}
                  >
                    <div className={`text-sm font-medium ${events.length > 0 ? 'font-bold' : ''}`}>
                      {day.getDate()}
                    </div>
                    {events.map((event, idx) => (
                      <div
                        key={idx}
                        className={`mt-1 p-1 rounded text-xs ${event.type === 'ticket_raised' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}
                      >
                        <div className="font-bold">{event.client}</div>
                        {event.type === 'ticket_raised' ? 'Ticket: ' : 'Visit: '} {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCalendar;