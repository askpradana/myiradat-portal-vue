import { toast } from 'vue-sonner'
import type { VerifyOtpResponse, VerifyOtpPayload } from '@/types/emailVerification'
import { useUserStore } from '@/stores/userStores'

export const verifyEmailOtp = async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
  try {
    // Validate payload - only code is required based on your API specification
    if (!payload.code) {
      throw new Error('Verification code is required')
    }

    const userStore = useUserStore()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add Authorization header if temporary verification token exists
    if (userStore.tempVerificationToken) {
      headers.Authorization = `Bearer ${userStore.tempVerificationToken}`
    }

    // Send only the code as specified in your requirements
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-confirm`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code: payload.code }),
    })

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Invalid OTP')
      } else if (response.status === 404) {
        throw new Error('User not found')
      } else if (response.status === 422) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Validation failed')
      } else if (response.status === 410) {
        throw new Error('OTP has expired. Please request a new verification email.')
      } else {
        throw new Error('Failed to verify OTP')
      }
    }

    const data = await response.json()

    return data
  } catch (error) {  
    toast.error('Verification Failed', {
      description: `${error}`,
    })
    throw error
  }
}