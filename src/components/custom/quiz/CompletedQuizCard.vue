<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Clock, CheckCircle2, Users, AlertTriangle } from 'lucide-vue-next'
import type { QuizSubmission } from '@/types/quiz'

interface Props {
  submission: QuizSubmission
}

const props = defineProps<Props>()

const emit = defineEmits<{
  viewResults: [quizId: string]
  retakeQuiz: [quizId: string]
}>()

// Confirmation dialog state
const showRetakeConfirmation = ref(false)

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes === 0) {
    return `${remainingSeconds}s`
  }
  return `${minutes}m ${remainingSeconds}s`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleViewResults = () => {
  emit('viewResults', props.submission.id)
}

const handleRetakeQuizClick = () => {
  showRetakeConfirmation.value = true
}

const handleConfirmRetake = () => {
  showRetakeConfirmation.value = false
  emit('retakeQuiz', props.submission.quiz_id)
}

const handleCancelRetake = () => {
  showRetakeConfirmation.value = false
}
</script>

<template>
  <Card class="h-full hover:shadow-md transition-shadow duration-200 border-border flex flex-col">
    <CardHeader class="pb-3 flex-grow-0">
      <div class="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
        <CardTitle class="text-lg sm:text-xl font-semibold leading-tight min-w-0 flex-1">
          {{ props.submission.quiz_title }}
        </CardTitle>
        <div class="flex items-center gap-1 text-green-600 shrink-0 mt-1 sm:mt-0">
          <CheckCircle2 class="h-4 w-4 flex-shrink-0" />
          <span class="text-xs font-medium">Completed</span>
        </div>
      </div>
      <CardDescription class="text-sm text-muted-foreground">
        Completed on {{ formatDate(props.submission.completed_at) }}
      </CardDescription>
    </CardHeader>

    <CardContent class="py-3 flex-grow">
      <div class="flex items-center gap-3 sm:gap-4 text-sm text-muted-foreground flex-wrap">
        <div class="flex items-center gap-1">
          <Clock class="h-4 w-4 flex-shrink-0" />
          <span>{{ formatDuration(props.submission.time_taken) }} taken</span>
        </div>
        <div
          v-if="props.submission.email_sent"
          class="flex items-center gap-1 text-blue-600"
        >
          <Users class="h-4 w-4 flex-shrink-0" />
          <span class="text-xs">Results sent</span>
        </div>
      </div>
    </CardContent>

    <CardFooter class="pt-3 gap-2 mt-auto">
      <Button
        @click="handleViewResults"
        variant="default"
        size="sm"
        class="flex-1 min-h-[44px]"
      >
        View Results
      </Button>
      <Button
        @click="handleRetakeQuizClick"
        variant="outline"
        size="sm"
        class="flex-1 min-h-[44px]"
      >
        Retake
      </Button>
    </CardFooter>
  </Card>

  <!-- Retake Confirmation Dialog -->
  <AlertDialog :open="showRetakeConfirmation">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="flex items-center gap-2">
          <AlertTriangle class="h-5 w-5 text-amber-500" />
          Retake Quiz Confirmation
        </AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to retake "<strong>{{ props.submission.quiz_title }}</strong>"?
          <br><br>
          <span class="text-amber-600 dark:text-amber-400 font-medium">
            Warning: This will permanently replace your existing submission and results with the new submission.
          </span>
          <br>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancelRetake">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction @click="handleConfirmRetake" variant="destructive">
          Yes, Retake Quiz
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>