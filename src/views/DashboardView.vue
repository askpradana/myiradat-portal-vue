<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderDashboard :role-user="roleUser" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Navigation Tab Content -->
      <NavigationTab :active-tab="activeTab" @change-tab="changeTab" />

      <!-- Main Dashboard Tab Content -->
      <div v-if="activeTab === 'dashboard'">
        <DashboardMainView />
      </div>

      <!-- Users Tab Content -->
      <div v-if="activeTab === 'users'">
        <UserManagementView />
      </div>

      <!-- Profile Tab Content -->
      <div v-if="activeTab === 'data'">
        <DataView />
      </div>

      <!-- Profile Tab Content -->
      <div v-if="activeTab === 'profile'" class="max-w-4xl mx-auto">
        <UserProfileView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderDashboard from '@/components/custom/dashboard/HeaderDashboard.vue'
import NavigationTab from '@/components/custom/dashboard/NavigationTab.vue'
import UserManagementView from './admin/UserManagementView.vue'
import UserProfileView from './user/UserProfileView.vue'
import DashboardMainView from './DashboardMainView.vue'
import DataView from './user/DataView.vue'
import { useUserStore } from '@/stores/userStores'

const userStore = useUserStore()
userStore.initializeAuth()

const role = userStore.user?.role_id === 1 ? 'admin' : 'user'

// Active tab state - Users tab is active by default
const activeTab = ref<'dashboard' | 'users' | 'data' | 'profile'>('dashboard')
const roleUser = ref<'admin' | 'user'>(role)

const changeTab = (activeValue: 'dashboard' | 'users' | 'data' | 'profile') => {
  activeTab.value = activeValue
}
</script>
