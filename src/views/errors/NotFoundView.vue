<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStores'
import { getUserRole, getRoleRedirectPath } from '@/lib/dashboard-utils'
import { useUmami } from '@/composables/utils/useUmami'
import { useRecentPages } from '@/composables/navigation/useRecentPages'
import { Button } from '@/components/ui/button'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()
const { trackEvent, isReady } = useUmami()
const { recentPages, loadRecentPages, navigateToRecentPage } = useRecentPages()

const isAuthenticated = computed(() => userStore.isAuthenticated && userStore.isTokenValid())
const userRole = computed(() => getUserRole(userStore.user))

// Dynamic error context detection
const errorContext = computed(() => {
  const currentPath = router.currentRoute.value.path
  if (currentPath.includes('/dashboard/admin')) return 'admin'
  if (currentPath.includes('/dashboard')) return 'dashboard'
  if (currentPath.includes('/quiz')) return 'assessment'
  if (currentPath.includes('/services')) return 'services'
  if (currentPath.includes('/articles')) return 'articles'
  return 'general'
})

// Context-specific messages and suggestions
const contextualContent = computed(() => {
  const context = errorContext.value

  const content = {
    admin: {
      title: t('errors.notFound.contextual.admin.title', 'Admin Feature Not Found'),
      description: t('errors.notFound.contextual.admin.description', 'The admin feature you\'re looking for doesn\'t exist or has been moved.'),
      suggestion: t('errors.notFound.contextual.admin.suggestion', 'Try accessing admin features through the main dashboard.')
    },
    dashboard: {
      title: t('errors.notFound.contextual.dashboard.title', 'Dashboard Page Not Found'),
      description: t('errors.notFound.contextual.dashboard.description', 'The dashboard page you\'re looking for doesn\'t exist.'),
      suggestion: t('errors.notFound.contextual.dashboard.suggestion', 'Check your available sections in the dashboard menu.')
    },
    assessment: {
      title: t('errors.notFound.contextual.assessment.title', 'Assessment Not Found'),
      description: t('errors.notFound.contextual.assessment.description', 'The assessment or quiz you\'re trying to access is not found.'),
      suggestion: t('errors.notFound.contextual.assessment.suggestion', 'View available assessments in your dashboard.')
    },
    services: {
      title: t('errors.notFound.contextual.services.title', 'Service Not Found'),
      description: t('errors.notFound.contextual.services.description', 'The service page you\'re looking for doesn\'t exist.'),
      suggestion: t('errors.notFound.contextual.services.suggestion', 'Browse available services from the main navigation.')
    },
    articles: {
      title: t('errors.notFound.contextual.articles.title', 'Article Not Found'),
      description: t('errors.notFound.contextual.articles.description', 'The article you\'re looking for might have been moved or deleted.'),
      suggestion: t('errors.notFound.contextual.articles.suggestion', 'Check out our latest articles or use the search feature.')
    },
    general: {
      title: t('errors.notFound.title', 'Page Not Found'),
      description: t('errors.notFound.description', 'The page you\'re looking for doesn\'t exist or has been moved.'),
      suggestion: t('errors.notFound.helpText', 'Use the navigation menu to find what you\'re looking for.')
    }
  }

  return content[context] || content.general
})

// Track 404 errors for analytics
const track404Error = () => {
  if (isReady()) {
    const currentPath = router.currentRoute.value.path
    trackEvent('404-error', {
      path: currentPath,
      context: errorContext.value,
      userRole: isAuthenticated.value ? userRole.value : 'guest',
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    })
  }
}

// Track error on component mount
onMounted(() => {
  // Load recent pages for authenticated users
  if (isAuthenticated.value) {
    loadRecentPages()
  }

  // Small delay to ensure Umami is fully loaded
  setTimeout(() => {
    track404Error()
  }, 100)
})

const goHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToDashboard = () => {
  const redirectPath = getRoleRedirectPath(userRole.value)
  router.push(redirectPath)
}

// Smart contextual actions based on error context and user role
const contextualActions = computed(() => {
  const context = errorContext.value
  const role = userRole.value
  const actions = []

  // Common actions for authenticated users
  if (isAuthenticated.value) {
    actions.push({
      label: t('buttons.navigation.goToDashboard', 'Go to Dashboard'),
      action: goToDashboard,
      icon: 'dashboard',
      variant: 'default' as const
    })
  }

  // Context-specific actions
  if (context === 'admin' && role === 'admin') {
    actions.push({
      label: t('buttons.navigation.userManagement', 'User Management'),
      action: () => router.push('/dashboard/users'),
      icon: 'users',
      variant: 'outline' as const
    })
  } else if (context === 'assessment') {
    actions.push({
      label: t('buttons.navigation.viewAssessments', 'View Assessments'),
      action: () => router.push('/dashboard/assessments'),
      icon: 'clipboard',
      variant: 'outline' as const
    })
  } else if (context === 'services') {
    actions.push({
      label: t('buttons.navigation.browseServices', 'Browse Services'),
      action: () => router.push('/solutions'),
      icon: 'service',
      variant: 'outline' as const
    })
  } else if (context === 'articles') {
    actions.push({
      label: t('buttons.navigation.browseArticles', 'Browse Articles'),
      action: () => router.push('/articles'),
      icon: 'book',
      variant: 'outline' as const
    })
  }

  // Guest user actions
  if (!isAuthenticated.value) {
    actions.push(
      {
        label: t('buttons.navigation.goHome', 'Go Home'),
        action: goHome,
        icon: 'home',
        variant: 'default' as const
      },
      {
        label: t('buttons.navigation.login', 'Login'),
        action: goToLogin,
        icon: 'login',
        variant: 'outline' as const
      }
    )
  }

  return actions
})
</script>

<template>
  <div
    class="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden"
  >
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Top left decorative circle -->
      <div class="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <!-- Bottom right decorative circle -->
      <div class="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <!-- Center decorative element -->
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl"
      ></div>

      <!-- Grid pattern overlay -->
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"
      ></div>
    </div>

    <!-- Main content -->
    <div class="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-8">
      <div class="w-full max-w-md text-center">
        <!-- Logo/Brand section -->
        <div class="mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4"
          >
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-foreground mb-2">{{ t('common.brand.name') }}</h1>
          <p class="text-muted-foreground">{{ t('common.brand.tagline') }}</p>
        </div>

        <!-- 404 Error Content -->
        <div class="mb-8">
          <div class="mb-6">
            <h2 class="text-8xl font-bold text-primary/20 mb-2">{{ t('errors.notFound.code', '404') }}</h2>
            <h3 class="text-2xl font-semibold text-foreground mb-2">{{ contextualContent.title }}</h3>
            <p class="text-muted-foreground max-w-sm mx-auto mb-3">
              {{ contextualContent.description }}
            </p>
            <p class="text-sm text-muted-foreground/80 max-w-md mx-auto">
              {{ contextualContent.suggestion }}
            </p>
          </div>

          <!-- Smart Contextual Navigation Actions -->
          <div class="space-y-3">
            <Button
              v-for="action in contextualActions"
              :key="action.label"
              @click="action.action"
              :variant="action.variant"
              class="w-full"
            >
              <svg v-if="action.icon === 'home'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <svg v-else-if="action.icon === 'login'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <svg v-else-if="action.icon === 'dashboard'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <svg v-else-if="action.icon === 'users'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <svg v-else-if="action.icon === 'clipboard'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <svg v-else-if="action.icon === 'service'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <svg v-else-if="action.icon === 'book'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {{ action.label }}
            </Button>
          </div>
        </div>

        <!-- Recent Pages Widget for Authenticated Users -->
        <div v-if="isAuthenticated && recentPages.length > 0" class="mb-6">
          <div class="border-t border-border/50 pt-6">
            <h4 class="text-sm font-medium text-foreground mb-3 flex items-center">
              <svg class="w-4 h-4 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ t('errors.notFound.recentPages', 'Recently Visited') }}
            </h4>
            <div class="space-y-2">
              <button
                v-for="page in recentPages"
                :key="page.path"
                @click="navigateToRecentPage(page)"
                class="w-full text-left px-3 py-2 rounded-md border border-border/40 bg-background/50 hover:bg-muted/50 hover:border-border transition-colors duration-200 group"
              >
                <div class="flex items-center">
                  <svg v-if="page.icon === 'dashboard'" class="w-3.5 h-3.5 mr-2.5 text-muted-foreground group-hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <svg v-else-if="page.icon === 'users'" class="w-3.5 h-3.5 mr-2.5 text-muted-foreground group-hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <svg v-else-if="page.icon === 'clipboard'" class="w-3.5 h-3.5 mr-2.5 text-muted-foreground group-hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <svg v-else-if="page.icon === 'settings'" class="w-3.5 h-3.5 mr-2.5 text-muted-foreground group-hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5 mr-2.5 text-muted-foreground group-hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-sm text-muted-foreground group-hover:text-foreground truncate">
                    {{ page.title }}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Additional help text -->
        <div class="text-sm text-muted-foreground">
          <p>{{ contextualContent.suggestion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>