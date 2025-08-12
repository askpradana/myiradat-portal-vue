<template>
  <header class="bg-card border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <!-- Left: Title & Subtitle -->
        <div>
          <h1 class="text-3xl font-bold text-foreground">
            {{ roleUser === 'admin' ? 'Admin Dashboard' : 'My.Iradat' }}
          </h1>
          <p class="text-muted-foreground mt-1 text-sm">Welcome {{ userStore.user?.name }}</p>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2">
          <LogoutAlert />
          <ThemeToggle />

          <!-- Admin Actions -->
          <template v-if="roleUser === 'admin'">
            <Button class="btn-primary" @click="addNewUser">
              <User :size="20" />
              <span>Add User</span>
            </Button>
            <Button class="btn-primary" @click="addNewUserBatch">
              <Users :size="20" />
              <span>Add User Batch</span>
            </Button>
          </template>

          <!-- User Actions -->
          <template v-else-if="roleUser === 'user'">
            <Button class="btn-primary">
              <Edit3 :size="18" />
              <span>Edit Profile</span>
            </Button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import Button from '@/components/ui/button/Button.vue'
import { useUserStore } from '@/stores/userStores'
import LogoutAlert from '../alerts/LogoutAlert.vue'
import { Users, User, Edit3 } from 'lucide-vue-next'

const userStore = useUserStore()
const router = useRouter()

const { roleUser } = defineProps<{
  roleUser: 'admin' | 'user'
}>()

const addNewUser = () => {
  router.push('/dashboard/admin/create-user')
}

const addNewUserBatch = () => {
  router.push('/dashboard/admin/create-user-batch')
}
</script>
