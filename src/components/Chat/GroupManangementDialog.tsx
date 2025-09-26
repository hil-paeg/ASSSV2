import React, { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  groupData?: { id: string; name: string; members?: string[] };
  onSubmit: (payload: { id?: string; name: string; members: string[]; clientMembers?: Record<string, string[]> }) => void;
  onDeleteGroup?: (id: string) => void;
};

// Replace  extend this with real clients and employees from your API
const CLIENTS = [
  { id: "JSL", name: "JSL Corporation" },
  { id: "TSK", name: "TSK Industries" },
  { id: "AMNSI", name: "AMNSI Ltd" },
  { id: "URJAA", name: "URJAA Group" },
];


// Example employees per client (replace with API)
const EMPLOYEES_BY_CLIENT: Record<string, { id: string; name: string }[]> = {
  JSL: [
    { id: "JSL-emp1", name: "emp1" },
    { id: "JSL-emp2", name: "emp2" },
    { id: "JSL-emp3", name: "emp3" },
    { id: "JSL-emp4", name: "emp4" },
  ],
  TSK: [
    { id: "TSK-emp1", name: "emp1" },
    { id: "TSK-emp2", name: "emp2" },
  ],
  AMNSI: [
    { id: "AMNSI-emp1", name: "emp1" },
    { id: "AMNSI-emp2", name: "emp2" },
    { id: "AMNSI-emp3", name: "emp3" },
  ],
  URJAA: [
    { id: "URJAA-emp1", name: "emp1" },
  ],
};

export default function GroupManagementDialog({ isOpen, onClose, mode, groupData, onSubmit, onDeleteGroup }: Props) {
  const [name, setName] = useState(groupData?.name ?? "");
  // selectedClients holds client ids that are part of the group
  const [selectedClients, setSelectedClients] = useState<string[]>(groupData?.members ? [...groupData.members] : []);
  // map clientId -> selected employee ids for that client
  const [clientMembers, setClientMembers] = useState<Record<string, string[]>>({});
  // which client's employee panel is open (null = none)
  const [openClientEmployees, setOpenClientEmployees] = useState<string | null>(null);

  useEffect(() => {
    setName(groupData?.name ?? "");
    if (groupData?.members) {
      // try to distribute existing member ids by client
      const mapping: Record<string, string[]> = {};
      groupData.members.forEach((mid) => {
        for (const cid of Object.keys(EMPLOYEES_BY_CLIENT)) {
          if (EMPLOYEES_BY_CLIENT[cid].some(e => e.id === mid)) {
            mapping[cid] = mapping[cid] || [];
            mapping[cid].push(mid);
            if (!selectedClients.includes(cid)) {
              setSelectedClients(prev => prev.includes(cid) ? prev : [...prev, cid]);
            }
          }
        }
      });
      setClientMembers(mapping);
    } else {
      setClientMembers({});
      setSelectedClients([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData, isOpen]);

  if (!isOpen) return null;

  function toggleClient(clientId: string) {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        // remove client and its selected employees
        const next = prev.filter(c => c !== clientId);
        setClientMembers(cm => {
          const copy = { ...cm };
          delete copy[clientId];
          return copy;
        });
        // close employee panel if open for this client
        setOpenClientEmployees(prevOpen => prevOpen === clientId ? null : prevOpen);
        return next;
      }
      return [...prev, clientId];
    });
  }

  function toggleEmployeeForClient(clientId: string, empId: string) {
    setClientMembers(prev => {
      const list = new Set(prev[clientId] ?? []);
      if (list.has(empId)) list.delete(empId); else list.add(empId);
      return { ...prev, [clientId]: Array.from(list) };
    });
  }

  function selectAllEmployees(clientId: string) {
    setClientMembers(prev => ({ ...prev, [clientId]: (EMPLOYEES_BY_CLIENT[clientId] || []).map(e => e.id) }));
  }

  function clearAllEmployees(clientId: string) {
    setClientMembers(prev => {
      const copy = { ...prev };
      delete copy[clientId];
      return copy;
    });
  }

  function handleSubmit() {
    // flatten selected employee ids to a members array (or fallback to empty)
    const members = Object.values(clientMembers).flat();
    onSubmit({
      id: groupData?.id,
      name,
      members,
      clientMembers,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg w-[720px] max-w-full z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{mode === "create" ? "Create New Group" : "Edit Group"}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter group name" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Clients</label>
            <div className="grid grid-cols-1 gap-2">
              {CLIENTS.map(c => {
                const isSelected = selectedClients.includes(c.id);
                return (
                  <div key={c.id} className="border rounded p-2 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer" onClick={() => toggleClient(c.id)}>
                          <input type="checkbox" checked={isSelected} readOnly />
                          <div className="text-sm font-medium">{c.name}</div>
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* open employee selector only for selected clients */}
                        <button
                          type="button"
                          className="text-sm text-blue-600"
                          onClick={() => setOpenClientEmployees(prev => prev === c.id ? null : c.id)}
                          disabled={!isSelected}
                        >
                          {openClientEmployees === c.id ? 'Close employees' : 'Select employees'}
                        </button>
                      </div>
                    </div>

                    {/* inline employee panel */}
                    {openClientEmployees === c.id && (
                      <div className="mt-3 border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">Employees for {c.name}</div>
                          <div className="flex items-center gap-2">
                            <button type="button" className="text-xs text-blue-600" onClick={() => selectAllEmployees(c.id)}>Select all</button>
                            <button type="button" className="text-xs text-gray-600" onClick={() => clearAllEmployees(c.id)}>Clear</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {(EMPLOYEES_BY_CLIENT[c.id] || []).map(emp => {
                            const selectedSet = new Set(clientMembers[c.id] ?? []);
                            return (
                              <label key={emp.id} className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedSet.has(emp.id)}
                                  onChange={() => {
                                    // ensure client is selected when picking employees
                                    if (!isSelected) toggleClient(c.id);
                                    toggleEmployeeForClient(c.id, emp.id);
                                  }}
                                />
                                <div className="text-sm">{emp.name}</div>
                              </label>
                            );
                          })}
                          {(EMPLOYEES_BY_CLIENT[c.id] || []).length === 0 && <div className="text-sm text-gray-500">No employees for this client</div>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary of selected clients / employees */}
          {selectedClients.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Selected Clients & Employees:</p>
              <div className="space-y-2">
                {selectedClients.map(cid => (
                  <div key={cid} className="flex items-start gap-3">
                    <div className="text-sm font-medium">{CLIENTS.find(x => x.id === cid)?.name ?? cid}</div>
                    <div className="flex flex-wrap gap-2">
                      {(clientMembers[cid] ?? []).map(mid => {
                        const emp = (EMPLOYEES_BY_CLIENT[cid] ?? []).find(e => e.id === mid);
                        return (
                          <div key={mid} className="text-sm rounded-full bg-blue-100 px-3 py-1">
                            {emp?.name ?? mid}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {mode === "edit" && groupData?.id && onDeleteGroup && (
            <button className="px-3 py-2 rounded bg-red-600 text-white" onClick={() => onDeleteGroup(groupData.id)}>Delete</button>
          )}
          <button className="px-3 py-2 rounded border" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSubmit}>{mode === "create" ? "Create Group" : "Save"}</button>
        </div>
      </div>
    </div>
  );
};
