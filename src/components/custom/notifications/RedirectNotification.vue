<template>
  <Alert v-if="showNotification" :variant="variant" class="mb-4">
    <component :is="getIcon()" class="h-4 w-4" />
    <AlertTitle>{{ title }}</AlertTitle>
    <AlertDescription class="flex items-center justify-between">
      <span>{{ message }}</span>
      <Button @click="dismiss" variant="ghost" size="sm" class="ml-2 h-auto p-1">
        <X class="h-3 w-3" />
      </Button>
    </AlertDescription>
  </Alert>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { InfoIcon, AlertTriangle, X } from 'lucide-vue-next'

interface Props {
  autoHide?: boolean
  autoHideDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoHide: true,
  autoHideDelay: 8000
})

const route = useRoute()
const router = useRouter()
const showNotification = ref(false)

// Computed properties for notification content
const notificationType = computed(() => {
  if (route.query.accessDenied) return 'access-denied'
  if (route.query.tabRedirect) return 'tab-redirect'
  return null
})

const variant = computed(() => {
  switch (notificationType.value) {
    case 'access-denied':
      return 'destructive'
    case 'tab-redirect':
      return 'default'
    default:
      return 'default'
  }
})

const title = computed(() => {
  switch (notificationType.value) {
    case 'access-denied':
      return 'Access Restricted'
    case 'tab-redirect':
      return 'Redirected'
    default:
      return 'Notice'
  }
})

const message = computed(() => {
  if (route.query.message) {
    return route.query.message as string
  }
  
  switch (notificationType.value) {
    case 'access-denied':
      return 'You were redirected because you don\'t have permission to access that area.'
    case 'tab-redirect':
      return `You were redirected from the ${route.query.originalTab} tab because it's not available for your account type.`
    default:
      return ''
  }
})

const getIcon = () => {
  switch (notificationType.value) {
    case 'access-denied':
      return AlertTriangle
    case 'tab-redirect':
      return InfoIcon
    default:
      return InfoIcon
  }
}

const dismiss = () => {
  showNotification.value = false
  
  // Clean up URL query parameters
  const cleanQuery = { ...route.query }
  delete cleanQuery.accessDenied
  delete cleanQuery.tabRedirect
  delete cleanQuery.originalPath
  delete cleanQuery.originalTab
  delete cleanQuery.message
  
  router.replace({ query: cleanQuery }).catch(() => {
    // Ignore navigation errors
  })
}

// Auto-hide functionality
let hideTimeout: number | undefined

const startAutoHide = () => {
  if (props.autoHide && showNotification.value) {
    hideTimeout = window.setTimeout(() => {
      dismiss()
    }, props.autoHideDelay)
  }
}

const clearAutoHide = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = undefined
  }
}

// Watch for route changes
watch(() => route.query, (newQuery) => {
  const hasNotificationQuery = newQuery.accessDenied || newQuery.tabRedirect
  showNotification.value = !!hasNotificationQuery
  
  if (showNotification.value) {
    clearAutoHide()
    startAutoHide()
  }
}, { immediate: true })

// Check on mount
onMounted(() => {
  const hasNotificationQuery = route.query.accessDenied || route.query.tabRedirect
  showNotification.value = !!hasNotificationQuery
  
  if (showNotification.value) {
    startAutoHide()
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  clearAutoHide()
})
</script>