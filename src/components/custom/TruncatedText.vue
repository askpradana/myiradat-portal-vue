<template>
  <div>
    <!-- Truncated text -->
    <p
      :class="[
        textClass,
        {
          'line-clamp-3 md:line-clamp-none': !showFull && isTruncatable,
        },
      ]"
    >
      {{ text }}
    </p>

    <!-- Read more/less toggle -->
    <button
      v-if="isTruncatable"
      @click="toggleShowFull"
      class="text-sm text-primary hover:text-primary/80 mt-1 font-medium transition-colors"
    >
      {{ showFull ? 'Read less' : 'Read more' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  text: string
  maxLength?: number
  textClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 120,
  textClass: 'text-sm text-muted-foreground leading-relaxed',
})

const showFull = ref(false)

const isTruncatable = computed(() => {
  return props.text.length > props.maxLength
})

const toggleShowFull = () => {
  showFull.value = !showFull.value
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .transition-colors {
    transition: none;
  }
}
</style>