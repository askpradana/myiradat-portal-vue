import { ref, computed, watch } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { getAdminServices } from '@/api/services/getAdminServices'
import type { AdminServicesResponse } from '@/types/serviceType'
import { getUserService, type UserServiceResponse } from '@/api/services/getUserServices'
import { postUserServiceData, type DataServiceProps } from '@/api/services/postUserService'
import type { Ref } from 'vue'


export const useAdminServices = (userId: string) => {
  const queryClient = useQueryClient()
  const selectedServiceCodes = ref<string[]>([])

  // Search functionality
  const searchQuery = ref<string>('')
  const debouncedSearchQuery = ref<string>('')

  // Debounce search query to improve performance
  let debounceTimer: number | null = null
  watch(searchQuery, (newQuery) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      debouncedSearchQuery.value = newQuery
    }, 300) // 300ms debounce delay
  }, { immediate: true })

  // Query for all available admin services
  const {
    data: adminServicesData,
    isPending: isLoadingAdminServices,
    error: adminServicesError,
  } = useQuery({
    queryKey: ['admin-services'],
    queryFn: getAdminServices,
    staleTime: 1000 * 60 * 5, // 5 minutes
  }) as {
    data: Ref<AdminServicesResponse | undefined>
    isPending: Ref<boolean>
    error: Ref<Error | null>
  }

  // Query for user's linked services
  const {
    data: userServicesData,
    isPending: isLoadingUserServices,
    error: userServicesError,
  } = useQuery({
    queryKey: ['services', userId],
    queryFn: () => getUserService(userId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  }) as {
    data: Ref<UserServiceResponse | undefined>
    isPending: Ref<boolean>
    error: Ref<Error | null>
  }

  // Mutation for linking services to user
  const {
    mutate: linkServicesMutation,
    isPending: isLinkingServices,
    error: linkingError,
  } = useMutation({
    mutationFn: ({ data, userID }: { data: DataServiceProps; userID: string }) =>
      postUserServiceData(data, userID),
    onSuccess: (response) => {
      if (response) {
        toast('Success', {
          description: response.message,
        })
        queryClient.invalidateQueries({
          queryKey: ['services', userId],
        })
        selectedServiceCodes.value = []
      }
    },
    onError: (error: Error) => {
      toast('Error', {
        description: `Failed to link service: ${error.message}`,
      })
    },
  })

  // Computed properties for easy access to data
  const adminServices = computed(() => adminServicesData.value?.data.services ?? [])
  const userServices = computed(() => userServicesData.value?.data.services ?? [])
  const linkedServiceCodes = computed(() => userServices.value.map((service) => service.code))

  // Search filtered services
  const filteredServices = computed(() => {
    if (!debouncedSearchQuery.value.trim()) {
      return adminServices.value
    }

    const query = debouncedSearchQuery.value.toLowerCase().trim()
    
    return adminServices.value.filter((service) => {
      const nameMatch = service.name.toLowerCase().includes(query)
      const codeMatch = service.code.toLowerCase().includes(query)
      return nameMatch || codeMatch
    })
  })

  // Search results count
  const searchResultsCount = computed(() => filteredServices.value.length)

  // Helper functions
  const addServiceToSelection = (serviceCode: string) => {
    if (!selectedServiceCodes.value.includes(serviceCode) && !isServiceLinked(serviceCode)) {
      selectedServiceCodes.value.push(serviceCode)
      toast('Added to selection', {
        description: `Service ${serviceCode} added to selection`,
      })
    }
  }

  const removeServiceFromSelection = (serviceCode: string) => {
    selectedServiceCodes.value = selectedServiceCodes.value.filter((code) => code !== serviceCode)
  }

  const clearSelection = () => {
    selectedServiceCodes.value = []
  }

  const isServiceLinked = (serviceCode: string): boolean => {
    return linkedServiceCodes.value.includes(serviceCode)
  }

  const isServiceSelected = (serviceCode: string): boolean => {
    return selectedServiceCodes.value.includes(serviceCode)
  }

  const linkSelectedServices = () => {
    if (selectedServiceCodes.value.length === 0) {
      toast('No services selected', {
        description: 'Please select at least one service to link',
      })
      return
    }

    const newData: DataServiceProps = {
      service_code: selectedServiceCodes.value,
    }

    linkServicesMutation({
      data: newData,
      userID: userId,
    })
  }

  // Service state helper
  const getServiceState = (serviceCode: string): 'available' | 'selected' | 'linked' => {
    if (isServiceLinked(serviceCode)) return 'linked'
    if (isServiceSelected(serviceCode)) return 'selected'
    return 'available'
  }

  // Copy service code functionality
  const copyServiceCode = async (serviceCode: string) => {
    try {
      await navigator.clipboard.writeText(serviceCode)
      toast('Copied', {
        description: 'Service code copied to clipboard',
      })
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      toast('Failed to copy', {
        description: 'Could not copy service code',
      })
    }
  }

  // Clear search functionality
  const clearSearch = () => {
    searchQuery.value = ''
    debouncedSearchQuery.value = ''
  }

  return {
    // Data
    adminServices,
    userServices,
    selectedServiceCodes: computed(() => selectedServiceCodes.value),
    linkedServiceCodes,

    // Search functionality
    searchQuery,
    debouncedSearchQuery,
    filteredServices,
    searchResultsCount,
    clearSearch,

    // Loading states
    isLoadingAdminServices,
    isLoadingUserServices,
    isLinkingServices,

    // Error states
    adminServicesError,
    userServicesError,
    linkingError,

    // Actions
    addServiceToSelection,
    removeServiceFromSelection,
    clearSelection,
    linkSelectedServices,
    copyServiceCode,

    // Utilities
    isServiceLinked,
    isServiceSelected,
    getServiceState,
  }
}