import type { ServiceInterface } from './serviceType'

// Dashboard tab types
export type DashboardTab = 'dashboard' | 'users' | 'data' | 'profile' | 'organizations'

// User role types
export type UserRole = 'admin' | 'user'

// Use the real API ServiceInterface directly for dashboard
export type DashboardServiceInterface = ServiceInterface

// Service card props interface
export interface ServiceCardProps {
  service: DashboardServiceInterface
}

// Tab configuration interface
export interface TabConfig {
  id: DashboardTab
  label: string
  icon?: string
  requiresAdmin?: boolean
  badge?: number
}

// Dashboard layout configuration
export interface DashboardLayoutConfig {
  maxWidth?: string
  padding?: string
  showHeader?: boolean
  showNavigation?: boolean
}

// Loading state interface
export interface LoadingState {
  isLoading: boolean
  error?: string | null
  retryCount?: number
}

// Default configurations
export const DEFAULT_TAB_CONFIG: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', requiresAdmin: false },
  { id: 'users', label: 'User Management', requiresAdmin: true },
  { id: 'data', label: 'Data', requiresAdmin: false },
  { id: 'profile', label: 'Profile', requiresAdmin: false },
]

export const DEFAULT_LAYOUT_CONFIG: DashboardLayoutConfig = {
  maxWidth: 'max-w-7xl',
  padding: 'px-4 sm:px-6 lg:px-8 py-8',
  showHeader: true,
  showNavigation: true,
}
