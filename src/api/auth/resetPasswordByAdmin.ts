import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'

interface ResponseAPIResetPasswordByAdmin {
  susscess: boolean
  message: string
  data: {
    reset_by_admin: string
    sessions_invalidated: number
    target_user_id: string
  }
  timestamp: string
}

export const resetPasswordByAdmin = async (
  userID: string,
  newPassword: string,
): Promise<ResponseAPIResetPasswordByAdmin> => {
  try {
    const dataPassword = {
      new_password: newPassword,
    }

    const userStore = useUserStore()
    const token = userStore.auth?.token

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userID}/password`, {
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
            sessionStorage.setItem('auth_token', JSON.stringify(auth))

            // Coba lagi setelah refresh token
            return await resetPasswordByAdmin(userID, newPassword)
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
