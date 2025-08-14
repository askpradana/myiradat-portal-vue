<template>
  <section 
    id="features" 
    class="py-20 bg-background"
    aria-labelledby="features-title"
    aria-describedby="features-description"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <header class="text-center mb-16">
        <div
          class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          role="banner"
        >
          {{ config.subtitle }}
        </div>
        <h2 id="features-title" class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {{ config.title }}
        </h2>
        <p id="features-description" class="text-lg text-muted-foreground max-w-2xl mx-auto">
          {{ config.description }}
        </p>
      </header>

      <!-- ARIA Live Region for Screen Readers -->
      <div aria-live="polite" :aria-atomic="true" class="sr-only">
        Dynamic content changes will be announced here
      </div>

      <!-- Bento Grid -->
      <div 
        class="bento-grid"
        :style="{ ...gridStyles, ...gridCSSProperties }"
        v-bind="gridAccessibilityAttrs"
      >
        <BentoCard
          v-for="(card, index) in config.cards"
          :key="card.id"
          :card="card"
          v-bind="getCardAccessibilityAttrs(card, index)"
          @click="handleCardClick"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BentoCard as BentoCardType, BentoGridConfig } from '@/types/homepage'
import BentoCard from './bento/BentoCard.vue'
import { useBentoGrid } from './bento/composables/useBentoGrid'
import bentoGridConfig from './bento/config/bentoGridData'

interface Props {
  config?: BentoGridConfig
}

const props = withDefaults(defineProps<Props>(), {
  config: () => bentoGridConfig
})

const emit = defineEmits<{
  cardClick: [card: BentoCardType]
}>()

// Use the bento grid composable for layout management
const {
  gridStyles,
  gridCSSProperties,
  getGridAccessibilityAttrs,
  getCardAccessibilityAttrs
} = useBentoGrid(
  props.config.layout,
  props.config.cards
)

const gridAccessibilityAttrs = computed(() => getGridAccessibilityAttrs())

const handleCardClick = (card: BentoCardType) => {
  if (card.interactive) {
    emit('cardClick', card)
    
    // Optional: Handle specific card actions based on card type
    switch (card.type) {
      case 'hero':
        // Could trigger detailed demo modal
        break
      case 'placeholder':
        // Could show coming soon modal or redirect to signup
        break
      default:
        // Default action or analytics tracking
        break
    }
  }
}
</script>

<style scoped>
/* CSS Custom Properties for theming and responsiveness */
.bento-grid {
  --bento-grid-gap: 1.5rem;
  --bento-card-min-height: 250px;
  --bento-hero-min-height: 400px;
  
  display: grid;
  gap: var(--bento-grid-gap);
  
  /* Default styles will be overridden by computed styles from composable */
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, minmax(var(--bento-card-min-height), auto));
}

/* Performance optimizations for all cards */
.bento-grid :deep(.group) {
  will-change: transform, box-shadow;
  transform: translateZ(0); /* Force hardware acceleration */
}

.bento-grid :deep(.group:not(:hover):not(:focus)) {
  will-change: auto; /* Clean up when not needed */
}

/* Responsive adjustments for gap and card heights */
@media (max-width: 1024px) {
  .bento-grid {
    --bento-grid-gap: 1.25rem;
    --bento-card-min-height: 220px;
    --bento-hero-min-height: 350px;
  }
}

@media (max-width: 768px) {
  .bento-grid {
    --bento-grid-gap: 1rem;
    --bento-card-min-height: 200px;
    --bento-hero-min-height: 300px;
  }

  /* Disable hover scale on mobile for better touch experience */
  .bento-grid :deep(.group:hover) {
    transform: none;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .bento-grid :deep(.group) {
    transition: none;
  }

  .bento-grid :deep(.group-hover\:scale-110:hover) {
    transform: none;
  }

  .bento-grid :deep(.animate-pulse) {
    animation: none;
  }
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus management for accessibility */
.bento-grid:focus-within {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Smooth transitions for theme changes */
.bento-grid * {
  transition-property: color, background-color, border-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .bento-grid * {
    transition: none;
  }
}
</style>
