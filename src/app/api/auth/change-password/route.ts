// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

// export async function POST(req: NextRequest) {
//   try {
//     const { otp, newPassword } = await req.json();
//     if (!otp || !newPassword) {
//       return NextResponse.json({ error: 'Missing OTP or new password' }, { status: 400 });
//     }
//     if (newPassword.length < 8) {
//       return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
//     }

//     const authHeader = req.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };

//     // Find OTP record
//     const otpRecord = await prisma.otpRecord.findFirst({
//       where: { userId: decoded.id, role: decoded.role },
//     });

//     if (!otpRecord || otpRecord.otp !== otp || new Date() > otpRecord.expiresAt || otpRecord.attempts >= 3) {
//       if (otpRecord) {
//         await prisma.otpRecord.update({
//           where: { id: otpRecord.id },
//           data: { attempts: otpRecord.attempts + 1 },
//         });
//       }
//       return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
//     }

//     // Update password based on role
//     if (decoded.role === 'admin') {
//       await prisma.admin.update({
//         where: { admin_id: decoded.id },
//         data: { password: newPassword },
//       });
//     } else if (decoded.role === 'client') {
//       await prisma.client.update({
//         where: { client_id: decoded.id },
//         data: { client_password: newPassword },
//       });
//     } else if (decoded.role === 'clientMember') {
//       await prisma.clientMember.update({
//         where: { member_id: decoded.id },
//         data: { member_password: newPassword },
//       });
//     }

//     // Delete OTP after success
//     await prisma.otpRecord.delete({ where: { id: otpRecord.id } });

//     return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Change Password Error:', error);
//     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
//       return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }




// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function POST(request: NextRequest) {
//   try {
//     // Parse request body
//     const { email, otp, newPassword, userRole, userId } = await request.json();

//     if (!email || !otp || !newPassword || !userRole || !userId) {
//       return NextResponse.json({ 
//         error: 'Email, OTP, new password, user role, and user ID are required' 
//       }, { status: 400 });
//     }

//     if (newPassword.length < 8) {
//       return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
//     }

//     if (!/^\d{6}$/.test(otp)) {
//       return NextResponse.json({ error: 'OTP must be a 6-digit number' }, { status: 400 });
//     }

//     // Verify the user still exists
//     let user: any = null;

//     if (userRole === 'client') {
//       user = await prisma.client.findFirst({
//         where: { 
//           client_id: userId,
//           email: email 
//         },
//       });
//     } else if (userRole === 'admin') {
//       user = await prisma.admin.findFirst({
//         where: { 
//           admin_id: userId,
//           email: email 
//         },
//       });
//     }

//     if (!user) {
//       return NextResponse.json({ error: 'User not found or email mismatch' }, { status: 404 });
//     }

//     // Find the OTP record
//     const otpRecord = await prisma.otpRecord.findFirst({
//       where: {
//         userId: userId,
//         role: userRole,
//         otp: otp,
//       },
//     });

//     if (!otpRecord) {
//       return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
//     }

//     // Check if OTP is expired
//     if (new Date() > otpRecord.expiresAt) {
//       // Delete expired OTP
//       await prisma.otpRecord.delete({
//         where: { id: otpRecord.id },
//       });
//       return NextResponse.json({ error: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
//     }

//     // Check attempts (optional - you can implement rate limiting)
//     if (otpRecord.attempts >= 5) {
//       await prisma.otpRecord.delete({
//         where: { id: otpRecord.id },
//       });
//       return NextResponse.json({ error: 'Too many attempts. Please request a new OTP.' }, { status: 400 });
//     }

//     // Hash the new password
//     const saltRounds = 12;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Update password based on role
//     if (userRole === 'client') {
//       await prisma.client.update({
//         where: { client_id: userId },
//         data: {
//           client_password: hashedPassword,
//         },
//       });
//     } else if (userRole === 'admin') {
//       await prisma.admin.update({
//         where: { admin_id: userId },
//         data: {
//           password: hashedPassword,
//         },
//       });
//     }

//     // Delete the used OTP
//     await prisma.otpRecord.delete({
//       where: { id: otpRecord.id },
//     });

//     return NextResponse.json({ 
//       message: 'Password changed successfully! You can now login with your new password.' 
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Change Password Error:', error);
//     return NextResponse.json({ 
//       error: 'Failed to change password. Please try again later.' 
//     }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword, userRole, userId } = await request.json();

    if (!email || !otp || !newPassword || !userRole || !userId) {
      return NextResponse.json({ 
        error: 'Email, OTP, new password, user role, and user ID are required' 
      }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: 'OTP must be a 6-digit number' }, { status: 400 });
    }

    console.log('Looking for user with:', { userId, userRole });

   let user: any = null;

    if (userRole === 'client') {
      user = await prisma.client.findUnique({
        where: { client_id: String(userId) },
      });
    } else if (userRole === 'admin') {
      user = await prisma.admin.findUnique({
        where: { admin_id: Number(userId) },
      });
    } else if (userRole === 'clientMember') {
      user = await prisma.clientMember.findUnique({
        where: { member_id: Number(userId) },
      });
    }

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }


    const otpRecord = await prisma.otpRecord.findFirst({
      where: {
        userId: userId,
        role: userRole,
        otp: otp,
      },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      await prisma.otpRecord.delete({
        where: { id: otpRecord.id },
      });
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    if (otpRecord.attempts >= 5) {
      await prisma.otpRecord.delete({
        where: { id: otpRecord.id },
      });
      return NextResponse.json({ error: 'Too many attempts. Please request a new OTP.' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
   if (userRole === 'client') {
  await prisma.client.update({
    where: { client_id: String(userId) },
    data: { client_password: hashedPassword },
  });
} else if (userRole === 'admin') {
  await prisma.admin.update({
    where: { admin_id: Number(userId) },
    data: { password: hashedPassword },
  });
} else if (userRole === 'clientMember') {
  await prisma.clientMember.update({
    where: { member_id: Number(userId) },
    data: { member_password: hashedPassword },
  });
}


    

    // Delete used OTP
    await prisma.otpRecord.delete({
      where: { id: otpRecord.id },
    });

    return NextResponse.json({ message: 'Password changed successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Change Password Error:', error);
    return NextResponse.json({ 
      error: 'Failed to change password. Please try again later.' 
    }, { status: 500 });
  }
};
