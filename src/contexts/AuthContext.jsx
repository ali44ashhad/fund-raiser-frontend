// src/contexts/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI, api, setAuthToken } from "../services/auth"; // <--- import setAuthToken

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // helper to persist token + isAdmin flag
  const persistAuth = (token, adminFlag) => {
    try {
      if (token) {
        localStorage.setItem("token", token);
        // ensure axios instance header is set
        setAuthToken(token);
      }
      localStorage.setItem("isAdmin", adminFlag ? "true" : "false");
      setIsAdmin(Boolean(adminFlag));
    } catch (e) {
      console.warn("persistAuth: localStorage unavailable", e);
    }
  };

  const login = async (email, password, adminFlag = false) => {
    try {
      const res = await authAPI.login(email, password, adminFlag);
      const { token, user } = res;
      setCurrentUser(user ?? null);
      persistAuth(token, adminFlag || Boolean(user?.role === "admin"));
      return res;
    } catch (err) {
      console.error("login error:", err);
      throw err;
    }
  };

  const register = async (userData, adminFlag = false) => {
    try {
      const res = await authAPI.register(userData, adminFlag);
      const { token, user } = res;
      setCurrentUser(user ?? null);
      persistAuth(token, adminFlag || Boolean(user?.role === "admin"));
      return res;
    } catch (err) {
      console.error("register error:", err);
      throw err;
    }
  };

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAdmin(false);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      // remove default header so further requests don't include stale token
      setAuthToken(null);
    } catch (e) {
      console.warn("logout: localStorage removal failed", e);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const user = await authAPI.verifyToken(token);
      setCurrentUser(user);
      if (user?.role) {
        setIsAdmin(user.role === "admin");
        try {
          localStorage.setItem(
            "isAdmin",
            user.role === "admin" ? "true" : "false"
          );
        } catch (e) {}
      }
      return user;
    } catch (err) {
      console.warn("refreshUser failed:", err);
      logout();
      return null;
    }
  }, [logout]);

  const updateProfile = async (profileData) => {
    try {
      const res = await authAPI.updateProfile(profileData);
      const updated = res?.user ?? res;
      if (updated) {
        setCurrentUser(updated);
      } else {
        await refreshUser();
      }
      return updated;
    } catch (err) {
      console.error("updateProfile error:", err);
      throw err;
    }
  };

  // init: set token header (if present) then verify token
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      setAuthError(null);

      const token = localStorage.getItem("token");
      const savedIsAdmin = localStorage.getItem("isAdmin") === "true";

      if (token) {
        // make sure axios default header is set immediately
        setAuthToken(token);
      } else {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const user = await authAPI.verifyToken(token);
        if (!mounted) return;
        setCurrentUser(user ?? null);

        if (user?.role) {
          setIsAdmin(user.role === "admin");
          try {
            localStorage.setItem(
              "isAdmin",
              user.role === "admin" ? "true" : "false"
            );
          } catch (e) {}
        } else {
          setIsAdmin(savedIsAdmin);
        }
      } catch (err) {
        console.warn("token verify failed:", err);
        logout();
        if (mounted) setAuthError(err?.message ?? "Session expired");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [logout, refreshUser]);

  const value = {
    currentUser,
    isAdmin,
    loading,
    authError,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
