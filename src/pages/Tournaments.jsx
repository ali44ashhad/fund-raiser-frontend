import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tournamentService } from "../services/tournamentService";
import { ticketService } from "../services/ticketService";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Tournaments = () => {
  const { currentUser } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const tournamentsData = await tournamentService.getAllTournaments();
      console.log("Tournaments API response:", tournamentsData);
      
      const normalizedTournaments = Array.isArray(tournamentsData) 
        ? tournamentsData.map(tournament => normalizeTournamentData(tournament))
        : [];
      
      setTournaments(normalizedTournaments);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setError("Failed to load tournaments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const normalizeTournamentData = (tournament) => {
    return {
      id: tournament._id || tournament.id,
      name: tournament.name || "Unnamed Tournament",
      rounds: tournament.rounds || 0,
      teamsPerTicket: tournament.teamsPerTicket || 3,
      announcementDate: tournament.announcementDate,
      isActive: tournament.isActive !== false,
      sport: tournament.sport || "Football",
      created: tournament.createdAt || tournament.created,
      raw: tournament
    };
  };

  const handleBuyTicket = async (tournamentId, teamsPerTicket = 3) => {
    if (!currentUser) {
      toast.error("Please log in to buy a ticket.");
      return;
    }

    console.log("🎫 Starting ticket purchase...");
    console.log("👤 Current User:", currentUser);
    console.log("🏆 Tournament ID:", tournamentId);
    console.log("👥 Teams per ticket:", teamsPerTicket);

    setPurchasing(tournamentId);

    try {
      // Prepare ticket data with different formats
      const ticketData = {
        // Format 1: Direct fields
        playerId: currentUser._id || currentUser.id,
        tournamentId: tournamentId,
        teamsPerTicket: teamsPerTicket,
        
        // Alternative field names
        userId: currentUser._id || currentUser.id,
        tournament: tournamentId,
        numberOfTeams: teamsPerTicket,
        
        // Additional fields that might be required
        status: "active",
        type: "paid"
      };

      console.log("📤 Attempting to create ticket with data:", ticketData);

      // Try main create method first
      let newTicket;
      try {
        newTicket = await ticketService.createTicket(ticketData);
      } catch (firstError) {
        console.log("🔄 First attempt failed, trying alternative endpoint...");
        // Try alternative endpoint
        newTicket = await ticketService.createTicketAlternative(ticketData);
      }

      console.log("✅ Ticket created successfully:", newTicket);
      
      toast.success("Ticket purchased successfully! 🎉");
      
      // Refresh tournaments
      await fetchTournaments();
      
    } catch (err) {
      console.error("❌ Error purchasing ticket:", err);
      console.error("Error details:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      // Show specific error message
      let errorMessage = "Failed to purchase ticket. ";
      
      if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage += err.response.data.error;
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Please try again.";
      }
      
      toast.error(errorMessage);
    } finally {
      setPurchasing(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not announced";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return "Invalid date";
    }
  };

  const getStatusBadge = (tournament) => {
    if (!tournament.isActive) {
      return <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full">Ended</span>;
    }
    
    if (!tournament.announcementDate) {
      return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm font-medium rounded-full">Draft</span>;
    }
    
    const now = new Date();
    const announcementDate = new Date(tournament.announcementDate);
    
    if (now < announcementDate) {
      return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full">Upcoming</span>;
    }
    
    return <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">Active</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7F11]"></div>
            <span className="ml-3 text-gray-400">Loading tournaments...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00E5FF] mb-2">Available Tournaments</h1>
          <p className="text-gray-400">
            Choose a tournament and purchase tickets to participate
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-500/20 border border-red-500/50 p-4 text-red-400 mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Tournaments Grid */}
        {tournaments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-8 max-w-md mx-auto">
              <svg className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Tournaments Available</h3>
              <p className="text-gray-400 mb-4">Check back later for new tournaments</p>
              {currentUser?.role === 'admin' && (
                <Link to="/admin">
                  <button className="px-4 py-2 bg-[#FF7F11] text-black font-medium rounded-md hover:bg-[#e6710f] transition-colors">
                    Create Tournament
                  </button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6 hover:border-[#3A3A3A] transition-colors"
              >
                {/* Tournament Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white">{tournament.name}</h2>
                  {getStatusBadge(tournament)}
                </div>

                {/* Tournament Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sport:</span>
                    <span className="text-white">{tournament.sport}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Rounds:</span>
                    <span className="text-white">{tournament.rounds}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Teams per Ticket:</span>
                    <span className="text-white">{tournament.teamsPerTicket}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Announcement:</span>
                    <span className="text-white">{formatDate(tournament.announcementDate)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleBuyTicket(tournament.id, tournament.teamsPerTicket)}
                    disabled={purchasing === tournament.id || !tournament.isActive}
                    className="flex-1 bg-[#FF7F11] hover:bg-[#e6710f] disabled:bg-[#FF7F11]/50 text-black font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    {purchasing === tournament.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Purchasing...
                      </div>
                    ) : (
                      `Buy Ticket - ${tournament.teamsPerTicket} Teams`
                    )}
                  </button>
                  
                  <Link 
                    to={`/tournament/${tournament.id}`}
                    className="px-4 py-2 border border-[#2A2A2A] text-gray-300 rounded-md hover:bg-[#2A2A2A] transition-colors flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Details
                  </Link>
                </div>

                {/* Status Messages */}
                {!tournament.isActive && (
                  <p className="text-red-400 text-sm mt-3">This tournament has ended</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;