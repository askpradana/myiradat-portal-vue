<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderDashboard :role-user="userRole" />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderDashboard from '@/components/custom/dashboard/HeaderDashboard.vue'
import { useUserStore } from '@/stores/userStores'
import { getUserRole } from '@/lib/dashboard-utils'
import { computed } from 'vue'

const userStore = useUserStore()
const userRole = computed(() => getUserRole(userStore.user))
</script>