<script setup lang="ts">
import { ref, computed } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import { Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteUser } from '@/api/users/deleteUser'
import BaseConfirmationAlert from './BaseConfirmationAlert.vue'

const { userID, nameOfUser } = defineProps<{
  userID: string
  nameOfUser: string
}>()

const username = ref('')
const isMatch = ref('')
const open = ref(false)

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: deleteUser,
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.message}`,
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      open.value = false
      username.value = ''
      isMatch.value = ''
    }
  },
  onError: (error) => {
    toast('Error', {
      description: `Failed to delete user: ${error.message}`,
    })
  },
})

const deleteFunc = () => {
  if (username.value === nameOfUser) {
    mutate(userID)
  } else {
    isMatch.value = 'Username is not match!'
  }
}

const alertConfig = computed(() => ({
  title: 'Delete User',
  confirmText: 'Yes, delete',
  cancelText: 'Cancel',
  confirmVariant: 'destructive' as const,
  showCancel: true
}))

const isDeleteDisabled = computed(() => username.value !== nameOfUser)
</script>

<template>
  <BaseConfirmationAlert
    v-model="open"
    :config="alertConfig"
    :is-loading="isPending"
    :disabled="isDeleteDisabled"
    @confirm="deleteFunc"
  >
    <template #trigger>
      <Button
        variant="outline"
        size="icon"
        title="Delete this user"
        class="rounded-md p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 :size="18" />
      </Button>
    </template>

    <template #description>
      Are you sure you want to delete {{ nameOfUser }}? <br />
      Please enter the word according to this username: <br />
      <div class="w-full text-center my-4">
        <span class="text-red-600 font-semibold text-xl">{{ nameOfUser }}</span>
      </div>
    </template>

    <template #content>
      <Input v-model="username" placeholder="Enter the word above" class="mt-2" />
      <span :class="isMatch ? 'block text-red-500 text-sm mt-4 ml-1' : 'hidden'">{{
        isMatch
      }}</span>
    </template>
  </BaseConfirmationAlert>
</template>