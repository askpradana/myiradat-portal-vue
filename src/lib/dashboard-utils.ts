import type { UserRole, DashboardTab, DashboardServiceInterface } from '@/types/dashboard'

// Type guard for user role validation
export const isAdmin = (user: { role_id?: number } | null): boolean => {
  return user?.role_id === 1
}

export const isUser = (user: { role_id?: number } | null): boolean => {
  return user?.role_id === 2
}

// Get user role based on role_id
export const getUserRole = (user: { role_id?: number } | null): UserRole => {
  return isAdmin(user) ? 'admin' : 'user'
}

// Check if tab is accessible for user role
export const isTabAccessible = (tab: DashboardTab, userRole: UserRole): boolean => {
  const adminOnlyTabs: DashboardTab[] = ['users']
  
  if (adminOnlyTabs.includes(tab)) {
    return userRole === 'admin'
  }
  
  return true
}

// Filter tabs based on user role
export const getAccessibleTabs = (userRole: UserRole): DashboardTab[] => {
  const allTabs: DashboardTab[] = ['dashboard', 'users', 'data', 'profile']
  
  return allTabs.filter(tab => isTabAccessible(tab, userRole))
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