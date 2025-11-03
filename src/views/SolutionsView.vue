<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderSection />

    <!-- Solutions Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-background via-card/30 to-background py-20 mt-8"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <!-- Hero Icon -->
          <div
            class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Briefcase class="w-8 h-8 text-primary" />
          </div>

          <!-- Hero Title -->
          <h1 class="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Our Solutions
          </h1>

          <!-- Hero Description -->
          <p class="text-xl text-muted-foreground mb-8">
            Comprehensive psychological and human resource solutions designed to empower your organization and enhance your workforce potential.
          </p>
        </div>
      </div>
    </section>

    <!-- Services Grid Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="i in 6"
            :key="i"
            class="bg-card rounded-2xl p-8 shadow-sm animate-pulse"
          >
            <div class="w-12 h-12 bg-muted rounded-xl mb-6"></div>
            <div class="h-6 bg-muted rounded mb-4"></div>
            <div class="h-4 bg-muted rounded mb-2"></div>
            <div class="h-4 bg-muted rounded mb-6"></div>
            <div class="h-10 bg-muted rounded"></div>
          </div>
        </div>

        <!-- Services Grid -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="service in services"
            :key="service.id"
            class="bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 group"
          >
            <!-- Service Icon -->
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <component :is="service.icon" class="w-6 h-6 text-primary" />
            </div>

            <!-- Service Title -->
            <h3 class="text-xl font-semibold text-foreground mb-3">
              {{ service.title }}
            </h3>

            <!-- Service Description -->
            <p class="text-muted-foreground mb-6 leading-relaxed">
              {{ service.description }}
            </p>

            <!-- Learn More Button -->
            <router-link
              :to="`/services/${service.slug}`"
              class="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-colors group"
            >
              <span>Learn More</span>
              <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-primary-foreground">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to Transform Your Organization?</h2>
        <p class="text-xl mb-8 opacity-90">
          Discover how our comprehensive solutions can help you build a stronger, more effective workforce.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" class="text-lg px-8 py-4">
            Get Started Today
          </Button>
          <Button size="lg" variant="secondary" class="text-lg px-8 py-4">
            Contact Our Team
          </Button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Briefcase, ArrowRight } from 'lucide-vue-next'
import HeaderSection from '@/views/home/components/sections/HeaderSection.vue'
import FooterSection from '@/views/home/components/sections/FooterSection.vue'
import { useServicesData } from '@/composables/services/useServicesData'

const { getAllServices, isLoading } = useServicesData()

const services = computed(() => getAllServices())
</script>