// File: app/api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

    if (decoded.role === 'admin') {
      return NextResponse.json({ error: 'Admins cannot create tickets' }, { status: 403 });
    }

    let client_id: number;
    let creator_name_from_auth: string;  // Fallback if creator_name not provided

    if (decoded.role === 'client') {
      client_id = decoded.id;
      const client = await prisma.client.findUnique({ where: { client_id }, select: { client_username: true } });
      if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }
      creator_name_from_auth = client.client_username;
    } else if (decoded.role === 'clientMember') {
      client_id = decoded.clientId!;
      const member = await prisma.clientMember.findUnique({ where: { member_id: decoded.id }, select: { member_name: true } });
      if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }
      creator_name_from_auth = member.member_name;
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const body = await req.json();
    const {
      issue_title,
      priority,
      description,
      location,
      actions_performed,
      attachments,
      comments,  // JSON string of timeline events
      creator_name = creator_name_from_auth,  // Use provided or fallback from auth
    } = body;

    if (!issue_title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTicket = await prisma.ticket.create({
      data: {
        client_id,
        issue_title,
        priority: priority || null,
        description: description || null,
        location: location || null,
        actions_performed: actions_performed || null,
        attachments: attachments || null,
        creator_name,
        status: 'raised',
        comments: comments || null,
        out_of_scope: false,
      },
    });

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}