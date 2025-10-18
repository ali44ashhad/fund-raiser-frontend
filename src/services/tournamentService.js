import { api } from "./auth";

class TournamentService {
  // Get all tournaments
  async getAllTournaments() {
    try {
      const response = await api.get("/tournaments");
      return response.data;
    } catch (error) {
      console.error("Error fetching tournaments:", error?.response?.data ?? error.message);
      throw error;
    }
  }

  // Create a tournament
  async createTournament(tournamentData) {
    try {
      const response = await api.post("/tournaments", tournamentData);
      return response.data;
    } catch (error) {
      console.error("Error creating tournament:", error?.response?.data ?? error.message);
      throw error;
    }
  }

  // Delete a tournament
  async deleteTournament(id) {
    try {
      const response = await api.delete(`/tournaments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting tournament ${id}:`, error?.response?.data ?? error.message);
      throw error;
    }
  }

  // Get tournament by id
  async getTournamentById(id) {
    try {
      const response = await api.get(`/tournaments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tournament ${id}:`, error?.response?.data ?? error.message);
      throw error;
    }
  }

  /**
   * Fetch teams for a tournament.
   * Calls GET /api/tournaments/teams/list?tournamentId=...
   * Returns an array of teams (normalized).
   */
  async getTournamentTeams(tournamentId) {
    try {
      const response = await api.get(`/tournaments/teams/list?tournamentId=${tournamentId}`);
      const data = response.data ?? response;

      // Normalize: prefer an array if present in different shapes
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.teams)) return data.teams;
      if (Array.isArray(data.data?.teams)) return data.data.teams;

      // If server returns an object with other structure, try common fields, else return empty array
      return data?.teamsList ?? data?.items ?? [];
    } catch (error) {
      console.error(`Error fetching teams for tournament ${tournamentId}:`, error?.response?.data ?? error.message);
      throw error;
    }
  }
  

  // Backwards-compatible alias
  async getTeams(tournamentId) {
    return this.getTournamentTeams(tournamentId);
  }
}

export const tournamentService = new TournamentService();
export default tournamentService;
