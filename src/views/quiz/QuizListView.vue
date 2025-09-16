<script setup lang="ts">
import { onMounted } from 'vue'
import { QuizList } from '@/components/custom/quiz'
import { useQuizManagement } from '@/composables/quiz/useQuizManagement'

// Set page title (you can add meta tag management later)
document.title = 'Quizzes - iradat'

const {
  availableQuizzes,
  completedQuizzes,
  isLoading,
  isSubmitting,
  error,
  startQuiz,
  viewQuizResult,
  retakeQuiz,
  refreshData,
  fetchData,
  clearError,
  isCheckingQuizSubmission,
} = useQuizManagement()

// Handle quiz actions
const handleTakeQuiz = async (quizId: string) => {
  await startQuiz(quizId)
}

const handleViewResults = (quizId: string) => {
  viewQuizResult(quizId)
}

const handleRetakeQuiz = async (quizId: string) => {
  await retakeQuiz(quizId)
}

const handleRefreshData = async () => {
  await refreshData()
}

// Initialize data on mount
onMounted(async () => {
  // Clear any previous errors and fetch fresh data
  clearError()
  await fetchData()
})
</script>

<template>
  <QuizList
    :available-quizzes="availableQuizzes"
    :completed-quizzes="completedQuizzes"
    :is-loading="isLoading || isSubmitting"
    :error="error"
    :is-checking-submission="isCheckingQuizSubmission"
    @take-quiz="handleTakeQuiz"
    @view-results="handleViewResults"
    @retake-quiz="handleRetakeQuiz"
    @refresh-data="handleRefreshData"
  />
</template>