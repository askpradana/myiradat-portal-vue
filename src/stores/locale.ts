import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { i18n, getLocaleFromStorage, setLocaleToStorage, isValidLocale } from '@/i18n'
import type { LocaleCode } from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  // State
  const currentLocale = ref<LocaleCode>(getLocaleFromStorage())

  // Getters
  const locale = computed(() => currentLocale.value)
  const isRTL = computed(() => ['ar', 'he', 'fa'].includes(currentLocale.value))

  // Actions
  const setLocale = (newLocale: LocaleCode) => {
    if (!isValidLocale(newLocale)) {
      console.warn(`Invalid locale: ${newLocale}`)
      return
    }

    currentLocale.value = newLocale
    i18n.global.locale.value = newLocale as 'id' | 'en'
    setLocaleToStorage(newLocale)

    // Update HTML lang attribute
    document.documentElement.lang = newLocale

    // Update HTML dir attribute for RTL languages
    document.documentElement.dir = isRTL.value ? 'rtl' : 'ltr'
  }

  const toggleLocale = () => {
    const newLocale = currentLocale.value === 'id' ? 'en' : 'id'
    setLocale(newLocale)
  }

  const initializeLocale = () => {
    const storedLocale = getLocaleFromStorage()
    setLocale(storedLocale)
  }

  // Initialize on store creation
  initializeLocale()

  return {
    // State
    currentLocale: locale,
    isRTL,

    // Actions
    setLocale,
    toggleLocale,
    initializeLocale,
  }
}, {
  persist: {
    key: 'iradat-locale',
    storage: localStorage,
  },
})