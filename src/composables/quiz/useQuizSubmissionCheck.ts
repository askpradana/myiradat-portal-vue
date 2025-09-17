import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useQuizStore } from '@/stores/quizStore'
import { checkQuizSubmission } from '@/api/quiz'
import type { QuizSubmissionStatus } from '@/types/quiz'

export function useQuizSubmissionCheck() {
  const quizStore = useQuizStore()
  const isCheckingSubmission = ref<Record<string, boolean>>({})

  const checkSubmissionStatus = async (quizId: string): Promise<QuizSubmissionStatus | null> => {
    // Return cached status if available
    const cachedStatus = quizStore.getSubmissionStatus(quizId)
    if (cachedStatus) {
      return cachedStatus
    }

    // Set loading state
    isCheckingSubmission.value[quizId] = true

    try {
      const response = await checkQuizSubmission(quizId)

      if (response?.success && response.data) {
        // Cache the status in store
        quizStore.setSubmissionStatus(quizId, response.data)
        return response.data
      }

      return null
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return null
    } finally {
      isCheckingSubmission.value[quizId] = false
    }
  }

  const handleSubmissionBlocked = (message: string) => {
    toast('Quiz Already Submitted', {
      description: message || 'You have already submitted this quiz',
    })
  }

  const isQuizAvailable = (quizId: string): boolean => {
    return quizStore.canSubmitQuiz(quizId)
  }

  const isCheckingQuiz = (quizId: string): boolean => {
    return isCheckingSubmission.value[quizId] || false
  }

  return {
    checkSubmissionStatus,
    handleSubmissionBlocked,
    isQuizAvailable,
    isCheckingQuiz,
  }
}