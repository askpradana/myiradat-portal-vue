import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import EmailVerificationView from '@/views/auth/EmailVerificationView.vue'
import CreateNewUserView from '@/views/admin/CreateNewUserView.vue'
import UserServicesListView from '@/views/admin/UserServicesListView.vue'
import CreateUserBatchView from '@/views/admin/CreateUserBatchView.vue'
import { useUserStore } from '@/stores/userStores'
import '@/types/router'

// Route configuration helpers
const createRoute = (
  path: string,
  name: string,
  component: RouteRecordRaw['component'],
  title: string,
  overrideMeta?: Partial<RouteRecordRaw['meta']>
): RouteRecordRaw => ({
  path,
  name,
  component,
  meta: {
    requiresAuth: false,
    requiresGuest: false,
    title,
    ...overrideMeta,
  },
} as RouteRecordRaw)

const createGuestRoute = (
  path: string,
  name: string,
  component: RouteRecordRaw['component'],
  title: string
): RouteRecordRaw =>
  createRoute(path, name, component, title, {
    requiresGuest: true,
  })

const createProtectedRoute = (
  path: string,
  name: string,
  component: RouteRecordRaw['component'],
  title: string
): RouteRecordRaw =>
  createRoute(path, name, component, title, {
    requiresAuth: true,
  })

// Route groups
const publicRoutes: RouteRecordRaw[] = [
  createRoute('/verify-email', 'verify-email', EmailVerificationView, 'Verify Email'),
]

const guestOnlyRoutes: RouteRecordRaw[] = [
  createGuestRoute('/', 'home', () => import('../views/home/HomeView.vue'), 'Home'),
  createGuestRoute('/register', 'register', RegisterView, 'Register'),
  createGuestRoute('/login', 'login', LoginView, 'Login'),
]

const protectedRoutes: RouteRecordRaw[] = [
  createProtectedRoute('/dashboard', 'dashboard', DashboardView, 'Dashboard'),
  createProtectedRoute('/dashboard/admin/create-user', 'create-user-page', CreateNewUserView, 'Create User'),
  createProtectedRoute('/dashboard/admin/create-user-batch', 'create-user-batch-page', CreateUserBatchView, 'Create User Batch'),
  createProtectedRoute('/dashboard/:id/services', 'user-service-list', UserServicesListView, 'User Services'),
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...guestOnlyRoutes,
    ...protectedRoutes,
    // Commented routes can be easily added back when needed
    // createRoute('/about', 'about', () => import('../views/AboutView.vue'), 'About'),
  ],
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // Always initialize authentication state to ensure fresh validation
  userStore.initializeAuth()
  
  // Double-check token validity after initialization
  const isTokenValid = userStore.isAuthenticated && userStore.isTokenValid()
  
  // If token is invalid but user appears authenticated, clear state
  if (userStore.isAuthenticated && !isTokenValid) {
    userStore.clearAuthData()
  }

  const requiresAuth = to.meta.requiresAuth
  const requiresGuest = to.meta.requiresGuest
  const isAuthenticated = userStore.isAuthenticated && isTokenValid

  // Validate redirect URL to prevent open redirects
  const validateRedirectUrl = (url: string): boolean => {
    try {
      const redirectUrl = new URL(url, window.location.origin)
      return redirectUrl.origin === window.location.origin
    } catch {
      return false
    }
  }

  // Check if route requires authentication
  if (requiresAuth && !isAuthenticated) {
    const redirectPath = validateRedirectUrl(to.fullPath) ? to.fullPath : '/dashboard'
    next({
      name: 'login',
      query: { redirect: redirectPath }
    })
    return
  }

  // Check if route requires guest (unauthenticated) status
  if (requiresGuest && isAuthenticated) {
    // Redirect to dashboard if already authenticated
    next({ name: 'dashboard' })
    return
  }

  // Proceed with navigation
  next()
})

export default router
