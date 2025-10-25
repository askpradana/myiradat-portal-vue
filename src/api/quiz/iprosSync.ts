import { BaseApiService } from '@/api/base/ApiService'
import { httpClient } from '@/lib/httpClient'
import type { IPROSSyncData, IPROSSyncError, ProcessedIPROSData } from '@/types/ipros'

/**
 * IPROS External Sync API Service
 * Handles synchronization with external IPROS quiz system
 */
export class IPROSSyncService extends BaseApiService {
  private static readonly SYNC_ENDPOINT = '/v1/external/ipros/sync'

  /**
   * Sync IPROS quiz data for the current user
   * @returns Promise<ProcessedIPROSData | null>
   */
  async syncIPROSData(): Promise<ProcessedIPROSData | null> {
    console.log('🔄 Starting IPROS sync...')

    try {
      this.clearError()
      console.log('📤 Making GET request to:', IPROSSyncService.SYNC_ENDPOINT)
      const response = await httpClient.get<IPROSSyncData>(IPROSSyncService.SYNC_ENDPOINT, {})

      console.log('📥 IPROS response received:', response)

      // Handle 204 No Content specifically - this is NOT an error
      if (!response.success) {
        console.log('📭 204 No Content: Data not available from IPROS service')
        // Return a special response indicating data is not available (not an error)
        return {
          hasPrivileges: false,
          quizPrivileges: 'none',
          ppiResults: null,
          riasecResults: null,
          syncedAt: new Date().toISOString(),
          userInfo: {
            userId: '',
            email: '',
            name: '',
            grade: '',
            school: '',
          },
          isDataUnavailable: true
        }
      }

      if (!response.data) {
        console.log('📭 No data in response from IPROS service')
        return {
          hasPrivileges: false,
          quizPrivileges: 'none',
          ppiResults: null,
          riasecResults: null,
          syncedAt: new Date().toISOString(),
          userInfo: {
            userId: '',
            email: '',
            name: '',
            grade: '',
            school: '',
          },
          isDataUnavailable: true
        }
      }

      const processed = this.processIPROSResponse(response.data)
      console.log('✅ Processed IPROS data:', processed)
      return processed
    } catch (error) {
      console.error('❌ IPROS sync error:', error)

      // Check if it's a 204 response that was caught as an error
      if (error instanceof Error && (error.message.includes('204') || error.message.includes('No Content'))) {
        console.log('📭 Handling 204 as data unavailable')
        return {
          hasPrivileges: false,
          quizPrivileges: 'none',
          ppiResults: null,
          riasecResults: null,
          syncedAt: new Date().toISOString(),
          userInfo: {
            userId: '',
            email: '',
            name: '',
            grade: '',
            school: '',
          },
          isDataUnavailable: true
        }
      }

      // Only treat actual network errors, 4xx/5xx as errors
      this.errorHandler.handleError(error, 'Failed to sync IPROS data')
      return null
    }
  }

  /**
   * Process raw IPROS sync response into UI-friendly format
   */
  private processIPROSResponse(response: IPROSSyncData): ProcessedIPROSData {
    // The response is already the IPROS data (extracted by HTTP client)
    const data = response

    // Check if data exists and has quiz_privileges property
    if (!data || typeof data !== 'object' || !('quiz_privileges' in data)) {
      throw new Error('Invalid IPROS response: missing quiz_privileges data')
    }

    // Type guard to check if user has full privileges
    const hasPrivileges = (data as { quiz_privileges: string }).quiz_privileges === 'full'

    if (hasPrivileges) {
      const fullData = data as Extract<typeof data, { quiz_privileges: 'full' }>

      return {
        hasPrivileges: true,
        quizPrivileges: 'full',
        ppiResults: fullData.quiz_results.ppi?.result || null,
        riasecResults: fullData.quiz_results.riasec?.result || null,
        syncedAt: fullData.synced_at,
        userInfo: {
          userId: fullData.user_id,
          email: fullData.email,
          name: fullData.name,
          grade: fullData.grade,
          school: fullData.school,
        },
      }
    } else {
      const emptyData = data as Extract<typeof data, { quiz_privileges: 'none' }>

      return {
        hasPrivileges: false,
        quizPrivileges: 'none',
        ppiResults: null,
        riasecResults: null,
        syncedAt: emptyData.synced_at,
        userInfo: {
          userId: emptyData.user_id,
          email: emptyData.email,
          name: emptyData.name,
          grade: emptyData.grade,
          school: emptyData.school,
        },
      }
    }
  }

  /**
   * Get the sync status (success/error information)
   */
  getSyncError(): IPROSSyncError | null {
    if (!this.hasError) return null

    return {
      message: this.error?.message || 'Unknown sync error',
      context: 'IPROS Sync Operation',
    }
  }
}

// Export singleton instance for convenience
export const iprosSync = new IPROSSyncService()

// Export individual functions for backward compatibility
export const syncIPROSData = () => iprosSync.syncIPROSData()
export const getIPROSSyncError = () => iprosSync.getSyncError()
export const clearIPROSSyncError = () => iprosSync.clearError()
