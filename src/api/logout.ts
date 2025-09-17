import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from './refreshToken'

interface LogoutResponseInterface {
  success: boolean
  message: string
  data?: {
    message: string
  }
  timestamp: string
}

export const logout = async (): Promise<LogoutResponseInterface> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`HTTP error! status: ${response.status}`)
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

            return await logout()
          } else {
            throw new Error('Session expired, please login again')
          }
        } catch (error) {  
          throw error
        }
      } else {
        throw new Error(`Internal server error`)
      }
    }

    const data = await response.json()

    return data
  } catch (error) {  
    // Error occurred
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
