<template>
  <div class="space-y-4 mb-6">
    <!-- Search Input -->
    <div class="relative max-w-md">
      <Input
        v-model="searchInput"
        :placeholder="t('quiz.filters.searchPlaceholder')"
        class="pr-10"
      />
      <button
        v-if="searchInput"
        @click="searchInput = ''"
        type="button"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <X :size="16" />
      </button>
    </div>

    <!-- Filter Badge Groups -->
    <div class="space-y-3">
      <!-- Status Filters -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-muted-foreground mr-2">{{ t('quiz.filters.status') }}:</span>
        <Badge
          v-for="status in statusOptions"
          :key="status.value"
          :variant="localFilters.completion_status === status.value ? 'default' : 'outline'"
          class="cursor-pointer hover:bg-accent transition-colors"
          @click="updateCompletionStatus(status.value)"
        >
          {{ status.label }}
        </Badge>
      </div>

      <!-- Type Filters -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-muted-foreground mr-2">{{ t('quiz.filters.type') }}:</span>
        <Badge
          v-for="type in typeOptions"
          :key="type.value"
          :variant="localFilters.quiz_type === type.value ? 'default' : 'outline'"
          class="cursor-pointer hover:bg-accent transition-colors"
          @click="updateQuizType(type.value)"
        >
          {{ type.label }}
        </Badge>
      </div>

      <!-- Sort Options -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-muted-foreground mr-2">{{ t('quiz.filters.sort') }}:</span>
        <Badge
          v-for="sort in sortOptions"
          :key="sort.value"
          :variant="localFilters.sort_order === sort.value ? 'default' : 'outline'"
          class="cursor-pointer hover:bg-accent transition-colors"
          @click="updateSortOrder(sort.value)"
        >
          {{ sort.label }}
        </Badge>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="pt-3 border-t border-border">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-foreground">{{ t('quiz.filters.active') }}:</span>
        <FilterChip
          v-for="(filter, key) in activeFiltersDisplay"
          :key="key"
          :label="filter.label"
          :value="filter.value"
          :filter-key="key"
          @remove="removeFilter"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { debouncedRef } from '@vueuse/core'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-vue-next'
import FilterChip from '@/components/custom/filters/FilterChip.vue'

// Quiz filter parameters interface
export interface QuizFilterParams {
  search_query?: string
  completion_status?: 'all' | 'available' | 'completed'
  quiz_type?: 'all' | 'likert4' | 'likert5' | 'yesno' | 'multiple_choice'
  sort_order?: 'title_asc' | 'title_desc' | 'time_asc' | 'time_desc'
}

// Component-specific filter params that match form inputs
interface FilterParams {
  search_query?: string
  completion_status?: string
  quiz_type?: string
  sort_order?: string
}

// Props
interface Props {
  initialFilters?: QuizFilterParams
}

const props = withDefaults(defineProps<Props>(), {
  initialFilters: () => ({}),
})

// i18n
const { t } = useI18n()

// Emits
const emit = defineEmits<{
  'filters-changed': [filters: QuizFilterParams]
}>()

// Convert QuizFilterParams to FilterParams for local state
const convertFromQuizFilterParams = (quizParams: QuizFilterParams): FilterParams => {
  const result: FilterParams = {}

  if (quizParams.search_query) result.search_query = quizParams.search_query
  if (quizParams.completion_status) result.completion_status = quizParams.completion_status
  if (quizParams.quiz_type) result.quiz_type = quizParams.quiz_type
  if (quizParams.sort_order) result.sort_order = quizParams.sort_order

  return result
}

// Local state
const localFilters = ref<FilterParams>({
  search_query: '',
  completion_status: 'available', // Default to available only
  quiz_type: 'all',
  sort_order: 'title_asc',
  ...convertFromQuizFilterParams(props.initialFilters || {}),
})

// Search input with debouncing
const searchInput = ref(localFilters.value.search_query || '')
const debouncedSearch = debouncedRef(searchInput, 3000)

// Filter options
const statusOptions = computed(() => [
  { value: 'available', label: t('quiz.filters.availableOnly') },
  { value: 'all', label: t('quiz.filters.allQuizzes') },
  { value: 'completed', label: t('quiz.filters.completedOnly') },
])

const typeOptions = computed(() => [
  { value: 'all', label: t('quiz.filters.allTypes') },
  { value: 'likert4', label: t('quiz.filters.fourPoint') },
  { value: 'likert5', label: t('quiz.filters.fivePoint') },
  { value: 'yesno', label: t('quiz.filters.yesNo') },
  { value: 'multiple_choice', label: t('quiz.filters.multipleChoice') },
])

const sortOptions = computed(() => [
  { value: 'title_asc', label: t('quiz.filters.aToZ') },
  { value: 'title_desc', label: t('quiz.filters.zToA') },
  { value: 'time_asc', label: t('quiz.filters.timeAsc') },
  { value: 'time_desc', label: t('quiz.filters.timeDesc') },
])

// Computed
const hasActiveFilters = computed(() => {
  return Object.entries(localFilters.value).some(([key, value]) => {
    // Ignore default values
    if (key === 'completion_status' && value === 'available') return false
    if (key === 'quiz_type' && value === 'all') return false
    if (key === 'sort_order' && value === 'title_asc') return false
    return value && value.trim() !== ''
  })
})

const activeFiltersDisplay = computed(() => {
  const filters: Record<string, { label: string; value: string }> = {}

  if (localFilters.value.search_query) {
    filters.search_query = {
      label: t('quiz.filters.search'),
      value: localFilters.value.search_query,
    }
  }

  if (localFilters.value.completion_status && localFilters.value.completion_status !== 'available') {
    const statusMap = {
      all: t('quiz.filters.allQuizzes'),
      completed: t('quiz.filters.completedOnly')
    }
    filters.completion_status = {
      label: t('quiz.filters.status'),
      value: statusMap[localFilters.value.completion_status as keyof typeof statusMap] || localFilters.value.completion_status,
    }
  }

  if (localFilters.value.quiz_type && localFilters.value.quiz_type !== 'all') {
    const typeMap = {
      likert4: t('quiz.filters.likert4Point'),
      likert5: t('quiz.filters.likert5Point'),
      yesno: t('quiz.filters.yesNo'),
      multiple_choice: t('quiz.filters.multipleChoice')
    }
    filters.quiz_type = {
      label: t('quiz.filters.type'),
      value: typeMap[localFilters.value.quiz_type as keyof typeof typeMap] || localFilters.value.quiz_type,
    }
  }

  if (localFilters.value.sort_order && localFilters.value.sort_order !== 'title_asc') {
    const sortMap = {
      title_desc: t('quiz.filters.titleZA'),
      time_asc: t('quiz.filters.timeLowHigh'),
      time_desc: t('quiz.filters.timeHighLow')
    }
    filters.sort_order = {
      label: t('quiz.filters.sort'),
      value: sortMap[localFilters.value.sort_order as keyof typeof sortMap] || localFilters.value.sort_order,
    }
  }

  return filters
})

// Convert FilterParams to QuizFilterParams
const convertToQuizFilterParams = (filters: FilterParams): QuizFilterParams => {
  const result: QuizFilterParams = {}

  if (filters.search_query) result.search_query = filters.search_query
  if (filters.completion_status) {
    result.completion_status = filters.completion_status as QuizFilterParams['completion_status']
  }
  if (filters.quiz_type) {
    result.quiz_type = filters.quiz_type as QuizFilterParams['quiz_type']
  }
  if (filters.sort_order) {
    result.sort_order = filters.sort_order as QuizFilterParams['sort_order']
  }

  return result
}

// Methods - Auto-apply filters
const applyFilters = () => {
  // Update search query from debounced input
  localFilters.value.search_query = debouncedSearch.value

  // Remove empty values
  const cleanFilters = Object.entries(localFilters.value).reduce((acc, [key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      acc[key as keyof FilterParams] = value.trim()
    }
    return acc
  }, {} as FilterParams)

  // Convert to QuizFilterParams and emit
  const quizFilterParams = convertToQuizFilterParams(cleanFilters)
  emit('filters-changed', quizFilterParams)
}

// Filter update methods
const updateCompletionStatus = (status: string) => {
  localFilters.value.completion_status = status
  applyFilters()
}

const updateQuizType = (type: string) => {
  localFilters.value.quiz_type = type
  applyFilters()
}

const updateSortOrder = (sort: string) => {
  localFilters.value.sort_order = sort
  applyFilters()
}


const removeFilter = (filterKey: string) => {
  switch (filterKey) {
    case 'search_query':
      searchInput.value = ''
      localFilters.value.search_query = ''
      break
    case 'completion_status':
      localFilters.value.completion_status = 'available'
      break
    case 'quiz_type':
      localFilters.value.quiz_type = 'all'
      break
    case 'sort_order':
      localFilters.value.sort_order = 'title_asc'
      break
  }
  applyFilters()
}

// Watch for debounced search changes
watch(debouncedSearch, () => {
  applyFilters()
})

watch(
  () => props.initialFilters,
  (newFilters) => {
    if (newFilters) {
      const converted = convertFromQuizFilterParams(newFilters)
      localFilters.value = { ...localFilters.value, ...converted }
      if (converted.search_query) {
        searchInput.value = converted.search_query
      }
    }
  },
  { deep: true, immediate: true },
)

// Initialize
onMounted(() => {
  // Apply default filters on mount
  applyFilters()
})
</script>