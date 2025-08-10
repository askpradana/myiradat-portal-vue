import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '../refreshToken'

export interface BatchUserInterface {
  name: string
  phone: string
  email: string
  password: string
  role_type: string
}

export interface BatchRegisterRequest {
  users: BatchUserInterface[]
}

export interface BatchRegisterAPIResponse {
  data: {
    successful: string[]
    total: number
  }
  message: string
  success: boolean
  timestamp: string
}

export const batchRegisterUsers = async (
  users: BatchUserInterface[],
): Promise<BatchRegisterAPIResponse> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const requestData: BatchRegisterRequest = {
      users: users.map((user) => ({
        name: user.name,
        phone: user.phone,
        email: user.email,
        password: user.password,
        role_type: user.role_type,
      })),
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/batch-register`, {
      method: 'POST',
      body: JSON.stringify(requestData),
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
            return await batchRegisterUsers(users)
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
    // return {
    //   success: true,
    //   message: 'Users registered successfully',
    //   data: {
    //     successful: [
    //       'USR-Batch+25Aug061140',
    //       'CS-Batch+25Aug061140',
    //       'asdasdasdas',
    //       'hsadiohasiodh',
    //       'wqioejkojndsajdoijaoisjd',
    //       'poasdjosaasdasdde',
    //     ],
    //     total: 6,
    //   },
    //   timestamp: '2025-08-06T11:40:20.10343442Z',
    // }
  } catch (error) {
    console.error('Batch register error:', error)
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
