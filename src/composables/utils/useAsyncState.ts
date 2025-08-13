import { ref, computed, type Ref } from 'vue'

export type AsyncState<T> = {
  data: Ref<T | null>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  isSuccess: Ref<boolean>
  isError: Ref<boolean>
  execute: () => Promise<void>
  reset: () => void
}

export function useAsyncState<T>(
  asyncFunction: () => Promise<T>,
  options: {
    immediate?: boolean
    initialData?: T | null
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  } = {}
): AsyncState<T> {
  const { immediate = false, initialData = null, onSuccess, onError } = options

  const data = ref<T | null>(initialData)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const isSuccess = computed(() => data.value !== null && !error.value)
  const isError = computed(() => !!error.value)

  const execute = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await asyncFunction()
      data.value = result
      
      onSuccess?.(result)
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj
      onError?.(errorObj)
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    data.value = initialData
    isLoading.value = false
    error.value = null
  }

  if (immediate) {
    execute()
  }

  return {
    data: data as Ref<T | null>,
    isLoading,
    error,
    isSuccess,
    isError,
    execute,
    reset
  }
}