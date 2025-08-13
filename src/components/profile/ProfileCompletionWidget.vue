<template>
  <Card class="profile-completion-widget">
    <CardHeader>
      <CardTitle class="flex items-center space-x-2 text-lg">
        <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Profile Completion</span>
      </CardTitle>
      <CardDescription>
        Complete your profile to get the most out of your assessment results
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Progress Circle -->
      <div class="flex items-center justify-center">
        <div class="relative w-24 h-24">
          <!-- Background circle -->
          <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              class="text-gray-200"
            />
            <!-- Progress circle -->
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
              :class="progressColorClass"
              class="transition-all duration-500 ease-out"
              stroke-linecap="round"
            />
          </svg>
          
          <!-- Percentage text -->
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xl font-bold text-foreground">{{ completionPercentage }}%</span>
          </div>
        </div>
      </div>

      <!-- Completion Status -->
      <div class="text-center">
        <div 
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          :class="statusBadgeClasses"
        >
          <svg 
            class="w-4 h-4 mr-2"
            :class="statusIconClasses"
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path v-if="isComplete" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            <path v-else fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ statusText }}
        </div>
      </div>

      <!-- Missing Fields -->
      <div v-if="missingFields.length > 0" class="space-y-3">
        <div class="text-sm font-medium text-foreground">Missing Information:</div>
        <div class="space-y-2">
          <div
            v-for="field in missingFields"
            :key="field"
            class="flex items-center space-x-2 text-sm"
          >
            <div class="w-2 h-2 rounded-full bg-red-400"></div>
            <span class="text-muted-foreground">{{ formatFieldName(field) }}</span>
          </div>
        </div>
      </div>

      <!-- Assessment Stats -->
      <div class="pt-4 border-t border-border">
        <div class="text-sm font-medium text-foreground mb-2">Assessment Progress</div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Assessments Completed</span>
          <span class="font-medium text-foreground">{{ assessmentsTaken }}/3</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: assessmentProgressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Action Button -->
      <div v-if="!isComplete" class="pt-2">
        <slot name="action">
          <div class="text-center">
            <p class="text-xs text-muted-foreground">
              Complete your profile to unlock full features
            </p>
          </div>
        </slot>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserProfile } from '@/composables/auth/useUserProfile'

const { profileStats } = useUserProfile()

// Progress circle calculations
const circumference = computed(() => 2 * Math.PI * 40) // radius = 40
const completionPercentage = computed(() => profileStats.value.completionPercentage)
const strokeDashoffset = computed(() => {
  const progress = completionPercentage.value / 100
  return circumference.value * (1 - progress)
})

// Status computeds
const isComplete = computed(() => completionPercentage.value >= 100)
const missingFields = computed(() => profileStats.value.missingFields || [])
const assessmentsTaken = computed(() => profileStats.value.assessmentsTaken || 0)

const assessmentProgressPercentage = computed(() => {
  return Math.round((assessmentsTaken.value / 3) * 100)
})

// Styling computeds
const progressColorClass = computed(() => {
  if (completionPercentage.value >= 100) return 'text-green-500'
  if (completionPercentage.value >= 75) return 'text-blue-500'
  if (completionPercentage.value >= 50) return 'text-yellow-500'
  return 'text-red-500'
})

const statusBadgeClasses = computed(() => {
  if (isComplete.value) {
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  }
  return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
})

const statusIconClasses = computed(() => {
  if (isComplete.value) return 'text-green-600'
  return 'text-yellow-600'
})

const statusText = computed(() => {
  if (isComplete.value) return 'Profile Complete'
  if (completionPercentage.value >= 75) return 'Almost Complete'
  if (completionPercentage.value >= 50) return 'Half Complete'
  return 'Needs Completion'
})

// Helper functions
const formatFieldName = (field: string): string => {
  const fieldNames: Record<string, string> = {
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    date_of_birth: 'Date of Birth',
    avatar_picture: 'Profile Picture'
  }
  
  return fieldNames[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
</script>

<style scoped>
.profile-completion-widget {
  @apply transition-all duration-200;
}

.profile-completion-widget:hover {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>