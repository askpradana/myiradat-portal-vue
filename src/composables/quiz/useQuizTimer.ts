import { computed, onUnmounted, watch } from 'vue'
import { useQuizStore } from '@/stores/quizStore'

export function useQuizTimer() {
  const quizStore = useQuizStore()

  // Computed timer information
  const timeInfo = computed(() => {
    if (!quizStore.currentSession || !quizStore.currentQuiz) {
      return {
        isActive: false,
        elapsed: 0,
        remaining: 0,
        total: 0,
        percentage: 0,
        isWarning: false,
        isCritical: false,
        isExpired: false,
      }
    }

    const total = quizStore.currentQuiz.time_limit * 60 // Convert minutes to seconds
    const elapsed = quizStore.currentSession.time_elapsed
    const remaining = Math.max(0, total - elapsed)
    const percentage = (elapsed / total) * 100

    return {
      isActive: true,
      elapsed,
      remaining,
      total,
      percentage,
      isWarning: remaining <= total * 0.25, // Last 25% of time
      isCritical: remaining <= total * 0.1, // Last 10% of time
      isExpired: remaining === 0,
    }
  })

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Get user-friendly time descriptions
  const getTimeDescription = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes === 0) {
      return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`
    } else if (remainingSeconds === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`
    } else {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`
    }
  }

  // Computed formatted times
  const formattedElapsed = computed(() => formatTime(timeInfo.value.elapsed))
  const formattedRemaining = computed(() => formatTime(timeInfo.value.remaining))
  const formattedTotal = computed(() => formatTime(timeInfo.value.total))

  // Time status for UI
  const timeStatus = computed(() => {
    const info = timeInfo.value

    if (!info.isActive) return 'inactive'
    if (info.isExpired) return 'expired'
    if (info.isCritical) return 'critical'
    if (info.isWarning) return 'warning'
    return 'normal'
  })

  // Get appropriate time message for different states
  const timeMessage = computed(() => {
    const info = timeInfo.value

    if (!info.isActive) return ''
    if (info.isExpired) return 'Time has expired! Your quiz will be submitted automatically.'
    if (info.isCritical) return `Hurry up! Only ${getTimeDescription(info.remaining)} remaining.`
    if (info.isWarning) return `Time is running low. ${getTimeDescription(info.remaining)} remaining.`
    return `${getTimeDescription(info.remaining)} remaining.`
  })

  // Methods for controlling timer
  const startTimer = () => {
    // Timer is managed by the store, this is just for external control if needed
    console.log('Timer start requested')
  }

  const pauseTimer = () => {
    // For future implementation if pause functionality is needed
    console.log('Timer pause requested')
  }

  const stopTimer = () => {
    // Timer is managed by the store, this is just for external control if needed
    console.log('Timer stop requested')
  }

  // Auto-submission handler
  const onTimeExpired = (callback: () => void) => {
    watch(() => timeInfo.value.isExpired, (isExpired, wasExpired) => {
      if (isExpired && !wasExpired) {
        console.log('Quiz time expired - triggering auto-submission')
        callback()
      }
    })
  }

  // Time-based notifications
  const onTimeWarning = (callback: () => void) => {
    watch(() => timeInfo.value.isWarning, (isWarning, wasWarning) => {
      if (isWarning && !wasWarning) {
        callback()
      }
    })
  }

  const onTimeCritical = (callback: () => void) => {
    watch(() => timeInfo.value.isCritical, (isCritical, wasCritical) => {
      if (isCritical && !wasCritical) {
        callback()
      }
    })
  }

  // Cleanup on unmount
  onUnmounted(() => {
    // Any cleanup if necessary
  })

  return {
    // Time information
    timeInfo,
    timeStatus,
    timeMessage,

    // Formatted times
    formattedElapsed,
    formattedRemaining,
    formattedTotal,

    // Utilities
    formatTime,
    getTimeDescription,

    // Event handlers
    onTimeExpired,
    onTimeWarning,
    onTimeCritical,

    // Control methods (for future use)
    startTimer,
    pauseTimer,
    stopTimer,
  }
}