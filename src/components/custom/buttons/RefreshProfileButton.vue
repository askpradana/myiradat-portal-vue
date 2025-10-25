<template>
  <Button
    @click="handleRefresh"
    variant="ghost"
    size="responsive-icon"
    class="relative transition-all duration-200 ease-out hover:bg-muted/50"
    :class="{
      'opacity-80 cursor-not-allowed': state === 'loading',
      'opacity-60 cursor-not-allowed': state === 'cooldown',
    }"
    :disabled="isDisabled"
    :aria-label="ariaLabel"
    :title="ariaLabel"
  >
    <div class="flex items-center gap-2">
      <RefreshCw
        :class="[
          'h-4 w-4 transition-transform duration-200 text-muted-foreground shrink-0',
          { 'animate-spin': state === 'loading' },
        ]"
      />
      <span class="text-sm text-muted-foreground hidden sm:inline text-left">
        {{
          state === 'loading' ? t('buttons.refresh.refreshing') : state === 'cooldown' ? `${cooldownTime}s` : t('buttons.refresh.refresh')
        }}
      </span>
    </div>
  </Button>
</template>

<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useProfileRefresh } from '@/composables/auth/useProfileRefresh'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { state, cooldownTime, isDisabled, ariaLabel, refreshProfile } = useProfileRefresh()

const handleRefresh = async () => {
  if (isDisabled.value) return

  try {
    await refreshProfile()
    toast.success(t('common.messages.success.profileRefreshed'))
  } catch (error) {
    // Error is already handled in the composable with toast
    console.error('Refresh failed:', error)
  }
}
</script>
