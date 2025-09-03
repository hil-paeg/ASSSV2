
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// const AdminCalendar: React.FC = () => {
//   const [currentWeek, setCurrentWeek] = useState(new Date());
//   const [view, setView] = useState<'week' | 'month'>('week');

//   // Reduced dummy data with 3 days per week, fewer site visits, and multiple events
//   const ticketOverviewData = {

//     '2025-07-22': { type: 'ticket_raised', title: 'Database Connection Error', client: 'Client B' },
//     '2025-07-23': { type: 'ticket_raised', title: 'Application Performance Issue', client: 'Client C' },
//     '2025-07-24': { type: 'site_visit', title: 'Server Room Maintenance', client: 'Tech Corp' },
//     '2025-07-25': { type: 'ticket_raised', title: 'Network Connectivity Issue', client: 'Client A' },
//   };

//   const calendarEvents = {
//     '2025-07-21': [
      
//       { type: 'ticket_raised', title: 'Email Server Issue', client: 'Client C' },
//     ],
//     '2025-07-22': [
//       { type: 'ticket_raised', title: 'Payment Gateway Error', client: 'Client A' },
//     ],
//     '2025-07-25': [
//       { type: 'ticket_raised', title: 'Software Crash', client: 'Client B' },
//     ],
//   };

//   const getWeekDays = (startDate: Date) => {
//     const week = [];
//     const start = new Date(startDate);
//     start.setDate(start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1)); // Start from Monday
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
//       day: 'numeric',
//       month: 'numeric'
//     });
//   };

//   const weekDays = getWeekDays(currentWeek);
//   const weekStart = weekDays[0];
//   const weekEnd = weekDays[6];

//   const getEventsForDay = (date: Date) => {
//     const dateKey = formatDate(date);
//     const baseEvent = ticketOverviewData[dateKey];
//     const additionalEvents = calendarEvents[dateKey] || [];
//     return baseEvent ? [baseEvent, ...additionalEvents] : additionalEvents;
//   };

//   const getMonthDays = (date: Date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const days = [];

//     const startDate = new Date(firstDay);
//     startDate.setDate(1 - firstDay.getDay());

//     while (startDate <= lastDay || startDate.getDay() !== 1) {
//       days.push(new Date(startDate));
//       startDate.setDate(startDate.getDate() + 1);
//     }

//     return days;
//   };

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               {view === 'week' ? 'Weekly Calendar View' : 'Monthly Calendar View'}
//             </CardTitle>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setView('week')}
//                 >
//                   Week View
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setView('month')}
//                 >
//                   Month View
//                 </Button>
//               </div>
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
//           {view === 'week' ? (
//             <div className="border rounded-lg overflow-hidden">
//               <div className="grid grid-cols-8 bg-gray-100 text-sm font-medium">
//                 <div className="p-2"></div>
//                 {weekDays.map((day, index) => (
//                   <div key={index} className="p-2 text-center border-b">
//                     {formatDisplayDate(day).split(' ')[0]}
//                     <br />
//                     {day.getDate()}
//                   </div>
//                 ))}
//               </div>
//               <div className="grid grid-cols-8 h-[600px]">
//                 <div className="border-r">
//                   {Array.from({ length: 24 }, (_, i) => i).map(hour => (
//                     <div key={hour} className="h-24 border-b flex items-center pl-2 text-sm">
//                       {hour}:00
//                     </div>
//                   ))}
//                 </div>
//                 {weekDays.map((day, dayIndex) => {
//                   const events = getEventsForDay(day);
//                   const isToday = day.toDateString() === new Date().toDateString();
//                   return (
//                     <div key={dayIndex} className={`border-r h-full relative ${isToday ? 'bg-blue-50' : ''}`}>
//                       {events.map((event, idx) => (
//                         <div
//                           key={idx}
//                           className={`absolute p-2 rounded shadow-md text-xs ${event.type === 'ticket_raised' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}
//                           style={{ top: `${10 + idx * 80}px`, width: '90%', minHeight: '60px' }}
//                         >
//                           <div className="font-bold">{event.client}</div>
//                           <div>{event.type === 'ticket_raised' ? 'Ticket: ' : 'Visit: '} {event.title}</div>
//                         </div>
//                       ))}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-7 gap-1">
//               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                 <div key={day} className="text-center font-medium p-2 bg-gray-100">
//                   {day}
//                 </div>
//               ))}
//               {getMonthDays(currentWeek).map((day, index) => {
//                 const dateKey = formatDate(day);
//                 const events = getEventsForDay(day);
//                 const isToday = day.toDateString() === new Date().toDateString();
//                 const isCurrentMonth = day.getMonth() === currentWeek.getMonth();

//                 return (
//                   <div
//                     key={index}
//                     className={`border my-2 p-2 min-h-[100px] ${isToday ? 'bg-blue-100' : ''} ${!isCurrentMonth ? 'text-gray-400' : ''}`}
//                   >
//                     <div className={`text-sm font-medium ${events.length > 0 ? 'font-bold' : ''}`}>
//                       {day.getDate()}
//                     </div>
//                     {events.map((event, idx) => (
//                       <div
//                         key={idx}
//                         className={`mt-1 p-1 rounded text-xs ${event.type === 'ticket_raised' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}
//                       >
//                         <div className="font-bold">{event.client}</div>
//                         {event.type === 'ticket_raised' ? 'Ticket: ' : 'Visit: '} {event.title}
//                       </div>
//                     ))}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminCalendar;





// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// interface CalendarEvent {
//   date: string;
//   type: 'ticket_raised' | 'site_visit';
//   title: string;
//   client: string;
// }

// const AdminCalendar: React.FC = () => {
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [events, setEvents] = useState<CalendarEvent[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch ticket and site visit data
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         // Fetch tickets
//         const ticketsResponse = await fetch('/api/tickets');
//         const ticketsData = await ticketsResponse.json();
//         // Fetch site visits
//         const siteVisitsResponse = await fetch('/api/site-visits');
//         const siteVisitsData = await siteVisitsResponse.json();

//         // Combine events
//         const ticketEvents: CalendarEvent[] = ticketsData.map((ticket: any) => ({
//           date: ticket.created_at.split('T')[0],
//           type: 'ticket_raised' as const,
//           title: ticket.issue_title,
//           client: ticket.client?.client_username || 'Unknown',
//         }));

//         const siteVisitEvents: CalendarEvent[] = siteVisitsData.map((visit: any) => ({
//           date: visit.date.split('T')[0],
//           type: 'site_visit' as const,
//           title: 'Site Visit',
//           client: visit.contract?.client?.client_username || 'Unknown',
//         }));

//         setEvents([...ticketEvents, ...siteVisitEvents]);
//       } catch (error) {
//         console.error('Error fetching calendar events:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const getMonthDays = (date: Date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const days: Date[] = [];

//     // Start from the first Sunday before the first day of the month
//     const startDate = new Date(firstDay);
//     startDate.setDate(1 - firstDay.getDay());

//     // Add days until the end of the month or the next Sunday
//     while (startDate <= lastDay || startDate.getDay() !== 0) {
//       days.push(new Date(startDate));
//       startDate.setDate(startDate.getDate() + 1);
//     }

//     return days;
//   };

//   const navigateMonth = (direction: 'prev' | 'next') => {
//     const newMonth = new Date(currentMonth);
//     newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
//     setCurrentMonth(newMonth);
//   };

//   const formatDate = (date: Date) => {
//     return date.toISOString().split('T')[0];
//   };

//   const getEventsForDay = (date: Date) => {
//     const dateKey = formatDate(date);
//     return events.filter((event) => event.date === dateKey);
//   };

//   const monthDays = getMonthDays(currentMonth);

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               Monthly Calendar View
//             </CardTitle>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600">
//                 {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//               </span>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
//                   Today
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div>Loading...</div>
//           ) : (
//             <div className="grid grid-cols-7 gap-1">
//               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//                 <div key={day} className="text-center font-medium p-2 bg-gray-100">
//                   {day}
//                 </div>
//               ))}
//               {monthDays.map((day, index) => {
//                 const dateKey = formatDate(day);
//                 const events = getEventsForDay(day);
//                 const isToday = day.toDateString() === new Date().toDateString();
//                 const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

//                 return (
//                   <div
//                     key={index}
//                     className={`border my-2 p-2 min-h-[100px] ${isToday ? 'bg-blue-100' : ''} ${
//                       !isCurrentMonth ? 'text-gray-400' : ''
//                     }`}
//                   >
//                     <div className={`text-sm font-medium ${events.length > 0 ? 'font-bold' : ''}`}>
//                       {day.getDate()}
//                     </div>
//                     {events.map((event, idx) => (
//                       <div
//                         key={idx}
//                         className={`mt-1 p-1 rounded text-xs ${
//                           event.type === 'ticket_raised' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
//                         }`}
//                       >
//                         <div className="font-bold">{event.client}</div>
//                         {event.type === 'ticket_raised' ? 'Ticket: ' : 'Visit: '} {event.title}
//                       </div>
//                     ))}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminCalendar;

import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
interface CalendarEvent {
  date: string;
  type: 'ticket_raised' | 'site_visit';
  title: string;
  client: string;
}

const AdminCalendar: React.FC = () => {
    const { user, isLoading: authLoading } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.token) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch tickets
        const ticketsResponse = await fetch('/api/tickets', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!ticketsResponse.ok) {
          throw new Error(`Tickets fetch failed: ${ticketsResponse.statusText}`);
        }
        const ticketsData = await ticketsResponse.json();

        // Fetch site visits
        const siteVisitsResponse = await fetch('/api/site-visits', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!siteVisitsResponse.ok) {
          throw new Error(`Site visits fetch failed: ${siteVisitsResponse.statusText}`);
        }
        const siteVisitsData = await siteVisitsResponse.json();

        // Combine events
        const ticketEvents: CalendarEvent[] = ticketsData.map((ticket: any) => ({
          date: new Date(ticket.created_at).toISOString().split('T')[0],
          type: 'ticket_raised' as const,
          title: ticket.issue_title,
          client: ticket.client?.client_username || 'Unknown',
        }));

        const siteVisitEvents: CalendarEvent[] = siteVisitsData.map((visit: any) => ({
          date: new Date(visit.date).toISOString().split('T')[0],
          type: 'site_visit' as const,
          title: 'Site Visit',
          client: visit.contract?.client?.client_username || 'Unknown',
        }));

        setEvents([...ticketEvents, ...siteVisitEvents]);
      } catch (err: any) {
        console.error('Error fetching calendar events:', err);
        setError('Failed to load calendar events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user?.token]);

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    const startDate = new Date(firstDay);
    startDate.setDate(1 - firstDay.getDay());

    while (startDate <= lastDay || startDate.getDay() !== 0) {
      days.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDay = (date: Date) => {
    const dateKey = formatDate(date);
    return events.filter((event) => event.date === dateKey);
  };

  const monthDays = getMonthDays(currentMonth);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Calendar View
            </CardTitle>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-medium p-2 bg-gray-100">
                  {day}
                </div>
              ))}
              {monthDays.map((day, index) => {
                const dateKey = formatDate(day);
                const events = getEventsForDay(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

                return (
                  <div
                    key={index}
                    className={`border my-2 p-2 min-h-[100px] ${isToday ? 'bg-blue-100' : ''} ${
                      !isCurrentMonth ? 'text-gray-400' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium ${events.length > 0 ? 'font-bold' : ''}`}>
                      {day.getDate()}
                    </div>
                    {events.map((event, idx) => (
                      <div
                        key={idx}
                        className={`mt-1 p-1 rounded text-xs ${
                          event.type === 'ticket_raised' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                        }`}
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