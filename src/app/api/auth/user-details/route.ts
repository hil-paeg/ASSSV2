// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// export async function GET(req: NextRequest) {
//   try {
//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: 'client' | 'clientMember'; clientId?: number };

//     if (decoded.role === 'client') {
//       const client = await prisma.client.findUnique({
//         where: { client_id: decoded.id },
//         select: { client_username: true , name : true },
//       });

//       if (!client) {
//         return NextResponse.json({ error: 'Client not found' }, { status: 404 });
//       }

//       return NextResponse.json({
//         username: client.client_username,
//         client_username: client.client_username,
//         client_name : client.name
//       });
//     } else if (decoded.role === 'clientMember') {
//       const member = await prisma.clientMember.findUnique({
//         where: { member_id: decoded.id },
//         include: {
//           client: { select: { client_username: true ,name : true } },
//         },
//       });

//       if (!member) {
//         return NextResponse.json({ error: 'Member not found' }, { status: 404 });
//       }

//       return NextResponse.json({
//         username: member.member_username,
//         member_id: member.member_id,
//         phone_number: member.phone_number,
//         client_username: member.client.client_username,
//         client_name: member.client.name,
//       });
//     }

//     return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }









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
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      id: number; 
      role: 'admin' | 'client' | 'clientMember'; 
      clientId?: number;
      username?: string;
    };

    if (decoded.role === 'admin') {
      const admin = await prisma.admin.findUnique({
        where: { admin_id: decoded.id },
        select: { 
          admin_id: true,
          username: true,
          name: true,
          designation: true,
        },
      });

      if (!admin) {
        return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
      }

      return NextResponse.json({
        id: admin.admin_id,
        role: 'admin',
        username: admin.username,
        name: admin.name,
        designation: admin.designation,
      });

    } else if (decoded.role === 'client') {
      const client = await prisma.client.findUnique({
        where: { client_id: decoded.id },
        include: {
          contracts: {
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
            }
          }
        }
      });

      if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }

      // Calculate remaining tickets
      const contract = client.contracts[0];
      const ticketsRemaining = contract ? contract.allowed_tickets - contract.total_tickets_used : 0;

      return NextResponse.json({
        id: client.client_id,
        role: 'client',
        clientId: client.client_id,
        username: client.client_username,
        client_username: client.client_username,
        client_name: client.name,
        name: client.name,
        start_date: client.start_date,
        payment_cycle: client.payment_cycle,
        ticketsRemaining: ticketsRemaining,
        contractStartDate: client.start_date?.toISOString(),
        // Add contract details if needed
        contract: contract,
      });

    } else if (decoded.role === 'clientMember') {
      const member = await prisma.clientMember.findUnique({
        where: { member_id: decoded.id },
        include: {
          client: { 
            select: { 
              client_username: true, 
              name: true,
              client_id: true,
              start_date: true,
              payment_cycle: true,
            } 
          },
        },
      });

      if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }

      return NextResponse.json({
        id: member.member_id,
        role: 'clientMember',
        clientId: member.client_id,
        username: member.member_username,
        member_id: member.member_id,
        member_name: member.member_name,
        designation: member.designation,
        email: member.email,
        phone_number: member.phone_number,
        escalation_level: member.escalation_level,
        client_username: member.client.client_username,
        client_name: member.client.name,
        name: member.member_name,
      });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error('User details error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}