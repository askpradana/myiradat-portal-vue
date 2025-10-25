<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStores'
import Button from '@/components/ui/button/Button.vue'
import { User, X } from 'lucide-vue-next'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const isDismissed = ref(false)
const wasLocallyDismissed = ref(false)

onMounted(() => {
  if (userStore.user) {
    const dismissalKey = `profile-completion-banner-dismissed-${userStore.user.id}`
    wasLocallyDismissed.value = localStorage.getItem(dismissalKey) === 'true'
  }
})

const shouldShowBanner = computed(() => {
  if (isDismissed.value || wasLocallyDismissed.value) return false
  if (!userStore.user) return false
  if (userStore.user.date_of_birth !== null) return false

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
  <div v-if="shouldShowBanner" role="banner" :aria-label="t('profile.completion.bannerAnnouncement')">
    <div class="flex items-center justify-between border-b bg-blue-50/80 dark:bg-blue-950/30 px-4 py-3 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800">
      <div class="flex items-center gap-3">
        <User class="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span class="text-sm font-medium">{{ t('profile.completion.helpMessage') }}</span>
          <Button
            variant="link"
            size="sm"
            class="h-auto p-0 text-blue-700 dark:text-blue-300 underline text-sm hover:text-blue-800 dark:hover:text-blue-200"
            @click="navigateToProfile"
          >
            {{ t('profile.completion.addDateOfBirth') }}
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        class="h-auto p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
        @click="dismissBanner"
        :aria-label="t('profile.completion.dismissBanner')"
      >
        <X class="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  </div>
</template>