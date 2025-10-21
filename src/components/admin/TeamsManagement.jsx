// src/components/admin/TeamsManagement.jsx
import React, { useState, useEffect } from 'react';
import { tournamentService } from '../../services/tournamentService';
import { toast } from 'react-hot-toast';

const TeamsManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sample teams for quick setup
  const sampleTeams = {
    nfl: [
      { seedNumber: "AFC #1", teamName: "Kansas City Chiefs", conference: "AFC" },
      { seedNumber: "AFC #2", teamName: "Buffalo Bills", conference: "AFC" },
      { seedNumber: "AFC #3", teamName: "Cincinnati Bengals", conference: "AFC" },
      { seedNumber: "AFC #4", teamName: "Jacksonville Jaguars", conference: "AFC" },
      { seedNumber: "AFC #5", teamName: "Baltimore Ravens", conference: "AFC" },
      { seedNumber: "AFC #6", teamName: "Los Angeles Chargers", conference: "AFC" },
      { seedNumber: "NFC #1", teamName: "San Francisco 49ers", conference: "NFC" },
      { seedNumber: "NFC #2", teamName: "Philadelphia Eagles", conference: "NFC" },
      { seedNumber: "NFC #3", teamName: "Dallas Cowboys", conference: "NFC" },
      { seedNumber: "NFC #4", teamName: "Tampa Bay Buccaneers", conference: "NFC" },
      { seedNumber: "NFC #5", teamName: "Detroit Lions", conference: "NFC" },
      { seedNumber: "NFC #6", teamName: "Green Bay Packers", conference: "NFC" }
    ],
    nba: [
      { seedNumber: "East #1", teamName: "Boston Celtics", conference: "Eastern" },
      { seedNumber: "East #2", teamName: "Milwaukee Bucks", conference: "Eastern" },
      { seedNumber: "East #3", teamName: "Philadelphia 76ers", conference: "Eastern" },
      { seedNumber: "West #1", teamName: "Denver Nuggets", conference: "Western" },
      { seedNumber: "West #2", teamName: "Phoenix Suns", conference: "Western" },
      { seedNumber: "West #3", teamName: "Golden State Warriors", conference: "Western" }
    ]
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchTeams(selectedTournament);
    } else {
      setTeams([]);
    }
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const tournamentsData = await tournamentService.getAllTournaments();
      setTournaments(tournamentsData || []);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async (tournamentId) => {
    try {
      setLoading(true);
      const teamsData = await tournamentService.getTeams(tournamentId);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = () => {
    setTeams(prev => [...prev, {
      seedNumber: '',
      teamName: '',
      conference: 'AFC',
      _id: `temp-${Date.now()}`
    }]);
  };

  const handleTeamChange = (index, field, value) => {
    const updatedTeams = [...teams];
    updatedTeams[index][field] = value;
    setTeams(updatedTeams);
  };

  const handleRemoveTeam = (index) => {
    if (window.confirm('Are you sure you want to remove this team?')) {
      const updatedTeams = teams.filter((_, i) => i !== index);
      setTeams(updatedTeams);
    }
  };

  const handleSaveTeams = async () => {
    if (!selectedTournament) {
      toast.error('Please select a tournament first');
      return;
    }

    if (teams.length === 0) {
      toast.error('Please add at least one team');
      return;
    }

    // Validate teams
    for (const team of teams) {
      if (!team.seedNumber.trim()) {
        toast.error('All teams must have a seed number');
        return;
      }
    }

    setSaving(true);
    try {
      await tournamentService.createTeams(selectedTournament, teams);
      toast.success('Teams saved successfully!');
      await fetchTeams(selectedTournament); // Refresh teams
    } catch (err) {
      console.error('Error saving teams:', err);
      toast.error(err.response?.data?.message || 'Failed to save teams');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadSampleTeams = (type) => {
    if (!selectedTournament) {
      toast.error('Please select a tournament first');
      return;
    }
    setTeams(sampleTeams[type]);
    toast.success(`Loaded ${sampleTeams[type].length} ${type.toUpperCase()} teams`);
  };

  const getSelectedTournament = () => {
    return tournaments.find(t => t._id === selectedTournament);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Teams Management</h1>
        <p className="text-gray-400 mt-1">Create and manage teams for tournaments</p>
      </div>

      {/* Tournament Selection */}
      <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Select Tournament</h2>
        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="w-full bg-[#1C1C1E] border border-[#2A2A2A] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
        >
          <option value="">Choose a tournament...</option>
          {tournaments.map(tournament => (
            <option key={tournament._id} value={tournament._id}>
              {tournament.name} ({tournament.sport || 'No sport'})
            </option>
          ))}
        </select>
      </div>

      {selectedTournament && (
        <>
          {/* Quick Actions */}
          <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Setup</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleLoadSampleTeams('nfl')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Load NFL Teams (12)
              </button>
              <button
                onClick={() => handleLoadSampleTeams('nba')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
              >
                Load NBA Teams (6)
              </button>
              <button
                onClick={handleAddTeam}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Add Empty Team
              </button>
            </div>
          </div>

          {/* Teams List */}
          <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg">
            <div className="px-6 py-4 border-b border-[#2A2A2A]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Teams ({teams.length})
                </h2>
                <button
                  onClick={handleSaveTeams}
                  disabled={saving || teams.length === 0}
                  className="bg-[#FF7F11] hover:bg-[#e6710f] disabled:bg-[#FF7F11]/50 text-black font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {saving ? 'Saving...' : 'Save All Teams'}
                </button>
              </div>
            </div>

            {teams.length === 0 ? (
              <div className="text-center py-12">
                <svg className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No Teams Added</h3>
                <p className="text-gray-400 mb-4">Add teams to enable ticket purchases for this tournament</p>
                <button
                  onClick={() => handleLoadSampleTeams('nfl')}
                  className="bg-[#FF7F11] hover:bg-[#e6710f] text-black font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Load Sample Teams
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teams.map((team, index) => (
                    <div key={team._id || index} className="bg-[#1C1C1E] border border-[#2A2A2A] rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-white font-medium">Team {index + 1}</h3>
                        <button
                          onClick={() => handleRemoveTeam(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Seed Number</label>
                          <input
                            type="text"
                            value={team.seedNumber}
                            onChange={(e) => handleTeamChange(index, 'seedNumber', e.target.value)}
                            placeholder="e.g., AFC #1, NFC #2"
                            className="w-full bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF7F11]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Team Name</label>
                          <input
                            type="text"
                            value={team.teamName}
                            onChange={(e) => handleTeamChange(index, 'teamName', e.target.value)}
                            placeholder="Actual team name"
                            className="w-full bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF7F11]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Conference</label>
                          <select
                            value={team.conference}
                            onChange={(e) => handleTeamChange(index, 'conference', e.target.value)}
                            className="w-full bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF7F11]"
                          >
                            <option value="AFC">AFC</option>
                            <option value="NFC">NFC</option>
                            <option value="Eastern">Eastern</option>
                            <option value="Western">Western</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add More Teams Button */}
                <div className="mt-6 text-center">
                  <button
                    onClick={handleAddTeam}
                    className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-gray-300 font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    + Add Another Team
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamsManagement;