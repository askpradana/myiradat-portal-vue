import { BaseApiService } from '@/api/base'
import { httpClient } from '@/lib/httpClient'
import type { UserProfileInterface } from '@/types/userType'

/**
 * Example of modern API service using standardized error handling
 *
 * This service demonstrates the new pattern that should be adopted
 * across all API services for consistent error handling and HTTP client usage.
 */
export class UserApiService extends BaseApiService {
  /**
   * Get user profile with standardized error handling
   */
  async getProfile(): Promise<UserProfileInterface | null> {
    return this.handleRequestWithToast(
      () => httpClient.get<UserProfileInterface>('/profile'),
      'Failed to get user profile'
    )
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<UserProfileInterface>): Promise<UserProfileInterface | null> {
    return this.handleRequestWithToast(
      () => httpClient.put<UserProfileInterface>('/profile', userData),
      'Failed to update user profile',
      'Unable to update profile. Please try again.'
    )
  }

  /**
   * Get user by ID (admin only)
   */
  async getUserById(id: string): Promise<UserProfileInterface | null> {
    return this.handleRequest(
      () => httpClient.get<UserProfileInterface>(`/users/${id}`),
      'Failed to get user details'
    )
  }
}

// Export singleton instance
export const userApiService = new UserApiService()