<script lang="ts">
export const description = 'A modern and beautiful login form with enhanced styling.'
</script>

<script setup lang="ts">
import ResetPasswordUserForm from '@/components/custom/custom-form/ResetPasswordUserForm.vue'
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
      <!-- Register form -->
      <ResetPasswordUserForm />
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
