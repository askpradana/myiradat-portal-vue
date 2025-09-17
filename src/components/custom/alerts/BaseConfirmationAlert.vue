<script setup lang="ts">
import { computed } from 'vue'
import { AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTrigger } from 'reka-ui'
import {
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface AlertConfig {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  showCancel?: boolean
}

interface Props {
  config: AlertConfig
  isLoading?: boolean
  disabled?: boolean
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  disabled: false,
  modelValue: false,
  config: () => ({
    title: 'Confirm Action',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'default',
    size: 'default',
    showCancel: true
  })
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  open.value = false
}

const confirmButtonClass = computed(() => {
  const baseClass = 'inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]'

  switch (props.config.confirmVariant) {
    case 'destructive':
      return `${baseClass} text-white bg-red-400 hover:bg-red-500 focus:shadow-red-700`
    case 'outline':
      return `${baseClass} border border-input bg-background hover:bg-accent hover:text-accent-foreground`
    case 'secondary':
      return `${baseClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`
    case 'ghost':
      return `${baseClass} hover:bg-accent hover:text-accent-foreground`
    default:
      return `${baseClass} bg-primary text-primary-foreground hover:bg-primary/90`
  }
})

const cancelButtonClass = 'text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-md px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]'
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger>
      <slot name="trigger">
        <Button variant="outline" size="icon">
          <slot name="trigger-icon" />
        </Button>
      </slot>
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="bg-white/80 dark:bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
      />
      <AlertDialogContent
        class="z-[100] text-sm data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
      >
        <AlertDialogTitle class="text-black dark:text-white m-0 text-[17px] font-semibold">
          {{ config.title }}
        </AlertDialogTitle>

        <AlertDialogDescription
          v-if="config.description || $slots.description"
          class="mb-5 text-sm leading-normal"
        >
          <slot name="description">
            {{ config.description }}
          </slot>
        </AlertDialogDescription>

        <!-- Custom content slot for forms or additional content -->
        <div v-if="$slots.content" class="mb-4">
          <slot name="content" />
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end gap-4">
          <AlertDialogCancel
            v-if="config.showCancel && !isLoading"
            @click="handleCancel"
            :class="cancelButtonClass"
          >
            {{ config.cancelText }}
          </AlertDialogCancel>

          <Button
            @click="handleConfirm"
            :disabled="disabled || isLoading"
            :class="confirmButtonClass"
          >
            <slot name="confirm-content">
              {{ isLoading ? 'Please wait...' : config.confirmText }}
            </slot>
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>