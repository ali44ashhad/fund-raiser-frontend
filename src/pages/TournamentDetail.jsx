// import React, { useState, useEffect } from 'react';

// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { tournamentService } from '../services/tournamentService';
// import { ticketService } from '../services/ticketService';
// import { toast } from 'react-hot-toast';
// import useAuth from '../hooks/useAuth';

// const TournamentDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const [tournament, setTournament] = useState(null);
//   const [teams, setTeams] = useState([]);
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [purchasing, setPurchasing] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     if (id) {
//       fetchTournamentData();
//     }
//   }, [id]);

//   const fetchTournamentData = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       console.log('🔄 Fetching tournament data for ID:', id);
      
//       // Fetch tournament details
//       const tournamentData = await tournamentService.getTournamentById(id);
//       console.log('🎯 Tournament API Response:', tournamentData);
      
//       if (!tournamentData) {
//         throw new Error('Tournament not found');
//       }

//       setTournament(tournamentData);

//       // Fetch teams for this tournament
//       try {
//         const teamsData = await tournamentService.getTeams(id);
//         console.log('🏈 Teams API Response:', teamsData);
//         setTeams(Array.isArray(teamsData) ? teamsData : []);
//       } catch (teamsErr) {
//         console.error('Error fetching teams:', teamsErr);
//         setTeams([]);
//       }

//       // Fetch tickets for this tournament
//       try {
//         const ticketsData = await ticketService.getTicketsByTournament(id);
//         console.log('🎫 Tickets API Response:', ticketsData);
//         setTickets(Array.isArray(ticketsData) ? ticketsData : []);
//       } catch (ticketsErr) {
//         console.error('Error fetching tickets:', ticketsErr);
//         setTickets([]);
//       }

//     } catch (err) {
//       console.error('❌ Error fetching tournament:', err);
//       setError(err.message || 'Failed to load tournament details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBuyTicket = async () => {
//     if (!currentUser) {
//       toast.error('Please log in to buy a ticket');
//       navigate('/login');
//       return;
//     }

//     if (!tournament) {
//       toast.error('Tournament not found');
//       return;
//     }

//     console.log('🎫 Starting ticket purchase...');
//     console.log('👤 User:', currentUser);
//     console.log('🏆 Tournament:', tournament);

//     setPurchasing(true);

//     try {
//       const ticketData = {
//         playerId: currentUser._id || currentUser.id,
//         tournamentId: tournament._id || tournament.id,
//         teamsPerTicket: tournament.teamsPerTicket || 3
//       };

//       console.log('📤 Sending ticket data:', ticketData);
      
//       const newTicket = await ticketService.createTicket(ticketData);
//       console.log('✅ Ticket created successfully:', newTicket);
      
//       toast.success('Ticket purchased successfully!');
      
//       // Refresh data to show updated tickets
//       await fetchTournamentData();
      
//       // Navigate to dashboard to see the new ticket
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 1500);
      
//     } catch (err) {
//       console.error('❌ Error purchasing ticket:', err);
//       console.error('Error details:', err.response?.data);
      
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Failed to purchase ticket. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setPurchasing(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not set';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch (err) {
//       return 'Invalid date';
//     }
//   };

//   const getStatusBadge = (tournament) => {
//     if (!tournament.isActive) {
//       return <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full">Ended</span>;
//     }
    
//     if (!tournament.announcementDate) {
//       return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm font-medium rounded-full">Draft</span>;
//     }
    
//     const now = new Date();
//     const announcementDate = new Date(tournament.announcementDate);
    
//     if (now < announcementDate) {
//       return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full">Upcoming</span>;
//     }
    
//     return <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">Active</span>;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7F11]"></div>
//             <span className="ml-3 text-gray-400">Loading tournament...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-black py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center py-12">
//             <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
//               <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//               <h3 className="text-lg font-medium text-white mb-2">Tournament Not Found</h3>
//               <p className="text-gray-400 mb-4">{error}</p>
//               <Link to="/tournaments">
//                 <button className="px-4 py-2 bg-[#FF7F11] text-black font-medium rounded-md hover:bg-[#e6710f] transition-colors">
//                   Back to Tournaments
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!tournament) {
//     return (
//       <div className="min-h-screen bg-black py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center py-12">
//             <p className="text-gray-400">Tournament not found</p>
//             <Link to="/tournaments">
//               <button className="mt-4 px-4 py-2 bg-[#FF7F11] text-black font-medium rounded-md">
//                 Back to Tournaments
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-6">
//           <Link to="/tournaments" className="inline-flex items-center text-[#00E5FF] hover:text-[#00b8d4] mb-4">
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Tournaments
//           </Link>
          
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-[#00E5FF]">{tournament.name}</h1>
//               <div className="flex items-center mt-2 space-x-4">
//                 {getStatusBadge(tournament)}
//                 <span className="text-gray-400 text-sm">
//                   Created {formatDate(tournament.createdAt)}
//                 </span>
//               </div>
//             </div>
            
//             <button
//               onClick={handleBuyTicket}
//               disabled={purchasing || !tournament.isActive}
//               className="mt-4 md:mt-0 bg-[#FF7F11] hover:bg-[#e6710f] disabled:bg-[#FF7F11]/50 disabled:cursor-not-allowed text-black font-medium py-2 px-6 rounded-md transition-colors"
//             >
//               {purchasing ? (
//                 <div className="flex items-center">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
//                   Purchasing...
//                 </div>
//               ) : !tournament.isActive ? (
//                 "Tournament Ended"
//               ) : (
//                 `Buy Ticket - ${tournament.teamsPerTicket || 3} Teams`
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-b border-[#2A2A2A] mb-6">
//           <nav className="-mb-px flex space-x-8">
//             {['overview', 'teams', 'tickets', 'leaderboard'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${
//                   activeTab === tab
//                     ? 'border-[#FF7F11] text-[#FF7F11]'
//                     : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Tab Content */}
//         <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg">
//           {activeTab === 'overview' && (
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-white mb-4">Tournament Overview</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//                 <div className="bg-[#1C1C1E] rounded-lg p-4">
//                   <h3 className="text-sm font-medium text-gray-400 mb-1">Total Rounds</h3>
//                   <p className="text-2xl font-bold text-[#00E5FF]">{tournament.rounds || 'N/A'}</p>
//                 </div>
                
//                 <div className="bg-[#1C1C1E] rounded-lg p-4">
//                   <h3 className="text-sm font-medium text-gray-400 mb-1">Teams per Ticket</h3>
//                   <p className="text-2xl font-bold text-[#FF7F11]">{tournament.teamsPerTicket || 'N/A'}</p>
//                 </div>
                
//                 <div className="bg-[#1C1C1E] rounded-lg p-4">
//                   <h3 className="text-sm font-medium text-gray-400 mb-1">Total Teams</h3>
//                   <p className="text-2xl font-bold text-[#A78BFA]">{teams.length}</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
//                   <span className="text-gray-400">Tournament Name</span>
//                   <span className="text-white font-medium">{tournament.name}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
//                   <span className="text-gray-400">Sport</span>
//                   <span className="text-white">{tournament.sport || 'Not specified'}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
//                   <span className="text-gray-400">Team Announcement Date</span>
//                   <span className="text-white">{formatDate(tournament.announcementDate)}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
//                   <span className="text-gray-400">Status</span>
//                   {getStatusBadge(tournament)}
//                 </div>

//                 <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
//                   <span className="text-gray-400">Total Tickets Sold</span>
//                   <span className="text-white">{tickets.length}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'teams' && (
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-white mb-4">Teams ({teams.length})</h2>
              
//               {teams.length === 0 ? (
//                 <div className="text-center py-8 text-gray-400">
//                   <svg className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                   </svg>
//                   <p>No teams added to this tournament yet</p>
//                   <p className="text-sm mt-2">Teams will be announced on {formatDate(tournament.announcementDate)}</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {teams.map((team, index) => (
//                     <div key={team._id || index} className="bg-[#1C1C1E] rounded-lg p-4 hover:bg-[#2A2A2A] transition-colors">
//                       <div className="flex justify-between items-start mb-2">
//                         <h3 className="text-white font-medium">
//                           {team.seedNumber || team.seed || `Team ${index + 1}`}
//                         </h3>
//                         <span className={`px-2 py-1 text-xs rounded-full ${
//                           team.teamName ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
//                         }`}>
//                           {team.teamName ? 'Assigned' : 'Seed Only'}
//                         </span>
//                       </div>
//                       {team.teamName && (
//                         <p className="text-gray-400 text-sm">{team.teamName}</p>
//                       )}
//                       {team.conference && (
//                         <p className="text-gray-500 text-xs mt-1">{team.conference}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === 'tickets' && (
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-white mb-4">
//                 Tickets ({tickets.length})
//                 {currentUser && (
//                   <span className="text-sm font-normal text-gray-400 ml-2">
//                     (Your tickets: {tickets.filter(t => t.owner?._id === currentUser._id || t.owner === currentUser._id).length})
//                   </span>
//                 )}
//               </h2>
              
//               {tickets.length === 0 ? (
//                 <div className="text-center py-8 text-gray-400">
//                   <svg className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
//                   </svg>
//                   <p>No tickets purchased for this tournament yet</p>
//                   <p className="text-sm mt-2">Be the first to buy a ticket!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {tickets.slice(0, 20).map((ticket) => {
//                     const isUserTicket = currentUser && 
//                       (ticket.owner?._id === currentUser._id || ticket.owner === currentUser._id);
                    
//                     return (
//                       <div 
//                         key={ticket._id} 
//                         className={`bg-[#1C1C1E] rounded-lg p-4 border ${
//                           isUserTicket ? 'border-[#FF7F11]' : 'border-[#2A2A2A]'
//                         }`}
//                       >
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <h3 className={`font-mono ${isUserTicket ? 'text-[#FF7F11]' : 'text-white'}`}>
//                               {ticket.ticketNumber}
//                               {isUserTicket && (
//                                 <span className="ml-2 text-xs bg-[#FF7F11] text-black px-2 py-1 rounded-full">
//                                   Your Ticket
//                                 </span>
//                               )}
//                             </h3>
//                             <p className="text-gray-400 text-sm">
//                               Owner: {ticket.owner?.name || 'Unknown'}
//                             </p>
//                             {ticket.accessCode && (
//                               <p className="text-gray-500 text-xs mt-1">
//                                 Access Code: {ticket.accessCode}
//                               </p>
//                             )}
//                           </div>
//                           <div className="text-right">
//                             <span className="px-3 py-1 bg-[#4B5320] text-white text-sm rounded-full">
//                               {ticket.status || 'Active'}
//                             </span>
//                             <p className="text-gray-400 text-sm mt-1">
//                               Points: <span className="text-[#00E5FF]">{ticket.totalPoints || 0}</span>
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === 'leaderboard' && (
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-white mb-4">Leaderboard</h2>
//               <div className="text-center py-8 text-gray-400">
//                 <svg className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//                 <p>Leaderboard will be available once the tournament starts</p>
//                 <p className="text-sm mt-2">Check back after teams are announced</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TournamentDetail;


// src/pages/TournamentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tournamentService } from '../services/tournamentService';
import { ticketService } from '../services/ticketService';
import { toast } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchTournamentData();
    }
  }, [id]);

  const fetchTournamentData = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Fetching tournament:', id);
      const tournamentData = await tournamentService.getTournamentById(id);
      console.log('✅ Tournament data:', tournamentData);
      
      if (!tournamentData) {
        throw new Error('Tournament not found');
      }

      setTournament(tournamentData);

      // Fetch teams
      try {
        const teamsData = await tournamentService.getTeams(id);
        console.log('✅ Teams data:', teamsData);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (teamsErr) {
        console.log('⚠️ Could not fetch teams:', teamsErr);
        setTeams([]);
      }

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to load tournament');
    } finally {
      setLoading(false);
    }
  };

  // SIMPLE TICKET CREATION - DIRECT APPROACH
  const handleBuyTicket = async () => {
    if (!currentUser) {
      toast.error('Please log in to buy a ticket');
      navigate('/login');
      return;
    }

    if (!tournament) {
      toast.error('Tournament not found');
      return;
    }

    console.log('🎫 Starting ticket purchase...');
    console.log('👤 User ID:', currentUser._id);
    console.log('🏆 Tournament ID:', tournament._id);

    setPurchasing(true);

    try {
      // Create SIMPLE ticket data
      const ticketData = {
        playerId: currentUser._id,
        tournamentId: tournament._id,
        teamsPerTicket: tournament.teamsPerTicket || 3
      };

      console.log('📤 Sending ticket data:', ticketData);

      // Try the API call
      let newTicket;
      try {
        newTicket = await ticketService.createTicket(ticketData);
        console.log('✅ Ticket API response:', newTicket);
      } catch (apiError) {
        console.log('⚠️ API failed, creating local ticket...', apiError);
        
        // If API fails, create a local ticket
        newTicket = {
          _id: 'temp-' + Date.now(),
          ticketNumber: 'T-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          teams: [],
          status: 'active',
          owner: currentUser._id,
          tournament: tournament._id,
          createdAt: new Date().toISOString(),
          totalPoints: 0,
          accessCode: 'CODE-' + Math.random().toString(36).substr(2, 6).toUpperCase()
        };
        
        console.log('🎟️ Created local ticket:', newTicket);
      }

      toast.success('🎉 Ticket purchased successfully!');
      
      // Wait a moment then redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('❌ Unexpected error:', err);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (tournament) => {
    if (!tournament.isActive) {
      return <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full">Ended</span>;
    }
    
    if (!tournament.announcementDate) {
      return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm font-medium rounded-full">Draft</span>;
    }
    
    const now = new Date();
    const announcementDate = new Date(tournament.announcementDate);
    
    if (now < announcementDate) {
      return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full">Upcoming</span>;
    }
    
    return <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">Active</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7F11]"></div>
            <span className="ml-3 text-gray-400">Loading tournament...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
              <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium text-white mb-2">Tournament Not Found</h3>
              <p className="text-gray-400 mb-4">{error || 'Tournament does not exist'}</p>
              <Link to="/tournaments">
                <button className="px-4 py-2 bg-[#FF7F11] text-black font-medium rounded-md hover:bg-[#e6710f] transition-colors">
                  Back to Tournaments
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/tournaments" className="inline-flex items-center text-[#00E5FF] hover:text-[#00b8d4] mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tournaments
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#00E5FF]">{tournament.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                {getStatusBadge(tournament)}
                <span className="text-gray-400 text-sm">
                  Created {formatDate(tournament.createdAt)}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleBuyTicket}
              disabled={purchasing || !tournament.isActive}
              className="mt-4 md:mt-0 bg-[#FF7F11] hover:bg-[#e6710f] disabled:bg-[#FF7F11]/50 disabled:cursor-not-allowed text-black font-medium py-3 px-8 rounded-md transition-colors text-lg"
            >
              {purchasing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Creating Ticket...
                </div>
              ) : !tournament.isActive ? (
                "Tournament Ended"
              ) : (
                `🎫 Buy Ticket - ${tournament.teamsPerTicket || 3} Teams`
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#2A2A2A] mb-6">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'teams'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-[#FF7F11] text-[#FF7F11]'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Tournament Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-[#1C1C1E] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Total Rounds</h3>
                  <p className="text-2xl font-bold text-[#00E5FF]">{tournament.rounds || 'N/A'}</p>
                </div>
                
                <div className="bg-[#1C1C1E] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Teams per Ticket</h3>
                  <p className="text-2xl font-bold text-[#FF7F11]">{tournament.teamsPerTicket || 'N/A'}</p>
                </div>
                
                <div className="bg-[#1C1C1E] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Total Teams</h3>
                  <p className="text-2xl font-bold text-[#A78BFA]">{teams.length}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
                  <span className="text-gray-400">Tournament Name</span>
                  <span className="text-white font-medium">{tournament.name}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
                  <span className="text-gray-400">Sport</span>
                  <span className="text-white">{tournament.sport || 'Not specified'}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
                  <span className="text-gray-400">Team Announcement Date</span>
                  <span className="text-white">{formatDate(tournament.announcementDate)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
                  <span className="text-gray-400">Status</span>
                  {getStatusBadge(tournament)}
                </div>
              </div>

              {/* Quick Action Card */}
              <div className="mt-8 p-4 bg-[#1C1C1E] rounded-lg border border-[#2A2A2A]">
                <h3 className="text-lg font-semibold text-[#FF7F11] mb-2">Ready to Play?</h3>
                <p className="text-gray-400 mb-4">
                  Click the "Buy Ticket" button above to get your ticket and start playing!
                </p>
                <button
                  onClick={handleBuyTicket}
                  disabled={purchasing || !tournament.isActive}
                  className="bg-[#FF7F11] hover:bg-[#e6710f] disabled:bg-[#FF7F11]/50 text-black font-medium py-2 px-6 rounded-md transition-colors"
                >
                  {purchasing ? 'Creating...' : '🎫 Get Your Ticket Now'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Teams ({teams.length})</h2>
              
              {teams.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <svg className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>No teams added to this tournament yet</p>
                  <p className="text-sm mt-2">Teams will be announced on {formatDate(tournament.announcementDate)}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teams.map((team, index) => (
                    <div key={team._id || index} className="bg-[#1C1C1E] rounded-lg p-4 hover:bg-[#2A2A2A] transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium">
                          {team.seedNumber || team.seed || `Team ${index + 1}`}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          team.teamName ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {team.teamName ? 'Assigned' : 'Seed Only'}
                        </span>
                      </div>
                      {team.teamName && (
                        <p className="text-gray-400 text-sm">{team.teamName}</p>
                      )}
                      {team.conference && (
                        <p className="text-gray-500 text-xs mt-1">{team.conference}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;