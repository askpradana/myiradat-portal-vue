<script setup lang="ts">
import { computed } from 'vue'
import { useLocaleStore } from '@/stores/locale'
import { AVAILABLE_LOCALES } from '@/i18n'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Languages } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const localeStore = useLocaleStore()
const { t } = useI18n()

const currentLocale = computed(() => localeStore.currentLocale)

const currentLocaleInfo = computed(() => {
  return AVAILABLE_LOCALES.find((locale) => locale.code === currentLocale.value)
})

const handleLocaleChange = (newLocale: unknown) => {
  // Only allow Indonesian for now
  if (newLocale === 'id') {
    localeStore.setLocale(newLocale as 'id' | 'en')
  }
}
</script>

<template>
  <Select :model-value="currentLocale" @update:model-value="handleLocaleChange">
    <SelectTrigger
      class="w-auto border-0 bg-transparent p-0 h-9 sm:h-auto sm:px-3 sm:py-2 shadow-none focus:ring-0 rounded-md hover:bg-muted/50 transition-colors"
    >
      <SelectValue>
        <div class="flex items-center gap-2 text-sm">
          <Languages class="w-4 h-4 text-muted-foreground shrink-0" />
          <span class="text-muted-foreground hidden sm:inline shrink-0">
            {{ currentLocaleInfo?.flag }}
          </span>
          <!-- Hide text on mobile for space efficiency -->
          <span class="text-muted-foreground hidden md:inline w-16 text-left">
            {{ currentLocaleInfo?.name }}
          </span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent class="min-w-[200px]">
      <SelectItem value="id" class="cursor-pointer">
        <div class="flex items-center gap-2">
          <span>🇮🇩</span>
          <span>Indonesia</span>
        </div>
      </SelectItem>

      <!-- Disabled English option -->
      <div
        class="relative px-2 py-1.5 text-sm rounded-sm flex items-center gap-2 text-muted-foreground/50 cursor-not-allowed"
      >
        <span>🇺🇸</span>
        <span>English</span>
        <span class="ml-auto text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
          {{ t('common.language.comingSoon') }}
        </span>
      </div>
    </SelectContent>
  </Select>
</template>
