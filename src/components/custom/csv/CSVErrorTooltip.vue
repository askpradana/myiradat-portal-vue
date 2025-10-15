<template>
  <div class="relative inline-block">
    <!-- Trigger element with error indicator -->
    <div
      ref="triggerRef"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @focus="showTooltip"
      @blur="hideTooltip"
      @keydown.escape="hideTooltip"
      :aria-describedby="isVisible ? tooltipId : undefined"
      class="flex items-center gap-1 cursor-help"
      tabindex="0"
      role="button"
      :aria-label="`${errors.length} validation error${errors.length !== 1 ? 's' : ''} found`"
    >
      <slot />
      <div
        class="flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium"
        :class="[
          hasErrors ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
        ]"
      >
        <AlertTriangle v-if="hasErrors" class="w-3 h-3" />
        <AlertCircle v-else class="w-3 h-3" />
      </div>
    </div>

    <!-- Tooltip content -->
    <Teleport to="body">
      <div
        v-if="isVisible"
        ref="tooltipRef"
        :id="tooltipId"
        role="tooltip"
        :style="tooltipStyle"
        class="absolute z-50 max-w-xs p-3 text-sm bg-white border border-gray-200 rounded-lg shadow-lg"
        :class="[
          hasErrors ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
        ]"
      >
        <!-- Error messages -->
        <div v-if="errors.length > 0" class="space-y-1">
          <h4 class="font-medium text-red-800 flex items-center gap-1">
            <XCircle class="w-3 h-3" />
            Validation Errors
          </h4>
          <ul class="text-red-700 space-y-0.5 text-xs">
            <li v-for="(error, index) in errors" :key="index" class="flex items-start gap-1">
              <span class="w-1 h-1 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>{{ error }}</span>
            </li>
          </ul>
        </div>

        <!-- Warning messages -->
        <div v-if="warnings && warnings.length > 0" class="space-y-1" :class="{ 'mt-3': errors.length > 0 }">
          <h4 class="font-medium text-yellow-800 flex items-center gap-1">
            <AlertTriangle class="w-3 h-3" />
            Warnings
          </h4>
          <ul class="text-yellow-700 space-y-0.5 text-xs">
            <li v-for="(warning, index) in warnings" :key="index" class="flex items-start gap-1">
              <span class="w-1 h-1 bg-yellow-600 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>{{ warning }}</span>
            </li>
          </ul>
        </div>

        <!-- Indonesian phone format help -->
        <div
          v-if="showPhoneHelp"
          class="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600"
        >
          <p class="font-medium">Indonesian Phone Format:</p>
          <p>• Must start with '0' (e.g., 08123456789)</p>
          <p>• Length: 10-13 digits</p>
          <p>• No spaces or special characters</p>
        </div>

        <!-- Tooltip arrow -->
        <div
          class="absolute w-2 h-2 bg-white border border-gray-200 transform rotate-45"
          :class="[
            hasErrors ? 'border-red-200' : 'border-yellow-200',
            arrowClass
          ]"
          :style="arrowStyle"
        ></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { AlertTriangle, AlertCircle, XCircle } from 'lucide-vue-next'

interface Props {
  errors: string[]
  warnings?: string[]
  rowNumber: number
  field?: string
}

const props = defineProps<Props>()

const isVisible = ref(false)
const triggerRef = ref<HTMLElement>()
const tooltipRef = ref<HTMLElement>()
const tooltipStyle = ref<Record<string, string>>({})
const arrowStyle = ref<Record<string, string>>({})
const arrowClass = ref('')

const tooltipId = computed(() => `tooltip-error-${props.rowNumber}-${props.field || 'general'}`)
const hasErrors = computed(() => props.errors.length > 0)
const showPhoneHelp = computed(() =>
  props.errors.some(error => error.toLowerCase().includes('phone')) ||
  props.field === 'phone'
)

let hideTimeoutId: number | null = null

const showTooltip = async () => {
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId)
    hideTimeoutId = null
  }
  isVisible.value = true
  await nextTick()
  positionTooltip()
}

const hideTooltip = () => {
  hideTimeoutId = window.setTimeout(() => {
    isVisible.value = false
  }, 150)
}

const positionTooltip = () => {
  if (!triggerRef.value || !tooltipRef.value) return

  const trigger = triggerRef.value.getBoundingClientRect()
  const tooltip = tooltipRef.value.getBoundingClientRect()
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  let top = trigger.bottom + 8
  let left = trigger.left + (trigger.width / 2) - (tooltip.width / 2)

  // Adjust horizontal position if tooltip goes outside viewport
  if (left < 8) {
    left = 8
  } else if (left + tooltip.width > viewport.width - 8) {
    left = viewport.width - tooltip.width - 8
  }

  // Adjust vertical position if tooltip goes outside viewport
  let arrowPosition = 'top'
  if (top + tooltip.height > viewport.height - 8) {
    top = trigger.top - tooltip.height - 8
    arrowPosition = 'bottom'
  }

  tooltipStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  }

  // Position arrow
  const arrowLeft = trigger.left + (trigger.width / 2) - left - 4
  if (arrowPosition === 'top') {
    arrowClass.value = '-top-1'
    arrowStyle.value = {
      left: `${Math.max(8, Math.min(arrowLeft, tooltip.width - 16))}px`
    }
  } else {
    arrowClass.value = '-bottom-1'
    arrowStyle.value = {
      left: `${Math.max(8, Math.min(arrowLeft, tooltip.width - 16))}px`
    }
  }
}

const handleResize = () => {
  if (isVisible.value) {
    positionTooltip()
  }
}

const handleScroll = () => {
  if (isVisible.value) {
    isVisible.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll, true)
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId)
  }
})
</script>