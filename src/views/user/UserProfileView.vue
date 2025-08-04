<template>
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
            <h3 class="font-semibold text-foreground">{{ userStore.user?.name }}</h3>
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
              {{ userStore.user?.role_id === 1 ? 'Admin' : 'User' }}
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
                  {{ userStore.user?.name }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1"
                  >Email Address</label
                >
                <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                  {{ userStore.user?.email }}
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
              <!-- <div>
                <label class="block text-sm font-medium text-muted-foreground mb-1"
                  >Date of Birth</label
                >
                <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                  {{ currentUser.dateOfBirth }}
                </div>
              </div> -->
            </div>
          </div>

          <!-- Account Information -->
          <!-- <div>
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
          </div> -->

          <!-- Additional Information -->
          <!-- <div>
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
                <label class="block text-sm font-medium text-muted-foreground mb-1">Location</label>
                <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                  {{ currentUser.location }}
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-muted-foreground mb-1">Bio</label>
                <div class="text-sm text-foreground bg-muted px-3 py-2 rounded-md">
                  {{ currentUser.bio }}
                </div>
              </div>
            </div>
          </div> -->
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserStore } from '@/stores/userStores'

const userStore = useUserStore()

// Helper functions
// const getRoleBadgeClass = (role: string) => {
//   const classes = {
//     Admin:
//       'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800',
//     Moderator:
//       'inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800',
//     User: 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800',
//   }
//   return classes[role as keyof typeof classes] || classes.User
// }

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

// Helper function for date formatting
// const formatDate = (dateString: string) => {
//   const date = new Date(dateString)
//   return date.toLocaleDateString()
// }
</script>
