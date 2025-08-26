import { toast } from 'vue-sonner'
import type { LoginResponse } from '@/types/emailVerification'

interface UserDataInterface {
  email: string
  password: string
}

// Utility functions to extract data from JWT token
const extractUserIdFromToken = (token: string): string => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    const payload = JSON.parse(jsonPayload)
    return payload.user_id || payload.sub || ''
  } catch (error) {
    console.warn('Could not extract user_id from token:', error)
    return ''
  }
}

const extractEmailFromToken = (token: string): string => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    const payload = JSON.parse(jsonPayload)
    return payload.email || ''
  } catch (error) {
    console.warn('Could not extract email from token:', error)
    return ''
  }
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
    console.log(data)

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
    console.error('Error:', error)
    toast('Error', {
      description: `${error}`,
    })
  }
}
