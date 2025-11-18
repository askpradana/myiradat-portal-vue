<template>
  <div class="block opacity-60 cursor-not-allowed touch-manipulation">
    <Card
      class="h-full transition-all duration-300 ease-out overflow-hidden min-h-[160px] sm:min-h-[200px] border-muted/50"
    >
      <!-- Service Image with Disabled Overlay -->
      <div
        class="aspect-video bg-gradient-to-br from-background to-muted/10 relative overflow-hidden"
      >
        <!-- Disabled overlay -->
        <div class="absolute inset-0 bg-background/40 backdrop-blur-[0.5px]" />

        <div
          v-if="imageLoading"
          class="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse"
        />

        <img
          v-if="!imageError && service.icon_url"
          :src="service.icon_url"
          :alt="`${service.name} service icon`"
          class="w-full h-full object-contain p-4 grayscale-[0.7] opacity-80"
          @load="handleImageLoad"
          @error="handleImageError"
          :class="{ 'opacity-0': imageLoading }"
        />

        <!-- Fallback Icon when image fails -->
        <div
          v-if="imageError"
          class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/20"
        >
          <div class="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
            <ExternalLink :size="24" class="text-muted-foreground" />
          </div>
        </div>

        <!-- Lock Indicator -->
        <div class="absolute top-3 right-3">
          <div
            class="w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center"
            :title="'This service is not yet available for your account'"
          >
            <Lock :size="14" class="text-muted-foreground" />
          </div>
        </div>
      </div>

      <!-- Service Info -->
      <CardContent class="p-4">
        <div class="space-y-2">
          <h3 class="font-semibold text-muted-foreground line-clamp-2">
            {{ service.name }}
          </h3>

          <!-- Service Code Badge and Status -->
          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground"
            >
              {{ service.code }}
            </span>
          </div>

          <!-- Optional description for why it's not available -->
          <p v-if="showDescription" class="text-xs text-muted-foreground/80 mt-2">
            {{ descriptionText }}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Lock } from 'lucide-vue-next'

import type { DashboardServiceInterface } from '@/types/dashboard'

interface Props {
  service: DashboardServiceInterface
  status?: 'coming-soon' | 'request-access' | 'contact-admin'
  showDescription?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  status: 'coming-soon',
  showDescription: false,
})

// Image loading state
const imageLoading = ref(true)
const imageError = ref(false)

// Description text based on status
const descriptionText = computed(() => {
  switch (props.status) {
    case 'request-access':
      return 'Contact your administrator to request access to this service.'
    case 'contact-admin':
      return 'This service requires special permissions. Contact your admin.'
    default:
      return 'This service will be available for your account soon.'
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
