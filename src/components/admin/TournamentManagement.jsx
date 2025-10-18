import React, { useState, useEffect } from 'react';
import { Plus, Edit, Users, Trash2, Eye } from 'lucide-react';
import { tournamentService } from '../../services/tournamentService';

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [teams, setTeams] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    rounds: 3,
    teamsPerTicket: 3,
    announcementDate: ''
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await tournamentService.getAllTournaments();
      setTournaments(data);
    } catch (err) {
      setError('Failed to fetch tournaments');
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async (tournamentId) => {
    try {
      const teamsData = await tournamentService.getTeams(tournamentId);
      setTeams(teamsData);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submissionData = {
        ...formData,
        announcementDate: new Date(formData.announcementDate).toISOString()
      };

      await tournamentService.createTournament(submissionData);
      await fetchTournaments();
      setShowCreateForm(false);
      setFormData({
        name: '',
        rounds: 3,
        teamsPerTicket: 3,
        announcementDate: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) {
      return;
    }

    try {
      await tournamentService.deleteTournament(tournamentId);
      await fetchTournaments();
    } catch (err) {
      setError('Failed to delete tournament');
    }
  };

  const handleViewTeams = async (tournament) => {
    setSelectedTournament(tournament);
    await fetchTeams(tournament._id);
    setShowTeamsModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (tournament) => {
    const now = new Date();
    const announcementDate = new Date(tournament.announcementDate);
    
    if (now < announcementDate) {
      return { label: 'Upcoming', color: 'bg-yellow-500/20 text-yellow-400' };
    } else if (tournament.isActive) {
      return { label: 'Active', color: 'bg-green-500/20 text-green-400' };
    } else {
      return { label: 'Completed', color: 'bg-gray-500/20 text-gray-400' };
    }
  };

  if (loading && tournaments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7F11]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournament Management</h1>
          <p className="text-gray-400 mt-1">Create and manage tournaments</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-[#FF7F11] hover:bg-[#e6710f] text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          Create Tournament
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Create Tournament Form */}
      {showCreateForm && (
        <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Tournament</h3>
          <form onSubmit={handleCreateTournament} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tournament Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#1C1C1E] border border-[#2A2A2A] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
                  placeholder="Enter tournament name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Teams per Ticket
                </label>
                <select
                  name="teamsPerTicket"
                  required
                  value={formData.teamsPerTicket}
                  onChange={handleChange}
                  className="w-full bg-[#1C1C1E] border border-[#2A2A2A] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
                >
                  <option value={3}>3 Teams</option>
                  <option value={4}>4 Teams</option>
                  <option value={5}>5 Teams</option>
                  <option value={6}>6 Teams</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Number of Rounds
                </label>
                <select
                  name="rounds"
                  required
                  value={formData.rounds}
                  onChange={handleChange}
                  className="w-full bg-[#1C1C1E] border border-[#2A2A2A] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
                >
                  <option value={3}>3 Rounds</option>
                  <option value={4}>4 Rounds</option>
                  <option value={5}>5 Rounds</option>
                  <option value={6}>6 Rounds</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Announcement Date
                </label>
                <input
                  type="date"
                  name="announcementDate"
                  required
                  value={formData.announcementDate}
                  onChange={handleChange}
                  className="w-full bg-[#1C1C1E] border border-[#2A2A2A] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7F11]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#FF7F11] hover:bg-[#e6710f] disabled:bg-[#FF7F11]/50 text-white py-2 px-4 rounded-md transition-colors"
              >
                {loading ? 'Creating...' : 'Create Tournament'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tournaments List */}
      <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2A2A2A]">
          <h3 className="text-lg font-semibold text-white">All Tournaments</h3>
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No tournaments found</div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#FF7F11] hover:bg-[#e6710f] text-white px-4 py-2 rounded-md"
            >
              Create Your First Tournament
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1C1C1E]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tournament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Teams/Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Rounds
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Announcement
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {tournaments.map((tournament) => {
                  const status = getStatusBadge(tournament);
                  return (
                    <tr key={tournament._id} className="hover:bg-[#1C1C1E]/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {tournament.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {tournament.teamsPerTicket} teams
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {tournament.rounds} rounds
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(tournament.announcementDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewTeams(tournament)}
                            className="text-blue-400 hover:text-blue-300 p-1"
                            title="View Teams"
                          >
                            <Users size={16} />
                          </button>
                          <button
                            className="text-green-400 hover:text-green-300 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTournament(tournament._id)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Teams Modal */}
      {showTeamsModal && selectedTournament && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Teams - {selectedTournament.name}
                </h3>
                <button
                  onClick={() => setShowTeamsModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {teams.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No teams added to this tournament
                </div>
              ) : (
                <div className="space-y-3">
                  {teams.map((team, index) => (
                    <div
                      key={team._id || index}
                      className="flex items-center justify-between p-3 bg-[#1C1C1E] rounded-md"
                    >
                      <div>
                        <div className="text-white font-medium">
                          {team.seedNumber || team.seed}
                        </div>
                        {team.teamName && (
                          <div className="text-gray-400 text-sm">
                            {team.teamName}
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        team.teamName 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {team.teamName ? 'Assigned' : 'Seed Only'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentManagement;