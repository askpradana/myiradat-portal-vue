<template>
  <tr
    :class="[
      'group border-b border-slate-200 dark:border-slate-700 transition-all duration-200 even:bg-slate-50/50 dark:even:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-sm',
      validationClass,
      isSelected ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 shadow-sm' : ''
    ]"
  >
    <!-- Selection checkbox -->
    <td class="w-12 p-3">
      <div class="flex items-center justify-center">
        <input
          :id="`select-row-${rowData.row_number}`"
          type="checkbox"
          :checked="isSelected"
          @change="$emit('toggle-selection')"
          class="w-4 h-4 text-blue-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
          :aria-label="`Select row ${rowData.row_number}`"
        />
      </div>
    </td>

    <!-- Row number -->
    <td class="w-16 p-3 text-center text-sm text-gray-500 dark:text-gray-400 font-mono">
      {{ rowData.row_number }}
    </td>

    <!-- Name field -->
    <td class="p-3">
      <div class="relative">
        <EditableCell
          v-model="editableData.name"
          :field="'name'"
          :row-number="rowData.row_number"
          :validation-errors="getFieldErrors('name')"
          @blur="validateField('name')"
          @update:model-value="validateField('name')"
          placeholder="Full name"
          className="min-w-32"
        />
      </div>
    </td>

    <!-- Email field -->
    <td class="p-3">
      <div class="relative">
        <EditableCell
          v-model="editableData.email"
          :field="'email'"
          :row-number="rowData.row_number"
          :validation-errors="getFieldErrors('email')"
          @blur="validateField('email')"
          @update:model-value="validateField('email')"
          type="email"
          placeholder="email@example.com"
          className="min-w-48"
        />
      </div>
    </td>

    <!-- Phone field -->
    <td class="p-3">
      <div class="relative">
        <EditableCell
          v-model="editableData.phone"
          :field="'phone'"
          :row-number="rowData.row_number"
          :validation-errors="getFieldErrors('phone')"
          @blur="validateField('phone')"
          @update:model-value="validateField('phone')"
          type="tel"
          placeholder="08XXXXXXXXXX"
          className="min-w-32"
        />
      </div>
    </td>

    <!-- Role field -->
    <td class="p-3">
      <div class="relative">
        <EditableSelect
          v-model="editableData.role"
          :field="'role'"
          :row-number="rowData.row_number"
          :validation-errors="getFieldErrors('role')"
          @update:model-value="validateField('role')"
          :options="roleOptions"
          placeholder="Select role"
          className="min-w-32"
        />
      </div>
    </td>

    <!-- Validation status -->
    <td class="p-3 text-center">
      <div class="flex items-center justify-center">
        <CSVErrorTooltip
          v-if="hasValidationIssues"
          :errors="allErrors"
          :warnings="allWarnings"
          :row-number="rowData.row_number"
        >
          <div
            class="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
            :class="statusIconClass"
          >
            <CheckCircle v-if="isValid" class="w-4 h-4" />
            <XCircle v-else-if="hasErrors" class="w-4 h-4" />
            <AlertTriangle v-else class="w-4 h-4" />
          </div>
        </CSVErrorTooltip>
        <div
          v-else
          class="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        >
          <CheckCircle class="w-4 h-4" />
        </div>
      </div>
    </td>

    <!-- Actions -->
    <td class="w-12 p-3">
      <div class="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          @click="$emit('remove-row')"
          class="w-8 h-8 p-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity"
          :aria-label="`Remove row ${rowData.row_number}`"
        >
          <Trash2 class="w-4 h-4" />
        </Button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { CheckCircle, XCircle, AlertTriangle, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import EditableCell from './EditableCell.vue'
import EditableSelect from './EditableSelect.vue'
import CSVErrorTooltip from './CSVErrorTooltip.vue'
import type { CSVParsedUser } from '@/api/users/createUserCSV'

interface ValidationResult {
  row_number: number
  valid: boolean
  errors: string[]
  warnings?: string[]
}

interface Props {
  rowData: CSVParsedUser
  validation: ValidationResult
  isSelected: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:rowData': [data: CSVParsedUser]
  'toggle-selection': []
  'remove-row': []
}>()

// Create editable copy of row data
const editableData = reactive({ ...props.rowData })

// Watch for external changes to rowData
watch(() => props.rowData, (newData) => {
  Object.assign(editableData, newData)
}, { deep: true })

// Watch for changes in editable data and emit updates
watch(editableData, (newData) => {
  emit('update:rowData', { ...newData })
}, { deep: true })

// Field validation errors
const fieldErrors = ref<Record<string, string[]>>({})

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'cs', label: 'Customer Service' }
]

// Validation logic
const validateName = (name: string): string[] => {
  const errors: string[] = []
  if (!name || name.trim() === '') {
    errors.push('Name is required')
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }
  return errors
}

const validateEmail = (email: string): string[] => {
  const errors: string[] = []
  if (!email || email.trim() === '') {
    errors.push('Email is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address')
    }
  }
  return errors
}

const validatePhone = (phone: string): string[] => {
  const errors: string[] = []
  if (!phone || phone.trim() === '') {
    errors.push('Phone is required')
  } else {
    if (!phone.startsWith('0')) {
      errors.push("Phone number must start with '0' (Indonesian format)")
    }
    if (phone.length < 10 || phone.length > 13) {
      errors.push('Phone number must be 10-13 digits long')
    }
    if (!/^\d+$/.test(phone)) {
      errors.push('Phone number must contain only digits')
    }
  }
  return errors
}

const validateRole = (role: string): string[] => {
  const errors: string[] = []
  if (!role || role.trim() === '') {
    errors.push('Role is required')
  } else {
    const validRoles = ['admin', 'user', 'cs']
    if (!validRoles.includes(role)) {
      errors.push('Role must be admin, user, or cs')
    }
  }
  return errors
}

const validateField = (field: keyof CSVParsedUser) => {
  let errors: string[] = []

  switch (field) {
    case 'name':
      errors = validateName(editableData.name)
      break
    case 'email':
      errors = validateEmail(editableData.email)
      break
    case 'phone':
      errors = validatePhone(editableData.phone)
      break
    case 'role':
      errors = validateRole(editableData.role)
      break
  }

  if (errors.length > 0) {
    fieldErrors.value[field] = errors
  } else {
    delete fieldErrors.value[field]
  }
}

const getFieldErrors = (field: keyof CSVParsedUser): string[] => {
  return fieldErrors.value[field] || []
}

// Computed properties for validation status
const allErrors = computed(() => {
  const serverErrors = props.validation.errors || []
  const clientErrors = Object.values(fieldErrors.value).flat()
  return [...serverErrors, ...clientErrors]
})

const allWarnings = computed(() => props.validation.warnings || [])

const hasErrors = computed(() => allErrors.value.length > 0)
const hasWarnings = computed(() => allWarnings.value.length > 0)
const hasValidationIssues = computed(() => hasErrors.value || hasWarnings.value)
const isValid = computed(() => !hasErrors.value && !hasWarnings.value)

const validationClass = computed(() => {
  if (hasErrors.value) return 'border-l-4 border-l-red-600 bg-red-50 dark:bg-red-900/20'
  if (hasWarnings.value) return 'border-l-4 border-l-amber-600 bg-amber-50 dark:bg-amber-900/20'
  return 'border-l-4 border-l-green-600 bg-green-50 dark:bg-green-900/20'
})

const statusIconClass = computed(() => {
  if (isValid.value) return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  if (hasErrors.value) return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
})
</script>