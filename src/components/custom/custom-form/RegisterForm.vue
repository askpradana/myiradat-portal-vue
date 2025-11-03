<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@/components/ui/card'
import { useField, useForm } from 'vee-validate'
import { registerNewUser } from '@/api/register'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { RegisterFormSchema } from '@/lib/zod-schemas/registerFormSchema'
import { Eye, EyeClosed } from 'lucide-vue-next'
import { useUmami } from '@/composables/utils/useUmami'
import { useI18n } from 'vue-i18n'

// Define emits for better component composition
const emit = defineEmits<{
  'form-submit': [values: { name: string; phone: string; email: string; password: string }]
  'register-success': [data: { email: string; name: string }]
  'register-error': [error: string]
}>()

const router = useRouter()
const loading = ref(false)
const isShowPassword = ref(false)
const { trackEvent } = useUmami()
const { t } = useI18n()

const showPassword = () => {
  isShowPassword.value = !isShowPassword.value
}

const validationSchema = RegisterFormSchema
const { handleSubmit, errors } = useForm({
  validationSchema,
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: name } = useField<string>('name')
const { value: phone } = useField<string>('phone')

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true

    // Emit form submit event
    emit('form-submit', values)

    // Track registration attempt
    trackEvent('register-attempt', {
      action: 'daftar',
      email: values.email,
      name: values.name,
      timestamp: new Date().toISOString()
    })

    const response = await registerNewUser(values)

    if (response.success) {
      // Emit register success event
      emit('register-success', {
        email: values.email,
        name: values.name,
      })

      // Track successful registration
      trackEvent('register-success', {
        action: 'daftar-berhasil',
        email: values.email,
        name: values.name,
        timestamp: new Date().toISOString()
      })

      toast('Success', {
        description: `${response?.message}`,
      })
      router.replace('/login')
    } else {
      // Emit register error event
      emit('register-error', response?.message || 'Registration failed')

      // Track failed registration
      trackEvent('register-failed', {
        action: 'daftar-gagal',
        email: values.email,
        error: response?.message || 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error message', error)

    // Emit register error event
    emit('register-error', error instanceof Error ? error.message : 'Registration error')

    // Track registration error
    trackEvent('register-error', {
      action: 'daftar-error',
      email: values.email,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Card
    class="w-full max-w-md mx-auto shadow-2xl shadow-primary/25 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm"
  >
    <CardHeader class="space-y-1 pb-2">
      <CardTitle class="text-2xl font-semibold text-center text-foreground">{{ t('auth.register.title') }}</CardTitle>
      <CardDescription class="text-center text-muted-foreground">
        {{ t('auth.register.description') }}
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <form @submit="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name" class="text-sm font-medium text-foreground">{{ t('auth.form.fullName') }}</Label>
          <Input
            id="name"
            name="name"
            autocomplete="name"
            type="text"
            :placeholder="t('auth.form.enterFullName')"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="name"
            aria-describedby="name-error"
          />
          <span id="name-error" class="text-xs text-red-400" role="alert">{{ errors.name }}</span>
        </div>

        <div class="space-y-2">
          <Label for="phone" class="text-sm font-medium text-foreground">{{ t('auth.form.phoneNumber') }}</Label>
          <Input
            id="phone"
            name="tel"
            autocomplete="tel"
            type="tel"
            :placeholder="t('auth.form.enterPhoneNumber')"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="phone"
            aria-describedby="phone-error"
          />
          <span id="phone-error" class="text-xs text-red-400" role="alert">{{ errors.phone }}</span>
        </div>

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
            aria-describedby="email-error"
          />
          <span id="email-error" class="text-xs text-red-400" role="alert">{{ errors.email }}</span>
        </div>

        <div class="space-y-2">
          <Label for="password" class="text-sm font-medium text-foreground">{{ t('auth.form.password') }}</Label>
          <div class="relative">
            <Input
              id="password"
              name="new-password"
              autocomplete="new-password"
              :type="isShowPassword ? 'text' : 'password'"
              :placeholder="t('auth.form.enterPassword')"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="password"
              aria-describedby="password-error"
            />
            <button
              type="button"
              @click="showPassword"
              :aria-label="isShowPassword ? 'Hide password' : 'Show password'"
              class="absolute right-3 top-3 text-slate-400 dark:text-purple-500 hover:text-foreground transition-colors"
            >
              <Eye
                :size="18"
                v-if="isShowPassword"
              />
              <EyeClosed
                :size="18"
                v-else
              />
            </button>
          </div>
          <span id="password-error" class="text-xs text-red-400" role="alert">{{ errors.password }}</span>
        </div>
        <Button
          size="sm"
          type="submit"
          class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          :disabled="loading"
          :class="loading && 'bg-gray-500 pointer-events-none'"
        >
          {{ loading ? t('auth.buttons.pleaseWait') : t('auth.buttons.signUp') }}
        </Button>
      </form>
    </CardContent>

    <div class="px-6 pb-6 text-center">
      <p class="text-sm text-muted-foreground">
        {{ t('auth.register.hasAccount') }}
        <button
          @click="() => router.replace('/login')"
          type="button"
          class="font-medium text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline ml-1"
        >
          {{ t('auth.buttons.signIn') }}
        </button>
      </p>
    </div>
  </Card>
</template>
