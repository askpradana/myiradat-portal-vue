<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
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
import { deleteSessionAll } from '@/api/sessions/deleteSessionAll'

const { t } = useI18n()
const BrowserName = ref('')
const isMatch = ref('')
const open = ref(false)

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: deleteSessionAll,
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.data?.message}`,
      })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      BrowserName.value = ''
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
  if (BrowserName.value === t('sessions.deleteConfirmText')) {
    mutate()
  } else {
    isMatch.value = t('sessions.deleteConfirmError')
  }
}
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger>
      <Button
        :title="t('sessions.deleteAllTitle')"
        variant="destructive"
        size="sm"
        class="hover:bg-red-500"
      >
        <Trash2 :size="12" /> {{ t('sessions.deleteAllButton') }}
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
          {{ t('sessions.deleteAllDialogTitle') }}
        </AlertDialogTitle>
        <AlertDialogDescription class="mb-5 text-sm leading-normal">
          {{ t('sessions.deleteAllConfirmMessage') }}
          <span class="font-semibold">{{ t('sessions.exceptCurrent') }}</span>? <br />
          {{ t('sessions.enterWordPrompt') }}: <br />
          <div class="w-full text-center my-4">
            <span class="text-red-600 font-semibold text-xl">{{ t('sessions.deleteConfirmText') }}</span>
          </div>
          <Input v-model="BrowserName" :placeholder="t('sessions.enterWordPlaceholder')" class="mt-2" />
          <span :class="isMatch ? 'block text-red-500 text-sm mt-4 ml-1' : 'hidden'">{{
            isMatch
          }}</span>
        </AlertDialogDescription>
        <div class="flex justify-end gap-4">
          <AlertDialogCancel
            v-if="!isPending"
            class="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            {{ t('common.actions.cancel') }}
          </AlertDialogCancel>
          <Button
            @click="deleteFunc"
            :disabled="isPending"
            class="text-white bg-red-400 hover:bg-red-500 focus:shadow-red-700 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
          >
            {{ isPending ? t('common.states.loading') : t('sessions.yesDelete') }}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
