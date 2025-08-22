<template>
  <AnimatedFilterCard>
    <Card class="mb-6">
    <CardHeader>
      <CardTitle class="text-lg font-semibold text-foreground">Filter Organizations</CardTitle>
      <CardDescription class="text-muted-foreground">
        Filter and sort organizations by various criteria
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <!-- Search Field Selection -->
        <div class="space-y-2">
          <Label for="search-by" class="text-sm font-medium text-foreground">Search By</Label>
          <Select v-model="localFilters.search_by">
            <SelectTrigger>
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <!-- <SelectItem value="description">Description</SelectItem> -->
            </SelectContent>
          </Select>
        </div>

        <!-- Search Query -->
        <div class="space-y-2">
          <Label for="search-query" class="text-sm font-medium text-foreground">Search Query</Label>
          <div class="relative">
            <Input
              id="search-query"
              v-model="localFilters.search_query"
              placeholder="Enter search term..."
              class="pr-10"
              @keydown.enter="applyFilters"
            />
            <button
              v-if="localFilters.search_query"
              @click="localFilters.search_query = ''"
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X :size="16" />
            </button>
          </div>
        </div>

        <!-- Industry Filter -->
        <div class="space-y-2">
          <Label for="filter-industry" class="text-sm font-medium text-foreground">Industry</Label>
          <Input
            id="filter-industry"
            v-model="localFilters.filter_industry"
            placeholder="Enter industry..."
            @keydown.enter="applyFilters"
          />
        </div>

        <!-- Size Category Filter -->
        <div class="space-y-2">
          <Label for="filter-size" class="text-sm font-medium text-foreground">Size Category</Label>
          <Select v-model="localFilters.filter_size">
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Status Filter -->
        <div class="space-y-2">
          <Label for="filter-status" class="text-sm font-medium text-foreground">Status</Label>
          <Select v-model="localFilters.filter_status">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Sort Field -->
        <!-- <div class="space-y-2">
          <Label for="order-by" class="text-sm font-medium text-foreground">Sort By</Label>
          <Select v-model="localFilters.order_by">
            <SelectTrigger>
              <SelectValue placeholder="Sort field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="created_at">Created Date</SelectItem>
              <SelectItem value="updated_at">Updated Date</SelectItem>
            </SelectContent>
          </Select>
        </div> -->

        <!-- Sort Direction -->
        <div class="space-y-2">
          <Label for="order-direction" class="text-sm font-medium text-foreground"
            >Sort Order</Label
          >
          <Select v-model="localFilters.order_direction">
            <SelectTrigger>
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Page Size -->
        <div class="space-y-2">
          <Label for="page-size" class="text-sm font-medium text-foreground">Items per Page</Label>
          <Select v-model="localFilters.page_size">
            <SelectTrigger>
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-border">
        <Button @click="applyFilters" class="flex-1 sm:flex-none">
          <Filter :size="16" class="mr-2" />
          Apply Filters
        </Button>
        <Button variant="outline" @click="resetFilters" class="flex-1 sm:flex-none">
          <RotateCcw :size="16" class="mr-2" />
          Reset Filters
        </Button>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-border">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-medium text-foreground">Active Filters:</span>
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
    </CardContent>
  </Card>
  </AnimatedFilterCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, RotateCcw, X } from 'lucide-vue-next'
import AnimatedFilterCard from '@/components/custom/transitions/AnimatedFilterCard.vue'
import FilterChip from '@/components/custom/filters/FilterChip.vue'
import type { OrganizationFilterParams } from '@/types/organizationType'

// Props
interface Props {
  initialFilters?: OrganizationFilterParams
}

const props = withDefaults(defineProps<Props>(), {
  initialFilters: () => ({}),
})

// Emits
const emit = defineEmits<{
  'filters-changed': [filters: OrganizationFilterParams]
  'filters-reset': []
}>()

// Local state
const localFilters = ref<OrganizationFilterParams>({
  search_by: 'name',
  search_query: '',
  filter_industry: '',
  filter_size: '',
  filter_status: '',
  order_by: 'created_at',
  order_direction: 'desc',
  page_size: '10',
  ...props.initialFilters,
})

// Computed
const hasActiveFilters = computed(() => {
  return Object.entries(localFilters.value).some(([key, value]) => {
    // Ignore default values
    if (key === 'order_by' && value === 'created_at') return false
    if (key === 'order_direction' && value === 'desc') return false
    if (key === 'page_size' && value === '10') return false
    return value && (typeof value === 'string' ? value.trim() !== '' : true)
  })
})

const activeFiltersDisplay = computed(() => {
  const filters: Record<string, { label: string; value: string }> = {}

  if (localFilters.value.search_by && localFilters.value.search_query) {
    filters.search = {
      label: 'Search',
      value: `${localFilters.value.search_by}: ${localFilters.value.search_query}`,
    }
  }

  if (localFilters.value.filter_industry) {
    filters.filter_industry = {
      label: 'Industry',
      value: localFilters.value.filter_industry,
    }
  }

  if (localFilters.value.filter_size) {
    filters.filter_size = {
      label: 'Size',
      value: localFilters.value.filter_size,
    }
  }

  if (localFilters.value.filter_status) {
    filters.filter_status = {
      label: 'Status',
      value: localFilters.value.filter_status,
    }
  }

  if (
    localFilters.value.order_by !== 'created_at' ||
    localFilters.value.order_direction !== 'desc'
  ) {
    filters.sort = {
      label: 'Sort',
      value: `${localFilters.value.order_by} ${localFilters.value.order_direction}`,
    }
  }

  if (localFilters.value.page_size !== '10') {
    filters.page_size = {
      label: 'Page Size',
      value: (localFilters.value.page_size ?? '10').toString(),
    }
  }

  return filters
})

// Methods
const applyFilters = () => {
  // Remove empty values
  const cleanFilters = Object.entries(localFilters.value).reduce((acc, [key, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      (acc as Record<string, string>)[key] = value.trim()
    } else if (typeof value === 'number') {
      (acc as Record<string, string>)[key] = value.toString()
    }
    return acc
  }, {} as OrganizationFilterParams)

  emit('filters-changed', cleanFilters)
}

const resetFilters = () => {
  localFilters.value = {
    search_by: 'name',
    search_query: '',
    filter_industry: '',
    filter_size: '',
    filter_status: '',
    order_by: 'created_at',
    order_direction: 'desc',
    page_size: '10',
  }
  emit('filters-reset')
}

const removeFilter = (filterKey: string) => {
  switch (filterKey) {
    case 'search':
      localFilters.value.search_by = 'name'
      localFilters.value.search_query = ''
      break
    case 'filter_industry':
      localFilters.value.filter_industry = ''
      break
    case 'filter_size':
      localFilters.value.filter_size = ''
      break
    case 'filter_status':
      localFilters.value.filter_status = ''
      break
    case 'sort':
      localFilters.value.order_by = 'created_at'
      localFilters.value.order_direction = 'desc'
      break
    case 'page_size':
      localFilters.value.page_size = '10'
      break
  }
  applyFilters()
}

watch(
  () => props.initialFilters,
  (newFilters) => {
    localFilters.value = { ...localFilters.value, ...newFilters }
  },
  { deep: true, immediate: true },
)
</script>
