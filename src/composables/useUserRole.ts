import { computed, readonly } from 'vue'
import { useUserStore } from '@/stores/userStores'

export type UserRole = 'admin' | 'user'

export const useUserRole = () => {
  const userStore = useUserStore()

  const isAdmin = computed(() => userStore.user?.role_id === 1)
  const isUser = computed(() => userStore.user?.role_id !== 1)
  const roleType = computed((): UserRole => isAdmin.value ? 'admin' : 'user')

  return {
    isAdmin: readonly(isAdmin),
    isUser: readonly(isUser),
    roleType: readonly(roleType),
    user: computed(() => userStore.user)
  }
}