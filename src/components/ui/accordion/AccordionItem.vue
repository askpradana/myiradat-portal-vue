<script setup lang="ts">
import { ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-vue-next'

interface Props {
  title: string
  class?: HTMLAttributes['class']
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false
})

const isOpen = ref(props.defaultOpen)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div
    data-slot="accordion-item"
    :class="cn('border-b border-border', props.class)"
  >
    <button
      @click="toggle"
      class="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-primary focus:outline-none"
      :aria-expanded="isOpen"
    >
      <span class="text-base md:text-lg">{{ title }}</span>
      <ChevronDown
        :class="cn('h-4 w-4 transition-transform duration-200', {
          'rotate-180': isOpen
        })"
      />
    </button>
    <div
      v-show="isOpen"
      class="pb-4 text-muted-foreground overflow-hidden transition-all"
    >
      <slot />
    </div>
  </div>
</template>