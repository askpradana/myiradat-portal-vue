import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'

export interface MembersDataInterface {
  id: string
  email: string
  name: string
  role_name: string
  avatar_picture: null | string
  joined_at: string
}

export interface ResponseAPIGETMember {
  susscess: boolean
  message: string
  data: {
    members: MembersDataInterface[]
    page: number
    page_size: number
    total: number
    total_pages: number
  }
  timestamp: string
}

export const getMembersOrganization = async (
  organizationID: string,
): Promise<ResponseAPIGETMember> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/organizations/${organizationID}/members`,
      {
        method: 'GET',
        headers: {
          Authorization: `bearer ${token}`,
          // 'Content-Type': 'application/json',
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

            // Coba lagi setelah refresh token
            return await getMembersOrganization(organizationID)
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
    // Data logged

    return data
  } catch (error) {  
    // Error occurred
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
