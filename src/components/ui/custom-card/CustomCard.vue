<template>
  <div
    :class="[
      'rounded-lg border p-6 transition-all duration-200',
      {
        'bg-card text-card-foreground shadow-sm': variant === 'classic',
        'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200':
          variant === 'warning',
        'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200':
          variant === 'reminder',
      },
    ]"
  >
    <div v-if="icon" class="mb-4">
      <component :is="icon" class="h-6 w-6" />
    </div>
    <div v-if="title" class="mb-2">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
    </div>
    <div v-if="description" class="mb-4">
      <p class="text-sm opacity-80">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  variant?: 'classic' | 'warning' | 'reminder'
  title?: string
  description?: string
  icon?: Component
}

withDefaults(defineProps<Props>(), {
  variant: 'classic',
})
</script>
