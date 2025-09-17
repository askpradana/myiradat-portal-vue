import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'
import type { UserDataInterface } from '@/types/userType'

export const getProfile = async (): Promise<{user: UserDataInterface}> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    if (!token) {
      throw new Error('Authentication token not found.')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

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
            localStorage.setItem('auth_token', JSON.stringify(auth))

            return await getProfile()
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

    // API returns: { success: true, data: { user: {...} } }
    // We need to return: { user: {...} }
    if (data.data && data.data.user) {
      return { user: data.data.user }
    }
    
    throw new Error('Invalid response structure')
  } catch (error) {  
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
