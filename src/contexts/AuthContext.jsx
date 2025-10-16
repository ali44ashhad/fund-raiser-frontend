import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContextContext";

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// --- NEW AUTH LOGIC (cookie-based, user in localStorage, no token) ---

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://fundraiser-backend-pa9y.onrender.com/api";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Save user to localStorage
  const persistUser = (user, adminFlag) => {
    try {
      if (user) {
        console.log("persistUser:", user, adminFlag);

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAdmin", adminFlag ? "true" : "false");
        setIsAdmin(Boolean(adminFlag));
      }
    } catch (e) {
      console.warn("persistUser: localStorage unavailable", e);
    }
  };

  // Login: POST to /auth/admin/login or /auth/player/login, store user in localStorage
  const login = async (email, password, adminFlag = false) => {
    setAuthError(null);
    setLoading(true);
    try {
      const path = `/auth/${adminFlag ? "admin" : "player"}/login`;
      const response = await axios.post(
        API_BASE_URL + path,
        { email, password },
        { withCredentials: true }
      );
      console.log("Authcontext login response:", response.data, adminFlag);
      // user is in response.data.player or response.data.admin
      const user = response.data?.player || response.data?.admin || null;
      console.log("Authcontext login user", user);

      setCurrentUser(user);
      persistUser(user, adminFlag || (user && user.role === "admin"));
      return user;
    } catch (err) {
      setAuthError(
        err?.response?.data?.message || err?.message || "Login failed"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, adminFlag = false) => {
    setAuthError(null);
    setLoading(true);
    try {
      const path = `/auth/${adminFlag ? "admin" : "player"}/register`;
      const response = await axios.post(API_BASE_URL + path, userData, {
        withCredentials: true,
      });
      console.log("Authcontext register response:", response.data, adminFlag);
      const user = response.data?.player || response.data?.admin || null;
      setCurrentUser(user);
      persistUser(user, adminFlag || (user && user.role === "admin"));
      return user;
    } catch (err) {
      setAuthError(
        err?.response?.data?.message || err?.message || "Registration failed"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout: remove user from localStorage and reset state
  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAdmin(false);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
    } catch (e) {
      console.warn("logout: localStorage removal failed", e);
    }
  }, []);

  // On mount, restore user from localStorage (if cookie is valid, backend will accept requests)
  useEffect(() => {
    setLoading(true);
    setAuthError(null);
    try {
      const userStr = localStorage.getItem("user");
      const adminFlag = localStorage.getItem("isAdmin") === "true";
      if (userStr) {
        const user = JSON.parse(userStr);
        // Determine admin status
        const effectiveIsAdmin = adminFlag || (user && user.role === "admin");
        setCurrentUser(user);
        setIsAdmin(effectiveIsAdmin);
        // Always update localStorage to keep isAdmin in sync
        localStorage.setItem("isAdmin", effectiveIsAdmin ? "true" : "false");
      }
    } catch (e) {
      console.log(e);

      setCurrentUser(null);
      setIsAdmin(false);
      localStorage.removeItem("isAdmin");
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading,
    authError,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
