<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, Award, Clock } from 'lucide-vue-next'
import type { QuizScore } from '@/types/quiz'

const { t } = useI18n()

interface Props {
  score: QuizScore
  timeTaken: number
  quizTitle: string
}

const props = defineProps<Props>()

const scorePercentage = computed(() =>
  Math.round((props.score.total_score / props.score.max_possible_score) * 100)
)

const scoreLevel = computed(() => {
  const percentage = scorePercentage.value
  if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' }
  if (percentage >= 80) return { level: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-100' }
  if (percentage >= 70) return { level: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100' }
  if (percentage >= 60) return { level: 'Fair', color: 'text-orange-600', bg: 'bg-orange-100' }
  return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' }
})

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes === 0) {
    return `${remainingSeconds} seconds`
  }
  return `${minutes}m ${remainingSeconds}s`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Main Score Card -->
    <Card class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
      <CardHeader class="relative">
        <div class="flex items-center justify-between">
          <CardTitle class="text-xl font-semibold">
            Quiz Results
          </CardTitle>
          <Badge
            :class="[scoreLevel.bg, scoreLevel.color]"
            class="text-sm px-3 py-1"
          >
            {{ scoreLevel.level }}
          </Badge>
        </div>
        <p class="text-muted-foreground">
          {{ quizTitle }}
        </p>
      </CardHeader>

      <CardContent class="relative space-y-6">
        <!-- Score Circle -->
        <div class="flex items-center justify-center">
          <div class="relative">
            <!-- Circular Progress Background -->
            <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                stroke-width="8"
                fill="transparent"
                class="text-muted/20"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                stroke-width="8"
                fill="transparent"
                :stroke-dasharray="`${(scorePercentage / 100) * 339.292} 339.292`"
                class="text-primary transition-all duration-1000 ease-out"
                stroke-linecap="round"
              />
            </svg>

            <!-- Score Text -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="text-2xl font-bold">
                {{ score.total_score }}
              </div>
              <div class="text-sm text-muted-foreground">
                of {{ score.max_possible_score }}
              </div>
              <div class="text-lg font-semibold text-primary">
                {{ scorePercentage }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>{{ t('quiz.score.progress') }}</span>
            <span>{{ scorePercentage }}%</span>
          </div>
          <Progress
            :value="scorePercentage"
            class="h-3"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Statistics Grid -->
    <div class="grid gap-4 md:grid-cols-3">
      <!-- Score Details -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">{{ t('quiz.score.details') }}</CardTitle>
          <Target class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ score.total_score }}</div>
          <p class="text-xs text-muted-foreground">
            Out of {{ score.max_possible_score }} possible points
          </p>
        </CardContent>
      </Card>

      <!-- Performance Level -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Performance</CardTitle>
          <Award class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div :class="['text-2xl font-bold', scoreLevel.color]">
            {{ scoreLevel.level }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{ scorePercentage }}% achievement
          </p>
        </CardContent>
      </Card>

      <!-- Time Taken -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Time Taken</CardTitle>
          <Clock class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ formatDuration(timeTaken) }}</div>
          <p class="text-xs text-muted-foreground">
            Completed efficiently
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Interpretation Section -->
    <Card v-if="score.interpretation">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <TrendingUp class="h-5 w-5" />
          Interpretation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-sm leading-relaxed">
          {{ score.interpretation }}
        </p>
      </CardContent>
    </Card>

    <!-- Assessment Details -->
    <Card>
      <CardHeader>
        <CardTitle class="text-sm font-medium text-muted-foreground">
          Assessment Details
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span>Calculated on:</span>
          <span>{{ formatDate(score.calculated_at) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Duration:</span>
          <span>{{ formatDuration(timeTaken) }}</span>
        </div>
        <div v-if="score.severity_level" class="flex justify-between">
          <span>Severity Level:</span>
          <span>{{ score.severity_level }}</span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>