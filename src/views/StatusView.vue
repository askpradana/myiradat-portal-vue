<template>
  <div class="min-h-screen bg-background">
    <HeaderSection />

    <section
      class="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background py-20 mt-8"
    >
      <div class="absolute inset-0 opacity-40">
        <div class="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <h1
            class="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
          >
            Status Sistem
          </h1>
          <p class="text-xl text-muted-foreground">
            Informasi ketersediaan layanan IRADAT secara ringkas.
          </p>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-6">
          <div class="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <p class="text-lg font-semibold">Semua sistem beroperasi normal</p>
              </div>
              <span class="text-sm text-muted-foreground">Uptime target: 99.9%</span>
            </div>
          </div>

          <div class="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <h2 class="text-xl font-bold mb-4">Layanan</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Platform Assessment</span>
                <span class="text-green-600 dark:text-green-400 font-medium">Operational</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Dashboard Pengguna</span>
                <span class="text-green-600 dark:text-green-400 font-medium">Operational</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">API Integrasi</span>
                <span class="text-green-600 dark:text-green-400 font-medium">Operational</span>
              </div>
            </div>
          </div>

          <div class="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div class="flex items-start gap-3 text-muted-foreground">
              <Info class="w-5 h-5 mt-0.5 text-primary" />
              <p>
                Halaman ini adalah ringkasan status publik. Jika Anda mengalami kendala, silakan
                hubungi tim kami melalui halaman kontak.
              </p>
            </div>
            <a
              href="/contact"
              class="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              <ExternalLink class="w-4 h-4" />
              Laporkan masalah
            </a>
          </div>
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ExternalLink, Info } from 'lucide-vue-next'
import HeaderSection from '@/views/home/components/sections/HeaderSection.vue'
import FooterSection from '@/views/home/components/sections/FooterSection.vue'
</script>
