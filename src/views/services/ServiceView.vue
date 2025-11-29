<template>
  <div v-if="isLoading" class="min-h-screen bg-background flex items-center justify-center">
    <div class="text-center">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-muted-foreground">Loading service...</p>
    </div>
  </div>

  <div v-else-if="error" class="min-h-screen bg-background flex items-center justify-center">
    <div class="text-center max-w-md mx-auto px-4">
      <h1 class="text-2xl font-bold text-foreground mb-4">Service Not Found</h1>
      <p class="text-muted-foreground mb-6">{{ error?.message }}</p>
      <Button @click="goHome" variant="outline">
        Go Back Home
      </Button>
    </div>
  </div>

  <ServicePageLayout
    v-else-if="service"
    :service="service"
    :icon-url="service.icon"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ServicePageLayout from '@/components/custom/navigation/ServicePageLayout.vue'
import { Button } from '@/components/ui/button'
import { useServicesData } from '@/composables/services/useServicesData'

// Define error types for better type safety
interface ServiceError {
  type: 'NOT_FOUND' | 'INVALID_URL' | 'LOADING_ERROR'
  message: string
  code?: string
}

const route = useRoute()
const router = useRouter()
const { getServiceBySlug, isLoading } = useServicesData()

const serviceSlug = computed(() => route.params.slug as string)

const service = computed(() => {
  if (!serviceSlug.value) return null
  return getServiceBySlug(serviceSlug.value)
})

const error = computed<ServiceError | null>(() => {
  if (!serviceSlug.value) {
    return {
      type: 'INVALID_URL',
      message: 'Invalid service URL',
      code: 'INVALID_SLUG'
    }
  }
  if (!service.value) {
    return {
      type: 'NOT_FOUND',
      message: `Service "${serviceSlug.value}" not found`,
      code: 'SERVICE_NOT_FOUND'
    }
  }
  return null
})

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  if (error.value) {
    console.error('Service error:', {
      type: error.value.type,
      message: error.value.message,
      code: error.value.code,
      slug: serviceSlug.value
    })
  }
})
</script>