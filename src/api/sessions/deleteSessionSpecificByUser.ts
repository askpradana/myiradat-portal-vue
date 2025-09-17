// import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'

interface ResponseAPIDeleteSessionByUserInterface {
  success: boolean
  message: string
  data?: {
    deleted_session_id: string
  }
  timestamp: string
}

export const deleteSessionSpesificByUser = async (
  sessionID: string,
): Promise<ResponseAPIDeleteSessionByUserInterface> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    if (!token) {
      throw new Error('Authentication token not found.')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/sessions/${sessionID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
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

            return await deleteSessionSpesificByUser(sessionID)
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

    return data
  } catch (error) {  
    throw error
  }
}
