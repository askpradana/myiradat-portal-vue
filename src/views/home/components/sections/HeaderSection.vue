<template>
  <header class="sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div
        class="bg-background/80 backdrop-blur-lg border border-border/30 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
      >
        <div class="flex justify-between items-center">
          <!-- Left side: Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-primary-foreground font-bold text-sm">IR</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-bold text-foreground">{{ t('homepage.header.brand.name') }}</span>
              <span class="text-xs text-muted-foreground -mt-1">{{ t('homepage.header.brand.tagline') }}</span>
            </div>
          </div>

          <!-- Trust Indicators (Desktop) -->
          <div class="hidden xl:flex items-center space-x-4 text-xs text-muted-foreground">
            <div class="flex items-center space-x-1">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{{ t('homepage.header.trust.uptime') }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <ShieldCheck class="w-3 h-3" />
              <span>{{ t('homepage.header.trust.certified') }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Utility Controls -->
            <div class="hidden sm:block">
              <LanguageChooser />
            </div>
            <ThemeToggle />

            <!-- Action Buttons -->
            <Button @click="navigateToLogin" variant="ghost" size="sm" class="hidden sm:flex">
              {{ t('homepage.header.buttons.signIn') }}
            </Button>
            <Button
              @click="navigateToRegister"
              size="sm"
              class="shadow-sm hover:shadow-md transition-shadow hidden sm:block"
            >
              {{ t('homepage.header.buttons.startFreeTrial') }}
            </Button>

            <!-- Mobile Menu Button -->
            <Button variant="ghost" size="sm" class="sm:hidden" @click="toggleMobileMenu">
              <Menu class="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Overlay -->
    <div v-if="showMobileMenu" class="sm:hidden">
      <div class="max-w-7xl mx-auto px-4 mt-2">
        <div
          class="bg-background/90 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg py-4 animate-in slide-in-from-top-2 duration-200"
        >
          <div class="flex flex-col space-y-3">
            <!-- Language Chooser for Mobile -->
            <div class="px-4 pb-3 border-b border-border">
              <LanguageChooser />
            </div>

            <!-- Action Buttons -->
            <div class="px-4 space-y-2">
              <Button @click="navigateToLogin" variant="ghost" size="sm" class="w-full">
                {{ t('homepage.header.buttons.signIn') }}
              </Button>
              <Button @click="navigateToRegister" size="sm" class="w-full">
                {{ t('homepage.header.buttons.startFreeTrial') }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useRouter } from 'vue-router'
import { Menu, ShieldCheck } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { LanguageChooser } from '@/components/custom'

const router = useRouter()
const showMobileMenu = ref(false)
const { t } = useI18n()

const navigateToLogin = () => {
  router.push('/login')
  closeMobileMenu()
}

const navigateToRegister = () => {
  router.push('/register')
  closeMobileMenu()
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>
