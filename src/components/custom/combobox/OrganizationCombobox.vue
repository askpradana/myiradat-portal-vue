<script setup lang="ts">
import { ref, watch, onMounted, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getListOrganization } from '@/api/organizations/getListOrganizations'
import { ChevronsUpDown, Check } from 'lucide-vue-next'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import type { ResponseAPIGetOrganizationsData } from '@/types/organizationType'

const searchTerm = ref('')
const debouncedSearchTerm = ref('')
const selectedValue = ref<string | null>(null)
const isOpen = ref(false)

let debounceTimer: number | undefined

// Load initial data on component mount
onMounted(() => {
  debouncedSearchTerm.value = ''
})

watch(searchTerm, (newValue) => {
  // Do not clear search term when a value is selected
  if (
    selectedValue.value &&
    organizationsResponse.value?.organizations?.find((org) => org.id === selectedValue.value)
      ?.name === newValue
  ) {
    return
  }

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedSearchTerm.value = newValue
  }, 300) // Reduced debounce time for better UX
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
  staleTime: 30000, // 30 seconds
}) as {
  data: Ref<ResponseAPIGetOrganizationsData | undefined>
  isLoading: Ref<boolean>
  error: Ref<boolean>
}

const emit = defineEmits(['update:modelValue'])

watch(selectedValue, (newValue) => {
  const selectedOrg = organizationsResponse.value?.organizations?.find((org) => org.id === newValue)
  if (selectedOrg) {
    searchTerm.value = selectedOrg.name
  }

  emit('update:modelValue', newValue)
})

// Handle combobox open/close
const handleFocus = () => {
  isOpen.value = true
  // Only clear search term if no value is selected
  if (!selectedValue.value) {
    searchTerm.value = ''
  }
}
</script>

<template>
  <ComboboxRoot v-model="selectedValue" v-model:open="isOpen" class="relative">
    <ComboboxAnchor
      class="min-w-[160px] w-full inline-flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ComboboxInput
        v-model="searchTerm"
        placeholder="Search organization..."
        class="!bg-transparent outline-none placeholder-muted-foreground w-full"
        @focus="handleFocus"
      />
      <ComboboxTrigger>
        <ChevronsUpDown class="h-4 w-4 opacity-50" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent
      class="absolute z-10 w-[--radix-combobox-trigger-width] mt-1 min-w-[160px] bg-popover text-popover-foreground overflow-hidden rounded-md shadow-md border will-change-[opacity,transform] data-[side=top]:animate-in data-[side=top]:fade-in-0 data-[side=top]:zoom-in-95 data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:zoom-in-95"
    >
      <ComboboxViewport class="p-1">
        <ComboboxEmpty class="text-muted-foreground text-sm text-center py-2">
          <span v-if="isLoading">Loading...</span>
          <span v-else-if="error">Error loading organizations</span>
          <span v-else>No organization found.</span>
        </ComboboxEmpty>

        <ComboboxGroup v-if="organizationsResponse?.organizations?.length ?? 0 > 0">
          <ComboboxItem
            v-for="org in organizationsResponse?.organizations"
            :key="org.id"
            :value="org.id"
            class="text-sm rounded-sm flex items-center p-2 relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
          >
            <ComboboxItemIndicator
              class="absolute left-2 w-4 inline-flex items-center justify-center"
            >
              <Check class="h-4 w-4" />
            </ComboboxItemIndicator>
            <span class="ml-6">{{ org.name }}</span>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
