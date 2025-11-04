<template>
  <div class="relative" @mouseenter="showDropdown" @mouseleave="hideDropdown">
    <!-- Services Trigger -->
    <div class="flex items-center space-x-1">
      <router-link
        to="/solutions"
        class="hover:text-primary transition-colors duration-200"
        @click="handleServicesTriggerClick"
      >
        Services
      </router-link>
      <button @click="toggleDropdown" class="p-1 hover:text-primary transition-colors duration-200">
        <ChevronDown
          class="w-3 h-3 transition-transform duration-200"
          :class="{ 'rotate-180': isDropdownVisible }"
        />
      </button>
    </div>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isDropdownVisible"
        class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-background/95 backdrop-blur-lg border border-border/30 rounded-2xl shadow-xl z-50"
      >
        <div class="p-4 space-y-1">
          <router-link
            v-for="service in services"
            :key="service.path"
            :to="service.path"
            class="block px-4 py-3 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200 group"
            @click="() => handleServiceSelect(service)"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">{{ service.name }}</div>
                <div class="text-xs text-muted-foreground">{{ service.description }}</div>
              </div>
              <ArrowRight class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, ArrowRight } from 'lucide-vue-next'
import { useServicesData } from '@/composables/services/useServicesData'

// Define emits for better component composition
const emit = defineEmits<{
  'dropdown-shown': []
  'dropdown-hidden': []
  'service-selected': [service: ServiceItem]
  'services-trigger-clicked': []
}>()

interface ServiceItem {
  name: string
  path: string
  description: string
}

const isDropdownVisible = ref(false)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const { getAllServices } = useServicesData()

const services = computed<ServiceItem[]>(() => {
  return getAllServices().map(service => ({
    name: service.title,
    path: `/services/${service.slug}`,
    description: service.description.slice(0, 50) + '...'
  }))
})

const showDropdown = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  isDropdownVisible.value = true
  emit('dropdown-shown')
}

const hideDropdown = () => {
  hideTimeout = setTimeout(() => {
    isDropdownVisible.value = false
    emit('dropdown-hidden')
  }, 150)
}

const toggleDropdown = () => {
  if (isDropdownVisible.value) {
    hideDropdown()
  } else {
    showDropdown()
  }
}

const handleServicesTriggerClick = () => {
  emit('services-trigger-clicked')
  hideDropdown()
}

const handleServiceSelect = (service: ServiceItem) => {
  emit('service-selected', service)
  hideDropdown()
}
</script>