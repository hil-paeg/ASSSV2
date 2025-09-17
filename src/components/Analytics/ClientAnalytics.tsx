// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   AreaChart,
//   Area,
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
// } from "recharts"
// import { Clock, Star, TicketIcon, TrendingUp, Users, CheckCircle, Calendar, Filter } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useAuth } from "@/contexts/AuthContext"
// import axios from "axios"
// import type { Ticket } from "@/types"

// const ClientAnalytics: React.FC = () => {
//   const { user } = useAuth()
//   const [selectedTicketType, setSelectedTicketType] = useState("RS1")
//   const [dateRange, setDateRange] = useState({ start: "", end: "" })
//   const [tickets, setTickets] = useState<Ticket[]>([])
//   const [isLoading, setIsLoading] = useState(true)


//   useEffect(() => {
//     const fetchTickets = async () => {
//       if (!user?.token) {
//         console.warn("No user or token available")
//         setTickets([])
//         setIsLoading(false)
//         return
//       }

//       setIsLoading(true)
//       try {
//         const response = await axios.get("/api/tickets", {
//           headers: { Authorization: `Bearer ${user.token}` },
//         })
//         const fetchedTickets = response.data.map((ticket: any) => ({
//           ...ticket,
//           id: ticket.ticket_id,
//           ticket_id: ticket.ticket_id,
//           userId: ticket.client_id,
//           client_id: ticket.client_id,
//           title: ticket.issue_title,
//           issue_title: ticket.issue_title,
//           ticketType: ticket.ticket_type,
//           ticket_type: ticket.ticket_type,
//           createdAt: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
//           created_at: ticket.created_at ? new Date(ticket.created_at).toISOString() : new Date().toISOString(),
//           updatedAt: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
//           updated_at: ticket.updated_at ? new Date(ticket.updated_at).toISOString() : new Date().toISOString(),
//           closed_at: ticket.closed_at ? new Date(ticket.closed_at).toISOString() : null,
//           clientClosed: Boolean(ticket.clientClosed),
//           adminClosed: Boolean(ticket.adminClosed),
//           out_of_scope: Boolean(ticket.out_of_scope),
//           close_ticket: ticket.close_ticket
//             ? {
//                 ...ticket.close_ticket,
//                 created_at: ticket.close_ticket.created_at
//                   ? new Date(ticket.close_ticket.created_at).toISOString()
//                   : new Date().toISOString(),
//               }
//             : undefined,
//         }))
//         console.log("Fetched tickets:", fetchedTickets)
//         setTickets(fetchedTickets)
//       } catch (error) {
//         console.error("Error fetching tickets:", error)
//         alert("Failed to fetch tickets.")
//         setTickets([])
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchTickets()
//   }, [user])

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <p className="text-blue-600">Loading analytics...</p>
//       </div>
//     )
//   }

//   if (!user || (user.role !== "client" && user.role !== "clientMember")) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
//         <p className="text-blue-600 mt-2">This page is only accessible to clients.</p>
//       </div>
//     )
//   }

//   // Filter tickets by date range and client
//   const filteredTickets = tickets.filter((ticket) => {
//     if (!dateRange.start || !dateRange.end) return true
//     const created = new Date(ticket.createdAt).getTime()
//     const start = new Date(dateRange.start).getTime()
//     const end = new Date(dateRange.end).getTime()
//     return created >= start && created <= end
//   })

//   // Calculate time saved from close_ticket
//   const timeSavedData = filteredTickets
//     .filter((ticket) => ticket.close_ticket?.time_saved != null)
//     .map((ticket) => ({
//       ticketId: ticket.ticket_id,
//       title: ticket.issue_title,
//       hours: ticket.close_ticket?.time_saved || 0,
//     }))

//   const totalTimeSaved = timeSavedData.reduce((sum, item) => sum + item.hours, 0)

//   // Calculate average rating from close_ticket
//   const ratings = filteredTickets
//     .filter((ticket) => ticket.close_ticket?.rating != null)
//     .map((ticket) => ticket.close_ticket?.rating || 0)
//   const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

//   // Calculate average response time
//   const responseTimes = filteredTickets
//     .filter((ticket) => ticket.status === "closed" && ticket.closed_at)
//     .map((ticket) => {
//       const created = new Date(ticket.createdAt).getTime()
//       const closed = new Date(ticket.closed_at!).getTime()
//       return (closed - created) / (1000 * 60 * 60) // Convert to hours
//     })
//   const averageResponseTime =
//     responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0

//   // Calculate ticket type statistics
//   const ticketTypes = ["RS1", "RS2", "RS3-1", "RS3-2"]
//   const ticketTypeStats: { [key: string]: { total: number; solved: number } } = {}

//   ticketTypes.forEach((type) => {
//     ticketTypeStats[type] = { total: 0, solved: 0 }
//   })

//   filteredTickets.forEach((ticket) => {
//     if (ticket.ticket_type && ticketTypes.includes(ticket.ticket_type)) {
//       ticketTypeStats[ticket.ticket_type].total++
//       if (ticket.status === "closed") {
//         ticketTypeStats[ticket.ticket_type].solved++
//       }
//     }
//   })

//   // Prepare data for horizontal bar chart
//   const ticketTypeChartData = ticketTypes.map((type) => ({
//     name: type,
//     solved: ticketTypeStats[type].solved,
//     unsolved: ticketTypeStats[type].total - ticketTypeStats[type].solved,
//   }))

//   // Calculate shift-based issue trends
//   const getShift = (createdAt: string): string => {
//     const date = new Date(createdAt)
//     const hours = date.getHours()
//     if (hours >= 6 && hours < 14) return "A"
//     if (hours >= 14 && hours < 22) return "B"
//     return "C"
//   }

//   const shiftData = filteredTickets.reduce(
//     (acc, ticket) => {
//       const shift = getShift(ticket.createdAt)
//       acc[shift] = (acc[shift] || 0) + 1
//       return acc
//     },
//     {} as { [key: string]: number },
//   )

//   const shiftChartData = [
//     { shift: "A (6AM-2PM)", tickets: shiftData["A"] || 0 },
//     { shift: "B (2PM-10PM)", tickets: shiftData["B"] || 0 },
//     { shift: "C (10PM-6AM)", tickets: shiftData["C"] || 0 },
//   ]

//   // Export data as CSV
//   const exportToCSV = () => {
//     const headers = [
//       "Ticket ID",
//       "Title",
//       "Shift",
//       "Time Saved (Hours)",
//       "Rating",
//       "Response Time (Hours)",
//       "Ticket Type",
//       "Status",
//     ]
//     const rows = filteredTickets.map((ticket) => {
//       const shift = getShift(ticket.createdAt)
//       const timeSaved = ticket.close_ticket?.time_saved || 0
//       const rating = ticket.close_ticket?.rating || "N/A"
//       const responseTime =
//         ticket.status === "closed" && ticket.closed_at
//           ? (new Date(ticket.closed_at).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60)
//           : 0
//       return [
//         ticket.ticket_id,
//         ticket.issue_title,
//         shift,
//         timeSaved,
//         rating,
//         responseTime.toFixed(1),
//         ticket.ticket_type,
//         ticket.status,
//       ]
//     })

//     const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
//     const link = document.createElement("a")
//     link.href = URL.createObjectURL(blob)
//     link.download = `analytics_${user.clientId || "client"}_${new Date().toISOString().split("T")[0]}.csv`
//     link.click()
//   }

//   return (
//     <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
//             Client Analytics
//           </h1>
//           <p className="text-slate-600 mt-2 font-medium">Comprehensive insights for your support tickets</p>
//         </div>

//         <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
//           <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm">
//             <div className="bg-blue-500 p-2 rounded-lg">
//               <Calendar className="h-4 w-4 text-white" />
//             </div>
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="flex flex-col">
//                 <label className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">From</label>
//                 <Input
//                   type="date"
//                   value={dateRange.start}
//                   onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
//                   className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg shadow-sm bg-white/80 text-sm min-w-[140px]"
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">To</label>
//                 <Input
//                   type="date"
//                   value={dateRange.end}
//                   onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
//                   className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg shadow-sm bg-white/80 text-sm min-w-[140px]"
//                 />
//               </div>
//             </div>
//           </div>

//           <Button
//             onClick={exportToCSV}
//             className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
//           >
//             <Filter className="h-4 w-4" />
//             Export CSV
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0 group hover:from-blue-100/80 hover:to-indigo-100/80">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 font-semibold">Total Time Saved</p>
//                 <p className="text-3xl font-bold text-slate-800 mt-1">{totalTimeSaved} h</p>
//                 <div className="flex items-center mt-2 text-xs text-emerald-600">
//                   <TrendingUp className="h-3 w-3 mr-1" />
//                   <span>Efficiency gained</span>
//                 </div>
//               </div>
//               <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
//                 <Clock className="h-6 w-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-amber-50 to-orange-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0 group hover:from-amber-100/80 hover:to-orange-100/80">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 font-semibold">Average Rating</p>
//                 <p className="text-3xl font-bold text-slate-800 mt-1">{averageRating.toFixed(1)}</p>
//                 <div className="flex items-center mt-2 text-xs text-amber-600">
//                   <Star className="h-3 w-3 mr-1 fill-current" />
//                   <span>Customer satisfaction</span>
//                 </div>
//               </div>
//               <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
//                 <Star className="h-6 w-6 text-white fill-current" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-emerald-50 to-teal-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0 group hover:from-emerald-100/80 hover:to-teal-100/80">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 font-semibold">Avg Response Time</p>
//                 <p className="text-3xl font-bold text-slate-800 mt-1">{averageResponseTime.toFixed(1)} h</p>
//                 <div className="flex items-center mt-2 text-xs text-teal-600">
//                   <CheckCircle className="h-3 w-3 mr-1" />
//                   <span>Resolution speed</span>
//                 </div>
//               </div>
//               <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
//                 <Clock className="h-6 w-6 text-white" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="bg-gradient-to-br from-slate-50 to-blue-50/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-slate-800 font-bold">Time Saved Trends</CardTitle>
//             <p className="text-sm text-slate-600">Hours saved per ticket over time</p>
//           </CardHeader>
//           <CardContent>
//             {timeSavedData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={timeSavedData}>
//                   <defs>
//                     <linearGradient id="timeSavedGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
//                   <XAxis
//                     dataKey="title"
//                     angle={0}
//                     textAnchor="middle"
//                     height={80}
//                     tick={{ fill: "#475569", fontSize: 11 }}
//                   />
//                   <YAxis
//                     label={{
//                       value: "Hours",
//                       angle: -90,
//                       position: "insideLeft",
//                       style: { textAnchor: "middle", fill: "#475569" },
//                     }}
//                     tick={{ fill: "#475569" }}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "rgba(255, 255, 255, 0.95)",
//                       borderColor: "#E2E8F0",
//                       borderRadius: "8px",
//                       boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
//                       backdropFilter: "blur(10px)",
//                     }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="hours"
//                     stroke="#3B82F6"
//                     strokeWidth={3}
//                     fill="url(#timeSavedGradient)"
//                     name="Time Saved"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center text-slate-500 py-8">
//                 <Clock className="h-12 w-12 mx-auto mb-3 text-slate-300" />
//                 <p>No time-saving tickets found for your account.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-slate-50 to-purple-50/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-slate-800 font-bold">Resolution by Ticket Type</CardTitle>
//             <p className="text-sm text-slate-600">Number of resolved tickets by type</p>
//           </CardHeader>
//           <CardContent>
//             {ticketTypeChartData.some((data) => data.solved > 0 || data.unsolved > 0) ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={ticketTypeChartData} layout="vertical">
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
//                   <XAxis
//                     type="number"
//                     tick={{ fill: "#475569", fontSize: 12 }}
//                     label={{
//                       value: "Tickets",
//                       position: "insideBottom",
//                       offset: -5,
//                       style: { textAnchor: "middle", fill: "#475569" },
//                     }}
//                   />
//                   <YAxis
//                     dataKey="name"
//                     type="category"
//                     tick={{ fill: "#475569", fontSize: 12 }}
//                     width={80}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "rgba(255, 255, 255, 0.95)",
//                       borderColor: "#E2E8F0",
//                       borderRadius: "8px",
//                       boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
//                       backdropFilter: "blur(10px)",
//                     }}
//                   />
//                   <Legend
//                     content={({ payload }) => (
//                       <div className="flex justify-center gap-6 mt-4">
//                         {payload?.map((entry, index) => (
//                           <div key={index} className="flex items-center gap-2">
//                             <div
//                               className="w-3 h-3 rounded-full"
//                               style={{ backgroundColor: entry.color }}
//                             ></div>
//                             <span className="text-sm font-medium text-slate-700">{entry.value}</span>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   />
//                   <Bar dataKey="solved" fill="#10B981" name="Solved" stackId="a" />
//                   <Bar dataKey="unsolved" fill="#EF4444" name="Unsolved" stackId="a" />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center text-slate-500 py-8">
//                 <TicketIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
//                 <p>No ticket data available.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-slate-50 to-green-50/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0 lg:col-span-2">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-slate-800 font-bold">Issue Trends by Shift</CardTitle>
//             <p className="text-sm text-slate-600">Ticket volume across different work shifts</p>
//           </CardHeader>
//           <CardContent>
//             {shiftChartData.some((data) => data.tickets > 0) ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={shiftChartData}>
//                   <defs>
//                     <linearGradient id="shiftGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
//                       <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
//                   <XAxis dataKey="shift" tick={{ fill: "#475569", fontSize: 12 }} />
//                   <YAxis
//                     label={{
//                       value: "Tickets",
//                       angle: -90,
//                       position: "insideLeft",
//                       style: { textAnchor: "middle", fill: "#475569" },
//                     }}
//                     tick={{ fill: "#475569" }}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "rgba(255, 255, 255, 0.95)",
//                       borderColor: "#E2E8F0",
//                       borderRadius: "8px",
//                       boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
//                       backdropFilter: "blur(10px)",
//                     }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="tickets"
//                     stroke="#10B981"
//                     strokeWidth={4}
//                     dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
//                     activeDot={{ r: 8, stroke: "#10B981", strokeWidth: 2, fill: "#fff" }}
//                     name="Tickets Raised"
//                   />
//                   <Area type="monotone" dataKey="tickets" stroke="transparent" fill="url(#shiftGradient)" />
//                 </LineChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-center text-slate-500 py-8">
//                 <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
//                 <p>No tickets found for your account in the selected date range.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default ClientAnalytics







"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts"
import { Clock, Star, TicketIcon, TrendingUp, Users, CheckCircle, Calendar, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import axios from "axios"
import type { Ticket } from "@/types"

const ClientAnalytics: React.FC = () => {
  const { user } = useAuth()
  const [selectedTicketType, setSelectedTicketType] = useState("RS1")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.token) {
        console.warn("No user or token available")
        setTickets([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await axios.get("/api/tickets", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
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
                created_at: ticket.close_ticket.created_at
                  ? new Date(ticket.close_ticket.created_at).toISOString()
                  : new Date().toISOString(),
              }
            : undefined,
        }))
        console.log("Fetched tickets:", fetchedTickets)
        setTickets(fetchedTickets)
      } catch (error) {
        console.error("Error fetching tickets:", error)
        alert("Failed to fetch tickets.")
        setTickets([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-blue-600">Loading analytics...</p>
      </div>
    )
  }

  if (!user || (user.role !== "client" && user.role !== "clientMember")) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Access Denied</h1>
        <p className="text-blue-600 mt-2">This page is only accessible to clients.</p>
      </div>
    )
  }

  // Filter tickets by date range and client
  const filteredTickets = tickets.filter((ticket) => {
    if (!dateRange.start || !dateRange.end) return true
    const created = new Date(ticket.createdAt).getTime()
    const start = new Date(dateRange.start).getTime()
    const end = new Date(dateRange.end).getTime()
    return created >= start && created <= end
  })

  // Calculate time saved from close_ticket
  const timeSavedData = filteredTickets
    .filter((ticket) => ticket.close_ticket?.time_saved != null)
    .map((ticket) => ({
      ticketId: ticket.ticket_id,
      title: ticket.issue_title,
      hours: ticket.close_ticket?.time_saved || 0,
    }))

  const totalTimeSaved = timeSavedData.reduce((sum, item) => sum + item.hours, 0)

  // Calculate average rating from close_ticket
  const ratings = filteredTickets
    .filter((ticket) => ticket.close_ticket?.rating != null)
    .map((ticket) => ticket.close_ticket?.rating || 0)
  const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

  // Calculate average response time
  const responseTimes = filteredTickets
    .filter((ticket) => ticket.status === "closed" && ticket.closed_at)
    .map((ticket) => {
      const created = new Date(ticket.createdAt).getTime()
      const closed = new Date(ticket.closed_at!).getTime()
      return (closed - created) / (1000 * 60 * 60) // Convert to hours
    })
  const averageResponseTime =
    responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0

  // Calculate ticket type statistics
  const ticketTypes = ["RS1", "RS2", "RS3-1", "RS3-2"]
  const ticketTypeStats: { [key: string]: { total: number; solved: number } } = {}

  ticketTypes.forEach((type) => {
    ticketTypeStats[type] = { total: 0, solved: 0 }
  })

  filteredTickets.forEach((ticket) => {
    if (ticket.ticket_type && ticketTypes.includes(ticket.ticket_type)) {
      ticketTypeStats[ticket.ticket_type].total++
      if (ticket.status === "closed") {
        ticketTypeStats[ticket.ticket_type].solved++
      }
    }
  })

  // Prepare data for horizontal bar chart
  const ticketTypeChartData = ticketTypes.map((type) => ({
    name: type,
    solved: ticketTypeStats[type].solved,
    unsolved: ticketTypeStats[type].total - ticketTypeStats[type].solved,
  }))

  // Prepare data for star rating chart (last 5 closed tickets)
  const lastFiveTickets = filteredTickets
    .filter((ticket) => ticket.status === "closed" && ticket.close_ticket?.rating != null)
    .sort((a, b) => new Date(b.closed_at!).getTime() - new Date(a.closed_at!).getTime())
    .slice(0, 5)
    .map((ticket) => ({
      ticketId: ticket.ticket_id,
      title: ticket.issue_title,
      rating: ticket.close_ticket?.rating || 0,
    }))
    .reverse() // Reverse to show oldest to newest in the chart

  // Calculate shift-based issue trends
  const getShift = (createdAt: string): string => {
    const date = new Date(createdAt)
    const hours = date.getHours()
    if (hours >= 6 && hours < 14) return "A"
    if (hours >= 14 && hours < 22) return "B"
    return "C"
  }

  const shiftData = filteredTickets.reduce(
    (acc, ticket) => {
      const shift = getShift(ticket.createdAt)
      acc[shift] = (acc[shift] || 0) + 1
      return acc
    },
    {} as { [key: string]: number },
  )

  const shiftChartData = [
    { shift: "A (6AM-2PM)", tickets: shiftData["A"] || 0 },
    { shift: "B (2PM-10PM)", tickets: shiftData["B"] || 0 },
    { shift: "C (10PM-6AM)", tickets: shiftData["C"] || 0 },
  ]

  // Export data as CSV
  const exportToCSV = () => {
    const headers = [
      "Ticket ID",
      "Title",
      "Shift",
      "Time Saved (Hours)",
      "Rating",
      "Response Time (Hours)",
      "Ticket Type",
      "Status",
    ]
    const rows = filteredTickets.map((ticket) => {
      const shift = getShift(ticket.createdAt)
      const timeSaved = ticket.close_ticket?.time_saved || 0
      const rating = ticket.close_ticket?.rating || "N/A"
      const responseTime =
        ticket.status === "closed" && ticket.closed_at
          ? (new Date(ticket.closed_at).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60)
          : 0
      return [
        ticket.ticket_id,
        ticket.issue_title,
        shift,
        timeSaved,
        rating,
        responseTime.toFixed(1),
        ticket.ticket_type,
        ticket.status,
      ]
    })

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `analytics_${user.clientId || "client"}_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
            Client Analytics
          </h1>
          <p className="text-slate-600 mt-2 font-medium">Comprehensive insights for your support tickets</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">From</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg shadow-sm bg-white/80 text-sm min-w-[140px]"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">To</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg shadow-sm bg-white/80 text-sm min-w-[140px]"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={exportToCSV}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0 group hover:from-blue-100/80 hover:to-indigo-100/80">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-semibold">Total Time Saved</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{totalTimeSaved} h</p>
                <div className="flex items-center mt-2 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Efficiency gained</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0 group hover:from-amber-100/80 hover:to-orange-100/80">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-semibold">Average Rating</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{averageRating.toFixed(1)}</p>
                <div className="flex items-center mt-2 text-xs text-amber-600">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  <span>Customer satisfaction</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Star className="h-6 w-6 text-white fill-current" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0 group hover:from-emerald-100/80 hover:to-teal-100/80">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-semibold">Avg Response Time</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{averageResponseTime.toFixed(1)} h</p>
                <div className="flex items-center mt-2 text-xs text-teal-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Resolution speed</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-50 to-blue-50/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-slate-800 font-bold">Time Saved Trends</CardTitle>
            <p className="text-sm text-slate-600">Hours saved per ticket over time</p>
          </CardHeader>
          <CardContent>
            {timeSavedData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSavedData}>
                  <defs>
                    <linearGradient id="timeSavedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="title"
                    angle={0}
                    textAnchor="middle"
                    height={80}
                    tick={{ fill: "#475569", fontSize: 11 }}
                  />
                  <YAxis
                    label={{
                      value: "Hours",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#475569" },
                    }}
                    tick={{ fill: "#475569" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderColor: "#E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#timeSavedGradient)"
                    name="Time Saved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <Clock className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No time-saving tickets found for your account.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-purple-50/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-slate-800 font-bold">Resolution by Ticket Type</CardTitle>
            <p className="text-sm text-slate-600">Number of resolved tickets by type</p>
          </CardHeader>
          <CardContent>
            {ticketTypeChartData.some((data) => data.solved > 0 || data.unsolved > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketTypeChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                  <XAxis
                    type="number"
                    tick={{ fill: "#475569", fontSize: 12 }}
                    label={{
                      value: "Tickets",
                      position: "insideBottom",
                      offset: -5,
                      style: { textAnchor: "middle", fill: "#475569" },
                    }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#475569", fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderColor: "#E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Legend
                    content={({ payload }) => (
                      <div className="flex justify-center gap-6 mt-4">
                        {payload?.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            ></div>
                            <span className="text-sm font-medium text-slate-700">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                  <Bar dataKey="solved" fill="#10B981" name="Solved" stackId="a" />
                  <Bar dataKey="unsolved" fill="#EF4444" name="Unsolved" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <TicketIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No ticket data available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-amber-50/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-slate-800 font-bold">Star Ratings for Last 5 Tickets</CardTitle>
            <p className="text-sm text-slate-600 py-1">Ratings for the most recent closed tickets</p>
          </CardHeader>
          <CardContent>
            {lastFiveTickets.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lastFiveTickets}>
                  <defs>
                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="title"
                    angle={0}
                    textAnchor="middle"
                    height={80}
                    tick={{ fill: "#475569", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 5]}
                    label={{
                      value: "Rating",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#475569" },
                    }}
                    tick={{ fill: "#475569" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderColor: "#E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#F59E0B"
                    strokeWidth={4}
                    dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#F59E0B", strokeWidth: 2, fill: "#fff" }}
                    name="Star Rating"
                  />
                  <Area
                    type="monotone"
                    dataKey="rating"
                    stroke="transparent"
                    fill="url(#ratingGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <Star className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No closed tickets with ratings available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-green-50/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-slate-800 font-bold">Issue Trends by Shift</CardTitle>
            <p className="text-sm text-slate-600 py-1">Ticket volume across different work shifts</p>
          </CardHeader>
          <CardContent>
            {shiftChartData.some((data) => data.tickets > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={shiftChartData}>
                  <defs>
                    <linearGradient id="shiftGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.5} />
                  <XAxis dataKey="shift" tick={{ fill: "#475569", fontSize: 12 }} />
                  <YAxis
                    label={{
                      value: "Tickets",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#475569" },
                    }}
                    tick={{ fill: "#475569" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderColor: "#E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    stroke="#10B981"
                    strokeWidth={4}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#10B981", strokeWidth: 2, fill: "#fff" }}
                    name="Tickets Raised"
                  />
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="transparent"
                    fill="url(#shiftGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No tickets found for your account in the selected date range.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ClientAnalytics