// components/NewClientForm.tsx
'use client'

import { useState, useMemo } from 'react'
import { useFormStatus } from 'react-dom'

type Member = {
  member_name: string
  designation: string
  email: string
  phone_number?: string
  escalation_level: number | ''
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl border px-4 py-2 shadow hover:shadow-md disabled:opacity-50"
    >
      {pending ? 'Saving…' : 'Create Client'}
    </button>
  )
}

export default function NewClientForm({
  action,
}: {
  action: (formData: FormData) => void
}) {
  const [members, setMembers] = useState<Member[]>([
    { member_name: '', designation: '', email: '', phone_number: '', escalation_level: 1 },
  ])

  const remaining = 5 - members.length

  const membersJson = useMemo(() => JSON.stringify(members), [members])

  const addMember = () => {
    if (members.length >= 5) return
    // find first available escalation level 1..5
    const used = new Set(members.map(m => Number(m.escalation_level)))
    const firstFree = [1, 2, 3, 4, 5].find(n => !used.has(n)) ?? 1
    setMembers(prev => [
      ...prev,
      { member_name: '', designation: '', email: '', phone_number: '', escalation_level: firstFree },
    ])
  }

  const removeMember = (idx: number) => {
    setMembers(prev => prev.filter((_, i) => i !== idx))
  }

  const update = (idx: number, key: keyof Member, value: string | number) => {
    setMembers(prev => prev.map((m, i) => (i === idx ? { ...m, [key]: value } : m)))
  }

  const usedLevels = new Set(members.map(m => Number(m.escalation_level)))

  return (
    <form action={action} className="space-y-8">
      {/* Client fields */}
      <div className="rounded-2xl border p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Client Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Client Name</label>
            <input
              name="name"
              required
              placeholder="AMNSI"
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Start Date</label>
            <input
              type="date"
              name="start_date"
              required
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Payment Cycle</label>
            <select name="payment_cycle" className="w-full rounded-xl border px-3 py-2">
              <option value="">Select…</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm">Allowed Tickets (optional)</label>
            <input
              type="number"
              name="allowed_tickets"
              min={0}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="rounded-2xl border p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            Members (Admins) <span className="text-sm text-gray-500">max 5</span>
          </h2>
          <button
            type="button"
            onClick={addMember}
            disabled={members.length >= 5}
            className="rounded-xl border px-3 py-2 text-sm shadow hover:shadow-md disabled:opacity-50"
          >
            + Add Member ({remaining} left)
          </button>
        </div>

        <div className="space-y-5">
          {members.map((m, idx) => (
            <div key={idx} className="rounded-xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium">Member #{idx + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeMember(idx)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm">Designation</label>
                  <input
                    placeholder="Electrical Admin"
                    value={m.designation}
                    onChange={e => update(idx, 'designation', e.target.value)}
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm">Member Name</label>
                  <input
                    placeholder="Rajesh Kumar"
                    value={m.member_name}
                    onChange={e => update(idx, 'member_name', e.target.value)}
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm">Email</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={m.email}
                    onChange={e => update(idx, 'email', e.target.value)}
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm">Phone</label>
                  <input
                    placeholder="+91 98xxxxxxx"
                    value={m.phone_number || ''}
                    onChange={e => update(idx, 'phone_number', e.target.value)}
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm">Escalation Level (1–5)</label>
                  <select
                    value={m.escalation_level}
                    onChange={e => update(idx, 'escalation_level', Number(e.target.value))}
                    className="w-full rounded-xl border px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <option key={lvl} value={lvl} disabled={m.escalation_level !== lvl && usedLevels.has(lvl)}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">5 is the top level.</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hidden JSON payload for server action */}
        <input type="hidden" name="members" value={membersJson} />
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
