import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '../refreshToken'

export interface BatchRegisterCSVData {
  created_users?: Array<{
    id: string
    name: string
    email: string
    phone: string
    role: string
  }>
  errors?: Array<{
    row: number
    message: string
    data?: Record<string, unknown>
  }>
  summary?: {
    total_rows: number
    successful: number
    failed: number
  }
}

export interface BatchRegisterCSVAPIResponse {
  data: BatchRegisterCSVData
  message: string
  success: boolean
  timestamp: string
}

export const RegisterUserByCSV = async (CSVFile: File): Promise<BatchRegisterCSVAPIResponse> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const formData = new FormData()
    formData.append('file', CSVFile)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/batch-register`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `bearer ${token}`,
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

            return await RegisterUserByCSV(CSVFile)
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
    console.error('Batch register error:', error)
    toast('Error', {
      description: `${error}`,
    })
    throw error
  }
}
