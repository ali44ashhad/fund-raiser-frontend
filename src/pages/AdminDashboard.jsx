// import { useState, useEffect } from "react";
// import AdminSidebar from "../components/admin/AdminSidebar";
// import AdminDashboard from "../components/admin/AdminDashboard";
// import UserManagement from "../components/admin/UserManagement";
// import TicketManagement from "../components/admin/TicketManagement";
// import PaymentManagement from "../components/admin/PaymentManagement";
// import { useAuth } from "../contexts/AuthContext";

// const TABS = {
//   DASHBOARD: "dashboard",
//   USERS: "users",
//   TICKETS: "tickets",
//   PAYMENTS: "payments",

//   TOURNAMENTS: "tournaments",
//   REPORTS: "reports",
//   SETTINGS: "settings",
// };

// const AdminDashboardPage = () => {
//   const storedTab =
//     typeof window !== "undefined"
//       ? localStorage.getItem("adminActiveTab")
//       : null;
//   const [activeTab, setActiveTab] = useState(storedTab || TABS.DASHBOARD);
//   const { currentUser, isAdmin } = useAuth();

//   // persist active tab
//   useEffect(() => {
//     try {
//       localStorage.setItem("adminActiveTab", activeTab);
//     } catch (e) {
//       // ignore storage errors (e.g., private mode)
//     }
//   }, [activeTab]);

//   // If user isn't admin, show Access Denied (optionally redirect to home/login)
//   if (!isAdmin) {
//     return (
//       <main className="min-h-screen bg-[#050504] flex items-center justify-center px-4">
//         <div className="max-w-md text-center p-8 bg-[#0B1D13] border border-[#2A2A2A] rounded-lg shadow">
//           <h1 className="text-2xl font-bold text-[#FF7F11] mb-3">
//             Access Denied
//           </h1>
//           <p className="text-gray-400 mb-6">
//             You don't have permission to access the admin dashboard.
//           </p>

//           {/* If you'd like a redirect instead, replace the button's onClick with a navigate('/') or login flow */}
//           <button
//             onClick={() => window.location.assign("/")}
//             className="px-4 py-2 rounded-md bg-[#4B5320] text-white hover:bg-[#FF7F11] transition-colors"
//           >
//             Return to Home
//           </button>
//         </div>
//       </main>
//     );
//   }

//   const renderContent = () => {
//     switch (activeTab) {
//       case TABS.DASHBOARD:
//         return <AdminDashboard />;
//       case TABS.USERS:
//         return <UserManagement />;
//       case TABS.TICKETS:
//         return <TicketManagement />;
//       case TABS.PAYMENTS:
//         return <PaymentManagement />;
//       // placeholders for future tabs
//       case TABS.TOURNAMENTS:
//       case TABS.REPORTS:
//       case TABS.SETTINGS:
//       default:
//         return <AdminDashboard />;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#050504]">
//       <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//       <div className="flex-1 p-8 overflow-auto">
//         <header className="mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-[#FF7F11]">
//                 Admin Dashboard
//               </h1>
//               <p className="text-gray-400 mt-1">
//                 Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}
//               </p>
//             </div>
//             <div>
//               {/* small breadcrumb / active tab label */}
//               <span className="text-sm text-gray-400">Section</span>
//               <div className="mt-1 text-sm font-medium text-white">
//                 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//               </div>
//             </div>
//           </div>
//         </header>

//         <main aria-live="polite">{renderContent()}</main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardPage;

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // for hamburger icons
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import UserManagement from "../components/admin/UserManagement";
import TicketManagement from "../components/admin/TicketManagement";
import PaymentManagement from "../components/admin/PaymentManagement";
import TournamentManagement from "../components/admin/TournamentManagement"; 
import SettingsManagement from "../components/admin/SettingsManagement";
import useAuth from "../hooks/useAuth";
import TeamsManagement from "../components/admin/TeamsManagement";
import ScoreManagement from "../components/admin/ScoreManagement";

const TABS = {
  DASHBOARD: "dashboard",
  USERS: "users",
  TICKETS: "tickets",
  PAYMENTS: "payments",
  TOURNAMENTS: "tournaments", 
  TEAMS: "teams",
  SCORES: "scores",
};

const AdminDashboardPage = () => {
  const storedTab =
    typeof window !== "undefined"
      ? localStorage.getItem("adminActiveTab")
      : null;

  const [activeTab, setActiveTab] = useState(storedTab || TABS.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile toggle
  const { currentUser, isAdmin } = useAuth();

  // persist active tab
  useEffect(() => {
    try {
      localStorage.setItem("adminActiveTab", activeTab);
    } catch (e) {
      // ignore storage errors (e.g., private mode)
      console.log(e);
    }
  }, [activeTab]);

  // If user isn't admin, show Access Denied
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
        return <TournamentManagement />; 
      case TABS.SETTINGS:
        return <SettingsManagement />;
      case TABS.TEAMS:
        return <TeamsManagement />;
      case TABS.SCORES:
        return <ScoreManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#050504]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 w-64 transform bg-[#0B1D13] border-r border-[#2A2A2A] md:static md:translate-x-0 transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 overflow-auto">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md bg-[#1C1C1E] text-white hover:bg-[#FF7F11]"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Right side - active tab label */}
          <div className="hidden sm:block">
            <span className="text-xs sm:text-sm text-gray-400">Section</span>
            <div className="mt-1 text-sm font-medium text-white">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </div>
          </div>
        </header>

        {/* Close button for mobile sidebar */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 left-4 z-50 p-2 rounded-md bg-[#1C1C1E] text-white hover:bg-[#FF7F11]"
          >
            <X size={20} />
          </button>
        )}

        {/* Main content area */}
        <main aria-live="polite">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
