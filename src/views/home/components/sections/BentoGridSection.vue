<template>
  <section
    id="services"
    class="py-20 bg-background"
    aria-labelledby="services-title"
    aria-describedby="services-description"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <header class="text-center mb-16">
        <div
          class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          role="banner"
        >
          COMPREHENSIVE SOLUTIONS
        </div>
        <h2 id="services-title" class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          What we offer
        </h2>
        <p id="services-description" class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our range of professional services designed to elevate your organization and
          empower your people.
        </p>
      </header>

      <!-- Services Grid -->
      <div
        ref="gridElement"
        class="services-grid"
        role="region"
        aria-label="Our services showcase"
        :class="{
          'services-grid--animating': isAnyCardAnimating,
        }"
      >
        <ServiceCard
          v-for="(service, index) in services"
          :key="service.id"
          :service="service"
          :featured="service.featured"
          :data-service-id="service.id"
          :class="{
            'service-card--stagger': true,
            'service-card--featured': service.featured,
          }"
          :style="{
            '--stagger-delay': `${index * 200}ms`,
            '--grid-index': index,
          }"
          @click="handleServiceClick"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ServiceCard from '@/components/custom/cards/ServiceCard.vue'
import servicesData from '@/data/simpleServicesData.json'
import { shouldReduceMotion } from '@/views/home/components/sections/bento/composables/useBentoAnimation'

interface ServiceVariation {
  id: string
  subtitle: string
  description: string
  image: string
  keyBenefits: string[]
  stats: Record<string, string | undefined>
}

interface AnimationConfig {
  interval: number
  animationType: 'fade' | 'slideUp' | 'scaleRotate'
}

interface Service {
  id: string
  title: string
  category: string
  featured: boolean
  icon: string
  animationConfig: AnimationConfig
  variations: ServiceVariation[]
}

const emit = defineEmits<{
  serviceClick: [service: Service]
}>()

const router = useRouter()
const services = servicesData.services as unknown as Service[]

// Animation state management
const isAnyCardAnimating = ref(false)
const animatingCards = ref(new Set<string>())

// Global animation coordination
const checkAnimationState = () => {
  // Check if any cards are currently animating
  isAnyCardAnimating.value = animatingCards.value.size > 0
}

// Performance optimization - intersection observer for viewport detection
const gridElement = ref<HTMLElement | null>(null)
const isInViewport = ref(false)

const observeGridInViewport = () => {
  if (typeof window === 'undefined' || !gridElement.value) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isInViewport.value = entry.isIntersecting

        // Pause animations when out of viewport for performance
        if (!entry.isIntersecting) {
          animatingCards.value.clear()
          checkAnimationState()
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '50px',
    },
  )

  observer.observe(gridElement.value)

  return () => {
    observer.disconnect()
  }
}

// Enhanced service click handler with animation awareness
const handleServiceClick = (service: Service) => {
  emit('serviceClick', service)

  // Add subtle click animation feedback if not reduced motion
  if (!shouldReduceMotion()) {
    const cardElement = document.querySelector(`[data-service-id="${service.id}"]`)
    if (cardElement) {
      cardElement.classList.add('clicked')
      setTimeout(() => {
        cardElement.classList.remove('clicked')
      }, 300)
    }
  }

  // Navigate to service page with a small delay for visual feedback
  setTimeout(
    () => {
      router.push(`/services/${service.id}`)
    },
    shouldReduceMotion() ? 0 : 150,
  )
}

// Lifecycle management
onMounted(() => {
  const cleanup = observeGridInViewport()

  onUnmounted(() => {
    if (cleanup) cleanup()
  })
})
</script>

<style scoped>
/* Enhanced CSS Grid Layout with Animation Support */
.services-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(320px, auto);
  position: relative;
  overflow: hidden;
}

/* Grid Animation States */
.services-grid--animating {
  perspective: 1000px;
}

.services-grid--animating .service-card--stagger {
  animation: slideInFromBottom 0.8s ease-out forwards;
  animation-delay: var(--stagger-delay, 0ms);
  opacity: 0;
  transform: translateY(30px) rotateX(10deg);
}

/* Featured card special animation */
.service-card--featured {
  z-index: 2;
}

.services-grid--animating .service-card--featured {
  animation: slideInFromBottomFeatured 1s ease-out forwards;
  transform: translateY(40px) rotateX(15deg) scale(0.95);
}

/* Click Animation Feedback */
[data-service-id].clicked {
  animation: clickPulse 0.3s ease-out;
}

/* Grid Hover Effects */
.services-grid:hover .service-card--stagger:not(:hover) {
  opacity: 0.7;
  transform: scale(0.98);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

/* Responsive Layouts */
/* Tablet Layout - 2 columns */
@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    grid-auto-rows: minmax(300px, auto);
  }

  .services-grid--animating .service-card--stagger {
    animation-delay: calc(var(--stagger-delay, 0ms) * 0.7);
  }
}

/* Mobile Layout - 1 column */
@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    grid-auto-rows: minmax(280px, auto);
  }

  .services-grid--animating .service-card--stagger {
    animation-delay: calc(var(--stagger-delay, 0ms) * 0.5);
  }

  .services-grid:hover .service-card--stagger:not(:hover) {
    opacity: 1;
    transform: none;
  }
}

/* Keyframe Animations */
@keyframes slideInFromBottom {
  0% {
    opacity: 0;
    transform: translateY(30px) rotateX(10deg);
  }
  60% {
    opacity: 0.8;
    transform: translateY(-5px) rotateX(-2deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

@keyframes slideInFromBottomFeatured {
  0% {
    opacity: 0;
    transform: translateY(40px) rotateX(15deg) scale(0.95);
  }
  60% {
    opacity: 0.9;
    transform: translateY(-8px) rotateX(-3deg) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0) scale(1);
  }
}

@keyframes clickPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

/* Focus management for accessibility */
.services-grid:focus-within {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: 0.5rem;
}

/* Smooth transitions for theme changes */
.services-grid * {
  transition-property: color, background-color, border-color, opacity, transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}

/* Performance Optimizations */
.services-grid {
  will-change: auto;
  contain: layout;
}

.services-grid--animating {
  will-change: transform;
}

.service-card--stagger {
  will-change: transform, opacity;
}

.service-card--stagger:not(.clicked) {
  will-change: auto;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .services-grid * {
    transition: none !important;
    animation: none !important;
  }

  .services-grid--animating .service-card--stagger,
  .services-grid--animating .service-card--featured {
    animation: none;
    opacity: 1;
    transform: none;
  }

  [data-service-id].clicked {
    animation: none;
  }

  .services-grid:hover .service-card--stagger:not(:hover) {
    opacity: 1;
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .services-grid:focus-within {
    outline-width: 3px;
    outline-color: currentColor;
  }

  .service-card--featured {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
}

/* Print styles */
@media print {
  .services-grid {
    display: block;
    page-break-inside: avoid;
  }

  .services-grid * {
    transition: none;
    animation: none;
  }
}
</style>
