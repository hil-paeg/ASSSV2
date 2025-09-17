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
  const clientId = formData.get("client_id") as string;
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
