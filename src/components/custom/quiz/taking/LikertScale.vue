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
      {
        value: 1,
        label: 'Sangat Tidak Setuju',
        description: 'Saya sama sekali tidak setuju dengan pernyataan ini',
      },
      {
        value: 2,
        label: 'Tidak Setuju',
        description: 'Saya sebagian besar tidak setuju dengan pernyataan ini',
      },
      {
        value: 3,
        label: 'Setuju',
        description: 'Saya sebagian besar setuju dengan pernyataan ini',
      },
      { value: 4, label: 'Sangat Setuju', description: 'Saya sangat setuju dengan pernyataan ini' },
    ]
  } else {
    return [
      {
        value: 1,
        label: 'Sangat Tidak Setuju',
        description: 'Saya sama sekali tidak setuju dengan pernyataan ini',
      },
      {
        value: 2,
        label: 'Tidak Setuju',
        description: 'Saya sebagian besar tidak setuju dengan pernyataan ini',
      },
      { value: 3, label: 'Netral', description: 'Saya tidak setuju maupun setuju' },
      {
        value: 4,
        label: 'Setuju',
        description: 'Saya sebagian besar setuju dengan pernyataan ini',
      },
      { value: 5, label: 'Sangat Setuju', description: 'Saya sangat setuju dengan pernyataan ini' },
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

// Helper function for accessibility labels
const getScalePosition = (value: number): string => {
  const option = defaultOptions.value.find((opt) => opt.value === value)
  return option?.label || ''
}

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
          :class="['grid gap-6', scale === 'likert4' ? 'grid-cols-4' : 'grid-cols-5 xl:gap-8']"
          :style="scale === 'likert5' ? 'grid-template-columns: repeat(5, minmax(0, 1fr))' : ''"
        >
          <div v-for="option in defaultOptions" :key="option.value" class="flex justify-center">
            <!-- Simplified Numbered Circle Only -->
            <Label
              :for="`option-${option.value}`"
              :class="[
                'w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg group border-2',
                {
                  'bg-primary text-primary-foreground border-primary shadow-lg scale-110':
                    modelValue === option.value.toString(),
                  'bg-muted text-muted-foreground border-muted hover:border-primary/50 hover:bg-primary/10 hover:text-primary':
                    modelValue !== option.value.toString(),
                  'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none': disabled,
                },
              ]"
            >
              <RadioGroupItem
                :id="`option-${option.value}`"
                :value="option.value.toString()"
                :disabled="disabled"
                :aria-label="`Option ${option.value}: ${getScalePosition(option.value)}`"
                class="sr-only"
              />
              {{ option.value }}
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
        role="radiogroup"
        :aria-labelledby="`likert-scale-${scale}`"
      >
        <!-- 4-option grid: 2x2 layout -->
        <div
          v-if="scale === 'likert4'"
          class="grid grid-cols-2 gap-3 min-h-[280px] content-center"
          role="group"
          aria-label="Response options"
        >
          <Label
            v-for="option in defaultOptions"
            :key="option.value"
            :for="`mobile-option-${option.value}`"
            :class="[
              'flex items-center justify-center border-2 rounded-xl cursor-pointer transition-all duration-200 ease-out min-h-[120px]',
              'hover:border-primary/50 hover:bg-primary/5 active:scale-95 active:opacity-80',
              'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/50',
              {
                'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25':
                  modelValue === option.value.toString(),
                'border-border bg-muted hover:border-primary/30': modelValue !== option.value.toString(),
                'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none': disabled,
              },
            ]"
          >
            <RadioGroupItem
              :id="`mobile-option-${option.value}`"
              :value="option.value.toString()"
              :disabled="disabled"
              :aria-label="`Option ${option.value}: ${getScalePosition(option.value)}`"
              class="sr-only"
            />
            <div class="text-center">
              <div
                :class="[
                  'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2 mx-auto transition-all duration-200',
                  {
                    'bg-primary-foreground text-primary': modelValue === option.value.toString(),
                    'bg-primary/20 text-foreground': modelValue !== option.value.toString(),
                  },
                ]"
              >
                {{ option.value }}
              </div>
              <div
                :class="[
                  'text-xs font-medium px-2',
                  {
                    'text-primary-foreground': modelValue === option.value.toString(),
                    'text-muted-foreground': modelValue !== option.value.toString(),
                  },
                ]"
              >
                {{ option.label }}
              </div>
            </div>
          </Label>
        </div>

        <!-- 5-option grid: safer layout -->
        <div
          v-else
          class="grid gap-3 min-h-[400px] content-center likert-5-mobile-grid"
          role="group"
          aria-label="Response options"
        >
          <Label
            v-for="(option, index) in defaultOptions"
            :key="option.value"
            :for="`mobile-option-${option.value}`"
            :class="[
              'flex items-center justify-center border-2 rounded-xl cursor-pointer transition-all duration-200 ease-out min-h-[120px]',
              'hover:border-primary/50 hover:bg-primary/5 active:scale-95 active:opacity-80',
              'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/50',
              {
                'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25':
                  modelValue === option.value.toString(),
                'border-border bg-muted hover:border-primary/30': modelValue !== option.value.toString(),
                'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none': disabled,
              },
              // Grid positioning for 5-option layout
              index === 2 ? 'col-span-2' : '',
            ]"
          >
            <RadioGroupItem
              :id="`mobile-option-${option.value}`"
              :value="option.value.toString()"
              :disabled="disabled"
              :aria-label="`Option ${option.value}: ${getScalePosition(option.value)}`"
              class="sr-only"
            />
            <div class="text-center">
              <div
                :class="[
                  'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2 mx-auto transition-all duration-200',
                  {
                    'bg-primary-foreground text-primary': modelValue === option.value.toString(),
                    'bg-primary/20 text-foreground': modelValue !== option.value.toString(),
                  },
                ]"
              >
                {{ option.value }}
              </div>
              <div
                :class="[
                  'text-xs font-medium px-2',
                  {
                    'text-primary-foreground': modelValue === option.value.toString(),
                    'text-muted-foreground': modelValue !== option.value.toString(),
                  },
                ]"
              >
                {{ option.label }}
              </div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>

    <!-- Enhanced Scale Labels (Desktop only) -->
    <div class="hidden sm:flex justify-between items-center mt-4 px-2">
      <div class="text-sm font-medium text-muted-foreground max-w-[120px] text-left">
        {{ defaultOptions[0]?.label }}
      </div>
      <div class="text-sm font-medium text-muted-foreground max-w-[120px] text-right">
        {{ defaultOptions[defaultOptions.length - 1]?.label }}
      </div>
    </div>

    <!-- Gentle Guidance -->
    <div
      v-if="required && !value"
      class="text-sm text-muted-foreground text-center flex items-center justify-center gap-2"
    ></div>

    <!-- Keyboard Hints -->
    <div class="hidden sm:flex items-center justify-center text-xs text-muted-foreground mt-2">
      <span>💡 Gunakan {{ scale === 'likert4' ? '1-4' : '1-5' }} untuk memilih pilihan</span>
    </div>
  </div>
</template>

<style scoped>
/* Optimized mobile grid layout for 5 options */
.likert-5-mobile-grid {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
}

.likert-5-mobile-grid > :nth-child(3) {
  grid-column: 1 / -1; /* Span full width for middle option */
}

/* Fallback for browsers without CSS Grid */
@supports not (display: grid) {
  .likert-5-mobile-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .likert-5-mobile-grid > * {
    flex: 0 0 45%;
    margin: 0.375rem;
  }

  .likert-5-mobile-grid > :nth-child(3) {
    flex: 0 0 90%;
  }
}

/* Hardware acceleration and optimized animations */
.group {
  transform: translateZ(0);
  will-change: transform;
}

/* Desktop circle hover effects */
.group:hover {
  transform: translateZ(0) scale(1.05);
  will-change: transform;
}

.group:hover.opacity-50 {
  transform: translateZ(0) scale(1);
  will-change: auto;
}

/* Mobile button animations */
.flex.items-center.justify-center {
  transition: transform 0.2s ease-out, background-color 0.2s ease;
  will-change: transform;
}

.flex.items-center.justify-center:active {
  transform: scale(0.98);
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .group {
    transition: border-color 200ms ease, background-color 200ms ease !important;
    will-change: auto !important;
  }

  .group:hover {
    transform: translateZ(0) scale(1) !important;
  }

  .flex.items-center.justify-center {
    transition: background-color 200ms ease !important;
    will-change: auto !important;
  }

  .flex.items-center.justify-center:active {
    transform: none !important;
  }

  /* Updated selectors for new circle sizes */
  .w-20,
  .w-14,
  .w-16 {
    transition: background-color 200ms ease, color 200ms ease !important;
  }
}
</style>
