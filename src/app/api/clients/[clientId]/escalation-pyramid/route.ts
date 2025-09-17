// src/app/api/client/[clientId]/escalation-pyramid/route.ts
import { NextResponse } from 'next/server';
import { getClientDetails } from '@/app/actions/client-actions';

export async function GET(req: Request, { params }: { params: { clientId: string } }) {
  try {
    const client = await getClientDetails(params.clientId);

    if (!client?.contract?.escalation_admins) {
      return NextResponse.json({ error: 'Escalation pyramid not found' }, { status: 404 });
    }

    return NextResponse.json(client.contract.escalation_admins);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch escalation pyramid' }, { status: 500 });
  }
}
