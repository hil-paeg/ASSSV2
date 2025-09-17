'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers'; 
import jwt from 'jsonwebtoken'; 
import { ClientFormData, MemberFormData, ContractFormData, AdminFormData } from '@/types/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

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

export async function suggestClientId() {
  try {
    const maxClient = await prisma.client.findFirst({
      orderBy: { client_id: 'desc' },
      select: { client_id: true },
    });

    if (!maxClient?.client_id) {
      return 'CLIENT001';  // Default first ID
    }

    // Extract numeric part from existing client_id
    const match = maxClient.client_id.match(/\d+$/);
    const numPart = match ? parseInt(match[0], 10) : 0;
    const nextNum = (numPart + 1).toString().padStart(3, '0');

    // Return new client_id
    return `CLIENT${nextNum}`;
  } catch (error) {
    throw new Error('Failed to suggest client ID');
  }
}

export async function getClientDetails(client_id: string) {
  if (!client_id || typeof client_id !== 'string') {
    throw new Error('Invalid or missing client_id');
  }

  try {
    const client = await prisma.client.findUnique({
      where: { client_id },
      include: {
        members: true,
        contracts: { include: { siteVisits: true } },
      },
    });

    if (!client) throw new Error('Client not found');

    const contract = client.contracts[0];

    // resolve escalation matrix admins
    let escalationAdmins: any[] = [];
    if (contract?.escalation_matrix?.length) {
      escalationAdmins = await prisma.admin.findMany({
        where: { admin_id: { in: contract.escalation_matrix } },
        select: {
          admin_id: true,
          name: true,
          designation: true,
          email: true,
          mobile_number: true,
        },
      });

      // maintain the order of escalation_matrix [3,1,2]
      escalationAdmins = contract.escalation_matrix.map(
        (id) => escalationAdmins.find((a) => a.admin_id === id) || { admin_id: id, name: "Unknown", designation: "N/A" }
      );
    }

    return {
      client_id: client.client_id,
      client_username: client.client_username,
      name: client.name,
      start_date: client.start_date.toISOString().split('T')[0],
      payment_cycle: client.payment_cycle,
      email: client.email || "",
      members: client.members.map((m) => ({
        member_id: m.member_id,
        client_id: m.client_id,
        member_name: m.member_name,
        designation: m.designation,
        email: m.email,
        phone_number: m.phone_number || "",
        escalation_level: m.escalation_level,
        member_username: m.member_username,
        member_password: "",
      })),
      contract: contract
        ? {
            client_id: contract.client_id,
            allowed_tickets: contract.allowed_tickets,
            total_tickets_used: contract.total_tickets_used,
            ticket_typeRS1: contract.ticket_typeRS1,
            ticket_typeRS1_used: contract.ticket_typeRS1_used,
            ticket_typeRS2: contract.ticket_typeRS2,
            ticket_typeRS2_used: contract.ticket_typeRS2_used,
            ticket_typeRS3_1: contract.ticket_typeRS3_1,
            ticket_typeRS3_1_used: contract.ticket_typeRS3_1_used,
            ticket_typeRS3_2: contract.ticket_typeRS3_2,
            ticket_typeRS3_2_used: contract.ticket_typeRS3_2_used,
            site_visit_frequency: contract.site_visit_frequency,
            site_visit_date:
              contract.siteVisits[0]?.date.toISOString().split('T')[0] || "",
            hil_admin_id: contract.hil_admin_id,
            hil_admin_team: contract.hil_admin_team || [],
            escalation_matrix: contract.escalation_matrix,
            escalation_admins: escalationAdmins, // 👈 full details of admins
          }
        : null,
    };
  } catch (error) {
    console.error('getClientDetails error:', error);
    throw new Error('Failed to fetch client details');
  }
}


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
        member_password: m.member_password || ''
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
export async function createMembers(client_id: string, members: MemberFormData[]) {
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
        escalation_matrix: contractData.escalation_matrix || undefined,
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
        escalation_matrix: contractData.escalation_matrix || undefined,
        siteVisits: {
          create: siteVisitDates.map((date) => ({ date })),
        },
      },
    });
  } catch (error) {
    console.error('Contract creation/update error:', error); // Add logging to see the actual error
    throw new Error('Failed to create or update contract');
  }
}


export const updateContract = createOrUpdateContract;

// Fetch all admins for dropdown
export async function getAdmins() {
  try {
    if (!prisma.admin) {
      throw new Error('Prisma Admin model is not initialized');
    }
    return await prisma.admin.findMany({
      select: { admin_id: true, name: true, designation: true, username: true, email: true, mobile_number: true },
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
        email: adminData.email,
        mobile_number: adminData.mobile_number,
      },
    });
  } catch (error) {
    throw new Error(`Failed to create admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Fetch current admin ID from JWT token 
export async function getCurrentAdminId(): Promise<number> {
  try {
    // Get token from cookies (server-side access)
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      throw new Error('No auth token found');
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Check if this is an admin token
    if (decoded.role !== 'admin') {
      throw new Error('User is not an admin');
    }

    const adminId = decoded.id;

    if (!adminId) {
      throw new Error('Admin ID not found in token');
    }

    // Verify admin exists in database (optional but recommended)
    const admin = await prisma.admin.findUnique({
      where: { admin_id: adminId },
    });

    if (!admin) {
      throw new Error('Admin not found in database');
    }

    return adminId;
  } catch (error) {
    console.error('getCurrentAdminId Error:', error);
    // Return 0 to indicate no admin access
    return 0;
  }
}


// Update admin
export async function updateAdmin(adminId: number, adminData: Partial<AdminFormData>) {
  try {
    if (!prisma.admin) {
      throw new Error("Prisma Admin model is not initialized");
    }

    // Ensure username is unique if updating username
    if (adminData.username) {
      const existingAdmin = await prisma.admin.findUnique({
        where: { username: adminData.username },
      });

      if (existingAdmin && existingAdmin.admin_id !== adminId) {
        throw new Error("Username already taken by another admin");
      }
    }

    await prisma.admin.update({
      where: { admin_id: adminId },
      data: {
        name: adminData.name,
        designation: adminData.designation,
        username: adminData.username,
        email: adminData.email,
        mobile_number: adminData.mobile_number,
        ...(adminData.password ? { password: adminData.password } : {}), // update password only if provided
      },
    });

    return { success: true };
  } catch (error) {
    throw new Error(
      `Failed to update admin: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// Delete admin
export async function deleteAdmin(adminId: number) {
  try {
    if (!prisma.admin) {
      throw new Error("Prisma Admin model is not initialized");
    }

    await prisma.admin.delete({
      where: { admin_id: adminId },
    });

    return { success: true };
  } catch (error) {
    throw new Error(
      `Failed to delete admin: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}




// export async function getClientDetails(client_id: string) {
//   if (!client_id || typeof client_id !== 'string') {
//     throw new Error('Invalid or missing client_id');
//   }

//   try {
//     const client = await prisma.client.findUnique({
//       where: { client_id },
//       include: {
//         members: true,
//         contracts: { include: { siteVisits: true } },
//       },
//     });

//     if (!client) throw new Error('Client not found');

//     return {
//       client_id: client.client_id,
//       client_username: client.client_username,
//       name: client.name,
//       start_date: client.start_date.toISOString().split('T')[0],
//       payment_cycle: client.payment_cycle,
//       email: client.email || "",
//       members: client.members.map((m) => ({
//         member_id: m.member_id, // number
//         client_id: m.client_id,
//         member_name: m.member_name,
//         designation: m.designation,
//         email: m.email,
//         phone_number: m.phone_number || "",
//         escalation_level: m.escalation_level,
//         member_username: m.member_username,
//         member_password: "", // Don't return password
//       })),
//       contract: client.contracts[0]
//         ? {
//             client_id: client.contracts[0].client_id,
//             allowed_tickets: client.contracts[0].allowed_tickets,
//             total_tickets_used: client.contracts[0].total_tickets_used,
//             ticket_typeRS1: client.contracts[0].ticket_typeRS1,
//             ticket_typeRS1_used: client.contracts[0].ticket_typeRS1_used,
//             ticket_typeRS2: client.contracts[0].ticket_typeRS2,
//             ticket_typeRS2_used: client.contracts[0].ticket_typeRS2_used,
//             ticket_typeRS3_1: client.contracts[0].ticket_typeRS3_1,
//             ticket_typeRS3_1_used: client.contracts[0].ticket_typeRS3_1_used,
//             ticket_typeRS3_2: client.contracts[0].ticket_typeRS3_2,
//             ticket_typeRS3_2_used: client.contracts[0].ticket_typeRS3_2_used,
//             site_visit_frequency: client.contracts[0].site_visit_frequency,
//             site_visit_date:
//               client.contracts[0].siteVisits[0]?.date.toISOString().split('T')[0] || "",
//             hil_admin_id: client.contracts[0].hil_admin_id,
//             hil_admin_team: client.contracts[0].hil_admin_team || [],
//             escalation_matrix: (client.contracts[0] as any).escalation_matrix || [0,0,0],
//           }
//         : null,
//     };
//   } catch (error) {
//     console.error('getClientDetails error:', error);
//     throw new Error('Failed to fetch client details');
//   }
// }


// export async function getClientDetails(client_id: string) {
//   console.log('client_id received:', client_id);  // Debugging line

//   if (!client_id || typeof client_id !== 'string') {
//     throw new Error('Invalid or missing client_id');
//   }

//   try {
//     const client = await prisma.client.findUnique({
//       where: { client_id },  // Ensure client_id is a string
//       include: {
//         members: true,
//         contracts: { include: { siteVisits: true } },
//       },
//     });

//     if (!client) throw new Error('Client not found');

//     return {
//       client_id: client.client_id,
//       client_username: client.client_username,
//       name: client.name,
//       start_date: client.start_date.toISOString().split('T')[0],
//       payment_cycle: client.payment_cycle,
//       members: client.members.map((m) => ({
//         member_id: m.member_id,
//         client_id: m.client_id,
//         member_name: m.member_name,
//         designation: m.designation,
//         email: m.email,
//         phone_number: m.phone_number,
//         escalation_level: m.escalation_level,
//         member_username: m.member_username,
//         member_password: m.member_password,
//       })),
//       contract: client.contracts[0]
//         ? {
//             client_id: client.contracts[0].client_id,
//             allowed_tickets: client.contracts[0].allowed_tickets,
//             total_tickets_used: client.contracts[0].total_tickets_used,
//             ticket_typeRS1: client.contracts[0].ticket_typeRS1,
//             ticket_typeRS1_used: client.contracts[0].ticket_typeRS1_used,
//             ticket_typeRS2: client.contracts[0].ticket_typeRS2,
//             ticket_typeRS2_used: client.contracts[0].ticket_typeRS2_used,
//             ticket_typeRS3_1: client.contracts[0].ticket_typeRS3_1,
//             ticket_typeRS3_1_used: client.contracts[0].ticket_typeRS3_1_used,
//             ticket_typeRS3_2: client.contracts[0].ticket_typeRS3_2,
//             ticket_typeRS3_2_used: client.contracts[0].ticket_typeRS3_2_used,
//             site_visit_frequency: client.contracts[0].site_visit_frequency,
//             site_visit_date:
//               client.contracts[0].siteVisits[0]?.date.toISOString().split('T')[0] || '',
//             hil_admin_id: client.contracts[0].hil_admin_id,
//             hil_admin_team: client.contracts[0].hil_admin_team,
//           }
//         : null,
//     };
//   } catch (error) {
//     console.error('getClientDetails error:', error);
//     throw new Error('Failed to fetch client details');
//   }
// };

// Create client and members