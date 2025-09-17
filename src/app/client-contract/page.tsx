// app/clients/contract/page.tsx
// Client component file with "use client"

"use client";

import { useState, useTransition, useEffect } from "react";

import { getClients, createOrUpdateContract } from "../client-contract/action"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
export default function ClientContractPage() {
  const [clients, setClients] = useState<{ client_id: string; name: string }[]>([]);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createOrUpdateContract(formData);
      if (res?.success) {
        setSuccess(true);
        // Optional: Reset form or other logic
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Client Contract</h1>
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
          Form submitted successfully! Contract created/updated.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow">
        {/* Client dropdown */}
        <div>
          <label className="block text-sm font-medium">Select Client</label>
          <select name="client_id" required className="w-full border rounded-md p-2 mt-1">
            <option value="">-- Select Client --</option>
            {clients.map((client) => (
              <option key={client.client_id} value={client.client_id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Contract Details - simplified stacked layout */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Total Tickets</label>
            <input type="number" name="allowed_tickets" required className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Total Tickets Used</label>
            <input type="number" name="total_tickets_used" required className="w-full border rounded-md p-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium flex items-center gap-2">RS1 Tickets
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-700 cursor-default"><Info className="w-3 h-3" /></span>
                  </TooltipTrigger>
                  <TooltipContent>RS1 - Email assistance</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <input type="number" name="ticket_typeRS1" required className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">RS1 Tickets Used</label>
            <input type="number" name="ticket_typeRS1_used" required className="w-full border rounded-md p-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium flex items-center gap-2">RS2 Tickets
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-700 cursor-default"><Info className="w-3 h-3" /></span>
                  </TooltipTrigger>
                  <TooltipContent>RS2 - Equipment monitoring & System Maintenance</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <input type="number" name="ticket_typeRS2" required className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">RS2 Tickets Used</label>
            <input type="number" name="ticket_typeRS2_used" required className="w-full border rounded-md p-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium flex items-center gap-2">RS3-1 Tickets
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-700 cursor-default"><Info className="w-3 h-3" /></span>
                  </TooltipTrigger>
                  <TooltipContent>RS3-1 - Troubleshooting support & support</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <input type="number" name="ticket_typeRS3_1" required className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">RS3-1 Tickets Used</label>
            <input type="number" name="ticket_typeRS3_1_used" required className="w-full border rounded-md p-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium flex items-center gap-2">RS3-2 Tickets
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-700 cursor-default"><Info className="w-3 h-3" /></span>
                  </TooltipTrigger>
                  <TooltipContent>RS3-2 - Support service</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <input type="number" name="ticket_typeRS3_2" required className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">RS3-2 Tickets Used</label>
            <input type="number" name="ticket_typeRS3_2_used" required className="w-full border rounded-md p-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium">Site visit Frequency</label>
            <input type="number" name="site_visit_frequency" required className="w-full border rounded-md p-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">First Site visit date</label>
            <input type="date" name="site_visit_date" required className="w-full border rounded-md p-2 mt-1" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Contract"}
        </button>
      </form>
    </div>
  );
}