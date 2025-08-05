<template>
  <section class="py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">See It In Action</h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our platform's capabilities through interactive demonstrations
        </p>
      </div>

      <div class="relative">
        <div class="overflow-hidden rounded-2xl border border-border bg-card">
          <div
            class="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"
          >
            <div class="text-center">
              <div
                class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p class="text-muted-foreground">Interactive Demo Coming Soon</p>
            </div>
          </div>
        </div>

        <!-- Carousel indicators -->
        <div class="flex justify-center mt-6 space-x-2">
          <button class="w-2 h-2 bg-primary rounded-full"></button>
          <button class="w-2 h-2 bg-muted rounded-full"></button>
          <button class="w-2 h-2 bg-muted rounded-full"></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
