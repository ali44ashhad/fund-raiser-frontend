import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { formatDate } from "../utils/helpers";
import ticketsAPI from "../services/tickets"; // new service file

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockTickets = [
    {
      id: "1",
      number: "T-12345",
      tournament: "Super Bowl Fundraiser",
      teams: [
        "AFC #1 - Kansas City",
        "NFC #2 - San Francisco",
        "AFC #3 - Buffalo",
      ],
      status: "Active",
      purchaseDate: "2023-01-15T10:00:00Z",
      totalPoints: 87,
    },
    {
      id: "2",
      number: "T-12346",
      tournament: "Super Bowl Fundraiser",
      teams: [
        "NFC #1 - Philadelphia",
        "AFC #2 - Cincinnati",
        "NFC #3 - Dallas",
      ],
      status: "Active",
      purchaseDate: "2023-01-10T10:00:00Z",
      totalPoints: 92,
    },
  ];

  useEffect(() => {
    let mounted = true;

    const fetchUserTickets = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to call ticketsAPI.getUserTickets(userId)
        let res = null;
        try {
          res = await ticketsAPI.getUserTickets(currentUser?.id);
        } catch (apiErr) {
          // If the API call fails, we'll log and fall back below
          console.warn(
            "ticketsAPI.getUserTickets failed:",
            apiErr.message || apiErr
          );
        }

        // Normalize possible response shapes to an array
        let data = res ?? (res && res.data) ?? (res && res.tickets) ?? null;

        // If api returned something wrapped, try to extract array
        if (data && !Array.isArray(data)) {
          if (Array.isArray(data.items)) data = data.items;
          else if (Array.isArray(data.results)) data = data.results;
          else if (Array.isArray(data.tickets)) data = data.tickets;
          else data = null; // couldn't normalize
        }

        if (!data) {
          // if API didn't respond with usable data, use mock
          data = mockTickets;
          setError(
            (prev) =>
              prev || "Could not load live tickets — showing sample data."
          );
        }

        // Ensure normalized shape for the UI
        const normalized = (Array.isArray(data) ? data : []).map((t, idx) => ({
          id: t.id ?? t._id ?? String(idx),
          number: t.number ?? t.ticketNumber ?? `T-${10000 + idx}`,
          tournament: t.tournament ?? t.eventName ?? t.event ?? "Tournament",
          teams: Array.isArray(t.teams) ? t.teams : t.teams?.split?.(",") ?? [],
          status: t.status ?? t.state ?? "Active",
          purchaseDate:
            t.purchaseDate ?? t.createdAt ?? t.date ?? new Date().toISOString(),
          totalPoints: Number(t.totalPoints ?? t.points ?? 0),
          raw: t,
        }));

        if (mounted) setUserTickets(normalized);
      } catch (err) {
        console.error("Failed to fetch user tickets (unexpected):", err);
        if (mounted) {
          setError("Failed to load tickets — showing sample data.");
          setUserTickets(mockTickets);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUserTickets();
    return () => {
      mounted = false;
    };
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderTopColor: "#00E5FF", borderBottomColor: "#FF7F11" }}
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  const totalPoints = userTickets.reduce(
    (acc, t) => acc + (t.totalPoints || 0),
    0
  );

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
            className="mb-6 rounded-md bg-[#2a1b18] border border-[#5a2a1a] text-[#FF7F11] p-3"
          >
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              Active Tickets
            </h3>
            <p className="text-3xl font-bold text-[#00E5FF]">
              {userTickets.length}
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              Total Points
            </h3>
            <p className="text-3xl font-bold text-[#FF7F11]">{totalPoints}</p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              Tournaments
            </h3>
            <p className="text-3xl font-bold text-[#A78BFA]">
              {new Set(userTickets.map((t) => t.tournament)).size}
            </p>
          </Card>
        </div>

        {/* Tickets */}
        <Card className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#00E5FF]">Your Tickets</h2>
            <Link to="/tournaments">
              <Button variant="primary">Buy More Tickets</Button>
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
                <Button variant="primary">Browse Tournaments</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userTickets.map((ticket) => (
                <article
                  key={ticket.id}
                  className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6"
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
                    </div>

                    <span
                      className="px-3 py-1 bg-[#4B5320] text-white text-sm font-medium rounded-full"
                      aria-label={`Status: ${ticket.status}`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-gray-400 mb-2">Teams:</h4>
                    <div className="flex flex-wrap gap-2">
                      {ticket.teams.length ? (
                        ticket.teams.map((team, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#1f2a25] text-gray-300 text-sm rounded-md"
                          >
                            {team}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No teams</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
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
                      <Button variant="outline">View Details</Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const blob = new Blob(
                            [JSON.stringify(ticket.raw ?? ticket, null, 2)],
                            {
                              type: "application/json",
                            }
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${ticket.number}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Export
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-semibold text-[#00E5FF] mb-4">
              Leaderboard
            </h3>
            <p className="text-gray-400 mb-4">
              See how you stack up against other players.
            </p>
            <Link to="/leaderboard">
              <Button variant="secondary">View Leaderboard</Button>
            </Link>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-[#FF7F11] mb-4">
              Tournament Rules
            </h3>
            <p className="text-gray-400 mb-4">
              Review the rules and how to win prizes.
            </p>
            <Link to="/rules">
              <Button variant="primary">Read Rules</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
