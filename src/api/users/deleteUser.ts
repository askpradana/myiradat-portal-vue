import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '../refreshToken'

interface ResponseAPIDeleteUserInterface {
  success: boolean
  message: string
  data?: {
    deleted_by: string
    deleted_user_id: string
  }
  timestamp: string
}

export const deleteUser = async (userID: string): Promise<ResponseAPIDeleteUserInterface> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    if (!token) {
      throw new Error('Authentication token not found.')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userID}`, {
      method: 'DELETE',
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
            sessionStorage.setItem('auth_token', JSON.stringify(auth))

            return await deleteUser(userID)
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

    return data
  } catch (error) {
    console.error('Error:', error)
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
