<template>
  <div class="space-y-6 animate-pulse">
    <Card class="my-6">
      <CardContent class="flex items-center space-x-4 p-6">
        <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div class="space-y-2 flex-1">
          <Skeleton class="h-6 bg-gray-200 rounded w-3/4"></Skeleton>
          <Skeleton class="h-4 bg-gray-200 rounded w-1/2"></Skeleton>
        </div>
      </CardContent>
    </Card>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card v-for="i in 4" :key="i">
        <CardContent class="p-6">
          <Skeleton class="h-4 bg-gray-200 rounded w-1/4 mb-2"></Skeleton>
          <Skeleton class="h-6 bg-gray-200 rounded w-3/4"></Skeleton>
        </CardContent>
      </Card>
    </div>
    <Card class="my-6">
      <CardContent class="flex items-center space-x-4 p-6">
        <div class="space-y-2 flex-1">
          <Skeleton class="h-6 bg-gray-200 rounded w-1/4"></Skeleton>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card v-for="i in 3" :key="i">
              <CardContent class="p-6">
                <Skeleton class="h-4 bg-gray-200 rounded w-1/4 mb-2"></Skeleton>
                <Skeleton class="h-6 bg-gray-200 rounded w-3/4"></Skeleton>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
</script>
