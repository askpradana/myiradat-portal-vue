<template>
  <div class="space-y-4" aria-label="Loading profile information">
    <!-- Header skeleton -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
      <!-- Avatar skeleton -->
      <div class="relative">
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted animate-pulse"></div>
        <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-muted animate-pulse"></div>
      </div>
      
      <!-- Info skeleton -->
      <div class="flex-1 text-center sm:text-left space-y-3">
        <div class="h-8 bg-muted rounded w-48 mx-auto sm:mx-0 animate-pulse"></div>
        <div class="h-4 bg-muted rounded w-64 mx-auto sm:mx-0 animate-pulse"></div>
        <div class="h-6 bg-muted rounded w-24 mx-auto sm:mx-0 animate-pulse"></div>
        
        <!-- Additional info skeleton -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div class="h-4 bg-muted rounded w-32 animate-pulse"></div>
          <div class="h-4 bg-muted rounded w-28 animate-pulse"></div>
        </div>
      </div>
      
      <!-- Actions skeleton -->
      <div class="flex flex-col space-y-2 min-w-[120px]">
        <div class="h-9 bg-muted rounded animate-pulse"></div>
      </div>
    </div>

    <!-- Form skeleton -->
    <div class="space-y-4">
      <div v-for="i in 3" :key="i" class="space-y-2">
        <div class="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
        <div class="h-10 bg-muted rounded animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for skeleton loading state
</script>