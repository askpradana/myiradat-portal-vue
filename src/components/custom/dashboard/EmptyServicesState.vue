<template>
  <div class="flex flex-col items-center justify-center py-16 px-8 relative overflow-hidden">
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
      <div class="absolute bottom-20 right-20 w-40 h-40 bg-primary/8 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-primary/3 to-primary/6 rounded-full blur-3xl"></div>
    </div>

    <!-- Main Content Container -->
    <div class="relative z-10 text-center max-w-md mx-auto space-y-6">
      <!-- Custom SVG Illustration -->
      <div class="flex justify-center mb-8">
        <div class="relative">
          <!-- Background Circle -->
          <div class="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center shadow-lg">
            <!-- Lock Icon with Key -->
            <svg 
              class="w-12 h-12 text-primary/80" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="1.5" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <!-- Decorative Key -->
          <div class="absolute -top-2 -right-2 w-6 h-6 bg-primary/90 rounded-full flex items-center justify-center shadow-md transform rotate-45">
            <svg 
              class="w-3 h-3 text-primary-foreground" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a3 3 0 00-.546 5.94l2.546 5.04V20h3v-2h2v-2h2v-2h2v-2.059A3.001 3.001 0 0010 7z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Heading -->
      <div class="space-y-3">
        <h3 class="text-2xl font-semibold text-foreground leading-tight tracking-tight">
          {{ isAdmin ? 'Ready to Add Services?' : 'Unlock Your Services' }}
        </h3>
        
        <p class="text-base text-muted-foreground leading-relaxed">
          {{ isAdmin 
            ? 'Get started by adding services to your dashboard. Configure and manage services for your organization.' 
            : 'Access premium services and tools by contacting your administrator or upgrading your account to unlock powerful features.'
          }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <template v-if="isAdmin">
          <Button 
            class="group transition-all duration-200 hover:scale-105" 
            @click="handlePrimaryAction"
          >
            <Plus :size="16" class="mr-2 group-hover:rotate-90 transition-transform duration-200" />
            Add Service
          </Button>
          <Button 
            variant="outline" 
            class="transition-all duration-200 hover:scale-105"
            @click="handleSecondaryAction"
          >
            <Settings :size="16" class="mr-2" />
            Manage Settings
          </Button>
        </template>
        
        <template v-else>
          <Button 
            class="group transition-all duration-200 hover:scale-105" 
            @click="handlePrimaryAction"
          >
            <Mail :size="16" class="mr-2" />
            Contact Administrator
          </Button>
          <Button 
            variant="outline" 
            class="transition-all duration-200 hover:scale-105"
            @click="handleSecondaryAction"
          >
            <ExternalLink :size="16" class="mr-2" />
            Learn More
          </Button>
        </template>
      </div>

      <!-- Additional Info -->
      <div class="pt-6 border-t border-border/50">
        <p class="text-sm text-muted-foreground/80">
          {{ isAdmin 
            ? 'Services can be configured from the admin panel' 
            : 'Need help? Contact support for assistance with account access'
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Settings, 
  Mail, 
  ExternalLink 
} from 'lucide-vue-next'

interface Props {
  userRole?: 'admin' | 'user' | string
}

const props = withDefaults(defineProps<Props>(), {
  userRole: 'user'
})

// Computed properties
const isAdmin = computed(() => props.userRole === 'admin')

// Event handlers
const handlePrimaryAction = () => {
  if (isAdmin.value) {
    // Admin: Navigate to add service page or open add service modal
    console.log('Navigate to add service')
    // This could emit an event or use router.push('/admin/services/add')
  } else {
    // User: Open contact administrator modal or navigate to contact page
    console.log('Open contact administrator')
    // This could open a contact form modal or navigate to support page
  }
}

const handleSecondaryAction = () => {
  if (isAdmin.value) {
    // Admin: Navigate to settings or service management
    console.log('Navigate to service settings')
    // This could navigate to admin settings page
  } else {
    // User: Open external link to learn more about services
    console.log('Open learn more page')
    // This could open documentation or pricing page
  }
}
</script>

<style scoped>
/* Ensure animations respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .group-hover\:rotate-90,
  .hover\:scale-105 {
    transition: none !important;
    transform: none !important;
  }
}

/* Enhanced focus styles for accessibility */
.group:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* Smooth gradient animation for background elements */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}

.absolute.bg-primary\/5,
.absolute.bg-primary\/8 {
  animation: float 20s ease-in-out infinite;
}

.absolute.bg-primary\/5 {
  animation-delay: -5s;
}

.absolute.bg-primary\/8 {
  animation-delay: -10s;
}
</style>