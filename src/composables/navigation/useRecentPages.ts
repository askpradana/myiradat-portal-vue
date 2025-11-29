import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export interface RecentPage {
  path: string
  title: string
  timestamp: number
  icon: string
}

const recentPages = ref<RecentPage[]>([])
const MAX_RECENT_PAGES = 5

export function useRecentPages() {
  const router = useRouter()
  const { t } = useI18n()

  // Get icon based on route path
  const getRouteIcon = (path: string): string => {
    if (path.includes('/dashboard/admin')) return 'settings'
    if (path.includes('/dashboard/users')) return 'users'
    if (path.includes('/dashboard/assessments')) return 'clipboard'
    if (path.includes('/dashboard/profile')) return 'user'
    if (path.includes('/dashboard')) return 'dashboard'
    if (path.includes('/quiz')) return 'quiz'
    if (path.includes('/services')) return 'service'
    if (path.includes('/articles')) return 'book'
    if (path === '/') return 'home'
    return 'page'
  }

  // Get user-friendly title for route
  const getRouteTitle = (path: string, routeTitle?: string): string => {
    if (routeTitle && routeTitle !== 'Page Not Found') return routeTitle

    // Fallback titles based on path
    if (path.includes('/dashboard/admin/create-user')) return t('pages.createUser', 'Create User')
    if (path.includes('/dashboard/users')) return t('pages.userManagement', 'User Management')
    if (path.includes('/dashboard/assessments')) return t('pages.assessments', 'Assessments')
    if (path.includes('/dashboard/profile')) return t('pages.profile', 'Profile')
    if (path.includes('/dashboard')) return t('pages.dashboard', 'Dashboard')
    if (path.includes('/services')) return t('pages.services', 'Services')
    if (path.includes('/articles')) return t('pages.articles', 'Articles')
    if (path === '/') return t('pages.home', 'Home')

    return t('pages.unknown', 'Page')
  }

  // Add a page to recent history
  const addRecentPage = (path: string, title?: string) => {
    // Skip 404 pages and login/register pages
    if (path.includes('not-found') ||
        path.includes('/login') ||
        path.includes('/register') ||
        path.includes('/verify-email')) {
      return
    }

    const pageTitle = getRouteTitle(path, title)
    const icon = getRouteIcon(path)

    // Remove existing entry if it exists
    const existingIndex = recentPages.value.findIndex(page => page.path === path)
    if (existingIndex > -1) {
      recentPages.value.splice(existingIndex, 1)
    }

    // Add to the beginning
    recentPages.value.unshift({
      path,
      title: pageTitle,
      timestamp: Date.now(),
      icon
    })

    // Keep only the most recent pages
    if (recentPages.value.length > MAX_RECENT_PAGES) {
      recentPages.value = recentPages.value.slice(0, MAX_RECENT_PAGES)
    }

    // Store in sessionStorage for persistence
    try {
      sessionStorage.setItem('iradat-recent-pages', JSON.stringify(recentPages.value))
    } catch (error) {
      console.warn('Failed to save recent pages to sessionStorage:', error)
    }
  }

  // Load recent pages from sessionStorage
  const loadRecentPages = () => {
    try {
      const stored = sessionStorage.getItem('iradat-recent-pages')
      if (stored) {
        const parsed = JSON.parse(stored) as RecentPage[]
        // Filter out pages older than 24 hours
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
        recentPages.value = parsed.filter(page => page.timestamp > oneDayAgo)
      }
    } catch (error) {
      console.warn('Failed to load recent pages from sessionStorage:', error)
      recentPages.value = []
    }
  }

  // Navigate to a recent page
  const navigateToRecentPage = (page: RecentPage) => {
    router.push(page.path)
  }

  // Clear recent pages
  const clearRecentPages = () => {
    recentPages.value = []
    try {
      sessionStorage.removeItem('iradat-recent-pages')
    } catch (error) {
      console.warn('Failed to clear recent pages from sessionStorage:', error)
    }
  }

  // Filter recent pages to exclude current path and ensure they're still valid
  const validRecentPages = computed(() => {
    const currentPath = router.currentRoute.value.path
    return recentPages.value.filter(page =>
      page.path !== currentPath &&
      page.path !== '/not-found' &&
      router.hasRoute(page.path)
    )
  })

  return {
    recentPages: validRecentPages,
    addRecentPage,
    loadRecentPages,
    navigateToRecentPage,
    clearRecentPages
  }
}