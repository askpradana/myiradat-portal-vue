<script setup lang="ts">
import { computed } from 'vue'
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

const emit = defineEmits<{
  takeQuiz: [quizId: string]
}>()

const buttonText = computed(() => {
  if (props.isLoading) return 'Checking...'
  if (props.isCompleted) return 'Completed'
  return 'Take Quiz'
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
    likert4: '4-Point Scale',
    likert5: '5-Point Scale',
    yesno: 'Yes/No'
  } as const
  return labels[type as keyof typeof labels] || 'Assessment'
}

const handleTakeQuiz = () => {
  emit('takeQuiz', props.quiz.id)
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
        <div class="flex items-center gap-1">
          <FileText class="h-4 w-4 flex-shrink-0" />
          <span>{{ quiz.questions }} questions</span>
        </div>
      </div>
    </CardContent>

    <CardFooter class="pt-3 mt-auto">
      <Button
        @click="handleTakeQuiz"
        :disabled="isLoading || isCompleted"
        :variant="isCompleted ? 'secondary' : 'default'"
        class="w-full min-h-[44px]"
        :class="{ 'opacity-75 cursor-not-allowed': isCompleted }"
        size="sm"
      >
        {{ buttonText }}
      </Button>
    </CardFooter>
  </Card>
</template>