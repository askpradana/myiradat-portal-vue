import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from './refreshToken'

export interface NewUserInterface {
  name: string
  phone: string
  email: string
  password: string
  role?: string
}

export interface RegisterAPIResponse {
  data: {
    email: string
    user_id: string
  }
  message: string
  success: boolean
  timestamp: string
}

export const registerNewUser = async (
  newUserData: NewUserInterface,
  role?: number,
): Promise<RegisterAPIResponse> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token
    const newData = {
      name: newUserData.name,
      phone: newUserData.phone,
      email: newUserData.email,
      password: newUserData.password,
      role_type: newUserData.role === '1' ? 'admin' : newUserData.role === '3' ? 'cs' : '',
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      body: role === 1 ? JSON.stringify(newData) : JSON.stringify(newUserData),
      headers: {
        Authorization: role === 1 ? `bearer ${token}` : '',
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

            // Coba lagi setelah refresh token
            return await registerNewUser(newData, 1)
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
    console.error('Error:', error)
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
