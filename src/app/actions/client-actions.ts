
'use server';

import { prisma } from '@/lib/prisma';
import { ClientFormData, MemberFormData, ContractFormData, AdminFormData } from '@/types/client';

// Fetch all clients for dropdown
export async function getClients() {
  try {
    return await prisma.client.findMany({
      select: { client_id: true, name: true },
    });
  } catch (error) {
    throw new Error('Failed to fetch clients');
  }
}

// Suggest an unused client_id
export async function suggestClientId() {
  try {
    const maxClient = await prisma.client.findFirst({
      orderBy: { client_id: 'desc' },
      select: { client_id: true },
    });
    return (maxClient?.client_id || 0) + 1;
  } catch (error) {
    throw new Error('Failed to suggest client ID');
  }
}

// Fetch full client details for update/view
export async function getClientDetails(client_id: number) {
  try {
    const client = await prisma.client.findUnique({
      where: { client_id },
      include: {
        members: true,
        contracts: { include: { siteVisits: true } },
      },
    });
    if (!client) throw new Error('Client not found');
    
    return {
      client_id: client.client_id,
      client_username: client.client_username,
      name: client.name,
      start_date: client.start_date.toISOString().split('T')[0],
      payment_cycle: client.payment_cycle,
      members: client.members.map((m) => ({
        member_id: m.member_id,
        client_id: m.client_id,
        member_name: m.member_name,
        designation: m.designation,
        email: m.email,
        phone_number: m.phone_number,
        escalation_level: m.escalation_level,
        member_username: m.member_username,
        member_password: m.member_password,
      })),
      contract: client.contracts[0] ? {
        client_id: client.contracts[0].client_id,
        allowed_tickets: client.contracts[0].allowed_tickets,
        total_tickets_used: client.contracts[0].total_tickets_used,
        ticket_typeRS1: client.contracts[0].ticket_typeRS1,
        ticket_typeRS1_used: client.contracts[0].ticket_typeRS1_used,
        ticket_typeRS2: client.contracts[0].ticket_typeRS2,
        ticket_typeRS2_used: client.contracts[0].ticket_typeRS2_used,
        ticket_typeRS3_1: client.contracts[0].ticket_typeRS3_1,
        ticket_typeRS3_1_used: client.contracts[0].ticket_typeRS3_1_used,
        ticket_typeRS3_2: client.contracts[0].ticket_typeRS3_2,
        ticket_typeRS3_2_used: client.contracts[0].ticket_typeRS3_2_used,
        site_visit_frequency: client.contracts[0].site_visit_frequency,
        site_visit_date: client.contracts[0].siteVisits[0]?.date.toISOString().split('T')[0] || '',
        hil_admin_id: client.contracts[0].hil_admin_id,
        hil_admin_team: client.contracts[0].hil_admin_team,
      } : null,
    };
  } catch (error) {
    throw new Error('Failed to fetch client details');
  }
}

// Create client and members
export async function createClient(clientData: ClientFormData, members: MemberFormData[]) {
  try {
    // Validate client_id uniqueness
    const existingClient = await prisma.client.findUnique({
      where: { client_id: clientData.client_id },
    });
    if (existingClient) throw new Error('Client ID already exists');

    // Validate escalation_level uniqueness
    const escalationLevels = new Set(members.map((m) => m.escalation_level));
    if (escalationLevels.size !== members.length) {
      throw new Error('Duplicate escalation levels detected');
    }

    const client = await prisma.client.create({
      data: {
        client_id: clientData.client_id,
        client_username: clientData.client_username,
        client_password: clientData.client_password || '',
        name: clientData.name,
        start_date: new Date(clientData.start_date),
        payment_cycle: clientData.payment_cycle || undefined,
      },
    });

    await prisma.clientMember.createMany({
      data: members.map((m) => ({
        client_id: client.client_id,
        member_name: m.member_name,
        designation: m.designation,
        email: m.email,
        phone_number: m.phone_number,
        escalation_level: m.escalation_level,
        member_username: m.member_username,
        member_password: m.member_password || '',
      })),
    });

    return client.client_id;
  } catch (error) {
    throw new Error(`Failed to create client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Update client
export async function updateClient(clientData: ClientFormData) {
  try {
    await prisma.client.update({
      where: { client_id: clientData.client_id },
      data: {
        client_username: clientData.client_username,
        name: clientData.name,
        start_date: new Date(clientData.start_date),
        payment_cycle: clientData.payment_cycle || undefined,
      },
    });
  } catch (error) {
    throw new Error('Failed to update client');
  }
}

// Create members (for update tab)
export async function createMembers(client_id: number, members: MemberFormData[]) {
  try {
    // Validate escalation_level uniqueness
    const existingMembers = await prisma.clientMember.findMany({
      where: { client_id },
      select: { escalation_level: true },
    });
    const existingLevels = new Set(existingMembers.map((m) => m.escalation_level));
    for (const member of members) {
      if (existingLevels.has(member.escalation_level)) {
        throw new Error(`Escalation level ${member.escalation_level} already exists for client ${client_id}`);
      }
      existingLevels.add(member.escalation_level);
    }

    await prisma.clientMember.createMany({
      data: members.map((m) => ({
        client_id,
        member_name: m.member_name,
        designation: m.designation,
        email: m.email,
        phone_number: m.phone_number,
        escalation_level: m.escalation_level,
        member_username: m.member_username,
        member_password: m.member_password || '',
      })),
    });
  } catch (error) {
    throw new Error(`Failed to create members: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Update member
export async function updateMember(member: MemberFormData) {
  try {
    if (!member.member_id) throw new Error('Member ID is required');
    if (!member.client_id) throw new Error('Client ID is required');
    
    // Validate escalation_level uniqueness
    const existingMember = await prisma.clientMember.findFirst({
      where: {
        client_id: member.client_id,
        escalation_level: member.escalation_level,
        member_id: { not: member.member_id },
      },
    });
    if (existingMember) {
      throw new Error(`Escalation level ${member.escalation_level} already exists for another member`);
    }

    await prisma.clientMember.update({
      where: { member_id: member.member_id },
      data: {
        member_name: member.member_name,
        designation: member.designation,
        email: member.email,
        phone_number: member.phone_number,
        escalation_level: member.escalation_level,
        member_username: member.member_username,
      },
    });
  } catch (error) {
    throw new Error(`Failed to update member: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Delete member
export async function deleteMember(member_id: number) {
  try {
    await prisma.clientMember.delete({
      where: { member_id },
    });
  } catch (error) {
    throw new Error('Failed to delete member');
  }
}

// Create or update contract
export async function createOrUpdateContract(contractData: ContractFormData) {
  try {
    const startDate = new Date(contractData.site_visit_date);
    const siteVisitDates: Date[] = [];
    for (let i = 0; i < contractData.site_visit_frequency; i++) {
      const d = new Date(startDate);
      d.setMonth(startDate.getMonth() + i * 2);
      siteVisitDates.push(d);
    }

    await prisma.contractualTicket.upsert({
      where: { client_id: contractData.client_id },
      update: {
        allowed_tickets: contractData.allowed_tickets,
        total_tickets_used: contractData.total_tickets_used,
        ticket_typeRS1: contractData.ticket_typeRS1,
        ticket_typeRS1_used: contractData.ticket_typeRS1_used,
        ticket_typeRS2: contractData.ticket_typeRS2,
        ticket_typeRS2_used: contractData.ticket_typeRS2_used,
        ticket_typeRS3_1: contractData.ticket_typeRS3_1,
        ticket_typeRS3_1_used: contractData.ticket_typeRS3_1_used,
        ticket_typeRS3_2: contractData.ticket_typeRS3_2,
        ticket_typeRS3_2_used: contractData.ticket_typeRS3_2_used,
        site_visit_frequency: contractData.site_visit_frequency,
        hil_admin_id: contractData.hil_admin_id,
        hil_admin_team: contractData.hil_admin_team,
        siteVisits: {
          deleteMany: {},
          create: siteVisitDates.map((date) => ({ date })),
        },
      },
      create: {
        client_id: contractData.client_id,
        allowed_tickets: contractData.allowed_tickets,
        total_tickets_used: contractData.total_tickets_used,
        ticket_typeRS1: contractData.ticket_typeRS1,
        ticket_typeRS1_used: contractData.ticket_typeRS1_used,
        ticket_typeRS2: contractData.ticket_typeRS2,
        ticket_typeRS2_used: contractData.ticket_typeRS2_used,
        ticket_typeRS3_1: contractData.ticket_typeRS3_1,
        ticket_typeRS3_1_used: contractData.ticket_typeRS3_1_used,
        ticket_typeRS3_2: contractData.ticket_typeRS3_2,
        ticket_typeRS3_2_used: contractData.ticket_typeRS3_2_used,
        site_visit_frequency: contractData.site_visit_frequency,
        hil_admin_id: contractData.hil_admin_id,
        hil_admin_team: contractData.hil_admin_team,
        siteVisits: {
          create: siteVisitDates.map((date) => ({ date })),
        },
      },
    });
  } catch (error) {
    throw new Error('Failed to create or update contract');
  }
}

// Update contract (alias for createOrUpdateContract)
export const updateContract = createOrUpdateContract;

// Fetch all admins for dropdown
export async function getAdmins() {
  try {
    if (!prisma.admin) {
      throw new Error('Prisma Admin model is not initialized');
    }
    return await prisma.admin.findMany({
      select: { admin_id: true, name: true, designation: true, username: true },
    });
  } catch (error) {
    throw new Error(`Failed to fetch admins: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Create admin
export async function createAdmin(adminData: AdminFormData) {
  try {
    if (!prisma.admin) {
      throw new Error('Prisma Admin model is not initialized');
    }
    // Validate username uniqueness
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: adminData.username },
    });
    if (existingAdmin) throw new Error('Admin username already exists');

    await prisma.admin.create({
      data: {
        name: adminData.name,
        designation: adminData.designation,
        username: adminData.username,
        password: adminData.password,
      },
    });
  } catch (error) {
    throw new Error(`Failed to create admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
