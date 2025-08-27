<template>
  <form 
    @submit.prevent="onSubmit" 
    class="space-y-6"
    role="form"
    aria-label="Edit profile information"
  >
    <!-- Editable Fields Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Name Field -->
      <div class="space-y-2">
        <label for="profile-name" class="text-sm font-medium text-foreground">
          Full Name *
        </label>
        <Input
          id="profile-name"
          :model-value="fields.name.value.value"
          @update:model-value="(value: string | number) => $emit('update:name', String(value))"
          type="text"
          placeholder="Enter your full name"
          :class="{
            'border-red-300 focus:border-red-500': fields.name.errorMessage.value,
          }"
          class="transition-colors"
          aria-describedby="profile-name-error"
          :aria-invalid="!!fields.name.errorMessage.value"
          required
        />
        <p
          v-if="fields.name.errorMessage.value"
          id="profile-name-error"
          class="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {{ fields.name.errorMessage.value }}
        </p>
      </div>

      <!-- Email Field -->
      <div class="space-y-2">
        <label for="profile-email" class="text-sm font-medium text-foreground">
          Email Address *
        </label>
        <Input
          id="profile-email"
          :model-value="fields.email.value.value"
          @update:model-value="(value: string | number) => $emit('update:email', String(value))"
          type="email"
          placeholder="Enter your email"
          :class="{
            'border-red-300 focus:border-red-500': fields.email.errorMessage.value,
          }"
          class="transition-colors"
          aria-describedby="profile-email-error"
          :aria-invalid="!!fields.email.errorMessage.value"
          required
        />
        <p
          v-if="fields.email.errorMessage.value"
          id="profile-email-error"
          class="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {{ fields.email.errorMessage.value }}
        </p>
      </div>

      <!-- Phone Field -->
      <div class="space-y-2">
        <label for="profile-phone" class="text-sm font-medium text-foreground">
          Phone Number *
        </label>
        <Input
          id="profile-phone"
          :model-value="fields.phone.value.value"
          @update:model-value="(value: string | number) => $emit('update:phone', String(value))"
          type="tel"
          placeholder="Enter your phone number"
          :class="{
            'border-red-300 focus:border-red-500': fields.phone.errorMessage.value,
          }"
          class="transition-colors"
          aria-describedby="profile-phone-error"
          :aria-invalid="!!fields.phone.errorMessage.value"
          required
        />
        <p
          v-if="fields.phone.errorMessage.value"
          id="profile-phone-error"
          class="text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {{ fields.phone.errorMessage.value }}
        </p>
      </div>

      <!-- Date of Birth Field (Read Only) -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Date of Birth</label>
        <div
          class="px-3 py-2 bg-muted text-muted-foreground rounded-md border text-sm min-h-[40px] flex items-center"
          role="textbox"
          aria-readonly="true"
          aria-label="Date of birth, read-only field"
        >
          {{ formatDate(user?.date_of_birth || '') || 'Not provided' }}
        </div>
        <p class="text-xs text-muted-foreground">
          Contact support to change your date of birth
        </p>
      </div>
    </div>

    <!-- Form Status -->
    <div
      v-if="hasChanges"
      class="text-sm text-muted-foreground bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-center">
        <AlertIcon class="w-4 h-4 text-yellow-600 mr-2" />
        You have unsaved changes
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { AlertIcon } from '@/components/ui/icons'
import { formatDate } from '@/lib/dateFromate'
import type { UserDataInterface } from '@/types/userType'

interface FieldState {
  value: { value: string }
  errorMessage: { value: string | undefined }
}

interface FormFields {
  name: FieldState
  email: FieldState
  phone: FieldState
}

interface Props {
  user: UserDataInterface | null
  fields: FormFields
  hasChanges?: boolean
}

interface Emits {
  (e: 'submit'): void
  (e: 'update:name', value: string): void
  (e: 'update:email', value: string): void
  (e: 'update:phone', value: string): void
}

withDefaults(defineProps<Props>(), {
  hasChanges: false
})

const emit = defineEmits<Emits>()

const onSubmit = () => emit('submit')
</script>