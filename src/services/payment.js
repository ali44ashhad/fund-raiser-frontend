import { api } from "./auth";

export const paymentAPI = {
  processStripePayment: async (paymentData) => {
    try {
      const res = await api.post("/payment/stripe/process", paymentData);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || err?.message || "Stripe payment failed"
      );
    }
  },

  processPayPalPayment: async (paymentData) => {
    try {
      const res = await api.post("/payment/paypal/process", paymentData);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || err?.message || "PayPal payment failed"
      );
    }
  },

  createStripeIntent: async (amount, currency = "usd") => {
    try {
      const res = await api.post("/payment/stripe/create-intent", {
        amount,
        currency,
      });
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create payment intent"
      );
    }
  },

  createPayPalOrder: async (amount, currency = "USD") => {
    try {
      const res = await api.post("/payment/paypal/create-order", {
        amount,
        currency,
      });
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create PayPal order"
      );
    }
  },

  capturePayPalPayment: async (orderID) => {
    try {
      const res = await api.post("/payment/paypal/capture", { orderID });
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to capture PayPal payment"
      );
    }
  },

  getPaymentHistory: async (userId) => {
    try {
      const res = await api.get(`/payment/history/${userId}`);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch payment history"
      );
    }
  },

  processRefund: async (paymentId, amount) => {
    try {
      const res = await api.post("/payment/refund", { paymentId, amount });
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || err?.message || "Refund failed"
      );
    }
  },

  getPaymentMethods: async (userId) => {
    try {
      const res = await api.get(`/payment/methods/${userId}`);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch payment methods"
      );
    }
  },
};

export default paymentAPI;
