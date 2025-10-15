<template>
  <div class="relative">
    <Select
      :model-value="modelValue"
      @update:model-value="(value: any) => $emit('update:modelValue', String(value || ''))"
    >
      <SelectTrigger
        :id="selectId"
        :class="[
          'transition-colors',
          hasErrors ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
          props.className
        ]"
        :aria-invalid="hasErrors"
        :aria-describedby="hasErrors ? errorId : undefined"
        :aria-label="ariaLabel"
      >
        <SelectValue :placeholder="placeholder" />

        <!-- Error indicator -->
        <div
          v-if="hasErrors"
          class="absolute inset-y-0 right-8 flex items-center pr-1 pointer-events-none"
        >
          <AlertCircle class="w-4 h-4 text-red-500" />
        </div>
      </SelectTrigger>

      <SelectContent>
        <SelectItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
  field: string
  rowNumber: number
  options: SelectOption[]
  validationErrors?: string[]
  placeholder?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  validationErrors: () => [],
  placeholder: 'Select option',
  className: ''
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectId = computed(() => `csv-${props.field}-${props.rowNumber}`)
const errorId = computed(() => `csv-${props.field}-error-${props.rowNumber}`)
const hasErrors = computed(() => props.validationErrors.length > 0)

const ariaLabel = computed(() => {
  const fieldName = props.field.charAt(0).toUpperCase() + props.field.slice(1)
  return `Select ${fieldName} for row ${props.rowNumber}`
})
</script>