import { httpClient } from '@/lib/httpClient'
import type { ServiceRedirectRequest, ServiceRedirectResponse } from '@/types/serviceType'

/**
 * Redirects user to a service by generating a service JWT token
 * and returning the redirect URL with the token
 */
export const serviceRedirect = async (
  request: ServiceRedirectRequest,
): Promise<ServiceRedirectResponse> => {
  const response = await httpClient.post<ServiceRedirectResponse['data']>(
    '/profile/service-redirect',
    request,
  )

  return {
    success: response.success,
    message: response.message,
    data: response.data!,
    timestamp: response.timestamp || new Date().toISOString(),
  }
}
