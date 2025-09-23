import { api } from "./auth";

const unwrap = (res) => {
  if (!res) return null;
  // normalize axios response
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
  throw e;
};

const ticketsAPI = {
  getUserTickets: async (params = {}) => {
    try {
      const res = await api.get("/tickets", { params });
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  },

  listTickets: async (params = {}) => {
    try {
      const res = await api.get("/tickets", { params });
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  },

  createTicket: async (ticketData) => {
    try {
      const res = await api.post("/tickets/create", ticketData);
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  },

  getTicket: async (ticketId) => {
    try {
      const res = await api.get(`/tickets/${ticketId}`);
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  },

  updateTicket: async (ticketId, body) => {
    try {
      const res = await api.put(`/tickets/${ticketId}`, body);
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  },

  deleteTicket: async (ticketId) => {
    try {
      const res = await api.delete(`/tickets/${ticketId}`);
      return unwrap(res);
    } catch (err) {
      handleError(err);
    }
  },
};

export default ticketsAPI;
