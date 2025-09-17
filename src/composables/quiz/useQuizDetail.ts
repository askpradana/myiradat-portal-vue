import { ref, computed } from 'vue'
import { getQuizDetail } from '@/api/quiz'
import type { QuizDetailResponse } from '@/types/quiz'

/**
 * Composable for fetching and managing quiz detail data
 * Provides reactive state for quiz detail with loading and error states
 */
export function useQuizDetail(quizId: string) {
  const data = ref<QuizDetailResponse | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const loadQuizDetail = async () => {
    if (!quizId) {
      error.value = new Error('Quiz ID is required')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await getQuizDetail(quizId)
      if (result) {
        data.value = result
      }
      return result
    } catch (err) {  
      error.value = err instanceof Error ? err : new Error('Failed to load quiz detail')
    } finally {
      isLoading.value = false
    }
  }

  const refresh = () => loadQuizDetail()

  // Computed properties for easy access
  const quiz = computed(() => data.value?.data?.quiz || null)
  const questions = computed(() => data.value?.data?.questions || [])
  const isSuccess = computed(() => data.value?.success || false)
  const message = computed(() => data.value?.message || '')

  return {
    // Reactive state
    data: computed(() => data.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Computed helpers
    quiz,
    questions,
    isSuccess,
    message,

    // Actions
    load: loadQuizDetail,
    refetch: loadQuizDetail,
    refresh
  }
}