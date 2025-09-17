import { ref, computed, reactive } from 'vue'

export type LoadingState = 'idle' | 'loading' | 'submitting' | 'refreshing' | 'error' | 'success'

export interface LoadingStates {
  [key: string]: boolean
}

/**
 * Composable for managing single loading state
 * Provides reactive state for common loading scenarios
 */
export function useLoadingState(initialState: LoadingState = 'idle') {
  const state = ref<LoadingState>(initialState)

  const isIdle = computed(() => state.value === 'idle')
  const isLoading = computed(() => state.value === 'loading')
  const isSubmitting = computed(() => state.value === 'submitting')
  const isRefreshing = computed(() => state.value === 'refreshing')
  const isError = computed(() => state.value === 'error')
  const isSuccess = computed(() => state.value === 'success')

  const isBusy = computed(() =>
    ['loading', 'submitting', 'refreshing'].includes(state.value)
  )

  const setLoading = () => { state.value = 'loading' }
  const setSubmitting = () => { state.value = 'submitting' }
  const setRefreshing = () => { state.value = 'refreshing' }
  const setError = () => { state.value = 'error' }
  const setSuccess = () => { state.value = 'success' }
  const setIdle = () => { state.value = 'idle' }

  const setState = (newState: LoadingState) => {
    state.value = newState
  }

  return {
    // Current state
    state: computed(() => state.value),

    // State checkers
    isIdle,
    isLoading,
    isSubmitting,
    isRefreshing,
    isError,
    isSuccess,
    isBusy,

    // State setters
    setLoading,
    setSubmitting,
    setRefreshing,
    setError,
    setSuccess,
    setIdle,
    setState
  }
}

/**
 * Composable for managing multiple named loading states
 * Useful for tracking different operations independently
 */
export function useMultipleLoadingStates() {
  const states = reactive<LoadingStates>({})

  const isLoading = (key: string): boolean => {
    return states[key] || false
  }

  const setLoading = (key: string, loading: boolean) => {
    states[key] = loading
  }

  const setMultipleLoading = (updates: Record<string, boolean>) => {
    Object.entries(updates).forEach(([key, loading]) => {
      states[key] = loading
    })
  }

  const clearLoading = (key: string) => {
    delete states[key]
  }

  const clearAllLoading = () => {
    Object.keys(states).forEach(key => {
      delete states[key]
    })
  }

  const isAnyLoading = computed(() =>
    Object.values(states).some(loading => loading)
  )

  const getLoadingKeys = computed(() =>
    Object.keys(states).filter(key => states[key])
  )

  return {
    // State access
    states: computed(() => ({ ...states })),
    isLoading,
    isAnyLoading,
    getLoadingKeys,

    // State management
    setLoading,
    setMultipleLoading,
    clearLoading,
    clearAllLoading
  }
}

/**
 * Composable for API-specific loading states
 * Provides common patterns for API operations
 */
export function useApiLoadingState() {
  const {
    state,
    isLoading,
    isSubmitting,
    isError,
    isSuccess,
    isBusy,
    setState
  } = useLoadingState()

  const error = ref<Error | null>(null)

  const withLoading = async <T>(
    operation: () => Promise<T>,
    loadingState: LoadingState = 'loading'
  ): Promise<T | null> => {
    setState(loadingState)
    error.value = null

    try {
      const result = await operation()
      setState('success')
      return result
    } catch (err) {  
      setState('error')
      error.value = err instanceof Error ? err : new Error('Operation failed')
      throw err
    }
  }

  const clearError = () => {
    error.value = null
    if (state.value === 'error') {
      setState('idle')
    }
  }

  return {
    // State
    state,
    error: computed(() => error.value),

    // Computed state checkers
    isLoading,
    isSubmitting,
    isError,
    isSuccess,
    isBusy,

    // Actions
    withLoading,
    clearError,
    setState
  }
}