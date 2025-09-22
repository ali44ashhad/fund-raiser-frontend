// src/pages/LeaderBoard.jsx
import { useState, useEffect } from "react";
import Card from "../components/ui/Card";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTournament, setActiveTournament] = useState("super-bowl-2024");

  useEffect(() => {
    // Simulate fetching leaderboard data
    const fetchLeaderboard = async () => {
      setTimeout(() => {
        const mockData = [
          {
            position: 1,
            ticketNumber: "T-12345",
            player: "John Doe",
            totalPoints: 187,
            teams: 4,
            status: "active",
          },
          {
            position: 2,
            ticketNumber: "T-12346",
            player: "Jane Smith",
            totalPoints: 176,
            teams: 4,
            status: "active",
          },
          {
            position: 3,
            ticketNumber: "T-12347",
            player: "Mike Johnson",
            totalPoints: 165,
            teams: 3,
            status: "active",
          },
          {
            position: 4,
            ticketNumber: "T-12348",
            player: "Sarah Wilson",
            totalPoints: 158,
            teams: 6,
            status: "active",
          },
          {
            position: 5,
            ticketNumber: "T-12349",
            player: "David Brown",
            totalPoints: 149,
            teams: 5,
            status: "active",
          },
          {
            position: 6,
            ticketNumber: "T-12350",
            player: "Emily Davis",
            totalPoints: 142,
            teams: 4,
            status: "active",
          },
          {
            position: 7,
            ticketNumber: "T-12351",
            player: "Robert Lee",
            totalPoints: 135,
            teams: 3,
            status: "active",
          },
          {
            position: 8,
            ticketNumber: "T-12352",
            player: "Lisa Garcia",
            totalPoints: 128,
            teams: 6,
            status: "active",
          },
          {
            position: 9,
            ticketNumber: "T-12353",
            player: "James Martinez",
            totalPoints: 121,
            teams: 4,
            status: "active",
          },
          {
            position: 10,
            ticketNumber: "T-12354",
            player: "Karen White",
            totalPoints: 115,
            teams: 5,
            status: "active",
          },
        ];
        setLeaderboard(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchLeaderboard();
  }, [activeTournament]);

  const getPositionBadge = (position) => {
    if (position === 1) {
      return "🥇";
    } else if (position === 2) {
      return "🥈";
    } else if (position === 3) {
      return "🥉";
    }
    return position;
  };

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
            Track your progress and see how you rank against other players
          </p>
        </div>

        {/* Tournament Selector */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#FF1E1E] mb-2">
                Super Bowl 2024
              </h2>
              <p className="text-gray-400">
                February 11, 2024 - State Farm Stadium
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <select
                value={activeTournament}
                onChange={(e) => setActiveTournament(e.target.value)}
                className="bg-[#2A2A2A] border border-[#4B5320] text-white rounded-lg px-4 py-2 focus:ring-[#FF7F11] focus:border-[#FF7F11]"
              >
                <option value="super-bowl-2024">Super Bowl 2024</option>
                <option value="march-madness-2024" disabled>
                  March Madness 2024 (Coming Soon)
                </option>
                <option value="world-cup-2024" disabled>
                  World Cup 2024 (Coming Soon)
                </option>
              </select>
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
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.ticketNumber}
                    className="hover:bg-[#2A2A2A] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-2xl font-bold text-[#FF7F11]">
                        {getPositionBadge(entry.position)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-[#FF1E1E]">
                        {entry.ticketNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#2A2A2A] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {entry.player.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {entry.player}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300">{entry.teams} teams</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[#FF7F11] font-bold text-xl">
                        {entry.totalPoints}
                      </span>
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

          {/* Legend */}
          <div className="mt-8 p-4 bg-[#2A2A2A] rounded-lg border border-[#4B5320]">
            <h3 className="text-lg font-semibold text-[#FF7F11] mb-2">
              Legend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <span className="inline-block w-3 h-3 bg-[#FF7F11] rounded-full mr-2"></span>
                <span>Active: Ticket is still in contention for prizes</span>
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                <span>Eliminated: All teams have been eliminated</span>
              </div>
            </div>
          </div>

          {/* Prize Information */}
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
