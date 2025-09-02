<script setup lang="ts">
import Button from '../../ui/button/Button.vue'
import Input from '../../ui/input/Input.vue'
import Label from '../../ui/label/Label.vue'
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '../../ui/card'
import { useField, useForm } from 'vee-validate'
import { loginValidationSchema } from '@/lib/zod-schemas/loginFormSchema'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/login'
import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/userStores'
import { Eye, EyeClosed } from 'lucide-vue-next'
import type { UserLoginInterface, Service } from '@/stores/userStores'

const loading = ref(false)
const isShowPassword = ref(false)
const router = useRouter()
const userStore = useUserStore()

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
  const response = await login(values)
  loading.value = false

  if (response?.success) {
    // Check if email verification is required
    if (response.data?.requires_verification) {
      // Store the temporary verification token
      if (response.data.token) {
        userStore.setTempVerificationToken(response.data.token)
      }

      // Redirect to email verification page with user data
      router.push({
        path: '/verify-email',
        query: {
          email: response.data.email,
          user_id: response.data.user_id,
        },
      })
      toast('Email Verification Required', {
        description: response.message || 'Please verify your email address to continue',
      })
      return
    }

    // Normal login success flow
    if (response.data.token && response.data.expires_at && response.data.user) {
      userStore.setUserData({
        auth: {
          token: response.data.token,
          expires_at: response.data.expires_at,
        },
        user: response.data.user as unknown as UserLoginInterface,
        services: (response.data.services || []) as unknown as Service[],
      })
    }
    toast('Success', {
      description: `${response?.message}`,
    })
    router.replace('/dashboard')
  }
})
</script>

<template>
  <Card
    class="w-full max-w-md mx-auto shadow-2xl shadow-primary/25 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm"
  >
    <CardHeader class="space-y-1 pb-2">
      <CardTitle class="text-2xl font-semibold text-center text-foreground">Welcome back</CardTitle>
      <CardDescription class="text-center text-muted-foreground">
        Enter your credentials to access your account
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <form @submit="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="email" class="text-sm font-medium text-foreground">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="email"
          />
          <span class="text-xs text-red-400">{{ errors.email }}</span>
        </div>

        <div class="space-y-2">
          <div class="relative">
            <Label for="password" class="text-sm font-medium text-foreground">Password</Label>
            <div class="relative mt-2">
              <Input
                id="password"
                :type="isShowPassword ? 'text' : 'password'"
                placeholder="Enter your password"
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
            <buton
              @click="() => router.replace('/reset-password')"
              type="button"
              class="text-sm text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Forgot password?
            </buton>
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
          {{ loading ? 'Please wait...' : 'Sign in' }}
        </Button>
      </form>
    </CardContent>

    <div class="px-6 pb-6 text-center">
      <p class="text-sm text-muted-foreground">
        Don't have an account?
        <button
          @click="() => router.replace('/register')"
          type="button"
          class="font-medium text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline ml-1"
        >
          Sign up
        </button>
      </p>
    </div>
  </Card>
</template>
