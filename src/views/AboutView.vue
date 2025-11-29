<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <HeaderSection />

    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-background via-card/30 to-background py-20 mt-8"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl sm:text-5xl font-bold mb-6">About Iradat</h1>
          <p class="text-xl text-muted-foreground">
            Pioneering psychological assessment and human resource solutions across Indonesia
          </p>
        </div>
      </div>
    </section>

    <!-- Company Story -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold mb-6">Our Story</h2>
            <p class="text-lg text-muted-foreground mb-6">
              Founded with a mission to revolutionize psychological assessment and human resource
              management in Indonesia, Iradat has become a trusted partner for organizations seeking
              to understand and develop their most valuable asset - their people.
            </p>
            <p class="text-lg text-muted-foreground mb-6">
              With over a decade of experience, we've helped thousands of organizations make
              informed decisions about talent acquisition, development, and management through
              scientifically validated assessment tools and expert consultation.
            </p>
            <div class="flex items-center space-x-8">
              <div class="text-center">
                <div class="text-3xl font-bold text-primary">300+</div>
                <div class="text-sm text-muted-foreground">Trusted Psychologists</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary">10+</div>
                <div class="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary">1000+</div>
                <div class="text-sm text-muted-foreground">Organizations Served</div>
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
            <div
              class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Users class="w-12 h-12 text-primary" />
            </div>
            <h3 class="text-2xl font-bold text-center mb-4">People First</h3>
            <p class="text-muted-foreground text-center">
              Our approach centers on understanding human potential and creating pathways for growth
              and success.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-20 bg-card/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-background rounded-2xl p-8 text-center">
            <div
              class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Target class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-2xl font-bold mb-4">Our Mission</h3>
            <p class="text-muted-foreground">
              To provide scientifically-backed psychological assessment tools and services that
              empower organizations to make informed decisions about their human capital, fostering
              growth and success for both individuals and businesses.
            </p>
          </div>
          <div class="bg-background rounded-2xl p-8 text-center">
            <div
              class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Eye class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-2xl font-bold mb-4">Our Vision</h3>
            <p class="text-muted-foreground">
              To be Indonesia's leading provider of psychological assessment and human resource
              solutions, recognized for our innovation, expertise, and commitment to helping
              organizations unlock human potential.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Our Core Values</h2>
          <p class="text-lg text-muted-foreground">The principles that guide everything we do</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div
              class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Award class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Excellence</h3>
            <p class="text-muted-foreground">
              Committed to delivering the highest quality services and solutions
            </p>
          </div>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Brain class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Innovation</h3>
            <p class="text-muted-foreground">Continuously advancing our methods and technologies</p>
          </div>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Shield class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Integrity</h3>
            <p class="text-muted-foreground">
              Maintaining the highest ethical standards in all our practices
            </p>
          </div>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Heart class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Empathy</h3>
            <p class="text-muted-foreground">
              Understanding and caring for the human side of business
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-card/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Our Team</h2>
          <p class="text-lg text-muted-foreground">
            Meet the professionals behind Iradat's success
          </p>
        </div>

        <div class="space-y-16">
          <div v-for="(members, teamKey) in teamsData" :key="teamKey" class="team-section">
            <!-- Team Category Header -->
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold mb-2">
                {{ teamCategories[teamKey as keyof typeof teamCategories] }}
              </h3>
              <div class="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <!-- Team Members Grid -->
            <div
              class="grid gap-6"
              :class="{
                'md:grid-cols-1 max-w-md mx-auto': members.length === 1,
                'md:grid-cols-2 max-w-2xl mx-auto': members.length === 2,
                'md:grid-cols-3 max-w-4xl mx-auto': members.length >= 3,
              }"
            >
              <div
                v-for="member in members"
                :key="member.email"
                class="bg-background rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  class="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden ring-2 ring-primary/10"
                >
                  <img
                    :src="member.image"
                    :alt="member.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h4 class="text-lg font-semibold mb-2">{{ member.name }}</h4>
                <p v-if="member.position" class="text-sm text-primary mb-3 font-medium">
                  {{ member.position }}
                </p>
                <div class="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Mail class="w-4 h-4" />
                  <a
                    :href="`mailto:${member.email}`"
                    class="text-sm hover:text-primary transition-colors"
                  >
                    {{ member.email }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary text-primary-foreground">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to Work Together?</h2>
        <p class="text-xl mb-8 opacity-90">
          Let's discuss how Iradat can help your organization achieve its goals
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" class="text-lg px-8 py-4"> Get Started </Button>
          <Button
            size="lg"
            variant="outline"
            class="text-lg px-8 py-4 border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Users, Target, Eye, Award, Brain, Shield, Heart, Mail } from 'lucide-vue-next'
import HeaderSection from '@/views/home/components/sections/HeaderSection.vue'
import FooterSection from '@/views/home/components/sections/FooterSection.vue'
import rawTeamsData from '@/data/teams.json'
import type { TeamsData } from '@/types/team'

// Type assertion for the imported JSON data
const teamsData = rawTeamsData as TeamsData

// Team category labels
const teamCategories = {
  director: 'Leadership',
  eap: 'Employee Assistance Program',
  lhh: 'Lee Hecht Harrison',
  lnd: 'Learning & Development',
  hr: 'Human Resources',
  esas: 'Employee Satisfaction & Assessment Specialists',
}
</script>
