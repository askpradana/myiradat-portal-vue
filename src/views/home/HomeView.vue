<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderSection />

    <!-- Hero Section with Metrics -->
    <HeroSection />

    <!-- Interactive Bento Grid Features -->
    <BentoGridSection />

    <!-- Enhanced Testimonials -->
    <!-- <TestimonialsSection /> -->

    <!-- Partner -->
    <PartnerSection />

    <!-- Latest Articles Preview -->
    <ArticlesPreviewSection />

    <!-- FAQ Section -->
    <!-- <FAQSection /> -->

    <!-- Footer -->
    <FooterSection />

    <!-- Flying contact helper -->
    <div class="fixed bottom-6 right-4 z-50 max-w-xs sm:right-6" aria-label="Business contact information">
      <button
        v-if="!isContactOpen"
        type="button"
        class="rounded-full border border-border bg-card/90 p-2.5 text-muted-foreground shadow-sm transition-colors hover:text-foreground"
        aria-label="Open contact information"
        :aria-expanded="isContactOpen"
        @click="isContactOpen = true"
      >
        <Phone class="h-4 w-4" />
      </button>

      <div
        v-else
        class="relative overflow-hidden rounded-2xl border border-border bg-card/95 p-3 shadow-sm"
      >
        <button
          type="button"
          class="absolute right-2 top-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close contact information"
          @click="isContactOpen = false"
        >
          <X class="h-4 w-4" />
        </button>

        <div class="flex items-start gap-3 pr-7">
          <div class="mt-1 rounded-full bg-muted p-2 text-muted-foreground">
            <Phone class="h-4 w-4" />
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Need help? Contact us
            </p>
            <a
              href="tel:02129578187"
              class="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <Phone class="h-4 w-4" />
              021 2957 8187
            </a>
            <a
              href="mailto:iradat@iradatkonsultan.com"
              class="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary break-all"
            >
              <Mail class="h-4 w-4" />
              iradat@iradatkonsultan.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Mail, Phone, X } from 'lucide-vue-next'
import { useHomepageStore } from '@/stores/homepage'
import { useViewportTracker } from './composables'
import {
  HeaderSection,
  HeroSection,
  // TrustIndicatorsSection,
  BentoGridSection,
  PartnerSection,
  // UseCaseCarouselSection,
  // TestimonialsSection,
  ArticlesPreviewSection,
  // PricingSection,
  // FAQSection,
  FooterSection,
} from './components/sections'

const homepageStore = useHomepageStore()
const isContactOpen = ref(false)

// Initialize viewport tracking
useViewportTracker()

onMounted(() => {
  // Initialize the homepage store and any global setup
  homepageStore.initializeAnimations()
})
</script>
