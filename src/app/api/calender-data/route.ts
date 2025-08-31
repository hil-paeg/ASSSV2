// import { prisma } from '@/lib/prisma';
// import { NextResponse } from 'next/server';

// const normalize = (d: Date) => d.toISOString().split('T')[0];

// export async function GET() {
//   try {
//     const siteVisits = await prisma.siteVisit.findMany({
//       select: { date: true },
//     });

//     const tickets = await prisma.ticket.findMany({
//       select: { created_at: true },
//     });

//     // Debugging logs (check your server console)
//     console.log("Site Visits from DB:", siteVisits);
//     console.log("Tickets from DB:", tickets);

//     return NextResponse.json({
//       siteVisits: siteVisits.map(s => ({ date: normalize(s.date) })),
//       tickets: tickets.map(t => ({ created_at: normalize(t.created_at) })),
//     });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
//   }
// }


import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const normalize = (d: Date) => d.toISOString().split('T')[0];

export async function GET() {
  try {
    const siteVisits = await prisma.siteVisit.findMany({ select: { date: true } });
    const tickets = await prisma.ticket.findMany({ select: { created_at: true } });

    return NextResponse.json({
      siteVisits: siteVisits.map(s => ({ date: normalize(s.date) })),
      tickets: tickets.map(t => ({ created_at: normalize(t.created_at) })),
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
