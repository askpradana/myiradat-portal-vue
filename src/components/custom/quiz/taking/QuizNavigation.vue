<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Send } from 'lucide-vue-next'

interface Props {
  canGoPrevious: boolean
  canGoNext: boolean
  isLastQuestion: boolean
  isFirstQuestion: boolean
  hasCurrentAnswer: boolean
  isSubmitting?: boolean
  showSubmitWarning?: boolean
  mobileMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  showSubmitWarning: false,
  mobileMode: false,
})

const emit = defineEmits<{
  previous: []
  next: []
  submit: []
}>()

const { t } = useI18n()

const nextButtonText = computed(() => {
  if (props.isLastQuestion) {
    return t('quiz.navigation.submit')
  }
  return t('quiz.navigation.next')
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
  <div :class="mobileMode ? 'space-y-2' : 'space-y-4'">
    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between gap-4">
      <!-- Previous Button -->
      <Button
        @click="handlePrevious"
        :disabled="!canGoPrevious || isSubmitting"
        variant="outline"
        :size="mobileMode ? 'default' : 'lg'"
        :class="
          mobileMode
            ? 'flex items-center gap-2 min-w-[100px] px-3 py-2'
            : 'flex items-center gap-2 min-w-[120px]'
        "
      >
        <ChevronLeft :class="mobileMode ? 'h-3 w-3' : 'h-4 w-4'" />
        {{ t('quiz.navigation.previous') }}
      </Button>

      <!-- Next/Submit Button -->
      <Button
        @click="handleNext"
        :disabled="!canProceed || isSubmitting"
        :variant="isLastQuestion ? 'default' : 'default'"
        :size="mobileMode ? 'default' : 'lg'"
        :class="[
          mobileMode
            ? 'flex items-center gap-2 min-w-[100px] px-3 py-2'
            : 'flex items-center gap-2 min-w-[120px]',
          {
            'bg-green-600 hover:bg-green-700': isLastQuestion && canProceed,
            'bg-primary hover:bg-primary/90': !isLastQuestion && canProceed,
          },
        ]"
      >
        <span v-if="!isSubmitting">{{ nextButtonText }}</span>
        <span v-else>
          {{ isLastQuestion ? t('quiz.navigation.submitting') : t('common.states.loading') }}
        </span>

        <component
          :is="nextButtonIcon"
          v-if="!isSubmitting"
          :class="mobileMode ? 'h-3 w-3' : 'h-4 w-4'"
        />

        <!-- Loading spinner -->
        <div
          v-else
          :class="
            mobileMode
              ? 'h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin'
              : 'h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin'
          "
        />
      </Button>
    </div>

    <!-- Keyboard Hints (Desktop only, hidden in mobile mode) -->
    <div
      v-if="!mobileMode"
      class="hidden sm:flex items-center justify-center gap-6 text-xs text-muted-foreground"
    >
      <div v-if="canGoPrevious" class="flex items-center gap-1">
        <kbd class="px-2 py-1 bg-muted rounded text-xs">←</kbd>
        <span>{{ t('quiz.navigation.previous') }}</span>
      </div>

      <div v-if="canProceed" class="flex items-center gap-1">
        <kbd class="px-2 py-1 bg-muted rounded text-xs">→</kbd>
        <span>{{ isLastQuestion ? t('quiz.navigation.submit') : t('quiz.navigation.next') }}</span>
      </div>

      <div v-if="canProceed" class="flex items-center gap-1">
        <kbd class="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
        <span>{{
          isLastQuestion ? t('quiz.navigation.submit') : t('quiz.navigation.continue')
        }}</span>
      </div>
    </div>
  </div>
</template>
