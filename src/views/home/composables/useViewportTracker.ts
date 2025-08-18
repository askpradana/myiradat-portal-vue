import { onMounted, onUnmounted } from 'vue'
import { useHomepageStore } from '@/stores/homepage'

export const useViewportTracker = () => {
  const homepageStore = useHomepageStore()
  
  const updateViewport = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    homepageStore.updateViewport(width, height)
  }
  
  const handleResize = () => {
    updateViewport()
  }
  
  const handleOrientationChange = () => {
    // Small delay to ensure viewport dimensions are updated after orientation change
    setTimeout(updateViewport, 100)
  }
  
  onMounted(() => {
    // Initial viewport setup
    updateViewport()
    
    // Event listeners
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true })
    
    // Initialize animation preferences
    homepageStore.initializeAnimations()
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', handleOrientationChange)
  })
  
  return {
    viewport: homepageStore.viewport,
    updateViewport
  }
}