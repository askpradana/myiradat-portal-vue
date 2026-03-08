<template>
  <footer class="bg-card border-t border-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <!-- Company Info -->
        <FooterCompanyInfo />

        <!-- Solutions -->
        <FooterNavigationColumn title="Solusi" :links="solutionsLinks" />

        <!-- Company -->
        <FooterNavigationColumn title="Perusahaan" :links="companyLinks" />

        <!-- Support & Legal -->
        <FooterNavigationColumn
          title="Dukungan"
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
  { label: 'Lihat Semua Solusi', href: '/solutions' },
]

const companyLinks = [
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Karier', href: '/careers' },
  { label: 'Berita & Blog', href: '/articles' },
  { label: 'Kisah Pelanggan', href: '/case-studies' },
]

const supportLinks = [
  { label: 'Pusat Bantuan', href: '/contact' },
  { label: 'Hubungi Dukungan', href: '/contact' },
]

const legalLinks = [
  { label: 'Kebijakan Privasi', href: '/privacy' },
  { label: 'Syarat Layanan', href: '/terms' },
]
</script>
