import { createApp } from 'vue'
import App from './App.vue'
// Import Vuetify
import router from '../src/router/index'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' // Make sure to install this package

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi
    }
  }
})

// Import router if you have one
// import router from './router'

// Import store if you have one
// import store from './store'

const app = createApp(App)

// Use Vuetify
app.use(vuetify)

// Use router if you have one
app.use(router)

// Use store if you have one
// app.use(store)

app.mount('#app')