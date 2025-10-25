<template>
  <ErrorBoundary
    :show-error-state="true"
    :allow-fallback="true"
    :auto-retry="autoRetry"
    :max-auto-retries="maxRetries"
    :retry-fn="retryFunction"
    @error="handleError"
    @retry="handleRetry as any"
    @clear="handleClear"
  >
    <template #default="{ hasErrors, clearErrors }">
      <slot :has-errors="hasErrors" :clear-errors="clearErrors" />
    </template>

    <template #fallback="{ retry, clear }">
      <div class="simple-error-fallback text-center py-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <AlertTriangle class="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-semibold text-foreground mb-2">
          {{ fallbackTitle || 'Something went wrong' }}
        </h3>
        <p class="text-muted-foreground mb-4">
          {{ fallbackMessage || 'An unexpected error occurred. Please try again.' }}
        </p>
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <Button @click="retry" variant="default" size="sm">
            <RefreshCw class="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button @click="clear" variant="outline" size="sm">
            Dismiss
          </Button>
        </div>
      </div>
    </template>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { AlertTriangle, RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import ErrorBoundary from './ErrorBoundary.vue'
import type { ErrorState } from '@/composables/api/useErrorStateManager'

interface SimpleErrorBoundaryProps {
  autoRetry?: boolean
  maxRetries?: number
  fallbackTitle?: string
  fallbackMessage?: string
  retryFunction?: () => Promise<void>
}

withDefaults(defineProps<SimpleErrorBoundaryProps>(), {
  autoRetry: false,
  maxRetries: 3,
})

const emit = defineEmits<{
  error: [error: ErrorState]
  retry: [errorId: string]
  clear: []
}>()

const handleError = (error: ErrorState) => {
  console.error('SimpleErrorBoundary caught error:', error)
  emit('error', error)
}

const handleRetry = (errorId: string) => {
  console.log('SimpleErrorBoundary retrying error:', errorId)
  emit('retry', errorId)
}

const handleClear = () => {
  console.log('SimpleErrorBoundary clearing errors')
  emit('clear')
}
</script>

<style scoped>
.simple-error-fallback {
  @apply animate-in fade-in-0 slide-in-from-bottom-4 duration-500;
}
</style>