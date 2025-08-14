import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import { useUserStore } from './stores/userStores'
import { VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)

// Initialize stores
const themeStore = useThemeStore()
themeStore.initTheme()

// Initialize authentication state before mounting
const userStore = useUserStore()
userStore.initializeAuth()

app.mount('#app')
