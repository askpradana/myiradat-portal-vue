<template>
  <div class="text-center py-8" role="alert" aria-live="polite">
    <div
      class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
    >
      <AlertIcon class="w-8 h-8 text-red-600" />
    </div>
    <p class="text-red-600 font-medium">Failed to load profile data</p>
    <p class="text-sm text-muted-foreground mt-1">{{ errorMessage || 'An unexpected error occurred' }}</p>
    <Button variant="outline" size="sm" @click="onRetry" class="mt-4">
      <RefreshIcon class="w-4 h-4 mr-2" />
      Try Again
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { AlertIcon, RefreshIcon } from '@/components/ui/icons'

interface Props {
  errorMessage?: string
}

interface Emits {
  (e: 'retry'): void
}

withDefaults(defineProps<Props>(), {
  errorMessage: ''
})

const emit = defineEmits<Emits>()

const onRetry = () => emit('retry')
</script>