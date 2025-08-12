<template>
  <DashboardLayout>
    <BackToDashboardButton />

    <div class="space-y-8 mt-8">
      <!-- Available Services Section -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-foreground">Available Services</h2>
          <div class="text-sm text-muted-foreground">
            Click services to add them to your selection
          </div>
        </div>

        <!-- Search Bar -->
        <div class="mb-6 space-y-2">
          <div class="relative max-w-md">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search services by name or code..."
              class="pl-10 pr-10"
            />
            <Button
              v-if="searchQuery"
              variant="ghost"
              size="sm"
              class="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              @click="clearSearch"
            >
              <X class="w-3 h-3" />
            </Button>
          </div>
          <div v-if="debouncedSearchQuery" class="text-sm text-muted-foreground">
            {{ searchResultsCount }} service{{ searchResultsCount !== 1 ? 's' : '' }} found
          </div>
        </div>

        <template v-if="isLoadingAdminServices">
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <CardServiceSkeleton v-for="i in 8" :key="i" />
          </div>
        </template>

        <template v-else-if="adminServicesError">
          <div class="text-center py-8">
            <p class="text-muted-foreground">Failed to load available services</p>
            <Button
              variant="outline"
              @click="() => queryClient.invalidateQueries({ queryKey: ['admin-services'] })"
              class="mt-2"
            >
              Try Again
            </Button>
          </div>
        </template>

        <template v-else>
          <!-- Empty search results state -->
          <div
            v-if="debouncedSearchQuery && searchResultsCount === 0"
            class="text-center py-12 border-2 border-dashed border-muted rounded-lg"
          >
            <div class="text-muted-foreground">
              <h3 class="text-lg font-medium mb-2">No services found</h3>
              <p class="text-sm">
                Try adjusting your search terms or browse all available services
              </p>
              <Button variant="outline" @click="clearSearch" class="mt-3"> Clear Search </Button>
            </div>
          </div>

          <!-- Services Grid -->
          <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Card
              v-for="service in filteredServices"
              :key="service.code"
              class="cursor-pointer transition-all duration-200 hover:shadow-md"
              :class="{
                'border-primary bg-primary/5 ring-1 ring-primary/20':
                  getServiceState(service.code) === 'selected',
                'border-muted bg-muted/50 opacity-75': getServiceState(service.code) === 'linked',
                'hover:border-primary/50': getServiceState(service.code) === 'available',
              }"
              @click="handleServiceClick(service.code)"
            >
              <CardHeader class="p-4">
                <div class="flex items-start gap-3">
                  <img
                    :src="service.icon_url"
                    :alt="service.name"
                    class="w-12 h-12 rounded-lg object-cover"
                  />
                  <div class="flex-1 min-w-0">
                    <CardTitle class="text-sm font-medium truncate">{{ service.name }}</CardTitle>
                    <div class="flex items-center gap-2 mt-1">
                      <p class="text-xs text-muted-foreground">{{ service.code }}</p>
                      <Copy
                        :size="12"
                        class="text-primary cursor-pointer hover:text-primary/80"
                        @click.stop="copyServiceCode(service.code)"
                      />
                    </div>
                  </div>
                  <div class="flex-shrink-0">
                    <template v-if="getServiceState(service.code) === 'linked'">
                      <div class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                        Linked
                      </div>
                    </template>
                    <template v-else-if="getServiceState(service.code) === 'selected'">
                      <div class="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md">
                        Selected
                      </div>
                    </template>
                    <template v-else>
                      <Button size="sm" variant="ghost" class="h-6 w-6 p-0">
                        <Plus :size="12" />
                      </Button>
                    </template>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </template>
      </section>

      <!-- Selected Services & Actions Section -->
      <section v-if="selectedServiceCodes.length > 0" class="border rounded-lg p-6 bg-muted/30">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            Selected Services ({{ selectedServiceCodes.length }})
          </h3>
          <Button variant="outline" size="sm" @click="clearSelection"> Clear All </Button>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <div
            v-for="serviceCode in selectedServiceCodes"
            :key="serviceCode"
            class="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm"
          >
            <span>{{ serviceCode }}</span>
            <X
              :size="14"
              class="cursor-pointer hover:opacity-70"
              @click="removeServiceFromSelection(serviceCode)"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <Button @click="linkSelectedServices" :disabled="isLinkingServices">
            <template v-if="isLinkingServices">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Linking...
            </template>
            <template v-else> Link Selected Services </template>
          </Button>
        </div>
      </section>

      <!-- User's Linked Services Section -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-foreground">User's Linked Services</h2>
          <div class="text-sm text-muted-foreground">
            {{ userServices.length }} service{{ userServices.length !== 1 ? 's' : '' }} linked
          </div>
        </div>

        <template v-if="isLoadingUserServices">
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <CardServiceSkeleton v-for="i in 3" :key="i" />
          </div>
        </template>

        <template v-else-if="userServicesError">
          <div class="text-center py-8">
            <p class="text-muted-foreground">Failed to load user services</p>
            <Button
              variant="outline"
              @click="() => queryClient.invalidateQueries({ queryKey: ['services', userID] })"
              class="mt-2"
            >
              Try Again
            </Button>
          </div>
        </template>

        <template v-else-if="userServices.length === 0">
          <div class="text-center py-12 border-2 border-dashed border-muted rounded-lg">
            <div class="text-muted-foreground">
              <h3 class="text-lg font-medium mb-2">No services linked yet</h3>
              <p class="text-sm">Select services from the available list above to get started</p>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Card v-for="service in userServices" :key="service.code" class="relative">
              <CardHeader class="p-4">
                <div class="flex items-start gap-3">
                  <img
                    :src="service.icon_url"
                    :alt="service.name"
                    class="w-16 h-16 rounded-lg object-cover"
                  />
                  <div class="flex-1 min-w-0">
                    <CardTitle class="text-sm font-medium">{{ service.name }}</CardTitle>
                    <p class="text-xs text-muted-foreground mt-1">{{ service.code }}</p>
                    <div class="flex items-center justify-between mt-3">
                      <div class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                        Active
                      </div>
                      <UnlinkServiceAlert
                        :name-of-service="service.name"
                        :user-i-d="userID.toString()"
                        :code-service="service.code"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </template>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'

import DashboardLayout from '../layouts/DashboardLayout.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import UnlinkServiceAlert from '@/components/custom/alerts/UnlinkServiceAlert.vue'
import CardServiceSkeleton from '@/components/custom/skeletons/CardServiceSkeleton.vue'
import BackToDashboardButton from '@/components/custom/buttons/BackToDashboardButton.vue'
import { X, Copy, Plus, Search } from 'lucide-vue-next'

import { useAdminServices } from '@/composables/useAdminServices'

const route = useRoute()
const queryClient = useQueryClient()
const userID = route.params.id as string

// Use the admin services composable
const {
  userServices,
  selectedServiceCodes,
  searchQuery,
  debouncedSearchQuery,
  filteredServices,
  searchResultsCount,
  clearSearch,
  isLoadingAdminServices,
  isLoadingUserServices,
  isLinkingServices,
  adminServicesError,
  userServicesError,
  addServiceToSelection,
  removeServiceFromSelection,
  clearSelection,
  linkSelectedServices,
  copyServiceCode,
  getServiceState,
  isServiceLinked,
} = useAdminServices(userID)

// Handle clicking on a service card
const handleServiceClick = (serviceCode: string) => {
  if (isServiceLinked(serviceCode)) {
    // Do nothing for already linked services
    return
  }

  addServiceToSelection(serviceCode)
}
</script>
