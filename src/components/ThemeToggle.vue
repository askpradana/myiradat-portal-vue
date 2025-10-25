<template>
  <Button
    @click="themeStore.toggleDark()"
    variant="ghost"
    size="responsive-icon"
    class="relative transition-colors hover:bg-muted/50"
    :title="themeStore.isDark ? t('buttons.theme.switchToLight') : t('buttons.theme.switchToDark')"
  >
    <div class="flex items-center gap-2">
      <svg
        v-if="themeStore.isDark"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4 text-muted-foreground shrink-0"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4 text-muted-foreground shrink-0"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      <span class="text-sm text-muted-foreground hidden sm:inline w-10 text-left">
        {{ themeStore.isDark ? t('buttons.theme.light') : t('buttons.theme.dark') }}
      </span>
    </div>
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/theme'
import { useI18n } from 'vue-i18n'

const themeStore = useThemeStore()
const { t } = useI18n()
</script>
