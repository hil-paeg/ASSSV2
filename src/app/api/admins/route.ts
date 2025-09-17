import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import prisma from '@/lib/db';
import prisma from '@/lib/prisma';
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all admins
    const admins = await prisma.admin.findMany({
      select: {
        admin_id: true,
        name: true,
        designation: true,
        email: true,
        mobile_number: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}
