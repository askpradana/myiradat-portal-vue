<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import HomeView from './views/HomeView.vue'
</script>

<template>
  <Toaster />

  <ClientOnly>
    <Toaster />
    <HomeView />
  </ClientOnly>

  <Toaster />
</template>
