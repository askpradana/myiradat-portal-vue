<template>
  <div class="min-h-screen bg-background">
    <HeaderDashboard :role-user="roleUser" />
    <main :class="mainClasses">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HeaderDashboard from '@/components/custom/dashboard/HeaderDashboard.vue'
import { useUserStore } from '@/stores/userStores'

// Props untuk kustomisasi layout jika diperlukan
interface Props {
  maxWidth?: string
  padding?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'max-w-7xl',
  padding: 'px-4 sm:px-6 lg:px-8 py-8',
})

const userStore = useUserStore()
userStore.initializeAuth()

const role = userStore.user?.role_id === 1 ? 'admin' : 'user'
const roleUser = ref<'admin' | 'user'>(role)

// Computed untuk dynamic classes jika menggunakan props
const mainClasses = computed(() => {
  return `${props.maxWidth} mx-auto ${props.padding}`
})
</script>

<style scoped></style>
