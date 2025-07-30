<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <span class="text-yellow-600">💬</span>
        Feedback Components
      </CardTitle>
      <CardDescription> Alerts, notifications, and status messages </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Alerts -->
      <div class="space-y-3">
        <Alert>
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>
            This is a default alert message for general information.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <AlertTitle>Error Alert</AlertTitle>
          <AlertDescription> This is a destructive alert for error messages. </AlertDescription>
        </Alert>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
</script>
