import { ref, computed } from 'vue'
import { getQuizResult } from '@/api/quiz'
import { useQuizStore } from '@/stores/quizStore'
import type { QuizResultResponse } from '@/types/quiz'

// Configuration constants
const QUIZ_RESULT_CONFIG = {
  minimumLoadingTime: 2000, // 2 seconds for consistent UX
} as const

interface UseQuizResultOptions {
  readonly minimumLoadingTime?: number
}

/**
 * Composable for fetching and managing quiz result data
 * Automatically checks stored results first before making API calls
 */
export function useQuizResult(
  quizId: string,
  options: UseQuizResultOptions = {}
) {
  const { minimumLoadingTime = QUIZ_RESULT_CONFIG.minimumLoadingTime } = options
  const data = ref<QuizResultResponse | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const quizStore = useQuizStore()

  const loadQuizResult = async (): Promise<QuizResultResponse | undefined> => {
    if (!quizId) {
      error.value = new Error('Quiz ID is required')
      return
    }

    // Always show loading state for consistent UX
    isLoading.value = true
    error.value = null
    const startTime = Date.now()

    try {
      // First, check for stored results from recent submission
      const storedResult = quizStore.getStoredResult(quizId)
      let result: QuizResultResponse

      if (storedResult) {
        // Use stored data but still respect minimum loading time
        result = {
          success: true as const,
          message: 'Quiz result retrieved from stored data',
          data: storedResult,
          timestamp: new Date().toISOString()
        }
      } else {
        // Fetch from API
        result = await getQuizResult(quizId)
      }

      // Ensure minimum loading time for consistent UX
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minimumLoadingTime - elapsed)

      if (remainingTime > 0) {
        await new Promise<void>(resolve => setTimeout(resolve, remainingTime))
      }

      if (result) {
        data.value = result
      }
      return result
    } catch (err) {
      // Still respect minimum loading time even for errors
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minimumLoadingTime - elapsed)

      if (remainingTime > 0) {
        await new Promise<void>(resolve => setTimeout(resolve, remainingTime))
      }

      error.value = err instanceof Error ? err : new Error('Failed to load quiz result')
    } finally {
      isLoading.value = false
    }
  }

  const refresh = (): Promise<QuizResultResponse | undefined> => loadQuizResult()

  // Computed properties for easy access
  const result = computed(() => data.value?.data || null)
  const score = computed(() => result.value?.score || null)
  const recommendations = computed(() => result.value?.score?.recommendations || '')
  const isSuccess = computed(() => data.value?.success || false)
  const message = computed(() => data.value?.message || '')

  // Auto-load on creation
  loadQuizResult()

  return {
    // Reactive state
    data: computed(() => data.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Computed helpers
    result,
    score,
    recommendations,
    isSuccess,
    message,

    // Actions
    load: loadQuizResult,
    refetch: loadQuizResult,
    refresh
  }
}