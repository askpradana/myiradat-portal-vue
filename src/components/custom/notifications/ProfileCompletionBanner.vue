<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStores'
import Button from '../../ui/button/Button.vue'
import { User, X } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const isDismissed = ref(false)

const shouldShowBanner = computed(() => {
  if (isDismissed.value) return false
  if (!userStore.user) return false
  if (userStore.user.date_of_birth !== null) return false

  const dismissalKey = `profile-completion-banner-dismissed-${userStore.user.id}`
  const wasDismissed = localStorage.getItem(dismissalKey) === 'true'

  if (wasDismissed) {
    isDismissed.value = true
    return false
  }

  return true
})

const dismissBanner = () => {
  if (userStore.user) {
    const dismissalKey = `profile-completion-banner-dismissed-${userStore.user.id}`
    localStorage.setItem(dismissalKey, 'true')
  }
  isDismissed.value = true
}

const navigateToProfile = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div v-if="shouldShowBanner" role="banner" aria-label="Profile completion announcement">
    <div class="flex items-center justify-between border-b bg-blue-50/80 dark:bg-blue-950/30 px-4 py-3 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800">
      <div class="flex items-center gap-3">
        <User class="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span class="text-sm font-medium">Help us provide better psychological insights by completing your profile</span>
          <Button
            variant="link"
            size="sm"
            class="h-auto p-0 text-blue-700 dark:text-blue-300 underline text-sm hover:text-blue-800 dark:hover:text-blue-200"
            @click="navigateToProfile"
          >
            Add date of birth
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        class="h-auto p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
        @click="dismissBanner"
        aria-label="Dismiss profile completion banner"
      >
        <X class="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  </div>
</template>