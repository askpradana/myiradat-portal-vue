import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AvatarCache, PersonMetadata, CompanyMetadata } from '@/types/avatar'

// Apple/shadcn-ui inspired gradient avatar generation
const generateGradientAvatarUrl = (seed: string, initials: string): string => {
  // For now, return a data URL with SVG gradient avatar
  // This matches the ProfileHeader.vue gradient system
  const gradientColors = [
    ['#f1f5f9', '#e2e8f0'], // slate
    ['#f9fafb', '#f3f4f6'], // gray
    ['#fafaf9', '#f5f5f4'], // stone
    ['#fafafa', '#f5f5f5'], // neutral
    ['#fafafa', '#f4f4f5'], // zinc
    ['#fdf2f8', '#fce7f3']  // rose
  ]

  const textColors = [
    '#334155', // slate-700
    '#374151', // gray-700
    '#57534e', // stone-700
    '#404040', // neutral-700
    '#3f3f46', // zinc-700
    '#be185d'  // rose-700
  ]

  // Generate consistent index based on seed
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const index = Math.abs(hash) % gradientColors.length

  const [color1, color2] = gradientColors[index]
  const textColor = textColors[index]

  const svg = `
    <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1}" />
          <stop offset="100%" style="stop-color:${color2}" />
        </linearGradient>
      </defs>
      <circle cx="64" cy="64" r="64" fill="url(#grad)" />
      <text x="64" y="64" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="600" text-anchor="middle" dominant-baseline="central" fill="${textColor}">${initials}</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

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
        // Fallback to local gradient avatar generation
        const initials = metadata?.name
          ?.split(' ')
          .map(n => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'U'

        // Generate gradient-based avatar URL with consistent coloring
        avatarUrl = generateGradientAvatarUrl(seed, initials)
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
      
      // Return fallback gradient avatar
      const initials = metadata?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U'

      return generateGradientAvatarUrl(seed, initials)
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