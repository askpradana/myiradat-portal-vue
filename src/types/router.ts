import type { UserRole } from './dashboard'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
    title?: string
    requiredRoles?: UserRole[]
    fallbackRoute?: string
    adminOnly?: boolean
  }
}