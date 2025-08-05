<template>
  <header class="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-sm">MY</span>
          </div>
          <span class="text-xl font-bold text-foreground">Iradat</span>
        </div>
        <nav class="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >Features</a
          >
          <a
            href="#pricing"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >Pricing</a
          >
          <a
            href="#testimonials"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >Testimonials</a
          >
          <a
            href="#faq"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >FAQ</a
          >
        </nav>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <Button @click="navigateToLogin" variant="ghost" size="sm">Sign In</Button>
          <Button @click="navigateToRegister" size="sm">Get Started</Button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToLogin = () => {
  router.push('/login')
}

const navigateToRegister = () => {
  router.push('/register')
}
</script>
