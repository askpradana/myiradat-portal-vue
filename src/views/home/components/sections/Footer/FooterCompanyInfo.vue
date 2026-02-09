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

    <!-- Social Links -->
    <div class="flex flex-col space-y-3">
      <a
        v-for="social in socialLinks"
        :key="social.name"
        :href="social.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        :aria-label="social.name"
      >
        <component :is="social.icon" class="w-4 h-4" />
        <span>{{ social.name }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Instagram, Youtube, Linkedin } from 'lucide-vue-next'

// Social media links
const socialLinks = [
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/iradat.konsultan/' },
  { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/channel/UC0TkH_E4eqxmDzu6MvaSXYQ' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://id.linkedin.com/company/iradatkonsultan' },
]
</script>