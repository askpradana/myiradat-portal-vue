import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useQuizStore } from '@/stores/quizStore'
import { useQuizSubmissionCheck } from './useQuizSubmissionCheck'
import { useQuizDetail } from './useQuizDetail'
import { useQuizResult } from './useQuizResult'
import {
  getAvailableQuizzes,
  getQuizDetail,
  getQuizSubmissions,
  submitQuiz
} from '@/api/quiz'

interface QuizAPIState {
  isLoading: boolean
  error: string | null
  isSubmitting: boolean
  checkingSubmission: Record<string, boolean>
}

export function useQuizManagement() {
  const quizStore = useQuizStore()
  const router = useRouter()
  const { checkSubmissionStatus, handleSubmissionBlocked } = useQuizSubmissionCheck()

  // Local reactive state for API operations
  const state = reactive<QuizAPIState>({
    isLoading: false,
    error: null,
    isSubmitting: false,
    checkingSubmission: {}
  })

  // Direct store access - simple and clean
  const availableQuizzes = computed(() => quizStore.availableQuizzes)
  const completedQuizzes = computed(() => quizStore.completedQuizzes)
  const isLoadingAny = computed(() => state.isLoading || state.isSubmitting)

  // Fetch available quizzes with proper error handling
  const fetchAvailableQuizzes = async () => {
    try {
      const response = await getAvailableQuizzes()
      if (response?.success && response.data?.quizzes) {
        quizStore.setAvailableQuizzes(response.data.quizzes)
      } else {
        throw new Error('Invalid API response structure')
      }
    } catch (error) {  
      const errorMessage = error instanceof Error ? error.message : 'Failed to load quizzes'
      state.error = errorMessage
      quizStore.setError({
        type: 'network',
        message: errorMessage,
        details: 'Unable to fetch available quizzes'
      })
      throw error // Re-throw to be handled by calling function
    }
  }

  // Fetch quiz submissions with proper error handling
  const fetchQuizSubmissions = async () => {
    try {
      const response = await getQuizSubmissions()
      if (response?.success && response.data?.submissions) {
        quizStore.setCompletedQuizzes(response.data.submissions)
      }
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Don't throw here as submissions are less critical than available quizzes
    }
  }

  // Fetch all data in parallel for better performance
  const fetchData = async () => {
    state.isLoading = true
    state.error = null
    quizStore.clearError()

    try {
      // Execute both API calls in parallel
      await Promise.allSettled([
        fetchAvailableQuizzes(),
        fetchQuizSubmissions()
      ])
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Error handling is done in individual fetch functions
    } finally {
      state.isLoading = false
    }
  }

  // Start quiz with submission check flow
  const startQuiz = async (quizId: string) => {
    try {
      // First set checking state for the specific quiz
      state.checkingSubmission[quizId] = true
      state.error = null
      quizStore.clearError()

      // Check submission status first
      const submissionStatus = await checkSubmissionStatus(quizId)

      if (submissionStatus && !submissionStatus.can_submit) {
        handleSubmissionBlocked(submissionStatus.message)
        return
      }

      // If submission check passed, proceed with loading quiz and starting session
      state.isLoading = true
      quizStore.setLoadingState('loading')

      const response = await getQuizDetail(quizId)
      if (response?.success && response.data) {
        // Start the quiz session immediately here so the QuizTakingView doesn't need to reload
        quizStore.startQuizSession(response.data.quiz, response.data.questions)
        router.push(`/quiz/${quizId}`)
      } else {
        throw new Error(response?.message || 'Failed to load quiz details')
      }
    } catch (error) {  
      const errorMessage = error instanceof Error ? error.message : 'Failed to start quiz'
      state.error = errorMessage
      quizStore.setError({
        type: 'network',
        message: 'Failed to start quiz',
        details: errorMessage
      })
      toast('Error', {
        description: errorMessage
      })
    } finally {
      state.checkingSubmission[quizId] = false
      state.isLoading = false
      quizStore.setLoadingState('idle')
    }
  }

  // Start quiz for retake - bypasses submission checks
  const startQuizForRetake = async (quizId: string) => {
    try {
      state.isLoading = true
      state.error = null
      quizStore.clearError()
      quizStore.setLoadingState('loading')

      // Skip submission check for retakes and go directly to quiz detail
      const response = await getQuizDetail(quizId)
      if (response?.success && response.data) {
        // Start the quiz session immediately here so the QuizTakingView doesn't need to reload
        quizStore.startQuizSession(response.data.quiz, response.data.questions)
        router.push(`/quiz/${quizId}`)
      } else {
        throw new Error(response?.message || 'Failed to load quiz details')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start quiz for retake'
      state.error = errorMessage
      quizStore.setError({
        type: 'network',
        message: 'Failed to start quiz',
        details: errorMessage
      })
      toast('Error', {
        description: errorMessage
      })
    } finally {
      state.isLoading = false
      quizStore.setLoadingState('idle')
    }
  }

  // Submit quiz with improved error handling
  const submitCurrentQuiz = async () => {
    const submission = quizStore.prepareSubmission()
    if (!submission) {
      toast('Error', {
        description: 'Please answer all questions before submitting.'
      })
      return
    }

    try {
      state.isSubmitting = true
      state.error = null
      quizStore.setLoadingState('submitting')

      const response = await submitQuiz(submission)

      if (response?.success && response.data) {
        // Store the submission result for immediate access
        quizStore.storeSubmissionResult(submission.quiz_id, response.data)

        // Clear current session
        quizStore.clearSession()

        // Navigate to results page
        router.push(`/quiz/${submission.quiz_id}/results`)

        toast('Success', {
          description: 'Quiz submitted successfully! View your results.'
        })
      } else {
        throw new Error(response?.message || 'Failed to submit quiz')
      }
    } catch (error) {  
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit quiz'
      state.error = errorMessage

      quizStore.setError({
        type: 'submission',
        message: errorMessage,
        details: 'Please try again'
      })

      toast('Error', {
        description: errorMessage
      })
    } finally {
      state.isSubmitting = false
      quizStore.setLoadingState('idle')
    }
  }

  // Navigation helpers
  const viewQuizResult = (quizId: string) => {
    router.push(`/quiz/${quizId}/results`)
  }

  const retakeQuiz = (quizId: string) => {
    quizStore.clearSession()
    startQuizForRetake(quizId)
  }

  const goToQuizHub = () => {
    router.push('/dashboard?tab=assessments')
  }

  // Refresh data manually
  const refreshData = async () => {
    await fetchData()
  }

  // Clear error state
  const clearError = () => {
    state.error = null
    quizStore.clearError()
  }

  // Helper to check if quiz is being checked for submission
  const isCheckingQuizSubmission = (quizId: string) => {
    return state.checkingSubmission[quizId] || false
  }

  // Helper to check if quiz is completed
  const isQuizCompleted = (quizId: string) => {
    return completedQuizzes.value.some(submission => submission.quiz_id === quizId)
  }


  return {
    // Data access - direct from store
    availableQuizzes,
    completedQuizzes,

    // Loading states - simplified
    isLoading: computed(() => state.isLoading),
    isSubmitting: computed(() => state.isSubmitting),
    isLoadingAny,

    // Error state
    error: computed(() => state.error || quizStore.error?.message),

    // Query hooks
    useQuizDetail,
    useQuizResult,

    // Actions - simplified API
    fetchData,
    startQuiz,
    startQuizForRetake,
    submitCurrentQuiz,
    viewQuizResult,
    retakeQuiz,
    goToQuizHub,
    refreshData,
    clearError,
    isCheckingQuizSubmission,
    isQuizCompleted,

    // Store access for advanced usage
    quizStore
  }
}