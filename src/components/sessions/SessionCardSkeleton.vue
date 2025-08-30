<template>
  <div class="mx-6 p-4 flex items-center gap-4 border rounded-md">
    <div class="flex-shrink-0">
      <Skeleton class="h-10 w-10 rounded-full" />
    </div>
    <div class="flex-grow space-y-2">
      <Skeleton class="h-4 w-48" />
      <Skeleton class="h-3 w-64" />
      <Skeleton class="h-3 w-56" />
    </div>
    <div class="flex items-center gap-2">
      <Skeleton class="h-3 w-3 rounded-full" />
      <Skeleton class="h-8 w-20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
</script>
