// Filter Types for User Management
export interface UserFilterParams {
  page?: number
  page_size?: number
  search?: string // For backward compatibility
  search_by?: 'name' | 'email' | 'phone'
  search_query?: string
  filter_role?: string
  filter_organization_id?: string
  filter_email_verified?: string | boolean
  order_by?: 'created_at' | 'updated_at' | 'name' | 'email'
  order_direction?: 'asc' | 'desc'
}

export interface FilterOption {
  value: string
  label: string
}

export interface Organization {
  id: string
  name: string
}

// Updated User List Interface to support additional filter metadata
export interface UserListResponse {
  users: User[]
  total: number
  total_pages: number
  current_page: number
  page_size: number
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role_id: number
  role_name: string
  organization_id?: string
  organization_name?: string
  email_verified_at?: string | null
  created_at: string
  updated_at: string
  status: 'Active' | 'Inactive' | 'Suspended'
}

// Filter state management
export interface FilterState {
  isActive: boolean
  activeFilters: UserFilterParams
  quickSearch: string
  showAdvancedFilters: boolean
}

// Filter validation
export interface FilterValidation {
  isValid: boolean
  errors: Record<string, string[]>
}

// Role options
export const ROLE_OPTIONS: FilterOption[] = [
  { value: '', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
  { value: 'cs', label: 'CS' },
]

// Search field options
export const SEARCH_FIELD_OPTIONS: FilterOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
]

// Sort options
export const SORT_OPTIONS: FilterOption[] = [
  { value: 'created_at', label: 'Created Date' },
  { value: 'updated_at', label: 'Updated Date' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
]

// Sort direction options
export const SORT_DIRECTION_OPTIONS: FilterOption[] = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
]

// Page size options
export const PAGE_SIZE_OPTIONS: FilterOption[] = [
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
]

// Email verification status options
export const EMAIL_VERIFIED_OPTIONS: FilterOption[] = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Verified' },
  { value: 'false', label: 'Unverified' },
]

// Default filter values
export const DEFAULT_FILTERS: UserFilterParams = {
  page: 1,
  page_size: 10,
  order_by: 'created_at',
  order_direction: 'desc',
}

// Helper functions
export const isFilterActive = (filters: UserFilterParams): boolean => {
  const { page_size, order_by, order_direction, ...activeFilters } = filters

  // Check if any non-default values are set
  return (
    Object.entries(activeFilters).some(([key, value]) => {
      if (!value) return false
      if (typeof value === 'string' && value.trim() === '') return false
      return true
    }) ||
    order_by !== DEFAULT_FILTERS.order_by ||
    order_direction !== DEFAULT_FILTERS.order_direction ||
    page_size !== DEFAULT_FILTERS.page_size
  )
}

export const getActiveFilterCount = (filters: UserFilterParams): number => {
  const { page_size, order_by, order_direction, ...activeFilters } = filters

  let count = 0

  // Count active filters
  Object.entries(activeFilters).forEach(([key, value]) => {
    if (value && (typeof value !== 'string' || value.trim() !== '')) {
      count++
    }
  })

  // Count non-default sorting and pagination
  if (
    order_by !== DEFAULT_FILTERS.order_by ||
    order_direction !== DEFAULT_FILTERS.order_direction
  ) {
    count++
  }

  if (page_size !== DEFAULT_FILTERS.page_size) {
    count++
  }

  return count
}

export const buildFilterSummary = (filters: UserFilterParams): string => {
  const summaries: string[] = []

  if (filters.search) {
    summaries.push(`Search: "${filters.search}"`)
  }

  if (filters.search_by && filters.search_query) {
    summaries.push(`${filters.search_by}: "${filters.search_query}"`)
  }

  if (filters.filter_role) {
    summaries.push(`Role: ${filters.filter_role}`)
  }

  if (filters.filter_organization_id) {
    summaries.push(`Organization: ${filters.filter_organization_id}`)
  }

  if (filters.filter_email_verified) {
    const status = filters.filter_email_verified === 'true' ? 'Verified' : 'Unverified'
    summaries.push(`Email: ${status}`)
  }

  if (
    filters.order_by !== DEFAULT_FILTERS.order_by ||
    filters.order_direction !== DEFAULT_FILTERS.order_direction
  ) {
    summaries.push(`Sort: ${filters.order_by} ${filters.order_direction}`)
  }

  return summaries.length > 0 ? summaries.join(' | ') : 'No filters applied'
}
