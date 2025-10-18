

// import { useAuth } from "../../contexts/AuthContext";
import useAuth from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "tickets", label: "Ticket Management", icon: "🎫" },
    { id: "payments", label: "Payment Management", icon: "💳" },
    { id: "tournaments", label: "Tournaments", icon: "🏆" },
    { id: "reports", label: "Reports", icon: "📈" }, 
  ];

  return (
    <aside
     className="w-64 bg-[#0B1D13] border-r border-[#2A2A2A] flex flex-col overflow-hidden"

      aria-label="Admin Sidebar"
    >
      {/* Logo */}
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-[#4B5320] rounded-md flex items-center justify-center mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2M6 21h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#FF7F11]">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? "bg-[#4B5320] text-white"
                : "text-gray-300 hover:bg-[#2A2A2A] hover:text-[#FF7F11]"
            }`}
            aria-current={activeTab === item.id ? "page" : undefined}
          >
            <span className="text-lg mr-3" aria-hidden="true">
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2A2A2A]">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-[#FF1E1E] rounded-full flex items-center justify-center text-white font-semibold mr-3">
            {getInitials(currentUser?.name || "A")}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {currentUser?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-[#FF1E1E] hover:bg-[#2A2A2A] rounded-lg transition-colors"
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
