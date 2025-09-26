// src/pages/Leaderboard.jsx
import { useState, useEffect } from "react";
import Card from "../components/ui/Card";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTournament, setActiveTournament] = useState("super-bowl-2024");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setTimeout(() => {
        const names = [
          "John Doe",
          "Jane Smith",
          "Michael Johnson",
          "Sarah Wilson",
          "David Brown",
          "Emily Davis",
          "Robert Lee",
          "Lisa Garcia",
          "James Martinez",
          "Karen White",
          "Daniel Harris",
          "Laura Clark",
          "Matthew Lewis",
          "Sophia Walker",
          "Joshua Hall",
          "Olivia Allen",
          "Andrew Young",
          "Emma King",
          "Joseph Wright",
          "Mia Scott",
          "Christopher Green",
          "Amelia Adams",
          "Ryan Baker",
          "Charlotte Nelson",
          "Brandon Carter",
          "Abigail Mitchell",
          "Justin Perez",
          "Hannah Roberts",
          "Anthony Turner",
          "Lily Phillips",
        ];

        // Create mock entries but keep only 4-team tickets
        const mockData = Array.from({ length: 30 }, (_, i) => ({
          position: i + 1,
          ticketNumber: `T-${10001 + i}`,
          player: names[i],
          totalPoints: 200 - i * 5,
          teams: 4, // force 4 teams (only show 4-team entries)
          status: "active",
        }));

        // Only 4-team data (already forced above) — still keep filtering step for clarity
        const onlyFourTeams = mockData.filter((m) => m.teams === 4);

        setLeaderboard(onlyFourTeams);
        setLoading(false);
        setCurrentPage(1);
      }, 800);
    };

    fetchLeaderboard();
  }, [activeTournament]);

  const getPositionBadge = (position) => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return position;
  };

  // Pagination
  const totalPages = Math.ceil(leaderboard.length / itemsPerPage);
  const currentData = leaderboard.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1D13] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7F11]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1D13] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#FF7F11] mb-4">
            Tournament Leaderboard
          </h1>
          <p className="text-xl text-gray-300">
            Showing only tickets with <strong>4 teams</strong>
          </p>
        </div>

        {/* Tournament Info + (kept) Team Info */}
        <Card className="mb-8 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-1">
                Super Bowl champions
              </h2>
              <p className="text-gray-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="mt-4 md:mt-0 text-right">
              <div className="text-sm text-gray-300">Category</div>
              <div className="mt-1 inline-flex items-center px-3 py-1 rounded bg-[#2A2A2A] border border-[#4B5320]">
                <span className="text-white font-medium">4 Teams</span>
                <span className="ml-3 text-xs text-gray-400">
                  Price: $35.00
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Leaderboard Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ticket #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Teams
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentData.map((entry) => (
                  <tr
                    key={entry.ticketNumber}
                    className="hover:bg-[#2A2A2A] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-2xl font-bold text-[#FF7F11]">
                      {getPositionBadge(entry.position)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[#FF1E1E]">
                      {entry.ticketNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#2A2A2A] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {entry.player.charAt(0)}
                        </div>
                        <div className="text-white font-medium">
                          {entry.player}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {entry.teams} teams
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#FF7F11] font-bold text-xl">
                      {entry.totalPoints}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#4B5320] bg-opacity-40 text-[#FF7F11] border border-[#4B5320]">
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-[#FF7F11] text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Legend / Prize Info */}
          <div className="mt-8 p-4 bg-[#2A2A2A] rounded-lg border border-[#4B5320]">
            <h3 className="text-lg font-semibold text-[#FF7F11] mb-2">
              Legend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <span className="inline-block w-3 h-3 bg-[#FF7F11] rounded-full mr-2"></span>
                Active: Ticket is still in contention
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                Eliminated: All teams have been eliminated
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-[#FF1E1E] to-[#FF7F11] rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">
              💰 Prize Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div>
                <h4 className="font-semibold mb-2">Top Prizes</h4>
                <ul className="space-y-1">
                  <li>1st Place: $5,000</li>
                  <li>2nd Place: $2,000</li>
                  <li>3rd Place: $1,000</li>
                  <li>4th-10th: $500 each</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Special Prizes</h4>
                <ul className="space-y-1">
                  <li>Lowest Score: $1,000</li>
                  <li>2nd Lowest: $500</li>
                  <li>Random Draw: $250 (5 winners)</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
