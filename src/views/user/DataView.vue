<template>
  <div class="space-y-6">
    <!-- Assessment Overview -->
    <AssessmentOverview />

    <!-- Assessment Cards -->
    <div class="space-y-6">
      <!-- Error State -->
      <div v-if="error && !isLoading" class="text-center py-12">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">Failed to Load Assessment Data</h3>
        <p class="text-muted-foreground mb-4">
          {{ error.message || 'An error occurred while loading your assessment data.' }}
        </p>
        <Button @click="refetchAssessmentData" variant="outline">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </Button>
      </div>

      <!-- Assessment Cards -->
      <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- IPRO Assessment -->
        <AssessmentCard
          title="IPRO Assessment"
          description="Psychological assessment measuring personality traits and behavioral tendencies"
          type="ipro"
          :data="getAssessmentData('ipro').value"
          :is-loading="isLoading"
          :max-summary-items="6"
        />

        <!-- IPROB Assessment -->
        <AssessmentCard
          title="IPROB Assessment"
          description="Behavioral assessment evaluating work-related personality characteristics"
          type="iprob"
          :data="getAssessmentData('iprob').value"
          :is-loading="isLoading"
          :max-summary-items="6"
        />

        <!-- IPROS Assessment (Full Width) -->
        <div class="xl:col-span-2">
          <AssessmentCard
            title="IPROS Assessment"
            description="Comprehensive psychological evaluation measuring cognitive abilities and work competencies"
            type="ipros"
            :data="getAssessmentData('ipros').value"
            :is-loading="isLoading"
            :max-summary-items="8"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

// Import new components
import AssessmentOverview from '@/components/assessment/AssessmentOverview.vue'
import AssessmentCard from '@/components/assessment/AssessmentCard.vue'

// Import composable
import { useAssessmentData } from '@/composables/data/useAssessmentData'

// Router
// const router = useRouter()

// Composable
const { isLoading, error, getAssessmentData, refetchAssessmentData } = useAssessmentData()

</script>
