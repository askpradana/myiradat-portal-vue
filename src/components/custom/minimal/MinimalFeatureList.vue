<template>
  <div
    class="minimal-feature-list"
    role="region"
    aria-label="Project management features showcase"
    :aria-describedby="'features-list-description'"
  >
    <div
      v-for="(feature, index) in features"
      :key="feature.id"
      class="minimal-feature-row group"
      role="article"
      tabindex="0"
      :aria-label="`Feature ${index + 1} of ${features.length}: ${feature.title}`"
      :aria-describedby="`feature-description-${feature.id}`"
      @keydown.enter="$emit('featureClick', feature)"
      @keydown.space.prevent="$emit('featureClick', feature)"
    >
      <!-- Icon -->
      <div class="feature-icon">
        <component
          :is="getIconComponent(feature.icon)"
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

    <!-- Hidden description for screen readers -->
    <div
      id="features-list-description"
      class="sr-only"
    >
      A list of {{ features.length }} project management features, each with an icon, title, and description.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Circle } from 'lucide-vue-next'
import * as LucideIcons from 'lucide-vue-next'
import type { Feature, FeatureIconColorClasses } from '@/types/features'

// Type for Lucide icon components
type LucideIconComponent = Component
type LucideIconsMap = Record<string, LucideIconComponent>

defineProps<{
  features: Feature[]
}>()

// Define emits for component events
defineEmits<{
  featureClick: [feature: Feature]
}>()

// Get the icon component dynamically with type safety
const getIconComponent = (iconName: string): LucideIconComponent => {
  try {
    // Transform kebab-case to PascalCase (e.g., 'arrow-right' -> 'ArrowRight')
    const transformedName = iconName
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    // Type-safe access to Lucide icons
    const iconsMap = LucideIcons as unknown as LucideIconsMap
    const iconComponent = iconsMap[transformedName]

    // Return the found icon or fallback to Circle with type safety
    return iconComponent && typeof iconComponent === 'object' ? iconComponent : Circle
  } catch (error) {
    console.warn(`Failed to load icon "${iconName}":`, error)
    return Circle
  }
}

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
.minimal-feature-list {
  /* Container for the list */
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.minimal-feature-row {
  /* Individual feature row */
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  transition: opacity 0.15s ease;
  border-bottom: 1px solid #f3f4f6;

  /* Last item doesn't need border */
  &:last-child {
    border-bottom: none;
  }

  /* Subtle hover effect */
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
  /* Icon positioning */
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-top: 0.125rem; /* Align with first line of text */

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.feature-content {
  /* Content container */
  flex: 1;
  min-width: 0; /* Prevent overflow issues */
}

.feature-title {
  /* Typography for title */
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  margin: 0 0 0.375rem 0;
}

.feature-description {
  /* Typography for description */
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* Tablet layout adjustments */
@media (max-width: 1024px) {
  .minimal-feature-list {
    gap: 1.5rem;
  }

  .minimal-feature-row {
    padding: 0.875rem 0;
  }
}

/* Mobile layout adjustments */
@media (max-width: 768px) {
  .minimal-feature-list {
    gap: 1.25rem;
  }

  .minimal-feature-row {
    gap: 0.875rem;
    padding: 0.75rem 0;
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

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .minimal-feature-row {
    border-bottom-color: #374151;
  }

  .feature-title {
    color: #f9fafb;
  }

  .feature-description {
    color: #9ca3af;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .minimal-feature-row {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .minimal-feature-row {
    border-bottom-color: #000;
  }

  .feature-title {
    color: #000;
    font-weight: 700;
  }

  .feature-description {
    color: #333;
  }

  @media (prefers-color-scheme: dark) {
    .minimal-feature-row {
      border-bottom-color: #fff;
    }

    .feature-title {
      color: #fff;
    }

    .feature-description {
      color: #ccc;
    }
  }
}
</style>