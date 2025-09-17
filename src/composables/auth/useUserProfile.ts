import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useUserStore } from '@/stores/userStores'
import { getProfile } from '@/api/users/getProfile'
import { updateProfile as updateProfileAPI, type UpdateProfilePayload } from '@/api/users/updateProfile'
import { useApiError } from '@/composables/api/useApiError'
import type { UserDataInterface } from '@/types/userType'

export type ProfileStats = {
  completionPercentage: number
  missingFields: string[]
  lastUpdated?: string
  assessmentsTaken: number
}

export type UseUserProfileReturn = {
  user: ComputedRef<UserDataInterface | null>
  isAuthenticated: ComputedRef<boolean>
  profileStats: ComputedRef<ProfileStats>
  
  // Simple loading states
  isLoading: Ref<boolean>
  isUpdating: Ref<boolean>
  
  // Profile update
  updateProfile: (data: UpdateProfilePayload) => Promise<void>
  
  // Error handling
  error: ComputedRef<Error | null>
  clearError: () => void
  
  // Utility functions
  refreshProfile: () => Promise<void>
  getInitials: () => string
  getRoleDisplayName: () => string
}

export function useUserProfile(): UseUserProfileReturn {
  const userStore = useUserStore()
  const { error: apiError, handleError, clearError } = useApiError()

  // Simple loading states
  const isLoading = ref(false)
  const isUpdating = ref(false)

  // Computed properties
  const user = computed(() => userStore.user)
  const isAuthenticated = computed(() => userStore.isAuthenticated)

  // Profile completion calculation
  const profileStats = computed((): ProfileStats => {
    const currentUser = user.value
    if (!currentUser) {
      return {
        completionPercentage: 0,
        missingFields: [],
        assessmentsTaken: 0
      }
    }

    const requiredFields = ['name', 'email', 'phone', 'date_of_birth']
    const optionalFields = ['avatar_picture']
    
    const missingRequired = requiredFields.filter(field => 
      !currentUser[field as keyof UserDataInterface] || 
      currentUser[field as keyof UserDataInterface] === ''
    )
    
    const missingOptional = optionalFields.filter(field => 
      !currentUser[field as keyof UserDataInterface] || 
      currentUser[field as keyof UserDataInterface] === ''
    )

    const totalFields = requiredFields.length + optionalFields.length
    const completedFields = totalFields - missingRequired.length - missingOptional.length
    const completionPercentage = Math.round((completedFields / totalFields) * 100)

    // Count assessments taken
    const assessmentsTaken = [
      currentUser.ipro,
      currentUser.iprob, 
      currentUser.ipros
    ].filter(Boolean).length

    return {
      completionPercentage,
      missingFields: [...missingRequired, ...missingOptional],
      lastUpdated: currentUser.verified_at,
      assessmentsTaken
    }
  })

  // Profile update function
  const updateProfile = async (data: UpdateProfilePayload) => {
    if (!isAuthenticated.value) return
    
    isUpdating.value = true
    try {
      const response = await updateProfileAPI(data)
      if (response?.user) {
        userStore.setUserProfileData(response.user)
      }
    } catch (error) {  
      handleError(error, 'Failed to update profile')
      throw error
    } finally {
      isUpdating.value = false
    }
  }

  // Refresh profile from API
  const refreshProfile = async () => {
    if (!isAuthenticated.value) return
    
    isLoading.value = true
    try {
      const response = await getProfile()
      if (response?.user) {
        userStore.setUserProfileData(response.user)
      }
    } catch (error) {  
      handleError(error, 'Failed to fetch profile')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const getInitials = (): string => {
    const name = user.value?.name
    if (!name) return '?'
    
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleDisplayName = (): string => {
    const roleId = user.value?.role_id
    const roleName = user.value?.role_name
    
    if (roleName) return roleName.charAt(0).toUpperCase() + roleName.slice(1)
    if (roleId === 1) return 'Admin'
    if (roleId === 2) return 'User'
    return 'Unknown'
  }

  return {
    user,
    isAuthenticated,
    profileStats,
    
    isLoading,
    isUpdating,
    
    updateProfile,
    
    error: computed(() => apiError.value ? new Error(apiError.value.message || 'Unknown error') : null),
    clearError,
    
    refreshProfile,
    getInitials,
    getRoleDisplayName
  }
}