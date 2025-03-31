import { createStore } from 'vuex'
import auth from './modules/auth'

// Import other modules as needed
// import chargers from './modules/chargers'

export default createStore({
  modules: {
    auth,
    // Add other modules here
    // chargers
  }
})