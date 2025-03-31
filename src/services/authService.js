// services/authService.js
import axios from 'axios'

// Base URL for API
const API_URL = 'https://ev-charging-stations-backend.onrender.com'

// Add a request interceptor to include auth token in all requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export const authService = {
  // Login user and get token
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Register a new user
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Logout user
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  
  // Get current user from localStorage
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'))
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },
  getToken() {
    return localStorage.getItem('token')
  }
}

export default authService