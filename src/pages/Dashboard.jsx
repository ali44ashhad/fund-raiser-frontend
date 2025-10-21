import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ticketService } from "../services/ticketService";
// import { tournamentService } from "../services/tournamentService";
import { formatDate } from "../utils/helpers";
import useAuth from "../hooks/useAuth";
import tournamentService from "../services/tournamentService";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [teamNames, setTeamNames] = useState({});
  // const [stats, setStats] = useState({
  //   totalTickets: 0,
  //   totalPoints: 0,
  //   tournamentsCount: 0,
  // });

  useEffect(() => {
    fetchUserTickets();
  }, [currentUser]);

  const getTeamNames = async () => {
    try {
      const teams = await tournamentService.getAllTeamsWithNames();
      console.log("TEAMS", teams);
    } catch (err) {
      console.error("Error fetching team names:", err);
    }
  };

  const getTournamentNames = async () => {
    try {
      const tournaments = await tournamentService.getAllTournamentsWithNames();
      console.log("TEAMS", tournaments);
    } catch (err) {
      console.error("Error fetching team names:", err);
    }
  };

  const fetchUserTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      let ticketsData = [];

      // Try to fetch user's tickets from API
      try {
        console.log("USERRRRR", currentUser);

        if (currentUser?.id) {
          ticketsData = await ticketService.getUserTickets(currentUser.id);
          console.log("User tickets API response:", ticketsData);

          // Fetch teams summary (id + teamName) and build map
          const teamMap = {};
          try {
            const teams = await tournamentService.getAllTeamsWithNames();
            if (Array.isArray(teams)) {
              teams.forEach((team) => {
                const id = team.id ?? team._id ?? team.teamId ?? null;
                const name = team.teamName ?? team.name ?? "Unnamed Team";
                if (id) teamMap[id] = name;
              });
            }
            setTeamNames(teamMap);
          } catch (err) {
            console.warn("Could not fetch team names summary", err);
          }

          // Normalize the tickets into the shape our UI expects
          const normalized = (
            Array.isArray(ticketsData) ? ticketsData : []
          ).map((t, idx) => {
            // teams may be objects or ids/strings; extract id or keep value
            const teams = Array.isArray(t.teams)
              ? t.teams.map((team) => {
                  if (!team) return team;
                  // team might be a string id, or an object with _id/id/teamId
                  const id = team._id ?? team.id ?? team.teamId ?? team;
                  // map to name if available
                  return teamMap[id] ?? id;
                })
              : [];

            return {
              id: t._id ?? t.id ?? String(idx),
              number: t.ticketNumber ?? t.number ?? `T-${10000 + idx}`,
              tournament:
                t.tournamentName ??
                t.tournament?.name ??
                t.tournamentId ??
                null,
              tournamentId: t.tournamentId ?? t.tournament?._id ?? null,
              teams,
              status: t.status ?? t.state ?? "Active",
              accessCode: t.accessCode ?? t.access_code ?? "",
              totalPoints: t.totalPoints ?? 0,
              purchaseDate:
                t.createdAt ?? t.purchaseDate ?? new Date().toISOString(),
              exchangesLeft: t.exchangesLeft ?? 0,
              raw: t,
            };
          });

          setUserTickets(normalized);
        }
      } catch (err) {
        console.log("Could not fetch user tickets from API", err);
      }

      // // If no tickets from user endpoint, try to get all tickets and filter
      // if (!ticketsData || ticketsData.length === 0) {
      //   try {
      //     const allTickets = await ticketService.getAllTickets();
      //     // Filter tickets for current user
      //     ticketsData = allTickets.filter(ticket =>
      //       ticket.owner?._id === currentUser?._id ||
      //       ticket.owner === currentUser?._id
      //     );
      //   } catch (err) {
      //     console.log("Could not fetch all tickets");
      //   }
      // }

      // // Normalize ticket data
      // const normalizedTickets = ticketsData.map((ticket, idx) => normalizeTicketData(ticket, idx));

      // setUserTickets(normalizedTickets);

      // // Calculate stats
      // const totalTickets = normalizedTickets.length;
      // const totalPoints = normalizedTickets.reduce((sum, ticket) => sum + (ticket.totalPoints || 0), 0);
      // const tournamentsCount = new Set(normalizedTickets.map(ticket => ticket.tournamentId)).size;

      // setStats({
      //   totalTickets,
      //   totalPoints,
      //   tournamentsCount
      // });
    } catch (err) {
      console.error("Failed to fetch user tickets:", err);
      setError("Failed to load your tickets. Please try again.");
      setUserTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to normalize ticket data
  // const normalizeTicketData = (ticket, index) => {
  //   console.log("Raw ticket data:", ticket);

  //   // Extract teams properly
  //   let teamsArray = [];
  //   if (Array.isArray(ticket.teams)) {
  //     teamsArray = ticket.teams.map((team) => {
  //       if (typeof team === "string") return team;
  //       return `${team.seed || team.seedNumber || "Unknown"}${
  //         team.name ? ` - ${team.name}` : ""
  //       }`;
  //     });
  //   }

  //   return {
  //     id: ticket._id || ticket.id || `ticket-${index}`,
  //     number: ticket.ticketNumber || ticket.number || `T-${10000 + index}`,
  //     tournament: ticket.tournament?.name || "Unknown Tournament",
  //     tournamentId: ticket.tournament?._id || ticket.tournament,
  //     teams: teamsArray,
  //     status: ticket.status || "Active",
  //     purchaseDate:
  //       ticket.purchaseDate || ticket.createdAt || new Date().toISOString(),
  //     totalPoints: ticket.totalPoints || 0,
  //     accessCode: ticket.accessCode,
  //     exchangesLeft:
  //       ticket.exchangesLeft !== undefined ? ticket.exchangesLeft : 5,
  //     raw: ticket,
  //   };
  // };

  const handleExportTicket = (ticket) => {
    const exportData = {
      ticketNumber: ticket.number,
      accessCode: ticket.accessCode,
      tournament: ticket.tournament,
      teams: ticket.teams,
      totalPoints: ticket.totalPoints,
      status: ticket.status,
      purchaseDate: ticket.purchaseDate,
      exchangesLeft: ticket.exchangesLeft,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ticket.number}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = (ticket) => {
    const details = `
Ticket Number: ${ticket.number}
Access Code: ${ticket.accessCode || "N/A"}
Tournament: ${ticket.tournament}
Status: ${ticket.status}
Total Points: ${ticket.totalPoints}
Exchanges Left: ${ticket.exchangesLeft}
Teams: ${ticket.teams.join(", ") || "No teams assigned"}
Purchase Date: ${formatDate(ticket.purchaseDate)}
`;
    alert(details);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderTopColor: "#00E5FF", borderBottomColor: "#FF7F11" }}
          role="status"
          aria-label="Loading"
        />
        <span className="ml-3 text-gray-400">Loading your tickets...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00E5FF] mb-2">
            Welcome back{currentUser?.name ? `, ${currentUser.name}` : "!"}
          </h1>
          <p className="text-gray-400">
            Here's your dashboard where you can manage your tickets and track
            your progress.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-6 rounded-md bg-red-500/20 border border-red-500/50 text-red-400 p-4"
          >
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Stats

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              Active Tickets
            </h3>
            <p className="text-3xl font-bold text-[#00E5FF]">
              {stats.totalTickets}
            </p>
          </div>

          <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              Total Points
            </h3>
            <p className="text-3xl font-bold text-[#FF7F11]">
              {stats.totalPoints}
            </p>
          </div>

          <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              Tournaments
            </h3>
            <p className="text-3xl font-bold text-[#A78BFA]">
              {stats.tournamentsCount}
            </p>
          </div>
        </div>

         */}

        {/* Tickets */}
        <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#00E5FF]">Your Tickets</h2>
            <Link to="/tournaments">
              <button className="px-4 py-2 border border-[#2A2A2A] text-gray-300 rounded-md hover:bg-[#2A2A2A] transition-colors">
                Buy More Tickets
              </button>
            </Link>
          </div>

          {userTickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No tickets yet
              </h3>
              <p className="text-gray-400 mb-4">
                Purchase your first ticket to get started!
              </p>
              <Link to="/tournaments">
                <button className="px-6 py-2 bg-[#FF7F11] text-black font-medium rounded-md hover:bg-[#e6710f] transition-colors">
                  Browse Tournaments
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userTickets.map((ticket) => (
                <article
                  key={ticket.id}
                  className="bg-[#1C1C1E] border border-[#2A2A2A] rounded-lg p-6 hover:border-[#3A3A3A] transition-colors"
                  aria-labelledby={`ticket-${ticket.id}-title`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3
                        id={`ticket-${ticket.id}-title`}
                        className="text-lg font-semibold text-white"
                      >
                        {ticket.number}
                      </h3>
                      <p className="text-gray-400">{ticket.tournament}</p>
                      {ticket.accessCode && (
                        <p className="text-sm text-gray-500 mt-1">
                          Access Code: {ticket.accessCode}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 bg-[#4B5320] text-white text-sm font-medium rounded-full"
                        aria-label={`Status: ${ticket.status}`}
                      >
                        {ticket.status}
                      </span>
                      <span className="px-2 py-1 bg-[#2A2A2A] text-gray-400 text-xs rounded-full">
                        {ticket.exchangesLeft} exchanges left
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-gray-400 mb-2">Teams:</h4>
                    <div className="flex flex-wrap gap-2">
                      {ticket.teams.length ? (
                        ticket.teams.map((team, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#2A2A2A] text-[#FF7F11] text-sm rounded-md"
                          >
                            {team}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No teams assigned yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-400">Total Points: </span>
                      <span className="text-[#00E5FF] font-semibold">
                        {ticket.totalPoints}
                      </span>
                      <span className="ml-4 text-gray-400">Purchased:</span>{" "}
                      <span className="text-gray-200">
                        {formatDate(ticket.purchaseDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewDetails(ticket)}
                        className="px-4 py-2 border border-[#2A2A2A] text-gray-300 rounded-md hover:bg-[#2A2A2A] transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleExportTicket(ticket)}
                        className="px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-md hover:bg-[#3A3A3A] transition-colors"
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[#00E5FF] mb-4">
              Leaderboard
            </h3>
            <p className="text-gray-400 mb-4">
              See how you stack up against other players.
            </p>
            <Link to="/leaderboard">
              <button className="px-4 py-2 border border-[#2A2A2A] text-gray-300 rounded-md hover:bg-[#2A2A2A] transition-colors">
                View Leaderboard
              </button>
            </Link>
          </div>

          <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[#FF7F11] mb-4">
              Tournament Rules
            </h3>
            <p className="text-gray-400 mb-4">
              Review the rules and how to win prizes.
            </p>
            <Link to="/rules">
              <button className="px-4 py-2 border border-[#2A2A2A] text-gray-300 rounded-md hover:bg-[#2A2A2A] transition-colors">
                Read Rules
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
