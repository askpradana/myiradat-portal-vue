import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { resendVerificationEmail } from '@/api/auth/verifyRequest'
import { verifyEmailOtp } from '@/api/auth/verifyOtp'
import { ResendVerificationSchema, VerifyOtpSchema } from '@/lib/zod-schemas/EmailVerificationSchema'
import type { VerificationState, ResendVerificationPayload, VerifyOtpPayload } from '@/types/emailVerification'
import { useUserStore } from '@/stores/userStores'
import { toast } from 'vue-sonner'

export function useEmailVerification(initialEmail?: string, initialUserId?: string, enableAutoRequest: boolean = false) {
  // Dependencies
  const router = useRouter()
  const userStore = useUserStore()
  const { t } = useI18n()
  
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

  // Auto-request state
  const isAutoRequesting = ref(false)
  const autoRequestEnabled = ref(enableAutoRequest)

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

  // Calculate countdown from API's next_retry_allowed timestamp
  const startCountdownFromTimestamp = (nextRetryAllowed: string) => {
    const now = new Date().getTime()
    const retryTime = new Date(nextRetryAllowed).getTime()
    const secondsUntilRetry = Math.max(0, Math.floor((retryTime - now) / 1000))
    
    if (secondsUntilRetry > 0) {
      startCountdown(secondsUntilRetry)
    } else {
      state.value.canResend = true
      state.value.countdownTimer = 0
    }
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
      code: '',
      email: state.value.email,
    },
  })

  // Resend verification mutation
  const resendMutation = useMutation({
    mutationFn: (payload: ResendVerificationPayload) => resendVerificationEmail(payload),
    onSuccess: (data) => {
      // Start countdown timer using API's next_retry_allowed timestamp
      if (data?.data?.next_retry_allowed) {
        startCountdownFromTimestamp(data.data.next_retry_allowed)
      } else {
        // Fallback to 60 seconds if no timestamp provided
        startCountdown(60)
      }
      
      // Show OTP in dev environment
      if (data?.data?.otp) {
        // Data logged
        toast.success(t('notifications.success.verificationCode'), {
          description: `Dev OTP: ${data.data.otp}`,
        })
      }
    },
    onError: (_error) => { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Error logged
    },
  })


  // OTP verification mutation
  const otpMutation = useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyEmailOtp(payload),
    onSuccess: (data) => {
      // Handle successful verification
      state.value.showOtpInput = false
      state.value.otpValue = ''
      setOtpValue('code', '')
      
      // Use actual API response message
      toast.success(t('notifications.success.emailVerified'), {
        description: data.message || t('notifications.success.emailVerifiedDescription'),
      })
      
      // Clear the temporary verification token
      userStore.clearTempVerificationToken()
      
      // Navigate to login page
      router.replace('/login')
    },
    onError: (_error) => { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Error logged
      // Clear OTP on error
      state.value.otpValue = ''
      setOtpValue('code', '')
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
    setOtpValue('code', '')
  }

  const verifyOtp = handleOtpSubmit(async (values) => {
    const payload: VerifyOtpPayload = {
      code: values.code,
    }
    
    await otpMutation.mutateAsync(payload)
  })

  const updateEmail = (email: string) => {
    state.value.email = email
    // Update the form's email field so validation passes
    setOtpValue('email', email)
    // Trigger auto-request if conditions are now met
    if (autoRequestEnabled.value && state.value.user_id) {
      triggerAutoRequestWhenReady()
    }
  }

  const updateUserId = (userId: string) => {
    state.value.user_id = userId
    // Trigger auto-request if conditions are now met
    if (autoRequestEnabled.value && state.value.email) {
      triggerAutoRequestWhenReady()
    }
  }

  // Auto-request verification email when conditions are met
  const autoRequestVerification = async () => {
    if (!state.value.email || !autoRequestEnabled.value || isAutoRequesting.value) {
      // Auto-request skipped
      return
    }
    
    // Data logged
    isAutoRequesting.value = true
    
    try {
      const payload: ResendVerificationPayload = {
        email: state.value.email,
      }
      
      const response = await resendVerificationEmail(payload)
      
      // Start countdown timer using API's next_retry_allowed timestamp
      if (response?.data?.next_retry_allowed) {
        startCountdownFromTimestamp(response.data.next_retry_allowed)
      } else {
        startCountdown(60)
      }
      
      // Show OTP in dev environment
      let toastMessage = 'A verification code has been sent to your email address'
      if (response?.data?.otp) {
        toastMessage += ` (Dev OTP: ${response.data.otp})`
        // Data logged
      }
      
      toast.success('Verification Email Sent', {
        description: toastMessage,
      })
    } catch (error) {  
      // Error logged
      
      toast.error('Auto-verification Failed', {
        description: `Failed to send verification email: ${error instanceof Error ? error.message : 'Network error'}`,
      })
      
      // Allow manual resend on auto-request failure
      state.value.canResend = true
    } finally {
      isAutoRequesting.value = false
    }
  }

  // Trigger auto-request when email and user_id are ready
  const triggerAutoRequestWhenReady = async () => {
    if (autoRequestEnabled.value && state.value.email && state.value.user_id) {
      // Data logged
      await autoRequestVerification()
    }
  }

  // Contact admin action
  const contactAdmin = () => {
    router.push('/contact-us')
  }

  // Lifecycle
  onMounted(() => {
    // useEmailVerification mounted
    
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
    
    // Trigger auto-request if initial conditions are met
    if (autoRequestEnabled.value && state.value.email && state.value.user_id) {
      triggerAutoRequestWhenReady()
    }
  })

  onUnmounted(() => {
    stopCountdown()
  })

  return {
    // State
    state: computed(() => state.value),
    isAutoRequesting: computed(() => isAutoRequesting.value),
    
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
    triggerAutoRequestWhenReady,
    
    // Timer controls
    startCountdown,
    startCountdownFromTimestamp,
    stopCountdown,
  }
}