import { ref, readonly, onUnmounted } from 'vue'

interface AnimationController {
  isAnimating: boolean
  activeIndex: number
  cleanup: () => void
}

const animationControllers = new Map<string, AnimationController>()

export function useBentoAnimation(animationId?: string) {
  const isAnimating = ref(false)
  const activeSource = ref(0)
  const animationController = ref<AbortController | null>(null)

  // Timing state for proper pause/resume
  let startTime = 0
  let pausedTime = 0

  const startAnimation = (sources: string[], interval = 2000) => {
    if (animationController.value) return // Already running

    animationController.value = new AbortController()
    isAnimating.value = true
    startTime = Date.now()
    pausedTime = 0

    const animate = () => {
      if (animationController.value?.signal.aborted) return

      activeSource.value = (activeSource.value + 1) % sources.length

      // Schedule next animation with precise timing
      const timeoutId = setTimeout(() => {
        if (!animationController.value?.signal.aborted) {
          animate()
        }
      }, interval)

      // Store timeout ID for proper cleanup
      if (animationController.value) {
        animationController.value.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId)
        })
      }
    }

    // Start animation after initial delay
    const initialTimeoutId = setTimeout(animate, interval)
    if (animationController.value) {
      animationController.value.signal.addEventListener('abort', () => {
        clearTimeout(initialTimeoutId)
      })
    }

    // Store controller for cleanup if animationId provided
    if (animationId && animationController.value) {
      animationControllers.set(animationId, {
        isAnimating: isAnimating.value,
        activeIndex: activeSource.value,
        cleanup: stopAnimation
      })
    }
  }

  const stopAnimation = () => {
    if (animationController.value) {
      animationController.value.abort()
      animationController.value = null
    }
    isAnimating.value = false
    
    if (animationId) {
      animationControllers.delete(animationId)
    }
  }

  const pauseAnimation = () => {
    if (animationController.value && isAnimating.value) {
      pausedTime = Date.now()
      animationController.value.abort()
      animationController.value = null
      isAnimating.value = false
    }
  }

  const resumeAnimation = (sources: string[], interval = 2000) => {
    if (!animationController.value && !isAnimating.value) {
      // Calculate remaining time in the current cycle if we were paused
      let nextDelay = interval
      if (pausedTime > 0 && startTime > 0) {
        const elapsed = pausedTime - startTime
        const cyclePosition = elapsed % interval
        nextDelay = interval - cyclePosition

        // Ensure minimum delay to prevent too rapid transitions
        if (nextDelay < 100) {
          nextDelay = interval
        }
      }

      animationController.value = new AbortController()
      isAnimating.value = true
      startTime = Date.now() - (pausedTime > 0 ? (pausedTime - startTime) % interval : 0)

      const animate = () => {
        if (animationController.value?.signal.aborted) return

        activeSource.value = (activeSource.value + 1) % sources.length

        // Schedule next animation with consistent timing
        const timeoutId = setTimeout(() => {
          if (!animationController.value?.signal.aborted) {
            animate()
          }
        }, interval)

        if (animationController.value) {
          animationController.value.signal.addEventListener('abort', () => {
            clearTimeout(timeoutId)
          })
        }
      }

      // Start with calculated delay to maintain timing
      const resumeTimeoutId = setTimeout(animate, nextDelay)
      if (animationController.value) {
        animationController.value.signal.addEventListener('abort', () => {
          clearTimeout(resumeTimeoutId)
        })
      }
    }
  }

  // Cleanup on component unmount
  onUnmounted(() => {
    stopAnimation()
  })

  return {
    isAnimating: readonly(isAnimating),
    activeSource: readonly(activeSource),
    startAnimation,
    stopAnimation,
    pauseAnimation,
    resumeAnimation
  }
}

// Global animation management utilities
export function pauseAllAnimations() {
  animationControllers.forEach(controller => {
    controller.cleanup()
  })
}

export function getActiveAnimations() {
  return Array.from(animationControllers.keys())
}

// Utility for reduced motion preference
export function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Enhanced animation composable with intersection observer for performance
export function useBentoAnimationWithIntersection(animationId?: string) {
  const baseAnimation = useBentoAnimation(animationId)
  const isInView = ref(false)
  const targetElement = ref<HTMLElement | null>(null)
  
  let observer: IntersectionObserver | null = null

  const observeElement = (element: HTMLElement, sources: string[], interval = 2000) => {
    if (!element) return
    targetElement.value = element
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isInView.value = entry.isIntersecting
          
          if (entry.isIntersecting && !shouldReduceMotion()) {
            baseAnimation.startAnimation(sources, interval)
          } else {
            baseAnimation.pauseAnimation()
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )
    
    observer.observe(element)
  }

  const stopObserving = () => {
    if (observer && targetElement.value) {
      observer.unobserve(targetElement.value)
      observer.disconnect()
      observer = null
    }
    baseAnimation.stopAnimation()
  }

  onUnmounted(() => {
    stopObserving()
  })

  return {
    ...baseAnimation,
    isInView: readonly(isInView),
    observeElement,
    stopObserving
  }
}