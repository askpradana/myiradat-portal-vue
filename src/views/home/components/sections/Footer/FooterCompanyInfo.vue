<template>
  <div class="lg:col-span-2">
    <div class="flex items-center space-x-3 mb-6">
      <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <span class="text-primary-foreground font-bold text-sm">IR</span>
      </div>
      <div>
        <span class="text-xl font-bold text-foreground">IRADAT</span>
        <div class="text-xs text-muted-foreground">All-in-One Portal</div>
      </div>
    </div>
    <div class="text-muted-foreground mb-6 max-w-md">
      <p>Gedung Vinilon lt 3, Suite 3-5</p>
      <p>Jl. Raden Saleh No 13-17</p>
      <p>Jakarta 10430</p>
    </div>

    <!-- Trust Indicators -->
    <div class="mb-6">
      <div class="flex flex-wrap items-center gap-4 mb-4">
        <div class="flex items-center space-x-2">
          <ShieldCheck class="w-4 h-4 text-green-600" />
          <span class="text-sm text-muted-foreground">SOC 2 Certified</span>
        </div>
        <div class="flex items-center space-x-2">
          <Lock class="w-4 h-4 text-blue-600" />
          <span class="text-sm text-muted-foreground">ISO 27001</span>
        </div>
        <div class="flex items-center space-x-2">
          <CheckCircle class="w-4 h-4 text-green-600" />
          <span class="text-sm text-muted-foreground">GDPR Compliant</span>
        </div>
      </div>
    </div>

    <!-- Social Links -->
    <div class="flex space-x-4">
      <a
        v-for="social in socialLinks"
        :key="social.name"
        :href="social.url"
        class="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
        :aria-label="social.name"
      >
        <component :is="social.icon" class="w-5 h-5" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldCheck, Lock, CheckCircle } from 'lucide-vue-next'

// Social media links
const socialLinks = [
  { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/iradat' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/iradat' },
  { name: 'GitHub', icon: 'github', url: 'https://github.com/iradat' },
  { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com/iradat' },
]
</script>