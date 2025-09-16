<template>
  <Card class="mx-6 p-4 flex gap-4 relative">
    <p class="font-semibold text-sm">Login at: {{ formatDate(data?.login_time) }}</p>
    <div
      class="flex flex-col md:flex-row justify-center md:items-start md:justify-between md:w-full"
    >
      <div class="flex space-x-6 items-center flex-col md:flex-row">
        <div
          class="ml-6 md:ml-0 relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg"
          :title="`${data?.device_type}`"
          role="img"
          :aria-label="`Avatar for ${data?.device_type || 'Desktop'}`"
        >
          <component :is="deviceIcon" :size="40" class="text-white" />
          <div
            :class="[
              'w-5 h-5 rounded-full absolute right-0 bottom-1 border-2',
              data.is_active ? 'bg-green-500 border-white ' : 'bg-gray-400',
            ]"
            :title="data.is_active ? 'Active' : 'Inactive'"
          ></div>
        </div>
        <div class="flex flex-col my-4 text-center md:text-start">
          <h4 class="font-semibold text-base">{{ data.os }} - {{ data.browser }}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">IP Address: {{ data.ip_address }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Last activity: {{ formatDate(data.last_activity) }}
          </p>
        </div>
      </div>
      <div class="flex flex-col md:items-end items-center justify-center gap-2">
        <Badge v-if="data.is_current" class="text-center w-fit" variant="default"
          >Current Session</Badge
        >
        <DeleteSessionSpecificAlert
          v-if="!data.is_current"
          :name-of-browser="data.browser"
          :session-i-d="data.session_id"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type sessionInterface } from '@/types/sessionsType'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Laptop, Smartphone, Tablet } from 'lucide-vue-next'
import { formatDate } from '@/lib/dateFromate'
import DeleteSessionSpecificAlert from '../custom/alerts/DeleteSessionSpecificAlert.vue'

const props = defineProps<{
  data: sessionInterface
  isPending: boolean
}>()

const deviceIcon = computed(() => {
  switch (props.data.device_type) {
    case 'desktop':
      return Laptop
    case 'mobile':
      return Smartphone
    case 'tablet':
      return Tablet
    default:
      return Laptop
  }
})
</script>
