"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getClientDetails, updateClient } from "@/app/actions/client-actions";

export default function UpdateClientPage() {
  const params = useParams();
  const clientId = decodeURIComponent(String(params.clientId));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    client_id: clientId,
    client_username: "",
    name: "",
    start_date: "",
    payment_cycle: "" as string | null,
  });
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const details = await getClientDetails(clientId);
        setForm({
          client_id: details.client_id,
          client_username: details.client_username,
          name: details.name,
          start_date: details.start_date,
          payment_cycle: details.payment_cycle || "",
        });
      } catch (e: any) {
        setError(e.message || "Failed to load client details");
      } finally {
        setLoading(false);
      }
    })();
  }, [clientId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await updateClient({
        client_id: form.client_id,
        client_username: form.client_username,
        name: form.name,
        start_date: form.start_date,
        payment_cycle: form.payment_cycle || null,
        client_password: "",
      } as any);
      setSuccess("Client updated successfully");
    } catch (e: any) {
      setError(e.message || "Failed to update client");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Update Client</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      {!loading && (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Client Username (email)</label>
            <input className="border p-2 w-full" name="client_username" value={form.client_username} onChange={onChange} />
          </div>
          <div>
            <label className="block text-sm">Name</label>
            <input className="border p-2 w-full" name="name" value={form.name} onChange={onChange} />
          </div>
          <div>
            <label className="block text-sm">Start Date</label>
            <input type="date" className="border p-2 w-full" name="start_date" value={form.start_date} onChange={onChange} />
          </div>
          <div>
            <label className="block text-sm">Payment Cycle</label>
            <select className="border p-2 w-full" name="payment_cycle" value={form.payment_cycle || ""} onChange={onChange}>
              <option value="">Select</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          <button className="border px-3 py-2 rounded">Save</button>
        </form>
      )}
    </div>
  );
}


