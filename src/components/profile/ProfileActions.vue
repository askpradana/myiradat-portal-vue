<template>
  <div class="flex flex-col space-y-2">
    <!-- Loading State -->
    <Button
      v-if="isLoading"
      size="sm"
      variant="outline"
      disabled
      class="w-full"
      aria-label="Loading profile data"
    >
      <LoaderIcon class="w-4 h-4 mr-2 animate-spin" />
      Loading...
    </Button>

    <!-- Error State -->
    <Button
      v-else-if="hasError"
      size="sm"
      variant="outline"
      @click="onRetry"
      class="w-full"
      aria-label="Retry loading profile data"
    >
      <RefreshIcon class="w-4 h-4 mr-2" />
      Retry
    </Button>

    <!-- Edit Mode Actions -->
    <template v-else-if="isEditing">
      <!-- Cancel Button -->
      <Button
        type="button"
        variant="outline"
        size="sm"
        @click="onCancel"
        :disabled="isSubmitting"
        class="w-full"
        aria-label="Cancel editing and discard changes"
      >
        <CancelIcon class="w-4 h-4 mr-2" />
        Cancel
      </Button>

      <!-- Save Button -->
      <Button
        type="submit"
        size="sm"
        :disabled="isSubmitting || !isFormValid || !hasChanges"
        class="w-full"
        @click="onSave"
        :aria-label="isSubmitting ? 'Saving changes...' : 'Save profile changes'"
      >
        <LoaderIcon v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
        <SaveIcon v-else class="w-4 h-4 mr-2" />
        {{ isSubmitting ? 'Saving...' : 'Save' }}
      </Button>
    </template>

    <!-- View Mode Actions -->
    <Button
      v-else
      type="button"
      size="sm"
      @click="onEdit"
      class="w-full"
      aria-label="Edit profile information"
    >
      <EditIcon class="w-4 h-4 mr-2" />
      Edit Profile
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { EditIcon, SaveIcon, CancelIcon, RefreshIcon, LoaderIcon } from '@/components/ui/icons'

interface Props {
  isEditing?: boolean
  isLoading?: boolean
  hasError?: boolean
  isSubmitting?: boolean
  isFormValid?: boolean
  hasChanges?: boolean
}

interface Emits {
  (e: 'edit'): void
  (e: 'save'): void
  (e: 'cancel'): void
  (e: 'retry'): void
}

withDefaults(defineProps<Props>(), {
  isEditing: false,
  isLoading: false,
  hasError: false,
  isSubmitting: false,
  isFormValid: true,
  hasChanges: false,
})

const emit = defineEmits<Emits>()

const onEdit = () => emit('edit')
const onSave = () => emit('save')
const onCancel = () => emit('cancel')
const onRetry = () => emit('retry')
</script>
