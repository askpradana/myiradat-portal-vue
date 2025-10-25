import { ref, computed, watchEffect, type Ref, type ComputedRef } from 'vue'
import { toast } from 'vue-sonner'

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical'
export type ErrorContext = 'component' | 'page' | 'global'
export type ErrorRecoveryAction = 'retry' | 'navigate' | 'refresh' | 'ignore'

export interface ErrorState {
  id: string
  message: string
  severity: ErrorSeverity
  context: ErrorContext
  timestamp: number
  source?: string
  details?: Record<string, unknown>
  recoveryActions?: ErrorRecoveryAction[]
  autoRetryCount?: number
  maxAutoRetries?: number
}

export interface ErrorRecoveryOptions {
  autoRetry?: boolean
  maxAutoRetries?: number
  autoRetryDelay?: number
  clearOnNavigation?: boolean
  showToast?: boolean
  persistAcrossTabs?: boolean
}

export interface ErrorStateManagerReturn {
  // State
  errors: Ref<ErrorState[]>
  hasErrors: ComputedRef<boolean>
  hasCriticalErrors: ComputedRef<boolean>
  currentError: ComputedRef<ErrorState | null>

  // Actions
  addError: (error: Partial<ErrorState> & { message: string }) => string
  removeError: (errorId: string) => void
  clearErrors: (context?: ErrorContext) => void
  clearAllErrors: () => void

  // Recovery
  retryError: (errorId: string, retryFn?: () => Promise<void>) => Promise<void>
  markErrorAsHandled: (errorId: string) => void

  // Navigation-aware clearing
  clearOnTabChange: () => void
  clearOnPageLeave: () => void

  // Utilities
  getErrorsByContext: (context: ErrorContext) => ComputedRef<ErrorState[]>
  getErrorsBySeverity: (severity: ErrorSeverity) => ComputedRef<ErrorState[]>
}

const defaultRecoveryOptions: Required<ErrorRecoveryOptions> = {
  autoRetry: false,
  maxAutoRetries: 3,
  autoRetryDelay: 1000,
  clearOnNavigation: true,
  showToast: true,
  persistAcrossTabs: false
}

export function useErrorStateManager(
  contextId?: string,
  options: ErrorRecoveryOptions = {}
): ErrorStateManagerReturn {
  const config = { ...defaultRecoveryOptions, ...options }

  // State
  const errors = ref<ErrorState[]>([])
  const retryPromises = new Map<string, Promise<void>>()

  // Computed properties
  const hasErrors = computed(() => errors.value.length > 0)

  const hasCriticalErrors = computed(() =>
    errors.value.some(error => error.severity === 'critical')
  )

  const currentError = computed(() => {
    // Return the most severe error, or the most recent if equal severity
    const sortedErrors = [...errors.value].sort((a, b) => {
      const severityOrder = { critical: 4, error: 3, warning: 2, info: 1 }
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
      if (severityDiff !== 0) return severityDiff
      return b.timestamp - a.timestamp
    })

    return sortedErrors[0] || null
  })

  // Utility functions
  const generateErrorId = (): string => {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const shouldAutoRetry = (error: ErrorState): boolean => {
    return config.autoRetry &&
           (error.autoRetryCount || 0) < (error.maxAutoRetries || config.maxAutoRetries) &&
           error.severity !== 'critical'
  }

  // Actions
  const addError = (errorInput: Partial<ErrorState> & { message: string }): string => {
    const errorId = errorInput.id || generateErrorId()

    const { message, ...restErrorInput } = errorInput
    const error: ErrorState = {
      id: errorId,
      message,
      severity: errorInput.severity || 'error',
      context: errorInput.context || 'component',
      timestamp: Date.now(),
      source: errorInput.source || contextId,
      details: errorInput.details,
      recoveryActions: errorInput.recoveryActions || ['retry'],
      autoRetryCount: 0,
      maxAutoRetries: errorInput.maxAutoRetries || config.maxAutoRetries,
      ...restErrorInput
    }

    // Remove any existing error with the same ID
    errors.value = errors.value.filter(e => e.id !== errorId)

    // Add new error
    errors.value.push(error)

    // Show toast notification if enabled
    if (config.showToast) {
      const toastMap = {
        info: () => toast.info(error.message),
        warning: () => toast.warning(error.message),
        error: () => toast.error(error.message),
        critical: () => toast.error(`Critical Error: ${error.message}`)
      }
      toastMap[error.severity]()
    }

    // Auto-retry if enabled
    if (shouldAutoRetry(error)) {
      setTimeout(() => {
        if (errors.value.find(e => e.id === errorId)) {
          retryError(errorId)
        }
      }, config.autoRetryDelay)
    }

    return errorId
  }

  const removeError = (errorId: string): void => {
    errors.value = errors.value.filter(error => error.id !== errorId)
    retryPromises.delete(errorId)
  }

  const clearErrors = (context?: ErrorContext): void => {
    if (context) {
      errors.value = errors.value.filter(error => error.context !== context)
    } else {
      // Clear non-persistent errors
      errors.value = errors.value.filter(error =>
        config.persistAcrossTabs && error.severity === 'critical'
      )
    }
  }

  const clearAllErrors = (): void => {
    errors.value = []
    retryPromises.clear()
  }

  // Recovery functions
  const retryError = async (errorId: string, retryFn?: () => Promise<void>): Promise<void> => {
    const error = errors.value.find(e => e.id === errorId)
    if (!error) return

    // Prevent multiple simultaneous retries
    if (retryPromises.has(errorId)) {
      return retryPromises.get(errorId)
    }

    const retryPromise = (async () => {
      try {
        // Increment retry count
        error.autoRetryCount = (error.autoRetryCount || 0) + 1

        // Execute retry function if provided
        if (retryFn) {
          await retryFn()
        }

        // If successful, remove the error
        removeError(errorId)

        if (config.showToast) {
          toast.success('Operation completed successfully')
        }
      } catch (retryErr) {
        // Update error with retry information
        error.timestamp = Date.now()
        error.details = {
          ...error.details,
          lastRetryError: retryErr,
          retryCount: error.autoRetryCount
        }

        // Check if we should retry again
        if (shouldAutoRetry(error)) {
          setTimeout(() => {
            if (errors.value.find(e => e.id === errorId)) {
              retryError(errorId, retryFn)
            }
          }, config.autoRetryDelay * Math.pow(2, error.autoRetryCount || 0)) // Exponential backoff
        }
      } finally {
        retryPromises.delete(errorId)
      }
    })()

    retryPromises.set(errorId, retryPromise)
    return retryPromise
  }

  const markErrorAsHandled = (errorId: string): void => {
    const error = errors.value.find(e => e.id === errorId)
    if (error) {
      error.details = { ...error.details, handled: true }
    }
  }

  // Navigation-aware clearing
  const clearOnTabChange = (): void => {
    if (config.clearOnNavigation) {
      clearErrors('component')
    }
  }

  const clearOnPageLeave = (): void => {
    if (config.clearOnNavigation) {
      clearErrors('page')
    }
  }

  // Utility getters
  const getErrorsByContext = (context: ErrorContext): ComputedRef<ErrorState[]> => {
    return computed(() => errors.value.filter(error => error.context === context))
  }

  const getErrorsBySeverity = (severity: ErrorSeverity): ComputedRef<ErrorState[]> => {
    return computed(() => errors.value.filter(error => error.severity === severity))
  }

  // Auto-cleanup old errors
  watchEffect(() => {
    const now = Date.now()
    const maxAge = 30 * 60 * 1000 // 30 minutes

    errors.value = errors.value.filter(error => {
      const isExpired = now - error.timestamp > maxAge
      const isHandled = error.details?.handled === true

      return !(isExpired || (isHandled && error.severity !== 'critical'))
    })
  })

  return {
    // State
    errors,
    hasErrors,
    hasCriticalErrors,
    currentError,

    // Actions
    addError,
    removeError,
    clearErrors,
    clearAllErrors,

    // Recovery
    retryError,
    markErrorAsHandled,

    // Navigation-aware clearing
    clearOnTabChange,
    clearOnPageLeave,

    // Utilities
    getErrorsByContext,
    getErrorsBySeverity
  }
}