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

          <h4 class="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Legal</h4>
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

      <!-- Modern Newsletter Signup -->
      <div class="mt-12 pt-8 border-t border-border">
        <div class="relative">
          <!-- Background gradient -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl"
          ></div>

          <!-- Content -->
          <div class="relative p-8 lg:p-12">
            <div class="max-w-4xl mx-auto">
              <div class="grid lg:grid-cols-2 gap-8 items-center">
                <!-- Left Content -->
                <div class="text-center lg:text-left">
                  <div class="flex items-center justify-center lg:justify-start gap-2 mb-4">
                    <div class="flex items-center space-x-1">
                      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span class="text-sm font-medium text-green-700 dark:text-green-400">
                        {{ formatSubscriberCount(subscriberCount) }} subscribers
                      </span>
                    </div>
                    <div class="text-muted-foreground text-sm">•</div>
                    <span class="text-sm text-muted-foreground">Weekly insights</span>
                  </div>

                  <h3 class="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                    Stay ahead of the curve
                  </h3>
                  <p class="text-muted-foreground text-base leading-relaxed">
                    Get exclusive insights, product updates, and industry trends delivered to your
                    inbox. Join thousands of professionals who trust IRADAT for their business
                    intelligence.
                  </p>
                </div>

                <!-- Right Form -->
                <div class="relative">
                  <Card class="border-0 shadow-lg bg-background/80 backdrop-blur-sm">
                    <CardContent class="p-6">
                      <form @submit="onSubmit" class="space-y-4">
                        <div class="relative">
                          <FormField v-slot="{ componentField }" name="email">
                            <FormItem>
                              <FormLabel class="text-sm font-medium text-foreground">
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <div class="relative group">
                                  <Input
                                    v-bind="componentField"
                                    type="email"
                                    placeholder="your.email@company.com"
                                    class="h-12 pl-12 pr-4 text-base transition-all duration-200 group-hover:border-primary/50 focus:border-primary"
                                    :disabled="isSubmitting"
                                  />
                                  <Mail
                                    class="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage class="text-xs" />
                            </FormItem>
                          </FormField>
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          :disabled="isSubmitting"
                          class="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 group"
                        >
                          <span
                            v-if="!isSubmitting && !isSuccess"
                            class="flex items-center justify-center"
                          >
                            Subscribe to Newsletter
                            <ArrowRight
                              class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                            />
                          </span>
                          <span v-else-if="isSubmitting" class="flex items-center justify-center">
                            <div
                              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                            ></div>
                            Subscribing...
                          </span>
                          <span v-else class="flex items-center justify-center text-green-100">
                            <CheckCircle class="w-4 h-4 mr-2" />
                            Subscribed!
                          </span>
                        </Button>
                      </form>

                      <!-- Success Animation -->
                      <div
                        v-if="isSuccess"
                        class="absolute inset-0 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center transition-all duration-500"
                        style="z-index: 10"
                      >
                        <div class="text-center">
                          <div
                            class="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3"
                          >
                            <CheckCircle class="w-8 h-8 text-green-600 dark:text-green-400" />
                          </div>
                          <p class="text-green-800 dark:text-green-200 font-medium">
                            Welcome to our community!
                          </p>
                          <p class="text-green-600 dark:text-green-400 text-sm mt-1">
                            Check your email for confirmation
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <!-- Trust indicators -->
                  <div
                    class="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground"
                  >
                    <div class="flex items-center gap-1">
                      <ShieldCheck class="w-3 h-3" />
                      <span>No spam, ever</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Lock class="w-3 h-3" />
                      <span>Unsubscribe anytime</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            <a href="/status" class="text-primary hover:text-primary/80 transition-colors">
              Status Page
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { ShieldCheck, Lock, CheckCircle, Mail, ArrowRight } from 'lucide-vue-next'
import { useNewsletterForm } from '@/composables/forms/useNewsletterForm'

// Newsletter form logic
const { onSubmit, isSubmitting, isSuccess, subscriberCount, formatSubscriberCount } =
  useNewsletterForm()

const currentYear = computed(() => new Date().getFullYear())

// Social media links
const socialLinks = [
  { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/iradat' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/iradat' },
  { name: 'GitHub', icon: 'github', url: 'https://github.com/iradat' },
  { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com/iradat' },
]

// Navigation links
const solutionsLinks = [
  { label: 'Financial Services', href: '/solutions/financial' },
  { label: 'Healthcare', href: '/solutions/healthcare' },
  { label: 'Manufacturing', href: '/solutions/manufacturing' },
  { label: 'Retail & E-commerce', href: '/solutions/retail' },
  { label: 'View All Solutions', href: '/solutions' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'News & Blog', href: '/blog' },
  { label: 'Customer Stories', href: '/case-studies' },
  { label: 'Press Kit', href: '/press' },
]

const supportLinks = [
  { label: 'Help Center', href: '/contact-us' },
  { label: 'Documentation', href: '/contact-us' },
  { label: 'API Reference', href: '/contact-us' },
  { label: 'Community Forum', href: '/contact-us' },
  { label: 'Contact Support', href: '/contact-us' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Security', href: '/security' },
  { label: 'Compliance', href: '/compliance' },
]
</script>
