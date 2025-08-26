<template>
  <section
    ref="heroRef"
    class="relative overflow-hidden bg-gradient-to-br from-background via-card/30 to-background min-h-[85vh] flex items-center mt-8"
  >
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Hero Content -->
        <div class="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
          <div class="mb-6">
            <div
              class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              <div class="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
              Trusted by 500+ Enterprise Clients
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {{ config.hero.title.split('with')[0] }}
              <span class="text-primary block">{{ config.hero.title.split('with')[1] }}</span>
            </h1>
          </div>

          <p class="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
            {{ config.hero.subtitle }}
          </p>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
            <Button
              size="lg"
              class="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
              @click="navigateTo(config.hero.cta.primary.href)"
            >
              {{ config.hero.cta.primary.label }}
              <svg
                class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                ></path>
              </svg>
            </Button>
            <Button
              size="lg"
              variant="outline"
              class="text-lg px-8 py-4 backdrop-blur-sm border-2 hover:bg-card/50"
              @click="navigateTo(config.hero.cta.secondary?.href || '/demo')"
            >
              {{ config.hero.cta.secondary?.label || 'Book Demo' }}
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </Button>
          </div>

          <!-- Social Proof -->
          <div
            class="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground"
          >
            <div class="flex items-center space-x-2">
              <div class="flex -space-x-2">
                <DynamicAvatar
                  v-for="i in 3"
                  :key="i"
                  :identifier="`hero_user_${i}`"
                  type="person"
                  :size="32"
                  :alt="`User ${i}`"
                  class="border-2 border-background"
                  :metadata="{ name: `User ${i}` }"
                />
              </div>
              <span>Join thousands of satisfied users</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="flex text-yellow-400">
                <svg v-for="i in 5" :key="i" class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  ></path>
                </svg>
              </div>
              <span>4.9/5 on G2</span>
            </div>
          </div>
        </div>

        <!-- Hero Metrics Grid -->
        <div class="grid grid-cols-2 gap-4 lg:gap-6">
          <div
            v-for="metric in heroMetrics"
            :key="metric.label"
            ref="metricRefs"
            class="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 text-center hover:bg-card/70 transition-all duration-300 hover:scale-105"
          >
            <div class="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              <span v-if="metric.prefix">{{ metric.prefix }}</span>
              <span ref="metricValues">{{ metric.animated ? '0' : metric.value }}</span>
              <span v-if="metric.suffix">{{ metric.suffix }}</span>
            </div>
            <div class="text-sm text-muted-foreground font-medium">{{ metric.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid pattern overlay -->
    <div
      class="absolute inset-0 z-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]"
    ></div>

    <!-- Decorative Elements -->
    <div
      class="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40"
    ></div>
    <div class="absolute top-1/2 right-1/3 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>

    <!-- Floating Elements Animation -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-float"></div>
      <div
        class="absolute top-40 right-32 w-3 h-3 bg-accent/40 rounded-full animate-float-delayed"
      ></div>
      <div
        class="absolute bottom-32 left-1/3 w-1 h-1 bg-primary/50 rounded-full animate-float-slow"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import DynamicAvatar from '@/components/ui/avatar/DynamicAvatar.vue'
import { useRouter } from 'vue-router'
import { useHomepageStore } from '@/stores/homepage'
import { useIntersectionObserver, useAnimations } from '../../composables'

const router = useRouter()
const homepageStore = useHomepageStore()
const { fadeInUp, countUp, staggerChildren } = useAnimations()

const heroRef = ref<HTMLElement>()
const metricRefs = ref<HTMLElement[]>([])
const metricValues = ref<HTMLElement[]>([])

const { config, heroMetrics } = homepageStore

const { isVisible } = useIntersectionObserver(heroRef, {
  threshold: 0.1,
})

const navigateTo = (href: string) => {
  if (href.startsWith('/')) {
    router.push(href)
  } else {
    window.open(href, '_blank')
  }
}

// Animate metrics when hero becomes visible
const animateMetrics = async () => {
  if (!isVisible.value || !metricValues.value.length) return

  await nextTick()

  // Animate each metric value
  heroMetrics.forEach(async (metric, index) => {
    const element = metricValues.value[index]
    if (!element || !metric.animated || !metric.countUp) return

    const numericValue =
      typeof metric.value === 'string'
        ? parseFloat(metric.value.replace(/[^0-9.]/g, ''))
        : metric.value

    if (!isNaN(numericValue)) {
      await countUp(element, numericValue, 2000 + index * 200)
    }
  })
}

onMounted(async () => {
  await nextTick()

  // Initial animations
  if (heroRef.value) {
    await fadeInUp(heroRef.value.querySelector('h1')!)
    await fadeInUp(heroRef.value.querySelector('p')!)
    await staggerChildren(heroRef.value.querySelector('.flex.flex-col.sm\\:flex-row')!)
  }

  // Watch for visibility changes to trigger metric animations
  const unwatch = homepageStore.$subscribe(() => {
    if (isVisible.value && metricRefs.value.length) {
      animateMetrics()
    }
  })

  // Trigger initial metric animation if already visible
  setTimeout(animateMetrics, 500)

  return () => unwatch()
})
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(-180deg);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
  animation-delay: 4s;
}
</style>
