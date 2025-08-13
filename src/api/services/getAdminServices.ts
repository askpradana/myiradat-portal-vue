import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '../refreshToken'
import type { AdminServicesResponse } from '@/types/serviceType'

export const getAdminServices = async (): Promise<AdminServicesResponse> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/services`, {
      method: 'GET',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

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

            return await getAdminServices()
          } else {
            throw new Error(errorMessage || 'The session has ended, please login again')
          }
        } catch (error) {
          console.error('Token refresh error:', error)
          throw new Error(errorMessage || 'Failed to update the token')
        }
      } else if (response.status === 400) {
        throw new Error(errorMessage)
      } else {
        throw new Error(errorMessage)
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching admin services:', error)
    throw error
  }
}