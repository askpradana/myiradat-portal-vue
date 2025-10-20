<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, toRefs } from 'vue'

// Configuration constants
const ANIMATION_CONFIG = {
  progressDuration: 2000, // 2 seconds to complete
  progressInterval: 40,   // 40ms intervals for smooth animation
  messageInterval: 500,   // 500ms message rotation
  extendedThreshold: 2000, // Show extended message after 2 seconds
  progressBars: 15        // Number of progress bar segments
} as const

const LOADING_MESSAGES = {
  submission: [
    "Submitting quiz...",
    "Processing your answers...",
    "Calculating your results...",
    "Analyzing your responses..."
  ],
  results: [
    "Loading your results...",
    "Fetching your data...",
    "Preparing your report...",
    "Almost ready..."
  ]
} as const

const EXTENDED_MESSAGES = {
  submission: "Hold on, we need more time...",
  results: "This is taking longer than usual..."
} as const

interface Props {
  readonly type?: 'submission' | 'results'
  readonly isLoading?: boolean
  readonly duration?: number
  readonly progressSteps?: number
}

interface Emits {
  completed: []
  extended: []
}

const props = withDefaults(defineProps<Props>(), {
  type: 'submission',
  isLoading: true,
  duration: 2000,
  progressSteps: 15
})

const emit = defineEmits<Emits>()

// Progress state
const progress = ref<number>(0)
const messageIndex = ref<number>(0)
const isExtended = ref<boolean>(false)
const startTime = ref<number>(0)

// Animation intervals with proper typing
const progressInterval = ref<ReturnType<typeof setInterval> | null>(null)
const messageInterval = ref<ReturnType<typeof setInterval> | null>(null)

// Get current message set
const currentMessages = computed((): readonly string[] =>
  LOADING_MESSAGES[props.type]
)

// Get current message
const currentMessage = computed((): string => {
  if (isExtended.value) {
    return EXTENDED_MESSAGES[props.type]
  }
  return currentMessages.value[messageIndex.value % currentMessages.value.length]
})

// Generate progress bar
const progressBar = computed((): string => {
  const filledBars = Math.floor((progress.value / 100) * props.progressSteps)
  const filled = '='.repeat(filledBars)
  const empty = ' '.repeat(props.progressSteps - filledBars)
  return `[${filled}${empty}]`
})

// Start animation with proper cleanup
const startAnimation = (): void => {
  if (!props.isLoading) return

  // Reset state
  startTime.value = Date.now()
  progress.value = 0
  messageIndex.value = 0
  isExtended.value = false

  // Calculate progress increment for smooth animation
  const progressIncrement = 100 / (props.duration / ANIMATION_CONFIG.progressInterval)

  // Progress animation
  progressInterval.value = setInterval(() => {
    if (progress.value < 100) {
      progress.value = Math.min(100, progress.value + progressIncrement)
    } else {
      // Emit completion event when progress reaches 100%
      emit('completed')
    }
  }, ANIMATION_CONFIG.progressInterval)

  // Message rotation
  messageInterval.value = setInterval(() => {
    const elapsed = Date.now() - startTime.value

    if (elapsed >= ANIMATION_CONFIG.extendedThreshold && progress.value >= 100) {
      if (!isExtended.value) {
        isExtended.value = true
        emit('extended')
      }
    } else {
      messageIndex.value++
    }
  }, ANIMATION_CONFIG.messageInterval)
}

// Stop animation with proper cleanup
const stopAnimation = (): void => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
    progressInterval.value = null
  }
  if (messageInterval.value) {
    clearInterval(messageInterval.value)
    messageInterval.value = null
  }
}

// Ensure cleanup on component unmount
const ensureCleanup = (): void => {
  stopAnimation()
}

// Lifecycle management
onMounted((): void => {
  if (props.isLoading) {
    startAnimation()
  }
})

onUnmounted((): void => {
  ensureCleanup()
})

// Watch for loading state changes
const { isLoading } = toRefs(props)
watch(isLoading, (newVal: boolean): void => {
  if (newVal) {
    ensureCleanup() // Ensure clean state before starting
    startAnimation()
  } else {
    stopAnimation()
  }
}, { immediate: false })
</script>

<template>
  <div
    class="text-center space-y-4"
    role="status"
    aria-live="polite"
    aria-label="Loading progress"
  >
    <!-- ASCII Progress Bar -->
    <div
      class="font-mono text-lg text-primary motion-safe:transition-all motion-safe:duration-300"
      :aria-label="`Progress: ${Math.round(progress)}%`"
    >
      {{ progressBar }}
    </div>

    <!-- Loading Message -->
    <p
      class="text-muted-foreground motion-safe:transition-opacity motion-safe:duration-200"
      aria-live="polite"
    >
      {{ currentMessage }}
    </p>

    <!-- Extended loading hint -->
    <p
      v-if="isExtended"
      class="text-xs text-muted-foreground/70 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
      aria-live="polite"
    >
      Thanks for your patience!
    </p>
  </div>
</template>