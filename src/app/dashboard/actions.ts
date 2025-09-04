// // app/dashboard/actions.ts
// "use server";

// import { prisma } from "@/lib/prisma";

// export async function getContractualTicket(clientId: number) {
//   const contract = await prisma.contractualTicket.findUnique({
//     where: { client_id: clientId },
//   });

//   return contract;
// }


// export async function getClientContractInfo(clientId: number) {
//   const client = await prisma.client.findUnique({
//     where: { client_id: clientId },
//     include: {
//       contracts: {
//         include: {
//           siteVisits: true,
//         },
//       },
//     },
//   });

//   if (!client) return null;

//   const contract = client.contracts[0] ?? null;
//   if (!contract) return { client, contract: null };

//   // Compute endDate = start_date + 1 year
//   const startDate = client.start_date;
//   const endDate = new Date(startDate);
//   endDate.setFullYear(startDate.getFullYear() + 1);

//   const today = new Date();
//   const diffMs = endDate.getTime() - today.getTime();
//   const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

//   // Choose upcoming site visit date, if any
//   const futureVisits = contract.siteVisits.filter((v) => v.date > today);
//   futureVisits.sort((a, b) => a.date.getTime() - b.date.getTime());
//   const nextSiteVisit = futureVisits[0] ?? null;

//   return {
//     client: {
//       name: client.name,
//       startDate,
//     },
//     contract: {
//       allowed_tickets: contract.allowed_tickets,
//       ticket_typeRS1: contract.ticket_typeRS1,
//       ticket_typeRS1_used: contract.ticket_typeRS1_used,
//       ticket_typeRS2: contract.ticket_typeRS2,
//       ticket_typeRS2_used: contract.ticket_typeRS2_used,
//       ticket_typeRS3_1: contract.ticket_typeRS3_1,
//       ticket_typeRS3_1_used: contract.ticket_typeRS3_1_used,
//       ticket_typeRS3_2: contract.ticket_typeRS3_2,
//       ticket_typeRS3_2_used: contract.ticket_typeRS3_2_used,
//     },
//     endDate,
//     daysRemaining,
//     nextSiteVisitDate: nextSiteVisit?.date ?? null,
//   };
// }



'use server';

import { prisma } from '@/lib/prisma';

export async function getContractualTicket(clientId: number) {
  try {
    if (!prisma.contractualTicket) {
      throw new Error('Prisma ContractualTicket model is not initialized');
    }
    const contract = await prisma.contractualTicket.findUnique({
      where: { client_id: clientId },
    });
    return contract;
  } catch (error) {
    console.error('getContractualTicket Error:', error);
    throw new Error(`Failed to fetch contract: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getClientContractInfo(clientId: number) {
  try {
    if (!prisma.client || !prisma.contractualTicket) {
      throw new Error('Prisma Client or ContractualTicket model is not initialized');
    }
    const client = await prisma.client.findUnique({
      where: { client_id: clientId },
      include: {
        contracts: {
          include: {
            siteVisits: true,
          },
        },
      },
    });

    if (!client) return null;

    const contract = client.contracts[0] ?? null;
    if (!contract) return { client, contract: null };

    const startDate = client.start_date;
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + 1);

    const today = new Date();
    const diffMs = endDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    const futureVisits = contract.siteVisits.filter((v) => v.date > today);
    futureVisits.sort((a, b) => a.date.getTime() - b.date.getTime());
    const nextSiteVisit = futureVisits[0] ?? null;

    const total_tickets_used =
      (contract.ticket_typeRS1_used || 0) +
      (contract.ticket_typeRS2_used || 0) +
      (contract.ticket_typeRS3_1_used || 0) +
      (contract.ticket_typeRS3_2_used || 0);

    return {
      client: {
        name: client.name,
        startDate,
      },
      contract: {
        allowed_tickets: contract.allowed_tickets,
        total_tickets_used,
        ticket_typeRS1: contract.ticket_typeRS1,
        ticket_typeRS1_used: contract.ticket_typeRS1_used,
        ticket_typeRS2: contract.ticket_typeRS2,
        ticket_typeRS2_used: contract.ticket_typeRS2_used,
        ticket_typeRS3_1: contract.ticket_typeRS3_1,
        ticket_typeRS3_1_used: contract.ticket_typeRS3_1_used,
        ticket_typeRS3_2: contract.ticket_typeRS3_2,
        ticket_typeRS3_2_used: contract.ticket_typeRS3_2_used,
      },
      endDate,
      daysRemaining,
      nextSiteVisitDate: nextSiteVisit?.date ?? null,
    };
  } catch (error) {
    console.error('getClientContractInfo Error:', error);
    throw new Error(`Failed to fetch client contract info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getTicketStats(clientId: number) {
  try {
    if (!prisma.ticket) {
      throw new Error('Prisma Ticket model is not initialized');
    }
    const tickets = await prisma.ticket.findMany({
      where: {
        client_id: clientId,
        status: { not: 'closed' },
      },
    });
    const pendingTickets = tickets.length;
    const highPriorityTickets = tickets.filter((t) => t.priority === 'High').length;

    return { pendingTickets, highPriorityTickets };
  } catch (error) {
    console.error('getTicketStats Error:', error);
    throw new Error(`Failed to fetch ticket stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
