<template>
  <div class="flex flex-col space-y-2">
    <!-- Loading State -->
    <Button
      v-if="isLoading"
      size="sm"
      variant="outline"
      disabled
      class="w-full"
      :aria-label="t('profile.actions.loadingProfile')"
    >
      <LoaderIcon class="w-4 h-4 mr-2 animate-spin" />
      {{ t('common.states.loading') }}
    </Button>

    <!-- Error State -->
    <Button
      v-else-if="hasError"
      size="sm"
      variant="outline"
      @click="onRetry"
      class="w-full"
      :aria-label="t('profile.actions.retryLoading')"
    >
      <RefreshIcon class="w-4 h-4 mr-2" />
      {{ t('common.actions.retry') }}
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
        :aria-label="t('profile.actions.cancelEditing')"
      >
        <CancelIcon class="w-4 h-4 mr-2" />
        {{ t('common.actions.cancel') }}
      </Button>

      <!-- Save Button -->
      <Button
        type="submit"
        size="sm"
        :disabled="isSubmitting || !isFormValid || !hasChanges"
        class="w-full"
        @click="onSave"
        :aria-label="isSubmitting ? t('profile.actions.savingChanges') : t('profile.actions.saveChanges')"
      >
        <LoaderIcon v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
        <SaveIcon v-else class="w-4 h-4 mr-2" />
        {{ isSubmitting ? t('common.states.saving') : t('common.actions.save') }}
      </Button>
    </template>

    <!-- View Mode Actions -->
    <Button
      v-else
      type="button"
      size="sm"
      @click="onEdit"
      class="w-full"
      :aria-label="t('profile.actions.editProfile')"
    >
      <EditIcon class="w-4 h-4 mr-2" />
      {{ t('profile.actions.editProfileButton') }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()
const emit = defineEmits<Emits>()

const onEdit = () => emit('edit')
const onSave = () => emit('save')
const onCancel = () => emit('cancel')
const onRetry = () => emit('retry')
</script>
