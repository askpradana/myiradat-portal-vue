<template>
  <DashboardLayout
    :active-tab="activeTab"
    :user-role="userRole"
    :show-fab="userRole === 'admin' && activeTab === 'dashboard'"
    @tab-change="changeTab"
    @fab-click="handleAdminQuickActions"
  >
    <!-- Redirect notifications -->
    <RedirectNotification />

    <!-- Profile completion banner -->
    <ProfileCompletionBanner />

    <!-- Route-based Content -->
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

    <!-- Assessments Tab Content -->
    <div v-if="activeTab === 'assessments'" class="max-w-7xl mx-auto">
      <Suspense>
        <template #default>
          <QuizListView />
        </template>
        <template #fallback>
          <div class="space-y-6">
            <Skeleton class="h-32 w-full" />
            <Skeleton class="h-48 w-full" />
            <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Skeleton class="h-64 w-full" v-for="n in 6" :key="n" />
            </div>
          </div>
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
import { computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy-loaded components for better performance
const DashboardMainView = defineAsyncComponent(() => import('./DashboardMainView.vue'))
const UserManagementView = defineAsyncComponent(() => import('./admin/UserManagementView.vue'))
const UserProfileView = defineAsyncComponent(() => import('./user/UserProfileView.vue'))
const DataView = defineAsyncComponent(() => import('./user/DataView.vue'))
const QuizListView = defineAsyncComponent(() => import('./quiz/QuizListView.vue'))

// Layout and skeleton components
import DashboardLayout from '@/components/custom/dashboard/DashboardLayout.vue'
import CardServiceSkeleton from '@/components/custom/skeletons/CardServiceSkeleton.vue'
import ListUserTableSkeleton from '@/components/custom/skeletons/ListUserTableSkeleton.vue'
import DataViewTableSkeleton from '@/components/custom/skeletons/DataViewTableSkeleton.vue'
import RedirectNotification from '@/components/custom/notifications/RedirectNotification.vue'
import ProfileCompletionBanner from '@/components/custom/notifications/ProfileCompletionBanner.vue'

// Stores and utilities
import { useUserStore } from '@/stores/userStores'
import { getUserRole, getTabFromPath, getPathForTab } from '@/lib/dashboard-utils'
import type { DashboardTab } from '@/types/dashboard'

// Initialize store and router
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// Computed values
const userRole = computed(() => getUserRole(userStore.user))
const activeTab = computed<DashboardTab>(() => getTabFromPath(route.path))

// Navigation handler
const changeTab = async (tab: DashboardTab) => {
  const path = getPathForTab(tab)
  await router.push(path)
}

// Admin quick actions handler
const handleAdminQuickActions = () => {
  // For now, redirect to user management which is the most common admin action
  // In the future, this could open a quick actions menu
  changeTab('users')
}
</script>
