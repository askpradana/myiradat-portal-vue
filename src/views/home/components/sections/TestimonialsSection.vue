<template>
  <section id="testimonials" class="py-20 bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          KISAH SUKSES PSIKOLOG PROFESIONAL
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Dipercaya psikolog terdepan Indonesia
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Lihat bagaimana IRADAT telah mentransformasi praktik psikologi dan memberikan hasil
          terukur untuk psikolog profesional di seluruh Indonesia.
        </p>
      </div>

      <!-- Success Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div v-for="metric in overallMetrics" :key="metric.label" class="text-center">
          <div class="text-3xl lg:text-4xl font-bold text-primary mb-2">
            {{ metric.value }}{{ metric.suffix }}
          </div>
          <div class="text-sm text-muted-foreground">{{ metric.label }}</div>
        </div>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid lg:grid-cols-3 gap-8 mb-16">
        <Card
          v-for="testimonial in featuredTestimonials"
          :key="testimonial.id"
          class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <CardContent class="p-6">
            <!-- Rating Stars -->
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400 mr-2">
                <Star v-for="i in testimonial.rating" :key="i" class="w-4 h-4 fill-current" />
              </div>
              <Badge :variant="getIndustryVariant(testimonial.industry)" class="text-xs">
                {{ testimonial.industry }}
              </Badge>
            </div>

            <!-- Quote -->
            <blockquote class="text-foreground mb-4 italic">"{{ testimonial.content }}"</blockquote>

            <!-- Metrics (if available) -->
            <div
              v-if="testimonial.metrics"
              class="grid grid-cols-2 gap-3 mb-4 p-3 bg-muted/30 rounded-lg"
            >
              <div class="text-center">
                <div class="text-lg font-bold text-primary">
                  {{ testimonial.metrics.improvement }}
                </div>
                <div class="text-xs text-muted-foreground">Improvement</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-foreground">
                  {{ testimonial.metrics.timeframe }}
                </div>
                <div class="text-xs text-muted-foreground">Timeframe</div>
              </div>
            </div>

            <!-- Author -->
            <div class="flex items-center">
              <DynamicAvatar
                :identifier="testimonial.name.toLowerCase().replace(/\s+/g, '_')"
                type="person"
                :size="48"
                :alt="`${testimonial.name} avatar`"
                class="mr-4"
                :metadata="{
                  name: testimonial.name,
                  role: testimonial.role,
                  company: testimonial.company,
                }"
              />
              <div>
                <div class="font-semibold text-foreground">{{ testimonial.name }}</div>
                <div class="text-sm text-muted-foreground">
                  {{ testimonial.role }}, {{ testimonial.company }}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DynamicAvatar from '@/components/ui/avatar/DynamicAvatar.vue'
import { Star } from 'lucide-vue-next'

const overallMetrics = computed(() => [
  { value: '500', suffix: '+', label: 'Enterprise Clients' },
  { value: '75', suffix: '%', label: 'Average Time Savings' },
  { value: '99.9', suffix: '%', label: 'Customer Satisfaction' },
  { value: '2M', suffix: '+', label: 'Daily Transactions' },
])

const featuredTestimonials = computed(() => [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechCorp Solutions',
    avatar: '/avatars/sarah-chen.jpg',
    content:
      'IRADAT transformed our operations, reducing processing time by 75% and eliminating manual errors in compliance reporting.',
    metrics: {
      improvement: '75%',
      timeframe: '6 months',
      category: 'efficiency',
    },
    rating: 5,
    industry: 'Technology',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'CFO',
    company: 'GlobalBank Financial',
    avatar: '/avatars/michael-rodriguez.jpg',
    content:
      "The security and compliance features have been game-changing for our regulatory requirements. We've passed every audit since implementation.",
    metrics: {
      improvement: '100%',
      timeframe: '1 year',
      category: 'compliance',
    },
    rating: 5,
    industry: 'Financial Services',
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    role: 'Chief Medical Officer',
    company: 'HealthFirst Medical Center',
    avatar: '/avatars/emily-watson.jpg',
    content:
      "Patient data management has never been more secure and efficient. IRADAT's HIPAA compliance features give us complete peace of mind.",
    metrics: {
      improvement: '60%',
      timeframe: '8 months',
      category: 'security',
    },
    rating: 5,
    industry: 'Healthcare',
  },
])

const getIndustryVariant = (
  industry?: string,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    Technology: 'default',
    'Financial Services': 'secondary',
    Healthcare: 'outline',
    Manufacturing: 'destructive',
  }
  return variants[industry || ''] || 'default'
}
</script>
