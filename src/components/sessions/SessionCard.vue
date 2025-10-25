<template>
  <Card class="mx-6 p-4 flex gap-4 relative">
    <p class="font-semibold text-sm">{{ t('common.sessions.loginAt') }}: {{ formatDate(data?.login_time) }}</p>
    <div
      class="flex flex-col md:flex-row justify-center md:items-start md:justify-between md:w-full"
    >
      <div class="flex space-x-6 items-center flex-col md:flex-row">
        <div
          :class="cn(
            'ml-6 md:ml-0 relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-semibold',
            'shadow-lg ring-2 ring-black/10 dark:ring-white/20 transition-all duration-200 hover:shadow-xl hover:scale-105',
            deviceGradientClass,
            deviceTextColorClass
          )"
          :title="`${data?.device_type}`"
          role="img"
          :aria-label="`Avatar for ${data?.device_type || 'Desktop'}`"
        >
          <component :is="deviceIcon" :size="40" :class="deviceIconColorClass" />
          <div
            :class="[
              'w-5 h-5 rounded-full absolute right-0 bottom-1 border-2',
              data.is_active ? 'bg-green-500 border-white ' : 'bg-gray-400',
            ]"
            :title="data.is_active ? t('common.sessions.active') : t('common.sessions.inactive')"
          ></div>
        </div>
        <div class="flex flex-col my-4 text-center md:text-start">
          <h4 class="font-semibold text-base">{{ data.os }} - {{ data.browser }}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('common.sessions.ipAddress') }}: {{ data.ip_address }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('common.sessions.lastActivity') }}: {{ formatDate(data.last_activity) }}
          </p>
        </div>
      </div>
      <div class="flex flex-col md:items-end items-center justify-center gap-2">
        <Badge v-if="data.is_current" class="text-center w-fit" variant="default"
          >{{ t('common.sessions.currentSession') }}</Badge
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
import { useI18n } from 'vue-i18n'
import { type sessionInterface } from '@/types/sessionsType'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Laptop, Smartphone, Tablet } from 'lucide-vue-next'
import { formatDate } from '@/lib/dateFromate'
import DeleteSessionSpecificAlert from '@/components/custom/alerts/DeleteSessionSpecificAlert.vue'
import { cn } from '@/lib/utils'

const { t } = useI18n()

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

// Device-specific gradient system matching ProfileHeader.vue
const deviceGradients = [
  'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800', // desktop
  'bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-800',    // mobile
  'bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800' // tablet
]

const deviceTextColors = [
  'text-slate-800 dark:text-slate-200', // desktop
  'text-blue-800 dark:text-blue-200',   // mobile
  'text-purple-800 dark:text-purple-200' // tablet
]

const deviceIconColors = [
  'text-slate-700 dark:text-slate-300', // desktop
  'text-blue-700 dark:text-blue-300',   // mobile
  'text-purple-700 dark:text-purple-300' // tablet
]

const getDeviceIndex = (deviceType: string): number => {
  switch (deviceType) {
    case 'desktop':
      return 0
    case 'mobile':
      return 1
    case 'tablet':
      return 2
    default:
      return 0
  }
}

const deviceGradientClass = computed(() => {
  const index = getDeviceIndex(props.data.device_type)
  return deviceGradients[index]
})

const deviceTextColorClass = computed(() => {
  const index = getDeviceIndex(props.data.device_type)
  return deviceTextColors[index]
})

const deviceIconColorClass = computed(() => {
  const index = getDeviceIndex(props.data.device_type)
  return deviceIconColors[index]
})
</script>
