<template>
  <div class="relative rounded-lg bg-card/50 border border-border p-4 backdrop-blur-sm">
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div
        v-for="(source, index) in dataSources"
        :key="source"
        class="flex items-center space-x-2 text-sm p-2 rounded bg-background/80 transition-all duration-300"
        :class="{ 'bg-primary/10 scale-105': isAnimating && index === activeSource }"
      >
        <div
          class="w-2 h-2 rounded-full transition-colors duration-300"
          :class="
            isAnimating && index === activeSource
              ? 'bg-primary animate-pulse'
              : 'bg-green-500'
          "
        ></div>
        <span class="text-muted-foreground font-medium">{{ source }}</span>
      </div>
    </div>
    <div class="text-center text-muted-foreground text-sm">
      <span :class="{ 'text-primary animate-pulse': isAnimating }">
        {{ isAnimating ? 'Syncing data...' : 'All systems synchronized' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BentoCard } from '@/types/homepage'
import { useBentoAnimation } from '@/views/home/components/sections/bento/composables/useBentoAnimation'

interface Props {
  card: BentoCard
}

const props = defineProps<Props>()

const dataSources = computed(() => 
  props.card.content.animation?.data || ['CRM', 'ERP', 'Database', 'Analytics', 'API', 'Files']
)

const animationConfig = computed(() => props.card.content.animation)

const { isAnimating, activeSource, startAnimation } = useBentoAnimation()

// Start animation when component mounts
if (animationConfig.value?.type === 'data-sync') {
  startAnimation(
    dataSources.value,
    animationConfig.value.interval || 2000
  )
}

// Cleanup on unmount will be handled by the composable
</script>