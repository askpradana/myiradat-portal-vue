import { ref, onUnmounted } from 'vue'
import { useHomepageStore } from '@/stores/homepage'
import type { AnimationConfig } from '@/types/homepage'

export const useAnimations = () => {
  const homepageStore = useHomepageStore()
  const animatingElements = ref(new Set<Element>())
  
  const defaultConfig: AnimationConfig = {
    duration: 600,
    delay: 0,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    stagger: 100
  }
  
  const fadeInUp = (element: Element, config: Partial<AnimationConfig> = {}) => {
    if (homepageStore.animations.reducedMotion) return Promise.resolve()
    
    const finalConfig = { ...defaultConfig, ...config }
    animatingElements.value.add(element)
    
    return new Promise<void>((resolve) => {
      const animation = element.animate([
        {
          opacity: '0',
          transform: 'translateY(30px)'
        },
        {
          opacity: '1',
          transform: 'translateY(0)'
        }
      ], {
        duration: finalConfig.duration,
        delay: finalConfig.delay,
        easing: finalConfig.easing,
        fill: 'forwards'
      })
      
      animation.onfinish = () => {
        animatingElements.value.delete(element)
        resolve()
      }
    })
  }
  
  const fadeInLeft = (element: Element, config: Partial<AnimationConfig> = {}) => {
    if (homepageStore.animations.reducedMotion) return Promise.resolve()
    
    const finalConfig = { ...defaultConfig, ...config }
    animatingElements.value.add(element)
    
    return new Promise<void>((resolve) => {
      const animation = element.animate([
        {
          opacity: '0',
          transform: 'translateX(-30px)'
        },
        {
          opacity: '1',
          transform: 'translateX(0)'
        }
      ], {
        duration: finalConfig.duration,
        delay: finalConfig.delay,
        easing: finalConfig.easing,
        fill: 'forwards'
      })
      
      animation.onfinish = () => {
        animatingElements.value.delete(element)
        resolve()
      }
    })
  }
  
  const scaleIn = (element: Element, config: Partial<AnimationConfig> = {}) => {
    if (homepageStore.animations.reducedMotion) return Promise.resolve()
    
    const finalConfig = { ...defaultConfig, ...config }
    animatingElements.value.add(element)
    
    return new Promise<void>((resolve) => {
      const animation = element.animate([
        {
          opacity: '0',
          transform: 'scale(0.8)'
        },
        {
          opacity: '1',
          transform: 'scale(1)'
        }
      ], {
        duration: finalConfig.duration,
        delay: finalConfig.delay,
        easing: finalConfig.easing,
        fill: 'forwards'
      })
      
      animation.onfinish = () => {
        animatingElements.value.delete(element)
        resolve()
      }
    })
  }
  
  const staggerChildren = async (container: Element, config: Partial<AnimationConfig> = {}) => {
    if (homepageStore.animations.reducedMotion) return
    
    const finalConfig = { ...defaultConfig, ...config }
    const children = Array.from(container.children)
    
    const promises = children.map((child, index) => {
      return fadeInUp(child, {
        ...finalConfig,
        delay: (finalConfig.delay || 0) + (index * (finalConfig.stagger || 100))
      })
    })
    
    await Promise.all(promises)
  }
  
  const countUp = (element: Element, endValue: number, duration: number = 2000) => {
    if (homepageStore.animations.reducedMotion) {
      element.textContent = endValue.toString()
      return Promise.resolve()
    }
    
    return new Promise<void>((resolve) => {
      const startTime = performance.now()
      const startValue = 0
      
      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
        
        element.textContent = currentValue.toString()
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter)
        } else {
          resolve()
        }
      }
      
      requestAnimationFrame(updateCounter)
    })
  }
  
  const pulse = (element: Element, config: Partial<AnimationConfig> = {}) => {
    if (homepageStore.animations.reducedMotion) return Promise.resolve()
    
    const finalConfig = { ...defaultConfig, ...config, duration: 1000 }
    
    return new Promise<void>((resolve) => {
      const animation = element.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' }
      ], {
        duration: finalConfig.duration,
        delay: finalConfig.delay,
        easing: finalConfig.easing,
        iterations: 1
      })
      
      animation.onfinish = () => resolve()
    })
  }
  
  // Cleanup function
  const cleanup = () => {
    animatingElements.value.forEach(element => {
      const animations = element.getAnimations()
      animations.forEach(animation => animation.cancel())
    })
    animatingElements.value.clear()
  }
  
  onUnmounted(cleanup)
  
  return {
    fadeInUp,
    fadeInLeft,
    scaleIn,
    staggerChildren,
    countUp,
    pulse,
    cleanup
  }
}