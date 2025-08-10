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
import { Unlink } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { unlinkService } from '@/api/services/unlinkService'

const { userID, codeService, nameOfService } = defineProps<{
  userID: string
  nameOfService: string
  codeService: string
}>()

const serviceName = ref('')
const isMatch = ref('')
const open = ref(false)

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: unlinkService,
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.message}`,
      })
      queryClient.invalidateQueries({ queryKey: ['services', userID] })
      open.value = false
    }
  },
  onError: (error) => {
    toast('Error', {
      description: `Failed to unlink service: ${error.message}`,
    })
  },
})

const unlinkFunc = () => {
  if (serviceName.value === nameOfService) {
    mutate({ userID, codeService })
  } else {
    isMatch.value = 'service name is not match!'
  }
}
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger class="">
      <Button
        class="px-4 rounded hover:bg-red-500 dark:hover:bg-red-500"
        variant="destructive"
        size="sm"
      >
        <Unlink :size="18" /> Unlink
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
          Unlink Service
        </AlertDialogTitle>
        <AlertDialogDescription class="mb-5 text-sm leading-normal">
          Are you sure you want to unlink this user from
          <span class="font-semibold"> {{ nameOfService }}</span> service? <br /><br />
          Please enter the word according to this service name: <br />
          <div class="w-full text-center my-4">
            <span class="text-red-600 font-semibold">{{ nameOfService }}</span>
          </div>
          <Input v-model="serviceName" placeholder="Enter the word above" class="mt-2" />
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
            @click="unlinkFunc"
            :disabled="isPending"
            class="text-white bg-red-400 hover:bg-red-500 focus:shadow-red-700 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            {{ isPending ? 'Please wait...' : 'Yes, unlink' }}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
