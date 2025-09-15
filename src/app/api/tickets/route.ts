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
//       // console.log('Decoded JWT:', decoded);
//     } catch (jwtError) {
//       console.error('JWT verification error:', jwtError);
//       return NextResponse.json({ error: 'Unauthorized: Invalid JWT' }, { status: 401 });
//     }

//     let tickets;
//     if (decoded.role === 'admin') {
//       // console.log('Fetching tickets for admin');
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

//     // console.log('Fetched tickets:', tickets);
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

//     // ---------------- CREATE ----------------
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
    
 
//     const { searchParams } = new URL(req.url);
//     const ticketId = parseInt(searchParams.get('id') || '0', 10);

//     if (!ticketId) {
//       return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });
//     }

//     const { status, comments, ticket_type } = await req.json();


//     const ticket = await prisma.ticket.findUnique({ where: { ticket_id: ticketId } });
//     if (!ticket) {
//       return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
//     }


//     const allowedTransitions: Record<string, string[]> = {
//       raised: ['confirmed by oem'],
//       'confirmed by oem': ['resolved'],
//       resolved: ['closed'],
//     };

//     if (status && !allowedTransitions[ticket.status]?.includes(status)) {
//       return NextResponse.json(
//         { error: `Invalid status transition from ${ticket.status} to ${status}` },
//         { status: 400 }
//       );
//     }
//     let contractualUpdate = {};
//     if (ticket_type && ticket_type !== ticket.ticket_type) {
//       contractualUpdate = {
//         total_tickets_used: { increment: 1 },
//         ...(ticket_type === 'RS1' && { ticket_typeRS1_used: { increment: 1 } }),
//         ...(ticket_type === 'RS2' && { ticket_typeRS2_used: { increment: 1 } }),
//         ...(ticket_type === 'RS3-1' && { ticket_typeRS3_1_used: { increment: 1 } }),
//         ...(ticket_type === 'RS3-2' && { ticket_typeRS3_2_used: { increment: 1 } }),
//       };
//     }

//     const updatedTicket = await prisma.$transaction([

//       prisma.ticket.update({
//         where: { ticket_id: ticketId },
//         data: {
//           status: status || ticket.status,
//           comments: comments ?? ticket.comments,
//           ticket_type: ticket_type ?? ticket.ticket_type,
//           updated_at: new Date(),
//         },
//       }),
//       ...(Object.keys(contractualUpdate).length > 0
//         ? [
//             prisma.contractualTicket.updateMany({
//               where: { client_id: ticket.client_id },
//               data: contractualUpdate,
//             }),
//           ]
//         : []),
//     ]);

//     return NextResponse.json(updatedTicket[0], { status: 200 });
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
// import nodemailer from 'nodemailer';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// // Nodemailer transporter 
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // Function to send email notification 
// async function sendTicketActionEmail({
//   clientUsername,
//   issueTitle,
//   ticketNumber,
//   actionLabel,
// }: {
//   clientUsername: string;
//   issueTitle: string;
//   ticketNumber: string;
//   actionLabel: 'creation' | 'status update' | 'closed';
// }) {
//   try {
//     await transporter.sendMail({
//       from: `"Support System" <${process.env.EMAIL_USER}>`,
//       to: 'vedupadhye10@gmail.com',
//       subject: `Ticket ${actionLabel.toUpperCase()}: ${issueTitle}`,
//       html: `
//         <h3>Ticket Notification</h3>
//         <p>An action was performed on a ticket:</p>
//         <ul>
//           <li><strong>Ticket Number:</strong> ${ticketNumber}</li>
//           <li><strong>Title:</strong> ${issueTitle}</li>
//           <li><strong>Created By:</strong> ${clientUsername}</li>
//           <li><strong>Action:</strong> ${actionLabel}</li>
//         </ul>
//         <p>Please review the ticket in the support system.</p>
//       `,
//     });
//     console.log('Email sent successfully to admin');
//   } catch (error: any) {
//     console.error('Error sending email:', error.message);
//   }
// }

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
//     } catch (jwtError) {
//       console.error('JWT verification error:', jwtError);
//       return NextResponse.json({ error: 'Unauthorized: Invalid JWT' }, { status: 401 });
//     }

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

//     // ---------------- CREATE ----------------
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
//         include: {
//           client: { select: { client_username: true } },
//         },
//       });

//       // Send email notification (creation)
//       await sendTicketActionEmail({
//         clientUsername: newTicket.client.client_username,
//         issueTitle: newTicket.issue_title,
//         ticketNumber: `TICKET-${newTicket.ticket_id}`,
//         actionLabel: 'creation',
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

//         // Notify via email (closed by admin)
//         const clientForMail = await prisma.client.findUnique({
//           where: { client_id: ticket.client_id },
//           select: { client_username: true },
//         });
//         await sendTicketActionEmail({
//           clientUsername: clientForMail?.client_username || 'Unknown',
//           issueTitle: updatedTicket.issue_title,
//           ticketNumber: `TICKET-${updatedTicket.ticket_id}`,
//           actionLabel: 'closed',
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

//           // Notify via email (closed by client)
//           const clientForMail = await prisma.client.findUnique({
//             where: { client_id: ticket.client_id },
//             select: { client_username: true },
//           });
//           await sendTicketActionEmail({
//             clientUsername: clientForMail?.client_username || 'Unknown',
//             issueTitle: updatedTicket.issue_title,
//             ticketNumber: `TICKET-${updatedTicket.ticket_id}`,
//             actionLabel: 'closed',
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

//     const { searchParams } = new URL(req.url);
//     const ticketId = parseInt(searchParams.get('id') || '0', 10);

//     if (!ticketId) {
//       return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });
//     }

//     const { status, comments, ticket_type } = await req.json();

//     const ticket = await prisma.ticket.findUnique({ where: { ticket_id: ticketId } });
//     if (!ticket) {
//       return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
//     }

//     const allowedTransitions: Record<string, string[]> = {
//       raised: ['confirmed by oem'],
//       'confirmed by oem': ['resolved'],
//       resolved: ['closed'],
//     };

//     if (status && !allowedTransitions[ticket.status]?.includes(status)) {
//       return NextResponse.json(
//         { error: `Invalid status transition from ${ticket.status} to ${status}` },
//         { status: 400 }
//       );
//     }

//     let contractualUpdate = {};
//     if (ticket_type && ticket_type !== ticket.ticket_type) {
//       contractualUpdate = {
//         total_tickets_used: { increment: 1 },
//         ...(ticket_type === 'RS1' && { ticket_typeRS1_used: { increment: 1 } }),
//         ...(ticket_type === 'RS2' && { ticket_typeRS2_used: { increment: 1 } }),
//         ...(ticket_type === 'RS3-1' && { ticket_typeRS3_1_used: { increment: 1 } }),
//         ...(ticket_type === 'RS3-2' && { ticket_typeRS3_2_used: { increment: 1 } }),
//       };
//     }

//     const updatedTicket = await prisma.$transaction([
//       prisma.ticket.update({
//         where: { ticket_id: ticketId },
//         data: {
//           status: status || ticket.status,
//           comments: comments ?? ticket.comments,
//           ticket_type: ticket_type ?? ticket.ticket_type,
//           updated_at: new Date(),
//         },
//       }),
//       ...(Object.keys(contractualUpdate).length > 0
//         ? [
//             prisma.contractualTicket.updateMany({
//               where: { client_id: ticket.client_id },
//               data: contractualUpdate,
//             }),
//           ]
//         : []),
//     ]);

//     // Notify via email (status update)
//     const clientForMail = await prisma.client.findUnique({
//       where: { client_id: ticket.client_id },
//       select: { client_username: true },
//     });
//     await sendTicketActionEmail({
//       clientUsername: clientForMail?.client_username || 'Unknown',
//       issueTitle: updatedTicket[0].issue_title,
//       ticketNumber: `TICKET-${updatedTicket[0].ticket_id}`,
//       actionLabel: 'status update',
//     });

//     return NextResponse.json(updatedTicket[0], { status: 200 });
//   } catch (error: any) {
//     console.error('Error updating ticket:', error);
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
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send email notification for different actions
async function sendTicketActionEmail({
  clientUsername,
  issueTitle,
  ticketNumber,
  actionLabel,
  issueCategory,
  issueSubcategory,
}: {
  clientUsername: string;
  issueTitle: string;
  ticketNumber: string;
  actionLabel: 'creation' | 'status update' | 'closed';
  issueCategory?: string | null;
  issueSubcategory?: string | null;
}) {
  try {
    await transporter.sendMail({
      from: `"Support System" <${process.env.EMAIL_USER}>`,
      to: 'vedupadhye10@gmail.com',
      subject: `Ticket ${actionLabel.toUpperCase()}: ${issueTitle}`,
      html: `
        <h3>Ticket Notification</h3>
        <p>An action was performed on a ticket:</p>
        <ul>
          <li><strong>Ticket Number:</strong> ${ticketNumber}</li>
          <li><strong>Title:</strong> ${issueTitle}</li>
          <li><strong>Created By:</strong> ${clientUsername}</li>
          <li><strong>Action:</strong> ${actionLabel}</li>
          ${issueCategory ? `<li><strong>Issue Category:</strong> ${issueCategory}</li>` : ''}
          ${issueSubcategory ? `<li><strong>Issue Subcategory:</strong> ${issueSubcategory}</li>` : ''}
        </ul>
        <p>Please review the ticket in the support system.</p>
      `,
    });
    console.log('Email sent successfully to admin');
  } catch (error: any) {
    console.error('Error sending email:', error.message);
  }
}

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
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return NextResponse.json({ error: 'Unauthorized: Invalid JWT' }, { status: 401 });
    }

    let tickets;
    if (decoded.role === 'admin') {
      tickets = await prisma.ticket.findMany({
        include: {
          client: { select: { client_username: true } },
          close_ticket: true,
        },
      });
    } else if (decoded.role === 'client') {
      tickets = await prisma.ticket.findMany({
        where: { client_id: String(decoded.id) },
        include: {
          client: { select: { client_username: true } },
          close_ticket: true,
        },
      });
    } else if (decoded.role === 'clientMember') {
      if (!decoded.clientId) {
        return NextResponse.json({ error: 'Invalid clientId for clientMember' }, { status: 400 });
      }
      tickets = await prisma.ticket.findMany({
        where: { client_id: String(decoded.clientId) },
        include: {
          client: { select: { client_username: true } },
          close_ticket: true,
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

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
        issue_category,
        issue_subcategory,
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
          ? String(decoded.id)
          : decoded.role === 'clientMember'
          ? String(decoded.clientId)
          : null;

      if (!clientId) {
        return NextResponse.json({ error: 'Client ID missing' }, { status: 400 });
      }

      const newTicket = await prisma.ticket.create({
        data: {
          client_id: clientId,
          issue_title,
          issue_category,
          issue_subcategory,
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
        include: {
          client: { select: { client_username: true } },
        },
      });

      // Send email notification (creation)
      await sendTicketActionEmail({
        clientUsername: newTicket.client.client_username,
        issueTitle: newTicket.issue_title,
        ticketNumber: `TICKET-${newTicket.ticket_id}`,
        actionLabel: 'creation',
        issueCategory: newTicket.issue_category,
        issueSubcategory: newTicket.issue_subcategory,
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

        // Notify via email (closed by admin)
        const clientForMail = await prisma.client.findUnique({
          where: { client_id: ticket.client_id },
          select: { client_username: true },
        });
        await sendTicketActionEmail({
          clientUsername: clientForMail?.client_username || 'Unknown',
          issueTitle: updatedTicket.issue_title,
          ticketNumber: `TICKET-${updatedTicket.ticket_id}`,
          actionLabel: 'closed',
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

          // Notify via email (closed by client)
          const clientForMail = await prisma.client.findUnique({
            where: { client_id: ticket.client_id },
            select: { client_username: true },
          });
          await sendTicketActionEmail({
            clientUsername: clientForMail?.client_username || 'Unknown',
            issueTitle: updatedTicket.issue_title,
            ticketNumber: `TICKET-${updatedTicket.ticket_id}`,
            actionLabel: 'closed',
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

    const { searchParams } = new URL(req.url);
    const ticketId = parseInt(searchParams.get('id') || '0', 10);

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });
    }

    const { status, comments, ticket_type } = await req.json();

    const ticket = await prisma.ticket.findUnique({ where: { ticket_id: ticketId } });
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

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

    const updatedTicket = await prisma.$transaction([
      prisma.ticket.update({
        where: { ticket_id: ticketId },
        data: {
          status: status || ticket.status,
          comments: comments ?? ticket.comments,
          ticket_type: ticket_type ?? ticket.ticket_type,
          updated_at: new Date(),
        },
      }),
      ...(Object.keys(contractualUpdate).length > 0
        ? [
            prisma.contractualTicket.updateMany({
              where: { client_id: ticket.client_id },
              data: contractualUpdate,
            }),
          ]
        : []),
    ]);

    // Notify via email (status update)
    const clientForMail = await prisma.client.findUnique({
      where: { client_id: ticket.client_id },
      select: { client_username: true },
    });
    await sendTicketActionEmail({
      clientUsername: clientForMail?.client_username || 'Unknown',
      issueTitle: updatedTicket[0].issue_title,
      ticketNumber: `TICKET-${updatedTicket[0].ticket_id}`,
      actionLabel: 'status update',
    });

    return NextResponse.json(updatedTicket[0], { status: 200 });
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}