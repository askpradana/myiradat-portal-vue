<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <span class="text-blue-600">📝</span>
        Form Components
      </CardTitle>
      <CardDescription>
        Input fields, selects, checkboxes, and other form elements
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Input -->
      <div class="space-y-2">
        <Label for="email">Email Input</Label>
        <Input id="email" placeholder="you@example.com" />
        <p class="text-destructive text-sm">Error message example</p>
      </div>

      <!-- Select -->
      <div class="space-y-2">
        <Label for="plan">Select Dropdown</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose a plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic Plan</SelectItem>
            <SelectItem value="pro">Pro Plan</SelectItem>
            <SelectItem value="enterprise">Enterprise Plan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Textarea -->
      <div class="space-y-2">
        <Label for="message">Textarea</Label>
        <Textarea id="message" placeholder="Type your message here..." />
      </div>

      <!-- Checkbox and Switch -->
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label for="terms">Accept terms and conditions</Label>
        </div>

        <div class="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label for="airplane-mode">Airplane Mode</Label>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
</script>
