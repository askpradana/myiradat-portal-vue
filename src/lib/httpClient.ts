import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'

export interface APIResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  timestamp?: string
}

export interface APIError {
  message: string
  status: number
  details?: string
}

class HTTPClient {
  private baseURL: string

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || ''
  }

  private getAuthHeaders(): HeadersInit {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error: APIError = {
        message: errorData.message || `HTTP error! status: ${response.status}`,
        status: response.status,
        details: errorData.details
      }
      throw error
    }

    return await response.json()
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    retryOnAuth = true
  ): Promise<APIResponse<T>> {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(fullURL, requestOptions)

      // Handle 401 unauthorized with token refresh
      if (response.status === 401 && retryOnAuth) {
        try {
          const userStore = useUserStore()
          const refreshResponse = await refreshToken()

          if (userStore.auth && refreshResponse.data) {
            // Update store and session storage
            userStore.auth.token = refreshResponse.data.token
            userStore.auth.expires_at = refreshResponse.data.expires_at

            const auth = {
              token: refreshResponse.data.token,
              expires_at: refreshResponse.data.expires_at,
            }
            sessionStorage.setItem('auth_token', JSON.stringify(auth))

            // Retry the original request with new token
            return await this.makeRequest<T>(url, options, false)
          }
        } catch {
          // If token refresh fails, throw original 401 error
          throw {
            message: 'Session expired, please login again',
            status: 401,
            details: 'Token refresh failed'
          } as APIError
        }
      }

      return await this.handleResponse<T>(response)
    } catch (error) {
      // If it's already an APIError, re-throw it
      if (error && typeof error === 'object' && 'status' in error) {
        throw error
      }

      // Handle network errors
      throw {
        message: error instanceof Error ? error.message : 'Network error occurred',
        status: 0,
        details: 'Failed to connect to server'
      } as APIError
    }
  }

  async get<T>(url: string, options?: RequestInit): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, { ...options, method: 'GET' })
  }

  async post<T>(url: string, data?: unknown, options?: RequestInit): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(url: string, data?: unknown, options?: RequestInit): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(url: string, data?: unknown, options?: RequestInit): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(url: string, options?: RequestInit): Promise<APIResponse<T>> {
    return this.makeRequest<T>(url, { ...options, method: 'DELETE' })
  }

  // Special method for form data (file uploads, etc.)
  async postForm<T>(url: string, formData: FormData, options?: RequestInit): Promise<APIResponse<T>> {
    const requestOptions = {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
    }

    // Remove Content-Type for FormData
    if (requestOptions.headers && 'Content-Type' in requestOptions.headers) {
      delete (requestOptions.headers as Record<string, unknown>)['Content-Type']
    }

    return this.makeRequest<T>(url, requestOptions)
  }
}

// Export singleton instance
export const httpClient = new HTTPClient()

// Export class for testing or custom instances
export { HTTPClient }