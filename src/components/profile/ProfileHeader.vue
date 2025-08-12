<template>
  <Card class="profile-header">
    <CardContent class="p-6">
      <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <!-- Avatar Section -->
        <div class="relative">
          <div
            class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg"
            :title="`${user?.name} Avatar`"
          >
            {{ initials }}
          </div>
          
          <!-- Status Indicator -->
          <div
            class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
            :class="statusClasses"
            :title="statusText"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="flex-1 text-center sm:text-left">
          <h2 class="text-2xl font-bold text-foreground">{{ user?.name || 'Loading...' }}</h2>
          <p class="text-muted-foreground mt-1">{{ user?.email }}</p>
          
          <!-- Role Badge -->
          <div class="mt-3 flex justify-center sm:justify-start">
            <div
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="roleBadgeClasses"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              {{ roleDisplayName }}
            </div>
          </div>

          <!-- Additional Info -->
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-muted-foreground">Phone:</span>
              <span class="ml-2 text-foreground">{{ user?.phone || 'Not provided' }}</span>
            </div>
            <div v-if="user?.verified_at">
              <span class="text-muted-foreground">Verified:</span>
              <span class="ml-2 text-foreground">{{ formatDate(user.verified_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-col space-y-2">
          <slot name="actions">
            <!-- Default actions can be provided here -->
          </slot>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { useUserProfile } from '@/composables/auth/useUserProfile'

const { user, getInitials, getRoleDisplayName, profileStats } = useUserProfile()

// Computed properties
const initials = computed(() => getInitials())
const roleDisplayName = computed(() => getRoleDisplayName())

// Profile completion status
const isProfileComplete = computed(() => {
  return profileStats.value.completionPercentage >= 80
})

const statusClasses = computed(() => {
  if (isProfileComplete.value) {
    return 'bg-green-500 text-white'
  }
  return 'bg-yellow-500 text-white'
})

const statusText = computed(() => {
  if (isProfileComplete.value) {
    return 'Profile Complete'
  }
  return 'Profile Incomplete'
})

// Role badge styling
const roleBadgeClasses = computed(() => {
  const roleId = user.value?.role_id
  
  if (roleId === 1) { // Admin
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  }
  
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
})

// Helper functions
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid date'
  }
}
</script>

<style scoped>
.profile-header {
  @apply transition-all duration-200;
}

.profile-header:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>