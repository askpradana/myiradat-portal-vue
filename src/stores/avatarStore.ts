import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AvatarCache, PersonMetadata, CompanyMetadata } from '@/types/avatar'

export const useAvatarStore = defineStore('avatar', () => {
  // State
  const cache = ref<AvatarCache>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const settings = ref({
    cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours in ms
    retryAttempts: 3,
    enablePersonalAvatars: true,
    enableCompanyLogos: true
  })

  // Getters
  const getCachedAvatar = computed(() => (key: string) => {
    const cached = cache.value[key]
    if (!cached) return null
    
    // Check if cache is still valid
    const isExpired = Date.now() - cached.timestamp > settings.value.cacheExpiry
    if (isExpired) {
      delete cache.value[key]
      return null
    }
    
    return cached
  })

  const isAvatarCached = computed(() => (key: string) => {
    return getCachedAvatar.value(key) !== null
  })

  // Actions
  const generatePersonAvatar = async (seed: string, metadata?: PersonMetadata): Promise<string> => {
    const cacheKey = `person_${seed}`
    
    // Check cache first
    const cached = getCachedAvatar.value(cacheKey)
    if (cached) {
      return cached.url
    }

    try {
      isLoading.value = true
      error.value = null

      // Primary: This Person Does Not Exist with seed
      let avatarUrl = `https://thispersondoesnotexist.com/?seed=${encodeURIComponent(seed)}`
      
      // Test if the URL is accessible (fallback logic)
      try {
        const response = await fetch(avatarUrl, { method: 'HEAD' })
        if (!response.ok) {
          throw new Error('Primary API failed')
        }
      } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // Fallback to UI Avatars with initials
        const initials = metadata?.name
          ?.split(' ')
          .map(n => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'U'
        
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3b82f6&color=fff&size=128&format=png`
      }

      // Cache the result
      cache.value[cacheKey] = {
        url: avatarUrl,
        timestamp: Date.now(),
        type: 'person',
        metadata
      }

      // Persist to localStorage
      localStorage.setItem('avatar_cache', JSON.stringify(cache.value))

      return avatarUrl
    } catch (err) {  
      error.value = err instanceof Error ? err.message : 'Failed to generate avatar'
      
      // Return fallback avatar
      const initials = metadata?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U'
      
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6b7280&color=fff&size=128&format=png`
    } finally {
      isLoading.value = false
    }
  }

  const fetchCompanyLogo = async (companyName: string, metadata?: CompanyMetadata): Promise<string> => {
    const cacheKey = `company_${companyName.toLowerCase().replace(/\s+/g, '_')}`
    
    // Check cache first
    const cached = getCachedAvatar.value(cacheKey)
    if (cached) {
      return cached.url
    }

    try {
      isLoading.value = true
      error.value = null

      let logoUrl = ''

      // Try Clearbit Logo API if domain is provided
      if (metadata?.domain) {
        logoUrl = `https://logo.clearbit.com/${metadata.domain}`
        
        try {
          const response = await fetch(logoUrl, { method: 'HEAD' })
          if (!response.ok) {
            throw new Error('Clearbit API failed')
          }
        } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
          logoUrl = ''
        }
      }

      // Fallback to UI Avatars for company
      if (!logoUrl) {
        const initials = companyName
          .split(' ')
          .map(word => word[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
        
        logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=059669&color=fff&size=128&format=png&rounded=false`
      }

      // Cache the result
      cache.value[cacheKey] = {
        url: logoUrl,
        timestamp: Date.now(),
        type: 'company',
        metadata
      }

      // Persist to localStorage
      localStorage.setItem('avatar_cache', JSON.stringify(cache.value))

      return logoUrl
    } catch (err) {  
      error.value = err instanceof Error ? err.message : 'Failed to fetch company logo'
      
      // Return fallback
      const initials = companyName
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
      
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6b7280&color=fff&size=128&format=png&rounded=false`
    } finally {
      isLoading.value = false
    }
  }

  const preloadAvatars = async (identifiers: Array<{ identifier: string; type: 'person' | 'company'; metadata?: PersonMetadata | CompanyMetadata }>) => {
    const promises = identifiers.map(({ identifier, type, metadata }) => {
      if (type === 'person') {
        return generatePersonAvatar(identifier, metadata as PersonMetadata)
      } else {
        return fetchCompanyLogo(identifier, metadata as CompanyMetadata)
      }
    })

    try {
      await Promise.allSettled(promises)
    } catch (err) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Some avatars failed to preload
    }
  }

  const clearCache = () => {
    cache.value = {}
    localStorage.removeItem('avatar_cache')
  }

  const initializeFromStorage = () => {
    try {
      const stored = localStorage.getItem('avatar_cache')
      if (stored) {
        const parsedCache = JSON.parse(stored)
        
        // Validate and clean expired entries
        const now = Date.now()
        const validCache: AvatarCache = {}
        
        for (const [key, entry] of Object.entries(parsedCache)) {
          // Type guard to ensure entry has the expected structure
          if (
            entry &&
            typeof entry === 'object' &&
            'url' in entry &&
            'timestamp' in entry &&
            'type' in entry &&
            typeof entry.timestamp === 'number' &&
            now - entry.timestamp < settings.value.cacheExpiry
          ) {
            validCache[key] = entry as AvatarCache[string]
          }
        }
        
        cache.value = validCache
      }
    } catch (err) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Failed to load avatar cache from storage
      clearCache()
    }
  }

  const invalidateAvatar = (identifier: string, type: 'person' | 'company') => {
    const key = type === 'person' ? `person_${identifier}` : `company_${identifier.toLowerCase().replace(/\s+/g, '_')}`
    delete cache.value[key]
    localStorage.setItem('avatar_cache', JSON.stringify(cache.value))
  }

  // Initialize cache from localStorage on store creation
  initializeFromStorage()

  return {
    // State
    cache: computed(() => cache.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    settings: computed(() => settings.value),
    
    // Getters
    getCachedAvatar,
    isAvatarCached,
    
    // Actions
    generatePersonAvatar,
    fetchCompanyLogo,
    preloadAvatars,
    clearCache,
    initializeFromStorage,
    invalidateAvatar
  }
})