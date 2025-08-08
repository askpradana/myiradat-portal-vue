<template>
  <DashboardLayout>
    <Button @click="backToDashboard" variant="default"> <ArrowLeft /> Back to dashboard </Button>
    <h2 class="my-8 font-bold text-xl">User Services</h2>

    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <template v-if="isPending">
        <CardServiceSkeleton />
      </template>

      <template v-else>
        <Card v-for="service in data?.data.services" :key="service.code">
          <CardHeader>
            <CardTitle class="text-sm font-bold text-foreground">{{ service.name }}</CardTitle>
            <CardContent class="px-0">
              <div class="flex justify-between items-center w-full gap-2 mt-2">
                <img :src="service.icon_url" alt="icon" class="w-[80px] h-[80px]" />
                <UnlinkServiceAlert
                  :name-of-service="service.name"
                  :user-i-d="userID.toString()"
                  :code-service="service.code"
                />
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '../layouts/DashboardLayout.vue'
import Button from '@/components/ui/button/Button.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { getUserService, type UserServiceResponse } from '@/api/services/getUserServices'
import type { Ref } from 'vue'
import UnlinkServiceAlert from '@/components/custom/alerts/UnlinkServiceAlert.vue'
import CardServiceSkeleton from '@/components/custom/skeletons/CardServiceSkeleton.vue'

const router = useRouter()
const route = useRoute()

const userID = route.params.id

const { isPending, data } = useQuery({
  queryKey: ['services', userID],
  queryFn: () => getUserService(userID as string),
  staleTime: 1000 * 60 * 2, // 5 minutes
}) as {
  isPending: Ref<boolean>
  data: Ref<UserServiceResponse | undefined>
}

const backToDashboard = () => {
  router.push('/dashboard')
}
</script>
