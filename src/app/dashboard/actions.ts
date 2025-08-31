// app/dashboard/actions.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getContractualTicket(clientId: number) {
  const contract = await prisma.contractualTicket.findUnique({
    where: { client_id: clientId },
  });

  return contract;
}

// app/dashboard/actions.ts


export async function getClientContractInfo(clientId: number) {
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

  // Compute endDate = start_date + 1 year
  const startDate = client.start_date;
  const endDate = new Date(startDate);
  endDate.setFullYear(startDate.getFullYear() + 1);

  const today = new Date();
  const diffMs = endDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  // Choose upcoming site visit date, if any
  const futureVisits = contract.siteVisits.filter((v) => v.date > today);
  futureVisits.sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextSiteVisit = futureVisits[0] ?? null;

  return {
    client: {
      name: client.name,
      startDate,
    },
    contract: {
      allowed_tickets: contract.allowed_tickets,
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
}
