



// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// export async function POST(req: NextRequest) {
//   try {
//     const { username, password, role } = await req.json();

//     if (!username || !password || !role) {
//       return NextResponse.json({ error: 'Missing username, password, or role' }, { status: 400 });
//     }

//     if (role === 'admin') {
//       // Check Admin table
//       const admin = await prisma.admin.findFirst({
//         where: { username: username },
//       });

//       if (!admin || admin.password !== password) {
//         return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
//       }

//       const token = jwt.sign(
//         { id: admin.admin_id, role: 'admin', username: admin.username },
//         JWT_SECRET,
//         { expiresIn: '1h' }
//       );
//       return NextResponse.json(
//         { token, role: 'admin', id: admin.admin_id, username: admin.username },
//         { status: 200 }
//       );
//     } else if (role === 'user') {
  
//       const client = await prisma.client.findFirst({
//         where: { client_username: username },
//       });

//       if (client && client.client_password === password) {
//         // Generate JWT for client with clientId
//         const token = jwt.sign(
//           { id: client.client_id, role: 'client', clientId: client.client_id, username: client.client_username },
//           JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         return NextResponse.json(
//           { token, role: 'client', id: client.client_id, clientId: client.client_id, username: client.client_username },
//           { status: 200 }
//         );
//       }

//       // Check ClientMember table
//       const clientMember = await prisma.clientMember.findFirst({
//         where: { member_username: username },
//       });

//       if (clientMember && clientMember.member_password === password) {
//         // Generate JWT for client member
//         const token = jwt.sign(
//           { 
//             id: clientMember.member_id, 
//             role: 'clientMember', 
//             clientId: clientMember.client_id,
//             username: clientMember.member_username
//           },
//           JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         return NextResponse.json(
//           {
//             token,
//             role: 'clientMember',
//             id: clientMember.member_id,
//             clientId: clientMember.client_id,
//             username: clientMember.member_username,
//           },
//           { status: 200 }
//         );
//       }

//       return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
//     }

//     return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//   } catch (error) {
//     console.error('Login Error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }







// import { NextRequest, NextResponse } from 'next/server';
//    import prisma from '@/lib/prisma'; // Adjust path to your prisma import
//    import jwt from 'jsonwebtoken';

//    const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

//    export async function POST(req: NextRequest) {
//      try {
//        const { username, password, role } = await req.json();

//        if (!username || !password || !role) {
//          return NextResponse.json({ error: 'Missing username, password, or role' }, { status: 400 });
//        }

//        if (role === 'admin') {
//          // Check Admin table
//          const admin = await prisma.admin.findFirst({
//            where: { username: username },
//          });
//          console.log('Admin query result:', admin); // Debug log

//          if (!admin || admin.password !== password) {
//            return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
//          }

//          const token = jwt.sign(
//            { id: admin.admin_id, role: 'admin', username: admin.username },
//            JWT_SECRET,
//            { expiresIn: '1h' }
//          );
//          return NextResponse.json(
//            { token, role: 'admin', id: admin.admin_id, username: admin.username },
//            { status: 200 }
//          );
//        } else if (role === 'user') {
//          // Check Client table first
//          const client = await prisma.client.findFirst({
//            where: { client_username: username },
//          });
//          console.log('Client query result:', client); // Debug log

//          if (client && client.client_password === password) {
//            // Generate JWT for client with clientId
//            const token = jwt.sign(
//              { id: client.client_id, role: 'client', clientId: client.client_id, username: client.client_username },
//              JWT_SECRET,
//              { expiresIn: '1h' }
//            );
//            return NextResponse.json(
//              { token, role: 'client', id: client.client_id, clientId: client.client_id, username: client.client_username },
//              { status: 200 }
//            );
//          }

//          // Check ClientMember table
//          const clientMember = await prisma.clientMember.findFirst({
//            where: { member_username: username },
//          });
//          console.log('ClientMember query result:', clientMember); // Debug log

//          if (clientMember && clientMember.member_password === password) {
//            // Generate JWT for client member
//            const token = jwt.sign(
//              { 
//                id: clientMember.member_id, 
//                role: 'clientMember', 
//                clientId: clientMember.client_id,
//                username: clientMember.member_username
//              },
//              JWT_SECRET,
//              { expiresIn: '1h' }
//            );
//            return NextResponse.json(
//              {
//                token,
//                role: 'clientMember',
//                id: clientMember.member_id,
//                clientId: clientMember.client_id,
//                username: clientMember.member_username,
//              },
//              { status: 200 }
//            );
//          }

//          return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
//        }

//        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//      } catch (error) {
//        console.error('Login Error:', error);
//        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//      } finally {
//        await prisma.$disconnect();
//      }
//    }






import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json();

    if (!username || !password || !role) {
      return NextResponse.json({ error: 'Missing username, password, or role' }, { status: 400 });
    }

    async function isPasswordValid(storedPassword: string, inputPassword: string): Promise<boolean> {
      if (storedPassword === inputPassword) return true; 
      return await bcrypt.compare(inputPassword, storedPassword); 
    }

    if (role === 'admin') {
      const admin = await prisma.admin.findFirst({ where: { username } });
      if (!admin || !(await isPasswordValid(admin.password, password))) {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
      }

      const token = jwt.sign(
        { id: admin.admin_id, role: 'admin', username: admin.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return NextResponse.json(
        { token, role: 'admin', id: admin.admin_id, username: admin.username },
        { status: 200 }
      );
    } else if (role === 'user') {
      const client = await prisma.client.findFirst({ where: { client_username: username } });
      if (client && (await isPasswordValid(client.client_password, password))) {
        const token = jwt.sign(
          { id: client.client_id, role: 'client', clientId: client.client_id, username: client.client_username },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        return NextResponse.json(
          { token, role: 'client', id: client.client_id, clientId: client.client_id, username: client.client_username },
          { status: 200 }
        );
      }

      const clientMember = await prisma.clientMember.findFirst({ where: { member_username: username } });
      if (clientMember && (await isPasswordValid(clientMember.member_password, password))) {
        const token = jwt.sign(
          { id: clientMember.member_id, role: 'clientMember', clientId: clientMember.client_id, username: clientMember.member_username },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        return NextResponse.json(
          { token, role: 'clientMember', id: clientMember.member_id, clientId: clientMember.client_id, username: clientMember.member_username },
          { status: 200 }
        );
      }

      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
