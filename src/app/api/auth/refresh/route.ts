// /api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    // Verify refresh token (you'd store this in a database or secure cookie)
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: number; role: string; clientId?: number };

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role, clientId: decoded.clientId },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token: newAccessToken }, { status: 200 });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  } finally {
    await prisma.$disconnect();
  }
}