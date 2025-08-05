<template>
  <div class="min-h-screen bg-background">
    <HeaderDashboard :role-user="roleUser" />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button @click="backToDashboard" variant="default"><ArrowLeft /> Back to dashboard</Button>
      <div class="mt-12">
        <CreateNewUserForm />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderDashboard from '@/components/custom/dashboard/HeaderDashboard.vue'
import { useUserStore } from '@/stores/userStores'
import CreateNewUserForm from '@/components/custom/custom-form/CreateNewUserForm.vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
userStore.initializeAuth()

const role = userStore.user?.role_id === 1 ? 'admin' : 'user'
const roleUser = ref<'admin' | 'user'>(role)

const backToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped></style>
