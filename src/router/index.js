import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/chargers',
    name: 'charginglist',
    component: () => import('../views/ChargingList.vue'),
        meta: { requiresAuth: true }
      },  
//   {
//     path: '/chargers',
//     name: 'Chargers',
//     // Lazy-loaded component to improve initial load time
//     component: () => import('../views/ChargersListView.vue'),
//     meta: { requiresAuth: true }
//   },
//   {
//     path: '/map',
//     name: 'Map',
//     component: () => import('../views/MapView.vue'),
//     meta: { requiresAuth: true }
//   }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for auth protected routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = localStorage.getItem('token') // Simple auth check

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router