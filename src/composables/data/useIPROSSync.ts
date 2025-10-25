import { ref, computed, watch, onUnmounted, type Ref, type ComputedRef } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { iprosSync } from '@/api/quiz/iprosSync'
import { useApiError } from '@/composables/api/useApiError'
import { useErrorStateManager } from '@/composables/api/useErrorStateManager'
import { useIPROSStore } from '@/stores/iprosStore'
import type {
  ProcessedIPROSData,
  IPROSSyncState,
  IPROSSyncError,
  PPIAspect,
  RIASECResult,
  IPROSScoreInterpretation,
} from '@/types/ipros'

export interface IPROSSyncOptions {
  // Enhanced error management options
  useEnhancedErrorHandling?: boolean
  autoRetry?: boolean
  maxAutoRetries?: number
  autoRetryDelay?: number
  clearOnNavigation?: boolean
  showToast?: boolean
  persistAcrossTabs?: boolean

  // Store integration options
  useStore?: boolean
}

export interface UseIPROSSyncReturn {
  // State
  iprosData: ComputedRef<ProcessedIPROSData | null>
  syncState: Ref<IPROSSyncState>
  isLoading: ComputedRef<boolean>
  error: ComputedRef<IPROSSyncError | null>

  // Actions
  syncIPROSData: () => Promise<void>
  clearError: () => void

  // Data access helpers
  hasPPIData: ComputedRef<boolean>
  hasRIASECData: ComputedRef<boolean>
  hasAnyQuizData: ComputedRef<boolean>

  // PPI helpers
  getPPIAspects: ComputedRef<PPIAspect[] | null>
  getPPIScore: (aspectName: string) => number | null

  // RIASEC helpers
  getRIASECResults: ComputedRef<RIASECResult['result'] | null>
  getRIASECTopThree: ComputedRef<string | null>
  getRIASECScore: (dimension: string) => number | null

  // Score interpretation
  interpretPPIScore: (score: number) => IPROSScoreInterpretation
  interpretRIASECScore: (score: number) => IPROSScoreInterpretation

  // Utility functions
  formatSyncDate: (date: string) => string
  getPrivilegeStatus: ComputedRef<string>

  // Enhanced features (when enabled)
  hasErrors?: ComputedRef<boolean>
  hasCriticalErrors?: ComputedRef<boolean>
  canRetry?: ComputedRef<boolean>
  errorManager?: ReturnType<typeof useErrorStateManager>
  retrySync?: () => Promise<void>
  resetSyncState?: () => void
  clearOnNavigation?: () => void
}

const defaultOptions: Required<IPROSSyncOptions> = {
  useEnhancedErrorHandling: false,
  autoRetry: false,
  maxAutoRetries: 3,
  autoRetryDelay: 2000,
  clearOnNavigation: true,
  showToast: true,
  persistAcrossTabs: false,
  useStore: true,
}

export function useIPROSSync(options: IPROSSyncOptions = {}): UseIPROSSyncReturn {
  const config = { ...defaultOptions, ...options }
  const queryClient = useQueryClient()
  const { handleError, clearError: clearApiError } = useApiError()

  // Conditional store usage
  const iprosStore = config.useStore ? useIPROSStore() : null

  // Enhanced error management (conditional)
  const errorManager = config.useEnhancedErrorHandling
    ? useErrorStateManager('ipros-sync', {
        autoRetry: config.autoRetry,
        maxAutoRetries: config.maxAutoRetries,
        autoRetryDelay: config.autoRetryDelay,
        clearOnNavigation: config.clearOnNavigation,
        showToast: config.showToast,
        persistAcrossTabs: config.persistAcrossTabs,
      })
    : null

  // State
  const iprosData = ref<ProcessedIPROSData | null>(null)
  const syncState = ref<IPROSSyncState>('idle')
  const lastSyncAttempt = ref<number>(0)
  const consecutiveFailures = ref<number>(0)

  // Initialize IPROS data from store on first use (if store is enabled)
  if (config.useStore && iprosStore && !iprosStore.iprosData) {
    iprosStore.initializeIPROSData()
  }

  // Initialize data source based on configuration
  if (config.useStore && iprosStore) {
    // Use store data when store is enabled
    iprosData.value = iprosStore.iprosData
  }

  // Enhanced computed properties
  const canRetry = computed(() => {
    if (!config.useEnhancedErrorHandling) return true
    const timeSinceLastAttempt = Date.now() - lastSyncAttempt.value
    const minRetryDelay = Math.pow(2, consecutiveFailures.value) * 1000 // Exponential backoff
    return timeSinceLastAttempt >= minRetryDelay && consecutiveFailures.value < 5
  })

  // Sync mutation with conditional enhanced error handling
  const syncMutation = useMutation({
    mutationFn: async () => {
      // Clear previous errors based on configuration
      if (config.useEnhancedErrorHandling && errorManager) {
        errorManager.clearErrors('component')
      }

      syncState.value = 'syncing'
      lastSyncAttempt.value = Date.now()

      try {
        const result = await iprosSync.syncIPROSData()

        if (!result) {
          throw new Error('No data received from IPROS sync')
        }

        // Check if data is unavailable (204 response) - this is not an error
        if (result.isDataUnavailable) {
          syncState.value = 'data-unavailable'
          return result
        }

        return result
      } catch (error) {
        if (config.useEnhancedErrorHandling) {
          consecutiveFailures.value += 1

          // Determine error severity based on consecutive failures
          const severity = consecutiveFailures.value >= 3 ? 'critical' : 'error'

          errorManager?.addError({
            message: error instanceof Error ? error.message : 'IPROS sync failed',
            severity,
            context: 'component',
            source: 'ipros-sync-mutation',
            recoveryActions: canRetry.value ? ['retry'] : ['navigate'],
            details: {
              consecutiveFailures: consecutiveFailures.value,
              canRetry: canRetry.value,
              timestamp: Date.now(),
              originalError: error,
            },
          })
        }

        throw error
      }
    },
    onSuccess: (data) => {
      // Update data based on configuration
      if (config.useStore && iprosStore) {
        iprosStore.setIPROSData(data)
      } else {
        iprosData.value = data
      }

      // Set appropriate success state based on data availability
      if (data.isDataUnavailable) {
        syncState.value = 'data-unavailable'
      } else {
        syncState.value = 'success'
      }

      consecutiveFailures.value = 0

      // Clear any previous errors on success (enhanced mode)
      if (config.useEnhancedErrorHandling && errorManager) {
        errorManager.clearAllErrors()
      }

      // Invalidate related queries to refresh assessment data
      queryClient.invalidateQueries({ queryKey: ['assessmentData'] })
    },
    onError: (error) => {
      syncState.value = 'error'

      if (!config.useEnhancedErrorHandling) {
        handleError(error, 'Failed to sync IPROS data')
      }
      // Enhanced error handling is done in mutationFn
    },
  })

  // Computed properties
  const isLoading = computed(() => syncState.value === 'syncing')

  const currentIPROSData = computed(() => {
    return config.useStore && iprosStore ? iprosStore.iprosData : iprosData.value
  })

  const error = computed(() => {
    // Check for errors from the error manager first (enhanced mode)
    if (config.useEnhancedErrorHandling && errorManager) {
      const managerError = errorManager.currentError.value
      if (managerError) {
        return {
          message: managerError.message,
          context: managerError.source || 'IPROS Sync',
        }
      }
    }

    // Fallback to original error sources
    const syncError = iprosSync.getSyncError()
    if (syncError) return syncError

    if (syncMutation.error.value) {
      return {
        message: syncMutation.error.value.message || 'Unknown sync error',
        context: 'IPROS Sync Mutation',
      }
    }

    return null
  })

  // Data access helpers
  const hasPPIData = computed(() =>
    Boolean(currentIPROSData.value?.hasPrivileges && currentIPROSData.value.ppiResults !== null),
  )

  const hasRIASECData = computed(() =>
    Boolean(currentIPROSData.value?.hasPrivileges && currentIPROSData.value.riasecResults !== null),
  )

  const hasAnyQuizData = computed(() => Boolean(hasPPIData.value || hasRIASECData.value))

  // PPI helpers
  const getPPIAspects = computed(() => currentIPROSData.value?.ppiResults || null)

  const getPPIScore = (aspectName: string): number | null => {
    const aspects = getPPIAspects.value
    if (!aspects) return null

    const aspect = aspects.find((a) => a.aspek === aspectName)
    return aspect?.skor || null
  }

  // RIASEC helpers
  const getRIASECResults = computed(() => currentIPROSData.value?.riasecResults || null)

  const getRIASECTopThree = computed(() => getRIASECResults.value?.top_three || null)

  const getRIASECScore = (dimension: string): number | null => {
    const results = getRIASECResults.value
    if (!results?.scores) return null

    return results.scores[dimension as keyof typeof results.scores] || null
  }

  // Score interpretation functions
  const interpretPPIScore = (score: number): IPROSScoreInterpretation => {
    if (score >= 4) {
      return {
        level: 'high',
        color: 'green',
        description: 'Sangat Baik - Kemampuan tinggi pada aspek ini',
        range: '4 - 5',
      }
    } else if (score === 3) {
      return {
        level: 'medium',
        color: 'yellow',
        description: 'Baik - Kemampuan memadai pada aspek ini',
        range: '3',
      }
    } else {
      return {
        level: 'low',
        color: 'red',
        description: 'Perlu Pengembangan - Aspek ini perlu ditingkatkan',
        range: '1 - 2',
      }
    }
  }

  const interpretRIASECScore = (score: number): IPROSScoreInterpretation => {
    if (score >= 20) {
      return {
        level: 'high',
        color: 'green',
        description: 'Dominan - Minat yang sangat kuat',
        range: '20 - 25',
      }
    } else if (score >= 15) {
      return {
        level: 'medium',
        color: 'yellow',
        description: 'Sedang - Minat yang cukup',
        range: '15 - 19',
      }
    } else {
      return {
        level: 'low',
        color: 'red',
        description: 'Rendah - Minat yang kurang',
        range: '0 - 14',
      }
    }
  }

  // Utility functions
  const formatSyncDate = (date: string): string => {
    try {
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return date
    }
  }

  const getPrivilegeStatus = computed(() => {
    if (!currentIPROSData.value) return 'Belum disinkronkan'

    if (currentIPROSData.value.hasPrivileges) {
      return 'Akses Penuh'
    } else {
      return 'Kuis belum dilakukan'
    }
  })

  // Enhanced actions
  const syncIPROSData = async () => {
    if (config.useEnhancedErrorHandling && !canRetry.value && consecutiveFailures.value > 0) {
      errorManager?.addError({
        message: 'Please wait before retrying. Too many consecutive failures.',
        severity: 'warning',
        context: 'component',
        source: 'ipros-sync-rate-limit',
        recoveryActions: ['ignore'],
      })
      return
    }

    await syncMutation.mutateAsync()
  }

  const retrySync = async () => {
    if (config.useEnhancedErrorHandling && !canRetry.value) {
      return
    }

    // Clear errors before retry
    if (config.useEnhancedErrorHandling && errorManager) {
      errorManager.clearAllErrors()
    }
    syncState.value = 'idle'

    await syncIPROSData()
  }

  const clearError = () => {
    if (config.useEnhancedErrorHandling && errorManager) {
      errorManager.clearAllErrors()
    } else {
      clearApiError()
    }
    iprosSync.clearError()
    syncState.value = 'idle'
    consecutiveFailures.value = 0
  }

  const resetSyncState = () => {
    if (config.useEnhancedErrorHandling && errorManager) {
      errorManager.clearAllErrors()
    }
    syncState.value = 'idle'
    consecutiveFailures.value = 0
    if (!config.useStore) {
      iprosData.value = null
    }
  }

  const clearOnNavigation = () => {
    if (config.useEnhancedErrorHandling && errorManager) {
      errorManager.clearOnTabChange()
    }
  }

  // Enhanced lifecycle hooks (conditional)
  if (config.useEnhancedErrorHandling && errorManager) {
    // Watch for navigation events to clear non-critical errors
    watch(syncState, (newState, oldState) => {
      if (oldState === 'error' && newState === 'syncing') {
        // Clear component-level errors when retrying
        errorManager.clearErrors('component')
      }
    })

    // Cleanup on unmount
    onUnmounted(() => {
      errorManager.clearOnPageLeave()
    })
  }

  // Build return object conditionally
  const baseReturn: UseIPROSSyncReturn = {
    // State
    iprosData: currentIPROSData,
    syncState,
    isLoading,
    error,

    // Actions
    syncIPROSData,
    clearError,

    // Data access helpers
    hasPPIData,
    hasRIASECData,
    hasAnyQuizData,

    // PPI helpers
    getPPIAspects,
    getPPIScore,

    // RIASEC helpers
    getRIASECResults,
    getRIASECTopThree,
    getRIASECScore,

    // Score interpretation
    interpretPPIScore,
    interpretRIASECScore,

    // Utility functions
    formatSyncDate,
    getPrivilegeStatus,
  }

  // Add enhanced features conditionally
  if (config.useEnhancedErrorHandling && errorManager) {
    return {
      ...baseReturn,
      // Enhanced error management
      hasErrors: errorManager.hasErrors,
      hasCriticalErrors: errorManager.hasCriticalErrors,
      canRetry,
      errorManager,
      // Enhanced actions
      retrySync,
      resetSyncState,
      clearOnNavigation,
    }
  }

  return baseReturn
}

// Convenience function for enhanced usage
export function useEnhancedIPROSSync(
  options: Omit<IPROSSyncOptions, 'useEnhancedErrorHandling'> = {},
) {
  return useIPROSSync({
    ...options,
    useEnhancedErrorHandling: true,
    autoRetry: options.autoRetry ?? true,
    maxAutoRetries: options.maxAutoRetries ?? 3,
    autoRetryDelay: options.autoRetryDelay ?? 2000,
    clearOnNavigation: options.clearOnNavigation ?? true,
    showToast: options.showToast ?? true,
    persistAcrossTabs: options.persistAcrossTabs ?? false,
  })
}
