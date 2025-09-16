<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { LikertOption } from '@/types/quiz'

interface Props {
  scale: 'likert4' | 'likert5'
  value?: number | null
  options?: LikertOption[]
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  disabled: false,
  required: true,
})

const emit = defineEmits<{
  'update:value': [value: number]
}>()

// Default options if not provided
const defaultOptions = computed((): LikertOption[] => {
  if (props.options) return props.options

  if (props.scale === 'likert4') {
    return [
      { value: 1, label: 'Strongly Disagree', description: 'I completely disagree with this statement' },
      { value: 2, label: 'Disagree', description: 'I mostly disagree with this statement' },
      { value: 3, label: 'Agree', description: 'I mostly agree with this statement' },
      { value: 4, label: 'Strongly Agree', description: 'I completely agree with this statement' },
    ]
  } else {
    return [
      { value: 1, label: 'Strongly Disagree', description: 'I completely disagree with this statement' },
      { value: 2, label: 'Disagree', description: 'I mostly disagree with this statement' },
      { value: 3, label: 'Neutral', description: 'I neither agree nor disagree' },
      { value: 4, label: 'Agree', description: 'I mostly agree with this statement' },
      { value: 5, label: 'Strongly Agree', description: 'I completely agree with this statement' },
    ]
  }
})

const modelValue = computed({
  get: () => props.value?.toString() || '',
  set: (val: string) => {
    if (val) {
      emit('update:value', parseInt(val))
    }
  },
})

// Event source tracking to prevent duplicates
let lastEventSource = ''
let lastEventTime = 0
const DEDUP_THRESHOLD = 50 // 50ms

const handleValueChange = (value: string, source = 'click') => {
  if (value && !props.disabled) {
    const now = Date.now()

    // Prevent rapid duplicate events from different sources
    if (source !== lastEventSource && now - lastEventTime < DEDUP_THRESHOLD) {
      return
    }

    const numValue = parseInt(value)
    lastEventSource = source
    lastEventTime = now
    emit('update:value', numValue)
  }
}

// Keyboard support for number keys 1-5
const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  const key = event.key
  const numKey = parseInt(key)

  // Check if it's a valid number key for the current scale
  const maxOptions = props.scale === 'likert4' ? 4 : 5
  if (numKey >= 1 && numKey <= maxOptions) {
    event.preventDefault()
    handleValueChange(numKey.toString(), 'keyboard')
  }
}

// Add/remove keyboard listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Desktop Layout -->
    <div class="hidden sm:block">
      <RadioGroup
        :model-value="modelValue"
        @update:model-value="(value: string) => handleValueChange(value, 'click')"
        :disabled="disabled"
        class="space-y-0"
      >
        <div
          :class="[
            'grid gap-3',
            scale === 'likert4' ? 'grid-cols-4' : 'grid-cols-5 xl:gap-4'
          ]"
          :style="scale === 'likert5' ? 'grid-template-columns: repeat(5, minmax(0, 1fr))' : ''"
        >
          <div
            v-for="option in defaultOptions"
            :key="option.value"
            class="space-y-2"
          >
            <!-- Option Card -->
            <Label
              :for="`option-${option.value}`"
              :class="[
                'flex flex-col items-center border-2 rounded-lg cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-lg justify-center group',
                scale === 'likert5' ? 'p-3 min-h-[130px] text-center' : 'p-4 min-h-[140px]',
                {
                  'border-primary bg-primary/10 shadow-md': modelValue === option.value.toString(),
                  'border-border hover:border-primary/30': modelValue !== option.value.toString(),
                  'opacity-50 cursor-not-allowed': disabled,
                }
              ]"
            >
              <div class="flex items-center space-x-2 mb-3">
                <RadioGroupItem
                  :id="`option-${option.value}`"
                  :value="option.value.toString()"
                  :disabled="disabled"
                />
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200',
                    {
                      'bg-primary text-primary-foreground shadow-sm': modelValue === option.value.toString(),
                      'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary': modelValue !== option.value.toString(),
                    }
                  ]"
                >
                  {{ option.value }}
                </div>
              </div>

              <div class="text-center flex-1 flex flex-col justify-center">
                <div
                  :class="[
                    'font-semibold mb-1',
                    scale === 'likert5' ? 'text-xs' : 'text-sm mb-2'
                  ]"
                >
                  {{ option.label }}
                </div>
                <div
                  v-if="option.description"
                  :class="[
                    'text-muted-foreground leading-tight',
                    scale === 'likert5' ? 'text-[10px]' : 'text-xs leading-relaxed'
                  ]"
                >
                  {{ option.description }}
                </div>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>

    <!-- Mobile Layout -->
    <div class="sm:hidden">
      <RadioGroup
        :model-value="modelValue"
        @update:model-value="(value: string) => handleValueChange(value, 'click')"
        :disabled="disabled"
        class="space-y-3"
      >
        <div
          v-for="option in defaultOptions"
          :key="option.value"
          class="space-y-0"
        >
          <Label
            :for="`mobile-option-${option.value}`"
            :class="[
              'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md',
              {
                'border-primary bg-primary/10 shadow-sm': modelValue === option.value.toString(),
                'border-border hover:border-primary/30': modelValue !== option.value.toString(),
                'opacity-50 cursor-not-allowed': disabled,
              }
            ]"
          >
            <div class="flex items-center space-x-3 flex-1">
              <RadioGroupItem
                :id="`mobile-option-${option.value}`"
                :value="option.value.toString()"
                :disabled="disabled"
              />

              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-200',
                  {
                    'bg-primary text-primary-foreground shadow-sm': modelValue === option.value.toString(),
                    'bg-muted text-muted-foreground': modelValue !== option.value.toString(),
                  }
                ]"
              >
                {{ option.value }}
              </div>

              <div class="flex-1">
                <div class="text-sm font-medium">
                  {{ option.label }}
                </div>
                <div
                  v-if="option.description"
                  class="text-xs text-muted-foreground mt-1"
                >
                  {{ option.description }}
                </div>
              </div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>

    <!-- Scale Labels (Desktop only) -->
    <div class="hidden sm:flex justify-between text-xs text-muted-foreground px-4">
      <span>{{ defaultOptions[0]?.label }}</span>
      <span>{{ defaultOptions[defaultOptions.length - 1]?.label }}</span>
    </div>

    <!-- Gentle Guidance -->
    <div
      v-if="required && !value"
      class="text-sm text-muted-foreground text-center flex items-center justify-center gap-2"
    >
      <span>Select your response above</span>
    </div>

    <!-- Keyboard Hints -->
    <div class="hidden sm:flex items-center justify-center text-xs text-muted-foreground mt-2">
      <span>💡 Use number keys {{ scale === 'likert4' ? '1-4' : '1-5' }} for quick selection</span>
    </div>
  </div>
</template>