import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'
import { formatPhoneNumber } from '@/lib/phoneNumberFormat'

export interface BatchUserInterface {
  name: string
  phone: string
  email: string
  password?: string
  role_type: string
  role?: string
  row_number?: number
}

export interface BatchRegisterRequest {
  users: BatchUserInterface[]
}

export interface BatchRegisterAPIResponse {
  data: {
    successful: string[]
    total: number
    password: string
    failed: null
    errors: null
  }
  message: string
  success: boolean
  timestamp: string
}

export const batchRegisterUsers = async (
  users: BatchUserInterface[],
  source: 'csv' | 'manual',
): Promise<BatchRegisterAPIResponse> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const requestData: BatchRegisterRequest = {
      users: users.map((user) => ({
        name: user.name,
        phone: formatPhoneNumber(user.phone),
        email: user.email,
        password: user.password,
        role_type: user.role_type,
      })),
    }

    const csvFile = {
      users: users.map((user) => ({
        // row_number: user.row_number,
        name: user.name,
        phone: formatPhoneNumber(user.phone),
        email: user.email,
        role_type: user.role,
      })),
    }


    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/batch-register`, {
      method: 'POST',
      body: JSON.stringify(source == 'manual' ? requestData : csvFile),
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
            return await batchRegisterUsers(users, source)
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
    throw error
  }
}
