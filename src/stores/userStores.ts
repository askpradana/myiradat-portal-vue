// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  email: string
  role_id: number
  name: string
}

interface Service {
  code: string
  name: string
  icon_url: string
  redirect_to: string
}

// interface AuthState {
//   token: string | null
//   user: User | null
//   services: Service[] | null
//   isAuthenticated: boolean
// }

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const services = ref<Service[] | null>(null)
  const isAuthenticated = ref<boolean>(false)

  // Actions
  const setUserData = (authData: { token: string; user: User; services: Service[] }) => {
    token.value = authData.token
    user.value = authData.user
    services.value = authData.services
    isAuthenticated.value = true

    // Optionally store token in localStorage for persistence
    localStorage.setItem('auth_token', authData.token)
    localStorage.setItem('data_user', JSON.stringify(authData.user))
    localStorage.setItem('data_services', JSON.stringify(authData.services))
  }

  const clearUserData = () => {
    token.value = null
    user.value = null
    services.value = null
    isAuthenticated.value = false

    localStorage.removeItem('auth_token')
    localStorage.removeItem('data_user')
    localStorage.removeItem('data_services')
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('data_user')
    const storedServices = localStorage.getItem('data_services')

    if (storedToken && storedUser && storedServices) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      services.value = JSON.parse(storedServices)
      isAuthenticated.value = true

      // Note: You might want to verify the token with your backend here
      // and fetch user data if the token is still valid
    }
  }

  return {
    token,
    user,
    services,
    isAuthenticated,
    setUserData,
    clearAuthData: clearUserData,
    initializeAuth,
  }
})
