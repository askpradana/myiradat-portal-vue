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
  const auth = ref<TokenInterface | null>(null)
  const user = ref<UserLoginInterface | null>(null)
  const services = ref<Service[] | null>(null)
  const isAuthenticated = ref<boolean>(false)

  // Actions
  const setUserData = (authData: {
    auth: TokenInterface
    user: UserLoginInterface
    services: Service[]
  }) => {
    auth.value = authData.auth
    user.value = authData.user
    services.value = authData.services
    isAuthenticated.value = true

    // Optionally store token in localStorage for persistence
    sessionStorage.setItem('auth_token', JSON.stringify(authData.auth))
    sessionStorage.setItem('data_user', JSON.stringify(authData.user))
    sessionStorage.setItem('data_services', JSON.stringify(authData.services))
  }

  const setUserProfileData = (userData: Partial<UserLoginInterface>) => {
    if (user.value) {
      // Gabungkan properti dari userData ke user.value
      user.value = {
        ...user.value,
        ...userData,
      }
      // Perbarui data_user di sessionStorage
      sessionStorage.setItem('data_user', JSON.stringify(user.value))
    } else {
      // Jika user.value belum ada, inisialisasi dengan userData
      user.value = userData as UserLoginInterface
      sessionStorage.setItem('data_user', JSON.stringify(userData))
    }
  }

  const clearUserData = () => {
    auth.value = null
    user.value = null
    services.value = null
    isAuthenticated.value = false

    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('data_user')
    sessionStorage.removeItem('data_services')
  }

  const initializeAuth = () => {
    const storedToken = sessionStorage.getItem('auth_token')
    const storedUser = sessionStorage.getItem('data_user')
    const storedServices = sessionStorage.getItem('data_services')

    if (storedToken && storedUser) {
      auth.value = JSON.parse(storedToken)
      user.value = JSON.parse(storedUser)
      services.value = storedServices ? JSON.parse(storedServices) : ''
      isAuthenticated.value = true
    }
  }

  return {
    auth,
    user,
    services,
    isAuthenticated,
    setUserData,
    setUserProfileData,
    clearAuthData: clearUserData,
    initializeAuth,
  }
})
