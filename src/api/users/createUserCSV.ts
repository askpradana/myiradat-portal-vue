import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '../refreshToken'
import { type BatchRegisterAPIResponse, batchRegisterUsers } from './createUserBatch'

interface ValidationResultsInterface {
  errors: string[]
  row_number: number
  valid: boolean
}

export interface BatchRegisterCSVData {
  validation_results: ValidationResultsInterface[]
  summary: {
    file_format: string
    file_name: string
    file_size_bytes: number
    invalid_rows: number
    processing_time: string
    total_rows: number
    valid_rows: number
    warning_rows: number
  }
}

export interface BatchRegisterCSVAPIResponse {
  data: BatchRegisterCSVData
  message: string
  success: boolean
  timestamp: string
}

export const RegisterUserByCSV = async (
  CSVFile: File,
): Promise<BatchRegisterAPIResponse | BatchRegisterCSVAPIResponse> => {
  try {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const formData = new FormData()
    formData.append('file', CSVFile)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/register/file`, {
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

    console.log('Response CSV API:', data)
    if (data.data.summary.invalid_rows > 0) {
      // toast('Error', {
      //   description: `Please check every data format!`,
      // })
      // return data.data
      throw new Error(`Please check every data format!`)
    }
    const result = await batchRegisterUsers(data.data.parsed_users, 'csv')
    console.log('Result CSV API:', data)

    return result
  } catch (error) {
    console.error('Batch register error:', error)
    throw error
  }
}
