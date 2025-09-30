import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { serviceRedirect } from '@/api/services/serviceRedirect'
import type { ServiceRedirectRequest } from '@/types/serviceType'

/**
 * Composable for handling service redirects with JWT token exchange
 *
 * @returns Object containing redirect mutation and related state
 */
export const useServiceRedirect = () => {
  const isRedirecting = ref(false)

  const {
    mutate: redirectToService,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (request: ServiceRedirectRequest) => {
      isRedirecting.value = true
      return await serviceRedirect(request)
    },
    onSuccess: (response) => {
      if (response.success && response.data.redirect_url) {
        // Navigate to the service with the JWT token
        window.location.href = response.data.redirect_url
      } else {
        toast.error('Redirect failed', {
          description: response.message || 'Failed to get redirect URL',
        })
        isRedirecting.value = false
      }
    },
    onError: (error: Error) => {
      toast.error('Service unavailable', {
        description: error.message || 'Failed to access service',
      })
      isRedirecting.value = false
    },
  })

  /**
   * Handle service redirect for a given service code
   * @param serviceCode - The code of the service to redirect to
   */
  const handleServiceRedirect = (serviceCode: string) => {
    if (!serviceCode) {
      toast.error('Invalid service', {
        description: 'Service code is required',
      })
      return
    }

    redirectToService({ service_code: serviceCode })
  }

  return {
    // State
    isRedirecting: isRedirecting,
    isPending,
    error,

    // Actions
    handleServiceRedirect,
    redirectToService,
  }
}