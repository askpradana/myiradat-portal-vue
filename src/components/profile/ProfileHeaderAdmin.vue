<template>
  <Card class="profile-header flex justify-center items-center">
    <CardContent class="p-6">
      <div class="flex justify-center items-center flex-col gap-6">
        <!-- Avatar Section -->
        <div class="relative">
          <div
            class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg"
            :title="`${user?.name} Avatar`"
          >
            {{ getInitialName(user.name as string) }}
          </div>

          <!-- Status Indicator -->
          <div
            class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
            :class="statusClasses"
            :title="statusText"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="flex-1 text-center">
          <h2 class="text-2xl font-bold text-foreground">{{ user?.name || 'Loading...' }}</h2>
          <p class="text-muted-foreground mt-1 flex justify-center items-center gap-1">
            <Mail :size="14" /> {{ user?.email }}
          </p>

          <!-- Role Badge -->
          <div class="mt-3 flex justify-center">
            <div
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="roleBadgeClasses"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="uppercase text-center">{{ user.role_name }}</p>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="mt-4 grid grid-cols-1 gap-3 text-sm">
            <div class="flex items-center justify-center">
              <span class="text-muted-foreground flex items-center gap-1"
                ><CheckCircle :size="14" /> Verified:</span
              >
              <span class="ml-2 text-foreground" :class="user.verified_at ? '' : 'text-red-500'">{{
                user?.verified_at ? formatDate(user.verified_at) : 'Unverified'
              }}</span>
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
import { getInitialName } from '@/lib/getInitialName'
import { CheckCircle, Mail } from 'lucide-vue-next'

const user = defineProps<{
  name: string | undefined
  email: string | undefined
  role_name: string | undefined
  role_id: number | undefined
  phone: string | undefined
  verified_at: string | undefined
  isPending: boolean
  date_of_birth: string | undefined | null
}>()

// const { profileStats } = useUserProfile()

// Profile completion status
const isProfileComplete = computed(() => {
  // return profileStats.value.completionPercentage >= 80
  return user.date_of_birth ? true : false
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
  const roleId = user?.role_id

  if (roleId === 1) {
    // Admin
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
      day: 'numeric',
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
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
