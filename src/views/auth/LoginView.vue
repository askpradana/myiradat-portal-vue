<script setup lang="ts">
import LoginForm from '@/components/custom/custom-form/LoginForm.vue'
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Background Decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Blur circles -->
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div
        class="absolute -bottom-32 -left-40 w-96 h-96 bg-secondary/15 rounded-full blur-3xl"
      ></div>

      <!-- Grid overlay -->
      <div
        class="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-md relative z-10">
      <!-- Logo/Brand section -->
      <div class="text-center mb-8">
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
        <h1 class="text-3xl font-bold text-foreground mb-2">MyIradat</h1>
        <p class="text-muted-foreground">Your secure platform for data management</p>
      </div>

      <!-- Login form -->
      <LoginForm />
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
