import { computed, watch, type ComputedRef } from 'vue'
import { useUserStore } from '@/stores/userStores'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
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
  
  // Profile data
  profileQuery: ReturnType<typeof useQuery>
  
  // Profile update
  updateProfile: (data: UpdateProfilePayload) => Promise<void>
  isUpdatingProfile: ComputedRef<boolean>
  
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
  const queryClient = useQueryClient()
  const { error: apiError, handleError, clearError } = useApiError()

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

  // Profile data query
  const profileQuery = useQuery({
    queryKey: ['profile', user.value?.id],
    queryFn: async () => {
      try {
        const response = await getProfile()
        if (response?.user) {
          // Update the store with fresh data
          userStore.setUserProfileData(response.user)
          return response.user
        }
        throw new Error('No user data received')
      } catch (error) {
        handleError(error, 'Failed to fetch profile')
        throw error
      }
    },
    enabled: computed(() => isAuthenticated.value && !!user.value?.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfilePayload) => {
      return updateProfileAPI(data)
    },
    onMutate: async (newData) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['profile', user.value?.id] })
      
      const previousData = queryClient.getQueryData(['profile', user.value?.id])
      
      // Update store optimistically
      if (user.value) {
        userStore.setUserProfileData({
          ...user.value,
          ...newData
        })
      }
      
      return { previousData }
    },
    onSuccess: (response) => {
      if (response?.user) {
        userStore.setUserProfileData(response.user)
      }
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ 
        queryKey: ['profile', user.value?.id],
        exact: false 
      })
    },
    onError: (error, newData, context) => {
      // Rollback optimistic update
      if (context?.previousData) {
        queryClient.setQueryData(['profile', user.value?.id], context.previousData)
      }
      
      handleError(error, 'Failed to update profile')
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['profile', user.value?.id] })
    }
  })

  // Public methods
  const updateProfile = async (data: UpdateProfilePayload) => {
    await updateProfileMutation.mutateAsync(data)
  }

  const refreshProfile = async () => {
    await profileQuery.refetch()
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

  // Watch for authentication changes
  watch(isAuthenticated, (newAuth) => {
    if (!newAuth) {
      queryClient.removeQueries({ queryKey: ['profile'] })
    }
  })

  return {
    user,
    isAuthenticated,
    profileStats,
    
    profileQuery,
    
    updateProfile,
    isUpdatingProfile: computed(() => updateProfileMutation.isPending.value),
    
    error: computed(() => {
      const err = apiError.value || profileQuery.error.value
      return err ? new Error(err.message || 'Unknown error') : null
    }),
    clearError,
    
    refreshProfile,
    getInitials,
    getRoleDisplayName
  }
}