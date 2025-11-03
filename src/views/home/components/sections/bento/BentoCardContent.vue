<template>
  <div class="flex flex-col h-full">
    <!-- Card Header -->
    <div class="mb-6">
      <div
        :class="iconClasses"
        class="mb-4 group-hover:scale-110 transition-transform duration-300"
      >
        <div :class="iconColorClasses" class="w-6 h-6">
          <component :is="iconComponent" />
        </div>
      </div>
      <h3 :class="titleClasses" class="font-bold text-foreground mb-3">
        {{ card.title }}
      </h3>
      <p 
        :id="`${card.id}-description`" 
        class="text-muted-foreground leading-relaxed"
        :class="descriptionClasses"
      >
        {{ card.description }}
      </p>
    </div>

    <!-- Dynamic Content Based on Card Type -->
    <component 
      :is="contentComponent" 
      :card="card" 
      class="flex-1"
    />

    <!-- Coming Soon Badge for Placeholder Cards -->
    <div v-if="card.status === 'coming-soon'" class="mt-4">
      <div class="inline-flex items-center px-3 py-1 rounded-full bg-muted/80 text-muted-foreground text-sm font-medium">
        <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse mr-2"></div>
        {{ card.content.comingSoon?.eta || 'Coming Soon' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BentoCard } from '@/types/homepage'
import HeroCardContent from './content/HeroCardContent.vue'
import FeatureCardContent from './content/FeatureCardContent.vue'
import IntegrationCardContent from './content/IntegrationCardContent.vue'
import PlaceholderCardContent from './content/PlaceholderCardContent.vue'

// Import icons (you may need to adjust these based on your icon library)
import {
  Database,
  Zap,
  ShieldCheck,
  Plug,
  Activity,
  Route,
  Brain,
  Workflow,
  Heart,
  GraduationCap,
  ClipboardCheck,
  Building,
  Smartphone,
  User
} from 'lucide-vue-next'

interface Props {
  card: BentoCard
}

const props = defineProps<Props>()

const contentComponent = computed(() => {
  switch (props.card.type) {
    case 'hero':
      return HeroCardContent
    case 'integration':
      return IntegrationCardContent
    case 'placeholder':
      return PlaceholderCardContent
    case 'feature':
    case 'metric':
    default:
      return FeatureCardContent
  }
})

const iconComponent = computed(() => {
  const iconMap: Record<string, unknown> = {
    'database': Database,
    'zap': Zap,
    'shield-check': ShieldCheck,
    'plug': Plug,
    'activity': Activity,
    'route': Route,
    'brain': Brain,
    'workflow': Workflow,
    'heart': Heart,
    'graduation-cap': GraduationCap,
    'clipboard-check': ClipboardCheck,
    'building': Building,
    'smartphone': Smartphone,
    'user': User
  }
  return iconMap[props.card.icon] || Database
})

const iconClasses = computed(() => {
  const baseClasses = 'w-12 h-12 rounded-xl flex items-center justify-center'

  if (props.card.type === 'hero') {
    return `${baseClasses} bg-primary/10`
  }

  // Use service-specific theme accent for icon background
  if (props.card.theme.accent) {
    return `${baseClasses} ${props.card.theme.accent}`
  }

  // Fallback to subtle neutral background
  return `${baseClasses} bg-muted/50`
})

const iconColorClasses = computed(() => {
  if (props.card.type === 'hero') {
    return 'text-primary'
  }

  // Use consistent neutral colors for all service cards
  return 'text-muted-foreground'
})

const titleClasses = computed(() => {
  if (props.card.type === 'hero') {
    return 'text-2xl'
  }
  return 'text-xl font-semibold'
})

const descriptionClasses = computed(() => {
  if (props.card.type === 'hero') {
    return 'text-lg'
  }
  return 'text-sm'
})
</script>