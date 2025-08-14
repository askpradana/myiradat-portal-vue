<template>
  <div 
    :class="cn('relative inline-block', props.class)"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <!-- Loading Skeleton -->
    <div
      v-if="isLoading && !avatarUrl"
      :class="cn(
        'absolute inset-0 rounded-full bg-muted animate-pulse',
        'flex items-center justify-center'
      )"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <div class="w-1/2 h-1/2 rounded-full bg-muted-foreground/20"></div>
    </div>

    <!-- Avatar Image -->
    <img
      v-if="avatarUrl"
      ref="imageRef"
      :src="avatarUrl"
      :alt="alt"
      :width="size"
      :height="size"
      :class="cn(
        'rounded-full object-cover transition-opacity duration-300',
        isLoading ? 'opacity-50' : 'opacity-100',
        'border-2 border-background shadow-sm'
      )"
      :style="{ width: `${size}px`, height: `${size}px` }"
      :loading="lazy ? 'lazy' : 'eager'"
      @load="handleImageLoad"
      @error="handleImageError"
    />

    <!-- Error State with Retry -->
    <div
      v-if="error && !avatarUrl"
      :class="cn(
        'absolute inset-0 rounded-full bg-muted',
        'flex flex-col items-center justify-center text-muted-foreground',
        'border-2 border-border cursor-pointer hover:bg-muted/80 transition-colors'
      )"
      :style="{ width: `${size}px`, height: `${size}px` }"
      @click="handleRetry"
      :title="retryOnError ? 'Click to retry' : error"
    >
      <div v-if="size >= 48" class="text-center">
        <div class="text-xs mb-1">⚠️</div>
        <div v-if="retryOnError" class="text-xs">Retry</div>
      </div>
      <div v-else class="text-xs">⚠️</div>
    </div>

    <!-- Loading Indicator Overlay -->
    <div
      v-if="isLoading && avatarUrl"
      class="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center"
    >
      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { cn } from '@/lib/utils'
import { useAvatar } from '@/composables/useAvatar'
import type { DynamicAvatarProps, PersonMetadata, CompanyMetadata } from '@/types/avatar'

interface Props extends DynamicAvatarProps {
  metadata?: PersonMetadata | CompanyMetadata
}

const props = withDefaults(defineProps<Props>(), {
  size: 48,
  fallbackSrc: '',
  lazy: true,
  retryOnError: true,
  class: ''
})

const imageRef = ref<HTMLImageElement>()
const imageLoaded = ref(false)

const { avatarUrl, isLoading, error, retry, refresh } = useAvatar(
  props.identifier,
  {
    type: props.type,
    fallbackUrl: props.fallbackSrc,
    metadata: props.metadata,
    retryOnError: props.retryOnError
  }
)

const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  if (props.retryOnError) {
    // Don't automatically retry on image load errors
    // Let the user click to retry instead
    console.warn(`Failed to load avatar image: ${avatarUrl.value}`)
  }
}

const handleRetry = async () => {
  if (props.retryOnError) {
    imageLoaded.value = false
    await retry()
  }
}

// Intersection Observer for lazy loading
let intersectionObserver: IntersectionObserver | null = null

const setupLazyLoading = () => {
  if (!props.lazy || !imageRef.value) return

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Avatar will load automatically when identifier is set
          intersectionObserver?.disconnect()
        }
      })
    },
    { threshold: 0.1 }
  )

  if (imageRef.value) {
    intersectionObserver.observe(imageRef.value.parentElement!)
  }
}

onMounted(() => {
  if (props.lazy) {
    setupLazyLoading()
  }
})

// Cleanup observer
watch(() => props.identifier, () => {
  imageLoaded.value = false
}, { immediate: true })

// Expose refresh method for parent components
defineExpose({
  refresh,
  retry
})
</script>