import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B1D13]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B1D13] to-[#2A2A2A] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#FF7F11] mb-6">
              Sports Tournament Fundraiser
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join the excitement! Compete with your favorite teams, win amazing
              prizes, and support a great cause through our tournament
              fundraising platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="bg-[#FF1E1E] hover:bg-[#FF7F11] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-[#FF1E1E] hover:bg-[#FF7F11] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/how-to-play"
                    className="border border-[#4B5320] text-[#4B5320] hover:bg-[#4B5320] hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300"
                  >
                    How to Play
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FF7F11] text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-[#0B1D13] rounded-xl border border-[#4B5320]">
              <div className="w-16 h-16 bg-[#FF1E1E] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Get Your Ticket
              </h3>
              <p className="text-gray-400">
                Purchase a ticket with 3, 4, 5, or 6 unique teams. Each ticket
                is completely random and unique.
              </p>
            </div>
            <div className="text-center p-6 bg-[#0B1D13] rounded-xl border border-[#4B5320]">
              <div className="w-16 h-16 bg-[#FF7F11] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Track Progress
              </h3>
              <p className="text-gray-400">
                Follow your teams' performance throughout the tournament on our
                live leaderboard.
              </p>
            </div>
            <div className="text-center p-6 bg-[#0B1D13] rounded-xl border border-[#4B5320]">
              <div className="w-16 h-16 bg-[#4B5320] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Win Prizes
              </h3>
              <p className="text-gray-400">
                Win cash prizes and awards based on your teams' performance and
                total points scored.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Tournaments */}
      <section className="py-20 bg-[#0B1D13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FF7F11] text-center mb-16">
            Current Tournaments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#2A2A2A] rounded-xl p-6 border border-[#FF1E1E]">
              <h3 className="text-2xl font-bold text-[#FF1E1E] mb-4">
                Super Bowl Fundraiser
              </h3>
              <p className="text-gray-400 mb-4">
                Join our biggest tournament of the year! Compete with NFL teams
                for a chance to win the grand prize.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400">Entry Fee</p>
                  <p className="text-white font-semibold">$25</p>
                </div>
                <div>
                  <p className="text-gray-400">Grand Prize</p>
                  <p className="text-white font-semibold">$5,000</p>
                </div>
                <div>
                  <p className="text-gray-400">Teams per Ticket</p>
                  <p className="text-white font-semibold">4 teams</p>
                </div>
                <div>
                  <p className="text-gray-400">End Date</p>
                  <p className="text-white font-semibold">Feb 12, 2024</p>
                </div>
              </div>
              <Link
                to="/register"
                className="bg-[#FF1E1E] hover:bg-[#FF7F11] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 inline-block"
              >
                Join Tournament
              </Link>
            </div>
            <div className="bg-[#2A2A2A] rounded-xl p-6 border border-[#4B5320]">
              <h3 className="text-2xl font-bold text-[#4B5320] mb-4">
                March Madness Challenge
              </h3>
              <p className="text-gray-400 mb-4">
                College basketball excitement! Pick your teams and follow the
                action through the entire tournament.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400">Entry Fee</p>
                  <p className="text-white font-semibold">$20</p>
                </div>
                <div>
                  <p className="text-gray-400">Grand Prize</p>
                  <p className="text-white font-semibold">$3,000</p>
                </div>
                <div>
                  <p className="text-gray-400">Teams per Ticket</p>
                  <p className="text-white font-semibold">6 teams</p>
                </div>
                <div>
                  <p className="text-gray-400">Start Date</p>
                  <p className="text-white font-semibold">Mar 15, 2024</p>
                </div>
              </div>
              <button
                className="bg-gray-600 text-gray-400 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF1E1E] to-[#FF7F11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Play?
          </h2>
          <p className="text-xl text-white mb-10 max-w-3xl mx-auto">
            Join thousands of players competing in our sports fundraising
            tournaments. Get your ticket today and start your journey to
            victory!
          </p>
          {!currentUser && (
            <Link
              to="/register"
              className="bg-white text-[#FF1E1E] hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 inline-block"
            >
              Create Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
