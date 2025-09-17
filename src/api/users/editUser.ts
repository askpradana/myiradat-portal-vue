import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'
import type { UserProfileInterface, UserDataInterface } from '@/types/userType'

export interface DataUserProps {
  name: string
  phone: string
  email: string
  date_of_birth?: string | null | undefined
  role_type?: string
  avatar_picture?: string | null
}

export interface EditUserAPIResponse {
  data: UserProfileInterface | UserDataInterface
  message?: string
  success: boolean
  timestamp: string
}

export const editUserData = async (
  newUserData: DataUserProps,
  userID?: string,
  role?: number,
): Promise<EditUserAPIResponse> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const adminAPI = `${import.meta.env.VITE_API_URL}/admin/users/${userID}`
    const userAPI = `${import.meta.env.VITE_API_URL}/profile`

    const response = await fetch(role === 1 ? adminAPI : userAPI, {
      method: 'PUT',
      body: JSON.stringify(newUserData),
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
            return await editUserData(newUserData, userID, role)
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
    if (!role) {
      userStore.setUserProfileData(data.data.user)
    }
    return data
  } catch (error) {  
    throw error
  }
}
