// src/services/chargingStationService.js
import axios from 'axios';
import authService from './authService';

const API_URL = 'https://ev-charging-stations-backend.onrender.com';

class ChargingStationService {
  // Get all charging stations with optional filters
  async getChargingStations(filters = {}) {
    try {
      const token = authService.getToken();
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.connectorType) queryParams.append('connectorType', filters.connectorType);
      if (filters.minPowerOutput) queryParams.append('minPowerOutput', filters.minPowerOutput);
      if (filters.maxPowerOutput) queryParams.append('maxPowerOutput', filters.maxPowerOutput);
      
      const queryString = queryParams.toString();
      const url = `${API_URL}/charging-stations${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching charging stations:', error);
      throw error;
    }
  }
  
  // Get a specific charging station by ID
  async getChargingStationById(id) {
    try {
      const token = authService.getToken();
      
      const response = await axios.get(`${API_URL}/charging-stations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching charging station with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Create a new charging station
  async createChargingStation(stationData) {
    try {
      const token = authService.getToken();
      
      const response = await axios.post(`${API_URL}/charging-stations`, stationData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating charging station:', error);
      throw error;
    }
  }
  
  // Update an existing charging station
  async updateChargingStation(id, stationData) {
    try {
      console.log('3')
      const token = authService.getToken();
      
      const response = await axios.put(`${API_URL}/charging-stations/${id}`, stationData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating charging station with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Delete a charging station
  async deleteChargingStation(id) {
    try {
      const token = authService.getToken();
      
      const response = await axios.delete(`${API_URL}/charging-stations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting charging station with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new ChargingStationService();