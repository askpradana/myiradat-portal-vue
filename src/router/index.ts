import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import EmailVerificationView from '@/views/auth/EmailVerificationView.vue'
import CreateNewUserView from '@/views/admin/CreateNewUserView.vue'
import UserServicesListView from '@/views/admin/UserServicesListView.vue'
import CreateUserBatchView from '@/views/admin/CreateUserBatchView.vue'
import CreateNewOrganizationView from '@/views/admin/CreateNewOrganizationView.vue'
import OrganizationDetailView from '@/views/admin/OrganizationDetailView.vue'
import EditOrganizationView from '@/views/admin/EditOrganizationView.vue'
import ForgotPasswordUserView from '@/views/auth/ForgotPasswordUserView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'
import ProfileUserDetailView from '@/views/admin/ProfileUserDetailView.vue'
import { useUserStore } from '@/stores/userStores'
import { getUserRole, getRoleRedirectPath, isTabAccessible } from '@/lib/dashboard-utils'
import type { DashboardTab } from '@/types/dashboard'
import '@/types/router'

// Route configuration helpers
const createRoute = (
  path: string,
  name: string,
  component: RouteRecordRaw['component'],
  title: string,
  overrideMeta?: Partial<RouteRecordRaw['meta']>,
): RouteRecordRaw =>
  ({
    path,
    name,
    component,
    meta: {
      requiresAuth: false,
      requiresGuest: false,
      title,
      ...overrideMeta,
    },
  }) as RouteRecordRaw

const createGuestRoute = (
  path: string,
  name: string,
  component: RouteRecordRaw['component'],
  title: string,
): RouteRecordRaw =>
  createRoute(path, name, component, title, {
    requiresGuest: true,
  })

const createProtectedRoute = (
  path: string,
  name: string,
  component: RouteRecordRaw['component'],
  title: string,
): RouteRecordRaw =>
  createRoute(path, name, component, title, {
    requiresAuth: true,
  })

// Route groups
const publicRoutes: RouteRecordRaw[] = [
  createRoute('/verify-email', 'verify-email', EmailVerificationView, 'Verify Email'),
  createRoute('/book-demo', 'book-demo', () => import('../views/BookDemoView.vue'), 'Book Demo'),
  createRoute(
    '/case-studies',
    'case-studies',
    () => import('../views/CaseStudiesView.vue'),
    'Case Studies',
  ),
  createRoute(
    '/contact-us',
    'contact-us',
    () => import('../views/ContactUsView.vue'),
    'Contact Us',
  ),
]

const guestOnlyRoutes: RouteRecordRaw[] = [
  createGuestRoute('/', 'home', () => import('../views/home/HomeView.vue'), 'Home'),
  createGuestRoute('/register', 'register', RegisterView, 'Register'),
  createGuestRoute('/login', 'login', LoginView, 'Login'),
  createGuestRoute(
    '/forgot-password',
    'forgot-password',
    ForgotPasswordUserView,
    'Forgot-password',
  ),
]

const protectedRoutes: RouteRecordRaw[] = [
  createProtectedRoute('/dashboard', 'dashboard', DashboardView, 'Dashboard'),
  createRoute(
    '/dashboard/admin/create-user',
    'create-user-page',
    CreateNewUserView,
    'Create User',
    {
      requiresAuth: true,
      requiredRoles: ['admin'],
      fallbackRoute: '/dashboard?tab=dashboard',
    },
  ),
  createRoute(
    '/dashboard/admin/create-user-batch',
    'create-user-batch-page',
    CreateUserBatchView,
    'Create User Batch',
    {
      requiresAuth: true,
      requiredRoles: ['admin'],
      fallbackRoute: '/dashboard?tab=dashboard',
    },
  ),
  createProtectedRoute(
    '/dashboard/:id/services',
    'user-service-list',
    UserServicesListView,
    'User Services',
  ),
  createRoute(
    '/dashboard/admin/create-organization',
    'create-organization-page',
    CreateNewOrganizationView,
    'Create Organization',
    {
      requiresAuth: true,
      requiredRoles: ['admin'],
      fallbackRoute: '/dashboard?tab=dashboard',
    },
  ),
  createRoute(
    '/dashboard/admin/organization/:id/update',
    'edit-organization-page',
    EditOrganizationView,
    'Edit Organization',
    {
      requiresAuth: true,
      requiredRoles: ['admin'],
      fallbackRoute: '/dashboard?tab=dashboard',
    },
  ),
  createRoute(
    '/dashboard/admin/organization/:id/details',
    'organization-detail-page',
    OrganizationDetailView,
    'Organization Details',
    {
      requiresAuth: true,
      requiredRoles: ['admin'],
      fallbackRoute: '/dashboard?tab=dashboard',
    },
  ),
  createRoute(
    '/dashboard/admin/users/:id/profile',
    'profile-detail-user',
    ProfileUserDetailView,
    'Profile User Details',
    {
      requiresAuth: true,
      requiredRoles: ['admin'],
      fallbackRoute: '/dashboard?tab=dashboard',
    },
  ),
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...guestOnlyRoutes,
    ...protectedRoutes,
    // Commented routes can be easily added back when needed
    // createRoute('/about', 'about', () => import('../views/AboutView.vue'), 'About'),

    // 404 catch-all route - must be last
    createRoute('/:pathMatch(.*)*', 'not-found', NotFoundView, 'Page Not Found'),
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
  const requiredRoles = to.meta.requiredRoles
  const fallbackRoute = to.meta.fallbackRoute
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
    let redirectPath = '/dashboard'

    // Only save redirect path if it's valid and accessible
    if (validateRedirectUrl(to.fullPath)) {
      redirectPath = to.fullPath
    }

    next({
      name: 'login',
      query: { redirect: redirectPath },
    })
    return
  }

  // Check if route requires guest (unauthenticated) status
  if (requiresGuest && isAuthenticated) {
    // Redirect to role-appropriate dashboard
    const userRole = getUserRole(userStore.user)
    const defaultPath = getRoleRedirectPath(userRole)
    next(defaultPath)
    return
  }

  // Check role-based access for authenticated users
  if (isAuthenticated && requiredRoles && requiredRoles.length > 0) {
    const userRole = getUserRole(userStore.user)

    if (!requiredRoles.includes(userRole)) {
      // User doesn't have required role
      const redirectTo = fallbackRoute || getRoleRedirectPath(userRole)
      next({
        path: redirectTo,
        query: {
          accessDenied: 'true',
          originalPath: to.fullPath,
          message: `This area requires ${requiredRoles.join(' or ')} privileges`,
        },
      })
      return
    }
  }

  // Handle dashboard tab accessibility for authenticated users
  if (isAuthenticated && to.path === '/dashboard' && to.query.tab) {
    const userRole = getUserRole(userStore.user)
    const requestedTab = to.query.tab as string

    if (!isTabAccessible(requestedTab as DashboardTab, userRole)) {
      // Tab not accessible, redirect to default tab for role
      const defaultPath = getRoleRedirectPath(userRole)
      next({
        path: defaultPath,
        query: {
          tabRedirect: 'true',
          originalTab: requestedTab,
          message: `${requestedTab.charAt(0).toUpperCase() + requestedTab.slice(1)} tab is not available for your account type`,
        },
      })
      return
    }
  }

  // Proceed with navigation
  next()
})

export default router
