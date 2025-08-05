<template>
  <section
    class="relative overflow-hidden bg-gradient-to-b from-background via-card/50 to-background"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="text-center max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Transform Your
          <span class="text-primary">Data Management</span>
          Experience
        </h1>
        <p class="text-xl text-muted-foreground mb-8">
          Streamline your workflow with our comprehensive platform designed for modern businesses.
          From data collection to analytics, we've got you covered.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" class="text-lg px-8 py-3" @click="navigateToRegister">
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" class="text-lg px-8 py-3"> Watch Demo </Button>
        </div>
      </div>
    </div>
    <!-- Decorative elements -->
    <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
const router = useRouter()

const navigateToRegister = () => {
  router.push('/register')
}
</script>
