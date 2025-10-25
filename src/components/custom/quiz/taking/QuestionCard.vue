<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LikertScale from './LikertScale.vue'
import type { Question } from '@/types/quiz'

interface Props {
  question: Question
  questionNumber: number
  totalQuestions: number
  currentAnswer?: number | null
  quizType: 'likert4' | 'likert5' | 'yesno' | 'multiple_choice'
  disabled?: boolean
  mobileMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentAnswer: null,
  disabled: false,
  mobileMode: false,
})

const emit = defineEmits<{
  answer: [value: number]
}>()

const questionTitle = computed(() => `Question ${props.questionNumber} of ${props.totalQuestions}`)

const isLikertScale = computed(() => props.quizType === 'likert4' || props.quizType === 'likert5')

const likertScale = computed(() => props.quizType as 'likert4' | 'likert5')

const handleAnswer = (value: number) => {
  if (!props.disabled) {
    emit('answer', value)
  }
}

const getQuizTypeLabel = (type: string) => {
  switch (type) {
    case 'likert4':
      return '4-Point Scale'
    case 'likert5':
      return '5-Point Scale'
    case 'yesno':
      return 'Yes/No'
    default:
      return 'Assessment'
  }
}

const getQuizTypeBadgeVariant = (type: string) => {
  switch (type) {
    case 'likert4':
      return 'secondary'
    case 'likert5':
      return 'default'
    case 'yesno':
      return 'outline'
    default:
      return 'secondary'
  }
}
</script>

<template>
  <!-- Mobile Mode: Simplified layout without card styling -->
  <div v-if="mobileMode" class="w-full space-y-3">
    <!-- Question Content -->
    <div class="space-y-2">
      <h2 class="text-base font-medium leading-tight text-foreground line-clamp-3">
        {{ question.question_content }}
      </h2>

      <!-- Optional question help text -->
      <div v-if="question.question_type" class="text-xs text-muted-foreground">
        Consider how much you agree with this statement.
      </div>
    </div>

    <!-- Likert Scale -->
    <LikertScale
      v-if="isLikertScale"
      :scale="likertScale"
      :value="currentAnswer"
      :disabled="disabled"
      @update:value="handleAnswer"
    />

    <!-- Yes/No Questions (for future implementation) -->
    <div v-else-if="quizType === 'yesno'" class="space-y-4">
      <p class="text-sm text-muted-foreground text-center">Yes/No questions coming soon...</p>
    </div>

    <!-- Multiple Choice (for future implementation) -->
    <div v-else class="space-y-4">
      <p class="text-sm text-muted-foreground text-center">
        Multiple choice questions coming soon...
      </p>
    </div>

    <!-- Compact Answer Status -->
    <div
      v-if="currentAnswer !== null"
      class="flex items-center justify-center gap-2 text-xs text-green-700 bg-green-50 py-2 px-3 rounded-md border border-green-100"
    >
      <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
      <span>Tersimpan</span>
    </div>
  </div>

  <!-- Desktop Mode: Full card layout -->
  <Card
    v-else
    class="w-full max-w-4xl mx-auto shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <CardHeader class="space-y-4">
      <!-- Question Header -->
      <div class="flex items-center justify-between gap-4">
        <CardTitle class="text-lg font-semibold text-muted-foreground">
          {{ questionTitle }}
        </CardTitle>
        <Badge :variant="getQuizTypeBadgeVariant(quizType)" class="text-xs shrink-0">
          {{ getQuizTypeLabel(quizType) }}
        </Badge>
      </div>

      <!-- Question Content -->
      <div class="space-y-4">
        <h2 class="text-xl md:text-2xl font-medium leading-relaxed text-foreground">
          {{ question.question_content }}
        </h2>

        <!-- Optional question help text -->
        <div v-if="question.question_type" class="text-sm text-muted-foreground">
          Consider how much you agree with this statement.
        </div>
      </div>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- Likert Scale -->
      <LikertScale
        v-if="isLikertScale"
        :scale="likertScale"
        :value="currentAnswer"
        :disabled="disabled"
        @update:value="handleAnswer"
      />

      <!-- Yes/No Questions (for future implementation) -->
      <div v-else-if="quizType === 'yesno'" class="space-y-4">
        <p class="text-sm text-muted-foreground text-center">Yes/No questions coming soon...</p>
      </div>

      <!-- Multiple Choice (for future implementation) -->
      <div v-else class="space-y-4">
        <p class="text-sm text-muted-foreground text-center">
          Multiple choice questions coming soon...
        </p>
      </div>
    </CardContent>
  </Card>
</template>
