<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <span class="text-green-600">⚡</span>
        Action Components
      </CardTitle>
      <CardDescription> Buttons, toasts, and interactive elements </CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Buttons -->
      <div class="space-y-4">
        <div class="space-y-2">
          <Label class="text-sm font-medium">Button Variants</Label>
          <div class="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div class="space-y-2">
          <Label class="text-sm font-medium">Button Sizes</Label>
          <div class="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </div>

      <!-- Tooltip -->
      <div class="space-y-2">
        <Label class="text-sm font-medium">Tooltip</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline">Hover for tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a helpful tooltip message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
</script>
