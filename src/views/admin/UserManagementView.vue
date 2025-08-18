<template>
  <!-- Stats Cards -->
  <!-- <UserListHeaderCards
    :active-users-count="activeUsersCount"
    :premium-users-count="premiumUsersCount"
    :new-users-count="newUsersCount"
    :filtered-users="data?.users || []"
  /> -->

  <!-- Admin Action Bar -->
  <div
    v-if="isAdmin"
    class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
  >
    <!-- Left: Admin Actions -->
    <div class="flex items-center gap-3">
      <Button variant="default" size="default" @click="addNewUser">
        <User :size="18" />
        <span>Add User</span>
      </Button>
      <Button variant="outline" size="default" @click="addNewUserBatch">
        <Users :size="18" />
        <span>Add User Batch</span>
      </Button>
    </div>

    <!-- Right: Toggle Filter -->
    <Button variant="outline" @click="toggleFilter">
      <Filter :size="18" />
      <span>{{ showFilter ? 'Hide' : 'Show' }} Filters</span>
    </Button>
  </div>

  <!-- Filter Component -->
  <UserListFilter
    v-if="showFilter"
    :initial-filters="currentFilters"
    @filters-changed="handleFiltersChanged"
    @filters-reset="handleFiltersReset"
  />

  <!-- User Table -->
  <Card>
    <CardHeader>
      <CardTitle class="text-foreground">User Management</CardTitle>
      <CardDescription class="text-muted-foreground">
        A list of all users in your application including their name, email, and role.
        <span v-if="hasActiveFilters" class="ml-2 text-primary">
          ({{ data?.total || 0 }} filtered results)
        </span>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Quick Search Bar (kept for backward compatibility) -->
      <div v-if="!showFilter" class="mb-6 space-y-4">
        <div class="relative w-full max-w-xl">
          <Input
            v-model="quickSearch"
            placeholder="Quick search by name or email..."
            class="w-full pl-10 pr-10 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm bg-background text-foreground"
            @input="handleQuickSearch"
          />
          <!-- Search Icon -->
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <SearchIcon :size="18" />
          </div>
          <!-- Clear "X" Button -->
          <button
            v-if="quickSearch"
            @click="clearQuickSearch"
            type="button"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X :size="18" />
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="text-foreground">Name</TableHead>
            <TableHead class="text-foreground">Email</TableHead>
            <TableHead class="text-foreground">Phone</TableHead>
            <TableHead class="text-foreground">Organization</TableHead>
            <TableHead class="text-foreground">Role</TableHead>
            <TableHead class="text-right text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="isPending">
            <ListUserTableSkeleton />
          </template>

          <template v-else-if="data?.users && data.users.length > 0">
            <TableRow v-for="user in data.users" :key="user.id">
              <TableCell class="font-medium text-foreground">
                <div class="flex items-center space-x-3">
                  {{ user.name }}
                </div>
              </TableCell>
              <TableCell class="text-foreground">{{ user.email }}</TableCell>
              <TableCell class="text-foreground">{{ user.phone }}</TableCell>
              <TableCell class="text-foreground">{{ user.organization_name || '-' }}</TableCell>
              <TableCell>
                <span :class="getRoleBadgeClass(user.role_id)">
                  {{ user.role_name }}
                </span>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    class="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                    @click="goToLinks(user.id)"
                  >
                    <Link2 :size="18" />
                  </Button>
                  <EditUserAlert
                    :user-i-d="user.id"
                    :data-user="user as any"
                    :current-page="currentPage"
                  />
                  <DeleteUserAlert :user-i-d="user.id" :name-of-user="user.name" />
                </div>
              </TableCell>
            </TableRow>
          </template>

          <!-- No Results -->
          <template v-else>
            <TableRow>
              <TableCell :colspan="6" class="h-24 text-center text-muted-foreground">
                <div class="flex flex-col items-center justify-center py-8">
                  <SearchIcon :size="48" class="mb-4 opacity-50" />
                  <p class="text-lg font-medium">No users found</p>
                  <p class="text-sm">
                    {{
                      hasActiveFilters
                        ? 'Try adjusting your filters'
                        : 'No users match your search criteria'
                    }}
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
      <div class="mt-6" v-if="data && data?.users?.length > 0">
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
import { ref, computed, watch, type Ref } from 'vue'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
// import { allUsers } from '@/data/usersData'
import { getListUser } from '@/api/users/getListUser'
import { useQuery } from '@tanstack/vue-query'
import ListUserTableSkeleton from '@/components/custom/skeletons/ListUserTableSkeleton.vue'
import { SearchIcon, X, Link2, User, Users, Filter } from 'lucide-vue-next'
import type { UserListInterface as ResponseAPIUsersInterface } from '@/types/userListType'
// import UserListHeaderCards from '@/components/custom/cards/UserListHeaderCards.vue'
import UserListFilter from '@/components/custom/filters/UserListFilter.vue'
import DeleteUserAlert from '@/components/custom/alerts/DeleteUserAlert.vue'
import EditUserAlert from '@/components/custom/alerts/EditUserAlert.vue'
import { useRouter } from 'vue-router'
import { useUserRole } from '@/composables/useUserRole'

// State
const currentPage = ref(1)
const quickSearch = ref('') // For backward compatibility
const showFilter = ref(false)
const currentFilters = ref<Record<string, any>>({})

const router = useRouter()
const { isAdmin } = useUserRole()



// Computed for query parameters
const queryParams = computed(() => ({
  page: currentPage.value,
  ...currentFilters.value,
  // Use quick search if no advanced filters are set
  ...(Object.keys(currentFilters.value).length === 0 && quickSearch.value
    ? { search: quickSearch.value }
    : {}),
}))

// Check if there are active filters
const hasActiveFilters = computed(() => {
  return Object.keys(currentFilters.value).length > 0 || quickSearch.value.length > 0
})

// Reactive query with all filters
const { isPending, data } = useQuery({
  queryKey: ['users', queryParams],
  queryFn: () => getListUser(queryParams.value),
  staleTime: 1000 * 60 * 5, // 5 minutes
}) as {
  isPending: Ref<boolean>
  data: Ref<ResponseAPIUsersInterface | undefined>
  refetch: () => void
}

// Filter Methods
const handleFiltersChanged = (filters: Record<string, any>) => {
  currentFilters.value = { ...filters }
  currentPage.value = 1 // Reset to first page when filters change
  quickSearch.value = '' // Clear quick search when using advanced filters
}

const handleFiltersReset = () => {
  currentFilters.value = {}
  currentPage.value = 1
  quickSearch.value = ''
}

const toggleFilter = () => {
  showFilter.value = !showFilter.value
  if (!showFilter.value) {
    // When hiding filter, clear advanced filters but keep quick search
    currentFilters.value = {}
  } else {
    // When showing filter, clear quick search
    quickSearch.value = ''
  }
}

// Quick Search Methods (for backward compatibility)
let searchTimeout: number
const handleQuickSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    // Clear advanced filters when using quick search
    currentFilters.value = {}
  }, 500)
}

const clearQuickSearch = () => {
  quickSearch.value = ''
  currentPage.value = 1
}

// Pagination functions
const goToPage = (page: number) => {
  if (page >= 1 && page <= (data.value?.total_pages || 1)) {
    currentPage.value = page
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

// Navigation functions
const goToLinks = (user_id: string) => {
  router.push(`/dashboard/${user_id}/services`)
}

const addNewUser = () => {
  router.push('/dashboard/admin/create-user')
}

const addNewUserBatch = () => {
  router.push('/dashboard/admin/create-user-batch')
}

// Computed properties for stats (keep using allUsers for now, or modify as needed)
// const activeUsersCount = computed(() => allUsers.filter((user) => user.status === 'Active').length)

// const newUsersCount = computed(() => {
//   const thirtyDaysAgo = new Date()
//   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
//   return allUsers.filter((user) => new Date(user.createdAt) > thirtyDaysAgo).length
// })

// const premiumUsersCount = computed(() => allUsers.filter((user) => user.role === 'Admin').length)

// Helper functions
const getRoleBadgeClass = (role: number) => {
  const classes = {
    1: 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700',
    3: 'inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700',
    2: 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700',
  }
  return classes[role as keyof typeof classes] || classes[2]
}

// Watch for page changes
watch(currentPage, () => {
  // The query will automatically refetch due to queryParams being reactive
})
</script>
