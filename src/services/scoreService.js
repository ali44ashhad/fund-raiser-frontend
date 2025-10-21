// src/services/scoreService.js
import { api } from './auth';

class ScoreService {
  async getScoresByTournament(tournamentId) {
    try {
      const response = await api.get(`/scores?tournamentId=${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }
  }

  async updateScores(tournamentId, roundNumber, scores) {
    try {
      const response = await api.post('/scores', {
        tournamentId,
        roundNumber,
        scores
      });
      return response.data;
    } catch (error) {
      console.error('Error updating scores:', error);
      throw error;
    }
  }

  async addTeamScore(tournamentId, teamId, roundNumber, points) {
    try {
      const response = await api.post('/scores', {
        tournamentId,
        teamId,
        roundNumber,
        points
      });
      return response.data;
    } catch (error) {
      console.error('Error adding team score:', error);
      throw error;
    }
  }

  async getLeaderboard(tournamentId) {
    try {
      const response = await api.get(`/leaderboard?tournamentId=${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }
}

export const scoreService = new ScoreService();