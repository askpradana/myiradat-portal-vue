<script setup lang="ts">
import { computed } from 'vue'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle } from 'lucide-vue-next'

interface Props {
  current: number
  total: number
  percentage: number
  answered: number[]
  showSteps?: boolean
  mobileMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSteps: true,
  mobileMode: false,
})

const progressText = computed(() => `Question ${props.current} of ${props.total}`)

const progressPercentage = computed(() => Math.round(props.percentage))

// Generate steps for visual progress indicator
const steps = computed(() => {
  if (!props.showSteps) return []

  return Array.from({ length: props.total }, (_, index) => {
    const questionNumber = index + 1
    return {
      number: questionNumber,
      isAnswered: props.answered.includes(questionNumber),
      isCurrent: questionNumber === props.current,
      isPast: questionNumber < props.current,
    }
  })
})

const maxVisibleSteps = 10 // Limit visible steps for mobile
const showAllSteps = computed(() => props.total <= maxVisibleSteps)

const visibleSteps = computed(() => {
  if (showAllSteps.value) return steps.value

  // Show current question and surrounding context
  const currentIndex = props.current - 1
  const start = Math.max(0, currentIndex - 2)
  const end = Math.min(props.total, currentIndex + 3)

  return steps.value.slice(start, end)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Main Progress Bar (hidden in mobile mode) -->
    <div v-if="!mobileMode" class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">{{ progressText }}</span>
        <Badge variant="secondary" class="text-xs">
          {{ progressPercentage }}% Complete
        </Badge>
      </div>

      <Progress
        :value="percentage"
        class="h-2 bg-secondary"
      />
    </div>

    <!-- Mobile minimal progress (only in mobile mode) -->
    <div v-if="mobileMode" class="text-center">
      <span class="text-sm font-medium text-muted-foreground">
        Question {{ current }} of {{ total }}
      </span>
    </div>

    <!-- Step-by-step Progress (Desktop) -->
    <div
      v-if="!mobileMode && showSteps && total <= 20"
      class="hidden md:block"
    >
      <div class="flex items-center gap-1 flex-wrap">
        <div
          v-for="step in steps"
          :key="step.number"
          class="flex items-center"
        >
          <div
            :class="[
              'flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors',
              {
                'bg-primary text-primary-foreground': step.isCurrent,
                'bg-green-100 text-green-700 border border-green-300': step.isAnswered && !step.isCurrent,
                'bg-muted text-muted-foreground border border-border': !step.isAnswered && !step.isCurrent,
              }
            ]"
          >
            <CheckCircle2
              v-if="step.isAnswered && !step.isCurrent"
              class="h-4 w-4"
            />
            <Circle
              v-else-if="!step.isAnswered && !step.isCurrent"
              class="h-4 w-4"
            />
            <span v-else>{{ step.number }}</span>
          </div>

          <!-- Connector line (except for last item) -->
          <div
            v-if="step.number < total"
            :class="[
              'w-2 h-0.5 mx-1',
              step.isAnswered ? 'bg-green-300' : 'bg-border'
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Condensed Progress for Many Questions -->
    <div
      v-else-if="!mobileMode && showSteps && total > 20"
      class="hidden md:block"
    >
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1">
          <div
            v-for="step in visibleSteps"
            :key="step.number"
            :class="[
              'w-3 h-3 rounded-full transition-colors',
              {
                'bg-primary': step.isCurrent,
                'bg-green-500': step.isAnswered && !step.isCurrent,
                'bg-muted': !step.isAnswered && !step.isCurrent,
              }
            ]"
            :title="`Question ${step.number}${step.isAnswered ? ' (answered)' : ''}`"
          />
        </div>

        <span class="text-xs text-muted-foreground ml-2">
          {{ answered.length }} of {{ total }} answered
        </span>
      </div>
    </div>

    <!-- Mobile Compact View (only when not in mobile mode and on small screens) -->
    <div v-if="!mobileMode" class="md:hidden">
      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>{{ answered.length }} answered</span>
        <span>{{ total - answered.length }} remaining</span>
      </div>
    </div>
  </div>
</template>