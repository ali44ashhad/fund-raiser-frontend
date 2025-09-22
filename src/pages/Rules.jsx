import { Link } from "react-router-dom";

const Rules = () => {
  return (
    <div className="min-h-screen bg-[#0B1D13] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FF7F11] mb-4">
            Official Rules
          </h1>
          <p className="text-xl text-gray-300">
            Please read these rules carefully before participating in our
            tournaments.
          </p>
        </div>

        {/* Rules Content */}
        <div className="space-y-8">
          {/* Eligibility */}
          <Card>
            <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
              1. Eligibility
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Participants must be at least 18 years of age</li>
              <li>
                • Must be a legal resident of a state where such contests are
                permitted
              </li>
              <li>
                • Employees and immediate family members of Sports Fundraiser
                are not eligible
              </li>
              <li>
                • One account per person - duplicate accounts will be
                disqualified
              </li>
            </ul>
          </Card>

          {/* Ticket Purchase */}
          <Card>
            <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
              2. Ticket Purchase
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>
                • Tickets can be purchased online through our secure payment
                system
              </li>
              <li>
                • Each ticket contains 3, 4, 5, or 6 randomly assigned teams
              </li>
              <li>
                • Ticket prices vary based on the number of teams:
                <ul className="ml-6 mt-1 space-y-1">
                  <li>- 3 teams: $25</li>
                  <li>- 4 teams: $35</li>
                  <li>- 5 teams: $45</li>
                  <li>- 6 teams: $55</li>
                </ul>
              </li>
              <li>
                • All sales are final - no refunds except as required by law
              </li>
            </ul>
          </Card>

          {/* Team Assignment */}
          <Card>
            <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
              3. Team Assignment
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Teams are randomly assigned to ensure fairness</li>
              <li>
                • No two tickets will have the identical combination of teams
              </li>
              <li>
                • Initially, teams may be shown as seed positions (e.g., "AFC
                #1")
              </li>
              <li>
                • Actual team names will be updated once they are officially
                announced
              </li>
              <li>• Ticket exchanges are allowed up to 5 times per ticket</li>
            </ul>
          </Card>

          {/* Scoring System */}
          <Card>
            <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
              4. Scoring System
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>
                • Points are accumulated based on the actual points scored by
                each team
              </li>
              <li>
                • Winning teams: All points scored during the entire tournament
                count
              </li>
              <li>• Losing teams: Points scored until elimination count</li>
              <li>
                • Eliminated teams: Continue to accumulate points from games
                played before elimination
              </li>
              <li>
                • The leaderboard is updated in real-time as games progress
              </li>
            </ul>
          </Card>

          {/* Prize Distribution */}
          <Card>
            <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
              5. Prize Distribution
            </h2>
            <div className="text-gray-300 space-y-3">
              <p>
                <strong>Grand Prize:</strong> The ticket containing the
                tournament champion team with the highest total points
              </p>
              <p>
                <strong>Tie Breakers:</strong> In case of ties, the following
                criteria apply:
              </p>
              <ol className="ml-6 space-y-1">
                <li>1. Total points scored by all teams on the ticket</li>
                <li>2. Points scored in the final round</li>
                <li>3. Points scored in the semi-final round</li>
                <li>4. Random draw</li>
              </ol>
              <p>
                <strong>Additional Prizes:</strong> Awards for 2nd-10th place,
                lowest scores, and random draws
              </p>
            </div>
          </Card>

          {/* Prohibited Activities */}
          <Card>
            <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
              6. Prohibited Activities
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Creating multiple accounts</li>
              <li>• Using automated systems or bots to purchase tickets</li>
              <li>• Attempting to manipulate the random team assignment</li>
              <li>• Any form of cheating or collusion</li>
              <li>
                • Violation of these rules will result in disqualification
                without refund
              </li>
            </ul>
          </Card>

          {/* Legal */}
          <Card>
            <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
              7. Legal Terms
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>• By participating, you agree to these official rules</li>
              <li>• All prizes are subject to applicable taxes</li>
              <li>• Winners will be required to complete tax forms</li>
              <li>
                • Sports Fundraiser reserves the right to modify rules with
                notice
              </li>
              <li>• Decisions by Sports Fundraiser management are final</li>
            </ul>
          </Card>

          {/* Contact */}
          <Card>
            <h2 className="text-2xl font-bold text-[#FF1E1E] mb-4">
              8. Contact Information
            </h2>
            <div className="text-gray-300 space-y-2">
              <p>For questions about these rules or any issues:</p>
              <p>Email: support@sportsfundraiser.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Response time: Within 24 hours during business days</p>
            </div>
          </Card>
        </div>

        {/* Acceptance */}
        <div className="text-center mt-12 p-6 bg-[#4B5320] bg-opacity-20 rounded-xl border border-[#4B5320]">
          <h3 className="text-2xl font-bold text-[#4B5320] mb-4">
            Acceptance of Rules
          </h3>
          <p className="text-gray-300 mb-6">
            By purchasing a ticket and participating in our tournaments, you
            acknowledge that you have read, understood, and agree to be bound by
            these official rules.
          </p>
          <Link
            to="/register"
            className="bg-[#FF1E1E] hover:bg-[#FF7F11] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 inline-block"
          >
            I Accept - Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

// Card component for rules sections
const Card = ({ children }) => (
  <div className="bg-[#2A2A2A] rounded-xl p-6 border border-[#4B5320]">
    {children}
  </div>
);

export default Rules;
