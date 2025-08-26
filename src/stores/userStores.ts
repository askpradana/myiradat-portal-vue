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

export interface UserLoginInterface extends UserProfileInterface {
  ipro: IPROInterface
  iprob: IPROBInterface
  ipros: IPROSInterface
  last_analyzed: LastAnalyzedInterface
}

export interface TokenInterface {
  token: string
  expires_at: string
}

export interface Service {
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
  const tempVerificationToken = ref<string | null>(null)

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

  const setTempVerificationToken = (token: string) => {
    tempVerificationToken.value = token
    sessionStorage.setItem('temp_verification_token', token)
  }

  const clearTempVerificationToken = () => {
    tempVerificationToken.value = null
    sessionStorage.removeItem('temp_verification_token')
  }

  const clearUserData = () => {
    auth.value = null
    user.value = null
    services.value = null
    isAuthenticated.value = false
    tempVerificationToken.value = null

    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('data_user')
    sessionStorage.removeItem('data_services')
    sessionStorage.removeItem('temp_verification_token')
  }

  const isTokenValid = (): boolean => {
    if (!auth.value?.expires_at) return false
    const now = new Date().getTime()
    const expiresAt = new Date(auth.value.expires_at).getTime()
    return now < expiresAt
  }

  const initializeAuth = () => {
    const storedToken = sessionStorage.getItem('auth_token')
    const storedUser = sessionStorage.getItem('data_user')
    const storedServices = sessionStorage.getItem('data_services')
    const storedTempToken = sessionStorage.getItem('temp_verification_token')

    // Restore temporary verification token if it exists
    if (storedTempToken) {
      tempVerificationToken.value = storedTempToken
    }

    if (storedToken && storedUser) {
      try {
        const tokenData = JSON.parse(storedToken)
        const now = new Date().getTime()
        const expiresAt = new Date(tokenData.expires_at).getTime()

        // Check if token is still valid
        if (now < expiresAt) {
          auth.value = tokenData
          user.value = JSON.parse(storedUser)
          services.value = storedServices ? JSON.parse(storedServices) : null
          isAuthenticated.value = true
        } else {
          // Token expired, clear all data
          clearUserData()
        }
      } catch {
        // Invalid token data, clear everything
        console.warn('Invalid token data found, clearing authentication state')
        clearUserData()
      }
    }
  }

  return {
    auth,
    user,
    services,
    isAuthenticated,
    tempVerificationToken,
    setUserData,
    setUserProfileData,
    setTempVerificationToken,
    clearTempVerificationToken,
    clearAuthData: clearUserData,
    initializeAuth,
    isTokenValid,
  }
})
