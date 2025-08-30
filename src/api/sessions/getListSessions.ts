import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '../refreshToken'
import type { SessionsDataFromAPIInterface } from '@/types/sessionsType'

interface ResponseDataGETSessionFromAPI {
  success: boolean
  message: string
  data: SessionsDataFromAPIInterface
  timestamp: string
}

export const getListSession = async (): Promise<ResponseDataGETSessionFromAPI> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    // Periksa apakah token ada
    if (!token) {
      throw new Error('Authentication token not found.')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
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

            return await getListSession()
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
    console.log('API Response get Session:', data)

    return data.data
  } catch (error) {
    console.error('Error fetching sessions:', error)
    throw error
  }
}
