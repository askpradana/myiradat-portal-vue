<template>
  <div
    class="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Background Decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Blur circles -->
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div
        class="absolute -bottom-32 -left-40 w-96 h-96 bg-secondary/15 rounded-full blur-3xl"
      ></div>

      <!-- Grid overlay -->
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-md relative z-10">
      <!-- Email Verification Card -->
      <Card
        class="shadow-2xl shadow-primary/25 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm"
      >
        <CardHeader class="text-center space-y-4">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto"
          >
            <svg
              class="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <CardTitle class="text-2xl font-bold text-foreground"
              >Email Verification Required</CardTitle
            >
            <CardDescription class="text-muted-foreground mt-2">
              Please verify your email address to complete your account setup
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent class="space-y-6">
          <!-- Status Alert -->
          <Alert class="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
            <svg
              class="h-4 w-4 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <AlertTitle class="text-blue-800 dark:text-blue-200">Verification Required</AlertTitle>
            <AlertDescription class="text-blue-700 dark:text-blue-300">
              A verification email was sent to your address. Please check your inbox and spam
              folder.
            </AlertDescription>
          </Alert>

          <!-- Email Display -->
          <div class="space-y-2 select-none">
            <label class="text-sm font-medium text-foreground">Email Address</label>
            <div class="flex items-center px-3 py-2 bg-muted/50 rounded-lg border border-border/50">
              <svg
                class="w-4 h-4 text-muted-foreground mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <span class="text-sm font-medium text-foreground">{{ verificationEmail }}</span>
            </div>
          </div>

          <!-- Main Actions -->
          <div class="space-y-4">
            <!-- Resend Verification -->
            <div class="space-y-3">
              <Button
                @click="resendVerification"
                :disabled="!state.canResend || isResending"
                class="w-full"
                variant="default"
              >
                <div
                  v-if="isResending"
                  class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                ></div>
                <svg
                  v-else
                  class="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {{
                  isResending
                    ? 'Sending...'
                    : state.canResend
                      ? 'Request New Code'
                      : `Wait ${countdownDisplay}`
                }}
              </Button>

              <p v-if="!state.canResend" class="text-xs text-muted-foreground text-center">
                You can request a new verification code in {{ countdownDisplay }}
              </p>
            </div>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-border" />
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <!-- OTP Verification Section -->
            <div class="space-y-3">
              <Button
                v-if="!canShowOtpInput"
                @click="showOtpInput"
                variant="outline"
                class="w-full"
                disabled
              >
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Enter Verification Code
                <span class="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
                  >Coming Soon</span
                >
              </Button>

              <!-- OTP Input Form (when backend is ready) -->
              <div v-if="canShowOtpInput" class="space-y-3">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Verification Code</label>
                  <PinInput
                    :model-value="otpValues?.otp || ''"
                    @update:model-value="setOtpValue('otp', $event)"
                    placeholder="0"
                    class="justify-center"
                    :disabled="isVerifying"
                  />
                  <p v-if="otpErrors.otp" class="text-sm text-red-600">{{ otpErrors.otp }}</p>
                </div>

                <div class="flex gap-2">
                  <Button
                    @click="hideOtpInput"
                    variant="outline"
                    class="flex-1"
                    :disabled="isVerifying"
                  >
                    Cancel
                  </Button>
                  <Button
                    @click="verifyOtp"
                    class="flex-1"
                    :disabled="isVerifying || !otpValues?.otp"
                  >
                    <div
                      v-if="isVerifying"
                      class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                    ></div>
                    <svg
                      v-else
                      class="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {{ isVerifying ? 'Verifying...' : 'Verify Code' }}
                  </Button>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-border" />
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-card px-2 text-muted-foreground">need help?</span>
              </div>
            </div>

            <!-- Contact Admin -->
            <Button @click="contactAdmin" variant="outline" class="w-full">
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Contact Administrator
            </Button>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col space-y-4">
          <!-- Divider -->
          <div class="w-full border-t border-border"></div>

          <!-- Back to Login -->
          <Button @click="backToLogin" variant="ghost" class="w-full">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PinInput } from '@/components/ui/pin-input'
import { useEmailVerification } from '@/composables/auth/useEmailVerification'

// Router
const route = useRoute()
const router = useRouter()

// Get email and user_id from route query parameters
const verificationEmail = ref<string>('')
const verificationUserId = ref<string>('')

// Email verification composable
const {
  state,
  isResending,
  isVerifying,
  canShowOtpInput,
  countdownDisplay,
  otpErrors,
  otpValues,
  resendVerification,
  showOtpInput,
  hideOtpInput,
  verifyOtp,
  contactAdmin,
  setOtpValue,
  updateEmail,
  updateUserId,
} = useEmailVerification()

// Actions
const backToLogin = () => {
  router.replace('/login')
}

// Initialize component
onMounted(() => {
  // Get verification data from route query
  const email = route.query.email as string
  const userId = route.query.user_id as string

  if (!email || !userId) {
    // If no email or user_id provided, redirect to login
    router.replace('/login')
    return
  }

  verificationEmail.value = email
  verificationUserId.value = userId

  // Update composable with email and user_id
  updateEmail(email)
  updateUserId(userId)
})
</script>
