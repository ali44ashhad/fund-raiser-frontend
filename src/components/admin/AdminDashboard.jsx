import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import adminAPI from "../../services/admin";
import { formatCurrency } from "../../utils/helpers";

const StatCard = ({ title, value, icon, color }) => (
  <div
    className="card bg-[#0B1D13] hover:bg-[#142a1e] transition-colors duration-300 border border-[#2A2A2A] p-4 rounded-lg"
    role="group"
    aria-label={title}
  >
    <div className="flex items-center">
      <div className={`flex-shrink-0 p-3 rounded-md ${color}`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const UserRow = ({ user }) => (
  <tr className="hover:bg-[#142a1e] transition-colors">
    <td className="px-4 py-3 whitespace-nowrap text-white">{user.name}</td>
    <td className="px-4 py-3 whitespace-nowrap text-gray-400">{user.email}</td>
    <td className="px-4 py-3 whitespace-nowrap text-gray-400">
      {new Date(user.createdAt || user.joinedAt || Date.now()).toLocaleString()}
    </td>
  </tr>
);

const TicketRow = ({ ticket }) => (
  <tr className="hover:bg-[#142a1e] transition-colors">
    <td className="px-4 py-3 whitespace-nowrap text-white">
      {ticket.number || ticket._id || "—"}
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-gray-400">
      {Array.isArray(ticket.teams)
        ? `${ticket.teams.length} teams`
        : ticket.teams || "—"}
    </td>
    <td className="px-4 py-3 whitespace-nowrap">
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          ticket.status === "paid"
            ? "bg-[#FF7F11] text-black"
            : ticket.status === "reserved"
            ? "bg-[#FF1E1E] text-white"
            : "bg-[#4B5320] text-white"
        }`}
      >
        {ticket.status ? String(ticket.status).toUpperCase() : "ACTIVE"}
      </span>
    </td>
  </tr>
);

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    totalRevenue: 0,
    activeTournaments: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [playersRes, tournamentsRes, ticketsRes] = await Promise.all([
          adminAPI.getRecentPlayers().catch(() => ({})),
          adminAPI.getRecentTournaments().catch(() => ({})),
          adminAPI.getRecentTickets().catch(() => ({})),
        ]);

        if (!mounted) return;

        const players = Array.isArray(playersRes)
          ? playersRes
          : playersRes.players || playersRes.data || [];
        const tickets = Array.isArray(ticketsRes)
          ? ticketsRes
          : ticketsRes.tickets || ticketsRes.data || [];

        const totalUsers =
          playersRes.totalCount ?? players.length ?? stats.totalUsers;
        const totalTickets =
          ticketsRes.totalCount ?? tickets.length ?? stats.totalTickets;
        const totalRevenue = tournamentsRes.totalRevenue ?? 0;
        const activeTournaments = Array.isArray(tournamentsRes)
          ? tournamentsRes.length
          : tournamentsRes.count ?? 0;

        setRecentUsers(players.slice(0, 5));
        setRecentTickets(tickets.slice(0, 5));
        setStats({
          totalUsers,
          totalTickets,
          totalRevenue,
          activeTournaments,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#FF7F11]">Admin Dashboard</h1>
        <p className="text-gray-400">
          Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-[#2a1b18] p-3 border border-[#5a2a1a] text-[#FF7F11]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={loading ? "—" : (stats.totalUsers || 0).toLocaleString()}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM12 14c-4 0-8 2-8 4v1h16v-1c0-2-4-4-8-4z"
              />
            </svg>
          }
          color="bg-[#4B5320]"
        />

        <StatCard
          title="Total Tickets"
          value={loading ? "—" : (stats.totalTickets || 0).toLocaleString()}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          }
          color="bg-[#FF1E1E]"
        />

        <StatCard
          title="Total Revenue"
          value={loading ? "—" : formatCurrency(stats.totalRevenue || 0)}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="bg-[#FF7F11]"
        />

        <StatCard
          title="Active Tournaments"
          value={loading ? "—" : String(stats.activeTournaments || 0)}
          icon={
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"
              />
            </svg>
          }
          color="bg-[#4B5320]"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-[#0B1D13] border border-[#2A2A2A] p-4 rounded-lg">
          <h2 className="text-xl font-bold text-[#FF7F11] mb-4">
            Recent Users
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#2A2A2A]">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : recentUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No recent users
                    </td>
                  </tr>
                ) : (
                  recentUsers.map((u) => (
                    <UserRow key={u._id || u.email || u.name} user={u} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card bg-[#0B1D13] border border-[#2A2A2A] p-4 rounded-lg">
          <h2 className="text-xl font-bold text-[#FF7F11] mb-4">
            Recent Tickets
          </h2>
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : recentTickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No recent tickets
                    </td>
                  </tr>
                ) : (
                  recentTickets.map((t) => (
                    <TicketRow key={t._id || t.number} ticket={t} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
