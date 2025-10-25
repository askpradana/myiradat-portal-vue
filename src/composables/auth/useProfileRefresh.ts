import { ref, computed, onMounted, onUnmounted, type Ref, type ComputedRef } from 'vue'
import { useUserStore } from '@/stores/userStores'
import { getProfile } from '@/api/users/getProfile'
import { useApiError } from '@/composables/api/useApiError'
import { useI18n } from 'vue-i18n'

export type RefreshButtonState = 'ready' | 'loading' | 'cooldown'

export type UseProfileRefreshReturn = {
  state: ComputedRef<RefreshButtonState>
  cooldownTime: Ref<number>
  isDisabled: ComputedRef<boolean>
  ariaLabel: ComputedRef<string>
  refreshProfile: () => Promise<void>
  error: ComputedRef<Error | null>
  clearError: () => void
}

const COOLDOWN_DURATION = 60 // 60 seconds
const STORAGE_KEY = 'last_profile_refresh'

export function useProfileRefresh(): UseProfileRefreshReturn {
  const userStore = useUserStore()
  const { error: apiError, handleError, clearError } = useApiError()
  const { t } = useI18n()

  const isLoading = ref(false)
  const cooldownTime = ref(0)

  let cooldownInterval: number | null = null

  // Computed state based on loading and cooldown
  const state = computed((): RefreshButtonState => {
    if (isLoading.value) return 'loading'
    if (cooldownTime.value > 0) return 'cooldown'
    return 'ready'
  })

  const isDisabled = computed(() => state.value !== 'ready')

  const ariaLabel = computed(() => {
    switch (state.value) {
      case 'ready':
        return t('common.aria.refreshProfile')
      case 'loading':
        return t('common.aria.refreshingProfile')
      case 'cooldown':
        return t('common.aria.refreshCooldown', { seconds: cooldownTime.value })
      default:
        return t('common.aria.refreshProfile')
    }
  })

  // Calculate remaining cooldown time from localStorage
  const calculateCooldownTime = (): number => {
    const lastRefreshString = localStorage.getItem(STORAGE_KEY)
    if (!lastRefreshString) return 0

    try {
      const lastRefreshTime = parseInt(lastRefreshString, 10)
      const now = Date.now()
      const timePassed = Math.floor((now - lastRefreshTime) / 1000)
      const remainingTime = Math.max(0, COOLDOWN_DURATION - timePassed)

      return remainingTime
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Invalid data, clear it
      localStorage.removeItem(STORAGE_KEY)
      return 0
    }
  }

  // Start countdown timer
  const startCooldownTimer = (initialTime: number) => {
    cooldownTime.value = initialTime

    if (cooldownInterval) {
      clearInterval(cooldownInterval)
    }

    cooldownInterval = setInterval(() => {
      cooldownTime.value--

      if (cooldownTime.value <= 0) {
        clearInterval(cooldownInterval!)
        cooldownInterval = null
      }
    }, 1000)
  }

  // Main refresh function
  const refreshProfile = async (): Promise<void> => {
    if (isDisabled.value) return

    isLoading.value = true
    clearError()

    try {
      const response = await getProfile()
      if (response?.user) {
        userStore.setUserProfileData(response.user)
      }

      // Set cooldown
      const now = Date.now()
      localStorage.setItem(STORAGE_KEY, now.toString())
      startCooldownTimer(COOLDOWN_DURATION)

    } catch (error) {  
      handleError(error, t('common.messages.error.refreshFailed'))
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Initialize cooldown on mount
  onMounted(() => {
    const remainingTime = calculateCooldownTime()
    if (remainingTime > 0) {
      startCooldownTimer(remainingTime)
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (cooldownInterval) {
      clearInterval(cooldownInterval)
    }
  })

  return {
    state,
    cooldownTime,
    isDisabled,
    ariaLabel,
    refreshProfile,
    error: computed(() => apiError.value ? new Error(apiError.value.message || 'Unknown error') : null),
    clearError
  }
}