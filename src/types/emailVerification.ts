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
    message: string
    email: string
    sent_at: string
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
  email: string
  otp: string
  user_id: string
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
  data?: {
    message: string
    verified: boolean
  }
  timestamp: string
}