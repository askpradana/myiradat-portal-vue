<template>
  <header class="bg-card border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <!-- Left: Title & Subtitle -->
        <div>
          <h1 class="text-3xl font-bold text-foreground">
            {{ roleUser === 'admin' ? 'Admin Dashboard' : roleUser === 'cs' ? 'CS Dashboard' : 'Iradat' }}
          </h1>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <LogoutAlert />

        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import LogoutAlert from '../alerts/LogoutAlert.vue'

import type { UserRole } from '@/types/dashboard'

const { roleUser } = defineProps<{
  roleUser: UserRole
}>()

</script>
