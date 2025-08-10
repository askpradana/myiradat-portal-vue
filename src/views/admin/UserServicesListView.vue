<template>
  <DashboardLayout>
    <BackToDashboardButton />

    <h2 class="my-8 font-bold text-xl">Admin Services</h2>
    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      <Card v-for="service in userStore.services" :key="service.code" class="w-full">
        <CardHeader>
          <CardTitle class="text-xs font-bold text-foreground">{{ service.name }}</CardTitle>
          <CardContent class="px-0">
            <span class="flex items-center gap-4">
              <p class="text-xs">{{ service.code }}</p>
              <Copy
                :size="14"
                class="text-primary cursor-pointer hover:text-primary/80"
                @click="copyCodeService(service.code)"
              />
            </span>
          </CardContent>
        </CardHeader>
      </Card>
    </div>

    <span class="flex items-end gap-2">
      <TagsInputRoot
        v-model="modelValue"
        class="flex gap-2 items-center border p-1.5 rounded-lg w-full max-w-[340px] flex-wrap shadow-sm mt-8"
      >
        <TagsInputItem
          v-for="item in modelValue"
          :key="item"
          :value="item"
          class="text-white bg-violet-500 font-medium flex items-center justify-center gap-2 aria-[current=true]:bg-violet-600 rounded p-0.5"
        >
          <TagsInputItemText class="text-xs pl-1" />
          <TagsInputItemDelete class="p-0.5 rounded bg-transparent hover:bg-black/70">
            <X :size="10" />
          </TagsInputItemDelete>
        </TagsInputItem>

        <TagsInputInput
          placeholder="Service code..."
          class="text-sm flex-1 rounded bg-transparent px-1 focus:outline-none"
        />
      </TagsInputRoot>
      <Button
        size="sm"
        @click="onSubmit"
        :disabled="isSubmitService"
        :class="isSubmitService && 'bg-gray-500 pointer-events-none'"
        >{{ isSubmitService ? 'Please wait...' : 'Submit' }}</Button
      >
    </span>

    <h2 class="my-8 font-bold text-xl">User Services</h2>

    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <template v-if="isetUserServiveLoading">
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
import { useRoute } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useUserStore } from '@/stores/userStores'
import { getUserService, type UserServiceResponse } from '@/api/services/getUserServices'
import type { Ref } from 'vue'
import UnlinkServiceAlert from '@/components/custom/alerts/UnlinkServiceAlert.vue'
import CardServiceSkeleton from '@/components/custom/skeletons/CardServiceSkeleton.vue'
import { X, Copy } from 'lucide-vue-next'
import {
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from 'reka-ui'
import BackToDashboardButton from '@/components/custom/buttons/BackToDashboardButton.vue'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { postUserServiceData } from '@/api/services/postUserService'

const route = useRoute()
const userStore = useUserStore()

const userID = route.params.id
const modelValue = ref<string[]>([])

const { isPending: isetUserServiveLoading, data } = useQuery({
  queryKey: ['services', userID],
  queryFn: () => getUserService(userID as string),
  staleTime: 1000 * 60 * 2, // 5 minutes
}) as {
  isPending: Ref<boolean>
  data: Ref<UserServiceResponse | undefined>
}

const copyCodeService = async (serviceCode: string) => {
  await navigator.clipboard.writeText(serviceCode)
  toast('Copied', {
    description: 'Code already coppied',
  })
  modelValue.value.push(serviceCode)
}

const queryClient = useQueryClient()
const { mutate, isPending: isSubmitService } = useMutation({
  mutationFn: ({ data, userID }: { data: { service_code: string[] }; userID: string }) =>
    postUserServiceData(data, userID),
  onSuccess: (response) => {
    if (response) {
      toast('Success', {
        description: `${response?.message}`,
      })
      queryClient.invalidateQueries({
        queryKey: ['services', userID],
      })
      modelValue.value = []
    }
  },
  onError: (error: Error) => {
    toast('Error', {
      description: `Failed to link service: ${error.message}`,
    })
  },
})

const onSubmit = () => {
  if (modelValue.value.length != 0) {
    const newData = {
      service_code: modelValue.value,
    }
    mutate({
      data: newData,
      userID: userID as string,
    })
  } else {
    toast('Please fill the form')
  }
}
</script>
