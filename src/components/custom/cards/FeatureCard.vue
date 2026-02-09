<template>
  <div
    class="feature-card group"
    :class="[
      'bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300',
      'hover:shadow-lg hover:border-gray-300 hover:-translate-y-1',
      'h-full flex flex-col'
    ]"
    role="article"
    tabindex="0"
    :aria-label="`Feature ${props.ariaPosinset} of ${props.ariaSetsize}: ${feature.title}`"
    :aria-describedby="`feature-description-${feature.id}`"
    @keydown.enter="$emit('activate', feature)"
    @keydown.space.prevent="$emit('activate', feature)"
  >
    <!-- Feature Icon -->
    <div class="mb-4">
      <div
        class="inline-flex p-3 rounded-lg transition-colors duration-300"
        :class="getIconClasses(feature.iconColor)"
      >
        <component
          :is="iconComponent"
          class="w-6 h-6"
        />
      </div>
    </div>

    <!-- Feature Content -->
    <div class="flex-grow">
      <h3
        class="font-bold text-gray-900 text-lg mb-3 leading-tight"
      >
        {{ feature.title }}
      </h3>
      <p
        :id="`feature-description-${feature.id}`"
        class="text-gray-600 text-base leading-relaxed"
      >
        {{ feature.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Circle } from 'lucide-vue-next'
import * as LucideIcons from 'lucide-vue-next'
import type { Feature, FeatureCardProps, FeatureIconColorClasses } from '@/types/features'

// Type for Lucide icon components
type LucideIconComponent = Component
type LucideIconsMap = Record<string, LucideIconComponent>

const props = defineProps<FeatureCardProps>()

// Define emits for component events
defineEmits<{
  activate: [feature: Feature]
}>()

// Get the icon component dynamically with type safety
const iconComponent = computed<LucideIconComponent>(() => {
  try {
    // Transform kebab-case to PascalCase (e.g., 'arrow-right' -> 'ArrowRight')
    const iconName = props.feature.icon
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    // Type-safe access to Lucide icons
    const iconsMap = LucideIcons as unknown as LucideIconsMap
    const iconComponent = iconsMap[iconName]

    // Return the found icon or fallback to Circle with type safety
    return iconComponent && typeof iconComponent === 'object' ? iconComponent : Circle
  } catch (error) {
    console.warn(`Failed to load icon "${props.feature.icon}":`, error)
    return Circle
  }
})

// Get icon background and text color classes based on color
const getIconClasses = (color: Feature['iconColor']): string => {
  const colorClasses: FeatureIconColorClasses = {
    red: 'bg-red-50 text-red-500',
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    yellow: 'bg-yellow-50 text-yellow-500',
    purple: 'bg-purple-50 text-purple-500',
    orange: 'bg-orange-50 text-orange-500',
    pink: 'bg-pink-50 text-pink-500',
    gray: 'bg-gray-50 text-gray-500',
    indigo: 'bg-indigo-50 text-indigo-500',
    teal: 'bg-teal-50 text-teal-500'
  }

  return colorClasses[color] || colorClasses.gray
}
</script>

<style scoped>
.feature-card {
  /* Ensure smooth transitions */
  will-change: transform, box-shadow;
}

/* Disable animations on mobile for better performance */
@media (max-width: 768px) {
  .feature-card:hover {
    transform: none;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .feature-card {
    transition: none;
  }

  .feature-card * {
    transition: none;
  }
}

/* Focus styles for accessibility */
.feature-card:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>