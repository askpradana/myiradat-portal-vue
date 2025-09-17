import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'
import type { UserDataInterface } from '@/types/userType'

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  email?: string
  avatar_picture?: string
  date_of_birth?: string
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<{user: UserDataInterface}> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    if (!token) {
      throw new Error('Authentication token not found.')
    }

    // Validate payload is not empty
    if (Object.keys(payload).length === 0) {
      throw new Error('No fields to update provided.')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Profile not found`)
      } else if (response.status === 400) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Bad Request')
      } else if (response.status === 422) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Validation failed')
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

            return await updateProfile(payload)
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

    toast.success('Profile Updated', {
      description: 'Your profile has been updated successfully',
    })

    return data.data
  } catch (error) {  
    toast.error('Update Failed', {
      description: `${error}`,
    })
    throw error
  }
}