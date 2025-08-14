<template>
  <section id="pricing" class="py-20 bg-muted/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          TRANSPARENT PRICING
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Choose your perfect plan
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          One-time payments. No hidden fees, no subscriptions. Pay once, use forever.
        </p>
      </div>

      <!-- 3-Tier Pricing Cards -->
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          <!-- Individual Services Tier -->
          <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div class="text-center">
              <h3 class="text-xl font-semibold text-foreground mb-2">Individual Services</h3>
              <div class="mb-4">
                <span class="text-3xl font-bold text-foreground">79,000</span>
                <span class="text-muted-foreground text-sm ml-1">IDR</span>
              </div>
              <p class="text-sm text-muted-foreground mb-6">Per service, one-time payment</p>
            </div>

            <!-- Service Selection -->
            <div class="mb-6">
              <h4 class="font-medium text-foreground mb-3">Choose your services:</h4>
              <div class="space-y-3">
                <label
                  v-for="service in availableServices"
                  :key="service.id"
                  class="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    v-model="selectedServices"
                    :value="service.id"
                    class="rounded border-border"
                  />
                  <span class="text-sm text-foreground">{{ service.name }}</span>
                </label>
              </div>
            </div>

            <!-- Features -->
            <ul class="space-y-3 mb-8">
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">One-time payment</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Single user access</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Email support</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Lifetime updates</span>
              </li>
            </ul>

            <div class="text-center mb-4">
              <p class="text-sm text-muted-foreground">
                Total: {{ formatPrice(selectedServices.length * 79000) }} IDR
              </p>
            </div>

            <Button
              class="w-full"
              variant="outline"
              :disabled="selectedServices.length === 0"
              @click="purchaseIndividual"
            >
              Buy Selected Services
            </Button>
          </div>

          <!-- Pro Plan (Recommended) -->
          <div
            class="relative rounded-2xl border-2 border-primary bg-card p-6 shadow-lg lg:scale-105"
          >
            <!-- Recommended Badge -->
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span
                class="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium"
              >
                RECOMMENDED
              </span>
            </div>

            <div class="text-center pt-4">
              <h3 class="text-2xl font-bold text-foreground mb-2">Pro Plan</h3>
              <div class="mb-4">
                <span class="text-4xl font-bold text-foreground">149,000</span>
                <span class="text-muted-foreground text-sm ml-1">IDR</span>
              </div>
              <p class="text-sm text-muted-foreground mb-4">All services included</p>

              <!-- Savings Badge -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p class="text-green-800 font-medium text-sm">Save 88,000 IDR!</p>
                <p class="text-green-600 text-xs">vs. buying individually (237,000 IDR)</p>
              </div>
            </div>

            <!-- Features -->
            <ul class="space-y-3 mb-8">
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-foreground font-medium">All 3 services included</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">One-time payment</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Single user access</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Priority email support</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Lifetime updates</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Future services included</span>
              </li>
            </ul>

            <Button class="w-full" @click="purchasePro"> Get Pro Plan </Button>
          </div>

          <!-- Enterprise Tier -->
          <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div class="text-center">
              <h3 class="text-xl font-semibold text-foreground mb-2">Enterprise</h3>
              <div class="mb-4">
                <span class="text-3xl font-bold text-foreground">Custom</span>
              </div>
              <p class="text-sm text-muted-foreground mb-6">Tailored for your organization</p>
            </div>

            <!-- Features -->
            <ul class="space-y-3 mb-8">
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">All services included</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Multiple user licenses</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Custom integrations</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Dedicated support</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">SLA guarantee</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-4 h-4 text-green-600" />
                <span class="text-sm text-muted-foreground">Training & onboarding</span>
              </li>
            </ul>

            <Button class="w-full" variant="outline" @click="contactSales"> Contact Sales </Button>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="border-t border-border pt-16 mt-16">
        <h3 class="text-2xl font-bold text-center text-foreground mb-12">
          Pricing Questions & Answers
        </h3>
        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div v-for="faq in pricingFAQ" :key="faq.question" class="space-y-3">
            <h4 class="font-semibold text-foreground">{{ faq.question }}</h4>
            <p class="text-muted-foreground text-sm">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'

// TypeScript interfaces
interface Service {
  id: string
  name: string
  description: string
}

interface FAQ {
  question: string
  answer: string
}

const router = useRouter()

// Available services data
const availableServices = ref<Service[]>([
  {
    id: 'service-a',
    name: 'Service A',
    description: 'Core functionality for basic operations',
  },
  {
    id: 'service-b',
    name: 'Service B',
    description: 'Advanced features for enhanced productivity',
  },
  {
    id: 'service-c',
    name: 'Service C',
    description: 'Premium tools for maximum efficiency',
  },
])

// Selected services for individual tier
const selectedServices = ref<string[]>([])

// Updated FAQ content for new business model
const pricingFAQ: FAQ[] = [
  {
    question: 'Are these really one-time payments?',
    answer:
      'Yes! Pay once and use the services forever. No monthly or yearly subscriptions, no hidden fees.',
  },
  {
    question: 'Can I upgrade from individual services to Pro later?',
    answer:
      'Absolutely! If you purchase individual services, you can upgrade to Pro and only pay the difference.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, bank transfers, and digital wallets. Enterprise customers can also use purchase orders.',
  },
  {
    question: 'Do I get updates and support?',
    answer:
      'Yes! All plans include lifetime updates and email support. Pro plan users get priority support.',
  },
  {
    question: 'What if I need multiple user licenses?',
    answer:
      'For multiple users, consider our Enterprise plan which offers volume licensing and advanced admin features.',
  },
  {
    question: 'Is there a money-back guarantee?',
    answer:
      "Yes, we offer a 30-day money-back guarantee for all purchases. If you're not satisfied, we'll refund your payment.",
  },
]

// Utility functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID').format(price)
}

// Action handlers
const purchaseIndividual = () => {
  if (selectedServices.value.length === 0) return

  // TODO: Implement individual service purchase logic
  console.log('Purchasing services:', selectedServices.value)
  router.push('/checkout/individual')
}

const purchasePro = () => {
  // TODO: Implement Pro plan purchase logic
  console.log('Purchasing Pro plan')
  router.push('/checkout/pro')
}

const contactSales = () => {
  router.push('/contact-sales')
}
</script>
