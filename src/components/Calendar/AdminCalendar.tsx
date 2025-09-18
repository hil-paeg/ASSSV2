// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// interface CalendarEvent {
//   date: string;
//   type: 'ticket_raised' | 'site_visit';
//   title: string;
//   client: string;
// }

// const AdminCalendar: React.FC = () => {
//   const { user } = useAuth();
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [events, setEvents] = useState<CalendarEvent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // ✅ helper for YYYY-MM-DD in local time
//   const formatLocalDate = (date: Date) =>
//     `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
//       date.getDate()
//     ).padStart(2, '0')}`;

//   useEffect(() => {
//     const fetchEvents = async () => {
//       if (!user?.token) {
//         setError('Not authenticated. Please log in.');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch tickets
//         const ticketsResponse = await fetch('/api/tickets', {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         if (!ticketsResponse.ok) {
//           throw new Error(`Tickets fetch failed: ${ticketsResponse.statusText}`);
//         }
//         const ticketsData = await ticketsResponse.json();

//         // Fetch site visits
//         const siteVisitsResponse = await fetch('/api/site-visits', {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         if (!siteVisitsResponse.ok) {
//           throw new Error(`Site visits fetch failed: ${siteVisitsResponse.statusText}`);
//         }
//         const siteVisitsData = await siteVisitsResponse.json();

//         // Combine events
//         const ticketEvents: CalendarEvent[] = ticketsData.map((ticket: any) => ({
//           date: formatLocalDate(new Date(ticket.created_at)), // ✅ fixed (no UTC shift)
//           type: 'ticket_raised' as const,
//           title: ticket.issue_title,
//           client: ticket.client?.client_username || 'Unknown',
//         }));

//         const siteVisitEvents: CalendarEvent[] = siteVisitsData.map((visit: any) => ({
//           date: formatLocalDate(new Date(visit.date)), // ✅ consistent with local time
//           type: 'site_visit' as const,
//           title: 'Site Visit',
//           client: visit.contract?.client?.client_username || 'Unknown',
//         }));

//         setEvents([...ticketEvents, ...siteVisitEvents]);
//       } catch (err: any) {
//         console.error('Error fetching calendar events:', err);
//         setError('Failed to load calendar events. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, [user?.token]);

//   const getMonthDays = (date: Date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const days: Date[] = [];

//     const startDate = new Date(firstDay);
//     startDate.setDate(1 - firstDay.getDay());

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

//   const formatDate = (date: Date) => formatLocalDate(date);

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
//           ) : error ? (
//             <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
//           ) : (
//             <div className="grid grid-cols-7 gap-1">
//               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//                 <div key={day} className="text-center font-medium p-2 bg-gray-100">
//                   {day}
//                 </div>
//               ))}
//               {monthDays.map((day, index) => {
//                 const dateKey = formatDate(day);
//                 const dayEvents = getEventsForDay(day);
//                 const isToday = day.toDateString() === new Date().toDateString();
//                 const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

//                 return (
//                   <div
//                     key={index}
//                     className={`border my-2 p-2 min-h-[100px] ${isToday ? 'bg-blue-100' : ''} ${
//                       !isCurrentMonth ? 'text-gray-400' : ''
//                     }`}
//                   >
//                     <div className={`text-sm font-medium ${dayEvents.length > 0 ? 'font-bold' : ''}`}>
//                       {day.getDate()}
//                     </div>
//                     {dayEvents.map((event, idx) => (
//                       <div
//                         key={idx}
//                         className={`mt-1 p-1 rounded text-xs ${
//                           event.type === 'ticket_raised'
//                             ? 'bg-red-200 text-red-800'
//                             : 'bg-green-200 text-green-800'
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






import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface CalendarEvent {
  id?: number;
  date: string;
  type: 'ticket_raised' | 'site_visit';
  title: string;
  client: string;
}

const AdminCalendar: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ helper for YYYY-MM-DD in local time
  const formatLocalDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;

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
          id: ticket.ticket_id,
          date: formatLocalDate(new Date(ticket.created_at)), // ✅ fixed (no UTC shift)
          type: 'ticket_raised' as const,
          title: ticket.issue_title,
          client: ticket.client?.client_username || 'Unknown',
        }));

        const siteVisitEvents: CalendarEvent[] = siteVisitsData.map((visit: any) => ({
          date: formatLocalDate(new Date(visit.date)), // ✅ consistent with local time
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

  const formatDate = (date: Date) => formatLocalDate(date);

  const getEventsForDay = (date: Date) => {
    const dateKey = formatDate(date);
    return events.filter((event) => event.date === dateKey);
  };

  const monthDays = getMonthDays(currentMonth);

  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'ticket_raised' && event.id) {
      router.push(`/tickets?ticketId=${event.id}`);
    }
  };

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
                const dayEvents = getEventsForDay(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

                return (
                  <div
                    key={index}
                    className={`border my-2 p-2 min-h-[100px] ${isToday ? 'bg-blue-100' : ''} ${
                      !isCurrentMonth ? 'text-gray-400' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium ${dayEvents.length > 0 ? 'font-bold' : ''}`}>
                      {day.getDate()}
                    </div>
                    {dayEvents.map((event, idx) => {
                      const isTicketEvent = event.type === 'ticket_raised';
                      const eventClass = `mt-1 p-1 rounded text-xs ${
                        isTicketEvent
                          ? 'bg-red-200 text-red-800 cursor-pointer hover:bg-red-300'
                          : 'bg-green-200 text-green-800'
                      }`;

                      return (
                        <div
                          key={idx}
                          className={eventClass}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="font-bold">{event.client}</div>
                          {isTicketEvent ? 'Ticket: ' : 'Visit: '} {event.title}
                        </div>
                      );
                    })}
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