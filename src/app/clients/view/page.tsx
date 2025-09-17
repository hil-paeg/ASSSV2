"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getClients } from "@/app/actions/client-actions";

export default function ClientsViewPage() {
  const [clients, setClients] = useState<{ client_id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await getClients();
        // Normalize types to string for client_id for linking
        setClients(list.map((c: any) => ({ client_id: String(c.client_id), name: c.name })));
      } catch (e: any) {
        setError(e.message || "Failed to load clients");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="rounded-2xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Client ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.client_id} className="border-b">
                <td className="p-3">{c.client_id}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3 space-x-3">
                  <Link className="text-blue-600 underline" href={`/clients/update/${encodeURIComponent(c.client_id)}`}>Update</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


