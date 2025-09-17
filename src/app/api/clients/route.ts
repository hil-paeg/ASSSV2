// File: app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Client as PrismaClientType } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// Define the type for the Client with included relations
type ClientWithRelations = PrismaClientType & {
  tickets: {
    ticket_id: number;
    issue_title: string;
    priority: string | null;
    status: string;
    created_at: Date;
    updated_at: Date;
    closed_at: Date | null;
  }[];
  contracts: {
    client_id: string;
    allowed_tickets: number;
    total_tickets_used: number;
    ticket_typeRS1: number;
    ticket_typeRS1_used: number;
    ticket_typeRS2: number;
    ticket_typeRS2_used: number;
    ticket_typeRS3_1: number;
    ticket_typeRS3_1_used: number;
    ticket_typeRS3_2: number;
    ticket_typeRS3_2_used: number;
    site_visit_frequency: number;
  }[];
};

// Define the response type to match AdminDashboard's Client interface
interface ClientResponse {
  client_id: string;
  client_username: string;
  name: string;
  tickets: {
    ticket_id: number;
    issue_title: string;
    priority: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
  }[];
  contract: {
    client_id: string;
    allowed_tickets: number;
    total_tickets_used: number;
    ticket_typeRS1: number;
    ticket_typeRS1_used: number;
    ticket_typeRS2: number;
    ticket_typeRS2_used: number;
    ticket_typeRS3_1: number;
    ticket_typeRS3_1_used: number;
    ticket_typeRS3_2: number;
    ticket_typeRS3_2_used: number;
    site_visit_frequency: number;
  } | null;
  pendingTickets: number;
  monthlyActivity: { [key: string]: number };
  months: string[];
  isContractActive: boolean;
}

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

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const clients: ClientWithRelations[] = await prisma.client.findMany({
      include: {
        tickets: {
          select: {
            ticket_id: true,
            issue_title: true,
            priority: true,
            status: true,
            created_at: true,
            updated_at: true,
            closed_at: true,
          },
        },
        contracts: {
          select: {
            client_id: true,
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

    // Transform data to match AdminDashboard's Client interface
    const transformedClients: ClientResponse[] = clients.map((client) => ({
      client_id: client.client_id,
      client_username: client.client_username,
      name: client.name,
      tickets: client.tickets.map((ticket) => ({
        ticket_id: ticket.ticket_id,
        issue_title: ticket.issue_title,
        priority: ticket.priority,
        status: ticket.status,
        created_at: ticket.created_at.toISOString(),
        updated_at: ticket.updated_at.toISOString(),
        closed_at: ticket.closed_at ? ticket.closed_at.toISOString() : null,
      })),
      contract: client.contracts[0] || null,
      pendingTickets: client.tickets.filter((t) => t.status === 'open' || t.status === 'confirmed by oem').length,
      monthlyActivity: {
        Jan: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 0).length,
        Feb: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 1).length,
        Mar: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 2).length,
        Apr: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 3).length,
        May: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 4).length,
        Jun: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 5).length,
        Jul: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 6).length,
        Aug: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 7).length,
        Sep: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 8).length,
        Oct: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 9).length,
        Nov: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 10).length,
        Dec: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 11).length,
      },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      isContractActive: client.contracts[0] !== undefined,
    }));

    return NextResponse.json(transformedClients);
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token expired. Please log in again.' }, { status: 401 });
    }
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token. Please log in again.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}