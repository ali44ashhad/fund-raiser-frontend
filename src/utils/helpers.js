// Format currency (safe: falls back to simple formatting if Intl fails)
export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  if (amount == null || Number.isNaN(Number(amount)))
    return formatCurrency(0, currency, locale);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch (e) {
    // Fallback
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
};

// Format date (safe)
export const formatDate = (date, options = {}, locale = "en-US") => {
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  try {
    return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
  } catch (e) {
    return d.toDateString();
  }
};

// Format date with time
export const formatDateTime = (date, locale = "en-US") => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch (e) {
    return d.toString();
  }
};

// Generate random ID (uses crypto when available)
export const generateId = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    return Array.from(values)
      .map((v) => chars[v % chars.length])
      .join("");
  }
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Debounce function with immediate option and cancel
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout = null;

  const debounced = function executedFunction(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

// Truncate text safely
export const truncateText = (text = "", maxLength = 50) => {
  const str = String(text);
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "...";
};

// Calculate total points for a ticket
export const calculateTotalPoints = (teams = []) => {
  if (!Array.isArray(teams)) return 0;
  return teams.reduce(
    (total, team = {}) => total + Number(team.points || 0),
    0
  );
};

// Sort tickets by points
export const sortTicketsByPoints = (tickets = [], ascending = false) => {
  if (!Array.isArray(tickets)) return [];
  return [...tickets].sort((a, b) => {
    const pointsA = calculateTotalPoints(a.teams || []);
    const pointsB = calculateTotalPoints(b.teams || []);
    return ascending ? pointsA - pointsB : pointsB - pointsA;
  });
};

// Filter tickets by type
export const filterTicketsByType = (tickets = [], type) => {
  if (!Array.isArray(tickets)) return [];
  if (!type) return tickets;
  return tickets.filter((ticket) => ticket?.type === type);
};

// Search tickets by team name or number (defensive)
export const searchTickets = (tickets = [], query = "") => {
  if (!Array.isArray(tickets) || !query) return tickets || [];
  const lowerQuery = String(query).toLowerCase();
  return tickets.filter((ticket = {}) => {
    const number = String(ticket.number || "").toLowerCase();
    if (number.includes(lowerQuery)) return true;

    const teams = Array.isArray(ticket.teams) ? ticket.teams : [];
    return teams.some((team = {}) => {
      const name = String(team.name || "").toLowerCase();
      const seed = String(team.seed || "").toLowerCase();
      return name.includes(lowerQuery) || seed.includes(lowerQuery);
    });
  });
};

// Calculate prize distribution
export const calculatePrizes = (totalPool = 0, distribution = {}) => {
  const pool = Number(totalPool) || 0;
  const prizes = {};
  for (const [position, percentage] of Object.entries(distribution || {})) {
    prizes[position] = pool * Number(percentage || 0);
  }
  return prizes;
};

// Validate email format
export const isValidEmail = (email = "") => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).trim());
};

// Validate phone number format (basic international-friendly)
export const isValidPhone = (phone = "") => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/;
  return phoneRegex.test(String(phone).trim());
};

// Get initials from name (safe)
export const getInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

// Local storage helpers (safe JSON)
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error("storage.get error:", e);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

// Generate team combinations (for ticket generation)
// - teams: array of team objects
// - count: number of combos to generate
// - minSize / maxSize: number of teams per combo (defaults 3..6)
export const generateTeamCombinations = (
  teams = [],
  count = 1,
  minSize = 3,
  maxSize = 6
) => {
  const safeTeams = Array.isArray(teams) ? teams.slice() : [];
  if (safeTeams.length === 0 || count <= 0) return [];

  const combos = new Set();
  const results = [];

  const randShuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  while (results.length < count) {
    const size = Math.min(
      Math.max(
        Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
        minSize
      ),
      safeTeams.length
    );
    const shuffled = randShuffle(safeTeams);
    const combo = shuffled.slice(0, size);
    // Use a string key to avoid duplicate combos
    const key = combo
      .map((t) => t.id || t.teamName || JSON.stringify(t))
      .join("|");
    if (!combos.has(key)) {
      combos.add(key);
      results.push(combo);
    }
    // safety break if we can't produce more unique combos
    if (combos.size > 10000) break;
  }

  return results;
};
