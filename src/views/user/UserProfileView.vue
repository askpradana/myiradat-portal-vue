<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Profile Card -->
    <div class="lg:col-span-1">
      <Card>
        <CardContent class="p-6">
          <div class="text-center">
            <div
              class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary"
            >
              {{ userStore.user?.name.charAt(0) }}
            </div>
            <h3 class="font-semibold text-foreground">{{ userStore.user?.name }}</h3>
            <div
              class="mt-4 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
            >
              <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ userStore.user?.role_id === 1 ? 'Admin' : 'User' }}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Profile Details -->
    <div class="lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle class="text-foreground">Profile Information</CardTitle>
          <CardDescription class="text-muted-foreground">
            Your personal information and account details.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Personal Information -->
          <div>
            <h4 class="text-lg font-medium text-foreground mb-4">Personal Information</h4>

            <form class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit="onSubmit">
              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1"
                  >Full Name</label
                >
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your username"
                  class="text-sm text-foreground bg-muted px-3 py-2 rounded-md"
                  required
                  v-model="name"
                />
                <span class="text-xs text-red-400">{{ errors.name }}</span>
              </div>
              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1"
                  >Email Address</label
                >
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  class="text-sm text-foreground bg-muted px-3 py-2 rounded-md"
                  required
                  v-model="email"
                />
                <span class="text-xs text-red-400">{{ errors.email }}</span>
              </div>
              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1"
                  >Phone Number</label
                >
                <Input
                  id="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  class="text-sm text-foreground bg-muted px-3 py-2 rounded-md"
                  required
                  v-model="phone"
                />
                <span class="text-xs text-red-400">{{ errors.phone }}</span>
              </div>
              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1"
                  >Date of Birth</label
                >
                <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                  {{
                    formatDate(userStore.user?.date_of_birth ? userStore.user?.date_of_birth : '')
                  }}
                </div>
              </div>
            </form>
            <Button
              size="sm"
              type="submit"
              class="w-full mt-6 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              :disabled="isPending || isFormUnchanged"
              :class="isPending && 'bg-gray-500 pointer-events-none'"
              @click="onSubmit"
            >
              {{ isPending ? 'Please wait...' : 'Update User' }}
            </Button>
          </div>

          <!-- Additional Information -->
          <!-- <div>
            <h4 class="text-lg font-medium text-foreground mb-4">Additional Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1"
                  >Department</label
                >
                <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                  {{ currentUser.department }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1">Location</label>
                <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                  {{ currentUser.location }}
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-muted-foreground mb-1">Bio</label>
                <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                  {{ currentUser.bio }}
                </div>
              </div>
            </div>
          </div> -->
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserStore } from '@/stores/userStores'
import { formatDate } from '@/lib/dateFromate'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useForm, useField } from 'vee-validate'
import { EditUserShcema } from '@/lib/zod-schemas/EditUserFormSchema'
import { toast } from 'vue-sonner'
import { editUserData } from '@/api/users/editUser'
import { computed } from 'vue'

interface DataUserInterface {
  name: string
  phone: string
  email: string
  date_of_birth?: string
}

const userStore = useUserStore()
const dataUser = userStore.user

const validationSchema = EditUserShcema
const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    name: dataUser?.name,
    phone: dataUser?.phone,
    email: dataUser?.email,
    role: dataUser?.role_name,
  },
})

const { value: email } = useField<string>('email')
const { value: name } = useField<string>('name')
const { value: phone } = useField<string>('phone')

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: ({ userID, data }: { data: DataUserInterface; userID: string }) =>
    editUserData(data, userID),
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.message}`,
      })
      queryClient.invalidateQueries({
        queryKey: ['profile', dataUser?.id],
        exact: false, // Ini akan refetch semua data query yang dimulai dengan 'users'
      })
    }
  },
  onError: (error: Error) => {
    toast('Error', {
      description: `Failed to update user data: ${error.message}`,
    })
  },
})

const isFormUnchanged = computed(() => {
  return (
    name.value === userStore.user?.name &&
    email.value === userStore.user?.email &&
    phone.value === userStore.user?.phone
  )
})

const onSubmit = handleSubmit((values) => {
  mutate({
    userID: dataUser?.id ? dataUser?.id : '',
    data: { ...values },
  })
})
</script>
