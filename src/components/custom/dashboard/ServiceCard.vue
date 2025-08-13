<template>
  <a
    :href="service.redirect_to"
    target="_blank"
    rel="noopener noreferrer"
    class="block group"
    @click="handleServiceClick"
  >
    <Card
      class="h-full transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 group-hover:border-primary/50 cursor-pointer overflow-hidden"
    >
      <!-- Service Image -->
      <div
        class="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden"
      >
        <div
          v-if="imageLoading"
          class="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse"
        />

        <img
          v-if="!imageError && service.icon_url"
          :src="service.icon_url"
          :alt="`${service.name} service icon`"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          @load="handleImageLoad"
          @error="handleImageError"
          :class="{ 'opacity-0': imageLoading }"
        />

        <!-- Fallback Icon when image fails -->
        <div
          v-if="imageError"
          class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10"
        >
          <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <ExternalLink :size="24" class="text-primary" />
          </div>
        </div>

        <!-- External Link Indicator -->
        <div
          class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <div
            class="w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center"
          >
            <SquareArrowOutUpRight :size="14" class="text-foreground" />
          </div>
        </div>
      </div>

      <!-- Service Info -->
      <CardContent class="p-4">
        <div class="space-y-2">
          <h3
            class="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2"
          >
            {{ service.name }}
          </h3>

          <!-- Service Code Badge -->
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground"
            >
              {{ service.code }}
            </span>

            <!-- Security Indicator -->
            <div class="flex items-center gap-1">
              <div
                :class="['w-2 h-2 rounded-full', isSecureUrl ? 'bg-green-500' : 'bg-yellow-500']"
                :title="isSecureUrl ? 'Secure HTTPS connection' : 'HTTP connection'"
              />
              <span class="text-xs text-muted-foreground">
                {{ isSecureUrl ? 'Secure' : 'HTTP' }}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </a>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { SquareArrowOutUpRight, ExternalLink } from 'lucide-vue-next'

import type { DashboardServiceInterface } from '@/types/dashboard'
import { isValidUrl } from '@/lib/dashboard-utils'

interface Props {
  service: DashboardServiceInterface
}

interface Emits {
  (e: 'click', service: DashboardServiceInterface): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Image loading state
const imageLoading = ref(true)
const imageError = ref(false)

// URL security check
const isSecureUrl = computed(() => {
  try {
    const url = new URL(props.service.redirect_to)
    return url.protocol === 'https:'
  } catch {
    return false
  }
})

// Image handling
const handleImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

const handleImageError = () => {
  imageLoading.value = false
  imageError.value = true
}

// Handle service click with validation
const handleServiceClick = (event: Event) => {
  if (!props.service.redirect_to || !isValidUrl(props.service.redirect_to)) {
    event.preventDefault()
    console.warn('Invalid or missing redirect URL for service:', props.service.name)
    return
  }

  // Track service click
  emit('click', props.service)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom animations */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.animate-pulse {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  background-size: 200px 100%;
}
</style>
