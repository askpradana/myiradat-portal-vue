<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-card border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-foreground">
              {{ activeTab === 'users' ? 'Admin Dashboard' : 'User Profile' }}
            </h1>
            <p class="text-muted-foreground mt-1">
              {{
                activeTab === 'users'
                  ? 'Manage your application users and settings'
                  : 'View and manage your profile information'
              }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="icon" @click="logoutFunc">
              <LogOut class="w-4 h-4" />
            </Button>
            <ThemeToggle />
            <Button
              v-if="activeTab === 'users'"
              class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/85"
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
            </Button>
            <Button
              v-if="activeTab === 'profile'"
              class="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/85"
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
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Navigation Tabs -->
      <div class="mb-8">
        <div class="border-b border-border">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'users'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'users'
                  ? 'border-primary/50 text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
              ]"
            >
              Users Management
            </button>
            <button
              @click="activeTab = 'profile'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'profile'
                  ? 'border-primary/50 text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
              ]"
            >
              User Profile
            </button>
          </nav>
        </div>
      </div>

      <!-- Users Tab Content -->
      <div v-if="activeTab === 'users'">
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

        <!-- Users Table -->
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
                <div
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
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
                    <span :class="getRoleBadgeClass(user.role)">
                      {{ user.role }}
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
                    class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary"
                  >
                    {{ currentUser.name.charAt(0) }}
                  </div>
                  <h3 class="text-xl font-semibold text-foreground">{{ currentUser.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ currentUser.role }}</p>
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
                <CardTitle class="text-foreground">Profile Information</CardTitle>
                <CardDescription class="text-muted-foreground">
                  Your personal information and account details.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <!-- Personal Information -->
                <div>
                  <h4 class="text-lg font-medium text-foreground mb-4">Personal Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >Full Name</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                        {{ currentUser.name }}
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >Email Address</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                        {{ currentUser.email }}
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >Phone Number</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                        {{ currentUser.phone }}
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >Date of Birth</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                        {{ currentUser.dateOfBirth }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Account Information -->
                <div>
                  <h4 class="text-lg font-medium text-foreground mb-4">Account Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >User Role</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                        <span :class="getRoleBadgeClass(currentUser.role)">
                          {{ currentUser.role }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >Account Status</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                        <span
                          class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                        >
                          {{ currentUser.status }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >Member Since</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                        {{ formatDate(currentUser.createdAt) }}
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >Last Login</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                        {{ formatDate(currentUser.lastLogin) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Additional Information -->
                <div>
                  <h4 class="text-lg font-medium text-foreground mb-4">Additional Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >Department</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                        {{ currentUser.department }}
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >Location</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                        {{ currentUser.location }}
                      </div>
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-muted-foreground mb-1"
                        >Bio</label
                      >
                      <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
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
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { LogOut } from 'lucide-vue-next'
import router from '@/router'

// Active tab state - Users tab is active by default
const activeTab = ref('users')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Search and filter state
const searchQuery = ref('')

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
