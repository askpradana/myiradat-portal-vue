<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderSection />

    <!-- Hero Section with Metrics -->
    <HeroSection />

    <!-- Interactive Bento Grid Features -->
    <BentoGridSection />

    <!-- Enhanced Testimonials -->
    <TestimonialsSection />

    <!-- FAQ Section -->
    <FAQSection />

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHomepageStore } from '@/stores/homepage'
import { useViewportTracker } from './composables'
import {
  HeaderSection,
  HeroSection,
  // TrustIndicatorsSection,
  BentoGridSection,
  // UseCaseCarouselSection,
  TestimonialsSection,
  // PricingSection,
  FAQSection,
  FooterSection,
} from './components/sections'

const homepageStore = useHomepageStore()

// Initialize viewport tracking
useViewportTracker()

onMounted(() => {
  // Initialize the homepage store and any global setup
  homepageStore.initializeAnimations()
})
</script>
