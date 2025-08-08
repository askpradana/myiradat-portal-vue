<template>
  <!-- Stats Cards -->
  <UserListHeaderCards
    :active-users-count="activeUsersCount"
    :premium-users-count="premiumUsersCount"
    :new-users-count="newUsersCount"
    :filtered-users="data?.users || []"
  />

  <!-- User Table -->
  <Card>
    <CardHeader>
      <CardTitle class="text-foreground">User Management</CardTitle>
      <CardDescription class="text-muted-foreground">
        A list of all users in your application including their name, email, and role.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Search and Filter Controls -->
      <div class="mb-6 space-y-4">
        <!-- Search Bar -->
        <div class="relative w-full max-w-xl">
          <Input
            v-model="searchQuery"
            placeholder="Search by name or email..."
            class="w-full pl-10 pr-10 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm bg-background text-foreground"
            @input="handleSearch"
          />
          <!-- Search Icon -->
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <SearchIcon :size="18" />
          </div>
          <!-- Clear "X" Button -->
          <button
            v-if="searchQuery"
            @click="clearSearch"
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
            <TableHead class="text-foreground">Role</TableHead>
            <TableHead class="text-right text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="isPending">
            <ListUserTableSkeleton />
          </template>

          <template v-else>
            <TableRow v-for="user in data?.users" :key="user.id">
              <TableCell class="font-medium text-foreground">
                <div class="flex items-center space-x-3">
                  {{ user.name }}
                </div>
              </TableCell>
              <TableCell class="text-foreground">{{ user.email }}</TableCell>
              <TableCell class="text-foreground">{{ user.phone }}</TableCell>
              <TableCell>
                <span :class="getRoleBadgeClass(user.role_id)">
                  {{ user.role_name }}
                </span>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex items-center justify-end space-x-2">
                  <EditUserAlert
                    :user-i-d="user.id"
                    :data-user="user"
                    :current-page="currentPage"
                  />
                  <DeleteUserAlert :user-i-d="user.id" :name-of-user="user.name" />
                </div>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>

      <!-- Pagination -->
      <div class="mt-6" v-if="data">
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
import { allUsers } from '@/data/usersData'
import { getListUser } from '@/api/users/getListUser'
import { useQuery } from '@tanstack/vue-query'
import ListUserTableSkeleton from '@/components/custom/skeletons/ListUserTableSkeleton.vue'
import { SearchIcon, X } from 'lucide-vue-next'
import type { UserListInterface as ResponseAPIUsersInterface } from '@/types/userListType'
import UserListHeaderCards from '@/components/custom/cards/UserListHeaderCards.vue'
import DeleteUserAlert from '@/components/custom/alerts/DeleteUserAlert.vue'
import EditUserAlert from '@/components/custom/alerts/EditUserAlert.vue'

// Pagination state
const currentPage = ref(1)
const searchQuery = ref('')

// Reactive query with pagination
const { isPending, data, refetch } = useQuery({
  queryKey: ['users', currentPage, searchQuery],
  queryFn: () =>
    getListUser({
      page: currentPage.value,
      search: searchQuery.value || undefined,
    }),
  staleTime: 1000 * 60 * 5, // 5 minutes
}) as {
  isPending: Ref<boolean>
  data: Ref<ResponseAPIUsersInterface | undefined>
  refetch: () => void
}

// Pagination functions
const goToPage = (page: number) => {
  if (page >= 1 && page <= (data.value?.total_pages || 1)) {
    currentPage.value = page
  }
}

// Search functions
let searchTimeout: number
const handleSearch = () => {
  // Debounce search to avoid too many API calls
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1 // Reset to first page when searching
    refetch()
  }, 500)
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  refetch()
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

// Watch currentPage changes to refetch data
watch(currentPage, () => {
  refetch()
})

// Computed properties for stats (keep using allUsers for now, or modify as needed)
const activeUsersCount = computed(() => allUsers.filter((user) => user.status === 'Active').length)

const newUsersCount = computed(() => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return allUsers.filter((user) => new Date(user.createdAt) > thirtyDaysAgo).length
})

const premiumUsersCount = computed(() => allUsers.filter((user) => user.role === 'Admin').length)

// Helper functions
const getRoleBadgeClass = (role: number) => {
  const classes = {
    1: 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800',
    3: 'inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800',
    2: 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800',
  }
  return classes[role as keyof typeof classes] || classes[2]
}
</script>
