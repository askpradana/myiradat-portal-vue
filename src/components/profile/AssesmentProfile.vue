<template>
  <div class="space-y-6">
    <!-- Last Analysis Information (Re-implemented from AssessmentOverview) -->
    <Card v-if="lastAnalyzed">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Hasil Analisis Terakhir</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm font-medium text-muted-foreground">Tanggal Analisis</div>
              <p class="text-foreground">{{ formatDate(lastAnalyzed?.analyzed_at) }}</p>
            </div>
            <div>
              <div class="text-sm font-medium text-muted-foreground">Jenis Analisis</div>
              <p class="text-foreground capitalize">{{ props.lastAnalyzed?.last_analyzed }}</p>
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-muted-foreground mb-2">Komentar Analisis</div>
            <p class="text-foreground bg-muted p-3 rounded-lg">
              {{ lastAnalyzed?.comment }}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

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
      <div v-else-if="!isLoading && (ipro || iprob || ipros)" class="space-y-6">
        <!-- IPRO Assessment -->
        <AssessmentCard
          v-if="ipro"
          title="IPRO Assessment"
          description="Psychological assessment measuring personality traits and behavioral tendencies"
          type="ipro"
          :data="ipro as unknown as Record<string, string>"
          :is-loading="isLoading"
          :max-summary-items="6"
        />

        <!-- IPROB Assessment -->
        <AssessmentCard
          v-if="iprob"
          title="IPROB Assessment"
          description="Behavioral assessment evaluating work-related personality characteristics"
          type="iprob"
          :data="iprob as unknown as Record<string, string>"
          :is-loading="isLoading"
          :max-summary-items="6"
        />

        <!-- IPROS Assessment (Full Width) -->
        <div v-if="ipros" class="xl:col-span-2">
          <AssessmentCard
            title="IPROS Assessment"
            description="Comprehensive psychological evaluation measuring cognitive abilities and work competencies"
            type="ipros"
            :data="ipros as unknown as Record<string, string>"
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
import type {
  IPROSInterface,
  IPROBInterface,
  IPROInterface,
  LastAnalyzedInterface,
} from '@/types/userType'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AssessmentCard from '@/components/assessment/AssessmentCard.vue'

const props = defineProps<{
  ipros: IPROSInterface | undefined
  iprob: IPROBInterface | undefined
  ipro: IPROInterface | undefined
  lastAnalyzed: LastAnalyzedInterface | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}>()

const refetchAssessmentData = () => {
  props.refetch()
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)
}
</script>
