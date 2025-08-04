<template>
  <header class="bg-card border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div>
          <h1 class="text-3xl font-bold text-foreground">
            {{ roleUser === 'admin' ? 'Admin Dashboard' : 'User Dashboard' }}
          </h1>
          <p class="text-muted-foreground mt-1">Welcome {{ userStore.user?.name }}</p>
          <!-- <p class="text-muted-foreground mt-1">
            {{
              activeTab === 'users'
                ? 'Manage your application users and settings'
                : 'View and manage your profile information'
            }}
          </p> -->
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="icon" @click="logoutFunc">
            <LogOut class="w-4 h-4" />
          </Button>
          <ThemeToggle />
          <Button
            v-if="roleUser === 'admin'"
            class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/85"
          >
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add User
          </Button>
          <Button
            v-if="roleUser === 'user'"
            class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/85"
          >
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import Button from '@/components/ui/button/Button.vue'
import { LogOut } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStores'

const userStore = useUserStore()
const router = useRouter()

const { roleUser } = defineProps<{
  roleUser: 'admin' | 'user'
}>()

const logoutFunc = () => {
  userStore.clearAuthData()
  router.push('/login')
}
</script>
