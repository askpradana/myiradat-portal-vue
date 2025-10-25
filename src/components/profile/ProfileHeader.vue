<template>
  <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
    <!-- Avatar Section -->
    <div class="relative">
      <div
        :class="cn(
          'w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-semibold',
          'shadow-lg ring-2 ring-black/10 dark:ring-white/20 transition-all duration-200 hover:shadow-xl hover:scale-105',
          avatarGradientClass,
          avatarTextColorClass
        )"
        :title="`${user?.name} Avatar`"
        role="img"
        :aria-label="`Avatar for ${user?.name || 'user'}`"
      >
        {{ initials }}
      </div>

      <!-- Status Indicator -->
      <div
        class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
        :class="statusIndicator.classes"
        :title="statusIndicator.text"
        :aria-label="statusIndicator.text"
      >
        <CheckIcon class="w-3 h-3" />
      </div>
    </div>

    <!-- Profile Info -->
    <div class="flex-1 text-center sm:text-left">
      <h2 class="text-2xl font-bold text-foreground">{{ user?.name || t('common.states.loading') }}</h2>
      <p class="text-muted-foreground mt-1">{{ user?.email }}</p>

      <!-- Badges Container -->
      <div class="mt-3 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2">
        <!-- Role Badge -->
        <div
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          :class="roleBadgeClasses"
        >
          <UserIcon class="w-4 h-4 mr-2" />
          {{ roleDisplayName }}
        </div>
        
        <!-- Organization Badge -->
        <div 
          v-if="organizationDisplay && user"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          :class="organizationDisplay.classes"
          :title="organizationDisplay.title"
          :aria-label="organizationDisplay.ariaLabel"
        >
          <component :is="organizationDisplay.icon" class="w-4 h-4 mr-2" />
          {{ organizationDisplay.text }}
        </div>
      </div>

      <!-- Additional Info - Verified date only shows when NOT editing -->
      <div class="mt-4 grid grid-cols-1 gap-3 text-sm" v-if="!isEditing && user?.verified_at">
        <div>
          <span class="text-muted-foreground">{{ t('profile.labels.verified') }}:</span>
          <span class="ml-2 text-foreground">{{ formatVerifiedDate(user.verified_at) }}</span>
        </div>
      </div>
    </div>

    <!-- Actions Area -->
    <div class="flex flex-col space-y-2 min-w-[120px]">
      <slot name="actions">
        <!-- Actions will be passed in from parent -->
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { CheckIcon, UserIcon, HomeIcon, BuildingIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

import type { UserDataInterface } from '@/types/userType'

interface ProfileStats {
  completionPercentage: number
}

interface Props {
  user: UserDataInterface | null
  initials: string
  roleDisplayName: string
  profileStats: ProfileStats
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false
})

const { t } = useI18n()

// Profile completion status
const isProfileComplete: ComputedRef<boolean> = computed(() => {
  return props.profileStats.completionPercentage >= 80
})

const statusIndicator: ComputedRef<{ classes: string; text: string }> = computed(() => {
  if (isProfileComplete.value) {
    return {
      classes: 'bg-green-500 text-white',
      text: t('profile.status.complete')
    }
  }
  return {
    classes: 'bg-yellow-500 text-white',
    text: t('profile.status.incomplete')
  }
})

// Role badge styling
const roleBadgeClasses: ComputedRef<string> = computed(() => {
  const roleId = props.user?.role_id

  if (roleId === 1) {
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  }

  return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
})

// Helper function for verified date formatting
const formatVerifiedDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return t('profile.labels.invalidDate')
  }
}

// Avatar gradient system - Enhanced Apple/shadcn-ui inspired with better visual weight
const avatarGradients = [
  'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800',
  'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700',
  'bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800',
  'bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800',
  'bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800',
  'bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-800/80 dark:to-rose-700/80'
]

const avatarTextColors = [
  'text-slate-800 dark:text-slate-200',
  'text-gray-800 dark:text-gray-200',
  'text-stone-800 dark:text-stone-200',
  'text-neutral-800 dark:text-neutral-200',
  'text-zinc-800 dark:text-zinc-200',
  'text-rose-800 dark:text-rose-200'
]

// Generate consistent gradient based on user name
const getAvatarIndex = (name: string): number => {
  if (!name) return 0
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash) % avatarGradients.length
}

const avatarGradientClass: ComputedRef<string> = computed(() => {
  const index = getAvatarIndex(props.user?.name || '')
  return avatarGradients[index]
})

const avatarTextColorClass: ComputedRef<string> = computed(() => {
  const index = getAvatarIndex(props.user?.name || '')
  return avatarTextColors[index]
})

// Organization badge display
const organizationDisplay: ComputedRef<{
  text: string
  icon: typeof BuildingIcon | typeof HomeIcon
  classes: string
  title: string
  ariaLabel: string
} | null> = computed(() => {
  if (!props.user) return null

  // User has organization name
  if (props.user.organization_name) {
    return {
      text: props.user.organization_name,
      icon: BuildingIcon,
      classes: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
      title: t('profile.organization.memberOf', { name: props.user.organization_name }),
      ariaLabel: t('profile.organization.ariaLabel', { name: props.user.organization_name })
    }
  } 
  
  // User is personal (no organization)
  return {
    text: t('profile.organization.personal'),
    icon: HomeIcon,
    classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    title: t('profile.organization.personalAccount'),
    ariaLabel: t('profile.organization.personalAriaLabel')
  }
})
</script>
