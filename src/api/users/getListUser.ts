import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'
import type { UserListInterface as ResponseAPIUsersInterface } from '@/types/userListType'

interface GetListUserParams {
  page?: number
  page_size?: number
  search?: string // Keep this for backward compatibility
  search_by?: string
  search_query?: string
  filter_role?: string
  filter_organization_id?: string
  filter_email_verified?: string | boolean
  order_by?: string
  order_direction?: 'asc' | 'desc'
}

export const getListUser = async (
  params: GetListUserParams = {},
): Promise<ResponseAPIUsersInterface> => {
  try {
    const {
      page = 1,
      page_size = 10,
      search,
      search_by,
      search_query,
      filter_role,
      filter_organization_id,
      filter_email_verified,
      // order_by,
      order_direction,
    } = params

    const userStore = useUserStore()
    const token = userStore.auth?.token


    // Periksa apakah token ada
    if (!token) {
      throw new Error('Authentication token not found.')
    }

    // Build query string
    const queryParams = new URLSearchParams()

    // Basic pagination
    queryParams.append('page', page.toString())
    queryParams.append('page_size', page_size.toString())

    // Handle search (backward compatibility)
    if (search && search.trim()) {
      queryParams.append('search', search.trim())
    }

    // Handle specific field search
    if (search_by && search_query && search_query.trim()) {
      queryParams.append('search_by', search_by)
      queryParams.append('search_query', search_query.trim())
    }

    // Handle role filter
    if (filter_role && filter_role.trim()) {
      queryParams.append('filter_role', filter_role.trim())
    }

    // Handle organization filter
    if (filter_organization_id && filter_organization_id.trim()) {
      queryParams.append('filter_organization_id', filter_organization_id.trim())
    }

    // Handle email verification filter
    if (filter_email_verified !== undefined && filter_email_verified !== '') {
      const emailVerifiedValue =
        typeof filter_email_verified === 'boolean'
          ? filter_email_verified.toString()
          : filter_email_verified
      queryParams.append('filter_email_verified', emailVerifiedValue)
    }

    // Handle sorting
    // if (order_by && order_by.trim()) {
    //   queryParams.append('order_by', order_by.trim())
    // }

    if (order_direction && ['asc', 'desc'].includes(order_direction)) {
      queryParams.append('order_direction', order_direction)
    }


    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/users?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.message || 'An error occurs on the server'

      if (response.status === 404) {
        throw new Error(errorMessage)
      } else if (response.status === 401) {
        try {
          const refreshResponse = await refreshToken()
          if (userStore.auth && refreshResponse.data) {
            userStore.auth.token = refreshResponse.data.token
            userStore.auth.expires_at = refreshResponse.data.expires_at

            const auth = {
              token: refreshResponse.data.token,
              expires_at: refreshResponse.data.expires_at,
            }
            sessionStorage.setItem('auth_token', JSON.stringify(auth))

            return await getListUser(params)
          } else {
            throw new Error(errorMessage || 'The session has ended, please login again')
          }
        } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
          throw new Error(errorMessage || 'Failed to update the token')
        }
      } else if (response.status === 400) {
        throw new Error(errorMessage)
      } else {
        throw new Error(errorMessage)
      }
    }

    const data = await response.json()

    return data.data
  } catch (error) {  
    throw error
  }
}

// Helper function to build filter summary for debugging
export const getFilterSummary = (params: GetListUserParams): string => {
  const filters = []

  if (params.search) {
    filters.push(`Global search: "${params.search}"`)
  }

  if (params.search_by && params.search_query) {
    filters.push(`${params.search_by} search: "${params.search_query}"`)
  }

  if (params.filter_role) {
    filters.push(`Role: ${params.filter_role}`)
  }

  if (params.filter_organization_id) {
    filters.push(`Organization: ${params.filter_organization_id}`)
  }

  if (params.filter_email_verified !== undefined) {
    filters.push(`Email verified: ${params.filter_email_verified}`)
  }

  if (params.order_by) {
    filters.push(`Sort: ${params.order_by} ${params.order_direction || 'asc'}`)
  }

  return filters.length > 0 ? filters.join(', ') : 'No filters applied'
}
