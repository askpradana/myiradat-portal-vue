<template>
  <div class="mt-12 pt-8 border-t border-border">
    <div class="relative">
      <!-- Background gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl"
      ></div>

      <!-- Content -->
      <div class="relative p-8 lg:p-12">
        <div class="max-w-4xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <!-- Left Content -->
            <div class="text-center lg:text-left">
              <div class="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <div class="flex items-center space-x-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-sm font-medium text-green-700 dark:text-green-400">
                    {{ formatSubscriberCount(subscriberCount) }} subscribers
                  </span>
                </div>
                <div class="text-muted-foreground text-sm">•</div>
                <span class="text-sm text-muted-foreground">Weekly insights</span>
              </div>

              <h3 class="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                Stay ahead of the curve
              </h3>
              <p class="text-muted-foreground text-base leading-relaxed">
                Get exclusive insights, product updates, and industry trends delivered to your
                inbox. Join thousands of professionals who trust IRADAT for their business
                intelligence.
              </p>
            </div>

            <!-- Right Form -->
            <div class="relative">
              <Card class="border-0 shadow-lg bg-background/80 backdrop-blur-sm">
                <CardContent class="p-6">
                  <form @submit="onSubmit" class="space-y-4">
                    <div class="relative">
                      <FormField v-slot="{ componentField }" name="email">
                        <FormItem>
                          <FormLabel class="text-sm font-medium text-foreground">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div class="relative group">
                              <Input
                                v-bind="componentField"
                                type="email"
                                placeholder="your.email@company.com"
                                class="h-12 pl-12 pr-4 text-base transition-all duration-200 group-hover:border-primary/50 focus:border-primary"
                                :disabled="isSubmitting"
                              />
                              <Mail
                                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                              />
                            </div>
                          </FormControl>
                          <FormMessage class="text-xs" />
                        </FormItem>
                      </FormField>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      :disabled="isSubmitting"
                      class="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 group"
                    >
                      <span
                        v-if="!isSubmitting && !isSuccess"
                        class="flex items-center justify-center"
                      >
                        Subscribe to Newsletter
                        <ArrowRight
                          class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                      <span v-else-if="isSubmitting" class="flex items-center justify-center">
                        <div
                          class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                        ></div>
                        Subscribing...
                      </span>
                      <span v-else class="flex items-center justify-center text-green-100">
                        <CheckCircle class="w-4 h-4 mr-2" />
                        Subscribed!
                      </span>
                    </Button>
                  </form>

                  <!-- Success Animation -->
                  <div
                    v-if="isSuccess"
                    class="absolute inset-0 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center transition-all duration-500"
                    style="z-index: 10"
                  >
                    <div class="text-center">
                      <div
                        class="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3"
                      >
                        <CheckCircle class="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <p class="text-green-800 dark:text-green-200 font-medium">
                        Welcome to our community!
                      </p>
                      <p class="text-green-600 dark:text-green-400 text-sm mt-1">
                        Check your email for confirmation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Trust indicators -->
              <div
                class="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground"
              >
                <div class="flex items-center gap-1">
                  <ShieldCheck class="w-3 h-3" />
                  <span>No spam, ever</span>
                </div>
                <div class="flex items-center gap-1">
                  <Lock class="w-3 h-3" />
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { ShieldCheck, Lock, CheckCircle, Mail, ArrowRight } from 'lucide-vue-next'
import { useNewsletterForm } from '@/composables/forms/useNewsletterForm'

// Newsletter form logic
const { onSubmit, isSubmitting, isSuccess, subscriberCount, formatSubscriberCount } =
  useNewsletterForm()
</script>