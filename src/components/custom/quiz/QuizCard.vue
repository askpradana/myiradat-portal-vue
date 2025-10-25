<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, FileText } from 'lucide-vue-next'
import TruncatedText from '@/components/custom/TruncatedText.vue'
import type { Quiz } from '@/types/quiz'

interface Props {
  quiz: Quiz
  isLoading?: boolean
  isCompleted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isCompleted: false,
})

const { t } = useI18n()

const emit = defineEmits<{
  takeQuiz: [quizId: string]
  viewResults: [quizId: string]
  retakeQuiz: [quizId: string]
}>()

const buttonText = computed(() => {
  if (props.isLoading) return t('common.states.loading')
  if (props.isCompleted) return t('quiz.status.completed')
  return t('quiz.actions.startQuiz')
})

const getQuizTypeBadgeVariant = (type: string) => {
  const variants = {
    likert4: 'secondary',
    likert5: 'default',
    yesno: 'outline'
  } as const
  return variants[type as keyof typeof variants] || 'secondary'
}

const getQuizTypeLabel = (type: string) => {
  const labels = {
    likert4: t('quiz.types.fourPointScale'),
    likert5: t('quiz.types.fivePointScale'),
    yesno: t('quiz.types.yesNo')
  } as const
  return labels[type as keyof typeof labels] || t('quiz.types.assessment')
}

const handleTakeQuiz = () => {
  emit('takeQuiz', props.quiz.id)
}

const handleViewResults = () => {
  emit('viewResults', props.quiz.id)
}

const handleRetakeQuiz = () => {
  emit('retakeQuiz', props.quiz.id)
}

</script>

<template>
  <Card
    class="h-full transition-all duration-200 border-border flex flex-col"
    :class="[
      isCompleted
        ? 'bg-muted/30 border-muted hover:shadow-sm'
        : 'hover:shadow-md'
    ]"
  >
    <CardHeader class="pb-3 flex-grow-0">
      <div class="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
        <CardTitle class="text-lg sm:text-xl font-semibold leading-tight min-w-0 flex-1">
          {{ quiz.title }}
        </CardTitle>
        <Badge
          :variant="getQuizTypeBadgeVariant(quiz.quiz_type)"
          class="text-xs shrink-0 mt-1 sm:mt-0"
        >
          {{ getQuizTypeLabel(quiz.quiz_type) }}
        </Badge>
      </div>
      <TruncatedText
        :text="quiz.description"
        :max-length="120"
        text-class="text-sm text-muted-foreground leading-relaxed"
      />
    </CardHeader>

    <CardContent class="py-3 flex-grow">
      <div class="flex items-center gap-3 sm:gap-4 text-sm text-muted-foreground flex-wrap">
        <div class="flex items-center gap-1">
          <Clock class="h-4 w-4 flex-shrink-0" />
          <span>{{ quiz.time_limit }} min</span>
        </div>
        <div
          v-if="quiz.questions && quiz.questions > 0"
          class="flex items-center gap-1"
        >
          <FileText class="h-4 w-4 flex-shrink-0" />
          <span>{{ t('quiz.labels.questions', { count: quiz.questions }) }}</span>
        </div>
      </div>
    </CardContent>

    <CardFooter class="pt-3 mt-auto">
      <!-- Single button for non-completed quizzes -->
      <Button
        v-if="!isCompleted"
        @click="handleTakeQuiz"
        :disabled="isLoading"
        variant="default"
        class="w-full min-h-[44px]"
        size="sm"
      >
        {{ buttonText }}
      </Button>

      <!-- Dual buttons for completed quizzes -->
      <div v-else class="flex gap-2 w-full">
        <Button
          @click="handleViewResults"
          variant="default"
          class="flex-1 min-h-[44px]"
          size="sm"
        >
          {{ t('quiz.actions.viewResults') }}
        </Button>
        <Button
          @click="handleRetakeQuiz"
          variant="outline"
          class="flex-1 min-h-[44px]"
          size="sm"
        >
          {{ t('quiz.actions.retakeQuiz') }}
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>