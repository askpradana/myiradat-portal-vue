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
import { Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteOrganization } from '@/api/organizations/deleteOrganization'

const { organizationID, nameOfOrganization } = defineProps<{
  organizationID: string
  nameOfOrganization: string
}>()

const Organizationname = ref('')
const isMatch = ref('')
const open = ref(false)

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: deleteOrganization,
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.message}`,
      })
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      queryClient.invalidateQueries({ queryKey: ['organization'] })
      open.value = false
    }
  },
  onError: (error) => {
    toast('Error', {
      description: `Failed to delete organization: ${error.message}`,
    })
  },
})

const deleteFunc = () => {
  if (Organizationname.value === nameOfOrganization) {
    mutate(organizationID)
  } else {
    isMatch.value = 'Organization name is not match!'
  }
}
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger class="">
      <Button
        variant="outline"
        size="icon"
        class="rounded-md p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50"
        title="Delete Organization"
      >
        <Trash2 :size="18" />
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
          Delete Organization
        </AlertDialogTitle>
        <AlertDialogDescription class="mb-5 text-sm leading-normal">
          Are you sure you want to delete {{ nameOfOrganization }}? <br />
          Please enter the word according to this organization name: <br />
          <div class="w-full text-center my-4">
            <span class="text-red-600 font-semibold text-xl">{{ nameOfOrganization }}</span>
          </div>
          <Input v-model="Organizationname" placeholder="Enter the word above" class="mt-2" />
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
