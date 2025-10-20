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

app.mount('#app')
