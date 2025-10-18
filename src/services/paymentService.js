import { api } from './auth';

class PaymentService {
  async getAllPayments() {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  async getPaymentById(paymentId) {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  async processRefund(paymentId) {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`);
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async getPaymentStats() {
    try {
      const response = await api.get('/payments/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();