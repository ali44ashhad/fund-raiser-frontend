// src/services/userService.js
import { api } from './auth';

class UserService {
  async getRecentPlayers() {
    try {
      const response = await api.get('/dashboard/players/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent players:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      // You might need to implement this endpoint in your backend
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      // You might need to implement this endpoint in your backend
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      // You might need to implement this endpoint in your backend
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

export const userService = new UserService();