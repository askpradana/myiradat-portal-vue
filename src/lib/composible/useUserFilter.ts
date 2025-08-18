import { ref, computed, watch } from 'vue'
import { type UserFilterParams, DEFAULT_FILTERS } from '@/types/userFilterType'
import { isFilterActive, getActiveFilterCount, buildFilterSummary } from '@/types/userFilterType'

export const useUserFilters = (initialFilters: UserFilterParams = {}) => {
  // State
  const currentPage = ref(1)
  const filters = ref<UserFilterParams>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  })
  const showAdvancedFilters = ref(false)
  const quickSearch = ref('')

  // Computed properties
  const hasActiveFilters = computed(() => {
    return isFilterActive(filters.value) || quickSearch.value.length > 0
  })

  const activeFilterCount = computed(() => {
    return getActiveFilterCount(filters.value) + (quickSearch.value ? 1 : 0)
  })

  const filterSummary = computed(() => {
    const summary = buildFilterSummary(filters.value)
    if (quickSearch.value) {
      return `Quick search: "${quickSearch.value}"`
    }
    return summary
  })

  const queryParams = computed(() => {
    const params: UserFilterParams = {
      page: currentPage.value,
      ...filters.value,
    }

    // Use quick search if no advanced filters are set
    if (!isFilterActive(filters.value) && quickSearch.value) {
      params.search = quickSearch.value
    }

    return params
  })

  // Methods
  const updateFilters = (newFilters: Partial<UserFilterParams>) => {
    filters.value = {
      ...filters.value,
      ...newFilters,
    }
    currentPage.value = 1 // Reset page when filters change
  }

  const resetFilters = () => {
    filters.value = { ...DEFAULT_FILTERS }
    quickSearch.value = ''
    currentPage.value = 1
  }

  const clearQuickSearch = () => {
    quickSearch.value = ''
    currentPage.value = 1
  }

  const toggleAdvancedFilters = () => {
    showAdvancedFilters.value = !showAdvancedFilters.value

    if (!showAdvancedFilters.value) {
      // When hiding advanced filters, reset to defaults but keep quick search
      filters.value = { ...DEFAULT_FILTERS }
    } else {
      // When showing advanced filters, clear quick search
      quickSearch.value = ''
    }
  }

  const setPage = (page: number) => {
    currentPage.value = page
  }

  const goToNextPage = () => {
    currentPage.value++
  }

  const goToPrevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const goToFirstPage = () => {
    currentPage.value = 1
  }

  const goToLastPage = (totalPages: number) => {
    currentPage.value = totalPages
  }

  // Search methods with debouncing
  let searchTimeout: number

  const handleQuickSearch = (query: string) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      quickSearch.value = query
      currentPage.value = 1
      // Clear advanced filters when using quick search
      if (isFilterActive(filters.value)) {
        filters.value = { ...DEFAULT_FILTERS }
      }
    }, 500)
  }

  const handleAdvancedSearch = (searchBy: string, searchQuery: string) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      updateFilters({
        search_by: searchBy as 'name' | 'email' | 'phone',
        search_query: searchQuery,
      })
      // Clear quick search when using advanced search
      quickSearch.value = ''
    }, 500)
  }

  // Filter presets
  const applyPreset = (
    preset: 'verified_users' | 'unverified_users' | 'admins' | 'recent_users',
  ) => {
    resetFilters()

    switch (preset) {
      case 'verified_users':
        updateFilters({
          filter_email_verified: 'true',
          order_by: 'created_at',
          order_direction: 'desc',
        })
        break
      case 'unverified_users':
        updateFilters({
          filter_email_verified: 'false',
          order_by: 'created_at',
          order_direction: 'desc',
        })
        break
      case 'admins':
        updateFilters({
          filter_role: 'admin',
          order_by: 'name',
          order_direction: 'asc',
        })
        break
      case 'recent_users':
        updateFilters({
          order_by: 'created_at',
          order_direction: 'desc',
          page_size: 10,
        })
        break
    }
  }

  // URL synchronization (optional)
  const syncWithURL = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const params = url.searchParams

      // Read from URL
      const urlFilters: UserFilterParams = {}

      if (params.get('page')) urlFilters.page = parseInt(params.get('page')!)
      if (params.get('search')) quickSearch.value = params.get('search')!
      if (params.get('search_by')) urlFilters.search_by = params.get('search_by') as any
      if (params.get('search_query')) urlFilters.search_query = params.get('search_query')!
      if (params.get('filter_role')) urlFilters.filter_role = params.get('filter_role')!
      if (params.get('filter_organization'))
        urlFilters.filter_organization = params.get('filter_organization')!
      if (params.get('filter_email_verified'))
        urlFilters.filter_email_verified = params.get('filter_email_verified')!
      if (params.get('order_by')) urlFilters.order_by = params.get('order_by') as any
      if (params.get('order_direction'))
        urlFilters.order_direction = params.get('order_direction') as any
      if (params.get('page_size')) urlFilters.page_size = parseInt(params.get('page_size')!)

      if (Object.keys(urlFilters).length > 0) {
        filters.value = { ...filters.value, ...urlFilters }
        currentPage.value = urlFilters.page || 1
      }
    }
  }

  const updateURL = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const params = url.searchParams

      // Clear existing filter params
      const filterKeys = [
        'page',
        'search',
        'search_by',
        'search_query',
        'filter_role',
        'filter_organization',
        'filter_email_verified',
        'order_by',
        'order_direction',
        'page_size',
      ]
      filterKeys.forEach((key) => params.delete(key))

      // Add current filters
      if (currentPage.value > 1) params.set('page', currentPage.value.toString())
      if (quickSearch.value) params.set('search', quickSearch.value)

      Object.entries(filters.value).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          params.set(key, value.toString())
        }
      })

      window.history.replaceState({}, '', url.toString())
    }
  }

  // Watch for changes to update URL
  watch(
    [queryParams, quickSearch],
    () => {
      updateURL()
    },
    { deep: true },
  )

  return {
    // State
    currentPage,
    filters,
    quickSearch,
    showAdvancedFilters,

    // Computed
    hasActiveFilters,
    activeFilterCount,
    filterSummary,
    queryParams,

    // Methods
    updateFilters,
    resetFilters,
    clearQuickSearch,
    toggleAdvancedFilters,
    setPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    handleQuickSearch,
    handleAdvancedSearch,
    applyPreset,
    syncWithURL,
    updateURL,
  }
}
