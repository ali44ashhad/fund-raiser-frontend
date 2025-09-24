// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://fundraiser-backend-pa9y.onrender.com/api";

// // Create a single shared axios instance
// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const setAuthToken = (token) => {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// };

// api.interceptors.request.use(
//   (config) => {
//     if (!config.headers?.Authorization) {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       try {
//         localStorage.removeItem("token");
//         localStorage.removeItem("isAdmin");
//       } catch (e) {}

//       try {
//         delete api.defaults.headers.common["Authorization"];
//       } catch (e) {}
//     }
//     return Promise.reject(error);
//   }
// );

// const rolePath = (isAdmin) => (isAdmin ? "admin" : "player");

// export const authAPI = {
//   login: async (email, password, isAdmin = false) => {
//     try {
//       const path = `/auth/${rolePath(isAdmin)}/login`;
//       const response = await api.post(
//         path,
//         { email, password },
//         { withCredentials: true }
//       );

//       console.log("login response.data:", response.data);

//       const { token, user } = response.data;
//       if (token) {
//         localStorage.setItem("token", token);
//         const derivedIsAdmin =
//           Boolean(user?.role === "admin") || Boolean(isAdmin);
//         localStorage.setItem("isAdmin", derivedIsAdmin ? "true" : "false");

//         setAuthToken(token);
//       }
//       return { token, user };
//     } catch (error) {
//       throw new Error(
//         error?.response?.data?.message || error?.message || "Login failed"
//       );
//     }
//   },
//   // ...

//   register: async (userData, isAdmin = false) => {
//     try {
//       const path = `/auth/${rolePath(isAdmin)}/register`;
//       const response = await api.post(path, userData);
//       const { token, user } = response.data;
//       if (token) {
//         localStorage.setItem("token", token);
//         const derivedIsAdmin =
//           Boolean(user?.role === "admin") || Boolean(isAdmin);
//         localStorage.setItem("isAdmin", derivedIsAdmin ? "true" : "false");
//         setAuthToken(token);
//       }
//       return { token, user };
//     } catch (error) {
//       throw new Error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Registration failed"
//       );
//     }
//   },

//   verifyToken: async (token) => {
//     try {
//       if (!token) throw new Error("No token provided");
//       const headers = { Authorization: `Bearer ${token}` };

//       try {
//         const res = await axios.get(`${API_BASE_URL}/auth/verify`, { headers });
//         return res.data.user;
//       } catch (err) {}

//       const isAdminLocal = localStorage.getItem("isAdmin") === "true";
//       const path = `${API_BASE_URL}/auth/${
//         isAdminLocal ? "admin" : "player"
//       }/verify`;
//       const resp = await axios.get(path, { headers });
//       return resp.data.user;
//     } catch (error) {
//       const message =
//         error?.response?.data?.message ?? error?.message ?? "Invalid token";
//       throw new Error(message);
//     }
//   },

//   forgotPassword: async (email) => {
//     try {
//       const response = await api.post("/auth/forgot-password", { email });
//       return response.data;
//     } catch (error) {
//       throw new Error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Password reset request failed"
//       );
//     }
//   },

//   resetPassword: async (token, newPassword) => {
//     try {
//       const response = await api.post("/auth/reset-password", {
//         token,
//         newPassword,
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Password reset failed"
//       );
//     }
//   },

//   getProfile: async () => {
//     try {
//       const response = await api.get("/user/profile");
//       return response.data;
//     } catch (error) {
//       throw new Error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to fetch profile"
//       );
//     }
//   },

//   updateProfile: async (profileData) => {
//     try {
//       const response = await api.put("/user/profile", profileData);
//       return response.data;
//     } catch (error) {
//       throw new Error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to update profile"
//       );
//     }
//   },
// };

// export default authAPI;

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://fundraiser-backend-pa9y.onrender.com/api";

// Create a single shared axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // send cookies by default so backend-set cookies (httpOnly JWT or session) are included
  withCredentials: true,
});

// also ensure default is set in case someone uses api after runtime changes
api.defaults.withCredentials = true;

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.request.use(
  (config) => {
    if (!config.headers?.Authorization) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
      } catch (e) {}
      try {
        delete api.defaults.headers.common["Authorization"];
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

const rolePath = (isAdmin) => (isAdmin ? "admin" : "player");

const pickTokenAndUser = (data = {}) => {
  // handle many server shapes: { token, user }, { token, player }, { accessToken, player }, { success, player, token? }
  const token =
    data.token ||
    data.accessToken ||
    data.access_token ||
    data.jwt ||
    data.sessionToken ||
    null;

  // user object may be under different keys
  const user =
    data.user ||
    data.player ||
    data.admin || // new added
    data.player?.player ||
    data.admin?.admin || // added new
    data.data?.user ||
    data.data?.player ||
    null;

  return { token, user };
};

export const authAPI = {
  login: async (email, password, isAdmin = false) => {
    try {
      const path = `/auth/${rolePath(isAdmin)}/login`;
      // explicitly send credentials for cookie-based auth
      const response = await api.post(
        path,
        { email, password },
        { withCredentials: true }
      );

      console.log("login response.data:", response.data);

      // robust extraction
      const { token, user } = pickTokenAndUser(response.data);

      if (token) {
        try {
          localStorage.setItem("token", token);
        } catch (e) {
          console.warn("Could not persist token to localStorage", e);
        }
        const derivedIsAdmin =
          Boolean(user?.role === "admin") || Boolean(isAdmin);
        try {
          localStorage.setItem("isAdmin", derivedIsAdmin ? "true" : "false");
        } catch (e) {}

        setAuthToken(token);
      } else {
        // If backend uses cookies (httpOnly session) instead of returning a token,
        // we can't set Authorization header — we rely on cookies (we set withCredentials above).
        console.log("No token in response — assuming cookie/session auth");
      }

      return { token, user: user ?? null, raw: response.data };
    } catch (error) {
      // try to pull message safely
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed";
      throw new Error(message);
    }
  },

  register: async (userData, isAdmin = false) => {
    try {
      const path = `/auth/${rolePath(isAdmin)}/register`;
      const response = await api.post(path, userData, {
        withCredentials: true,
      });

      console.log("register response.data:", response.data);

      const { token, user } = pickTokenAndUser(response.data);

      if (token) {
        try {
          localStorage.setItem("token", token);
        } catch (e) {
          console.warn("Could not persist token to localStorage", e);
        }
        const derivedIsAdmin =
          Boolean(user?.role === "admin") || Boolean(isAdmin);
        try {
          localStorage.setItem("isAdmin", derivedIsAdmin ? "true" : "false");
        } catch (e) {}
        setAuthToken(token);
      }

      return { token, user: user ?? null, raw: response.data };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Registration failed";
      throw new Error(message);
    }
  },

  verifyToken: async (token) => {
    try {
      if (!token) throw new Error("No token provided");

      const headers = { Authorization: `Bearer ${token}` };

      // try generic endpoint first (some backends expose /auth/verify)
      try {
        const res = await api.get(`/auth/verify`, { headers });
        // normalize
        return res.data?.user ?? res.data?.player ?? res.data;
      } catch (err) {
        // fallback to role-specific path
      }

      const isAdminLocal = localStorage.getItem("isAdmin") === "true";
      const path = `/auth/${isAdminLocal ? "admin" : "player"}/verify`;
      const resp = await api.get(path, { headers });
      return resp.data?.user ?? resp.data?.player ?? resp.data;
    } catch (error) {
      const message =
        error?.response?.data?.message ?? error?.message ?? "Invalid token";
      throw new Error(message);
    }
  },

  // ... other functions unchanged, but using api instance (which has withCredentials)
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Password reset request failed"
      );
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Password reset failed"
      );
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/user/profile");
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch profile"
      );
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/user/profile", profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile"
      );
    }
  },
};

export default authAPI;
