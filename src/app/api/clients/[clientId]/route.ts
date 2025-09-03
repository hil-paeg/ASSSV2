// File: app/api/clients/[clientId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
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

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const clientId = parseInt(params.clientId, 10);
    if (isNaN(clientId)) {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 });
    }

    // Fetch client with related data
    const client = await prisma.client.findUnique({
      where: { client_id: clientId },
      include: {
        tickets: {
          select: {
            ticket_id: true,
            issue_title: true,
            priority: true,
            status: true,
            created_at: true,
            closed_at: true,
          },
          orderBy: { created_at: 'desc' },
          take: 3, // Limit to 3 recent tickets
        },
        contracts: { // Changed from 'contractualTickets' to 'contracts'
          select: {
            allowed_tickets: true,
            total_tickets_used: true,
            ticket_typeRS1: true,
            ticket_typeRS1_used: true,
            ticket_typeRS2: true,
            ticket_typeRS2_used: true,
            ticket_typeRS3_1: true,
            ticket_typeRS3_1_used: true,
            ticket_typeRS3_2: true,
            ticket_typeRS3_2_used: true,
            site_visit_frequency: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Calculate ticket activity for the last 4 months
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
    const ticketActivity = await prisma.ticket.groupBy({
      by: ['created_at'],
      where: {
        client_id: clientId,
        created_at: { gte: fourMonthsAgo },
      },
      _count: { ticket_id: true },
    });

    // Aggregate ticket counts by month
    const monthlyActivity: { [key: string]: number } = {};
    const months: string[] = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleString('en-US', { month: 'short' });
      months.unshift(monthKey);
      monthlyActivity[monthKey] = 0;
    }

    ticketActivity.forEach((activity) => {
      const month = new Date(activity.created_at).toLocaleString('en-US', { month: 'short' });
      if (monthlyActivity[month] !== undefined) {
        monthlyActivity[month] += activity._count.ticket_id;
      }
    });

    // Calculate pending tickets
    const pendingTickets = await prisma.ticket.count({
      where: {
        client_id: clientId,
        status: { in: ['open', 'confirmed by oem'] }, // Adjusted to match schema's 'open' status
      },
    });

    // Safely access contract
    const contract = client.contracts && client.contracts.length > 0 ? client.contracts[0] : null;
    const isContractActive = !!contract; // Active if contract exists

    // Use client.start_date for contract start_date, end_date is null
    return NextResponse.json({
      client: {
        client_id: client.client_id,
        name: client.name,
        client_username: client.client_username,
        tickets: client.tickets,
        contract: contract
          ? {
              start_date: client.start_date.toISOString(), // Use Client.start_date
              end_date: null, // No end_date in schema; adjust if needed
              allowed_tickets: contract.allowed_tickets || 0,
              total_tickets_used: contract.total_tickets_used || 0,
              ticket_typeRS1: contract.ticket_typeRS1 || 0,
              ticket_typeRS1_used: contract.ticket_typeRS1_used || 0,
              ticket_typeRS2: contract.ticket_typeRS2 || 0,
              ticket_typeRS2_used: contract.ticket_typeRS2_used || 0,
              ticket_typeRS3_1: contract.ticket_typeRS3_1 || 0,
              ticket_typeRS3_1_used: contract.ticket_typeRS3_1_used || 0,
              ticket_typeRS3_2: contract.ticket_typeRS3_2 || 0,
              ticket_typeRS3_2_used: contract.ticket_typeRS3_2_used || 0,
              site_visit_frequency: contract.site_visit_frequency || 0,
            }
          : null,
        pendingTickets,
        monthlyActivity,
        months,
        isContractActive,
      },
    });
  } catch (error: any) {
    console.error('Error fetching client details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}