// app/api/calendarData.ts
import { prisma } from "@/lib/prisma"; // Adjust based on your setup

export async function fetchCalendarData() {

  const siteVisits = await prisma.siteVisit.findMany({
    select: {
      date: true,
    },
  });

  const tickets = await prisma.ticket.findMany({
    select: {
      created_at: true,
    },
  });

  return {
    siteVisits,
    tickets,
  };
}
