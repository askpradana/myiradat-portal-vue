<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="mb-12">
      <h1 class="text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight tracking-tight">
        Welcome back, {{ userStore.user?.name || 'User' }}!
      </h1>
      <p class="text-lg text-muted-foreground leading-relaxed">
        Access your services and manage your account from your dashboard.
      </p>
    </div>

    <!-- Services Section -->
    <section aria-labelledby="services-heading">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 id="services-heading" class="text-2xl font-semibold text-foreground mb-1 leading-snug tracking-tight">
            Your Services
          </h2>
          <p class="text-base text-muted-foreground">
            {{ servicesCount }} service{{ servicesCount === 1 ? '' : 's' }} available
          </p>
        </div>
        
        <div v-if="userRole === 'admin'" class="flex gap-2">
          <Button variant="outline" size="sm" @click="handleRefreshServices">
            <RefreshCw :size="16" class="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <CardServiceSkeleton v-for="n in 6" :key="n" />
      </div>

      <!-- Error State -->
      <div 
        v-else-if="error" 
        class="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-muted rounded-lg"
      >
        <AlertCircle class="h-12 w-12 text-muted-foreground mb-4" />
        <h3 class="text-xl font-semibold text-foreground mb-3 leading-snug tracking-tight">Failed to load services</h3>
        <p class="text-base text-muted-foreground text-center leading-relaxed mb-6">{{ error }}</p>
        <Button @click="handleRefreshServices" variant="outline">
          <RefreshCw :size="16" class="mr-2" />
          Try Again
        </Button>
      </div>

      <!-- Services Grid -->
      <div 
        v-else 
        class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        role="grid"
        aria-label="Available services"
      >
        <ServiceCard
          v-for="service in displayServices"
          :key="service.code"
          :service="service"
          @click="handleServiceClick"
        />
      </div>

      <!-- Empty State -->
      <EmptyServicesState 
        v-if="!isLoading && !error && displayServices.length === 0"
        :user-role="userRole"
      />
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { 
  RefreshCw, 
  AlertCircle
} from 'lucide-vue-next'

// Components
import ServiceCard from '@/components/custom/dashboard/ServiceCard.vue'
import CardServiceSkeleton from '@/components/custom/skeletons/CardServiceSkeleton.vue'
import EmptyServicesState from '@/components/custom/dashboard/EmptyServicesState.vue'

// Store and utilities
import { useUserStore } from '@/stores/userStores'
import { getUserRole, transformServiceForDisplay } from '@/lib/dashboard-utils'
import type { DashboardServiceInterface } from '@/types/dashboard'

// Store instance
const userStore = useUserStore()

// Local state
const isLoading = ref(false)
const error = ref<string | null>(null)

// Computed properties
const userRole = computed(() => getUserRole(userStore.user))


// Transform and display services
const displayServices = computed<DashboardServiceInterface[]>(() => {
  if (userStore.services && userStore.services.length > 0) {
    return userStore.services.map(transformServiceForDisplay)
  }
  return []
})

// Services count
const servicesCount = computed(() => displayServices.value.length)


// Event handlers
const handleRefreshServices = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Refresh services from the store
    await userStore.initializeAuth()
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to refresh services'
    console.error('Failed to refresh services:', err)
  } finally {
    isLoading.value = false
  }
}

const handleServiceClick = (service: DashboardServiceInterface) => {
  console.log('Service clicked:', service.name)
  
  // Track service usage (could be sent to analytics)
  // Analytics.track('service_accessed', { service_code: service.code })
}


// Initialize component
onMounted(async () => {
  if (!userStore.services) {
    await handleRefreshServices()
  }
})
</script>
