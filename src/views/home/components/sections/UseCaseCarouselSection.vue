<template>
  <section id="use-cases" class="py-20 bg-muted/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          INDUSTRY SOLUTIONS
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Tailored for your industry
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          See how IRADAT transforms operations across different industries with specialized features
          and workflows.
        </p>
      </div>

      <!-- Industry Tabs -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          v-for="(useCase, index) in useCases"
          :key="useCase.id"
          :variant="activeSlide === index ? 'default' : 'outline'"
          size="sm"
          @click="goToSlide(index)"
          class="transition-all duration-200"
        >
          {{ useCase.industry }}
        </Button>
      </div>

      <!-- Carousel Container -->
      <div class="relative overflow-hidden rounded-2xl bg-card border border-border">
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${activeSlide * 100}%)` }"
        >
          <div v-for="useCase in useCases" :key="useCase.id" class="w-full flex-shrink-0">
            <div class="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
              <!-- Content Side -->
              <div class="flex flex-col justify-center">
                <div class="mb-6">
                  <Badge class="mb-4" :variant="getBadgeVariant(useCase.industry)">
                    {{ useCase.industry }}
                  </Badge>
                  <h3 class="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    {{ useCase.title }}
                  </h3>
                  <p class="text-lg text-muted-foreground mb-6">
                    {{ useCase.description }}
                  </p>
                </div>

                <!-- Key Features -->
                <div class="mb-8">
                  <h4 class="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                    Key Features
                  </h4>
                  <div class="grid sm:grid-cols-2 gap-3">
                    <div
                      v-for="feature in useCase.features"
                      :key="feature"
                      class="flex items-center space-x-2"
                    >
                      <Check class="w-4 h-4 text-primary flex-shrink-0" />
                      <span class="text-sm text-muted-foreground">{{ feature }}</span>
                    </div>
                  </div>
                </div>

                <!-- Metrics (if available) -->
                <div v-if="useCase.metrics" class="mb-8">
                  <h4 class="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                    Proven Results
                  </h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div
                      v-for="metric in useCase.metrics"
                      :key="metric.label"
                      class="text-center p-3 bg-muted/50 rounded-lg"
                    >
                      <div class="text-2xl font-bold text-foreground">{{ metric.value }}</div>
                      <div class="text-xs text-muted-foreground">{{ metric.label }}</div>
                    </div>
                  </div>
                </div>

                <!-- CTA -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" @click="handleCTA(useCase.cta)" class="flex-1 sm:flex-none">
                    {{ useCase.cta.label }}
                    <ExternalLink class="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    @click="requestDemo(useCase.industry)"
                    class="flex-1 sm:flex-none"
                  >
                    Request Demo
                  </Button>
                </div>
              </div>

              <!-- Visual Side -->
              <div class="relative">
                <div
                  class="aspect-[4/3] lg:aspect-square relative overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted/50"
                >
                  <img
                    :src="useCase.image"
                    :alt="`${useCase.industry} dashboard preview`"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <!-- Overlay with play button for demo -->
                  <div
                    class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <div
                      class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <Play class="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                </div>

                <!-- Floating Stats -->
                <div
                  class="absolute top-4 right-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
                >
                  <div class="text-sm font-semibold text-foreground">Live Dashboard</div>
                  <div class="flex items-center space-x-2 mt-1">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-xs text-muted-foreground">Real-time data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Dots -->
        <div class="flex justify-center space-x-2 p-6">
          <button
            v-for="(_, index) in useCases"
            :key="index"
            @click="goToSlide(index)"
            class="w-2 h-2 rounded-full transition-all duration-200"
            :class="activeSlide === index ? 'bg-primary w-8' : 'bg-muted-foreground/30'"
          />
        </div>
      </div>

      <!-- Navigation Arrows -->
      <div class="flex justify-center mt-6 space-x-4">
        <Button variant="outline" size="icon" @click="previousSlide" :disabled="activeSlide === 0">
          <ChevronLeft class="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          @click="nextSlide"
          :disabled="activeSlide === useCases.length - 1"
        >
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'vue-router'
import { Check, ExternalLink, Play, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
// const homepageStore = useHomepageStore()

const activeSlide = ref(0)
const autoPlayInterval = ref<number | null>(null)
const isAutoPlaying = ref(true)

// Enhanced use cases with more detailed data
const useCases = ref([
  {
    id: 'financial',
    title: 'Financial Services Portal',
    description:
      'Streamline compliance management, risk assessment, and regulatory reporting with automated workflows and real-time monitoring.',
    industry: 'Financial Services',
    image: '/use-cases/financial-dashboard.jpg',
    features: [
      'Regulatory Compliance Automation',
      'Risk Management Dashboard',
      'Audit Trail Generation',
      'Real-time Transaction Monitoring',
      'Automated Reporting',
      'Data Encryption & Security',
    ],
    metrics: [
      { label: 'Compliance Time Saved', value: '75%' },
      { label: 'Risk Detection Improvement', value: '40%' },
    ],
    cta: { label: 'View Financial Case Study', action: '/case-studies/financial' },
  },
  {
    id: 'healthcare',
    title: 'Healthcare Data Management',
    description:
      'HIPAA-compliant patient data management with integrated workflows for healthcare providers and medical institutions.',
    industry: 'Healthcare',
    image: '/use-cases/healthcare-dashboard.jpg',
    features: [
      'HIPAA Compliance',
      'Patient Data Security',
      'Electronic Health Records',
      'Appointment Scheduling',
      'Medical Analytics',
      'Telehealth Integration',
    ],
    metrics: [
      { label: 'Data Processing Speed', value: '3x' },
      { label: 'Patient Satisfaction', value: '95%' },
    ],
    cta: { label: 'Explore Healthcare Solutions', action: '/solutions/healthcare' },
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing Operations',
    description:
      'Optimize production workflows, supply chain management, and quality control with real-time IoT data integration.',
    industry: 'Manufacturing',
    image: '/use-cases/manufacturing-dashboard.jpg',
    features: [
      'IoT Data Integration',
      'Production Monitoring',
      'Supply Chain Visibility',
      'Quality Control Systems',
      'Predictive Maintenance',
      'Inventory Management',
    ],
    metrics: [
      { label: 'Production Efficiency', value: '+25%' },
      { label: 'Downtime Reduction', value: '60%' },
    ],
    cta: { label: 'See Manufacturing Demo', action: '/demo/manufacturing' },
  },
  {
    id: 'retail',
    title: 'Retail & E-commerce',
    description:
      'Unify customer data, inventory management, and sales analytics across multiple channels for seamless retail operations.',
    industry: 'Retail',
    image: '/use-cases/retail-dashboard.jpg',
    features: [
      'Omnichannel Integration',
      'Customer Journey Analytics',
      'Inventory Optimization',
      'Sales Performance Tracking',
      'Personalization Engine',
      'Order Management',
    ],
    metrics: [
      { label: 'Sales Growth', value: '+30%' },
      { label: 'Customer Retention', value: '85%' },
    ],
    cta: { label: 'View Retail Solutions', action: '/solutions/retail' },
  },
])

const getBadgeVariant = (industry: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'Financial Services': 'default',
    Healthcare: 'secondary',
    Manufacturing: 'outline',
    Retail: 'destructive',
  }
  return variants[industry] || 'default'
}

const goToSlide = (index: number) => {
  activeSlide.value = index
  resetAutoPlay()
}

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % useCases.value.length
  resetAutoPlay()
}

const previousSlide = () => {
  activeSlide.value = activeSlide.value === 0 ? useCases.value.length - 1 : activeSlide.value - 1
  resetAutoPlay()
}

const startAutoPlay = () => {
  if (!isAutoPlaying.value) return
  autoPlayInterval.value = setInterval(() => {
    nextSlide()
  }, 8000) // 8 seconds per slide
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

const resetAutoPlay = () => {
  stopAutoPlay()
  setTimeout(startAutoPlay, 1000) // Resume after 1 second
}

const handleCTA = (cta: { label: string; action: string }) => {
  if (cta.action.startsWith('/')) {
    router.push(cta.action)
  } else {
    window.open(cta.action, '_blank')
  }
}

const requestDemo = (industry: string) => {
  router.push(`/book-demo?industry=${encodeURIComponent(industry)}`)
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      previousSlide()
      break
    case 'ArrowRight':
      nextSlide()
      break
    case ' ':
      event.preventDefault()
      isAutoPlaying.value = !isAutoPlaying.value
      if (isAutoPlaying.value) {
        startAutoPlay()
      } else {
        stopAutoPlay()
      }
      break
  }
}

onMounted(() => {
  startAutoPlay()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  stopAutoPlay()
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Add smooth transitions for better UX */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

/* Pause auto-play on hover */
.group:hover {
  animation-play-state: paused;
}
</style>
