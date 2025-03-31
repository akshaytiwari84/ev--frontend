// store/modules/auth.js
import authService from '@/services/authService'

const state = {
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null
}

const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user,
  authError: state => state.error,
  isLoading: state => state.loading
}

const actions = {
  // Login action
  login({ commit }, credentials) {
    commit('AUTH_REQUEST')
    return authService.login(credentials)
      .then(data => {
        commit('AUTH_SUCCESS', data)
        return Promise.resolve(data)
      })
      .catch(error => {
        commit('AUTH_ERROR', error)
        return Promise.reject(error)
      })
  },
  
  // Signup action
  signup({ commit }, userData) {
    commit('AUTH_REQUEST')
    return authService.signup(userData)
      .then(data => {
        commit('SIGNUP_SUCCESS', data)
        return Promise.resolve(data)
      })
      .catch(error => {
        commit('AUTH_ERROR', error)
        return Promise.reject(error)
      })
  },

  // Logout action
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('LOGOUT')
      authService.logout()
      resolve()
    })
  },
  
  // Check if token exists and validate it
  checkAuth({ commit }) {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser()
      commit('AUTH_SUCCESS', { 
        token: localStorage.getItem('token'),
        user
      })
    } else {
      commit('LOGOUT')
    }
  }
}

const mutations = {
  AUTH_REQUEST(state) {
    state.loading = true
    state.error = null
  },
  AUTH_SUCCESS(state, data) {
    state.token = data.token
    state.user = data.user
    state.loading = false
    state.error = null
  },
  SIGNUP_SUCCESS(state, data) {
    state.loading = false
    state.error = null
    // Not setting token/user here since we want the user to log in after signup
  },
  AUTH_ERROR(state, error) {
    state.loading = false
    state.error = error.response ? error.response.data.message : error.message
  },
  LOGOUT(state) {
    state.token = ''
    state.user = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}