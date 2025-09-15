


// import { NextRequest, NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';
// import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Generate a 6-digit OTP
// function generateOTP(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// export async function POST(request: NextRequest) {
//   try {
//     // Get the authorization header
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
//     }

//     const token = authHeader.substring(7);
    
//     // Verify JWT token
//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     } catch (error) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }

//     const { userId, role } = decoded;
    
//     // Find the user based on role
//     let user: any = null;
//     let userEmail: string = '';
//     let userName: string = '';

//     if (role === 'client') {
//       user = await prisma.client.findUnique({
//         where: { client_id: userId },
//       });
//       if (user) {
//         userEmail = user.email || '';
//         userName = user.name;
//       }
//     } else if (role === 'admin') {
//       user = await prisma.admin.findUnique({
//         where: { admin_id: userId },
//       });
//       if (user) {
//         userEmail = user.email || '';
//         userName = user.name;
//       }
//     }

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     if (!userEmail) {
//       return NextResponse.json({ error: 'No email address found for this user' }, { status: 400 });
//     }

//     // Generate OTP
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

//     // Delete any existing OTP records for this user
//     await prisma.otpRecord.deleteMany({
//       where: {
//         userId: userId,
//         role: role,
//       },
//     });

//     // Create new OTP record
//     await prisma.otpRecord.create({
//       data: {
//         userId: userId,
//         role: role,
//         otp: otp,
//         expiresAt: otpExpiry,
//         attempts: 0,
//       },
//     });

//     // Create transporter - CORRECTED METHOD NAME
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.SMTP_USER!,
//         pass: process.env.SMTP_PASS!,
//       },
//     });

//     // Verify transporter
//     await transporter.verify();

//     // Email content
//     const mailOptions = {
//       from: process.env.SMTP_FROM!,
//       to: userEmail,
//       subject: 'Password Reset OTP - ASSS System',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="text-align: center; margin-bottom: 30px;">
//             <h1 style="color: #2563eb; margin: 0;">ASSS System</h1>
//             <h2 style="color: #333; margin: 10px 0;">Password Reset Request</h2>
//           </div>
          
//           <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin: 20px 0;">
//             <p style="margin: 0 0 15px 0; font-size: 16px;">Hello <strong>${userName}</strong>,</p>
//             <p style="margin: 0 0 20px 0;">You have requested to reset your password. Please use the following OTP to proceed:</p>
            
//             <div style="background-color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; border: 2px dashed #2563eb;">
//               <h1 style="color: #2563eb; font-size: 36px; margin: 0; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
//             </div>
            
//             <div style="background-color: #fef3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
//               <p style="margin: 0; color: #92400e; font-weight: 500;">⚠️ Important:</p>
//               <ul style="margin: 10px 0 0 0; color: #92400e;">
//                 <li>This OTP is valid for <strong>10 minutes</strong> only</li>
//                 <li>Do not share this OTP with anyone</li>
//                 <li>If you didn't request this, please ignore this email</li>
//               </ul>
//             </div>
//           </div>
          
//           <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
//           <div style="text-align: center;">
//             <p style="color: #6b7280; font-size: 12px; margin: 0;">
//               This is an automated message from ASSS System. Please do not reply to this email.
//             </p>
//             <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
//               If you need assistance, please contact your system administrator.
//             </p>
//           </div>
//         </div>
//       `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     return NextResponse.json({ 
//       message: 'OTP sent successfully to your email address' 
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Send OTP Error:', error);
//     return NextResponse.json({ 
//       error: 'Failed to send OTP. Please try again later.' 
//     }, { status: 500 });
//   }
// }




// import { NextRequest, NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';
// import jwt from 'jsonwebtoken';
// import prisma from '@/lib/prisma';

// // Generate a 6-digit OTP
// function generateOTP(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// export async function POST(request: NextRequest) {
//   console.log('POST /api/auth/send-otp: Request received', {
//     headers: Object.fromEntries(request.headers),
//     timestamp: new Date().toISOString(),
//   });

//   let decoded: any = null;
//   let email: string | null = null;

//   try {
//     // Get the authorization header
//     const authHeader = request.headers.get('authorization');
//     console.log('Authorization header:', authHeader || 'None');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       console.error('Missing or invalid Authorization header');
//       return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
//     }

//     const token = authHeader.substring(7);
//     console.log('Extracted JWT token:', token.slice(0, 10) + '...');

//     // Verify JWT token
//     try {
//       console.log('Verifying JWT token...');
//       decoded = jwt.verify(token, process.env.JWT_SECRET!);
//       console.log('JWT decoded successfully:', {
//         id: decoded.id,
//         role: decoded.role,
//         username: decoded.username,
//         clientId: decoded.clientId,
//       });
//     } catch (error) {
//       console.error('JWT verification failed:', {
//         error: error.message,
//         stack: error.stack,
//       });
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }

//     const { id, role } = decoded;

//     // Validate role
//     if (!['client', 'admin', 'clientMember'].includes(role)) {
//       console.error('Invalid role in JWT:', role);
//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     // Get email from request body
//     const body = await request.json();
//     email = body.email;
//     console.log('Received email from request:', email);
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       console.error('Invalid or missing email in request:', email);
//       return NextResponse.json({ error: 'Valid email address required' }, { status: 400 });
//     }

//     // Find the user based on role
//     let user: any = null;
//     let userName: string = '';

//     console.log('Looking up user:', { id, role });
//     if (role === 'client') {
//       user = await prisma.client.findUnique({
//         where: { client_id: id },
//       });
//       if (user) {
//         userName = user.name;
//       }
//     } else if (role === 'admin') {
//       user = await prisma.admin.findUnique({
//         where: { admin_id: id },
//       });
//       if (user) {
//         userName = user.name;
//       }
//     } else if (role === 'clientMember') {
//       user = await prisma.clientMember.findUnique({
//         where: { member_id: id },
//       });
//       if (user) {
//         userName = user.member_name;
//       }
//     }

//     console.log('User lookup result:', {
//       found: !!user,
//       emailInDb: user?.email || 'None',
//       name: userName || 'None',
//     });

//     if (!user) {
//       console.error('User not found for ID:', id, 'Role:', role);
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     // Optional: Verify provided email matches DB email (for security)
//     // Uncomment if you want to restrict to registered email
//     /*
//     if (user.email && user.email !== email) {
//       console.error('Provided email does not match user’s stored email:', {
//         provided: email,
//         stored: user.email,
//       });
//       return NextResponse.json({ error: 'Provided email does not match account email' }, { status: 400 });
//     }
//     */

//     // Generate OTP
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
//     console.log('Generated OTP:', {
//       otp: otp.slice(0, 2) + '****', // Mask OTP for security
//       expiresAt: otpExpiry.toISOString(),
//     });

//     // Delete existing OTP records
//     console.log('Deleting existing OTP records for:', { userId: id, role });
//     const deleteResult = await prisma.otpRecord.deleteMany({
//       where: {
//         userId: id,
//         role: role,
//       },
//     });
//     console.log('Deleted OTP records:', { count: deleteResult.count });

//     // Create new OTP record
//     console.log('Creating new OTP record...');
//     await prisma.otpRecord.create({
//       data: {
//         userId: id,
//         role: role,
//         otp: otp,
//         expiresAt: otpExpiry,
//         attempts: 0,
//       },
//     });
//     console.log('OTP record created successfully');

//     // Create transporter
//     console.log('Setting up email transporter:', {
//       user: process.env.SMTP_USER,
//       from: process.env.SMTP_FROM,
//     });
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: true, // Use SSL/TLS
//       auth: {
//         user: process.env.SMTP_USER!,
//         pass: process.env.SMTP_PASS!,
//       },
//       logger: true, // Enable nodemailer logging
//       debug: true, // Include debug info
//     });

//     // Verify transporter
//     try {
//       console.log('Verifying email transporter...');
//       await transporter.verify();
//       console.log('Transporter verified successfully');
//     } catch (error) {
//       console.error('Transporter verification failed:', {
//         error: error.message,
//         stack: error.stack,
//         code: error.code,
//         errno: error.errno,
//         smtpUser: process.env.SMTP_USER,
//       });
//       throw error;
//     }

//     // Email content
//     const mailOptions = {
//       from: process.env.SMTP_FROM!,
//       to: email,
//       subject: 'Password Reset OTP - ASSS System',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="text-align: center; margin-bottom: 30px;">
//             <h1 style="color: #2563eb; margin: 0;">ASSS System</h1>
//             <h2 style="color: #333; margin: 10px 0;">Password Reset Request</h2>
//           </div>
          
//           <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin: 20px 0;">
//             <p style="margin: 0 0 15px 0; font-size: 16px;">Hello <strong>${userName}</strong>,</p>
//             <p style="margin: 0 0 20px 0;">You have requested to reset your password. Please use the following OTP to proceed:</p>
            
//             <div style="background-color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; border: 2px dashed #2563eb;">
//               <h1 style="color: #2563eb; font-size: 36px; margin: 0; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
//             </div>
            
//             <div style="background-color: #fef3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
//               <p style="margin: 0; color: #92400e; font-weight: 500;">⚠️ Important:</p>
//               <ul style="margin: 10px 0 0 0; color: #92400e;">
//                 <li>This OTP is valid for <strong>10 minutes</strong> only</li>
//                 <li>Do not share this OTP with anyone</li>
//                 <li>If you didn't request this, please ignore this email</li>
//               </ul>
//             </div>
//           </div>
          
//           <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
//           <div style="text-align: center;">
//             <p style="color: #6b7280; font-size: 12px; margin: 0;">
//               This is an automated message from ASSS System. Please do not reply to this email.
//             </p>
//             <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
//               If you need assistance, please contact your system administrator.
//             </p>
//           </div>
//         </div>
//       `,
//     };

//     // Send email
//     console.log('Sending email to:', email);
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully to:', email);

//     return NextResponse.json(
//       {
//         message: 'OTP sent successfully to your email address',
//         email,
//         userId: id,
//         userRole: role,
//         timestamp: new Date().toISOString(),
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Send OTP Error:', {
//       error: error.message,
//       stack: error.stack,
//       code: error.code,
//       errno: error.errno,
//       userId: decoded?.id,
//       role: decoded?.role,
//       emailAttempted: email || 'None',
//       timestamp: new Date().toISOString(),
//     });
//     return NextResponse.json(
//       {
//         error: 'Failed to send OTP. Please try again later.',
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   } finally {
//     console.log('Disconnecting Prisma client');
//     await prisma.$disconnect();
//   }
// }




import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  console.log('POST /api/auth/send-otp: Request received', {
    headers: Object.fromEntries(request.headers),
    timestamp: new Date().toISOString(),
  });

  let decoded: any = null;
  let email: string | null = null;

  try {
    // Log environment variables
    console.log('Environment variables:', {
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
      smtpPass: process.env.SMTP_PASS ? '****' : 'undefined',
      smtpFrom: process.env.SMTP_FROM,
      smtpName: process.env.SMTP_NAME,
    });

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    console.log('Authorization header:', authHeader || 'None');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('Extracted JWT token:', token.slice(0, 10) + '...');

    // Verify JWT token
    try {
      console.log('Verifying JWT token...');
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log('JWT decoded successfully:', {
        id: decoded.id,
        role: decoded.role,
        username: decoded.username,
        clientId: decoded.clientId,
      });
    } catch (error) {
      console.error('JWT verification failed:', {
        error: error.message,
        stack: error.stack,
      });
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id, role } = decoded;

    // Validate role
    if (!['client', 'admin', 'clientMember'].includes(role)) {
      console.error('Invalid role in JWT:', role);
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Get email from request body
    const body = await request.json();
    email = body.email;
    console.log('Received email from request:', email);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error('Invalid or missing email in request:', email);
      return NextResponse.json({ error: 'Valid email address required' }, { status: 400 });
    }

    // Find the user based on role
    let user: any = null;
    let userName: string = '';

    console.log('Looking up user:', { id, role });
    if (role === 'client') {
      user = await prisma.client.findUnique({
        where: { client_id: id },
      });
      if (user) {
        userName = user.name;
      }
    } else if (role === 'admin') {
      user = await prisma.admin.findUnique({
        where: { admin_id: id },
      });
      if (user) {
        userName = user.name;
      }
    } else if (role === 'clientMember') {
      user = await prisma.clientMember.findUnique({
        where: { member_id: id },
      });
      if (user) {
        userName = user.member_name;
      }
    }

    console.log('User lookup result:', {
      found: !!user,
      emailInDb: user?.email || 'None',
      name: userName || 'None',
    });

    if (!user) {
      console.error('User not found for ID:', id, 'Role:', role);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    console.log('Generated OTP:', {
      otp: otp.slice(0, 2) + '****', // Mask OTP for security
      expiresAt: otpExpiry.toISOString(),
    });

    // Delete existing OTP records
    console.log('Deleting existing OTP records for:', { userId: id, role });
    const deleteResult = await prisma.otpRecord.deleteMany({
      where: {
        userId: id,
        role: role,
      },
    });
    console.log('Deleted OTP records:', { count: deleteResult.count });

    // Create new OTP record
    console.log('Creating new OTP record...');
    await prisma.otpRecord.create({
      data: {
        userId: id,
        role: role,
        otp: otp,
        expiresAt: otpExpiry,
        attempts: 0,
      },
    });
    console.log('OTP record created successfully');

    // Create transporter
    console.log('Setting up email transporter:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
    });
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false, // Use STARTTLS for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      logger: true,
      debug: true,
      tls: {
        rejectUnauthorized: true, // Enforce strict TLS validation
      },
    });

    // Verify transporter
    try {
      console.log('Verifying email transporter...');
      await transporter.verify();
      console.log('Transporter verified successfully');
    } catch (error) {
      console.error('Transporter verification failed:', {
        error: error.message,
        stack: error.stack,
        code: error.code,
        errno: error.errno,
        smtpUser: process.env.SMTP_USER,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
      });
      throw error;
    }

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM!,
      to: email,
      subject: 'Password Reset OTP - ASSS System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">ASSS System</h1>
            <h2 style="color: #333; margin: 10px 0;">Password Reset Request</h2>
          </div>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; font-size: 16px;">Hello <strong>${userName}</strong>,</p>
            <p style="margin: 0 0 20px 0;">You have requested to reset your password. Please use the following OTP to proceed:</p>
            
            <div style="background-color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; border: 2px dashed #2563eb;">
              <h1 style="color: #2563eb; font-size: 36px; margin: 0; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
            </div>
            
            <div style="background-color: #fef3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: 500;">⚠️ Important:</p>
              <ul style="margin: 10px 0 0 0; color: #92400e;">
                <li>This OTP is valid for <strong>10 minutes</strong> only</li>
                <li>Do not share this OTP with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <div style="text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This is an automated message from ASSS System. Please do not reply to this email.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
              If you need assistance, please contact your system administrator.
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    console.log('Sending email to:', email);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);

    return NextResponse.json(
      {
        message: 'OTP sent successfully to your email address',
        email,
        userId: id,
        userRole: role,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send OTP Error:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      userId: decoded?.id,
      role: decoded?.role,
      emailAttempted: email || 'None',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      {
        error: 'Failed to send OTP. Please try again later.',
        details: error.message,
      },
      { status: 500 }
    );
  } 
}
// src/app/api/auth/send-otp/route.ts

// src/app/api/auth/send-otp/route.ts







// app/api/auth/send-otp/route.js

// export async function POST(request) {
//   // Process the request body
//   const { email } = await request.json();

//   // Example response
//   return new Response(
//     JSON.stringify({ message: `OTP sent to ${email}` }),
//     { status: 200 }
//   );
// }
// import nodemailer from 'nodemailer';

// export async function GET() {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT),
//       secure: false, // Use TLS
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.SMTP_FROM,
//       to: 'vupadhye944@gmail.com',
//       subject: 'Static Test Email from Next.js',
//       text: 'Hello! This is a static test email sent from my Next.js app.',
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log('Email sent:', info.response);

//     return new Response(
//       JSON.stringify({ message: 'Email sent successfully!', info }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error sending static email:', error);
//     return new Response(
//       JSON.stringify({ message: 'Failed to send email', error: error.message }),
//       { status: 500 }
//     );
//   }
// };

