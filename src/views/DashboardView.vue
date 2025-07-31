<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="flex w-16 flex-col justify-between border-e border-gray-100 bg-white">
      <div>
        <div class="inline-flex size-16 items-center justify-center">
          <span
            class="grid size-10 place-content-center rounded-lg bg-blue-100 text-xs font-semibold text-blue-700"
          >
            A
          </span>
        </div>

        <div class="border-t border-gray-100">
          <div class="px-2">
            <ul class="space-y-1 border-t border-gray-100 pt-4">
              <li>
                <a
                  href="#"
                  @click.prevent="activeTab = 'users'"
                  :class="[
                    'group relative flex justify-center rounded-sm px-2 py-1.5 hover:bg-gray-50',
                    activeTab === 'users'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700',
                  ]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-5 opacity-75"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  <span
                    class="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                  >
                    Users
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  @click.prevent="activeTab = 'profile'"
                  :class="[
                    'group relative flex justify-center rounded-sm px-2 py-1.5 hover:bg-gray-50',
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700',
                  ]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-5 opacity-75"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>

                  <span
                    class="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                  >
                    Profile
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
        <a
          href="#"
          @click.prevent="logoutFunc"
          class="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-5 opacity-75"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>

          <span
            class="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
          >
            Logout
          </span>
        </a>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden">
      <!-- Header -->
      <header class="border-b border-gray-200 bg-white px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">
              {{ activeTab === 'users' ? 'Admin Dashboard' : 'User Profile' }}
            </h1>
            <p class="text-sm text-gray-600">
              {{
                activeTab === 'users'
                  ? 'Manage your application users and settings'
                  : 'View and manage your profile information'
              }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="activeTab === 'users'"
              class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add User
            </button>
            <button
              v-if="activeTab === 'profile'"
              class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <!-- Users Tab Content -->
        <div v-if="activeTab === 'users'">
          <!-- Stats Cards -->
          <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">Total Users</CardTitle>
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
                <div class="text-2xl font-bold">{{ filteredUsers.length }}</div>
                <p class="text-xs text-muted-foreground">
                  {{ searchQuery || roleFilter ? 'Filtered results' : '+12% from last month' }}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">Active Users</CardTitle>
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
                <div class="text-2xl font-bold">{{ activeUsersCount }}</div>
                <p class="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">New Users</CardTitle>
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
                <div class="text-2xl font-bold">{{ newUsersCount }}</div>
                <p class="text-xs text-muted-foreground">+23% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">Premium Users</CardTitle>
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
                <div class="text-2xl font-bold">{{ premiumUsersCount }}</div>
                <p class="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <!-- Users Table -->
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                A list of all users in your application including their name, email, and role.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <!-- Search and Filter Controls -->
              <div class="mb-6 space-y-4">
                <!-- Active Filters Indicator -->
                <div
                  v-if="searchQuery || roleFilter"
                  class="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <span>Active filters:</span>
                  <span
                    v-if="searchQuery"
                    class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                  >
                    Search: "{{ searchQuery }}"
                  </span>
                  <span
                    v-if="roleFilter"
                    class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                  >
                    Role: {{ roleFilter }}
                  </span>
                  <span class="text-gray-500">({{ filteredUsers.length }} results)</span>
                </div>

                <!-- Search Bar -->
                <div class="relative w-full max-w-xl">
                  <Input
                    v-model="searchQuery"
                    placeholder="Search by name or email..."
                    class="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm"
                  />
                  <!-- Search Icon -->
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead class="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="user in paginatedUsers" :key="user.id">
                    <TableCell class="font-medium">
                      <div class="flex items-center space-x-3">
                        {{ user.name }}
                      </div>
                    </TableCell>
                    <TableCell>{{ user.email }}</TableCell>
                    <TableCell>
                      <span :class="getRoleBadgeClass(user.role)">
                        {{ user.role }}
                      </span>
                    </TableCell>
                    <TableCell class="text-right">
                      <div class="flex items-center justify-end space-x-2">
                        <button
                          class="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                          <svg
                            class="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          class="rounded-md p-2 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <svg
                            class="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
        </div>

        <!-- Profile Tab Content -->
        <div v-if="activeTab === 'profile'" class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Profile Card -->
            <div class="lg:col-span-1">
              <Card>
                <CardContent class="p-6">
                  <div class="text-center">
                    <div
                      class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-2xl font-semibold text-blue-700"
                    >
                      {{ currentUser.name.charAt(0) }}
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900">{{ currentUser.name }}</h3>
                    <p class="text-sm text-gray-600">{{ currentUser.role }}</p>
                    <div
                      class="mt-4 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
                    >
                      <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Active
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Profile Details -->
            <div class="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Your personal information and account details.
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-6">
                  <!-- Personal Information -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >Full Name</label
                        >
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          {{ currentUser.name }}
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >Email Address</label
                        >
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          {{ currentUser.email }}
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >Phone Number</label
                        >
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          {{ currentUser.phone }}
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >Date of Birth</label
                        >
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          {{ currentUser.dateOfBirth }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Account Information -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Account Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >User Role</label
                        >
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          <span :class="getRoleBadgeClass(currentUser.role)">
                            {{ currentUser.role }}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >Account Status</label
                        >
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          <span
                            class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                          >
                            {{ currentUser.status }}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >Member Since</label
                        >
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          {{ formatDate(currentUser.createdAt) }}
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >Last Login</label
                        >
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          {{ formatDate(currentUser.lastLogin) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Information -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1"
                          >Department</label
                        >
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          {{ currentUser.department }}
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          {{ currentUser.location }}
                        </div>
                      </div>
                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          {{ currentUser.bio }}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import router from '@/router'

// Active tab state - Users tab is active by default
const activeTab = ref('users')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Search and filter state
const searchQuery = ref('')
const roleFilter = ref('')

// Current user data for profile
const currentUser = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: 'January 15, 1990',
  role: 'Admin',
  status: 'Active',
  createdAt: '2024-01-15T10:30:00Z',
  lastLogin: '2024-03-15T14:30:00Z',
  department: 'IT Management',
  location: 'New York, NY',
  bio: 'Experienced IT professional with over 10 years of experience in system administration and team leadership. Passionate about technology and helping organizations achieve their digital transformation goals.',
})

// Extended mock user data with more users
const allUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-01-20T14:45:00Z',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'Moderator',
    status: 'Inactive',
    createdAt: '2024-01-10T09:15:00Z',
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-01-25T16:20:00Z',
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'User',
    status: 'Pending',
    createdAt: '2024-01-28T11:00:00Z',
  },
  {
    id: 6,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-01-12T13:30:00Z',
  },
  {
    id: 7,
    name: 'Robert Miller',
    email: 'robert.miller@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-01-18T08:45:00Z',
  },
  {
    id: 8,
    name: 'Lisa Garcia',
    email: 'lisa.garcia@example.com',
    role: 'Moderator',
    status: 'Active',
    createdAt: '2024-01-22T15:10:00Z',
  },
  {
    id: 9,
    name: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-01-30T12:00:00Z',
  },
  {
    id: 10,
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-02-01T09:30:00Z',
  },
  {
    id: 11,
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-02-03T14:15:00Z',
  },
  {
    id: 12,
    name: 'Sophia Chen',
    email: 'sophia.chen@example.com',
    role: 'User',
    status: 'Inactive',
    createdAt: '2024-02-05T11:45:00Z',
  },
  {
    id: 13,
    name: 'Michael Lee',
    email: 'michael.lee@example.com',
    role: 'Moderator',
    status: 'Active',
    createdAt: '2024-02-07T16:20:00Z',
  },
  {
    id: 14,
    name: 'Emma Taylor',
    email: 'emma.taylor@example.com',
    role: 'User',
    status: 'Pending',
    createdAt: '2024-02-09T10:00:00Z',
  },
  {
    id: 15,
    name: 'Daniel Anderson',
    email: 'daniel.anderson@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-02-11T13:30:00Z',
  },
  {
    id: 16,
    name: 'Olivia Martinez',
    email: 'olivia.martinez@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-02-13T08:45:00Z',
  },
  {
    id: 17,
    name: 'William Johnson',
    email: 'william.johnson@example.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-02-15T15:10:00Z',
  },
  {
    id: 18,
    name: 'Ava Brown',
    email: 'ava.brown@example.com',
    role: 'User',
    status: 'Inactive',
    createdAt: '2024-02-17T12:00:00Z',
  },
  {
    id: 19,
    name: 'Ethan Davis',
    email: 'ethan.davis@example.com',
    role: 'Moderator',
    status: 'Active',
    createdAt: '2024-02-19T09:30:00Z',
  },
  {
    id: 20,
    name: 'Isabella Garcia',
    email: 'isabella.garcia@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-02-21T14:15:00Z',
  },
  {
    id: 21,
    name: 'Noah Miller',
    email: 'noah.miller@example.com',
    role: 'User',
    status: 'Pending',
    createdAt: '2024-02-23T11:45:00Z',
  },
  {
    id: 22,
    name: 'Mia Wilson',
    email: 'mia.wilson@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-02-25T16:20:00Z',
  },
  {
    id: 23,
    name: 'Lucas Taylor',
    email: 'lucas.taylor@example.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-02-27T10:00:00Z',
  },
  {
    id: 24,
    name: 'Amelia Anderson',
    email: 'amelia.anderson@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-03-01T13:30:00Z',
  },
  {
    id: 25,
    name: 'Mason Martinez',
    email: 'mason.martinez@example.com',
    role: 'Moderator',
    status: 'Inactive',
    createdAt: '2024-03-03T08:45:00Z',
  },
]

// Computed properties for search and filtering
const filteredUsers = computed(() => {
  let filtered = allUsers

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
    )
  }

  // Apply role filter
  if (roleFilter.value) {
    filtered = filtered.filter((user) => user.role === roleFilter.value)
  }

  return filtered
})

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

// Watch for filter changes and reset to page 1
watch([searchQuery, roleFilter], () => {
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

// Computed properties for stats
const activeUsersCount = computed(() => allUsers.filter((user) => user.status === 'Active').length)

const newUsersCount = computed(() => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return allUsers.filter((user) => new Date(user.createdAt) > thirtyDaysAgo).length
})

const premiumUsersCount = computed(() => allUsers.filter((user) => user.role === 'Admin').length)

// Helper functions
const getRoleBadgeClass = (role: string) => {
  const classes = {
    Admin:
      'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800',
    Moderator:
      'inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800',
    User: 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800',
  }
  return classes[role as keyof typeof classes] || classes.User
}

// Helper function for date formatting
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

function logoutFunc() {
  // Clear any authentication tokens or user data
  // localStorage.removeItem('token')
  // localStorage.removeItem('user')

  // Navigate to home page
  router.push({ name: 'home' })
}
</script>
