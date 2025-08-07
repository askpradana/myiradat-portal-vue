<template>
  <DashboardLayout>
    <Button @click="backToDashboard" variant="default"> <ArrowLeft /> Back to dashboard </Button>
    <div class="mt-12">
      <CreateNewUserForm />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../layouts/DashboardLayout.vue'
import CreateNewUserForm from '@/components/custom/custom-form/CreateNewUserForm.vue'
import Button from '@/components/ui/button/Button.vue'
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const backToDashboard = () => {
  router.push('/dashboard')
}
</script>
