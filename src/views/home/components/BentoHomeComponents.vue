<template>
  <section id="features" class="py-24 bg-card/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Everything You Need to Succeed
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Powerful features designed to streamline your workflow and boost productivity
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Feature 1 -->
        <Card class="col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <CardTitle>Advanced Analytics</CardTitle>
            <CardDescription>
              Get deep insights into your data with powerful analytics tools and customizable
              dashboards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="aspect-video bg-muted/50 rounded-lg"></div>
          </CardContent>
        </Card>

        <!-- Feature 2 -->
        <Card>
          <CardHeader>
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <CardTitle>Enterprise Security</CardTitle>
            <CardDescription>
              Bank-level security with end-to-end encryption and compliance certifications.
            </CardDescription>
          </CardHeader>
        </Card>

        <!-- Feature 3 -->
        <Card>
          <CardHeader>
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <CardTitle>Real-time Sync</CardTitle>
            <CardDescription>
              Instant synchronization across all devices and team members.
            </CardDescription>
          </CardHeader>
        </Card>

        <!-- Feature 4 -->
        <Card>
          <CardHeader>
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <CardTitle>Team Collaboration</CardTitle>
            <CardDescription>
              Work together seamlessly with shared workspaces and permissions.
            </CardDescription>
          </CardHeader>
        </Card>

        <!-- Feature 5 -->
        <Card>
          <CardHeader>
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
            </div>
            <CardTitle>API Integration</CardTitle>
            <CardDescription>
              Connect with your favorite tools through our extensive API ecosystem.
            </CardDescription>
          </CardHeader>
        </Card>

        <!-- Feature 6 -->
        <Card class="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                />
              </svg>
            </div>
            <CardTitle>Custom Workflows</CardTitle>
            <CardDescription>
              Build automated workflows that match your business processes perfectly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-muted/30 rounded-lg">
                <h4 class="font-medium mb-2">Drag & Drop Builder</h4>
                <p class="text-sm text-muted-foreground">Create workflows without coding</p>
              </div>
              <div class="p-4 bg-muted/30 rounded-lg">
                <h4 class="font-medium mb-2">100+ Templates</h4>
                <p class="text-sm text-muted-foreground">Start with pre-built workflows</p>
              </div>
              <div class="p-4 bg-muted/30 rounded-lg">
                <h4 class="font-medium mb-2">Smart Triggers</h4>
                <p class="text-sm text-muted-foreground">Automate based on conditions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
</script>
