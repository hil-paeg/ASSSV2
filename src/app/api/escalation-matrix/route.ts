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

    // Get the client's contractual ticket to fetch the escalation matrix
    const contract = await prisma.contractualTicket.findUnique({
      where: {
        client_id: session.user.client_id,
      },
      select: {
        escalation_matrix: true,
      },
    });

    // Return the escalation matrix or an empty array if not set
    return NextResponse.json({
      escalationMatrix: contract?.escalation_matrix || [null, null, null],
    });
  } catch (error) {
    console.error('Error fetching escalation matrix:', error);
    return NextResponse.json(
      { error: 'Failed to fetch escalation matrix' },
      { status: 500 }
    );
  }
}
