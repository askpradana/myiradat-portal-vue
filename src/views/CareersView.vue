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
            Karier di IRADAT
          </h1>
          <p class="text-xl text-muted-foreground">
            Bergabung dengan tim psikologi dan teknologi yang membangun solusi penilaian SDM.
          </p>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-card border border-border rounded-2xl p-8 sm:p-10 text-center">
          <div
            class="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
          >
            <Briefcase class="w-8 h-8 text-primary" />
          </div>
          <h2 class="text-2xl font-bold mb-3">Saat ini belum ada lowongan terbuka</h2>
          <p class="text-muted-foreground max-w-2xl mx-auto mb-8">
            Kami belum membuka posisi baru untuk saat ini. Halaman ini akan diperbarui ketika
            lowongan tersedia.
          </p>

          <div
            class="inline-flex items-center gap-2 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 px-4 py-2 text-sm font-medium"
          >
            <Clock3 class="w-4 h-4" />
            Status: No openings
          </div>

          <div class="mt-8">
            <a
              href="/contact"
              class="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { Briefcase, Clock3 } from 'lucide-vue-next'
import HeaderSection from '@/views/home/components/sections/HeaderSection.vue'
import FooterSection from '@/views/home/components/sections/FooterSection.vue'
</script>
