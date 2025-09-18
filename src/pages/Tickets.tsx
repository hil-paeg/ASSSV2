
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Search,
//   Plus,
//   Filter,
//   Star,
//   User,
//   Calendar,
//   Activity,
//   AlertCircle,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   BarChart3,
//   Loader2,
// } from "lucide-react"
// import { FileText, Shield, CheckCircle, CloudIcon as ClosedIcon } from "lucide-react"
// import { useAuth } from "@/contexts/AuthContext"
// import { Badge } from "@/components/ui/badge"
// import { StatusTracker } from "@/components/Tickets/StatusTracker"
// import TicketDetailsModal from "@/components/Tickets/TicketDetailsModal"
// import { useRouter } from "next/navigation"
// import axios from "axios"
// import type { Ticket } from "@/types"

// interface Feedback {
//   experience: string
//   rating: number
//   timeAmount: string
// }

// interface Client {
//   client_id: number
//   client_username: string
//   name: string
// }

// type TicketStatus = "raised" | "confirmed by oem" | "resolved" | "closed"

// const Tickets = () => {
//   const { user } = useAuth()
//   const router = useRouter()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [clientFilter, setClientFilter] = useState("all")
//   const [tickets, setTickets] = useState<Ticket[]>([])
//   const [clients, setClients] = useState<Client[]>([])
//   const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
//   const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
//   const [isAdminSummaryModalOpen, setIsAdminSummaryModalOpen] = useState(false)
//   const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
//   const [updateTicket, setUpdateTicket] = useState<Ticket | null>(null)
//   const [comments, setComments] = useState("")
//   const [ticketType, setTicketType] = useState("")
//   const [feedback, setFeedback] = useState<Feedback>({
//     experience: "",
//     rating: 0,
//     timeAmount: "",
//   })
//   const [adminSummary, setAdminSummary] = useState("")
//   const [adminAttachment, setAdminAttachment] = useState<File | null>(null)
//   const [adminOutOfScope, setAdminOutOfScope] = useState(false)
//   const [adminOutOfScopeReason, setAdminOutOfScopeReason] = useState("")
//   const [isLoading, setIsLoading] = useState({
//     updateStatus: false,
//     feedbackSubmit: false,
//     adminSummarySubmit: false,
//     clients: false,
//   })

//   const getStatusIcon = (status: string) => {
//     const iconClass = "h-4 w-4 bg-emerald-500 rounded-full p-0.5 text-white"
//     switch (status) {
//       case "raised":
//         return <FileText className={iconClass} />
//       case "confirmed by oem":
//         return <Shield className={iconClass} />
//       case "resolved":
//         return <CheckCircle className={iconClass} />
//       case "closed":
//         return <ClosedIcon className={iconClass} />
//       default:
//         return <FileText className={iconClass} />
//     }
//   }

//   const getNextStatusText = (currentStatus: string) => {
//     switch (currentStatus) {
//       case "raised":
//         return "Update to Confirmed by OEM"
//       case "confirmed by oem":
//         return "Update to Resolved"
//       case "resolved":
//         return "Update to Closed"
//       default:
//         return "Update Status"
//     }
//   }

//   useEffect(() => {
//     const fetchTickets = async () => {
//       if (!user || !user.token) {
//         console.warn("No user or token available")
//         setTickets([])
//         router.push("/")
//         return
//       }

//       try {
//         const response = await axios.get("/api/tickets", {
//           headers: { Authorization: `Bearer ${user.token}` },
//         })
//         console.log("Fetched tickets:", response.data)
//         const mappedTickets = response.data.map((ticket: any) => ({
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
//         }))
//         setTickets(mappedTickets.sort((a: Ticket, b: Ticket) => 
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         ))
//       } catch (error) {
//         console.error("Error fetching tickets:", error)
//         alert("Failed to fetch tickets.")
//         setTickets([])
//       }
//     }

//     const fetchClients = async () => {
//       if (user?.role !== "admin" || !user?.token) return

//       setIsLoading((prev) => ({ ...prev, clients: true }))
//       try {
//         const response = await axios.get("/api/clients", {
//           headers: { Authorization: `Bearer ${user.token}` },
//         })
//         setClients(response.data.map((client: any) => ({
//           client_id: client.client_id,
//           client_username: client.client_username,
//           name: client.name,
//         })))
//       } catch (error) {
//         console.error("Error fetching clients:", error)
//         alert("Failed to fetch clients.")
//       } finally {
//         setIsLoading((prev) => ({ ...prev, clients: false }))
//       }
//     }

//     fetchTickets()
//     fetchClients()
//   }, [user, router])

//   const getPriorityColor = (priority: string | null) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-100 text-red-800 border-red-200"
//       case "medium":
//         return "bg-blue-100 text-blue-800 border-blue-200"
//       case "low":
//         return "bg-green-100 text-green-800 border-green-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "raised":
//         return "bg-blue-50 text-blue-700 border-blue-200"
//       case "confirmed by oem":
//         return "bg-purple-50 text-purple-700 border-purple-200"
//       case "resolved":
//         return "bg-green-50 text-green-700 border-green-200"
//       case "closed":
//         return "bg-gray-50 text-gray-700 border-gray-200"
//       default:
//         return "bg-gray-50 text-gray-700 border-gray-200"
//     }
//   }

//   const handleViewDetails = (ticket: Ticket) => {
//     setSelectedTicket(ticket)
//     setIsTicketModalOpen(true)
//   }

//   const handleUpdateStatus = (ticket: Ticket) => {
//     setUpdateTicket(ticket)
//     setComments(ticket.comments || "")
//     setTicketType(ticket.ticket_type || "")
//     setIsUpdateModalOpen(true)
//   }

//   const handleCloseTicket = async (ticket: Ticket, role: "admin" | "client" | "clientMember") => {
//     if (role === "admin") {
//       if (ticket.status !== "confirmed by oem" && ticket.status !== "resolved" && ticket.status !== "closed") {
//         alert("Cannot close ticket: Ticket must be at least in 'confirmed by oem' stage.")
//         return
//       }
//       setUpdateTicket(ticket)
//       setAdminSummary(ticket.summary || "")
//       setAdminAttachment(null)
//       setAdminOutOfScope(ticket.out_of_scope)
//       setAdminOutOfScopeReason(ticket.out_of_scope_reason || "")
//       setIsAdminSummaryModalOpen(true)
//     } else {
//       if (ticket.out_of_scope) {
//         alert("Cannot close ticket: Ticket is marked out of scope and can only be closed by admin.")
//         return
//       }
//       if (ticket.status !== "resolved") {
//         alert("Cannot close ticket: Ticket must be resolved first.")
//         return
//       }
//       setUpdateTicket(ticket)
//       setFeedback({ experience: "", rating: 0, timeAmount: "" })
//       setIsFeedbackModalOpen(true)
//     }
//   }

//   const handleStatusUpdate = async () => {
//     if (!updateTicket || !user?.token) return

//     if (updateTicket.status === "raised" && !ticketType) {
//       alert("Please select a ticket type before confirming.")
//       return
//     }

//     setIsLoading((prev) => ({ ...prev, updateStatus: true }))
//     try {
//       const newStatus: TicketStatus =
//         updateTicket.status === "raised"
//           ? "confirmed by oem"
//           : updateTicket.status === "confirmed by oem"
//             ? "resolved"
//             : updateTicket.status === "resolved"
//               ? "closed"
//               : updateTicket.status
//       const response = await axios.put(
//         `/api/tickets?id=${updateTicket.ticket_id}`,
//         { status: newStatus, comments, ticket_type: ticketType },
//         { headers: { Authorization: `Bearer ${user.token}` } },
//       )
//       setTickets(
//         tickets.map((t) =>
//           t.ticket_id === updateTicket.ticket_id
//             ? {
//                 ...t,
//                 status: newStatus,
//                 comments,
//                 ticket_type: ticketType,
//                 ticketType: ticketType,
//                 updated_at: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//               }
//             : t,
//         ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//       )
//       setIsUpdateModalOpen(false)
//       setComments("")
//       setTicketType("")
//     } catch (error) {
//       console.error("Error updating ticket:", error)
//       alert("Failed to update ticket status.")
//     } finally {
//       setIsLoading((prev) => ({ ...prev, updateStatus: false }))
//     }
//   }

//   const handleAdminSummarySubmit = async () => {
//     if (!updateTicket || !user?.token || !adminSummary.trim()) return

//     setIsLoading((prev) => ({ ...prev, adminSummarySubmit: true }))
//     try {
//       const formData = new FormData()
//       formData.append("summary", adminSummary)
//       formData.append("out_of_scope", adminOutOfScope.toString())
//       if (adminOutOfScope) formData.append("out_of_scope_reason", adminOutOfScopeReason)
//       if (adminAttachment) formData.append("attachment", adminAttachment)

//       const response = await axios.post(`/api/tickets?action=close&id=${updateTicket.ticket_id}`, formData, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       })

//       setTickets(
//         tickets.map((t) =>
//           t.ticket_id === updateTicket.ticket_id
//             ? {
//                 ...t,
//                 adminClosed: true,
//                 summary: adminSummary,
//                 attachments: adminAttachment
//                   ? t.attachments
//                     ? `${t.attachments},${adminAttachment.name}`
//                     : adminAttachment.name
//                   : t.attachments,
//                 out_of_scope: adminOutOfScope,
//                 out_of_scope_reason: adminOutOfScope ? adminOutOfScopeReason : null,
//                 status: t.clientClosed && !adminOutOfScope ? "closed" : t.status as TicketStatus,
//                 updated_at: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//                 closed_at: t.clientClosed && !adminOutOfScope ? new Date().toISOString() : t.closed_at,
//               }
//             : t,
//         ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//       )
//       setIsAdminSummaryModalOpen(false)
//       setAdminSummary("")
//       setAdminAttachment(null)
//       setAdminOutOfScope(false)
//       setAdminOutOfScopeReason("")
//     } catch (error) {
//       console.error("Error closing ticket:", error)
//       alert("Failed to close ticket.")
//     } finally {
//       setIsLoading((prev) => ({ ...prev, adminSummarySubmit: false }))
//     }
//   }

//   const handleFeedbackSubmit = async () => {
//     if (!updateTicket || !user?.token || !feedback.experience.trim() || feedback.rating === 0) return

//     setIsLoading((prev) => ({ ...prev, feedbackSubmit: true }))
//     try {
//       const response = await axios.post(
//         `/api/tickets?action=close&id=${updateTicket.ticket_id}`,
//         {
//           experience: feedback.experience,
//           rating: feedback.rating,
//           time_saved: feedback.timeAmount ? Number.parseInt(feedback.timeAmount) : null,
//         },
//         { headers: { Authorization: `Bearer ${user.token}` } },
//       )
//       setTickets(
//         tickets.map((t) =>
//           t.ticket_id === updateTicket.ticket_id
//             ? {
//                 ...t,
//                 clientClosed: true,
//                 status: t.adminClosed && !t.out_of_scope ? "closed" : t.status as TicketStatus,
//                 updated_at: new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//                 closed_at: t.adminClosed && !t.out_of_scope ? new Date().toISOString() : t.closed_at,
//               }
//             : t,
//         ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//       )
//       setIsFeedbackModalOpen(false)
//       setFeedback({ experience: "", rating: 0, timeAmount: "" })
//     } catch (error) {
//       console.error("Error submitting feedback:", error)
//       alert("Failed to submit feedback.")
//     } finally {
//       setIsLoading((prev) => ({ ...prev, feedbackSubmit: false }))
//     }
//   }

//   const filteredTickets = tickets.filter((ticket) => {
//     const matchesSearch =
//       ticket.issue_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
//     const matchesClient = clientFilter === "all" || ticket.client?.client_username === clientFilter
//     return matchesSearch && matchesStatus && matchesClient
//   })

//   const totalTickets = tickets.length
//   const closedTickets = tickets.filter((t) => t.status === "closed").length
//   const resolvedTickets = tickets.filter((t) => t.status === "resolved").length
//   const openTickets = totalTickets - closedTickets
//   const inProgressTickets = tickets.filter((t) => t.status === "confirmed by oem").length

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto p-6 space-y-6">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="p-6 space-y-6">
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//               <div className="space-y-2">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-600 rounded-lg">
//                     <BarChart3 className="h-6 w-6 text-white" />
//                   </div>
//                   <div>
//                     <h1 className="text-2xl font-semibold text-gray-900">
//                       {user?.role === "admin" ? "Ticket Management" : "My Support Center"}
//                     </h1>
//                     <p className="text-gray-600">
//                       {user?.role === "admin"
//                         ? "Monitor and manage all support requests"
//                         : "Track your support requests and their progress"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {(user?.role === "client" || user?.role === "clientMember") && (
//                 <Button
//                   onClick={() => router.push("/tickets/new")}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create New Ticket
//                 </Button>
//               )}
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium text-blue-700">Total Tickets</CardTitle>
//                   <div className="p-2 bg-blue-500 rounded-lg">
//                     <Activity className="h-4 w-4 text-white" />
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-semibold text-blue-900">{totalTickets}</div>
//                   <p className="text-xs text-blue-600 mt-1">All time</p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium text-orange-700">Open Tickets</CardTitle>
//                   <div className="p-2 bg-orange-500 rounded-lg">
//                     <AlertCircle className="h-4 w-4 text-white" />
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-semibold text-orange-900">{openTickets}</div>
//                   <p className="text-xs text-orange-600 mt-1">Pending resolution</p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium text-green-700">Resolved</CardTitle>
//                   <div className="p-2 bg-green-500 rounded-lg">
//                     <CheckCircle2 className="h-4 w-4 text-white" />
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-semibold text-green-900">{resolvedTickets}</div>
//                   <p className="text-xs text-green-600 mt-1">Ready to close</p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium text-gray-700">Closed</CardTitle>
//                   <div className="p-2 bg-gray-500 rounded-lg">
//                     <XCircle className="h-4 w-4 text-white" />
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-semibold text-gray-900">{closedTickets}</div>
//                   <p className="text-xs text-gray-600 mt-1">Completed</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>

//         <Card className="bg-white border border-gray-200 shadow-sm">
//           <CardContent className="p-4">
//             <div className="flex flex-col lg:flex-row gap-4 items-center">
//               <div className="flex-1 w-full relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                 <Input
//                   placeholder="Search tickets by title or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="flex gap-3 w-full lg:w-auto">
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-full lg:w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="raised">Raised</SelectItem>
//                     <SelectItem value="confirmed by oem">Confirmed by OEM</SelectItem>
//                     <SelectItem value="resolved">Resolved</SelectItem>
//                     <SelectItem value="closed">Closed</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {user?.role === "admin" && (
//                   <Select value={clientFilter} onValueChange={setClientFilter}>
//                     <SelectTrigger className="w-full lg:w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
//                       <SelectValue placeholder="Filter by client" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Clients</SelectItem>
//                       {isLoading.clients ? (
//                         <SelectItem value="loading" disabled>
//                           <span className="flex items-center gap-2">
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                             Loading clients...
//                           </span>
//                         </SelectItem>
//                       ) : (
//                         clients.map((client) => (
//                           <SelectItem key={client.client_id} value={client.client_username}>
//                             {client.client_username}
//                           </SelectItem>
//                         ))
//                       )}
//                     </SelectContent>
//                   </Select>
//                 )}
//                 <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50 bg-transparent">
//                   <Filter className="h-4 w-4 text-gray-600" />
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="space-y-4">
//           {filteredTickets.map((ticket) => (
//             <Card
//               key={ticket.ticket_id}
//               className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
//             >
//               <div
//                 className={`h-1 w-full ${ticket.priority === "high" ? "bg-red-500" : ticket.priority === "medium" ? "bg-blue-500" : ticket.priority === "low" ? "bg-green-500" : "bg-gray-400"}`}
//               />
//               <CardContent className="p-4">
//                 <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
//                   <div className="flex-1 space-y-3">
//                     <div className="space-y-2">
//                       <div className="flex items-start flex-wrap gap-3">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-lg font-semibold text-gray-900">#{ticket.ticket_id}</h3>
//                           <p className="text-gray-700 font-medium">{ticket.issue_title}</p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Badge
//                             className={`text-xs font-medium px-2 py-1 border ${getPriorityColor(ticket.priority)}`}
//                           >
//                             {ticket.priority?.toUpperCase() || "UNKNOWN"} PRIORITY
//                           </Badge>
//                           <Badge
//                             className={`text-xs font-medium px-2 py-1 border flex items-center gap-1 ${getStatusColor(ticket.status || "unknown")}`}
//                           >
//                             {getStatusIcon(ticket.status || "unknown")}
//                             {ticket.status?.toUpperCase() || "UNKNOWN"}
//                           </Badge>
//                         </div>
//                       </div>

//                       <div className="flex items-center flex-wrap gap-2">
//                         {user?.role === "admin" && ticket.client?.client_username && (
//                           <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 border border-gray-200 rounded-md">
//                             <User className="h-3 w-3" />
//                             {ticket.client.client_username}
//                           </span>
//                         )}
//                         {ticket.out_of_scope && (
//                           <Badge className="text-xs bg-purple-100 text-purple-800 border border-purple-200">
//                             Out of Scope
//                           </Badge>
//                         )}
//                         {ticket.ticket_type && (
//                           <Badge className="text-xs bg-teal-100 text-teal-800 border border-teal-200">
//                             {ticket.ticket_type}
//                           </Badge>
//                         )}
//                       </div>
//                     </div>

//                     <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
//                       <p className="text-sm text-gray-700 leading-relaxed">
//                         {ticket.description || "No description provided"}
//                       </p>
//                     </div>

//                     <div className="bg-white p-3 rounded-md border border-gray-200">
//                       <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
//                         Progress Tracker
//                       </h4>
//                       <StatusTracker
//                         status={ticket.status as "raised" | "confirmed by oem" | "resolved" | "closed"}
//                         priority={ticket.priority || "medium"}
//                         createdAt={ticket.created_at}
//                       />
//                     </div>

//                     <div className="flex flex-wrap gap-4 text-xs text-gray-600">
//                       <span className="flex items-center gap-1">
//                         <Calendar className="h-3 w-3" />
//                         <span className="font-medium">Created:</span>
//                         {new Date(ticket.created_at).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Clock className="h-3 w-3" />
//                         <span className="font-medium">Updated:</span>
//                         {new Date(ticket.updated_at).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                       {ticket.attachments && (
//                         <span className="flex items-center gap-1">
//                           <span className="font-medium">Attachments:</span>
//                           {ticket.attachments}
//                         </span>
//                       )}
//                     </div>

//                     {ticket.out_of_scope && ticket.out_of_scope_reason && (
//                       <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
//                         <span className="text-xs font-medium text-purple-800">Out of Scope Reason:</span>
//                         <p className="text-purple-700 text-sm mt-1">{ticket.out_of_scope_reason}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-col gap-2 min-w-fit">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
//                       onClick={() => handleViewDetails(ticket)}
//                     >
//                       View Details
//                     </Button>
//                     {user?.role === "admin" && ticket.status !== "closed" && (
//                       <>
//                         <Button
//                           size="sm"
//                           className="bg-blue-600 hover:bg-blue-700 text-white"
//                           onClick={() => handleUpdateStatus(ticket)}
//                           disabled={ticket.status === "resolved"}
//                         >
//                           {getNextStatusText(ticket.status || "unknown")}
//                         </Button>
//                         <Button
//                           size="sm"
//                           className="bg-green-600 hover:bg-green-700 text-white"
//                           onClick={() => handleCloseTicket(ticket, "admin")}
//                           disabled={ticket.adminClosed || (ticket.status !== "confirmed by oem" && ticket.status !== "resolved" && ticket.status !== "closed")}
//                         >
//                           Close Ticket
//                         </Button>
//                       </>
//                     )}
//                     {(user?.role === "client" || user?.role === "clientMember") &&
//                       ticket.status === "resolved" &&
//                       !ticket.clientClosed && (
//                         <Button
//                           size="sm"
//                           className="bg-green-600 hover:bg-green-700 text-white"
//                           onClick={() => handleCloseTicket(ticket, user.role)}
//                           disabled={ticket.out_of_scope}
//                         >
//                           Close Ticket
//                         </Button>
//                       )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {filteredTickets.length === 0 && (
//           <Card className="bg-white border border-gray-200 shadow-sm">
//             <CardContent className="p-8 text-center">
//               <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                 <Search className="h-8 w-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">No tickets found</h3>
//               <p className="text-gray-600 max-w-md mx-auto">
//                 No tickets match your current search criteria. Try adjusting your filters or search terms.
//               </p>
//             </CardContent>
//           </Card>
//         )}

//         <TicketDetailsModal
//           isOpen={isTicketModalOpen}
//           onClose={() => {
//             setIsTicketModalOpen(false)
//             setSelectedTicket(null)
//           }}
//           ticket={selectedTicket}
//         />

//         <Dialog
//           open={isUpdateModalOpen}
//           onOpenChange={(open) => {
//             setIsUpdateModalOpen(open)
//             if (!open) {
//               setUpdateTicket(null)
//               setComments("")
//               setTicketType("")
//             }
//           }}
//         >
//           <DialogContent className="bg-white border border-gray-200 shadow-lg max-w-2xl">
//             <DialogHeader className="pb-4">
//               <DialogTitle className="text-xl font-semibold text-gray-900">Update Ticket Status</DialogTitle>
//             </DialogHeader>
//             {updateTicket && (
//               <div className="space-y-4">
//                 <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
//                   <p className="font-medium text-gray-800">
//                     Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
//                   </p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Current Status: <span className="font-medium">{updateTicket.status}</span>
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
//                   <Textarea
//                     value={comments}
//                     onChange={(e) => setComments(e.target.value)}
//                     placeholder="Add comments for status update..."
//                     className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Type</label>
//                   <Select value={ticketType} onValueChange={setTicketType}>
//                     <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
//                       <SelectValue placeholder="Select ticket type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="RS1">RS1</SelectItem>
//                       <SelectItem value="RS2">RS2</SelectItem>
//                       <SelectItem value="RS3-1">RS3-1</SelectItem>
//                       <SelectItem value="RS3-2">RS3-2</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <DialogFooter className="gap-3 pt-4">
//                   <Button
//                     variant="outline"
//                     className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
//                     onClick={() => setIsUpdateModalOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
//                     onClick={handleStatusUpdate}
//                     disabled={!comments.trim() || !ticketType || isLoading.updateStatus}
//                   >
//                     {isLoading.updateStatus ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Updating...
//                       </>
//                     ) : (
//                       getNextStatusText(updateTicket.status || "unknown")
//                     )}
//                   </Button>
//                 </DialogFooter>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>

//         <Dialog
//           open={isFeedbackModalOpen}
//           onOpenChange={(open) => {
//             setIsFeedbackModalOpen(open)
//             if (!open) {
//               setUpdateTicket(null)
//               setFeedback({ experience: "", rating: 0, timeAmount: "" })
//             }
//           }}
//         >
//           <DialogContent className="bg-white border border-gray-200 shadow-lg max-w-2xl">
//             <DialogHeader className="pb-4">
//               <DialogTitle className="text-xl font-semibold text-gray-900">Ticket Feedback</DialogTitle>
//             </DialogHeader>
//             {updateTicket && (
//               <div className="space-y-4">
//                 <div className="p-4 bg-green-50 border border-green-200 rounded-md">
//                   <p className="font-medium text-gray-800">
//                     Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
//                   <Textarea
//                     value={feedback.experience}
//                     onChange={(e) => setFeedback({ ...feedback, experience: e.target.value })}
//                     placeholder="Describe your experience with this ticket resolution..."
//                     className="border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-[80px]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
//                   <div className="flex gap-1 mt-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Button
//                         key={star}
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setFeedback({ ...feedback, rating: star })}
//                         className={`p-2 ${
//                           feedback.rating >= star
//                             ? "text-yellow-500 hover:text-yellow-600"
//                             : "text-gray-300 hover:text-yellow-400"
//                         }`}
//                       >
//                         <Star className="h-5 w-5" fill={feedback.rating >= star ? "currentColor" : "none"} />
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Time Saved (hours)</label>
//                   <Input
//                     type="number"
//                     value={feedback.timeAmount}
//                     onChange={(e) => setFeedback({ ...feedback, timeAmount: e.target.value })}
//                     placeholder="Enter time saved in hours (e.g., 2)"
//                     className="border-gray-300 focus:border-green-500 focus:ring-green-500"
//                   />
//                 </div>
//                 <DialogFooter className="gap-3 pt-4">
//                   <Button
//                     variant="outline"
//                     className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
//                     onClick={() => setIsFeedbackModalOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
//                     onClick={handleFeedbackSubmit}
//                     disabled={!feedback.experience.trim() || feedback.rating === 0 || isLoading.feedbackSubmit}
//                   >
//                     {isLoading.feedbackSubmit ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       "Submit Feedback"
//                     )}
//                   </Button>
//                 </DialogFooter>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>

//         <Dialog
//           open={isAdminSummaryModalOpen}
//           onOpenChange={(open) => {
//             setIsAdminSummaryModalOpen(open)
//             if (!open) {
//               setUpdateTicket(null)
//               setAdminSummary("")
//               setAdminAttachment(null)
//               setAdminOutOfScope(false)
//               setAdminOutOfScopeReason("")
//             }
//           }}
//         >
//           <DialogContent className="bg-white border border-gray-200 shadow-lg max-w-2xl">
//             <DialogHeader className="pb-4">
//               <DialogTitle className="text-xl font-semibold text-gray-900">Close Ticket - Admin Summary</DialogTitle>
//             </DialogHeader>
//             {updateTicket && (
//               <div className="space-y-4">
//                 <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
//                   <p className="font-medium text-gray-800">
//                     Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Summary of Resolution</label>
//                   <Textarea
//                     value={adminSummary}
//                     onChange={(e) => setAdminSummary(e.target.value)}
//                     placeholder="Provide a brief summary of the ticket resolution..."
//                     className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
//                   <Input
//                     type="file"
//                     onChange={(e) => setAdminAttachment(e.target.files?.[0] || null)}
//                     className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
//                   <div className="flex items-center gap-3 mb-3">
//                     <input
//                       type="checkbox"
//                       checked={adminOutOfScope}
//                       onChange={(e) => setAdminOutOfScope(e.target.checked)}
//                       disabled={updateTicket.status !== "confirmed by oem" && updateTicket.status !== "resolved" && updateTicket.status !== "closed"}
//                       className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
//                     />
//                     <span className="text-sm font-medium text-gray-700">Mark as Out of Scope</span>
//                   </div>
//                   {adminOutOfScope && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Out of Scope</label>
//                       <Textarea
//                         value={adminOutOfScopeReason}
//                         onChange={(e) => setAdminOutOfScopeReason(e.target.value)}
//                         placeholder="Provide reason for marking as out of scope..."
//                         className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <DialogFooter className="gap-3 pt-4">
//                   <Button
//                     variant="outline"
//                     className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
//                     onClick={() => setIsAdminSummaryModalOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
//                     onClick={handleAdminSummarySubmit}
//                     disabled={!adminSummary.trim() || (adminOutOfScope && !adminOutOfScopeReason.trim()) || isLoading.adminSummarySubmit}
//                   >
//                     {isLoading.adminSummarySubmit ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       "Submit Summary"
//                     )}
//                   </Button>
//                 </DialogFooter>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   )
// }

// export default Tickets









"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  Filter,
  Star,
  User,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  Loader2,
} from "lucide-react"
import { FileText, Shield, CheckCircle, CloudIcon as ClosedIcon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import { StatusTracker } from "@/components/Tickets/StatusTracker"
import TicketDetailsModal from "@/components/Tickets/TicketDetailsModal"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import type { Ticket } from "@/types"

interface Feedback {
  experience: string
  rating: number
  timeAmount: string
}

interface Client {
  client_id: number
  client_username: string
  name: string
}

type TicketStatus = "raised" | "confirmed by oem" | "resolved" | "closed"

const Tickets = () => {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [clientFilter, setClientFilter] = useState("all")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isAdminSummaryModalOpen, setIsAdminSummaryModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [updateTicket, setUpdateTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState("")
  const [ticketType, setTicketType] = useState("")
  const [feedback, setFeedback] = useState<Feedback>({
    experience: "",
    rating: 0,
    timeAmount: "",
  })
  const [adminSummary, setAdminSummary] = useState("")
  const [adminAttachment, setAdminAttachment] = useState<File | null>(null)
  const [adminOutOfScope, setAdminOutOfScope] = useState(false)
  const [adminOutOfScopeReason, setAdminOutOfScopeReason] = useState("")
  const [isLoading, setIsLoading] = useState({
    updateStatus: false,
    feedbackSubmit: false,
    adminSummarySubmit: false,
    clients: false,
  })

  const getStatusIcon = (status: string) => {
    const iconClass = "h-4 w-4 bg-emerald-500 rounded-full p-0.5 text-white"
    switch (status) {
      case "raised":
        return <FileText className={iconClass} />
      case "confirmed by oem":
        return <Shield className={iconClass} />
      case "resolved":
        return <CheckCircle className={iconClass} />
      case "closed":
        return <ClosedIcon className={iconClass} />
      default:
        return <FileText className={iconClass} />
    }
  }

  const getNextStatusText = (currentStatus: string) => {
    switch (currentStatus) {
      case "raised":
        return "Update to Confirmed by OEM"
      case "confirmed by oem":
        return "Update to Resolved"
      case "resolved":
        return "Update to Closed"
      default:
        return "Update Status"
    }
  }

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user || !user.token) {
        console.warn("No user or token available")
        setTickets([])
        router.push("/")
        return
      }

      try {
        const response = await axios.get("/api/tickets", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        console.log("Fetched tickets:", response.data)
        const mappedTickets = response.data.map((ticket: any) => ({
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
        }))
        setTickets(mappedTickets.sort((a: Ticket, b: Ticket) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ))
      } catch (error) {
        console.error("Error fetching tickets:", error)
        alert("Failed to fetch tickets.")
        setTickets([])
      }
    }

    const fetchClients = async () => {
      if (user?.role !== "admin" || !user?.token) return

      setIsLoading((prev) => ({ ...prev, clients: true }))
      try {
        const response = await axios.get("/api/clients", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setClients(response.data.map((client: any) => ({
          client_id: client.client_id,
          client_username: client.client_username,
          name: client.name,
        })))
      } catch (error) {
        console.error("Error fetching clients:", error)
        alert("Failed to fetch clients.")
      } finally {
        setIsLoading((prev) => ({ ...prev, clients: false }))
      }
    }

    fetchTickets()
    fetchClients()
  }, [user, router])

  // Handle opening specific ticket from query param
  useEffect(() => {
    if (tickets.length === 0) return;

    const ticketId = searchParams.get('ticketId');
    if (ticketId) {
      const targetTicket = tickets.find(t => t.ticket_id.toString() === ticketId);
      if (targetTicket) {
        setSelectedTicket(targetTicket);
        setIsTicketModalOpen(true);
        // Clear the query param without full navigation
        router.replace('/tickets', { scroll: false });
      }
    }
  }, [tickets, searchParams, router]);

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "raised":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "confirmed by oem":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200"
      case "closed":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsTicketModalOpen(true)
  }

  const handleUpdateStatus = (ticket: Ticket) => {
    setUpdateTicket(ticket)
    setComments(ticket.comments || "")
    setTicketType(ticket.ticket_type || "")
    setIsUpdateModalOpen(true)
  }

  const handleCloseTicket = async (ticket: Ticket, role: "admin" | "client" | "clientMember") => {
    if (role === "admin") {
      if (ticket.status !== "confirmed by oem" && ticket.status !== "resolved" && ticket.status !== "closed") {
        alert("Cannot close ticket: Ticket must be at least in 'confirmed by oem' stage.")
        return
      }
      setUpdateTicket(ticket)
      setAdminSummary(ticket.summary || "")
      setAdminAttachment(null)
      setAdminOutOfScope(ticket.out_of_scope)
      setAdminOutOfScopeReason(ticket.out_of_scope_reason || "")
      setIsAdminSummaryModalOpen(true)
    } else {
      if (ticket.out_of_scope) {
        alert("Cannot close ticket: Ticket is marked out of scope and can only be closed by admin.")
        return
      }
      if (ticket.status !== "resolved") {
        alert("Cannot close ticket: Ticket must be resolved first.")
        return
      }
      setUpdateTicket(ticket)
      setFeedback({ experience: "", rating: 0, timeAmount: "" })
      setIsFeedbackModalOpen(true)
    }
  }

  const handleStatusUpdate = async () => {
    if (!updateTicket || !user?.token) return

    if (updateTicket.status === "raised" && !ticketType) {
      alert("Please select a ticket type before confirming.")
      return
    }

    setIsLoading((prev) => ({ ...prev, updateStatus: true }))
    try {
      const newStatus: TicketStatus =
        updateTicket.status === "raised"
          ? "confirmed by oem"
          : updateTicket.status === "confirmed by oem"
            ? "resolved"
            : updateTicket.status === "resolved"
              ? "closed"
              : updateTicket.status
      const response = await axios.put(
        `/api/tickets?id=${updateTicket.ticket_id}`,
        { status: newStatus, comments, ticket_type: ticketType },
        { headers: { Authorization: `Bearer ${user.token}` } },
      )
      setTickets(
        tickets.map((t) =>
          t.ticket_id === updateTicket.ticket_id
            ? {
                ...t,
                status: newStatus,
                comments,
                ticket_type: ticketType,
                ticketType: ticketType,
                updated_at: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : t,
        ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      )
      setIsUpdateModalOpen(false)
      setComments("")
      setTicketType("")
    } catch (error) {
      console.error("Error updating ticket:", error)
      alert("Failed to update ticket status.")
    } finally {
      setIsLoading((prev) => ({ ...prev, updateStatus: false }))
    }
  }

  const handleAdminSummarySubmit = async () => {
    if (!updateTicket || !user?.token || !adminSummary.trim()) return

    setIsLoading((prev) => ({ ...prev, adminSummarySubmit: true }))
    try {
      const formData = new FormData()
      formData.append("summary", adminSummary)
      formData.append("out_of_scope", adminOutOfScope.toString())
      if (adminOutOfScope) formData.append("out_of_scope_reason", adminOutOfScopeReason)
      if (adminAttachment) formData.append("attachment", adminAttachment)

      const response = await axios.post(`/api/tickets?action=close&id=${updateTicket.ticket_id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      })

      setTickets(
        tickets.map((t) =>
          t.ticket_id === updateTicket.ticket_id
            ? {
                ...t,
                adminClosed: true,
                summary: adminSummary,
                attachments: adminAttachment
                  ? t.attachments
                    ? `${t.attachments},${adminAttachment.name}`
                    : adminAttachment.name
                  : t.attachments,
                out_of_scope: adminOutOfScope,
                out_of_scope_reason: adminOutOfScope ? adminOutOfScopeReason : null,
                status: t.clientClosed && !adminOutOfScope ? "closed" : t.status as TicketStatus,
                updated_at: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                closed_at: t.clientClosed && !adminOutOfScope ? new Date().toISOString() : t.closed_at,
              }
            : t,
        ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      )
      setIsAdminSummaryModalOpen(false)
      setAdminSummary("")
      setAdminAttachment(null)
      setAdminOutOfScope(false)
      setAdminOutOfScopeReason("")
    } catch (error) {
      console.error("Error closing ticket:", error)
      alert("Failed to close ticket.")
    } finally {
      setIsLoading((prev) => ({ ...prev, adminSummarySubmit: false }))
    }
  }

  const handleFeedbackSubmit = async () => {
    if (!updateTicket || !user?.token || !feedback.experience.trim() || feedback.rating === 0) return

    setIsLoading((prev) => ({ ...prev, feedbackSubmit: true }))
    try {
      const response = await axios.post(
        `/api/tickets?action=close&id=${updateTicket.ticket_id}`,
        {
          experience: feedback.experience,
          rating: feedback.rating,
          time_saved: feedback.timeAmount ? Number.parseInt(feedback.timeAmount) : null,
        },
        { headers: { Authorization: `Bearer ${user.token}` } },
      )
      setTickets(
        tickets.map((t) =>
          t.ticket_id === updateTicket.ticket_id
            ? {
                ...t,
                clientClosed: true,
                status: t.adminClosed && !t.out_of_scope ? "closed" : t.status as TicketStatus,
                updated_at: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                closed_at: t.adminClosed && !t.out_of_scope ? new Date().toISOString() : t.closed_at,
              }
            : t,
        ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      )
      setIsFeedbackModalOpen(false)
      setFeedback({ experience: "", rating: 0, timeAmount: "" })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Failed to submit feedback.")
    } finally {
      setIsLoading((prev) => ({ ...prev, feedbackSubmit: false }))
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.issue_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesClient = clientFilter === "all" || ticket.client?.client_username === clientFilter
    return matchesSearch && matchesStatus && matchesClient
  })

  const totalTickets = tickets.length
  const closedTickets = tickets.filter((t) => t.status === "closed").length
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length
  const openTickets = totalTickets - closedTickets
  const inProgressTickets = tickets.filter((t) => t.status === "confirmed by oem").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {user?.role === "admin" ? "Ticket Management" : "My Support Center"}
                    </h1>
                    <p className="text-gray-600">
                      {user?.role === "admin"
                        ? "Monitor and manage all support requests"
                        : "Track your support requests and their progress"}
                    </p>
                  </div>
                </div>
              </div>

              {(user?.role === "client" || user?.role === "clientMember") && (
                <Button
                  onClick={() => router.push("/tickets/new")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Ticket
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Tickets</CardTitle>
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-blue-900">{totalTickets}</div>
                  <p className="text-xs text-blue-600 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">Open Tickets</CardTitle>
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-orange-900">{openTickets}</div>
                  <p className="text-xs text-orange-600 mt-1">Pending resolution</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Resolved</CardTitle>
                  <div className="p-2 bg-green-500 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-green-900">{resolvedTickets}</div>
                  <p className="text-xs text-green-600 mt-1">Ready to close</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Closed</CardTitle>
                  <div className="p-2 bg-gray-500 rounded-lg">
                    <XCircle className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">{closedTickets}</div>
                  <p className="text-xs text-gray-600 mt-1">Completed</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tickets by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="raised">Raised</SelectItem>
                    <SelectItem value="confirmed by oem">Confirmed by OEM</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                {user?.role === "admin" && (
                  <Select value={clientFilter} onValueChange={setClientFilter}>
                    <SelectTrigger className="w-full lg:w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Filter by client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {isLoading.clients ? (
                        <SelectItem value="loading" disabled>
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading clients...
                          </span>
                        </SelectItem>
                      ) : (
                        clients.map((client) => (
                          <SelectItem key={client.client_id} value={client.client_username}>
                            {client.client_username}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
                <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50 bg-transparent">
                  <Filter className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card
              key={ticket.ticket_id}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div
                className={`h-1 w-full ${ticket.priority === "high" ? "bg-red-500" : ticket.priority === "medium" ? "bg-blue-500" : ticket.priority === "low" ? "bg-green-500" : "bg-gray-400"}`}
              />
              <CardContent className="p-4">
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start flex-wrap gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">#{ticket.ticket_id}</h3>
                          <p className="text-gray-700 font-medium">{ticket.issue_title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs font-medium px-2 py-1 border ${getPriorityColor(ticket.priority)}`}
                          >
                            {ticket.priority?.toUpperCase() || "UNKNOWN"} PRIORITY
                          </Badge>
                          <Badge
                            className={`text-xs font-medium px-2 py-1 border flex items-center gap-1 ${getStatusColor(ticket.status || "unknown")}`}
                          >
                            {getStatusIcon(ticket.status || "unknown")}
                            {ticket.status?.toUpperCase() || "UNKNOWN"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2">
                        {user?.role === "admin" && ticket.client?.client_username && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 border border-gray-200 rounded-md">
                            <User className="h-3 w-3" />
                            {ticket.client.client_username}
                          </span>
                        )}
                        {ticket.out_of_scope && (
                          <Badge className="text-xs bg-purple-100 text-purple-800 border border-purple-200">
                            Out of Scope
                          </Badge>
                        )}
                        {ticket.ticket_type && (
                          <Badge className="text-xs bg-teal-100 text-teal-800 border border-teal-200">
                            {ticket.ticket_type}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {ticket.description || "No description provided"}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-md border border-gray-200">
                      <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                        Progress Tracker
                      </h4>
                      <StatusTracker
                        status={ticket.status as "raised" | "confirmed by oem" | "resolved" | "closed"}
                        priority={ticket.priority || "medium"}
                        createdAt={ticket.created_at}
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">Created:</span>
                        {new Date(ticket.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">Updated:</span>
                        {new Date(ticket.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {ticket.attachments && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Attachments:</span>
                          {ticket.attachments}
                        </span>
                      )}
                    </div>

                    {ticket.out_of_scope && ticket.out_of_scope_reason && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                        <span className="text-xs font-medium text-purple-800">Out of Scope Reason:</span>
                        <p className="text-purple-700 text-sm mt-1">{ticket.out_of_scope_reason}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-w-fit">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      onClick={() => handleViewDetails(ticket)}
                    >
                      View Details
                    </Button>
                    {user?.role === "admin" && ticket.status !== "closed" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleUpdateStatus(ticket)}
                          disabled={ticket.status === "resolved"}
                        >
                          {getNextStatusText(ticket.status || "unknown")}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleCloseTicket(ticket, "admin")}
                          disabled={ticket.adminClosed || (ticket.status !== "confirmed by oem" && ticket.status !== "resolved" && ticket.status !== "closed")}
                        >
                          Close Ticket
                        </Button>
                      </>
                    )}
                    {(user?.role === "client" || user?.role === "clientMember") &&
                      ticket.status === "resolved" &&
                      !ticket.clientClosed && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleCloseTicket(ticket, user.role)}
                          disabled={ticket.out_of_scope}
                        >
                          Close Ticket
                        </Button>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No tickets found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No tickets match your current search criteria. Try adjusting your filters or search terms.
              </p>
            </CardContent>
          </Card>
        )}

        <TicketDetailsModal
          isOpen={isTicketModalOpen}
          onClose={() => {
            setIsTicketModalOpen(false)
            setSelectedTicket(null)
          }}
          ticket={selectedTicket}
        />

        <Dialog
          open={isUpdateModalOpen}
          onOpenChange={(open) => {
            setIsUpdateModalOpen(open)
            if (!open) {
              setUpdateTicket(null)
              setComments("")
              setTicketType("")
            }
          }}
        >
          <DialogContent className="bg-white border border-gray-200 shadow-lg max-w-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-gray-900">Update Ticket Status</DialogTitle>
            </DialogHeader>
            {updateTicket && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="font-medium text-gray-800">
                    Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Current Status: <span className="font-medium">{updateTicket.status}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add comments for status update..."
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Type</label>
                  <Select value={ticketType} onValueChange={setTicketType}>
                    <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RS1">RS1</SelectItem>
                      <SelectItem value="RS2">RS2</SelectItem>
                      <SelectItem value="RS3-1">RS3-1</SelectItem>
                      <SelectItem value="RS3-2">RS3-2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    onClick={() => setIsUpdateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    onClick={handleStatusUpdate}
                    disabled={!comments.trim() || !ticketType || isLoading.updateStatus}
                  >
                    {isLoading.updateStatus ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      getNextStatusText(updateTicket.status || "unknown")
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={isFeedbackModalOpen}
          onOpenChange={(open) => {
            setIsFeedbackModalOpen(open)
            if (!open) {
              setUpdateTicket(null)
              setFeedback({ experience: "", rating: 0, timeAmount: "" })
            }
          }}
        >
          <DialogContent className="bg-white border border-gray-200 shadow-lg max-w-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-gray-900">Ticket Feedback</DialogTitle>
            </DialogHeader>
            {updateTicket && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="font-medium text-gray-800">
                    Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
                  <Textarea
                    value={feedback.experience}
                    onChange={(e) => setFeedback({ ...feedback, experience: e.target.value })}
                    placeholder="Describe your experience with this ticket resolution..."
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="sm"
                        onClick={() => setFeedback({ ...feedback, rating: star })}
                        className={`p-2 ${
                          feedback.rating >= star
                            ? "text-yellow-500 hover:text-yellow-600"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        <Star className="h-5 w-5" fill={feedback.rating >= star ? "currentColor" : "none"} />
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Saved (hours)</label>
                  <Input
                    type="number"
                    value={feedback.timeAmount}
                    onChange={(e) => setFeedback({ ...feedback, timeAmount: e.target.value })}
                    placeholder="Enter time saved in hours (e.g., 2)"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <DialogFooter className="gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    onClick={() => setIsFeedbackModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    onClick={handleFeedbackSubmit}
                    disabled={!feedback.experience.trim() || feedback.rating === 0 || isLoading.feedbackSubmit}
                  >
                    {isLoading.feedbackSubmit ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={isAdminSummaryModalOpen}
          onOpenChange={(open) => {
            setIsAdminSummaryModalOpen(open)
            if (!open) {
              setUpdateTicket(null)
              setAdminSummary("")
              setAdminAttachment(null)
              setAdminOutOfScope(false)
              setAdminOutOfScopeReason("")
            }
          }}
        >
          <DialogContent className="bg-white border border-gray-200 shadow-lg max-w-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-gray-900">Close Ticket - Admin Summary</DialogTitle>
            </DialogHeader>
            {updateTicket && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="font-medium text-gray-800">
                    Ticket #{updateTicket.ticket_id} - {updateTicket.issue_title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary of Resolution</label>
                  <Textarea
                    value={adminSummary}
                    onChange={(e) => setAdminSummary(e.target.value)}
                    placeholder="Provide a brief summary of the ticket resolution..."
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                  <Input
                    type="file"
                    onChange={(e) => setAdminAttachment(e.target.files?.[0] || null)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={adminOutOfScope}
                      onChange={(e) => setAdminOutOfScope(e.target.checked)}
                      disabled={updateTicket.status !== "confirmed by oem" && updateTicket.status !== "resolved" && updateTicket.status !== "closed"}
                      className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Out of Scope</span>
                  </div>
                  {adminOutOfScope && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Out of Scope</label>
                      <Textarea
                        value={adminOutOfScopeReason}
                        onChange={(e) => setAdminOutOfScopeReason(e.target.value)}
                        placeholder="Provide reason for marking as out of scope..."
                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter className="gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    onClick={() => setIsAdminSummaryModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    onClick={handleAdminSummarySubmit}
                    disabled={!adminSummary.trim() || (adminOutOfScope && !adminOutOfScopeReason.trim()) || isLoading.adminSummarySubmit}
                  >
                    {isLoading.adminSummarySubmit ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Summary"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Tickets