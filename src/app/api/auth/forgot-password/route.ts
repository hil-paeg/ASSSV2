// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// export async function POST(req: NextRequest) {
//   try {
//     const { username, email } = await req.json();

//     if (!username || !email) {
//       return NextResponse.json({ error: 'Username and email are required' }, { status: 400 });
//     }

//     // Check for user in all possible roles
//     let user = null;
//     let role = '';
//     let userId = null;

//     // Check admin
//     user = await prisma.admin.findFirst({
//       where: { username, email },
//     });
//     if (user) {
//       role = 'admin';
//       userId = user.admin_id;
//     }

//     // Check client if not found as admin
//     if (!user) {
//       user = await prisma.client.findFirst({
//         where: { client_username: username, email },
//       });
//       if (user) {
//         role = 'client';
//         userId = user.client_id;
//       }
//     }

//     // Check clientMember if not found as client
//     if (!user) {
//       user = await prisma.clientMember.findFirst({
//         where: { member_username: username, email },
//       });
//       if (user) {
//         role = 'clientMember';
//         userId = user.member_id;
//       }
//     }

//     if (!user) {
//       return NextResponse.json(
//         { error: 'No user found with the provided username and email' },
//         { status: 404 }
//       );
//     }

//     // Generate JWT token for OTP request
//     const token = jwt.sign(
//       { id: userId, role, username },
//       JWT_SECRET,
//       { expiresIn: '1h' }
//     );


//     const apiUrl = 'http://localhost:3000';
//     if (!apiUrl) {
//       console.error('NEXT_PUBLIC_API_URL is not defined in environment variables');
//       return NextResponse.json(
//         { error: 'Server configuration error: API URL not defined' },
//         { status: 500 }
//       );
//     }

//     // Call the existing OTP sending endpoint
//     const otpResponse = await fetch('http://localhost:3000/api/auth/send-otp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ email }),
//     });

//     if (!otpResponse.ok) {
//       const errorData = await otpResponse.json();
//       return NextResponse.json(
//         { error: errorData.error || 'Failed to send OTP' },
//         { status: otpResponse.status }
//       );
//     }

//     const otpData = await otpResponse.json();
//     return NextResponse.json(
//       { message: 'OTP sent successfully to your email address' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Forgot Password Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to process request. Please try again later.' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }




import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

export async function POST(req: NextRequest) {
  try {
    const { username, email } = await req.json();

    if (!username || !email) {
      return NextResponse.json({ error: 'Username and email are required' }, { status: 400 });
    }

    // Check for user in all possible roles
    let user = null;
    let role = '';
    let userId = null;

    // Check admin
    user = await prisma.admin.findFirst({
      where: { username, email },
    });
    if (user) {
      role = 'admin';
      userId = user.admin_id;
    }

    // Check client if not found as admin
    if (!user) {
      user = await prisma.client.findFirst({
        where: { client_username: username, email },
      });
      if (user) {
        role = 'client';
        userId = user.client_id;
      }
    }

    // Check clientMember if not found as client
    if (!user) {
      user = await prisma.clientMember.findFirst({
        where: { member_username: username, email },
      });
      if (user) {
        role = 'clientMember';
        userId = user.member_id;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No user found with the provided username and email' },
        { status: 404 }
      );
    }

    // Generate JWT token for OTP request
    const token = jwt.sign(
      { id: userId, role, username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Ensure API URL is defined
    const apiUrl = 'http://localhost:3000';
    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL is not defined in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: API URL not defined' },
        { status: 500 }
      );
    }

    // Call the existing OTP sending endpoint
    const otpResponse = await fetch(`http://localhost:3000/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!otpResponse.ok) {
      const errorData = await otpResponse.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to send OTP' },
        { status: otpResponse.status }
      );
    }

    const otpData = await otpResponse.json();
    return NextResponse.json(
      {
        message: 'OTP sent successfully to your email address',
        userId,
        userRole: role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again later.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}