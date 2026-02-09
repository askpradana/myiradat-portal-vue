<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderSection />

    <!-- Service Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-background via-background/50 to-accent/5 py-24 sm:py-32 mt-8"
    >
      <!-- Decorative background elements -->
      <div
        class="absolute inset-0 bg-grid-slate-100/25 [background-image:radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-background/50"
      ></div>
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl"
      ></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-4xl mx-auto">
          <!-- Service Icon -->
          <div
            class="group w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm ring-1 ring-border/10 backdrop-blur-sm transition-all duration-500 hover:shadow-md hover:scale-105"
          >
            <img
              :src="iconUrl"
              alt="Service Icon"
              class="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <!-- Service Title -->
          <h1
            class="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-8 tracking-tight leading-tight"
          >
            {{ service.title }}
          </h1>

          <!-- Service Description -->
          <p
            class="text-xl sm:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto font-medium"
          >
            {{ service.description }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              class="group relative text-lg px-8 py-4 rounded-lg bg-gradient-to-b from-primary to-primary/90 border border-primary/20 shadow-sm text-white font-medium transition-all duration-200 hover:from-primary/90 hover:to-primary hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
            >
              <span class="relative z-10">Get Started</span>
              <div
                class="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-200"
              ></div>
            </Button>
            <Button
              variant="outline"
              size="lg"
              class="group relative text-lg px-8 py-4 rounded-lg bg-gradient-to-b from-background to-background/90 border border-border hover:border-primary/30 shadow-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:bg-gradient-to-b hover:from-background/90 hover:to-background active:translate-y-0 active:shadow-sm"
            >
              <span class="relative z-10">Learn More</span>
              <div
                class="absolute inset-0 rounded-lg bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-200"
              ></div>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 sm:py-32 bg-gradient-to-b from-background to-accent/5 relative">
      <!-- Background decoration -->
      <div class="absolute inset-0 bg-grid-slate-100/25 opacity-50"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div
            class="inline-flex items-center justify-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 ring-1 ring-primary/20"
          >
            Key Features
          </div>
          <h2 class="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Powerful capabilities
          </h2>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover what makes {{ service.title }} unique and powerful
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in service.features"
            :key="index"
            class="group bg-background/60 backdrop-blur-sm rounded-3xl p-8 shadow-sm ring-1 ring-border/10 hover:shadow-md transition-all duration-500 hover:-translate-y-1 hover:ring-primary/20 border-0"
          >
            <div
              class="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-primary/10 group-hover:shadow-sm transition-all duration-300 group-hover:scale-110"
            >
              <component
                :is="feature.icon"
                class="w-7 h-7 text-primary transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h3
              class="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300"
            >
              {{ feature.title }}
            </h3>
            <p class="text-muted-foreground leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 relative">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="text-primary text-sm font-medium mb-3">Benefits</div>
          <h2 class="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Why Choose {{ service.title }}?
          </h2>
        </div>

        <!-- Benefits List - Minimal Design -->
        <div class="space-y-8 max-w-3xl mx-auto">
          <div
            v-for="(benefit, index) in service.benefits"
            :key="index"
            class="flex items-start space-x-4 group"
          >
            <!-- Simple Check Icon -->
            <div
              class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1"
            >
              <Check class="w-3 h-3 text-primary" />
            </div>

            <!-- Content -->
            <div class="flex-1">
              <h4 class="text-lg font-medium text-foreground mb-1">
                {{ benefit.title }}
              </h4>
              <p class="text-muted-foreground text-sm leading-relaxed">
                {{ benefit.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-24 sm:py-32 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden"
    >
      <!-- Background decorations -->
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">Ready to Get Started?</h2>
        <p class="text-xl sm:text-2xl mb-12 opacity-90 leading-relaxed max-w-3xl mx-auto">
          Join thousands of professionals who trust {{ service.title }}
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            size="lg"
            class="group relative text-lg px-8 py-4 rounded-lg bg-gradient-to-b from-white to-white/90 border border-white/20 shadow-sm text-primary font-medium transition-all duration-200 hover:from-white/95 hover:to-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
          >
            <span class="relative z-10">Start Free Trial</span>
            <div
              class="absolute inset-0 rounded-lg bg-gradient-to-b from-white/30 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-200"
            ></div>
          </Button>
          <Button
            size="lg"
            class="group relative text-lg px-8 py-4 rounded-lg bg-gradient-to-b from-white/10 to-white/5 border border-white/30 shadow-sm text-white font-medium transition-all duration-200 hover:from-white/15 hover:to-white/10 hover:border-white/40 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm backdrop-blur-sm"
          >
            <span class="relative z-10">Contact Sales</span>
            <div
              class="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-200"
            ></div>
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
  iconUrl: string
}

defineProps<Props>()
</script>
