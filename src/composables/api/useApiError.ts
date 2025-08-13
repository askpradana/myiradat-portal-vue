import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { toast } from 'vue-sonner'

export type ApiError = {
  message: string
  status?: number
  code?: string
  details?: Record<string, any>
}

export type ApiErrorHandler = {
  error: Ref<ApiError | null>
  hasError: ComputedRef<boolean>
  handleError: (error: unknown, context?: string) => void
  clearError: () => void
  showErrorToast: (message?: string) => void
}

export function useApiError(): ApiErrorHandler {
  const error = ref<ApiError | null>(null)
  
  const hasError = computed(() => !!error.value)

  const parseError = (err: unknown): ApiError => {
    if (err instanceof Error) {
      return {
        message: err.message,
        details: { originalError: err }
      }
    }

    if (typeof err === 'object' && err !== null) {
      const errorObj = err as any
      return {
        message: errorObj.message || 'An unknown error occurred',
        status: errorObj.status,
        code: errorObj.code,
        details: errorObj
      }
    }

    return {
      message: String(err) || 'An unknown error occurred'
    }
  }

  const handleError = (err: unknown, context?: string) => {
    const parsedError = parseError(err)
    
    if (context) {
      parsedError.message = `${context}: ${parsedError.message}`
    }
    
    error.value = parsedError
    console.error('API Error:', parsedError)
  }

  const clearError = () => {
    error.value = null
  }

  const showErrorToast = (customMessage?: string) => {
    if (error.value) {
      toast.error('Error', {
        description: customMessage || error.value.message
      })
    }
  }

  return {
    error,
    hasError,
    handleError,
    clearError,
    showErrorToast
  }
}