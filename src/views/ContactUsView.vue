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
    <div class="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-16">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6"
          >
            <MessageCircle class="w-8 h-8 text-primary" />
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or need support? We're here to help you succeed with IRADAT.
          </p>
        </div>

        <!-- Contact Methods Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <!-- Email Support Card -->
          <Card
            class="shadow-lg shadow-primary/10 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
          >
            <CardContent class="p-6 text-center">
              <div
                class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Mail class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-lg font-semibold text-foreground mb-2">Email Support</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Send us an email and we'll respond within 24 hours
              </p>
              <Button
                @click="openEmail"
                variant="outline"
                class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                :disabled="isProcessing"
              >
                support@iradat.com
                <ExternalLink class="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <!-- Phone Support Card -->
          <Card
            class="shadow-lg shadow-primary/10 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
          >
            <CardContent class="p-6 text-center">
              <div
                class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Phone class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-lg font-semibold text-foreground mb-2">Phone Support</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Call us during business hours for immediate assistance
              </p>
              <Button
                @click="openPhone"
                variant="outline"
                class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                :disabled="isProcessing"
              >
                +62-XXX-XXXX-XXXX
                <Phone class="w-4 h-4 ml-2" />
              </Button>
              <p class="text-xs text-muted-foreground mt-2">Mon-Fri, 9AM-6PM WIB</p>
            </CardContent>
          </Card>

          <!-- Live Chat Card (Coming Soon) -->
          <Card
            class="shadow-lg shadow-primary/10 ring-1 ring-white/10 border-0 bg-card/50 backdrop-blur-sm opacity-75"
          >
            <CardContent class="p-6 text-center">
              <div
                class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <MessageSquare class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 class="text-lg font-semibold text-foreground mb-2">Live Chat</h3>
              <p class="text-muted-foreground text-sm mb-4">
                Real-time chat support with our team
              </p>
              <Button variant="outline" disabled class="w-full">
                Coming Soon
                <Clock class="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <!-- Coming Soon Features Section -->
        <div class="bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl p-8 text-center">
          <div
            class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Zap class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-2xl font-bold text-foreground mb-4">More Ways to Connect</h3>
          <p class="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're continuously improving our support experience. Here's what's coming soon:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center"
              >
                <MessageSquare class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span class="text-sm font-medium text-foreground">In-App Chat</span>
            </div>
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center"
              >
                <Video class="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span class="text-sm font-medium text-foreground">Video Support</span>
            </div>
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center"
              >
                <Bot class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span class="text-sm font-medium text-foreground">AI Assistant</span>
            </div>
          </div>
        </div>

        <!-- Back Navigation -->
        <div class="text-center mt-12">
          <Button variant="ghost" @click="goBack">
            <ArrowLeft class="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { useContactActions } from '@/composables/contact/useContactActions'
import {
  MessageCircle,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  ExternalLink,
  Zap,
  Video,
  Bot,
  ArrowLeft,
} from 'lucide-vue-next'

const router = useRouter()
const { openEmail, openPhone, isProcessing } = useContactActions()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/dashboard')
  }
}
</script>