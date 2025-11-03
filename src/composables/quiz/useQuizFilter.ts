import { ref, computed } from 'vue'
import type { Quiz, QuizSubmission, QuizFilterParams } from '@/types/quiz'

export function useQuizFilter() {
  // Filter state
  const currentFilters = ref<QuizFilterParams>({
    search_query: '',
    completion_status: 'available',
    quiz_type: 'all',
    sort_order: 'title_asc',
  })

  // Filter and sort quizzes based on current filters
  const filterQuizzes = (
    availableQuizzes: Quiz[],
    completedQuizzes: QuizSubmission[],
    filters: QuizFilterParams
  ): Quiz[] => {
    let filteredQuizzes = [...availableQuizzes]

    // Create a set of completed quiz IDs for efficient lookup
    const completedQuizIds = new Set(completedQuizzes.map(submission => submission.quiz_id))

    // Apply completion status filter
    if (filters.completion_status === 'available') {
      // Only show quizzes that haven't been completed
      filteredQuizzes = filteredQuizzes.filter(quiz => !completedQuizIds.has(quiz.id))
    } else if (filters.completion_status === 'completed') {
      // Only show quizzes that have been completed
      filteredQuizzes = filteredQuizzes.filter(quiz => completedQuizIds.has(quiz.id))
    }
    // 'all' shows everything, so no filtering needed

    // Apply search filter
    if (filters.search_query) {
      const searchTerm = filters.search_query.toLowerCase().trim()
      filteredQuizzes = filteredQuizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm) ||
        quiz.description.toLowerCase().includes(searchTerm)
      )
    }

    // Apply quiz type filter
    if (filters.quiz_type && filters.quiz_type !== 'all') {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.quiz_type === filters.quiz_type)
    }

    // Apply sorting
    if (filters.sort_order) {
      switch (filters.sort_order) {
        case 'title_asc':
          filteredQuizzes.sort((a, b) => a.title.localeCompare(b.title))
          break
        case 'title_desc':
          filteredQuizzes.sort((a, b) => b.title.localeCompare(a.title))
          break
        case 'time_asc':
          filteredQuizzes.sort((a, b) => a.time_limit - b.time_limit)
          break
        case 'time_desc':
          filteredQuizzes.sort((a, b) => b.time_limit - a.time_limit)
          break
        default:
          // Default to title ascending
          filteredQuizzes.sort((a, b) => a.title.localeCompare(b.title))
      }
    }

    return filteredQuizzes
  }

  // Get quiz completion status for display
  const getQuizCompletionStatus = (
    quizId: string,
    completedQuizzes: QuizSubmission[]
  ) => {
    const submission = completedQuizzes.find(s => s.quiz_id === quizId)
    return {
      isCompleted: !!submission,
      completedAt: submission?.completed_at,
      submission,
    }
  }

  // Update current filters
  const updateFilters = (newFilters: QuizFilterParams) => {
    currentFilters.value = { ...currentFilters.value, ...newFilters }
  }

  // Reset filters to default
  const resetFilters = () => {
    currentFilters.value = {
      search_query: '',
      completion_status: 'available',
      quiz_type: 'all',
      sort_order: 'title_asc',
    }
  }

  // Computed statistics
  const getFilterStats = (
    availableQuizzes: Quiz[],
    completedQuizzes: QuizSubmission[]
  ) => {
    const completedQuizIds = new Set(completedQuizzes.map(s => s.quiz_id))

    return computed(() => ({
      total: availableQuizzes.length,
      completed: completedQuizzes.length,
      available: availableQuizzes.filter(q => !completedQuizIds.has(q.id)).length,
      byType: {
        likert4: availableQuizzes.filter(q => q.quiz_type === 'likert4').length,
        likert5: availableQuizzes.filter(q => q.quiz_type === 'likert5').length,
        yesno: availableQuizzes.filter(q => q.quiz_type === 'yesno').length,
        multiple_choice: availableQuizzes.filter(q => q.quiz_type === 'multiple_choice').length,
      }
    }))
  }

  return {
    currentFilters,
    filterQuizzes,
    getQuizCompletionStatus,
    updateFilters,
    resetFilters,
    getFilterStats,
  }
}