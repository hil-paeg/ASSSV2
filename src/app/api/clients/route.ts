// File: app/api/clients/route.ts
// This is the backend API route handler for creating clients and members.
// Place this file in your Next.js project's app/api/clients directory.
// This uses Next.js API routes with the app router.

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { client, members } = body;

    // Validate input
    if (!client || !client.client_id || typeof client.client_id !== 'number') {
      return NextResponse.json({ error: 'Invalid client data' }, { status: 400 });
    }

    // Create client
    const createdClient = await prisma.client.create({
      data: {
        client_id: client.client_id,
        client_username: client.client_username,
        client_password: client.client_password, // Note: In production, hash passwords!
        name: client.name,
        start_date: new Date(client.start_date),
        payment_cycle: client.payment_cycle || null,
      },
    });

    // Create members if any
    if (members && members.length > 0) {
      await prisma.clientMember.createMany({
        data: members.map((member: any) => ({
          client_id: createdClient.client_id,
          member_name: member.member_name,
          designation: member.designation,
          email: member.email,
          phone_number: member.phone_number || null,
          escalation_level: member.escalation_level,
          member_username: member.member_username,
          member_password: member.member_password, // Note: In production, hash passwords!
        })),
      });
    }

    return NextResponse.json({ success: true, client: createdClient }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') { // Unique constraint violation
      return NextResponse.json({ error: 'Client ID or unique fields already exist.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}