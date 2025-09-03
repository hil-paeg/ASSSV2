// File: app/api/site-visits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number | string;
      role: 'client' | 'clientMember' | 'admin';
      clientId?: number;
    };

    let siteVisits;
    if (decoded.role === 'admin') {
      siteVisits = await prisma.siteVisit.findMany({
        include: {
          contract: {
            include: {
              client: {
                select: { client_username: true },
              },
            },
          },
        },
      });
    } else if (decoded.role === 'client') {
      siteVisits = await prisma.siteVisit.findMany({
        where: { client_id: Number(decoded.id) },
        include: {
          contract: {
            include: {
              client: {
                select: { client_username: true },
              },
            },
          },
        },
      });
    } else if (decoded.role === 'clientMember') {
      if (!decoded.clientId) {
        return NextResponse.json({ error: 'Invalid clientId for clientMember' }, { status: 400 });
      }
      siteVisits = await prisma.siteVisit.findMany({
        where: { client_id: Number(decoded.clientId) },
        include: {
          contract: {
            include: {
              client: {
                select: { client_username: true },
              },
            },
          },
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    return NextResponse.json(siteVisits);
  } catch (error: any) {
    console.error('Error fetching site visits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}