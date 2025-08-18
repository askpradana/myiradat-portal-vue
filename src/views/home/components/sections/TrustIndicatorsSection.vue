<template>
  <section class="py-16 bg-gradient-to-b from-background to-muted/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <p class="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          TRUSTED BY INDUSTRY LEADERS
        </p>

        <!-- Client Logos -->
        <div
          class="flex flex-wrap items-center justify-center gap-8 lg:gap-12 mb-12 opacity-60 hover:opacity-100 transition-opacity duration-500"
        >
          <div
            v-for="client in clientLogos"
            :key="client.name"
            class="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
          >
            <div
              class="h-8 px-4 bg-muted/50 rounded-lg flex items-center justify-center border border-border/50"
            >
              <span class="text-sm font-semibold text-muted-foreground">{{ client.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Pillars Cards -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <!-- Enterprise Security -->
        <Card
          class="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/50 hover:border-green-500/30"
        >
          <CardContent class="p-8 text-center">
            <div
              class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <div class="w-8 h-8 text-green-600 dark:text-green-400">
                <!-- Shield Check Icon -->
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-3">Enterprise Security</h3>
            <p class="text-muted-foreground text-sm mb-6 leading-relaxed">
              SOC 2 Type II, ISO 27001 certified with bank-level security and compliance standards.
            </p>

            <!-- Certification Badges -->
            <div class="flex justify-center space-x-4 mb-4">
              <div
                v-for="cert in certifications"
                :key="cert.name"
                class="px-3 py-1 bg-muted/50 border border-border/50 rounded-lg hover:bg-muted transition-colors"
                :title="cert.description"
              >
                <span class="text-xs font-medium text-foreground">{{ cert.name }}</span>
              </div>
            </div>

            <!-- Security Status -->
            <div class="flex items-center justify-center space-x-2 text-sm">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-muted-foreground">All security systems operational</span>
            </div>
          </CardContent>
        </Card>

        <!-- Performance & Uptime -->
        <Card
          class="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/50 hover:border-blue-500/30"
        >
          <CardContent class="p-8 text-center">
            <div
              class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <div class="w-8 h-8 text-blue-600 dark:text-blue-400">
                <!-- Activity Icon -->
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-3">99.9% Uptime SLA</h3>
            <p class="text-muted-foreground text-sm mb-6 leading-relaxed">
              Guaranteed availability with 24/7 monitoring, redundancy, and instant failover
              protection.
            </p>

            <!-- Performance Metrics -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="p-3 bg-muted/50 rounded-lg border border-border/50">
                <div class="text-lg font-bold text-blue-600">&lt; 50ms</div>
                <div class="text-xs text-muted-foreground">Avg Response</div>
              </div>
              <div class="p-3 bg-muted/50 rounded-lg border border-border/50">
                <div class="text-lg font-bold text-green-600">99.97%</div>
                <div class="text-xs text-muted-foreground">Current Uptime</div>
              </div>
            </div>

            <!-- Live Status -->
            <div class="flex items-center justify-center space-x-4 text-sm">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-muted-foreground">Live Status</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-8 h-1 bg-green-500 rounded-full"></div>
                <span class="text-muted-foreground text-xs">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Expert Support -->
        <Card
          class="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/50 hover:border-indigo-500/30"
        >
          <CardContent class="p-8 text-center">
            <div
              class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <div class="w-8 h-8 text-indigo-600 dark:text-indigo-400">
                <!-- Users Icon -->
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-3">24/7 Expert Support</h3>
            <p class="text-muted-foreground text-sm mb-6 leading-relaxed">
              Dedicated success managers and priority technical support for all enterprise clients.
            </p>

            <!-- Support Metrics -->
            <div class="space-y-3 mb-4">
              <div
                class="flex items-center justify-between p-2 bg-muted/50 rounded-lg border border-border/50"
              >
                <span class="text-sm text-muted-foreground">Response Time</span>
                <span class="text-sm font-semibold text-foreground">&lt; 1 hour</span>
              </div>
              <div
                class="flex items-center justify-between p-2 bg-muted/50 rounded-lg border border-border/50"
              >
                <span class="text-sm text-muted-foreground">Resolution Rate</span>
                <span class="text-sm font-semibold text-foreground">98.5%</span>
              </div>
            </div>

            <!-- Support Channels -->
            <div class="flex items-center justify-center space-x-4 text-sm">
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-muted-foreground text-xs">Live Chat</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="text-muted-foreground text-xs">Phone Support</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span class="text-muted-foreground text-xs">Email</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Key Metrics Bar -->
      <div
        class="bg-card border border-border/50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
      >
        <h3 class="text-center text-lg font-semibold text-foreground mb-8">
          Trusted by enterprises worldwide
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="metric in keyMetrics" :key="metric.label" class="text-center group">
            <div
              class="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300"
            >
              {{ metric.value }}{{ metric.suffix }}
            </div>
            <div class="text-sm text-muted-foreground font-medium">{{ metric.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'

const clientLogos = computed(() => [
  { name: 'TechCorp Solutions' },
  { name: 'GlobalBank Financial' },
  { name: 'HealthFirst Medical' },
  { name: 'ManufacturingCo' },
  { name: 'RetailGroup Inc' },
  { name: 'DataVision Analytics' },
])

const certifications = computed(() => [
  {
    name: 'SOC 2 Type II',
    description: 'Audited for security, availability, and confidentiality',
  },
  {
    name: 'ISO 27001',
    description: 'International standard for information security management',
  },
  {
    name: 'GDPR',
    description: 'General Data Protection Regulation compliant',
  },
])

const keyMetrics = computed(() => [
  { value: '500', suffix: '+', label: 'Enterprise Clients' },
  { value: '2.5M', suffix: '+', label: 'Daily Transactions' },
  { value: '99.97', suffix: '%', label: 'Current Uptime' },
  { value: '24', suffix: '/7', label: 'Expert Support' },
])
</script>
