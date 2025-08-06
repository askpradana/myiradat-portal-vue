// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  UserProfileInterface,
  IPROInterface,
  IPROBInterface,
  IPROSInterface,
  LastAnalyzedInterface,
} from '@/types/userType'

interface UserLoginInterface extends UserProfileInterface {
  ipro: IPROInterface
  iprob: IPROBInterface
  ipros: IPROSInterface
  last_analyzed: LastAnalyzedInterface
}

interface TokenInterface {
  token: string
  expires_at: string
}

// interface Service {
//   code: string
//   name: string
//   icon_url: string
//   redirect_to: string
// }

// interface AuthState {
//   token: string | null
//   user: User | null
//   services: Service[] | null
//   isAuthenticated: boolean
// }

export const useUserStore = defineStore('user', () => {
  // State
  const auth = ref<TokenInterface | null>(null)
  const user = ref<UserLoginInterface | null>(null)
  // const services = ref<Service[] | null>(null)
  const isAuthenticated = ref<boolean>(false)

  // Actions
  const setUserData = (authData: {
    auth: TokenInterface
    user: UserLoginInterface
    // services: Service[]
  }) => {
    auth.value = authData.auth
    user.value = authData.user
    // services.value = authData.services
    isAuthenticated.value = true

    // Optionally store token in localStorage for persistence
    localStorage.setItem('auth_token', JSON.stringify(authData.auth))
    localStorage.setItem('data_user', JSON.stringify(authData.user))
    // localStorage.setItem('data_services', JSON.stringify(authData.services))
  }

  const clearUserData = () => {
    auth.value = null
    user.value = null
    // services.value = null
    isAuthenticated.value = false

    localStorage.removeItem('auth_token')
    localStorage.removeItem('data_user')
    // localStorage.removeItem('data_services')
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('data_user')
    // const storedServices = localStorage.getItem('data_services')

    if (storedToken && storedUser) {
      auth.value = JSON.parse(storedToken)
      user.value = JSON.parse(storedUser)
      // services.value = JSON.parse(storedServices)
      isAuthenticated.value = true

      // Note: You might want to verify the token with your backend here
      // and fetch user data if the token is still valid
    }
  }

  return {
    auth,
    user,
    // services,
    isAuthenticated,
    setUserData,
    clearAuthData: clearUserData,
    initializeAuth,
  }
})
