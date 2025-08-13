<template>
  <DashboardLayout>
    <BackToDashboardButton />

    <!-- Loading State -->
    <template v-if="isPending">
      <DetailOrganizationSkeleton />
    </template>

    <!-- Content -->
    <div v-else-if="data" class="space-y-6 mt-6">
      <!-- Hero Section with Gradient Background -->
      <Card class="relative overflow-hidden">
        <CardContent class="p-8">
          <div
            class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6"
          >
            <div class="relative">
              <div class="w-30 h-30 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white/50">
                <img
                  :src="data?.logo_url"
                  alt="Organization Logo"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="absolute -bottom-1 -right-1">
                <div
                  :class="getStatusDotClass(data?.status)"
                  class="w-6 h-6 rounded-full border-3 border-white shadow-sm"
                ></div>
              </div>
            </div>
            <div class="flex-1">
              <h1 class="text-lg md:text-xl font-bold mb-2">{{ data?.name }}</h1>
              <p class="text-base leading-relaxed">{{ data?.description }}</p>
              <div class="mt-4">
                <span :class="getStatusBadgeClass(data?.status)" class="inline-flex items-center">
                  <CheckCircle2 v-if="data?.status === 'active'" class="w-4 h-4 mr-1.5" />
                  <XCircle v-else class="w-4 h-4 mr-1.5" />
                  {{ data?.status.toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card class="group border-l-4 border-l-blue-500">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-semibold flex items-center gap-2">
                  <Building2 class="text-blue-500" /> Industry
                </span>
                <p class="text-lg font-bold mt-2">{{ data?.industry }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="group border-l-4 border-l-green-500">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-semibold flex items-center gap-2">
                  <Users class="text-green-500" /> Size Category</span
                >
                <p class="text-lg font-bold mt-2 capitalize">
                  {{ data?.size_category }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="group border-l-4 border-l-purple-500">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-semibold flex items-center gap-2"
                  ><UserCheck class="text-purple-500" /> Members</span
                >
                <p class="text-lg font-bold mt-2">
                  {{ data?.member_count?.toLocaleString() }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="group border-l-4 border-l-orange-500">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-semibold flex items-center gap-2">
                  <Activity class="text-orange-500" />Status</span
                >
                <span :class="getStatusBadgeClass(data?.status)" class="text-sm font-semibold mt-2">
                  {{ data?.status.toUpperCase() }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Contact Information -->
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ContactIcon class="w-5 h-5 text-blue-600" />
            </div>
            <h2 class="text-2xl font-bold">Contact Information</h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="group p-4 border rounded-xl">
              <div class="flex items-start space-x-3">
                <div
                  class="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center bg-blue-100 transition-colors"
                >
                  <Mail class="w-5 h-5 text-blue-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Email Address</p>
                  <a :href="`mailto:${data?.email}`" class="text-blue-600 font-medium break-all">
                    {{ data?.email }}
                  </a>
                </div>
              </div>
            </div>

            <div class="group p-4 border rounded-xl">
              <div class="flex items-start space-x-3">
                <div
                  class="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center bg-green-100 transition-colors"
                >
                  <Phone class="w-5 h-5 text-green-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Phone Number</p>
                  <a :href="`tel:${data?.phone}`" class="text-green-600 font-medium">
                    {{ data?.phone }}
                  </a>
                </div>
              </div>
            </div>

            <div class="group p-4 border rounded-xl">
              <div class="flex items-start space-x-3">
                <div
                  class="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center bg-purple-100 transition-colors"
                >
                  <Globe class="w-5 h-5 text-purple-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Website</p>
                  <a
                    :href="data?.website_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-purple-600 font-medium break-all"
                  >
                    {{ data?.website_url }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Address Information -->
      <Card v-if="parsedAddress">
        <CardContent class="p-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <MapPin class="w-5 h-5 text-green-600" />
            </div>
            <h2 class="text-2xl font-bold">Address</h2>
          </div>

          <div class="border rounded-xl p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div class="flex items-start space-x-2">
                <div>
                  <span class="text-sm font-semibold flex items-center gap-2">
                    <Home :size="18" /> Street:</span
                  >
                  <p class="font-medium ml-6">{{ parsedAddress.street }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-2">
                <div>
                  <span class="text-sm font-semibold flex items-center gap-2">
                    <Building :size="18" />City:</span
                  >
                  <p class="font-medium ml-6">{{ parsedAddress.city }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-2">
                <div>
                  <span class="text-sm font-semibold flex items-center gap-2"
                    ><Map :size="18" />State:</span
                  >
                  <p class="font-medium ml-6">{{ parsedAddress.state }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-2">
                <div>
                  <span class="text-sm font-semibold flex items-center gap-2">
                    <Hash :size="18" />Postal Code:</span
                  >
                  <p class="font-medium ml-6">{{ parsedAddress.postal_code }}</p>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-start space-x-2">
                <div>
                  <span class="text-sm font-semibold flex items-center gap-2">
                    <Flag :size="18" /> Country:</span
                  >
                  <p class="font-medium ml-6">{{ parsedAddress.country }}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Error State -->
    <Card v-else class="my-6">
      <CardContent class="p-8 text-center">
        <div
          class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold mb-2">Organization Not Found</h3>
        <p class="">The organization you're looking for could not be found.</p>
      </CardContent>
    </Card>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { getOrganizationDetail } from '@/api/organizations/getOrganizationDetail'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import BackToDashboardButton from '@/components/custom/buttons/BackToDashboardButton.vue'
import { useQuery } from '@tanstack/vue-query'
import type { OrganizationInterface } from '@/types/organizationType'
import { computed, type Ref } from 'vue'
import { CardContent } from '@/components/ui/card'
import Card from '@/components/ui/card/Card.vue'
import { useRoute } from 'vue-router'
import {
  Building2,
  Users,
  UserCheck,
  Activity,
  Mail,
  Phone,
  Globe,
  MapPin,
  Home,
  Building,
  Map,
  Hash,
  Flag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Contact as ContactIcon,
} from 'lucide-vue-next'
import DetailOrganizationSkeleton from '@/components/custom/skeletons/DetailOrganizationSkeleton.vue'

const route = useRoute()
const organizationID = route.params.id as string

const { isPending, data } = useQuery({
  queryKey: ['organizations', organizationID],
  queryFn: () => getOrganizationDetail(organizationID),
  staleTime: 1000 * 60 * 5, // 5 minutes
}) as {
  isPending: Ref<boolean>
  data: Ref<OrganizationInterface | undefined>
}

const parsedAddress = computed(() => {
  try {
    return JSON.parse(data?.value?.address as string)
  } catch {
    return null
  }
})

const getStatusBadgeClass = (status: string | undefined) => {
  const classes = {
    'non-active':
      'inline-flex items-center rounded-full bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-800 ring-1 ring-red-200',
    active:
      'inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-800 ring-1 ring-green-200',
  }
  return classes[status as keyof typeof classes] || classes['non-active']
}

const getStatusDotClass = (status: string | undefined) => {
  const classes = {
    'non-active': 'bg-red-500',
    active: 'bg-green-500',
  }
  return classes[status as keyof typeof classes] || classes['non-active']
}
</script>
