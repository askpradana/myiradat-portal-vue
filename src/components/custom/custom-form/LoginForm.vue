<script setup lang="ts">
import Button from '../../ui/button/Button.vue'
import Input from '../../ui/input/Input.vue'
import Label from '../../ui/label/Label.vue'
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '../../ui/card'
import router from '@/router'
import { ref } from 'vue'

interface LoginDataInterface {
  email: string
  password: string
}

const loginData = ref<LoginDataInterface>({
  email: '',
  password: '',
})

const handleSubmit = () => {
  console.log(loginData.value)
}
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
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="email" class="text-sm font-medium text-foreground">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="loginData.email"
          />
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label for="password" class="text-sm font-medium text-foreground">Password</Label>
            <a
              href="#"
              class="text-sm text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            required
            v-model="loginData.password"
          />
        </div>

        <Button
          size="sm"
          type="submit"
          class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Sign in
        </Button>
      </form>
    </CardContent>

    <div class="px-6 pb-6 text-center">
      <p class="text-sm text-muted-foreground">
        Don't have an account?
        <a
          href="/register"
          class="font-medium text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline ml-1"
        >
          Sign up
        </a>
      </p>
    </div>
  </Card>
</template>

<script lang="ts">
const handleSubmit = () => {
  // Handle form submission
  router.push('/dashboard')
}
</script>
