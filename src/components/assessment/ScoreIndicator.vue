<template>
  <div class="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
    <div class="flex-1 min-w-0">
      <h4 class="font-medium text-foreground text-sm truncate">{{ label }}</h4>
      <p class="text-xs text-muted-foreground mt-1">{{ value }}</p>
      <!-- Show numerical score if available -->
      <div v-if="scoreType === 'numerical' && numericalScore !== null" class="text-xs font-medium text-foreground mt-1">
        Skor: {{ numericalScore }}/{{ maxScore }}
      </div>
      <div v-if="showTooltip" class="text-xs text-muted-foreground mt-1 italic">
        {{ interpretation.description }}
      </div>
    </div>
    
    <div class="flex items-center space-x-3 ml-4">
      <!-- Score Badge -->
      <div 
        class="px-2 py-1 rounded-full text-xs font-medium"
        :class="badgeClasses"
      >
        {{ interpretation.level.toUpperCase() }}
      </div>
      
      <!-- Visual Indicator -->
      <div class="relative w-12 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          class="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out"
          :class="progressClasses"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      
      <!-- Tooltip Toggle (if enabled) -->
      <button
        v-if="hasTooltip"
        @click="toggleTooltip"
        class="p-1 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        :aria-label="`Info tentang ${label}`"
        type="button"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAssessmentData } from '@/composables/data/useAssessmentData'

interface Props {
  label: string
  value: string
  showProgressBar?: boolean
  hasTooltip?: boolean
  size?: 'sm' | 'md' | 'lg'
  // IPROS-specific props
  numericalScore?: number | null
  maxScore?: number
  scoreType?: 'text' | 'numerical'
}

const props = withDefaults(defineProps<Props>(), {
  showProgressBar: true,
  hasTooltip: true,
  size: 'md',
  numericalScore: null,
  maxScore: 5,
  scoreType: 'text'
})

const { interpretScore } = useAssessmentData()
const showTooltip = ref(false)

// Score interpretation - handle both text and numerical scores
const interpretation = computed(() => {
  if (props.scoreType === 'numerical' && props.numericalScore !== null) {
    return interpretNumericalScore(props.numericalScore, props.maxScore)
  }
  return interpretScore(props.value)
})

// Numerical score interpretation for IPROS scores
const interpretNumericalScore = (score: number, maxScore: number) => {
  // For 5-point scale: 4-5 = high, 3 = medium, 1-2 = low
  if (maxScore === 5) {
    if (score >= 4) {
      return {
        level: 'high',
        color: 'green',
        description: `Skor tinggi (${score}/${maxScore}) - Kemampuan sangat baik`
      }
    } else if (score === 3) {
      return {
        level: 'medium',
        color: 'yellow',
        description: `Skor sedang (${score}/${maxScore}) - Kemampuan memadai`
      }
    } else {
      return {
        level: 'low',
        color: 'red',
        description: `Skor rendah (${score}/${maxScore}) - Perlu pengembangan`
      }
    }
  } else {
    // For other scales, use percentage-based logic
    const percentage = (score / maxScore) * 100
    if (percentage >= 85) {
      return {
        level: 'high',
        color: 'green',
        description: `Skor tinggi (${score}/${maxScore}) - Kemampuan sangat baik`
      }
    } else if (percentage >= 70) {
      return {
        level: 'medium',
        color: 'yellow',
        description: `Skor sedang (${score}/${maxScore}) - Kemampuan memadai`
      }
    } else {
      return {
        level: 'low',
        color: 'red',
        description: `Skor rendah (${score}/${maxScore}) - Perlu pengembangan`
      }
    }
  }
}

// Progress calculation for visual representation
const progressPercentage = computed(() => {
  if (props.scoreType === 'numerical' && props.numericalScore !== null) {
    return Math.min((props.numericalScore / props.maxScore) * 100, 100)
  }

  switch (interpretation.value.level) {
    case 'low': return 25
    case 'medium': return 60
    case 'high': return 90
    default: return 50
  }
})

// Dynamic classes based on score level
const badgeClasses = computed(() => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium'
  
  switch (interpretation.value.color) {
    case 'green':
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`
    case 'yellow':
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`
    case 'red':
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`
  }
})

const progressClasses = computed(() => {
  switch (interpretation.value.color) {
    case 'green':
      return 'bg-green-500'
    case 'yellow':
      return 'bg-yellow-500'
    case 'red':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
})

// Actions
const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value
}
</script>