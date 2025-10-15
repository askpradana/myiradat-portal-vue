import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'

interface ValidationResultsInterface {
  errors: string[]
  warnings?: string[]
  row_number: number
  valid: boolean
}

export interface CSVParsedUser {
  row_number: number
  email: string
  phone: string
  name: string
  role: string
}

export interface BatchRegisterCSVData {
  parsed_users: CSVParsedUser[]
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
  preview_id: string
  expires_at: string
}

export interface BatchRegisterCSVAPIResponse {
  data: BatchRegisterCSVData
  message: string
  success: boolean
  timestamp: string
}

export const uploadCSVForReview = async (
  CSVFile: File,
): Promise<BatchRegisterCSVAPIResponse> => {
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
            localStorage.setItem('auth_token', JSON.stringify(auth))

            return await uploadCSVForReview(CSVFile)
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

export const RegisterUserByCSV = uploadCSVForReview
