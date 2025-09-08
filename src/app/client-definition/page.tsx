
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle2, Edit, Trash2, Plus, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// import { getClients, suggestClientId, createClient, updateClient, createMembers, updateMember, deleteMember, getClientDetails, createOrUpdateContract, updateContract, getAdmins, createAdmin } from '@/actions/client-actions';
import { ClientFormData, MemberFormData, ContractFormData, AdminFormData } from '@/types/client';
import { getClients , suggestClientId, createClient, updateClient, createMembers, updateMember, deleteMember, getClientDetails, createOrUpdateContract, updateContract, getAdmins, createAdmin } from '../actions/client-actions';
import MainLayout from '@/components/Layout/MainLayout';
export default function ClientDefinitionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('creation');
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<{ client_id: number; name: string }[]>([]);
  const [suggestedClientId, setSuggestedClientId] = useState<number | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clientData, setClientData] = useState<ClientFormData>({
    client_id: 0,
    client_username: '',
    client_password: '',
    name: '',
    start_date: '',
    payment_cycle: null,
  });
  const [members, setMembers] = useState<MemberFormData[]>([]);
  const [newMember, setNewMember] = useState<MemberFormData>({
    member_name: '',
    designation: '',
    email: '',
    phone_number: null,
    escalation_level: 1,
    member_username: '',
    member_password: '',
  });
  const [contractData, setContractData] = useState<ContractFormData>({
    client_id: 0,
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
    site_visit_date: '',
    hil_admin_id: null,
    hil_admin_team: [],
  });
  const [admins, setAdmins] = useState<{ admin_id: number; name: string; designation: string; username: string }[]>([]);
  const [newAdmin, setNewAdmin] = useState<AdminFormData>({
    name: '',
    designation: '',
    username: '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
  const [editingMember, setEditingMember] = useState<MemberFormData | null>(null);

  useEffect(() => {
    console.log('useEffect: Fetching initial data');
    getClients().then((clients) => {
      console.log('getClients Success:', clients);
      setClients(clients);
    }).catch((error) => {
      console.error('getClients Error:', error);
      toast({ title: "Error", description: "Failed to fetch clients", variant: "destructive" });
    });
    suggestClientId().then((id) => {
      console.log('suggestClientId Success:', id);
      setSuggestedClientId(id);
      setClientData((prev) => ({ ...prev, client_id: id }));
    }).catch((error) => {
      console.error('suggestClientId Error:', error);
      toast({ title: "Error", description: "Failed to suggest client ID", variant: "destructive" });
    });
    getAdmins().then((admins) => {
      console.log('getAdmins Success:', admins);
      setAdmins(admins);
    }).catch((error) => {
      console.error('getAdmins Error:', error);
      toast({ title: "Error", description: "Failed to fetch admins", variant: "destructive" });
    });
  }, []);

  const fetchClientDetails = async (id: number) => {
    setLoading(true);
    try {
      const data = await getClientDetails(id);
      setClientData({
        client_id: data.client_id,
        client_username: data.client_username,
        name: data.name,
        start_date: data.start_date,
        payment_cycle: data.payment_cycle,
      });
      setMembers(data.members || []);
      setContractData(data.contract || {
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
        site_visit_date: '',
        hil_admin_id: null,
        hil_admin_team: [],
      });
    } catch (error) {
      console.error('fetchClientDetails Error:', error);
      toast({ title: "Error", description: "Failed to fetch client details", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      await createAdmin(newAdmin);
      toast({ title: "Success", description: "Admin created." });
      setNewAdmin({
        name: '',
        designation: '',
        username: '',
        password: '',
      });
      const admins = await getAdmins();
      setAdmins(admins);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create admin.";
      console.error('Create Admin Error:', err);
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleNewAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleHilAdminChange = (value: string) => {
    setContractData((prev) => ({ ...prev, hil_admin_id: value === 'none' ? null : parseInt(value) }));
  };

  const handleHilAdminTeamChange = (selected: { value: number; label: string }[]) => {
    setContractData((prev) => ({ ...prev, hil_admin_team: selected.map((opt) => opt.value) }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: name === 'client_id' ? parseInt(value) || 0 : value,
    }));
  };

  const handleContractChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContractData((prev) => ({
      ...prev,
      [name]: name.includes('ticket_type') || name.includes('frequency') || name.includes('allowed') || name.includes('used') ? parseInt(value) || 0 : value,
    }));
  };

  const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({
      ...prev,
      [name]: name === 'escalation_level' ? parseInt(value) || 1 : value,
    }));
  };

  const handleEditMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingMember((prev) => prev ? ({
      ...prev,
      [name]: name === 'escalation_level' ? parseInt(value) || 1 : value,
    }) : null);
  };

  const addMember = () => {
    if (members.some((m) => m.escalation_level === newMember.escalation_level)) {
      toast({ title: "Error", description: `Escalation level ${newMember.escalation_level} already exists.`, variant: "destructive" });
      return;
    }
    setMembers((prev) => [...prev, { ...newMember, client_id: clientData.client_id }]);
    setNewMember({
      member_name: '',
      designation: '',
      email: '',
      phone_number: null,
      escalation_level: Math.max(...members.map((m) => m.escalation_level), 0) + 1,
      member_username: '',
      member_password: '',
    });
  };

  const startEditingMember = (index: number) => {
    setEditingMemberIndex(index);
    setEditingMember({ ...members[index] });
  };

  const saveEditedMember = () => {
    if (editingMemberIndex === null || !editingMember) return;
    if (members.some((m, i) => i !== editingMemberIndex && m.escalation_level === editingMember.escalation_level)) {
      toast({ title: "Error", description: `Escalation level ${editingMember.escalation_level} already exists.`, variant: "destructive" });
      return;
    }
    setMembers((prev) => prev.map((m, i) => (i === editingMemberIndex ? editingMember : m)));
    setEditingMemberIndex(null);
    setEditingMember(null);
  };

  const cancelEditingMember = () => {
    setEditingMemberIndex(null);
    setEditingMember(null);
  };

  const removeMember = async (memberId: number | undefined, index: number) => {
    try {
      if (memberId) {
        await deleteMember(memberId);
      }
      setMembers((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('removeMember Error:', error);
      toast({ title: "Error", description: "Failed to delete member", variant: "destructive" });
    }
  };

  const handleCreateStep1 = async () => {
    try {
      if (!clientData.client_id) {
        toast({ title: "Error", description: "Client ID is required.", variant: "destructive" });
        return;
      }
      const newClientId = await createClient(clientData, members);
      setClientData((prev) => ({ ...prev, client_id: newClientId }));
      setContractData((prev) => ({ ...prev, client_id: newClientId }));
      setStep(2);
      toast({ title: "Success", description: "Client and members created." });
      suggestClientId().then((id) => {
        setSuggestedClientId(id);
        setClientData((prev) => ({ ...prev, client_id: id }));
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create client.";
      console.error('handleCreateStep1 Error:', err);
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleCreateStep2 = async () => {
    try {
      await createOrUpdateContract(contractData);
      toast({ title: "Success", description: "Contract created." });
      setStep(1);
      setClientData({
        client_id: suggestedClientId || 0,
        client_username: '',
        client_password: '',
        name: '',
        start_date: '',
        payment_cycle: null,
      });
      setMembers([]);
      setContractData({
        client_id: suggestedClientId || 0,
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
        site_visit_date: '',
        hil_admin_id: null,
        hil_admin_team: [],
      });
      getClients().then(setClients);
      suggestClientId().then((id) => {
        setSuggestedClientId(id);
        setClientData((prev) => ({ ...prev, client_id: id }));
      });
    } catch (err) {
      console.error('handleCreateStep2 Error:', err);
      toast({ title: "Error", description: "Failed to create contract.", variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    try {
      const escalationLevels = new Set(members.map((m) => m.escalation_level));
      if (escalationLevels.size !== members.length) {
        toast({ title: "Error", description: "Duplicate escalation levels detected.", variant: "destructive" });
        return;
      }

      await updateClient(clientData);
      await Promise.all(members.map((m) => {
        const memberWithClientId = { ...m, client_id: clientData.client_id };
        return m.member_id ? updateMember(memberWithClientId) : createMembers(clientData.client_id, [memberWithClientId]);
      }));
      await updateContract({ ...contractData, client_id: selectedClientId! });
      toast({ title: "Success", description: "Client updated." });
      setIsEditing(false);
      fetchClientDetails(selectedClientId!);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update client.";
      console.error('handleUpdate Error:', err);
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleSelectClient = (value: string) => {
    const id = parseInt(value);
    setSelectedClientId(id);
    fetchClientDetails(id);
  };

  return (
    <MainLayout>
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Client Definition</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="border-b">
          <TabsTrigger value="creation" className="px-6 py-2">Creation</TabsTrigger>
          <TabsTrigger value="update" className="px-6 py-2">Update/View</TabsTrigger>
          <TabsTrigger value="admin" className="px-6 py-2">Admin Creation</TabsTrigger>
        </TabsList>
        <TabsContent value="creation" className="space-y-6">
          {step === 1 ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Step 1: Client and Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_id">Client ID</Label>
                    <Input
                      id="client_id"
                      name="client_id"
                      type="number"
                      value={clientData.client_id || ''}
                      onChange={handleClientChange}
                      placeholder={suggestedClientId ? `Suggested: ${suggestedClientId}` : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="client_username">Client Username</Label>
                    <Input id="client_username" name="client_username" value={clientData.client_username} onChange={handleClientChange} />
                  </div>
                  <div>
                    <Label htmlFor="client_password">Client Password</Label>
                    <Input id="client_password" name="client_password" type="password" value={clientData.client_password || ''} onChange={handleClientChange} />
                  </div>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={clientData.name} onChange={handleClientChange} />
                  </div>
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input id="start_date" name="start_date" type="date" value={clientData.start_date} onChange={handleClientChange} />
                  </div>
                  <div>
                    <Label htmlFor="payment_cycle">Payment Cycle</Label>
                    <Select
                      onValueChange={(value) => setClientData((prev) => ({ ...prev, payment_cycle: value === 'none' ? null : value }))}
                      value={clientData.payment_cycle || 'none'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
                <div>
                  <h3 className="text-lg font-medium mb-2">Add Members</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="member_name">Name</Label>
                      <Input id="member_name" name="member_name" value={newMember.member_name} onChange={handleNewMemberChange} />
                    </div>
                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input id="designation" name="designation" value={newMember.designation} onChange={handleNewMemberChange} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={newMember.email} onChange={handleNewMemberChange} />
                    </div>
                    <div>
                      <Label htmlFor="phone_number">Phone</Label>
                      <Input id="phone_number" name="phone_number" value={newMember.phone_number || ''} onChange={handleNewMemberChange} />
                    </div>
                    <div>
                      <Label htmlFor="escalation_level">Escalation Level</Label>
                      <Input id="escalation_level" name="escalation_level" type="number" value={newMember.escalation_level} onChange={handleNewMemberChange} />
                    </div>
                    <div>
                      <Label htmlFor="member_username">Username</Label>
                      <Input id="member_username" name="member_username" value={newMember.member_username} onChange={handleNewMemberChange} />
                    </div>
                    <div>
                      <Label htmlFor="member_password">Password</Label>
                      <Input id="member_password" name="member_password" type="password" value={newMember.member_password || ''} onChange={handleNewMemberChange} />
                    </div>
                  </div>
                  <Button onClick={addMember} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Member
                  </Button>
                </div>
                {members.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member, index) => (
                        <TableRow key={index}>
                          <TableCell>{member.member_name}</TableCell>
                          <TableCell>{member.designation}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.phone_number}</TableCell>
                          <TableCell>{member.escalation_level}</TableCell>
                          <TableCell>{member.member_username}</TableCell>
                          <TableCell>
                            <Button variant="ghost" onClick={() => removeMember(member.member_id, index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                <Button onClick={handleCreateStep1} className="mt-4 bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" /> Next: Add Contract
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Step 2: Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="allowed_tickets">Allowed Tickets</Label>
                    <Input id="allowed_tickets" name="allowed_tickets" type="number" value={contractData.allowed_tickets} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="total_tickets_used">Total Tickets Used</Label>
                    <Input id="total_tickets_used" name="total_tickets_used" type="number" value={contractData.total_tickets_used} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="ticket_typeRS1">RS1</Label>
                    <Input id="ticket_typeRS1" name="ticket_typeRS1" type="number" value={contractData.ticket_typeRS1} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="ticket_typeRS1_used">RS1 Used</Label>
                    <Input id="ticket_typeRS1_used" name="ticket_typeRS1_used" type="number" value={contractData.ticket_typeRS1_used} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="ticket_typeRS2">RS2</Label>
                    <Input id="ticket_typeRS2" name="ticket_typeRS2" type="number" value={contractData.ticket_typeRS2} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="ticket_typeRS2_used">RS2 Used</Label>
                    <Input id="ticket_typeRS2_used" name="ticket_typeRS2_used" type="number" value={contractData.ticket_typeRS2_used} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="ticket_typeRS3_1">RS3-1</Label>
                    <Input id="ticket_typeRS3_1" name="ticket_typeRS3_1" type="number" value={contractData.ticket_typeRS3_1} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="ticket_typeRS3_1_used">RS3-1 Used</Label>
                    <Input id="ticket_typeRS3_1_used" name="ticket_typeRS3_1_used" type="number" value={contractData.ticket_typeRS3_1_used} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="ticket_typeRS3_2">RS3-2</Label>
                    <Input id="ticket_typeRS3_2" name="ticket_typeRS3_2" type="number" value={contractData.ticket_typeRS3_2} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="ticket_typeRS3_2_used">RS3-2 Used</Label>
                    <Input id="ticket_typeRS3_2_used" name="ticket_typeRS3_2_used" type="number" value={contractData.ticket_typeRS3_2_used} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="site_visit_frequency">Site Visit Frequency</Label>
                    <Input id="site_visit_frequency" name="site_visit_frequency" type="number" value={contractData.site_visit_frequency} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="site_visit_date">First Site Visit Date</Label>
                    <Input id="site_visit_date" name="site_visit_date" type="date" value={contractData.site_visit_date} onChange={handleContractChange} />
                  </div>
                  <div>
                    <Label htmlFor="hil_admin_id">Allocate HIL Admin</Label>
                    <Select onValueChange={handleHilAdminChange} value={contractData.hil_admin_id?.toString() || 'none'}>
                      <SelectTrigger>
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
                  <div>
                    <Label htmlFor="hil_admin_team">HIL Admin Team</Label>
                    <Select
                      isMulti
                      options={admins.map((admin) => ({ value: admin.admin_id, label: admin.name }))}
                      value={contractData.hil_admin_team.map((id) => ({
                        value: id,
                        label: admins.find((a) => a.admin_id === id)?.name || '',
                      }))}
                      onChange={handleHilAdminTeamChange}
                      placeholder="Select Admins"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleCreateStep2} className="bg-green-600 hover:bg-green-700">
                    <Save className="mr-2 h-4 w-4" /> Save Contract
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="update" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Select Client</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleSelectClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.client_id} value={client.client_id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          {selectedClientId && (
            <>
              <Card className="shadow-lg">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-xl">Client Details</CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={handleUpdate}>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client_id">Client ID</Label>
                        <Input id="client_id" name="client_id" type="number" value={clientData.client_id} disabled />
                      </div>
                      <div>
                        <Label htmlFor="client_username">Username</Label>
                        <Input id="client_username" name="client_username" value={clientData.client_username} onChange={handleClientChange} disabled={!isEditing} />
                      </div>
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={clientData.name} onChange={handleClientChange} disabled={!isEditing} />
                      </div>
                      <div>
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input id="start_date" name="start_date" type="date" value={clientData.start_date} onChange={handleClientChange} disabled={!isEditing} />
                      </div>
                      <div>
                        <Label htmlFor="payment_cycle">Payment Cycle</Label>
                        <Select
                          onValueChange={(value) => setClientData((prev) => ({ ...prev, payment_cycle: value === 'none' ? null : value }))}
                          value={clientData.payment_cycle || 'none'}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
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
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member, index) => (
                        editingMemberIndex === index ? (
                          <TableRow key={index}>
                            <TableCell>
                              <Input name="member_name" value={editingMember?.member_name || ''} onChange={handleEditMemberChange} />
                            </TableCell>
                            <TableCell>
                              <Input name="designation" value={editingMember?.designation || ''} onChange={handleEditMemberChange} />
                            </TableCell>
                            <TableCell>
                              <Input name="email" type="email" value={editingMember?.email || ''} onChange={handleEditMemberChange} />
                            </TableCell>
                            <TableCell>
                              <Input name="phone_number" value={editingMember?.phone_number || ''} onChange={handleEditMemberChange} />
                            </TableCell>
                            <TableCell>
                              <Input name="escalation_level" type="number" value={editingMember?.escalation_level || ''} onChange={handleEditMemberChange} />
                            </TableCell>
                            <TableCell>
                              <Input name="member_username" value={editingMember?.member_username || ''} onChange={handleEditMemberChange} />
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" onClick={saveEditedMember}>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button variant="ghost" onClick={cancelEditingMember}>
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow key={index}>
                            <TableCell>{member.member_name}</TableCell>
                            <TableCell>{member.designation}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{member.phone_number}</TableCell>
                            <TableCell>{member.escalation_level}</TableCell>
                            <TableCell>{member.member_username}</TableCell>
                            <TableCell>
                              {isEditing && (
                                <Button variant="ghost" onClick={() => startEditingMember(index)}>
                                  <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                              )}
                              <Button variant="ghost" onClick={() => removeMember(member.member_id, index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      ))}
                    </TableBody>
                  </Table>
                  {isEditing && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Add New Member</h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <Input name="member_name" placeholder="Name" value={newMember.member_name} onChange={handleNewMemberChange} />
                        <Input name="designation" placeholder="Designation" value={newMember.designation} onChange={handleNewMemberChange} />
                        <Input name="email" type="email" placeholder="Email" value={newMember.email} onChange={handleNewMemberChange} />
                        <Input name="phone_number" placeholder="Phone" value={newMember.phone_number || ''} onChange={handleNewMemberChange} />
                        <Input name="escalation_level" type="number" placeholder="Level" value={newMember.escalation_level} onChange={handleNewMemberChange} />
                        <Input name="member_username" placeholder="Username" value={newMember.member_username} onChange={handleNewMemberChange} />
                        <Input name="member_password" type="password" placeholder="Password" value={newMember.member_password || ''} onChange={handleNewMemberChange} />
                      </div>
                      <Button onClick={addMember} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> Add
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Contract Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="allowed_tickets">Allowed Tickets</Label>
                      <Input id="allowed_tickets" name="allowed_tickets" type="number" value={contractData.allowed_tickets} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="total_tickets_used">Total Tickets Used</Label>
                      <Input id="total_tickets_used" name="total_tickets_used" type="number" value={contractData.total_tickets_used} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="ticket_typeRS1">RS1</Label>
                      <Input id="ticket_typeRS1" name="ticket_typeRS1" type="number" value={contractData.ticket_typeRS1} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="ticket_typeRS1_used">RS1 Used</Label>
                      <Input id="ticket_typeRS1_used" name="ticket_typeRS1_used" type="number" value={contractData.ticket_typeRS1_used} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="ticket_typeRS2">RS2</Label>
                      <Input id="ticket_typeRS2" name="ticket_typeRS2" type="number" value={contractData.ticket_typeRS2} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="ticket_typeRS2_used">RS2 Used</Label>
                      <Input id="ticket_typeRS2_used" name="ticket_typeRS2_used" type="number" value={contractData.ticket_typeRS2_used} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="ticket_typeRS3_1">RS3-1</Label>
                      <Input id="ticket_typeRS3_1" name="ticket_typeRS3_1" type="number" value={contractData.ticket_typeRS3_1} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="ticket_typeRS3_1_used">RS3-1 Used</Label>
                      <Input id="ticket_typeRS3_1_used" name="ticket_typeRS3_1_used" type="number" value={contractData.ticket_typeRS3_1_used} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="ticket_typeRS3_2">RS3-2</Label>
                      <Input id="ticket_typeRS3_2" name="ticket_typeRS3_2" type="number" value={contractData.ticket_typeRS3_2} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="ticket_typeRS3_2_used">RS3-2 Used</Label>
                      <Input id="ticket_typeRS3_2_used" name="ticket_typeRS3_2_used" type="number" value={contractData.ticket_typeRS3_2_used} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="site_visit_frequency">Site Visit Frequency</Label>
                      <Input id="site_visit_frequency" name="site_visit_frequency" type="number" value={contractData.site_visit_frequency} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="site_visit_date">First Site Visit Date</Label>
                      <Input id="site_visit_date" name="site_visit_date" type="date" value={contractData.site_visit_date} onChange={handleContractChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label htmlFor="hil_admin_id">Allocate HIL Admin</Label>
                      <Select onValueChange={handleHilAdminChange} value={contractData.hil_admin_id?.toString() || 'none'} disabled={!isEditing}>
                        <SelectTrigger>
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
                    <div>
                      <Label htmlFor="hil_admin_team">HIL Admin Team</Label>
                      <Select
                        isMulti
                        options={admins.map((admin) => ({ value: admin.admin_id, label: admin.name }))}
                        value={contractData.hil_admin_team.map((id) => ({
                          value: id,
                          label: admins.find((a) => a.admin_id === id)?.name || '',
                        }))}
                        onChange={handleHilAdminTeamChange}
                        placeholder="Select Admins"
                        isDisabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        <TabsContent value="admin" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Create Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={newAdmin.name} onChange={handleNewAdminChange} />
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input id="designation" name="designation" value={newAdmin.designation} onChange={handleNewAdminChange} />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={newAdmin.username} onChange={handleNewAdminChange} />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" value={newAdmin.password} onChange={handleNewAdminChange} />
                </div>
              </div>
              <Button onClick={handleCreateAdmin} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" /> Create Admin
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Existing Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Username</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.admin_id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.designation}</TableCell>
                      <TableCell>{admin.username}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </MainLayout>
  );
}
