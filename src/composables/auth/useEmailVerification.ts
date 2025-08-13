import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import { resendVerificationEmail } from '@/api/auth/verifyRequest'
import { verifyEmailOtp } from '@/api/auth/verifyOtp'
import { ResendVerificationSchema, VerifyOtpSchema } from '@/lib/zod-schemas/EmailVerificationSchema'
import type { VerificationState, ResendVerificationPayload, VerifyOtpPayload } from '@/types/emailVerification'

export function useEmailVerification(initialEmail?: string, initialUserId?: string) {
  // Verification state
  const state = ref<VerificationState>({
    email: initialEmail || '',
    user_id: initialUserId || '',
    isResending: false,
    canResend: true,
    countdownTimer: 0,
    otpValue: '',
    showOtpInput: false,
    isVerifying: false,
  })

  // Countdown timer management
  let countdownInterval: ReturnType<typeof setInterval> | null = null

  const startCountdown = (seconds: number = 60) => {
    state.value.canResend = false
    state.value.countdownTimer = seconds

    countdownInterval = setInterval(() => {
      state.value.countdownTimer--
      
      if (state.value.countdownTimer <= 0) {
        state.value.canResend = true
        if (countdownInterval) {
          clearInterval(countdownInterval)
          countdownInterval = null
        }
      }
    }, 1000)
  }

  const stopCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
    state.value.canResend = true
    state.value.countdownTimer = 0
  }

  // Resend verification email form
  const {
    handleSubmit: handleResendSubmit,
    errors: resendErrors,
    meta: resendMeta,
  } = useForm({
    validationSchema: ResendVerificationSchema,
    initialValues: {
      email: state.value.email,
    },
  })

  // OTP verification form
  const {
    handleSubmit: handleOtpSubmit,
    errors: otpErrors,
    meta: otpMeta,
    setFieldValue: setOtpValue,
    values: otpValues,
  } = useForm({
    validationSchema: VerifyOtpSchema,
    initialValues: {
      otp: '',
      email: state.value.email,
    },
  })

  // Resend verification mutation
  const resendMutation = useMutation({
    mutationFn: (payload: ResendVerificationPayload) => resendVerificationEmail(payload),
    onSuccess: () => {
      // Start countdown timer after successful resend
      startCountdown(60)
    },
    onError: (error) => {
      console.error('Failed to resend verification email:', error)
    },
  })

  // OTP verification mutation
  const otpMutation = useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyEmailOtp(payload),
    onSuccess: () => {
      // Handle successful verification
      state.value.showOtpInput = false
      state.value.otpValue = ''
      setOtpValue('otp', '')
    },
    onError: (error) => {
      console.error('Failed to verify OTP:', error)
      // Clear OTP on error
      state.value.otpValue = ''
      setOtpValue('otp', '')
    },
  })

  // Computed properties
  const isResending = computed(() => resendMutation.isPending.value)
  const isVerifying = computed(() => otpMutation.isPending.value)
  const canShowOtpInput = computed(() => state.value.showOtpInput)
  const countdownDisplay = computed(() => {
    const minutes = Math.floor(state.value.countdownTimer / 60)
    const seconds = state.value.countdownTimer % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  // Actions
  const resendVerification = handleResendSubmit(async (values) => {
    if (!state.value.canResend) return
    
    const payload: ResendVerificationPayload = {
      email: values.email || state.value.email,
    }
    
    await resendMutation.mutateAsync(payload)
  })

  const showOtpInput = () => {
    state.value.showOtpInput = true
  }

  const hideOtpInput = () => {
    state.value.showOtpInput = false
    state.value.otpValue = ''
    setOtpValue('otp', '')
  }

  const verifyOtp = handleOtpSubmit(async (values) => {
    const payload: VerifyOtpPayload = {
      email: values.email || state.value.email,
      otp: values.otp,
      user_id: state.value.user_id,
    }
    
    await otpMutation.mutateAsync(payload)
  })

  const updateEmail = (email: string) => {
    state.value.email = email
  }

  const updateUserId = (userId: string) => {
    state.value.user_id = userId
  }

  // Contact admin action
  const contactAdmin = () => {
    // This can be extended to open a modal, navigate to contact page, or open email client
    const subject = encodeURIComponent('Email Verification Help')
    const body = encodeURIComponent(`I need help verifying my email address: ${state.value.email}`)
    window.open(`mailto:admin@example.com?subject=${subject}&body=${body}`)
  }

  // Lifecycle
  onMounted(() => {
    // Check if there was a recent verification request in localStorage
    const lastRequest = localStorage.getItem('last_verification_request')
    if (lastRequest) {
      const lastRequestTime = parseInt(lastRequest)
      const timeDiff = Date.now() - lastRequestTime
      const remainingTime = Math.max(0, 60 - Math.floor(timeDiff / 1000))
      
      if (remainingTime > 0) {
        startCountdown(remainingTime)
      }
    }
  })

  onUnmounted(() => {
    stopCountdown()
  })

  return {
    // State
    state: computed(() => state.value),
    
    // Computed properties
    isResending,
    isVerifying,
    canShowOtpInput,
    countdownDisplay,
    
    // Form states
    resendErrors,
    resendMeta,
    otpErrors,
    otpMeta,
    otpValues,
    
    // Actions
    resendVerification,
    showOtpInput,
    hideOtpInput,
    verifyOtp,
    updateEmail,
    updateUserId,
    contactAdmin,
    setOtpValue,
    
    // Timer controls
    startCountdown,
    stopCountdown,
  }
}