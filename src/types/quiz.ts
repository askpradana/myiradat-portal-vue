// Quiz Type Definitions
export type QuizType = 'likert4' | 'likert5' | 'yesno' | 'multiple_choice'

// Core Quiz Interface with stronger typing
export interface Quiz {
  id: string
  title: string
  description: string
  time_limit: number // in minutes
  quiz_type: QuizType
  questions?: number | null
  is_completed?: boolean
  completed_at?: string | null
}

// Question Interface with stronger typing
export interface Question {
  question_number: number
  question_content: string
  question_type: QuizType
  options: Array<{
    value: number
    label: string
  }>
}

// Quiz Answer Interface
export interface QuizAnswer {
  question_number: number
  answer: number
  time_spent?: number // in seconds
}

// Quiz Session Interface for managing active quiz state
export interface QuizSession {
  quiz_id: string
  start_time: Date
  answers: Map<number, number>
  time_elapsed: number
  is_submitted: boolean
  current_question: number
}

// Quiz Submission Interface for API
export interface QuizSubmissionPayload {
  quiz_id: string
  answers: Record<string, number> // {"1": 3, "2": 1, ...}
  time_taken: number // in seconds
}

// Quiz Result/Score Interface
export interface QuizScore {
  total_score: number
  calculated_at: string
  interpretation: string
  severity_level: string
  recommendations: string // API returns string, not array
  max_possible_score: number
}

// Completed Quiz Submission Interface
export interface QuizSubmission {
  id: string
  quiz_id: string
  quiz_title: string
  completed_at: string
  time_taken: number
  email_sent: boolean
}

// Detailed Quiz Result Interface
export interface QuizResult {
  id: string
  quiz_id: string
  quiz_title: string
  score: QuizScore
  completed_at: string
  time_taken: number
  email_sent: boolean
}

// Base API Response Interface for consistent error handling
interface BaseAPIResponse {
  success: boolean
  message: string
  timestamp: string
}

// API Response Interfaces with stronger typing
export interface AvailableQuizzesResponse extends BaseAPIResponse {
  success: true
  data: {
    quizzes: Quiz[]
    total: number
  }
}

export interface QuizDetailResponse extends BaseAPIResponse {
  success: true
  data: {
    quiz: Quiz
    questions: Question[]
  }
}

export interface QuizSubmissionResponse extends BaseAPIResponse {
  success: true
  data: {
    id: string
    quiz_id: string
    score: QuizScore
    completed_at: string
    user: {
      id: string
      name: string
      email: string
      role_name: string
      is_anonymous: boolean
    }
  }
}

export interface QuizSubmissionsResponse extends BaseAPIResponse {
  success: true
  data: {
    submissions: QuizSubmission[]
    total: number
  }
}

export interface QuizResultResponse extends BaseAPIResponse {
  success: true
  data: QuizResult
}

// Error Response Interface
export interface APIErrorResponse extends BaseAPIResponse {
  success: false
  data?: never
}

// Union types for all API responses (discriminated unions for better type safety)
export type QuizAPIResponse<T extends BaseAPIResponse> = T | APIErrorResponse

// Quiz Submission Check Interfaces
export interface QuizSubmissionStatus {
  can_submit: boolean
  already_exists: boolean
  message: string
}

export interface SubmissionCheckResponse extends BaseAPIResponse {
  success: true
  data: QuizSubmissionStatus
}

// Likert Scale Options
export interface LikertOption {
  value: number
  label: string
  description?: string
}

// Quiz Navigation State
export interface QuizNavigation {
  canGoPrevious: boolean
  canGoNext: boolean
  isLastQuestion: boolean
  isFirstQuestion: boolean
}

// Quiz Progress Interface
export interface QuizProgress {
  current: number
  total: number
  percentage: number
  answered: number[]
  unanswered: number[]
}

// Quiz Timer Interface
export interface QuizTimer {
  started_at: Date
  elapsed_seconds: number
  time_limit_seconds: number
  remaining_seconds: number
  is_expired: boolean
}

// Error Interfaces
export interface QuizError {
  type: 'network' | 'validation' | 'timeout' | 'permission' | 'submission'
  message: string
  details?: string
  retry_action?: () => void
}

// Loading States
export type QuizLoadingState = 'idle' | 'loading' | 'submitting' | 'error' | 'success'

// Quiz State for Store
export interface QuizState {
  availableQuizzes: Quiz[]
  completedQuizzes: QuizSubmission[]
  currentQuiz: Quiz | null
  currentSession: QuizSession | null
  currentQuestions: Question[]
  submissionStatuses: Record<string, QuizSubmissionStatus>
  loadingState: QuizLoadingState
  error: QuizError | null
}