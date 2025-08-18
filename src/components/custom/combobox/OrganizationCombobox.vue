<template>
  <div ref="comboboxEl" class="relative w-full">
    <div class="relative">
      <Input
        v-model="searchTerm"
        :placeholder="isFetchingInitialName ? 'Loading...' : 'Search organization...'"
        class="w-full pr-10"
        :disabled="isFetchingInitialName"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
        :disabled="isFetchingInitialName"
        @click="isOpen = !isOpen"
      >
        <ChevronsUpDown class="h-4 w-4 opacity-50" />
      </button>
    </div>

    <div
      v-if="isOpen && (organizationsResponse?.organizations?.length || isLoading || error)"
      class="absolute z-10 w-full mt-1 bg-popover text-popover-foreground rounded-md shadow-lg border"
    >
      <div class="p-1">
        <div v-if="isLoading" class="text-muted-foreground text-sm text-center py-2">
          Loading...
        </div>
        <div v-else-if="error" class="text-muted-foreground text-sm text-center py-2">
          Error loading organizations
        </div>
        <div
          v-else-if="!organizationsResponse?.organizations?.length"
          class="text-muted-foreground text-sm text-center py-2"
        >
          No organization found.
        </div>
        <ul v-else class="max-h-60 overflow-auto">
          <li
            v-for="org in organizationsResponse.organizations"
            :key="org.id"
            class="text-sm rounded-sm flex items-center p-2 relative select-none cursor-pointer hover:bg-accent hover:text-accent-foreground"
            @mousedown="selectOrganization(org)"
          >
            <Check v-if="selectedValue === org.id" class="h-4 w-4 mr-2" />
            <span :class="{ 'ml-6': selectedValue !== org.id }">{{ org.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getListOrganization } from '@/api/organizations/getListOrganizations'
import { getOrganizationDetail } from '@/api/organizations/getOrganizationDetail'
import { ChevronsUpDown, Check } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { onClickOutside } from '@vueuse/core'
import type {
  OrganizationInterface,
  ResponseAPIGetOrganizationsData,
} from '@/types/organizationType'

const props = defineProps<{
  modelValue?: string | null
}>()

const emit = defineEmits(['update:modelValue'])

const searchTerm = ref('')
const debouncedSearchTerm = ref('')
const selectedValue = ref(props.modelValue)
const isOpen = ref(false)
const comboboxEl = ref(null)
const isFetchingInitialName = ref(false)

let debounceTimer: number | undefined
let blurTimeout: number | undefined

onClickOutside(comboboxEl, () => {
  isOpen.value = false
})

const {
  data: organizationsResponse,
  isLoading,
  error,
} = useQuery({
  queryKey: ['organizations', debouncedSearchTerm],
  queryFn: () =>
    getListOrganization({
      page: 1,
      page_size: 30,
      search_by: 'name',
      search_query: debouncedSearchTerm.value,
    }),
  enabled: true,
  retry: 1,
  staleTime: 30000,
}) as {
  data: Ref<ResponseAPIGetOrganizationsData | undefined>
  isLoading: Ref<boolean>
  error: Ref<boolean>
}

const selectOrganization = (org: OrganizationInterface) => {
  selectedValue.value = org.id
  searchTerm.value = org.name
  isOpen.value = false
  emit('update:modelValue', org.id)
}

const fetchAndSetOrgName = async (orgId: string) => {
  if (!orgId) {
    searchTerm.value = ''
    return
  }
  isFetchingInitialName.value = true
  try {
    const org = await getOrganizationDetail(orgId)
    if (org) {
      searchTerm.value = org.data.name
    }
  } catch (e) {
    console.error('Failed to fetch organization detail', e)
    searchTerm.value = ''
    selectedValue.value = null
    emit('update:modelValue', null)
  } finally {
    isFetchingInitialName.value = false
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== selectedValue.value) {
      selectedValue.value = newValue
      fetchAndSetOrgName(newValue)
    } else if (!newValue) {
      selectedValue.value = null
      searchTerm.value = ''
    }
  },
)

watch(searchTerm, (newValue) => {
  const selectedOrg = organizationsResponse.value?.organizations?.find(
    (org) => org.id === selectedValue.value,
  )
  if (selectedOrg && newValue === selectedOrg.name) {
    return
  }

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedSearchTerm.value = newValue
  }, 300)
})

const handleFocus = () => {
  isOpen.value = true
  clearTimeout(blurTimeout)
}

const handleBlur = () => {
  blurTimeout = setTimeout(() => {
    isOpen.value = false
    const selectedOrg = organizationsResponse.value?.organizations?.find(
      (org) => org.id === selectedValue.value,
    )

    if (selectedValue.value && !selectedOrg) {
      fetchAndSetOrgName(selectedValue.value)
    } else if (selectedOrg && searchTerm.value !== selectedOrg.name) {
      searchTerm.value = selectedOrg.name
    } else if (!selectedValue.value) {
      searchTerm.value = ''
    }
  }, 200)
}

const handleInput = () => {
  isOpen.value = true
  const selectedOrg = organizationsResponse.value?.organizations?.find(
    (org) => org.id === selectedValue.value,
  )
  if (selectedOrg && searchTerm.value !== selectedOrg.name) {
    selectedValue.value = null
    emit('update:modelValue', null)
  }
}

onMounted(() => {
  if (props.modelValue) {
    fetchAndSetOrgName(props.modelValue)
  }
  debouncedSearchTerm.value = ''
})
</script>
