<template>
  <div class="space-y-4">
    <!-- Highlights List -->
    <div v-if="card.content.highlights" class="space-y-2">
      <div 
        v-for="highlight in card.content.highlights" 
        :key="highlight"
        class="flex items-center space-x-2 text-sm"
      >
        <div class="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
        <span class="text-muted-foreground">{{ highlight }}</span>
      </div>
    </div>

    <!-- Status List -->
    <div v-if="card.content.statusList" class="space-y-3">
      <div 
        v-for="status in card.content.statusList" 
        :key="status.label"
        class="flex items-center space-x-2 text-sm"
      >
        <div 
          :class="`w-2 h-2 bg-${status.color} rounded-full`"
          class="animate-pulse"
          v-if="status.status === 'operational'"
        ></div>
        <div 
          :class="`w-2 h-2 bg-${status.color} rounded-full`"
          v-else
        ></div>
        <span class="text-muted-foreground">{{ status.label }}</span>
      </div>
    </div>

    <!-- Metrics -->
    <div v-if="card.content.metrics" class="grid grid-cols-2 gap-3 pt-2">
      <div 
        v-for="metric in card.content.metrics" 
        :key="metric.label"
        class="text-center p-3 bg-muted/50 rounded-lg"
      >
        <div :class="metricValueClasses">
          {{ metric.value }}{{ metric.suffix || '' }}
        </div>
        <div class="text-xs text-muted-foreground">{{ metric.label }}</div>
      </div>
    </div>

    <!-- Progress Bar (if present) -->
    <div v-if="card.content.progress" class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-muted-foreground">{{ card.content.progress.label }}</span>
        <span class="text-foreground font-semibold">
          {{ Math.round((card.content.progress.value / card.content.progress.max) * 100) }}%
        </span>
      </div>
      <div class="w-full bg-muted rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-1000"
          :class="progressBarColor"
          :style="{ width: `${(card.content.progress.value / card.content.progress.max) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BentoCard } from '@/types/homepage'

interface Props {
  card: BentoCard
}

defineProps<Props>()

const metricValueClasses = computed(() => {
  // Use consistent neutral color for all metrics
  return 'text-xl font-bold text-foreground'
})

const progressBarColor = computed(() => {
  // Use primary color only for progress bars
  return 'bg-primary'
})

</script>