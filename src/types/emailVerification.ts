import type { UserProfileInterface } from './userType'
import type { ServiceInterface } from './serviceType'

export interface EmailVerificationRequiredResponse {
  success: boolean
  message: string
  data: {
    requires_verification: boolean
    message: string
    email: string
    user_id: string
  }
  timestamp: string
}

export interface ResendVerificationResponse {
  success: boolean
  message: string
  data?: {
    expires_at: string
    is_verified: boolean
    message: string
    next_retry_allowed: string
    otp?: string // Optional OTP field present in dev environment
    status: {
      has_pending_verification: boolean
      is_flagged: boolean
      is_verified: boolean
      request_attempts_remaining: number
      verify_attempts_remaining: number
    }
    success: boolean
  }
  timestamp: string
}

export interface VerificationState {
  email: string
  user_id: string
  isResending: boolean
  canResend: boolean
  countdownTimer: number
  otpValue: string
  showOtpInput: boolean
  isVerifying: boolean
}

export interface ResendVerificationPayload {
  email: string
}

export interface VerifyOtpPayload {
  code: string
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
  timestamp: string
}

// Enhanced login response interface to handle email verification scenarios
export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token?: string
    expires_at?: string
    user?: UserProfileInterface
    services?: ServiceInterface[]
    availableservices?: ServiceInterface[]
    requires_verification?: boolean
    email?: string
    user_id?: string
  }
  timestamp: string
}