

// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { v4 as uuidv4 } from 'uuid';
// import { useRouter } from "next/navigation"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import {
//   AlertCircle,
//   CheckCircle2,
//   Edit,
//   Trash2,
//   Plus,
//   Save,
//   Users,
//   Building2,
//   FileText,
//   Shield,
//   Calendar,
//   Phone,
//   Mail,
//   User,
//   Settings,
//   ChevronRight,
//   Clock,
//   Target,
//   Eye,
//   EyeOff,
// } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"
// import type { ClientFormData, MemberFormData, ContractFormData, AdminFormData } from "@/types/client"
// import {
//   getClients,
//   suggestClientId,
//   createClient,
//   updateClient,
//   createMembers,
//   updateMember,
//   deleteMember,
//   getClientDetails,
//   createOrUpdateContract,
//   updateContract,
//   getAdmins,
//   createAdmin,
// } from "../actions/client-actions"
// import MainLayout from "@/components/Layout/MainLayout"
// import { useAuth } from "@/contexts/AuthContext"

// export default function ClientDefinitionPage() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const { user } = useAuth()
//   const [activeTab, setActiveTab] = useState("creation")
//   const [step, setStep] = useState(1)
//  const [clients, setClients] = useState<{ client_id: string; name: string }[]>([])
// const [suggestedClientId, setSuggestedClientId] = useState<string | null>(null)
// const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
//   const [clientData, setClientData] = useState<ClientFormData>({
//     client_id: "",
//     client_username: "",
//     client_password: "",
//     name: "",
//     start_date: "",
//     payment_cycle: null,
//   })
//   const [members, setMembers] = useState<MemberFormData[]>([])
//   const [newMember, setNewMember] = useState<MemberFormData>({
//     member_name: "",
//     designation: "",
//     email: "",
//     phone_number: "",
//     escalation_level: 1,
//     member_username: "",
//     member_password: "",
//   })
//   const [contractData, setContractData] = useState<ContractFormData>({
//     client_id: "",
//     allowed_tickets: 0,
//     total_tickets_used: 0,
//     ticket_typeRS1: 0,
//     ticket_typeRS1_used: 0,
//     ticket_typeRS2: 0,
//     ticket_typeRS2_used: 0,
//     ticket_typeRS3_1: 0,
//     ticket_typeRS3_1_used: 0,
//     ticket_typeRS3_2: 0,
//     ticket_typeRS3_2_used: 0,
//     site_visit_frequency: 0,
//     site_visit_date: "",
//     hil_admin_id: null,
//     hil_admin_team: [],
//   })
// const [admins, setAdmins] = useState<{ admin_id: number; name: string; designation: string; username: string }[]>([])
//   const [newAdmin, setNewAdmin] = useState<AdminFormData>({
//     name: "",
//     designation: "",
//     username: "",
//     password: "",
//   })
//   const [isEditing, setIsEditing] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null)
//   const [editingMember, setEditingMember] = useState<MemberFormData | null>(null)
//   const [siteVisitDates, setSiteVisitDates] = useState<string[]>([""])
//   const [editingAdminId, setEditingAdminId] = useState<number | null>(null)
//   const [editingAdmin, setEditingAdmin] = useState<any>({})
//   const [showPassword, setShowPassword] = useState(false)
//   const [errors, setErrors] = useState<any>({})



//   const isSuperAdmin = user?.role === "admin" && user.id === 1

//   const validatePhoneNumber = (phone: string) => {
//     const phoneRegex = /^[0-9+\-\s()]+$/
//     return phoneRegex.test(phone) && phone.length >= 10
//   }

//   const validateEmail = (email: string) => {
//     if (!email) return false;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

  

//   const validateMember = (member: MemberFormData, isNew: boolean = false) => {
//     const memberErrors: any = {};
//     let isValid = true;

//     if (!member.member_name.trim()) {
//       memberErrors.member_name = "Name is required.";
//       isValid = false;
//     }
//     if (!validateEmail(member.email)) {
//       memberErrors.email = "Invalid email format.";
//       isValid = false;
//     }
//     if (!validatePhoneNumber(member.phone_number)) {
//       memberErrors.phone_number = "Phone number must be at least 10 digits and contain valid characters.";
//       isValid = false;
//     }
//     if (!member.member_username.trim()) {
//       memberErrors.member_username = "Username is required.";
//       isValid = false;
//     }
//     if (isNew && !member.member_password) {
//       memberErrors.member_password = "Password is required.";
//       isValid = false;
//     }

//     return { isValid, memberErrors };
//   };

//   const validateStep1 = () => {
//     const newErrors: any = { client: {}, members: [] };
//     let isValid = true;

//     if (!clientData.name.trim()) { newErrors.client.name = "Client name is required."; isValid = false; }
//     if (!clientData.client_username.trim()) { newErrors.client.client_username = "Client username is required."; isValid = false; }
//     if (activeTab === 'creation' && !clientData.client_password) { newErrors.client.client_password = "Password is required."; isValid = false; }
//     if (!clientData.start_date) { newErrors.client.start_date = "Start date is required."; isValid = false; }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const validateStep2 = () => {
//     const newErrors: any = { contract: {} };
//     let isValid = true;

//     if (contractData.allowed_tickets < 0) { newErrors.contract.allowed_tickets = "Cannot be negative."; isValid = false; }
//     if (contractData.total_tickets_used < 0) { newErrors.contract.total_tickets_used = "Cannot be negative."; isValid = false; }
//     if (contractData.ticket_typeRS1 < 0) { newErrors.contract.ticket_typeRS1 = "Cannot be negative."; isValid = false; }
//     if (contractData.ticket_typeRS1_used < 0) { newErrors.contract.ticket_typeRS1_used = "Cannot be negative."; isValid = false; }
//     if (contractData.ticket_typeRS2 < 0) { newErrors.contract.ticket_typeRS2 = "Cannot be negative."; isValid = false; }
//     if (contractData.ticket_typeRS2_used < 0) { newErrors.contract.ticket_typeRS2_used = "Cannot be negative."; isValid = false; }
//     if (contractData.ticket_typeRS3_1 < 0) { newErrors.contract.ticket_typeRS3_1 = "Cannot be negative."; isValid = false; }
//     if (contractData.ticket_typeRS3_1_used < 0) { newErrors.contract.ticket_typeRS3_1_used = "Cannot be negative."; isValid = false; }
//     if (contractData.ticket_typeRS3_2 < 0) { newErrors.contract.ticket_typeRS3_2 = "Cannot be negative."; isValid = false; }
//     if (contractData.ticket_typeRS3_2_used < 0) { newErrors.contract.ticket_typeRS3_2_used = "Cannot be negative."; isValid = false; }
//     if (contractData.site_visit_frequency < 0) { newErrors.contract.site_visit_frequency = "Cannot be negative."; isValid = false; }

//     if (contractData.site_visit_frequency > 0) {
//       if (!newErrors.contract.site_visit_dates) newErrors.contract.site_visit_dates = [];
//       siteVisitDates.forEach((date, index) => {
//         if (!date) {
//           newErrors.contract.site_visit_dates[index] = "Date is required.";
//           isValid = false;
//         } else if (new Date(date) < new Date(new Date().setHours(0,0,0,0))) {
//           newErrors.contract.site_visit_dates[index] = "Date cannot be in the past.";
//           isValid = false;
//         }
//       });
//     }

//     setErrors((prev: any) => ({ ...prev, contract: newErrors.contract }));
//     return isValid;
//   };


//   const validateForm = () => {
//     const newErrors: any = { client: {}, members: [] };
//     let isValid = true;

//     // Client validation
//     if (!clientData.name.trim()) {
//       newErrors.client.name = "Client name is required.";
//       isValid = false;
//     }
//     if (!clientData.client_username.trim()) {
//       newErrors.client.client_username = "Client username is required.";
//       isValid = false;
//     }
//     if ((activeTab === 'creation' || (isEditing && clientData.client_password)) && !clientData.client_password) {
//         newErrors.client.client_password = "Password is required.";
//         isValid = false;
//     }
//     if (!clientData.start_date) {
//         newErrors.client.start_date = "Start date is required.";
//         isValid = false;
//     }

//     // Existing members validation
//     members.forEach((member, index) => {
//         const { isValid: memberValid, memberErrors } = validateMember(member);
//         if (!memberValid) {
//             newErrors.members[index] = memberErrors;
//             isValid = false;
//         }
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   useEffect(() => {
//     console.log("useEffect: Fetching initial data")

//     if (user?.role !== "admin") {
//       toast({ title: "Access Denied", description: "Only admins can access this page", variant: "destructive" })
//       router.push("/unauthorized")
//       return
//     }

//     getClients()
//       .then((clients) => {
//         console.log("getClients Success:", clients)
//         setClients(clients)
//       })
//       .catch((error) => {
//         console.error("getClients Error:", error)
//         toast({ title: "Error", description: "Failed to fetch clients", variant: "destructive" })
//       })

//     suggestClientId()
//       .then((id) => {
//         console.log("suggestClientId Success:", id)
//         setSuggestedClientId(id)
//         setClientData((prev) => ({ ...prev, client_id: id }))
//       })
//       .catch((error) => {
//         console.error("suggestClientId Error:", error)
//         toast({ title: "Error", description: "Failed to suggest client ID", variant: "destructive" })
//       })

//     getAdmins()
//       .then((admins) => {
//         console.log("getAdmins Success:", admins)
//         setAdmins(admins)
//       })
//       .catch((error) => {
//         console.error("getAdmins Error:", error)
//         toast({ title: "Error", description: "Failed to fetch admins", variant: "destructive" })
//       })

//     if (activeTab === "admin" && !isSuperAdmin) {
//       setActiveTab("update")
//     }
//   }, [user])

//   const fetchClientDetails = async (id: string) => {
//     setLoading(true)
//     try {
//       const data = await getClientDetails(id)
//       setClientData({
//         client_id: data.client_id,
//         client_username: data.client_username,
//         name: data.name,
//         start_date: data.start_date,
//         payment_cycle: data.payment_cycle,
//       })
//       setMembers(data.members || [])
//       setContractData(
//         data.contract || {
//           client_id: id,
//           allowed_tickets: 0,
//           total_tickets_used: 0,
//           ticket_typeRS1: 0,
//           ticket_typeRS1_used: 0,
//           ticket_typeRS2: 0,
//           ticket_typeRS2_used: 0,
//           ticket_typeRS3_1: 0,
//           ticket_typeRS3_1_used: 0,
//           ticket_typeRS3_2: 0,
//           ticket_typeRS3_2_used: 0,
//           site_visit_frequency: 0,
//           site_visit_date: "",
//           hil_admin_id: null,
//           hil_admin_team: [],
//         },
//       )
//     } catch (error) {
//       console.error("fetchClientDetails Error:", error)
//       toast({ title: "Error", description: "Failed to fetch client details", variant: "destructive" })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreateAdmin = async () => {
//     if (!isSuperAdmin) {
//       toast({
//         title: "Error",
//         description: "Access denied. Only super admin can create admins.",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       await createAdmin(newAdmin)
//       toast({ title: "Success", description: "Admin created successfully." })
//       setNewAdmin({
//         name: "",
//         designation: "",
//         username: "",
//         password: "",
//       })
//       const admins = await getAdmins()
//       setAdmins(admins)
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to create admin."
//       console.error("Create Admin Error:", err)
//       toast({ title: "Error", description: message, variant: "destructive" })
//     }
//   }

//   const handleNewAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setNewAdmin((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleHilAdminChange = (value: string) => {
//     setContractData((prev) => ({ ...prev, hil_admin_id: value === "none" ? null : Number.parseInt(value) }))
//   }

//   const handleHilAdminTeamChange = (selected: { value: number; label: string }[]) => {
//     setContractData((prev) => ({ ...prev, hil_admin_team: selected.map((opt) => opt.value) }))
//   }

//   const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setClientData((prev) => ({
//       ...prev,
//       // [name]: name === "client_id" ? Number.parseInt(value) || 0 : value,
//       [name]: value,
//     }))
//   }

//   const handleContractChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     const numValue = Number.parseInt(value);
//     setContractData((prev) => ({
//       ...prev,
//       [name]:
//         name.includes("ticket_type") || name.includes("frequency") || name.includes("allowed") || name.includes("used")
//           ? isNaN(numValue) ? 0 : Math.max(0, numValue)
//           : value,
//     }))
//   }

//   const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setNewMember((prev) => ({
//       ...prev,
//       [name]: name === "escalation_level" ? Number.parseInt(value) || 1 : value,
//     }))
//   }

//   const handleEditMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setEditingMember((prev) =>
//       prev
//         ? {
//             ...prev,
//             [name]: name === "escalation_level" ? Number.parseInt(value) || 1 : value,
//           }
//         : null,
//     )
//   }

//  const addMember = () => {
//   const { isValid, memberErrors } = validateMember(newMember, true);

//   setErrors({ ...errors, newMember: memberErrors });

//   if (isValid) {
//     if (members.some((m) => m.escalation_level === newMember.escalation_level)) {
//       toast({
//         title: "Error",
//         description: `Escalation level ${newMember.escalation_level} already exists.`,
//         variant: "destructive",
//       })
//       return
//     }
//     // ❌ Remove the UUID generation for member_id
//     // Since member_id should be a number (auto-generated by DB), don't set it here
//     setMembers([...members, { ...newMember }]); // Remove member_id assignment
//     toast({ title: "Success", description: "Member added successfully." });
//     setNewMember({
//       member_name: "",
//       designation: "",
//       email: "",
//       phone_number: "",
//       escalation_level: 1,
//       member_username: "",
//       member_password: "",
//     })
//   } else {
//     toast({ title: "Error", description: "Please correct the member fields", variant: "destructive" })
//   }
// }

//   const startEditingMember = (index: number) => {
//     setEditingMemberIndex(index)
//     setEditingMember({ ...members[index] })
//   }

//   const saveEditedMember = () => {
//     if (editingMemberIndex === null || !editingMember) return

//     const { isValid, memberErrors } = validateMember(editingMember);
//     if (!isValid) {
//       setErrors((prev: any) => {
//         const newMembersErrors = [...(prev.members || [])];
//         newMembersErrors[editingMemberIndex] = memberErrors;
//         return { ...prev, members: newMembersErrors };
//       });
//       toast({ title: "Error", description: "Please correct the member details.", variant: "destructive" });
//       return;
//     }

//     if (members.some((m, i) => i !== editingMemberIndex && m.escalation_level === editingMember.escalation_level)) {
//       toast({
//         title: "Error",
//         description: `Escalation level ${editingMember.escalation_level} already exists.`,
//         variant: "destructive",
//       })
//       return
//     }
//     setMembers((prev) => prev.map((m, i) => (i === editingMemberIndex ? editingMember : m)))
//     setEditingMemberIndex(null)
//     setEditingMember(null)
//     setErrors((prev: any) => {
//       const newMembersErrors = [...(prev.members || [])];
//       newMembersErrors[editingMemberIndex] = {};
//       return { ...prev, members: newMembersErrors };
//     });
//   }

//   const cancelEditingMember = () => {
//     setEditingMemberIndex(null)
//     setEditingMember(null)
//   }

//   const removeMember = async (memberId: number | undefined, index: number) => {
//     try {
//       if (memberId) {
//         await deleteMember(memberId)
//       }
//       setMembers((prev) => prev.filter((_, i) => i !== index))
//     } catch (error) {
//       console.error("removeMember Error:", error)
//       toast({ title: "Error", description: "Failed to delete member", variant: "destructive" })
//     }
//   }

// const handleCreateStep1 = async () => {
//   if (!validateStep1()) {
//     toast({ title: "Validation Error", description: "Please correct the errors in the client form.", variant: "destructive" });
//     return;
//   }
//   try {
//     if (!clientData.client_id) {
//       toast({ title: "Error", description: "Client ID is required.", variant: "destructive" })
//       return
//     }
    
//     console.log('Creating client with ID:', clientData.client_id); // Debug log
    
//     // Create the client first and wait for it to complete
//     const newClientId = await createClient(clientData, members)
    
//     console.log('Client created successfully with ID:', newClientId); // Debug log
    
//     // Update both clientData and contractData with the returned client_id
//     setClientData((prev) => ({ ...prev, client_id: newClientId }))
//     setContractData((prev) => ({ ...prev, client_id: newClientId }))
    
//     setStep(2)
//     toast({ title: "Success", description: "Client and members created." })
    
//     // Get new suggested ID for next client
//     suggestClientId().then((id) => {
//       setSuggestedClientId(id)
//       // Don't update clientData here since we're in step 2 now
//     })
//   } catch (err) {
//     const message = err instanceof Error ? err.message : "Failed to create client."
//     console.error("handleCreateStep1 Error:", err)
//     toast({ title: "Error", description: message, variant: "destructive" })
//   }
// }

// // Fix your handleCreateStep2 function
// const handleCreateStep2 = async () => {
//   if (!validateStep2()) {
//     toast({ title: "Validation Error", description: "Please correct the errors in the contract form.", variant: "destructive" });
//     return;
//   }
//   try {
//     // Make sure we're using the correct client_id
//     console.log('Creating contract for client_id:', contractData.client_id); // Debug log
//     console.log('Contract data:', contractData); // Debug log
    
//     // Ensure all the data is properly structured before sending
//     const contractPayload = {
//       ...contractData,
//       // Use contractData.client_id which should be set from step 1
//       client_id: contractData.client_id,
//       site_visit_date: siteVisitDates[0] || new Date().toISOString().split('T')[0],
//     };

//     console.log('Contract payload:', contractPayload); // Debug log

//     await createOrUpdateContract(contractPayload);
//     toast({ title: "Success", description: "Contract created." })
//     setStep(1)
    
//     // Reset form with new suggested ID
//     const newSuggestedId = await suggestClientId();
//     setClientData({
//       client_id: newSuggestedId,
//       client_username: "",
//       client_password: "",
//       name: "",
//       start_date: "",
//       payment_cycle: null,
//     })
//     setMembers([])
//     setContractData({
//       client_id: newSuggestedId, // Set the new suggested ID here too
//       allowed_tickets: 0,
//       total_tickets_used: 0,
//       ticket_typeRS1: 0,
//       ticket_typeRS1_used: 0,
//       ticket_typeRS2: 0,
//       ticket_typeRS2_used: 0,
//       ticket_typeRS3_1: 0,
//       ticket_typeRS3_1_used: 0,
//       ticket_typeRS3_2: 0,
//       ticket_typeRS3_2_used: 0,
//       site_visit_frequency: 0,
//       site_visit_date: "",
//       hil_admin_id: null,
//       hil_admin_team: [],
//     })
//     setSiteVisitDates([""]);
//     setSuggestedClientId(newSuggestedId);
    
//     // Refresh clients list
//     const updatedClients = await getClients();
//     setClients(updatedClients);
//   } catch (err) {
//     console.error("handleCreateStep2 Error:", err)
//     toast({ title: "Error", description: `Failed to create contract: ${err instanceof Error ? err.message : 'Unknown error'}`, variant: "destructive" })
//   }
// }

// const handleUpdate = async () => {
//   if (!validateForm() || !validateStep2()) {
//     toast({ title: "Validation Error", description: "Please correct all errors before saving.", variant: "destructive" });
//     return;
//   }
//   try {
//     const escalationLevels = new Set(members.map((m) => m.escalation_level))
//     if (escalationLevels.size !== members.length) {
//       toast({ title: "Error", description: "Duplicate escalation levels detected.", variant: "destructive" })
//       return
//     }

//     await updateClient(clientData)
//     await Promise.all(
//       members.map((m) => {
//         const memberWithClientId = { ...m, client_id: clientData.client_id }
//         if (typeof m.member_id === 'number') {
//           return updateMember(memberWithClientId);
//         } else {
//           const { member_id, ...newMemberWithoutId } = memberWithClientId;
//           return createMembers(clientData.client_id, [newMemberWithoutId]);
//         }
//       }),
//     )
//     const contractPayload = {
//       ...contractData,
//       site_visit_date: siteVisitDates.join(','),
//     };
//     await updateContract({ ...contractPayload, client_id: selectedClientId! });
//     toast({ title: "Success", description: "Client updated." })
//     setIsEditing(false)
//     fetchClientDetails(selectedClientId!)
//   } catch (err) {
//     const message = err instanceof Error ? err.message : "Failed to update client."
//     console.error("handleUpdate Error:", err)
//     toast({ title: "Error", description: message, variant: "destructive" })
//   }
// }

// const handleSelectClient = (value: string) => {
//   setSelectedClientId(value) // Keep as string
//   fetchClientDetails(value) // Pass string directly
// }

//   useEffect(() => {
//     if (activeTab === "admin" && !isSuperAdmin) {
//       setActiveTab("update")
//       toast({
//         title: "Access Denied",
//         description: "You don't have permission to access admin creation.",
//         variant: "destructive",
//       })
//     }
//   }, [activeTab, isSuperAdmin])

//   useEffect(() => {
//     if (!user || user.role !== "admin") {
//       router.push("/")
//     }
//   }, [user])

//   useEffect(() => {
//     if (contractData.site_visit_date && typeof contractData.site_visit_date === 'string') {
//       const dates = contractData.site_visit_date.split(',').map(date => date.trim()).filter(Boolean);
//       setSiteVisitDates(dates.length > 0 ? dates : Array(contractData.site_visit_frequency).fill(''));
//     } else if (contractData.site_visit_frequency > 0) {
//       setSiteVisitDates(Array(contractData.site_visit_frequency).fill(''));
//     } else {
//       setSiteVisitDates([]);
//     }
//   }, [contractData.site_visit_date, contractData.site_visit_frequency]);

//   if (!user || user.role !== "admin") {
//     return <div>Loading...</div>
//   }

//   const startEditingAdmin = (admin: any) => {
//     setEditingAdminId(admin.admin_id)
//     setEditingAdmin({ ...admin })
//   }

//   const saveEditedAdmin = async () => {
//     try {
//       // Add your update admin API call here
//       // await updateAdmin(editingAdmin)
//       toast({ title: "Success", description: "Admin updated successfully." })
//       setEditingAdminId(null)
//       const admins = await getAdmins()
//       setAdmins(admins)
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to update admin", variant: "destructive" })
//     }
//   }

//   const deleteAdmin = async (adminId: number) => {
//     try {
//       // Add your delete admin API call here
//       // await deleteAdminById(adminId)
//       toast({ title: "Success", description: "Admin deleted successfully." })
//       const admins = await getAdmins()
//       setAdmins(admins)
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to delete admin", variant: "destructive" })
//     }
//   }

//   const handleSiteVisitFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const frequency = Math.max(0, Number.parseInt(e.target.value) || 0);
//     setContractData((prev) => ({ ...prev, site_visit_frequency: frequency }));

//     const newDates = Array.from({ length: frequency }, (_, index) => siteVisitDates[index] || '');
//     setSiteVisitDates(newDates);
//   };

//   const handleSiteVisitDateChange = (index: number, value: string) => {
//     const newDates = [...siteVisitDates]
//     newDates[index] = value
//     setSiteVisitDates(newDates)
//   }

//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//         <div className="container mx-auto p-8">
//           <div className="mb-8">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-primary rounded-lg">
//                 <Building2 className="h-6 w-6 text-primary-foreground" />
//               </div>
//               <h1 className="text-4xl font-bold text-foreground">Client Management</h1>
//             </div>
//             <p className="text-muted-foreground text-lg">
//               Manage clients, members, contracts, and administrative access
//             </p>
//           </div>

//           <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
//             <TabsList className="grid w-full grid-cols-3 bg-card border border-border rounded-xl p-1 shadow-sm overflow-hidden">
//               <TabsTrigger
//                 value="creation"
//                 className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-muted/50 relative z-10"
//               >
//                 <Plus className="h-4 w-4" />
//                 Create Client
//               </TabsTrigger>
//               <TabsTrigger
//                 value="update"
//                 className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-muted/50 relative z-10"
//               >
//                 <Edit className="h-4 w-4" />
//                 Update & View
//               </TabsTrigger>
//               {isSuperAdmin && (
//                 <TabsTrigger
//                   value="admin"
//                   className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-muted/50 relative z-10"
//                 >
//                   <Shield className="h-4 w-4" />
//                   Admin Creation
//                 </TabsTrigger>
//               )}
//             </TabsList>

//             <TabsContent value="creation" className="space-y-8">
//               {step === 1 ? (
//                 <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
//                   <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-primary rounded-lg">
//                           <Users className="h-5 w-5 text-primary-foreground" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-2xl text-foreground">Step 1: Client & Members</CardTitle>
//                           <p className="text-muted-foreground mt-1">Create client profile and add team members</p>
//                         </div>
//                       </div>
//                       <Badge variant="secondary" className="px-3 py-1">
//                         1 of 2
//                       </Badge>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="p-8 space-y-8">
//                     <div className="space-y-6">
//                       <div className="flex items-center gap-2 mb-4">
//                         <Building2 className="h-5 w-5 text-primary" />
//                         <h3 className="text-xl font-semibold text-foreground">Client Information</h3>
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="client_id"
//                             className="text-sm font-medium text-foreground flex items-center gap-2"
//                           >
//                             <Target className="h-4 w-4" />
//                             Client ID
//                           </Label>
//                           <Input
//                             id="client_id"
//                             name="client_id"
                            
//                             value={clientData.client_id || ""}
//                             onChange={handleClientChange}
//                             placeholder={suggestedClientId ? `Suggested: ${suggestedClientId}` : ""}
//                             className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.client_id ? 'border-destructive' : ''}`}
//                           />
//                           {errors.client?.client_id && <p className="text-sm text-destructive mt-1">{errors.client.client_id}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="client_username"
//                             className="text-sm font-medium text-foreground flex items-center gap-2"
//                           >
//                             <User className="h-4 w-4" />
//                             Username
//                           </Label>
//                           <Input
//                             id="client_username"
//                             name="client_username"
//                             value={clientData.client_username}
//                             onChange={handleClientChange}
//                             className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.client_username ? 'border-destructive' : ''}`}
//                           />
//                           {errors.client?.client_username && <p className="text-sm text-destructive mt-1">{errors.client.client_username}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="client_password"
//                             className="text-sm font-medium text-foreground flex items-center gap-2"
//                           >
//                             <Settings className="h-4 w-4" />
//                             Password
//                           </Label>
//                           <Input
//                             id="client_password"
//                             name="client_password"
//                             type="password"
//                             value={clientData.client_password || ""}
//                             onChange={handleClientChange}
//                             className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.client_password ? 'border-destructive' : ''}`}
//                           />
//                           {errors.client?.client_password && <p className="text-sm text-destructive mt-1">{errors.client.client_password}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
//                             <Building2 className="h-4 w-4" />
//                             Company Name
//                           </Label>
//                           <Input
//                             id="name"
//                             name="name"
//                             value={clientData.name}
//                             onChange={handleClientChange}
//                             className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.name ? 'border-destructive' : ''}`}
//                           />
//                           {errors.client?.name && <p className="text-sm text-destructive mt-1">{errors.client.name}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="start_date"
//                             className="text-sm font-medium text-foreground flex items-center gap-2"
//                           >
//                             <Calendar className="h-4 w-4" />
//                             Start Date
//                           </Label>
//                           <Input
//                             id="start_date"
//                             name="start_date"
//                             type="date"
//                             value={clientData.start_date}
//                             onChange={handleClientChange}
//                             className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.start_date ? 'border-destructive' : ''}`}
//                           />
//                           {errors.client?.start_date && <p className="text-sm text-destructive mt-1">{errors.client.start_date}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="payment_cycle"
//                             className="text-sm font-medium text-foreground flex items-center gap-2"
//                           >
//                             <Clock className="h-4 w-4" />
//                             Payment Cycle
//                           </Label>
//                           <Select
//                             onValueChange={(value) =>
//                               setClientData((prev) => ({ ...prev, payment_cycle: value === "none" ? null : value }))
//                             }
//                             value={clientData.payment_cycle || "none"}
//                           >
//                             <SelectTrigger className="bg-background border-border focus:border-accent focus:ring-accent/20">
//                               <SelectValue placeholder="Select cycle" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="Monthly">Monthly</SelectItem>
//                               <SelectItem value="Quarterly">Quarterly</SelectItem>
//                               <SelectItem value="Yearly">Yearly</SelectItem>
//                               <SelectItem value="none">None</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-6 border-t border-border pt-8">
//                       <div className="flex items-center gap-2 mb-4">
//                         <Users className="h-5 w-5 text-primary" />
//                         <h3 className="text-xl font-semibold text-foreground">Team Members</h3>
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="member_name" className="text-sm font-medium text-foreground">
//                             Name
//                           </Label>
//                           <Input
//                             id="member_name"
//                             name="member_name"
//                             value={newMember.member_name}
//                             onChange={handleNewMemberChange}
//                             className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.member_name ? 'border-destructive' : ''}`}
//                           />
//                           {errors.newMember?.member_name && <p className="text-sm text-destructive mt-1">{errors.newMember.member_name}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="designation" className="text-sm font-medium text-foreground">
//                             Designation
//                           </Label>
//                           <Input
//                             id="designation"
//                             name="designation"
//                             value={newMember.designation}
//                             onChange={handleNewMemberChange}
//                             className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.designation ? 'border-destructive' : ''}`}
//                           />
//                           {errors.newMember?.designation && <p className="text-sm text-destructive mt-1">{errors.newMember.designation}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="email" className="text-sm font-medium text-foreground">
//                             Email
//                           </Label>
//                           <Input
//                             id="email"
//                             name="email"
//                             type="email"
//                             value={newMember.email}
//                             onChange={handleNewMemberChange}
//                             className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.email ? 'border-destructive' : ''}`}
//                           />
//                           {errors.newMember?.email && <p className="text-sm text-destructive mt-1">{errors.newMember.email}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="phone_number" className="text-sm font-medium text-foreground">
//                             Phone
//                           </Label>
//                           <Input
//                             id="phone_number"
//                             name="phone_number"
//                             type="tel"
//                             value={newMember.phone_number || ""}
//                             onChange={handleNewMemberChange}
//                             className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.phone_number ? 'border-destructive' : ''}`}
//                           />
//                           {errors.newMember?.phone_number && <p className="text-sm text-destructive mt-1">{errors.newMember.phone_number}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="escalation_level" className="text-sm font-medium text-foreground">
//                             Escalation Level
//                           </Label>
//                           <Input
//                             id="escalation_level"
//                             name="escalation_level"
//                             type="number"
//                             value={newMember.escalation_level}
//                             onChange={handleNewMemberChange}
//                             className="bg-background border-border focus:border-accent focus:ring-accent/20"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="member_username" className="text-sm font-medium text-foreground">
//                             Username
//                           </Label>
//                           <Input
//                             id="member_username"
//                             name="member_username"
//                             value={newMember.member_username}
//                             onChange={handleNewMemberChange}
//                             className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.member_username ? 'border-destructive' : ''}`}
//                           />
//                           {errors.newMember?.member_username && <p className="text-sm text-destructive mt-1">{errors.newMember.member_username}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="member_password" className="text-sm font-medium text-foreground">
//                             Password
//                           </Label>
//                           <div className="relative">
//                             <Input
//                               id="member_password"
//                               name="member_password"
//                               type={showPassword ? "text" : "password"}
//                               value={newMember.member_password || ""}
//                               onChange={handleNewMemberChange}
//                               className={`bg-background border-border focus:border-accent focus:ring-accent/20 pr-10 ${errors.newMember?.member_password ? 'border-destructive' : ''}`}
//                             />
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                               onClick={() => setShowPassword(!showPassword)}
//                             >
//                               {showPassword ? (
//                                 <EyeOff className="h-4 w-4" aria-hidden="true" />
//                               ) : (
//                                 <Eye className="h-4 w-4" aria-hidden="true" />
//                               )}
//                             </Button>
//                           </div>
//                           {errors.newMember?.member_password && <p className="text-sm text-destructive mt-1">{errors.newMember.member_password}</p>}
//                         </div>
//                       </div>
//                       <Button
//                         onClick={addMember}
//                         className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
//                       >
//                         <Plus className="mr-2 h-4 w-4" /> Add Member
//                       </Button>
//                     </div>

//                     {members.length > 0 && (
//                       <div className="space-y-4 border-t border-border pt-8">
//                         <h4 className="text-lg font-semibold text-foreground">Added Members</h4>
//                         <div className="rounded-lg border border-border overflow-hidden bg-background">
//                           <Table>
//                             <TableHeader>
//                               <TableRow className="bg-muted/50">
//                                 <TableHead className="font-semibold">Name</TableHead>
//                                 <TableHead className="font-semibold">Designation</TableHead>
//                                 <TableHead className="font-semibold">Email</TableHead>
//                                 <TableHead className="font-semibold">Phone</TableHead>
//                                 <TableHead className="font-semibold">Level</TableHead>
//                                 <TableHead className="font-semibold">Username</TableHead>
//                                 <TableHead className="font-semibold">Actions</TableHead>
//                               </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                               {members.map((member, index) => (
//                                 <TableRow key={index} className="hover:bg-muted/30 transition-colors">
//                                   <TableCell className="font-medium">{member.member_name}</TableCell>
//                                   <TableCell>{member.designation}</TableCell>
//                                   <TableCell className="flex items-center gap-2">
//                                     <Mail className="h-4 w-4 text-muted-foreground" />
//                                     {member.email}
//                                   </TableCell>
//                                   <TableCell className="flex items-center gap-2">
//                                     <Phone className="h-4 w-4 text-muted-foreground" />
//                                     {member.phone_number}
//                                   </TableCell>
//                                   <TableCell>
//                                     <Badge variant="outline">{member.escalation_level}</Badge>
//                                   </TableCell>
//                                   <TableCell>{member.member_username}</TableCell>
//                                   <TableCell>
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       onClick={() => removeMember(member.member_id, index)}
//                                       className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                                     >
//                                       <Trash2 className="h-4 w-4" />
//                                     </Button>
//                                   </TableCell>
//                                 </TableRow>
//                               ))}
//                             </TableBody>
//                           </Table>
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex justify-end pt-6 border-t border-border">
//                       <Button
//                         onClick={handleCreateStep1}
//                         className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 py-3"
//                       >
//                         <ChevronRight className="mr-2 h-4 w-4" />
//                         Next: Contract Details
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
//                   <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-primary rounded-lg">
//                           <FileText className="h-5 w-5 text-primary-foreground" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-2xl text-foreground">Step 2: Contract Details</CardTitle>
//                           <p className="text-muted-foreground mt-1">
//                             Configure service agreements and ticket allocations
//                           </p>
//                         </div>
//                       </div>
//                       <Badge variant="secondary" className="px-3 py-1">
//                         2 of 2
//                       </Badge>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="p-8 space-y-8">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       <div className="space-y-2">
//                         <Label htmlFor="allowed_tickets" className="text-sm font-medium text-foreground">
//                           Allowed Tickets
//                         </Label>
//                         <Input
//                           id="allowed_tickets"
//                           name="allowed_tickets"
//                           type="number"
//                           value={contractData.allowed_tickets}
//                           onChange={handleContractChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.allowed_tickets ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.allowed_tickets && <p className="text-sm text-destructive mt-1">{errors.contract.allowed_tickets}</p>}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="total_tickets_used" className="text-sm font-medium text-foreground">
//                           Total Tickets Used
//                         </Label>
//                         <Input
//                           id="total_tickets_used"
//                           name="total_tickets_used"
//                           type="number"
//                           value={contractData.total_tickets_used}
//                           onChange={handleContractChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.total_tickets_used ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.total_tickets_used && <p className="text-sm text-destructive mt-1">{errors.contract.total_tickets_used}</p>}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="ticket_typeRS1" className="text-sm font-medium text-foreground">
//                           RS1 Tickets
//                         </Label>
//                         <Input
//                           id="ticket_typeRS1"
//                           name="ticket_typeRS1"
//                           type="number"
//                           value={contractData.ticket_typeRS1}
//                           onChange={handleContractChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS1 ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.ticket_typeRS1 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS1}</p>}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="ticket_typeRS1_used" className="text-sm font-medium text-foreground">
//                           RS1 Used
//                         </Label>
//                         <Input
//                           id="ticket_typeRS1_used"
//                           name="ticket_typeRS1_used"
//                           type="number"
//                           value={contractData.ticket_typeRS1_used}
//                           onChange={handleContractChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS1_used ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.ticket_typeRS1_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS1_used}</p>}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="ticket_typeRS2" className="text-sm font-medium text-foreground">
//                           RS2 Tickets
//                         </Label>
//                         <Input
//                           id="ticket_typeRS2"
//                           name="ticket_typeRS2"
//                           type="number"
//                           value={contractData.ticket_typeRS2}
//                           onChange={handleContractChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS2 ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.ticket_typeRS2 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS2}</p>}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="ticket_typeRS2_used" className="text-sm font-medium text-foreground">
//                           RS2 Used
//                         </Label>
//                         <Input
//                           id="ticket_typeRS2_used"
//                           name="ticket_typeRS2_used"
//                           type="number"
//                           value={contractData.ticket_typeRS2_used}
//                           onChange={handleContractChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS2_used ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.ticket_typeRS2_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS2_used}</p>}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="ticket_typeRS3_1" className="text-sm font-medium text-foreground">
//                           RS3-1 Tickets
//                         </Label>
//                         <Input
//                           id="ticket_typeRS3_1"
//                           name="ticket_typeRS3_1"
//                           type="number"
//                           value={contractData.ticket_typeRS3_1}
//                           onChange={handleContractChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_1 ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.ticket_typeRS3_1 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_1}</p>}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="ticket_typeRS3_1_used" className="text-sm font-medium text-foreground">
//                           RS3-1 Used
//                         </Label>
//                         <Input
//                           id="ticket_typeRS3_1_used"
//                           name="ticket_typeRS3_1_used"
//                           type="number"
//                           value={contractData.ticket_typeRS3_1_used}
//                           onChange={handleContractChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_1_used ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.ticket_typeRS3_1_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_1_used}</p>}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="ticket_typeRS3_2" className="text-sm font-medium text-foreground">
//                           RS3-2 Tickets
//                         </Label>
//                         <Input
//                           id="ticket_typeRS3_2"
//                           name="ticket_typeRS3_2"
//                           type="number"
//                           value={contractData.ticket_typeRS3_2}
//                           onChange={handleContractChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_2 ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.ticket_typeRS3_2 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_2}</p>}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="ticket_typeRS3_2_used" className="text-sm font-medium text-foreground">
//                           RS3-2 Used
//                         </Label>
//                         <Input
//                           id="ticket_typeRS3_2_used"
//                           name="ticket_typeRS3_2_used"
//                           type="number"
//                           value={contractData.ticket_typeRS3_2_used}
//                           onChange={handleContractChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_2_used ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.ticket_typeRS3_2_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_2_used}</p>}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="site_visit_frequency" className="text-sm font-medium text-foreground">
//                           Site Visit Frequency
//                         </Label>
//                         <Input
//                           id="site_visit_frequency"
//                           name="site_visit_frequency"
//                           type="number"
//                           min="0"
//                           value={contractData.site_visit_frequency}
//                           onChange={handleSiteVisitFrequencyChange}
//                           className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.site_visit_frequency ? 'border-destructive' : ''}`}
//                         />
//                         {errors.contract?.site_visit_frequency && <p className="text-sm text-destructive mt-1">{errors.contract.site_visit_frequency}</p>}
//                       </div>

//                       {contractData.site_visit_frequency > 0 && (
//                         <div className="space-y-4 col-span-3">
//                           <Label className="text-sm font-medium text-foreground">
//                             Site Visit Dates ({contractData.site_visit_frequency} visits)
//                           </Label>
//                           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                             {siteVisitDates.map((date, index) => (
//                               <div key={index} className="space-y-2">
//                                 <Label className="text-xs text-muted-foreground">Visit {index + 1} Date</Label>
//                                 <Input
//                                   type="date"
//                                   value={date}
//                                   onChange={(e) => handleSiteVisitDateChange(index, e.target.value)}
//                                   className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.site_visit_dates?.[index] ? 'border-destructive' : ''}`}
//                                 />
//                                 {errors.contract?.site_visit_dates?.[index] && <p className="text-sm text-destructive mt-1">{errors.contract.site_visit_dates[index]}</p>}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                       <div className="space-y-2">
//                         <Label htmlFor="hil_admin_id" className="text-sm font-medium text-foreground">
//                           Allocate HIL Admin
//                         </Label>
//                         <Select
//                           onValueChange={handleHilAdminChange}
//                           value={contractData.hil_admin_id?.toString() || "none"}
//                         >
//                           <SelectTrigger className="bg-background border-border focus:border-accent focus:ring-accent/20">
//                             <SelectValue placeholder="Select Admin" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="none">None</SelectItem>
//                             {admins.map((admin) => (
//                               <SelectItem key={admin.admin_id} value={admin.admin_id.toString()}>
//                                 {admin.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <div className="flex gap-4 pt-6 border-t border-border">
//                       <Button variant="outline" onClick={() => setStep(1)} className="px-6">
//                         Back
//                       </Button>
//                       <Button
//                         onClick={handleCreateStep2}
//                         className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
//                       >
//                         <Save className="mr-2 h-4 w-4" />
//                         Complete Setup
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </TabsContent>

//             <TabsContent value="update" className="space-y-8">
//               <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
//                 <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-primary rounded-lg">
//                       <Building2 className="h-5 w-5 text-primary-foreground" />
//                     </div>
//                     <div>
//                       <CardTitle className="text-2xl text-foreground">Select Client</CardTitle>
//                       <p className="text-muted-foreground mt-1">Choose a client to view or update their information</p>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="p-8">
//                   <Select onValueChange={handleSelectClient}>
//                     <SelectTrigger className="bg-background border-border focus:border-accent focus:ring-accent/20 h-12">
//                       <SelectValue placeholder="Select a client to manage" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {clients.map((client) => (
//                         <SelectItem key={client.client_id} value={client.client_id.toString()}>
//                           <div className="flex items-center gap-2">
//                             <Building2 className="h-4 w-4" />
//                             {client.name}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </CardContent>
//               </Card>

//               {/* Rest of the update/view content remains the same but with enhanced styling */}
//               {selectedClientId && (
//                 <>
//                   {/* Client Details Card */}
//                   <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
//                     <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 bg-primary rounded-lg">
//                             <Building2 className="h-5 w-5 text-primary-foreground" />
//                           </div>
//                           <div>
//                             <CardTitle className="text-2xl text-foreground">Client Details</CardTitle>
//                             <p className="text-muted-foreground mt-1">View and manage client information</p>
//                           </div>
//                         </div>
//                         <Button
//                           onClick={() => setIsEditing(!isEditing)}
//                           variant="outline"
//                           className="bg-background hover:bg-muted border-border"
//                         >
//                           <Edit className="h-4 w-4 mr-2" />
//                           {isEditing ? "Cancel Edit" : "Edit Client"}
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="p-8">
//                       {loading ? (
//                         <div className="flex items-center justify-center py-12">
//                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                         </div>
//                       ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                           <div className="space-y-2">
//                             <Label htmlFor="client_id" className="text-sm font-medium text-foreground">
//                               Client ID
//                             </Label>
//                             <Input
//                               id="client_id"
//                               name="client_id"
                              
//                               value={clientData.client_id}
//                               disabled
//                               className="bg-muted border-border"
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="client_username" className="text-sm font-medium text-foreground">
//                               Username
//                             </Label>
//                             <Input
//                               id="client_username"
//                               name="client_username"
//                               value={clientData.client_username}
//                               onChange={handleClientChange}
//                               disabled={!isEditing}
//                               className={
//                                 isEditing
//                                   ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.client_username ? 'border-destructive' : ''}`
//                                   : "bg-muted border-border"
//                               }
//                             />
//                             {isEditing && errors.client?.client_username && <p className="text-sm text-destructive mt-1">{errors.client.client_username}</p>}
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="name" className="text-sm font-medium text-foreground">
//                               Company Name
//                             </Label>
//                             <Input
//                               id="name"
//                               name="name"
//                               value={clientData.name}
//                               onChange={handleClientChange}
//                               disabled={!isEditing}
//                               className={
//                                 isEditing
//                                   ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.name ? 'border-destructive' : ''}`
//                                   : "bg-muted border-border"
//                               }
//                             />
//                             {isEditing && errors.client?.name && <p className="text-sm text-destructive mt-1">{errors.client.name}</p>}
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="start_date" className="text-sm font-medium text-foreground">
//                               Start Date
//                             </Label>
//                             <Input
//                               id="start_date"
//                               name="start_date"
//                               type="date"
//                               value={clientData.start_date}
//                               onChange={handleClientChange}
//                               disabled={!isEditing}
//                               className={
//                                 isEditing
//                                   ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.start_date ? 'border-destructive' : ''}`
//                                   : "bg-muted border-border"
//                               }
//                             />
//                             {isEditing && errors.client?.start_date && <p className="text-sm text-destructive mt-1">{errors.client.start_date}</p>}
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="payment_cycle" className="text-sm font-medium text-foreground">
//                               Payment Cycle
//                             </Label>
//                             <Select
//                               onValueChange={(value) =>
//                                 setClientData((prev) => ({ ...prev, payment_cycle: value === "none" ? null : value }))
//                               }
//                               value={clientData.payment_cycle || "none"}
//                               disabled={!isEditing}
//                             >
//                               <SelectTrigger
//                                 className={
//                                   isEditing
//                                     ? "bg-background border-border focus:border-accent focus:ring-accent/20"
//                                     : "bg-muted border-border"
//                                 }
//                               >
//                                 <SelectValue placeholder="Select cycle" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="Monthly">Monthly</SelectItem>
//                                 <SelectItem value="Quarterly">Quarterly</SelectItem>
//                                 <SelectItem value="Yearly">Yearly</SelectItem>
//                                 <SelectItem value="none">None</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>

//                   {/* Members Card - keeping existing functionality with enhanced styling */}
//                   <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
//                     <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-primary rounded-lg">
//                           <Users className="h-5 w-5 text-primary-foreground" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-2xl text-foreground">Team Members</CardTitle>
//                           <p className="text-muted-foreground mt-1">Manage client team members and access levels</p>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="p-8">
//                       <div className="rounded-lg border border-border overflow-hidden bg-background">
//                         <Table>
//                           <TableHeader>
//                             <TableRow className="bg-muted/50">
//                               <TableHead className="font-semibold">Name</TableHead>
//                               <TableHead className="font-semibold">Designation</TableHead>
//                               <TableHead className="font-semibold">Email</TableHead>
//                               <TableHead className="font-semibold">Phone</TableHead>
//                               <TableHead className="font-semibold">Level</TableHead>
//                               <TableHead className="font-semibold">Username</TableHead>
//                               <TableHead className="font-semibold">Actions</TableHead>
//                             </TableRow>
//                           </TableHeader>
//                           <TableBody>
//                             {members.map((member, index) =>
//                               editingMemberIndex === index ? (
//                                 <TableRow key={index} className="bg-accent/5">
//                                   <TableCell>
//                                     <Input
//                                       name="member_name"
//                                       value={editingMember?.member_name || ""}
//                                       onChange={handleEditMemberChange}
//                                       className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.members?.[index]?.member_name ? 'border-destructive' : ''}`}
//                                     />
//                                     {errors.members?.[index]?.member_name && <p className="text-sm text-destructive mt-1">{errors.members[index].member_name}</p>}
//                                   </TableCell>
//                                   <TableCell>
//                                     <Input
//                                       name="designation"
//                                       value={editingMember?.designation || ""}
//                                       onChange={handleEditMemberChange}
//                                       className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.members?.[index]?.designation ? 'border-destructive' : ''}`}
//                                     />
//                                     {errors.members?.[index]?.designation && <p className="text-sm text-destructive mt-1">{errors.members[index].designation}</p>}
//                                   </TableCell>
//                                   <TableCell>
//                                     <Input
//                                       name="email"
//                                       type="email"
//                                       value={editingMember?.email || ""}
//                                       onChange={handleEditMemberChange}
//                                       className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.members?.[index]?.email ? 'border-destructive' : ''}`}
//                                     />
//                                     {errors.members?.[index]?.email && <p className="text-sm text-destructive mt-1">{errors.members[index].email}</p>}
//                                   </TableCell>
//                                   <TableCell>
//                                     <Input
//                                       name="phone_number"
//                                       value={editingMember?.phone_number || ""}
//                                       type="tel"
//                                       onChange={handleEditMemberChange}
//                                       className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.members?.[index]?.phone_number ? 'border-destructive' : ''}`}
//                                     />
//                                     {errors.members?.[index]?.phone_number && <p className="text-sm text-destructive mt-1">{errors.members[index].phone_number}</p>}
//                                   </TableCell>
//                                   <TableCell>
//                                     <Input
//                                       name="escalation_level"
//                                       type="number"
//                                       value={editingMember?.escalation_level || ""}
//                                       onChange={handleEditMemberChange}
//                                       className="bg-background border-border focus:border-accent focus:ring-accent/20"
//                                     />
//                                   </TableCell>
//                                   <TableCell>
//                                     <Input
//                                       name="member_username"
//                                       value={editingMember?.member_username || ""}
//                                       onChange={handleEditMemberChange}
//                                       className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.members?.[index]?.member_username ? 'border-destructive' : ''}`}
//                                     />
//                                     {errors.members?.[index]?.member_username && <p className="text-sm text-destructive mt-1">{errors.members[index].member_username}</p>}
//                                   </TableCell>
//                                   <TableCell>
//                                     <div className="flex gap-2">
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={saveEditedMember}
//                                         className="text-green-600 hover:text-green-700 hover:bg-green-50"
//                                       >
//                                         <CheckCircle2 className="h-4 w-4" />
//                                       </Button>
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={cancelEditingMember}
//                                         className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                       >
//                                         <AlertCircle className="h-4 w-4" />
//                                       </Button>
//                                     </div>
//                                   </TableCell>
//                                 </TableRow>
//                               ) : (
//                                 <TableRow key={index} className="hover:bg-muted/30 transition-colors">
//                                   <TableCell className="font-medium">
//                                     {member.member_name}
//                                     {errors.members?.[index]?.member_name && <p className="text-sm text-destructive mt-1">{errors.members[index].member_name}</p>}
//                                   </TableCell>
//                                   <TableCell>
//                                     {member.designation}
//                                     {errors.members?.[index]?.designation && <p className="text-sm text-destructive mt-1">{errors.members[index].designation}</p>}
//                                   </TableCell>
//                                   <TableCell className="flex items-center gap-2">
//                                     <Mail className="h-4 w-4 text-muted-foreground" />
//                                     {member.email}
//                                     {errors.members?.[index]?.email && <p className="text-sm text-destructive mt-1">{errors.members[index].email}</p>}
//                                   </TableCell>
//                                   <TableCell className="flex items-center gap-2">
//                                     <Phone className="h-4 w-4 text-muted-foreground" />
//                                     {member.phone_number}
//                                     {errors.members?.[index]?.phone_number && <p className="text-sm text-destructive mt-1">{errors.members[index].phone_number}</p>}
//                                   </TableCell>
//                                   <TableCell>
//                                     <Badge variant="outline">{member.escalation_level}</Badge>
//                                   </TableCell>
//                                   <TableCell>
//                                     {member.member_username}
//                                     {errors.members?.[index]?.member_username && <p className="text-sm text-destructive mt-1">{errors.members[index].member_username}</p>}
//                                   </TableCell>
//                                   <TableCell>
//                                     <div className="flex gap-2">
//                                       {isEditing && (
//                                         <Button
//                                           variant="ghost"
//                                           size="sm"
//                                           onClick={() => startEditingMember(index)}
//                                           className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
//                                         >
//                                           <Edit className="h-4 w-4" />
//                                         </Button>
//                                       )}
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => removeMember(member.member_id, index)}
//                                         className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                                       >
//                                         <Trash2 className="h-4 w-4" />
//                                       </Button>
//                                     </div>
//                                   </TableCell>
//                                 </TableRow>
//                               ),
//                             )}
//                           </TableBody>
//                         </Table>
//                       </div>

//                       {/* Add new member section when editing */}
//                       {isEditing && (
//                         <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
//                           <h4 className="text-lg font-semibold text-foreground mb-4">Add New Member</h4>
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
//                             <div className="space-y-2">
//                               <Input
//                                 name="member_name"
//                                 placeholder="Name"
//                                 value={newMember.member_name}
//                                 onChange={handleNewMemberChange}
//                                 className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.member_name ? 'border-destructive' : ''}`}
//                               />
//                               {errors.newMember?.member_name && <p className="text-sm text-destructive mt-1">{errors.newMember.member_name}</p>}
//                             </div>
//                             <div className="space-y-2">
//                               <Input
//                                 name="designation"
//                                 placeholder="Designation"
//                                 value={newMember.designation}
//                                 onChange={handleNewMemberChange}
//                                 className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.designation ? 'border-destructive' : ''}`}
//                               />
//                               {errors.newMember?.designation && <p className="text-sm text-destructive mt-1">{errors.newMember.designation}</p>}
//                             </div>
//                             <div className="space-y-2">
//                               <Input
//                                 name="email"
//                                 type="email"
//                                 placeholder="Email"
//                                 value={newMember.email}
//                                 onChange={handleNewMemberChange}
//                                 className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.email ? 'border-destructive' : ''}`}
//                               />
//                               {errors.newMember?.email && <p className="text-sm text-destructive mt-1">{errors.newMember.email}</p>}
//                             </div>
//                             <div className="space-y-2">
//                               <Input
//                                 name="phone_number"
//                                 placeholder="Phone"
//                                 value={newMember.phone_number || ""}
//                                 onChange={handleNewMemberChange}
//                                 className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.phone_number ? 'border-destructive' : ''}`}
//                               />
//                               {errors.newMember?.phone_number && <p className="text-sm text-destructive mt-1">{errors.newMember.phone_number}</p>}
//                             </div>
//                             <div className="space-y-2">
//                               <Input
//                                 name="escalation_level"
//                                 type="number"
//                                 placeholder="Level"
//                                 value={newMember.escalation_level}
//                                 onChange={handleNewMemberChange}
//                                 className="bg-background border-border focus:border-accent focus:ring-accent/20"
//                               />
//                             </div>
//                             <div className="space-y-2">
//                               <Input
//                                 name="member_username"
//                                 placeholder="Username"
//                                 value={newMember.member_username}
//                                 onChange={handleNewMemberChange}
//                                 className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.member_username ? 'border-destructive' : ''}`}
//                               />
//                               {errors.newMember?.member_username && <p className="text-sm text-destructive mt-1">{errors.newMember.member_username}</p>}
//                             </div>
//                             <div className="space-y-2 relative">
//                               <Input
//                                 name="member_password"
//                                 type={showPassword ? "text" : "password"}
//                                 placeholder="Password"
//                                 value={newMember.member_password || ""}
//                                 onChange={handleNewMemberChange}
//                                 className={`bg-background border-border focus:border-accent focus:ring-accent/20 pr-10 ${errors.newMember?.member_password ? 'border-destructive' : ''}`}
//                               />
//                               <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="sm"
//                                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                                 onClick={() => setShowPassword(!showPassword)}
//                               >
//                                 {showPassword ? (
//                                   <EyeOff className="h-4 w-4" aria-hidden="true" />
//                                 ) : (
//                                   <Eye className="h-4 w-4" aria-hidden="true" />
//                                 )}
//                               </Button>
//                               {errors.newMember?.member_password && <p className="text-sm text-destructive mt-1">{errors.newMember.member_password}</p>}
//                             </div>
//                           </div>
//                           <Button onClick={addMember} className="bg-accent hover:bg-accent/90 text-accent-foreground">
//                             <Plus className="mr-2 h-4 w-4" /> Add Member
//                           </Button>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>

//                   {/* Contract Details Card - keeping existing functionality with enhanced styling */}
//                   <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
//                     <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-primary rounded-lg">
//                           <FileText className="h-5 w-5 text-primary-foreground" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-2xl text-foreground">Contract Details</CardTitle>
//                           <p className="text-muted-foreground mt-1">Service agreements and ticket allocations</p>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="p-8">
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {/* Contract form fields with enhanced styling - keeping all existing functionality */}
//                         <div className="space-y-2">
//                           <Label htmlFor="allowed_tickets" className="text-sm font-medium text-foreground">
//                             Allowed Tickets
//                           </Label>
//                           <Input
//                             id="allowed_tickets"
//                             name="allowed_tickets"
//                             type="number"
//                             value={contractData.allowed_tickets}
//                             onChange={handleContractChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.allowed_tickets ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.allowed_tickets && <p className="text-sm text-destructive mt-1">{errors.contract.allowed_tickets}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="total_tickets_used" className="text-sm font-medium text-foreground">
//                             Total Tickets Used
//                           </Label>
//                           <Input
//                             id="total_tickets_used"
//                             name="total_tickets_used"
//                             type="number"
//                             value={contractData.total_tickets_used}
//                             onChange={handleContractChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.total_tickets_used ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.total_tickets_used && <p className="text-sm text-destructive mt-1">{errors.contract.total_tickets_used}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="ticket_typeRS1" className="text-sm font-medium text-foreground">RS1</Label>
//                           <Input
//                             id="ticket_typeRS1"
//                             name="ticket_typeRS1"
//                             type="number"
//                             value={contractData.ticket_typeRS1}
//                             onChange={handleContractChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS1 ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.ticket_typeRS1 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS1}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="ticket_typeRS1_used" className="text-sm font-medium text-foreground">RS1 Used</Label>
//                           <Input
//                             id="ticket_typeRS1_used"
//                             name="ticket_typeRS1_used"
//                             type="number"
//                             value={contractData.ticket_typeRS1_used}
//                             onChange={handleContractChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS1_used ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.ticket_typeRS1_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS1_used}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="ticket_typeRS2" className="text-sm font-medium text-foreground">RS2</Label>
//                           <Input
//                             id="ticket_typeRS2"
//                             name="ticket_typeRS2"
//                             type="number"
//                             value={contractData.ticket_typeRS2}
//                             onChange={handleContractChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS2 ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.ticket_typeRS2 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS2}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="ticket_typeRS2_used" className="text-sm font-medium text-foreground">RS2 Used</Label>
//                           <Input
//                             id="ticket_typeRS2_used"
//                             name="ticket_typeRS2_used"
//                             type="number"
//                             value={contractData.ticket_typeRS2_used}
//                             onChange={handleContractChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS2_used ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.ticket_typeRS2_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS2_used}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="ticket_typeRS3_1" className="text-sm font-medium text-foreground">RS3-1</Label>
//                           <Input
//                             id="ticket_typeRS3_1"
//                             name="ticket_typeRS3_1"
//                             type="number"
//                             value={contractData.ticket_typeRS3_1}
//                             onChange={handleContractChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_1 ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.ticket_typeRS3_1 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_1}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="ticket_typeRS3_1_used" className="text-sm font-medium text-foreground">RS3-1 Used</Label>
//                           <Input
//                             id="ticket_typeRS3_1_used"
//                             name="ticket_typeRS3_1_used"
//                             type="number"
//                             value={contractData.ticket_typeRS3_1_used}
//                             onChange={handleContractChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_1_used ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.ticket_typeRS3_1_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_1_used}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="ticket_typeRS3_2" className="text-sm font-medium text-foreground">RS3-2</Label>
//                           <Input
//                             id="ticket_typeRS3_2"
//                             name="ticket_typeRS3_2"
//                             type="number"
//                             value={contractData.ticket_typeRS3_2}
//                             onChange={handleContractChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_2 ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.ticket_typeRS3_2 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_2}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="ticket_typeRS3_2_used" className="text-sm font-medium text-foreground">RS3-2 Used</Label>
//                           <Input
//                             id="ticket_typeRS3_2_used"
//                             name="ticket_typeRS3_2_used"
//                             type="number"
//                             value={contractData.ticket_typeRS3_2_used}
//                             onChange={handleContractChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_2_used ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.ticket_typeRS3_2_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_2_used}</p>}
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="site_visit_frequency" className="text-sm font-medium text-foreground">Site Visit Frequency</Label>
//                           <Input
//                             id="site_visit_frequency"
//                             name="site_visit_frequency"
//                             type="number"
//                             value={contractData.site_visit_frequency}
//                             onChange={handleSiteVisitFrequencyChange}
//                             disabled={!isEditing}
//                             className={
//                               isEditing
//                                 ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.site_visit_frequency ? 'border-destructive' : ''}`
//                                 : "bg-muted border-border"
//                             }
//                           />
//                           {isEditing && errors.contract?.site_visit_frequency && <p className="text-sm text-destructive mt-1">{errors.contract.site_visit_frequency}</p>}
//                         </div>

//                         {contractData.site_visit_frequency > 0 && (
//                           <div className="space-y-4 col-span-3">
//                             <Label className="text-sm font-medium text-foreground">
//                               Site Visit Dates ({contractData.site_visit_frequency} visits)
//                             </Label>
//                             {isEditing ? (
//                               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                                 {siteVisitDates.map((date, index) => (
//                                   <div key={index} className="space-y-2">
//                                     <Label className="text-xs text-muted-foreground">Visit {index + 1} Date</Label>
//                                     <Input
//                                       type="date"
//                                       value={date}
//                                       onChange={(e) => handleSiteVisitDateChange(index, e.target.value)}
//                                       className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.site_visit_dates?.[index] ? 'border-destructive' : ''}`}
//                                     />
//                                     {errors.contract?.site_visit_dates?.[index] && <p className="text-sm text-destructive mt-1">{errors.contract.site_visit_dates[index]}</p>}
//                                   </div>
//                                 ))}
//                               </div>
//                             ) : (
//                               <div className="text-muted-foreground">
//                                 {siteVisitDates.join(', ') || 'No dates set'}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                         <div className="space-y-2">
//                           <Label htmlFor="hil_admin_id" className="text-sm font-medium text-foreground">Allocate HIL Admin</Label>
//                           <Select onValueChange={handleHilAdminChange} value={contractData.hil_admin_id?.toString() || 'none'} disabled={!isEditing}>
//                             <SelectTrigger className={isEditing ? "bg-background border-border" : "bg-muted border-border"}>
//                               <SelectValue placeholder="Select Admin" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="none">None</SelectItem>
//                               {admins.map((admin) => (
//                                 <SelectItem key={admin.admin_id} value={admin.admin_id.toString()}>
//                                   {admin.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {isEditing && (
//                     <div className="flex justify-end mt-8">
//                       <Button
//                         onClick={handleUpdate}
//                         className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 py-3"
//                       >
//                         <Save className="mr-2 h-4 w-4" />
//                         Save Changes
//                       </Button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </TabsContent>

//             {/* Admin Creation Tab - keeping existing functionality with enhanced styling */}
//             <TabsContent value="admin" className="space-y-8">
//               {!isSuperAdmin ? (
//                 <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
//                   <CardContent className="p-12 text-center">
//                     <div className="flex flex-col items-center gap-4">
//                       <div className="p-4 bg-destructive/10 rounded-full">
//                         <Shield className="h-8 w-8 text-destructive" />
//                       </div>
//                       <h3 className="text-xl font-semibold text-foreground">Access Denied</h3>
//                       <p className="text-muted-foreground">Only the super admin (ID: 1) can view this section.</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <>
//                   <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
//                     <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-primary rounded-lg">
//                           <Shield className="h-5 w-5 text-primary-foreground" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-2xl text-foreground">Create Admin</CardTitle>
//                           <p className="text-muted-foreground mt-1">Add new administrative users to the system</p>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="p-8">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-2">
//                           <Label htmlFor="name" className="text-sm font-medium text-foreground">
//                             Name
//                           </Label>
//                           <Input
//                             id="name"
//                             name="name"
//                             value={newAdmin.name}
//                             onChange={handleNewAdminChange}
//                             className="bg-background border-border focus:border-accent focus:ring-accent/20"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="designation" className="text-sm font-medium text-foreground">
//                             Designation
//                           </Label>
//                           <Input
//                             id="designation"
//                             name="designation"
//                             value={newAdmin.designation}
//                             onChange={handleNewAdminChange}
//                             className="bg-background border-border focus:border-accent focus:ring-accent/20"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="username" className="text-sm font-medium text-foreground">
//                             Username
//                           </Label>
//                           <Input
//                             id="username"
//                             name="username"
//                             value={newAdmin.username}
//                             onChange={handleNewAdminChange}
//                             className="bg-background border-border focus:border-accent focus:ring-accent/20"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="password" className="text-sm font-medium text-foreground">
//                             Password
//                           </Label>
//                           <Input
//                             id="password"
//                             name="password"
//                             type="password"
//                             value={newAdmin.password}
//                             onChange={handleNewAdminChange}
//                             className="bg-background border-border focus:border-accent focus:ring-accent/20"
//                           />
//                         </div>
//                       </div>
//                       <div className="flex justify-end pt-6">
//                         <Button
//                           onClick={handleCreateAdmin}
//                           className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
//                         >
//                           <Save className="mr-2 h-4 w-4" /> Create Admin
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
//                     <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-primary rounded-lg">
//                           <Users className="h-5 w-5 text-primary-foreground" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-2xl text-foreground">Existing Admins</CardTitle>
//                           <p className="text-muted-foreground mt-1">Manage system administrators</p>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="p-8">
//                       <div className="rounded-lg border border-border overflow-hidden bg-background">
//                         <Table>
//                           <TableHeader>
//                             <TableRow className="bg-muted/50">
//                               <TableHead className="font-semibold">Name</TableHead>
//                               <TableHead className="font-semibold">Designation</TableHead>
//                               <TableHead className="font-semibold">Username</TableHead>
//                               <TableHead className="font-semibold">Actions</TableHead>
//                             </TableRow>
//                           </TableHeader>
//                           <TableBody>
//                             {admins.map((admin) =>
//                               editingAdminId === admin.admin_id ? (
//                                 <TableRow key={admin.admin_id} className="bg-muted/20">
//                                   <TableCell>
//                                     <Input
//                                       value={editingAdmin.name}
//                                       onChange={(e) => setEditingAdmin((prev) => ({ ...prev, name: e.target.value }))}
//                                       className="bg-background border-border"
//                                     />
//                                   </TableCell>
//                                   <TableCell>
//                                     <Input
//                                       value={editingAdmin.designation}
//                                       onChange={(e) =>
//                                         setEditingAdmin((prev) => ({ ...prev, designation: e.target.value }))
//                                       }
//                                       className="bg-background border-border"
//                                     />
//                                   </TableCell>
//                                   <TableCell>
//                                     <Input
//                                       value={editingAdmin.username}
//                                       onChange={(e) =>
//                                         setEditingAdmin((prev) => ({ ...prev, username: e.target.value }))
//                                       }
//                                       className="bg-background border-border"
//                                     />
//                                   </TableCell>
//                                   <TableCell>
//                                     <div className="flex gap-2">
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={saveEditedAdmin}
//                                         className="text-green-600 hover:text-green-700 hover:bg-green-50"
//                                       >
//                                         <CheckCircle2 className="h-4 w-4" />
//                                       </Button>
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => setEditingAdminId(null)}
//                                         className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                       >
//                                         <AlertCircle className="h-4 w-4" />
//                                       </Button>
//                                     </div>
//                                   </TableCell>
//                                 </TableRow>
//                               ) : (
//                                 <TableRow key={admin.admin_id} className="hover:bg-muted/30 transition-colors">
//                                   <TableCell className="font-medium">{admin.name}</TableCell>
//                                   <TableCell>{admin.designation}</TableCell>
//                                   <TableCell>{admin.username}</TableCell>
//                                   <TableCell>
//                                     <div className="flex gap-2">
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => startEditingAdmin(admin)}
//                                         className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
//                                       >
//                                         <Edit className="h-4 w-4" />
//                                       </Button>
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => deleteAdmin(admin.admin_id)}
//                                         className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                                       >
//                                         <Trash2 className="h-4 w-4" />
//                                       </Button>
//                                     </div>
//                                   </TableCell>
//                                 </TableRow>
//                               ),
//                             )}
//                           </TableBody>
//                         </Table>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </MainLayout>
//   )
// }


























"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
  Plus,
  Save,
  Users,
  Building2,
  FileText,
  Shield,
  Calendar,
  Phone,
  Mail,
  User,
  Settings,
  ChevronRight,
  Clock,
  Target,
  Eye,
  EyeOff,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import type { ClientFormData, MemberFormData, ContractFormData, AdminFormData } from "@/types/client"
import {
  getClients,
  suggestClientId,
  createClient,
  updateClient,
  createMembers,
  updateMember,
  deleteMember,
  getClientDetails,
  createOrUpdateContract,
  updateContract,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from "../actions/client-actions"
import MainLayout from "@/components/Layout/MainLayout"
import { useAuth } from "@/contexts/AuthContext"
import { AdminFormErrors } from '@/types';

export default function ClientDefinitionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("creation")
  const [step, setStep] = useState(1)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [clients, setClients] = useState<{ client_id: string; name: string }[]>([])
  const [suggestedClientId, setSuggestedClientId] = useState<string | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [clientData, setClientData] = useState<ClientFormData>({
    client_id: "",
    client_username: "",
    client_password: "",
    name: "",
    start_date: "",
    payment_cycle: null,
  })
  const [members, setMembers] = useState<MemberFormData[]>([])
  const [newMember, setNewMember] = useState<MemberFormData>({
    member_name: "",
    designation: "",
    email: "",
    phone_number: "",
    escalation_level: 1,
    member_username: "",
    member_password: "",
  })
  const [contractData, setContractData] = useState<ContractFormData>({
    client_id: "",
    allowed_tickets: 0,
    total_tickets_used: 0,
    ticket_typeRS1: 0,
    ticket_typeRS1_used: 0,
    ticket_typeRS2: 0,
    ticket_typeRS2_used: 0,
    ticket_typeRS3_1: 0,
    ticket_typeRS3_1_used: 0,
    ticket_typeRS3_2: 0,
    ticket_typeRS3_2_used: 0,
    site_visit_frequency: 0,
    site_visit_date: "",
    hil_admin_id: null,
    hil_admin_team: [],
  })
const [admins, setAdmins] = useState<{ admin_id: number; name: string; designation: string; username: string; email: string;  }[]>([])
  const [newAdmin, setNewAdmin] = useState<AdminFormData>({
    name: "",
    designation: "",
    username: "",
    password: "",
    email: "",
    mobile_number: "",
  })
  const [adminErrors, setAdminErrors] = useState<AdminFormErrors>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [adminToDelete, setAdminToDelete] = useState<number | null>(null);

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [creatingClient, setCreatingClient] = useState(false)
  const [clientCreatedOpen, setClientCreatedOpen] = useState(false)
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null)
  const [editingMember, setEditingMember] = useState<MemberFormData | null>(null)
  const [siteVisitDates, setSiteVisitDates] = useState<string[]>([""])
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null)
  const [editingAdmin, setEditingAdmin] = useState<any>({})
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<any>({})



  const isSuperAdmin = user?.role === "admin" && user.id === 1

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9+\-\s()]+$/
    return phoneRegex.test(phone) && phone.length >= 10
  }

  const validateEmail = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  

  const validateMember = (member: MemberFormData, isNew: boolean = false) => {
    const memberErrors: any = {};
    let isValid = true;

    if (!member.member_name.trim()) {
      memberErrors.member_name = "Name is required.";
      isValid = false;
    }
    if (!validateEmail(member.email)) {
      memberErrors.email = "Invalid email format.";
      isValid = false;
    }
    if (!validatePhoneNumber(member.phone_number)) {
      memberErrors.phone_number = "Phone number must be at least 10 digits and contain valid characters.";
      isValid = false;
    }
    if (!member.member_username.trim()) {
      memberErrors.member_username = "Username is required.";
      isValid = false;
    }
    if (isNew && !member.member_password) {
      memberErrors.member_password = "Password is required.";
      isValid = false;
    }

    return { isValid, memberErrors };
  };

  const validateStep1 = () => {
    const newErrors: any = { client: {}, members: [] };
    let isValid = true;

    if (!clientData.name.trim()) { newErrors.client.name = "Client name is required."; isValid = false; }
    if (!clientData.client_username.trim()) { newErrors.client.client_username = "Client username is required."; isValid = false; }
    if (activeTab === 'creation' && !clientData.client_password) { newErrors.client.client_password = "Password is required."; isValid = false; }
    if (!clientData.start_date) { newErrors.client.start_date = "Start date is required."; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors: any = { contract: {} };
    let isValid = true;

    if (contractData.allowed_tickets < 0) { newErrors.contract.allowed_tickets = "Cannot be negative."; isValid = false; }
    if (contractData.total_tickets_used < 0) { newErrors.contract.total_tickets_used = "Cannot be negative."; isValid = false; }
    if (contractData.ticket_typeRS1 < 0) { newErrors.contract.ticket_typeRS1 = "Cannot be negative."; isValid = false; }
    if (contractData.ticket_typeRS1_used < 0) { newErrors.contract.ticket_typeRS1_used = "Cannot be negative."; isValid = false; }
    if (contractData.ticket_typeRS2 < 0) { newErrors.contract.ticket_typeRS2 = "Cannot be negative."; isValid = false; }
    if (contractData.ticket_typeRS2_used < 0) { newErrors.contract.ticket_typeRS2_used = "Cannot be negative."; isValid = false; }
    if (contractData.ticket_typeRS3_1 < 0) { newErrors.contract.ticket_typeRS3_1 = "Cannot be negative."; isValid = false; }
    if (contractData.ticket_typeRS3_1_used < 0) { newErrors.contract.ticket_typeRS3_1_used = "Cannot be negative."; isValid = false; }
    if (contractData.ticket_typeRS3_2 < 0) { newErrors.contract.ticket_typeRS3_2 = "Cannot be negative."; isValid = false; }
    if (contractData.ticket_typeRS3_2_used < 0) { newErrors.contract.ticket_typeRS3_2_used = "Cannot be negative."; isValid = false; }
    if (contractData.site_visit_frequency < 0) { newErrors.contract.site_visit_frequency = "Cannot be negative."; isValid = false; }

    if (contractData.site_visit_frequency > 0) {
      if (!newErrors.contract.site_visit_dates) newErrors.contract.site_visit_dates = [];
      siteVisitDates.forEach((date, index) => {
        if (!date) {
          newErrors.contract.site_visit_dates[index] = "Date is required.";
          isValid = false;
        } else if (new Date(date) < new Date(new Date().setHours(0,0,0,0))) {
          newErrors.contract.site_visit_dates[index] = "Date cannot be in the past.";
          isValid = false;
        }
      });
    }

    // Sum validation: RS1+RS2+RS3-1+RS3-2 must equal Allowed Tickets
    const sumRS =
      Number(contractData.ticket_typeRS1 || 0) +
      Number(contractData.ticket_typeRS2 || 0) +
      Number(contractData.ticket_typeRS3_1 || 0) +
      Number(contractData.ticket_typeRS3_2 || 0);
    if (sumRS !== Number(contractData.allowed_tickets || 0)) {
      newErrors.contract.allowed_tickets = "Sum of RS tickets must equal Total Tickets";
      isValid = false;
    }

    setErrors((prev: any) => ({ ...prev, contract: newErrors.contract }));
    return isValid;
  };


  const validateForm = () => {
    const newErrors: any = { client: {}, members: [] };
    let isValid = true;

    // Client validation
    if (!clientData.name.trim()) {
      newErrors.client.name = "Client name is required.";
      isValid = false;
    }
    if (!clientData.client_username.trim()) {
      newErrors.client.client_username = "Client username is required.";
      isValid = false;
    }
    if ((activeTab === 'creation' || (isEditing && clientData.client_password)) && !clientData.client_password) {
        newErrors.client.client_password = "Password is required.";
        isValid = false;
    }
    if (!clientData.start_date) {
        newErrors.client.start_date = "Start date is required.";
        isValid = false;
    }

    // Existing members validation
    members.forEach((member, index) => {
        const { isValid: memberValid, memberErrors } = validateMember(member);
        if (!memberValid) {
            newErrors.members[index] = memberErrors;
            isValid = false;
        }
    });

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    console.log("useEffect: Fetching initial data")

    if (user?.role !== "admin") {
      toast({ title: "Access Denied", description: "Only admins can access this page", variant: "destructive" })
      router.push("/unauthorized")
      return
    }

    getClients()
      .then((clients) => {
        console.log("getClients Success:", clients)
        setClients(clients)
      })
      .catch((error) => {
        console.error("getClients Error:", error)
        toast({ title: "Error", description: "Failed to fetch clients", variant: "destructive" })
      })

    suggestClientId()
      .then((id) => {
        console.log("suggestClientId Success:", id)
        setSuggestedClientId(id)
        setClientData((prev) => ({ ...prev, client_id: id }))
      })
      .catch((error) => {
        console.error("suggestClientId Error:", error)
        toast({ title: "Error", description: "Failed to suggest client ID", variant: "destructive" })
      })

    getAdmins()
      .then((admins) => {
        console.log("getAdmins Success:", admins)
        setAdmins(admins)
      })
      .catch((error) => {
        console.error("getAdmins Error:", error)
        toast({ title: "Error", description: "Failed to fetch admins", variant: "destructive" })
      })

    if (activeTab === "admin" && !isSuperAdmin) {
      setActiveTab("update")
    }
  }, [user])
 


  const fetchClientDetails = async (id: string) => {
    setLoading(true)
    try {
      const data = await getClientDetails(id)
      setClientData({
        client_id: data.client_id,
        client_username: data.client_username,
        name: data.name,
        start_date: data.start_date,
        payment_cycle: data.payment_cycle,
      })
      setMembers(data.members || [])
      setContractData(
        data.contract || {
          client_id: id,
          allowed_tickets: 0,
          total_tickets_used: 0,
          ticket_typeRS1: 0,
          ticket_typeRS1_used: 0,
          ticket_typeRS2: 0,
          ticket_typeRS2_used: 0,
          ticket_typeRS3_1: 0,
          ticket_typeRS3_1_used: 0,
          ticket_typeRS3_2: 0,
          ticket_typeRS3_2_used: 0,
          site_visit_frequency: 0,
          site_visit_date: "",
          hil_admin_id: null,
          hil_admin_team: [],
        },
      )
    } catch (error) {
      console.error("fetchClientDetails Error:", error)
      toast({ title: "Error", description: "Failed to fetch client details", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async () => {
    if (!isSuperAdmin) {
      toast({
        title: "Error",
        description: "Access denied. Only super admin can create admins.",
        variant: "destructive",
      })
      return
    }

    const validationErrors = validateAdminForm(newAdmin)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await createAdmin(newAdmin)
      toast({ title: "Success", description: "Admin created successfully." })
      setNewAdmin({
        name: "",
        designation: "",
        username: "",
        password: "",
        email: "",
        mobile_number: ""
      })
      setFormErrors({})
      const admins = await getAdmins()
      setAdmins(admins)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create admin."
      console.error("Create Admin Error:", err)
      toast({ title: "Error", description: message, variant: "destructive" })
    }
  }


  const validateAdminForm = (data: AdminFormData) => {
    const errors: AdminFormErrors = {}
    
    if (!data.name.trim()) errors.name = 'Name is required'
    if (!data.designation.trim()) errors.designation = 'Designation is required'
    if (!data.username.trim()) errors.username = 'Username is required'
    if (!data.password) errors.password = 'Password is required'
    
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (data.mobile_number && !/^\d{10}$/.test(data.mobile_number)) {
      errors.mobile_number = 'Please enter a valid 10-digit mobile number'
    }
    
    return errors
  }

  const handleNewAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAdmin((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof AdminFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleHilAdminChange = (value: string) => {
    setContractData((prev) => ({ ...prev, hil_admin_id: value === "none" ? null : Number.parseInt(value) }))
  }

  const handleHilAdminTeamChange = (selected: { value: number; label: string }[]) => {
    setContractData((prev) => ({ ...prev, hil_admin_team: selected.map((opt) => opt.value) }))
  }

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setClientData((prev) => ({
      ...prev,
      // [name]: name === "client_id" ? Number.parseInt(value) || 0 : value,
      [name]: value,
    }))
  }

  const handleContractChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseInt(value);
    setContractData((prev) => ({
      ...prev,
      [name]:
        name.includes("ticket_type") || name.includes("frequency") || name.includes("allowed") || name.includes("used")
          ? isNaN(numValue) ? 0 : Math.max(0, numValue)
          : value,
    }))
  }

  const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewMember((prev) => ({
      ...prev,
      [name]: name === "escalation_level" ? Number.parseInt(value) || 1 : value,
    }))
  }

  const handleEditMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditingMember((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "escalation_level" ? Number.parseInt(value) || 1 : value,
          }
        : null,
    )
  }

 const addMember = () => {
  const { isValid, memberErrors } = validateMember(newMember, true);

  setErrors({ ...errors, newMember: memberErrors });

  if (isValid) {
    if (members.some((m) => m.escalation_level === newMember.escalation_level)) {
      toast({
        title: "Error",
        description: `Escalation level ${newMember.escalation_level} already exists.`,
        variant: "destructive",
      })
      return
    }
    // ❌ Remove the UUID generation for member_id
    // Since member_id should be a number (auto-generated by DB), don't set it here
    setMembers([...members, { ...newMember }]); // Remove member_id assignment
    toast({ title: "Success", description: "Member added successfully." });
    setNewMember({
      member_name: "",
      designation: "",
      email: "",
      phone_number: "",
      escalation_level: members.length + 2,
      member_username: "",
      member_password: "",
    })
  } else {
    toast({ title: "Error", description: "Please correct the member fields", variant: "destructive" })
  }
}

  const startEditingMember = (index: number) => {
    setEditingMemberIndex(index)
    setEditingMember({ ...members[index] })
  }

  const saveEditedMember = () => {
    if (editingMemberIndex === null || !editingMember) return

    const { isValid, memberErrors } = validateMember(editingMember);
    if (!isValid) {
      setErrors((prev: any) => {
        const newMembersErrors = [...(prev.members || [])];
        newMembersErrors[editingMemberIndex] = memberErrors;
        return { ...prev, members: newMembersErrors };
      });
      toast({ title: "Error", description: "Please correct the member details.", variant: "destructive" });
      return;
    }

    if (members.some((m, i) => i !== editingMemberIndex && m.escalation_level === editingMember.escalation_level)) {
      toast({
        title: "Error",
        description: `Escalation level ${editingMember.escalation_level} already exists.`,
        variant: "destructive",
      })
      return
    }
    setMembers((prev) => prev.map((m, i) => (i === editingMemberIndex ? editingMember : m)))
    setEditingMemberIndex(null)
    setEditingMember(null)
    setErrors((prev: any) => {
      const newMembersErrors = [...(prev.members || [])];
      newMembersErrors[editingMemberIndex] = {};
      return { ...prev, members: newMembersErrors };
    });
  }

  const cancelEditingMember = () => {
    setEditingMemberIndex(null)
    setEditingMember(null)
  }

  const removeMember = async (memberId: number | undefined, index: number) => {
    try {
      if (memberId) {
        await deleteMember(memberId)
      }
      setMembers((prev) => prev.filter((_, i) => i !== index))
    } catch (error) {
      console.error("removeMember Error:", error)
      toast({ title: "Error", description: "Failed to delete member", variant: "destructive" })
    }
  }

const handleCreateStep1 = async () => {
  if (!validateStep1()) {
    toast({ title: "Validation Error", description: "Please correct the errors in the client form.", variant: "destructive" });
    return;
  }
  try {
    setCreatingClient(true)
    if (!clientData.client_id) {
      toast({ title: "Error", description: "Client ID is required.", variant: "destructive" })
      return
    }
    
    console.log('Creating client with ID:', clientData.client_id); // Debug log
    
    // Create the client first and wait for it to complete
    const newClientId = await createClient(clientData, members)
    
    console.log('Client created successfully with ID:', newClientId); // Debug log
    
    // Update both clientData and contractData with the returned client_id
    setClientData((prev) => ({ ...prev, client_id: newClientId }))
    setContractData((prev) => ({ ...prev, client_id: newClientId }))
    
    setStep(2)
    toast({ title: "Success", description: "Client and members created." })
    
    // Get new suggested ID for next client
    suggestClientId().then((id) => {
      setSuggestedClientId(id)
      // Don't update clientData here since we're in step 2 now
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create client."
    console.error("handleCreateStep1 Error:", err)
    toast({ title: "Error", description: message, variant: "destructive" })
  }
  finally {
    setCreatingClient(false)
  }
}

// Fix your handleCreateStep2 function
const handleCreateStep2 = async () => {
  if (!validateStep2()) {
    toast({ title: "Validation Error", description: "Please correct the errors in the contract form.", variant: "destructive" });
    return;
  }
  try {
    setCreatingClient(true)
    // Make sure we're using the correct client_id
    console.log('Creating contract for client_id:', contractData.client_id); // Debug log
    console.log('Contract data:', contractData); // Debug log
    
    // Ensure all the data is properly structured before sending
    const contractPayload = {
      ...contractData,
      // Use contractData.client_id which should be set from step 1
      client_id: contractData.client_id,
      site_visit_date: siteVisitDates[0] || new Date().toISOString().split('T')[0],
      escalation_matrix: contractData.escalation_matrix,
    };

    console.log('Contract payload:', contractPayload); // Debug log

    await createOrUpdateContract(contractPayload);
    toast({ title: "Success", description: "Contract created." })
    setClientCreatedOpen(true)
    setStep(1)
    
    // Reset form with new suggested ID
    const newSuggestedId = await suggestClientId();
    setClientData({
      client_id: newSuggestedId,
      client_username: "",
      client_password: "",
      name: "",
      start_date: "",
      payment_cycle: null,
    })
    setMembers([])
    setContractData({
      client_id: newSuggestedId, // Set the new suggested ID here too
      allowed_tickets: 0,
      total_tickets_used: 0,
      ticket_typeRS1: 0,
      ticket_typeRS1_used: 0,
      ticket_typeRS2: 0,
      ticket_typeRS2_used: 0,
      ticket_typeRS3_1: 0,
      ticket_typeRS3_1_used: 0,
      ticket_typeRS3_2: 0,
      ticket_typeRS3_2_used: 0,
      site_visit_frequency: 0,
      site_visit_date: "",
      hil_admin_id: null,
      hil_admin_team: [],
    })
    setSiteVisitDates([""]);
    setSuggestedClientId(newSuggestedId);
    
    // Refresh clients list
    const updatedClients = await getClients();
    setClients(updatedClients);
  } catch (err) {
    console.error("handleCreateStep2 Error:", err)
    toast({ title: "Error", description: `Failed to create contract: ${err instanceof Error ? err.message : 'Unknown error'}`, variant: "destructive" })
  } finally {
    setCreatingClient(false)
  }
}

const handleUpdate = async () => {
  if (!validateForm() || !validateStep2()) {
    toast({ title: "Validation Error", description: "Please correct all errors before saving.", variant: "destructive" });
    return;
  }
  try {
    const escalationLevels = new Set(members.map((m) => m.escalation_level))
    if (escalationLevels.size !== members.length) {
      toast({ title: "Error", description: "Duplicate escalation levels detected.", variant: "destructive" })
      return
    }

    await updateClient(clientData)
    await Promise.all(
      members.map((m) => {
        const memberWithClientId = { ...m, client_id: clientData.client_id }
        if (typeof m.member_id === 'number') {
          return updateMember(memberWithClientId);
        } else {
          const { member_id, ...newMemberWithoutId } = memberWithClientId;
          return createMembers(clientData.client_id, [newMemberWithoutId]);
        }
      }),
    )
    const contractPayload = {
      ...contractData,
      site_visit_date: siteVisitDates.join(','),
    };
    await updateContract({ ...contractPayload, client_id: selectedClientId! });
    toast({ title: "Success", description: "Client updated." })
    setIsEditing(false)
    fetchClientDetails(selectedClientId!)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update client."
    console.error("handleUpdate Error:", err)
    toast({ title: "Error", description: message, variant: "destructive" })
  }
}

const handleSelectClient = (value: string) => {
  setSelectedClientId(value) // Keep as string
  fetchClientDetails(value) // Pass string directly
}

  useEffect(() => {
    if (activeTab === "admin" && !isSuperAdmin) {
      setActiveTab("update")
      toast({
        title: "Access Denied",
        description: "You don't have permission to access admin creation.",
        variant: "destructive",
      })
    }
  }, [activeTab, isSuperAdmin])

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user])

  useEffect(() => {
    if (contractData.site_visit_date && typeof contractData.site_visit_date === 'string') {
      const dates = contractData.site_visit_date.split(',').map(date => date.trim()).filter(Boolean);
      setSiteVisitDates(dates.length > 0 ? dates : Array(contractData.site_visit_frequency).fill(''));
    } else if (contractData.site_visit_frequency > 0) {
      setSiteVisitDates(Array(contractData.site_visit_frequency).fill(''));
    } else {
      setSiteVisitDates([]);
    }
  }, [contractData.site_visit_date, contractData.site_visit_frequency]);

  if (!user || user.role !== "admin") {
    return <div>Loading...</div>
  }

  const startEditingAdmin = (admin: any) => {
    setEditingAdminId(admin.admin_id)
    setEditingAdmin({ ...admin })
  }

  const saveEditedAdmin = async () => {
    if (!editingAdminId) return;
  
    try {
      await updateAdmin(editingAdminId, editingAdmin); // call your server function
  
      // Optionally, refresh admins list after update
      const updatedAdmins = await getAdmins();
      setAdmins(updatedAdmins);
  
      // Reset editing state
      setEditingAdminId(null);
      setEditingAdmin({ name: '', designation: '', username: '', email: '', mobile_number: '', password: '' });
    } catch (error: any) {
      console.error('Update admin failed:', error.message);
      toast({
        title: 'Error updating admin',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
 
  const handleDeleteAdmin = (adminId: number) => {
    setAdminToDelete(adminId);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      await deleteAdmin(adminToDelete); // backend call
      const updatedAdmins = await getAdmins(); // refresh list
      setAdmins(updatedAdmins);
      toast({
        title: "Deleted",
        description: "Admin deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete admin",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setAdminToDelete(null);
  };
  
   async function deleteAdmin(adminId: number) {
    const res = await fetch(`/api/admins/${adminId}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete admin');
    }
    return await res.json();
  }
  

  const handleSiteVisitFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frequency = Math.max(0, Number.parseInt(e.target.value) || 0);
    setContractData((prev) => ({ ...prev, site_visit_frequency: frequency }));

    const newDates = Array.from({ length: frequency }, (_, index) => siteVisitDates[index] || '');
    setSiteVisitDates(newDates);
  };

  const handleSiteVisitDateChange = (index: number, value: string) => {
    const newDates = [...siteVisitDates]
    newDates[index] = value
    setSiteVisitDates(newDates)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary rounded-lg">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Client Management</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Manage clients, members, contracts, and administrative access
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <Dialog open={clientCreatedOpen} onOpenChange={setClientCreatedOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Client Created</DialogTitle>
                  <DialogDescription>
                    The client and members were created successfully.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => setClientCreatedOpen(false)}>OK</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <TabsList className="grid w-full grid-cols-3 bg-card border border-border rounded-xl p-1 shadow-sm overflow-hidden">
              <TabsTrigger
                value="creation"
                className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-muted/50 relative z-10"
              >
                <Plus className="h-4 w-4" />
                Create Client
              </TabsTrigger>
              <TabsTrigger
                value="update"
                className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-muted/50 relative z-10"
              >
                <Edit className="h-4 w-4" />
                Update & View
              </TabsTrigger>
              {isSuperAdmin && (
                <TabsTrigger
                  value="admin"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all hover:bg-muted/50 relative z-10"
                >
                  <Shield className="h-4 w-4" />
                  Admin Creation
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="creation" className="space-y-8">
              {step === 1 ? (
                <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-lg">
                          <Users className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-foreground">Step 1: Client & Members</CardTitle>
                          <p className="text-muted-foreground mt-1">Create client profile and add team members</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="px-3 py-1">
                        1 of 2
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Building2 className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Client Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="client_id"
                            className="text-sm font-medium text-foreground flex items-center gap-2"
                          >
                            <Target className="h-4 w-4" />
                            Client ID
                          </Label>
                          <Input
                            id="client_id"
                            name="client_id"
                            
                            value={clientData.client_id || ""}
                            onChange={handleClientChange}
                            placeholder={suggestedClientId ? `Suggested: ${suggestedClientId}` : ""}
                            className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.client_id ? 'border-destructive' : ''}`}
                          />
                          {errors.client?.client_id && <p className="text-sm text-destructive mt-1">{errors.client.client_id}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="client_username"
                            className="text-sm font-medium text-foreground flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            Username
                          </Label>
                          <Input
                            id="client_username"
                            name="client_username"
                            value={clientData.client_username}
                            onChange={handleClientChange}
                            className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.client_username ? 'border-destructive' : ''}`}
                          />
                          {errors.client?.client_username && <p className="text-sm text-destructive mt-1">{errors.client.client_username}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="client_password"
                            className="text-sm font-medium text-foreground flex items-center gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            Password
                          </Label>
                          <Input
                            id="client_password"
                            name="client_password"
                            type="password"
                            value={clientData.client_password || ""}
                            onChange={handleClientChange}
                            className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.client_password ? 'border-destructive' : ''}`}
                          />
                          {errors.client?.client_password && <p className="text-sm text-destructive mt-1">{errors.client.client_password}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Company Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={clientData.name}
                            onChange={handleClientChange}
                            className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.name ? 'border-destructive' : ''}`}
                          />
                          {errors.client?.name && <p className="text-sm text-destructive mt-1">{errors.client.name}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="start_date"
                            className="text-sm font-medium text-foreground flex items-center gap-2"
                          >
                            <Calendar className="h-4 w-4" />
                            Start Date
                          </Label>
                          <Input
                            id="start_date"
                            name="start_date"
                            type="date"
                            value={clientData.start_date}
                            onChange={handleClientChange}
                            className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.start_date ? 'border-destructive' : ''}`}
                          />
                          {errors.client?.start_date && <p className="text-sm text-destructive mt-1">{errors.client.start_date}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="payment_cycle"
                            className="text-sm font-medium text-foreground flex items-center gap-2"
                          >
                            <Clock className="h-4 w-4" />
                            Payment Cycle
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              setClientData((prev) => ({ ...prev, payment_cycle: value === "none" ? null : value }))
                            }
                            value={clientData.payment_cycle || "none"}
                          >
                            <SelectTrigger className="bg-background border-border focus:border-accent focus:ring-accent/20">
                              <SelectValue placeholder="Select cycle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Quarterly">Quarterly</SelectItem>
                              <SelectItem value="Yearly">Yearly</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 border-t border-border pt-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Team Members</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="member_name" className="text-sm font-medium text-foreground">
                            Name
                          </Label>
                          <Input
                            id="member_name"
                            name="member_name"
                            value={newMember.member_name}
                            onChange={handleNewMemberChange}
                            className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.member_name ? 'border-destructive' : ''}`}
                          />
                          {errors.newMember?.member_name && <p className="text-sm text-destructive mt-1">{errors.newMember.member_name}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="designation" className="text-sm font-medium text-foreground">
                            Designation
                          </Label>
                          <Input
                            id="designation"
                            name="designation"
                            value={newMember.designation}
                            onChange={handleNewMemberChange}
                            className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.designation ? 'border-destructive' : ''}`}
                          />
                          {errors.newMember?.designation && <p className="text-sm text-destructive mt-1">{errors.newMember.designation}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={newMember.email}
                            onChange={handleNewMemberChange}
                            className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.email ? 'border-destructive' : ''}`}
                          />
                          {errors.newMember?.email && <p className="text-sm text-destructive mt-1">{errors.newMember.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone_number" className="text-sm font-medium text-foreground">
                            Phone
                          </Label>
                          <Input
                            id="phone_number"
                            name="phone_number"
                            type="tel"
                            value={newMember.phone_number || ""}
                            onChange={handleNewMemberChange}
                            className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.phone_number ? 'border-destructive' : ''}`}
                          />
                          {errors.newMember?.phone_number && <p className="text-sm text-destructive mt-1">{errors.newMember.phone_number}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="escalation_level" className="text-sm font-medium text-foreground">
                            Escalation Level
                          </Label>
                          <Input
                            id="escalation_level"
                            name="escalation_level"
                            type="number"
                            value={newMember.escalation_level}
                            onChange={handleNewMemberChange}
                            className="bg-background border-border focus:border-accent focus:ring-accent/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member_username" className="text-sm font-medium text-foreground">
                            Username
                          </Label>
                          <Input
                            id="member_username"
                            name="member_username"
                            value={newMember.member_username}
                            onChange={handleNewMemberChange}
                            className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.member_username ? 'border-destructive' : ''}`}
                          />
                          {errors.newMember?.member_username && <p className="text-sm text-destructive mt-1">{errors.newMember.member_username}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member_password" className="text-sm font-medium text-foreground">
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="member_password"
                              name="member_password"
                              type={showPassword ? "text" : "password"}
                              value={newMember.member_password || ""}
                              onChange={handleNewMemberChange}
                              className={`bg-background border-border focus:border-accent focus:ring-accent/20 pr-10 ${errors.newMember?.member_password ? 'border-destructive' : ''}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <Eye className="h-4 w-4" aria-hidden="true" />
                              )}
                            </Button>
                          </div>
                          {errors.newMember?.member_password && <p className="text-sm text-destructive mt-1">{errors.newMember.member_password}</p>}
                        </div>
                      </div>
                      <Button
                        onClick={addMember}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Member
                      </Button>
                    </div>

                    {members.length > 0 && (
                      <div className="space-y-4 border-t border-border pt-8">
                        <h4 className="text-lg font-semibold text-foreground">Added Members</h4>
                        <div className="rounded-lg border border-border overflow-hidden bg-background">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold">Name</TableHead>
                                <TableHead className="font-semibold">Designation</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Phone</TableHead>
                                <TableHead className="font-semibold">Level</TableHead>
                                <TableHead className="font-semibold">Username</TableHead>
                                <TableHead className="font-semibold">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {members.map((member, index) => (
                                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                                  <TableCell className="font-medium">{member.member_name}</TableCell>
                                  <TableCell>{member.designation}</TableCell>
                                  <TableCell className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {member.email}
                                  </TableCell>
                                  <TableCell className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {member.phone_number}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{member.escalation_level}</Badge>
                                  </TableCell>
                                  <TableCell>{member.member_username}</TableCell>
                                  <TableCell>
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteAdmin(member.member_id)}
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>

                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-6 border-t border-border">
                      <Button
                        onClick={handleCreateStep1}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 py-3"
                      >
                        <ChevronRight className="mr-2 h-4 w-4" />
                        Next: Contract Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-lg">
                          <FileText className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-foreground">Step 2: Contract Details</CardTitle>
                          <p className="text-muted-foreground mt-1">
                            Configure service agreements and ticket allocations
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="px-3 py-1">
                        2 of 2
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="allowed_tickets" className="text-sm font-medium text-foreground">
                          Total Tickets
                        </Label>
                        <Input
                          id="allowed_tickets"
                          name="allowed_tickets"
                          type="number"
                          value={contractData.allowed_tickets}
                          onChange={handleContractChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.allowed_tickets ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.allowed_tickets && <p className="text-sm text-destructive mt-1">{errors.contract.allowed_tickets}</p>}
                        <Label htmlFor="total_tickets_used" className="text-sm font-medium text-foreground">
                          Total Tickets Used
                        </Label>
                        <Input
                          id="total_tickets_used"
                          name="total_tickets_used"
                          type="number"
                          value={contractData.total_tickets_used}
                          onChange={handleContractChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.total_tickets_used ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.total_tickets_used && <p className="text-sm text-destructive mt-1">{errors.contract.total_tickets_used}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticket_typeRS1" className="text-sm font-medium text-foreground flex items-center gap-2">
                          RS1 Tickets
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-foreground cursor-default"><Info className="w-3 h-3" /></span>
                              </TooltipTrigger>
                              <TooltipContent>RS1 - Email assistance</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="ticket_typeRS1"
                          name="ticket_typeRS1"
                          type="number"
                          value={contractData.ticket_typeRS1}
                          onChange={handleContractChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS1 ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.ticket_typeRS1 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS1}</p>}
                        <Label htmlFor="ticket_typeRS1_used" className="text-sm font-medium text-foreground">
                          RS1 Tickets Used
                        </Label>
                        <Input
                          id="ticket_typeRS1_used"
                          name="ticket_typeRS1_used"
                          type="number"
                          value={contractData.ticket_typeRS1_used}
                          onChange={handleContractChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS1_used ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.ticket_typeRS1_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS1_used}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticket_typeRS2" className="text-sm font-medium text-foreground flex items-center gap-2">
                          RS2 Tickets
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-foreground cursor-default"><Info className="w-3 h-3" /></span>
                              </TooltipTrigger>
                              <TooltipContent>RS2 - Equipment monitoring & System Maintenance</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="ticket_typeRS2"
                          name="ticket_typeRS2"
                          type="number"
                          value={contractData.ticket_typeRS2}
                          onChange={handleContractChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS2 ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.ticket_typeRS2 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS2}</p>}
                        <Label htmlFor="ticket_typeRS2_used" className="text-sm font-medium text-foreground">
                          RS2 Tickets Used
                        </Label>
                        <Input
                          id="ticket_typeRS2_used"
                          name="ticket_typeRS2_used"
                          type="number"
                          value={contractData.ticket_typeRS2_used}
                          onChange={handleContractChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS2_used ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.ticket_typeRS2_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS2_used}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticket_typeRS3_1" className="text-sm font-medium text-foreground flex items-center gap-2">
                          RS3-1 Tickets
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-foreground cursor-default"><Info className="w-3 h-3" /></span>
                              </TooltipTrigger>
                              <TooltipContent>RS3-1 - Troubleshooting support & support</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="ticket_typeRS3_1"
                          name="ticket_typeRS3_1"
                          type="number"
                          value={contractData.ticket_typeRS3_1}
                          onChange={handleContractChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_1 ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.ticket_typeRS3_1 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_1}</p>}
                        <Label htmlFor="ticket_typeRS3_1_used" className="text-sm font-medium text-foreground">
                          RS3-1 Tickets Used
                        </Label>
                        <Input
                          id="ticket_typeRS3_1_used"
                          name="ticket_typeRS3_1_used"
                          type="number"
                          value={contractData.ticket_typeRS3_1_used}
                          onChange={handleContractChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_1_used ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.ticket_typeRS3_1_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_1_used}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticket_typeRS3_2" className="text-sm font-medium text-foreground flex items-center gap-2">
                          RS3-2 Tickets
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-foreground cursor-default"><Info className="w-3 h-3" /></span>
                              </TooltipTrigger>
                              <TooltipContent>RS3-2 - Support service</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="ticket_typeRS3_2"
                          name="ticket_typeRS3_2"
                          type="number"
                          value={contractData.ticket_typeRS3_2}
                          onChange={handleContractChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_2 ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.ticket_typeRS3_2 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_2}</p>}
                        <Label htmlFor="ticket_typeRS3_2_used" className="text-sm font-medium text-foreground">
                          RS3-2 Tickets Used
                        </Label>
                        <Input
                          id="ticket_typeRS3_2_used"
                          name="ticket_typeRS3_2_used"
                          type="number"
                          value={contractData.ticket_typeRS3_2_used}
                          onChange={handleContractChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_2_used ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.ticket_typeRS3_2_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_2_used}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site_visit_frequency" className="text-sm font-medium text-foreground">
                          Site Visit Frequency
                        </Label>
                        <Input
                          id="site_visit_frequency"
                          name="site_visit_frequency"
                          type="number"
                          min="0"
                          value={contractData.site_visit_frequency}
                          onChange={handleSiteVisitFrequencyChange}
                          className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.site_visit_frequency ? 'border-destructive' : ''}`}
                        />
                        {errors.contract?.site_visit_frequency && <p className="text-sm text-destructive mt-1">{errors.contract.site_visit_frequency}</p>}
                      </div>

                      {contractData.site_visit_frequency > 0 && (
                        <div className="space-y-4 col-span-3">
                          <Label className="text-sm font-medium text-foreground">
                            Site Visit Dates ({contractData.site_visit_frequency} visits)
                          </Label>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {siteVisitDates.map((date, index) => (
                              <div key={index} className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Visit {index + 1} Date</Label>
                                <Input
                                  type="date"
                                  value={date}
                                  onChange={(e) => handleSiteVisitDateChange(index, e.target.value)}
                                  className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.site_visit_dates?.[index] ? 'border-destructive' : ''}`}
                                />
                                {errors.contract?.site_visit_dates?.[index] && <p className="text-sm text-destructive mt-1">{errors.contract.site_visit_dates[index]}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="space-y-2 col-span-3">
                        <Label className="text-sm font-medium text-foreground">Escalation Matrix</Label>
                        <p className="text-xs text-muted-foreground">Assign admins for each level: 0 (Base), 1 (Mid), 2 (Highest)</p>
                        <div className="grid md:grid-cols-3 gap-4">
                          {[0,1,2].map((level) => (
                            <div key={level} className="space-y-2">
                              <Label className="text-xs">Level {level}</Label>
                              <Select
                                onValueChange={(value) => {
                                  const adminId = value === 'none' ? undefined : Number(value)
                                  setContractData((prev) => {
                                    const next = [...(prev.escalation_matrix || [0,0,0])]
                                    next[level] = adminId || 0
                                    return { ...prev, escalation_matrix: next }
                                  })
                                }}
                                value={String((contractData.escalation_matrix || [0,0,0])[level] || 'none')}
                              >
                                <SelectTrigger className="bg-background border-border focus:border-accent focus:ring-accent/20">
                                  <SelectValue placeholder="Select Admin" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  {admins.map((admin) => (
                                    <SelectItem key={admin.admin_id} value={admin.admin_id.toString()}>
                                      {admin.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hil_admin_id" className="text-sm font-medium text-foreground">
                          Allocate HIL Admin
                        </Label>
                        <Select
                          onValueChange={handleHilAdminChange}
                          value={contractData.hil_admin_id?.toString() || "none"}
                        >
                          <SelectTrigger className="bg-background border-border focus:border-accent focus:ring-accent/20">
                            <SelectValue placeholder="Select Admin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {admins.map((admin) => (
                              <SelectItem key={admin.admin_id} value={admin.admin_id.toString()}>
                                {admin.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-border">
                      <Button variant="outline" onClick={() => setStep(1)} className="px-6" disabled={creatingClient}>
                        Back
                      </Button>
                      <Button
                        onClick={handleCreateStep2}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
                        disabled={creatingClient}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {creatingClient ? 'Saving…' : 'Complete Setup'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="update" className="space-y-8">
              <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <Building2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-foreground">Select Client</CardTitle>
                      <p className="text-muted-foreground mt-1">Choose a client to view or update their information</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <Select onValueChange={handleSelectClient}>
                    <SelectTrigger className="bg-background border-border focus:border-accent focus:ring-accent/20 h-12">
                      <SelectValue placeholder="Select a client to manage" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.client_id} value={client.client_id.toString()}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {client.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Rest of the update/view content remains the same but with enhanced styling */}
              {selectedClientId && (
                <>
                  {/* Client Details Card */}
                  <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary rounded-lg">
                            <Building2 className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-foreground">Client Details</CardTitle>
                            <p className="text-muted-foreground mt-1">View and manage client information</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => setIsEditing(!isEditing)}
                          variant="outline"
                          className="bg-background hover:bg-muted border-border"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {isEditing ? "Cancel Edit" : "Edit Client"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      {loading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="client_id" className="text-sm font-medium text-foreground">
                              Client ID
                            </Label>
                            <Input
                              id="client_id"
                              name="client_id"
                              
                              value={clientData.client_id}
                              disabled
                              className="bg-muted border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="client_username" className="text-sm font-medium text-foreground">
                              Username
                            </Label>
                            <Input
                              id="client_username"
                              name="client_username"
                              value={clientData.client_username}
                              onChange={handleClientChange}
                              disabled={!isEditing}
                              className={
                                isEditing
                                  ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.client_username ? 'border-destructive' : ''}`
                                  : "bg-muted border-border"
                              }
                            />
                            {isEditing && errors.client?.client_username && <p className="text-sm text-destructive mt-1">{errors.client.client_username}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-foreground">
                              Company Name
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={clientData.name}
                              onChange={handleClientChange}
                              disabled={!isEditing}
                              className={
                                isEditing
                                  ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.name ? 'border-destructive' : ''}`
                                  : "bg-muted border-border"
                              }
                            />
                            {isEditing && errors.client?.name && <p className="text-sm text-destructive mt-1">{errors.client.name}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="start_date" className="text-sm font-medium text-foreground">
                              Start Date
                            </Label>
                            <Input
                              id="start_date"
                              name="start_date"
                              type="date"
                              value={clientData.start_date}
                              onChange={handleClientChange}
                              disabled={!isEditing}
                              className={
                                isEditing
                                  ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.client?.start_date ? 'border-destructive' : ''}`
                                  : "bg-muted border-border"
                              }
                            />
                            {isEditing && errors.client?.start_date && <p className="text-sm text-destructive mt-1">{errors.client.start_date}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="payment_cycle" className="text-sm font-medium text-foreground">
                              Payment Cycle
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setClientData((prev) => ({ ...prev, payment_cycle: value === "none" ? null : value }))
                              }
                              value={clientData.payment_cycle || "none"}
                              disabled={!isEditing}
                            >
                              <SelectTrigger
                                className={
                                  isEditing
                                    ? "bg-background border-border focus:border-accent focus:ring-accent/20"
                                    : "bg-muted border-border"
                                }
                              >
                                <SelectValue placeholder="Select cycle" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Quarterly">Quarterly</SelectItem>
                                <SelectItem value="Yearly">Yearly</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Members Card - keeping existing functionality with enhanced styling */}
                  <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-lg">
                          <Users className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-foreground">Team Members</CardTitle>
                          <p className="text-muted-foreground mt-1">Manage client team members and access levels</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="rounded-lg border border-border overflow-hidden bg-background">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">Name</TableHead>
                              <TableHead className="font-semibold">Designation</TableHead>
                              <TableHead className="font-semibold">Email</TableHead>
                              <TableHead className="font-semibold">Phone</TableHead>
                              <TableHead className="font-semibold">Level</TableHead>
                              <TableHead className="font-semibold">Username</TableHead>
                              <TableHead className="font-semibold">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {members.map((member, index) =>
                              editingMemberIndex === index ? (
                                <TableRow key={index} className="bg-accent/5">
                                  <TableCell>
                                    <Input
                                      name="member_name"
                                      value={editingMember?.member_name || ""}
                                      onChange={handleEditMemberChange}
                                      className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.members?.[index]?.member_name ? 'border-destructive' : ''}`}
                                    />
                                    {errors.members?.[index]?.member_name && <p className="text-sm text-destructive mt-1">{errors.members[index].member_name}</p>}
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      name="designation"
                                      value={editingMember?.designation || ""}
                                      onChange={handleEditMemberChange}
                                      className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.members?.[index]?.designation ? 'border-destructive' : ''}`}
                                    />
                                    {errors.members?.[index]?.designation && <p className="text-sm text-destructive mt-1">{errors.members[index].designation}</p>}
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      name="email"
                                      type="email"
                                      value={editingMember?.email || ""}
                                      onChange={handleEditMemberChange}
                                      className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.members?.[index]?.email ? 'border-destructive' : ''}`}
                                    />
                                    {errors.members?.[index]?.email && <p className="text-sm text-destructive mt-1">{errors.members[index].email}</p>}
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      name="phone_number"
                                      value={editingMember?.phone_number || ""}
                                      type="tel"
                                      onChange={handleEditMemberChange}
                                      className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.members?.[index]?.phone_number ? 'border-destructive' : ''}`}
                                    />
                                    {errors.members?.[index]?.phone_number && <p className="text-sm text-destructive mt-1">{errors.members[index].phone_number}</p>}
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      name="escalation_level"
                                      type="number"
                                      value={editingMember?.escalation_level || ""}
                                      onChange={handleEditMemberChange}
                                      className="bg-background border-border focus:border-accent focus:ring-accent/20"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      name="member_username"
                                      value={editingMember?.member_username || ""}
                                      onChange={handleEditMemberChange}
                                      className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.members?.[index]?.member_username ? 'border-destructive' : ''}`}
                                    />
                                    {errors.members?.[index]?.member_username && <p className="text-sm text-destructive mt-1">{errors.members[index].member_username}</p>}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={saveEditedMember}
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={cancelEditingMember}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <AlertCircle className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                                  <TableCell className="font-medium">
                                    {member.member_name}
                                    {errors.members?.[index]?.member_name && <p className="text-sm text-destructive mt-1">{errors.members[index].member_name}</p>}
                                  </TableCell>
                                  <TableCell>
                                    {member.designation}
                                    {errors.members?.[index]?.designation && <p className="text-sm text-destructive mt-1">{errors.members[index].designation}</p>}
                                  </TableCell>
                                  <TableCell className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {member.email}
                                    {errors.members?.[index]?.email && <p className="text-sm text-destructive mt-1">{errors.members[index].email}</p>}
                                  </TableCell>
                                  <TableCell className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {member.phone_number}
                                    {errors.members?.[index]?.phone_number && <p className="text-sm text-destructive mt-1">{errors.members[index].phone_number}</p>}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{member.escalation_level}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    {member.member_username}
                                    {errors.members?.[index]?.member_username && <p className="text-sm text-destructive mt-1">{errors.members[index].member_username}</p>}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      {isEditing && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => startEditingMember(index)}
                                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeMember(member.member_id, index)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Add new member section when editing */}
                      {isEditing && (
                        <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
                          <h4 className="text-lg font-semibold text-foreground mb-4">Add New Member</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                            <div className="space-y-2">
                              <Input
                                name="member_name"
                                placeholder="Name"
                                value={newMember.member_name}
                                onChange={handleNewMemberChange}
                                className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.member_name ? 'border-destructive' : ''}`}
                              />
                              {errors.newMember?.member_name && <p className="text-sm text-destructive mt-1">{errors.newMember.member_name}</p>}
                            </div>
                            <div className="space-y-2">
                              <Input
                                name="designation"
                                placeholder="Designation"
                                value={newMember.designation}
                                onChange={handleNewMemberChange}
                                className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.designation ? 'border-destructive' : ''}`}
                              />
                              {errors.newMember?.designation && <p className="text-sm text-destructive mt-1">{errors.newMember.designation}</p>}
                            </div>
                            <div className="space-y-2">
                              <Input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={newMember.email}
                                onChange={handleNewMemberChange}
                                className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.email ? 'border-destructive' : ''}`}
                              />
                              {errors.newMember?.email && <p className="text-sm text-destructive mt-1">{errors.newMember.email}</p>}
                            </div>
                            <div className="space-y-2">
                              <Input
                                name="phone_number"
                                placeholder="Phone"
                                value={newMember.phone_number || ""}
                                onChange={handleNewMemberChange}
                                className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.phone_number ? 'border-destructive' : ''}`}
                              />
                              {errors.newMember?.phone_number && <p className="text-sm text-destructive mt-1">{errors.newMember.phone_number}</p>}
                            </div>
                            <div className="space-y-2">
                              <Input
                                name="escalation_level"
                                type="number"
                                placeholder="Level"
                                value={newMember.escalation_level}
                                onChange={handleNewMemberChange}
                                className="bg-background border-border focus:border-accent focus:ring-accent/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Input
                                name="member_username"
                                placeholder="Username"
                                value={newMember.member_username}
                                onChange={handleNewMemberChange}
                                className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.newMember?.member_username ? 'border-destructive' : ''}`}
                              />
                              {errors.newMember?.member_username && <p className="text-sm text-destructive mt-1">{errors.newMember.member_username}</p>}
                            </div>
                            <div className="space-y-2 relative">
                              <Input
                                name="member_password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={newMember.member_password || ""}
                                onChange={handleNewMemberChange}
                                className={`bg-background border-border focus:border-accent focus:ring-accent/20 pr-10 ${errors.newMember?.member_password ? 'border-destructive' : ''}`}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                  <Eye className="h-4 w-4" aria-hidden="true" />
                                )}
                              </Button>
                              {errors.newMember?.member_password && <p className="text-sm text-destructive mt-1">{errors.newMember.member_password}</p>}
                            </div>
                          </div>
                          <Button onClick={addMember} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Plus className="mr-2 h-4 w-4" /> Add Member
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contract Details Card - keeping existing functionality with enhanced styling */}
                  <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-lg">
                          <FileText className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-foreground">Contract Details</CardTitle>
                          <p className="text-muted-foreground mt-1">Service agreements and ticket allocations</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Contract form fields with enhanced styling - keeping all existing functionality */}
                        <div className="space-y-2">
                          <Label htmlFor="allowed_tickets" className="text-sm font-medium text-foreground">
                            Allowed Tickets
                          </Label>
                          <Input
                            id="allowed_tickets"
                            name="allowed_tickets"
                            type="number"
                            value={contractData.allowed_tickets}
                            onChange={handleContractChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.allowed_tickets ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.allowed_tickets && <p className="text-sm text-destructive mt-1">{errors.contract.allowed_tickets}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="total_tickets_used" className="text-sm font-medium text-foreground">
                            Total Tickets Used
                          </Label>
                          <Input
                            id="total_tickets_used"
                            name="total_tickets_used"
                            type="number"
                            value={contractData.total_tickets_used}
                            onChange={handleContractChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.total_tickets_used ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.total_tickets_used && <p className="text-sm text-destructive mt-1">{errors.contract.total_tickets_used}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ticket_typeRS1" className="text-sm font-medium text-foreground">RS1</Label>
                          <Input
                            id="ticket_typeRS1"
                            name="ticket_typeRS1"
                            type="number"
                            value={contractData.ticket_typeRS1}
                            onChange={handleContractChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS1 ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.ticket_typeRS1 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS1}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ticket_typeRS1_used" className="text-sm font-medium text-foreground">RS1 Used</Label>
                          <Input
                            id="ticket_typeRS1_used"
                            name="ticket_typeRS1_used"
                            type="number"
                            value={contractData.ticket_typeRS1_used}
                            onChange={handleContractChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS1_used ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.ticket_typeRS1_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS1_used}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ticket_typeRS2" className="text-sm font-medium text-foreground">RS2</Label>
                          <Input
                            id="ticket_typeRS2"
                            name="ticket_typeRS2"
                            type="number"
                            value={contractData.ticket_typeRS2}
                            onChange={handleContractChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS2 ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.ticket_typeRS2 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS2}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ticket_typeRS2_used" className="text-sm font-medium text-foreground">RS2 Used</Label>
                          <Input
                            id="ticket_typeRS2_used"
                            name="ticket_typeRS2_used"
                            type="number"
                            value={contractData.ticket_typeRS2_used}
                            onChange={handleContractChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS2_used ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.ticket_typeRS2_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS2_used}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ticket_typeRS3_1" className="text-sm font-medium text-foreground">RS3-1</Label>
                          <Input
                            id="ticket_typeRS3_1"
                            name="ticket_typeRS3_1"
                            type="number"
                            value={contractData.ticket_typeRS3_1}
                            onChange={handleContractChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_1 ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.ticket_typeRS3_1 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_1}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ticket_typeRS3_1_used" className="text-sm font-medium text-foreground">RS3-1 Used</Label>
                          <Input
                            id="ticket_typeRS3_1_used"
                            name="ticket_typeRS3_1_used"
                            type="number"
                            value={contractData.ticket_typeRS3_1_used}
                            onChange={handleContractChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_1_used ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.ticket_typeRS3_1_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_1_used}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ticket_typeRS3_2" className="text-sm font-medium text-foreground">RS3-2</Label>
                          <Input
                            id="ticket_typeRS3_2"
                            name="ticket_typeRS3_2"
                            type="number"
                            value={contractData.ticket_typeRS3_2}
                            onChange={handleContractChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_2 ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.ticket_typeRS3_2 && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_2}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ticket_typeRS3_2_used" className="text-sm font-medium text-foreground">RS3-2 Used</Label>
                          <Input
                            id="ticket_typeRS3_2_used"
                            name="ticket_typeRS3_2_used"
                            type="number"
                            value={contractData.ticket_typeRS3_2_used}
                            onChange={handleContractChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.ticket_typeRS3_2_used ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.ticket_typeRS3_2_used && <p className="text-sm text-destructive mt-1">{errors.contract.ticket_typeRS3_2_used}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="site_visit_frequency" className="text-sm font-medium text-foreground">Site Visit Frequency</Label>
                          <Input
                            id="site_visit_frequency"
                            name="site_visit_frequency"
                            type="number"
                            value={contractData.site_visit_frequency}
                            onChange={handleSiteVisitFrequencyChange}
                            disabled={!isEditing}
                            className={
                              isEditing
                                ? `bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.site_visit_frequency ? 'border-destructive' : ''}`
                                : "bg-muted border-border"
                            }
                          />
                          {isEditing && errors.contract?.site_visit_frequency && <p className="text-sm text-destructive mt-1">{errors.contract.site_visit_frequency}</p>}
                        </div>

                        {contractData.site_visit_frequency > 0 && (
                          <div className="space-y-4 col-span-3">
                            <Label className="text-sm font-medium text-foreground">
                              Site Visit Dates ({contractData.site_visit_frequency} visits)
                            </Label>
                            {isEditing ? (
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {siteVisitDates.map((date, index) => (
                                  <div key={index} className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Visit {index + 1} Date</Label>
                                    <Input
                                      type="date"
                                      value={date}
                                      onChange={(e) => handleSiteVisitDateChange(index, e.target.value)}
                                      className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${errors.contract?.site_visit_dates?.[index] ? 'border-destructive' : ''}`}
                                    />
                                    {errors.contract?.site_visit_dates?.[index] && <p className="text-sm text-destructive mt-1">{errors.contract.site_visit_dates[index]}</p>}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-muted-foreground">
                                {siteVisitDates.join(', ') || 'No dates set'}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="hil_admin_id" className="text-sm font-medium text-foreground">Allocate HIL Admin</Label>
                          <Select onValueChange={handleHilAdminChange} value={contractData.hil_admin_id?.toString() || 'none'} disabled={!isEditing}>
                            <SelectTrigger className={isEditing ? "bg-background border-border" : "bg-muted border-border"}>
                              <SelectValue placeholder="Select Admin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {admins.map((admin) => (
                                <SelectItem key={admin.admin_id} value={admin.admin_id.toString()}>
                                  {admin.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {isEditing && (
                    <div className="flex justify-end mt-8">
                      <Button
                        onClick={handleUpdate}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8 py-3"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Admin Creation Tab - keeping existing functionality with enhanced styling */}
            <TabsContent value="admin" className="space-y-8">
              {!isSuperAdmin ? (
                <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-destructive/10 rounded-full">
                        <Shield className="h-8 w-8 text-destructive" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Access Denied</h3>
                      <p className="text-muted-foreground">Only the super admin (ID: 1) can view this section.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div>
                  <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-lg">
                          <Shield className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-foreground">Create Admin</CardTitle>
                          <p className="text-muted-foreground mt-1">Add new administrative users to the system</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-foreground">
                            Name
                          </Label>
                          <div>
                            <Input
                              id="name"
                              name="name"
                              value={newAdmin.name}
                              onChange={handleNewAdminChange}
                              className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${
                                errors.name ? 'border-red-500' : ''
                              }`}
                            />
                            {errors.name && (
                              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="designation" className="text-sm font-medium text-foreground">
                            Designation
                          </Label>
                          <div>
                            <Input
                              id="designation"
                              name="designation"
                              value={newAdmin.designation}
                              onChange={handleNewAdminChange}
                              className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${
                                errors.designation ? 'border-red-500' : ''
                              }`}
                            />
                            {errors.designation && (
                              <p className="text-sm text-red-500 mt-1">{errors.designation}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-sm font-medium text-foreground">
                            Username
                          </Label>
                          <div>
                            <Input
                              id="username"
                              name="username"
                              value={newAdmin.username}
                              onChange={handleNewAdminChange}
                              className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${
                                errors.username ? 'border-red-500' : ''
                              }`}
                            />
                            {errors.username && (
                              <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={newAdmin.password}
                              onChange={handleNewAdminChange}
                              className={`bg-background border-border focus:border-accent focus:ring-accent/20 pr-10 ${
                                errors.password ? 'border-red-500' : ''
                              }`}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            {errors.password && (
                              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email (optional)
                          </Label>
                          <div>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={newAdmin.email}
                              onChange={handleNewAdminChange}
                              className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${
                                errors.email ? 'border-red-500' : ''
                              }`}
                              placeholder="example@example.com"
                            />
                            {errors.email && (
                              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mobile_number" className="text-sm font-medium text-foreground">
                            Mobile Number (optional)
                          </Label>
                          <div>
                            <Input
                              id="mobile_number"
                              name="mobile_number"
                              type="tel"
                              value={newAdmin.mobile_number}
                              onChange={handleNewAdminChange}
                              className={`bg-background border-border focus:border-accent focus:ring-accent/20 ${
                                errors.mobile_number ? 'border-red-500' : ''
                              }`}
                              placeholder="1234567890"
                            />
                            {errors.mobile_number && (
                              <p className="text-sm text-red-500 mt-1">{errors.mobile_number}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-6">
                        <Button
                          onClick={handleCreateAdmin}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
                        >
                          <Save className="mr-2 h-4 w-4" /> Create Admin
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
<>
      <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground">Existing Admins</CardTitle>
              <p className="text-muted-foreground mt-1">Manage system administrators</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="rounded-lg border border-border overflow-hidden bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Designation</TableHead>
                  <TableHead className="font-semibold">Username</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {admins.map((admin) =>
                  editingAdminId === admin.admin_id ? (
                    <TableRow key={admin.admin_id} className="bg-muted/20">
                      <TableCell>
                        <Input
                          value={editingAdmin.name}
                          onChange={(e) => setEditingAdmin((prev) => ({ ...prev, name: e.target.value }))}
                          className="bg-background border-border"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editingAdmin.designation}
                          onChange={(e) =>
                            setEditingAdmin((prev) => ({ ...prev, designation: e.target.value }))
                          }
                          className="bg-background border-border"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editingAdmin.username}
                          onChange={(e) =>
                            setEditingAdmin((prev) => ({ ...prev, username: e.target.value }))
                          }
                          className="bg-background border-border"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editingAdmin.email}
                          onChange={(e) => setEditingAdmin((prev) => ({ ...prev, email: e.target.value }))}
                          className="bg-background border-border"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={saveEditedAdmin}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingAdminId(null)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={admin.admin_id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.designation}</TableCell>
                      <TableCell>{admin.username}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingAdmin(admin)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAdmin(admin.admin_id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete this admin? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteAdmin}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  )
}