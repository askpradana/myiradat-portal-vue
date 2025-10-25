<template>
  <!-- Profile Form -->
  <Card>
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
      <div v-if="isPending" class="space-y-4">
        <div v-for="i in 3" :key="i" class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
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
                <label for="name" class="text-sm font-medium text-foreground"> Full Name * </label>
                <!-- Edit Mode -->
                <Input
                  v-if="isEditing"
                  id="name"
                  v-model="nameField"
                  type="text"
                  placeholder="Enter your full name"
                  :class="{
                    'border-red-300 focus:border-red-500': errors.name,
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
                <p v-if="isEditing && errors.name" id="name-error" class="text-sm text-red-600">
                  {{ errors.name }}
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
                  v-model="emailField"
                  type="email"
                  placeholder="Enter your email"
                  :class="{
                    'border-red-300 focus:border-red-500': errors.email,
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
                <p v-if="isEditing && errors.email" id="email-error" class="text-sm text-red-600">
                  {{ errors.email }}
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
                  v-model="phoneField"
                  type="tel"
                  placeholder="Enter your phone number"
                  :class="{
                    'border-red-300 focus:border-red-500': errors.phone,
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
                <p v-if="isEditing && errors.phone" id="phone-error" class="text-sm text-red-600">
                  {{ errors.phone }}
                </p>
              </div>

              <!-- Date of Birth Field -->
              <div class="space-y-2">
                <label for="date_of_birth" class="text-sm font-medium text-foreground">
                  Date of Birth
                </label>
                <div v-if="isEditing">
                  <DatePickerForm
                    :model-value="dateOfBirthField"
                    @update:model-value="handleDateChange($event)"
                  />
                  <p v-if="errors.date_of_birth" class="text-sm text-red-600 mt-1">
                    {{ errors.date_of_birth }}
                  </p>
                </div>
                <div
                  v-else
                  class="px-3 py-2 bg-muted/50 hover:bg-muted/70 text-foreground rounded-md border border-transparent text-sm min-h-[40px] flex items-center transition-colors duration-200"
                >
                  {{ user?.date_of_birth ? formatDate(user.date_of_birth) : 'Not provided' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border justify-end">
            <!-- View Mode -->
            <Button
              v-if="!isEditing"
              type="button"
              size="sm"
              @click="enterEditMode"
              class="w-full sm:w-auto"
            >
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

            <!-- Edit Mode -->
            <template v-else>
              <!-- Update -->
              <Button
                type="submit"
                size="sm"
                :disabled="isSubmitting"
                class="w-full sm:w-36 order-1"
              >
                <div
                  v-if="isSubmitting"
                  class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
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
                {{ isSubmitting ? 'Updating...' : 'Update' }}
              </Button>

              <!-- Cancel -->
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="cancelEdit"
                :disabled="isSubmitting"
                class="w-full sm:w-auto order-2"
              >
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </Button>
            </template>
          </div>

          <!-- Form Status -->
          <div
            v-if="isEditing && hasChanges"
            class="text-sm text-muted-foreground bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800"
          >
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { formatDate } from '@/lib/dateFromate'
import { ref, computed, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import { editUserData } from '@/api/users/editUser'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { EditUserShcema } from '@/lib/zod-schemas/EditUserFormSchema'
import { useUserStore } from '@/stores/userStores'
import { type DataUserProps } from '@/api/users/editUser'
import DatePickerForm from './DatePickerForm.vue'

const props = defineProps<{
  name: string | undefined
  phone: string | undefined
  email: string | undefined
  date_of_birth?: string | null | undefined
  isPending: boolean
  userID: string | undefined
}>()

const user = computed(() => props)
const userStore = useUserStore()

// Helper to convert string to Date object
const parseDate = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined
  try {
    // Handle ISO string format dari API (2025-08-21T00:00:00Z)
    const date = new Date(dateString)
    // Validasi apakah date valid
    if (isNaN(date.getTime())) return undefined
    return date
  } catch {
    return undefined
  }
}

const validationSchema = EditUserShcema
const { handleSubmit, resetForm, errors } = useForm<{
  name?: string
  email?: string
  phone?: string
  date_of_birth?: Date | null
  role?: string
}>({
  validationSchema,
  initialValues: {
    name: props.name,
    email: props.email,
    phone: props.phone,
    date_of_birth: parseDate(props.date_of_birth),
    role: '1',
  },
})

const { value: nameField } = useField<string>('name')
const { value: phoneField } = useField<string>('phone')
const { value: emailField } = useField<string>('email')
const { value: dateOfBirthField, setValue: setDateOfBirth } = useField<Date | null>('date_of_birth')

const handleDateChange = (newDate: Date | null) => {
  setDateOfBirth(newDate)
  dateOfBirthField.value = newDate
}

const queryClient = useQueryClient()
const { isPending: isSubmitting, mutate } = useMutation({
  mutationFn: ({ userID, data, role }: { data: DataUserProps; userID: string; role: number }) =>
    editUserData(data, { userID, role }),
  onSuccess: () => {
    isEditing.value = false
    toast('Profile Updated', {
      description: 'User profile has been successfully updated.',
    })
    // Store is already updated in editUserData API call
    // Query invalidation ensures any cached data is also refreshed
    queryClient.invalidateQueries({
      queryKey: ['profile', props.userID],
      exact: false,
    })
  },
  onError: (error) => {
    toast('Update Failed', {
      description: error.message || 'There was an error updating the profile. Please try again.',
    })
  },
})

const handleFormSubmit = handleSubmit((values) => {
  if (!props.userID) {
    toast('Error', { description: 'User ID is missing.' })
    return
  }

  // Get the date from the field directly if not in values
  const dateToUse = values.date_of_birth || dateOfBirthField.value

  // Format date to ISO string with UTC timezone - PERBAIKAN
  let formattedDateOfBirth = null
  if (dateToUse && dateToUse instanceof Date) {
    try {
      // Create new date at midnight UTC to avoid timezone issues
      const utcDate = new Date(
        Date.UTC(dateToUse.getFullYear(), dateToUse.getMonth(), dateToUse.getDate()),
      )
      formattedDateOfBirth = utcDate.toISOString()
    } catch (error) {
      console.error(error)
      formattedDateOfBirth = null
    }
  }

  const payload = {
    name: values.name ?? '',
    email: values.email ?? '',
    phone: values.phone ?? '',
    date_of_birth: formattedDateOfBirth,
    role_type: values.role ?? '1',
  }

  mutate({
    userID: props.userID,
    data: payload,
    role: Number(userStore.user?.role_id),
  })
})

const originalValues = ref({
  name: props.name,
  email: props.email,
  phone: props.phone,
  date_of_birth: parseDate(props.date_of_birth),
})

watch(
  () => props,
  (newProps) => {
    const parsedDate = parseDate(newProps.date_of_birth)

    const newValues = {
      name: newProps.name,
      email: newProps.email,
      phone: newProps.phone,
      date_of_birth: parsedDate,
    }

    originalValues.value = newValues

    // Reset form dengan nilai baru
    resetForm({
      values: {
        ...newValues,
        role: '1',
      },
    })

    // Explicitly set dateOfBirthField untuk memastikan DatePicker ter-update
    if (parsedDate) {
      setDateOfBirth(parsedDate)
    }
  },
  { deep: true, immediate: true },
)

const hasChanges = computed(() => {
  const currentDate = dateOfBirthField.value
  const originalDate = originalValues.value.date_of_birth

  // Handle date comparison properly
  let dateChanged = false
  if (currentDate && originalDate) {
    dateChanged = currentDate.getTime() !== originalDate.getTime()
  } else if (currentDate !== originalDate) {
    dateChanged = true
  }

  return (
    nameField.value !== originalValues.value.name ||
    emailField.value !== originalValues.value.email ||
    phoneField.value !== originalValues.value.phone ||
    dateChanged
  )
})

const isEditing = ref(false)

const enterEditMode = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  resetForm({
    values: {
      ...originalValues.value,
      role: '1',
    },
  })
}
</script>
