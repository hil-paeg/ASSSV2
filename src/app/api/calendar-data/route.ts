


// import { prisma } from '@/lib/prisma';
// import { NextResponse } from 'next/server';

// const normalize = (d: Date) => d.toISOString().split('T')[0];

// export async function GET() {
//   try {
//     const siteVisits = await prisma.siteVisit.findMany({ select: { date: true } });
//     const tickets = await prisma.ticket.findMany({ select: { created_at: true } });
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
import jwt from 'jsonwebtoken';

const normalize = (d: Date) => d.toISOString().split('T')[0];
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number | string;
      role: 'client' | 'clientMember' | 'admin';
      clientId?: number;
    };

    if (!decoded.clientId) {
      return NextResponse.json({ error: 'Invalid token: no clientId' }, { status: 403 });
    }

    const clientId = decoded.clientId;

    const siteVisits = await prisma.siteVisit.findMany({
      where: { contract: { client_id: clientId } }, // adjust relation if needed
      select: { date: true },
    });

    const tickets = await prisma.ticket.findMany({
      where: { client_id: clientId },
      select: { created_at: true },
    });

    return NextResponse.json({
      siteVisits: siteVisits.map((s) => ({ date: normalize(s.date) })),
      tickets: tickets.map((t) => ({ created_at: normalize(t.created_at) })),
    });
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
