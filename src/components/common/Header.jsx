// src/components/common/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1D13] border-b border-[#4B5320] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-[#FF1E1E] rounded-md flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#FF7F11]">
                Sports Fundraiser
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-[#FF7F11] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/how-to-play"
              className="text-gray-300 hover:text-[#FF7F11] transition-colors"
            >
              How to Play
            </Link>
            <Link
              to="/rules"
              className="text-gray-300 hover:text-[#FF7F11] transition-colors"
            >
              Rules
            </Link>
            <Link
              to="/leaderboard"
              className="text-gray-300 hover:text-[#FF7F11] transition-colors"
            >
              Leaderboard
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-300 hover:text-[#FF1E1E] transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-[#FF7F11] transition-colors"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-[#FF1E1E] hover:bg-[#FF7F11] text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-[#FF7F11] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#FF1E1E] hover:bg-[#FF7F11] text-white px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#2A2A2A] border-t border-[#4B5320]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-300 hover:text-[#FF7F11] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/how-to-play"
              className="block px-3 py-2 text-gray-300 hover:text-[#FF7F11] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How to Play
            </Link>
            <Link
              to="/rules"
              className="block px-3 py-2 text-gray-300 hover:text-[#FF7F11] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Rules
            </Link>
            <Link
              to="/leaderboard"
              className="block px-3 py-2 text-gray-300 hover:text-[#FF7F11] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>

            {currentUser ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-3 py-2 text-gray-300 hover:text-[#FF1E1E] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-300 hover:text-[#FF7F11] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-[#FF1E1E] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-300 hover:text-[#FF7F11] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-gray-300 hover:text-[#FF7F11] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
