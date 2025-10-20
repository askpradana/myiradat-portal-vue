<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  QuizProgress,
  QuestionCard,
  QuizNavigation
} from '@/components/custom/quiz'
import { CustomProgressLoader } from '@/components/custom/loading'
import { useQuizManagement } from '@/composables/quiz/useQuizManagement'
import { useQuizSession } from '@/composables/quiz/useQuizSession'
import { useQuizTimer } from '@/composables/quiz/useQuizTimer'
import DashboardLayout from '@/views/layouts/DashboardLayout.vue'
import BackToQuizButton from '@/components/custom/buttons/BackToQuizButton.vue'
import TruncatedText from '@/components/custom/TruncatedText.vue'
import { AlertTriangle, Loader2 } from 'lucide-vue-next'

const route = useRoute()
const quizId = computed(() => route.params.id as string)

const {
  useQuizDetail,
  submitCurrentQuiz,
  quizStore,
  isSubmitting
} = useQuizManagement()

// Set dynamic page title (you can add meta tag management later)
watch(() => quizStore.currentQuiz, (quiz) => {
  if (quiz) {
    document.title = `${quiz.title} - Quiz`
  } else {
    document.title = 'Taking Quiz - iradat'
  }
}, { immediate: true })

const {
  currentQuestion,
  currentAnswer,
  hasAnsweredCurrentQuestion,
  progress,
  navigation,
  answerCurrentQuestion,
  nextQuestion,
  previousQuestion,
} = useQuizSession()

const { onTimeExpired } = useQuizTimer()

// Load quiz details - manual loading to prevent duplicate calls
const {
  isLoading: isLoadingQuiz,
  error: quizDetailError,
  refetch: loadQuizDetail
} = useQuizDetail(quizId.value)

// Initialize quiz session immediately if we have an active session or load quiz data
const initializeQuiz = async () => {
  console.log('Initializing quiz...', { quizId: quizId.value, hasActiveSession: quizStore.hasActiveSession })

  // If we already have an active session for this quiz, we're good
  if (quizStore.hasActiveSession && quizStore.currentQuiz?.id === quizId.value) {
    console.log('Active session found for quiz:', quizId.value)
    return
  }

  // Otherwise, load the quiz data
  console.log('Loading quiz details for:', quizId.value)
  const data = await loadQuizDetail()

  if (data?.data && !quizStore.hasActiveSession) {
    console.log('Starting quiz session with:', { quiz: data.data.quiz, questions: data.data.questions })
    quizStore.startQuizSession(data.data.quiz, data.data.questions)
  } else {
    console.log('Session not started:', {
      hasData: !!data?.data,
      hasActiveSession: quizStore.hasActiveSession,
      quiz: data?.data?.quiz,
      questions: data?.data?.questions
    })
  }
}

// Initialize on mount
onMounted(async () => {
  await initializeQuiz()
})

// Handle auto-submission when time expires (background only)
onTimeExpired(() => {
  if (quizStore.hasActiveSession) {
    // Silent background submission - no user notification
    handleSubmit()
  }
})

// Handle navigation
const handlePrevious = () => {
  previousQuestion()
}

const handleNext = async () => {
  nextQuestion()
  // Note: Mobile scroll disabled - grid layout fits on screen without scrolling
}

const handleSubmit = async () => {
  if (!quizStore.canSubmit) {
    toast('Cannot Submit', {
      description: 'Please answer all questions before submitting.',
    })
    return
  }

  try {
    await submitCurrentQuiz()
    // Note: Mobile scroll disabled - grid layout fits on screen without scrolling
  } catch (error) {
    console.error('Submission failed:', error)
  }
}

const handleAnswer = (answer: number) => {
  answerCurrentQuestion(answer)
}


// Cleanup on unmount
onUnmounted(() => {
  // Session is automatically persisted, no need to clear
})

// Error state
const hasError = computed(() => {
  return quizDetailError.value || (!quizStore.currentQuiz && !isLoadingQuiz.value)
})

const errorMessage = computed(() => {
  if (quizDetailError.value) {
    return 'Failed to load quiz details. Please try again.'
  }
  if (!quizStore.currentQuiz && !isLoadingQuiz.value) {
    return 'Quiz not found or session expired.'
  }
  return ''
})

// Loading state
const isLoading = computed(() => {
  return isLoadingQuiz.value || (!quizStore.currentQuiz && !hasError.value)
})

// Mobile detection for optimized layout
// const isMobile = computed(() => {
//   // This will be handled by Tailwind responsive classes
//   return false // Placeholder - actual detection handled by CSS
// })
</script>

<template>
  <!-- Submission Loading Overlay -->
  <div
    v-if="isSubmitting"
    class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <Card class="w-auto">
      <CardContent class="flex items-center justify-center py-8 px-12">
        <CustomProgressLoader type="submission" :is-loading="isSubmitting" />
      </CardContent>
    </Card>
  </div>

  <!-- Mobile Quiz Layout (full screen on mobile) -->
  <div class="min-h-screen bg-background sm:hidden">
    <!-- Mobile Quiz Content -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center space-y-4">
        <Loader2 class="h-8 w-8 animate-spin mx-auto text-primary" />
        <p class="text-muted-foreground">Loading quiz...</p>
      </div>
    </div>

    <div v-else-if="hasError" class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center space-y-4">
        <Alert variant="destructive">
          <AlertTriangle class="h-4 w-4" />
          <AlertDescription>
            {{ errorMessage }}
          </AlertDescription>
        </Alert>
        <BackToQuizButton />
      </div>
    </div>

    <div v-else-if="quizStore.hasActiveSession && currentQuestion" class="flex flex-col min-h-screen">
      <!-- Minimal mobile header -->
      <div class="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <BackToQuizButton />
        <!-- Simple progress text only -->
        <span class="text-sm font-medium text-muted-foreground">
          {{ progress.current }} / {{ progress.total }}
        </span>
      </div>

      <!-- Quiz content -->
      <div class="flex-1 p-4 space-y-4 overflow-y-auto">
        <!-- Question Section -->
        <QuestionCard
          :question="currentQuestion"
          :question-number="progress.current"
          :total-questions="progress.total"
          :current-answer="currentAnswer"
          :quiz-type="quizStore.currentQuiz!.quiz_type"
          :disabled="isSubmitting"
          :mobile-mode="true"
          @answer="handleAnswer"
        />
      </div>

      <!-- Fixed bottom navigation -->
      <div class="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <QuizNavigation
          :can-go-previous="navigation.canGoPrevious"
          :can-go-next="navigation.canGoNext"
          :is-last-question="navigation.isLastQuestion"
          :is-first-question="navigation.isFirstQuestion"
          :has-current-answer="hasAnsweredCurrentQuestion"
          :is-submitting="isSubmitting"
          :show-submit-warning="false"
          :mobile-mode="true"
          @previous="handlePrevious"
          @next="handleNext"
          @submit="handleSubmit"
        />
      </div>
    </div>

    <div v-else class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center space-y-4">
        <Alert>
          <AlertTriangle class="h-4 w-4" />
          <AlertDescription>
            No active quiz session found. Please start a new quiz.
          </AlertDescription>
        </Alert>
        <BackToQuizButton />
      </div>
    </div>
  </div>

  <!-- Desktop/Tablet Layout (hidden on mobile) -->
  <DashboardLayout maxWidth="max-w-4xl" padding="px-4 py-6" class="hidden sm:block">
    <!-- Header with Back Button and Quiz Info -->
    <div class="mb-6">
      <BackToQuizButton />

      <div v-if="quizStore.currentQuiz" class="mt-4">
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 leading-tight">
          {{ quizStore.currentQuiz.title }}
        </h1>
        <TruncatedText
          :text="quizStore.currentQuiz.description"
          :max-length="200"
          text-class="text-sm sm:text-base text-muted-foreground leading-relaxed"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading">
      <Card>
        <CardContent class="flex items-center justify-center py-12">
          <div class="text-center space-y-4">
            <Loader2 class="h-8 w-8 animate-spin mx-auto text-primary" />
            <p class="text-muted-foreground">Loading quiz...</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError">
      <Alert variant="destructive">
        <AlertTriangle class="h-4 w-4" />
        <AlertDescription>
          {{ errorMessage }}
        </AlertDescription>
      </Alert>

      <div class="mt-6 text-center">
        <BackToQuizButton />
      </div>
    </div>

    <!-- Quiz Content -->
    <div v-else-if="quizStore.hasActiveSession && currentQuestion" class="space-y-6">
      <!-- Progress Section -->
      <QuizProgress
        :current="progress.current"
        :total="progress.total"
        :percentage="progress.percentage"
        :answered="progress.answered"
      />


      <!-- Question Section -->
      <QuestionCard
        :question="currentQuestion"
        :question-number="progress.current"
        :total-questions="progress.total"
        :current-answer="currentAnswer"
        :quiz-type="quizStore.currentQuiz!.quiz_type"
        :disabled="isSubmitting"
        @answer="handleAnswer"
      />

      <!-- Navigation Section -->
      <QuizNavigation
        :can-go-previous="navigation.canGoPrevious"
        :can-go-next="navigation.canGoNext"
        :is-last-question="navigation.isLastQuestion"
        :is-first-question="navigation.isFirstQuestion"
        :has-current-answer="hasAnsweredCurrentQuestion"
        :is-submitting="isSubmitting"
        :show-submit-warning="navigation.isLastQuestion && hasAnsweredCurrentQuestion"
        @previous="handlePrevious"
        @next="handleNext"
        @submit="handleSubmit"
      />
    </div>

    <!-- Session Error State -->
    <div v-else>
      <Alert>
        <AlertTriangle class="h-4 w-4" />
        <AlertDescription>
          No active quiz session found. Please start a new quiz.
        </AlertDescription>
      </Alert>

      <div class="mt-6 text-center">
        <BackToQuizButton />
      </div>
    </div>
  </DashboardLayout>
</template>