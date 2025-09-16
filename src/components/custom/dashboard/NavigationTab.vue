<template>
  <!-- Navigation Tabs -->
  <div class="mb-8">
    <div class="border-b border-border">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="selectTab('dashboard')"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'dashboard'
              ? 'border-primary/50 text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
        >
          Dashboard
        </button>
        <button
          v-if="userStore.user?.role_id === 1"
          @click="selectTab('users')"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'users'
              ? 'border-primary/50 text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
        >
          Users Management
        </button>
        <button
          v-if="userStore.user?.role_id === 1"
          @click="selectTab('organizations')"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'organizations'
              ? 'border-primary/50 text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
        >
          Organizations
        </button>
        <button
          @click="selectTab('data')"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'data'
              ? 'border-primary/50 text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
        >
          User Data
        </button>
        <button
          @click="selectTab('assessments')"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'assessments'
              ? 'border-primary/50 text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
        >
          Assessments
        </button>
        <button
          v-if="userStore.user?.role_id === 2"
          @click="selectTab('profile')"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'profile'
              ? 'border-primary/50 text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
          ]"
        >
          User Profile
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStores'
import type { DashboardTab } from '@/types/dashboard'

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
