<template>
  <section id="pricing" class="py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">Transparent Pricing</h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works best for your business needs
        </p>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="plan in plans"
          :key="plan.name"
          class="relative shadow-lg hover:shadow-xl transition-shadow duration-300"
          :class="plan.popular ? 'border-primary lg:scale-105' : 'border-primary/20'"
        >
          <!-- Most Popular Badge -->
          <div v-if="plan.popular" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span
              class="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium"
            >
              Most Popular
            </span>
          </div>

          <CardHeader :class="plan.popular ? 'pb-8 pt-8' : 'pb-8'">
            <CardTitle class="text-xl font-semibold">{{ plan.name }}</CardTitle>
            <CardDescription class="text-muted-foreground">{{ plan.description }}</CardDescription>
            <div class="mt-6">
              <span class="text-4xl font-bold text-foreground">{{ plan.price }}</span>
              <span class="text-sm text-muted-foreground ml-1">/month</span>
            </div>
          </CardHeader>

          <CardContent class="space-y-6">
            <Button class="w-full" size="lg" variant="default" @click="navigateToRegister">
              Get Started
            </Button>

            <div>
              <h3 class="font-medium text-foreground mb-4">What's included:</h3>
              <ul class="space-y-3">
                <li
                  v-for="(feature, idx) in plan.features"
                  :key="idx"
                  class="flex items-center gap-3"
                >
                  <svg
                    v-if="feature.included"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-primary flex-shrink-0"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-muted-foreground flex-shrink-0"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span class="text-sm text-muted-foreground">{{ feature.label }}</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'vue-router'

const router = useRouter()
const navigateToRegister = () => router.push('/register')

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    price: '$20',
    popular: false,
    features: [
      { label: '10 users', included: true },
      { label: '2GB of storage', included: true },
      { label: 'Email support', included: true },
      { label: 'Help center access', included: false },
      { label: 'Phone support', included: false },
      { label: 'Community access', included: false },
    ],
  },
  {
    name: 'Pro',
    description: 'Ideal for growing businesses',
    price: '$30',
    popular: true,
    features: [
      { label: '20 users', included: true },
      { label: '5GB of storage', included: true },
      { label: 'Email support', included: true },
      { label: 'Help center access', included: false },
      { label: 'Phone support', included: false },
      { label: 'Community access', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: '$100',
    popular: false,
    features: [
      { label: '50 users', included: true },
      { label: '15GB of storage', included: true },
      { label: 'Email support', included: true },
      { label: 'Help center access', included: false },
      { label: 'Phone support', included: false },
      { label: 'Community access', included: false },
    ],
  },
]
</script>
