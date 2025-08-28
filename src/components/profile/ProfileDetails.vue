<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Date of Birth Field -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Date of Birth</label>
        <div
          class="px-3 py-2 bg-muted/50 hover:bg-muted/70 text-foreground rounded-md border border-transparent text-sm min-h-[40px] flex items-center transition-colors duration-200"
          role="textbox"
          aria-readonly="true"
          aria-label="Date of birth information"
        >
          {{ formatDate(user?.date_of_birth || '') || 'Not provided' }}
        </div>
        <p class="text-xs text-muted-foreground">
          Contact support to change your date of birth
        </p>
      </div>

      <!-- Phone Number -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Phone Number</label>
        <div
          class="px-3 py-2 bg-muted/50 hover:bg-muted/70 text-foreground rounded-md border border-transparent text-sm min-h-[40px] flex items-center transition-colors duration-200"
          role="textbox"
          aria-readonly="true"
          aria-label="Your phone number"
        >
          {{ user?.phone || 'Not provided' }}
        </div>
        <p class="text-xs text-muted-foreground">Your contact phone number</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/lib/dateFromate'
import type { UserDataInterface } from '@/types/userType'

interface Props {
  user: UserDataInterface | null
}

defineProps<Props>()
</script>