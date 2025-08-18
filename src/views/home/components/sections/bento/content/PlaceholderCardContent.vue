<template>
  <div class="flex flex-col items-center justify-center text-center space-y-4 opacity-60">
    <div class="w-16 h-16 bg-muted/30 rounded-xl flex items-center justify-center">
      <div class="w-8 h-8 text-muted-foreground/50">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 6v12" />
          <path d="M6 12h12" />
        </svg>
      </div>
    </div>
    
    <div v-if="card.content.comingSoon" class="space-y-2">
      <h4 class="text-sm font-medium text-muted-foreground">
        {{ card.content.comingSoon.title }}
      </h4>
      <p class="text-xs text-muted-foreground/70 leading-relaxed">
        {{ card.content.comingSoon.description }}
      </p>
    </div>
    
    <div class="mt-auto pt-4">
      <div class="inline-flex items-center px-2 py-1 rounded-md bg-muted/20 text-muted-foreground/70 text-xs">
        <div class="w-1.5 h-1.5 bg-amber-500/60 rounded-full animate-pulse mr-2"></div>
        {{ card.content.comingSoon?.eta || 'Coming Soon' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BentoCard } from '@/types/homepage'

interface Props {
  card: BentoCard
}

defineProps<Props>()
</script>