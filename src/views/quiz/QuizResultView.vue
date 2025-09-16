<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useQuizManagement } from '@/composables/quiz/useQuizManagement'
import { AlertTriangle, Loader2, Mail, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const quizId = computed(() => route.params.id as string)

const { useQuizResult } = useQuizManagement()

// Load quiz result
const {
  data: resultData,
  isLoading: isLoadingResult,
  error: resultError,
  refetch: refetchResult,
} = useQuizResult(quizId.value)

// Set dynamic page title
watch(
  () => resultData.value?.data,
  (data) => {
    if (data) {
      document.title = `${data.quiz_title} - Results`
    } else {
      document.title = 'Quiz Results - iradat'
    }
  },
  { immediate: true },
)

// Computed properties
const quizResult = computed(() => resultData.value?.data)

const hasError = computed(() => {
  return resultError.value || (!quizResult.value && !isLoadingResult.value)
})

const errorMessage = computed(() => {
  if (resultError.value) {
    return 'Failed to load quiz results. Please try again.'
  }
  if (!quizResult.value && !isLoadingResult.value) {
    return 'Quiz results not found.'
  }
  return ''
})

// Score calculations
const scorePercentage = computed(() => {
  if (!quizResult.value) return 0
  return Math.round(
    (quizResult.value.score.total_score / quizResult.value.score.max_possible_score) * 100,
  )
})

// Format recommendations from string to display nicely
const formattedRecommendations = computed(() => {
  if (!quizResult.value?.score.recommendations) return []

  // Split by periods, semicolons, or line breaks and filter out empty strings
  const recommendations = quizResult.value.score.recommendations
    .split(/[.;\n]|,\s*(?=\w)/)
    .map((rec) => rec.trim())
    .filter((rec) => rec.length > 0 && rec.length > 3) // Filter out very short fragments
    .map((rec) => rec.charAt(0).toUpperCase() + rec.slice(1)) // Capitalize first letter

  return recommendations.length > 0 ? recommendations : [quizResult.value.score.recommendations]
})

// Check if severity level should be displayed
const shouldDisplaySeverityLevel = computed(() => {
  return (
    quizResult.value?.score.severity_level && quizResult.value.score.severity_level.trim() !== ''
  )
})

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

// Handle actions
const handleBackToDashboard = () => {
  router.push('/dashboard')
}

const handleRetry = () => {
  refetchResult()
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Loading State -->
      <div v-if="isLoadingResult">
        <Card>
          <CardContent class="flex items-center justify-center py-16">
            <div class="text-center space-y-4">
              <Loader2 class="h-8 w-8 animate-spin mx-auto text-primary" />
              <p class="text-muted-foreground">Loading your results...</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle class="h-4 w-4" />
          <AlertDescription>
            {{ errorMessage }}
          </AlertDescription>
        </Alert>

        <div class="flex items-center justify-center gap-4">
          <Button @click="handleRetry" variant="outline"> Try Again </Button>
          <Button @click="handleBackToDashboard"> Back to Dashboard </Button>
        </div>
      </div>

      <!-- Results Content - 2 Cards Only -->
      <div v-else-if="quizResult" class="space-y-6">
        <!-- Card 1: Main Quiz Results -->
        <Card>
          <CardHeader class="text-center pb-4">
            <!-- Prominent Quiz Title -->
            <CardTitle class="text-2xl font-bold mb-4 text-foreground">
              {{ quizResult.quiz_title }}
            </CardTitle>

            <!-- Score as Indicator (smaller, less prominent) -->
            <div class="bg-muted/30 rounded-lg p-3 mb-2">
              <div class="text-lg font-medium text-muted-foreground mb-1">Score</div>
              <div class="text-2xl font-semibold text-foreground">
                {{ quizResult.score.total_score }} / {{ quizResult.score.max_possible_score }}
              </div>
              <div class="text-sm text-muted-foreground">({{ scorePercentage }}%)</div>
            </div>

            <!-- Severity Level Badge (if exists) -->
            <div v-if="shouldDisplaySeverityLevel" class="mt-2">
              <Badge variant="outline" class="text-xs">
                {{ quizResult.score.severity_level }}
              </Badge>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Interpretation -->
            <div v-if="quizResult.score.interpretation" class="bg-muted/50 rounded-lg p-4">
              <h4 class="font-medium text-sm mb-2 text-foreground">Assessment Result</h4>
              <p class="text-sm leading-relaxed">
                {{ quizResult.score.interpretation }}
              </p>
            </div>

            <!-- Recommendations -->
            <div v-if="quizResult.score.recommendations" class="space-y-3">
              <h4 class="font-medium text-sm text-foreground">Recommendations</h4>
              <div
                class="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
              >
                <ul
                  v-if="formattedRecommendations.length > 1"
                  class="space-y-2 text-sm text-muted-foreground"
                >
                  <li
                    v-for="recommendation in formattedRecommendations"
                    :key="recommendation"
                    class="flex items-start gap-2"
                  >
                    <span class="text-blue-600 dark:text-blue-400 mt-1 text-xs">→</span>
                    <span>{{ recommendation }}</span>
                  </li>
                </ul>
                <p v-else class="text-sm leading-relaxed text-muted-foreground">
                  {{ quizResult.score.recommendations }}
                </p>
              </div>
            </div>

            <!-- Quiz Details -->
            <div class="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
              <div class="text-center">
                <div class="font-medium">Duration</div>
                <div class="text-muted-foreground">{{ formatDuration(quizResult.time_taken) }}</div>
              </div>
              <div class="text-center">
                <div class="font-medium">Completed</div>
                <div class="text-muted-foreground">
                  {{ formatDate(quizResult.score.calculated_at) }}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Card 2: Actions -->
        <Card>
          <CardContent class="p-6 space-y-3">
            <!-- Send Results Email (Disabled) -->
            <Button
              disabled
              variant="outline"
              class="w-full flex items-center gap-2"
              title="Feature coming soon"
            >
              <Mail class="h-4 w-4" />
              Send Results via Email
            </Button>
            <p class="text-xs text-muted-foreground text-center">Email feature coming soon</p>

            <!-- Back to Dashboard -->
            <Button @click="handleBackToDashboard" class="w-full flex items-center gap-2">
              <ArrowLeft class="h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Fallback State -->
      <div v-else>
        <Card>
          <CardContent class="text-center py-16">
            <p class="text-muted-foreground mb-4">No results to display.</p>
            <Button @click="handleBackToDashboard"> Back to Dashboard </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
