<script setup lang="ts">
import Button from '../components/ui/button/Button.vue'
import Input from '../components/ui/input/Input.vue'
import Label from '../components/ui/label/Label.vue'
import Textarea from '../components/ui/textarea/Textarea.vue'
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '../components/ui/card'
import { useField, useForm } from 'vee-validate'
import { bookDemoValidationSchema } from '@/lib/zod-schemas/bookDemoFormSchema'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const loading = ref(false)
const submitted = ref(false)

const validationSchema = bookDemoValidationSchema
const { handleSubmit, errors, resetForm } = useForm({
  validationSchema,
})

const { value: name } = useField<string>('name')
const { value: email } = useField<string>('email')
const { value: company } = useField<string>('company')
const { value: message } = useField<string>('message')

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  loading.value = false
  submitted.value = true
  
  toast('Demo Request Submitted!', {
    description: 'We will contact you within 24 hours to schedule your personalized demo.',
  })
  
  // Reset form after a delay
  setTimeout(() => {
    submitted.value = false
    resetForm()
  }, 5000)
})

const resetDemo = () => {
  submitted.value = false
  resetForm()
}
</script>

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
        class="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-lg relative z-10">
      <!-- Logo/Brand section -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4"
        >
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Book a Demo</h1>
        <p class="text-muted-foreground">
          See MyIradat in action with a personalized demonstration
        </p>
      </div>

      <!-- Demo form or success message -->
      <Card
        v-if="!submitted"
        class="w-full shadow-2xl shadow-primary/25 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm"
      >
        <CardHeader class="space-y-1 pb-2">
          <CardTitle class="text-2xl font-semibold text-center text-foreground">
            Schedule Your Demo
          </CardTitle>
          <CardDescription class="text-center text-muted-foreground">
            Tell us about your needs and we'll show you how MyIradat can help
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          <form @submit="onSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="name" class="text-sm font-medium text-foreground">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                v-model="name"
              />
              <span class="text-xs text-red-400">{{ errors.name }}</span>
            </div>

            <div class="space-y-2">
              <Label for="email" class="text-sm font-medium text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                v-model="email"
              />
              <span class="text-xs text-red-400">{{ errors.email }}</span>
            </div>

            <div class="space-y-2">
              <Label for="company" class="text-sm font-medium text-foreground">Company</Label>
              <Input
                id="company"
                type="text"
                placeholder="Enter your company name"
                class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                v-model="company"
              />
              <span class="text-xs text-red-400">{{ errors.company }}</span>
            </div>

            <div class="space-y-2">
              <Label for="message" class="text-sm font-medium text-foreground">
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us about your specific needs or use case..."
                class="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                v-model="message"
              />
              <span class="text-xs text-red-400">{{ errors.message }}</span>
            </div>

            <Button
              size="sm"
              type="submit"
              class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              :disabled="loading"
              :class="loading && 'bg-gray-500 pointer-events-none'"
            >
              {{ loading ? 'Submitting...' : 'Schedule Demo' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Success message -->
      <Card
        v-else
        class="w-full shadow-2xl shadow-primary/25 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm"
      >
        <CardContent class="text-center py-8">
          <div class="mb-6">
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
            >
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-foreground mb-2">Demo Request Submitted!</h2>
            <p class="text-muted-foreground">
              Thank you for your interest. Our team will contact you within 24 hours to schedule
              your personalized MyIradat demonstration.
            </p>
          </div>
          <div class="space-y-4">
            <p class="text-sm text-muted-foreground">
              In the meantime, feel free to explore our features or contact us with any questions.
            </p>
            <Button @click="resetDemo" variant="outline" class="w-full">
              Submit Another Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>