<template>
  <DashboardLayout
    :active-tab="activeTab"
    :user-role="userRole"
    :is-loading="isTabLoading"
    :error="tabError"
    @tab-change="changeTab"
    @retry="handleRetry"
  >
    <!-- Main Dashboard Tab Content -->
    <div v-if="activeTab === 'dashboard'">
      <Suspense>
        <template #default>
          <DashboardMainView />
        </template>
        <template #fallback>
          <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <CardServiceSkeleton v-for="n in 6" :key="n" />
          </div>
        </template>
      </Suspense>
    </div>

    <!-- Users Tab Content -->
    <div v-if="activeTab === 'users'" class="space-y-6">
      <Suspense>
        <template #default>
          <UserManagementView />
        </template>
        <template #fallback>
          <ListUserTableSkeleton />
        </template>
      </Suspense>
    </div>

    <!-- Data Tab Content -->
    <div v-if="activeTab === 'data'">
      <Suspense>
        <template #default>
          <DataView />
        </template>
        <template #fallback>
          <DataViewTableSkeleton />
        </template>
      </Suspense>
    </div>

    <!-- Profile Tab Content -->
    <div v-if="activeTab === 'profile'" class="max-w-4xl mx-auto">
      <Suspense>
        <template #default>
          <UserProfileView />
        </template>
        <template #fallback>
          <div class="space-y-6">
            <Skeleton class="h-32 w-full" />
            <Skeleton class="h-48 w-full" />
          </div>
        </template>
      </Suspense>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy-loaded components for better performance
const DashboardMainView = defineAsyncComponent(() => import('./DashboardMainView.vue'))
const UserManagementView = defineAsyncComponent(() => import('./admin/UserManagementView.vue'))
const UserProfileView = defineAsyncComponent(() => import('./user/UserProfileView.vue'))
const DataView = defineAsyncComponent(() => import('./user/DataView.vue'))

// Layout and skeleton components
import DashboardLayout from '@/components/custom/dashboard/DashboardLayout.vue'
import CardServiceSkeleton from '@/components/custom/skeletons/CardServiceSkeleton.vue'
import ListUserTableSkeleton from '@/components/custom/skeletons/ListUserTableSkeleton.vue'
import DataViewTableSkeleton from '@/components/custom/skeletons/DataViewTableSkeleton.vue'

// Stores and composables
import { useUserStore } from '@/stores/userStores'
import { useDashboardTabs } from '@/composables/useDashboardTabs'
import { getUserRole } from '@/lib/dashboard-utils'

// Initialize store
const userStore = useUserStore()

// Computed user role
const userRole = computed(() => getUserRole(userStore.user))

// Dashboard tabs composable
const {
  activeTab,
  isTabLoading,
  tabError,
  changeTab,
  initializeTabs
} = useDashboardTabs({
  userRole,
  defaultTab: 'dashboard',
  persistToUrl: true,
  persistToStorage: true
})

// Error handling
const handleRetry = async () => {
  try {
    await userStore.initializeAuth()
    await initializeTabs()
  } catch (error) {
    console.error('Retry failed:', error)
  }
}

// Initialize authentication and tabs on mount
onMounted(async () => {
  try {
    await userStore.initializeAuth()
  } catch (error) {
    console.error('Authentication initialization failed:', error)
  }
})
</script>
