<template>
  <div class="flex gap-2 justify-center">
    <div v-for="(digit, index) in digits" :key="index" class="relative">
      <input
        :ref="
          (el) => {
            if (el) inputRefs[index] = el as HTMLInputElement
          }
        "
        v-model="digits[index]"
        type="text"
        maxlength="1"
        :class="[
          'w-12 h-12 text-center text-lg font-semibold border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
          {
            'border-input bg-background': !isFocused[index],
            'border-primary bg-primary/5': isFocused[index],
            'border-destructive': hasError,
          },
        ]"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @focus="handleFocus(index)"
        @blur="handleBlur(index)"
        @paste="handlePaste"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  length?: number
  modelValue?: string
  hasError?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'complete', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  modelValue: '',
  hasError: false,
})

const emit = defineEmits<Emits>()

const digits = ref<string[]>(new Array(props.length).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])
const isFocused = ref<boolean[]>(new Array(props.length).fill(false))

// Initialize with modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const valueArray = newValue.split('').slice(0, props.length)
      digits.value = [...valueArray, ...new Array(props.length - valueArray.length).fill('')]
    }
  },
  { immediate: true },
)

// Watch digits for changes
watch(
  digits,
  (newDigits) => {
    const value = newDigits.join('')
    emit('update:modelValue', value)

    if (value.length === props.length) {
      emit('complete', value)
    }
  },
  { deep: true },
)

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.toUpperCase()

  // Only allow letters and numbers
  if (!/^[A-Z0-9]*$/.test(value)) {
    digits.value[index] = ''
    return
  }

  digits.value[index] = value

  // Move to next input if value is entered
  if (value && index < props.length - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    digits.value[index - 1] = ''
    nextTick(() => {
      inputRefs.value[index - 1]?.focus()
    })
  }
}

const handleFocus = (index: number) => {
  isFocused.value[index] = true
}

const handleBlur = (index: number) => {
  isFocused.value[index] = false
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text/plain') || ''
  const alphanumeric = pastedData.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, props.length)

  if (alphanumeric.length > 0) {
    const alphanumericArray = alphanumeric.split('')
    digits.value = [...alphanumericArray, ...new Array(props.length - alphanumericArray.length).fill('')]

    // Focus the next empty input or the last one
    const nextIndex = Math.min(alphanumeric.length, props.length - 1)
    nextTick(() => {
      inputRefs.value[nextIndex]?.focus()
    })
  }
}
</script>
