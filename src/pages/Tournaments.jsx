import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import adminAPI from "../services/admin";
import ticketsAPI from "../services/tickets";
import Button from "../components/ui/Button";
import { toast } from "react-hot-toast"; // 👈 import toast

const Tournaments = () => {
  const { currentUser } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await adminAPI.getTournaments();
        setTournaments(data);
      } catch (err) {
        setError(err.message || "Failed to load tournaments");
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const handleBuyTicket = async (tournamentId) => {
    if (!currentUser) {
      toast.error("Please log in to buy a ticket."); // 👈 toast instead of alert
      return;
    }
    try {
      await ticketsAPI.createTicket({
        playerId: currentUser._id || currentUser.id,
        tournamentId,
        teamsPerTicket: 3, // you can adjust to 4, 5, 6 if needed
      });
      toast.success("Ticket purchased successfully!"); // 👈 toast success
    } catch (err) {
      toast.error(err.message || "Failed to buy ticket"); // 👈 toast error
    }
  };

  if (loading) return <p className="text-white">Loading tournaments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Available Tournaments</h1>
      {tournaments.length === 0 ? (
        <p>No tournaments available.</p>
      ) : (
        <div className="grid gap-6">
          {tournaments.map((tournament) => (
            <div
              key={tournament._id}
              className="p-6 bg-[#0B1D13] border border-[#2A2A2A] rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{tournament.name}</h2>
              <p className="text-gray-400 mb-4">
                Rounds: {tournament.rounds} | Teams per ticket:{" "}
                {tournament.teamsPerTicket}
              </p>
              <Button
                variant="secondary"
                onClick={() => handleBuyTicket(tournament._id)}
              >
                Buy Ticket
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tournaments;
