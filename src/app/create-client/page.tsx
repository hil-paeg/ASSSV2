// app/clients/new/page.tsx
import NewClientForm from '@/components/Create-client/NewClientForm'
// import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import {prisma} from '@/lib/prisma'

export const metadata = { title: 'Create Client' }

async function createClient(formData: FormData) {
  'use server'

  // --- read scalar client fields
  const name = String(formData.get('name') || '').trim()
  const start_date = String(formData.get('start_date') || '')
  const payment_cycle = String(formData.get('payment_cycle') || '')
  const allowed_tickets = formData.get('allowed_tickets')
    ? Number(formData.get('allowed_tickets'))
    : null

  const membersJson = String(formData.get('members') || '[]')
  let members: Array<{
    member_name: string
    designation: string
    email: string
    phone_number?: string
    escalation_level: number
  }> = []

  try {
    members = JSON.parse(membersJson)
  } catch {
    throw new Error('Invalid members payload')
  }

  // --- basic validation
  if (!name) throw new Error('Client name is required')
  if (!start_date) throw new Error('Start date is required')
  if (members.length > 5) throw new Error('Maximum 5 members allowed')

  const levels = members.map(m => m.escalation_level)
  const uniqueLevels = new Set(levels)
  if (uniqueLevels.size !== levels.length) {
    throw new Error('Escalation levels must be unique per client')
  }
  if (levels.some(l => l < 1 || l > 5)) {
    throw new Error('Escalation levels must be between 1 and 5')
  }

  // --- create client + members in a transaction
  const client = await prisma.$transaction(async (tx) => {
    const created = await tx.clientInfo.create({
      data: {
        name,
        start_date: new Date(start_date),
        payment_cycle: payment_cycle || null,
        allowed_tickets: allowed_tickets ?? null,
        members: {
          create: members.map(m => ({
            member_name: m.member_name,
            designation: m.designation,
            email: m.email,
            phone_number: m.phone_number ?? null,
            escalation_level: Number(m.escalation_level),
          })),
        },
      },
      include: { members: true },
    })
    return created
  })

  // go to the client details page (you can change this route)
  redirect(`/clients/${client.client_id}`)
}

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Create New Client</h1>
      <NewClientForm action={createClient} />
    </div>
  )
}
