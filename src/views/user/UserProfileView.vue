<template>
  <div class="space-y-6">
    <!-- Main Profile Card -->
    <Card class="transition-all duration-200">
      <CardHeader class="p-6">
        <!-- Loading State -->
        <ProfileSkeleton v-if="isLoading" />

        <!-- Error State -->
        <ProfileError v-else-if="error" :error-message="error.message" @retry="refreshProfile" />

        <!-- Profile Header -->
        <ProfileHeader
          v-else
          :user="user"
          :initials="initials"
          :role-display-name="roleDisplayName"
          :profile-stats="profileStats"
          :is-editing="isEditing"
        >
          <template #actions>
            <ProfileActions
              :is-editing="isEditing"
              :is-loading="isLoading"
              :has-error="!!error"
              :is-submitting="isSubmitting"
              :is-form-valid="isFormValid"
              :has-changes="hasChanges"
              @edit="enterEditMode"
              @save="handleFormSubmit"
              @cancel="cancelEdit"
              @retry="refreshProfile"
            />
          </template>
        </ProfileHeader>
      </CardHeader>

      <CardContent v-if="!isLoading && !error">
        <!-- Edit Mode Form -->
        <ProfileForm
          v-if="isEditing"
          :user="user"
          :fields="fields"
          :has-changes="hasChanges"
          @submit="handleFormSubmit"
          @update:name="(value: string) => (fields.name.value.value = value)"
          @update:email="(value: string) => (fields.email.value.value = value)"
          @update:phone="(value: string) => (fields.phone.value.value = value)"
        />

        <!-- View Mode Details -->
        <ProfileDetails v-else :user="user" />
      </CardContent>
    </Card>

    <ResetPasswordByUserForm />

    <Card class="space-x-6">
      <div class="flex justify-between items-center">
        <h2 class="px-6 font-bold">Where you're logged in</h2>
        <DeleteSessionAllAlert />
      </div>
      <template v-if="isPending">
        <SessionCardSkeleton />
        <SessionCardSkeleton />
        <SessionCardSkeleton />
      </template>

      <template v-else v-for="session in data.sessions" :key="session.session_id">
        <SessionCard :is-pending="isPending" :data="session" />
      </template>
    </Card>

    <!-- Confirmation Dialog -->
    <AlertDialog :open="showConfirmDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Are you sure you want to discard them? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="dismissCancel">Keep Editing</AlertDialogCancel>
          <AlertDialogAction @click="confirmCancel" variant="destructive">
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, type Ref } from 'vue'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Import profile components
import {
  ProfileHeader,
  ProfileActions,
  ProfileForm,
  ProfileDetails,
  ProfileSkeleton,
  ProfileError,
} from '@/components/profile'

// Import composables
import { useUserProfile } from '@/composables/auth/useUserProfile'
import { useProfileForm } from '@/composables/forms/useProfileForm'
import { useQuery } from '@tanstack/vue-query'
import { getListSession } from '@/api/sessions/getListSessions'
import { type SessionsDataFromAPIInterface } from '@/types/sessionsType'
import SessionCard from '@/components/sessions/SessionCard.vue'
import SessionCardSkeleton from '@/components/sessions/SessionCardSkeleton.vue'
import DeleteSessionAllAlert from '@/components/custom/alerts/DeleteSessionAllAlert.vue'
import ResetPasswordByUserForm from '@/components/custom/custom-form/ResetPasswordByUserForm.vue'

// Composables
const {
  user,
  isLoading,
  updateProfile,
  error,
  refreshProfile,
  getInitials,
  getRoleDisplayName,
  profileStats,
} = useUserProfile()

const {
  fields,
  isFormValid,
  hasChanges,
  isSubmitting,
  handleSubmit,
  isEditing,
  enterEditMode,
  exitEditMode,
  cancelEdit,
  showConfirmDialog,
  confirmCancel,
  dismissCancel,
} = useProfileForm()

const { isPending, data } = useQuery({
  queryKey: ['sessions'],
  queryFn: getListSession,
}) as {
  data: Ref<SessionsDataFromAPIInterface>
  isPending: Ref<boolean>
}

console.log(data.value?.sessions)

// Computed properties for header
const initials = computed(() => getInitials())
const roleDisplayName = computed(() => getRoleDisplayName())

// Methods
const handleFormSubmit = async (): Promise<void> => {
  try {
    await handleSubmit(async (changedFields) => {
      // Only proceed if there are changes
      if (Object.keys(changedFields).length === 0) {
        return
      }

      await updateProfile(changedFields)
      exitEditMode()
    })
  } catch {
    // Error handling is managed by the composables
  }
}
</script>
