<script setup lang="ts">
import { ref } from 'vue'
import { AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTrigger } from 'reka-ui'
import {
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import { Pencil } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { editUserData } from '@/api/users/editUser'
import { useUserStore } from '@/stores/userStores'
import { EditUserShcema } from '@/lib/zod-schemas/EditUserFormSchema'
import { useForm, useField } from 'vee-validate'

interface DataUserProps {
  name: string
  phone: string
  email: string
  date_of_birth?: string
  role_name: string
  avatar_picture?: string
}

interface NewDataSubmitInterface extends DataUserProps {
  role_type: string
}

const { userID, dataUser, currentPage } = defineProps<{
  userID: string
  dataUser: DataUserProps
  currentPage: number
}>()

const validationSchema = EditUserShcema
const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    name: dataUser.name,
    phone: dataUser.phone,
    email: dataUser.email,
    role: dataUser.role_name,
  },
})

const { value: email } = useField<string>('email')
const { value: name } = useField<string>('name')
const { value: phone } = useField<string>('phone')
// const { value: role } = useField<string>('role')

const userStore = useUserStore()
const open = ref(false)

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: ({
    userID,
    data,
    role,
  }: {
    data: NewDataSubmitInterface
    userID: string
    role: number
  }) => editUserData(data, userID, role),
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.message}`,
      })
      queryClient.invalidateQueries({
        queryKey: ['users', currentPage],
        exact: false, // Ini akan refetch semua data query yang dimulai dengan 'users'
      })
      open.value = false
    }
  },
  onError: (error: Error) => {
    toast('Error', {
      description: `Failed to update user data: ${error.message}`,
    })
  },
})

const onSubmit = handleSubmit((values) => {
  mutate({
    userID: userID,
    data: { ...values, role_type: values.role, role_name: values.role },
    role: Number(userStore.user?.role_id),
  })
})
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger class="">
      <Button
        variant="outline"
        size="icon"
        class="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
      >
        <Pencil :size="18" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="bg-white/80 dark:bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
      />
      <AlertDialogContent
        class="z-[100] text-sm data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
      >
        <AlertDialogTitle class="text-black dark:text-white m-0 text-[17px] font-semibold">
          Edit Profile User
        </AlertDialogTitle>
        <AlertDialogDescription class="text-sm leading-normal">
          Please fill in all the columns
        </AlertDialogDescription>

        <!-- FORM Area -->
        <form @submit="onSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="name" class="text-sm font-medium text-foreground">Username</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your username"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="name"
            />
            <span class="text-xs text-red-400">{{ errors.name }}</span>
          </div>

          <div class="space-y-2">
            <Label for="phone" class="text-sm font-medium text-foreground">Phone number</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Enter your phone number"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="phone"
            />
            <span class="text-xs text-red-400">{{ errors.phone }}</span>
          </div>

          <div class="space-y-2">
            <Label for="email" class="text-sm font-medium text-foreground">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="email"
            />
            <span class="text-xs text-red-400">{{ errors.email }}</span>
          </div>

          <!-- <div class="space-y-2 w-full relative">
            <Label for="role">Select Role</Label>
            <Select v-model="role">
              <SelectTrigger class="w-full">
                <SelectValue :placeholder="role || 'Select a role'" />
              </SelectTrigger>
              <SelectContent class="z-[150]" :portal="true" :side="'bottom'" :align="'start'">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <span class="text-xs text-red-400">{{ errors.role }}</span>
          </div> -->

          <Button
            size="sm"
            type="submit"
            class="w-full mt-2 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            :disabled="isPending"
            :class="isPending && 'bg-gray-500 pointer-events-none'"
          >
            {{ isPending ? 'Please wait...' : 'Update Profile' }}
          </Button>
        </form>

        <!-- Button Area -->
        <div class="flex justify-end gap-4">
          <AlertDialogCancel
            v-if="!isPending"
            class="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
