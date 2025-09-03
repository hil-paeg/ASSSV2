// // File: app/api/tickets/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// export async function POST(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//     if (decoded.role === 'admin') {
//       return NextResponse.json({ error: 'Admins cannot create tickets' }, { status: 403 });
//     }

//     let client_id: number;
//     let creator_name_from_auth: string;  // Fallback if creator_name not provided

//     if (decoded.role === 'client') {
//       client_id = decoded.id;
//       const client = await prisma.client.findUnique({ where: { client_id }, select: { client_username: true } });
//       if (!client) {
//         return NextResponse.json({ error: 'Client not found' }, { status: 404 });
//       }
//       creator_name_from_auth = client.client_username;
//     } else if (decoded.role === 'clientMember') {
//       client_id = decoded.clientId!;
//       const member = await prisma.clientMember.findUnique({ where: { member_id: decoded.id }, select: { member_name: true } });
//       if (!member) {
//         return NextResponse.json({ error: 'Member not found' }, { status: 404 });
//       }
//       creator_name_from_auth = member.member_name;
//     } else {
//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     const body = await req.json();
//     const {
//       issue_title,
//       priority,
//       description,
//       location,
//       actions_performed,
//       attachments,
//       comments,  // JSON string of timeline events
//       creator_name = creator_name_from_auth,  // Use provided or fallback from auth
//     } = body;

//     if (!issue_title || !description) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const newTicket = await prisma.ticket.create({
//       data: {
//         client_id,
//         issue_title,
//         priority: priority || null,
//         description: description || null,
//         location: location || null,
//         actions_performed: actions_performed || null,
//         attachments: attachments || null,
//         creator_name,
//         status: 'raised',
//         comments: comments || null,
//         out_of_scope: false,
//       },
//     });

//     return NextResponse.json(newTicket, { status: 201 });
//   } catch (error: any) {
//     console.error(error);
//     if (error.name === 'TokenExpiredError') {
//       return NextResponse.json({ error: 'Token expired' }, { status: 401 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }





// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';
// import { promises as fs } from 'fs';
// import path from 'path';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';
// const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// // Ensure upload directory exists
// async function ensureUploadDir() {
//   try {
//     await fs.mkdir(UPLOAD_DIR, { recursive: true });
//   } catch (error) {
//     console.error('Error creating upload directory:', error);
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//     let where = {};
//     if (decoded.role === 'client') {
//       where = { client_id: decoded.id };
//     } else if (decoded.role === 'clientMember') {
//       if (!decoded.clientId) {
//         return NextResponse.json({ error: 'Client ID missing for clientMember role' }, { status: 400 });
//       }
//       where = { client_id: decoded.clientId };
//     } else if (decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     const tickets = await prisma.ticket.findMany({
//       where,
//       include: { client: { select: { client_username: true } } },
//     });

//     console.log(`Fetched tickets for user (role: ${decoded.role}, id: ${decoded.id}, clientId: ${decoded.clientId}):`, tickets);

//     return NextResponse.json(tickets, { status: 200 });
//   } catch (error: any) {
//     console.error('Error fetching tickets:', error);
//     if (error.name === 'TokenExpiredError') {
//       return NextResponse.json({ error: 'Token expired' }, { status: 401 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function POST(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const action = searchParams.get('action');

//   if (action === 'close') {
//     try {
//       const authHeader = req.headers.get('Authorization');
//       if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//       }

//       const token = authHeader.split(' ')[1];
//       const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//       if (decoded.role !== 'admin') {
//         return NextResponse.json({ error: 'Only admins can close tickets' }, { status: 403 });
//       }

//       const id = searchParams.get('id');
//       if (!id) {
//         return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
//       }

//       const ticket = await prisma.ticket.findUnique({
//         where: { ticket_id: parseInt(id) },
//       });

//       if (!ticket) {
//         return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
//       }

//       if (!ticket.clientClosed) {
//         return NextResponse.json({ error: 'Client must close ticket first' }, { status: 400 });
//       }

//       const formData = await req.formData();
//       const summary = formData.get('summary') as string;
//       const out_of_scope = formData.get('out_of_scope') === 'true';
//       const out_of_scope_reason = formData.get('out_of_scope_reason') as string;
//       const attachment = formData.get('attachment') as File;

//       let attachmentPath: string | null = null;
//       if (attachment) {
//         await ensureUploadDir();
//         const fileName = `${Date.now()}-${attachment.name}`;
//         attachmentPath = `/uploads/${fileName}`;
//         const filePath = path.join(UPLOAD_DIR, fileName);
//         const buffer = Buffer.from(await attachment.arrayBuffer());
//         await fs.writeFile(filePath, buffer);
//       }

//       const updatedTicket = await prisma.ticket.update({
//         where: { ticket_id: parseInt(id) },
//         data: {
//           summary,
//           out_of_scope,
//           out_of_scope_reason: out_of_scope ? out_of_scope_reason : null,
//           attachments: attachmentPath ? [...(ticket.attachments?.split(',') || []), attachmentPath].join(',') : undefined,
//           status: ticket.clientClosed ? 'closed' : ticket.status,
//           closed_at: new Date(),
//           updated_at: new Date(),
//           adminClosed: true,
//         },
//       });

//       return NextResponse.json(updatedTicket, { status: 200 });
//     } catch (error: any) {
//       console.error('Error closing ticket:', error);
//       if (error.name === 'TokenExpiredError') {
//         return NextResponse.json({ error: 'Token expired' }, { status: 401 });
//       }
//       return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//     } finally {
//       await prisma.$disconnect();
//     }
//   } else if (action === 'feedback') {
//     try {
//       const authHeader = req.headers.get('Authorization');
//       if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//       }

//       const token = authHeader.split(' ')[1];
//       const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//       if (decoded.role === 'admin') {
//         return NextResponse.json({ error: 'Admins cannot submit feedback' }, { status: 403 });
//       }

//       const id = searchParams.get('id');
//       if (!id) {
//         return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
//       }

//       const ticket = await prisma.ticket.findUnique({
//         where: { ticket_id: parseInt(id) },
//       });

//       if (!ticket) {
//         return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
//       }

//       if (ticket.status !== 'resolved') {
//         return NextResponse.json({ error: 'Ticket must be resolved before submitting feedback' }, { status: 400 });
//       }

//       const body = await req.json();
//       const { feedback } = body;

//       if (!feedback || !feedback.experience || !feedback.rating) {
//         return NextResponse.json({ error: 'Invalid feedback data' }, { status: 400 });
//       }

//       const updatedTicket = await prisma.ticket.update({
//         where: { ticket_id: parseInt(id) },
//         data: {
//           feedback: JSON.stringify(feedback),
//           clientClosed: true,
//           status: ticket.adminClosed ? 'closed' : ticket.status,
//           updated_at: new Date(),
//         },
//       });

//       return NextResponse.json(updatedTicket, { status: 200 });
//     } catch (error: any) {
//       console.error('Error submitting feedback:', error);
//       if (error.name === 'TokenExpiredError') {
//         return NextResponse.json({ error: 'Token expired' }, { status: 401 });
//       }
//       return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//     } finally {
//       await prisma.$disconnect();
//     }
//   } else {
//     try {
//       const authHeader = req.headers.get('Authorization');
//       if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//       }

//       const token = authHeader.split(' ')[1];
//       const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//       if (decoded.role === 'admin') {
//         return NextResponse.json({ error: 'Admins cannot create tickets' }, { status: 403 });
//       }

//       let client_id: number;
//       let creator_name_from_auth: string;

//       if (decoded.role === 'client') {
//         client_id = decoded.id;
//         const client = await prisma.client.findUnique({ where: { client_id }, select: { client_username: true } });
//         if (!client) {
//           return NextResponse.json({ error: 'Client not found' }, { status: 404 });
//         }
//         creator_name_from_auth = client.client_username;
//       } else if (decoded.role === 'clientMember') {
//         if (!decoded.clientId) {
//           return NextResponse.json({ error: 'Client ID missing for clientMember role' }, { status: 400 });
//         }
//         client_id = decoded.clientId;
//         const member = await prisma.clientMember.findUnique({ where: { member_id: decoded.id }, select: { member_name: true } });
//         if (!member) {
//           return NextResponse.json({ error: 'Member not found' }, { status: 404 });
//         }
//         creator_name_from_auth = member.member_name;
//       } else {
//         return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//       }

//       const body = await req.json();
//       const {
//         issue_title,
//         priority,
//         description,
//         location,
//         actions_performed,
//         attachments,
//         comments,
//         creator_name = creator_name_from_auth,
//       } = body;

//       if (!issue_title || !description) {
//         return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//       }

//       const newTicket = await prisma.ticket.create({
//         data: {
//           client_id,
//           issue_title,
//           priority: priority || null,
//           description: description || null,
//           location: location || null,
//           actions_performed: actions_performed || null,
//           attachments: attachments || null,
//           creator_name,
//           status: 'open',
//           comments: comments || null,
//           out_of_scope: false,
//         },
//       });

//       return NextResponse.json(newTicket, { status: 201 });
//     } catch (error: any) {
//       console.error('Error creating ticket:', error);
//       if (error.name === 'TokenExpiredError') {
//         return NextResponse.json({ error: 'Token expired' }, { status: 401 });
//       }
//       return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//     } finally {
//       await prisma.$disconnect();
//     }
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//     if (decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Only admins can update tickets' }, { status: 403 });
//     }

//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');
//     if (!id) {
//       return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
//     }

//     const body = await req.json();
//     const { status, comments, ticket_type } = body;

//     if (!status || !['open', 'in-progress', 'resolved'].includes(status)) {
//       return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
//     }

//     const ticket = await prisma.ticket.update({
//       where: { ticket_id: parseInt(id) },
//       data: {
//         status,
//         comments: comments || null,
//         ticket_type: ticket_type || null,
//         updated_at: new Date(),
//       },
//     });

//     return NextResponse.json(ticket, { status: 200 });
//   } catch (error: any) {
//     console.error('Error updating ticket:', error);
//     if (error.name === 'TokenExpiredError') {
//       return NextResponse.json({ error: 'Token expired' }, { status: 401 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }



// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';
// import path from 'path';
// import { writeFile } from 'fs/promises';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// export async function GET(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number | string; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//     console.log(`Decoded token:`, decoded);

//     let tickets;
//     if (decoded.role === 'admin') {
//       tickets = await prisma.ticket.findMany({
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true, // Include close_ticket relation
//         },
//       });
//     } else if (decoded.role === 'client') {
//       tickets = await prisma.ticket.findMany({
//         where: { client_id: Number(decoded.id) },
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true, // Include close_ticket relation
//         },
//       });
//     } else if (decoded.role === 'clientMember') {
//       tickets = await prisma.ticket.findMany({
//         where: { client_id: Number(decoded.clientId) },
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true, // Include close_ticket relation
//         },
//       });
//     } else {
//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     console.log(`Fetched tickets for user (role: ${decoded.role}, id: ${decoded.id}, clientId: ${decoded.clientId}):`, tickets);

//     return NextResponse.json(tickets);
//   } catch (error: any) {
//     console.error('Error fetching tickets:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number | string; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//     const action = req.nextUrl.searchParams.get('action');
//     const ticketId = parseInt(req.nextUrl.searchParams.get('id') || '0');

//     if (action === 'close' && ticketId) {
//       const ticket = await prisma.ticket.findUnique({
//         where: { ticket_id: ticketId },
//       });

//       if (!ticket) {
//         return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
//       }

//       if (decoded.role === 'admin') {
//         const formData = await req.formData();
//         const summary = formData.get('summary') as string;
//         const out_of_scope = formData.get('out_of_scope') === 'true';
//         const out_of_scope_reason = formData.get('out_of_scope_reason') as string | null;
//         const attachment = formData.get('attachment') as File | null;

//         let attachmentPath: string | null = null;
//         if (attachment) {
//           const uploadDir = path.join(process.cwd(), 'public', 'uploads');
//           const fileName = `${Date.now()}-${attachment.name}`;
//           const filePath = path.join(uploadDir, fileName);
//           const buffer = Buffer.from(await attachment.arrayBuffer());
//           await writeFile(filePath, buffer);
//           attachmentPath = `/Uploads/${fileName}`;
//         }

//         const updatedTicket = await prisma.ticket.update({
//           where: { ticket_id: ticketId },
//           data: {
//             adminClosed: true,
//             summary,
//             out_of_scope,
//             out_of_scope_reason: out_of_scope ? out_of_scope_reason : null,
//             attachments: attachmentPath
//               ? ticket.attachments
//                 ? `${ticket.attachments},${attachmentPath}`
//                 : attachmentPath
//               : ticket.attachments,
//             status: ticket.clientClosed ? 'closed' : ticket.status,
//             updated_at: new Date(),
//             closed_at: ticket.clientClosed ? new Date() : ticket.closed_at,
//           },
//         });

//         await prisma.closeTicket.upsert({
//           where: { ticket_id: ticketId },
//           update: {
//             summary,
//             attachment: attachmentPath,
//             out_of_scope,
//             created_at: new Date(),
//           },
//           create: {
//             ticket_id: ticketId,
//             summary,
//             attachment: attachmentPath,
//             out_of_scope,
//             created_at: new Date(),
//           },
//         });

//         return NextResponse.json(updatedTicket);
//       } else if (decoded.role === 'client' || decoded.role === 'clientMember') {
//         if (!ticket.clientClosed && ticket.status === 'resolved') {
//           const { experience, rating, time_saved } = await req.json();

//           const updatedTicket = await prisma.ticket.update({
//             where: { ticket_id: ticketId },
//             data: {
//               clientClosed: true,
//               status: ticket.adminClosed ? 'closed' : ticket.status,
//               updated_at: new Date(),
//               closed_at: ticket.adminClosed ? new Date() : ticket.closed_at,
//             },
//           });

//           await prisma.closeTicket.upsert({
//             where: { ticket_id: ticketId },
//             update: {
//               experience,
//               rating,
//               time_saved: time_saved ? Number(time_saved) : null,
//               created_at: new Date(),
//             },
//             create: {
//               ticket_id: ticketId,
//               experience,
//               rating,
//               time_saved: time_saved ? Number(time_saved) : null,
//               created_at: new Date(),
//             },
//           });

//           return NextResponse.json(updatedTicket);
//         } else {
//           return NextResponse.json({ error: 'Ticket must be resolved and not yet client-closed' }, { status: 400 });
//         }
//       } else {
//         return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//       }
//     }

//     return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
//   } catch (error: any) {
//     console.error('Error processing request:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number | string; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//     if (decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Only admins can update ticket status' }, { status: 403 });
//     }

//     const ticketId = parseInt(req.nextUrl.searchParams.get('id') || '0');
//     const { status, comments, ticket_type } = await req.json();

//     if (!ticketId || !status) {
//       return NextResponse.json({ error: 'Missing ticket ID or status' }, { status: 400 });
//     }

//     const ticket = await prisma.ticket.update({
//       where: { ticket_id: ticketId },
//       data: {
//         status,
//         comments,
//         ticket_type,
//         updated_at: new Date(),
//       },
//     });

//     return NextResponse.json(ticket);
//   } catch (error: any) {
//     console.error('Error updating ticket:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }






// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';
// import path from 'path';
// import { writeFile } from 'fs/promises';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// export async function GET(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number | string; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//     console.log(`Decoded token:`, decoded);

//     let tickets;
//     if (decoded.role === 'admin') {
//       tickets = await prisma.ticket.findMany({
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true, // Include close_ticket relation
//         },
//       });
//     } else if (decoded.role === 'client') {
//       tickets = await prisma.ticket.findMany({
//         where: { client_id: Number(decoded.id) },
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true, // Include close_ticket relation
//         },
//       });
//     } else if (decoded.role === 'clientMember') {
//       tickets = await prisma.ticket.findMany({
//         where: { client_id: Number(decoded.clientId) },
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true, // Include close_ticket relation
//         },
//       });
//     } else {
//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     console.log(`Fetched tickets for user (role: ${decoded.role}, id: ${decoded.id}, clientId: ${decoded.clientId}):`, tickets);

//     return NextResponse.json(tickets);
//   } catch (error: any) {
//     console.error('Error fetching tickets:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number | string; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//     const action = req.nextUrl.searchParams.get('action');
//     const ticketId = parseInt(req.nextUrl.searchParams.get('id') || '0');

//     if (action === 'close' && ticketId) {
//       const ticket = await prisma.ticket.findUnique({
//         where: { ticket_id: ticketId },
//       });

//       if (!ticket) {
//         return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
//       }

//       if (decoded.role === 'admin') {
//         const formData = await req.formData();
//         const summary = formData.get('summary') as string;
//         const out_of_scope = formData.get('out_of_scope') === 'true';
//         const out_of_scope_reason = formData.get('out_of_scope_reason') as string | null;
//         const attachment = formData.get('attachment') as File | null;

//         let attachmentPath: string | null = null;
//         if (attachment) {
//           const uploadDir = path.join(process.cwd(), 'public', 'uploads');
//           const fileName = `${Date.now()}-${attachment.name}`;
//           const filePath = path.join(uploadDir, fileName);
//           const buffer = Buffer.from(await attachment.arrayBuffer());
//           await writeFile(filePath, buffer);
//           attachmentPath = `/Uploads/${fileName}`;
//         }

//         const updatedTicket = await prisma.ticket.update({
//           where: { ticket_id: ticketId },
//           data: {
//             adminClosed: true,
//             summary,
//             out_of_scope,
//             out_of_scope_reason: out_of_scope ? out_of_scope_reason : null,
//             attachments: attachmentPath
//               ? ticket.attachments
//                 ? `${ticket.attachments},${attachmentPath}`
//                 : attachmentPath
//               : ticket.attachments,
//             status: ticket.clientClosed ? 'closed' : ticket.status,
//             updated_at: new Date(),
//             closed_at: ticket.clientClosed ? new Date() : ticket.closed_at,
//           },
//         });

//         await prisma.closeTicket.upsert({
//           where: { ticket_id: ticketId },
//           update: {
//             summary,
//             attachment: attachmentPath,
//             out_of_scope,
//             created_at: new Date(),
//           },
//           create: {
//             ticket_id: ticketId,
//             summary,
//             attachment: attachmentPath,
//             out_of_scope,
//             created_at: new Date(),
//           },
//         });

//         return NextResponse.json(updatedTicket);
//       } else if (decoded.role === 'client' || decoded.role === 'clientMember') {
//         if (!ticket.clientClosed && ticket.status === 'resolved') {
//           const { experience, rating, time_saved } = await req.json();

//           const updatedTicket = await prisma.ticket.update({
//             where: { ticket_id: ticketId },
//             data: {
//               clientClosed: true,
//               status: ticket.adminClosed ? 'closed' : ticket.status,
//               updated_at: new Date(),
//               closed_at: ticket.adminClosed ? new Date() : ticket.closed_at,
//             },
//           });

//           await prisma.closeTicket.upsert({
//             where: { ticket_id: ticketId },
//             update: {
//               experience,
//               rating,
//               time_saved: time_saved ? Number(time_saved) : null,
//               created_at: new Date(),
//             },
//             create: {
//               ticket_id: ticketId,
//               experience,
//               rating,
//               time_saved: time_saved ? Number(time_saved) : null,
//               created_at: new Date(),
//             },
//           });

//           return NextResponse.json(updatedTicket);
//         } else {
//           return NextResponse.json({ error: 'Ticket must be resolved and not yet client-closed' }, { status: 400 });
//         }
//       } else {
//         return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//       }
//     }

//     return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
//   } catch (error: any) {
//     console.error('Error processing request:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number | string; role: 'client' | 'clientMember' | 'admin'; clientId?: number };

//     if (decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Only admins can update ticket status' }, { status: 403 });
//     }

//     const ticketId = parseInt(req.nextUrl.searchParams.get('id') || '0');
//     const { status, comments, ticket_type } = await req.json();

//     if (!ticketId || !status) {
//       return NextResponse.json({ error: 'Missing ticket ID or status' }, { status: 400 });
//     }

//     const ticket = await prisma.ticket.update({
//       where: { ticket_id: ticketId },
//       data: {
//         status,
//         comments,
//         ticket_type,
//         updated_at: new Date(),
//       },
//     });

//     return NextResponse.json(ticket);
//   } catch (error: any) {
//     console.error('Error updating ticket:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }









// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';
// import path from 'path';
// import { writeFile } from 'fs/promises';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// export async function GET(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: 'client' | 'clientMember' | 'admin';
//       clientId?: number;
//     };

//     let tickets;
//     if (decoded.role === 'admin') {
//       tickets = await prisma.ticket.findMany({
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true,
//         },
//       });
//     } else if (decoded.role === 'client') {
//       tickets = await prisma.ticket.findMany({
//         where: { client_id: Number(decoded.id) },
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true,
//         },
//       });
//     } else if (decoded.role === 'clientMember') {
//       tickets = await prisma.ticket.findMany({
//         where: { client_id: Number(decoded.clientId) },
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true,
//         },
//       });
//     } else {
//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     return NextResponse.json(tickets);
//   } catch (error: any) {
//     console.error('Error fetching tickets:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: 'client' | 'clientMember' | 'admin';
//       clientId?: number;
//     };

//     const action = req.nextUrl.searchParams.get('action');
//     const ticketId = parseInt(req.nextUrl.searchParams.get('id') || '0');

//     // ✅ CREATE TICKET
//     if (!action) {
//       const body = await req.json();
//       const {
//         issue_title,
//         priority,
//         description,
//         location,
//         actions_performed,
//         creator_name,
//         attachments,
//         comments,
//         ticket_type,
//       } = body;

//       const client_id =
//         decoded.role === 'client'
//           ? Number(decoded.id)
//           : decoded.role === 'clientMember'
//           ? Number(decoded.clientId)
//           : null;

//       if (!client_id) {
//         return NextResponse.json(
//           { error: 'Client information missing' },
//           { status: 400 }
//         );
//       }

//       const newTicket = await prisma.ticket.create({
//         data: {
//           client_id,
//           issue_title,
//           priority,
//           description,
//           location,
//           actions_performed,
//           creator_name,
//           attachments,
//           comments,
//           ticket_type,
//         },
//       });

//       return NextResponse.json(newTicket, { status: 201 });
//     }

//     // ✅ CLOSE TICKET
//     if (action === 'close' && ticketId) {
//       const ticket = await prisma.ticket.findUnique({
//         where: { ticket_id: ticketId },
//       });

//       if (!ticket) {
//         return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
//       }

//       // --- Admin closes the ticket ---
//       if (decoded.role === 'admin') {
//         const formData = await req.formData();
//         const summary = formData.get('summary') as string;
//         const out_of_scope = formData.get('out_of_scope') === 'true';
//         const out_of_scope_reason = formData.get('out_of_scope_reason') as
//           | string
//           | null;
//         const attachment = formData.get('attachment') as File | null;

//         let attachmentPath: string | null = null;
//         if (attachment) {
//           const uploadDir = path.join(process.cwd(), 'public', 'uploads');
//           const fileName = `${Date.now()}-${attachment.name}`;
//           const filePath = path.join(uploadDir, fileName);
//           const buffer = Buffer.from(await attachment.arrayBuffer());
//           await writeFile(filePath, buffer);
//           attachmentPath = `/uploads/${fileName}`;
//         }

//         const updatedTicket = await prisma.ticket.update({
//           where: { ticket_id: ticketId },
//           data: {
//             adminClosed: true,
//             summary,
//             out_of_scope,
//             out_of_scope_reason: out_of_scope ? out_of_scope_reason : null,
//             attachments: attachmentPath
//               ? ticket.attachments
//                 ? `${ticket.attachments},${attachmentPath}`
//                 : attachmentPath
//               : ticket.attachments,
//             status: ticket.clientClosed ? 'closed' : ticket.status,
//             updated_at: new Date(),
//             closed_at: ticket.clientClosed ? new Date() : ticket.closed_at,
//           },
//         });

//         await prisma.closeTicket.upsert({
//           where: { ticket_id: ticketId },
//           update: {
//             summary,
//             attachment: attachmentPath,
//             out_of_scope,
//             created_at: new Date(),
//           },
//           create: {
//             ticket_id: ticketId,
//             summary,
//             attachment: attachmentPath,
//             out_of_scope,
//             created_at: new Date(),
//           },
//         });

//         return NextResponse.json(updatedTicket);
//       }

//       // --- Client / ClientMember closes after resolved ---
//       if (decoded.role === 'client' || decoded.role === 'clientMember') {
//         if (!ticket.clientClosed && ticket.status === 'resolved') {
//           const { experience, rating, time_saved } = await req.json();

//           const updatedTicket = await prisma.ticket.update({
//             where: { ticket_id: ticketId },
//             data: {
//               clientClosed: true,
//               status: ticket.adminClosed ? 'closed' : ticket.status,
//               updated_at: new Date(),
//               closed_at: ticket.adminClosed ? new Date() : ticket.closed_at,
//             },
//           });

//           await prisma.closeTicket.upsert({
//             where: { ticket_id: ticketId },
//             update: {
//               experience,
//               rating,
//               time_saved: time_saved ? Number(time_saved) : null,
//               created_at: new Date(),
//             },
//             create: {
//               ticket_id: ticketId,
//               experience,
//               rating,
//               time_saved: time_saved ? Number(time_saved) : null,
//               created_at: new Date(),
//             },
//           });

//           return NextResponse.json(updatedTicket);
//         } else {
//           return NextResponse.json(
//             { error: 'Ticket must be resolved and not yet client-closed' },
//             { status: 400 }
//           );
//         }
//       }

//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
//   } catch (error: any) {
//     console.error('Error processing request:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: 'client' | 'clientMember' | 'admin';
//       clientId?: number;
//     };

//     if (decoded.role !== 'admin') {
//       return NextResponse.json(
//         { error: 'Only admins can update ticket status' },
//         { status: 403 }
//       );
//     }

//     const ticketId = parseInt(req.nextUrl.searchParams.get('id') || '0');
//     const { status, comments, ticket_type } = await req.json();

//     if (!ticketId || !status) {
//       return NextResponse.json(
//         { error: 'Missing ticket ID or status' },
//         { status: 400 }
//       );
//     }

//     const ticket = await prisma.ticket.update({
//       where: { ticket_id: ticketId },
//       data: {
//         status,
//         comments,
//         ticket_type,
//         updated_at: new Date(),
//       },
//     });

//     return NextResponse.json(ticket);
//   } catch (error: any) {
//     console.error('Error updating ticket:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }





// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';
// import path from 'path';
// import { writeFile } from 'fs/promises';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// export async function GET(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     let decoded;
//     try {
//       decoded = jwt.verify(token, JWT_SECRET) as {
//         id: number | string;
//         role: 'client' | 'clientMember' | 'admin';
//         clientId?: number;
//       };
//       console.log('Decoded JWT:', decoded);
//     } catch (jwtError) {
//       console.error('JWT verification error:', jwtError);
//       return NextResponse.json({ error: 'Unauthorized: Invalid JWT' }, { status: 401 });
//     }

//     let tickets;
//     if (decoded.role === 'admin') {
//       console.log('Fetching tickets for admin');
//       tickets = await prisma.ticket.findMany({
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true,
//         },
//       });
//     } else if (decoded.role === 'client') {
//       console.log('Fetching tickets for client, client_id:', Number(decoded.id));
//       tickets = await prisma.ticket.findMany({
//         where: { client_id: Number(decoded.id) },
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true,
//         },
//       });
//     } else if (decoded.role === 'clientMember') {
//       console.log('Fetching tickets for clientMember, client_id:', Number(decoded.clientId));
//       if (!decoded.clientId) {
//         return NextResponse.json({ error: 'Invalid clientId for clientMember' }, { status: 400 });
//       }
//       tickets = await prisma.ticket.findMany({
//         where: { client_id: Number(decoded.clientId) },
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true,
//         },
//       });
//     } else {
//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     console.log('Fetched tickets:', tickets);
//     return NextResponse.json(tickets);
//   } catch (error: any) {
//     console.error('Error fetching tickets:', error.message, error.stack);
//     return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }


// export async function POST(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: 'client' | 'clientMember' | 'admin';
//       clientId?: number;
//     };

//     const action = req.nextUrl.searchParams.get('action');
//     const ticketId = parseInt(req.nextUrl.searchParams.get('id') || '0');

//     if (action === 'create') {
//       const {
//         issue_title,
//         priority,
//         description,
//         location,
//         actions_performed,
//         creator_name,
//         attachments,
//         comments,
//         ticket_type,
//       } = await req.json();

//       const clientId =
//         decoded.role === 'client'
//           ? Number(decoded.id)
//           : decoded.role === 'clientMember'
//           ? Number(decoded.clientId)
//           : null;

//       if (!clientId) {
//         return NextResponse.json({ error: 'Client ID missing' }, { status: 400 });
//       }

//       const newTicket = await prisma.ticket.create({
//         data: {
//           client_id: clientId,
//           issue_title,
//           priority,
//           description,
//           location,
//           actions_performed,
//           creator_name,
//           attachments,
//           comments,
//           ticket_type,
//           status: 'raised',
//           created_at: new Date(),
//           updated_at: new Date(),
//         },
//       });

//       return NextResponse.json(newTicket, { status: 201 });
//     }

//     // ---------------- CLOSE ----------------
//     if (action === 'close' && ticketId) {
//       const ticket = await prisma.ticket.findUnique({ where: { ticket_id: ticketId } });
//       if (!ticket) {
//         return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
//       }

//       // --- ADMIN CLOSE ---
//       if (decoded.role === 'admin') {
//         const formData = await req.formData();
//         const summary = formData.get('summary') as string;
//         const out_of_scope = formData.get('out_of_scope') === 'true';
//         const out_of_scope_reason = formData.get('out_of_scope_reason') as string | null;
//         const attachment = formData.get('attachment') as File | null;

//         let attachmentPath: string | null = null;
//         if (attachment) {
//           const uploadDir = path.join(process.cwd(), 'public', 'uploads');
//           const fileName = `${Date.now()}-${attachment.name}`;
//           const filePath = path.join(uploadDir, fileName);
//           const buffer = Buffer.from(await attachment.arrayBuffer());
//           await writeFile(filePath, buffer);
//           attachmentPath = `/Uploads/${fileName}`;
//         }

//         const updatedTicket = await prisma.ticket.update({
//           where: { ticket_id: ticketId },
//           data: {
//             adminClosed: true,
//             summary,
//             out_of_scope,
//             out_of_scope_reason: out_of_scope ? out_of_scope_reason : null,
//             attachments: attachmentPath
//               ? ticket.attachments
//                 ? `${ticket.attachments},${attachmentPath}`
//                 : attachmentPath
//               : ticket.attachments,
//             status: ticket.clientClosed ? 'closed' : ticket.status,
//             updated_at: new Date(),
//             closed_at: ticket.clientClosed ? new Date() : ticket.closed_at,
//           },
//         });

//         await prisma.closeTicket.upsert({
//           where: { ticket_id: ticketId },
//           update: {
//             summary,
//             attachment: attachmentPath,
//             out_of_scope,
//             created_at: new Date(),
//           },
//           create: {
//             ticket_id: ticketId,
//             summary,
//             attachment: attachmentPath,
//             out_of_scope,
//             created_at: new Date(),
//           },
//         });

//         // --- Update ContractualTicket counters ---
//         if (ticket.ticket_type) {
//           await prisma.contractualTicket.updateMany({
//             where: { client_id: ticket.client_id },
//             data: {
//               total_tickets_used: { increment: 1 },
//               ticket_typeRS1_used: ticket.ticket_type === 'RS1' ? { increment: 1 } : undefined,
//               ticket_typeRS2_used: ticket.ticket_type === 'RS2' ? { increment: 1 } : undefined,
//               ticket_typeRS3_1_used: ticket.ticket_type === 'RS3_1' ? { increment: 1 } : undefined,
//               ticket_typeRS3_2_used: ticket.ticket_type === 'RS3_2' ? { increment: 1 } : undefined,
//             },
//           });
//         }

//         return NextResponse.json(updatedTicket);
//       }

//       // --- CLIENT CLOSE ---
//       if (decoded.role === 'client' || decoded.role === 'clientMember') {
//         if (!ticket.clientClosed && ticket.status === 'resolved') {
//           const { experience, rating, time_saved } = await req.json();

//           const updatedTicket = await prisma.ticket.update({
//             where: { ticket_id: ticketId },
//             data: {
//               clientClosed: true,
//               status: ticket.adminClosed ? 'closed' : ticket.status,
//               updated_at: new Date(),
//               closed_at: ticket.adminClosed ? new Date() : ticket.closed_at,
//             },
//           });

//           await prisma.closeTicket.upsert({
//             where: { ticket_id: ticketId },
//             update: {
//               experience,
//               rating,
//               time_saved: time_saved ? Number(time_saved) : null,
//               created_at: new Date(),
//             },
//             create: {
//               ticket_id: ticketId,
//               experience,
//               rating,
//               time_saved: time_saved ? Number(time_saved) : null,
//               created_at: new Date(),
//             },
//           });

//           return NextResponse.json(updatedTicket);
//         }
//         return NextResponse.json(
//           { error: 'Ticket must be resolved and not yet client-closed' },
//           { status: 400 }
//         );
//       }

//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
//   } catch (error: any) {
//     console.error('Error processing request:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }


// export async function PUT(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader?.startsWith("Bearer ")) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: "client" | "clientMember" | "admin";
//       clientId?: number;
//     };

//     // Parse request body
//     const { searchParams } = new URL(req.url);
//     const ticketId = parseInt(searchParams.get("id") || "0", 10);

//     if (!ticketId) {
//       return NextResponse.json({ error: "Ticket ID required" }, { status: 400 });
//     }

//     const { status, comments, ticket_type } = await req.json();

//     // Validate allowed status flow
//     const ticket = await prisma.ticket.findUnique({ where: { ticket_id: ticketId } });
//     if (!ticket) {
//       return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
//     }

//     // Enforce status transitions
//     const allowedTransitions: Record<string, string[]> = {
//       raised: ["confirmed by oem"],
//       "confirmed by oem": ["resolved"],
//       resolved: ["closed"],
//     };

//     if (status && !allowedTransitions[ticket.status]?.includes(status)) {
//       return NextResponse.json(
//         { error: `Invalid status transition from ${ticket.status} to ${status}` },
//         { status: 400 }
//       );
//     }

//     // Update ticket
//     const updatedTicket = await prisma.ticket.update({
//       where: { ticket_id: ticketId },
//       data: {
//         status: status || ticket.status,
//         comments: comments ?? ticket.comments,
//         ticket_type: ticket_type ?? ticket.ticket_type,
//         updated_at: new Date(),
//       },
//     });

//     return NextResponse.json(updatedTicket, { status: 200 });
//   } catch (error: any) {
//     console.error("Error updating ticket:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// --------------



/**
 * PUT tickets (admin update status, enforce workflow transitions)
 */
// export async function PUT(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: 'client' | 'clientMember' | 'admin';
//       clientId?: number;
//     };

//     if (decoded.role !== 'admin') {
//       return NextResponse.json({ error: 'Only admins can update ticket status' }, { status: 403 });
//     }

//     const ticketId = parseInt(req.nextUrl.searchParams.get('id') || '0');
//     const { status, comments, ticket_type } = await req.json();

//     if (!ticketId || !status) {
//       return NextResponse.json({ error: 'Missing ticket ID or status' }, { status: 400 });
//     }

//     const ticket = await prisma.ticket.findUnique({ where: { ticket_id: ticketId } });
//     if (!ticket) {
//       return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
//     }

//     // Enforce allowed status transitions
//     const allowedTransitions: Record<string, string[]> = {
//       raised: ['confirmed by oem'],
//       'confirmed by oem': ['resolved'],
//       resolved: ['closed'],
//     };

//     const currentStatus = ticket.status.toLowerCase();
//     const nextStatus = status.toLowerCase();

//     if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
//       return NextResponse.json(
//         { error: `Invalid status transition from ${ticket.status} to ${status}` },
//         { status: 400 }
//       );
//     }

//     const updatedTicket = await prisma.ticket.update({
//       where: { ticket_id: ticketId },
//       data: {
//         status: nextStatus,
//         comments,
//         ticket_type,
//         updated_at: new Date(),
//       },
//     });

//     return NextResponse.json(updatedTicket);
//   } catch (error: any) {
//     console.error('Error updating ticket:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }


/**
 * GET tickets
 */
// export async function GET(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: 'client' | 'clientMember' | 'admin';
//       clientId?: number;
//     };

//     let tickets;
//     if (decoded.role === 'admin') {
//       tickets = await prisma.ticket.findMany({
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true,
//         },
//       });
//     } else if (decoded.role === 'client') {
//       tickets = await prisma.ticket.findMany({
//         where: { client_id: Number(decoded.id) },
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true,
//         },
//       });
//     } else if (decoded.role === 'clientMember') {
//       tickets = await prisma.ticket.findMany({
//         where: { client_id: Number(decoded.clientId) },
//         include: {
//           client: { select: { client_username: true } },
//           close_ticket: true,
//         },
//       });
//     } else {
//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     return NextResponse.json(tickets);
//   } catch (error: any) {
//     console.error('Error fetching tickets:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }



/**
 * POST tickets (close tickets, create closeTicket entry, update ContractualTicket)
 */
// export async function POST(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: number | string;
//       role: 'client' | 'clientMember' | 'admin';
//       clientId?: number;
//     };

//     const action = req.nextUrl.searchParams.get('action');
//     const ticketId = parseInt(req.nextUrl.searchParams.get('id') || '0');

//     if (action === 'close' && ticketId) {
//       const ticket = await prisma.ticket.findUnique({ where: { ticket_id: ticketId } });
//       if (!ticket) {
//         return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
//       }

//       // --- ADMIN CLOSE ---
//       if (decoded.role === 'admin') {
//         const formData = await req.formData();
//         const summary = formData.get('summary') as string;
//         const out_of_scope = formData.get('out_of_scope') === 'true';
//         const out_of_scope_reason = formData.get('out_of_scope_reason') as string | null;
//         const attachment = formData.get('attachment') as File | null;

//         let attachmentPath: string | null = null;
//         if (attachment) {
//           const uploadDir = path.join(process.cwd(), 'public', 'uploads');
//           const fileName = `${Date.now()}-${attachment.name}`;
//           const filePath = path.join(uploadDir, fileName);
//           const buffer = Buffer.from(await attachment.arrayBuffer());
//           await writeFile(filePath, buffer);
//           attachmentPath = `/Uploads/${fileName}`;
//         }

//         const updatedTicket = await prisma.ticket.update({
//           where: { ticket_id: ticketId },
//           data: {
//             adminClosed: true,
//             summary,
//             out_of_scope,
//             out_of_scope_reason: out_of_scope ? out_of_scope_reason : null,
//             attachments: attachmentPath
//               ? ticket.attachments
//                 ? `${ticket.attachments},${attachmentPath}`
//                 : attachmentPath
//               : ticket.attachments,
//             status: ticket.clientClosed ? 'closed' : ticket.status,
//             updated_at: new Date(),
//             closed_at: ticket.clientClosed ? new Date() : ticket.closed_at,
//           },
//         });

//         await prisma.closeTicket.upsert({
//           where: { ticket_id: ticketId },
//           update: {
//             summary,
//             attachment: attachmentPath,
//             out_of_scope,
//             created_at: new Date(),
//           },
//           create: {
//             ticket_id: ticketId,
//             summary,
//             attachment: attachmentPath,
//             out_of_scope,
//             created_at: new Date(),
//           },
//         });

//         // --- Update ContractualTicket counters ---
//         if (ticket.ticket_type) {
//           await prisma.contractualTicket.updateMany({
//             where: { client_id: ticket.client_id },
//             data: {
//               total_tickets_used: { increment: 1 },
//               ticket_typeRS1_used: ticket.ticket_type === 'RS1' ? { increment: 1 } : undefined,
//               ticket_typeRS2_used: ticket.ticket_type === 'RS2' ? { increment: 1 } : undefined,
//               ticket_typeRS3_1_used: ticket.ticket_type === 'RS3_1' ? { increment: 1 } : undefined,
//               ticket_typeRS3_2_used: ticket.ticket_type === 'RS3_2' ? { increment: 1 } : undefined,
//             },
//           });
//         }

//         return NextResponse.json(updatedTicket);
//       }

//       // --- CLIENT CLOSE ---
//       if (decoded.role === 'client' || decoded.role === 'clientMember') {
//         if (!ticket.clientClosed && ticket.status === 'resolved') {
//           const { experience, rating, time_saved } = await req.json();

//           const updatedTicket = await prisma.ticket.update({
//             where: { ticket_id: ticketId },
//             data: {
//               clientClosed: true,
//               status: ticket.adminClosed ? 'closed' : ticket.status,
//               updated_at: new Date(),
//               closed_at: ticket.adminClosed ? new Date() : ticket.closed_at,
//             },
//           });

//           await prisma.closeTicket.upsert({
//             where: { ticket_id: ticketId },
//             update: {
//               experience,
//               rating,
//               time_saved: time_saved ? Number(time_saved) : null,
//               created_at: new Date(),
//             },
//             create: {
//               ticket_id: ticketId,
//               experience,
//               rating,
//               time_saved: time_saved ? Number(time_saved) : null,
//               created_at: new Date(),
//             },
//           });

//           return NextResponse.json(updatedTicket);
//         }
//         return NextResponse.json(
//           { error: 'Ticket must be resolved and not yet client-closed' },
//           { status: 400 }
//         );
//       }

//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
//   } catch (error: any) {
//     console.error('Error processing request:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }














import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import path from 'path';
import { writeFile } from 'fs/promises';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        id: number | string;
        role: 'client' | 'clientMember' | 'admin';
        clientId?: number;
      };
      console.log('Decoded JWT:', decoded);
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return NextResponse.json({ error: 'Unauthorized: Invalid JWT' }, { status: 401 });
    }

    let tickets;
    if (decoded.role === 'admin') {
      console.log('Fetching tickets for admin');
      tickets = await prisma.ticket.findMany({
        include: {
          client: { select: { client_username: true } },
          close_ticket: true,
        },
      });
    } else if (decoded.role === 'client') {
      console.log('Fetching tickets for client, client_id:', Number(decoded.id));
      tickets = await prisma.ticket.findMany({
        where: { client_id: Number(decoded.id) },
        include: {
          client: { select: { client_username: true } },
          close_ticket: true,
        },
      });
    } else if (decoded.role === 'clientMember') {
      console.log('Fetching tickets for clientMember, client_id:', Number(decoded.clientId));
      if (!decoded.clientId) {
        return NextResponse.json({ error: 'Invalid clientId for clientMember' }, { status: 400 });
      }
      tickets = await prisma.ticket.findMany({
        where: { client_id: Number(decoded.clientId) },
        include: {
          client: { select: { client_username: true } },
          close_ticket: true,
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    console.log('Fetched tickets:', tickets);
    return NextResponse.json(tickets);
  } catch (error: any) {
    console.error('Error fetching tickets:', error.message, error.stack);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number | string;
      role: 'client' | 'clientMember' | 'admin';
      clientId?: number;
    };

    const action = req.nextUrl.searchParams.get('action');
    const ticketId = parseInt(req.nextUrl.searchParams.get('id') || '0');

    // ---------------- CREATE ----------------
    if (action === 'create') {
      const {
        issue_title,
        priority,
        description,
        location,
        actions_performed,
        creator_name,
        attachments,
        comments,
        ticket_type,
      } = await req.json();

      const clientId =
        decoded.role === 'client'
          ? Number(decoded.id)
          : decoded.role === 'clientMember'
          ? Number(decoded.clientId)
          : null;

      if (!clientId) {
        return NextResponse.json({ error: 'Client ID missing' }, { status: 400 });
      }

      const newTicket = await prisma.ticket.create({
        data: {
          client_id: clientId,
          issue_title,
          priority,
          description,
          location,
          actions_performed,
          creator_name,
          attachments,
          comments,
          ticket_type,
          status: 'raised',
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return NextResponse.json(newTicket, { status: 201 });
    }

    // ---------------- CLOSE ----------------
    if (action === 'close' && ticketId) {
      const ticket = await prisma.ticket.findUnique({ where: { ticket_id: ticketId } });
      if (!ticket) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      }

      // --- ADMIN CLOSE ---
      if (decoded.role === 'admin') {
        const formData = await req.formData();
        const summary = formData.get('summary') as string;
        const out_of_scope = formData.get('out_of_scope') === 'true';
        const out_of_scope_reason = formData.get('out_of_scope_reason') as string | null;
        const attachment = formData.get('attachment') as File | null;

        let attachmentPath: string | null = null;
        if (attachment) {
          const uploadDir = path.join(process.cwd(), 'public', 'uploads');
          const fileName = `${Date.now()}-${attachment.name}`;
          const filePath = path.join(uploadDir, fileName);
          const buffer = Buffer.from(await attachment.arrayBuffer());
          await writeFile(filePath, buffer);
          attachmentPath = `/uploads/${fileName}`;
        }

        const updatedTicket = await prisma.ticket.update({
          where: { ticket_id: ticketId },
          data: {
            adminClosed: true,
            summary,
            out_of_scope,
            out_of_scope_reason: out_of_scope ? out_of_scope_reason : null,
            attachments: attachmentPath
              ? ticket.attachments
                ? `${ticket.attachments},${attachmentPath}`
                : attachmentPath
              : ticket.attachments,
            status: ticket.clientClosed ? 'closed' : ticket.status,
            updated_at: new Date(),
            closed_at: ticket.clientClosed ? new Date() : ticket.closed_at,
          },
        });

        await prisma.closeTicket.upsert({
          where: { ticket_id: ticketId },
          update: {
            summary,
            attachment: attachmentPath,
            out_of_scope,
            created_at: new Date(),
          },
          create: {
            ticket_id: ticketId,
            summary,
            attachment: attachmentPath,
            out_of_scope,
            created_at: new Date(),
          },
        });

        return NextResponse.json(updatedTicket);
      }

      // --- CLIENT CLOSE ---
      if (decoded.role === 'client' || decoded.role === 'clientMember') {
        if (!ticket.clientClosed && ticket.status === 'resolved') {
          const { experience, rating, time_saved } = await req.json();

          const updatedTicket = await prisma.ticket.update({
            where: { ticket_id: ticketId },
            data: {
              clientClosed: true,
              status: ticket.adminClosed ? 'closed' : ticket.status,
              updated_at: new Date(),
              closed_at: ticket.adminClosed ? new Date() : ticket.closed_at,
            },
          });

          await prisma.closeTicket.upsert({
            where: { ticket_id: ticketId },
            update: {
              experience,
              rating,
              time_saved: time_saved ? Number(time_saved) : null,
              created_at: new Date(),
            },
            create: {
              ticket_id: ticketId,
              experience,
              rating,
              time_saved: time_saved ? Number(time_saved) : null,
              created_at: new Date(),
            },
          });

          return NextResponse.json(updatedTicket);
        }
        return NextResponse.json(
          { error: 'Ticket must be resolved and not yet client-closed' },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number | string;
      role: 'client' | 'clientMember' | 'admin';
      clientId?: number;
    };

    // Parse request body
    const { searchParams } = new URL(req.url);
    const ticketId = parseInt(searchParams.get('id') || '0', 10);

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });
    }

    const { status, comments, ticket_type } = await req.json();

    // Validate allowed status flow
    const ticket = await prisma.ticket.findUnique({ where: { ticket_id: ticketId } });
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Enforce status transitions
    const allowedTransitions: Record<string, string[]> = {
      raised: ['confirmed by oem'],
      'confirmed by oem': ['resolved'],
      resolved: ['closed'],
    };

    if (status && !allowedTransitions[ticket.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${ticket.status} to ${status}` },
        { status: 400 }
      );
    }

    // Prepare data for ContractualTicket update if ticket_type is provided
    let contractualUpdate = {};
    if (ticket_type && ticket_type !== ticket.ticket_type) {
      contractualUpdate = {
        total_tickets_used: { increment: 1 },
        ...(ticket_type === 'RS1' && { ticket_typeRS1_used: { increment: 1 } }),
        ...(ticket_type === 'RS2' && { ticket_typeRS2_used: { increment: 1 } }),
        ...(ticket_type === 'RS3-1' && { ticket_typeRS3_1_used: { increment: 1 } }),
        ...(ticket_type === 'RS3-2' && { ticket_typeRS3_2_used: { increment: 1 } }),
      };
    }

    // Start a transaction to update Ticket and ContractualTicket atomically
    const updatedTicket = await prisma.$transaction([
      // Update the ticket
      prisma.ticket.update({
        where: { ticket_id: ticketId },
        data: {
          status: status || ticket.status,
          comments: comments ?? ticket.comments,
          ticket_type: ticket_type ?? ticket.ticket_type,
          updated_at: new Date(),
        },
      }),
      // Update ContractualTicket if ticket_type is provided
      ...(Object.keys(contractualUpdate).length > 0
        ? [
            prisma.contractualTicket.updateMany({
              where: { client_id: ticket.client_id },
              data: contractualUpdate,
            }),
          ]
        : []),
    ]);

    return NextResponse.json(updatedTicket[0], { status: 200 });
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
