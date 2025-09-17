import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import prisma from '@/lib/db';
import prisma from '@/lib/prisma';
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { level, adminId } = await request.json();

    // Get the current escalation matrix
    const contract = await prisma.contractualTicket.findUnique({
      where: {
        client_id: session.user.client_id,
      },
      select: {
        escalation_matrix: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    // Update the escalation matrix
    const currentMatrix = contract.escalation_matrix || [null, null, null];
    const updatedMatrix = [...currentMatrix];
    updatedMatrix[level - 1] = adminId;

    // Update the contract with the new escalation matrix
    await prisma.contractualTicket.update({
      where: {
        client_id: session.user.client_id,
      },
      data: {
        escalation_matrix: updatedMatrix,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating escalation matrix:', error);
    return NextResponse.json(
      { error: 'Failed to update escalation matrix' },
      { status: 500 }
    );
  }
}
