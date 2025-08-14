import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import type { ViewportIntersection } from '@/types/homepage'

export const useIntersectionObserver = (
  target: Ref<Element | undefined>,
  options: IntersectionObserverInit = {}
) => {
  const isVisible = ref(false)
  const ratio = ref(0)
  const entry = ref<IntersectionObserverEntry | null>(null)
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
  }
  
  const finalOptions = { ...defaultOptions, ...options }
  
  let observer: IntersectionObserver | null = null
  
  const startObserver = () => {
    if (!target.value || observer) return
    
    observer = new IntersectionObserver((entries) => {
      const currentEntry = entries[0]
      entry.value = currentEntry
      isVisible.value = currentEntry.isIntersecting
      ratio.value = currentEntry.intersectionRatio
    }, finalOptions)
    
    observer.observe(target.value)
  }
  
  const stopObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }
  
  onMounted(() => {
    startObserver()
  })
  
  onUnmounted(() => {
    stopObserver()
  })
  
  // Watch for changes in target
  const updateTarget = (newTarget: Element) => {
    stopObserver()
    target.value = newTarget
    startObserver()
  }
  
  return {
    isVisible,
    ratio,
    entry,
    startObserver,
    stopObserver,
    updateTarget
  }
}

export const useMultipleIntersectionObserver = (
  targets: Ref<Element[]>,
  options: IntersectionObserverInit = {}
) => {
  const visibilityMap = ref<Map<Element, ViewportIntersection>>(new Map())
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  }
  
  const finalOptions = { ...defaultOptions, ...options }
  
  let observer: IntersectionObserver | null = null
  
  const startObserver = () => {
    if (observer) return
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibilityMap.value.set(entry.target, {
          isVisible: entry.isIntersecting,
          ratio: entry.intersectionRatio,
          element: entry.target
        })
      })
    }, finalOptions)
    
    targets.value.forEach(target => {
      if (target) observer?.observe(target)
    })
  }
  
  const stopObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    visibilityMap.value.clear()
  }
  
  const addTarget = (target: Element) => {
    if (observer && target) {
      observer.observe(target)
      visibilityMap.value.set(target, {
        isVisible: false,
        ratio: 0,
        element: target
      })
    }
  }
  
  const removeTarget = (target: Element) => {
    if (observer && target) {
      observer.unobserve(target)
      visibilityMap.value.delete(target)
    }
  }
  
  onMounted(() => {
    startObserver()
  })
  
  onUnmounted(() => {
    stopObserver()
  })
  
  return {
    visibilityMap,
    startObserver,
    stopObserver,
    addTarget,
    removeTarget
  }
}