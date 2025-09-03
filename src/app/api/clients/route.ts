// // File: app/api/clients/route.ts
// // This is the backend API route handler for creating clients and members.
// // Place this file in your Next.js project's app/api/clients directory.
// // This uses Next.js API routes with the app router.

// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { client, members } = body;

//     // Validate input
//     if (!client || !client.client_id || typeof client.client_id !== 'number') {
//       return NextResponse.json({ error: 'Invalid client data' }, { status: 400 });
//     }

//     // Create client
//     const createdClient = await prisma.client.create({
//       data: {
//         client_id: client.client_id,
//         client_username: client.client_username,
//         client_password: client.client_password, // Note: In production, hash passwords!
//         name: client.name,
//         start_date: new Date(client.start_date),
//         payment_cycle: client.payment_cycle || null,
//       },
//     });

//     // Create members if any
//     if (members && members.length > 0) {
//       await prisma.clientMember.createMany({
//         data: members.map((member: any) => ({
//           client_id: createdClient.client_id,
//           member_name: member.member_name,
//           designation: member.designation,
//           email: member.email,
//           phone_number: member.phone_number || null,
//           escalation_level: member.escalation_level,
//           member_username: member.member_username,
//           member_password: member.member_password, // Note: In production, hash passwords!
//         })),
//       });
//     }

//     return NextResponse.json({ success: true, client: createdClient }, { status: 201 });
//   } catch (error: any) {
//     console.error(error);
//     if (error.code === 'P2002') { // Unique constraint violation
//       return NextResponse.json({ error: 'Client ID or unique fields already exist.' }, { status: 409 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }


// // File: app/api/clients/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// export async function GET(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: 'client' | 'clientMember' | 'admin';
//     };

//     if (decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
//     }

//     const clients = await prisma.client.findMany({
//       include: {
//         tickets: {
//           select: { ticket_id: true, created_at: true },
//         },
//       },
//     });

//     return NextResponse.json(clients);
//   } catch (error: any) {
//     console.error('Error fetching clients:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { client, members } = body;

//     if (!client || !client.client_id || typeof client.client_id !== 'number') {
//       return NextResponse.json({ error: 'Invalid client data' }, { status: 400 });
//     }

//     const createdClient = await prisma.client.create({
//       data: {
//         client_id: client.client_id,
//         client_username: client.client_username,
//         client_password: client.client_password, // Note: Hash passwords in production
//         name: client.name,
//         start_date: new Date(client.start_date),
//         payment_cycle: client.payment_cycle || null,
//       },
//     });

//     if (members && members.length > 0) {
//       await prisma.clientMember.createMany({
//         data: members.map((member: any) => ({
//           client_id: createdClient.client_id,
//           member_name: member.member_name,
//           designation: member.designation,
//           email: member.email,
//           phone_number: member.phone_number || null,
//           escalation_level: member.escalation_level,
//           member_username: member.member_username,
//           member_password: member.member_password, // Note: Hash passwords in production
//         })),
//       });
//     }

//     return NextResponse.json({ success: true, client: createdClient }, { status: 201 });
//   } catch (error: any) {
//     console.error(error);
//     if (error.code === 'P2002') {
//       return NextResponse.json({ error: 'Client ID or unique fields already exist.' }, { status: 409 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // File: app/api/clients/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// export async function GET(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: 'client' | 'clientMember' | 'admin';
//     };

//     if (decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
//     }

//     const clients = await prisma.client.findMany({
//       include: {
//         tickets: {
//           select: { ticket_id: true, created_at: true },
//         },
//       },
//     });

//     return NextResponse.json(clients);
//   } catch (error: any) {
//     console.error('Error fetching clients:', error);
//     if (error.name === 'TokenExpiredError') {
//       return NextResponse.json({ error: 'Token expired. Please log in again.' }, { status: 401 });
//     }
//     if (error.name === 'JsonWebTokenError') {
//       return NextResponse.json({ error: 'Invalid token. Please log in again.' }, { status: 401 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }





// // File: app/api/clients/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient, Client as PrismaClientType } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// // Define the type for the Client with included relations
// type ClientWithRelations = PrismaClientType & {
//   tickets: {
//     ticket_id: number;
//     issue_title: string;
//     priority: string | null;
//     status: string;
//     created_at: Date;
//     closed_at: Date | null;
//   }[];
//   contracts: {
//     client_id: number;
//     allowed_tickets: number;
//     total_tickets_used: number;
//     ticket_typeRS1: number;
//     ticket_typeRS1_used: number;
//     ticket_typeRS2: number;
//     ticket_typeRS2_used: number;
//     ticket_typeRS3_1: number;
//     ticket_typeRS3_1_used: number;
//     ticket_typeRS3_2: number;
//     ticket_typeRS3_2_used: number;
//     site_visit_frequency: number;
//   }[];
// };

// // Define the response type to match AdminDashboard's Client interface
// interface ClientResponse {
//   client_id: number;
//   client_username: string;
//   name: string;
//   tickets: {
//     ticket_id: number;
//     issue_title: string;
//     priority: string | null;
//     status: string;
//     created_at: string;
//     closed_at: string | null;
//   }[];
//   contract: {
//     client_id: number;
//     allowed_tickets: number;
//     total_tickets_used: number;
//     ticket_typeRS1: number;
//     ticket_typeRS1_used: number;
//     ticket_typeRS2: number;
//     ticket_typeRS2_used: number;
//     ticket_typeRS3_1: number;
//     ticket_typeRS3_1_used: number;
//     ticket_typeRS3_2: number;
//     ticket_typeRS3_2_used: number;
//     site_visit_frequency: number;
//   } | null;
//   pendingTickets: number;
//   monthlyActivity: { [key: string]: number };
//   months: string[];
//   isContractActive: boolean;
// }

// export async function GET(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: 'client' | 'clientMember' | 'admin';
//       clientId?: number;
//     };

//     if (decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
//     }

//     const clients: ClientWithRelations[] = await prisma.client.findMany({
//       include: {
//         tickets: {
//           select: {
//             ticket_id: true,
//             issue_title: true,
//             priority: true,
//             status: true,
//             created_at: true,
//             closed_at: true,
//           },
//         },
//         contracts: {
//           select: {
//             client_id: true,
//             allowed_tickets: true,
//             total_tickets_used: true,
//             ticket_typeRS1: true,
//             ticket_typeRS1_used: true,
//             ticket_typeRS2: true,
//             ticket_typeRS2_used: true,
//             ticket_typeRS3_1: true,
//             ticket_typeRS3_1_used: true,
//             ticket_typeRS3_2: true,
//             ticket_typeRS3_2_used: true,
//             site_visit_frequency: true,
//           },
//         },
//       },
//     });

//     // Transform data to match AdminDashboard's Client interface
//     const transformedClients: ClientResponse[] = clients.map((client) => ({
//       client_id: client.client_id,
//       client_username: client.client_username,
//       name: client.name,
//       tickets: client.tickets.map((ticket) => ({
//         ticket_id: ticket.ticket_id,
//         issue_title: ticket.issue_title,
//         priority: ticket.priority,
//         status: ticket.status,
//         created_at: ticket.created_at.toISOString(),
//         closed_at: ticket.closed_at ? ticket.closed_at.toISOString() : null,
//       })),
//       contract: client.contracts[0] || null,
//       pendingTickets: client.tickets.filter((t) => t.status === 'open' || t.status === 'confirmed by oem').length,
//       monthlyActivity: {
//         Jan: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 0).length,
//         Feb: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 1).length,
//         Mar: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 2).length,
//         Apr: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 3).length,
//         May: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 4).length,
//         Jun: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 5).length,
//         Jul: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 6).length,
//         Aug: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 7).length,
//         Sep: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 8).length,
//         Oct: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 9).length,
//         Nov: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 10).length,
//         Dec: client.tickets.filter((t) => new Date(t.created_at).getMonth() === 11).length,
//       },
//       months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//       isContractActive: client.contracts[0] !== undefined, // No end_date, so check if contract exists
//     }));

//     return NextResponse.json(transformedClients);
//   } catch (error: any) {
//     console.error('Error fetching clients:', error);
//     if (error.name === 'TokenExpiredError') {
//       return NextResponse.json({ error: 'Token expired. Please log in again.' }, { status: 401 });
//     }
//     if (error.name === 'JsonWebTokenError') {
//       return NextResponse.json({ error: 'Invalid token. Please log in again.' }, { status: 401 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }




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
    client_id: number;
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
  client_id: number;
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
    client_id: number;
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

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

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
          where: {
            OR: [
              { created_at: { gte: oneWeekAgo } },
              { updated_at: { gte: oneWeekAgo } },
              { closed_at: { gte: oneWeekAgo } },
            ],
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