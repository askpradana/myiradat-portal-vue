import { toast } from 'vue-sonner'
import type { VerifyOtpResponse, VerifyOtpPayload } from '@/types/emailVerification'

export const verifyEmailOtp = async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
  try {
    // Validate payload
    if (!payload.email || !payload.otp || !payload.user_id) {
      throw new Error('Email, OTP, and User ID are required')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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
    console.log('OTP verification successful:', data)

    toast.success('Email Verified', {
      description: 'Your email has been verified successfully',
    })

    return data
  } catch (error) {
    console.error('OTP verification error:', error)
    toast.error('Verification Failed', {
      description: `${error}`,
    })
    throw error
  }
}