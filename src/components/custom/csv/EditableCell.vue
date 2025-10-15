<template>
  <div class="relative">
    <Input
      :id="inputId"
      :model-value="displayValue"
      @update:model-value="handleInput"
      @blur="$emit('blur')"
      @keydown.enter="handleEnter"
      @keydown.escape="handleEscape"
      :type="type"
      :placeholder="placeholder"
      :pattern="type === 'tel' ? '[0-9]*' : undefined"
      :inputmode="type === 'tel' ? 'numeric' : undefined"
      :class="[
        'transition-colors',
        hasErrors ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
        props.className
      ]"
      :aria-invalid="hasErrors"
      :aria-describedby="hasErrors ? errorId : undefined"
      :aria-label="ariaLabel"
    />

    <!-- Error indicator -->
    <div
      v-if="hasErrors"
      class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
    >
      <AlertCircle class="w-4 h-4 text-red-500" />
    </div>

    <!-- Error message for screen readers -->
    <div
      v-if="hasErrors"
      :id="errorId"
      class="sr-only"
      role="alert"
      aria-live="polite"
    >
      {{ validationErrors.join('. ') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'

interface Props {
  modelValue: string
  field: string
  rowNumber: number
  validationErrors?: string[]
  type?: string
  placeholder?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  validationErrors: () => [],
  type: 'text',
  placeholder: '',
  className: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
  'enter': []
  'escape': []
}>()

// const inputRef = ref<HTMLInputElement>()

const inputId = computed(() => `csv-${props.field}-${props.rowNumber}`)
const errorId = computed(() => `csv-${props.field}-error-${props.rowNumber}`)
const hasErrors = computed(() => props.validationErrors.length > 0)

const ariaLabel = computed(() => {
  const fieldName = props.field.charAt(0).toUpperCase() + props.field.slice(1)
  return `Edit ${fieldName} for row ${props.rowNumber}`
})

const displayValue = computed(() => {
  // For phone fields, strip non-numeric characters for display
  if (props.type === 'tel') {
    return props.modelValue.replace(/[^0-9]/g, '')
  }
  return props.modelValue
})

const handleEnter = (event: KeyboardEvent) => {
  ;(event.target as HTMLInputElement).blur()
  emit('enter')
}

const handleEscape = (event: KeyboardEvent) => {
  ;(event.target as HTMLInputElement).blur()
  emit('escape')
}

const handleInput = (value: string | number) => {
  let processedValue = String(value)

  // For phone inputs, only allow digits
  if (props.type === 'tel') {
    processedValue = processedValue.replace(/[^0-9]/g, '')
  }

  emit('update:modelValue', processedValue)
}
</script>