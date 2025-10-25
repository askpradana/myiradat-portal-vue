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
  const isInitializing = ref<boolean>(false)
  const isInitialized = ref<boolean>(false)

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
    isInitialized.value = true

    // Store in localStorage for persistent authentication across tabs
    localStorage.setItem('auth_token', JSON.stringify(authData.auth))
    localStorage.setItem('data_user', JSON.stringify(authData.user))
    localStorage.setItem('data_services', JSON.stringify(authData.services))
  }

  const setUserProfileData = (userData: Partial<UserLoginInterface>) => {
    console.log('📝 userStore: setUserProfileData called with:', {
      userId: userData.id,
      name: userData.name,
      email: userData.email,
      hasExistingUser: !!user.value
    })

    if (user.value) {
      // Gabungkan properti dari userData ke user.value
      user.value = {
        ...user.value,
        ...userData,
      }
      // Perbarui data_user di localStorage
      localStorage.setItem('data_user', JSON.stringify(user.value))
      console.log('🔄 userStore: Updated existing user data in store and localStorage')
    } else {
      // Jika user.value belum ada, inisialisasi dengan userData
      user.value = userData as UserLoginInterface
      localStorage.setItem('data_user', JSON.stringify(userData))
      console.log('🆕 userStore: Initialized new user data in store and localStorage')
    }
  }

  const setTempVerificationToken = (token: string) => {
    tempVerificationToken.value = token
    localStorage.setItem('temp_verification_token', token)
  }

  const clearTempVerificationToken = () => {
    tempVerificationToken.value = null
    localStorage.removeItem('temp_verification_token')
  }

  const clearUserData = () => {
    auth.value = null
    user.value = null
    services.value = null
    isAuthenticated.value = false
    tempVerificationToken.value = null
    isInitialized.value = false

    localStorage.removeItem('auth_token')
    localStorage.removeItem('data_user')
    localStorage.removeItem('data_services')
    localStorage.removeItem('temp_verification_token')
    localStorage.removeItem('ipros_data') // Clear IPROS data on logout
  }

  const isTokenValid = (): boolean => {
    if (!auth.value?.expires_at) return false
    const now = new Date().getTime()
    const expiresAt = new Date(auth.value.expires_at).getTime()
    return now < expiresAt
  }

  const initializeAuth = async (): Promise<boolean> => {
    // Prevent multiple simultaneous initializations
    if (isInitializing.value) {
      // Wait for current initialization to complete
      return new Promise((resolve) => {
        const checkInitialized = () => {
          if (!isInitializing.value) {
            resolve(isAuthenticated.value)
          } else {
            setTimeout(checkInitialized, 50)
          }
        }
        checkInitialized()
      })
    }

    // Already initialized, return current auth state
    if (isInitialized.value) {
      return isAuthenticated.value
    }

    isInitializing.value = true

    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('data_user')
      const storedServices = localStorage.getItem('data_services')
      const storedTempToken = localStorage.getItem('temp_verification_token')

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
        } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
          // Invalid token data, clear everything
          clearUserData()
        }
      }
    } finally {
      isInitialized.value = true
      isInitializing.value = false
    }

    return isAuthenticated.value
  }

  return {
    auth,
    user,
    services,
    isAuthenticated,
    tempVerificationToken,
    isInitializing,
    isInitialized,
    setUserData,
    setUserProfileData,
    setTempVerificationToken,
    clearTempVerificationToken,
    clearAuthData: clearUserData,
    initializeAuth,
    isTokenValid,
  }
})
