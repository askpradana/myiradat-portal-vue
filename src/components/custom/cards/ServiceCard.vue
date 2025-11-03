<template>
  <div
    class="service-card group"
    :class="[
      'bg-card border border-border rounded-lg p-6 transition-all duration-300',
      'hover:shadow-lg hover:border-primary/20 hover:-translate-y-1',
      'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20',
      'h-full flex flex-col'
    ]"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
    tabindex="0"
    :aria-label="`${service.title} - ${service.description}`"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div
          class="p-2 rounded-lg transition-colors duration-300 bg-primary/10 text-primary group-hover:bg-primary/20"
        >
          <component
            :is="iconComponent"
            class="w-6 h-6"
          />
        </div>
        <div>
          <h3
            class="font-semibold text-foreground transition-colors duration-300 text-lg"
          >
            {{ service.title }}
          </h3>
          <p
            class="text-sm font-medium transition-colors duration-300 text-primary group-hover:text-primary/80"
          >
            {{ service.subtitle }}
          </p>
        </div>
      </div>

      <!-- Category badge -->
      <div
        class="px-2 py-1 bg-muted/50 text-muted-foreground text-xs font-medium rounded-full"
      >
        {{ service.category }}
      </div>
    </div>

    <!-- Description -->
    <p
      class="text-muted-foreground text-base mb-6 leading-relaxed transition-colors duration-300 group-hover:text-foreground flex-grow"
    >
      {{ service.description }}
    </p>

    <!-- Key Benefits -->
    <div class="space-y-2 mb-4">
      <div
        v-for="benefit in service.keyBenefits"
        :key="benefit"
        class="flex items-center space-x-2 text-sm"
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

    <!-- Learn More indicator -->
    <div
      class="mt-auto pt-4 border-t border-border/50 flex items-center justify-between transition-all duration-300 group-hover:border-border"
    >
      <span
        class="text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-primary"
      >
        Learn more
      </span>
      <ArrowRight
        class="w-4 h-4 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { ArrowRight, Circle } from 'lucide-vue-next'
import * as LucideIcons from 'lucide-vue-next'

// Type for Lucide icon components
type LucideIconComponent = Component
type LucideIconsMap = Record<string, LucideIconComponent>

interface Service {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  featured: boolean
  category: string
  keyBenefits: string[]
}

interface Props {
  service: Service
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  featured: false
})

const emit = defineEmits<{
  click: [service: Service]
}>()

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

const handleClick = () => {
  emit('click', props.service)
}
</script>

<style scoped>
.service-card {
  /* Ensure smooth transitions */
  will-change: transform, box-shadow;
}

/* Disable animations on mobile for better performance */
@media (max-width: 768px) {
  .service-card:hover {
    transform: none;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .service-card {
    transition: none;
  }

  .service-card * {
    transition: none;
  }
}
</style>