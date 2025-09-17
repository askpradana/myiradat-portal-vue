import { computed, watch } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import type { LikertOption } from '@/types/quiz'

export function useQuizSession() {
  const quizStore = useQuizStore()

  // Computed properties for current session
  const currentQuestion = computed(() => {
    if (!quizStore.currentQuestions.length || !quizStore.currentSession) return null
    const questionIndex = quizStore.currentQuestionNumber - 1
    return quizStore.currentQuestions[questionIndex] || null
  })

  const currentAnswer = computed(() => {
    if (!quizStore.currentSession) return null
    return quizStore.currentSession.answers.get(quizStore.currentQuestionNumber) || null
  })

  const hasAnsweredCurrentQuestion = computed(() => currentAnswer.value !== null)

  const progress = computed(() => ({
    current: quizStore.currentQuestionNumber,
    total: quizStore.totalQuestions,
    percentage: quizStore.progressPercentage,
    answered: quizStore.answeredQuestions,
    unanswered: quizStore.unansweredQuestions,
  }))

  const navigation = computed(() => ({
    canGoPrevious: quizStore.canGoPrevious,
    canGoNext: quizStore.canGoNext,
    isLastQuestion: quizStore.isLastQuestion,
    isFirstQuestion: quizStore.currentQuestionNumber === 1,
  }))

  const timer = computed(() => {
    if (!quizStore.currentSession || !quizStore.currentQuiz) return null

    const timeLimit = quizStore.currentQuiz.time_limit * 60 // Convert to seconds
    const elapsed = quizStore.currentSession.time_elapsed
    const remaining = Math.max(0, timeLimit - elapsed)

    return {
      started_at: quizStore.currentSession.start_time,
      elapsed_seconds: elapsed,
      time_limit_seconds: timeLimit,
      remaining_seconds: remaining,
      is_expired: remaining === 0,
    }
  })

  // Generate options for Likert scales
  const getLikertOptions = (scale: 'likert4' | 'likert5'): LikertOption[] => {
    if (scale === 'likert4') {
      return [
        { value: 1, label: 'Strongly Disagree', description: 'I completely disagree with this statement' },
        { value: 2, label: 'Disagree', description: 'I mostly disagree with this statement' },
        { value: 3, label: 'Agree', description: 'I mostly agree with this statement' },
        { value: 4, label: 'Strongly Agree', description: 'I completely agree with this statement' },
      ]
    } else {
      return [
        { value: 1, label: 'Strongly Disagree', description: 'I completely disagree with this statement' },
        { value: 2, label: 'Disagree', description: 'I mostly disagree with this statement' },
        { value: 3, label: 'Neutral', description: 'I neither agree nor disagree' },
        { value: 4, label: 'Agree', description: 'I mostly agree with this statement' },
        { value: 5, label: 'Strongly Agree', description: 'I completely agree with this statement' },
      ]
    }
  }

  // Actions
  const answerCurrentQuestion = (answer: number) => {
    if (quizStore.currentSession) {
      quizStore.answerQuestion(quizStore.currentQuestionNumber, answer)
    }
  }

  const goToQuestion = (questionNumber: number) => {
    if (questionNumber >= 1 && questionNumber <= quizStore.totalQuestions) {
      quizStore.setCurrentQuestion(questionNumber)
    }
  }

  const nextQuestion = () => {
    if (quizStore.canGoNext) {
      quizStore.goToNextQuestion()
    }
  }

  const previousQuestion = () => {
    if (quizStore.canGoPrevious) {
      quizStore.goToPreviousQuestion()
    }
  }

  const isQuestionAnswered = (questionNumber: number): boolean => {
    return quizStore.answeredQuestions.includes(questionNumber)
  }

  const getQuestionAnswer = (questionNumber: number): number | null => {
    return quizStore.currentSession?.answers.get(questionNumber) || null
  }

  // Watch for auto-submission when time expires
  watch(() => quizStore.isTimeUp, (isTimeUp) => {
    if (isTimeUp && quizStore.hasActiveSession) {
      // Emit event that can be caught by the component to handle auto-submission
    }
  })

  return {
    // State
    currentQuestion,
    currentAnswer,
    hasAnsweredCurrentQuestion,
    progress,
    navigation,
    timer,

    // Helpers
    getLikertOptions,
    isQuestionAnswered,
    getQuestionAnswer,

    // Actions
    answerCurrentQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,

    // Store reference
    quizStore,
  }
}