import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import { useUserStore } from './stores/userStores'
import { useLocaleStore } from './stores/locale'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { i18n } from './i18n'
import { useUmami } from './composables/utils/useUmami'

const app = createApp(App)
const pinia = createPinia()

// Add pinia persistence plugin
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)
app.use(i18n)

// Initialize stores
const themeStore = useThemeStore()
themeStore.initTheme()

// Initialize authentication state before mounting
const userStore = useUserStore()
userStore.initializeAuth()

// Initialize locale
const localeStore = useLocaleStore()
localeStore.initializeLocale()

// Initialize Umami analytics
const { initialize } = useUmami()
const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
const umamiUrl = import.meta.env.VITE_UMAMI_URL

if (websiteId && umamiUrl) {
  initialize({
    websiteId,
    url: umamiUrl
  }).then((success) => {
    if (success) {
      console.log('Umami analytics initialized')
    } else {
      console.warn('Failed to initialize Umami analytics')
    }
  })
}

app.mount('#app')
