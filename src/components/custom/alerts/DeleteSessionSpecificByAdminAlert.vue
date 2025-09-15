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
import { MonitorX } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteSessionSpesificByAdmin } from '@/api/sessions/deleteSessionSpecificByAdmin'

const { nameOfUser, userID } = defineProps<{
  nameOfUser: string
  userID: string
}>()

const userNameInput = ref('')
const isMatch = ref('')
const open = ref(false)

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: deleteSessionSpesificByAdmin,
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.data?.message}`,
      })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      userNameInput.value = ''
      isMatch.value = ''
      open.value = false
    }
  },
  onError: (error) => {
    toast('Error', {
      description: `Failed to delete session: ${error.message}`,
    })
  },
})

const deleteFunc = () => {
  if (userNameInput.value === nameOfUser) {
    mutate(userID)
  } else {
    isMatch.value = 'Term is not match! Pay attention to uppercase and lowercase letters.'
  }
}
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger>
      <Button
        variant="outline"
        size="icon"
        class="rounded-md p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50"
        title="Delete this session"
      >
        <MonitorX :size="12" />
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
          Delete Session
        </AlertDialogTitle>
        <AlertDialogDescription class="mb-5 text-sm leading-normal">
          Are you sure you want to delete all session from this user? <br />
          Please enter the word according to this browser name: <br />
          <div class="w-full text-center my-4">
            <span class="text-red-600 font-semibold text-xl">{{ nameOfUser }}</span>
          </div>
          <Input v-model="userNameInput" placeholder="Enter the word above" class="mt-2" />
          <span :class="isMatch ? 'block text-red-500 text-sm mt-4 ml-1' : 'hidden'">{{
            isMatch
          }}</span>
        </AlertDialogDescription>
        <div class="flex justify-end gap-4">
          <AlertDialogCancel
            v-if="!isPending"
            class="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            @click="deleteFunc"
            :disabled="isPending"
            class="text-white bg-red-400 hover:bg-red-500 focus:shadow-red-700 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            {{ isPending ? 'Please wait...' : 'Yes, delete' }}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
