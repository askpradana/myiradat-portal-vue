<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, AlertCircle } from 'lucide-vue-next'

const { t } = useI18n()
import QuizCard from './QuizCard.vue'
import CompletedQuizCard from './CompletedQuizCard.vue'
import QuizListFilter from '@/components/custom/filters/QuizListFilter.vue'
import type { Quiz, QuizSubmission } from '@/types/quiz'
import type { QuizFilterParams } from '@/components/custom/filters/QuizListFilter.vue'
import { useQuizFilter } from '@/composables/quiz/useQuizFilter'

interface Props {
  availableQuizzes: Quiz[]
  completedQuizzes: QuizSubmission[]
  isLoading?: boolean
  error?: string | null
  isCheckingSubmission?: (quizId: string) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null,
  isCheckingSubmission: () => () => false,
})

const emit = defineEmits<{
  takeQuiz: [quizId: string]
  viewResults: [quizId: string]
  retakeQuiz: [quizId: string]
  refreshData: []
}>()

const { currentFilters, filterQuizzes, getQuizCompletionStatus, updateFilters } = useQuizFilter()

// Filtered quizzes based on current filters
const filteredQuizzes = computed(() => {
  return filterQuizzes(props.availableQuizzes, props.completedQuizzes, currentFilters.value)
})

// Stats for display
const stats = computed(() => {
  const completedQuizIds = new Set(props.completedQuizzes.map(s => s.quiz_id))
  const availableCount = props.availableQuizzes.filter(q => !completedQuizIds.has(q.id)).length

  return {
    total: props.availableQuizzes.length,
    available: availableCount,
    completed: props.completedQuizzes.length,
    filtered: filteredQuizzes.value.length,
  }
})

// Determine if filters should be shown
const shouldShowFilters = computed(() => {
  // Hide filters during initial loading
  if (props.isLoading) return false

  // Hide filters if there's an error and no cached data
  if (props.error && props.availableQuizzes.length === 0 && props.completedQuizzes.length === 0) return false

  // Show filters if we have any quiz data (available or completed)
  return props.availableQuizzes.length > 0 || props.completedQuizzes.length > 0
})

const isQuizCompleted = computed(() => (quizId: string) => {
  return getQuizCompletionStatus(quizId, props.completedQuizzes).isCompleted
})

// Get completed quizzes for the completed filter view
const completedQuizzesForDisplay = computed(() => {
  if (currentFilters.value.completion_status !== 'completed') return []
  return props.completedQuizzes
})

const handleTakeQuiz = (quizId: string) => {
  emit('takeQuiz', quizId)
}

const handleViewResults = (quizId: string) => {
  emit('viewResults', quizId)
}

const handleRetakeQuiz = (quizId: string) => {
  emit('retakeQuiz', quizId)
}

const handleRefresh = () => {
  emit('refreshData')
}

// Filter handlers
const handleFiltersChanged = (filters: QuizFilterParams) => {
  updateFilters(filters)
}


// Get filter status text
const getFilterStatusText = computed(() => {
  const status = currentFilters.value.completion_status
  if (status === 'available') return t('quiz.messages.availableQuizzes')
  if (status === 'completed') return t('quiz.messages.completedQuizzes')
  return t('quiz.messages.allQuizzes')
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Stats -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">{{ t('quiz.titles.quizzes') }}</h1>
          <p class="text-muted-foreground">{{ t('quiz.messages.discoverQuizzes') }}</p>
        </div>
        <div v-if="shouldShowFilters" class="text-right">
          <div class="text-sm text-muted-foreground">
            {{ getFilterStatusText }}: {{ stats.filtered }} of {{ stats.total }}
          </div>
          <div class="text-xs text-muted-foreground">
            {{ t('quiz.messages.available') }}: {{ stats.available }} • {{ t('quiz.messages.completed') }}: {{ stats.completed }}
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Component with Loading State -->
    <QuizListFilter
      v-if="shouldShowFilters"
      :initial-filters="currentFilters"
      @filters-changed="handleFiltersChanged"
    />

    <!-- Filter Loading Skeleton -->
    <div v-else-if="isLoading" class="space-y-4">
      <div class="animate-pulse">
        <div class="h-10 bg-muted rounded-md w-full max-w-md"></div>
      </div>
      <div class="flex gap-2 animate-pulse">
        <div class="h-8 bg-muted rounded-full w-16"></div>
        <div class="h-8 bg-muted rounded-full w-20"></div>
        <div class="h-8 bg-muted rounded-full w-18"></div>
      </div>
    </div>

    <!-- Error State -->
    <Card v-if="error" class="border-destructive">
      <CardHeader>
        <div class="flex items-center gap-2">
          <AlertCircle class="h-5 w-5 text-destructive" />
          <CardTitle class="text-destructive">
            {{ shouldShowFilters ? 'Error Loading Additional Data' : 'Error Loading Quizzes' }}
          </CardTitle>
        </div>
        <CardDescription>
          {{ error }}
          <span v-if="shouldShowFilters" class="block mt-1 text-xs">
            Some quiz data is available below, but recent updates failed to load.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <button @click="handleRefresh" class="text-sm text-blue-600 hover:text-blue-800 underline">
          Try again
        </button>
      </CardContent>
    </Card>

    <!-- Main Content -->
    <div class="space-y-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <!-- Loading skeletons -->
        <Card v-for="n in 6" :key="n" class="animate-pulse">
          <CardHeader>
            <div class="h-4 bg-muted rounded w-3/4"></div>
            <div class="h-3 bg-muted rounded w-full"></div>
          </CardHeader>
          <CardContent>
            <div class="h-3 bg-muted rounded w-1/2"></div>
          </CardContent>
        </Card>
      </div>

      <!-- Empty State for Available/All Quizzes -->
      <div v-else-if="filteredQuizzes.length === 0 && currentFilters.completion_status !== 'completed'" class="text-center py-12">
        <BookOpen class="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 class="mt-4 text-lg font-semibold">
          {{ currentFilters.search_query ? 'No quizzes found' : 'No quizzes available' }}
        </h3>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ currentFilters.search_query ? 'Try adjusting your search or filters.' : 'Check back later for new quizzes.' }}
        </p>
      </div>

      <!-- Empty State for Completed Quizzes -->
      <div v-else-if="completedQuizzesForDisplay.length === 0 && currentFilters.completion_status === 'completed'" class="text-center py-12">
        <BookOpen class="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 class="mt-4 text-lg font-semibold">No completed quizzes</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          Complete your first quiz to see results here.
        </p>
      </div>

      <!-- Quiz Grid for Available/All -->
      <div v-else-if="currentFilters.completion_status !== 'completed'" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <QuizCard
          v-for="quiz in filteredQuizzes"
          :key="quiz.id"
          :quiz="quiz"
          :is-loading="isCheckingSubmission?.(quiz.id) || false"
          :is-completed="isQuizCompleted(quiz.id)"
          @take-quiz="handleTakeQuiz"
          @view-results="handleViewResults"
          @retake-quiz="handleRetakeQuiz"
        />
      </div>

      <!-- Completed Quizzes Grid -->
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CompletedQuizCard
          v-for="submission in completedQuizzesForDisplay"
          :key="submission.id"
          :submission="submission"
          @view-results="handleViewResults"
          @retake-quiz="handleRetakeQuiz"
        />
      </div>
    </div>
  </div>
</template>
