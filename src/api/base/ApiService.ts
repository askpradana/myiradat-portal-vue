// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { httpClient } from '@/lib/httpClient'
import { useApiError, type ApiError } from '@/composables/api/useApiError'
import type { APIResponse } from '@/lib/httpClient'

/**
 * Base API service class that provides standardized error handling
 * and HTTP client integration for all API calls.
 *
 * Usage:
 * ```typescript
 * export class UserApiService extends BaseApiService {
 *   async getProfile() {
 *     return this.handleRequest(
 *       () => httpClient.get<UserProfile>('/profile'),
 *       'Failed to get user profile'
 *     )
 *   }
 * }
 * ```
 */
export abstract class BaseApiService {
  protected readonly errorHandler = useApiError()

  /**
   * Standardized request handler that manages errors consistently
   */
  protected async handleRequest<T>(
    requestFn: () => Promise<APIResponse<T>>,
    errorContext: string
  ): Promise<T | null> {
    try {
      this.errorHandler.clearError()
      const response = await requestFn()

      if (!response.success) {
        throw new Error(response.message || 'Request failed')
      }

      return response.data || null
    } catch (error) {
      this.errorHandler.handleError(error, errorContext)
      return null
    }
  }

  /**
   * Handle requests that should show toast notifications on error
   */
  protected async handleRequestWithToast<T>(
    requestFn: () => Promise<APIResponse<T>>,
    errorContext: string,
    customErrorMessage?: string
  ): Promise<T | null> {
    const result = await this.handleRequest(requestFn, errorContext)

    if (this.errorHandler.hasError.value) {
      this.errorHandler.showErrorToast(customErrorMessage)
    }

    return result
  }

  /**
   * Get the current error state
   */
  get error(): ApiError | null {
    return this.errorHandler.error.value
  }

  /**
   * Check if there's an active error
   */
  get hasError(): boolean {
    return this.errorHandler.hasError.value
  }

  /**
   * Clear any current errors
   */
  clearError(): void {
    this.errorHandler.clearError()
  }
}