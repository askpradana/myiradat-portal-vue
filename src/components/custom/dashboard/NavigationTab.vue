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
          v-if="userStore.user?.role_id === 2"
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

const userStore = useUserStore()

const { activeTab } = defineProps<{
  activeTab: 'dashboard' | 'users' | 'profile' | 'data'
}>()

// Tentukan tipe emit, misalnya kita ingin emit event 'changeTab'
const emit = defineEmits<{
  (e: 'changeTab', newTab: 'dashboard' | 'users' | 'profile' | 'data'): void
}>()

// fungsi untuk memancarkan event
const selectTab = (tab: 'dashboard' | 'users' | 'profile' | 'data') => {
  emit('changeTab', tab)
}
</script>
