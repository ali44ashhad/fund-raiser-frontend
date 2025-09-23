import { api } from "./auth";

export const adminAPI = {
  getRecentPlayers: async () => {
    try {
      const res = await api.get("/dashboard/players/recent");
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch players"
      );
    }
  },

  getRecentTournaments: async () => {
    try {
      const res = await api.get("/dashboard/tournaments/recent");
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch tournaments"
      );
    }
  },

  getRecentTickets: async () => {
    try {
      const res = await api.get("/dashboard/tickets/recent");
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch tickets"
      );
    }
  },

  createTournament: async (data) => {
    try {
      const res = await api.post("/tournaments", data);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create tournament"
      );
    }
  },

  getTournaments: async () => {
    try {
      const res = await api.get("/tournaments");
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch tournaments"
      );
    }
  },

  getTournamentById: async (id) => {
    try {
      const res = await api.get(`/tournaments/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch tournament"
      );
    }
  },

  updateTournament: async (id, updates) => {
    try {
      const res = await api.put(`/tournaments/${id}`, updates);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update tournament"
      );
    }
  },

  deleteTournament: async (id) => {
    try {
      const res = await api.delete(`/tournaments/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete tournament"
      );
    }
  },

  createTeams: async (tournamentId, teams) => {
    try {
      const res = await api.post("/tournaments/teams", { tournamentId, teams });
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || err?.message || "Failed to create teams"
      );
    }
  },

  listTeams: async (tournamentId) => {
    try {
      const res = await api.get(
        `/tournaments/teams/list?tournamentId=${tournamentId}`
      );
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || err?.message || "Failed to list teams"
      );
    }
  },

  updateTeam: async (teamId, updates) => {
    try {
      const res = await api.put(`/tournaments/teams/${teamId}`, updates);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || err?.message || "Failed to update team"
      );
    }
  },

  createTicket: async (ticketData) => {
    try {
      const res = await api.post("/tickets/create", ticketData);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create ticket"
      );
    }
  },

  getTicketById: async (id) => {
    try {
      const res = await api.get(`/tickets/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || err?.message || "Failed to fetch ticket"
      );
    }
  },

  listTickets: async (params = {}) => {
    try {
      const res = await api.get("/tickets", { params });
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch tickets"
      );
    }
  },
};

export default adminAPI;
