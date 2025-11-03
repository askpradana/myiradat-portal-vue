<template>
  <Button
    @click="themeStore.toggleDark()"
    variant="ghost"
    size="responsive-icon"
    class="relative transition-colors hover:bg-muted/50"
    :title="themeStore.isDark ? t('buttons.theme.switchToLight') : t('buttons.theme.switchToDark')"
  >
    <div class="flex items-center gap-2">
      <Sun v-if="themeStore.isDark" class="h-4 w-4 text-muted-foreground shrink-0" />
      <Moon v-else class="h-4 w-4 text-muted-foreground shrink-0" />
    </div>
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/theme'
import { useI18n } from 'vue-i18n'
import { Sun, Moon } from 'lucide-vue-next'

const themeStore = useThemeStore()
const { t } = useI18n()
</script>
