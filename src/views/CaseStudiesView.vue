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

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center">
          <h1
            class="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
          >
            Case Studies
          </h1>
          <p class="text-xl text-muted-foreground">
            Halaman ini sedang dalam pengumpulan data.
          </p>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-card border border-border rounded-2xl p-8 sm:p-10 text-center">
          <div
            class="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5"
          >
            <Clock3 class="w-7 h-7 text-primary" />
          </div>
          <h2 class="text-2xl font-bold mb-3">Konten sedang disiapkan</h2>
          <p class="text-muted-foreground">
            Kami sedang merapikan data hasil kerja sama klien agar studi kasus yang ditampilkan
            akurat dan relevan.
          </p>
        </div>
      </div>
    </section>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { Clock3 } from 'lucide-vue-next'
import HeaderSection from '@/views/home/components/sections/HeaderSection.vue'
import FooterSection from '@/views/home/components/sections/FooterSection.vue'
</script>
