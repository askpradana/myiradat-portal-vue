import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '../refreshToken'
import type { UserProfileInterface, UserDataInterface } from '@/types/userType'

export interface DataUserProps {
  name: string
  phone: string
  email: string
  date_of_birth?: string
  role_type?: string
  avatar_picture?: string
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
    const userAPI = `${import.meta.env.VITE_API_URL}/admin/profile`

    const response = await fetch(role === 1 ? adminAPI : userAPI, {
      method: 'PUT',
      body: JSON.stringify(newUserData),
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
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

            return await editUserData(newUserData, userID, role)
          } else {
            throw new Error('Session expired, please login again')
          }
        } catch (error) {
          console.error('Token refresh error:', error)
          throw error
        }
      } else if (response.status === 400) {
        throw new Error(`Data already exist`)
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
