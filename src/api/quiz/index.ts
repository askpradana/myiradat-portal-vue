import type {
  AvailableQuizzesResponse,
  QuizDetailResponse,
  QuizSubmissionsResponse,
  QuizResultResponse,
  QuizSubmissionPayload,
  QuizSubmissionResponse,
  SubmissionCheckResponse,
} from '@/types/quiz'
import { useUserStore } from '@/stores/userStores'
import { refreshToken } from '@/api/refreshToken'

/**
 * Centralized Quiz API Service
 * Consolidates all quiz-related API calls with shared authentication logic
 */
export class QuizService {
  private static readonly API_URL = import.meta.env.VITE_API_URL

  /**
   * Get authentication headers for API requests
   */
  private static getAuthHeaders(): HeadersInit {
    const userStore = useUserStore()
    const token = userStore.auth?.token

    if (!token) {
      throw new Error('Authentication token not found')
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  /**
   * Handle API response errors with consistent error messages
   */
  private static handleApiError(response: Response, operation: string): never {
    if (response.status === 401) {
      throw new Error('Authentication failed')
    } else if (response.status === 404) {
      throw new Error(`${operation} not found`)
    } else {
      throw new Error(`Failed to ${operation.toLowerCase()}`)
    }
  }

  /**
   * Fetch available quizzes
   */
  static async getAvailableQuizzes(): Promise<AvailableQuizzesResponse> {
    try {
      const response = await fetch(`${this.API_URL}/quiz/available`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          try {
            const userStore = useUserStore()
            const refreshResponse = await refreshToken()
            if (userStore.auth && refreshResponse.data) {
              userStore.auth.token = refreshResponse.data.token
              userStore.auth.expires_at = refreshResponse.data.expires_at

              const auth = {
                token: refreshResponse.data.token,
                expires_at: refreshResponse.data.expires_at,
              }
              localStorage.setItem('auth_token', JSON.stringify(auth))

              return await this.getAvailableQuizzes()
            } else {
              throw new Error('Session expired, please login again')
            }
          } catch (error) {  
            throw error
          }
        } else {
          this.handleApiError(response, 'fetch available quizzes')
        }
      }

      const data: AvailableQuizzesResponse = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'API returned unsuccessful response')
      }

      return data
    } catch (error) {  
      throw error
    }
  }

  /**
   * Get quiz detail and questions
   */
  static async getQuizDetail(quizId: string): Promise<QuizDetailResponse> {
    if (!quizId) {
      throw new Error('Quiz ID is required')
    }

    try {
      const response = await fetch(`${this.API_URL}/quiz/${quizId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          try {
            const userStore = useUserStore()
            const refreshResponse = await refreshToken()
            if (userStore.auth && refreshResponse.data) {
              userStore.auth.token = refreshResponse.data.token
              userStore.auth.expires_at = refreshResponse.data.expires_at

              const auth = {
                token: refreshResponse.data.token,
                expires_at: refreshResponse.data.expires_at,
              }
              localStorage.setItem('auth_token', JSON.stringify(auth))

              return await this.getQuizDetail(quizId)
            } else {
              throw new Error('Session expired, please login again')
            }
          } catch (error) {  
            throw error
          }
        } else {
          this.handleApiError(response, 'Quiz')
        }
      }

      return await response.json()
    } catch (error) {  
      throw error
    }
  }

  /**
   * Get user's quiz submissions
   */
  static async getQuizSubmissions(): Promise<QuizSubmissionsResponse> {
    try {
      const response = await fetch(`${this.API_URL}/quiz/submissions`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          try {
            const userStore = useUserStore()
            const refreshResponse = await refreshToken()
            if (userStore.auth && refreshResponse.data) {
              userStore.auth.token = refreshResponse.data.token
              userStore.auth.expires_at = refreshResponse.data.expires_at

              const auth = {
                token: refreshResponse.data.token,
                expires_at: refreshResponse.data.expires_at,
              }
              localStorage.setItem('auth_token', JSON.stringify(auth))

              return await this.getQuizSubmissions()
            } else {
              throw new Error('Session expired, please login again')
            }
          } catch (error) {  
            throw error
          }
        } else {
          this.handleApiError(response, 'fetch quiz submissions')
        }
      }

      const data: QuizSubmissionsResponse = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch submissions')
      }

      return data
    } catch (error) {  
      throw error
    }
  }

  /**
   * Get quiz result by quiz ID
   */
  static async getQuizResult(quizId: string): Promise<QuizResultResponse> {
    if (!quizId) {
      throw new Error('Quiz ID is required')
    }

    try {
      const response = await fetch(`${this.API_URL}/quiz/submission/${quizId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          try {
            const userStore = useUserStore()
            const refreshResponse = await refreshToken()
            if (userStore.auth && refreshResponse.data) {
              userStore.auth.token = refreshResponse.data.token
              userStore.auth.expires_at = refreshResponse.data.expires_at

              const auth = {
                token: refreshResponse.data.token,
                expires_at: refreshResponse.data.expires_at,
              }
              localStorage.setItem('auth_token', JSON.stringify(auth))

              return await this.getQuizResult(quizId)
            } else {
              throw new Error('Session expired, please login again')
            }
          } catch (error) {  
            throw error
          }
        } else {
          this.handleApiError(response, 'Quiz result')
        }
      }

      const data: QuizResultResponse = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch quiz result')
      }

      return data
    } catch (error) {  
      throw error
    }
  }

  /**
   * Submit quiz answers
   */
  static async submitQuiz(submission: QuizSubmissionPayload): Promise<QuizSubmissionResponse> {
    if (!submission) {
      throw new Error('Submission data is required')
    }

    try {
      const response = await fetch(`${this.API_URL}/quiz/submit`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(submission),
      })

      if (!response.ok) {
        if (response.status === 401) {
          try {
            const userStore = useUserStore()
            const refreshResponse = await refreshToken()
            if (userStore.auth && refreshResponse.data) {
              userStore.auth.token = refreshResponse.data.token
              userStore.auth.expires_at = refreshResponse.data.expires_at

              const auth = {
                token: refreshResponse.data.token,
                expires_at: refreshResponse.data.expires_at,
              }
              localStorage.setItem('auth_token', JSON.stringify(auth))

              return await this.submitQuiz(submission)
            } else {
              throw new Error('Session expired, please login again')
            }
          } catch (error) {  
            throw error
          }
        } else {
          this.handleApiError(response, 'submit quiz')
        }
      }

      const data: QuizSubmissionResponse = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Quiz submission failed')
      }

      return data
    } catch (error) {  
      throw error
    }
  }

  /**
   * Check if user can submit a specific quiz
   */
  static async checkQuizSubmission(quizId: string): Promise<SubmissionCheckResponse> {
    if (!quizId) {
      throw new Error('Quiz ID is required')
    }

    try {
      const response = await fetch(`${this.API_URL}/quiz/check/${quizId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          try {
            const userStore = useUserStore()
            const refreshResponse = await refreshToken()
            if (userStore.auth && refreshResponse.data) {
              userStore.auth.token = refreshResponse.data.token
              userStore.auth.expires_at = refreshResponse.data.expires_at

              const auth = {
                token: refreshResponse.data.token,
                expires_at: refreshResponse.data.expires_at,
              }
              localStorage.setItem('auth_token', JSON.stringify(auth))

              return await this.checkQuizSubmission(quizId)
            } else {
              throw new Error('Session expired, please login again')
            }
          } catch (error) {  
            throw error
          }
        } else {
          this.handleApiError(response, 'check quiz submission')
        }
      }

      const data: SubmissionCheckResponse = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to check submission status')
      }

      return data
    } catch (error) {  
      throw error
    }
  }
}

// Export individual functions for backward compatibility
export const getAvailableQuizzes = QuizService.getAvailableQuizzes.bind(QuizService)
export const getQuizDetail = QuizService.getQuizDetail.bind(QuizService)
export const getQuizSubmissions = QuizService.getQuizSubmissions.bind(QuizService)
export const getQuizResult = QuizService.getQuizResult.bind(QuizService)
export const submitQuiz = QuizService.submitQuiz.bind(QuizService)
export const checkQuizSubmission = QuizService.checkQuizSubmission.bind(QuizService)
