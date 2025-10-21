// import { api } from "./auth";

// class TournamentService {
//   // Get all tournaments
//   async getAllTournaments() {
//     try {
//       const response = await api.get("/tournaments");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching tournaments:", error?.response?.data ?? error.message);
//       throw error;
//     }
//   }

//   // Create a tournament
//   async createTournament(tournamentData) {
//     try {
//       const response = await api.post("/tournaments", tournamentData);
//       return response.data;
//     } catch (error) {
//       console.error("Error creating tournament:", error?.response?.data ?? error.message);
//       throw error;
//     }
//   }

//   // Delete a tournament
//   async deleteTournament(id) {
//     try {
//       const response = await api.delete(`/tournaments/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error deleting tournament ${id}:`, error?.response?.data ?? error.message);
//       throw error;
//     }
//   }

//   // Get tournament by id
//   async getTournamentById(id) {
//     try {
//       const response = await api.get(`/tournaments/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching tournament ${id}:`, error?.response?.data ?? error.message);
//       throw error;
//     }
//   }

//   /**
//    * Fetch teams for a tournament.
//    * Calls GET /api/tournaments/teams/list?tournamentId=...
//    * Returns an array of teams (normalized).
//    */
//   async getTournamentTeams(tournamentId) {
//     try {
//       const response = await api.get(`/tournaments/teams/list?tournamentId=${tournamentId}`);
//       const data = response.data ?? response;

//       // Normalize: prefer an array if present in different shapes
//       if (Array.isArray(data)) return data;
//       if (Array.isArray(data.teams)) return data.teams;
//       if (Array.isArray(data.data?.teams)) return data.data.teams;

//       // If server returns an object with other structure, try common fields, else return empty array
//       return data?.teamsList ?? data?.items ?? [];
//     } catch (error) {
//       console.error(`Error fetching teams for tournament ${tournamentId}:`, error?.response?.data ?? error.message);
//       throw error;
//     }
//   }
  

//   // Backwards-compatible alias
//   async getTeams(tournamentId) {
//     return this.getTournamentTeams(tournamentId);
//   }
// }

// export const tournamentService = new TournamentService();
// export default tournamentService;


// src/services/tournamentService.js
import { api } from "./auth";

/**
 * Helper to extract a useful error message from axios errors
 * @param {any} error
 * @returns {string}
 */
function getErrorMessage(error) {
  if (!error) return "Unknown error";
  // axios error with response body
  if (error.response?.data) {
    // if backend returns { message: '...' }
    if (typeof error.response.data === "object") {
      return error.response.data.message || JSON.stringify(error.response.data);
    }
    return error.response.data;
  }
  return error.message || String(error);
}

class TournamentService {
  /** Get all tournaments
   * GET /tournaments
   */
  async getAllTournaments() {
    try {
      const response = await api.get("/tournaments");
      return response.data;
    } catch (error) {
      console.error("Error fetching tournaments:", getErrorMessage(error));
      throw error;
    }
  }

  /** Create a new tournament
   * POST /tournaments
   * @param {Object} tournamentData
   */
  async createTournament(tournamentData) {
    try {
      const response = await api.post("/tournaments", tournamentData);
      return response.data;
    } catch (error) {
      console.error("Error creating tournament:", getErrorMessage(error));
      throw error;
    }
  }

  /** Update an existing tournament
   * PUT /tournaments/:id
   * @param {string} id
   * @param {Object} updateData
   */
  async updateTournament(id, updateData) {
    try {
      if (!id) throw new Error("Tournament id is required");
      const response = await api.put(`/tournaments/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating tournament ${id}:`, getErrorMessage(error));
      throw error;
    }
  }

  /** Delete a tournament
   * DELETE /tournaments/:id
   * @param {string} id
   */
  async deleteTournament(id) {
    try {
      if (!id) throw new Error("Tournament id is required");
      const response = await api.delete(`/tournaments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting tournament ${id}:`, getErrorMessage(error));
      throw error;
    }
  }

  /** Get tournament by id
   * GET /tournaments/:id
   * @param {string} id
   */
  async getTournamentById(id) {
    try {
      if (!id) throw new Error("Tournament id is required");
      const response = await api.get(`/tournaments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tournament ${id}:`, getErrorMessage(error));
      throw error;
    }
  }

  /**
   * Fetch teams for a tournament.
   * GET /tournaments/teams/list?tournamentId=...
   * Normalizes various possible server responses into an array.
   * @param {string} tournamentId
   * @returns {Array}
   */
  async getTournamentTeams(tournamentId) {
    try {
      if (!tournamentId) throw new Error("tournamentId is required");
      const response = await api.get(`/tournaments/teams/list?tournamentId=${tournamentId}`);
      const data = response.data ?? response;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data.teams)) return data.teams;
      if (Array.isArray(data.data?.teams)) return data.data.teams;

      // fallback common shapes
      return data?.teamsList ?? data?.items ?? [];
    } catch (error) {
      console.error(`Error fetching teams for tournament ${tournamentId}:`, getErrorMessage(error));
      throw error;
    }
  }

  // Backwards-compatible alias
  async getTeams(tournamentId) {
    return this.getTournamentTeams(tournamentId);
  }

  /**
   * Create / replace teams for a tournament.
   * POST /tournaments/teams
   * Body: { tournamentId, teams: [...] }
   * @param {string} tournamentId
   * @param {Array} teams
   */
  async createTeams(tournamentId, teams = []) {
    try {
      if (!tournamentId) throw new Error("tournamentId is required to create teams");
      if (!Array.isArray(teams)) throw new Error("teams must be an array");

      const payload = { tournamentId, teams };
      const response = await api.post("/tournaments/teams", payload);
      return response.data;
    } catch (error) {
      console.error(`Error creating teams for tournament ${tournamentId}:`, getErrorMessage(error));
      throw error;
    }
  }

  /**
   * Update a single team by id.
   * PUT /tournaments/teams/:teamId
   * @param {string} teamId
   * @param {Object} updateData
   */
  async updateTeam(teamId, updateData) {
    try {
      if (!teamId) throw new Error("teamId is required to update a team");
      const response = await api.put(`/tournaments/teams/${teamId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating team ${teamId}:`, getErrorMessage(error));
      throw error;
    }
  }

  /**
   * Delete a team by id.
   * DELETE /tournaments/teams/:teamId
   * @param {string} teamId
   */
  async deleteTeam(teamId) {
    try {
      if (!teamId) throw new Error("teamId is required to delete a team");
      const response = await api.delete(`/tournaments/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting team ${teamId}:`, getErrorMessage(error));
      throw error;
    }
  }
}

export const tournamentService = new TournamentService();
export default tournamentService;
