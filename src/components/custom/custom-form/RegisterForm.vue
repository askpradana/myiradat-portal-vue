<script setup lang="ts">
import Button from '../../ui/button/Button.vue'
import Input from '../../ui/input/Input.vue'
import Label from '../../ui/label/Label.vue'
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '../../ui/card'
import { useField, useForm } from 'vee-validate'
import { registerNewUser } from '@/api/register'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { RegisterFormSchema } from '@/lib/zod-schemas/registerFormSchema'
import { Eye, EyeClosed } from 'lucide-vue-next'

const router = useRouter()
const loading = ref(false)
const isShowPassword = ref(false)

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
    const response = await registerNewUser(values)

    if (response.success) {
      toast('Success', {
        description: `${response?.message}`,
      })
      router.replace('/login')
    }
  } catch (error) {
    console.error('Error message', error)
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
      <CardTitle class="text-2xl font-semibold text-center text-foreground">Welcome back</CardTitle>
      <CardDescription class="text-center text-muted-foreground">
        Enter your credentials to access your account
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-6">
      <form @submit="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name" class="text-sm font-medium text-foreground">Username</Label>
          <Input
            id="name"
            name="username"
            autocomplete="username"
            type="text"
            placeholder="Enter your username"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="name"
          />
          <span class="text-xs text-red-400">{{ errors.name }}</span>
        </div>

        <div class="space-y-2">
          <Label for="phone" class="text-sm font-medium text-foreground">Phone number</Label>
          <Input
            id="phone"
            name="tel"
            autocomplete="tel"
            type="tel"
            placeholder="Enter your phone number"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="phone"
          />
          <span class="text-xs text-red-400">{{ errors.phone }}</span>
        </div>

        <div class="space-y-2">
          <Label for="email" class="text-sm font-medium text-foreground">Email address</Label>
          <Input
            id="email"
            name="email"
            autocomplete="email"
            type="email"
            placeholder="Enter your email"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="email"
          />
          <span class="text-xs text-red-400">{{ errors.email }}</span>
        </div>

        <div class="space-y-2">
          <Label for="password" class="text-sm font-medium text-foreground">Password</Label>
          <div class="relative">
            <Input
              id="password"
              name="new-password"
              autocomplete="new-password"
              :type="isShowPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="password"
            />
            <Eye
              :size="18"
              class="absolute right-3 top-3 text-slate-400 dark:text-purple-500"
              @click="showPassword"
              v-if="isShowPassword"
            />
            <EyeClosed
              :size="18"
              class="absolute right-3 top-3 text-slate-400 dark:text-purple-500"
              @click="showPassword"
              v-else
            />
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
          {{ loading ? 'Please wait...' : 'Sign up' }}
        </Button>
      </form>
    </CardContent>

    <div class="px-6 pb-6 text-center">
      <p class="text-sm text-muted-foreground">
        Already have an account?
        <button
          @click="() => router.replace('/login')"
          type="button"
          class="font-medium text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline ml-1"
        >
          Sign in
        </button>
      </p>
    </div>
  </Card>
</template>
