import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '../refreshToken'
import type { UserListInterface as ResponseAPIUsersInterface } from '@/types/userListType'

interface GetListUserParams {
  page?: number
  search?: string
  page_size?: number
}

export const getListUser = async (
  params: GetListUserParams = {},
): Promise<ResponseAPIUsersInterface> => {
  try {
    const { page = 1, search, page_size = 10 } = params
    const userStore = useUserStore()
    const token = userStore.auth?.token

    // Periksa apakah token ada
    if (!token) {
      throw new Error('Authentication token not found.')
    }

    // Build query string
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('page_size', page_size.toString())

    if (search && search.trim()) {
      queryParams.append('search', search.trim())
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/users?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else if (response.status === 400) {
        throw new Error(`Bad Request`)
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

            // Retry with new token and same parameters
            return await getListUser(params)
          } else {
            throw new Error('Session expired, please login again')
          }
        } catch (error) {
          console.error('Token refresh error:', error)
          throw error
        }
      } else {
        throw new Error(`Internal server error`)
      }
    }

    const data = await response.json()

    console.log(data)

    return data.data
  } catch (error) {
    console.error('Error:', error)
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
