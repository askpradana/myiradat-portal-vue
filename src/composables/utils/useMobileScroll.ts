import { nextTick, ref, onMounted, onUnmounted } from 'vue'

interface ScrollOptions {
  behavior?: 'auto' | 'smooth'
  top?: number
}

interface MobileScrollComposable {
  scrollToTop: (delay?: number) => Promise<void>
  scrollToTopImmediate: () => void
}

export const useMobileScroll = (): MobileScrollComposable => {
  // Use reactive ref for mobile detection that updates with window resize
  const isMobile = ref(false)

  /**
   * Update mobile state based on viewport width
   * Uses Tailwind's 'sm' breakpoint (640px) as the threshold
   */
  const updateMobileState = (): void => {
    if (typeof window === 'undefined') return
    isMobile.value = window.innerWidth < 640
  }

  /**
   * Initialize mobile detection on mount
   */
  onMounted(() => {
    updateMobileState()
    window.addEventListener('resize', updateMobileState)
  })

  /**
   * Cleanup event listener
   */
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateMobileState)
    }
  })

  /**
   * Check if user prefers reduced motion for accessibility
   */
  const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Scroll to top with proper accessibility considerations
   */
  const performScroll = (options: ScrollOptions = {}): void => {
    if (typeof window === 'undefined') return

    const scrollOptions: ScrollToOptions = {
      top: options.top ?? 0,
      behavior: prefersReducedMotion() ? 'auto' : (options.behavior ?? 'smooth')
    }

    try {
      window.scrollTo(scrollOptions)
    } catch {
      // Fallback for older browsers - no console logging in production
      document.documentElement.scrollTop = scrollOptions.top ?? 0
      document.body.scrollTop = scrollOptions.top ?? 0 // Safari fallback
    }
  }

  /**
   * Scroll to top on mobile with Vue's nextTick for proper timing
   * @param delay - Optional delay in milliseconds before scrolling
   */
  const scrollToTop = async (delay: number = 0): Promise<void> => {
    // Only scroll on mobile devices
    if (!isMobile.value) return

    // Wait for Vue to update DOM
    await nextTick()

    // Optional delay for animations to complete
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    performScroll({ behavior: 'smooth' })
  }

  /**
   * Immediate scroll to top without waiting for nextTick
   * Useful for emergency cases or when DOM updates aren't needed
   */
  const scrollToTopImmediate = (): void => {
    if (!isMobile.value) return
    performScroll({ behavior: 'smooth' })
  }

  return {
    scrollToTop,
    scrollToTopImmediate
  }
}