import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '../refreshToken'
import type { OrganizationInterface } from '@/types/organizationType'

interface ResponseGetDetailOrganization {
  success: boolean
  message: string
  data: OrganizationInterface
  timestamp: string
}

export const getOrganizationDetail = async (
  organizationID: string,
): Promise<ResponseGetDetailOrganization> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    // Periksa apakah token ada
    if (!token) {
      throw new Error('Authentication token not found.')
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/organizations/${organizationID}`,
      {
        method: 'GET',
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

            return await getOrganizationDetail(organizationID)
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

    console.log('oraganization detail:', data)

    return data.data
  } catch (error) {
    console.error('Error:', error)
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
