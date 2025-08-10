<template>
  <DashboardLayout>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <BackToDashboardButton />
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900">Batch Register Users</h1>
        <p class="text-gray-600 mt-1">Create multiple user accounts at once</p>
      </div>

      <div class="flex gap-3">
        <Button @click="importFromCSV" variant="outline" class="flex items-center gap-2">
          <Upload class="w-4 h-4" />
          Import CSV
        </Button>
      </div>
    </div>

    <!-- Hidden file input for CSV import -->
    <input ref="csvInput" type="file" accept=".csv" @change="handleCSVUpload" class="hidden" />

    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Users Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>Users to Register ({{ values.users?.length || 0 }})</span>
            <span
              v-if="values.users?.length"
              class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
            >
              {{ values.users.length }} users
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent class="space-y-6">
          <!-- Empty state -->
          <div v-if="!values.users || values.users.length === 0" class="text-center py-12">
            <Users class="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p class="text-gray-500 text-lg font-medium">No users added yet</p>
            <p class="text-gray-400 text-sm mb-6">Click "Add User" to start or import from CSV</p>
            <Button @click="addUser" class="flex items-center gap-2 mx-auto">
              <Plus class="w-4 h-4" />
              Add First User
            </Button>
          </div>

          <!-- User forms -->
          <div v-else class="space-y-6">
            <Card v-for="(user, index) in values.users" :key="`user-${index}`" class="relative">
              <CardHeader class="pb-3">
                <CardTitle class="flex items-center justify-between">
                  <span class="text-lg">User {{ index + 1 }}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    @click="removeUser(index)"
                    class="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <!-- Name Field -->
                  <div class="space-y-2">
                    <Label>Name <span class="text-red-500">*</span></Label>
                    <Input
                      :name="`users[${index}].name`"
                      :model-value="values.users[index]?.name"
                      @update:model-value="(value) => updateUserField(index, 'name', String(value))"
                      @blur="() => validateField(`users[${index}].name`)"
                      type="text"
                      placeholder="Full name"
                      :class="{
                        'border-red-500 focus:border-red-500 focus:ring-red-500': getUserError(
                          index,
                          'name',
                        ),
                      }"
                    />
                    <p v-if="getUserError(index, 'name')" class="text-red-500 text-xs">
                      {{ getUserError(index, 'name') }}
                    </p>
                  </div>

                  <!-- Email Field -->
                  <div class="space-y-2">
                    <Label>Email <span class="text-red-500">*</span></Label>
                    <Input
                      :name="`users[${index}].email`"
                      :model-value="values.users[index]?.email"
                      @update:model-value="
                        (value) => updateUserField(index, 'email', String(value))
                      "
                      @blur="() => validateField(`users[${index}].email`)"
                      type="email"
                      placeholder="email@example.com"
                      :class="{
                        'border-red-500 focus:border-red-500 focus:ring-red-500': getUserError(
                          index,
                          'email',
                        ),
                      }"
                    />
                    <p v-if="getUserError(index, 'email')" class="text-red-500 text-xs">
                      {{ getUserError(index, 'email') }}
                    </p>
                  </div>

                  <!-- Phone Field -->
                  <div class="space-y-2">
                    <Label>Phone <span class="text-red-500">*</span></Label>
                    <Input
                      :name="`users[${index}].phone`"
                      :model-value="values.users[index]?.phone"
                      @update:model-value="
                        (value) => updateUserField(index, 'phone', String(value))
                      "
                      @blur="() => validateField(`users[${index}].phone`)"
                      type="text"
                      placeholder="+62XXXXXXXXXX"
                      :class="{
                        'border-red-500 focus:border-red-500 focus:ring-red-500': getUserError(
                          index,
                          'phone',
                        ),
                      }"
                    />
                    <p v-if="getUserError(index, 'phone')" class="text-red-500 text-xs">
                      {{ getUserError(index, 'phone') }}
                    </p>
                  </div>

                  <!-- Password Field -->
                  <div class="space-y-2">
                    <Label>Password <span class="text-red-500">*</span></Label>
                    <Input
                      :name="`users[${index}].password`"
                      :model-value="values.users[index]?.password"
                      @update:model-value="
                        (value) => updateUserField(index, 'password', String(value))
                      "
                      @blur="() => validateField(`users[${index}].password`)"
                      type="password"
                      placeholder="Min. 8 characters"
                      :class="{
                        'border-red-500 focus:border-red-500 focus:ring-red-500': getUserError(
                          index,
                          'password',
                        ),
                      }"
                    />
                    <p v-if="getUserError(index, 'password')" class="text-red-500 text-xs">
                      {{ getUserError(index, 'password') }}
                    </p>
                  </div>

                  <!-- Role Field -->
                  <div class="space-y-2">
                    <Label>Role <span class="text-red-500">*</span></Label>
                    <Select
                      :name="`users[${index}].role_type`"
                      :model-value="values.users[index]?.role_type"
                      @update:model-value="
                        (value) => updateUserField(index, 'role_type', String(value))
                      "
                    >
                      <SelectTrigger
                        :class="{
                          'border-red-500 focus:border-red-500 focus:ring-red-500': getUserError(
                            index,
                            'role_type',
                          ),
                        }"
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="cs">Customer Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <p v-if="getUserError(index, 'role_type')" class="text-red-500 text-xs">
                      {{ getUserError(index, 'role_type') }}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <span
            class="flex justify-end"
            :class="values.users && values.users.length === 0 ? 'hidden' : ''"
          >
            <Button @click="addUser" class="flex items-center gap-2">
              <Plus class="w-4 h-4" />
              Add User
            </Button>
          </span>
        </CardContent>
      </Card>

      <!-- Action buttons -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <span class="px-2 py-1 border border-gray-300 rounded flex items-center gap-1">
                <Users class="w-3 h-3" />
                {{ values.users?.length || 0 }}
              </span>
              <span>user(s) ready to register</span>
            </div>

            <div class="flex gap-3">
              <Button
                type="button"
                variant="outline"
                @click="clearAll"
                :disabled="!values.users?.length"
              >
                <X class="w-4 h-4 mr-2" />
                Clear All
              </Button>

              <Button
                type="submit"
                :disabled="isSubmitting || !values.users?.length"
                class="flex items-center gap-2"
              >
                <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                <UserPlus v-else class="w-4 h-4" />
                {{ isSubmitting ? 'Registering...' : 'Register Users' }}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>

    <!-- Results Dialog -->
    <AlertDialog v-model:open="showResults">
      <AlertDialogContent class="max-w-2xl max-h-[80vh] overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle class="flex items-center gap-2">
            <CheckCircle class="w-5 h-5 text-green-600" />
            Registration Results
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>

        <div class="space-y-4">
          <!-- Summary -->
          <div class="flex gap-4">
            <span
              class="px-3 py-1 rounded-full flex items-center gap-1 text-green-700 bg-green-100 text-sm"
            >
              <CheckCircle class="w-3 h-3" />
              {{ registrationResults?.successful?.length || 0 }} Successful
            </span>
            <span
              class="px-3 py-1 rounded-full flex items-center gap-1 text-red-700 bg-red-100 text-sm"
            >
              <XCircle class="w-3 h-3" />
              {{
                (registrationResults?.total || 0) - (registrationResults?.successful?.length || 0)
              }}
              Failed
            </span>
          </div>

          <!-- Results List -->
          <ScrollAreaRoot
            class="relative overflow-y-scroll shadow-sm bg-white h-64 w-full rounded-md border p-2"
            style="--scrollbar-size: 10px"
          >
            <div class="space-y-3">
              <ScrollAreaViewport>
                <Card
                  v-for="(result, index) in registrationResults?.successful"
                  :key="index"
                  class="border-l-4 my-2 rounded-sm py-2 border-l-green-500 bg-green-50"
                >
                  <CardContent class="pt-1 pb-1">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm text-green-800">
                          {{ result }}
                        </p>
                      </div>
                      <div class="flex items-center">
                        <CheckCircle class="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAreaViewport>
            </div>
          </ScrollAreaRoot>
        </div>

        <AlertDialogFooter>
          <Button @click="closeResults"> Close </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import {
  Plus,
  Upload,
  Users,
  Trash2,
  X,
  UserPlus,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-vue-next'

// Reka UI Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { ScrollAreaRoot, ScrollAreaViewport } from 'reka-ui'
import { BatchRegisterSchema } from '@/lib/zod-schemas/registerFormSchema'
import { batchRegisterUsers, type BatchUserInterface } from '@/api/users/createUserBatch'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import AlertDialogDescription from '@/components/ui/alert-dialog/AlertDialogDescription.vue'
import BackToDashboardButton from '@/components/custom/buttons/BackToDashboardButton.vue'

interface FormValues {
  users: BatchUserInterface[]
}

const csvInput = ref<HTMLInputElement>()
const showResults = ref(false)
const registrationResults = ref<{
  successful: Array<string>
  total: number
} | null>(null)

const { handleSubmit, values, errors, setFieldValue, resetForm, validate, validateField } =
  useForm<FormValues>({
    validationSchema: BatchRegisterSchema,
    initialValues: {
      users: [],
    },
  })

const { mutate: submitBatchRegister, isPending: isSubmitting } = useMutation({
  mutationFn: (users: BatchUserInterface[]) => batchRegisterUsers(users),
  onSuccess: (data) => {
    registrationResults.value = data.data
    showResults.value = true

    if (data.data.total > 0) {
      toast('Batch Registration Completed', {
        description: `${data.message}`,
      })
    }

    if (data.data.successful.length > 0) {
      resetForm()
    }
  },
  onError: (error) => {
    toast('Registration Failed', {
      description: error.message || 'An error occurred during batch registration',
    })
  },
})

const onSubmit = handleSubmit(async (values) => {
  console.log('Form values:', values.users)
  console.log('Form errors:', errors.value)

  if (!values.users || values.users.length === 0) {
    toast.error('No users to register')
    return
  }

  // Validate all fields before submission
  const { valid } = await validate()
  if (!valid) {
    toast.error('Please fix all validation errors before submitting')
    return
  }

  submitBatchRegister(values.users)
})

const addUser = () => {
  const currentUsers = values.users || []
  setFieldValue('users', [
    ...currentUsers,
    {
      name: '',
      email: '',
      phone: '',
      password: '',
      role_type: '',
    },
  ])
}

const removeUser = (index: number) => {
  const currentUsers = values.users || []
  const newUsers = currentUsers.filter((_, i) => i !== index)
  setFieldValue('users', newUsers)
}

const clearAll = () => {
  resetForm({
    values: { users: [] },
  })
}

const getUserError = (userIndex: number, field: keyof BatchUserInterface) => {
  const errorKey = `users[${userIndex}].${field}` as keyof typeof errors.value
  return errors.value[errorKey]
}

// Function to update individual user fields
const updateUserField = async (index: number, field: keyof BatchUserInterface, value: string) => {
  const currentUsers = [...(values.users || [])]
  if (currentUsers[index]) {
    currentUsers[index] = { ...currentUsers[index], [field]: value }
    setFieldValue('users', currentUsers)

    // Trigger validation for the specific field
    setTimeout(() => {
      validateField(`users[${index}].${field}`)
    }, 0)
  }
}

const importFromCSV = () => {
  csvInput.value?.click()
}

const handleCSVUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const csv = e.target?.result as string
      const lines = csv.split('\n')
      // Skip header line - format expected: name,email,phone,password,role_type

      const users: BatchUserInterface[] = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const values = line.split(',').map((v) => v.trim().replace(/"/g, ''))

        if (values.length >= 5) {
          users.push({
            name: values[0] || '',
            email: values[1] || '',
            phone: values[2] || '',
            password: values[3] || '',
            role_type: values[4] || '',
          })
        }
      }

      setFieldValue('users', users)
      toast.success(`Imported ${users.length} users from CSV`)
    } catch (error) {
      toast.error('Failed to parse CSV file')
      console.error(error)
    }
  }

  reader.readAsText(file)
}

const closeResults = () => {
  showResults.value = false
  registrationResults.value = null
}
</script>
