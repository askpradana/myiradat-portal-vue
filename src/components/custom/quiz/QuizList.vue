<script setup lang="ts">
import { ref, computed } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import QuizCard from './QuizCard.vue'
import CompletedQuizCard from './CompletedQuizCard.vue'
import type { Quiz, QuizSubmission } from '@/types/quiz'

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

const activeTab = ref('available')

const stats = computed(() => ({
  totalAvailable: props.availableQuizzes.length,
  totalCompleted: props.completedQuizzes.length,
  completionRate: props.availableQuizzes.length > 0
    ? Math.round((props.completedQuizzes.length / props.availableQuizzes.length) * 100)
    : 0,
}))

const isQuizCompleted = computed(() => (quizId: string) => {
  return props.completedQuizzes.some(submission => submission.quiz_id === quizId)
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
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Stats -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Quizzes</h1>
          <p class="text-muted-foreground">
            Take assessments and track your progress
          </p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Available Quizzes</CardTitle>
            <BookOpen class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.totalAvailable }}</div>
            <p class="text-xs text-muted-foreground">
              Ready to take
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.totalCompleted }}</div>
            <p class="text-xs text-muted-foreground">
              Assessments finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Completion Rate</CardTitle>
            <Badge variant="secondary" class="text-xs">
              {{ stats.completionRate }}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.completionRate }}%</div>
            <p class="text-xs text-muted-foreground">
              Of available quizzes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Error State -->
    <Card v-if="error" class="border-destructive">
      <CardHeader>
        <div class="flex items-center gap-2">
          <AlertCircle class="h-5 w-5 text-destructive" />
          <CardTitle class="text-destructive">Error Loading Quizzes</CardTitle>
        </div>
        <CardDescription>
          {{ error }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <button
          @click="handleRefresh"
          class="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Try again
        </button>
      </CardContent>
    </Card>

    <!-- Main Content Tabs -->
    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="available" class="flex items-center gap-2">
          <BookOpen class="h-4 w-4" />
          Available ({{ stats.totalAvailable }})
        </TabsTrigger>
        <TabsTrigger value="completed" class="flex items-center gap-2">
          <CheckCircle2 class="h-4 w-4" />
          Completed ({{ stats.totalCompleted }})
        </TabsTrigger>
      </TabsList>

      <!-- Available Quizzes Tab -->
      <TabsContent value="available" class="space-y-4">
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

        <div
          v-else-if="availableQuizzes.length === 0"
          class="text-center py-12"
        >
          <BookOpen class="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 class="mt-4 text-lg font-semibold">No quizzes available</h3>
          <p class="mt-2 text-sm text-muted-foreground">
            Check back later for new assessments.
          </p>
        </div>

        <div
          v-else
          class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <QuizCard
            v-for="quiz in availableQuizzes"
            :key="quiz.id"
            :quiz="quiz"
            :is-loading="isCheckingSubmission?.(quiz.id) || false"
            :is-completed="isQuizCompleted(quiz.id)"
            @take-quiz="handleTakeQuiz"
          />
        </div>
      </TabsContent>

      <!-- Completed Quizzes Tab -->
      <TabsContent value="completed" class="space-y-4">
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

        <div
          v-else-if="completedQuizzes.length === 0"
          class="text-center py-12"
        >
          <CheckCircle2 class="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 class="mt-4 text-lg font-semibold">No completed quizzes</h3>
          <p class="mt-2 text-sm text-muted-foreground">
            Complete your first quiz to see results here.
          </p>
        </div>

        <div
          v-else
          class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <CompletedQuizCard
            v-for="submission in completedQuizzes"
            :key="submission.id"
            :submission="submission"
            @view-results="handleViewResults"
            @retake-quiz="handleRetakeQuiz"
          />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>