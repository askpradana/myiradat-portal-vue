import { ref, computed, reactive, readonly, onMounted, onUnmounted } from 'vue'
import type { BentoGridLayout, BentoCard } from '@/types/homepage'

export interface BreakpointConfig {
  mobile: number
  tablet: number
  desktop: number
}

export interface GridDimensions {
  columns: number
  rows: number
  gap: string
  minCardHeight: string
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
}

const defaultGridDimensions = reactive<Record<string, GridDimensions>>({
  mobile: {
    columns: 1,
    rows: 8,
    gap: '1rem',
    minCardHeight: '200px'
  },
  tablet: {
    columns: 4,
    rows: 6,
    gap: '1.25rem',
    minCardHeight: '220px'
  },
  desktop: {
    columns: 6,
    rows: 3,
    gap: '1.5rem',
    minCardHeight: '250px'
  }
})

export function useBentoGrid(
  layout: BentoGridLayout,
  cards: BentoCard[],
  breakpoints: BreakpointConfig = defaultBreakpoints
) {
  const currentBreakpoint = ref<keyof BentoGridLayout>('desktop')
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
  
  // Computed grid template areas based on current breakpoint
  const gridTemplateAreas = computed(() => {
    const areas = layout[currentBreakpoint.value]
    return areas.map(row => `"${row}"`).join(' ')
  })
  
  // Computed grid dimensions
  const gridDimensions = computed(() => {
    return defaultGridDimensions[currentBreakpoint.value]
  })
  
  // Grid container styles
  const gridStyles = computed(() => ({
    display: 'grid',
    gap: gridDimensions.value.gap,
    gridTemplateColumns: `repeat(${gridDimensions.value.columns}, 1fr)`,
    gridTemplateRows: `repeat(${gridDimensions.value.rows}, minmax(${gridDimensions.value.minCardHeight}, auto))`,
    gridTemplateAreas: gridTemplateAreas.value
  }))
  
  // CSS custom properties for dynamic theming
  const gridCSSProperties = computed(() => ({
    '--bento-grid-columns': gridDimensions.value.columns.toString(),
    '--bento-grid-rows': gridDimensions.value.rows.toString(),
    '--bento-grid-gap': gridDimensions.value.gap,
    '--bento-card-min-height': gridDimensions.value.minCardHeight,
    '--bento-grid-areas': gridTemplateAreas.value
  }))
  
  // Responsive breakpoint detection
  const updateBreakpoint = () => {
    if (typeof window === 'undefined') return
    
    const width = window.innerWidth
    windowWidth.value = width
    
    if (width < breakpoints.mobile) {
      currentBreakpoint.value = 'mobile'
    } else if (width < breakpoints.tablet) {
      currentBreakpoint.value = 'mobile' // Still use mobile layout for smaller tablets
    } else if (width < breakpoints.desktop) {
      currentBreakpoint.value = 'tablet'
    } else {
      currentBreakpoint.value = 'desktop'
    }
  }
  
  // Validate grid layout
  const validateLayout = () => {
    const issues: string[] = []
    
    // Check if all cards have valid grid areas in current layout
    const currentAreas = layout[currentBreakpoint.value].join(' ')
    
    cards.forEach(card => {
      if (!currentAreas.includes(card.gridArea)) {
        issues.push(`Card "${card.id}" has invalid grid area "${card.gridArea}" for ${currentBreakpoint.value} layout`)
      }
    })
    
    if (issues.length > 0) {
      console.warn('Bento Grid Layout Issues:', issues)
    }
    
    return issues.length === 0
  }
  
  // Get card order for accessibility (tab order)
  const getCardTabOrder = () => {
    const areas = layout[currentBreakpoint.value]
    const order: string[] = []
    
    areas.forEach(row => {
      const rowAreas = row.split(' ')
      rowAreas.forEach(area => {
        if (!order.includes(area)) {
          order.push(area)
        }
      })
    })
    
    return order
  }
  
  // Utility to get card styles based on grid area
  const getCardStyles = (card: BentoCard) => ({
    gridArea: card.gridArea,
    minHeight: card.size === 'xl' ? '400px' : 
               card.size === 'large' ? '350px' : 
               gridDimensions.value.minCardHeight
  })
  
  // Handle window resize
  let resizeTimeout: number | null = null
  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      updateBreakpoint()
      validateLayout()
    }, 150) // Debounce resize events
  }
  
  // Lifecycle hooks
  onMounted(() => {
    updateBreakpoint()
    validateLayout()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
    }
  })
  
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
    }
    if (resizeTimeout) clearTimeout(resizeTimeout)
  })
  
  // Accessibility helpers
  const getGridAccessibilityAttrs = () => ({
    role: 'region' as const,
    'aria-label': 'Product features showcase',
    'aria-live': 'polite' as const,
    'aria-atomic': false
  })
  
  const getCardAccessibilityAttrs = (card: BentoCard, index: number) => {
    const tabOrder = getCardTabOrder()
    const tabIndex = tabOrder.indexOf(card.gridArea)
    
    return {
      role: 'article',
      'aria-describedby': `${card.id}-description`,
      tabindex: card.interactive ? (tabIndex >= 0 ? tabIndex : 0) : -1,
      'aria-disabled': !card.interactive,
      'aria-posinset': index + 1,
      'aria-setsize': cards.length
    }
  }
  
  return {
    // Reactive state
    currentBreakpoint: readonly(currentBreakpoint),
    windowWidth: readonly(windowWidth),
    gridDimensions: readonly(gridDimensions),
    
    // Computed styles
    gridStyles: readonly(gridStyles),
    gridCSSProperties: readonly(gridCSSProperties),
    gridTemplateAreas: readonly(gridTemplateAreas),
    
    // Methods
    updateBreakpoint,
    validateLayout,
    getCardStyles,
    getCardTabOrder,
    
    // Accessibility
    getGridAccessibilityAttrs,
    getCardAccessibilityAttrs
  }
}

// Utility for creating responsive grid layouts
export function createResponsiveLayout(
  desktopAreas: string[],
  tabletAreas?: string[],
  mobileOrder?: string[]
): BentoGridLayout {
  // Auto-generate tablet layout if not provided
  const autoTablet = tabletAreas || [
    ...desktopAreas.slice(0, 2), // Keep first 2 rows similar
    ...desktopAreas.slice(2).map(row => 
      row.split(' ').reduce((acc, area, i) => {
        if (i % 2 === 0) acc.push([area])
        else acc[acc.length - 1].push(area)
        return acc
      }, [] as string[][]).map(pair => pair.join(' '))
    ).flat()
  ]
  
  // Auto-generate mobile layout if not provided
  const autoMobile = mobileOrder || 
    Array.from(new Set(desktopAreas.join(' ').split(' ')))
  
  return {
    desktop: desktopAreas,
    tablet: autoTablet,
    mobile: autoMobile
  }
}

export default useBentoGrid