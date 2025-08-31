// File: app/admin/create-client/page.tsx
// This is the frontend page component for creating a client and adding members.
// Place this file in your Next.js project's app/admin/create-client directory.
// Ensure you have the app router enabled in Next.js (version 13+).

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ClientFormData {
  client_id: number;
  client_username: string;
  client_password: string;
  name: string;
  start_date: string; // YYYY-MM-DD format
  payment_cycle: string | null;
}

interface MemberFormData {
  member_name: string;
  designation: string;
  email: string;
  phone_number: string | null;
  escalation_level: number;
  member_username: string;
  member_password: string;
}

export default function CreateClientPage() {
  const router = useRouter();
  const [clientData, setClientData] = useState<ClientFormData>({
    client_id: 0,
    client_username: '',
    client_password: '',
    name: '',
    start_date: '',
    payment_cycle: null,
  });
  const [members, setMembers] = useState<MemberFormData[]>([]);
  const [newMember, setNewMember] = useState<MemberFormData>({
    member_name: '',
    designation: '',
    email: '',
    phone_number: '',
    escalation_level: 1,
    member_username: '',
    member_password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: name === 'client_id' || name === 'escalation_level' ? parseInt(value) || 0 : value,
    }));
  };

  const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({
      ...prev,
      [name]: name === 'escalation_level' ? parseInt(value) || 0 : value,
    }));
  };

  const addMember = () => {
    // Basic validation for uniqueness of escalation_level in members list
    if (members.some((m) => m.escalation_level === newMember.escalation_level)) {
      setError('Escalation level must be unique per client.');
      return;
    }
    setMembers((prev) => [...prev, newMember]);
    setNewMember({
      member_name: '',
      designation: '',
      email: '',
      phone_number: '',
      escalation_level: members.length + 2, // Increment default
      member_username: '',
      member_password: '',
    });
    setError(null);
  };

  const removeMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (clientData.client_id <= 0) {
      setError('Client ID must be a positive number.');
      return;
    }
    if (!clientData.client_username || !clientData.client_password || !clientData.name || !clientData.start_date) {
      setError('All client fields are required except payment cycle.');
      return;
    }

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: clientData, members }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create client.');
      }

      setSuccess('Client and members created successfully!');
      // Optionally redirect or reset form
      // router.push('/admin/clients');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Client</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit}>
        {/* Client Form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Client Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="client_id"
              placeholder="Client ID (manual)"
              value={clientData.client_id}
              onChange={handleClientChange}
              className="border p-2"
              required
            />
            <input
              type="text"
              name="client_username"
              placeholder="Client Username"
              value={clientData.client_username}
              onChange={handleClientChange}
              className="border p-2"
              required
            />
            <input
              type="password"
              name="client_password"
              placeholder="Client Password"
              value={clientData.client_password}
              onChange={handleClientChange}
              className="border p-2"
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={clientData.name}
              onChange={handleClientChange}
              className="border p-2"
              required
            />
            <input
              type="date"
              name="start_date"
              placeholder="Start Date"
              value={clientData.start_date}
              onChange={handleClientChange}
              className="border p-2"
              required
            />
            <select
              name="payment_cycle"
              value={clientData.payment_cycle || ''}
              onChange={handleClientChange}
              className="border p-2"
            >
              <option value="">Select Payment Cycle</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Members Form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Add Members</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="member_name"
              placeholder="Member Name"
              value={newMember.member_name}
              onChange={handleNewMemberChange}
              className="border p-2"
            />
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={newMember.designation}
              onChange={handleNewMemberChange}
              className="border p-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newMember.email}
              onChange={handleNewMemberChange}
              className="border p-2"
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={newMember.phone_number || ''}
              onChange={handleNewMemberChange}
              className="border p-2"
            />
            <input
              type="number"
              name="escalation_level"
              placeholder="Escalation Level"
              value={newMember.escalation_level}
              onChange={handleNewMemberChange}
              className="border p-2"
            />
            <input
              type="text"
              name="member_username"
              placeholder="Member Username"
              value={newMember.member_username}
              onChange={handleNewMemberChange}
              className="border p-2"
            />
            <input
              type="password"
              name="member_password"
              placeholder="Member Password"
              value={newMember.member_password}
              onChange={handleNewMemberChange}
              className="border p-2"
            />
          </div>
          <button type="button" onClick={addMember} className="bg-blue-500 text-white p-2 mb-4">
            Add Member
          </button>

          {/* List Added Members */}
          {members.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Added Members:</h3>
              <ul>
                {members.map((member, index) => (
                  <li key={index} className="mb-2 flex justify-between">
                    <span>{member.member_name} - Level {member.escalation_level}</span>
                    <button type="button" onClick={() => removeMember(index)} className="text-red-500">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button type="submit" className="bg-green-500 text-white p-2">
          Create Client and Members
        </button>
      </form>
    </div>
  );
}