<template>
  <div
    ref="cardElement"
    class="service-card group relative overflow-hidden"
    :class="[
      'bg-card border border-border rounded-lg transition-all duration-300',
      'hover:shadow-lg hover:border-primary/20 hover:-translate-y-1',
      'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20',
      'h-full flex flex-col',
      `animate-${service.animationConfig.animationType}`,
    ]"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    tabindex="0"
    :aria-label="`${service.title} - ${currentVariation.description}`"
    :style="{ '--animation-duration': `${service.animationConfig.interval}ms` }"
  >
    <!-- Background Image with Overlay -->
    <div
      class="absolute inset-0 transition-all duration-700 ease-in-out"
      :class="{
        'opacity-20': !isAnimating,
        'opacity-30': isAnimating,
      }"
      :style="backgroundStyle"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
    </div>

    <!-- Content Container -->
    <div class="relative z-10 p-6 flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div
            class="p-2 rounded-lg transition-all duration-300 bg-primary/10 text-primary group-hover:bg-primary/20 backdrop-blur-sm"
          >
            <component :is="iconComponent" class="w-6 h-6" />
          </div>
          <div>
            <h3 class="font-semibold text-foreground transition-colors duration-300 text-lg">
              {{ service.title }}
            </h3>
            <p
              class="text-sm font-medium transition-all duration-500 text-primary group-hover:text-primary/80"
              :key="currentVariation.id"
            >
              {{ currentVariation.subtitle }}
            </p>
          </div>
        </div>

        <!-- Category badge -->
        <div
          class="px-2 py-1 bg-muted/70 text-muted-foreground text-xs font-medium rounded-full backdrop-blur-sm"
        >
          {{ service.category }}
        </div>
      </div>

      <!-- Description with Animation -->
      <div class="relative mb-6 flex-grow">
        <p
          class="text-muted-foreground text-base leading-relaxed transition-all duration-500 group-hover:text-foreground"
          :key="currentVariation.id"
          :class="descriptionAnimationClass"
        >
          {{ currentVariation.description }}
        </p>
      </div>

      <!-- Key Benefits with Stagger Animation -->
      <div class="space-y-2 mb-4">
        <div
          v-for="(benefit, index) in currentVariation.keyBenefits"
          :key="`${currentVariation.id}-${benefit}`"
          class="flex items-center space-x-2 text-sm transition-all duration-300"
          :style="{ transitionDelay: `${index * 100}ms` }"
          :class="benefitAnimationClass"
        >
          <div
            class="w-1.5 h-1.5 rounded-full transition-colors duration-300 bg-primary group-hover:bg-primary/80"
          />
          <span
            class="text-muted-foreground transition-colors duration-300 group-hover:text-foreground font-medium"
          >
            {{ benefit }}
          </span>
        </div>
      </div>

      <!-- Statistics Display -->
      <div
        v-if="Object.keys(currentVariation.stats).length > 0"
        class="mb-4 p-3 bg-muted/30 rounded-lg backdrop-blur-sm"
        :key="currentVariation.id"
      >
        <div class="flex justify-between items-center text-xs">
          <div v-for="(value, key) in limitedStats" :key="key" class="text-center">
            <div class="font-semibold text-foreground">{{ value }}</div>
            <div class="text-muted-foreground capitalize">{{ formatStatKey(key) }}</div>
          </div>
        </div>
      </div>

      <!-- Learn More indicator -->
      <div
        class="mt-auto pt-4 border-t border-border/50 flex items-center justify-between transition-all duration-300 group-hover:border-border backdrop-blur-sm"
      >
        <span
          class="text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-primary"
        >
          Learn more
        </span>
        <div class="flex items-center space-x-2">
          <ArrowRight
            class="w-4 h-4 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, type Component } from 'vue'
import { ArrowRight, Circle } from 'lucide-vue-next'
import * as LucideIcons from 'lucide-vue-next'
import {
  useBentoAnimationWithIntersection,
  shouldReduceMotion,
} from '@/views/home/components/sections/bento/composables/useBentoAnimation'

// Type for Lucide icon components
type LucideIconComponent = Component
type LucideIconsMap = Record<string, LucideIconComponent>

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

interface Props {
  service: Service
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  featured: false,
})

const emit = defineEmits<{
  click: [service: Service]
}>()

// Animation setup
const cardElement = ref<HTMLElement | null>(null)
const { isAnimating, activeSource, observeElement, pauseAnimation, resumeAnimation } =
  useBentoAnimationWithIntersection(`service-${props.service.id}`)

// Get the icon component dynamically with type safety
const iconComponent = computed<LucideIconComponent>(() => {
  try {
    // Transform kebab-case to PascalCase (e.g., 'arrow-right' -> 'ArrowRight')
    const iconName = props.service.icon
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    // Type-safe access to Lucide icons
    const iconsMap = LucideIcons as unknown as LucideIconsMap
    const iconComponent = iconsMap[iconName]

    // Return the found icon or fallback to Circle with type safety
    return iconComponent && typeof iconComponent === 'object' ? iconComponent : Circle
  } catch (error) {
    console.warn(`Failed to load icon "${props.service.icon}":`, error)
    return Circle
  }
})

// Animation reactive properties
const activeIndex = computed(() => activeSource.value)
const currentVariation = computed(
  () => props.service.variations[activeIndex.value] || props.service.variations[0],
)

// Background image styling
const backgroundStyle = computed(() => {
  const variation = currentVariation.value
  return {
    backgroundImage: `url(${variation.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
})

// Animation classes based on animation type
const descriptionAnimationClass = computed(() => {
  if (shouldReduceMotion()) return ''

  switch (props.service.animationConfig.animationType) {
    case 'fade':
      return 'animate-fadeIn'
    case 'slideUp':
      return 'animate-slideInUp'
    case 'scaleRotate':
      return 'animate-scaleIn'
    default:
      return ''
  }
})

const benefitAnimationClass = computed(() => {
  if (shouldReduceMotion()) return ''

  switch (props.service.animationConfig.animationType) {
    case 'fade':
      return 'animate-fadeInStagger'
    case 'slideUp':
      return 'animate-slideInUpStagger'
    case 'scaleRotate':
      return 'animate-bounceInStagger'
    default:
      return ''
  }
})

// Limit stats display to 3 items max
const limitedStats = computed(() => {
  const stats = currentVariation.value.stats
  const entries = Object.entries(stats).filter(([, value]) => value !== undefined)
  return Object.fromEntries(entries.slice(0, 3))
})

// Format stat keys for display
const formatStatKey = (key: string | number): string => {
  const keyStr = String(key)
  return keyStr.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}

// Initialize animation when component mounts
onMounted(() => {
  if (cardElement.value && !shouldReduceMotion()) {
    const variationIds = props.service.variations.map((v) => v.id)
    observeElement(cardElement.value, variationIds, props.service.animationConfig.interval)
  }
})

const handleClick = () => {
  emit('click', props.service)
}

const handleMouseEnter = () => {
  pauseAnimation()
}

const handleMouseLeave = () => {
  if (cardElement.value && !shouldReduceMotion()) {
    const variationIds = props.service.variations.map((v) => v.id)
    resumeAnimation(variationIds, props.service.animationConfig.interval)
  }
}
</script>

<style scoped>
.service-card {
  /* Ensure smooth transitions */
  will-change: transform, box-shadow;
}

/* Animation Types */
.animate-fade {
  animation-duration: var(--animation-duration, 800ms);
}

.animate-slideUp {
  animation-duration: var(--animation-duration, 700ms);
}

.animate-scaleRotate {
  animation-duration: var(--animation-duration, 900ms);
}

/* Keyframe Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9) rotate(-1deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes bounceInStagger {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  60% {
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animation Classes */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slideInUp {
  animation: slideInUp 0.5s ease-out forwards;
}

.animate-scaleIn {
  animation: scaleIn 0.6s ease-out forwards;
}

.animate-fadeInStagger {
  animation: fadeIn 0.4s ease-out forwards;
}

.animate-slideInUpStagger {
  animation: slideInUp 0.4s ease-out forwards;
}

.animate-bounceInStagger {
  animation: bounceInStagger 0.5s ease-out forwards;
}

/* Background Image Animation */
.service-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  transition: opacity 0.7s ease-in-out;
  z-index: 1;
}

/* Enhanced Hover Effects */
.service-card:hover .backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  .service-card:hover {
    transform: none;
  }

  .service-card .animate-fadeIn,
  .service-card .animate-slideInUp,
  .service-card .animate-scaleIn {
    animation: none;
  }
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .service-card {
    transition: none;
  }

  .service-card *,
  .animate-fadeIn,
  .animate-slideInUp,
  .animate-scaleIn,
  .animate-fadeInStagger,
  .animate-slideInUpStagger,
  .animate-bounceInStagger {
    animation: none !important;
    transition: none !important;
  }

  .service-card::before {
    transition: none;
  }
}

/* Performance Optimizations */
.service-card:not(:hover):not(:focus) {
  will-change: auto;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .service-card {
    border-width: 2px;
  }

  .bg-muted\/30,
  .bg-muted\/70 {
    background-color: rgba(255, 255, 255, 0.9);
    color: #000;
  }
}
</style>
