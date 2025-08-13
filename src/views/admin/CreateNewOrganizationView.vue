<template>
  <DashboardLayout>
    <BackToDashboardButton />
    <div class="mt-12">
      <CreateNewOrganizationForm />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../layouts/DashboardLayout.vue'
import CreateNewOrganizationForm from '@/components/custom/custom-form/CreateNewOrganizationForm.vue'
import BackToDashboardButton from '@/components/custom/buttons/BackToDashboardButton.vue'
</script>
