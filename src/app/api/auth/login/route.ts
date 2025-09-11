// // /app/api/auth/login/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';
// const ADMIN_USERNAME = 'admin@gmail.com';
// const ADMIN_PASSWORD = 'password';

// export async function POST(req: NextRequest) {
//   try {
//     const { username, password, role } = await req.json();

//     if (!username || !password || !role) {
//       return NextResponse.json({ error: 'Missing username, password, or role' }, { status: 400 });
//     }

//     if (role === 'admin') {
//       if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
//         return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
//       }

//       // Generate JWT for admin
//       const token = jwt.sign({ id: username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
//       return NextResponse.json({ token, role: 'admin', id: username }, { status: 200 });
//     } else if (role === 'user') {
//       // Check Client table
//       const client = await prisma.client.findFirst({
//         where: { client_username: username },
//       });

//       if (client && client.client_password === password) {
//         // Generate JWT for client
//         const token = jwt.sign({ id: client.client_id, role: 'client' }, JWT_SECRET, { expiresIn: '1h' });
//         return NextResponse.json({ token, role: 'client', id: client.client_id }, { status: 200 });
//       }

//       // Check ClientMember table
//       const clientMember = await prisma.clientMember.findFirst({
//         where: { member_username: username },
//       });

//       if (clientMember && clientMember.member_password === password) {
//         // Generate JWT for client member
//         const token = jwt.sign(
//           { id: clientMember.member_id, role: 'clientMember', clientId: clientMember.client_id },
//           JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         return NextResponse.json(
//           { token, role: 'clientMember', id: clientMember.member_id, clientId: clientMember.client_id },
//           { status: 200 }
//         );
//       }

//       return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
//     }

//     return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }













// // File: app/api/auth/login/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';
// const ADMIN_USERNAME = 'admin@gmail.com';
// const ADMIN_PASSWORD = 'password';

// export async function POST(req: NextRequest) {
//   try {
//     const { username, password, role } = await req.json();

//     if (!username || !password || !role) {
//       return NextResponse.json({ error: 'Missing username, password, or role' }, { status: 400 });
//     }

//     if (role === 'admin') {
//       if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
//         return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
//       }

//       // Generate JWT for admin
//       const token = jwt.sign({ id: username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
//       return NextResponse.json({ token, role: 'admin', id: username }, { status: 200 });
//     } else if (role === 'user') {
//       // Check Client table
//       const client = await prisma.client.findFirst({
//         where: { client_username: username },
//       });

//       if (client && (await bcrypt.compare(password, client.client_password))) {
//         // Generate JWT for client
//         const token = jwt.sign({ id: client.client_id, role: 'client' }, JWT_SECRET, { expiresIn: '1h' });
//         return NextResponse.json({ token, role: 'client', id: client.client_id }, { status: 200 });
//       }

//       // Check ClientMember table
//       const clientMember = await prisma.clientMember.findFirst({
//         where: { member_username: username },
//       });

//       if (clientMember && (await bcrypt.compare(password, clientMember.member_password))) {
//         // Generate JWT for client member
//         const token = jwt.sign(
//           { id: clientMember.member_id, role: 'clientMember', clientId: clientMember.client_id },
//           JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         return NextResponse.json(
//           { token, role: 'clientMember', id: clientMember.member_id, clientId: clientMember.client_id },
//           { status: 200 }
//         );
//       }

//       return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
//     }

//     return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }






// // File: app/api/auth/login/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';
// const ADMIN_USERNAME = 'admin@gmail.com';
// const ADMIN_PASSWORD = 'password';

// export async function POST(req: NextRequest) {
//   try {
//     const { email, password, role } = await req.json();

//     if (!email || !password || !role) {
//       return NextResponse.json({ error: 'Missing email, password, or role' }, { status: 400 });
//     }

//     if (role === 'admin') {
//       if (email !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
//         return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
//       }

//       // Generate JWT for admin
//       const token = jwt.sign(
//         { id: email, email, role: 'admin', name: 'Admin', ticketsRemaining: 0, contractStartDate: '', contractEndDate: '' },
//         JWT_SECRET,
//         { expiresIn: '1h' }
//       );
//       return NextResponse.json(
//         { token, role: 'admin', id: email, email, name: 'Admin', ticketsRemaining: 0, contractStartDate: '', contractEndDate: '' },
//         { status: 200 }
//       );
//     } else if (role === 'user') {
//       // Check Client table
//       const client = await prisma.client.findFirst({
//         where: { client_username: email },
//         include: { contracts: true },
//       });

//       if (client && (await bcrypt.compare(password, client.client_password))) {
//         // Generate JWT for client
//         const token = jwt.sign(
//           {
//             id: client.client_id.toString(),
//             email: client.client_username,
//             role: 'user',
//             name: client.name,
//             ticketsRemaining: client.contracts[0]?.allowed_tickets - client.contracts[0]?.total_tickets_used || 0,
//             contractStartDate: '',
//             contractEndDate: '',
//           },
//           JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         return NextResponse.json(
//           {
//             token,
//             role: 'user',
//             id: client.client_id.toString(),
//             email: client.client_username,
//             name: client.name,
//             ticketsRemaining: client.contracts[0]?.allowed_tickets - client.contracts[0]?.total_tickets_used || 0,
//             contractStartDate: '',
//             contractEndDate: '',
//           },
//           { status: 200 }
//         );
//       }

//       // Check ClientMember table
//       const clientMember = await prisma.clientMember.findFirst({
//         where: { member_username: email },
//         include: { client: { include: { contracts: true } } },
//       });

//       if (clientMember && (await bcrypt.compare(password, clientMember.member_password))) {
//         // Generate JWT for client member
//         const token = jwt.sign(
//           {
//             id: clientMember.member_id.toString(),
//             email: clientMember.member_username,
//             role: 'user',
//             name: clientMember.member_name,
//             ticketsRemaining: clientMember.client.contracts[0]?.allowed_tickets - clientMember.client.contracts[0]?.total_tickets_used || 0,
//             contractStartDate: '',
//             contractEndDate: '',
//             clientId: clientMember.client_id,
//           },
//           JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         return NextResponse.json(
//           {
//             token,
//             role: 'user',
//             id: clientMember.member_id.toString(),
//             email: clientMember.member_username,
//             name: clientMember.member_name,
//             ticketsRemaining: clientMember.client.contracts[0]?.allowed_tickets - clientMember.client.contracts[0]?.total_tickets_used || 0,
//             contractStartDate: '',
//             contractEndDate: '',
//             clientId: clientMember.client_id,
//           },
//           { status: 200 }
//         );
//       }

//       return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
//     }

//     return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// when the client is clicked from the Management Center the Monthly Ticket Activity , Recent Tickets
// is not showing accuately?? its hardcoded it should come from DB




// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';
// const ADMIN_USERNAME = 'admin@gmail.com';
// const ADMIN_PASSWORD = 'password';

// export async function POST(req: NextRequest) {
//   try {
//     const { username, password, role } = await req.json();

//     if (!username || !password || !role) {
//       return NextResponse.json({ error: 'Missing username, password, or role' }, { status: 400 });
//     }

//     if (role === 'admin') {
//       if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
//         return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
//       }

//       const token = jwt.sign({ id: username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
//       return NextResponse.json({ token, role: 'admin', id: username }, { status: 200 });
//     } else if (role === 'user') {
//       // Check Client table
//       const client = await prisma.client.findFirst({
//         where: { client_username: username },
//       });

//       if (client && client.client_password === password) {
//         // Generate JWT for client with clientId
//         const token = jwt.sign(
//           { id: client.client_id, role: 'client', clientId: client.client_id },
//           JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         return NextResponse.json({ token, role: 'client', id: client.client_id, clientId: client.client_id }, { status: 200 });
//       }

//       // Check ClientMember table
//       const clientMember = await prisma.clientMember.findFirst({
//         where: { member_username: username },
//       });

//       if (clientMember && clientMember.member_password === password) {
//         // Generate JWT for client member
//         const token = jwt.sign(
//           { id: clientMember.member_id, role: 'clientMember', clientId: clientMember.client_id },
//           JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         return NextResponse.json(
//           { token, role: 'clientMember', id: clientMember.member_id, clientId: clientMember.client_id },
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
//       // Check Client table
//       const client = await prisma.client.findFirst({
//         where: { client_username: username },
//       });

//       if (client && client.client_password === password) {
//         // Generate JWT for client with clientId
//         const token = jwt.sign(
//           { id: client.client_id, role: 'client', clientId: client.client_id },
//           JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         return NextResponse.json(
//           { token, role: 'client', id: client.client_id, clientId: client.client_id },
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
//           { id: clientMember.member_id, role: 'clientMember', clientId: clientMember.client_id },
//           JWT_SECRET,
//           { expiresIn: '1h' }
//         );
//         return NextResponse.json(
//           {
//             token,
//             role: 'clientMember',
//             id: clientMember.member_id,
//             clientId: clientMember.client_id,
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









import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json();

    if (!username || !password || !role) {
      return NextResponse.json({ error: 'Missing username, password, or role' }, { status: 400 });
    }

    if (role === 'admin') {
      // Check Admin table
      const admin = await prisma.admin.findFirst({
        where: { username: username },
      });

      if (!admin || admin.password !== password) {
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
      // Check Client table first
      const client = await prisma.client.findFirst({
        where: { client_username: username },
      });

      if (client && client.client_password === password) {
        // Generate JWT for client with clientId
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

      // Check ClientMember table
      const clientMember = await prisma.clientMember.findFirst({
        where: { member_username: username },
      });

      if (clientMember && clientMember.member_password === password) {
        // Generate JWT for client member
        const token = jwt.sign(
          { 
            id: clientMember.member_id, 
            role: 'clientMember', 
            clientId: clientMember.client_id,
            username: clientMember.member_username
          },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
        return NextResponse.json(
          {
            token,
            role: 'clientMember',
            id: clientMember.member_id,
            clientId: clientMember.client_id,
            username: clientMember.member_username,
          },
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
}