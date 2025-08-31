import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'client' | 'clientMember'; clientId?: number };

    if (decoded.role === 'client') {
      const client = await prisma.client.findUnique({
        where: { client_id: decoded.id },
        select: { client_username: true },
      });

      if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }

      return NextResponse.json({
        username: client.client_username,
        client_username: client.client_username,
      });
    } else if (decoded.role === 'clientMember') {
      const member = await prisma.clientMember.findUnique({
        where: { member_id: decoded.id },
        include: {
          client: { select: { client_username: true } },
        },
      });

      if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }

      return NextResponse.json({
        username: member.member_username,
        member_id: member.member_id,
        phone_number: member.phone_number,
        client_username: member.client.client_username,
      });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}