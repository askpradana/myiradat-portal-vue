import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Quiz,
  Question,
  QuizSession,
  QuizSubmission,
  QuizLoadingState,
  QuizError,
  QuizSubmissionPayload,
  QuizSubmissionStatus,
  QuizResult,
  QuizScore,
} from '@/types/quiz'

interface APILoadingStates {
  availableQuizzes: boolean
  submissions: boolean
  quizDetail: boolean
}

interface SubmissionResultData {
  id: string
  quiz_id: string
  score: QuizScore
  completed_at: string
  user?: {
    id: string
    name: string
    email: string
    role_name: string
    is_anonymous: boolean
  }
}

export const useQuizStore = defineStore('quiz', () => {
  // State
  const availableQuizzes = ref<Quiz[]>([])
  const completedQuizzes = ref<QuizSubmission[]>([])
  const currentQuiz = ref<Quiz | null>(null)
  const currentQuestions = ref<Question[]>([])
  const currentSession = ref<QuizSession | null>(null)
  const submissionStatuses = ref<Record<string, QuizSubmissionStatus>>({})
  const loadingState = ref<QuizLoadingState>('idle')
  const error = ref<QuizError | null>(null)
  const timer = ref<ReturnType<typeof setInterval> | null>(null)

  // Temporary storage for submission results
  const storedResults = ref<Record<string, QuizResult>>({})

  // Enhanced API loading states
  const apiLoadingStates = ref<APILoadingStates>({
    availableQuizzes: false,
    submissions: false,
    quizDetail: false
  })

  // Computed properties
  const hasActiveSession = computed(() =>
    !!currentSession.value && !currentSession.value.is_submitted
  )

  const sessionTimeRemaining = computed(() => {
    if (!currentSession.value || !currentQuiz.value) return 0
    const timeLimit = currentQuiz.value.time_limit * 60 // Convert to seconds
    return Math.max(0, timeLimit - currentSession.value.time_elapsed)
  })

  const isTimeUp = computed(() => sessionTimeRemaining.value <= 0)

  const progressPercentage = computed(() => {
    if (!currentSession.value || !currentQuiz.value) return 0
    const totalQuestions = currentQuiz.value.questions || currentQuestions.value.length
    return (currentSession.value.answers.size / totalQuestions) * 100
  })

  const currentQuestionNumber = computed(() =>
    currentSession.value?.current_question || 1
  )

  const totalQuestions = computed(() =>
    currentQuiz.value?.questions || currentQuestions.value.length
  )

  const answeredQuestions = computed(() =>
    Array.from(currentSession.value?.answers.keys() || [])
  )

  const unansweredQuestions = computed(() => {
    if (!currentSession.value) return []
    const total = totalQuestions.value
    const answered = answeredQuestions.value
    return Array.from({ length: total }, (_, i) => i + 1)
      .filter(q => !answered.includes(q))
  })

  const canGoPrevious = computed(() =>
    currentQuestionNumber.value > 1
  )

  const canGoNext = computed(() => {
    const hasCurrentAnswer = currentSession.value?.answers.has(currentQuestionNumber.value) || false
    return hasCurrentAnswer && currentQuestionNumber.value < totalQuestions.value
  })

  const isLastQuestion = computed(() =>
    currentQuestionNumber.value === totalQuestions.value
  )

  const canSubmit = computed(() => {
    if (!currentSession.value || !currentQuiz.value) return false
    const requiredAnswers = currentQuiz.value.questions || currentQuestions.value.length
    return currentSession.value.answers.size === requiredAnswers
  })

  // Enhanced computed properties for API states
  const isLoadingAnyAPI = computed(() =>
    Object.values(apiLoadingStates.value).some(state => state)
  )

  const isDataReady = computed(() =>
    availableQuizzes.value.length > 0 || !apiLoadingStates.value.availableQuizzes
  )

  // Submission status computed properties
  const getSubmissionStatus = computed(() => (quizId: string) =>
    submissionStatuses.value[quizId]
  )

  const canSubmitQuiz = computed(() => (quizId: string) => {
    const status = submissionStatuses.value[quizId]
    return status ? status.can_submit : true // Default to allow if not checked
  })

  // Actions
  const setAvailableQuizzes = (quizzes: Quiz[]) => {
    availableQuizzes.value = quizzes
  }

  const setCompletedQuizzes = (submissions: QuizSubmission[]) => {
    completedQuizzes.value = submissions
  }

  const setCurrentQuiz = (quiz: Quiz, questions: Question[]) => {
    currentQuiz.value = quiz
    currentQuestions.value = questions
  }

  const startQuizSession = (quiz: Quiz, questions: Question[]) => {

    if (!quiz || !questions) {
      return
    }

    setCurrentQuiz(quiz, questions)

    // Check if there's an existing session in sessionStorage
    const savedSession = sessionStorage.getItem(`quiz_session_${quiz.id}`)

    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession)
        // If session is submitted, just create a new one
        if (sessionData.is_submitted) {
          createNewSession(quiz)
        } else {
          // Restore active session
          currentSession.value = {
            ...sessionData,
            start_time: new Date(sessionData.start_time),
            answers: new Map(Object.entries(sessionData.answers).map(([k, v]) => [Number(k), v as number])),
          }
        }
      } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        createNewSession(quiz)
      }
    } else {
      createNewSession(quiz)
    }


    startTimer()
  }

  const createNewSession = (quiz: Quiz) => {
    currentSession.value = {
      quiz_id: quiz.id,
      start_time: new Date(),
      answers: new Map(),
      time_elapsed: 0,
      is_submitted: false,
      current_question: 1,
    }

    saveSessionToStorage()
  }

  // Optimized debouncing state for batch operations
  let answerUpdateTimeout: ReturnType<typeof setTimeout> | null = null
  let sessionSaveTimeout: ReturnType<typeof setTimeout> | null = null
  const pendingAnswers = new Map<number, number>()
  let sessionDirty = false

  const answerQuestion = (questionNumber: number, answer: number) => {
    if (!currentSession.value) return

    // Immediately update the UI for responsiveness
    currentSession.value.answers.set(questionNumber, answer)
    sessionDirty = true

    // Batch pending answers for efficient storage updates
    pendingAnswers.set(questionNumber, answer)

    if (answerUpdateTimeout) {
      clearTimeout(answerUpdateTimeout)
    }

    answerUpdateTimeout = setTimeout(() => {
      // Apply all pending answers at once
      if (currentSession.value && pendingAnswers.size > 0) {
        pendingAnswers.forEach((value, key) => {
          currentSession.value!.answers.set(key, value)
        })
        pendingAnswers.clear()
        scheduleSave()
      }
      answerUpdateTimeout = null
    }, 250) // Reduced debounce time for better responsiveness
  }

  // Centralized save scheduling to prevent excessive sessionStorage writes
  const scheduleSave = () => {
    if (!sessionDirty) return

    if (sessionSaveTimeout) {
      clearTimeout(sessionSaveTimeout)
    }

    sessionSaveTimeout = setTimeout(() => {
      if (sessionDirty) {
        saveSessionToStorage()
        sessionDirty = false
      }
      sessionSaveTimeout = null
    }, 500) // Batch multiple operations into single save
  }

  const setCurrentQuestion = (questionNumber: number) => {
    if (currentSession.value) {
      currentSession.value.current_question = questionNumber
      sessionDirty = true
      scheduleSave() // Use centralized save scheduling
    }
  }

  const goToNextQuestion = () => {
    if (canGoNext.value) {
      setCurrentQuestion(currentQuestionNumber.value + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (canGoPrevious.value) {
      setCurrentQuestion(currentQuestionNumber.value - 1)
    }
  }

  const prepareSubmission = (): QuizSubmissionPayload | null => {
    if (!currentSession.value || !canSubmit.value) return null

    stopTimer()
    currentSession.value.is_submitted = true

    // Convert Map to Record format for API
    const answersRecord: Record<string, number> = {}
    currentSession.value.answers.forEach((value, key) => {
      answersRecord[key.toString()] = value
    })

    const submission: QuizSubmissionPayload = {
      quiz_id: currentSession.value.quiz_id,
      answers: answersRecord,
      time_taken: currentSession.value.time_elapsed,
    }

    saveSessionToStorage()
    return submission
  }

  const startTimer = () => {
    if (timer.value) clearInterval(timer.value)

    timer.value = setInterval(() => {
      if (currentSession.value && !currentSession.value.is_submitted) {
        currentSession.value.time_elapsed++

        // Auto-submit when time is up
        if (isTimeUp.value) {
          autoSubmitQuiz()
        }

        // Mark session as dirty and schedule periodic saves (every 30 seconds)
        if (currentSession.value.time_elapsed % 30 === 0) {
          sessionDirty = true
          scheduleSave()
        }
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  const autoSubmitQuiz = () => {
    // This would trigger automatic submission in the component
    // The actual submission is handled by the composable
  }

  const saveSessionToStorage = () => {
    if (!currentSession.value) return

    const sessionData = {
      ...currentSession.value,
      answers: Object.fromEntries(currentSession.value.answers),
    }

    sessionStorage.setItem(`quiz_session_${currentSession.value.quiz_id}`, JSON.stringify(sessionData))
  }

  const clearSession = () => {
    stopTimer()

    // Clear all pending operations
    if (answerUpdateTimeout) {
      clearTimeout(answerUpdateTimeout)
      answerUpdateTimeout = null
    }
    if (sessionSaveTimeout) {
      clearTimeout(sessionSaveTimeout)
      sessionSaveTimeout = null
    }
    pendingAnswers.clear()
    sessionDirty = false

    if (currentSession.value) {
      sessionStorage.removeItem(`quiz_session_${currentSession.value.quiz_id}`)
    }

    currentQuiz.value = null
    currentQuestions.value = []
    currentSession.value = null
  }

  const setLoadingState = (state: QuizLoadingState) => {
    loadingState.value = state
  }

  const setError = (err: QuizError | null) => {
    error.value = err
  }

  const clearError = () => {
    error.value = null
  }

  const resetStore = () => {
    clearSession()
    availableQuizzes.value = []
    completedQuizzes.value = []
    submissionStatuses.value = {}
    loadingState.value = 'idle'
    error.value = null
  }

  // Submission status management actions
  const setSubmissionStatus = (quizId: string, status: QuizSubmissionStatus) => {
    submissionStatuses.value[quizId] = status
  }

  const clearSubmissionStatus = (quizId: string) => {
    delete submissionStatuses.value[quizId]
  }

  const clearAllSubmissionStatuses = () => {
    submissionStatuses.value = {}
  }

  // Helper to get quiz by ID
  const getQuizById = (id: string): Quiz | undefined => {
    return availableQuizzes.value.find(quiz => quiz.id === id)
  }

  // API loading state management
  const setAPILoadingState = (key: keyof APILoadingStates, loading: boolean) => {
    apiLoadingStates.value[key] = loading
  }

  const setAllAPILoadingStates = (loading: boolean) => {
    Object.keys(apiLoadingStates.value).forEach(key => {
      apiLoadingStates.value[key as keyof APILoadingStates] = loading
    })
  }

  // Submission result management actions
  const storeSubmissionResult = (quizId: string, resultData: SubmissionResultData) => {
    if (!resultData) return

    // Convert submission response data to QuizResult format
    const quizResult: QuizResult = {
      id: resultData.id,
      quiz_id: resultData.quiz_id,
      quiz_title: currentQuiz.value?.title || 'Quiz',
      score: resultData.score,
      completed_at: resultData.completed_at,
      time_taken: currentSession.value?.time_elapsed || 0,
      email_sent: false // Default value as it's not in the submission response
    }

    storedResults.value[quizId] = quizResult

    // Store in sessionStorage for persistence across page refreshes
    sessionStorage.setItem(`quiz_result_${quizId}`, JSON.stringify(quizResult))
  }

  const getStoredResult = (quizId: string): QuizResult | null => {
    // First check in-memory storage
    if (storedResults.value[quizId]) {
      return storedResults.value[quizId]
    }

    // Then check sessionStorage
    try {
      const stored = sessionStorage.getItem(`quiz_result_${quizId}`)
      if (stored) {
        const result = JSON.parse(stored) as QuizResult
        storedResults.value[quizId] = result // Cache in memory
        return result
      }
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Failed to parse stored quiz result
    }

    return null
  }

  const clearStoredResult = (quizId: string) => {
    delete storedResults.value[quizId]
    sessionStorage.removeItem(`quiz_result_${quizId}`)
  }

  const clearAllStoredResults = () => {
    storedResults.value = {}
    // Clear all quiz results from sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('quiz_result_')) {
        sessionStorage.removeItem(key)
      }
    })
  }

  return {
    // State
    availableQuizzes,
    completedQuizzes,
    currentQuiz,
    currentQuestions,
    currentSession,
    submissionStatuses,
    loadingState,
    error,
    apiLoadingStates,
    storedResults,

    // Computed
    hasActiveSession,
    sessionTimeRemaining,
    isTimeUp,
    progressPercentage,
    currentQuestionNumber,
    totalQuestions,
    answeredQuestions,
    unansweredQuestions,
    canGoPrevious,
    canGoNext,
    isLastQuestion,
    canSubmit,
    isLoadingAnyAPI,
    isDataReady,
    getSubmissionStatus,
    canSubmitQuiz,

    // Actions
    setAvailableQuizzes,
    setCompletedQuizzes,
    setCurrentQuiz,
    startQuizSession,
    answerQuestion,
    setCurrentQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    prepareSubmission,
    clearSession,
    setLoadingState,
    setError,
    clearError,
    resetStore,
    getQuizById,
    setAPILoadingState,
    setAllAPILoadingStates,
    setSubmissionStatus,
    clearSubmissionStatus,
    clearAllSubmissionStatuses,
    storeSubmissionResult,
    getStoredResult,
    clearStoredResult,
    clearAllStoredResults,
  }
})