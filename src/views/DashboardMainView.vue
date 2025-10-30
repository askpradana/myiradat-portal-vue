<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <!-- <div class="mb-8 sm:mb-12">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 leading-tight tracking-tight">
        {{ t('dashboard.welcome', { name: userStore.user?.name || t('dashboard.defaultUser') }) }}
      </h1>
      <p class="text-base sm:text-lg text-muted-foreground leading-relaxed">
        {{ t('dashboard.description') }}
      </p>
    </div> -->

    <!-- Services Section -->
    <section aria-labelledby="services-heading">
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0"
      >
        <div>
          <h2
            id="services-heading"
            class="text-xl sm:text-2xl font-semibold text-foreground mb-1 leading-snug tracking-tight"
          >
            {{ t('dashboard.services.title') }}
          </h2>
          <p class="text-sm sm:text-base text-muted-foreground">
            {{ servicesCount }} accessible • {{ lockedServicesCount }} locked • {{ totalServicesCount }} total
          </p>
        </div>

        <div v-if="userRole === 'admin'" class="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            @click="handleRefreshServices"
            class="w-full sm:w-auto h-10 sm:h-auto"
          >
            <RefreshCw :size="16" class="mr-2" />
            {{ t('common.actions.refresh') }}
          </Button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <CardServiceSkeleton v-for="n in 6" :key="n" />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-muted rounded-lg"
      >
        <AlertCircle class="h-12 w-12 text-muted-foreground mb-4" />
        <h3 class="text-xl font-semibold text-foreground mb-3 leading-snug tracking-tight">
          {{ t('dashboard.services.failedToLoad') }}
        </h3>
        <p class="text-base text-muted-foreground text-center leading-relaxed mb-6">{{ error }}</p>
        <Button @click="handleRefreshServices" variant="outline">
          <RefreshCw :size="16" class="mr-2" />
          {{ t('dashboard.services.tryAgain') }}
        </Button>
      </div>

      <!-- Comprehensive Services Grid -->
      <div v-else>
        <!-- Accessible Services Section -->
        <div v-if="displayServices.length > 0" class="mb-8">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-foreground mb-1 flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              Available Services
              <span class="text-sm font-normal text-muted-foreground">({{ servicesCount }})</span>
            </h3>
            <p class="text-sm text-muted-foreground">Services you have access to and can use immediately</p>
          </div>

          <div
            class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            role="grid"
            aria-label="Accessible services grid"
          >
            <ServiceCard
              v-for="service in displayServices"
              :key="service.code"
              :service="service"
              @click="handleServiceClick"
            />
          </div>
        </div>

        <!-- Locked Services Section -->
        <div v-if="displayLockedServices.length > 0" class="mb-8">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-foreground mb-1 flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-orange-500"></div>
              Additional Services
              <span class="text-sm font-normal text-muted-foreground">({{ lockedServicesCount }})</span>
            </h3>
            <p class="text-sm text-muted-foreground">Services available in our platform that require additional access</p>
          </div>

          <div
            class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            role="grid"
            aria-label="Additional services grid"
          >
            <AvailableServiceCard
              v-for="service in displayLockedServices"
              :key="`locked-${service.code}`"
              :service="service"
              :status="userRole === 'admin' ? 'contact-admin' : 'request-access'"
              :show-description="true"
            />
          </div>
        </div>

        <!-- Empty State -->
        <EmptyServicesState
          v-if="displayServices.length === 0 && displayLockedServices.length === 0"
          :user-role="userRole"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle } from 'lucide-vue-next'

// Components
import ServiceCard from '@/components/custom/dashboard/ServiceCard.vue'
import AvailableServiceCard from '@/components/custom/dashboard/AvailableServiceCard.vue'
import CardServiceSkeleton from '@/components/custom/skeletons/CardServiceSkeleton.vue'
import EmptyServicesState from '@/components/custom/dashboard/EmptyServicesState.vue'

// Store and utilities
import { useUserStore } from '@/stores/userStores'
import { getUserRole, transformServiceForDisplay } from '@/lib/dashboard-utils'
import type { DashboardServiceInterface } from '@/types/dashboard'

// Store instance
const { t } = useI18n()
const userStore = useUserStore()

// Local state
const isLoading = ref(false)
const error = ref<string | null>(null)

// Computed properties
const userRole = computed(() => getUserRole(userStore.user))

// Transform and display accessible services
const displayServices = computed<DashboardServiceInterface[]>(() => {
  if (userStore.services && userStore.services.length > 0) {
    return userStore.services.map(transformServiceForDisplay)
  }
  return []
})

// Transform and filter locked services (exclude services user already has access to)
const displayLockedServices = computed<DashboardServiceInterface[]>(() => {
  if (!userStore.availableServices || userStore.availableServices.length === 0) {
    return []
  }

  // Get codes of already accessible services to filter out duplicates
  const activeServiceCodes = new Set(displayServices.value.map(service => service.code))

  // Filter out services that user already has access to
  const lockedServices = userStore.availableServices.filter(
    service => !activeServiceCodes.has(service.code)
  )

  return lockedServices.map(transformServiceForDisplay)
})

// All services combined for comprehensive display
const allAvailableServices = computed<DashboardServiceInterface[]>(() => {
  return [...displayServices.value, ...displayLockedServices.value]
})

// Services count
const servicesCount = computed(() => displayServices.value.length)
const lockedServicesCount = computed(() => displayLockedServices.value.length)
const totalServicesCount = computed(() => allAvailableServices.value.length)

// Event handlers
const handleRefreshServices = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Services are already available from auth initialization
    // This refresh just provides visual feedback to the user

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))
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
