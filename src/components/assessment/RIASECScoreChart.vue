<template>
  <div class="space-y-4">
    <!-- Header with Top 3 Types -->
    <div v-if="topThreeTypes" class="flex flex-wrap gap-2">
      <div
        v-for="type in topThreeArray"
        :key="type"
        class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      >
        {{ RIASEC_TYPES[type]?.name || type.toUpperCase() }}
      </div>
    </div>

    <!-- Score Bars -->
    <div class="space-y-3">
      <div v-for="(score, dimension) in scores" :key="dimension" class="space-y-2">
        <!-- Dimension Header -->
        <div class="flex justify-between items-center">
          <div class="flex-1">
            <h5 class="font-medium text-sm text-foreground">
              {{ RIASEC_TYPES[dimension]?.name || dimension }}
            </h5>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Numeric Score -->
            <span class="text-sm font-semibold text-foreground min-w-[2rem] text-right">
              {{ score }}
            </span>
          </div>
        </div>

        <!-- Career Examples (expandable) -->
        <div v-if="showCareers && RIASEC_TYPES[dimension]" class="mt-2">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="career in RIASEC_TYPES[dimension].careers.slice(0, 3)"
              :key="career"
              class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md dark:bg-gray-800 dark:text-gray-300"
            >
              {{ career }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RIASECScores, RIASECResult } from '@/types/ipros'
import { RIASEC_TYPES } from '@/types/ipros'

interface Props {
  scores: RIASECScores
  topThreeTypes?: string | null
  careerGuidance?: Pick<RIASECResult['result'], 'karir' | 'pendidikan' | 'potensi'> | null
  maxScore?: number
}

const props = withDefaults(defineProps<Props>(), {
  topThreeTypes: null,
  careerGuidance: null,
  maxScore: 25,
})

const showCareers = ref(false)

// Parse top three types
const topThreeArray = computed(() => {
  if (!props.topThreeTypes) return []
  return props.topThreeTypes
    .split('')
    .map((char) => {
      const typeMap: Record<string, keyof RIASECScores> = {
        R: 'realistic',
        I: 'investigative',
        A: 'artistic',
        S: 'social',
        E: 'enterprising',
        C: 'conventional',
      }
      return typeMap[char.toUpperCase()]
    })
    .filter(Boolean)
})
</script>

<style scoped>
/* Smooth animations for score bars */
.progress-bar {
  transition: width 0.5s ease-out;
}

/* Hover effects for interactive elements */
.score-bar:hover {
  transform: translateX(2px);
  transition: transform 0.2s ease;
}
</style>
