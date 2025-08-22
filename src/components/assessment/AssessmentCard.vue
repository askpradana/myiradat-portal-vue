<template>
  <Card class="assessment-card">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg font-semibold text-foreground">
          {{ title }}
        </CardTitle>
        <div v-if="!isLoading" class="flex items-center space-x-2">
          <div class="px-2 py-1 rounded-full text-xs font-medium" :class="completionBadgeClasses">
            {{ completionText }}
          </div>
          <button
            @click="toggleExpanded"
            class="p-1 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            :aria-label="isExpanded ? 'Tutup detail' : 'Lihat detail'"
            type="button"
          >
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isExpanded }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      <CardDescription class="text-muted-foreground">
        {{ description }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-2 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <!-- No Data State -->
      <div v-else-if="!hasData" class="text-center py-8">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p class="text-muted-foreground">Belum ada data assessment</p>
        <p class="text-xs text-muted-foreground mt-1">Assessment belum dilakukan</p>
      </div>

      <!-- Assessment Data -->
      <div v-else class="space-y-3">
        <!-- Summary View (always visible) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div v-for="entry in summaryEntries" :key="entry.key" class="assessment-summary-item">
            <ScoreIndicator :label="entry.label" :value="entry.value" :has-tooltip="false" />
          </div>
        </div>

        <!-- Detailed View (expandable) -->
        <div
          v-if="hasMoreData"
          class="transition-all duration-300 ease-in-out overflow-hidden"
          :class="isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'"
        >
          <div class="pt-4 border-t border-border">
            <h4 class="text-sm font-medium text-foreground mb-3">Detail Assessment</h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div
                v-for="entry in remainingEntries"
                :key="entry.key"
                class="assessment-detail-item"
              >
                <ScoreIndicator :label="entry.label" :value="entry.value" :has-tooltip="true" />
              </div>
            </div>
          </div>
        </div>

        <!-- Show More Button -->
        <div v-if="hasMoreData && !isExpanded" class="pt-3 border-t border-border">
          <button
            @click="toggleExpanded"
            class="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Lihat {{ remainingEntries.length }} item lainnya
            <svg class="w-4 h-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ScoreIndicator from './ScoreIndicator.vue'
import type { AssessmentType } from '@/composables/data/useAssessmentData'

interface AssessmentEntry {
  key: string
  value: string
  label: string
}

interface Props {
  title: string
  description: string
  type: AssessmentType
  data: Record<string, string> | null
  isLoading?: boolean
  maxSummaryItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  maxSummaryItems: 4,
})

const isExpanded = ref(false)

// Data processing
const entries = computed((): AssessmentEntry[] => {
  if (!props.data) return []

  return Object.entries(props.data).map(([key, value]) => ({
    key,
    value: String(value),
    label: formatFieldLabel(key),
  }))
})

const hasData = computed(() => entries.value.length > 0)
const hasMoreData = computed(() => entries.value.length > props.maxSummaryItems)

const summaryEntries = computed(() => entries.value.slice(0, props.maxSummaryItems))

const remainingEntries = computed(() => entries.value.slice(props.maxSummaryItems))

// Completion status
const completionText = computed(() => {
  if (!hasData.value) return 'Belum Tersedia'
  return 'Tersedia'
})

const completionBadgeClasses = computed(() => {
  if (!hasData.value) {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
  return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
})

// Actions
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// Helper function to format field labels
const formatFieldLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    // IPRO/IPROB labels
    inisiatif: 'Inisiatif',
    kerjasama: 'Kerjasama',
    kepemimpinan: 'Kepemimpinan',
    fleksibilitas: 'Fleksibilitas',
    komitmenTugas: 'Komitmen Tugas',
    kecerdasanUmum: 'Kecerdasan Umum',
    logikaBerpikir: 'Logika Berpikir',
    kelincahanPikir: 'Kelincahan Pikir',
    kepercayaanDiri: 'Kepercayaan Diri',
    penyesuaianDiri: 'Penyesuaian Diri',
    stabilitasEmosi: 'Stabilitas Emosi',
    sistematikaKerja: 'Sistematika Kerja',
    dayaAnalisaSintesa: 'Daya Analisa Sintesa',
    dayaBerpikirAbtrak: 'Daya Berpikir Abstrak',
    dayaTahanKerjaRutin: 'Daya Tahan Kerja Rutin',
    motivasiBerprestasi: 'Motivasi Berprestasi',
    dayaTahanKerjaStress: 'Daya Tahan Kerja Stress',
    pengambilanKeputusan: 'Pengambilan Keputusan',
    hubunganInterpersonal: 'Hubungan Interpersonal',
    perencanaanDanPerorganisasian: 'Perencanaan Dan Perorganisasian',

    // IPROS labels
    kemandirian: 'Kemandirian',
    ketangguhan: 'Ketangguhan',
    ketelitianKerja: 'Ketelitian Kerja',
    penalaranVerbal: 'Penalaran Verbal',
    penalaranNumerik: 'Penalaran Numerik',
    penalaranNonVerbal: 'Penalaran Non Verbal',
    kecepatanPerseptual: 'Kecepatan Perseptual',
  }

  return labelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}
</script>

<style scoped>
.assessment-card {
  @apply transition-all duration-200;
}

.assessment-card:hover {
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.assessment-summary-item,
.assessment-detail-item {
  @apply transition-transform duration-200;
}

.assessment-summary-item:hover,
.assessment-detail-item:hover {
  @apply scale-[1.02];
}
</style>
