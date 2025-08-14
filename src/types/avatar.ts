export interface AvatarConfig {
  identifier: string
  type: 'person' | 'company'
  metadata?: PersonMetadata | CompanyMetadata
}

export interface PersonMetadata {
  name: string
  role?: string
  company?: string
  seed?: string // for consistent generation
}

export interface CompanyMetadata {
  name: string
  domain?: string
  industry?: string
}

export interface AvatarProvider {
  name: string
  baseUrl: string
  rateLimit?: number
  priority: number
  transform?: (identifier: string, options?: Record<string, unknown>) => string
}

export interface AvatarCache {
  [key: string]: {
    url: string
    timestamp: number
    type: 'person' | 'company'
    metadata?: PersonMetadata | CompanyMetadata
  }
}

export interface AvatarState {
  cache: AvatarCache
  isLoading: boolean
  error: string | null
  settings: {
    cacheExpiry: number // 24 hours in ms
    retryAttempts: number
    enablePersonalAvatars: boolean
    enableCompanyLogos: boolean
  }
}

export interface UseAvatarOptions {
  type: 'person' | 'company'
  fallbackUrl?: string
  size?: number
  enableCache?: boolean
  retryOnError?: boolean
}

export interface UseAvatarReturn {
  avatarUrl: import('vue').Ref<string>
  isLoading: import('vue').Ref<boolean>
  error: import('vue').Ref<string | null>
  retry: () => Promise<void>
  refresh: () => Promise<void>
}

export interface DynamicAvatarProps {
  identifier: string // seed for person or company name
  type: 'person' | 'company'
  size?: number
  fallbackSrc?: string
  alt: string
  class?: string
  lazy?: boolean
  retryOnError?: boolean
}