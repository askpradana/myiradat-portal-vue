<template>
  <section class="py-16 bg-card/30 border-y border-border/60" aria-labelledby="partners-title">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 id="partners-title" class="text-2xl sm:text-3xl font-bold text-foreground">
          Dipercaya Mitra Bisnis di Berbagai Industri
        </h2>
        <p class="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Perusahaan-perusahaan ini telah mempercayakan pengembangan SDM mereka bersama IRADAT.
        </p>
      </div>

      <div class="partner-marquee" role="region" aria-label="Daftar perusahaan partner IRADAT">
        <div class="partner-track">
          <div v-for="(logo, index) in loopedLogos" :key="`${logo.src}-${index}`" class="partner-item">
            <img
              :src="logo.src"
              :alt="logo.alt"
              loading="lazy"
              class="h-9 sm:h-11 w-auto object-contain grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface PartnerLogo {
  src: string
  alt: string
}

const logoModules = import.meta.glob('/src/images/customers-list/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const logos = computed<PartnerLogo[]>(() =>
  Object.entries(logoModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src]) => {
      const file = path.split('/').pop() ?? 'Partner logo'
      const cleanName = file.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim()
      return {
        src,
        alt: `${cleanName} logo`,
      }
    }),
)

const loopedLogos = computed<PartnerLogo[]>(() => [...logos.value, ...logos.value])
</script>

<style scoped>
.partner-marquee {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

.partner-track {
  width: max-content;
  display: flex;
  align-items: center;
  gap: 2.25rem;
  animation: partner-scroll 30s linear infinite;
}

.partner-item {
  height: 64px;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid hsl(var(--border) / 0.5);
  border-radius: 0.75rem;
  background: hsl(var(--background));
  padding: 0.75rem 1rem;
}

.partner-marquee:hover .partner-track {
  animation-play-state: paused;
}

@keyframes partner-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 768px) {
  .partner-track {
    gap: 1rem;
    animation-duration: 22s;
  }

  .partner-item {
    min-width: 120px;
    height: 56px;
  }
}
</style>
