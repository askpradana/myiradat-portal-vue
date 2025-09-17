import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'
import type { ServiceInterface } from '@/types/serviceType'

export interface UserServiceResponse {
  success: boolean
  message: string
  data: {
    user_id: string
    services: ServiceInterface[]
  }
}

export const getUserService = async (userID?: string): Promise<UserServiceResponse> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userID}/services`, {
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

            return await getUserService(userID)
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

    return data
  } catch (error) {  
    // Error occurred
    throw error
  }
}
