<template>
  <Card class="ipros-quiz-card">
    <CardHeader>
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <CardTitle class="text-lg font-semibold text-foreground">IPROS Results</CardTitle>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Privilege Status Badge -->
          <div class="px-2 py-1 rounded text-xs font-medium" :class="privilegeBadgeClasses">
            {{ getPrivilegeStatus }}
          </div>

          <!-- Sync Button (replacing chevron) -->
          <Button
            variant="ghost"
            size="sm"
            :disabled="isLoading"
            @click="handleSync"
            class="p-2 rounded-full hover:bg-accent transition-colors"
            :aria-label="isLoading ? 'Menyinkronkan data' : 'Sinkronkan data IPROS'"
          >
            <RefreshCw
              :class="{ 'animate-spin': isLoading }"
              :size="16"
              class="text-muted-foreground hover:text-foreground transition-colors"
            />
          </Button>
        </div>
      </div>

      <!-- Last Sync Info -->
      <div v-if="iprosData && !isLoading" class="text-xs text-muted-foreground mt-2">
        Terakhir disinkronkan: {{ formatSyncDate(iprosData.syncedAt) }}
      </div>
    </CardHeader>

    <CardContent>
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <div class="text-center py-6">
          <RefreshCw class="w-8 h-8 mx-auto text-blue-500 animate-spin mb-3" />
          <p class="text-sm text-muted-foreground">Menyinkronkan data IPROS...</p>
        </div>
        <!-- Loading Skeletons -->
        <div class="space-y-3">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      <!-- Data Unavailable State (204 responses - not an error) -->
      <div v-else-if="syncState === 'data-unavailable'" class="text-center py-8">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center"
        >
          <Database class="w-8 h-8 text-blue-600" />
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">Data Not Available</h3>
        <p class="text-muted-foreground mb-2">Your data is not yet available in the IPROS system</p>
        <p class="text-xs text-muted-foreground mb-4">
          Please check back later or contact support if you believe this is incorrect
        </p>
        <Button @click="handleRetry" variant="outline" size="sm">
          <RefreshCw class="w-4 h-4 mr-2" />
          Check Again
        </Button>
      </div>

      <!-- Actual Error State (network/API errors) -->
      <div v-else-if="error && syncState === 'error'" class="text-center py-8">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
        >
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">Sync Failed</h3>
        <p class="text-muted-foreground mb-4">{{ error.message }}</p>
        <Button @click="handleRetry" variant="outline" size="sm">
          <RefreshCw class="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>

      <!-- Incomplete Quizzes State (user has access but hasn't completed quizzes) -->
      <div
        v-else-if="iprosData && !iprosData.hasPrivileges && !iprosData.isDataUnavailable"
        class="text-center py-8"
      >
        <div
          class="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center"
        >
          <Target class="w-8 h-8 text-amber-600" />
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-3">Siap Mulai Assessment?</h3>
        <p class="text-muted-foreground mb-4 max-w-md mx-auto">
          Lengkapi assessment IPRO Student untuk hasil analisis kepribadian dan karir
        </p>
        <div
          class="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <ExternalLink class="w-4 h-4 text-amber-600" />
          <span class="text-sm text-amber-800 font-medium">Tersedia di IPRO Student</span>
        </div>
      </div>

      <!-- No Data Yet State (never synced before) -->
      <div v-else-if="!iprosData && syncState === 'idle'" class="text-center py-12">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <Database class="w-8 h-8 text-gray-600" />
        </div>
        <h3 class="text-sm text-muted-foreground font-semibold mb-2">Data belum disinkronkan</h3>
        <p class="text-xs text-muted-foreground mb-4">
          Gunakan tombol sinkronisasi di bagian atas untuk memuat data
        </p>
      </div>

      <!-- Quiz Results Display -->
      <div v-else-if="hasAnyQuizData" class="space-y-6">
        <!-- Unified RIASEC Section -->
        <div v-if="hasRIASECData && getRIASECResults" class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-foreground">RIASEC Assessment</h3>
            <div
              class="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full"
            >
              <span class="font-medium">Top 3:</span>
              <span
                v-for="(type, index) in getRIASECTopThree?.slice(0, 3) || []"
                :key="type"
                class="font-semibold"
              >
                {{ type }}<span v-if="index < 2" class="mx-1 text-muted-foreground/70">·</span>
              </span>
            </div>
          </div>

          <!-- Detailed Scores -->
          <div class="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <h4 class="text-base font-semibold text-foreground mb-4">Skor Detail</h4>
            <RIASECScoreChart
              v-if="getRIASECResults"
              :scores="getRIASECResults.scores"
              :top-three-types="getRIASECTopThree"
              :career-guidance="null"
            />
          </div>

          <!-- Career Guidance Cards -->
          <div class="space-y-4">
            <h4 class="text-base font-semibold text-foreground">Panduan Karir</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-blue-50 rounded-lg dark:bg-blue-950/20">
                <h5 class="font-medium text-blue-900 dark:text-blue-100 mb-2">Rekomendasi Karir</h5>
                <p class="text-sm text-blue-800 dark:text-blue-200">{{ getRIASECResults.karir }}</p>
              </div>
              <div class="p-4 bg-green-50 rounded-lg dark:bg-green-950/20">
                <h5 class="font-medium text-green-900 dark:text-green-100 mb-2">Kepribadian</h5>
                <p class="text-sm text-green-800 dark:text-green-200">
                  {{ getRIASECResults.kepribadian }}
                </p>
              </div>
              <div class="p-4 bg-purple-50 rounded-lg dark:bg-purple-950/20">
                <h5 class="font-medium text-purple-900 dark:text-purple-100 mb-2">Pendidikan</h5>
                <p class="text-sm text-purple-800 dark:text-purple-200">
                  {{ getRIASECResults.pendidikan }}
                </p>
              </div>
              <div class="p-4 bg-orange-50 rounded-lg dark:bg-orange-950/20">
                <h5 class="font-medium text-orange-900 dark:text-orange-100 mb-2">Potensi</h5>
                <p class="text-sm text-orange-800 dark:text-orange-200">
                  {{ getRIASECResults.potensi }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- PPI Results Summary -->
        <div v-if="hasPPIData" class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-foreground">Hasil aspek quiz</h3>
            <span
              class="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full font-medium"
              >{{ getPPIAspects?.length || 0 }} aspek</span
            >
          </div>

          <!-- PPI Aspects in grid layout -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="aspect in getPPIAspects || []"
              :key="aspect.aspek"
              class="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg"
            >
              <div class="flex items-start justify-between mb-3">
                <h4 class="font-medium text-foreground flex-1">{{ aspect.aspek }}</h4>
                <div class="flex items-center gap-2 ml-4">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/40"
                  >
                    <span class="text-sm font-bold text-blue-700 dark:text-blue-300">{{
                      aspect.skor
                    }}</span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-foreground/80 mb-2">{{ aspect.hasil }}</p>
              <p v-if="aspect.definisi_aspek" class="text-xs text-muted-foreground">
                {{ aspect.definisi_aspek }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No Quiz Data Available -->
      <div v-else-if="iprosData && iprosData.hasPrivileges" class="text-center py-8">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center"
        >
          <AlertTriangle class="w-8 h-8 text-yellow-600" />
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">Belum Ada Hasil Kuis</h3>
        <p class="text-muted-foreground">
          Anda memiliki akses kuis tetapi belum ada hasil yang tersinkronisasi
        </p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle, Database, AlertTriangle, Target, ExternalLink } from 'lucide-vue-next'

// Import custom components
import RIASECScoreChart from './RIASECScoreChart.vue'

// Import composable
import { useIPROSSync } from '@/composables/data/useIPROSSync'

// IPROS sync composable
const {
  iprosData,
  isLoading,
  error,
  syncState,
  syncIPROSData,
  clearError,
  hasPPIData,
  hasRIASECData,
  hasAnyQuizData,
  getPPIAspects,
  getRIASECResults,
  getRIASECTopThree,
  formatSyncDate,
  getPrivilegeStatus,
} = useIPROSSync()

// Computed properties
const privilegeBadgeClasses = computed(() => {
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium'

  if (!iprosData.value) {
    return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`
  }

  if (iprosData.value.hasPrivileges) {
    return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`
  } else {
    return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`
  }
})

// Actions
const handleSync = async () => {
  clearError()
  await syncIPROSData()
}

const handleRetry = async () => {
  await handleSync()
}

// Debug watchers
watch(
  iprosData,
  (newData) => {
    console.log('🔄 IPROS data changed:', newData)
    if (newData) {
      console.log('📊 PPI Results:', newData.ppiResults)
      console.log('📊 RIASEC Results:', newData.riasecResults)
    }
  },
  { deep: true },
)

watch(isLoading, (loading) => {
  console.log('⏳ Loading state:', loading)
})

watch(error, (err) => {
  console.log('❌ Error state:', err)
})

watch(hasPPIData, (value) => {
  console.log('🔍 Has PPI Data:', value)
})

watch(hasRIASECData, (value) => {
  console.log('🔍 Has RIASEC Data:', value)
})
</script>

<style scoped>
.ipros-quiz-card {
  @apply transition-all duration-200;
}

.ipros-quiz-card:hover {
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Smooth animations for expand/collapse */
.expand-animation {
  transition:
    max-height 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}
</style>
