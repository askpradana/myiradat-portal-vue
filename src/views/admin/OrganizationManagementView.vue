<template>
  <!-- Stats Cards -->
  <!-- <UserListHeaderCards
    :active-users-count="activeUsersCount"
    :premium-users-count="premiumUsersCount"
    :new-users-count="newUsersCount"
    :filtered-users="[]"
  /> -->

  <!-- Admin Action Bar -->
  <div
    v-if="isAdmin"
    class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
  >
    <!-- Left: Admin Actions -->
    <div class="flex items-center gap-3">
      <Button variant="default" size="default" @click="addNewOrganization">
        <Building :size="18" />
        <span>Add Organizations</span>
      </Button>
    </div>

    <!-- Right: Toggle Filter -->
    <Button variant="outline" @click="toggleFilter">
      <Filter :size="18" />
      <span>{{ showFilter ? 'Hide' : 'Show' }} Filters</span>
    </Button>
  </div>

  <!-- Filter Component -->
  <OrganizationListFilter
    v-if="showFilter"
    :initial-filters="currentFilters"
    @filters-changed="handleFiltersChanged"
    @filters-reset="handleFiltersReset"
  />

  <!-- User Table -->
  <Card>
    <CardHeader>
      <CardTitle class="text-foreground">Organization Management</CardTitle>
      <CardDescription class="text-muted-foreground">
        A list of all organization in your database.
        <span v-if="hasActiveFilters" class="ml-2 text-primary">
          ({{ data?.total || 0 }} filtered results)
        </span>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="text-foreground font-semibold">Name</TableHead>
            <TableHead class="text-foreground font-semibold">Email</TableHead>
            <TableHead class="text-foreground font-semibold">Phone</TableHead>
            <TableHead class="text-foreground font-semibold">Website</TableHead>
            <TableHead class="text-right text-foreground font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="isPending">
            <ListUserTableSkeleton />
          </template>

          <template v-else-if="data?.organizations && data.organizations.length > 0">
            <TableRow v-for="organization in data?.organizations" :key="organization.id">
              <TableCell class="font-medium text-foreground">
                <div class="flex items-center space-x-3">
                  {{ organization.name }}
                </div>
              </TableCell>
              <TableCell class="text-foreground">{{ organization.email }}</TableCell>
              <TableCell class="text-foreground">{{ organization.phone }}</TableCell>
              <TableCell>
                <a
                  class="bg-primary hover:bg-primary/80 text-white px-2 py-1 rounded-md"
                  :class="
                    organization.website_url
                      ? ''
                      : 'pointer-events-none cursor-not-allowed !bg-gray-200'
                  "
                  :href="organization.website_url"
                  target="_blank"
                  >Visit web</a
                >
              </TableCell>
              <TableCell class="text-right">
                <div class="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    class="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                    @click="goToDetails(organization.id)"
                  >
                    <FileSearch :size="18" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    class="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                    @click="goToUpdateOrganization(organization.id)"
                  >
                    <Pencil :size="18" />
                  </Button>
                  <DeleteOrganizationAlert
                    :organization-i-d="organization.id"
                    :name-of-organization="organization.name"
                  />
                </div>
              </TableCell>
            </TableRow>
          </template>

          <!-- No Results -->
          <template v-else>
            <TableRow>
              <TableCell :colspan="5" class="h-24 text-center text-muted-foreground">
                <div class="flex flex-col items-center justify-center py-8">
                  <SearchIcon :size="48" class="mb-4 opacity-50" />
                  <p class="text-lg font-medium">No organizations found</p>
                  <p class="text-sm">
                    {{ 'Try adjusting your filters' }}
                  </p>
                  <Button
                    v-if="hasActiveFilters"
                    variant="outline"
                    @click="handleFiltersReset"
                    class="mt-3"
                  >
                    Clear Filters
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>

      <!-- Pagination -->
      <div class="mt-6" v-if="data && data?.organizations?.length > 0">
        <Pagination
          v-model:page="currentPage"
          :items-per-page="data.page_size"
          :total="data.total"
          :sibling-count="1"
        >
          <PaginationContent>
            <PaginationFirst @click="goToPage(1)" :disabled="currentPage === 1" />
            <PaginationPrevious @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" />
            <PaginationItem
              v-for="page in visiblePages"
              :key="page"
              :value="page"
              :is-active="page === currentPage"
              @click="goToPage(page)"
            >
              {{ page }}
            </PaginationItem>
            <PaginationNext
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === data.total_pages"
            />
            <PaginationLast
              @click="goToPage(data.total_pages)"
              :disabled="currentPage === data.total_pages"
            />
          </PaginationContent>
        </Pagination>

        <!-- Pagination Info -->
        <div class="mt-4 text-sm text-muted-foreground text-center">
          Showing {{ (currentPage - 1) * data.page_size + 1 }} to
          {{ Math.min(currentPage * data.page_size, data.total) }} of {{ data.total }} results
          <span v-if="hasActiveFilters" class="text-primary">
            (filtered from {{ data.total }})
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref, onMounted } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
// import { allUsers } from '@/data/usersData'
import { getListOrganization } from '@/api/organizations/getListOrganizations'
import { useQuery } from '@tanstack/vue-query'
import ListUserTableSkeleton from '@/components/custom/skeletons/ListUserTableSkeleton.vue'
import { SearchIcon, Building, FileSearch, Pencil, Filter } from 'lucide-vue-next'
// import UserListHeaderCards from '@/components/custom/cards/UserListHeaderCards.vue'
import DeleteOrganizationAlert from '@/components/custom/alerts/DeleteOrganizationAlert.vue'
import OrganizationListFilter from '@/components/custom/filters/OrganizationListFilter.vue'
import { useRouter } from 'vue-router'
import { useUserRole } from '@/composables/useUserRole'
import type { ResponseAPIGetOrganizationsData } from '@/types/organizationType'

// State
const currentPage = ref(1)
const showFilter = ref(false)
const currentFilters = ref<Record<string, any>>({})

const router = useRouter()
const { isAdmin } = useUserRole()

// Computed for query parameters
const queryParams = computed(() => ({
  page: currentPage.value,
  ...currentFilters.value,
}))

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return Object.keys(currentFilters.value).length > 0
})

// Reactive query with all filters
const { isPending, data, refetch } = useQuery({
  queryKey: ['organizations', queryParams],
  queryFn: () => getListOrganization(queryParams.value),
  staleTime: 1000 * 60 * 5, // 5 minutes
  enabled: false, // Disable automatic refetching
}) as {
  isPending: Ref<boolean>
  data: Ref<ResponseAPIGetOrganizationsData | undefined>
  refetch: () => void
}

// Initial data fetch
onMounted(() => {
  refetch()
})

// Filter Methods
const handleFiltersChanged = (filters: Record<string, any>) => {
  currentFilters.value = { ...filters }
  currentPage.value = 1 // Reset to first page when filters change
  refetch() // Manually refetch data
}

const handleFiltersReset = () => {
  currentFilters.value = {}
  currentPage.value = 1
  refetch() // Manually refetch data
}

const toggleFilter = () => {
  showFilter.value = !showFilter.value
  if (!showFilter.value) {
    // When hiding filter, clear advanced filters and refetch
    currentFilters.value = {}
    refetch()
  }
}

// Pagination functions
const goToPage = (page: number) => {
  if (page >= 1 && page <= (data.value?.total_pages || 1)) {
    currentPage.value = page
    refetch()
  }
}

// Computed for visible pages
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const totalPages = data.value?.total_pages || 1
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages, start + maxVisible - 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Watch for page changes
watch(currentPage, () => {
  refetch()
})

const goToDetails = (organization_id: string) => {
  router.push(`/dashboard/admin/organization/${organization_id}/details`)
}

const goToUpdateOrganization = (organization_id: string) => {
  router.push(`/dashboard/admin/organization/${organization_id}/update`)
}

// Admin navigation functions
const addNewOrganization = () => {
  router.push('/dashboard/admin/create-organization')
}

// Computed properties for stats (keep using allUsers for now, or modify as needed)
// const activeUsersCount = computed(() => allUsers.filter((user) => user.status === 'Active').length)

// const newUsersCount = computed(() => {
//   const thirtyDaysAgo = new Date()
//   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
//   return allUsers.filter((user) => new Date(user.createdAt) > thirtyDaysAgo).length
// })

// const premiumUsersCount = computed(() => allUsers.filter((user) => user.role === 'Admin').length)
</script>
