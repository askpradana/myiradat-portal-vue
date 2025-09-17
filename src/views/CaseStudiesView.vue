<script setup lang="ts">
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { caseStudiesData } from '@/data/caseStudiesData'
import { Clock, ArrowUpRight, Quote } from 'lucide-vue-next'

const featuredCaseStudy = caseStudiesData[0]
const otherCaseStudies = caseStudiesData.slice(1)
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden"
  >
    <!-- Background Decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Blur circles -->
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div
        class="absolute -bottom-32 -left-40 w-96 h-96 bg-secondary/15 rounded-full blur-3xl"
      ></div>

      <!-- Grid overlay -->
      <div
        class="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 py-12">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6"
        >
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">Customer Success Stories</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover how organizations across industries are transforming their operations with MyIradat
        </p>
      </div>

      <!-- Featured Case Study -->
      <div class="mb-16">
        <Card
          class="shadow-2xl shadow-primary/25 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between mb-4">
              <Badge variant="secondary" class="px-3 py-1">Featured Story</Badge>
              <div class="flex items-center text-sm text-muted-foreground">
                <Clock class="w-4 h-4 mr-1" />
                {{ featuredCaseStudy.readTimeMinutes }} min read
              </div>
            </div>
            <CardTitle class="text-2xl md:text-3xl leading-tight">
              {{ featuredCaseStudy.title }}
            </CardTitle>
            <CardDescription class="text-lg">
              {{ featuredCaseStudy.excerpt }}
            </CardDescription>
            <div class="flex flex-wrap gap-2 mt-4">
              <Badge
                v-for="tag in featuredCaseStudy.tags"
                :key="tag"
                variant="outline"
                class="text-xs"
              >
                {{ tag }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-8">
            <!-- Client Info -->
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span class="text-primary font-bold text-lg">{{
                  featuredCaseStudy.client.charAt(0)
                }}</span>
              </div>
              <div>
                <h3 class="font-semibold text-foreground">{{ featuredCaseStudy.client }}</h3>
                <p class="text-sm text-muted-foreground">{{ featuredCaseStudy.industry }}</p>
              </div>
            </div>

            <!-- Challenge -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-3">The Challenge</h3>
              <p class="text-muted-foreground leading-relaxed">
                {{ featuredCaseStudy.challenge }}
              </p>
            </div>

            <!-- Solution -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-3">The Solution</h3>
              <p class="text-muted-foreground leading-relaxed">
                {{ featuredCaseStudy.solution }}
              </p>
            </div>

            <!-- Results -->
            <div>
              <h3 class="text-lg font-semibold text-foreground mb-4">The Results</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div
                  v-for="result in featuredCaseStudy.results"
                  :key="result.metric"
                  class="text-center p-4 bg-primary/5 rounded-lg"
                >
                  <div class="text-2xl font-bold text-primary mb-1">{{ result.value }}</div>
                  <div class="text-sm text-muted-foreground">{{ result.description }}</div>
                </div>
              </div>
            </div>

            <!-- Testimonial -->
            <div class="bg-muted/30 p-6 rounded-lg">
              <Quote class="w-8 h-8 text-primary mb-4" />
              <blockquote class="text-lg italic text-foreground mb-4">
                "{{ featuredCaseStudy.testimonial.quote }}"
              </blockquote>
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span class="text-primary font-semibold text-sm">{{
                    featuredCaseStudy.testimonial.author.split(' ').map(n => n.charAt(0)).join('')
                  }}</span>
                </div>
                <div>
                  <div class="font-semibold text-foreground">
                    {{ featuredCaseStudy.testimonial.author }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{ featuredCaseStudy.testimonial.position }}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Other Case Studies Grid -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-foreground mb-8 text-center">More Success Stories</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            v-for="caseStudy in otherCaseStudies"
            :key="caseStudy.id"
            class="shadow-xl shadow-primary/15 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 group cursor-pointer"
          >
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between mb-3">
                <Badge variant="outline" class="text-xs">{{ caseStudy.industry }}</Badge>
                <div class="flex items-center text-sm text-muted-foreground">
                  <Clock class="w-4 h-4 mr-1" />
                  {{ caseStudy.readTimeMinutes }} min
                </div>
              </div>
              <CardTitle class="text-lg leading-tight group-hover:text-primary transition-colors">
                {{ caseStudy.title }}
              </CardTitle>
              <CardDescription class="line-clamp-3">
                {{ caseStudy.excerpt }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <!-- Client Info -->
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                  <span class="text-primary font-semibold text-sm">{{ caseStudy.client.charAt(0) }}</span>
                </div>
                <div>
                  <div class="font-medium text-foreground text-sm">{{ caseStudy.client }}</div>
                </div>
              </div>

              <!-- Key Results -->
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div
                  v-for="result in caseStudy.results.slice(0, 2)"
                  :key="result.metric"
                  class="text-center p-3 bg-primary/5 rounded-md"
                >
                  <div class="text-lg font-bold text-primary">{{ result.value }}</div>
                  <div class="text-xs text-muted-foreground">{{ result.description }}</div>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="tag in caseStudy.tags.slice(0, 2)"
                  :key="tag"
                  variant="outline"
                  class="text-xs"
                >
                  {{ tag }}
                </Badge>
                <Badge v-if="caseStudy.tags.length > 2" variant="outline" class="text-xs">
                  +{{ caseStudy.tags.length - 2 }} more
                </Badge>
              </div>

              <!-- Read More Button -->
              <div class="mt-4 pt-4 border-t border-border">
                <div
                  class="flex items-center justify-between text-sm text-primary group-hover:text-primary/80 transition-colors"
                >
                  <span class="font-medium">Read Full Case Study</span>
                  <ArrowUpRight class="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center">
        <Card
          class="shadow-xl shadow-primary/15 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm max-w-2xl mx-auto"
        >
          <CardContent class="py-8">
            <h3 class="text-2xl font-bold text-foreground mb-4">Ready to Transform Your Organization?</h3>
            <p class="text-muted-foreground mb-6">
              Join these successful organizations and see how MyIradat can streamline your operations.
            </p>
            <div class="space-y-3">
              <button
                class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-md transition-colors duration-200"
              >
                Schedule Your Demo
              </button>
              <button
                class="w-full border border-border hover:bg-muted/50 text-foreground font-medium px-6 py-3 rounded-md transition-colors duration-200"
              >
                Contact Sales Team
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>