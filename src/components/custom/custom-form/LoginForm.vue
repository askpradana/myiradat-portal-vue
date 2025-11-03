<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@/components/ui/card'
import { useField, useForm } from 'vee-validate'
import { loginValidationSchema } from '@/lib/zod-schemas/loginFormSchema'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/login'
import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { Eye, EyeClosed } from 'lucide-vue-next'
import type { UserLoginInterface, Service } from '@/stores/userStores'
import { useI18n } from 'vue-i18n'
import { useUmami } from '@/composables/utils/useUmami'

// Define emits for better component composition
const emit = defineEmits<{
  'form-submit': [values: { email: string; password: string }]
  'login-success': [data: { user: UserLoginInterface; services: Service[] }]
  'login-error': [error: string]
  'verification-required': [data: { email: string; user_id: string }]
}>()

const loading = ref(false)
const isShowPassword = ref(false)
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()
const { trackEvent } = useUmami()

const showPassword = () => {
  isShowPassword.value = !isShowPassword.value
}

const validationSchema = loginValidationSchema
const { handleSubmit, errors } = useForm({
  validationSchema,
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  loading.value = true

  // Emit form submit event
  emit('form-submit', values)

  // Track login attempt
  trackEvent('login-attempt', {
    action: 'masuk',
    email: values.email,
    timestamp: new Date().toISOString()
  })

  const response = await login(values)
  loading.value = false

  if (response?.success) {
    // Track successful login
    trackEvent('login-success', {
      action: 'masuk-berhasil',
      email: values.email,
      user_role: response.data?.user?.role_name || 'unknown',
      timestamp: new Date().toISOString()
    })

    // Check if email verification is required
    if (response.data?.requires_verification) {
      // Emit verification required event
      emit('verification-required', {
        email: response.data.email || '',
        user_id: response.data.user_id || '',
      })

      // Store the temporary verification token
      if (response.data.token) {
        userStore.setTempVerificationToken(response.data.token)
      }

      // Redirect to email verification page with user data
      router.push({
        path: '/verify-email',
        query: {
          email: response.data.email || '',
          user_id: response.data.user_id || '',
        },
      })
      toast(t('auth.messages.emailVerificationRequired'), {
        description: response.message || t('auth.messages.verifyEmailToContinue'),
      })
      return
    }

    // Normal login success flow
    if (response.data.token && response.data.expires_at && response.data.user) {
      const userData = {
        auth: {
          token: response.data.token,
          expires_at: response.data.expires_at,
        },
        user: response.data.user as unknown as UserLoginInterface,
        services: (response.data.services || []) as unknown as Service[],
      }

      userStore.setUserData(userData)

      // Emit login success event
      emit('login-success', {
        user: userData.user,
        services: userData.services,
      })
    }
    toast(t('auth.messages.success'), {
      description: `${response?.message}`,
    })
    router.replace('/dashboard')
  } else {
    // Emit login error event
    emit('login-error', response?.message || 'Login failed')

    // Track failed login
    trackEvent('login-failed', {
      action: 'masuk-gagal',
      email: values.email,
      error: response?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})
</script>

<template>
  <Card
    class="w-full max-w-md mx-auto shadow-2xl shadow-primary/25 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm"
  >
    <CardHeader class="space-y-1 pb-2">
      <CardTitle class="text-2xl font-semibold text-center text-foreground">{{ t('auth.welcome.title') }}</CardTitle>
      <CardDescription class="text-center text-muted-foreground">
        {{ t('auth.welcome.description') }}
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <form @submit="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="email" class="text-sm font-medium text-foreground">{{ t('auth.form.email') }}</Label>
          <Input
            id="email"
            name="email"
            autocomplete="email"
            type="email"
            :placeholder="t('auth.form.enterEmail')"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="email"
          />
          <span class="text-xs text-red-400">{{ errors.email }}</span>
        </div>

        <div class="space-y-2">
          <div class="relative">
            <Label for="password" class="text-sm font-medium text-foreground">{{ t('auth.form.password') }}</Label>
            <div class="relative mt-2">
              <Input
                id="password"
                name="current-password"
                autocomplete="current-password"
                :type="isShowPassword ? 'text' : 'password'"
                :placeholder="t('auth.form.enterPassword')"
                class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                v-model="password"
              />
              <div
                class="absolute right-3 top-3 text-slate-400 dark:text-purple-500 cursor-pointer select-none"
                @click="showPassword"
                :aria-label="isShowPassword ? 'Hide password' : 'Show password'"
                role="button"
              >
                <Eye :size="18" v-if="isShowPassword" />
                <EyeClosed :size="18" v-else />
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-1">
            <button
              @click="() => router.replace('/forgot-password')"
              type="button"
              class="text-sm text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              {{ t('auth.buttons.forgotPassword') }}
            </button>
          </div>
          <span class="text-xs text-red-400">{{ errors.password }}</span>
        </div>

        <Button
          size="sm"
          type="submit"
          class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          :disabled="loading"
          :class="loading && 'bg-gray-500 pointer-events-none'"
        >
          {{ loading ? t('auth.buttons.pleaseWait') : t('auth.buttons.signIn') }}
        </Button>
      </form>
    </CardContent>

    <div class="px-6 pb-6 text-center">
      <p class="text-sm text-muted-foreground">
        {{ t('auth.login.noAccount') }}
        <button
          @click="() => router.replace('/register')"
          type="button"
          class="font-medium text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline ml-1"
        >
          {{ t('auth.buttons.signUp') }}
        </button>
      </p>
    </div>
  </Card>
</template>
