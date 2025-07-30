<template>
  <Card class="lg:col-span-2">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <span class="text-purple-600">🌙</span>
        Dark Mode Toggle
      </CardTitle>
      <CardDescription> Switch between light and dark themes </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">
            Current theme:
            <span class="font-medium text-foreground">{{
              themeStore.isDark ? 'Dark' : 'Light'
            }}</span>
          </p>
          <p class="text-xs text-muted-foreground">
            The theme preference is saved in localStorage and will persist across sessions.
          </p>
        </div>
        <ThemeToggle />
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>
