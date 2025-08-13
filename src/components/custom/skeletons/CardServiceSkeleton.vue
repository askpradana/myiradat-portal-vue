<template>
  <Card v-for="n in 6" :key="n" class="w-full">
    <CardHeader>
      <Skeleton class="h-4 w-3/4 mb-2" />
      <CardContent class="px-0">
        <div class="flex justify-between items-center w-full gap-2 mt-2">
          <Skeleton class="h-[80px] w-[80px]" />
          <Skeleton class="h-10 w-[100px]" />
        </div>
      </CardContent>
    </CardHeader>
  </Card>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
</script>
