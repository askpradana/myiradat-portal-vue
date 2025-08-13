<template>
  <div class="min-h-screen bg-background">
    <!-- Header Section -->
    <header
      v-if="config.showHeader"
      class="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
    >
      <slot name="header">
        <HeaderDashboard :role-user="userRole" />
      </slot>
    </header>

    <!-- Main Content Container -->
    <main
      :class="[
        'mx-auto',
        config.maxWidth || 'max-w-7xl',
        config.padding || 'px-4 sm:px-6 lg:px-8 py-8',
      ]"
    >
      <!-- Navigation Section -->
      <nav
        v-if="config.showNavigation"
        class="mb-6"
        role="navigation"
        aria-label="Dashboard navigation"
      >
        <slot name="navigation">
          <NavigationTab
            :active-tab="activeTab"
            :available-tabs="availableTabs"
            :user-role="userRole"
            @change-tab="handleTabChange"
          />
        </slot>
      </nav>

      <!-- Content Section with Loading States -->
      <section class="relative" role="main" :aria-label="`${activeTab} content`">
        <!-- Loading Overlay -->
        <div
          v-if="isLoading"
          class="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center"
          aria-label="Loading content"
        >
          <div class="flex flex-col items-center gap-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p class="text-sm text-muted-foreground">Loading {{ activeTab }}...</p>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="flex flex-col items-center justify-center py-12 px-4"
          role="alert"
          aria-live="polite"
        >
          <div class="text-center max-w-md">
            <div class="mb-4 p-3 rounded-full bg-destructive/10 w-fit mx-auto">
              <AlertCircle class="h-6 w-6 text-destructive" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Something went wrong</h3>
            <p class="text-muted-foreground mb-4">{{ error }}</p>
            <Button @click="handleRetry" variant="outline">
              <RefreshCw class="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>

        <!-- Main Content Slot -->
        <div
          v-else
          class="space-y-6"
          :class="{
            'opacity-50 pointer-events-none': isLoading,
          }"
        >
          <slot />
        </div>
      </section>
    </main>

    <!-- Footer Section -->
    <footer v-if="$slots.footer" class="border-t mt-auto">
      <slot name="footer" />
    </footer>

    <!-- Floating Action Button -->
    <div v-if="showFab" class="fixed bottom-6 right-6 z-40">
      <slot name="fab">
        <Button
          size="lg"
          class="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
          @click="handleFabClick"
        >
          <Plus class="h-6 w-6" />
        </Button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onErrorCaptured, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Plus } from 'lucide-vue-next'

import HeaderDashboard from './HeaderDashboard.vue'
import NavigationTab from './NavigationTab.vue'

import type { DashboardTab, UserRole, DashboardLayoutConfig, TabConfig } from '@/types/dashboard'
import { getAccessibleTabs } from '@/lib/dashboard-utils'

interface Props {
  activeTab: DashboardTab
  userRole: UserRole
  config?: Partial<DashboardLayoutConfig>
  isLoading?: boolean
  error?: string | null
  showFab?: boolean
  availableTabs?: TabConfig[]
}

interface Emits {
  (e: 'tab-change', tab: DashboardTab): void
  (e: 'retry'): void
  (e: 'fab-click'): void
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({}),
  isLoading: false,
  error: null,
  showFab: false,
  availableTabs: undefined,
})

const emit = defineEmits<Emits>()

// Error boundary state
const componentError = ref<string | null>(null)

// Default configuration with user overrides
const config = computed(() => ({
  maxWidth: 'max-w-7xl',
  padding: 'px-4 sm:px-6 lg:px-8 py-8',
  showHeader: true,
  showNavigation: true,
  ...props.config,
}))

// Get accessible tabs for current user
const availableTabs = computed(() => {
  if (props.availableTabs) {
    return props.availableTabs.filter((tab) => getAccessibleTabs(props.userRole).includes(tab.id))
  }

  return getAccessibleTabs(props.userRole).map((tabId) => ({
    id: tabId,
    label: tabId.charAt(0).toUpperCase() + tabId.slice(1),
    requiresAdmin: tabId === 'users',
  }))
})

// Combined error state
const error = computed(() => props.error || componentError.value)

// Event handlers
const handleTabChange = (tab: DashboardTab) => {
  emit('tab-change', tab)
}

const handleRetry = () => {
  componentError.value = null
  emit('retry')
}

const handleFabClick = () => {
  emit('fab-click')
}

// Error boundary
onErrorCaptured((error: Error) => {
  console.error('Dashboard Layout Error:', error)
  componentError.value = error.message || 'An unexpected error occurred'
  return false
})

// Accessibility: Set focus management
onMounted(() => {
  // Set initial focus to main content when component mounts
  const mainElement = document.querySelector('main')
  if (mainElement) {
    mainElement.setAttribute('tabindex', '-1')
    mainElement.focus()
  }
})
</script>

<style scoped>
/* Ensure smooth transitions */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

/* Custom loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus styles for accessibility */
main:focus {
  outline: none;
}

/* Smooth backdrop blur transition */
.backdrop-blur {
  transition: backdrop-filter 0.2s ease-in-out;
}
</style>
