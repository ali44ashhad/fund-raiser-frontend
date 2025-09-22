// src/components/admin/TicketManagement.jsx
import { useState, useEffect } from "react";
import adminAPI from "../../services/admin";
import { formatDate } from "../../utils/helpers";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // id for action spinner

  // Local mock (used if backend not available)
  const mockTickets = [
    {
      id: "1",
      number: "T-12345",
      teams: ["AFC #1", "NFC #2", "AFC #3"],
      type: "Paid",
      status: "Active",
      owner: "John Doe",
      created: "2023-04-15",
    },
    {
      id: "2",
      number: "T-12346",
      teams: ["NFC #1", "AFC #2", "NFC #3"],
      type: "Paid",
      status: "Active",
      owner: "Jane Smith",
      created: "2023-04-14",
    },
    {
      id: "3",
      number: "T-12347",
      teams: ["AFC #1", "NFC #1", "AFC #2", "NFC #2"],
      type: "Free",
      status: "Active",
      owner: "Robert Johnson",
      created: "2023-04-13",
    },
    {
      id: "4",
      number: "T-12348",
      teams: ["AFC #1", "NFC #1", "AFC #2", "NFC #2", "AFC #3"],
      type: "Reserved",
      status: "Inactive",
      owner: "Sarah Williams",
      created: "2023-04-12",
    },
    {
      id: "5",
      number: "T-12349",
      teams: ["AFC #1", "NFC #1", "AFC #2", "NFC #2", "AFC #3", "NFC #3"],
      type: "Paid",
      status: "Active",
      owner: "Michael Brown",
      created: "2023-04-11",
    },
  ];

  useEffect(() => {
    let mounted = true;

    const fetchTickets = async () => {
      setLoading(true);
      setError(null);

      try {
        let res = null;

        // Try a generic admin getTickets if present
        if (adminAPI.getTickets) {
          // getTickets may accept pagination; call without args to get defaults
          res = await adminAPI.getTickets().catch(() => null);
        }

        // If not available, try listTickets (tournament-scoped) with no id (some implementations return all)
        if (!res && adminAPI.listTickets) {
          res = await adminAPI.listTickets().catch(() => null);
        }

        // Normalize response to an array of tickets
        let data =
          (res &&
            (Array.isArray(res) ? res : res?.data ?? res?.tickets ?? [])) ||
          mockTickets;

        if (!Array.isArray(data)) {
          // attempt to dig into common wraps
          data = data.items || data.results || mockTickets;
        }

        // Normalize fields and IDs
        const normalized = (Array.isArray(data) ? data : []).map((t, idx) => ({
          id: t.id ?? t._id ?? String(t.number ?? idx),
          number: t.number ?? t.ticketNumber ?? `T-${10000 + idx}`,
          teams: Array.isArray(t.teams) ? t.teams : t.teams?.split?.(",") ?? [],
          type: t.type ?? t.ticketType ?? "Paid",
          status: t.status ?? t.state ?? "Active",
          owner: t.owner ?? t.playerName ?? t.user ?? "—",
          created:
            t.created ?? t.createdAt ?? t.date ?? new Date().toISOString(),
          raw: t,
        }));

        if (mounted) setTickets(normalized);
      } catch (err) {
        console.error("fetchTickets error:", err);
        if (mounted) {
          setError("Failed to load tickets — showing sample data.");
          setTickets(mockTickets);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTickets();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredTickets =
    filter === "all"
      ? tickets
      : tickets.filter(
          (ticket) =>
            String(ticket.type).toLowerCase() === String(filter).toLowerCase()
        );

  const getTypeBadge = (type) => {
    const t = String(type ?? "").toLowerCase();
    if (t === "paid") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-[#FF7F11] text-black rounded-full">
          Paid
        </span>
      );
    } else if (t === "free") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-[#4B5320] text-white rounded-full">
          Free
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-[#FF7F11] rounded-full">
        Reserved
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const s = String(status ?? "").toLowerCase();
    if (s === "active") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-[#4B5320] text-white rounded-full">
          Active
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-gray-400 rounded-full">
        Inactive
      </span>
    );
  };

  const viewDetails = (ticket) => {
    const details = `
Ticket: ${ticket.number}
Owner: ${ticket.owner}
Type: ${ticket.type}
Status: ${ticket.status}
Teams: ${Array.isArray(ticket.teams) ? ticket.teams.join(", ") : ticket.teams}
Created: ${formatDate(ticket.created)}
`;
    // Replace with modal in future
    alert(details);
  };

  const handleDelete = async (ticket) => {
    const confirmed = window.confirm(
      `Delete ticket ${ticket.number}? This cannot be undone.`
    );
    if (!confirmed) return;

    setActionLoading(ticket.id);
    setError(null);

    try {
      // Try to delete via adminAPI if available
      // Several backends use DELETE /tournaments/teams/:id or /tickets/:id — try both
      if (adminAPI.deleteTicket) {
        await adminAPI.deleteTicket(ticket.id);
      } else if (adminAPI.delete) {
        // generic delete
        await adminAPI.delete(`/tickets/${ticket.id}`);
      } else if (adminAPI.deleteTicketById) {
        await adminAPI.deleteTicketById(ticket.id);
      } else {
        // Simulate delay if no API
        await new Promise((r) => setTimeout(r, 500));
      }

      // Optimistically remove from UI
      setTickets((prev) => prev.filter((t) => t.id !== ticket.id));
    } catch (err) {
      console.error("delete ticket error:", err);
      setError("Failed to delete ticket. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7F11]"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-[#FF7F11]">Ticket Management</h1>

        <div
          className="mt-4 md:mt-0 flex space-x-2"
          role="tablist"
          aria-label="Ticket filters"
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md ${
              filter === "all"
                ? "bg-[#4B5320] text-white"
                : "bg-[#2A2A2A] text-gray-300"
            }`}
            role="tab"
            aria-selected={filter === "all"}
          >
            All
          </button>
          <button
            onClick={() => setFilter("paid")}
            className={`px-4 py-2 rounded-md ${
              filter === "paid"
                ? "bg-[#FF7F11] text-black"
                : "bg-[#2A2A2A] text-gray-300"
            }`}
            role="tab"
            aria-selected={filter === "paid"}
          >
            Paid
          </button>
          <button
            onClick={() => setFilter("free")}
            className={`px-4 py-2 rounded-md ${
              filter === "free"
                ? "bg-[#4B5320] text-white"
                : "bg-[#2A2A2A] text-gray-300"
            }`}
            role="tab"
            aria-selected={filter === "free"}
          >
            Free
          </button>
          <button
            onClick={() => setFilter("reserved")}
            className={`px-4 py-2 rounded-md ${
              filter === "reserved"
                ? "bg-[#2A2A2A] text-[#FF7F11]"
                : "bg-[#2A2A2A] text-gray-300"
            }`}
            role="tab"
            aria-selected={filter === "reserved"}
          >
            Reserved
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-[#2a1b18] p-3 border border-[#5a2a1a] text-[#FF7F11]">
          {error}
        </div>
      )}

      <div className="card bg-[#0B1D13] border border-[#2A2A2A] rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2A2A2A]">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ticket #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Teams
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-[#2A2A2A] transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-gray-300">
                      {ticket.number}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {ticket.teams.map((team, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-[#2A2A2A] text-[#FF7F11] rounded-md"
                          >
                            {team}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getTypeBadge(ticket.type)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                      {ticket.owner}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                      {formatDate(ticket.created)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => viewDetails(ticket)}
                        className="text-[#FF7F11] hover:text-[#FF1E1E] mr-3"
                        aria-label={`View ${ticket.number}`}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(ticket)}
                        className="text-[#FF1E1E] hover:text-[#FF7F11] disabled:opacity-60"
                        disabled={actionLoading && actionLoading !== ticket.id}
                        aria-label={`Delete ${ticket.number}`}
                      >
                        {actionLoading === ticket.id ? (
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="opacity-25"
                              fill="none"
                            />
                            <path
                              d="M4 12a8 8 0 018-8"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="opacity-75"
                              fill="none"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                            />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketManagement;
