<template>
  <div class="space-y-6">
    <!-- Last Analysis Information -->
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
              <div class="text-foreground">{{ formatDate(lastAnalyzed.analyzed_at) }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-muted-foreground">Jenis Analisis</div>
              <div class="text-foreground capitalize">{{ lastAnalyzed.last_analyzed }}</div>
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-muted-foreground mb-2">Komentar Analisis</div>
            <div class="text-foreground bg-muted p-3 rounded-lg">
              {{ lastAnalyzed.comment }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssessmentData } from '@/composables/data/useAssessmentData'

const { assessmentData, formatAssessmentDate } = useAssessmentData()

const lastAnalyzed = computed(() => assessmentData.value?.lastAnalyzed)

// Helper functions
const formatDate = (date?: string): string => {
  return formatAssessmentDate(date)
}
</script>
