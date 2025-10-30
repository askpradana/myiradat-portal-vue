<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderSection />

    <!-- Service Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-background via-card/30 to-background py-20 mt-8"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <!-- Service Icon -->
          <div
            class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <component :is="iconComponent" class="w-8 h-8 text-primary" />
          </div>

          <!-- Service Title -->
          <h1 class="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            {{ service.title }}
          </h1>

          <!-- Service Description -->
          <p class="text-xl text-muted-foreground mb-8">
            {{ service.description }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" class="text-lg px-8 py-4"> Get Started </Button>
            <Button variant="outline" size="lg" class="text-lg px-8 py-4"> Learn More </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-card/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-foreground mb-4">Key Features</h2>
          <p class="text-lg text-muted-foreground">
            Discover what makes {{ service.title }} unique
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in service.features"
            :key="index"
            class="bg-background rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <component :is="feature.icon" class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-muted-foreground">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-foreground mb-6">Why Choose {{ service.title }}?</h2>
            <div class="space-y-4">
              <div
                v-for="(benefit, index) in service.benefits"
                :key="index"
                class="flex items-start space-x-3"
              >
                <div
                  class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                >
                  <Check class="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 class="font-semibold text-foreground mb-1">
                    {{ benefit.title }}
                  </h4>
                  <p class="text-muted-foreground">
                    {{ benefit.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Benefits Visual -->
          <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
            <div
              class="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <component :is="iconComponent" class="w-16 h-16 text-primary" />
            </div>
            <h3 class="text-2xl font-bold text-foreground mb-3">Professional Excellence</h3>
            <p class="text-muted-foreground">Trusted by professionals across Indonesia</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-primary-foreground">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p class="text-xl mb-8 opacity-90">
          Join thousands of professionals who trust {{ service.title }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" class="text-lg px-8 py-4">
            Start Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            class="text-lg px-8 py-4 border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-vue-next'
import type { Component } from 'vue'
import HeaderSection from '@/views/home/components/sections/HeaderSection.vue'
import FooterSection from '@/views/home/components/sections/FooterSection.vue'

interface ServiceFeature {
  icon: Component
  title: string
  description: string
}

interface ServiceBenefit {
  title: string
  description: string
}

interface ServiceData {
  title: string
  description: string
  features: ServiceFeature[]
  benefits: ServiceBenefit[]
}

interface Props {
  service: ServiceData
  iconComponent: Component
}

defineProps<Props>()
</script>
