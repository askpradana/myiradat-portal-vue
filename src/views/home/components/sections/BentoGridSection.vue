<template>
  <section id="features" class="py-20 bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          POWERFUL FEATURES
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Everything you need in one platform
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          IRADAT combines enterprise-grade security, seamless integrations, and powerful analytics
          to streamline your business operations.
        </p>
      </div>

      <!-- ARIA Live Region for Screen Readers -->
      <div aria-live="polite" aria-atomic="true" class="sr-only">
        {{
          isAnimating
            ? `Currently syncing with ${dataSources[activeSource]}`
            : 'Data synchronization complete'
        }}
      </div>

      <!-- Improved Bento Grid -->
      <div class="improved-bento-grid">
        <!-- Main Feature - Unified Data Platform -->
        <Card
          class="hero-card group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          role="article"
          tabindex="0"
          aria-describedby="hero-description"
        >
          <div class="relative h-full bg-gradient-to-br from-primary/5 to-primary/10 p-8">
            <div class="flex flex-col h-full">
              <div class="mb-6">
                <div
                  class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                >
                  <div class="w-6 h-6 text-primary">
                    <!-- Database Icon -->
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M5 12c0 1.657 3.134 3 7 3s7-1.343 7-3" />
                      <path d="M5 5v14c0 1.657 3.134 3 7 3s7-1.343 7-3V5" />
                    </svg>
                  </div>
                </div>
                <h3 class="text-2xl font-bold text-foreground mb-3">Unified Data Platform</h3>
                <p id="hero-description" class="text-muted-foreground text-lg leading-relaxed">
                  Connect all your data sources in one secure, compliant platform. Real-time
                  synchronization with advanced transformation capabilities.
                </p>
              </div>

              <!-- Interactive Demo Preview -->
              <div
                class="flex-1 relative rounded-lg bg-card/50 border border-border p-4 backdrop-blur-sm"
              >
                <div class="grid grid-cols-3 gap-3 mb-4">
                  <div
                    v-for="(source, index) in dataSources"
                    :key="source"
                    class="flex items-center space-x-2 text-sm p-2 rounded bg-background/80 transition-all duration-300"
                    :class="{ 'bg-primary/10 scale-105': isAnimating && index === activeSource }"
                  >
                    <div
                      class="w-2 h-2 rounded-full transition-colors duration-300"
                      :class="
                        isAnimating && index === activeSource
                          ? 'bg-primary animate-pulse'
                          : 'bg-green-500'
                      "
                    ></div>
                    <span class="text-muted-foreground font-medium">{{ source }}</span>
                  </div>
                </div>
                <div class="text-center text-muted-foreground text-sm">
                  <span :class="{ 'text-primary animate-pulse': isAnimating }">
                    {{ isAnimating ? 'Syncing data...' : 'All systems synchronized' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Analytics Feature -->
        <Card
          class="analytics-card group cursor-pointer border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          role="article"
          tabindex="0"
          aria-describedby="analytics-description"
        >
          <CardContent class="p-6 h-full">
            <div
              class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              <div class="w-6 h-6 text-blue-600 dark:text-blue-400">
                <!-- Bar Chart Icon -->
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M8 12h8" />
                  <path d="M12 16h4" />
                  <path d="M12 8h4" />
                  <path d="M8 16h1" />
                  <path d="M8 8h1" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-3">Advanced Analytics</h3>
            <p id="analytics-description" class="text-muted-foreground text-sm mb-6">
              Real-time insights with customizable dashboards and automated reporting.
            </p>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Data Processing</span>
                <span class="text-foreground font-semibold">98%</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style="width: 98%"
                ></div>
              </div>
              <div class="grid grid-cols-2 gap-3 text-center pt-2">
                <div class="p-2 bg-muted/50 rounded-lg">
                  <div class="text-lg font-bold text-blue-600">2.1M</div>
                  <div class="text-xs text-muted-foreground">Records/day</div>
                </div>
                <div class="p-2 bg-muted/50 rounded-lg">
                  <div class="text-lg font-bold text-green-600">99.7%</div>
                  <div class="text-xs text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Security Feature -->
        <Card
          class="security-card group cursor-pointer border-border/50 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          role="article"
          tabindex="0"
          aria-describedby="security-description"
        >
          <CardContent class="p-6 h-full">
            <div
              class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              <div class="w-6 h-6 text-green-600 dark:text-green-400">
                <!-- Shield Check Icon -->
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-3">Enterprise Security</h3>
            <p id="security-description" class="text-muted-foreground text-sm mb-4">
              SOC 2 Type II compliant with end-to-end encryption and advanced threat protection.
            </p>
            <div class="space-y-3">
              <div class="flex items-center space-x-2 text-sm">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-muted-foreground">All systems operational</span>
              </div>
              <div class="flex items-center space-x-2 text-sm">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="text-muted-foreground">SOC 2 Type II Certified</span>
              </div>
              <div class="flex items-center space-x-2 text-sm">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span class="text-muted-foreground">ISO 27001 Compliant</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Integration Feature -->
        <Card
          class="integration-card group cursor-pointer border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          role="article"
          tabindex="0"
          aria-describedby="integration-description"
        >
          <CardContent class="p-6 h-full">
            <div
              class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              <div class="w-6 h-6 text-purple-600 dark:text-purple-400">
                <!-- Plug Icon -->
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H17" />
                  <path d="M17 12v8" />
                  <path d="M7 12v8" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-3">500+ Integrations</h3>
            <p id="integration-description" class="text-muted-foreground text-sm mb-4">
              Seamlessly connect with your existing tools and workflows.
            </p>
            <div class="space-y-3">
              <div class="flex -space-x-2 mb-3">
                <div
                  v-for="integration in popularIntegrations"
                  :key="integration.name"
                  class="w-8 h-8 bg-card border-2 border-background rounded-full flex items-center justify-center text-xs font-bold text-foreground shadow-sm hover:scale-110 transition-transform"
                  :style="{ backgroundColor: integration.color }"
                  :title="integration.name"
                >
                  {{ integration.short }}
                </div>
                <div
                  class="w-8 h-8 bg-muted border-2 border-background rounded-full flex items-center justify-center text-xs text-muted-foreground"
                >
                  +
                </div>
              </div>
              <p class="text-xs text-muted-foreground">Popular integrations with seamless setup</p>
            </div>
          </CardContent>
        </Card>

        <!-- Performance Feature -->
        <Card
          class="performance-card group cursor-pointer border-border/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          role="article"
          tabindex="0"
          aria-describedby="performance-description"
        >
          <CardContent class="p-6 h-full">
            <div
              class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              <div class="w-6 h-6 text-orange-600 dark:text-orange-400">
                <!-- Zap Icon -->
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-3">Lightning Fast</h3>
            <p id="performance-description" class="text-muted-foreground text-sm mb-4">
              Sub-50ms response times with 99.9% uptime guarantee.
            </p>
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center p-3 bg-muted/50 rounded-lg">
                <div class="text-xl font-bold text-orange-600">&lt; 50ms</div>
                <div class="text-xs text-muted-foreground">Response Time</div>
              </div>
              <div class="text-center p-3 bg-muted/50 rounded-lg">
                <div class="text-xl font-bold text-green-600">99.9%</div>
                <div class="text-xs text-muted-foreground">Uptime SLA</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Support Feature -->
        <Card
          class="support-card group cursor-pointer border-border/50 hover:border-indigo-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          role="article"
          tabindex="0"
          aria-describedby="support-description"
        >
          <CardContent class="p-6 h-full">
            <div
              class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
            >
              <div class="w-6 h-6 text-indigo-600 dark:text-indigo-400">
                <!-- Headphones Icon -->
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1" />
                  <path d="M16 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1" />
                  <circle cx="7" cy="6" r="3" />
                  <circle cx="17" cy="6" r="3" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-3">24/7 Expert Support</h3>
            <p id="support-description" class="text-muted-foreground text-sm mb-4">
              Expert technical support and dedicated success managers for enterprise clients.
            </p>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Response Time</span>
                <span class="text-foreground font-semibold">&lt; 1 hour</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Satisfaction Rate</span>
                <span class="text-foreground font-semibold">98.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'

const isAnimating = ref(false)
const activeSource = ref(0)

const dataSources = ['CRM', 'ERP', 'Database', 'Analytics', 'API', 'Files']
const popularIntegrations = [
  { name: 'Salesforce', short: 'SF', color: '#00A1E0' },
  { name: 'Microsoft', short: 'MS', color: '#F35020' },
  { name: 'Google', short: 'GG', color: '#4285F4' },
  { name: 'Slack', short: 'SL', color: '#4A154B' },
  { name: 'Zoom', short: 'ZM', color: '#2D8CFF' },
]

let animationInterval: ReturnType<typeof setInterval> | null = null

const startDataSourceAnimation = () => {
  if (animationInterval) return // Prevent multiple intervals

  isAnimating.value = true
  animationInterval = setInterval(() => {
    activeSource.value = (activeSource.value + 1) % dataSources.length
  }, 2000)
}

const stopDataSourceAnimation = () => {
  isAnimating.value = false
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}

onMounted(() => {
  // Start the data source animation after a brief delay
  setTimeout(startDataSourceAnimation, 1500)
})

onUnmounted(() => {
  stopDataSourceAnimation()
})
</script>

<style scoped>
.improved-bento-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, minmax(250px, auto));
  gap: 1.5rem;
  grid-template-areas:
    'hero hero hero analytics analytics analytics'
    'security security integration integration performance performance'
    'support support support support support support';
}

.hero-card {
  grid-area: hero;
  min-height: 400px;
}

.analytics-card {
  grid-area: analytics;
  min-height: 400px;
}

.security-card {
  grid-area: security;
}

.integration-card {
  grid-area: integration;
}

.performance-card {
  grid-area: performance;
}

.support-card {
  grid-area: support;
}

/* Performance optimizations */
.improved-bento-grid .group {
  will-change: transform, box-shadow;
  transform: translateZ(0); /* Force hardware acceleration */
}

.improved-bento-grid .group:not(:hover):not(:focus) {
  will-change: auto; /* Clean up when not needed */
}

/* Responsive adjustments with smoother transitions */
@media (max-width: 1024px) {
  .improved-bento-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, minmax(200px, auto));
    grid-template-areas:
      'hero hero hero hero'
      'hero hero hero hero'
      'analytics analytics security security'
      'integration integration performance performance'
      'support support support support';
  }

  .hero-card {
    min-height: 350px;
  }

  .analytics-card {
    min-height: 250px;
  }
}

@media (max-width: 768px) {
  .improved-bento-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'hero'
      'analytics'
      'security'
      'integration'
      'performance'
      'support';
  }

  .hero-card {
    min-height: 300px;
  }

  .analytics-card {
    min-height: 200px;
  }

  /* Disable hover scale on mobile for better touch experience */
  .improved-bento-grid .group:hover {
    transform: none;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .improved-bento-grid .group {
    transition: none;
  }

  .group-hover\:scale-110:hover {
    transform: none;
  }

  .animate-pulse {
    animation: none;
  }
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
