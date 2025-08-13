<template>
  <DashboardLayout>
    <BackToDashboardButton />
    <div class="mt-12">
      <CreateNewUserForm />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../layouts/DashboardLayout.vue'
import CreateNewUserForm from '@/components/custom/custom-form/CreateNewUserForm.vue'
import BackToDashboardButton from '@/components/custom/buttons/BackToDashboardButton.vue'
</script>
