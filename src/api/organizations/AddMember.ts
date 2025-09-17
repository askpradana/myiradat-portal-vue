import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'

interface ResponseAPIAddMember {
  susscess: boolean
  message: string
  data: null
  timestamp: string
}

export const addMemberOrganization = async (
  userID: string,
  organizationID: string,
): Promise<ResponseAPIAddMember> => {
  try {
    const dataUser = {
      user_id: userID,
    }

    const userStore = useUserStore()
    const token = userStore.auth?.token

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/organizations/${organizationID}/members`,
      {
        method: 'POST',
        body: JSON.stringify(dataUser),
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
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
            localStorage.setItem('auth_token', JSON.stringify(auth))

            // Coba lagi setelah refresh token
            return await addMemberOrganization(userID, organizationID)
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
    // Error occurred
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
