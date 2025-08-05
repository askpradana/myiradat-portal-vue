<template>
  <section class="py-16 bg-card/30 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <p class="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Trusted by innovative companies worldwide
        </p>
      </div>

      <div class="relative w-full overflow-hidden">
        <!-- Moving container -->
        <div class="flex gap-8 animate-marquee" :style="{ animationDuration: duration + 's' }">
          <!-- Duplicate logos twice for seamless loop -->
          <template v-for="i in 2" :key="i">
            <div v-for="n in logos" :key="`${i}-${n}`" class="h-8 w-32 bg-muted rounded"></div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const duration = 20 // seconds per full cycle
const logos = [1, 2, 3, 4, 5, 6] // replace with your actual logos
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee linear infinite;
}
</style>
