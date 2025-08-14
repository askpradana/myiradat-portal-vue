<template>
  <footer class="bg-card border-t border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <!-- Company Info -->
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
          <p class="text-muted-foreground mb-6 max-w-md">
            Transforming business operations with secure, compliant, and scalable portal solutions. 
            Trusted by 500+ enterprises worldwide.
          </p>
          
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

        <!-- Solutions -->
        <div>
          <h3 class="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
            Solutions
          </h3>
          <ul class="space-y-4">
            <li v-for="link in solutionsLinks" :key="link.label">
              <a
                :href="link.href"
                class="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h3 class="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
            Company
          </h3>
          <ul class="space-y-4">
            <li v-for="link in companyLinks" :key="link.label">
              <a
                :href="link.href"
                class="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Support & Legal -->
        <div>
          <h3 class="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
            Support
          </h3>
          <ul class="space-y-4 mb-8">
            <li v-for="link in supportLinks" :key="link.label">
              <a
                :href="link.href"
                class="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>

          <h4 class="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Legal
          </h4>
          <ul class="space-y-3">
            <li v-for="link in legalLinks" :key="link.label">
              <a
                :href="link.href"
                class="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Newsletter Signup -->
      <div class="mt-12 pt-8 border-t border-border">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 class="text-lg font-semibold text-foreground mb-2">
              Stay updated with IRADAT
            </h3>
            <p class="text-muted-foreground text-sm">
              Get the latest product updates, security insights, and industry news delivered to your inbox.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground"
              />
            </div>
            <Button @click="subscribeNewsletter" class="whitespace-nowrap">
              Subscribe
              <Mail class="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="mt-12 pt-8 border-t border-border">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-muted-foreground">
            &copy; {{ currentYear }} IRADAT. All rights reserved.
          </p>
          
          <!-- Status Indicator -->
          <div class="flex items-center space-x-4 text-sm">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-muted-foreground">All systems operational</span>
            </div>
            <a 
              href="/status" 
              class="text-primary hover:text-primary/80 transition-colors"
            >
              Status Page
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Lock, CheckCircle, Mail } from 'lucide-vue-next'

// const router = useRouter()
const email = ref('')

const currentYear = computed(() => new Date().getFullYear())

// Social media links
const socialLinks = [
  { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/iradat' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/iradat' },
  { name: 'GitHub', icon: 'github', url: 'https://github.com/iradat' },
  { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com/iradat' }
]

// Navigation links
const solutionsLinks = [
  { label: 'Financial Services', href: '/solutions/financial' },
  { label: 'Healthcare', href: '/solutions/healthcare' },
  { label: 'Manufacturing', href: '/solutions/manufacturing' },
  { label: 'Retail & E-commerce', href: '/solutions/retail' },
  { label: 'View All Solutions', href: '/solutions' }
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'News & Blog', href: '/blog' },
  { label: 'Customer Stories', href: '/case-studies' },
  { label: 'Press Kit', href: '/press' }
]

const supportLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'Documentation', href: '/docs' },
  { label: 'API Reference', href: '/api-docs' },
  { label: 'Community Forum', href: '/community' },
  { label: 'Contact Support', href: '/support' }
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Security', href: '/security' },
  { label: 'Compliance', href: '/compliance' }
]

const subscribeNewsletter = () => {
  if (email.value) {
    // Handle newsletter subscription
    console.log('Subscribing email:', email.value)
    // Reset form
    email.value = ''
    // Show success message or redirect
  }
}
</script>