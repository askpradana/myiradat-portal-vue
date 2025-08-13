<template>
  <DashboardLayout>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <BackToDashboardButton />
      <div class="text-center">
        <h1 class="text-2xl font-bold">Batch Register Users</h1>
        <p class="text-gray-600 mt-1">Create multiple user accounts at once</p>
      </div>

      <div class="flex gap-3">
        <UploadCSVBatch />
        <!-- <Button @click="console.log('upload')" variant="outline" class="flex items-center gap-2">
          <Upload />
          Import CSV
        </Button> -->
      </div>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Users Card -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>Users to Register ({{ users.length }})</span>
            <span v-if="users.length" class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
              {{ users.length }} users
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent class="space-y-6">
          <!-- Empty state -->
          <div v-if="users.length === 0" class="text-center py-12">
            <Users class="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p class="text-gray-500 text-lg font-medium">No users added yet</p>
            <p class="text-gray-400 text-sm mb-6">Click "Add User" to start or import from CSV</p>
            <Button @click="addUser" class="flex items-center gap-2 mx-auto" type="button">
              <Plus class="w-4 h-4" />
              Add First User
            </Button>
          </div>

          <!-- User forms -->
          <div v-else class="space-y-6">
            <Card v-for="(user, index) in users" :key="`user-${index}`" class="relative">
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
                      v-model="users[index].name"
                      @blur="() => validateField(index, 'name')"
                      @input="() => clearFieldError(index, 'name')"
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
                      v-model="users[index].email"
                      @blur="() => validateField(index, 'email')"
                      @input="() => clearFieldError(index, 'email')"
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
                      v-model="users[index].phone"
                      @blur="() => validateField(index, 'phone')"
                      @input="() => clearFieldError(index, 'phone')"
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
                      v-model="users[index].password"
                      @blur="() => validateField(index, 'password')"
                      @input="() => clearFieldError(index, 'password')"
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
                      v-model="users[index].role_type"
                      @update:model-value="() => validateField(index, 'role_type')"
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
          <span class="flex justify-end" :class="users.length === 0 ? 'hidden' : ''">
            <Button @click="addUser" class="flex items-center gap-2" type="button">
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
                {{ users.length }}
              </span>
              <span>user(s) ready to register</span>
            </div>

            <div class="flex gap-3">
              <Button
                type="button"
                variant="outline"
                @click="clearAll"
                :disabled="users.length === 0"
              >
                <X class="w-4 h-4 mr-2" />
                Clear All
              </Button>

              <Button
                type="submit"
                :disabled="isSubmitting || users.length === 0"
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
import { ref, reactive } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { Plus, Users, Trash2, X, UserPlus, Loader2, CheckCircle, XCircle } from 'lucide-vue-next'

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
import { batchRegisterUsers, type BatchUserInterface } from '@/api/users/createUserBatch'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import AlertDialogDescription from '@/components/ui/alert-dialog/AlertDialogDescription.vue'
import BackToDashboardButton from '@/components/custom/buttons/BackToDashboardButton.vue'
import UploadCSVBatch from '@/components/custom/alerts/UploadCSVBatch.vue'

// Types
interface ValidationErrors {
  [key: number]: {
    [key in keyof BatchUserInterface]?: string
  }
}

// Reactive data
const users = reactive<BatchUserInterface[]>([])
const errors = reactive<ValidationErrors>({})
const showResults = ref(false)
const registrationResults = ref<{
  successful: Array<string>
  total: number
} | null>(null)

// Validation functions
const validateName = (name: string): string | null => {
  if (!name || name.trim() === '') {
    return 'Name is required'
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long'
  }
  return null
}

const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return 'Email is required'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

const validatePhone = (phone: string): string | null => {
  if (!phone || phone.trim() === '') {
    return 'Phone is required'
  }
  if (phone.trim().length < 6) {
    return 'Phone must be at least 6 characters long'
  }
  return null
}

const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === '') {
    return 'Password is required'
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  return null
}

const validateRole = (role: string): string | null => {
  if (!role || role.trim() === '') {
    return 'Role is required'
  }
  const validRoles = ['admin', 'user', 'cs']
  if (!validRoles.includes(role)) {
    return 'Role must be admin, user, or cs'
  }
  return null
}

// Field validation
const validateField = (userIndex: number, field: keyof BatchUserInterface) => {
  const user = users[userIndex]
  if (!user) return

  let error: string | null = null

  switch (field) {
    case 'name':
      error = validateName(user.name)
      break
    case 'email':
      error = validateEmail(user.email)
      break
    case 'phone':
      error = validatePhone(user.phone)
      break
    case 'password':
      error = validatePassword(user.password)
      break
    case 'role_type':
      error = validateRole(user.role_type)
      break
  }

  // Set or clear error
  if (error) {
    if (!errors[userIndex]) {
      errors[userIndex] = {}
    }
    errors[userIndex][field] = error
  } else {
    if (errors[userIndex]) {
      delete errors[userIndex][field]
      // Clean up empty error objects
      if (Object.keys(errors[userIndex]).length === 0) {
        delete errors[userIndex]
      }
    }
  }
}

// Validate all fields for a user
const validateUser = (userIndex: number): boolean => {
  const fields: (keyof BatchUserInterface)[] = ['name', 'email', 'phone', 'password', 'role_type']
  fields.forEach((field) => validateField(userIndex, field))
  return !errors[userIndex] || Object.keys(errors[userIndex]).length === 0
}

// Validate all users
const validateAllUsers = (): boolean => {
  let isValid = true
  users.forEach((_, index) => {
    const userValid = validateUser(index)
    if (!userValid) isValid = false
  })
  return isValid
}

// Clear field error
const clearFieldError = (userIndex: number, field: keyof BatchUserInterface) => {
  if (errors[userIndex] && errors[userIndex][field]) {
    delete errors[userIndex][field]
    if (Object.keys(errors[userIndex]).length === 0) {
      delete errors[userIndex]
    }
  }
}

// Get user error
const getUserError = (userIndex: number, field: keyof BatchUserInterface): string | undefined => {
  return errors[userIndex]?.[field]
}

// Mutation for batch registration
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
      clearAll()
    }
  },
  onError: (error) => {
    toast('Registration Failed', {
      description: error.message || 'An error occurred during batch registration',
    })
  },
})

// Form submission
const onSubmit = async () => {
  if (users.length === 0) {
    toast.error('No users to register')
    return
  }

  // Validate all users
  const isValid = validateAllUsers()

  if (!isValid) {
    toast.error('Please fix all validation errors before submitting')
    return
  }

  // Submit the form
  submitBatchRegister([...users])
}

// User management functions
const addUser = (event?: Event) => {
  // Prevent form submission if this is called from within a form
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // Check if existing users have errors
  if (users.length > 0) {
    // Validate existing users first to populate errors
    let hasErrors = false
    users.forEach((_, index) => {
      const userValid = validateUser(index)
      if (!userValid) hasErrors = true
    })

    if (hasErrors) {
      toast('Error', {
        description: 'Please fix all validation errors in existing forms before adding a new user',
      })
      return
    }
  }

  users.push({
    name: '',
    email: '',
    phone: '',
    password: '',
    role_type: '',
  })
}

const removeUser = (index: number) => {
  users.splice(index, 1)

  // Clean up errors for removed user and reindex
  const newErrors: ValidationErrors = {}
  Object.keys(errors).forEach((key) => {
    const userIndex = parseInt(key)
    if (userIndex < index) {
      // Keep errors for users before the removed one
      newErrors[userIndex] = errors[userIndex]
    } else if (userIndex > index) {
      // Reindex errors for users after the removed one
      newErrors[userIndex - 1] = errors[userIndex]
    }
    // Skip errors for the removed user (userIndex === index)
  })

  // Clear all errors and set new ones
  Object.keys(errors).forEach((key) => delete errors[parseInt(key)])
  Object.keys(newErrors).forEach((key) => {
    errors[parseInt(key)] = newErrors[parseInt(key)]
  })
}

const clearAll = () => {
  users.splice(0, users.length)
  Object.keys(errors).forEach((key) => delete errors[parseInt(key)])
}

const closeResults = () => {
  showResults.value = false
  registrationResults.value = null
}
</script>
