<template>
  <header class="sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div class="bg-card/95 backdrop-blur-md border border-border/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3">
        <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-sm">IR</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-bold text-foreground">IRADAT</span>
            <span class="text-xs text-muted-foreground -mt-1">All-in-One Portal</span>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <a
            v-for="item in navigation"
            :key="item.href"
            :href="item.href"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
          >
            {{ item.label }}
            <span
              class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"
            ></span>
          </a>
        </nav>

        <!-- Trust Indicators (Desktop) -->
        <div class="hidden xl:flex items-center space-x-4 text-xs text-muted-foreground">
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>99.9% Uptime</span>
          </div>
          <div class="flex items-center space-x-1">
            <ShieldCheck class="w-3 h-3" />
            <span>SOC 2 Certified</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <ThemeToggle />
          <Button @click="navigateToLogin" variant="ghost" size="sm" class="hidden sm:flex">
            Sign In
          </Button>
          <Button
            @click="navigateToRegister"
            size="sm"
            class="shadow-sm hover:shadow-md transition-shadow"
          >
            Start Free Trial
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div class="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg py-4 animate-in slide-in-from-top-2 duration-200">
        <nav class="flex flex-col space-y-3">
          <a
            v-for="item in navigation"
            :key="item.href"
            :href="item.href"
            @click="closeMobileMenu"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-md hover:bg-accent"
          >
            {{ item.label }}
          </a>
          <div class="border-t border-border pt-3 mt-3">
            <Button @click="navigateToLogin" variant="ghost" size="sm" class="w-full mb-2">
              Sign In
            </Button>
          </div>
          </nav>
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
import type { NavigationItem } from '@/types/homepage'

const router = useRouter()
const showMobileMenu = ref(false)

const navigation: NavigationItem[] = [
  { label: 'Solutions', href: '#features' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Resources', href: '#faq' },
]

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
