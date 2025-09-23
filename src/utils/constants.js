export const APP_CONFIG = {
  NAME: "Sports Fundraiser",
  VERSION: "1.0.0",
  SUPPORT_EMAIL: "support@sportsfundraiser.com",
  SUPPORT_PHONE: "+1 (555) 123-4567",
};

export const TOURNAMENT_TYPES = {
  SUPER_BOWL: "super_bowl",
  MARCH_MADNESS: "march_madness",
  WORLD_CUP: "world_cup",
  CUSTOM: "custom",
};

export const TICKET_TYPES = {
  PAID: "paid",
  FREE: "free",
  RESERVED: "reserved",
};

export const PAYMENT_METHODS = {
  STRIPE: "stripe",
  PAYPAL: "paypal",
  VENMO: "venmo",
  CASH_APP: "cash_app",
  CASH: "cash",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
};

export const USER_ROLES = {
  ADMIN: "admin",
  PLAYER: "player",
};

export const TICKET_PRICES = {
  THREE_TEAMS: 25,
  FOUR_TEAMS: 35,
  FIVE_TEAMS: 45,
  SIX_TEAMS: 55,
};

export const PRIZE_DISTRIBUTION = {
  FIRST_PLACE: 0.5,
  SECOND_PLACE: 0.2,
  THIRD_PLACE: 0.1,
  LOWEST_SCORE: 0.1,
  SECOND_LOWEST: 0.05,
  RANDOM_DRAW: 0.05,
};

export const API_ENDPOINTS = {
  AUTH: {
    ADMIN_LOGIN: "/auth/admin/login",
    ADMIN_REGISTER: "/auth/admin/register",
    PLAYER_LOGIN: "/auth/player/login",
    PLAYER_REGISTER: "/auth/player/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  DASHBOARD: {
    RECENT_PLAYERS: "/dashboard/players/recent",
    RECENT_TOURNAMENTS: "/dashboard/tournaments/recent",
    RECENT_TICKETS: "/dashboard/tickets/recent",
  },
  TOURNAMENTS: {
    BASE: "/tournaments",
    BY_ID: (id) => `/tournaments/${id}`,
  },
  TEAMS: {
    CREATE: "/tournaments/teams",
    LIST: (tournamentId) =>
      `/tournaments/teams/list?tournamentId=${tournamentId}`,
    UPDATE: (teamId) => `/tournaments/teams/${teamId}`,
  },
  TICKETS: {
    CREATE: "/tickets/create",
    LIST: (tournamentId) => `/tickets?tournamentId=${tournamentId}`,
    BY_ID: (ticketId) => `/tickets/${ticketId}`,
  },
  PAYMENT: {
    PROCESS: "/payment/process",
    HISTORY: (userId) => `/payment/history/${userId}`,
    REFUND: "/payment/refund",
  },
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  PAYMENT_FAILED:
    "Payment failed. Please try again or use a different payment method.",
};

export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: "Account created successfully!",
  LOGIN_SUCCESS: "Logged in successfully!",
  PAYMENT_SUCCESS: "Payment processed successfully!",
  PROFILE_UPDATE: "Profile updated successfully!",
  TICKET_PURCHASE: "Ticket purchased successfully!",
};
