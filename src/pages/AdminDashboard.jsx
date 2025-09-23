import { useState, useEffect } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import UserManagement from "../components/admin/UserManagement";
import TicketManagement from "../components/admin/TicketManagement";
import PaymentManagement from "../components/admin/PaymentManagement";
import { useAuth } from "../contexts/AuthContext";

const TABS = {
  DASHBOARD: "dashboard",
  USERS: "users",
  TICKETS: "tickets",
  PAYMENTS: "payments",

  TOURNAMENTS: "tournaments",
  REPORTS: "reports",
  SETTINGS: "settings",
};

const AdminDashboardPage = () => {
  const storedTab =
    typeof window !== "undefined"
      ? localStorage.getItem("adminActiveTab")
      : null;
  const [activeTab, setActiveTab] = useState(storedTab || TABS.DASHBOARD);
  const { currentUser, isAdmin } = useAuth();

  // persist active tab
  useEffect(() => {
    try {
      localStorage.setItem("adminActiveTab", activeTab);
    } catch (e) {
      // ignore storage errors (e.g., private mode)
    }
  }, [activeTab]);

  // If user isn't admin, show Access Denied (optionally redirect to home/login)
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#050504] flex items-center justify-center px-4">
        <div className="max-w-md text-center p-8 bg-[#0B1D13] border border-[#2A2A2A] rounded-lg shadow">
          <h1 className="text-2xl font-bold text-[#FF7F11] mb-3">
            Access Denied
          </h1>
          <p className="text-gray-400 mb-6">
            You don't have permission to access the admin dashboard.
          </p>

          {/* If you'd like a redirect instead, replace the button's onClick with a navigate('/') or login flow */}
          <button
            onClick={() => window.location.assign("/")}
            className="px-4 py-2 rounded-md bg-[#4B5320] text-white hover:bg-[#FF7F11] transition-colors"
          >
            Return to Home
          </button>
        </div>
      </main>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case TABS.DASHBOARD:
        return <AdminDashboard />;
      case TABS.USERS:
        return <UserManagement />;
      case TABS.TICKETS:
        return <TicketManagement />;
      case TABS.PAYMENTS:
        return <PaymentManagement />;
      // placeholders for future tabs
      case TABS.TOURNAMENTS:
      case TABS.REPORTS:
      case TABS.SETTINGS:
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050504]">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-8 overflow-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#FF7F11]">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}
              </p>
            </div>
            <div>
              {/* small breadcrumb / active tab label */}
              <span className="text-sm text-gray-400">Section</span>
              <div className="mt-1 text-sm font-medium text-white">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </div>
            </div>
          </div>
        </header>

        <main aria-live="polite">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
