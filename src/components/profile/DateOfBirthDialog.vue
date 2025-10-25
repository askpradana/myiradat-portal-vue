<template>
  <Dialog v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/50 z-50" />
      <DialogContent class="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
        <div class="space-y-2">
          <DialogTitle class="text-lg font-semibold">Set Date of Birth</DialogTitle>
          <DialogDescription class="text-sm text-muted-foreground">
            Please select your date of birth. This information will be used for your profile.
          </DialogDescription>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Date of Birth</label>
            <DatePickerForm v-model="selectedDate" />
            <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          </div>

          <div class="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              @click="handleCancel"
              :disabled="isLoading"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :disabled="!selectedDate || isLoading"
              class="min-w-[80px]"
            >
              <div v-if="isLoading" class="flex items-center">
                <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
              <span v-else>Save</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  DialogRoot as Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay
} from 'reka-ui'
import { Button } from '@/components/ui/button'
import DatePickerForm from '@/components/custom/custom-form/DatePickerForm.vue'

interface Props {
  open?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'saved', date: Date): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false
})

const emit = defineEmits<Emits>()

// State
const isOpen = ref(props.open)
const selectedDate = ref<Date | null>(null)
const error = ref<string>('')
const isLoading = ref(false)

// Watch for prop changes
watch(() => props.open, (newValue) => {
  isOpen.value = newValue
  if (newValue) {
    // Reset form when dialog opens
    selectedDate.value = null
    error.value = ''
  }
})

// Watch for internal changes
watch(isOpen, (newValue) => {
  emit('update:open', newValue)
})

// Handlers
const handleSubmit = async () => {
  if (!selectedDate.value) {
    error.value = 'Please select a date of birth'
    return
  }

  // Validate date is not in the future
  if (selectedDate.value > new Date()) {
    error.value = 'Date of birth cannot be in the future'
    return
  }

  // Validate reasonable age (e.g., not more than 120 years old)
  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 120)
  if (selectedDate.value < minDate) {
    error.value = 'Please enter a valid date of birth'
    return
  }

  try {
    isLoading.value = true
    error.value = ''

    // Import the API function dynamically to avoid circular imports
    const { updateProfile } = await import('@/api/users/updateProfile')

    await updateProfile({ date_of_birth: selectedDate.value.toISOString() })

    emit('saved', selectedDate.value)
    isOpen.value = false
  } catch (err) {
    console.error('Error updating date of birth:', err)
    error.value = err instanceof Error ? err.message : 'Failed to update date of birth'
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  isOpen.value = false
}
</script>