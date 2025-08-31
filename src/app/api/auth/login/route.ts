
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';
const ADMIN_USERNAME = 'admin@gmail.com';
const ADMIN_PASSWORD = 'password';

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json();

    if (!username || !password || !role) {
      return NextResponse.json({ error: 'Missing username, password, or role' }, { status: 400 });
    }

    if (role === 'admin') {
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
      }

      // Generate JWT for admin
      const token = jwt.sign({ id: username, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
      return NextResponse.json({ token, role: 'admin', id: username }, { status: 200 });
    } else if (role === 'user') {
      // Check Client table
      const client = await prisma.client.findFirst({
        where: { client_username: username },
      });

      if (client && client.client_password === password) {
        // Generate JWT for client
        const token = jwt.sign({ id: client.client_id, role: 'client' }, JWT_SECRET, { expiresIn: '1h' });
        return NextResponse.json({ token, role: 'client', id: client.client_id }, { status: 200 });
      }

      // Check ClientMember table
      const clientMember = await prisma.clientMember.findFirst({
        where: { member_username: username },
      });

      if (clientMember && clientMember.member_password === password) {
        // Generate JWT for client member
        const token = jwt.sign(
          { id: clientMember.member_id, role: 'clientMember', clientId: clientMember.client_id },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
        return NextResponse.json(
          { token, role: 'clientMember', id: clientMember.member_id, clientId: clientMember.client_id },
          { status: 200 }
        );
      }

      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}