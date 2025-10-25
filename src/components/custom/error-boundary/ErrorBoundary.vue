<template>
  <div class="error-boundary-container">
    <!-- Error state display -->
    <div v-if="hasErrors && showErrorState" class="error-boundary-error">
      <!-- Critical error - full blocking state -->
      <div v-if="hasCriticalErrors" class="critical-error-state">
        <Card class="border-destructive/50 bg-destructive/10">
          <CardContent class="p-6">
            <div class="text-center space-y-4">
              <div class="w-16 h-16 mx-auto bg-destructive/20 rounded-full flex items-center justify-center">
                <AlertTriangle class="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-destructive mb-2">Critical Error</h3>
                <p class="text-sm text-muted-foreground">
                  {{ currentError?.message || 'A critical error has occurred' }}
                </p>
              </div>
              <div class="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  @click="handleRetry"
                  :disabled="isRetrying"
                  variant="default"
                  size="sm"
                >
                  <RefreshCw :class="{ 'animate-spin': isRetrying }" class="w-4 h-4 mr-2" />
                  {{ isRetrying ? 'Retrying...' : 'Retry' }}
                </Button>
                <Button @click="handleClearErrors" variant="outline" size="sm">
                  Clear Error
                </Button>
                <Button
                  v-if="allowFallback"
                  @click="showFallback = true"
                  variant="ghost"
                  size="sm"
                >
                  Continue Anyway
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Non-critical errors - show as dismissible banners -->
      <div v-else class="non-critical-errors space-y-2 mb-4">
        <TransitionGroup name="error-slide" tag="div">
          <Alert
            v-for="error in visibleErrors"
            :key="error.id"
            :variant="getAlertVariant(error.severity)"
            class="relative"
          >
            <component :is="getErrorIcon(error.severity)" class="h-4 w-4" />
            <AlertTitle class="text-sm font-medium">
              {{ getErrorTitle(error.severity) }}
            </AlertTitle>
            <AlertDescription class="text-sm">
              {{ error.message }}
              <div v-if="error.recoveryActions?.includes('retry')" class="mt-2 flex gap-2">
                <Button
                  @click="() => handleErrorRetry(error.id)"
                  :disabled="isRetrying"
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw :class="{ 'animate-spin': isRetrying }" class="w-3 h-3 mr-1" />
                  Retry
                </Button>
              </div>
            </AlertDescription>
            <Button
              @click="() => handleDismissError(error.id)"
              variant="ghost"
              size="sm"
              class="absolute top-2 right-2 h-6 w-6 p-0"
            >
              <X class="w-3 h-3" />
            </Button>
          </Alert>
        </TransitionGroup>
      </div>
    </div>

    <!-- Fallback content or default slot -->
    <div v-if="!hasCriticalErrors || showFallback" class="error-boundary-content">
      <!-- Show fallback component if provided and in fallback mode -->
      <component
        v-if="showFallback && fallbackComponent"
        :is="fallbackComponent"
        :error="currentError"
        :retry="handleRetry"
        :clear="handleClearErrors"
      />

      <!-- Show fallback slot if provided and in fallback mode -->
      <template v-else-if="showFallback && $slots.fallback">
        <slot
          name="fallback"
          :error="currentError"
          :retry="handleRetry"
          :clear="handleClearErrors"
          :hasErrors="hasErrors"
        />
      </template>

      <!-- Default slot content -->
      <template v-else>
        <slot
          :hasErrors="hasErrors"
          :errors="errors"
          :clearErrors="handleClearErrors"
          :retry="handleRetry"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onErrorCaptured, type Component } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, AlertCircle, Info, RefreshCw, X } from 'lucide-vue-next'

import { useErrorStateManager, type ErrorSeverity, type ErrorState } from '@/composables/api/useErrorStateManager'

interface ErrorBoundaryProps {
  // Error display configuration
  maxVisibleErrors?: number
  showErrorState?: boolean
  allowFallback?: boolean
  autoRetry?: boolean
  maxAutoRetries?: number

  // Fallback options
  fallbackComponent?: Component

  // Error filtering
  contextFilter?: string[]
  severityFilter?: ErrorSeverity[]

  // Recovery options
  retryFn?: () => Promise<void>
  onError?: (error: ErrorState) => void
  onRetry?: (error: ErrorState) => void
  onClear?: () => void
}

const props = withDefaults(defineProps<ErrorBoundaryProps>(), {
  maxVisibleErrors: 3,
  showErrorState: true,
  allowFallback: true,
  autoRetry: false,
  maxAutoRetries: 3,
  contextFilter: () => ['component', 'page'],
  severityFilter: () => ['info', 'warning', 'error', 'critical']
})

const emit = defineEmits<{
  error: [error: ErrorState]
  retry: [errorId: string]
  clear: []
  fallback: [show: boolean]
}>()

// Error state management
const errorManager = useErrorStateManager('error-boundary', {
  autoRetry: props.autoRetry,
  maxAutoRetries: props.maxAutoRetries,
  clearOnNavigation: true,
  showToast: false // Handle toasts manually
})

// Local state
const showFallback = ref(false)
const isRetrying = ref(false)

// Vue error capture
onErrorCaptured((error, vm, info) => {
  console.error('ErrorBoundary captured error:', error, info)

  const errorId = errorManager.addError({
    message: error.message || 'An unexpected error occurred',
    severity: 'error',
    context: 'component',
    source: 'vue-error-boundary',
    details: {
      error: error.toString(),
      componentInfo: info,
      stack: error.stack
    },
    recoveryActions: ['retry', 'ignore']
  })

  props.onError?.(errorManager.errors.value.find(e => e.id === errorId)!)
  emit('error', errorManager.errors.value.find(e => e.id === errorId)!)

  // Prevent the error from propagating further
  return false
})

// Computed properties
const { errors, hasErrors, hasCriticalErrors, currentError } = errorManager

const filteredErrors = computed(() => {
  return errors.value.filter(error => {
    const contextMatch = props.contextFilter.includes(error.context)
    const severityMatch = props.severityFilter.includes(error.severity)
    return contextMatch && severityMatch
  })
})

const visibleErrors = computed(() => {
  return filteredErrors.value
    .filter(error => error.severity !== 'critical')
    .slice(0, props.maxVisibleErrors)
})

// Utility functions
const getAlertVariant = (severity: ErrorSeverity): 'default' | 'destructive' => {
  const variantMap: Record<ErrorSeverity, 'default' | 'destructive'> = {
    info: 'default',
    warning: 'default', // Using default since there's no warning variant
    error: 'destructive',
    critical: 'destructive'
  }
  return variantMap[severity]
}

const getErrorIcon = (severity: ErrorSeverity) => {
  const iconMap = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    critical: AlertTriangle
  }
  return iconMap[severity]
}

const getErrorTitle = (severity: ErrorSeverity) => {
  const titleMap = {
    info: 'Information',
    warning: 'Warning',
    error: 'Error',
    critical: 'Critical Error'
  }
  return titleMap[severity]
}

// Action handlers
const handleRetry = async () => {
  if (isRetrying.value) return

  try {
    isRetrying.value = true

    if (props.retryFn) {
      await props.retryFn()
    }

    // Retry all errors that support retry
    const retryableErrors = errors.value.filter(error =>
      error.recoveryActions?.includes('retry')
    )

    for (const error of retryableErrors) {
      await errorManager.retryError(error.id, props.retryFn)
      props.onRetry?.(error)
      emit('retry', error.id)
    }

    // If successful, hide fallback
    if (showFallback.value && !hasErrors.value) {
      showFallback.value = false
      emit('fallback', false)
    }

  } catch (error) {
    console.error('Retry failed:', error)
  } finally {
    isRetrying.value = false
  }
}

const handleErrorRetry = async (errorId: string) => {
  if (isRetrying.value) return

  try {
    isRetrying.value = true
    await errorManager.retryError(errorId, props.retryFn)

    const error = errors.value.find(e => e.id === errorId)
    if (error) {
      props.onRetry?.(error)
      emit('retry', errorId)
    }
  } catch (error) {
    console.error('Individual error retry failed:', error)
  } finally {
    isRetrying.value = false
  }
}

const handleClearErrors = () => {
  errorManager.clearAllErrors()
  showFallback.value = false
  props.onClear?.()
  emit('clear')
  emit('fallback', false)
}

const handleDismissError = (errorId: string) => {
  errorManager.removeError(errorId)
}

// Watch for error changes
watch(hasErrors, (newHasErrors) => {
  if (!newHasErrors) {
    showFallback.value = false
    emit('fallback', false)
  }
})

watch(hasCriticalErrors, (newHasCritical) => {
  if (newHasCritical && props.allowFallback) {
    // Don't auto-show fallback for critical errors, let user decide
  }
})

// Expose public methods for parent components
defineExpose({
  addError: errorManager.addError,
  clearErrors: handleClearErrors,
  retry: handleRetry,
  hasErrors,
  errors,
  showFallback: () => {
    showFallback.value = true
    emit('fallback', true)
  }
})
</script>

<style scoped>
.error-boundary-container {
  @apply w-full;
}

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.critical-error-state {
  @apply animate-in fade-in-0 slide-in-from-top-4 duration-300;
}

.non-critical-errors {
  @apply animate-in fade-in-0 slide-in-from-left-4 duration-300;
}
</style>