import { ref } from 'vue'

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void
    }
  }
}

export interface UmamiConfig {
  websiteId: string
  url: string
}

const isInitialized = ref(false)
const isScriptLoaded = ref(false)
const config = ref<UmamiConfig | null>(null)

export function useUmami() {
  const loadScript = async (umamiConfig: UmamiConfig): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (isScriptLoaded.value && window.umami) {
        resolve(true)
        return
      }

      // Check if script element already exists
      const existingScript = document.querySelector(`script[data-website-id="${umamiConfig.websiteId}"]`)
      if (existingScript) {
        // Script exists, wait for it to load
        const checkForUmami = () => {
          if (window.umami) {
            isScriptLoaded.value = true
            resolve(true)
          } else {
            setTimeout(checkForUmami, 100)
          }
        }
        checkForUmami()
        return
      }

      // Create and inject script
      const script = document.createElement('script')
      script.defer = true
      script.setAttribute('data-website-id', umamiConfig.websiteId)
      script.src = `${umamiConfig.url}/script.js`

      script.onload = () => {
        console.log('Umami script loaded successfully')
        isScriptLoaded.value = true

        // Wait for umami object to be available
        const checkForUmami = () => {
          if (window.umami) {
            resolve(true)
          } else {
            setTimeout(checkForUmami, 100)
          }
        }
        checkForUmami()
      }

      script.onerror = (error) => {
        console.error('Failed to load Umami script:', error)
        reject(new Error('Failed to load Umami script'))
      }

      document.head.appendChild(script)
    })
  }

  const initialize = async (umamiConfig: UmamiConfig) => {
    try {
      config.value = umamiConfig
      await loadScript(umamiConfig)
      isInitialized.value = true
      console.log('Umami initialized successfully')
      return true
    } catch (error) {
      console.error('Failed to initialize Umami:', error)
      return false
    }
  }

  const trackEvent = (event: string, data?: Record<string, unknown>) => {
    if (!isInitialized.value || !window.umami) {
      console.warn('Umami is not initialized or not loaded')
      return
    }

    try {
      console.log('Tracking Umami event:', event, data)
      window.umami.track(event, data)
    } catch (error) {
      console.error('Error tracking Umami event:', error)
    }
  }

  const trackPageView = (path?: string, title?: string) => {
    if (!isInitialized.value || !window.umami) {
      return
    }

    try {
      const eventData: Record<string, unknown> = {}
      if (path) eventData.path = path
      if (title) eventData.title = title

      console.log('Tracking Umami page view:', eventData)
      window.umami.track('pageview', eventData)
    } catch (error) {
      console.error('Error tracking Umami page view:', error)
    }
  }

  const isReady = () => {
    return isInitialized.value && !!window.umami
  }

  const debugInfo = () => {
    return {
      isInitialized: isInitialized.value,
      isScriptLoaded: isScriptLoaded.value,
      hasUmamiObject: !!window.umami,
      config: config.value
    }
  }

  return {
    initialize,
    trackEvent,
    trackPageView,
    isReady,
    debugInfo,
    isInitialized: isInitialized.value
  }
}