import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import type { DashboardTab, UserRole, TabConfig } from '@/types/dashboard'
import { getAccessibleTabs, isTabAccessible } from '@/lib/dashboard-utils'
import { useErrorStateManager } from '@/composables/api/useErrorStateManager'

interface DashboardTabsOptions {
  userRole: Ref<UserRole>
  defaultTab?: DashboardTab
  persistToUrl?: boolean
  persistToStorage?: boolean
  storageKey?: string
  clearErrorsOnTabChange?: boolean
}

interface DashboardTabsReturn {
  activeTab: Ref<DashboardTab>
  availableTabs: Ref<TabConfig[]>
  isTabLoading: Ref<boolean>
  tabError: Ref<string | null>
  changeTab: (tab: DashboardTab) => Promise<void>
  canAccessTab: (tab: DashboardTab) => boolean
  getTabLabel: (tab: DashboardTab) => string
  initializeTabs: () => Promise<void>

  // Error management
  clearTabErrors: () => void
  hasTabErrors: Ref<boolean>
  tabErrorManager: ReturnType<typeof useErrorStateManager>
}

export function useDashboardTabs(options: DashboardTabsOptions): DashboardTabsReturn {
  const {
    userRole,
    defaultTab = 'dashboard',
    persistToUrl = true,
    persistToStorage = true,
    storageKey = 'dashboard-active-tab',
    clearErrorsOnTabChange = true,
  } = options

  const router = useRouter()
  const route = useRoute()

  // Error state management
  const tabErrorManager = useErrorStateManager('dashboard-tabs', {
    clearOnNavigation: clearErrorsOnTabChange,
    showToast: false, // We'll handle toasts manually for better UX
    persistAcrossTabs: false
  })

  // Reactive state
  const activeTab = ref<DashboardTab>(defaultTab)
  const isTabLoading = ref(false)
  const tabError = ref<string | null>(null)
  const hasTabErrors = computed(() => tabErrorManager.hasErrors.value)

  // Tab configuration
  const tabConfigs: Record<DashboardTab, TabConfig> = {
    dashboard: {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      requiresAdmin: false,
    },
    users: {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      requiresAdmin: true,
    },
    data: {
      id: 'data',
      label: 'Data',
      icon: 'Database',
      requiresAdmin: false,
    },
    assessments: {
      id: 'assessments',
      label: 'Assessments',
      icon: 'FileText',
      requiresAdmin: false,
    },
    profile: {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      requiresAdmin: false,
    },
  }

  // Computed available tabs based on user role
  const availableTabs = computed<TabConfig[]>(() => {
    const accessibleTabIds = getAccessibleTabs(userRole.value)
    return accessibleTabIds.map((tabId) => tabConfigs[tabId])
  })

  // Utility functions
  const canAccessTab = (tab: DashboardTab): boolean => {
    return isTabAccessible(tab, userRole.value)
  }

  const getTabLabel = (tab: DashboardTab): string => {
    return tabConfigs[tab]?.label || tab
  }

  // Tab persistence functions
  const saveTabToStorage = (tab: DashboardTab) => {
    if (persistToStorage && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(storageKey, tab)
      } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // Failed to save tab to localStorage
      }
    }
  }

  const loadTabFromStorage = (): DashboardTab | null => {
    if (persistToStorage && typeof localStorage !== 'undefined') {
      try {
        const savedTab = localStorage.getItem(storageKey) as DashboardTab
        return savedTab && canAccessTab(savedTab) ? savedTab : null
      } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // Failed to load tab from localStorage
        return null
      }
    }
    return null
  }

  const getTabFromUrl = (): DashboardTab | null => {
    if (persistToUrl) {
      // Get tab from route path instead of query
      const path = route.path
      let urlTab: DashboardTab = 'dashboard'

      if (path === '/dashboard') {
        urlTab = 'dashboard'
      } else if (path.startsWith('/dashboard/')) {
        const tabSegment = path.split('/dashboard/')[1]?.split('/')[0]
        urlTab = (tabSegment as DashboardTab) || 'dashboard'
      }

      return canAccessTab(urlTab) ? urlTab : null
    }
    return null
  }

  const updateUrlWithTab = (tab: DashboardTab) => {
    if (persistToUrl) {
      const targetPath = tab === 'dashboard' ? '/dashboard' : `/dashboard/${tab}`
      if (route.path !== targetPath) {
        router.replace(targetPath).catch((_error) => { // eslint-disable-line @typescript-eslint/no-unused-vars
          // Failed to update URL with tab
        })
      }
    }
  }

  // Main tab change function
  const changeTab = async (tab: DashboardTab): Promise<void> => {
    try {
      // Clear previous tab errors if enabled
      if (clearErrorsOnTabChange) {
        tabErrorManager.clearOnTabChange()
      }

      // Reset error state
      tabError.value = null

      // Validate tab access
      if (!canAccessTab(tab)) {
        tabErrorManager.addError({
          message: `Access denied to tab: ${getTabLabel(tab)}`,
          severity: 'warning',
          context: 'component',
          source: 'dashboard-navigation',
          recoveryActions: ['navigate']
        })
        throw new Error(`Access denied to tab: ${tab}`)
      }

      // Set loading state
      isTabLoading.value = true

      // Update active tab
      activeTab.value = tab

      // Persist tab state
      saveTabToStorage(tab)
      updateUrlWithTab(tab)

      // Simulate async tab loading (if needed for data fetching)
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Clear any navigation-related errors on successful tab change
      tabErrorManager.clearErrors('component')

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to change tab'
      tabError.value = message

      // Add error to the error manager for better tracking
      tabErrorManager.addError({
        message,
        severity: 'error',
        context: 'component',
        source: 'dashboard-tab-change',
        recoveryActions: ['retry', 'navigate'],
        details: { targetTab: tab, currentTab: activeTab.value }
      })
    } finally {
      isTabLoading.value = false
    }
  }

  // Initialize tabs based on various sources
  const initializeTabs = async (): Promise<void> => {
    try {
      let initialTab: DashboardTab = defaultTab

      // Priority order: URL > Storage > Default
      const urlTab = getTabFromUrl()
      const storageTab = loadTabFromStorage()

      if (urlTab) {
        initialTab = urlTab
      } else if (storageTab) {
        initialTab = storageTab
      }

      // Ensure the initial tab is accessible
      if (!canAccessTab(initialTab)) {
        const accessibleTabs = getAccessibleTabs(userRole.value)
        initialTab = accessibleTabs[0] || 'dashboard'
      }

      // Set the initial tab
      await changeTab(initialTab)
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      tabError.value = 'Failed to initialize dashboard tabs'
    }
  }

  // Watch for user role changes and reinitialize if needed
  watch(
    userRole,
    async (newRole, oldRole) => {
      if (newRole !== oldRole) {
        // Check if current tab is still accessible
        if (!canAccessTab(activeTab.value)) {
          // Switch to first available tab
          const accessibleTabs = getAccessibleTabs(newRole)
          if (accessibleTabs.length > 0) {
            await changeTab(accessibleTabs[0])
          }
        }
      }
    },
    { immediate: false },
  )

  // Error management functions
  const clearTabErrors = (): void => {
    tabErrorManager.clearAllErrors()
    tabError.value = null
  }

  // Auto-initialize on mount
  onMounted(() => {
    initializeTabs()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    // Clear page-level errors when component unmounts
    tabErrorManager.clearOnPageLeave()
  })

  return {
    activeTab,
    availableTabs,
    isTabLoading,
    tabError,
    changeTab,
    canAccessTab,
    getTabLabel,
    initializeTabs,

    // Error management
    clearTabErrors,
    hasTabErrors,
    tabErrorManager,
  }
}
