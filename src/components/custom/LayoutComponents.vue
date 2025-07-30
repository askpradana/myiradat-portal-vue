<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <span class="text-purple-600">📦</span>
        Layout Components
      </CardTitle>
      <CardDescription> Cards and container components </CardDescription>
    </CardHeader>
    <CardContent>
      <Card>
        <CardHeader>
          <CardTitle>Nested Card Example</CardTitle>
          <CardDescription>
            This shows how cards can be nested and used for content organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Cards are perfect for grouping related content and creating visual hierarchy.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Take Action</Button>
        </CardFooter>
      </Card>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
</script>
