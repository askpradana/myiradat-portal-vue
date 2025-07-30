<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-card border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-foreground">UI Components Showcase</h1>
            <p class="text-muted-foreground mt-1">
              Development reference for all available components
            </p>
          </div>
          <div class="flex items-center gap-2">
            <ThemeToggle />
            <Button @click="notify" variant="outline"> Test Toast </Button>
            <Button @click="navigateToLogin" variant="outline"> Login </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Form Components Section -->
        <FormComponents />

        <!-- Action Components Section -->
        <ActionComponents />

        <!-- Feedback Components Section -->
        <FeedbackComponents />

        <!-- Layout Components Section -->
        <LayoutComponents />

        <!-- Dark Mode Section -->
        <DarkModeSection />

        <!-- Interactive Demo Section -->
        <InteractiveDemo />

        <!-- New Components Section -->
        <NewComponents />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import ThemeToggle from '@/components/ThemeToggle.vue'

// Import custom components
import {
  FormComponents,
  ActionComponents,
  FeedbackComponents,
  LayoutComponents,
  DarkModeSection,
  InteractiveDemo,
  NewComponents,
} from '@/components/custom'
import router from '@/router'

const notify = () => {
  toast('This is a toast notification!', {
    description: 'You can customize the toast message and styling.',
  })
}

const navigateToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<style scoped></style>
