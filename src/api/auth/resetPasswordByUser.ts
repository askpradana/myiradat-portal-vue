import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'

interface ResponseAPIResetPasswordByUser {
  susscess: boolean
  message: string
  data: {
    sessions_invalidated: number
    user_id: string
  }
  timestamp: string
}

export const resetPasswordByUser = async (
  currentPassword: string,
  newPassword: string,
): Promise<ResponseAPIResetPasswordByUser> => {
  try {
    const dataPassword = {
      current_password: currentPassword,
      new_password: newPassword,
    }

    const userStore = useUserStore()
    const token = userStore.auth?.token

    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/password`, {
      method: 'PUT',
      body: JSON.stringify(dataPassword),
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
            localStorage.setItem('auth_token', JSON.stringify(auth))

            // Coba lagi setelah refresh token
            return await resetPasswordByUser(currentPassword, newPassword)
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
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
