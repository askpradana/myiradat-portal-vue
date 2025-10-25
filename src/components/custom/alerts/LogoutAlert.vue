<script setup lang="ts">
import { ref } from 'vue'
import { logout } from '@/api/logout'
import { useUserStore } from '@/stores/userStores'
import { AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTrigger } from 'reka-ui'
import {
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { LogOut } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()
const isLoading = ref(false)
const open = ref(false)

const logoutFunc = async () => {
  isLoading.value = true
  try {
    const response = await logout()
    if (response.success) {
      toast('Success', {
        description: `${response?.message}`,
      })
      userStore.clearAuthData()
      router.push('/login')
      open.value = false
    } else {
      toast('Error', {
        description: `${response?.message || 'Logout failed'}`,
      })
    }
  } catch (error) {
    console.error('Logout API error:', error)
    toast('Error', {
      description: 'An unexpected error occurred. Please try again.',
    })
    userStore.clearAuthData()
    router.push('/')
    open.value = false
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger class="">
      <Button variant="ghost" size="responsive-icon" class="transition-colors hover:bg-muted/50">
        <div class="flex items-center gap-2">
          <LogOut class="w-4 h-4 text-muted-foreground shrink-0" />
          <span class="text-sm text-muted-foreground hidden sm:inline w-14 text-left">
            {{ t('buttons.logout.logout') }}
          </span>
        </div>
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
          {{ t('common.dialog.logout.title') }}
        </AlertDialogTitle>
        <AlertDialogDescription class="mb-5 text-sm leading-normal">
          {{ t('common.dialog.logout.description') }}
        </AlertDialogDescription>
        <div class="flex justify-end gap-4">
          <AlertDialogCancel
            v-if="!isLoading"
            class="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            {{ t('buttons.logout.cancel') }}
          </AlertDialogCancel>
          <Button
            @click="logoutFunc"
            :disabled="isLoading"
            class="text-white bg-red-400 hover:bg-red-500 focus:shadow-red-700 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            {{ isLoading ? t('buttons.logout.loading') : t('buttons.logout.confirm') }}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
