<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/userStores'
import { getUserRole, getRoleRedirectPath } from '@/lib/dashboard-utils'
import { Button } from '@/components/ui/button'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const isAuthenticated = computed(() => userStore.isAuthenticated && userStore.isTokenValid())
const userRole = computed(() => getUserRole(userStore.user))

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
            <h2 class="text-8xl font-bold text-primary/20 mb-2">{{ t('errors.notFound.code') }}</h2>
            <h3 class="text-2xl font-semibold text-foreground mb-2">{{ t('errors.notFound.title') }}</h3>
            <p class="text-muted-foreground max-w-sm mx-auto">
              {{ t('errors.notFound.description') }}
            </p>
          </div>

          <!-- Navigation Actions -->
          <div class="space-y-3">
            <template v-if="!isAuthenticated">
              <!-- Guest user options -->
              <Button @click="goHome" class="w-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {{ t('buttons.navigation.goHome') }}
              </Button>
              <Button @click="goToLogin" variant="outline" class="w-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                {{ t('buttons.navigation.login') }}
              </Button>
            </template>

            <template v-else>
              <!-- Authenticated user options -->
              <Button @click="goToDashboard" class="w-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {{ t('buttons.navigation.goToDashboard') }}
              </Button>

              <template v-if="userRole === 'admin'">
                <Button @click="() => router.push('/dashboard?tab=user-management')" variant="outline" class="w-full">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  {{ t('buttons.navigation.adminPanel') }}
                </Button>
              </template>
            </template>
          </div>
        </div>

        <!-- Additional help text -->
        <div class="text-sm text-muted-foreground">
          <p>{{ t('errors.notFound.helpText') }}</p>
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