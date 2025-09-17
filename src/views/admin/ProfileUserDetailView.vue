<template>
  <DashboardLayout>
    <Button variant="default" class="mb-8" @click="toDasboard">
      <ArrowLeft :size="18" /> Back to Dashboard</Button
    >

    <div v-if="isPending" class="space-y-6 animate-pulse">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="p-6 bg-muted rounded-lg h-96"></div>
        <div class="p-6 bg-muted rounded-lg h-96"></div>
      </div>
      <div class="grid grid-cols-1">
        <div class="p-6 bg-muted rounded-lg h-96"></div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Profile Header -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileHeaderAdmin
          :name="data?.user.name"
          :email="data?.user.email"
          :phone="data?.user.phone"
          :verified_at="data?.user.verified_at"
          :role_id="data?.user.role_id"
          :date_of_birth="data?.user.date_of_birth"
          :role_name="data?.user.role_name"
          :is-pending="isPending"
        >
          <template #actions>
            <Button v-if="isPending" size="sm" variant="outline" disabled class="w-full">
              <div
                class="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"
              ></div>
              Loading...
            </Button>
            <Button
              v-else-if="error"
              size="sm"
              variant="outline"
              @click="refreshProfile"
              class="w-full"
            >
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </Button>
          </template>
        </ProfileHeaderAdmin>
        <ProfileUserForm
          :name="data?.user.name"
          :email="data?.user.email"
          :phone="data?.user.phone"
          :date_of_birth="data?.user.date_of_birth"
          :is-pending="isPending"
          :user-i-d="userID.toString()"
        />
      </div>

      <div class="grid grid-cols-1">
        <AssesmentProfile
          :error="error"
          :ipro="data?.user.ipro ? JSON.parse(data?.user.ipro.toString()) : null"
          :iprob="data?.user.iprob ? JSON.parse(data?.user.iprob.toString()) : null"
          :ipros="data?.user.ipros ? JSON.parse(data?.user.ipros.toString()) : null"
          :last-analyzed="
            data?.user.last_analyzed ? JSON.parse(data?.user.last_analyzed.toString()) : null
          "
          :is-loading="isPending"
          :refetch="() => refetch().then(() => {})"
        />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
// import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/vue-query'

// import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import DashboardLayout from '@/views/layouts/DashboardLayout.vue'
import ProfileUserForm from '@/components/custom/custom-form/ProfileUserForm.vue'
import { getProfileByID } from '@/api/users/getUserProfileById'
import ProfileHeaderAdmin from '@/components/profile/ProfileHeaderAdmin.vue'
import AssesmentProfile from '@/components/profile/AssesmentProfile.vue'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const userID = route.params.id

const { data, isPending, error, refetch } = useQuery({
  queryKey: ['profile', userID],
  queryFn: () => getProfileByID(userID as string),
  staleTime: 5 * 60 * 1000, // 5 minutes  },
})

const refreshProfile = () => {
  refetch()
}

const toDasboard = () => {
  router.push('/dashboard?tab=users')
}
</script>
