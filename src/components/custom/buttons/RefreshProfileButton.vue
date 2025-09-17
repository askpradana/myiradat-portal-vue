<template>
  <Button
    @click="handleRefresh"
    variant="outline"
    size="icon"
    class="relative transition-all duration-200 ease-out"
    :class="{
      'opacity-80 cursor-not-allowed': state === 'loading',
      'opacity-60 cursor-not-allowed': state === 'cooldown'
    }"
    :disabled="isDisabled"
    :aria-label="ariaLabel"
    :title="ariaLabel"
  >
    <div class="flex items-center gap-1">
      <RefreshCw
        :class="[
          'h-4 w-4 transition-transform duration-200',
          { 'animate-spin': state === 'loading' }
        ]"
      />
      <span
        v-if="state === 'cooldown'"
        class="text-xs text-muted-foreground min-w-[20px] text-right"
      >
        {{ cooldownTime }}s
      </span>
    </div>
  </Button>
</template>

<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useProfileRefresh } from '@/composables/auth/useProfileRefresh'
import { toast } from 'vue-sonner'

const {
  state,
  cooldownTime,
  isDisabled,
  ariaLabel,
  refreshProfile
} = useProfileRefresh()

const handleRefresh = async () => {
  if (isDisabled.value) return

  try {
    await refreshProfile()
    toast.success('Profile refreshed successfully')
  } catch (error) {
    // Error is already handled in the composable with toast
    console.error('Refresh failed:', error)
  }
}
</script>