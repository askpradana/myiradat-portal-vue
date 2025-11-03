<template>
  <footer class="bg-card border-t border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <!-- Company Info -->
        <FooterCompanyInfo />

        <!-- Solutions -->
        <FooterNavigationColumn title="Solutions" :links="solutionsLinks" />

        <!-- Company -->
        <FooterNavigationColumn title="Company" :links="companyLinks" />

        <!-- Support & Legal -->
        <FooterNavigationColumn
          title="Support"
          :links="supportLinks"
          additional-list-classes="mb-8"
        >
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
        </FooterNavigationColumn>
      </div>

      <!-- Modern Newsletter Signup -->
      <!-- <FooterNewsletterSignup /> -->

      <!-- Bottom Footer -->
      <FooterBottomBar />
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  FooterCompanyInfo,
  FooterNavigationColumn,
  // FooterNewsletterSignup,
  FooterBottomBar,
} from './Footer'

// Import services data
import servicesData from '@/data/servicesData.json'

// Navigation links
const solutionsLinks = [
  ...servicesData.services.map((service) => ({
    label: service.title,
    href: `/services/${service.slug}`,
  })),
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
