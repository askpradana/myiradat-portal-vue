import { createI18n } from 'vue-i18n'

import en from '@/locales/en'
import id from '@/locales/id'

// Default locale
const DEFAULT_LOCALE = 'id' // Indonesian as default

// Create i18n instance with type safety
export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: DEFAULT_LOCALE,
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en,
    id,
  },
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    id: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
    id: {
      currency: {
        style: 'currency',
        currency: 'IDR',
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
})

// Export available locales
export const AVAILABLE_LOCALES = [
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const

export type LocaleCode = (typeof AVAILABLE_LOCALES)[number]['code']

// Utility functions
export function getLocaleFromStorage(): LocaleCode {
  const stored = localStorage.getItem('locale') as LocaleCode
  return AVAILABLE_LOCALES.some((locale) => locale.code === stored) ? stored : DEFAULT_LOCALE
}

export function setLocaleToStorage(locale: LocaleCode): void {
  localStorage.setItem('locale', locale)
}

export function isValidLocale(locale: string): locale is LocaleCode {
  return AVAILABLE_LOCALES.some((l) => l.code === locale)
}

export default i18n
