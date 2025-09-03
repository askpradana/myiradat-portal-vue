<script setup lang="ts">
import { ref } from 'vue'
import { AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTrigger } from 'reka-ui'
import {
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import { RotateCcwKeyIcon, Eye, EyeClosed, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/vue-query'
import { ResetPasswordByAdminFormSchema } from '@/lib/zod-schemas/resetPasswordFormSchema'
import { useForm, useField } from 'vee-validate'
import { resetPasswordByAdmin } from '@/api/auth/resetPasswordByAdmin'

const { userID, userName } = defineProps<{
  userID: string
  userName: string
}>()

const validationSchema = ResetPasswordByAdminFormSchema
const { handleSubmit, errors, resetForm } = useForm({
  validationSchema,
})

const { value: newPassword } = useField<string>('newPassword')
const { value: confirmPassword } = useField<string>('confirmPassword')

const open = ref(false)
const isShowNewPassword = ref(false)
const isShowConfirmPassword = ref(false)

const showNewPassword = () => {
  isShowNewPassword.value = !isShowNewPassword.value
}

const showConfirmPassword = () => {
  isShowConfirmPassword.value = !isShowConfirmPassword.value
}

const { mutate, isPending } = useMutation({
  mutationFn: ({ userID, newPassword }: { userID: string; newPassword: string }) =>
    resetPasswordByAdmin(userID, newPassword),
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.message}`,
      })
      resetForm()
    }
  },
})

const onSubmit = handleSubmit((values) => {
  mutate({ userID, newPassword: values.newPassword })
})

const onCancelAction = () => {
  resetForm()
}
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger class="">
      <Button
        variant="outline"
        size="icon"
        title="Reset password user"
        class="rounded-md p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50"
      >
        <RotateCcwKeyIcon :size="18" />
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
          Reset Password {{ userName }}
        </AlertDialogTitle>
        <AlertDialogDescription class="text-sm leading-normal">
          Please fill in all the columns
        </AlertDialogDescription>

        <!-- FORM Area -->
        <form @submit="onSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="newPassword" class="text-sm font-medium text-foreground"
              >New password</Label
            >
            <div class="relative">
              <Input
                id="newPassword"
                :type="isShowNewPassword ? 'text' : 'password'"
                placeholder="Enter your new password"
                class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                v-model="newPassword"
              />
              <Eye
                :size="18"
                class="absolute right-3 top-3 text-slate-400 dark:text-purple-500"
                @click="showNewPassword"
                v-if="isShowNewPassword"
              />
              <EyeClosed
                :size="18"
                class="absolute right-3 top-3 text-slate-400 dark:text-purple-500"
                @click="showNewPassword"
                v-else
              />
            </div>
            <span class="text-xs text-red-400">{{ errors.newPassword }}</span>
          </div>

          <div class="space-y-2">
            <Label for="confirmPassword" class="text-sm font-medium text-foreground"
              >Confirm password</Label
            >
            <div class="relative">
              <Input
                id="confirmPassword"
                :type="isShowConfirmPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
                v-model="confirmPassword"
              />
              <Eye
                :size="18"
                class="absolute right-3 top-3 text-slate-400 dark:text-purple-500"
                @click="showConfirmPassword"
                v-if="isShowConfirmPassword"
              />
              <EyeClosed
                :size="18"
                class="absolute right-3 top-3 text-slate-400 dark:text-purple-500"
                @click="showConfirmPassword"
                v-else
              />
            </div>
            <span class="text-xs text-red-400">{{ errors.confirmPassword }}</span>
          </div>

          <Button
            size="sm"
            type="submit"
            class="w-full mt-2 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            :disabled="isPending"
            :class="isPending && 'bg-gray-500 pointer-events-none'"
          >
            <RotateCcwKeyIcon :size="18" />
            {{ isPending ? 'Please wait...' : 'Reset Password' }}
          </Button>
        </form>

        <!-- Button Area -->
        <div class="flex justify-end gap-4 w-full">
          <AlertDialogCancel
            v-if="!isPending"
            @click="onCancelAction"
            class="h-11 w-full inline-flex items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            <X :size="18" />
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
