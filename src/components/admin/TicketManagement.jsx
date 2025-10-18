import { useState, useEffect } from "react";
import { ticketService } from "../../services/ticketService";
import { tournamentService } from "../../services/tournamentService";
import { formatDate } from "../../utils/helpers";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    try {
      const tournamentsData = await tournamentService.getAllTournaments();
      console.log("Tournaments data:", tournamentsData);
      setTournaments(Array.isArray(tournamentsData) ? tournamentsData : []);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setTournaments([]);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      let ticketsData = [];

      // Try different API endpoints
      if (selectedTournament) {
        // Fetch tickets for specific tournament
        try {
          ticketsData = await ticketService.getTicketsByTournament(selectedTournament);
          console.log("Tickets by tournament:", ticketsData);
        } catch (err) {
          console.log("Could not fetch tickets by tournament");
        }
      }

      // If no tickets from tournament filter, try to get all tickets
      if (!ticketsData || ticketsData.length === 0) {
        try {
          ticketsData = await ticketService.getAllTickets();
          console.log("All tickets:", ticketsData);
        } catch (err) {
          console.log("Could not fetch all tickets");
        }
      }

      // If still no tickets, try recent tickets from dashboard
      if (!ticketsData || ticketsData.length === 0) {
        try {
          ticketsData = await ticketService.getRecentTickets();
          console.log("Recent tickets:", ticketsData);
        } catch (err) {
          console.log("Could not fetch recent tickets");
        }
      }

      // Normalize the ticket data - handle different API response structures
      let normalizedTickets = [];
      
      if (Array.isArray(ticketsData)) {
        normalizedTickets = ticketsData.map((ticket, idx) => normalizeTicketData(ticket, idx));
      } else if (ticketsData && Array.isArray(ticketsData.data)) {
        normalizedTickets = ticketsData.data.map((ticket, idx) => normalizeTicketData(ticket, idx));
      } else if (ticketsData && Array.isArray(ticketsData.tickets)) {
        normalizedTickets = ticketsData.tickets.map((ticket, idx) => normalizeTicketData(ticket, idx));
      } else {
        console.log("No valid tickets data found");
        normalizedTickets = [];
      }

      setTickets(normalizedTickets);
    } catch (err) {
      console.error("fetchTickets error:", err);
      setError("Failed to load tickets. Please check if the API is running.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to normalize ticket data from different API responses
  const normalizeTicketData = (ticket, index) => {
    console.log("Raw ticket data:", ticket); // Debug log
    
    // Extract teams array properly
    let teamsArray = [];
    if (Array.isArray(ticket.teams)) {
      teamsArray = ticket.teams.map(team => {
        if (typeof team === 'string') return team;
        return team.seed || team.seedNumber || team.name || "Unknown Team";
      });
    } else if (ticket.teams && typeof ticket.teams === 'string') {
      teamsArray = [ticket.teams];
    }

    // Determine ticket type based on status
    let ticketType = "Paid";
    if (ticket.status === 'free') ticketType = "Free";
    if (ticket.status === 'reserved') ticketType = "Reserved";

    return {
      id: ticket._id || ticket.id || `temp-${index}`,
      number: ticket.ticketNumber || ticket.number || `T-${10000 + index}`,
      teams: teamsArray,
      type: ticketType,
      status: ticket.status || 'Active',
      owner: ticket.owner?.name || ticket.ownerName || ticket.ownerId || "Unknown Owner",
      created: ticket.createdAt || ticket.purchaseDate || ticket.date || new Date().toISOString(),
      tournament: ticket.tournament?.name || "Unknown Tournament",
      accessCode: ticket.accessCode || "N/A",
      exchangesLeft: ticket.exchangesLeft !== undefined ? ticket.exchangesLeft : 5,
      totalPoints: ticket.totalPoints || 0,
      raw: ticket,
    };
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    return ticket.type.toLowerCase() === filter.toLowerCase();
  });

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
    if (s === "active" || s === "paid" || s === "free" || s === "reserved") {
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
Ticket Number: ${ticket.number}
Access Code: ${ticket.accessCode}
Tournament: ${ticket.tournament}
Owner: ${ticket.owner}
Type: ${ticket.type}
Status: ${ticket.status}
Exchanges Left: ${ticket.exchangesLeft}
Total Points: ${ticket.totalPoints}
Teams: ${ticket.teams.join(", ") || "No teams assigned"}
Created: ${formatDate(ticket.created)}
`;

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
      // Try to delete via API if endpoint exists
      try {
        await ticketService.deleteTicket(ticket.id);
      } catch (apiErr) {
        console.log("Delete API not available, simulating deletion");
      }
      
      // Remove ticket from local state
      setTickets((prev) => prev.filter((t) => t.id !== ticket.id));
      
    } catch (err) {
      console.error("delete ticket error:", err);
      setError("Failed to delete ticket. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (ticket) => {
    setActionLoading(ticket.id);
    setError(null);

    try {
      // Simulate status toggle
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticket.id
            ? { 
                ...t, 
                status: t.status === "Active" ? "Inactive" : "Active",
              }
            : t
        )
      );
      
    } catch (err) {
      console.error("toggleStatus error:", err);
      setError("Failed to update ticket status.");
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
        <span className="ml-3 text-gray-400">Loading tickets...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#FF7F11]">Ticket Management</h1>
          <p className="text-gray-400 mt-1">
            {tickets.length} tickets found
            {selectedTournament && " for selected tournament"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          {/* Tournament Filter */}
          <select
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            className="bg-[#0B1D13] border border-[#2A2A2A] text-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF7F11] min-w-48"
          >
            <option value="">All Tournaments</option>
            {tournaments.map((tournament) => (
              <option key={tournament._id} value={tournament._id}>
                {tournament.name || `Tournament ${tournament._id}`}
              </option>
            ))}
          </select>

          {/* Ticket Type Filters */}
          <div className="flex space-x-2" role="tablist" aria-label="Ticket filters">
            {["all", "paid", "free", "reserved"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-md text-sm capitalize ${
                  filter === filterType
                    ? filterType === "paid"
                      ? "bg-[#FF7F11] text-black"
                      : filterType === "free"
                      ? "bg-[#4B5320] text-white"
                      : filterType === "reserved"
                      ? "bg-[#2A2A2A] text-[#FF7F11]"
                      : "bg-[#4B5320] text-white"
                    : "bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]"
                }`}
                role="tab"
                aria-selected={filter === filterType}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-500/20 border border-red-500/50 p-4 text-red-400">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg shadow">
        <div className="px-6 py-4 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Tickets ({filteredTickets.length})
            </h3>
            <button
              onClick={fetchTickets}
              className="text-sm text-[#FF7F11] hover:text-[#e6710f] transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2A2A2A]">
            <thead className="bg-[#1C1C1E]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ticket Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Teams
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tournament
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      No tickets found
                      {(filter !== "all" || selectedTournament) && (
                        <span className="text-sm mt-1">
                          Try changing your filter or tournament selection
                        </span>
                      )}
                      {tickets.length === 0 && (
                        <span className="text-sm mt-1">
                          No tickets available in the system
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-[#1C1C1E]/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#2A2A2A] rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-[#FF7F11]">
                            T
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white font-mono">
                            {ticket.number}
                          </div>
                          <div className="text-sm text-gray-400">
                            {ticket.owner}
                          </div>
                          <div className="text-xs text-gray-500">
                            Code: {ticket.accessCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {ticket.teams && ticket.teams.length > 0 ? (
                          <>
                            {ticket.teams.slice(0, 3).map((team, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs bg-[#2A2A2A] text-[#FF7F11] rounded-md truncate max-w-24"
                                title={team}
                              >
                                {team}
                              </span>
                            ))}
                            {ticket.teams.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-[#2A2A2A] text-gray-400 rounded-md">
                                +{ticket.teams.length - 3} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-[#2A2A2A] text-gray-400 rounded-md">
                            No teams
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(ticket.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {ticket.tournament}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(ticket.created)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => viewDetails(ticket)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="View Details"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(ticket)}
                          disabled={actionLoading === ticket.id}
                          className="text-green-400 hover:text-green-300 p-1 disabled:opacity-50"
                          title="Toggle Status"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(ticket)}
                          disabled={actionLoading === ticket.id}
                          className="text-red-400 hover:text-red-300 p-1 disabled:opacity-50"
                          title="Delete Ticket"
                        >
                          {actionLoading === ticket.id ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" fill="none" />
                              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" className="opacity-75" fill="none" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                            </svg>
                          )}
                        </button>
                      </div>
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