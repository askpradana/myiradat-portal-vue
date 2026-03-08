<template>
  <section
    ref="heroRef"
    class="relative overflow-hidden lg:grid lg:min-h-[calc(100vh-84px)] lg:place-content-center bg-background"
  >
    <div class="hero-pattern"></div>

    <div
      class="relative z-10 mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <div class="mx-auto max-w-4xl text-center">
        <h1 class="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl leading-tight">
          Human potential is the
          <strong class="text-primary"> only limitless </strong>
          resource we have in this world
        </h1>
        <p class="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Selama
          <span class="font-semibold text-foreground">41 tahun</span>
          , kami dipercaya
          <span class="font-semibold text-foreground">1000+ perusahaan</span>
          dan telah mendampingi
          <span class="font-semibold text-foreground">5000+ orang</span>
          dengan insight psikologi yang praktis.
        </p>

        <button
          type="button"
          class="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          @click="scrollToServices"
        >
          Lihat layanan kami
          <ChevronDown class="w-4 h-4 learn-more-arrow" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const heroRef = ref<HTMLElement>()

const scrollToServices = () => {
  const target = document.querySelector('#services')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.hero-pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.22;
  background-image:
    linear-gradient(to right, hsl(var(--border) / 0.55) 1px, transparent 1px),
    linear-gradient(to bottom, hsl(var(--border) / 0.55) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(circle at center, black 35%, transparent 90%);
}

@keyframes float-down {
  0%,
  100% {
    transform: translateY(-1px);
  }
  50% {
    transform: translateY(4px);
  }
}

.learn-more-arrow {
  animation: float-down 1.6s ease-in-out infinite;
}
</style>
