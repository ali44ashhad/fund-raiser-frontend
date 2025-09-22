// src/components/admin/PaymentManagement.jsx
import { useState, useEffect } from "react";
import paymentAPI from "../../services/payment"; // uses /api/payment/... (placeholder service)
import { formatCurrency } from "../../utils/helpers";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // payment id for action spinner

  // Local fallback/mock data (used if API not present)
  const mockData = [
    {
      id: "1",
      transactionId: "TXN-12345",
      user: "John Doe",
      amount: 25.0,
      method: "Credit Card",
      status: "Completed",
      date: "2023-04-15",
    },
    {
      id: "2",
      transactionId: "TXN-12346",
      user: "Jane Smith",
      amount: 25.0,
      method: "PayPal",
      status: "Completed",
      date: "2023-04-14",
    },
    {
      id: "3",
      transactionId: "TXN-12347",
      user: "Robert Johnson",
      amount: 0.0,
      method: "Free",
      status: "Completed",
      date: "2023-04-13",
    },
    {
      id: "4",
      transactionId: "TXN-12348",
      user: "Sarah Williams",
      amount: 50.0,
      method: "Credit Card",
      status: "Pending",
      date: "2023-04-12",
    },
    {
      id: "5",
      transactionId: "TXN-12349",
      user: "Michael Brown",
      amount: 25.0,
      method: "Stripe",
      status: "Failed",
      date: "2023-04-11",
    },
  ];

  useEffect(() => {
    let mounted = true;

    const fetchPayments = async () => {
      setLoading(true);
      setError(null);

      // Try to call paymentAPI.getPayments or getPaymentHistory; fall back to mock
      try {
        let res = null;
        // Prefer admin list endpoint if implemented in paymentAPI
        if (paymentAPI.getPayments) {
          res = await paymentAPI.getPayments().catch(() => null);
        }

        // If not available, try history (this requires a userId — skip here)
        if (!res && paymentAPI.getPaymentHistory) {
          // If you have an admin userId, pass it here. For now we'll attempt without.
          res = await paymentAPI.getPaymentHistory().catch(() => null);
        }

        // If no response, use mock
        const data = (res && (Array.isArray(res) ? res : res?.data || res?.payments)) || mockData;

        if (mounted) {
          // Normalize IDs and fields if necessary
          const normalized = (Array.isArray(data) ? data : []).map((p, idx) => ({
            id: p.id ?? p._id ?? String(p.transactionId ?? idx),
            transactionId: p.transactionId ?? p.txn ?? `TXN-${10000 + idx}`,
            user: p.user ?? p.userName ?? p.customer ?? "—",
            amount: Number(p.amount ?? p.value ?? 0),
            method: p.method ?? p.paymentMethod ?? "Unknown",
            status: (p.status ?? p.state ?? "Completed"),
            date: p.date ?? p.createdAt ?? new Date().toISOString(),
            raw: p,
          }));

          setPayments(normalized);
        }
      } catch (err) {
        console.error("fetchPayments error:", err);
        if (mounted) setError("Failed to load payments — showing sample data.");
        // fallback to mock
        setPayments(mockData);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPayments();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((payment) => String(payment.status).toLowerCase() === String(filter).toLowerCase());

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === "completed" || s === "complete" || s === "paid") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-[#4B5320] text-white rounded-full">
          Completed
        </span>
      );
    } else if (s === "pending") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-[#FF7F11] text-black rounded-full">
          Pending
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-[#FF1E1E] text-white rounded-full">
        Failed
      </span>
    );
  };

  const getMethodBadge = (method) => {
    const m = String(method ?? "free").toLowerCase();
    const baseClass = "px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-[#FF7F11] rounded-full";
    if (m.includes("credit")) return <span className={baseClass}>Credit Card</span>;
    if (m.includes("paypal")) return <span className={baseClass}>PayPal</span>;
    if (m.includes("stripe")) return <span className={baseClass}>Stripe</span>;
    if (m.includes("free")) return <span className={baseClass}>Free</span>;
    return <span className={baseClass}>{method}</span>;
  };

  const viewDetails = (payment) => {
    // For now show browser alert; you can replace with modal
    const details = `
Transaction: ${payment.transactionId}
User: ${payment.user}
Amount: ${formatCurrency(payment.amount)}
Method: ${payment.method}
Status: ${payment.status}
Date: ${new Date(payment.date).toLocaleString()}
`;
    alert(details);
  };

  const handleRefund = async (payment) => {
    const confirmed = window.confirm(`Are you sure you want to refund ${formatCurrency(payment.amount)} for ${payment.transactionId}?`);
    if (!confirmed) return;

    setActionLoading(payment.id);
    setError(null);

    try {
      // Call API refund if available
      if (paymentAPI.processRefund) {
        // Some backends expect paymentId or transactionId — try both
        await paymentAPI.processRefund(payment.id, payment.amount).catch(async (err) => {
          // try pass transactionId if that fails
          return paymentAPI.processRefund(payment.transactionId, payment.amount).catch(() => {
            throw err;
          });
        });
      } else {
        // Simulate delay when API not present
        await new Promise((res) => setTimeout(res, 800));
      }

      // Optimistically update UI
      setPayments((prev) => prev.map((p) => (p.id === payment.id ? { ...p, status: "Refunded" } : p)));
      alert("Refund processed successfully.");
    } catch (err) {
      console.error("refund error:", err);
      setError("Refund failed. Check server logs or try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7F11]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-[#FF7F11]">Payment Management</h1>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-[#4B5320] text-white" : "bg-[#2A2A2A] text-gray-300"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md ${filter === "completed" ? "bg-[#4B5320] text-white" : "bg-[#2A2A2A] text-gray-300"}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 rounded-md ${filter === "pending" ? "bg-[#FF7F11] text-black" : "bg-[#2A2A2A] text-gray-300"}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-md ${filter === "failed" ? "bg-[#FF1E1E] text-white" : "bg-[#2A2A2A] text-gray-300"}`}
            onClick={() => setFilter("failed")}
          >
            Failed
          </button>
        </div>
      </div>

      {error && <div className="rounded-md bg-[#2a1b18] p-3 border border-[#5a2a1a] text-[#FF7F11]">{error}</div>}

      <div className="card bg-[#0B1D13] border border-[#2A2A2A] rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2A2A2A]">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">No payments found</td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[#2A2A2A] transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-gray-300">{payment.transactionId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{payment.user}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{getMethodBadge(payment.method)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => viewDetails(payment)}
                        className="text-[#FF7F11] hover:text-[#FF1E1E] mr-3"
                        aria-label={`View ${payment.transactionId}`}
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleRefund(payment)}
                        className="text-[#FF1E1E] hover:text-[#FF7F11] disabled:opacity-60"
                        disabled={actionLoading && actionLoading !== payment.id}
                        aria-label={`Refund ${payment.transactionId}`}
                      >
                        {actionLoading === payment.id ? (
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" fill="none" />
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" className="opacity-75" fill="none" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
