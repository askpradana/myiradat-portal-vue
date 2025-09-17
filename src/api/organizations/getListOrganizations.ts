import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'
import type {
  ResponseAPIGetOrganizations,
  OrganizationFilterParams,
} from '@/types/organizationType'

export const getListOrganization = async (
  params: OrganizationFilterParams = {},
): Promise<ResponseAPIGetOrganizations> => {
  try {
    const {
      page = 1,
      page_size = 10,
      search_by,
      search_query,
      filter_industry,
      filter_size,
      filter_status,
      // order_by,
      order_direction,
    } = params
    const userStore = useUserStore()
    const token = userStore.auth?.token

    // Data logged

    // Periksa apakah token ada
    if (!token) {
      throw new Error('Authentication token not found.')
    }

    // Build query string
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('page_size', page_size.toString())

    if (search_by && search_query && search_query.trim()) {
      queryParams.append('search_by', search_by)
      queryParams.append('search_query', search_query.trim())
    }

    if (filter_industry && filter_industry.trim()) {
      queryParams.append('filter_industry', filter_industry.trim())
    }

    if (filter_size && filter_size.trim()) {
      queryParams.append('filter_size', filter_size.trim())
    }

    if (filter_status && filter_status.trim()) {
      queryParams.append('filter_status', filter_status.trim())
    }

    // if (order_by && order_by.trim()) {
    //   queryParams.append('order_by', order_by.trim())
    // }

    if (order_direction && ['asc', 'desc'].includes(order_direction)) {
      queryParams.append('order_direction', order_direction)
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/organizations?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
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

            return await getListOrganization(params)
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

    // Data logged

    return data.data
  } catch (error) {  
    // Error occurred
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
