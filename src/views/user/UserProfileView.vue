<template>
  <div class="space-y-6">
    <!-- Profile Header -->
    <ProfileHeader>
      <template #actions>
        <Button
          v-if="profileQuery.isLoading.value"
          size="sm"
          variant="outline"
          disabled
          class="w-full"
        >
          <div
            class="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"
          ></div>
          Loading...
        </Button>
        <Button
          v-else-if="error"
          size="sm"
          variant="outline"
          @click="refreshProfile"
          class="w-full"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Retry
        </Button>
      </template>
    </ProfileHeader>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Profile Completion Widget -->
        <ProfileCompletionWidget>
          <template #action>
            <Button size="sm" variant="outline" class="w-full mt-3" @click="scrollToForm">
              Complete Profile
            </Button>
          </template>
        </ProfileCompletionWidget>

        <!-- Quick Stats -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Profile Completion</span>
              <span class="font-semibold text-foreground"
                >{{ profileStats.completionPercentage }}%</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Assessments Taken</span>
              <span class="font-semibold text-foreground"
                >{{ profileStats.assessmentsTaken }}/3</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Last Updated</span>
              <span class="text-sm text-foreground">{{ formatLastUpdated() }}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Profile Form -->
        <Card ref="formCard">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="text-foreground flex items-center">
                  <svg
                    v-if="!isEditing"
                    class="w-5 h-5 mr-2 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  {{ isEditing ? 'Edit Profile Information' : 'Profile Information' }}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <!-- Form Loading State -->
            <div v-if="profileQuery.isLoading.value" class="space-y-4">
              <div v-for="i in 3" :key="i" class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <!-- Form Error State -->
            <div v-else-if="error" class="text-center py-8">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p class="text-red-600 font-medium">Failed to load profile data</p>
              <p class="text-sm text-muted-foreground mt-1">{{ error.message }}</p>
              <Button variant="outline" size="sm" @click="refreshProfile" class="mt-4">
                Try Again
              </Button>
            </div>

            <!-- Profile Form -->
            <div v-else class="space-y-6">
              <form
                @submit.prevent="handleFormSubmit"
                class="space-y-6 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
              >
                <!-- Personal Information Section -->
                <div>
                  <h4 class="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <svg
                      class="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Personal Information
                  </h4>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Name Field -->
                    <div class="space-y-2">
                      <label for="name" class="text-sm font-medium text-foreground">
                        Full Name *
                      </label>
                      <!-- Edit Mode -->
                      <Input
                        v-if="isEditing"
                        id="name"
                        v-model="fields.name.value.value"
                        type="text"
                        placeholder="Enter your full name"
                        :class="{
                          'border-red-300 focus:border-red-500': fields.name.errorMessage.value,
                        }"
                        class="transition-colors"
                        aria-describedby="name-error"
                      />
                      <!-- View Mode -->
                      <div
                        v-else
                        class="px-3 py-2 bg-muted/50 hover:bg-muted/70 text-foreground rounded-md border border-transparent text-sm min-h-[40px] flex items-center transition-colors duration-200"
                      >
                        {{ user?.name || 'Not provided' }}
                      </div>
                      <p
                        v-if="isEditing && fields.name.errorMessage.value"
                        id="name-error"
                        class="text-sm text-red-600"
                      >
                        {{ fields.name.errorMessage.value }}
                      </p>
                    </div>

                    <!-- Email Field -->
                    <div class="space-y-2">
                      <label for="email" class="text-sm font-medium text-foreground">
                        Email Address *
                      </label>
                      <!-- Edit Mode -->
                      <Input
                        v-if="isEditing"
                        id="email"
                        v-model="fields.email.value.value"
                        type="email"
                        placeholder="Enter your email"
                        :class="{
                          'border-red-300 focus:border-red-500': fields.email.errorMessage.value,
                        }"
                        class="transition-colors"
                        aria-describedby="email-error"
                      />
                      <!-- View Mode -->
                      <div
                        v-else
                        class="px-3 py-2 bg-muted/50 hover:bg-muted/70 text-foreground rounded-md border border-transparent text-sm min-h-[40px] flex items-center transition-colors duration-200"
                      >
                        {{ user?.email || 'Not provided' }}
                      </div>
                      <p
                        v-if="isEditing && fields.email.errorMessage.value"
                        id="email-error"
                        class="text-sm text-red-600"
                      >
                        {{ fields.email.errorMessage.value }}
                      </p>
                    </div>

                    <!-- Phone Field -->
                    <div class="space-y-2">
                      <label for="phone" class="text-sm font-medium text-foreground">
                        Phone Number *
                      </label>
                      <!-- Edit Mode -->
                      <Input
                        v-if="isEditing"
                        id="phone"
                        v-model="fields.phone.value.value"
                        type="tel"
                        placeholder="Enter your phone number"
                        :class="{
                          'border-red-300 focus:border-red-500': fields.phone.errorMessage.value,
                        }"
                        class="transition-colors"
                        aria-describedby="phone-error"
                      />
                      <!-- View Mode -->
                      <div
                        v-else
                        class="px-3 py-2 bg-muted/50 hover:bg-muted/70 text-foreground rounded-md border border-transparent text-sm min-h-[40px] flex items-center transition-colors duration-200"
                      >
                        {{ user?.phone || 'Not provided' }}
                      </div>
                      <p
                        v-if="isEditing && fields.phone.errorMessage.value"
                        id="phone-error"
                        class="text-sm text-red-600"
                      >
                        {{ fields.phone.errorMessage.value }}
                      </p>
                    </div>

                    <!-- Date of Birth Field (Read Only) -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-foreground"> Date of Birth </label>
                      <div
                        class="px-3 py-2 bg-muted text-muted-foreground rounded-md border text-sm min-h-[40px] flex items-center"
                      >
                        {{ formatDate(user?.date_of_birth || '') || 'Not provided' }}
                      </div>
                      <p class="text-xs text-muted-foreground">
                        Contact support to change your date of birth
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                  <!-- View Mode - Edit Button -->
                  <Button v-if="!isEditing" type="button" @click="enterEditMode" class="sm:w-auto">
                    <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </Button>

                  <!-- Edit Mode - Cancel and Update Buttons -->
                  <template v-else>
                    <Button
                      type="button"
                      variant="outline"
                      @click="cancelEdit"
                      :disabled="isSubmitting"
                      class="sm:w-auto"
                    >
                      <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      :disabled="isSubmitting || !isFormValid || !hasChanges"
                      class="sm:flex-1 sm:max-w-xs"
                      @click="
                        console.log(
                          'Button clicked - isSubmitting:',
                          isSubmitting,
                          'isFormValid:',
                          isFormValid,
                          'hasChanges:',
                          hasChanges,
                        )
                      "
                    >
                      <div
                        v-if="isSubmitting"
                        class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                      ></div>
                      <svg
                        v-else
                        class="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {{ isSubmitting ? 'Updating...' : 'Update Profile' }}
                    </Button>
                  </template>
                </div>

                <!-- Form Status -->
                <div
                  v-if="isEditing && hasChanges"
                  class="text-sm text-muted-foreground bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <div class="flex items-center">
                    <svg
                      class="w-4 h-4 text-yellow-600 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    You have unsaved changes
                  </div>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

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
          <AlertDialogCancel @click="dismissCancel"> Keep Editing </AlertDialogCancel>
          <AlertDialogAction @click="confirmCancel" variant="destructive">
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { formatDate } from '@/lib/dateFromate'

// Import new components
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import ProfileCompletionWidget from '@/components/profile/ProfileCompletionWidget.vue'

// Import new composables
import { useUserProfile } from '@/composables/auth/useUserProfile'
import { useProfileForm } from '@/composables/forms/useProfileForm'

// Composables
const { user, profileStats, profileQuery, updateProfile, error, refreshProfile } = useUserProfile()

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

// Refs
const formCard = ref<HTMLElement>()

// Methods
const handleFormSubmit = async () => {
  console.log('Form submit initiated')
  try {
    await handleSubmit(async (changedFields) => {
      console.log('Changed fields:', changedFields)
      // Only proceed if there are changes
      if (Object.keys(changedFields).length === 0) {
        console.log('No changes detected, skipping update')
        return
      }

      console.log('Calling updateProfile with:', changedFields)
      await updateProfile(changedFields)
      console.log('Profile updated successfully, exiting edit mode')
      exitEditMode()
    })
  } catch (error) {
    console.error('Form submission error:', error)
  }
}

const scrollToForm = async () => {
  await nextTick()
  formCard.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const formatLastUpdated = (): string => {
  const lastUpdated = profileStats.value.lastUpdated
  if (!lastUpdated) return 'Never'

  try {
    const date = new Date(lastUpdated)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`

    return date.toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Unknown'
  }
}
</script>
