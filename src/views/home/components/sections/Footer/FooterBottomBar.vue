<template>
  <div class="mt-12 pt-8 border-t border-border">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-sm text-muted-foreground">
        &copy; {{ currentYear }} IRADAT. All rights reserved.
      </p>

      <!-- Status Indicator -->
      <div class="flex items-center space-x-4 text-sm">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-muted-foreground">All systems operational</span>
        </div>
        <a href="/status" class="text-primary hover:text-primary/80 transition-colors">
          Status Page
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>