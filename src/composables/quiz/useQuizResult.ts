import { ref, computed } from 'vue'
import { getQuizResult } from '@/api/quiz'
import { useQuizStore } from '@/stores/quizStore'
import type { QuizResultResponse } from '@/types/quiz'

/**
 * Composable for fetching and managing quiz result data
 * Automatically checks stored results first before making API calls
 */
export function useQuizResult(quizId: string) {
  const data = ref<QuizResultResponse | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const quizStore = useQuizStore()

  const loadQuizResult = async () => {
    if (!quizId) {
      error.value = new Error('Quiz ID is required')
      return
    }

    // First, check for stored results from recent submission
    const storedResult = quizStore.getStoredResult(quizId)
    if (storedResult) {
      data.value = {
        success: true,
        message: 'Quiz result retrieved from stored data',
        data: storedResult,
        timestamp: new Date().toISOString()
      }
      return data.value
    }

    // If no stored result, fetch from API
    isLoading.value = true
    error.value = null

    try {
      const result = await getQuizResult(quizId)
      if (result) {
        data.value = result
      }
      return result
    } catch (err) {  
      error.value = err instanceof Error ? err : new Error('Failed to load quiz result')
    } finally {
      isLoading.value = false
    }
  }

  const refresh = () => loadQuizResult()

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