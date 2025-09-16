import type { UserRole, DashboardTab, DashboardServiceInterface } from '@/types/dashboard'

// Type guard for user role validation
export const isAdmin = (user: { role_id?: number } | null): boolean => {
  return user?.role_id === 1
}

export const isUser = (user: { role_id?: number } | null): boolean => {
  return user?.role_id === 2
}

export const isCS = (user: { role_id?: number } | null): boolean => {
  return user?.role_id === 3
}

// Get user role based on role_id
export const getUserRole = (user: { role_id?: number } | null): UserRole => {
  if (isAdmin(user)) return 'admin'
  if (isCS(user)) return 'cs'
  return 'user'
}

// Define role-based tab access
const ROLE_TAB_ACCESS: Record<UserRole, DashboardTab[]> = {
  admin: ['dashboard', 'users', 'organizations', 'data', 'assessments'],
  user: ['dashboard', 'data', 'assessments', 'profile'],
  cs: ['dashboard', 'users', 'organizations', 'data', 'assessments', 'profile']
}

// Check if tab is accessible for user role
export const isTabAccessible = (tab: DashboardTab, userRole: UserRole): boolean => {
  return ROLE_TAB_ACCESS[userRole]?.includes(tab) ?? false
}

// Filter tabs based on user role
export const getAccessibleTabs = (userRole: UserRole): DashboardTab[] => {
  return ROLE_TAB_ACCESS[userRole] || []
}

// Get default landing tab for user role
export const getDefaultTabForRole = (userRole: UserRole): DashboardTab => {
  const defaults: Record<UserRole, DashboardTab> = {
    admin: 'users',
    user: 'dashboard', 
    cs: 'dashboard'
  }
  return defaults[userRole] || 'dashboard'
}

// Get role-appropriate redirect path
export const getRoleRedirectPath = (userRole: UserRole): string => {
  const defaultTab = getDefaultTabForRole(userRole)
  return defaultTab === 'dashboard' ? '/dashboard' : `/dashboard/${defaultTab}`
}

// Get tab from route path
export const getTabFromPath = (path: string): DashboardTab => {
  if (path === '/dashboard') return 'dashboard'
  if (path.startsWith('/dashboard/')) {
    const tabSegment = path.split('/dashboard/')[1]?.split('/')[0]
    return (tabSegment as DashboardTab) || 'dashboard'
  }
  return 'dashboard'
}

// Get route path for tab
export const getPathForTab = (tab: DashboardTab): string => {
  return tab === 'dashboard' ? '/dashboard' : `/dashboard/${tab}`
}


// URL validation utilities
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isExternalUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false
  
  try {
    const urlObj = new URL(url)
    return urlObj.origin !== window.location.origin
  } catch {
    return false
  }
}

// Service data transformation utilities (simplified for real API)
export const transformServiceForDisplay = (service: Record<string, unknown>): DashboardServiceInterface => {
  return {
    code: (service.code as string) || '',
    name: (service.name as string) || 'Unknown Service',
    icon_url: (service.icon_url as string) || '',
    redirect_to: (service.redirect_to as string) || '#',
    created_at: service.created_at as string,
    updated_at: service.updated_at as string
  }
}