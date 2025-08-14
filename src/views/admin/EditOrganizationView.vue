<template>
  <DashboardLayout>
    <BackToDashboardButton />
    <div class="mt-12">
      <EditOrganizationForm />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../layouts/DashboardLayout.vue'
import EditOrganizationForm from '@/components/custom/custom-form/EditOrganizationForm.vue'
import BackToDashboardButton from '@/components/custom/buttons/BackToDashboardButton.vue'
</script>
