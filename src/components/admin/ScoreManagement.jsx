// src/components/admin/ScoreManagement.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Save, RefreshCw, Filter } from 'lucide-react';
import { tournamentService } from '../../services/tournamentService';
import { scoreService } from '../../services/scoreService';
import { toast } from 'react-hot-toast';

const ScoreManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentRound, setCurrentRound] = useState(1);

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchTournamentData();
    }
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const tournamentsData = await tournamentService.getAllTournaments();
      const activeTournaments = tournamentsData.filter(t => t.isActive !== false);
      setTournaments(activeTournaments);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTournamentData = async () => {
    try {
      setLoading(true);
      
      // Fetch tournament details
      const tournament = await tournamentService.getTournamentById(selectedTournament);
      setCurrentRound(tournament.currentRound || 1);
      
      // Fetch teams
      const teamsData = await tournamentService.getTeams(selectedTournament);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      
      // Fetch existing scores
      const scoresData = await scoreService.getScoresByTournament(selectedTournament);
      setScores(Array.isArray(scoresData) ? scoresData : []);
      
    } catch (err) {
      console.error('Error fetching tournament data:', err);
      setError('Failed to load tournament data');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (teamId, round, value) => {
    const numericValue = parseInt(value) || 0;
    
    setScores(prev => {
      const existingIndex = prev.findIndex(
        score => score.team === teamId && score.roundNumber === round
      );
      
      if (existingIndex >= 0) {
        // Update existing score
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          points: numericValue
        };
        return updated;
      } else {
        // Add new score
        return [
          ...prev,
          {
            team: teamId,
            roundNumber: round,
            points: numericValue,
            tournamentId: selectedTournament
          }
        ];
      }
    });
  };

  const handleEliminationChange = (teamId, round, eliminated) => {
    setScores(prev => {
      const existingIndex = prev.findIndex(
        score => score.team === teamId && score.roundNumber === round
      );
      
      if (existingIndex >= 0) {
        // Update existing score
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          eliminated: eliminated
        };
        return updated;
      } else {
        // Add new score with elimination status
        return [
          ...prev,
          {
            team: teamId,
            roundNumber: round,
            points: 0,
            eliminated: eliminated,
            tournamentId: selectedTournament
          }
        ];
      }
    });
  };

  const saveScores = async () => {
    if (!selectedTournament) {
      toast.error('Please select a tournament first');
      return;
    }

    setSaving(true);
    try {
      // Filter out scores with 0 points and no elimination status
      const scoresToSave = scores.filter(score => 
        score.points > 0 || score.eliminated === true
      );

      console.log('Saving scores:', scoresToSave);
      
      // Save scores to API
      await scoreService.updateScores(selectedTournament, currentRound, scoresToSave);
      
      toast.success('Scores updated successfully!');
      
      // Refresh data
      await fetchTournamentData();
      
    } catch (err) {
      console.error('Error saving scores:', err);
      toast.error('Failed to save scores');
    } finally {
      setSaving(false);
    }
  };

  const getTeamScore = (teamId, round) => {
    const score = scores.find(s => s.team === teamId && s.roundNumber === round);
    return score || { points: 0, eliminated: false };
  };

  const getTotalPoints = (teamId) => {
    return scores
      .filter(score => score.team === teamId && !score.eliminated)
      .reduce((total, score) => total + (score.points || 0), 0);
  };

  const generateRounds = () => {
    const tournament = tournaments.find(t => t._id === selectedTournament);
    const rounds = tournament?.rounds || 1;
    return Array.from({ length: rounds }, (_, i) => i + 1);
  };

  if (loading && tournaments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7F11]"></div>
        <span className="ml-3 text-gray-400">Loading tournaments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Score Management</h1>
          <p className="text-gray-400 mt-1">Update team scores and elimination status</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={fetchTournaments}
            className="flex items-center gap-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-4 py-2 rounded-md transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tournament Selection */}
      <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Select Tournament
            </label>
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-[#2A2A2A] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
            >
              <option value="">Choose a tournament...</option>
              {tournaments.map((tournament) => (
                <option key={tournament._id} value={tournament._id}>
                  {tournament.name} - Round {tournament.currentRound || 1}
                </option>
              ))}
            </select>
          </div>
          
          {selectedTournament && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Round
              </label>
              <div className="flex items-center space-x-4">
                <select
                  value={currentRound}
                  onChange={(e) => setCurrentRound(parseInt(e.target.value))}
                  className="bg-[#1C1C1E] border border-[#2A2A2A] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
                >
                  {generateRounds().map(round => (
                    <option key={round} value={round}>Round {round}</option>
                  ))}
                </select>
                <span className="text-gray-400 text-sm">
                  Total Rounds: {tournaments.find(t => t._id === selectedTournament)?.rounds || 1}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scores Table */}
      {selectedTournament && (
        <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2A2A2A]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Team Scores - Round {currentRound}
              </h3>
              <button
                onClick={saveScores}
                disabled={saving}
                className="flex items-center gap-2 bg-[#FF7F11] hover:bg-[#e6710f] disabled:bg-[#FF7F11]/50 text-black font-medium px-4 py-2 rounded-md transition-colors"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save size={16} />
                    Save All Scores
                  </>
                )}
              </button>
            </div>
          </div>

          {teams.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No teams found for this tournament</div>
              <p className="text-sm text-gray-500">Add teams to the tournament first</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1C1C1E]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Seed
                    </th>
                    {generateRounds().map(round => (
                      <th key={round} className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        R{round}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {teams.map((team) => {
                    const totalPoints = getTotalPoints(team._id);
                    const isEliminated = scores.some(
                      score => score.team === team._id && score.eliminated
                    );
                    
                    return (
                      <tr key={team._id} className="hover:bg-[#1C1C1E]/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {team.teamName || 'Not Assigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {team.seedNumber || team.seed}
                        </td>
                        {generateRounds().map(round => {
                          const score = getTeamScore(team._id, round);
                          const isCurrentRound = round === currentRound;
                          
                          return (
                            <td key={round} className="px-6 py-4 whitespace-nowrap text-center">
                              {isCurrentRound ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <input
                                    type="number"
                                    min="0"
                                    value={score.points || 0}
                                    onChange={(e) => handleScoreChange(team._id, round, e.target.value)}
                                    className="w-16 bg-[#2A2A2A] border border-[#3A3A3A] rounded px-2 py-1 text-white text-sm text-center"
                                    disabled={score.eliminated}
                                  />
                                  <input
                                    type="checkbox"
                                    checked={score.eliminated || false}
                                    onChange={(e) => handleEliminationChange(team._id, round, e.target.checked)}
                                    className="h-4 w-4 text-[#FF7F11] focus:ring-[#FF7F11] border-gray-300 rounded"
                                  />
                                </div>
                              ) : (
                                <div className={`text-sm ${
                                  score.eliminated ? 'text-red-400' : 
                                  score.points > 0 ? 'text-green-400' : 'text-gray-400'
                                }`}>
                                  {score.eliminated ? 'Elim' : score.points || 0}
                                </div>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#00E5FF]">
                          {totalPoints}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            isEliminated 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {isEliminated ? 'Eliminated' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {selectedTournament && (
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-400 mb-2">How to update scores:</h4>
          <ul className="text-sm text-blue-300 list-disc list-inside space-y-1">
            <li>Enter points for each team in the current round</li>
            <li>Check the box to mark a team as eliminated</li>
            <li>Eliminated teams will show 0 points for future rounds</li>
            <li>Click "Save All Scores" to update the tournament</li>
            <li>Previous rounds show read-only scores</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScoreManagement;