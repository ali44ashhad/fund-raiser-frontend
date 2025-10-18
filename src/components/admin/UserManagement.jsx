import { useState, useEffect, useRef } from "react";
import { userService } from "../../services/userService";
import { formatDate } from "../../utils/helpers";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch recent users from dashboard API first
        let usersData = [];
        
        try {
          // Try to get recent players from dashboard API
          const recentPlayersResponse = await userService.getRecentPlayers();
          if (recentPlayersResponse && Array.isArray(recentPlayersResponse)) {
            usersData = recentPlayersResponse;
          }
        } catch (err) {
          console.log("Could not fetch recent players, trying alternative methods");
        }

        // If no users from dashboard, try to get from tournaments or tickets data
        if (usersData.length === 0) {
          // You might need to implement a proper users endpoint
          // For now, we'll use mock data as fallback but with proper API structure
          usersData = [
            {
              _id: "1",
              name: "John Doe",
              email: "john@example.com",
              phone: "+91 1234567890",
              role: "player",
              createdAt: "2023-04-15T00:00:00.000Z"
            },
            {
              _id: "2",
              name: "Jane Smith",
              email: "jane@example.com",
              phone: "+91 2345678901",
              role: "player",
              createdAt: "2023-04-10T00:00:00.000Z"
            }
          ];
        }

        // Normalize the data to match our table structure
        const normalized = usersData.map((user, idx) => ({
          id: user._id || user.id || String(idx),
          name: user.name || user.fullName || "Unknown User",
          email: user.email || "No email",
          phone: user.phone || user.contact || "No phone",
          tickets: user.tickets || user.ticketCount || 0, // This would come from tickets API
          status: "Active", // Default status
          joined: user.createdAt || user.joined || new Date().toISOString(),
          role: user.role || "player",
          raw: user,
        }));

        if (mountedRef.current) {
          setUsers(normalized);
        }
      } catch (err) {
        console.error("fetchUsers error:", err);
        if (mountedRef.current) {
          setError("Failed to load users. Please try again.");
          setUsers([]);
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      String(user.name).toLowerCase().includes(q) ||
      String(user.email).toLowerCase().includes(q) ||
      String(user.phone || "").toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "active") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-[#4B5320] text-white rounded-full">
          Active
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-gray-300 rounded-full">
        Inactive
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const r = String(role || "").toLowerCase();
    if (r === "admin") {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-[#FF7F11] text-black rounded-full">
          Admin
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-[#2A2A2A] text-gray-300 rounded-full">
        Player
      </span>
    );
  };

  const viewUser = (user) => {
    const details = `
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}
Role: ${user.role}
Tickets: ${user.tickets}
Status: ${user.status}
Joined: ${formatDate(user.joined)}
`;

    alert(details);
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete user ${user.name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setActionLoading(user.id);
    setError(null);

    try {
      // Since we don't have a delete user endpoint in your API,
      // we'll simulate the deletion for now
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // Remove user from local state
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      
      // In a real implementation, you would call:
      // await userService.deleteUser(user.id);
      
    } catch (err) {
      console.error("deleteUser error:", err);
      setError("Failed to delete user. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (user) => {
    setActionLoading(user.id);
    setError(null);

    try {
      // Simulate status toggle
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
            : u
        )
      );
      
    } catch (err) {
      console.error("toggleStatus error:", err);
      setError("Failed to update user status.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7F11]"
          aria-hidden="true"
        />
        <span className="sr-only">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#FF7F11]">User Management</h1>
          <p className="text-gray-400 mt-1">Manage players and administrators</p>
        </div>

        <div className="mt-4 md:mt-0">
          <label htmlFor="user-search" className="sr-only">
            Search users
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              id="user-search"
              type="text"
              className="bg-[#0B1D13] border border-[#2A2A2A] text-gray-300 rounded-md pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#FF7F11] focus:border-transparent"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search users"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-500/20 border border-red-500/50 p-4 text-red-400">
          <div className="flex">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg shadow">
        <div className="px-6 py-4 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Users ({filteredUsers.length})
            </h3>
            <span className="text-sm text-gray-400">
              {users.length} total users
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2A2A2A]">
            <thead className="bg-[#1C1C1E]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      No users found
                      {debouncedSearch && (
                        <span className="text-sm mt-1">Try adjusting your search</span>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#1C1C1E]/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#2A2A2A] rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-300">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{user.email}</div>
                      <div className="text-sm text-gray-400">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{user.tickets}</div>
                      <div className="text-xs text-gray-400">tickets</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(user.joined)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => viewUser(user)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="View Details"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionLoading === user.id}
                          className="text-green-400 hover:text-green-300 p-1 disabled:opacity-50"
                          title="Toggle Status"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={actionLoading === user.id}
                          className="text-red-400 hover:text-red-300 p-1 disabled:opacity-50"
                          title="Delete User"
                        >
                          {actionLoading === user.id ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" fill="none" />
                              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" className="opacity-75" fill="none" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;