import { toast } from 'vue-sonner'
import type { LoginResponse } from '@/types/emailVerification'
import { extractUserIdFromToken, extractEmailFromToken } from '@/lib/utils/tokenUtils'

interface UserDataInterface {
  email: string
  password: string
}

export const login = async (userData: UserDataInterface): Promise<LoginResponse | undefined> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else if (response.status === 401) {
        throw new Error(`Please check email & password`)
      } else {
        throw new Error(`Internal server error`)
      }
    }

    const data = await response.json()

    // Check if email verification is required (when user is null but success is true)
    if (data.success && data.data?.user === null && data.data?.token) {
      // Transform response to indicate verification is required
      return {
        ...data,
        data: {
          ...data.data,
          requires_verification: true,
          // Extract user_id from token (if available) or use a fallback method
          user_id: extractUserIdFromToken(data.data.token),
          email: extractEmailFromToken(data.data.token) || data.data.email,
          message: data.message || 'Please verify your email address before logging in.',
        }
      }
    }

    return data
  } catch (error) {  
    toast('Error', {
      description: `${error}`,
    })
  }
}
