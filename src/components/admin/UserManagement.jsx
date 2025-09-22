// src/components/admin/UserManagement.jsx
import { useState, useEffect, useRef } from "react";
import adminAPI from "../../services/admin";
import { formatDate } from "../../utils/helpers";

/**
 * UserManagement page
 *
 * - Uses adminAPI.getUsers(page, limit, search) if available.
 * - Falls back to mock data if the API isn't present.
 */
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // user id for action spinner
  const mountedRef = useRef(true);

  // Local mock data used when backend isn't available
  const mockUsers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "(123) 456-7890",
      tickets: 3,
      status: "Active",
      joined: "2023-04-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(234) 567-8901",
      tickets: 5,
      status: "Active",
      joined: "2023-04-10",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "(345) 678-9012",
      tickets: 2,
      status: "Inactive",
      joined: "2023-04-05",
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "(456) 789-0123",
      tickets: 7,
      status: "Active",
      joined: "2023-03-28",
    },
    {
      id: "5",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "(567) 890-1234",
      tickets: 1,
      status: "Active",
      joined: "2023-03-22",
    },
  ];

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // debounce searchTerm -> debouncedSearch
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // fetch users whenever debouncedSearch changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        let res = null;

        // Prefer adminAPI.getUsers(page, limit, search) if available
        if (adminAPI.getUsers) {
          // pass search as third param (your adminAPI accepts (page, limit, search))
          res = await adminAPI
            .getUsers(1, 50, debouncedSearch)
            .catch(() => null);
        }

        // Normalize response to an array
        let data =
          (res &&
            (Array.isArray(res)
              ? res
              : res?.data ?? res?.users ?? res?.results ?? null)) ||
          null;

        // If API didn't return usable data, fall back to mock filtered by search
        if (!data) {
          const q = (debouncedSearch || "").toLowerCase();
          data = mockUsers.filter(
            (u) =>
              !q ||
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              u.phone.toLowerCase().includes(q)
          );
        }

        // Ensure array and normalize fields
        const normalized = (Array.isArray(data) ? data : []).map((u, idx) => ({
          id: u.id ?? u._id ?? String(idx),
          name: u.name ?? u.fullName ?? u.username ?? "—",
          email: u.email ?? u.emailAddress ?? "—",
          phone: u.phone ?? u.contact ?? "—",
          tickets: u.tickets ?? u.ticketCount ?? 0,
          status: u.status ?? u.state ?? "Active",
          joined:
            u.joined ??
            u.createdAt ??
            u.registeredAt ??
            u.date ??
            new Date().toISOString(),
          raw: u,
        }));

        if (mountedRef.current) {
          setUsers(normalized);
        }
      } catch (err) {
        console.error("fetchUsers error:", err);
        if (mountedRef.current) {
          setError("Failed to load users — showing sample data.");
          // fallback to mock
          setUsers(mockUsers);
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  const filteredUsers = users.filter((user) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      String(user.name).toLowerCase().includes(q) ||
      String(user.email).toLowerCase().includes(q) ||
      String(user.phone || "")
        .toLowerCase()
        .includes(q)
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

  const viewUser = (user) => {
    const details = `
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}
Tickets: ${user.tickets}
Status: ${user.status}
Joined: ${formatDate(user.joined)}
`;
    // replace with modal as needed
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
      // Call adminAPI.deleteUser(userId) if available
      if (adminAPI.deleteUser) {
        await adminAPI.deleteUser(user.id);
      } else if (adminAPI.delete) {
        // generic delete fallback if your adminAPI supports a generic delete method
        await adminAPI.delete(`/users/${user.id}`);
      } else {
        // simulate delay
        await new Promise((r) => setTimeout(r, 600));
      }

      // Optimistically remove user from UI
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error("deleteUser error:", err);
      setError("Failed to delete user. Try again.");
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-[#FF7F11]">User Management</h1>

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
        <div className="rounded-md bg-[#2a1b18] p-3 border border-[#5a2a1a] text-[#FF7F11]">
          {error}
        </div>
      )}

      <div className="bg-[#0B1D13] border border-[#2A2A2A] rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2A2A2A]">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tickets
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#2A2A2A] transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                      {user.phone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                      {user.tickets}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                      {formatDate(user.joined)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => viewUser(user)}
                        className="text-[#FF7F11] hover:text-[#FF1E1E] mr-3"
                        aria-label={`View ${user.name}`}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(user)}
                        className="text-[#FF1E1E] hover:text-[#FF7F11] disabled:opacity-60"
                        disabled={actionLoading && actionLoading !== user.id}
                        aria-label={`Delete ${user.name}`}
                      >
                        {actionLoading === user.id ? (
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="opacity-25"
                              fill="none"
                            />
                            <path
                              d="M4 12a8 8 0 018-8"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="opacity-75"
                              fill="none"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                            />
                          </svg>
                        )}
                      </button>
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
