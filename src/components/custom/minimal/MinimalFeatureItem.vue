<template>
  <div
    class="minimal-feature-item group"
    role="article"
    tabindex="0"
    :aria-label="`Feature ${props.ariaPosinset} of ${props.ariaSetsize}: ${feature.title}`"
    :aria-describedby="`feature-description-${feature.id}`"
    @keydown.enter="$emit('activate', feature)"
    @keydown.space.prevent="$emit('activate', feature)"
  >
    <!-- Icon -->
    <div class="feature-icon">
      <component
        :is="iconComponent"
        :class="getIconClasses(feature.iconColor)"
      />
    </div>

    <!-- Content -->
    <div class="feature-content">
      <h3 class="feature-title">
        {{ feature.title }}
      </h3>
      <p
        :id="`feature-description-${feature.id}`"
        class="feature-description"
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

// Get icon color classes - minimal approach with just icon colors
const getIconClasses = (color: Feature['iconColor']): string => {
  const colorClasses: FeatureIconColorClasses = {
    red: 'text-red-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-amber-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    pink: 'text-pink-500',
    gray: 'text-gray-400',
    indigo: 'text-indigo-500',
    teal: 'text-teal-500'
  }

  return colorClasses[color] || colorClasses.gray
}
</script>

<style scoped>
.minimal-feature-item {
  /* Clean, minimal container */
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0;
  transition: opacity 0.15s ease;

  /* Subtle hover effect without heavy styling */
  &:hover {
    opacity: 0.8;
  }

  /* Focus for accessibility */
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 4px;
  }
}

.feature-icon {
  /* Icon positioning and sizing */
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
  }
}

.feature-content {
  /* Content container */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-title {
  /* Typography for title */
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  margin: 0;
}

.feature-description {
  /* Typography for description */
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .feature-title {
    color: #f9fafb;
  }

  .feature-description {
    color: #9ca3af;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .minimal-feature-item {
    padding: 0.875rem 0;
    gap: 0.5rem;
  }

  .feature-icon svg {
    width: 1.375rem;
    height: 1.375rem;
  }

  .feature-title {
    font-size: 1rem;
  }

  .feature-description {
    font-size: 0.8125rem;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .minimal-feature-item {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .feature-title {
    color: #000;
    font-weight: 700;
  }

  .feature-description {
    color: #333;
  }

  @media (prefers-color-scheme: dark) {
    .feature-title {
      color: #fff;
    }

    .feature-description {
      color: #ccc;
    }
  }
}
</style>