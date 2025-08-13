import { computed, ref, type ComputedRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getProfile } from '@/api/users/getProfile'
import { useUserStore } from '@/stores/userStores'
import { useApiError } from '@/composables/api/useApiError'
import type { 
  UserDataInterface, 
  IPROInterface, 
  IPROBInterface, 
  IPROSInterface, 
  LastAnalyzedInterface 
} from '@/types/userType'

export type AssessmentType = 'ipro' | 'iprob' | 'ipros'

export type AssessmentOverview = {
  totalAssessments: number
  completedAssessments: number
  completionRate: number
  lastAssessmentDate?: string
  hasAnyAssessment: boolean
}

export type ScoreInterpretation = {
  level: 'low' | 'medium' | 'high'
  color: 'red' | 'yellow' | 'green'
  description: string
}

export type ProcessedAssessmentData = {
  ipro: IPROInterface | null
  iprob: IPROBInterface | null
  ipros: IPROSInterface | null
  lastAnalyzed: LastAnalyzedInterface | null
  overview: AssessmentOverview
}

export type UseAssessmentDataReturn = {
  // Data
  assessmentData: ComputedRef<ProcessedAssessmentData | null>
  isLoading: ComputedRef<boolean>
  error: ComputedRef<Error | null>
  
  // Assessment specific data
  getAssessmentData: (type: AssessmentType) => ComputedRef<any>
  getAssessmentEntries: (type: AssessmentType) => ComputedRef<Array<{ key: string, value: string, label: string }>>
  
  // Utility functions
  hasAssessment: (type: AssessmentType) => ComputedRef<boolean>
  getAssessmentCompletion: () => ComputedRef<AssessmentOverview>
  interpretScore: (value: string) => ScoreInterpretation
  formatAssessmentDate: (date?: string) => string
  
  // Actions
  refetchAssessmentData: () => Promise<void>
}

export function useAssessmentData(): UseAssessmentDataReturn {
  const userStore = useUserStore()
  const { handleError, clearError } = useApiError()

  // Assessment data query
  const assessmentQuery = useQuery({
    queryKey: ['assessmentData', userStore.user?.id],
    queryFn: async () => {
      try {
        const response = await getProfile()
        if (!response?.user) {
          throw new Error('No user data received')
        }

        return processAssessmentData(response.user)
      } catch (error) {
        handleError(error, 'Failed to fetch assessment data')
        throw error
      }
    },
    enabled: computed(() => !!userStore.user?.id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })

  // Process raw assessment data
  const processAssessmentData = (userData: UserDataInterface): ProcessedAssessmentData => {
    const ipro = parseJsonSafely<IPROInterface>(userData.ipro)
    const iprob = parseJsonSafely<IPROBInterface>(userData.iprob)
    const ipros = parseJsonSafely<IPROSInterface>(userData.ipros)
    const lastAnalyzed = parseJsonSafely<LastAnalyzedInterface>(userData.last_analyzed)

    const assessments = [ipro, iprob, ipros]
    const completedAssessments = assessments.filter(Boolean).length
    const totalAssessments = 3

    const overview: AssessmentOverview = {
      totalAssessments,
      completedAssessments,
      completionRate: Math.round((completedAssessments / totalAssessments) * 100),
      lastAssessmentDate: lastAnalyzed?.analyzed_at,
      hasAnyAssessment: completedAssessments > 0
    }

    return {
      ipro,
      iprob,
      ipros,
      lastAnalyzed,
      overview
    }
  }

  // Safe JSON parsing utility
  const parseJsonSafely = <T>(data: any): T | null => {
    if (!data) return null
    
    if (typeof data === 'string') {
      try {
        return JSON.parse(data) as T
      } catch {
        return null
      }
    }
    
    return data as T
  }

  // Get assessment data by type
  const getAssessmentData = (type: AssessmentType) => {
    return computed(() => {
      const data = assessmentData.value
      if (!data) return null
      return data[type]
    })
  }

  // Get assessment entries for display
  const getAssessmentEntries = (type: AssessmentType) => {
    return computed(() => {
      const data = getAssessmentData(type).value
      if (!data) return []

      return Object.entries(data).map(([key, value]) => ({
        key,
        value: String(value),
        label: formatFieldLabel(key)
      }))
    })
  }

  // Format field labels from camelCase to readable format
  const formatFieldLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      // IPRO labels
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

    return labelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  // Check if assessment exists
  const hasAssessment = (type: AssessmentType) => {
    return computed(() => {
      const data = getAssessmentData(type).value
      return !!data && Object.keys(data).length > 0
    })
  }

  // Get assessment completion overview
  const getAssessmentCompletion = () => {
    return computed(() => {
      return assessmentData.value?.overview || {
        totalAssessments: 3,
        completedAssessments: 0,
        completionRate: 0,
        hasAnyAssessment: false
      }
    })
  }

  // Interpret score values
  const interpretScore = (value: string): ScoreInterpretation => {
    const normalizedValue = value.toLowerCase()

    // High level indicators
    if (['tinggi', 'kuat', 'bagus', 'baik', 'aktif', 'mandiri', 'percaya diri', 'stabil'].includes(normalizedValue)) {
      return {
        level: 'high',
        color: 'green',
        description: 'Nilai tinggi - menunjukkan kemampuan yang kuat'
      }
    }

    // Medium level indicators
    if (['sedang', 'cukup', 'adaptif', 'luwes', 'rapi', 'teliti'].includes(normalizedValue)) {
      return {
        level: 'medium',
        color: 'yellow',
        description: 'Nilai sedang - menunjukkan kemampuan yang memadai'
      }
    }

    // Default to medium if unrecognized
    return {
      level: 'medium',
      color: 'yellow',
      description: 'Nilai dalam rentang normal'
    }
  }

  // Format assessment date
  const formatAssessmentDate = (date?: string): string => {
    if (!date) return 'Tanggal tidak tersedia'
    
    try {
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return date
    }
  }

  // Computed properties
  const assessmentData = computed(() => assessmentQuery.data.value || null)
  const isLoading = computed(() => assessmentQuery.isLoading.value)
  const error = computed(() => assessmentQuery.error.value)

  // Actions
  const refetchAssessmentData = async () => {
    clearError()
    await assessmentQuery.refetch()
  }

  return {
    assessmentData,
    isLoading,
    error,
    
    getAssessmentData,
    getAssessmentEntries,
    
    hasAssessment,
    getAssessmentCompletion,
    interpretScore,
    formatAssessmentDate,
    
    refetchAssessmentData
  }
}