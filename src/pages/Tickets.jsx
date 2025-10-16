// src/pages/Tickets.jsx
import { useEffect, useState } from "react";
import adminAPI from "../services/admin";
import paymentAPI from "../services/payment";
import { api } from "../services/auth";
import { TICKET_PRICES, TICKET_TYPES } from "../utils/constants";
import { formatCurrency } from "../utils/helpers";
import useAuth from "../hooks/useAuth";

/**
 * Tickets page - full updated version with improved TicketCard layout
 * Uses:
 *  - adminAPI.getTournaments() (falls back to GET /tournaments)
 *  - paymentAPI.createStripeIntent / createPayPalOrder
 *  - api.post("/tickets/create") for free tickets creation
 *
 * Tune the API shapes accordingly if your backend differs.
 */

/* ----------------------
   TicketCard (updated)
   ---------------------- */
const TicketCard = ({ tournament, category, onBuy }) => {
  const options = [
    { teams: 3, price: TICKET_PRICES.THREE_TEAMS },
    { teams: 4, price: TICKET_PRICES.FOUR_TEAMS },
    { teams: 5, price: TICKET_PRICES.FIVE_TEAMS },
    { teams: 6, price: TICKET_PRICES.SIX_TEAMS },
  ];

  // Example business rule: free category only 3-team tickets.
  const filtered = options.filter((o) => {
    if (category === TICKET_TYPES.FREE) return o.teams === 3;
    return true;
  });

  return (
    <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-4">
      {/* Left: main info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-white truncate">
          {tournament.name}
        </h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2 break-words">
          {tournament.description ?? "Upcoming tournament"}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Announcement:{" "}
          {new Date(tournament.announcementDate || Date.now()).toLocaleString()}
        </p>
      </div>

      {/* Right: options + type + buy button */}
      <div className="w-full sm:w-56 flex flex-col justify-between flex-shrink-0">
        <div className="mb-3">
          {filtered.map((opt) => (
            <div
              key={opt.teams}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-1 text-xs rounded-md bg-[#2A2A2A] text-[#FF7F11] whitespace-nowrap">
                  {opt.teams} teams
                </span>
                <span className="text-sm text-gray-300 hidden sm:inline">
                  per ticket
                </span>
              </div>
              <div className="text-right">
                <span className="text-white font-semibold">
                  {formatCurrency(opt.price)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-0">
          <div>
            <div className="text-xs text-gray-300">Type:</div>
            <div className="mt-1">
              <span className="px-2 py-1 text-sm rounded-full bg-[#2A2A2A] text-[#FF7F11]">
                {category}
              </span>
            </div>
          </div>

          <div>
            <button
              onClick={() => onBuy(tournament, category)}
              className="px-3 py-2 rounded-md bg-[#4B5320] text-white hover:bg-[#FF7F11] transition whitespace-nowrap"
            >
              Buy Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ----------------------
   PurchaseModal
   ---------------------- */
const PurchaseModal = ({ open, onClose, tournament, category, onSuccess }) => {
  const { currentUser } = useAuth();
  const [teamsPerTicket, setTeamsPerTicket] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setTeamsPerTicket(3);
    setQuantity(1);
    setMethod("stripe");
    setLoading(false);
    setError(null);
  }, [open, category]);

  if (!open) return null;

  const priceFor = (teams) => {
    switch (teams) {
      case 3:
        return TICKET_PRICES.THREE_TEAMS;
      case 4:
        return TICKET_PRICES.FOUR_TEAMS;
      case 5:
        return TICKET_PRICES.FIVE_TEAMS;
      case 6:
        return TICKET_PRICES.SIX_TEAMS;
      default:
        return TICKET_PRICES.THREE_TEAMS;
    }
  };

  const total = priceFor(teamsPerTicket) * quantity;

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);

    try {
      // Free ticket path
      if (category === TICKET_TYPES.FREE || total === 0 || method === "free") {
        const payload = {
          playerId: currentUser?.id ?? currentUser?._id,
          tournamentId: tournament.id ?? tournament._id,
          teamsPerTicket,
          quantity,
        };
        const res = await api.post("/tickets/create", payload);
        onSuccess(res.data ?? res);
        onClose();
        return;
      }

      // Paid: handle Stripe
      if (method === "stripe") {
        // backend expects amount in cents
        const intentResp = await paymentAPI.createStripeIntent(
          Math.round(total * 100),
          "usd"
        );
        if (intentResp.checkoutUrl) {
          window.location.href = intentResp.checkoutUrl;
          return;
        }
        if (intentResp.clientSecret) {
          // In production: use Stripe.js to confirm payment with clientSecret
          setError(
            "Stripe clientSecret returned — integrate Stripe.js to complete payment."
          );
          setLoading(false);
          return;
        }
        // fallback logging
        console.log("stripe intent response:", intentResp);
      } else if (method === "paypal") {
        const resp = await paymentAPI.createPayPalOrder(
          total.toFixed(2),
          "USD"
        );
        if (resp.checkoutUrl) {
          window.location.href = resp.checkoutUrl;
          return;
        }
        if (resp.orderID) {
          setError(
            "PayPal order created; client capture flow not implemented in demo."
          );
          setLoading(false);
          return;
        }
      }

      setError("Unable to complete payment flow. Please try another method.");
    } catch (err) {
      console.error("purchase error:", err);
      setError(err?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg bg-[#0B1D13] p-6 rounded-lg border border-[#2A2A2A]">
        <h3 className="text-xl font-semibold text-[#FF7F11] mb-2">
          Buy Ticket
        </h3>
        <p className="text-sm text-gray-400 mb-4">{tournament.name}</p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <label className="text-xs text-gray-300">Teams per ticket</label>
          <select
            value={teamsPerTicket}
            onChange={(e) => setTeamsPerTicket(Number(e.target.value))}
            className="bg-[#0B1D13] border border-[#2A2A2A] text-white rounded-md px-2 py-1"
          >
            <option value={3}>3 teams</option>
            <option value={4}>4 teams</option>
            <option value={5}>5 teams</option>
            <option value={6}>6 teams</option>
          </select>

          <label className="text-xs text-gray-300">Quantity</label>
          <input
            type="number"
            min={1}
            max={20}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value || 1)))
            }
            className="bg-[#0B1D13] border border-[#2A2A2A] text-white rounded-md px-2 py-1"
          />
        </div>

        <div className="mb-3">
          <div className="text-xs text-gray-300 mb-1">Payment method</div>
          <div className="flex gap-2">
            <button
              onClick={() => setMethod("stripe")}
              className={`px-2 py-1 rounded-md ${
                method === "stripe"
                  ? "bg-[#4B5320] text-white"
                  : "bg-[#2A2A2A] text-gray-300"
              }`}
            >
              Stripe
            </button>
            <button
              onClick={() => setMethod("paypal")}
              className={`px-2 py-1 rounded-md ${
                method === "paypal"
                  ? "bg-[#4B5320] text-white"
                  : "bg-[#2A2A2A] text-gray-300"
              }`}
            >
              PayPal
            </button>
            <button
              onClick={() => setMethod("free")}
              className={`px-2 py-1 rounded-md ${
                method === "free"
                  ? "bg-[#4B5320] text-white"
                  : "bg-[#2A2A2A] text-gray-300"
              }`}
            >
              Free
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-300">Total</div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(total)}
          </div>
        </div>

        {error && <div className="text-sm text-[#FF1E1E] mb-2">{error}</div>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md bg-[#2A2A2A] text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-3 py-2 rounded-md bg-[#4B5320] text-white disabled:opacity-60"
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------
   TicketsPage (main)
   ---------------------- */
const CategoryPill = ({ id, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
      active
        ? "bg-[#4B5320] text-white"
        : "bg-[#2A2A2A] text-gray-300 hover:bg-[#333] hover:text-[#FF7F11]"
    }`}
    aria-pressed={active}
  >
    {label}
  </button>
);

const TicketsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(TICKET_TYPES.PAID);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let res = null;
        if (adminAPI.getTournaments) {
          res = await adminAPI.getTournaments();
        } else {
          const r = await api.get("/tournaments");
          res = r.data;
        }
        const data = Array.isArray(res)
          ? res
          : res?.data ?? res?.tournaments ?? res ?? [];
        setTournaments(data);
      } catch (err) {
        console.error("load tournaments error:", err);
        setError("Unable to load tournaments; showing sample data.");
        setTournaments([
          {
            id: "t1",
            name: "Super Bowl Fundraiser",
            announcementDate: "2026-01-01T20:00:00Z",
            description: "Big prize pool!",
          },
          {
            id: "t2",
            name: "March Madness Charity",
            announcementDate: "2026-03-10T18:00:00Z",
            description: "Bracket fun.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onBuy = (tournament, category) => {
    if (!currentUser) {
      alert("Please login to purchase tickets.");
      return;
    }
    setSelected({ tournament, category });
    setModalOpen(true);
  };

  const handleSuccess = (payload) => {
    alert("Ticket(s) purchased / created successfully!");
    console.log("purchase success:", payload);
    // optionally refresh or navigate
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7F11]"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1D13] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#FF7F11] mb-4">Buy Tickets</h1>

        <div className="mb-6 flex gap-2 flex-wrap">
          <CategoryPill
            id={TICKET_TYPES.PAID}
            label="Paid"
            active={category === TICKET_TYPES.PAID}
            onClick={setCategory}
          />
          <CategoryPill
            id={TICKET_TYPES.FREE}
            label="Free"
            active={category === TICKET_TYPES.FREE}
            onClick={setCategory}
          />
          <CategoryPill
            id={TICKET_TYPES.RESERVED}
            label="Reserved"
            active={category === TICKET_TYPES.RESERVED}
            onClick={setCategory}
          />
          <CategoryPill
            id="vip"
            label="VIP"
            active={category === "vip"}
            onClick={setCategory}
          />
        </div>

        {error && <div className="mb-4 text-[#FF1E1E]">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.map((t) => (
            <TicketCard
              key={t.id ?? t._id}
              tournament={t}
              category={category}
              onBuy={onBuy}
            />
          ))}
        </div>
      </div>

      <PurchaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tournament={selected?.tournament ?? {}}
        category={selected?.category ?? TICKET_TYPES.PAID}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default TicketsPage;
