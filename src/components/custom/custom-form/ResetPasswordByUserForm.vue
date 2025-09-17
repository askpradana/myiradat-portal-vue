<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@/components/ui/card'
import { useField, useForm } from 'vee-validate'
import { ResetPasswordByUserFormSchema } from '@/lib/zod-schemas/resetPasswordFormSchema'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { resetPasswordByUser } from '@/api/auth/resetPasswordByUser'
import { toast } from 'vue-sonner'
import { Eye, EyeClosed, Save, PenBox, X } from 'lucide-vue-next'
import { useMutation } from '@tanstack/vue-query'

const router = useRouter()

const validationSchema = ResetPasswordByUserFormSchema
const { handleSubmit, errors, resetForm } = useForm({
  validationSchema,
})

const { value: currentPassword } = useField<string>('currentPassword')
const { value: newPassword } = useField<string>('newPassword')
const { value: confirmPassword } = useField<string>('confirmPassword')

const isOpenEditPassword = ref(false)
const isShowCurrentPassword = ref(false)
const isShowNewPassword = ref(false)
const isShowConfirmPassword = ref(false)

const showCurrentPassword = () => {
  isShowCurrentPassword.value = !isShowCurrentPassword.value
}

const showNewPassword = () => {
  isShowNewPassword.value = !isShowNewPassword.value
}

const showConfirmPassword = () => {
  isShowConfirmPassword.value = !isShowConfirmPassword.value
}

const openEditPassword = () => {
  isOpenEditPassword.value = !isOpenEditPassword.value
}

const { mutate, isPending } = useMutation({
  mutationFn: ({ currentPasword, newPassword }: { currentPasword: string; newPassword: string }) =>
    resetPasswordByUser(currentPasword, newPassword),
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.message}`,
      })

      resetForm()
      router.push('/login')
    }
  },
})

const onSubmit = handleSubmit((values) => {
  mutate({ currentPasword: values.currentPassword, newPassword: values.newPassword })
})
</script>

<template>
  <Card class="w-full">
    <CardHeader class="space-y-1 pb-2">
      <div class="flex justify-between">
        <span>
          <CardTitle class="text-lg font-semibold text-foreground">Reset Password</CardTitle>
          <CardDescription class="text-muted-foreground">
            Enter your new credentials to reset your password
          </CardDescription>
        </span>
        <span>
          <Button
            @click="openEditPassword"
            v-if="!isOpenEditPassword"
            size="sm"
            :disabled="isPending"
          >
            <PenBox :size="18" />
            Edit password</Button
          >
          <Button
            variant="outline"
            @click="openEditPassword"
            v-else
            size="sm"
            :disabled="isPending"
          >
            <X :size="18" />
            Cancel</Button
          >
        </span>
      </div>
    </CardHeader>

    <CardContent class="space-y-6" v-if="isOpenEditPassword">
      <form @submit="onSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="currentPassword" class="text-sm font-medium text-foreground"
            >Current password</Label
          >
          <div class="relative">
            <Input
              id="currentPassword"
              :type="isShowCurrentPassword ? 'text' : 'password'"
              placeholder="Enter your current password"
              class="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
              v-model="currentPassword"
            />
            <Eye
              :size="18"
              class="absolute right-3 top-3 text-slate-400 dark:text-purple-500"
              @click="showCurrentPassword"
              v-if="isShowCurrentPassword"
            />
            <EyeClosed
              :size="18"
              class="absolute right-3 top-3 text-slate-400 dark:text-purple-500"
              @click="showCurrentPassword"
              v-else
            />
          </div>
          <span class="text-xs text-red-400">{{ errors.currentPassword }}</span>
        </div>

        <div class="space-y-2">
          <Label for="newPassword" class="text-sm font-medium text-foreground">New password</Label>
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
          <Save :size="18" />
          {{ isPending ? 'Please wait...' : 'Save' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
