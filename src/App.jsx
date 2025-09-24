import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import ScrollToTop from "./components/common/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import HowToPlay from "./pages/HowToPlay";
import Rules from "./pages/Rules";
import Leaderboard from "./pages/Leaderboard";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";
import TermsOfService from "./pages/TermsOfServices";
import Tournaments from "./pages/Tournaments";

import { Toaster } from "react-hot-toast"; // 👈 modern notifications
import "./index.css";
import TicketsPage from "./pages/Tickets";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop /> {/* ensures scroll to top on route change */}
        <div className="min-h-screen bg-black text-white flex flex-col">
          <Header />

          <Toaster
            position="top-center"
            reverseOrder={false}
            containerStyle={{ top: "25px" }} // 👈 explicitly "25px"
            toastOptions={{
              style: {
                background: "#333",
                color: "#fff",
                fontSize: "14px",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4CAF50",
                  secondary: "#333",
                },
              },
              error: {
                duration: 3000,
                theme: {
                  primary: "#FF1E1E",
                  secondary: "#333",
                },
              },
            }}
          />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/how-to-play" element={<HowToPlay />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tickets" element={<TicketsPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
