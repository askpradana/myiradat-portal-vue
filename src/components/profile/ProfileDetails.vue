<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Date of Birth Field -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Date of Birth</label>
        <div
          class="px-3 py-2 bg-muted/50 hover:bg-muted/70 text-foreground rounded-md border border-transparent text-sm min-h-[40px] flex items-center justify-between transition-colors duration-200"
          role="textbox"
          aria-readonly="true"
          aria-label="Date of birth information"
        >
          <span>{{ formatDate(user?.date_of_birth || '') || 'Not provided' }}</span>
          <Button
            v-if="!user?.date_of_birth"
            variant="ghost"
            size="sm"
            @click="openDateOfBirthDialog"
            class="ml-2 h-auto p-1 text-xs"
          >
            Set Date
          </Button>
        </div>
        <p class="text-xs text-muted-foreground">
          {{ user?.date_of_birth ? 'Contact support to change your date of birth' : 'Click "Set Date" to add your date of birth' }}
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

    <!-- Date of Birth Dialog -->
    <DateOfBirthDialog
      v-model:open="showDateOfBirthDialog"
      @saved="handleDateOfBirthSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatDate } from '@/lib/dateFromate'
import { Button } from '@/components/ui/button'
import DateOfBirthDialog from './DateOfBirthDialog.vue'
import { useUserStore } from '@/stores/userStores'
import { toast } from 'vue-sonner'
import type { UserDataInterface } from '@/types/userType'

interface Props {
  user: UserDataInterface | null
}

defineProps<Props>()

// State
const showDateOfBirthDialog = ref(false)
const userStore = useUserStore()

// Handlers
const openDateOfBirthDialog = () => {
  showDateOfBirthDialog.value = true
}

const handleDateOfBirthSaved = async (date: Date) => {
  try {
    // Update the user store with the new date of birth
    if (userStore.user) {
      userStore.setUserProfileData({
        ...userStore.user,
        date_of_birth: date.toISOString()
      })
    }

    toast.success('Date of Birth Set', {
      description: 'Your date of birth has been updated successfully',
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    toast.error('Update Error', {
      description: 'Failed to update profile data',
    })
  }
}
</script>