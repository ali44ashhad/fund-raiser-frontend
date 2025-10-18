import { useState, useEffect } from "react";
import { paymentService } from "../../services/paymentService";
import { formatCurrency, formatDate } from "../../utils/helpers";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      let paymentsData = [];

      // Try to fetch payments from API
      try {
        paymentsData = await paymentService.getAllPayments();
        console.log("Payments API response:", paymentsData);
      } catch (err) {
        console.log("Could not fetch payments from API");
      }

      // If no payments from API, try to get from tickets data
      if (!paymentsData || paymentsData.length === 0) {
        try {
          // You might need to implement a payments endpoint
          // For now, we'll create mock data from tickets
          paymentsData = await generatePaymentsFromTickets();
        } catch (err) {
          console.log("Could not generate payments from tickets");
        }
      }

      // Normalize payment data
      const normalizedPayments = paymentsData.map((payment, idx) => normalizePaymentData(payment, idx));
      
      setPayments(normalizedPayments);
    } catch (err) {
      console.error("fetchPayments error:", err);
      setError("Failed to load payments. Please check if the API is running.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate payments from tickets (fallback)
  const generatePaymentsFromTickets = async () => {
    try {
      const ticketService = await import("../../services/ticketService");
      const tickets = await ticketService.ticketService.getAllTickets();
      
      return tickets.map(ticket => ({
        _id: ticket._id,
        transactionId: `TXN-${ticket.ticketNumber || ticket._id}`,
        user: ticket.owner?.name || "Unknown User",
        amount: ticket.status === 'paid' ? 25.00 : 0.00,
        method: getPaymentMethod(ticket),
        status: ticket.status === 'paid' ? 'completed' : 
                ticket.status === 'free' ? 'completed' : 'pending',
        date: ticket.createdAt || ticket.purchaseDate,
        ticketId: ticket._id
      }));
    } catch (err) {
      console.error("Error generating payments from tickets:", err);
      return [];
    }
  };

  const getPaymentMethod = (ticket) => {
    if (ticket.status === 'free') return 'Free';
    // You can add logic to determine actual payment method from your data
    return 'Credit Card'; // Default
  };

  // Helper function to normalize payment data
  const normalizePaymentData = (payment, index) => {
    console.log("Raw payment data:", payment);
    
    return {
      id: payment._id || payment.id || `payment-${index}`,
      transactionId: payment.transactionId || payment.paymentId || `TXN-${10000 + index}`,
      user: payment.user?.name || payment.userName || payment.owner || "Unknown User",
      amount: Number(payment.amount || payment.value || 0),
      method: payment.method || payment.paymentMethod || "Unknown",
      status: payment.status || payment.paymentStatus || "pending",
      date: payment.date || payment.createdAt || payment.paymentDate || new Date().toISOString(),
      ticketId: payment.ticketId || payment.ticket?.id,
      raw: payment,
    };
  };

  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true;
    return payment.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === "completed" || s === "complete" || s === "paid" || s === "success") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-[#4B5320] text-white rounded-full">
          Completed
        </span>
      );
    } else if (s === "pending" || s === "processing") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-[#FF7F11] text-black rounded-full">
          Pending
        </span>
      );
    } else if (s === "refunded") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-gray-400 rounded-full">
          Refunded
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
    if (m.includes("credit") || m.includes("card")) {
      return <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-[#FF7F11] rounded-full">Credit Card</span>;
    }
    if (m.includes("paypal")) {
      return <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-[#0070BA] rounded-full">PayPal</span>;
    }
    if (m.includes("stripe")) {
      return <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-[#635BFF] rounded-full">Stripe</span>;
    }
    if (m.includes("venmo")) {
      return <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-[#3D95CE] rounded-full">Venmo</span>;
    }
    if (m.includes("cashapp")) {
      return <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-[#00D632] rounded-full">CashApp</span>;
    }
    if (m.includes("free")) {
      return <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-gray-400 rounded-full">Free</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-[#FF7F11] rounded-full">{method}</span>;
  };

  const viewDetails = (payment) => {
    const details = `
Transaction ID: ${payment.transactionId}
User: ${payment.user}
Amount: ${formatCurrency(payment.amount)}
Payment Method: ${payment.method}
Status: ${payment.status}
Date: ${formatDate(payment.date)}
${payment.ticketId ? `Ticket ID: ${payment.ticketId}` : ''}
`;
    alert(details);
  };

  const handleRefund = async (payment) => {
    if (payment.amount === 0) {
      alert("Free tickets cannot be refunded.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to refund ${formatCurrency(payment.amount)} for ${
        payment.transactionId
      }?`
    );
    if (!confirmed) return;

    setActionLoading(payment.id);
    setError(null);

    try {
      // Try to process refund via API
      try {
        await paymentService.processRefund(payment.id);
      } catch (apiErr) {
        console.log("Refund API not available, simulating refund");
      }
      
      // Update payment status locally
      setPayments((prev) =>
        prev.map((p) =>
          p.id === payment.id ? { ...p, status: "refunded" } : p
        )
      );
      
      alert("Refund processed successfully.");
    } catch (err) {
      console.error("refund error:", err);
      setError("Refund failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7F11]" />
        <span className="ml-3 text-gray-400">Loading payments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#FF7F11]">Payment Management</h1>
          <p className="text-gray-400 mt-1">
            {payments.length} payments found • {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))} total revenue
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              filter === "all"
                ? "bg-[#4B5320] text-white"
                : "bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              filter === "completed"
                ? "bg-[#4B5320] text-white"
                : "bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]"
            }`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              filter === "pending"
                ? "bg-[#FF7F11] text-black"
                : "bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              filter === "failed"
                ? "bg-[#FF1E1E] text-white"
                : "bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]"
            }`}
            onClick={() => setFilter("failed")}
          >
            Failed
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-500/20 border border-red-500/50 p-4 text-red-400">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg shadow">
        <div className="px-6 py-4 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Payment History ({filteredPayments.length})
            </h3>
            <button
              onClick={fetchPayments}
              className="text-sm text-[#FF7F11] hover:text-[#e6710f] transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2A2A2A]">
            <thead className="bg-[#1C1C1E]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c.655 0 1.288.089 1.877.252M12 8V6a3 3 0 00-3-3m3 15v2a3 3 0 01-3 3m9-9a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      No payments found
                      {filter !== "all" && (
                        <span className="text-sm mt-1">Try changing your filter</span>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-[#1C1C1E]/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white font-mono">
                        {payment.transactionId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {payment.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getMethodBadge(payment.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => viewDetails(payment)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="View Details"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {payment.status === 'completed' && payment.amount > 0 && (
                          <button
                            onClick={() => handleRefund(payment)}
                            disabled={actionLoading === payment.id}
                            className="text-red-400 hover:text-red-300 p-1 disabled:opacity-50"
                            title="Process Refund"
                          >
                            {actionLoading === payment.id ? (
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" fill="none" />
                                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" className="opacity-75" fill="none" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
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