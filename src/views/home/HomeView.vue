<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderHomeComponents />

    <!-- Hero Banner Section -->
    <BannerHomeComponents />

    <!-- Trusted By Section -->
    <TrustedByHomeComponents />

    <!-- Showcase Carousel Section -->
    <CarouselHomeComponents />

    <!-- Features Bento Grid Section -->
    <BentoHomeComponents />

    <!-- Testimonials Section -->
    <TestimonialSectionComponents />

    <!-- Pricing Section -->
    <PricingSectionComponents />

    <!-- FAQ Section -->
    <FAQHomeComponents />

    <!-- Footer -->
    <FooterHomeComponents />
  </div>
</template>

<script setup lang="ts">
import PricingSectionComponents from './components/PricingSectionComponents.vue'
import FooterHomeComponents from './components/FooterHomeComponents.vue'
import FAQHomeComponents from './components/FAQHomeComponents.vue'
import TestimonialSectionComponents from './components/TestimonialSectionComponents.vue'
import BentoHomeComponents from './components/BentoHomeComponents.vue'
import CarouselHomeComponents from './components/CarouselHomeComponents.vue'
import TrustedByHomeComponents from './components/TrustedByHomeComponents.vue'
import BannerHomeComponents from './components/BannerHomeComponents.vue'
import HeaderHomeComponents from './components/HeaderHomeComponents.vue'
</script>
