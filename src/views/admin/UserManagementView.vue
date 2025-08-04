<template>
  <!-- Stats Cards -->
  <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium text-foreground">Total Users</CardTitle>
        <svg
          class="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-foreground">{{ filteredUsers.length }}</div>
        <p class="text-xs text-muted-foreground">
          {{ searchQuery ? 'Filtered results' : '+12% from last month' }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium text-foreground">Active Users</CardTitle>
        <svg
          class="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-foreground">{{ activeUsersCount }}</div>
        <p class="text-xs text-muted-foreground">+8% from last month</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium text-foreground">New Users</CardTitle>
        <svg
          class="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-foreground">{{ newUsersCount }}</div>
        <p class="text-xs text-muted-foreground">+23% from last month</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium text-foreground">Premium Users</CardTitle>
        <svg
          class="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-foreground">{{ premiumUsersCount }}</div>
        <p class="text-xs text-muted-foreground">+5% from last month</p>
      </CardContent>
    </Card>
  </div>

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
          />
          <!-- Search Icon -->
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <!-- Clear "X" Button -->
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            type="button"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="text-foreground">Name</TableHead>
            <TableHead class="text-foreground">Email</TableHead>
            <TableHead class="text-foreground">Role</TableHead>
            <TableHead class="text-right text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in paginatedUsers" :key="user.id">
            <TableCell class="font-medium text-foreground">
              <div class="flex items-center space-x-3">
                {{ user.name }}
              </div>
            </TableCell>
            <TableCell class="text-foreground">{{ user.email }}</TableCell>
            <TableCell>
              <span :class="getRoleBadgeClass(user.role_id)">
                {{ user.role_id === 1 ? 'Admin' : user.role_id === 2 ? 'User' : 'Moderator' }}
              </span>
            </TableCell>
            <TableCell class="text-right">
              <div class="flex items-center justify-end space-x-2">
                <button
                  class="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button
                  class="rounded-md p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <!-- Pagination -->
      <div class="mt-6">
        <Pagination
          v-model:page="currentPage"
          :items-per-page="itemsPerPage"
          :total="filteredUsers.length"
          :sibling-count="1"
        >
          <PaginationContent>
            <PaginationFirst />
            <PaginationPrevious />
            <PaginationItem
              v-for="page in visiblePages"
              :key="page"
              :value="page"
              :is-active="page === currentPage"
            >
              {{ page }}
            </PaginationItem>
            <PaginationNext />
            <PaginationLast />
          </PaginationContent>
        </Pagination>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
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
import { getListUser } from '@/api/getListUser'

interface UserDataInterface {
  id: string
  email: string
  phone: string
  role_id: number
  name: string
}

const datas = ref<UserDataInterface[]>([])

onMounted(async () => {
  const users = await getListUser()
  datas.value = users
})

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Search and filter state
const searchQuery = ref('')

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

// Watch for filter changes and reset to page 1
watch([searchQuery], () => {
  currentPage.value = 1
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value))

// Computed properties for stats
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

// Computed properties for search and filtering
const filteredUsers = computed(() => {
  let filtered = datas.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
    )
  }

  return filtered
})
</script>
