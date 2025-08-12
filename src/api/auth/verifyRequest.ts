import { toast } from 'vue-sonner'
import type { ResendVerificationResponse, ResendVerificationPayload } from '@/types/emailVerification'

export const resendVerificationEmail = async (payload: ResendVerificationPayload): Promise<ResendVerificationResponse> => {
  try {
    // Validate payload
    if (!payload.email) {
      throw new Error('Email is required')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Bad Request')
      } else if (response.status === 404) {
        throw new Error('User not found')
      } else if (response.status === 422) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Validation failed')
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please wait before requesting another verification email.')
      } else {
        throw new Error('Failed to send verification email')
      }
    }

    const data = await response.json()
    console.log('Verification email sent successfully:', data)

    toast.success('Verification Email Sent', {
      description: 'A new verification email has been sent to your email address',
    })

    return data
  } catch (error) {
    console.error('Resend verification email error:', error)
    toast.error('Failed to Send Email', {
      description: `${error}`,
    })
    throw error
  }
}