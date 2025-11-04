<template>
  <header class="sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div
        class="bg-background/80 backdrop-blur-lg border border-border/30 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
      >
        <div class="flex justify-between items-center">
          <!-- Left side: Logo -->
          <RouterLink to="/">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span class="text-primary-foreground font-bold text-sm">IR</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xl font-bold text-foreground">{{
                  t('homepage.header.brand.name')
                }}</span>
                <span class="text-xs text-muted-foreground -mt-1">{{
                  t('homepage.header.brand.tagline')
                }}</span>
              </div>
            </div>
          </RouterLink>

          <!-- Navigation (Desktop & Tablet) -->
          <div class="hidden lg:flex items-center space-x-6 text-sm text-muted-foreground">
            <router-link to="/about" class="hover:text-primary transition-colors duration-200">
              About
            </router-link>
            <ServicesDropdown />
            <router-link to="/articles" class="hover:text-primary transition-colors duration-200">
              Articles
            </router-link>
            <router-link to="/contact" class="hover:text-primary transition-colors duration-200">
              Contact
            </router-link>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Utility Controls -->
            <div class="hidden lg:block">
              <LanguageChooser />
            </div>
            <ThemeToggle />

            <!-- Action Buttons -->
            <Button @click="navigateToLogin" variant="ghost" size="sm" class="hidden lg:flex">
              {{ t('homepage.header.buttons.signIn') }}
            </Button>
            <Button
              @click="navigateToRegister"
              size="sm"
              class="shadow-sm hover:shadow-md transition-shadow hidden lg:block"
            >
              {{ t('homepage.header.buttons.startFreeTrial') }}
            </Button>

            <!-- Mobile Menu Button -->
            <Button variant="ghost" size="sm" class="lg:hidden" @click="toggleMobileMenu">
              <Menu class="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Overlay -->
    <div v-if="showMobileMenu" class="lg:hidden">
      <div class="max-w-7xl mx-auto px-4 mt-2">
        <div
          class="bg-background/90 backdrop-blur-lg border border-border/30 rounded-2xl shadow-lg py-4 animate-in slide-in-from-top-2 duration-200"
        >
          <div class="flex flex-col space-y-3">
            <!-- Language Chooser for Mobile -->
            <div class="px-4 pb-3 border-b border-border">
              <LanguageChooser />
            </div>

            <!-- Mobile Navigation Links -->
            <div class="px-4 pb-3 border-b border-border space-y-3">
              <router-link
                to="/about"
                class="block text-foreground hover:text-primary transition-colors"
                @click="closeMobileMenu"
              >
                About
              </router-link>
              <div class="text-foreground">
                <router-link
                  to="/solutions"
                  class="font-medium mb-2 block hover:text-primary transition-colors"
                  @click="closeMobileMenu"
                >
                  Services
                </router-link>
                <div class="pl-4 space-y-2 text-sm text-muted-foreground">
                  <router-link
                    v-for="service in services"
                    :key="service.slug"
                    :to="`/services/${service.slug}`"
                    class="block hover:text-primary transition-colors"
                    @click="closeMobileMenu"
                  >
                    {{ service.title }}
                  </router-link>
                </div>
              </div>
              <router-link
                to="/articles"
                class="block text-foreground hover:text-primary transition-colors"
                @click="closeMobileMenu"
              >
                Articles
              </router-link>
              <router-link
                to="/contact"
                class="block text-foreground hover:text-primary transition-colors"
                @click="closeMobileMenu"
              >
                Contact
              </router-link>
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
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useRouter } from 'vue-router'
import { Menu } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { LanguageChooser } from '@/components/custom'
import ServicesDropdown from '@/components/custom/navigation/ServicesDropdown.vue'
import { useServicesData } from '@/composables/services/useServicesData'

const router = useRouter()
const showMobileMenu = ref(false)
const { t } = useI18n()
const { getAllServices } = useServicesData()

const services = computed(() => getAllServices())

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
