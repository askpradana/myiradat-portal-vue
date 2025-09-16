<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-vue-next'

interface Props {
  canGoPrevious: boolean
  canGoNext: boolean
  isLastQuestion: boolean
  isFirstQuestion: boolean
  hasCurrentAnswer: boolean
  isSubmitting?: boolean
  showSubmitWarning?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  showSubmitWarning: false,
})

const emit = defineEmits<{
  previous: []
  next: []
  submit: []
}>()

const nextButtonText = computed(() => {
  if (props.isLastQuestion) {
    return 'Submit Quiz'
  }
  return 'Next Question'
})

const nextButtonIcon = computed(() => {
  if (props.isLastQuestion) {
    return Send
  }
  return ChevronRight
})

const canProceed = computed(() => {
  return props.hasCurrentAnswer && (props.canGoNext || props.isLastQuestion)
})

const handlePrevious = () => {
  if (props.canGoPrevious && !props.isSubmitting) {
    emit('previous')
  }
}

const handleNext = () => {
  if (canProceed.value && !props.isSubmitting) {
    if (props.isLastQuestion) {
      emit('submit')
    } else {
      emit('next')
    }
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Skip if typing in an input field
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return
  }

  if (event.key === 'ArrowLeft' && props.canGoPrevious) {
    handlePrevious()
  } else if (event.key === 'ArrowRight' && canProceed.value) {
    handleNext()
  } else if (event.key === 'Enter' && canProceed.value) {
    handleNext()
  }
}

// Properly managed keyboard listeners
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Submit Warning (if needed) -->
    <div
      v-if="showSubmitWarning && isLastQuestion"
      class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
    >
      <AlertTriangle class="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div class="space-y-1">
        <p class="text-sm font-medium text-amber-800">
          Ready to submit?
        </p>
        <p class="text-sm text-amber-700">
          Please review your answers before submitting. You won't be able to change them after submission.
        </p>
      </div>
    </div>

    <!-- Gentle Guidance -->
    <div
      v-if="!hasCurrentAnswer && !isFirstQuestion"
      class="text-center text-sm text-muted-foreground"
    >
      Choose your response above to proceed
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between gap-4">
      <!-- Previous Button -->
      <Button
        @click="handlePrevious"
        :disabled="!canGoPrevious || isSubmitting"
        variant="outline"
        size="lg"
        class="flex items-center gap-2 min-w-[120px]"
      >
        <ChevronLeft class="h-4 w-4" />
        Previous
      </Button>

      <!-- Question Progress (Mobile) -->
      <div class="text-sm text-muted-foreground text-center sm:hidden">
        <span class="font-medium">Question Progress</span>
      </div>

      <!-- Next/Submit Button -->
      <Button
        @click="handleNext"
        :disabled="!canProceed || isSubmitting"
        :variant="isLastQuestion ? 'default' : 'default'"
        size="lg"
        :class="[
          'flex items-center gap-2 min-w-[120px]',
          {
            'bg-green-600 hover:bg-green-700': isLastQuestion && canProceed,
            'bg-primary hover:bg-primary/90': !isLastQuestion && canProceed,
          }
        ]"
      >
        <span v-if="!isSubmitting">{{ nextButtonText }}</span>
        <span v-else>
          {{ isLastQuestion ? 'Submitting...' : 'Loading...' }}
        </span>

        <component
          :is="nextButtonIcon"
          v-if="!isSubmitting"
          class="h-4 w-4"
        />

        <!-- Loading spinner -->
        <div
          v-else
          class="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"
        />
      </Button>
    </div>

    <!-- Keyboard Hints (Desktop) -->
    <div class="hidden sm:flex items-center justify-center gap-6 text-xs text-muted-foreground">
      <div
        v-if="canGoPrevious"
        class="flex items-center gap-1"
      >
        <kbd class="px-2 py-1 bg-muted rounded text-xs">←</kbd>
        <span>Previous</span>
      </div>

      <div
        v-if="canProceed"
        class="flex items-center gap-1"
      >
        <kbd class="px-2 py-1 bg-muted rounded text-xs">→</kbd>
        <span>{{ isLastQuestion ? 'Submit' : 'Next' }}</span>
      </div>

      <div
        v-if="canProceed"
        class="flex items-center gap-1"
      >
        <kbd class="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
        <span>{{ isLastQuestion ? 'Submit' : 'Continue' }}</span>
      </div>
    </div>
  </div>
</template>