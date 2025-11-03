<template>
  <section
    id="services"
    class="py-20 bg-background"
    aria-labelledby="services-title"
    aria-describedby="services-description"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <header class="text-center mb-16">
        <div
          class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          role="banner"
        >
          COMPREHENSIVE SOLUTIONS
        </div>
        <h2 id="services-title" class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          What we offer
        </h2>
        <p id="services-description" class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our range of professional services designed to elevate your organization and
          empower your people.
        </p>
      </header>

      <!-- Services Grid -->
      <div class="services-grid" role="region" aria-label="Our services showcase">
        <ServiceCard
          v-for="service in services"
          :key="service.id"
          :service="service"
          :featured="service.featured"
          @click="handleServiceClick"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ServiceCard from '@/components/custom/cards/ServiceCard.vue'
import servicesData from '@/data/simpleServicesData.json'

interface Service {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  featured: boolean
  category: string
  keyBenefits: string[]
}

const emit = defineEmits<{
  serviceClick: [service: Service]
}>()

const router = useRouter()
const services = servicesData.services

const handleServiceClick = (service: Service) => {
  emit('serviceClick', service)

  // Navigate to service page
  router.push(`/services/${service.id}`)
}
</script>

<style scoped>
/* Simple CSS Grid Layout - Consistent Card Sizes */
.services-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(320px, auto);
}

/* Tablet Layout - 2 columns */
@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    grid-auto-rows: minmax(280px, auto);
  }
}

/* Mobile Layout - 1 column */
@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    grid-auto-rows: minmax(260px, auto);
  }
}

/* Focus management for accessibility */
.services-grid:focus-within {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Smooth transitions for theme changes */
.services-grid * {
  transition-property: color, background-color, border-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .services-grid * {
    transition: none;
  }
}
</style>
