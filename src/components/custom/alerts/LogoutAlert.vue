<script setup lang="ts">
import { ref } from 'vue'
import { logout } from '@/api/logout'
import { useUserStore } from '@/stores/userStores'
import { AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTrigger } from 'reka-ui'
import {
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { LogOut } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const userStore = useUserStore()
const router = useRouter()
const isLoading = ref(false)

const logoutFunc = async () => {
  isLoading.value = true
  const response = await logout()

  if (response.success) {
    toast('Success', {
      description: `${response?.message}`,
    })
    userStore.clearAuthData()
    router.push('/')
  }
  isLoading.value = false
}
</script>

<template>
  <AlertDialogRoot>
    <AlertDialogTrigger class="">
      <Button variant="outline" size="icon">
        <LogOut class="w-4 h-4" />
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
          Logout
        </AlertDialogTitle>
        <AlertDialogDescription class="mb-5 text-sm leading-normal">
          Are you sure want to end this session?
        </AlertDialogDescription>
        <div class="flex justify-end gap-4">
          <AlertDialogCancel
            class="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
            :class="isLoading ? 'hidden' : ''"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            class="text-white bg-red-400 hover:bg-red-500 focus:shadow-red-700 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
            @click="logoutFunc"
          >
            {{ isLoading ? 'Please wait...' : 'Yes, end session' }}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
