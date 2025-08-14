// import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '../refreshToken'

interface ResponseAPIDeleteOrganizationInterface {
  success: boolean
  message: string
  data?: null
  timestamp: string
}

export const deleteOrganization = async (
  organizationID: string,
): Promise<ResponseAPIDeleteOrganizationInterface> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    if (!token) {
      throw new Error('Authentication token not found.')
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/organizations/${organizationID}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

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

            return await deleteOrganization(organizationID)
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
    throw error
  }
}
