import { api } from "./auth"; 
const unwrap = (res) => {
  if (!res) return null;
  const data = res.data ?? res;
  if (Array.isArray(data)) return data;
  if (data.tickets) return data.tickets;
  return data;
};

const handleError = (err) => {
  const msg =
    err?.response?.data?.message || err?.message || "Ticket API error";
  const e = new Error(msg);
  e.original = err;
  console.error("Ticket API Error:", msg);
  console.error("Full error details:", err.response?.data);
  throw e;
};

// --- Class-based Ticket Service ---
class TicketService {
  // Get all tickets (call with or without params)
  async getAllTickets(params = {}) {
    try {
      const res = await api.get("/tickets", { params });
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  }

  // Get tickets filtered by tournament ID
  async getTicketsByTournament(tournamentId) {
    try {
      const res = await api.get(`/tickets?tournamentId=${tournamentId}`);
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  }

  // Get recently created tickets (dashboard)
  async getRecentTickets() {
    try {
      const res = await api.get("/dashboard/tickets/recent");
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  }

  // Get single ticket by ID
  async getTicketById(ticketId) {
    try {
      const res = await api.get(`/tickets/${ticketId}`);
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  }

  // Create new ticket - UPDATED with better error handling
  async createTicket(ticketData) {
    try {
      console.log("📤 Sending ticket creation request:", ticketData);
      
      // Try different payload formats
      const payloads = [
        // Format 1: Direct data
        ticketData,
        // Format 2: Wrapped in data object
        { data: ticketData },
        // Format 3: Different field names
        {
          playerId: ticketData.playerId,
          tournamentId: ticketData.tournamentId,
          teamsPerTicket: ticketData.teamsPerTicket
        }
      ];

      let lastError = null;
      
      for (const payload of payloads) {
        try {
          console.log("🔄 Trying payload format:", payload);
          const response = await api.post('/tickets/create', payload);
          console.log("✅ Ticket created successfully:", response.data);
          return response.data;
        } catch (err) {
          lastError = err;
          console.log("❌ Failed with payload:", payload);
          console.log("Error:", err.response?.data);
          continue; // Try next format
        }
      }
      
      // If all formats failed, throw the last error
      throw lastError;
      
    } catch (error) {
      console.error('❌ All ticket creation attempts failed');
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Failed to create ticket';
      throw new Error(errorMessage);
    }
  }

  // Update existing ticket
  async updateTicket(ticketId, ticketData) {
    try {
      const res = await api.put(`/tickets/${ticketId}`, ticketData);
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  }

  // Delete ticket
  async deleteTicket(ticketId) {
    try {
      const res = await api.delete(`/tickets/${ticketId}`);
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  }

  // Get all tournaments (for dropdown or linking)
  async getAllTournaments() {
    try {
      const res = await api.get("/tournaments");
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  }

  // Get user tickets
  async getUserTickets(userId) {
    try {
      const response = await api.get(`/tickets/getTicket?id=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      throw error;
    }
  }

  // Alternative create method with different endpoint
  async createTicketAlternative(ticketData) {
    try {
      console.log("🔄 Trying alternative endpoint /tickets");
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket (alternative):', error);
      throw error;
    }
  }
}

// ✅ Export a single instance
export const ticketService = new TicketService();
export default ticketService;