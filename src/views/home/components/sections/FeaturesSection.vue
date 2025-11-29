<template>
  <section
    id="features"
    class="py-16 bg-background"
    aria-labelledby="features-title"
    aria-describedby="features-description"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <header class="text-center mb-12">
        <div
          class="inline-flex items-center px-3 py-1 text-blue-600 text-sm font-medium mb-3"
          role="banner"
        >
          Our Features
        </div>
        <h2
          id="features-title"
          class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight"
        >
          We do it for the love of the Game.
          <br class="hidden sm:block">
          <span class="text-gray-600">(Managing Projects)</span>
        </h2>
        <p
          id="features-description"
          class="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Streamline your projects with our powerful features and gain insights with comprehensive project performance metrics.
        </p>
      </header>

      <!-- Minimal Features Grid -->
      <div
        class="minimal-features-grid"
        role="region"
        aria-label="Project management features showcase"
        :aria-describedby="'features-grid-description'"
      >
        <MinimalFeatureItem
          v-for="(feature, index) in features"
          :key="feature.id"
          :feature="feature"
          :aria-setsize="features.length"
          :aria-posinset="index + 1"
          @activate="handleFeatureActivate"
        />
      </div>

      <!-- Hidden description for screen readers -->
      <div
        id="features-grid-description"
        class="sr-only"
      >
        A grid of {{ features.length }} project management features, each with an icon, title, and description.
      </div>

      <!-- Bottom Description -->
      <div class="text-center mt-12">
        <p class="text-base text-gray-600 max-w-2xl mx-auto">
          MynaUI offers comprehensive project management solutions for businesses of all sizes.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import MinimalFeatureItem from '@/components/custom/minimal/MinimalFeatureItem.vue'
import featuresData from '@/data/featuresData.json'
import type { Feature } from '@/types/features'

const features = featuresData.features as Feature[]

const emit = defineEmits<{
  featureClick: [feature: Feature]
}>()

const handleFeatureActivate = (feature: Feature) => {
  emit('featureClick', feature)
  // You could add analytics tracking here
  console.log(`Feature activated: ${feature.title}`)
}
</script>

<style scoped>
/* Minimal Features Grid Layout - Compact and Clean */
.minimal-features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem 3rem;
  /* Remove fixed heights for natural content flow */
}

/* Tablet Layout - 2 columns */
@media (max-width: 1024px) {
  .minimal-features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem 2.5rem;
  }
}

/* Mobile Layout - 1 column */
@media (max-width: 768px) {
  .minimal-features-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}

/* Small mobile optimization */
@media (max-width: 480px) {
  .minimal-features-grid {
    gap: 1rem;
  }
}

/* Focus management for accessibility */
.minimal-features-grid:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .minimal-features-grid * {
    transition: none;
  }
}
</style>