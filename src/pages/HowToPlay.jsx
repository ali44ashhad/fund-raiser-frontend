import { Link } from "react-router-dom";

const HowToPlay = () => {
  return (
    <div className="min-h-screen bg-[#0B1D13] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FF7F11] mb-4">
            How to Play
          </h1>
          <p className="text-xl text-gray-300">
            Learn how to participate in our sports tournament fundraiser and win
            amazing prizes!
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="bg-[#2A2A2A] rounded-xl p-8 border-l-4 border-[#FF1E1E]">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#FF1E1E] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                1
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#FF7F11] mb-2">
                  Create an Account
                </h2>
                <p className="text-gray-300">
                  Sign up for a free account to get started. You'll need to
                  provide basic information and agree to our terms and
                  conditions.
                </p>
              </div>
            </div>
            <div className="bg-[#0B1D13] rounded-lg p-4 border border-[#4B5320]">
              <p className="text-[#FF7F11] font-semibold">
                💡 Tip: Use a valid email address to receive your ticket and
                updates!
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#2A2A2A] rounded-xl p-8 border-l-4 border-[#FF7F11]">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#FF7F11] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                2
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#FF7F11] mb-2">
                  Purchase Your Ticket
                </h2>
                <p className="text-gray-300">
                  Choose from different ticket options (3, 4, 5, or 6 teams) and
                  complete your purchase using our secure payment methods.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#0B1D13] rounded-lg p-4 border border-[#4B5320]">
                <h4 className="font-semibold text-[#FF7F11] mb-2">
                  Ticket Prices
                </h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• 3 teams: $25</li>
                  <li>• 4 teams: $35</li>
                  <li>• 5 teams: $45</li>
                  <li>• 6 teams: $55</li>
                </ul>
              </div>
              <div className="bg-[#0B1D13] rounded-lg p-4 border border-[#4B5320]">
                <h4 className="font-semibold text-[#FF7F11] mb-2">
                  Payment Methods
                </h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Credit/Debit Card</li>
                  <li>• PayPal</li>
                  <li>• Venmo</li>
                  <li>• Cash App</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#2A2A2A] rounded-xl p-8 border-l-4 border-[#4B5320]">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#4B5320] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                3
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#FF7F11] mb-2">
                  Receive Your Random Teams
                </h2>
                <p className="text-gray-300">
                  After purchase, you'll receive a ticket with randomly assigned
                  teams. Each ticket is unique - no two tickets have the same
                  combination!
                </p>
              </div>
            </div>
            <div className="bg-[#0B1D13] rounded-lg p-4 mb-4 border border-[#4B5320]">
              <p className="text-gray-300">
                <span className="font-semibold text-[#FF7F11]">
                  Example Ticket:
                </span>{" "}
                Your ticket might include teams like "AFC #1", "NFC #2", "AFC
                #3", etc. These will be updated with actual team names once
                they're announced.
              </p>
            </div>
            <div className="bg-[#0B1D13] rounded-lg p-4 border border-[#4B5320]">
              <h4 className="font-semibold text-[#FF1E1E] mb-2">
                🎲 Ticket Exchange
              </h4>
              <p className="text-gray-300">
                Don't like your teams? You can exchange your ticket up to 5
                times for a new random set of teams!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#2A2A2A] rounded-xl p-8 border-l-4 border-[#FF7F11]">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#FF7F11] rounded-full flex items-center justify-center text-black font-bold text-xl mr-4">
                4
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#FF7F11] mb-2">
                  Follow the Tournament
                </h2>
                <p className="text-gray-300">
                  Track your teams' progress throughout the tournament on our
                  live leaderboard. Points are accumulated based on your teams'
                  performance.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0B1D13] rounded-lg p-4 border border-[#4B5320]">
                <h4 className="font-semibold text-[#FF7F11] mb-2">
                  Scoring System
                </h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Win: Full points scored</li>
                  <li>• Loss: 0 points</li>
                  <li>
                    • Teams continue to accumulate points even after elimination
                  </li>
                </ul>
              </div>
              <div className="bg-[#0B1D13] rounded-lg p-4 border border-[#4B5320]">
                <h4 className="font-semibold text-[#FF7F11] mb-2">
                  Leaderboard Features
                </h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Real-time updates</li>
                  <li>• Filter by tournament</li>
                  <li>• View other players' tickets</li>
                  <li>• Track prize distributions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-[#2A2A2A] rounded-xl p-8 border-l-4 border-[#FF1E1E]">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#FF1E1E] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                5
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#FF7F11] mb-2">
                  Win Prizes!
                </h2>
                <p className="text-gray-300">
                  At the end of the tournament, prizes are awarded based on
                  performance. Multiple ways to win!
                </p>
              </div>
            </div>
            <div className="bg-[#0B1D13] rounded-lg p-4 mb-4 border border-[#4B5320]">
              <h4 className="font-semibold text-[#FF1E1E] mb-2">
                🏆 Prize Categories
              </h4>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • <span className="text-[#FF7F11]">Grand Prize:</span> Ticket
                  with the winning team that has the highest total points
                </li>
                <li>
                  • <span className="text-[#FF7F11]">Top Scores:</span> 2nd
                  through 10th highest scoring tickets
                </li>
                <li>
                  • <span className="text-[#FF7F11]">Lowest Scores:</span>{" "}
                  Tickets with the lowest total points
                </li>
                <li>
                  • <span className="text-[#FF7F11]">Random Draws:</span>{" "}
                  Additional random prizes
                </li>
              </ul>
            </div>
            <div className="bg-[#4B5320] bg-opacity-30 rounded-lg p-4 border border-[#4B5320]">
              <p className="text-[#FF7F11] font-semibold">
                💰 Prize pools vary by tournament size and entry fees. Larger
                tournaments mean bigger prizes!
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-[#FF7F11] mb-6">
            Ready to Play?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the excitement and get your ticket today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#FF1E1E] hover:bg-[#FF7F11] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300"
            >
              Sign Up Now
            </Link>
            <Link
              to="/rules"
              className="border border-[#4B5320] text-[#4B5320] hover:bg-[#4B5320] hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300"
            >
              Read Rules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
