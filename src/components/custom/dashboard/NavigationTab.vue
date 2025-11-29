<template>
  <!-- Navigation Tabs -->
  <div class="mb-6 sm:mb-8">
    <div class="border-b border-border">
      <!-- Mobile: Horizontal scroll tabs -->
      <nav class="-mb-px flex sm:space-x-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1 sm:pb-0" role="tablist">
        <button
          @click="selectTab('dashboard')"
          :class="[
            'py-3 px-4 sm:py-2 sm:px-1 border-b-2 font-medium text-sm sm:text-sm whitespace-nowrap flex-shrink-0 snap-start touch-manipulation transition-colors',
            'min-w-[44px] h-12 sm:h-auto flex items-center justify-center sm:block',
            activeTab === 'dashboard'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
          role="tab"
          :aria-selected="activeTab === 'dashboard'"
        >
          <span class="sm:hidden">📊</span>
          <span class="hidden sm:inline">{{ t('common.navigation.dashboard') }}</span>
          <span class="sm:hidden ml-2">{{ t('common.navigation.dashboard') }}</span>
        </button>
        <button
          v-if="userStore.user?.role_id === 1"
          @click="selectTab('users')"
          :class="[
            'py-3 px-4 sm:py-2 sm:px-1 border-b-2 font-medium text-sm sm:text-sm whitespace-nowrap flex-shrink-0 snap-start touch-manipulation transition-colors',
            'min-w-[44px] h-12 sm:h-auto flex items-center justify-center sm:block',
            activeTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
          role="tab"
          :aria-selected="activeTab === 'users'"
        >
          <span class="sm:hidden">👥</span>
          <span class="hidden sm:inline">{{ t('common.navigation.usersManagement') }}</span>
          <span class="sm:hidden ml-2">{{ t('common.navigation.users') }}</span>
        </button>
        <button
          @click="selectTab('data')"
          :class="[
            'py-3 px-4 sm:py-2 sm:px-1 border-b-2 font-medium text-sm sm:text-sm whitespace-nowrap flex-shrink-0 snap-start touch-manipulation transition-colors',
            'min-w-[44px] h-12 sm:h-auto flex items-center justify-center sm:block',
            activeTab === 'data'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
          role="tab"
          :aria-selected="activeTab === 'data'"
        >
          <span class="sm:hidden">📋</span>
          <span class="hidden sm:inline">{{ t('common.navigation.userData') }}</span>
          <span class="sm:hidden ml-2">{{ t('common.navigation.data') }}</span>
        </button>
        <button
          v-if="userStore.user?.role_id !== 1"
          @click="selectTab('assessments')"
          :class="[
            'py-3 px-4 sm:py-2 sm:px-1 border-b-2 font-medium text-sm sm:text-sm whitespace-nowrap flex-shrink-0 snap-start touch-manipulation transition-colors',
            'min-w-[44px] h-12 sm:h-auto flex items-center justify-center sm:block',
            activeTab === 'assessments'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
          role="tab"
          :aria-selected="activeTab === 'assessments'"
        >
          <span class="sm:hidden">🎯</span>
          <span class="hidden sm:inline">{{ t('common.navigation.funQuiz') }}</span>
          <span class="sm:hidden ml-2">{{ t('common.navigation.quiz') }}</span>
        </button>
        <button
          v-if="userStore.user?.role_id === 2"
          @click="selectTab('profile')"
          :class="[
            'py-3 px-4 sm:py-2 sm:px-1 border-b-2 font-medium text-sm sm:text-sm whitespace-nowrap flex-shrink-0 snap-start touch-manipulation transition-colors',
            'min-w-[44px] h-12 sm:h-auto flex items-center justify-center sm:block',
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
          role="tab"
          :aria-selected="activeTab === 'profile'"
        >
          <span class="sm:hidden">👤</span>
          <span class="hidden sm:inline">{{ t('common.navigation.userProfile') }}</span>
          <span class="sm:hidden ml-2">{{ t('common.navigation.profile') }}</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStores'
import type { DashboardTab } from '@/types/dashboard'

const { t } = useI18n()
const userStore = useUserStore()

const { activeTab } = defineProps<{
  activeTab: DashboardTab
}>()

// Tentukan tipe emit, misalnya kita ingin emit event 'changeTab'
const emit = defineEmits<{
  (e: 'changeTab', newTab: DashboardTab): void
}>()

// fungsi untuk memancarkan event
const selectTab = (tab: DashboardTab) => {
  emit('changeTab', tab)
}
</script>

<style scoped>
/* Hide scrollbar for mobile tabs */
.scrollbar-hide {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Smooth scroll behavior */
nav {
  scroll-behavior: smooth;
}

/* Enhanced touch targets for mobile */
@media (max-width: 640px) {
  button[role="tab"] {
    min-height: 48px;
    min-width: 120px;
  }
}
</style>
