<template>
  <header class="bg-card border-b border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
        <!-- Left: Title & Subtitle -->
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-foreground truncate">
            {{ roleUser === 'admin' ? 'Admin Dashboard' : roleUser === 'cs' ? 'CS Dashboard' : 'Iradat' }}
          </h1>
          <p class="text-sm text-muted-foreground mt-1 sm:hidden">
            {{ roleUser === 'admin' ? 'Manage users and organizations' : roleUser === 'cs' ? 'Customer support panel' : 'Welcome to your dashboard' }}
          </p>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-3 sm:gap-2 w-full sm:w-auto justify-end">
          <RefreshProfileButton class="h-10 w-10 sm:h-auto sm:w-auto" />
          <ThemeToggle class="h-10 w-10 sm:h-auto sm:w-auto" />
          <LogoutAlert class="h-10 sm:h-auto flex-shrink-0" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import LogoutAlert from '@/components/custom/alerts/LogoutAlert.vue'
import RefreshProfileButton from '@/components/custom/buttons/RefreshProfileButton.vue'

import type { UserRole } from '@/types/dashboard'

const { roleUser } = defineProps<{
  roleUser: UserRole
}>()

</script>
