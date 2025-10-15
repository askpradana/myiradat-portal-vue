<template>
  <div class="space-y-4">
    <!-- Summary Component -->
    <CSVValidationSummary
      :summary="csvData.summary"
      @select-invalid="selectInvalidRows"
      @select-valid="selectValidRows"
      @select-all="selectAllRows"
      @clear-selection="clearSelection"
    />

    <!-- Desktop Table View -->
    <Card class="hidden md:block">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full" role="table" aria-label="CSV user data review table">
            <thead>
              <tr class="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <th class="w-12 p-3 text-left">
                  <div class="flex items-center justify-center">
                    <input
                      type="checkbox"
                      :checked="isAllSelected"
                      :indeterminate="isPartiallySelected"
                      @change="toggleSelectAll"
                      class="w-4 h-4 text-blue-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                      aria-label="Select all rows"
                    />
                  </div>
                </th>
                <th class="w-16 p-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">#</th>
                <th class="p-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Name</th>
                <th class="p-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Email</th>
                <th class="p-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</th>
                <th class="p-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Role</th>
                <th class="w-20 p-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th class="w-12 p-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <CSVTableRow
                v-for="(row, index) in editableRows"
                :key="`row-${row.row_number}`"
                :row-data="row"
                :validation="getValidationForRow(row.row_number)"
                :is-selected="selectedRows.includes(index)"
                @update:row-data="updateRowData(index, $event)"
                @toggle-selection="toggleRowSelection(index)"
                @remove-row="removeRow(index)"
              />
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div v-if="editableRows.length === 0" class="p-12 text-center">
          <FileX class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">No data to review</p>
          <p class="text-gray-400 dark:text-gray-500 text-sm">Upload a CSV file to start the review process</p>
        </div>
      </CardContent>
    </Card>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-6">
      <div
        v-for="(row, index) in editableRows"
        :key="`mobile-row-${row.row_number}`"
        class="relative"
      >
        <Card
          :class="[
            'transition-all duration-200 touch-manipulation',
            selectedRows.includes(index) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' : '',
            getValidationClass(row.row_number)
          ]"
        >
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-4 min-w-0 flex-1">
                <input
                  type="checkbox"
                  :checked="selectedRows.includes(index)"
                  @change="toggleRowSelection(index)"
                  class="w-6 h-6 text-blue-600 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 focus:ring-2 touch-manipulation flex-shrink-0"
                  :aria-label="`Select row ${row.row_number}`"
                />
                <div class="min-w-0 flex-1">
                  <CardTitle class="text-lg font-semibold">User {{ row.row_number }}</CardTitle>
                  <p class="text-sm text-gray-500 mt-1 truncate">
                    {{ isRowValid(row.row_number) ? 'Ready to register' : hasRowErrors(row.row_number) ? 'Has errors - needs fixes' : 'Has warnings' }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3 flex-shrink-0">
                <!-- Status indicator -->
                <CSVErrorTooltip
                  v-if="hasValidationIssues(row.row_number)"
                  :errors="getValidationForRow(row.row_number).errors"
                  :warnings="getValidationForRow(row.row_number).warnings"
                  :row-number="row.row_number"
                >
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium touch-manipulation"
                    :class="getStatusIconClass(row.row_number)"
                  >
                    <CheckCircle v-if="isRowValid(row.row_number)" class="w-5 h-5" />
                    <XCircle v-else-if="hasRowErrors(row.row_number)" class="w-5 h-5" />
                    <AlertTriangle v-else class="w-5 h-5" />
                  </div>
                </CSVErrorTooltip>
                <div
                  v-else
                  class="flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                >
                  <CheckCircle class="w-5 h-5" />
                </div>

                <!-- Remove button -->
                <Button
                  variant="ghost"
                  size="sm"
                  @click="removeRow(index)"
                  class="w-12 h-12 p-0 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full touch-manipulation"
                  :aria-label="`Remove row ${row.row_number}`"
                >
                  <Trash2 class="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-6 px-4 pb-6">
            <!-- Primary Fields Group -->
            <div class="space-y-5">
              <!-- Name field -->
              <div class="space-y-3">
                <Label :for="`mobile-name-${row.row_number}`" class="text-base font-medium">Name <span class="text-red-500">*</span></Label>
                <EditableCell
                  :id="`mobile-name-${row.row_number}`"
                  v-model="editableRows[index].name"
                  field="name"
                  :row-number="row.row_number"
                  :validation-errors="getMobileFieldErrors(row.row_number, 'name')"
                  @update:model-value="updateRowData(index, { ...row, name: $event }); validateField(index, 'name')"
                  placeholder="Full name"
                  className="h-12 text-base touch-manipulation"
                />
              </div>

              <!-- Email field -->
              <div class="space-y-3">
                <Label :for="`mobile-email-${row.row_number}`" class="text-base font-medium">Email <span class="text-red-500">*</span></Label>
                <EditableCell
                  :id="`mobile-email-${row.row_number}`"
                  v-model="editableRows[index].email"
                  field="email"
                  :row-number="row.row_number"
                  :validation-errors="getMobileFieldErrors(row.row_number, 'email')"
                  @update:model-value="updateRowData(index, { ...row, email: $event }); validateField(index, 'email')"
                  type="email"
                  placeholder="email@example.com"
                  className="h-12 text-base touch-manipulation"
                />
              </div>
            </div>

            <!-- Contact & Role Group -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Phone field -->
              <div class="space-y-3">
                <Label :for="`mobile-phone-${row.row_number}`" class="text-base font-medium">Phone <span class="text-red-500">*</span></Label>
                <EditableCell
                  :id="`mobile-phone-${row.row_number}`"
                  v-model="editableRows[index].phone"
                  field="phone"
                  :row-number="row.row_number"
                  :validation-errors="getMobileFieldErrors(row.row_number, 'phone')"
                  @update:model-value="updateRowData(index, { ...row, phone: $event }); validateField(index, 'phone')"
                  type="tel"
                  placeholder="08XXXXXXXXXX"
                  className="h-12 text-base touch-manipulation"
                />
              </div>

              <!-- Role field -->
              <div class="space-y-3">
                <Label :for="`mobile-role-${row.row_number}`" class="text-base font-medium">Role <span class="text-red-500">*</span></Label>
                <EditableSelect
                  :id="`mobile-role-${row.row_number}`"
                  v-model="editableRows[index].role"
                  field="role"
                  :row-number="row.row_number"
                  :validation-errors="getMobileFieldErrors(row.row_number, 'role')"
                  @update:model-value="updateRowData(index, { ...row, role: $event }); validateField(index, 'role')"
                  :options="roleOptions"
                  placeholder="Select role"
                  className="h-12 text-base touch-manipulation"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Batch Actions -->
    <Card v-if="editableRows.length > 0">
      <CardContent class="pt-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full flex items-center gap-1.5 font-medium">
                <Users class="w-3.5 h-3.5" />
                {{ editableRows.length }}
              </span>
              <span>{{ editableRows.length === 1 ? 'user' : 'users' }} ready for review</span>
            </div>
            <span v-if="selectedRows.length > 0" class="text-blue-600 font-medium">
              ({{ selectedRows.length }} selected)
            </span>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              v-if="selectedRows.length > 0"
              variant="outline"
              @click="removeSelectedRows"
              class="w-full sm:w-auto h-12 sm:h-10 flex items-center justify-center gap-2 touch-manipulation"
            >
              <Trash2 class="w-4 h-4" />
              Remove Selected
            </Button>

            <Button
              @click="$emit('proceed-registration')"
              :disabled="!canProceed"
              class="w-full sm:w-auto h-12 sm:h-10 flex items-center justify-center gap-2 touch-manipulation"
            >
              <UserPlus class="w-4 h-4" />
              Register Users ({{ validRowCount }})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import {
  Users,
  UserPlus,
  Trash2,
  FileX,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import CSVValidationSummary from './CSVValidationSummary.vue'
import CSVTableRow from './CSVTableRow.vue'
import CSVErrorTooltip from './CSVErrorTooltip.vue'
import EditableCell from './EditableCell.vue'
import EditableSelect from './EditableSelect.vue'
import type { BatchRegisterCSVData, CSVParsedUser } from '@/api/users/createUserCSV'

interface Props {
  csvData: BatchRegisterCSVData
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:csvData': [data: BatchRegisterCSVData]
  'proceed-registration': []
}>()

// Reactive data
const editableRows = reactive<CSVParsedUser[]>([...props.csvData.parsed_users])
const selectedRows = ref<number[]>([])
const fieldErrors = ref<Record<number, Record<string, string[]>>>({})

// Watch for external changes
watch(() => props.csvData.parsed_users, (newUsers) => {
  editableRows.splice(0, editableRows.length, ...newUsers)
}, { deep: true })

// Watch for changes and emit updates
watch(editableRows, () => {
  const updatedData = {
    ...props.csvData,
    parsed_users: [...editableRows]
  }
  emit('update:csvData', updatedData)
}, { deep: true })

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'cs', label: 'Customer Service' }
]

// Client-side validation functions
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

const validateField = (rowIndex: number, field: keyof CSVParsedUser) => {
  const row = editableRows[rowIndex]
  if (!row) return

  let errors: string[] = []

  switch (field) {
    case 'name':
      errors = validateName(row.name)
      break
    case 'email':
      errors = validateEmail(row.email)
      break
    case 'phone':
      errors = validatePhone(row.phone)
      break
    case 'role':
      errors = validateRole(row.role)
      break
  }

  const rowNumber = row.row_number
  if (!fieldErrors.value[rowNumber]) {
    fieldErrors.value[rowNumber] = {}
  }

  if (errors.length > 0) {
    fieldErrors.value[rowNumber][field] = errors
  } else {
    delete fieldErrors.value[rowNumber][field]
    // Clean up empty error objects
    if (Object.keys(fieldErrors.value[rowNumber]).length === 0) {
      delete fieldErrors.value[rowNumber]
    }
  }
}

// Helper functions
const getValidationForRow = (rowNumber: number) => {
  return props.csvData.validation_results.find(v => v.row_number === rowNumber) || {
    row_number: rowNumber,
    valid: true,
    errors: [],
    warnings: []
  }
}

const hasValidationIssues = (rowNumber: number) => {
  const validation = getValidationForRow(rowNumber)
  const clientErrors = fieldErrors.value[rowNumber] ? Object.values(fieldErrors.value[rowNumber]).flat() : []
  return validation.errors.length > 0 || (validation.warnings?.length || 0) > 0 || clientErrors.length > 0
}

const hasRowErrors = (rowNumber: number) => {
  const validation = getValidationForRow(rowNumber)
  const clientErrors = fieldErrors.value[rowNumber] ? Object.values(fieldErrors.value[rowNumber]).flat() : []
  return validation.errors.length > 0 || clientErrors.length > 0
}

const isRowValid = (rowNumber: number) => {
  const validation = getValidationForRow(rowNumber)
  const clientErrors = fieldErrors.value[rowNumber] ? Object.values(fieldErrors.value[rowNumber]).flat() : []
  return validation.errors.length === 0 && (validation.warnings?.length || 0) === 0 && clientErrors.length === 0
}

const getValidationClass = (rowNumber: number) => {
  const validation = getValidationForRow(rowNumber)
  if (validation.errors.length > 0) return 'border-l-4 border-l-red-600'
  if ((validation.warnings?.length || 0) > 0) return 'border-l-4 border-l-amber-600'
  return 'border-l-4 border-l-green-600'
}

const getStatusIconClass = (rowNumber: number) => {
  if (isRowValid(rowNumber)) return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  if (hasRowErrors(rowNumber)) return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
}

const getMobileFieldErrors = (rowNumber: number, field: string) => {
  // Combine server-side and client-side validation errors
  const validation = getValidationForRow(rowNumber)
  const serverErrors = validation.errors.filter(error =>
    error.toLowerCase().includes(field.toLowerCase())
  )

  const clientErrors = fieldErrors.value[rowNumber]?.[field] || []

  return [...serverErrors, ...clientErrors]
}

// Selection logic
const isAllSelected = computed(() =>
  editableRows.length > 0 && selectedRows.value.length === editableRows.length
)

const isPartiallySelected = computed(() =>
  selectedRows.value.length > 0 && selectedRows.value.length < editableRows.length
)

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRows.value = []
  } else {
    selectedRows.value = editableRows.map((_, index) => index)
  }
}

const toggleRowSelection = (index: number) => {
  const selectedIndex = selectedRows.value.indexOf(index)
  if (selectedIndex > -1) {
    selectedRows.value.splice(selectedIndex, 1)
  } else {
    selectedRows.value.push(index)
  }
}

const selectInvalidRows = () => {
  selectedRows.value = editableRows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => hasRowErrors(row.row_number))
    .map(({ index }) => index)
}

const selectValidRows = () => {
  selectedRows.value = editableRows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => isRowValid(row.row_number))
    .map(({ index }) => index)
}

const selectAllRows = () => {
  selectedRows.value = editableRows.map((_, index) => index)
}

const clearSelection = () => {
  selectedRows.value = []
}

// Row management
const updateRowData = (index: number, newData: CSVParsedUser) => {
  if (editableRows[index]) {
    Object.assign(editableRows[index], newData)
  }
}

const removeRow = (index: number) => {
  editableRows.splice(index, 1)

  // Update selected rows indices
  selectedRows.value = selectedRows.value
    .map(selectedIndex => {
      if (selectedIndex > index) return selectedIndex - 1
      if (selectedIndex === index) return -1
      return selectedIndex
    })
    .filter(index => index !== -1)
}

const removeSelectedRows = () => {
  const sortedIndices = [...selectedRows.value].sort((a, b) => b - a)
  sortedIndices.forEach(index => {
    editableRows.splice(index, 1)
  })
  selectedRows.value = []
}

// Validation computed properties
const validRowCount = computed(() => {
  return editableRows.filter(row => isRowValid(row.row_number)).length
})

const canProceed = computed(() => {
  return editableRows.length > 0 && validRowCount.value > 0
})
</script>