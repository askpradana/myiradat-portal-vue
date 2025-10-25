<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const { t } = useI18n()
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Lightbulb,
  BookOpen,
  Users,
  Target,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
} from 'lucide-vue-next'

interface Props {
  recommendations: string
  quizTitle: string
  severityLevel?: string
}

const props = defineProps<Props>()

// Parse recommendations into actionable items
const parsedRecommendations = computed(() => {
  if (!props.recommendations) return []

  // Split only by line breaks and clean up
  const items = props.recommendations
    .split(/\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 6) // Limit to 6 recommendations

  return items.map((item, index) => ({
    id: index + 1,
    text: item,
    priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
    category: getRecommendationCategory(item),
    icon: getRecommendationIcon(item),
  }))
})

const getRecommendationCategory = (text: string): string => {
  const lowerText = text.toLowerCase()

  if (
    lowerText.includes('communication') ||
    lowerText.includes('talk') ||
    lowerText.includes('discuss')
  ) {
    return 'Communication'
  }
  if (
    lowerText.includes('exercise') ||
    lowerText.includes('physical') ||
    lowerText.includes('activity')
  ) {
    return 'Physical Health'
  }
  if (
    lowerText.includes('stress') ||
    lowerText.includes('relax') ||
    lowerText.includes('mindfulness')
  ) {
    return 'Mental Health'
  }
  if (
    lowerText.includes('professional') ||
    lowerText.includes('counselor') ||
    lowerText.includes('therapy')
  ) {
    return 'Professional Help'
  }
  if (
    lowerText.includes('family') ||
    lowerText.includes('home') ||
    lowerText.includes('relationship')
  ) {
    return 'Family & Home'
  }
  if (
    lowerText.includes('financial') ||
    lowerText.includes('money') ||
    lowerText.includes('budget')
  ) {
    return 'Financial'
  }

  return 'General'
}

const getRecommendationIcon = (text: string) => {
  const category = getRecommendationCategory(text)

  switch (category) {
    case 'Communication':
      return Users
    case 'Physical Health':
      return TrendingUp
    case 'Mental Health':
      return Target
    case 'Professional Help':
      return BookOpen
    case 'Family & Home':
      return Users
    case 'Financial':
      return Target
    default:
      return Lightbulb
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return { variant: 'destructive', text: t('quiz.recommendations.priority.high') }
    case 'medium':
      return { variant: 'default', text: t('quiz.recommendations.priority.medium') }
    case 'low':
      return { variant: 'secondary', text: t('quiz.recommendations.priority.low') }
    default:
      return { variant: 'secondary', text: t('quiz.recommendations.priority.general') }
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Communication':
      return 'text-blue-600 bg-blue-100'
    case 'Physical Health':
      return 'text-green-600 bg-green-100'
    case 'Mental Health':
      return 'text-purple-600 bg-purple-100'
    case 'Professional Help':
      return 'text-orange-600 bg-orange-100'
    case 'Family & Home':
      return 'text-pink-600 bg-pink-100'
    case 'Financial':
      return 'text-yellow-600 bg-yellow-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const hasRecommendations = computed(() => parsedRecommendations.value.length > 0)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Lightbulb class="h-5 w-5 text-yellow-600" />
          {{ t('quiz.recommendations.title') }}
        </CardTitle>
        <p class="text-sm text-muted-foreground">
          {{ t('quiz.recommendations.description', { quizTitle }) }}
        </p>
      </CardHeader>
    </Card>

    <!-- No Recommendations State -->
    <Card v-if="!hasRecommendations">
      <CardContent class="text-center py-8">
        <CheckCircle2 class="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h3 class="text-lg font-semibold mb-2">{{ t('quiz.recommendations.greatJob') }}</h3>
        <p class="text-muted-foreground">
          {{ t('quiz.recommendations.keepUpGoodWork') }}
        </p>
      </CardContent>
    </Card>

    <!-- Recommendations List -->
    <div v-else class="space-y-4">
      <div v-for="recommendation in parsedRecommendations" :key="recommendation.id" class="group">
        <Card class="transition-shadow hover:shadow-md">
          <CardContent class="p-4">
            <div class="flex items-start gap-3">
              <!-- Icon -->
              <div :class="['p-2 rounded-lg shrink-0', getCategoryColor(recommendation.category)]">
                <component :is="recommendation.icon" class="h-4 w-4" />
              </div>

              <!-- Content -->
              <div class="flex-1 space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm leading-relaxed">
                    {{ recommendation.text }}
                  </p>
                  <Badge
                    :variant="getPriorityBadge(recommendation.priority).variant as any"
                    class="text-xs shrink-0"
                  >
                    {{ getPriorityBadge(recommendation.priority).text }}
                  </Badge>
                </div>

                <!-- Category -->
                <div class="flex items-center gap-2">
                  <Badge variant="outline" class="text-xs">
                    {{ recommendation.category }}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Action Section -->
    <Card>
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium">{{ t('quiz.recommendations.needMoreSupport') }}</h4>
            <p class="text-sm text-muted-foreground">
              {{ t('quiz.recommendations.professionalGuidance') }}
            </p>
          </div>
          <Button variant="outline" size="sm" class="shrink-0">
            <ExternalLink class="h-4 w-4 mr-2" />
            {{ t('quiz.recommendations.findHelp') }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Severity Level Info -->
    <Card v-if="severityLevel">
      <CardContent class="p-4">
        <div class="flex items-center gap-2">
          <Target class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm font-medium">{{ t('quiz.score.level') }}:</span>
          <Badge variant="outline">{{ severityLevel }}</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
