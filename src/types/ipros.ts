// IPROS External Sync Type Definitions

export type QuizPrivileges = 'full' | 'none'

// PPI (Psychological Profile Inventory) Result Interfaces
export interface PPIAspect {
  aspek: string
  definisi_aspek: string
  hasil: string
  skor: number
}

export interface PPIResult {
  result: PPIAspect[]
}

// RIASEC Result Interfaces
export interface RIASECScores {
  artistic: number
  conventional: number
  enterprising: number
  investigative: number
  realistic: number
  social: number
}

export interface RIASECResult {
  result: {
    karir: string
    kepribadian: string
    pendidikan: string
    potensi: string
    scores: RIASECScores
    top_three: string
  }
}

// Quiz Results Container
export interface QuizResults {
  ppi?: PPIResult
  riasec?: RIASECResult
}

// IPROS Sync Response Data (Full Privileges)
export interface IPROSSyncDataFull {
  user_id: string
  email: string
  name: string
  grade: string
  school: string
  phone_number: string
  quiz_privileges: 'full'
  completed_quizzes: string[]
  quiz_results: QuizResults
  synced_at: string
}

// IPROS Sync Response Data (No Privileges)
export interface IPROSSyncDataEmpty {
  user_id: string
  email: string
  name: string
  grade: string
  school: string
  phone_number: string
  quiz_privileges: 'none'
  completed_quizzes: string[]
  quiz_results: Record<string, never>
  synced_at: string
}

// Union type for IPROS sync response data
export type IPROSSyncData = IPROSSyncDataFull | IPROSSyncDataEmpty

// Base API Response Interface
export interface BaseIPROSResponse {
  message: string
  code: number
  status: string
}

// IPROS Sync API Response
export interface IPROSSyncResponse extends BaseIPROSResponse {
  data: IPROSSyncData
}

// Error Response
export interface IPROSSyncErrorResponse extends BaseIPROSResponse {
  data?: never
}

// Union type for all possible responses
export type IPROSSyncApiResponse = IPROSSyncResponse | IPROSSyncErrorResponse

// Processed IPROS Data for UI Components
export interface ProcessedIPROSData {
  hasPrivileges: boolean
  quizPrivileges: QuizPrivileges
  ppiResults: PPIAspect[] | null
  riasecResults: RIASECResult['result'] | null
  syncedAt: string
  userInfo: {
    userId: string
    email: string
    name?: string
    grade?: string
    school?: string
  }
}

// Loading States for IPROS Sync
export type IPROSSyncState = 'idle' | 'syncing' | 'success' | 'error'

// IPROS Sync Error Interface
export interface IPROSSyncError {
  message: string
  code?: number
  context?: string
}

// Score Interpretation for IPROS Scores
export interface IPROSScoreInterpretation {
  level: 'low' | 'medium' | 'high'
  color: 'red' | 'yellow' | 'green'
  description: string
  range: string
}

// RIASEC Personality Type Information
export interface RIASECPersonalityType {
  code: keyof RIASECScores
  name: string
  careers: string[]
}

// Export utility type guards
export function hasFullPrivileges(data: IPROSSyncData): data is IPROSSyncDataFull {
  return data.quiz_privileges === 'full'
}

export function hasNoPrivileges(data: IPROSSyncData): data is IPROSSyncDataEmpty {
  return data.quiz_privileges === 'none'
}

// RIASEC Personality Type Definitions
export const RIASEC_TYPES: Record<keyof RIASECScores, RIASECPersonalityType> = {
  realistic: {
    code: 'realistic',
    name: 'Realistic',
    careers: ['Teknisi', 'Insinyur', 'Mekanik', 'Petani']
  },
  investigative: {
    code: 'investigative',
    name: 'Investigative',
    careers: ['Peneliti', 'Ilmuwan', 'Dokter', 'Analis']
  },
  artistic: {
    code: 'artistic',
    name: 'Artistic',
    careers: ['Seniman', 'Desainer', 'Penulis', 'Musisi']
  },
  social: {
    code: 'social',
    name: 'Social',
    careers: ['Guru', 'Konselor', 'Perawat', 'Psikolog']
  },
  enterprising: {
    code: 'enterprising',
    name: 'Enterprising',
    careers: ['Manajer', 'Penjual', 'Pengacara', 'Wirausaha']
  },
  conventional: {
    code: 'conventional',
    name: 'Conventional',
    careers: ['Akuntan', 'Administrator', 'Pustakawan', 'Analis Data']
  }
}