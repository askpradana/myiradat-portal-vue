import { toast } from 'vue-sonner'
import type { ResendVerificationResponse, ResendVerificationPayload } from '@/types/emailVerification'
import { useUserStore } from '@/stores/userStores'

export const resendVerificationEmail = async (payload: ResendVerificationPayload): Promise<ResendVerificationResponse> => {
  try {
    // Validate payload
    if (!payload.email) {
      throw new Error('Email is required')
    }

    const userStore = useUserStore()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add Authorization header if temporary verification token exists
    if (userStore.tempVerificationToken) {
      headers.Authorization = `Bearer ${userStore.tempVerificationToken}`
      console.log('Using temporary verification token for verification request')
    } else {
      console.warn('No temporary verification token available - request may fail')
    }

    console.log('Making verification request to:', `${import.meta.env.VITE_API_URL}/auth/verify-request`)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-request`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    console.log('Verification request response:', {
      status: response.status,
      ok: response.ok
    })

    if (!response.ok) {
      let errorMessage = 'Failed to send verification email'
      let errorData = null
      
      try {
        errorData = await response.json()
      } catch {
        console.log('Could not parse error response as JSON')
      }
      
      if (response.status === 400) {
        errorMessage = errorData?.message || 'Bad Request'
      } else if (response.status === 404) {
        errorMessage = 'User not found'
      } else if (response.status === 422) {
        errorMessage = errorData?.message || 'Validation failed'
      } else if (response.status === 429) {
        errorMessage = 'Too many requests. Please wait before requesting another verification email.'
      }
      
      console.error('Verification request failed:', {
        status: response.status,
        message: errorMessage
      })
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('Verification email sent successfully:', {
      hasNextRetryAllowed: !!data?.data?.next_retry_allowed,
      hasOtp: !!data?.data?.otp
    })

    toast.success('Verification Email Sent', {
      description: 'A new verification email has been sent to your email address',
    })

    return data
  } catch (error) {
    console.error('Verification request error:', error)
    
    // Check for network errors specifically
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error - backend may not be running')
      toast.error('Network Error', {
        description: 'Cannot connect to the server. Please check if the backend is running.',
      })
    } else {
      toast.error('Failed to Send Email', {
        description: `${error}`,
      })
    }
    
    throw error
  }
}