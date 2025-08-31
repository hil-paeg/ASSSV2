// app/client-contract/actions.ts
// Separate file for server actions with "use server" at the top

"use server";

import { prisma } from "@/lib/prisma";

// ✅ Server action to fetch clients (runs on server)
export async function getClients() {
  return await prisma.client.findMany({
    select: {
      client_id: true,
      name: true,
    },
  });
}

// ✅ Server action to create or update the contract (posts data to PostgreSQL via Prisma)
export async function createOrUpdateContract(formData: FormData) {
  const clientId = Number(formData.get("client_id"));
  const allowed_tickets = Number(formData.get("allowed_tickets"));
  const ticket_typeRS1 = Number(formData.get("ticket_typeRS1"));
  const ticket_typeRS2 = Number(formData.get("ticket_typeRS2"));
  const ticket_typeRS3_1 = Number(formData.get("ticket_typeRS3_1"));
  const ticket_typeRS3_2 = Number(formData.get("ticket_typeRS3_2"));
  const site_visit_frequency = Number(formData.get("site_visit_frequency"));
  const startDate = new Date(formData.get("site_visit_date") as string);

  // Generate site visit dates (example: every 2 months)
  const siteVisitDates: Date[] = [];
  for (let i = 0; i < site_visit_frequency; i++) {
    const d = new Date(startDate);
    d.setMonth(startDate.getMonth() + i * 2);
    siteVisitDates.push(d);
  }

  // Upsert contract in Prisma (assumes your schema has contractualTicket and siteVisits models)
  await prisma.contractualTicket.upsert({
    where: { client_id: clientId },
    update: {
      allowed_tickets,
      ticket_typeRS1,
      ticket_typeRS2,
      ticket_typeRS3_1,
      ticket_typeRS3_2,
      site_visit_frequency,
      siteVisits: {
        deleteMany: {}, // Clear old site visits
        create: siteVisitDates.map((date) => ({ date })),
      },
    },
    create: {
      client_id: clientId,
      allowed_tickets,
      ticket_typeRS1,
      ticket_typeRS2,
      ticket_typeRS3_1,
      ticket_typeRS3_2,
      site_visit_frequency,
      siteVisits: {
        create: siteVisitDates.map((date) => ({ date })),
      },
    },
  });

  return { success: true };
}


// "use server";

// import { prisma } from "@/lib/prisma";

// // ✅ Server action to fetch clients
// export async function getClients() {
//   return await prisma.client.findMany({
//     select: {
//       client_id: true,
//       name: true,
//     },
//   });
// }

// // ✅ Server action to create or update the contract
// export async function createOrUpdateContract(formData: FormData) {
//   const clientId = Number(formData.get("client_id"));
//   const allowed_tickets = Number(formData.get("allowed_tickets"));
//   const ticket_typeRS1 = Number(formData.get("ticket_typeRS1"));
//   const ticket_typeRS2 = Number(formData.get("ticket_typeRS2"));
//   const ticket_typeRS3_1 = Number(formData.get("ticket_typeRS3_1"));
//   const ticket_typeRS3_2 = Number(formData.get("ticket_typeRS3_2"));
//   const site_visit_frequency = Number(formData.get("site_visit_frequency"));
//   const startDate = new Date(formData.get("site_visit_date") as string);

//   const siteVisitDates: Date[] = [];
//   for (let i = 0; i < site_visit_frequency; i++) {
//     const d = new Date(startDate);
//     d.setMonth(startDate.getMonth() + i * 2);
//     siteVisitDates.push(d);
//   }

//   await prisma.contractualTicket.upsert({
//     where: { client_id: clientId },
//     update: {
//       allowed_tickets,
//       ticket_typeRS1,
//       ticket_typeRS2,
//       ticket_typeRS3_1,
//       ticket_typeRS3_2,
//       site_visit_frequency,
//       siteVisits: {
//         deleteMany: {},
//         create: siteVisitDates.map((date) => ({ date })),
//       },
//     },
//     create: {
//       client_id: clientId,
//       allowed_tickets,
//       ticket_typeRS1,
//       ticket_typeRS2,
//       ticket_typeRS3_1,
//       ticket_typeRS3_2,
//       site_visit_frequency,
//       siteVisits: {
//         create: siteVisitDates.map((date) => ({ date })),
//       },
//     },
//   });

//   return { success: true };
// }

// // ✅ New server action to fetch dashboard data
// export async function getDashboardData(clientId: number, role: string) {
//   try {
//     // Fetch ContractualTicket data
//     const contractualTicket = await prisma.contractualTicket.findUnique({
//       where: { client_id: clientId },
//       select: {
//         allowed_tickets: true,
//         total_tickets_used: true,
//         ticket_typeRS1: true,
//         ticket_typeRS1_used: true,
//         ticket_typeRS2: true,
//         ticket_typeRS2_used: true,
//         ticket_typeRS3_1: true,
//         ticket_typeRS3_1_used: true,
//         ticket_typeRS3_2: true,
//         ticket_typeRS3_2_used: true,
//       },
//     });

//     // Fetch pending tickets (status: "open")
//     const pendingTickets = await prisma.ticket.count({
//       where: { client_id: clientId, status: 'open' },
//     });

//     // Hardcode high-priority tickets to 0 as per requirement
//     const highPriorityTickets = 0;

//     // Prepare dashboard data
//     const dashboardData = {
//       ticketsRemaining: role === 'client' ? (contractualTicket?.allowed_tickets || 0) - (contractualTicket?.total_tickets_used || 0) : 0,
//       ticketsUsed: role === 'client' ? contractualTicket?.total_tickets_used || 0 : 45,
//       pendingTickets,
//       highPriorityTickets,
//       ticketTypes: {
//         RS1: {
//           used: contractualTicket?.ticket_typeRS1_used || 0,
//           total: contractualTicket?.ticket_typeRS1 || 12,
//         },
//         RS2: {
//           used: contractualTicket?.ticket_typeRS2_used || 0,
//           total: contractualTicket?.ticket_typeRS2 || 12,
//         },
//         'RS3-1': {
//           used: contractualTicket?.ticket_typeRS3_1_used || 0,
//           total: contractualTicket?.ticket_typeRS3_1 || 12,
//         },
//         'RS3-2': {
//           used: contractualTicket?.ticket_typeRS3_2_used || 0,
//           total: contractualTicket?.ticket_typeRS3_2 || 12,
//         },
//       },
//       role,
//     };

//     return { success: true, data: dashboardData };
//   } catch (error) {
//     console.error('Error fetching dashboard data:', error);
//     return { success: false, error: 'Internal server error' };
//   }
// }