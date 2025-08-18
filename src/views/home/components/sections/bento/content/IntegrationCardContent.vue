<template>
  <div class="space-y-4">
    <div class="flex -space-x-2 mb-3">
      <div
        v-for="integration in integrations"
        :key="integration.name"
        class="w-8 h-8 bg-card border-2 border-background rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
        :style="{ backgroundColor: integration.color }"
        :title="integration.name"
      >
        {{ integration.short }}
      </div>
      <div
        class="w-8 h-8 bg-muted border-2 border-background rounded-full flex items-center justify-center text-xs text-muted-foreground"
      >
        +
      </div>
    </div>
    <p class="text-xs text-muted-foreground">
      Popular integrations with seamless setup
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BentoCard } from '@/types/homepage'

interface Props {
  card: BentoCard
}

const props = defineProps<Props>()

const integrations = computed(() => 
  props.card.content.integrations || []
)
</script>